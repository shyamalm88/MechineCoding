# Grokking System Design — Interactive Index

## Problem

`~/Downloads/Grokking Modern System Design Interview for Engineers & Managers/` contains a browser-exported copy of the Google "Grokking Modern System Design Interview for Engineers & Managers" course: 40 chapter folders, each holding numbered lesson `.html` files (browser-saved pages, ~1–3MB each, packed with embedded fonts/tracking scripts) plus a `_README.txt`. The chapters aren't linked to each other — there's no way to browse the course as a whole, and the raw HTML files are too heavy/noisy to read directly.

Chapters 1–25 cover system design fundamentals (DNS, load balancers, databases, caching, queues, rate limiter, blob store, sequencer, monitoring, etc.). Chapters 26–40 are full case-study designs (YouTube, Twitter, Uber, Instagram, WhatsApp, Google Maps, Google Docs, TinyURL, Web Crawler, Typeahead) plus a "Spectacular Failures" and "Concluding Remarks" wrap-up.

## Goal

Build a static, interactive index inside the `MechineCoding` repo that lets the user browse all 40 chapters from a left-hand sidebar, split into two sections — **Fundamentals** (1–25) and **Case Studies** (26–40) — with each chapter linking to its own readable page containing that chapter's lessons in order.

## Non-goals

- No markdown conversion of lesson content (risk of losing tables/diagrams/math in translation — rejected in favor of preserving original HTML).
- No live quiz interactivity — quiz pages are captured as static text (their original interactivity was client-side React state that can't be revived from a saved snapshot).
- No build step / dev server requirement — must work by double-clicking `index.html`.

## Content extraction

Google's saved pages all share one stable container: `<div id="view-collection-article-content-root">`. Verified present and structurally consistent across a fundamentals lesson, a case-study lesson, a quiz page, and the course intro.

Per lesson, the extraction script:

1. Locates the `view-collection-article-content-root` div (with proper tag-depth balancing, not naive regex, since content contains nested divs).
2. Decodes embedded diagrams: draw.io diagrams are stored as `<object type="image/svg+xml" data="data:image/svg+xml;base64,...">` (confirmed — the Rate Limiter intro diagram alone is 1.7MB of inline base64). These are decoded out to standalone `.svg` files under `diagrams/<chapter-slug>/`, with the `<object>` replaced by a lightweight `<img src="...">` pointing at the extracted file. This keeps full diagram fidelity without bloating every chapter page with megabytes of inline base64.
3. Strips non-content chrome: `<script>`, `<style>`, `<link>`, tracking-pixel `<img>` tags, UI buttons ("Mark as Completed", zoom, report-issue), cookie-consent/Hubspot/Hotjar leftover markup, `data-savepage-*` attributes.
4. Leaves everything else (headings, paragraphs, lists, tables, code blocks, KaTeX math markup, real content images) untouched — original authoring, not re-derived.

Lessons within a chapter are concatenated in numeric order into one page per chapter, each lesson wrapped in a `<section>` with its own `<h2>` heading and a horizontal rule between lessons.

## Site structure

```
grokking-system-design/
  index.html                  # landing page with full sidebar; default content = course overview
  chapters/
    01-system-design-interviews.html
    02-introduction.html
    ...
    40-concluding-remarks.html
  diagrams/
    <chapter-slug>/lesson-N-fig-M.svg
  assets/
    style.css                 # shared readable typography, linked by every page
  scripts/
    build.py                  # rerunnable extractor: source Downloads path -> chapters/ + diagrams/
  README.md                   # what this is, how to rebuild, source path
```

Navigation is a static multi-page site — no JS fetch, no CORS issues, no local server needed:

- Sidebar = two native `<details>/<summary>` groups, "Fundamentals" (chapters 1–25) and "Case Studies" (chapters 26–40), each expanding to plain `<a href="chapters/NN-slug.html">` links.
- Every chapter page repeats the same generated sidebar markup (not hand-maintained — emitted by `build.py`), so the user can jump chapter-to-chapter without returning to `index.html` first.
- Chapter numbers/titles/slugs are derived directly from the existing `NN. Title` folder names in the source export — no separate hardcoded title list to keep in sync.

## Git handling

User decision: commit `grokking-system-design/` to the repo normally (not gitignored), despite this being paid course content and the repo having a public-looking GitHub remote. This was flagged explicitly and the user chose to proceed.

## Known limitations

- Quiz pages show questions/options as static text only; no working "submit answer" interactivity.
- Any lesson content that Google loaded lazily and wasn't present in the DOM at save time (rare — spot-checked across 4 lesson types, all had full content) won't be recoverable without re-visiting the original course.

## Build tooling

`scripts/build.py` takes the Downloads export path as input and (re)generates `chapters/`, `diagrams/`, and the sidebar in every page. Rerunnable if the course export is refreshed later.
