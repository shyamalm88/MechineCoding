#!/usr/bin/env python3
"""Generic markdown-folder -> browsable static HTML site generator.

Usage:
    python3 build.py <source-dir> <output-dir>
"""
import hashlib
import html
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile

import markdown as md_lib


ACRONYM_OVERRIDES = {
    "javascript": "JavaScript",
    "graphql": "GraphQL",
    "cors": "CORS",
    "sdk": "SDK",
    "cdn": "CDN",
    "v8": "V8",
    "nextjs": "Next.js",
}


def slugify(filename):
    name = os.path.splitext(filename)[0]
    name = re.sub(r"[-_\s]+", "-", name.lower())
    name = re.sub(r"[^a-z0-9\-]", "", name)
    return name


def title_from_filename(filename):
    name = os.path.splitext(filename)[0]
    words = re.split(r"[-_ ]+", name)
    titled = []
    for word in words:
        override = ACRONYM_OVERRIDES.get(word.lower())
        titled.append(override if override else word[:1].upper() + word[1:])
    return " ".join(titled)


def discover_md_files(source_dir):
    return sorted(
        f
        for f in os.listdir(source_dir)
        if f.endswith(".md") and os.path.isfile(os.path.join(source_dir, f))
    )


H1_RE = re.compile(r"^#[ \t]+(\S.*?)\s*$", re.M)


def extract_title(markdown_text, fallback):
    match = H1_RE.search(markdown_text)
    return match.group(1).strip() if match else fallback


def load_config(source_dir):
    config_path = os.path.join(source_dir, "site.config.json")
    if not os.path.exists(config_path):
        return None
    with open(config_path, "r", encoding="utf-8") as f:
        return json.load(f)


def build_sidebar_groups(md_files, config):
    if not config or "categories" not in config:
        return [(None, list(md_files))]

    categories = config["categories"]
    if not isinstance(categories, dict):
        raise ValueError(f"site.config.json 'categories' must be an object, got: {categories!r}")

    missing = [f for f in md_files if f not in categories]
    if missing:
        raise ValueError(f"site.config.json is missing categories for: {missing}")

    # Group order follows first-appearance in the config's own key
    # declaration order (a hand-curated config controls sidebar category
    # order), NOT alphabetical md_files order -- those can easily differ,
    # e.g. a file whose name happens to sort first alphabetically would
    # otherwise yank its category to the top regardless of how the config
    # author ordered things. Files *within* a category still follow
    # md_files order.
    md_files_set = set(md_files)
    groups = {}
    for filename, category in categories.items():
        if filename not in md_files_set:
            continue  # extra config entry with no matching file -- ignored
        if not isinstance(category, str) or not category.strip():
            raise ValueError(
                f"site.config.json has an invalid category for {filename!r}: {category!r}"
            )
        groups.setdefault(category, [])

    for filename in md_files:
        groups[categories[filename]].append(filename)

    return list(groups.items())


MERMAID_FENCE_RE = re.compile(
    r'<pre><code class="language-mermaid">(.*?)</code></pre>', re.S | re.I
)

# Only flowchart/graph diagrams get converted to hand-drawn Excalidraw-style
# images. sequenceDiagram (and any other mermaid diagram type) keeps the
# live mermaid.js rendering path below -- the mermaid-to-excalidraw library
# has a known rendering defect where sequence-diagram message labels get an
# arrow line drawn through the text, so converting those would be a
# legibility regression rather than an improvement.
FLOWCHART_FIRST_LINE_RE = re.compile(r"^\s*(graph|flowchart)\b", re.I)

