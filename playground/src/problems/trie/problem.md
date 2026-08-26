# Trie (prefix tree)

Insert, search, `startsWith`, autocomplete, delete — the data structure behind
search suggestions, spell check, and IP routing tables.

## Why not just filter an array?

```js
words.filter(w => w.startsWith(prefix))   // O(n × m) over EVERY word
```

A trie is **O(m)** where m is the prefix length — completely independent of how
many words are stored. With 1M words, filtering touches a million strings; the
trie walks a handful of nodes.

That is the entire justification, and it is the answer to "why does this deserve
a custom structure".

## isEnd is not optional

```js
search('car')       // true  -- a stored word
startsWith('car')   // true  -- also a prefix of 'card', 'care'
search('ca')        // FALSE -- a valid path, but not a stored word
```

Without an `isEnd` flag there is no way to distinguish a complete word from an
intermediate node. Every prefix would report as a word.

## Delete, done properly

The naive delete just clears `isEnd`, leaking nodes forever. Pruning correctly
requires knowing whether any *other* word passes through a node.

Storing a `count` (words through this node) makes it a single O(m) pass: the
first node whose count drops to zero can have its entire branch removed.

Without the count you need a second traversal, or a recursive delete that
returns "am I now removable?" up the stack.

## Cost

- Time: O(m) insert, search, and prefix lookup.
- Space: this is the trade-off — a node per character per unique path. Memory-
  heavy compared to a sorted array.

**Compressed/radix tries** merge single-child chains into one node, which is
what makes them practical for routing tables. Mentioning that shows awareness of
the real weakness.

## Follow-ups

- **Ranked autocomplete**: store a frequency at terminal nodes and return the
  top-k, rather than the first k found — that is what a real suggestion box does.
- Fuzzy match / typo tolerance needs edit distance over the trie.
- For a fixed dictionary, a DAWG (deduplicated suffixes) is smaller still.
