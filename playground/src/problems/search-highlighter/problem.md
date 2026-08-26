# Search Highlighter

Highlight every occurrence of a search term inside a block of text, live as
the user types.

## Requirements

- Typing in the input highlights all case-insensitive matches in the passage.
- An empty query renders the text untouched.
- Matches keep the passage's original casing — only the background changes.

## How it works

The whole trick is `String.split` with a **capturing** group:

```js
text.split(new RegExp(`(${query})`, 'gi'))
```

Without the parentheses, `split` discards the delimiters and the matches would
vanish. With them, the matches are kept *in* the resulting array, so the parts
alternate: text, match, text, match… Each part is then compared
case-insensitively against the query and wrapped in `<mark>` when it matches.

## Interview traps

- **Regex injection.** The query is interpolated straight into a `RegExp`, so a
  user typing `(` or `*` throws a syntax error. Production code escapes the
  query first (`query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')`).
- **Rebuilding the regex every keystroke** is wasteful on long text — memoize it.
- Using array index as `key` is acceptable here only because the list is
  regenerated wholesale on every render and never reordered.