# More mermaid-to-excalidraw rendering defects found after the initial
# rollout, all specific to flowchart diagrams:
#   (1) `subgraph` clusters convert at a badly wrong scale, rendering tiny
#       in the corner of a mostly blank canvas.
#   (2) A self-loop edge (a node pointing back to itself, e.g.
#       `RS -->|reads X| RS`) gets its label smashed together with the
#       loop's own arrow, producing garbled overlapping text.
#   (3) A literal `\n` inside a node label (valid mermaid syntax for a
#       line break, e.g. `A["Line one\nLine two"]`) is not interpreted --
#       it shows up as the literal two characters `\n` in the rendered
#       label instead of a line break.
# All three are mechanically detectable and excluded below, falling back
# to the live mermaid.js path, which has always rendered them correctly.
#
# A FOURTH defect is NOT mechanically detectable and cost a full manual
# visual audit to find: when two or more labeled edges converge on (or
# pass close to) the same point in the layout -- e.g. two edges into the
# same target node, or a mutual A<->B pair -- their labels can render
# overlapping/interleaved into unreadable text, seemingly regardless of
# the diagram's graph topology (cycles and mutual pairs are extremely
# common in these diagrams and usually render fine; only some do not).
# Graph-theoretic heuristics tried during that audit (any cycle, any
# mutual 2-node pair) were both far too broad -- they flagged diagrams
# that actually render perfectly. There is no known reliable static
# predictor for this defect: after converting any new diagram, render it
# and visually check every edge label for overlapping/smashed-together
# text before trusting the cache.
#
# These six hashes were found broken by that manual audit and don't match
# any of the mechanical checks above (no subgraph, no literal self-loop,
# no `\n`), so they're excluded explicitly. Without this, render_missing_
# diagrams() would treat a missing cache entry for one of these as "needs
# re-rendering" and silently regenerate the same broken output:
#   5ecc21985e70069f  ride-booking-uber-rapido.md    8.1 (D<->E mutual pair)
#   8c52c30b04b3b887  google-docs.md                 two edges -> Redis, same label
#   99ea2993a3e8dcb2  google-docs.md                 two convergent-edge collisions
#   c5657fab65765a4c  leetcode-online-judge.md       API<->Containers mutual pair
#   d2009a14bd841fd5  payment-gateway-stripe.md      APIGW<->FraudSvc mutual pair
#   def9402170475b48  google-docs.md                 two adjacent edges near gateways
KNOWN_BROKEN_HASHES = {
    "5ecc21985e70069f",
    "8c52c30b04b3b887",
    "99ea2993a3e8dcb2",
    "c5657fab65765a4c",
    "d2009a14bd841fd5",
    "def9402170475b48",
}

SUBGRAPH_RE = re.compile(r"^\s*subgraph\b", re.I | re.M)
SELF_LOOP_RE = re.compile(
    r"^\s*(\w+)(?:\[[^\]]*\]|\([^)]*\)|\{[^}]*\})?\s*-[-.=]*>+\s*"
    r"(?:\|[^|]*\|\s*)?(\w+)\b",
    re.M,
)


def _has_self_loop(raw_mermaid_text):
    return any(
        source == target
        for source, target in SELF_LOOP_RE.findall(raw_mermaid_text)
    )


def _has_literal_backslash_n_label(raw_mermaid_text):
    return "\\n" in raw_mermaid_text

RENDERER_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "mermaid-to-excalidraw",
)
# Persistent, content-addressed cache of rendered SVGs, committed to git so
# a plain `python3 build.py ...` rebuild stays pure-Python (and fast) as
# long as no diagram's mermaid source actually changed -- Node/Playwright
# is only invoked for genuinely new/changed diagrams.
MERMAID_SVG_CACHE_DIR = os.path.join(
    os.path.dirname(os.path.abspath(__file__)), "mermaid-cache"
)


def _is_flowchart(raw_mermaid_text):
    first_line = next(
        (line for line in raw_mermaid_text.splitlines() if line.strip()), ""
    )
    return bool(FLOWCHART_FIRST_LINE_RE.match(first_line))


