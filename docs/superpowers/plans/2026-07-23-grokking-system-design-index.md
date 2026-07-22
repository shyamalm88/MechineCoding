# Grokking System Design Interactive Index Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static, browsable, two-section (Fundamentals / Case Studies) HTML site under `grokking-system-design/` that links all 40 chapters of the exported "Grokking Modern System Design Interview" course, generated from the messy browser-saved source files in `~/Downloads/Grokking Modern System Design Interview for Engineers & Managers/`.

**Architecture:** A small Python 3 standard-library-only pipeline (`grokking-system-design/scripts/`) extracts each lesson's content div, decodes embedded diagram SVGs out to separate files, strips tracking/UI chrome, and rebuilds each element with an attribute allowlist. `build.py` orchestrates this per chapter, wrapping the cleaned lessons in a shared page template with a generated sidebar (native `<details>`/`<summary>`, no JS). Output is a fully static multi-page site — open `index.html` and click through.

**Tech Stack:** Python 3 stdlib only (`re`, `base64`, `html.parser`, `pathlib`), `unittest` for tests, hand-written CSS, no build step, no server required.

**Spec:** `docs/superpowers/specs/2026-07-23-grokking-system-design-index-design.md`

**Important — no git commits in this plan.** The user explicitly asked not to commit anything while this repo has unrelated pre-existing staged changes sitting in the index, and because the generated `diagrams/` output is ~377MB (measured — see Task 11 background) which needs its own git decision later. **Do not run `git add` or `git commit` at any point while executing this plan.** Every task ends with a verification step (run tests / inspect output) instead of a commit step. Committing is a separate decision the user will make explicitly afterward.

---

## Validated facts (from prototyping against the real course export)

These were measured directly against all 175 real lesson `.html` files in the source folder before writing this plan, so the code below is proven, not speculative:

