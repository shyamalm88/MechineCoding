# Theory Notes Markdown-to-Site Generator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a reusable, source-agnostic `tools/md-site/build.py` that converts any folder of `.md` files into a browsable static HTML site (sidebar + one page per note), then use it to generate `theory-notes/` from `Theory/*.md`.

**Architecture:** A single-file Python script (`tools/md-site/build.py`) with small, independently-testable pure functions (slugify, title extraction, category grouping, markdown→HTML conversion with Mermaid post-processing, sidebar rendering) composed by one `build()` function. Visual style ("Option A" — violet-accent Mintlify-style docs look) lives in a bundled `tools/md-site/assets/style.css`, copied into every generated site's `assets/` folder alongside locally-vendored `highlight.js` and `mermaid.js` (no CDN dependency, works fully offline).

**Tech Stack:** Python 3 (stdlib + the `markdown` PyPI package), `unittest`, vendored `highlight.js` 11.9.0 and `mermaid.js` 10.9.1.

**Spec:** `docs/superpowers/specs/2026-07-25-theory-notes-md-site-design.md`

---

## Design Recap (for the implementing engineer)

- `Theory/*.md` and every future source folder stay **completely untouched** — this tool only ever reads them and writes into a separate output directory.
- Per-source config is an optional `site.config.json` sitting next to the `.md` files: `{"title": "...", "categories": {"file.md": "Category Name", ...}}`. If it's missing, the tool falls back to a flat alphabetical sidebar using the folder name as the title — it must never hard-fail just because config is absent.
- If `site.config.json` **is** present but doesn't mention every `.md` file in the folder, that's a bug in the config — `build.py` must raise loudly rather than silently drop a note.
- Mermaid fences (` ```mermaid `) must render as live diagrams; the `markdown` library turns them into `<pre><code class="language-mermaid">ESCAPED_TEXT</code></pre>` — this needs to become `<div class="mermaid">RAW_TEXT</div>` for `mermaid.js` to pick it up. Verified locally: `html.unescape()` on the captured text round-trips it correctly (see Task 5).
- Every generated page's `<title>` and content `<h1>` come from the **real first `# heading` inside the markdown file itself** (all 24 `Theory/*.md` files were checked — every one starts with a top-level heading). The sidebar nav *label*, by contrast, is a short name derived from the filename (full descriptive headings would make the sidebar too wide).

---

### Task 1: Scaffolding — directories, dependency, CLI skeleton

**Files:**
- Create: `tools/md-site/requirements.txt`
- Create: `tools/md-site/build.py`
- Create: `tools/md-site/tests/test_build.py`

- [ ] **Step 1: Create the directory structure**

```bash
mkdir -p tools/md-site/tests
mkdir -p tools/md-site/assets
```

- [ ] **Step 2: Write the dependency file**

Create `tools/md-site/requirements.txt`:

```
markdown>=3.5,<4
```

- [ ] **Step 3: Install the dependency**

```bash
pip3 install -r tools/md-site/requirements.txt
```

Expected: pip reports `markdown` installed (or already satisfied).

- [ ] **Step 4: Write the failing test**

Create `tools/md-site/tests/test_build.py`:

```python
import os
import subprocess
import sys
import unittest

BUILD_SCRIPT = os.path.join(os.path.dirname(__file__), "..", "build.py")


class TestCLI(unittest.TestCase):
    def test_main_requires_two_args(self):
        result = subprocess.run(
            [sys.executable, BUILD_SCRIPT],
            capture_output=True,
            text=True,
        )
        self.assertEqual(result.returncode, 1)
        self.assertIn("Usage: build.py <source-dir> <output-dir>", result.stderr)


if __name__ == "__main__":
    unittest.main()
```

- [ ] **Step 5: Run test to verify it fails**

```bash
python3 -m unittest discover -s tools/md-site/tests -t tools/md-site -v
```

Expected: FAIL — `build.py` doesn't exist yet, subprocess returns a nonzero code from Python's own "can't find file" error rather than the assertion, so the test errors out (not just fails the assertion). Either way, red.

- [ ] **Step 6: Write minimal implementation**

Create `tools/md-site/build.py`:

```python
#!/usr/bin/env python3
"""Generic markdown-folder -> browsable static HTML site generator.

Usage:
    python3 build.py <source-dir> <output-dir>
"""
import sys


def main():
    if len(sys.argv) != 3:
        print("Usage: build.py <source-dir> <output-dir>", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
```

- [ ] **Step 7: Run test to verify it passes**

```bash
python3 -m unittest discover -s tools/md-site/tests -t tools/md-site -v
```

Expected: `Ran 1 test ... OK`

- [ ] **Step 8: Commit**

```bash
git add tools/md-site/requirements.txt tools/md-site/build.py tools/md-site/tests/test_build.py
git commit -m "Scaffold tools/md-site generator with CLI arg validation"
```

---

### Task 2: Filename helpers — `slugify` and `title_from_filename`

**Files:**
- Modify: `tools/md-site/build.py` (append)
- Modify: `tools/md-site/tests/test_build.py` (append)

- [ ] **Step 1: Write the failing tests**

Append to `tools/md-site/tests/test_build.py` (add the import at the top, and the two new test classes anywhere below the existing `TestCLI` class, before `if __name__ == "__main__":`):

```python
import build  # add this import near the top of the file, with the others
```

```python
class TestSlugify(unittest.TestCase):
    def test_slugify_simple_kebab_filename(self):
        self.assertEqual(build.slugify("javascript-core.md"), "javascript-core")

    def test_slugify_strips_spaces_and_mixed_case(self):
        self.assertEqual(
            build.slugify("MicroFrontEnd Design system.md"),
            "microfrontend-design-system",
        )


class TestTitleFromFilename(unittest.TestCase):
    def test_known_acronyms_are_cased_correctly(self):
        self.assertEqual(build.title_from_filename("javascript-sdk.md"), "JavaScript SDK")
        self.assertEqual(build.title_from_filename("cors-security.md"), "CORS Security")
        self.assertEqual(build.title_from_filename("graphql.md"), "GraphQL")
        self.assertEqual(build.title_from_filename("v8-internals.md"), "V8 Internals")

    def test_generic_kebab_filename(self):
        self.assertEqual(
            build.title_from_filename("browser-internals.md"), "Browser Internals"
        )


class TestDiscoverMdFiles(unittest.TestCase):
    def test_lists_only_md_files_sorted(self):
        import tempfile
        import os as os_module

        with tempfile.TemporaryDirectory() as tmp:
            for name in ["b.md", "a.md", "notes.txt", "site.config.json"]:
                open(os_module.path.join(tmp, name), "w").close()
            self.assertEqual(build.discover_md_files(tmp), ["a.md", "b.md"])
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
python3 -m unittest discover -s tools/md-site/tests -t tools/md-site -v
```

Expected: FAIL — `AttributeError: module 'build' has no attribute 'slugify'` (and similar for the others).

- [ ] **Step 3: Write minimal implementation**

Append to `tools/md-site/build.py` (add `import os` and `import re` to the top imports, alongside `import sys`):

```python
import os
import re
```

```python
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
    name = name.lower().replace(" ", "-")
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
    return sorted(f for f in os.listdir(source_dir) if f.endswith(".md"))
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
python3 -m unittest discover -s tools/md-site/tests -t tools/md-site -v
```

Expected: `Ran 6 tests ... OK`

- [ ] **Step 5: Commit**

```bash
git add tools/md-site/build.py tools/md-site/tests/test_build.py
git commit -m "Add slugify, title_from_filename, discover_md_files"
```

---

### Task 3: `extract_title` — real page title from the markdown's own H1

**Files:**
- Modify: `tools/md-site/build.py` (append)
- Modify: `tools/md-site/tests/test_build.py` (append)

- [ ] **Step 1: Write the failing tests**

Append to `tools/md-site/tests/test_build.py`:

```python
class TestExtractTitle(unittest.TestCase):
    def test_extracts_first_h1(self):
        text = "# JavaScript Core — Interview Reference\n\nSome intro.\n"
        self.assertEqual(
            build.extract_title(text, fallback="Fallback"),
            "JavaScript Core — Interview Reference",
        )

    def test_falls_back_when_no_h1(self):
        text = "No heading here.\n"
        self.assertEqual(build.extract_title(text, fallback="Fallback"), "Fallback")
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
python3 -m unittest discover -s tools/md-site/tests -t tools/md-site -v
```

Expected: FAIL — `AttributeError: module 'build' has no attribute 'extract_title'`

- [ ] **Step 3: Write minimal implementation**

Append to `tools/md-site/build.py`:

```python
H1_RE = re.compile(r"^#\s+(.+?)\s*$", re.M)


def extract_title(markdown_text, fallback):
    match = H1_RE.search(markdown_text)
    return match.group(1).strip() if match else fallback
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
python3 -m unittest discover -s tools/md-site/tests -t tools/md-site -v
```

Expected: `Ran 8 tests ... OK`

- [ ] **Step 5: Commit**

```bash
git add tools/md-site/build.py tools/md-site/tests/test_build.py
git commit -m "Add extract_title for real page titles from markdown H1"
```

---

### Task 4: Config-driven category grouping (with no-config fallback and missing-file error)

**Files:**
- Modify: `tools/md-site/build.py` (append)
- Modify: `tools/md-site/tests/test_build.py` (append)

- [ ] **Step 1: Write the failing tests**

Append to `tools/md-site/tests/test_build.py` (add `import json` and `import tempfile` near the top imports):

```python
import json
import tempfile
```

```python
class TestLoadConfig(unittest.TestCase):
    def test_returns_none_when_no_config_file(self):
        with tempfile.TemporaryDirectory() as tmp:
            self.assertIsNone(build.load_config(tmp))

    def test_reads_existing_config(self):
        with tempfile.TemporaryDirectory() as tmp:
            config = {"title": "Theory Notes", "categories": {"a.md": "Cat A"}}
            with open(os.path.join(tmp, "site.config.json"), "w") as f:
                json.dump(config, f)
            self.assertEqual(build.load_config(tmp), config)


class TestBuildSidebarGroups(unittest.TestCase):
    def test_groups_by_category_in_first_appearance_order(self):
        config = {
            "categories": {
                "a.md": "Group 1",
                "b.md": "Group 2",
                "c.md": "Group 1",
            }
        }
        groups = build.build_sidebar_groups(["a.md", "b.md", "c.md"], config)
        self.assertEqual(
            groups,
            [("Group 1", ["a.md", "c.md"]), ("Group 2", ["b.md"])],
        )

    def test_raises_when_file_missing_from_categories(self):
        config = {"categories": {"a.md": "Group 1"}}
        with self.assertRaises(ValueError):
            build.build_sidebar_groups(["a.md", "b.md"], config)

    def test_flat_fallback_when_no_config(self):
        groups = build.build_sidebar_groups(["b.md", "a.md"], None)
        self.assertEqual(groups, [(None, ["b.md", "a.md"])])
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
python3 -m unittest discover -s tools/md-site/tests -t tools/md-site -v
```

Expected: FAIL — `AttributeError: module 'build' has no attribute 'load_config'`

- [ ] **Step 3: Write minimal implementation**

Append to `tools/md-site/build.py` (add `import json` to the top imports):

```python
import json
```

```python
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
    missing = [f for f in md_files if f not in categories]
    if missing:
        raise ValueError(f"site.config.json is missing categories for: {missing}")

    groups = {}
    for filename in md_files:
        category = categories[filename]
        groups.setdefault(category, []).append(filename)
    return list(groups.items())
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
python3 -m unittest discover -s tools/md-site/tests -t tools/md-site -v
```

Expected: `Ran 13 tests ... OK`

- [ ] **Step 5: Commit**

```bash
git add tools/md-site/build.py tools/md-site/tests/test_build.py
git commit -m "Add config-driven category grouping with flat fallback"
```

---

### Task 5: Markdown conversion with Mermaid fence post-processing

**Files:**
- Modify: `tools/md-site/build.py` (append)
- Modify: `tools/md-site/tests/test_build.py` (append)

This is the trickiest piece. Verified manually before writing this plan: the `markdown` library (with `fenced_code` extension) turns a ` ```mermaid ` fence into
`<pre><code class="language-mermaid">ESCAPED_TEXT</code></pre>` — HTML-entity-escaped (`"` becomes `&quot;`, `>` becomes `&gt;`, etc.). `mermaid.js` needs the raw, unescaped text inside a `<div class="mermaid">...</div>` instead. `html.unescape()` correctly reverses the escaping.

- [ ] **Step 1: Write the failing tests**

Append to `tools/md-site/tests/test_build.py`:

```python
class TestConvertMarkdown(unittest.TestCase):
    def test_renders_basic_markdown(self):
        result = build.convert_markdown("**bold** text")
        self.assertIn("<strong>bold</strong>", result)

    def test_renders_tables(self):
        result = build.convert_markdown("| a | b |\n|---|---|\n| 1 | 2 |\n")
        self.assertIn("<table>", result)

    def test_rewrites_mermaid_fence_into_div(self):
        text = '```mermaid\ngraph TD\n    D["dog"] --> A["animal"]\n```\n'
        result = build.convert_markdown(text)
        self.assertNotIn("<pre>", result)
        self.assertIn('<div class="mermaid">', result)
        self.assertIn('D["dog"] --> A["animal"]', result)

    def test_leaves_plain_code_fence_as_pre(self):
        text = "```\nplain text\n```\n"
        result = build.convert_markdown(text)
        self.assertIn("<pre><code>plain text", result)

    def test_leaves_language_tagged_fence_as_pre_for_highlightjs(self):
        text = "```js\nconst x = 1;\n```\n"
        result = build.convert_markdown(text)
        self.assertIn('<pre><code class="language-js">', result)
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
python3 -m unittest discover -s tools/md-site/tests -t tools/md-site -v
```

Expected: FAIL — `AttributeError: module 'build' has no attribute 'convert_markdown'`

- [ ] **Step 3: Write minimal implementation**

Append to `tools/md-site/build.py` (add `import html` to the top imports, and `import markdown as md_lib`):

```python
import html
import markdown as md_lib
```

```python
MERMAID_FENCE_RE = re.compile(
    r'<pre><code class="language-mermaid">(.*?)</code></pre>', re.S
)


def convert_markdown(text):
    body = md_lib.markdown(
        text, extensions=["fenced_code", "tables", "toc", "attr_list"]
    )

    def replace_mermaid(match):
        raw = html.unescape(match.group(1)).rstrip("\n")
        return f'<div class="mermaid">\n{raw}\n</div>'

    return MERMAID_FENCE_RE.sub(replace_mermaid, body)
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
python3 -m unittest discover -s tools/md-site/tests -t tools/md-site -v
```

Expected: `Ran 18 tests ... OK`

- [ ] **Step 5: Commit**

```bash
git add tools/md-site/build.py tools/md-site/tests/test_build.py
git commit -m "Add convert_markdown with mermaid fence post-processing"
```

---

### Task 6: Sidebar HTML rendering

**Files:**
- Modify: `tools/md-site/build.py` (append)
- Modify: `tools/md-site/tests/test_build.py` (append)

- [ ] **Step 1: Write the failing tests**

Append to `tools/md-site/tests/test_build.py`:

```python
class TestRenderSidebar(unittest.TestCase):
    def test_renders_grouped_sidebar_with_active_link(self):
        groups = [("Group 1", ["a.md"]), ("Group 2", ["b.md"])]
        result = build.render_sidebar(
            groups, active_slug="a", title="Theory Notes", link_prefix=""
        )
        self.assertIn('<h2 class="brand">Theory Notes</h2>', result)
        self.assertIn("<summary>Group 1</summary>", result)
        self.assertIn('<a href="a.html" aria-current="page">A</a>', result)
        self.assertIn('<a href="b.html">B</a>', result)

    def test_renders_flat_sidebar_when_category_is_none(self):
        groups = [(None, ["a.md"])]
        result = build.render_sidebar(
            groups, active_slug=None, title="T", link_prefix="notes/"
        )
        self.assertNotIn("<summary>", result)
        self.assertIn('<a href="notes/a.html">A</a>', result)
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
python3 -m unittest discover -s tools/md-site/tests -t tools/md-site -v
```

Expected: FAIL — `AttributeError: module 'build' has no attribute 'render_sidebar'`

- [ ] **Step 3: Write minimal implementation**

Append to `tools/md-site/build.py`:

```python
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
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
python3 -m unittest discover -s tools/md-site/tests -t tools/md-site -v
```

Expected: `Ran 20 tests ... OK`

- [ ] **Step 5: Commit**

```bash
git add tools/md-site/build.py tools/md-site/tests/test_build.py
git commit -m "Add render_sidebar for grouped and flat sidebars"
```

---

### Task 7: Page template + `build()` + `main()` wiring (integration test)

**Files:**
- Modify: `tools/md-site/build.py` (append + update `main`)
- Modify: `tools/md-site/tests/test_build.py` (append)

`build()` takes an `assets_dir` parameter (defaulting to the real bundled `tools/md-site/assets/`) so this integration test can pass a throwaway stub directory instead of depending on the real vendored libraries — those are vendored in Task 8.

- [ ] **Step 1: Write the failing test**

Append to `tools/md-site/tests/test_build.py`:

```python
class TestBuildIntegration(unittest.TestCase):
    def test_generates_index_and_note_pages(self):
        with tempfile.TemporaryDirectory() as source_dir, \
                tempfile.TemporaryDirectory() as output_dir, \
                tempfile.TemporaryDirectory() as assets_dir:

            with open(os.path.join(source_dir, "alpha.md"), "w") as f:
                f.write("# Alpha Note\n\nHello **world**.\n")
            with open(os.path.join(source_dir, "beta.md"), "w") as f:
                f.write("# Beta Note\n\nSecond note.\n")
            with open(os.path.join(source_dir, "site.config.json"), "w") as f:
                json.dump(
                    {
                        "title": "Test Site",
                        "categories": {"alpha.md": "Group 1", "beta.md": "Group 1"},
                    },
                    f,
                )
            with open(os.path.join(assets_dir, "style.css"), "w") as f:
                f.write("/* stub */")

            build.build(source_dir, output_dir, assets_dir=assets_dir)

            index_path = os.path.join(output_dir, "index.html")
            alpha_path = os.path.join(output_dir, "notes", "alpha.html")
            beta_path = os.path.join(output_dir, "notes", "beta.html")

            self.assertTrue(os.path.exists(index_path))
            self.assertTrue(os.path.exists(alpha_path))
            self.assertTrue(os.path.exists(beta_path))
            self.assertTrue(
                os.path.exists(os.path.join(output_dir, "assets", "style.css"))
            )

            with open(alpha_path) as f:
                alpha_html = f.read()
            self.assertIn("<title>Alpha Note — Test Site</title>", alpha_html)
            self.assertIn("<strong>world</strong>", alpha_html)
            self.assertIn('href="../assets/style.css"', alpha_html)

            with open(index_path) as f:
                index_html = f.read()
            self.assertIn('href="notes/alpha.html"', index_html)
            self.assertIn("<summary>Group 1</summary>", index_html)
```

- [ ] **Step 2: Run test to verify it fails**

```bash
python3 -m unittest discover -s tools/md-site/tests -t tools/md-site -v
```

Expected: FAIL — `AttributeError: module 'build' has no attribute 'build'`

- [ ] **Step 3: Write minimal implementation**

Append to `tools/md-site/build.py` (add `import shutil` to the top imports):

```python
import shutil
```

```python
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

    notes_dir = os.path.join(output_dir, "notes")
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
            page_title=page_title,
            site_title=site_title,
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
        page_title=site_title,
        site_title=site_title,
        sidebar_html=index_sidebar,
        content_html='<p class="empty-state">Select a note from the sidebar to begin.</p>',
        asset_prefix="assets/",
    )
    with open(os.path.join(output_dir, "index.html"), "w", encoding="utf-8") as f:
        f.write(index_page)
```

Now replace the existing `main()` function (from Task 1) with this version that actually calls `build()`:

```python
def main():
    if len(sys.argv) != 3:
        print("Usage: build.py <source-dir> <output-dir>", file=sys.stderr)
        sys.exit(1)
    build(sys.argv[1], sys.argv[2])
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
python3 -m unittest discover -s tools/md-site/tests -t tools/md-site -v
```

Expected: `Ran 21 tests ... OK`

- [ ] **Step 5: Commit**

```bash
git add tools/md-site/build.py tools/md-site/tests/test_build.py
git commit -m "Wire up build() end-to-end and connect main() to it"
```

---

### Task 8: Vendor real assets — highlight.js, mermaid.js, and the Option-A stylesheet

**Files:**
- Create: `tools/md-site/assets/highlight.min.js`
- Create: `tools/md-site/assets/highlight-theme.css`
- Create: `tools/md-site/assets/mermaid.min.js`
- Create: `tools/md-site/assets/style.css`
- Modify: `tools/md-site/tests/test_build.py` (append)

These exact CDN URLs and pinned versions were verified reachable while writing this plan.

- [ ] **Step 1: Write the failing test**

Append to `tools/md-site/tests/test_build.py`:

```python
class TestBundledAssetsExist(unittest.TestCase):
    def test_required_asset_files_are_present(self):
        expected = {"style.css", "highlight.min.js", "highlight-theme.css", "mermaid.min.js"}
        actual = set(os.listdir(build.ASSETS_DIR))
        self.assertTrue(expected.issubset(actual))
```

- [ ] **Step 2: Run test to verify it fails**

```bash
python3 -m unittest discover -s tools/md-site/tests -t tools/md-site -v
```

Expected: FAIL — `tools/md-site/assets/` is empty (only exists from Task 1's `mkdir -p`), so the assertion fails.

- [ ] **Step 3: Download the vendored libraries**

```bash
curl -sL "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js" \
  -o tools/md-site/assets/highlight.min.js
curl -sL "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css" \
  -o tools/md-site/assets/highlight-theme.css
curl -sL "https://cdn.jsdelivr.net/npm/mermaid@10.9.1/dist/mermaid.min.js" \
  -o tools/md-site/assets/mermaid.min.js
```

Verify all three downloaded with real content:

```bash
wc -c tools/md-site/assets/highlight.min.js tools/md-site/assets/highlight-theme.css tools/md-site/assets/mermaid.min.js
```

Expected: three nonzero byte counts (roughly 120KB, a few KB, and ~3.3MB respectively — sizes may vary slightly between patch releases, but none should be 0).

- [ ] **Step 4: Write the production stylesheet**

Create `tools/md-site/assets/style.css` — this is the "Option A" Mintlify-style visual design, validated interactively (violet accent, dark rounded code panels, light Mermaid cards):

```css
:root {
  --bg: #fbfbfe;
  --sidebar-bg: #f8f7fc;
  --sidebar-border: #ece9f7;
  --sidebar-text: #504b6b;
  --sidebar-group: #9691b3;
  --accent: #5b3df0;
  --accent-bg: #ece9fd;
  --text: #232037;
  --text-body: #3d3959;
  --code-bg: #1e1b2e;
  --code-text: #d7d3f5;
  --inline-code-bg: #f1eefc;
  --inline-code-text: #5b3df0;
  --mermaid-card-bg: #ffffff;
  --mermaid-card-border: #ece9f7;
}

* { box-sizing: border-box; }

body {
  margin: 0;
  font-family: ui-sans-serif, -apple-system, "Segoe UI", Helvetica, Arial, sans-serif;
  background: var(--bg);
  color: var(--text-body);
}

.layout { display: flex; min-height: 100vh; }

.sidebar {
  width: 260px;
  flex-shrink: 0;
  background: var(--sidebar-bg);
  border-right: 1px solid var(--sidebar-border);
  padding: 1.25rem 1rem;
  overflow-y: auto;
}

.sidebar .brand {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text);
  margin: 0 0 1rem 0.5rem;
}

.sidebar summary {
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--sidebar-group);
  cursor: pointer;
  margin: 0.9rem 0 0.35rem 0.5rem;
  list-style: none;
}
.sidebar summary::-webkit-details-marker { display: none; }

.sidebar ul { list-style: none; margin: 0; padding: 0; }

.sidebar li a {
  display: block;
  padding: 0.4rem 0.6rem;
  border-radius: 7px;
  font-size: 0.82rem;
  color: var(--sidebar-text);
  text-decoration: none;
  margin-bottom: 2px;
}
.sidebar li a:hover { background: #f1effc; }
.sidebar li a[aria-current="page"] {
  background: var(--accent-bg);
  color: var(--accent);
  font-weight: 600;
}

main {
  flex: 1;
  padding: 2rem 3rem;
  max-width: 860px;
}

main h1 { font-size: 1.7rem; font-weight: 700; letter-spacing: -0.01em; margin-bottom: 0.9rem; color: var(--text); }
main h2 { font-size: 1.25rem; font-weight: 700; margin: 2rem 0 0.7rem; color: var(--text); }
main h3 { font-size: 1.05rem; font-weight: 700; margin: 1.5rem 0 0.5rem; color: var(--text); }
main p { font-size: 0.92rem; line-height: 1.75; margin-bottom: 1rem; }
main ul, main ol { font-size: 0.92rem; line-height: 1.75; margin-bottom: 1rem; padding-left: 1.4rem; }
main strong { color: var(--text); }

main code {
  background: var(--inline-code-bg);
  color: var(--inline-code-text);
  padding: 0.1rem 0.35rem;
  border-radius: 5px;
  font-size: 0.85rem;
}

main pre {
  background: var(--code-bg);
  border-radius: 10px;
  padding: 1rem 1.1rem;
  margin-bottom: 1.2rem;
  overflow-x: auto;
  box-shadow: 0 4px 14px rgba(91, 61, 240, 0.08);
}
main pre code {
  background: none;
  color: var(--code-text);
  padding: 0;
  font-size: 0.82rem;
  line-height: 1.6;
}

main table {
  border-collapse: collapse;
  width: 100%;
  margin-bottom: 1.2rem;
  font-size: 0.88rem;
}
main th, main td {
  border: 1px solid var(--sidebar-border);
  padding: 0.5rem 0.75rem;
  text-align: left;
}
main th { background: var(--sidebar-bg); font-weight: 600; }

main blockquote {
  border-left: 3px solid var(--accent);
  margin: 0 0 1.2rem;
  padding: 0.4rem 1rem;
  color: var(--sidebar-text);
  background: var(--accent-bg);
  border-radius: 0 8px 8px 0;
}

.mermaid {
  background: var(--mermaid-card-bg);
  border: 1px solid var(--mermaid-card-border);
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 1.2rem;
  display: flex;
  justify-content: center;
}

.empty-state {
  color: var(--sidebar-group);
  font-size: 0.95rem;
}
```

- [ ] **Step 5: Run test to verify it passes**

```bash
python3 -m unittest discover -s tools/md-site/tests -t tools/md-site -v
```

Expected: `Ran 22 tests ... OK`

- [ ] **Step 6: Commit**

```bash
git add tools/md-site/assets tools/md-site/tests/test_build.py
git commit -m "Vendor highlight.js, mermaid.js, and the Option-A stylesheet"
```

---

### Task 9: `Theory/site.config.json`, real smoke test, and generating `theory-notes/`

**Files:**
- Create: `Theory/site.config.json`
- Create: `theory-notes/README.md`
- Modify: `tools/md-site/tests/test_build.py` (append)
- Generated: `theory-notes/index.html`, `theory-notes/notes/*.html`, `theory-notes/assets/*` (via running the script, not hand-written)

- [ ] **Step 1: Write `Theory/site.config.json`**

```json
{
  "title": "Theory Notes",
  "categories": {
    "javascript-core.md": "JavaScript & Runtime",
    "v8-internals.md": "JavaScript & Runtime",

    "browser-internals.md": "Browser & Rendering",
    "browser-document-execution.md": "Browser & Rendering",
    "rendering-spectrum.md": "Browser & Rendering",
    "hydration.md": "Browser & Rendering",

    "core-web-vitals.md": "Performance",
    "web-performance.md": "Performance",
    "react-performance.md": "Performance",
    "cache.md": "Performance",
    "assets.md": "Performance",

    "state-management.md": "State & Architecture",
    "state-machines.md": "State & Architecture",
    "optimistic-updates.md": "State & Architecture",
    "monorepo.md": "State & Architecture",
    "MicroFrontEnd Design system.md": "State & Architecture",

    "network.md": "Network & Security",
    "cors-security.md": "Network & Security",
    "security.md": "Network & Security",
    "graphql.md": "Network & Security",
    "javascript-sdk.md": "Network & Security",

    "webpack.md": "Build & Observability",
    "observability.md": "Build & Observability",

    "Yotube1000cuts.md": "Case Studies"
  }
}
```

- [ ] **Step 2: Write the failing smoke test**

Append to `tools/md-site/tests/test_build.py`:

```python
class TestRealTheorySmoke(unittest.TestCase):
    def test_builds_against_real_theory_folder(self):
        repo_root = os.path.abspath(
            os.path.join(os.path.dirname(__file__), "..", "..", "..")
        )
        theory_dir = os.path.join(repo_root, "Theory")
        with tempfile.TemporaryDirectory() as output_dir:
            build.build(theory_dir, output_dir)

            self.assertTrue(os.path.exists(os.path.join(output_dir, "index.html")))
            self.assertTrue(
                os.path.exists(
                    os.path.join(output_dir, "notes", "javascript-core.html")
                )
            )
            note_count = len(
                [
                    f
                    for f in os.listdir(os.path.join(output_dir, "notes"))
                    if f.endswith(".html")
                ]
            )
            self.assertEqual(note_count, 24)
```

- [ ] **Step 3: Run the test suite**

`build()` itself was already implemented in Task 7 — this step isn't testing new code, it's validating that the real `Theory/site.config.json` you just wrote in Step 1 actually accounts for every one of the 24 real files (the `ValueError` from `build_sidebar_groups` would fire here if it didn't) and that none of the 24 real notes trips up `convert_markdown`.

```bash
python3 -m unittest discover -s tools/md-site/tests -t tools/md-site -v
```

Expected: `Ran 23 tests ... OK`. If it fails instead with `site.config.json is missing categories for: [...]`, a filename in Step 1 doesn't exactly match one in `Theory/` (check for typos/case, e.g. `MicroFrontEnd Design system.md`) — fix the config and rerun.

- [ ] **Step 4: Generate the real site**

```bash
python3 tools/md-site/build.py Theory/ theory-notes/
```

Verify the output:

```bash
ls theory-notes/notes | wc -l
ls theory-notes/assets
```

Expected: `24` note files, and `assets` containing `style.css`, `highlight.min.js`, `highlight-theme.css`, `mermaid.min.js`.

- [ ] **Step 5: Write `theory-notes/README.md`**

`````markdown
# Theory Notes — Interactive Index

A static, browsable index over `Theory/*.md` — 24 reference notes on
JavaScript internals, browser internals, performance, security, and
architecture. Grouped in the sidebar by topic.

## Browsing

Open `index.html` directly in a browser — no server, no build step. Click
any note in the left sidebar.

## Regenerating content

`index.html`, `notes/`, and `assets/` are generated output, not hand-edited.
The source of truth is `../Theory/*.md` and `../Theory/site.config.json`
(title + category grouping).

To rebuild after editing a note in `Theory/`:

```bash
python3 tools/md-site/build.py Theory/ theory-notes/
```

This same generator (`tools/md-site/`) is source-agnostic — see
`tools/md-site/README.md` for using it against other markdown folders.

## Running tests

```bash
python3 -m unittest discover -s tools/md-site/tests -t tools/md-site -v
```
`````

- [ ] **Step 6: Commit**

```bash
git add Theory/site.config.json theory-notes/ tools/md-site/tests/test_build.py
git commit -m "Generate theory-notes/ from Theory/*.md via tools/md-site"
```

---

### Task 10: Generic tool documentation and final verification

**Files:**
- Create: `tools/md-site/README.md`

- [ ] **Step 1: Write `tools/md-site/README.md`**

`````markdown
# md-site — generic markdown-to-site generator

Converts any folder of `.md` files into a browsable static HTML site: a
sidebar-navigable page per note, plus an `index.html` landing page. Used to
build `theory-notes/` from `Theory/`; written to be reusable against any
future markdown folder in this repo without modification.

## Usage

```bash
python3 tools/md-site/build.py <source-dir> <output-dir>
```

`<source-dir>` is read-only — nothing there is ever modified. `<output-dir>`
is fully overwritten on every run (safe to delete and regenerate anytime).

## Optional per-source config

Drop a `site.config.json` next to the source `.md` files to control the site
title and sidebar grouping:

```json
{
  "title": "My Notes",
  "categories": {
    "some-file.md": "Category Name",
    "another-file.md": "Category Name"
  }
}
```

Every `.md` file in the source folder must appear in `categories` — if one is
missing, `build.py` raises rather than silently dropping it from the sidebar.

If there's no `site.config.json` at all, the tool still works: it falls back
to a flat, alphabetically-sorted sidebar using the source folder's name as
the title.

## Diagrams

- ` ```mermaid ` fenced code blocks render as live diagrams (Mermaid is
  vendored in `assets/`, no network access needed).
- Plain fenced code blocks (including ASCII art) render as regular code
  panels with syntax highlighting via the vendored `highlight.js`.

## Tests

```bash
python3 -m unittest discover -s tools/md-site/tests -t tools/md-site -v
```
`````

- [ ] **Step 2: Run the full test suite one final time**

```bash
python3 -m unittest discover -s tools/md-site/tests -t tools/md-site -v
```

Expected: `Ran 23 tests ... OK`

- [ ] **Step 3: Spot-check a generated page for the diagram types**

```bash
grep -c 'class="mermaid"' theory-notes/notes/javascript-core.html
grep -c '<pre><code>' theory-notes/notes/browser-internals.html
```

Expected: both commands print a number ≥ 1 (confirms the prototype-chain Mermaid diagram and the ASCII architecture diagram both made it into their respective generated pages).

- [ ] **Step 4: Commit**

```bash
git add tools/md-site/README.md
git commit -m "Document tools/md-site generic usage"
```

---

## Manual follow-up (not automatable in this session)

Open `theory-notes/index.html` in a real browser and confirm:
- Sidebar shows the 7 category groups, collapsible, matching the approved design
- Mermaid diagrams render as actual SVG (not raw text) — this needs the browser to execute the bundled `mermaid.min.js` locally, which the automated tests can't verify
- Syntax highlighting colors show up on JS/code blocks and NOT on the plain ASCII diagrams