def _is_convertible(raw_mermaid_text):
    """Whether this diagram is eligible for the hand-drawn Excalidraw
    conversion: a flowchart, with none of the constructs known to render
    incorrectly through mermaid-to-excalidraw (see the SUBGRAPH_RE /
    SELF_LOOP_RE / _has_literal_backslash_n_label comment above). This
    catches three of the four known defect classes mechanically; the
    fourth (converging-edge label collisions) has no reliable static
    predictor, so specific hashes found broken by manual review are
    blocklisted explicitly via KNOWN_BROKEN_HASHES."""
    return (
        _is_flowchart(raw_mermaid_text)
        and not SUBGRAPH_RE.search(raw_mermaid_text)
        and not _has_self_loop(raw_mermaid_text)
        and not _has_literal_backslash_n_label(raw_mermaid_text)
        and _diagram_hash(raw_mermaid_text) not in KNOWN_BROKEN_HASHES
    )


def _diagram_hash(raw_mermaid_text):
    return hashlib.sha256(raw_mermaid_text.encode("utf-8")).hexdigest()[:16]


def collect_flowchart_diagrams(source_texts):
    """Scan raw (pre-HTML) markdown texts for ```mermaid fences eligible
    for hand-drawn conversion (see _is_convertible). Returns
    {hash: raw_mermaid_text}."""
    fence_re = re.compile(r"```mermaid\n(.*?)```", re.S)
    diagrams = {}
    for text in source_texts:
        for match in fence_re.finditer(text):
            raw = match.group(1).rstrip("\n")
            if _is_convertible(raw):
                diagrams[_diagram_hash(raw)] = raw
    return diagrams


def render_missing_diagrams(diagrams_by_hash):
    """Render any hashes in diagrams_by_hash not already present in
    MERMAID_SVG_CACHE_DIR, via the Node/Playwright renderer in
    tools/mermaid-to-excalidraw/. Failures (missing Node, a crashed
    renderer, or an individual diagram erroring) are logged and simply
    skipped -- convert_markdown() falls back to live mermaid.js rendering
    for anything not found in the cache, so a renderer problem degrades
    gracefully instead of breaking the site build."""
    os.makedirs(MERMAID_SVG_CACHE_DIR, exist_ok=True)
    missing = {
        h: text
        for h, text in diagrams_by_hash.items()
        if not os.path.exists(os.path.join(MERMAID_SVG_CACHE_DIR, f"{h}.svg"))
    }
    if not missing:
        return

    print(
        f"Rendering {len(missing)} new flowchart diagram(s) via "
        f"mermaid-to-excalidraw...",
        file=sys.stderr,
    )
    with tempfile.TemporaryDirectory() as tmp:
        input_path = os.path.join(tmp, "input.json")
        output_path = os.path.join(tmp, "output.json")
        with open(input_path, "w", encoding="utf-8") as f:
            json.dump(
                [{"id": h, "mermaid": text} for h, text in missing.items()], f
            )
        try:
            subprocess.run(
                ["node", "render.js", input_path, output_path],
                cwd=RENDERER_DIR,
                check=True,
                capture_output=True,
                text=True,
                timeout=300,
            )
        except (
            subprocess.CalledProcessError,
            subprocess.TimeoutExpired,
            FileNotFoundError,
        ) as e:
            detail = getattr(e, "stderr", "") or str(e)
            print(
                f"WARNING: mermaid-to-excalidraw render failed, falling back "
                f"to live mermaid.js for {len(missing)} new diagram(s): "
                f"{detail}",
                file=sys.stderr,
            )
            return

        with open(output_path, "r", encoding="utf-8") as f:
            results = json.load(f)

    for h, result in results.items():
        if "svg" in result:
            with open(
                os.path.join(MERMAID_SVG_CACHE_DIR, f"{h}.svg"),
                "w",
                encoding="utf-8",
            ) as f:
                f.write(result["svg"])
        else:
            print(
                f"WARNING: diagram {h} failed to convert "
                f"({result.get('error')}), falling back to live mermaid.js",
                file=sys.stderr,
            )