- Every lesson page has a stable content container: `<div id="view-collection-article-content-root">`.
- Diagrams are embedded as `<object data="data:image/svg+xml;base64,...">` — decoding all 426 of them across the course produces exactly correct, non-corrupt SVG files (some contain large embedded PNG screenshots — that's why total diagram size is large, not a bug).
- Running extraction across all 175 real files produces **zero exceptions**.
- Raw source: 979MB total → cleaned HTML output: 2.1MB total → diagrams: 377MB total across 426 files (largest single file 7.3MB, well under GitHub's 100MB/file limit).
- 31 of 175 lessons have no diagrams (quizzes, intros) — this is expected, not an extraction failure.
- Chapter folder names (`"11. Content Delivery Network  (CDN)"`) and lesson filenames (`"5. Quiz on the Rate Limiter’s Design.html"`) all parse correctly with the regex in Task 6, including double spaces, en-dashes, and curly apostrophes.

---

### Task 1: Project scaffolding

**Files:**

- Create: `grokking-system-design/assets/style.css`
- Create: `grokking-system-design/README.md`
- Create: `grokking-system-design/scripts/__init__.py` (empty)
- Create: `grokking-system-design/scripts/tests/__init__.py` (empty)

- [ ] **Step 1: Create the directory skeleton**

```bash
mkdir -p "/Volumes/Personal/MechineCoding/grokking-system-design/assets"
mkdir -p "/Volumes/Personal/MechineCoding/grokking-system-design/scripts/tests"
mkdir -p "/Volumes/Personal/MechineCoding/grokking-system-design/chapters"
mkdir -p "/Volumes/Personal/MechineCoding/grokking-system-design/diagrams"
touch "/Volumes/Personal/MechineCoding/grokking-system-design/scripts/__init__.py"
touch "/Volumes/Personal/MechineCoding/grokking-system-design/scripts/tests/__init__.py"
```

- [ ] **Step 2: Write the stylesheet**

Create `grokking-system-design/assets/style.css`:

```css
:root {
  color-scheme: light dark;
  --bg: #ffffff;
  --fg: #1a1a1a;
  --muted: #666666;
  --border: #e0e0e0;
  --accent: #2563eb;
  --code-bg: #f5f5f5;
  --sidebar-bg: #fafafa;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #14161a;
    --fg: #e8e8e8;
    --muted: #9a9a9a;
    --border: #2a2d33;
    --accent: #6ea8fe;
    --code-bg: #1e2126;
    --sidebar-bg: #191b1f;
  }
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
  background: var(--bg);
  color: var(--fg);
  line-height: 1.6;
}

.layout {
  display: flex;
  min-height: 100vh;
  align-items: flex-start;
}

nav.sidebar {
  width: 300px;
  flex-shrink: 0;
  background: var(--sidebar-bg);
  border-right: 1px solid var(--border);
  padding: 1rem 0.75rem;
  position: sticky;
  top: 0;
  max-height: 100vh;
  overflow-y: auto;
}

nav.sidebar h2.brand {
  font-size: 0.95rem;
  margin: 0 0 0.75rem 0.25rem;
}

nav.sidebar details {
  margin-bottom: 0.5rem;
}

nav.sidebar summary {
  cursor: pointer;
  font-weight: 600;
  padding: 0.4rem 0.25rem;
  border-radius: 4px;
}

nav.sidebar summary:hover {
  background: var(--code-bg);
}

nav.sidebar ul {
  list-style: none;
  margin: 0.25rem 0 0 0;
  padding: 0;
}

nav.sidebar li a {
  display: block;
  padding: 0.35rem 0.5rem 0.35rem 1rem;
  color: var(--fg);
  text-decoration: none;
  border-radius: 4px;
  font-size: 0.92rem;
}

nav.sidebar li a:hover {
  background: var(--code-bg);
}

nav.sidebar li a[aria-current="page"] {
  background: var(--accent);
  color: #fff;
}

main {
  flex: 1;
  min-width: 0;
  max-width: 860px;
  margin: 0 auto;
  padding: 2rem 2.5rem 4rem;
}

main h1 {
  font-size: 1.8rem;
  margin-top: 0;
}
main h2 {
  font-size: 1.35rem;
  margin-top: 2.5rem;
  border-bottom: 1px solid var(--border);
  padding-bottom: 0.3rem;
}

section.lesson {
  margin-bottom: 2rem;
}
section.lesson + section.lesson {
  border-top: 1px solid var(--border);
  padding-top: 1rem;
}

img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 1rem 0;
}

pre,
code {
  background: var(--code-bg);
  border-radius: 4px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}

code {
  padding: 0.15em 0.4em;
  font-size: 0.9em;
}
pre {
  padding: 1rem;
  overflow-x: auto;
}
pre code {
  padding: 0;
  background: none;
}

table {
  border-collapse: collapse;
  width: 100%;
  margin: 1rem 0;
}
th,
td {
  border: 1px solid var(--border);
  padding: 0.5rem 0.75rem;
  text-align: left;
}

a {
  color: var(--accent);
}
blockquote {
  border-left: 3px solid var(--accent);
  margin: 1rem 0;
  padding: 0.25rem 1rem;
  color: var(--muted);
}
```

- [ ] **Step 3: Write the README**

Create `grokking-system-design/README.md`:

```markdown
# Grokking System Design — Interactive Index

A static, browsable index over the exported "Grokking Modern System Design
Interview for Engineers & Managers" course. Split into two sidebar sections:
Fundamentals (chapters 1–25) and Case Studies (chapters 26–40).

## Browsing

Open `index.html` directly in a browser — no server, no build step. Click
any chapter in the left sidebar.

## Regenerating content

The `chapters/` and `diagrams/` folders are generated output, not hand-edited.
To rebuild them from the source course export:

\`\`\`bash
python3 scripts/build.py
\`\`\`

By default this reads from
`~/Downloads/Grokking Modern System Design Interview for Engineers & Managers/`
and writes into this folder. Pass explicit paths to override:

\`\`\`bash
python3 scripts/build.py /path/to/source /path/to/output
\`\`\`

## Running tests

\`\`\`bash
python3 -m unittest discover -s scripts/tests -t scripts -v
\`\`\`

## Design

See `docs/superpowers/specs/2026-07-23-grokking-system-design-index-design.md`
for the full design rationale.
```

- [ ] **Step 4: Verify scaffolding**

Run: `find "/Volumes/Personal/MechineCoding/grokking-system-design" -type f`
Expected: lists `assets/style.css`, `README.md`, `scripts/__init__.py`, `scripts/tests/__init__.py`.

---

### Task 2: `extract_content_fragment`

**Files:**

- Create: `grokking-system-design/scripts/extractor.py`
- Test: `grokking-system-design/scripts/tests/test_extractor.py`

- [ ] **Step 1: Write the failing test**

Create `grokking-system-design/scripts/tests/test_extractor.py`:

```python
import unittest
from extractor import extract_content_fragment


class TestExtractContentFragment(unittest.TestCase):
    def test_extracts_only_the_marked_container(self):
        page = (
            '<html><body>'
            '<nav>site nav junk, not real content</nav>'
            '<div class="outer">'
            '<div id="view-collection-article-content-root" class="root">'
            '<div><h1>Title</h1><p>Hello world.</p></div>'
            '</div>'
            '</div>'
            '</body></html>'
        )
        fragment = extract_content_fragment(page)
        self.assertIn('<h1>Title</h1>', fragment)
        self.assertIn('<p>Hello world.</p>', fragment)
        self.assertNotIn('site nav junk', fragment)
        self.assertTrue(fragment.startswith('<div id="view-collection-article-content-root"'))
        self.assertTrue(fragment.endswith('</div>'))

    def test_raises_when_marker_missing(self):
        with self.assertRaises(ValueError):
            extract_content_fragment('<html><body><p>no marker here</p></body></html>')


if __name__ == '__main__':
    unittest.main()
```

- [ ] **Step 2: Run it to verify it fails**

Run: `cd "/Volumes/Personal/MechineCoding/grokking-system-design/scripts" && python3 -m unittest tests.test_extractor -v`
Expected: `ModuleNotFoundError: No module named 'extractor'` (module doesn't exist yet).

- [ ] **Step 3: Write the implementation**

Create `grokking-system-design/scripts/extractor.py`:

```python
"""Extracts and cleans lesson content from Google's browser-saved HTML pages."""
import re
import base64
import html as html_mod
from pathlib import Path
from html.parser import HTMLParser

MARKER = 'view-collection-article-content-root'


def extract_content_fragment(page_html: str) -> str:
    """Return the HTML of the div with id=view-collection-article-content-root.

    Uses tag-depth balancing rather than a regex-only match because the
    container has arbitrarily nested child divs.
    """
    marker_idx = page_html.find(MARKER)
    if marker_idx == -1:
        raise ValueError('content marker not found')
    div_start = page_html.rfind('<div', 0, marker_idx)
    if div_start == -1:
        raise ValueError('no enclosing div for marker')
    tag_re = re.compile(r'<div\b|</div>', re.IGNORECASE)
    depth = 0
    pos = div_start
    while True:
        m = tag_re.search(page_html, pos)
        if not m:
            raise ValueError('unbalanced divs while scanning for content end')
        depth += 1 if m.group().lower() == '<div' else -1
        pos = m.end()
        if depth == 0:
            return page_html[div_start:pos]
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd "/Volumes/Personal/MechineCoding/grokking-system-design/scripts" && python3 -m unittest tests.test_extractor -v`
Expected: `OK` (2 tests pass).

---

### Task 3: `decode_diagrams`

**Files:**

- Modify: `grokking-system-design/scripts/extractor.py`
- Modify: `grokking-system-design/scripts/tests/test_extractor.py`

- [ ] **Step 1: Write the failing test**

Add to `test_extractor.py`:

```python
import base64
import tempfile
from pathlib import Path
from extractor import decode_diagrams


class TestDecodeDiagrams(unittest.TestCase):
    def test_decodes_object_to_svg_file_and_img_tag(self):
        svg_bytes = b'<svg xmlns="http://www.w3.org/2000/svg"><rect width="1" height="1"/></svg>'
        b64 = base64.b64encode(svg_bytes).decode()
        fragment = (
            f'<div><object type="image/svg+xml" data="data:image/svg+xml;base64,{b64}">'
            '</object></div>'
            '<div class="caption-wrap"><span data-testid="caption-text" class="x">My Diagram</span></div>'
        )
        with tempfile.TemporaryDirectory() as tmp:
            diagrams_dir = Path(tmp) / 'rate-limiter'
            result = decode_diagrams(fragment, diagrams_dir, 'lesson-1')

            written = list(diagrams_dir.glob('*.svg'))
            self.assertEqual(len(written), 1)
            self.assertEqual(written[0].read_bytes(), svg_bytes)
            self.assertIn(f'<img src="../diagrams/rate-limiter/{written[0].name}" alt="My Diagram">', result)
            self.assertNotIn('<object', result)

    def test_no_caption_within_range_gives_empty_alt(self):
        svg_bytes = b'<svg xmlns="http://www.w3.org/2000/svg"></svg>'
        b64 = base64.b64encode(svg_bytes).decode()
        fragment = f'<object data="data:image/svg+xml;base64,{b64}"></object>' + ('x' * 4000)
        with tempfile.TemporaryDirectory() as tmp:
            result = decode_diagrams(fragment, Path(tmp) / 'ch', 'lesson-1')
            self.assertIn('alt=""', result)
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd "/Volumes/Personal/MechineCoding/grokking-system-design/scripts" && python3 -m unittest tests.test_extractor -v`
Expected: `ImportError: cannot import name 'decode_diagrams'`.

- [ ] **Step 3: Implement it**

Append to `extractor.py`:

```python
OBJECT_RE = re.compile(
    r'<object\b[^>]*\bdata="data:image/svg\+xml;base64,([A-Za-z0-9+/=]+)"[^>]*>.*?</object>',
    re.IGNORECASE | re.DOTALL,
)
CAPTION_RE = re.compile(r'data-testid="caption-text"[^>]*>([^<]*)<')
CAPTION_LOOKAHEAD_CHARS = 3000


def decode_diagrams(fragment: str, diagrams_dir: Path, slug_prefix: str) -> str:
    """Replace embedded base64 SVG <object> diagrams with <img> tags pointing
    at decoded standalone .svg files under diagrams_dir. Diagrams that have
    a data-testid="caption-text" span shortly after them get that text as
    the alt attribute; otherwise alt is empty.
    """
    diagrams_dir.mkdir(parents=True, exist_ok=True)
    counter = [0]

    def repl(m: re.Match) -> str:
        counter[0] += 1
        n = counter[0]
        svg_bytes = base64.b64decode(m.group(1))
        out_path = diagrams_dir / f'{slug_prefix}-fig-{n}.svg'
        out_path.write_bytes(svg_bytes)

        lookahead = fragment[m.end():m.end() + CAPTION_LOOKAHEAD_CHARS]
        cap_m = CAPTION_RE.search(lookahead)
        alt = html_mod.unescape(cap_m.group(1)).strip() if cap_m else ''
        alt_escaped = html_mod.escape(alt, quote=True)

        rel_path = f'../diagrams/{diagrams_dir.name}/{out_path.name}'
        return f'<img src="{rel_path}" alt="{alt_escaped}">'

    return OBJECT_RE.sub(repl, fragment)
```

- [ ] **Step 4: Run to verify it passes**

Run: `cd "/Volumes/Personal/MechineCoding/grokking-system-design/scripts" && python3 -m unittest tests.test_extractor -v`
Expected: `OK` (4 tests pass).

---

### Task 4: `strip_noise`

**Files:**

- Modify: `grokking-system-design/scripts/extractor.py`
- Modify: `grokking-system-design/scripts/tests/test_extractor.py`

- [ ] **Step 1: Write the failing test**

Add to `test_extractor.py`:

```python
from extractor import strip_noise


class TestStripNoise(unittest.TestCase):
    def test_removes_scripts_styles_buttons_icons_and_tracking_pixels(self):
        fragment = (
            '<div>'
            '<script>alert(1)</script>'
            '<style>.x{color:red}</style>'
            '<button aria-label="Zoom image">zoom</button>'
            '<svg viewBox="0 0 10 10"><path d="M0 0"/></svg>'
            '<img src="data:image/gif;base64,AA" alt="" role="presentation">'
            '<p>Real content stays.</p>'
            '</div>'
        )
        result = strip_noise(fragment)
        self.assertNotIn('<script', result)
        self.assertNotIn('<style', result)
        self.assertNotIn('<button', result)
        self.assertNotIn('<svg', result)
        self.assertNotIn('role="presentation"', result)
        self.assertIn('<p>Real content stays.</p>', result)

    def test_keeps_content_images_with_real_alt_text(self):
        fragment = '<img src="../diagrams/x/lesson-1-fig-1.svg" alt="My Diagram">'
        result = strip_noise(fragment)
        self.assertIn('lesson-1-fig-1.svg', result)
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd "/Volumes/Personal/MechineCoding/grokking-system-design/scripts" && python3 -m unittest tests.test_extractor -v`
Expected: `ImportError: cannot import name 'strip_noise'`.

- [ ] **Step 3: Implement it**

Append to `extractor.py`:

```python
NOISE_BLOCK_RE = re.compile(
    r'<(script|style|button|svg)\b[^>]*>.*?</\1>', re.IGNORECASE | re.DOTALL
)
TRACKING_IMG_RE = re.compile(
    r'<img\b(?=[^>]*\brole="presentation")(?=[^>]*\balt="")[^>]*>', re.IGNORECASE
)


def strip_noise(fragment: str) -> str:
    """Remove scripts, styles, UI buttons, decorative icon SVGs, and
    tracking-pixel <img> tags. Must run after decode_diagrams (which needs
    the original <object> markup intact) and before simplify_attributes
    (which needs the role="presentation" attribute still present to spot
    tracking pixels).
    """
    fragment = TRACKING_IMG_RE.sub('', fragment)
    fragment = NOISE_BLOCK_RE.sub('', fragment)
    return fragment
```

- [ ] **Step 4: Run to verify it passes**

Run: `cd "/Volumes/Personal/MechineCoding/grokking-system-design/scripts" && python3 -m unittest tests.test_extractor -v`
Expected: `OK` (6 tests pass).

---

### Task 5: `simplify_attributes`

**Files:**

- Modify: `grokking-system-design/scripts/extractor.py`
- Modify: `grokking-system-design/scripts/tests/test_extractor.py`

- [ ] **Step 1: Write the failing test**

Add to `test_extractor.py`:

```python
from extractor import simplify_attributes


class TestSimplifyAttributes(unittest.TestCase):
    def test_drops_class_style_and_data_attributes(self):
        fragment = '<p class="foo" style="color:red" data-id="x">Hello <strong data-x="1">World</strong></p>'
        result = simplify_attributes(fragment)
        self.assertEqual(result, '<p>Hello <strong>World</strong></p>')

    def test_keeps_only_href_on_anchors(self):
        fragment = '<a href="https://example.com" class="link" target="_blank">click</a>'
        result = simplify_attributes(fragment)
        self.assertEqual(result, '<a href="https://example.com">click</a>')

    def test_keeps_only_src_and_alt_on_images_and_closes_void_tag_cleanly(self):
        fragment = '<img src="a.svg" alt="cap" role="presentation" style="width:1px">'
        result = simplify_attributes(fragment)
        self.assertEqual(result, '<img src="a.svg" alt="cap">')

    def test_keeps_colspan_rowspan_on_table_cells(self):
        fragment = '<table><tr><td colspan="2" class="x">A</td></tr></table>'
        result = simplify_attributes(fragment)
        self.assertEqual(result, '<table><tr><td colspan="2">A</td></tr></table>')

    def test_escapes_text_content(self):
        fragment = '<p>Rate &lt; Limit &amp; Quota</p>'
        result = simplify_attributes(fragment)
        self.assertEqual(result, '<p>Rate &lt; Limit &amp; Quota</p>')
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd "/Volumes/Personal/MechineCoding/grokking-system-design/scripts" && python3 -m unittest tests.test_extractor -v`
Expected: `ImportError: cannot import name 'simplify_attributes'`.

- [ ] **Step 3: Implement it**

Append to `extractor.py`:

```python
VOID_TAGS = {'img', 'br', 'hr'}
ATTR_ALLOWLIST = {
    'a': {'href'},
    'img': {'src', 'alt'},
    'td': {'colspan', 'rowspan'},
    'th': {'colspan', 'rowspan'},
}


class _AttributeSimplifier(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.out = []

    def _render_start(self, tag, attrs):
        allowed = ATTR_ALLOWLIST.get(tag, set())
        kept = [(k, v) for k, v in attrs if k in allowed and v is not None]
        attr_str = ''.join(f' {k}="{html_mod.escape(v, quote=True)}"' for k, v in kept)
        return f'<{tag}{attr_str}>'

    def handle_starttag(self, tag, attrs):
        self.out.append(self._render_start(tag, attrs))

    def handle_startendtag(self, tag, attrs):
        self.out.append(self._render_start(tag, attrs))

    def handle_endtag(self, tag):
        if tag not in VOID_TAGS:
            self.out.append(f'</{tag}>')

    def handle_data(self, data):
        self.out.append(html_mod.escape(data))


def simplify_attributes(fragment: str) -> str:
    """Rebuild the fragment keeping only a small per-tag attribute allowlist.
    Drops all Tailwind/CSS-in-JS class names, data-* attributes, inline
    styles, and ids, since no original stylesheet ships with the output.
    Must run last, after decode_diagrams and strip_noise.
    """
    parser = _AttributeSimplifier()
    parser.feed(fragment)
    parser.close()
    return ''.join(parser.out)
```

- [ ] **Step 4: Run to verify it passes**

Run: `cd "/Volumes/Personal/MechineCoding/grokking-system-design/scripts" && python3 -m unittest tests.test_extractor -v`
Expected: `OK` (11 tests pass).

---

### Task 6: `parse_numbered_name` and `slugify`

**Files:**

- Create: `grokking-system-design/scripts/sitegen.py`
- Create: `grokking-system-design/scripts/tests/test_sitegen.py`

- [ ] **Step 1: Write the failing test**

Create `grokking-system-design/scripts/tests/test_sitegen.py`:

```python
import unittest
from sitegen import parse_numbered_name, slugify


class TestParseNumberedName(unittest.TestCase):
    def test_parses_simple_name(self):
        self.assertEqual(parse_numbered_name('19. Rate Limiter'), (19, 'Rate Limiter'))

    def test_parses_double_space_and_parens(self):
        self.assertEqual(
            parse_numbered_name('11. Content Delivery Network  (CDN)'),
            (11, 'Content Delivery Network  (CDN)'),
        )

    def test_parses_dash_titles(self):
        self.assertEqual(
            parse_numbered_name('29. Design a Proximity Service - Yelp'),
            (29, 'Design a Proximity Service - Yelp'),
        )

    def test_parses_curly_apostrophe_lesson_stem(self):
        self.assertEqual(
            parse_numbered_name('5. Quiz on the Rate Limiter’s Design'),
            (5, 'Quiz on the Rate Limiter’s Design'),
        )

    def test_rejects_non_numbered_entries(self):
        with self.assertRaises(ValueError):
            parse_numbered_name('_README')
        with self.assertRaises(ValueError):
            parse_numbered_name('.DS_Store')


class TestSlugify(unittest.TestCase):
    def test_basic(self):
        self.assertEqual(slugify('Rate Limiter'), 'rate-limiter')

    def test_strips_punctuation_and_collapses_spaces(self):
        self.assertEqual(slugify('Content Delivery Network  (CDN)'), 'content-delivery-network-cdn')

    def test_strips_curly_apostrophe(self):
        self.assertEqual(slugify('Quiz on the Rate Limiter’s Design'), 'quiz-on-the-rate-limiters-design')


if __name__ == '__main__':
    unittest.main()
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd "/Volumes/Personal/MechineCoding/grokking-system-design/scripts" && python3 -m unittest tests.test_sitegen -v`
Expected: `ModuleNotFoundError: No module named 'sitegen'`.

- [ ] **Step 3: Implement it**

Create `grokking-system-design/scripts/sitegen.py`:

```python
"""Builds the static site shell: sidebar, chapter pages, and the index page."""
import re
import html as html_mod
from collections import namedtuple

Chapter = namedtuple('Chapter', ['num', 'title', 'slug', 'section'])

NUMBERED_NAME_RE = re.compile(r'^(\d+)\.\s+(.*?)\s*$')


def parse_numbered_name(name: str):
    """Parse 'NN. Title' into (NN, 'Title'). Raises ValueError for anything
    else (e.g. '_README', '.DS_Store') so callers can skip non-lesson entries.
    """
    m = NUMBERED_NAME_RE.match(name)
    if not m:
        raise ValueError(f'not a numbered entry: {name!r}')
    return int(m.group(1)), m.group(2)


def slugify(title: str) -> str:
    s = title.lower()
    s = re.sub(r'[^a-z0-9]+', '-', s)
    return s.strip('-')
```

- [ ] **Step 4: Run to verify it passes**

Run: `cd "/Volumes/Personal/MechineCoding/grokking-system-design/scripts" && python3 -m unittest tests.test_sitegen -v`
Expected: `OK` (8 tests pass).

---

### Task 7: `build_sidebar_html`

**Files:**

- Modify: `grokking-system-design/scripts/sitegen.py`
- Modify: `grokking-system-design/scripts/tests/test_sitegen.py`

- [ ] **Step 1: Write the failing test**

Add to `test_sitegen.py`:

```python
from sitegen import Chapter, build_sidebar_html


class TestBuildSidebarHtml(unittest.TestCase):
    def setUp(self):
        self.chapters = [
            Chapter(num=19, title='Rate Limiter', slug='rate-limiter', section='fundamentals'),
            Chapter(num=30, title='Design Uber', slug='design-uber', section='case-study'),
        ]

    def test_groups_into_two_sections(self):
        html = build_sidebar_html(self.chapters, current_num=None, link_prefix='')
        self.assertIn('Fundamentals', html)
        self.assertIn('Case Studies', html)

    def test_links_use_prefix_and_padded_number(self):
        html = build_sidebar_html(self.chapters, current_num=None, link_prefix='chapters/')
        self.assertIn('href="chapters/19-rate-limiter.html"', html)
        self.assertIn('href="chapters/30-design-uber.html"', html)

    def test_marks_current_chapter(self):
        html = build_sidebar_html(self.chapters, current_num=19, link_prefix='')
        self.assertIn('href="19-rate-limiter.html" aria-current="page"', html)
        self.assertNotIn('href="30-design-uber.html" aria-current="page"', html)

    def test_escapes_titles(self):
        chapters = [Chapter(num=1, title='A & B', slug='a-b', section='fundamentals')]
        html = build_sidebar_html(chapters, current_num=None, link_prefix='')
        self.assertIn('A &amp; B', html)
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd "/Volumes/Personal/MechineCoding/grokking-system-design/scripts" && python3 -m unittest tests.test_sitegen -v`
Expected: `ImportError: cannot import name 'build_sidebar_html'`.

- [ ] **Step 3: Implement it**

Append to `sitegen.py`:

```python
def _sidebar_group(label: str, chapters, current_num, link_prefix: str) -> str:
    items = []
    for c in chapters:
        href = f'{link_prefix}{c.num:02d}-{c.slug}.html'
        current_attr = ' aria-current="page"' if c.num == current_num else ''
        title = html_mod.escape(c.title)
        items.append(f'<li><a href="{href}"{current_attr}>{c.num}. {title}</a></li>')
    items_html = ''.join(items)
    return f'<details open><summary>{label}</summary><ul>{items_html}</ul></details>'


def build_sidebar_html(chapters, current_num, link_prefix: str) -> str:
    fundamentals = [c for c in chapters if c.section == 'fundamentals']
    case_studies = [c for c in chapters if c.section == 'case-study']
    return (
        '<nav class="sidebar">'
        '<h2 class="brand">Grokking System Design</h2>'
        + _sidebar_group('Fundamentals', fundamentals, current_num, link_prefix)
        + _sidebar_group('Case Studies', case_studies, current_num, link_prefix)
        + '</nav>'
    )
```

- [ ] **Step 4: Run to verify it passes**

Run: `cd "/Volumes/Personal/MechineCoding/grokking-system-design/scripts" && python3 -m unittest tests.test_sitegen -v`
Expected: `OK` (12 tests pass).

---

### Task 8: `build_chapter_page` and `build_index_page`

**Files:**

- Modify: `grokking-system-design/scripts/sitegen.py`
- Modify: `grokking-system-design/scripts/tests/test_sitegen.py`

- [ ] **Step 1: Write the failing test**

Add to `test_sitegen.py`:

```python
from sitegen import build_chapter_page, build_index_page


class TestBuildChapterPage(unittest.TestCase):
    def test_includes_title_lessons_and_css_link(self):
        chapter = Chapter(num=19, title='Rate Limiter', slug='rate-limiter', section='fundamentals')
        lessons = [
            ('System Design: The Rate Limiter', '<p>Intro text.</p>'),
            ('Requirements', '<p>Requirements text.</p>'),
        ]
        page = build_chapter_page(chapter, lessons, sidebar_html='<nav>SIDEBAR</nav>')
        self.assertIn('<link rel="stylesheet" href="../assets/style.css">', page)
        self.assertIn('<h1>19. Rate Limiter</h1>', page)
        self.assertIn('<h2>System Design: The Rate Limiter</h2>', page)
        self.assertIn('<p>Intro text.</p>', page)
        self.assertIn('<h2>Requirements</h2>', page)
        self.assertIn('<nav>SIDEBAR</nav>', page)
        self.assertIn('<title>19. Rate Limiter', page)

    def test_lesson_sections_are_separated(self):
        chapter = Chapter(num=1, title='X', slug='x', section='fundamentals')
        lessons = [('A', '<p>a</p>'), ('B', '<p>b</p>')]
        page = build_chapter_page(chapter, lessons, sidebar_html='')
        self.assertEqual(page.count('<section class="lesson">'), 2)


class TestBuildIndexPage(unittest.TestCase):
    def test_uses_root_relative_css_path(self):
        page = build_index_page(sidebar_html='<nav>SIDEBAR</nav>')
        self.assertIn('<link rel="stylesheet" href="assets/style.css">', page)
        self.assertIn('<nav>SIDEBAR</nav>', page)
        self.assertIn('Grokking System Design', page)
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd "/Volumes/Personal/MechineCoding/grokking-system-design/scripts" && python3 -m unittest tests.test_sitegen -v`
Expected: `ImportError: cannot import name 'build_chapter_page'`.

- [ ] **Step 3: Implement it**

Append to `sitegen.py`:

```python
def _page_shell(title: str, css_href: str, sidebar_html: str, main_html: str) -> str:
    return (
        '<!doctype html>\n'
        '<html lang="en">\n'
        '<head>\n'
        '<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width, initial-scale=1">\n'
        f'<title>{html_mod.escape(title)}</title>\n'
        f'<link rel="stylesheet" href="{css_href}">\n'
        '</head>\n'
        '<body>\n'
        f'<div class="layout">{sidebar_html}<main>{main_html}</main></div>\n'
        '</body>\n'
        '</html>\n'
    )


def build_chapter_page(chapter, lessons, sidebar_html: str) -> str:
    title_text = html_mod.escape(chapter.title)
    sections = []
    for lesson_title, fragment in lessons:
        sections.append(
            f'<section class="lesson"><h2>{html_mod.escape(lesson_title)}</h2>{fragment}</section>'
        )
    main_html = f'<h1>{chapter.num}. {title_text}</h1>' + ''.join(sections)
    page_title = f'{chapter.num}. {chapter.title} — Grokking System Design'
    return _page_shell(page_title, '../assets/style.css', sidebar_html, main_html)


def build_index_page(sidebar_html: str) -> str:
    main_html = (
        '<h1>Grokking System Design</h1>'
        '<p>Browse the course using the sidebar. '
        '<strong>Fundamentals</strong> covers system design building blocks '
        '(chapters 1–25); <strong>Case Studies</strong> covers full '
        'end-to-end designs (chapters 26–40).</p>'
    )
    return _page_shell('Grokking System Design', 'assets/style.css', sidebar_html, main_html)
```

- [ ] **Step 4: Run to verify it passes**

Run: `cd "/Volumes/Personal/MechineCoding/grokking-system-design/scripts" && python3 -m unittest tests.test_sitegen -v`
Expected: `OK` (15 tests pass).

---

### Task 9: `build.py` orchestrator with integration test

**Files:**

- Create: `grokking-system-design/scripts/build.py`
- Create: `grokking-system-design/scripts/tests/test_build.py`

- [ ] **Step 1: Write the failing integration test**

Create `grokking-system-design/scripts/tests/test_build.py`:

```python
import base64
import tempfile
import unittest
from pathlib import Path

from build import build_site


LESSON_TEMPLATE = '''<html><body><nav>site nav</nav>
<div><div id="view-collection-article-content-root">
<h1>{title}</h1><p>{body}</p>
<object data="data:image/svg+xml;base64,{b64}"></object>
</div></div>
</body></html>'''


def _make_fixture_course(root: Path):
    svg = b'<svg xmlns="http://www.w3.org/2000/svg"><rect/></svg>'
    b64 = base64.b64encode(svg).decode()

    ch1 = root / '1. System Design Interviews'
    ch1.mkdir(parents=True)
    (ch1 / '1. What Is a System Design Interview.html').write_text(
        LESSON_TEMPLATE.format(title='What Is a System Design Interview?', body='Intro body.', b64=b64),
        encoding='utf-8',
    )
    (ch1 / '_README.txt').write_text('readme', encoding='utf-8')

    ch30 = root / '30. Design Uber'
    ch30.mkdir(parents=True)
    (ch30 / '1. System Design Uber.html').write_text(
        LESSON_TEMPLATE.format(title='System Design: Uber', body='Uber body.', b64=b64),
        encoding='utf-8',
    )

    (root / '.DS_Store').write_text('', encoding='utf-8')


class TestBuildSite(unittest.TestCase):
    def test_builds_chapters_index_and_diagrams(self):
        with tempfile.TemporaryDirectory() as src_dir, tempfile.TemporaryDirectory() as out_dir:
            src = Path(src_dir)
            out = Path(out_dir)
            _make_fixture_course(src)

            chapters = build_site(src, out)

            self.assertEqual([c.num for c in chapters], [1, 30])
            self.assertEqual(chapters[0].section, 'fundamentals')
            self.assertEqual(chapters[1].section, 'case-study')

            ch1_page = (out / 'chapters' / '01-system-design-interviews.html').read_text(encoding='utf-8')
            self.assertIn('What Is a System Design Interview?', ch1_page)
            self.assertIn('Intro body.', ch1_page)
            self.assertIn('<img src="../diagrams/system-design-interviews/', ch1_page)

            ch30_page = (out / 'chapters' / '30-design-uber.html').read_text(encoding='utf-8')
            self.assertIn('Uber body.', ch30_page)

            index_page = (out / 'index.html').read_text(encoding='utf-8')
            self.assertIn('href="chapters/01-system-design-interviews.html"', index_page)
            self.assertIn('href="chapters/30-design-uber.html"', index_page)

            svgs = list((out / 'diagrams').rglob('*.svg'))
            self.assertEqual(len(svgs), 2)


if __name__ == '__main__':
    unittest.main()
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd "/Volumes/Personal/MechineCoding/grokking-system-design/scripts" && python3 -m unittest tests.test_build -v`
Expected: `ModuleNotFoundError: No module named 'build'`.

- [ ] **Step 3: Implement it**

Create `grokking-system-design/scripts/build.py`:

```python
#!/usr/bin/env python3
"""Regenerates chapters/, diagrams/, and index.html from the source course export."""
import sys
import argparse
from pathlib import Path

from extractor import extract_content_fragment, decode_diagrams, strip_noise, simplify_attributes
from sitegen import Chapter, parse_numbered_name, slugify, build_sidebar_html, build_chapter_page, build_index_page

DEFAULT_SOURCE = Path.home() / 'Downloads' / 'Grokking Modern System Design Interview for Engineers & Managers'
DEFAULT_OUTPUT = Path(__file__).resolve().parent.parent


def section_for(num: int) -> str:
    return 'fundamentals' if num <= 25 else 'case-study'


def discover_chapters(source_dir: Path):
    chapters = []
    for entry in sorted(source_dir.iterdir()):
        if not entry.is_dir():
            continue
        try:
            num, title = parse_numbered_name(entry.name)
        except ValueError:
            continue
        chapters.append(Chapter(num=num, title=title, slug=slugify(title), section=section_for(num)))
    chapters.sort(key=lambda c: c.num)
    return chapters


def discover_lessons(chapter_dir: Path):
    lessons = []
    for entry in sorted(chapter_dir.glob('*.html')):
        try:
            num, title = parse_numbered_name(entry.stem)
        except ValueError:
            continue
        lessons.append((num, title, entry))
    lessons.sort(key=lambda t: t[0])
    return lessons


def build_chapter(chapter: Chapter, source_dir: Path, output_dir: Path, all_chapters) -> None:
    chapter_dir = source_dir / f'{chapter.num}. {chapter.title}'
    diagrams_dir = output_dir / 'diagrams' / chapter.slug
    lessons_out = []
    for lesson_num, lesson_title, lesson_path in discover_lessons(chapter_dir):
        raw = lesson_path.read_text(encoding='utf-8', errors='ignore')
        frag = extract_content_fragment(raw)
        frag = decode_diagrams(frag, diagrams_dir, f'lesson-{lesson_num}')
        frag = strip_noise(frag)
        frag = simplify_attributes(frag)
        lessons_out.append((lesson_title, frag))

    sidebar = build_sidebar_html(all_chapters, current_num=chapter.num, link_prefix='')
    page = build_chapter_page(chapter, lessons_out, sidebar)
    out_path = output_dir / 'chapters' / f'{chapter.num:02d}-{chapter.slug}.html'
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(page, encoding='utf-8')


def build_site(source_dir: Path, output_dir: Path):
    chapters = discover_chapters(source_dir)
    for chapter in chapters:
        build_chapter(chapter, source_dir, output_dir, chapters)

    sidebar = build_sidebar_html(chapters, current_num=None, link_prefix='chapters/')
    index_html = build_index_page(sidebar)
    (output_dir / 'index.html').write_text(index_html, encoding='utf-8')
    return chapters


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('source', nargs='?', type=Path, default=DEFAULT_SOURCE)
    parser.add_argument('output', nargs='?', type=Path, default=DEFAULT_OUTPUT)
    args = parser.parse_args()

    if not args.source.is_dir():
        print(f'source directory not found: {args.source}', file=sys.stderr)
        sys.exit(1)

    chapters = build_site(args.source, args.output)
    diagram_count = sum(1 for _ in (args.output / 'diagrams').rglob('*.svg'))
    print(f'Built {len(chapters)} chapters, {diagram_count} diagrams -> {args.output}')


if __name__ == '__main__':
    main()
```

- [ ] **Step 4: Run to verify it passes**

Run: `cd "/Volumes/Personal/MechineCoding/grokking-system-design/scripts" && python3 -m unittest tests.test_build -v`
Expected: `OK` (1 test passes).

- [ ] **Step 5: Run the full test suite**

Run: `cd "/Volumes/Personal/MechineCoding/grokking-system-design" && python3 -m unittest discover -s scripts/tests -t scripts -v`
Expected: `OK` (16 tests pass: 11 extractor + 15 sitegen... — note some classes share the module so exact count may read differently in the runner; confirm every test shows `ok`, zero failures/errors).

---

### Task 10: Build the real site and verify in a browser

**Files:** none created — this runs the pipeline against real data and visually verifies the result.

- [ ] **Step 1: Run the build against the real course export**

Run:

```bash
cd "/Volumes/Personal/MechineCoding/grokking-system-design" && python3 scripts/build.py
```

Expected: `Built 40 chapters, 426 diagrams -> /Volumes/Personal/MechineCoding/grokking-system-design`

- [ ] **Step 2: Sanity-check output structure**

Run: `find "/Volumes/Personal/MechineCoding/grokking-system-design/chapters" -name '*.html' | wc -l`
Expected: `40`

Run: `find "/Volumes/Personal/MechineCoding/grokking-system-design/diagrams" -name '*.svg' | wc -l`
Expected: `426`

- [ ] **Step 3: Validate every generated page is well-formed HTML**

Run:

```bash
cd "/Volumes/Personal/MechineCoding/grokking-system-design" && python3 -c "
from html.parser import HTMLParser
from pathlib import Path

class Checker(HTMLParser):
    pass

bad = []
for f in sorted(Path('chapters').glob('*.html')) + [Path('index.html')]:
    p = Checker()
    try:
        p.feed(f.read_text(encoding='utf-8'))
        p.close()
    except Exception as e:
        bad.append((f, e))
print('bad files:', bad)
"
```

Expected: `bad files: []`

- [ ] **Step 4: Run a full link-integrity check — every chapter present, indexed, and every image resolvable**

This is the check that answers "is every file properly there, in place, and indexed": it re-derives the expected chapter list straight from the source folder names (not from what got written — so a chapter that silently failed to build would be caught), then verifies three things for each one: the chapter HTML file exists on disk, `index.html` actually contains a link to it, and every `<img src="...">` the chapter page references points at a diagram file that really exists.

Run:

```bash
cd "/Volumes/Personal/MechineCoding/grokking-system-design" && python3 -c "
import re
import sys
from pathlib import Path

sys.path.insert(0, 'scripts')
from build import DEFAULT_SOURCE, discover_chapters

output = Path('.')
chapters = discover_chapters(DEFAULT_SOURCE)
print(f'expected chapters (from source folder names): {len(chapters)}')

index_html = (output / 'index.html').read_text(encoding='utf-8')

missing_files = []
not_indexed = []
broken_images = []

IMG_SRC_RE = re.compile(r'<img src=\"([^\"]+)\"')

for c in chapters:
    rel = f'chapters/{c.num:02d}-{c.slug}.html'
    page_path = output / rel
    if not page_path.exists():
        missing_files.append(rel)
        continue

    if f'href=\"{rel}\"' not in index_html:
        not_indexed.append(rel)

    page_text = page_path.read_text(encoding='utf-8')
    for src in IMG_SRC_RE.findall(page_text):
        resolved = (page_path.parent / src).resolve()
        if not resolved.exists():
            broken_images.append((rel, src))

print('missing chapter files:', missing_files)
print('chapters not linked from index.html:', not_indexed)
print('broken image references:', broken_images)

if missing_files or not_indexed or broken_images:
    sys.exit(1)
print('ALL CHECKS PASSED')
"
```

Expected: `expected chapters (from source folder names): 40`, all three problem lists empty, and `ALL CHECKS PASSED` printed. If anything is non-empty, that is the exact file/link to fix before continuing — do not proceed to Step 5 until this prints `ALL CHECKS PASSED`.

- [ ] **Step 5: Open in a browser and screenshot the index page**

Run:

```bash
open "/Volumes/Personal/MechineCoding/grokking-system-design/index.html"
sleep 2
screencapture -x /private/tmp/claude-501/-Volumes-Personal-MechineCoding/94790439-bb1d-454e-bd1c-ed20c64f683f/scratchpad/grokking-index-screenshot.png
```

Then read the screenshot with the Read tool to visually confirm: sidebar shows "Fundamentals" and "Case Studies" groups, both expanded, links look correct, page is readable in the current OS theme.

- [ ] **Step 6: Open a diagram-heavy chapter page and screenshot it**

Run:

```bash
open "/Volumes/Personal/MechineCoding/grokking-system-design/chapters/19-rate-limiter.html"
sleep 2
screencapture -x /private/tmp/claude-501/-Volumes-Personal-MechineCoding/94790439-bb1d-454e-bd1c-ed20c64f683f/scratchpad/grokking-rate-limiter-screenshot.png
```

Then read the screenshot with the Read tool to visually confirm the rate limiter diagram renders correctly and the sidebar highlights "19. Rate Limiter" as the active link.

- [ ] **Step 7: Report the final state to the user**

Summarize: total chapters, total diagrams, total on-disk size (`du -sh grokking-system-design`), and remind the user that per their instruction nothing has been committed to git — `grokking-system-design/` exists only in the working directory, and they should decide separately (given the ~380MB diagram footprint) how much of it they want tracked in git.

---

## Self-review notes

- **Spec coverage:** extraction preserves original HTML (not markdown) — Tasks 2–5. Diagrams decoded to standalone files — Task 3. Two-section sidebar (Fundamentals 1–25 / Case Studies 26–40) — Task 7, `section_for()` in Task 9. Chapter-level granularity (lessons concatenated per chapter) — Task 8/9. No server required, static multi-page — Task 8 page shell uses plain relative `<a href>` links, no fetch/JS. New top-level folder — Task 1. All covered.
- **No placeholders:** every step has complete, runnable code; no "add error handling" hand-waving.
- **No git commits:** every task ends in a run/verify step, never a commit step, per explicit user instruction in this session.
