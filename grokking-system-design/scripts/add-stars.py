#!/usr/bin/env python3
"""Inject revision-priority star badges into grokking-system-design's
sidebar links.

grokking-system-design has no markdown source or build script (it was
generated once from a course export, then the generator was retired) --
index.html and every chapters/*.html file each carry their own full copy
of the sidebar, so this patches the already-generated HTML directly
rather than regenerating from source.

Idempotent: re-running replaces any existing star span for a given
chapter link rather than duplicating it, so STARS can be edited and this
script re-run safely.

Usage (from the grokking-system-design/ directory):
    python3 scripts/add-stars.py
"""
import glob
import os
import re

STARS = {
    "01-system-design-interviews.html": 3,
    "02-introduction.html": 1,
    "03-abstractions.html": 1,
    "04-non-functional-system-characteristics.html": 3,
    "05-back-of-the-envelope-calculations.html": 3,
    "06-building-blocks.html": 1,
    "07-domain-name-system.html": 2,
    "08-load-balancers.html": 3,
    "09-databases.html": 3,
    "10-key-value-store.html": 2,
    "11-content-delivery-network-cdn.html": 2,
    "12-sequencer.html": 1,
    "13-distributed-monitoring.html": 1,
    "14-monitor-server-side-errors.html": 1,
    "15-monitor-client-side-errors.html": 1,
    "16-distributed-cache.html": 3,
    "17-distributed-messaging-queue.html": 3,
    "18-pub-sub.html": 2,
    "19-rate-limiter.html": 3,
    "20-blob-store.html": 2,
    "21-distributed-search.html": 2,
    "22-distributed-logging.html": 1,
    "23-distributed-task-scheduler.html": 2,
    "24-sharded-counters.html": 1,
    "25-concluding-the-building-blocks-discussion.html": 0,
    "26-design-youtube.html": 3,
    "27-design-quora.html": 1,
    "28-design-google-maps.html": 2,
    "29-design-a-proximity-service-yelp.html": 2,
    "30-design-uber.html": 3,
    "31-design-twitter.html": 2,
    "32-design-newsfeed-system.html": 3,
    "33-design-instagram.html": 2,
    "34-design-a-url-shortening-service-tinyurl.html": 3,
    "35-design-a-web-crawler.html": 2,
    "36-design-whatsapp.html": 3,
    "37-design-typeahead-suggestion.html": 2,
    "38-design-a-collaborative-document-editing-service-google-docs.html": 2,
    "39-spectacular-failures.html": 1,
    "40-concluding-remarks.html": 0,
}

STARS_SPAN_RE = re.compile(r'<span class="stars"[^>]*>[^<]*</span>')


def link_pattern(filename):
    escaped = re.escape(filename)
    # href may or may not carry a "chapters/" prefix depending on whether
    # the file linking to it lives at the root (index.html) or inside
    # chapters/ itself (every chapter's own embedded sidebar copy).
    return re.compile(
        r'(<a href="(?:chapters/)?' + escaped + r'"[^>]*>)(.*?)(</a>)',
        re.S,
    )


def add_stars_to_file(path):
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    original = content
    for filename, rating in STARS.items():
        pattern = link_pattern(filename)

        def replace(match, rating=rating):
            open_tag, label, close_tag = match.group(1), match.group(2), match.group(3)
            label = STARS_SPAN_RE.sub("", label)  # strip any previous run's span first
            if rating > 0:
                label += (
                    f'<span class="stars" title="Priority: {rating}/3">'
                    f'{"★" * rating}</span>'
                )
            return open_tag + label + close_tag

        content = pattern.sub(replace, content)

    if content != original:
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)
        return True
    return False


def main():
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    targets = [os.path.join(root, "index.html")] + sorted(
        glob.glob(os.path.join(root, "chapters", "*.html"))
    )
    changed = 0
    for path in targets:
        if add_stars_to_file(path):
            changed += 1
    print(f"Updated {changed} of {len(targets)} files.")


if __name__ == "__main__":
    main()