def convert_markdown(text, asset_prefix=""):
    body = md_lib.markdown(
        text,
        extensions=["fenced_code", "tables", "toc", "attr_list", "md_in_html"],
    )

    def replace_mermaid(match):
        # Deliberately NOT html.unescape()-d when falling back to the live
        # mermaid.js path. A diagram label can contain illustrative
        # HTML/script-looking text (e.g. a sequence diagram showing a
        # server response of `<script src="bundle.js">`) -- unescaping that
        # would inject a REAL, live <script> tag into the page, which
        # browsers then parse in raw-text mode until the next literal
        # "</script>" anywhere later in the document, silently swallowing
        # everything in between as inert script content. Kept
        # entity-escaped, this text stays safe/inert in the HTML source;
        # mermaid.js still gets the correct decoded string at runtime
        # because browsers automatically decode entities when JS reads a
        # text node's .textContent, so nothing is lost for rendering.
        raw_escaped = match.group(1).rstrip("\n")
        raw = html.unescape(raw_escaped)

        if _is_convertible(raw):
            svg_hash = _diagram_hash(raw)
            svg_path = os.path.join(MERMAID_SVG_CACHE_DIR, f"{svg_hash}.svg")
            if os.path.exists(svg_path):
                return (
                    '<figure class="diagram-figure">'
                    f'<img class="excalidraw-diagram" '
                    f'src="{asset_prefix}diagrams/{svg_hash}.svg" '
                    'alt="Architecture diagram" loading="lazy">'
                    "</figure>"
                )

        return f'<div class="mermaid">\n{raw_escaped}\n</div>'

    return MERMAID_FENCE_RE.sub(replace_mermaid, body)


def build_nav_data(groups, stars, title):
    data_groups = []
    for category, files in groups:
        items = [
            {
                "slug": slugify(filename),
                "label": title_from_filename(filename),
                "stars": stars.get(filename, 0),
            }
            for filename in files
        ]
        data_groups.append({"category": category, "items": items})
    return {"title": title, "groups": data_groups}


ASSETS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "assets")

