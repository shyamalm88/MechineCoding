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
