#!/usr/bin/env python3
"""Generic markdown-folder -> browsable static HTML site generator.

Usage:
    python3 build.py <source-dir> <output-dir>
"""
import os
import re
import sys


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


def main():
    if len(sys.argv) != 3:
        print("Usage: build.py <source-dir> <output-dir>", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