PAGE_TEMPLATE = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{page_title} — {site_title}</title>
<link rel="stylesheet" href="{asset_prefix}style.css">
<link rel="stylesheet" href="{asset_prefix}highlight-theme.css">
<script src="{asset_prefix}sidebar.js" defer></script>
<script src="{asset_prefix}highlight.min.js" defer></script>
<script src="{asset_prefix}mermaid.min.js" defer></script>
<script src="{asset_prefix}diagram-lightbox.js" defer></script>
<script defer>
document.addEventListener('DOMContentLoaded', function () {{
  hljs.configure({{ cssSelector: 'pre code[class^="language-"]' }});
  hljs.highlightAll();
  mermaid.initialize({{
    startOnLoad: true,
    theme: 'base',
    themeVariables: {{
      primaryColor: '#ece9fd',
      primaryBorderColor: '#5b3df0',
      primaryTextColor: '#232037',
      lineColor: '#5b3df0',
      fontFamily: 'ui-sans-serif, -apple-system, sans-serif',
      fontSize: '13px'
    }}
  }});
}});
</script>
</head>
<body>
<div class="layout">
<nav class="sidebar" id="sidebar"></nav>
<main>{content_html}</main>
</div>
</body>
</html>
"""


def build(source_dir, output_dir, assets_dir=ASSETS_DIR):
    source_dir = os.path.abspath(source_dir)
    output_dir = os.path.abspath(output_dir)

    config = load_config(source_dir)
    site_title = (config or {}).get("title") or os.path.basename(
        source_dir.rstrip(os.sep)
    )
    md_files = discover_md_files(source_dir)
    groups = build_sidebar_groups(md_files, config)
    stars = (config or {}).get("stars") or {}

    # ADDITION (carried forward from Task 2's code review): slugify()
    # lowercases, so distinct filenames like "a.md" and "A.md" can
    # collide on the same output slug. Since the slug becomes the output
    # filename below, an undetected collision would silently let one
    # file's page overwrite the other's. Fail loudly instead.
    seen_slugs = {}
    for filename in md_files:
        slug = slugify(filename)
        if slug in seen_slugs:
            raise ValueError(
                f"Slug collision: {filename!r} and {seen_slugs[slug]!r} "
                f"both produce the slug {slug!r}"
            )
        seen_slugs[slug] = filename

    # Read every source file once up front: collect_flowchart_diagrams()
    # needs the raw text of all files before any HTML is generated (so a
    # diagram reused verbatim across two files is only rendered once), and
    # the per-file loop below reuses these same strings instead of
    # re-reading from disk.
    source_texts = {}
    for filename in md_files:
        with open(
            os.path.join(source_dir, filename), "r", encoding="utf-8"
        ) as f:
            source_texts[filename] = f.read()

    flowchart_diagrams = collect_flowchart_diagrams(source_texts.values())
    render_missing_diagrams(flowchart_diagrams)

    # Wipe the generated subdirectories up front so reruns can't leave
    # stale pages behind (e.g. a note renamed or deleted in source_dir
    # must not leave its old notes/<slug>.html sitting around). Scoped to
    # notes/ and assets/ specifically -- NOT the whole output_dir --
    # because a hand-authored file may legitimately live alongside the
    # generated output in the same directory (e.g. theory-notes/README.md)
    # and must survive a rebuild.
    notes_dir = os.path.join(output_dir, "notes")
    if os.path.exists(notes_dir):
        shutil.rmtree(notes_dir)
    os.makedirs(notes_dir, exist_ok=True)

    assets_out = os.path.join(output_dir, "assets")
    if os.path.exists(assets_out):
        shutil.rmtree(assets_out)
    shutil.copytree(assets_dir, assets_out)

    # Copy every cached hand-drawn diagram SVG into this site's assets/
    # output (content-addressed by hash, so unused entries from other
    # docs/sites just sit there harmlessly -- simpler than tracking exactly
    # which hashes this particular build actually references).
    diagrams_out = os.path.join(assets_out, "diagrams")
    os.makedirs(diagrams_out, exist_ok=True)
    if os.path.isdir(MERMAID_SVG_CACHE_DIR):
        for svg_filename in os.listdir(MERMAID_SVG_CACHE_DIR):
            if svg_filename.endswith(".svg"):
                shutil.copy2(
                    os.path.join(MERMAID_SVG_CACHE_DIR, svg_filename),
                    os.path.join(diagrams_out, svg_filename),
                )

    # The sidebar is shared across every page and built client-side (see
    # assets/sidebar.js) from this single JSON file, instead of being
    # rendered inline into each page -- so adding/removing/re-categorizing
    # a note only touches this one file, not every generated page.
    nav_data = build_nav_data(groups, stars, site_title)
    with open(os.path.join(assets_out, "nav.json"), "w", encoding="utf-8") as f:
        json.dump(nav_data, f, ensure_ascii=False, indent=2)

    for filename in md_files:
        source_text = source_texts[filename]

        slug = slugify(filename)
        page_title = extract_title(
            source_text, fallback=title_from_filename(filename)
        )
        content_html = convert_markdown(source_text, asset_prefix="../assets/")

        page = PAGE_TEMPLATE.format(
            # ADDITION (carried forward from Task 3's code review):
            # extract_title() returns raw markdown text, not HTML-escaped.
            # site_title is inserted directly into <title> below, so also
            # escape it (nav.json above carries the unescaped version).
            page_title=html.escape(page_title),
            site_title=html.escape(site_title),
            content_html=content_html,
            asset_prefix="../assets/",
        )
        with open(
            os.path.join(notes_dir, f"{slug}.html"), "w", encoding="utf-8"
        ) as f:
            f.write(page)

    index_page = PAGE_TEMPLATE.format(
        page_title=html.escape(site_title),
        site_title=html.escape(site_title),
        content_html='<p class="empty-state">Select a note from the sidebar to begin.</p>',
        asset_prefix="assets/",
    )
    with open(os.path.join(output_dir, "index.html"), "w", encoding="utf-8") as f:
        f.write(index_page)


def main():
    if len(sys.argv) != 3:
        print("Usage: build.py <source-dir> <output-dir>", file=sys.stderr)
        sys.exit(1)
    build(sys.argv[1], sys.argv[2])


if __name__ == "__main__":
    main()
