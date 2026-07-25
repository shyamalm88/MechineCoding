#!/usr/bin/env python3
"""Generic markdown-folder -> browsable static HTML site generator.

Usage:
    python3 build.py <source-dir> <output-dir>
"""
import html
import json
import os
import re
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

    groups = {}
    for filename in md_files:
        category = categories[filename]
        if not isinstance(category, str) or not category.strip():
            raise ValueError(
                f"site.config.json has an invalid category for {filename!r}: {category!r}"
            )
        groups.setdefault(category, []).append(filename)
    return list(groups.items())


MERMAID_FENCE_RE = re.compile(
    r'<pre><code class="language-mermaid">(.*?)</code></pre>', re.S | re.I
)


def convert_markdown(text):
    body = md_lib.markdown(
        text, extensions=["fenced_code", "tables", "toc", "attr_list"]
    )

    def replace_mermaid(match):
        raw = html.unescape(match.group(1)).rstrip("\n")
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


def main():
    if len(sys.argv) != 3:
        print("Usage: build.py <source-dir> <output-dir>", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
