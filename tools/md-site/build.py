#!/usr/bin/env python3
"""Generic markdown-folder -> browsable static HTML site generator.

Usage:
    python3 build.py <source-dir> <output-dir>
"""
import html
import json
import os
import re
import shutil
import sys

import markdown as md_lib


ACRONYM_OVERRIDES = {
    "javascript": "JavaScript",
    "graphql": "GraphQL",
    "cors": "CORS",
    "sdk": "SDK",
    "cdn": "CDN",
    "v8": "V8",
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


def convert_markdown(text):
    body = md_lib.markdown(
        text, extensions=["fenced_code", "tables", "toc", "attr_list"]
    )

    def replace_mermaid(match):
        # Deliberately NOT html.unescape()-d. A diagram label can contain
        # illustrative HTML/script-looking text (e.g. a sequence diagram
        # showing a server response of `<script src="bundle.js">`) --
        # unescaping that would inject a REAL, live <script> tag into the
        # page, which browsers then parse in raw-text mode until the next
        # literal "</script>" anywhere later in the document, silently
        # swallowing everything in between as inert script content. Kept
        # entity-escaped, this text stays safe/inert in the HTML source;
        # mermaid.js still gets the correct decoded string at runtime
        # because browsers automatically decode entities when JS reads a
        # text node's .textContent, so nothing is lost for rendering.
        raw = match.group(1).rstrip("\n")
        return f'<div class="mermaid">\n{raw}\n</div>'

    return MERMAID_FENCE_RE.sub(replace_mermaid, body)


def render_sidebar(groups, active_slug, title, link_prefix):
    parts = [f'<h2 class="brand">{html.escape(title)}</h2>']
    for category, files in groups:
        items = []
        for filename in files:
            slug = slugify(filename)
            label = title_from_filename(filename)
            current = ' aria-current="page"' if slug == active_slug else ""
            items.append(
                f'<li><a href="{link_prefix}{slug}.html"{current}>{html.escape(label)}</a></li>'
            )
        items_html = "".join(items)
        if category:
            parts.append(
                f'<details open><summary>{html.escape(category)}</summary>'
                f"<ul>{items_html}</ul></details>"
            )
        else:
            parts.append(f"<ul>{items_html}</ul>")
    return "".join(parts)


ASSETS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "assets")

PAGE_TEMPLATE = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{page_title} — {site_title}</title>
<link rel="stylesheet" href="{asset_prefix}style.css">
<link rel="stylesheet" href="{asset_prefix}highlight-theme.css">
</head>
<body>
<div class="layout">
<nav class="sidebar">{sidebar_html}</nav>
<main>{content_html}</main>
</div>
<script src="{asset_prefix}highlight.min.js"></script>
<script src="{asset_prefix}mermaid.min.js"></script>
<script>
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
</script>
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

    for filename in md_files:
        with open(
            os.path.join(source_dir, filename), "r", encoding="utf-8"
        ) as f:
            source_text = f.read()

        slug = slugify(filename)
        page_title = extract_title(
            source_text, fallback=title_from_filename(filename)
        )
        content_html = convert_markdown(source_text)
        sidebar_html = render_sidebar(
            groups, active_slug=slug, title=site_title, link_prefix=""
        )

        page = PAGE_TEMPLATE.format(
            # ADDITION (carried forward from Task 3's code review):
            # extract_title() returns raw markdown text, not HTML-escaped
            # (render_sidebar's title/category strings ARE already escaped
            # internally, but page_title/site_title here are not, since
            # they're inserted directly into <title> below). Escape both.
            page_title=html.escape(page_title),
            site_title=html.escape(site_title),
            sidebar_html=sidebar_html,
            content_html=content_html,
            asset_prefix="../assets/",
        )
        with open(
            os.path.join(notes_dir, f"{slug}.html"), "w", encoding="utf-8"
        ) as f:
            f.write(page)

    index_sidebar = render_sidebar(
        groups, active_slug=None, title=site_title, link_prefix="notes/"
    )
    index_page = PAGE_TEMPLATE.format(
        page_title=html.escape(site_title),
        site_title=html.escape(site_title),
        sidebar_html=index_sidebar,
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
