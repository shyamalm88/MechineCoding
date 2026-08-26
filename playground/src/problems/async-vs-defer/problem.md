# async vs defer on script tags

## The three behaviours

```
<script>          parse ──STOP── fetch ── execute ── resume parse
<script async>    parse ─────────────────────────────▶
                        └─ fetch ─┘ STOP execute STOP
<script defer>    parse ─────────────────────────────▶ DOMContentLoaded
                        └─ fetch ─┘         then execute, in order
```

- **Plain**: blocks parsing entirely. Worst for performance, but guarantees
  order and that the script runs before later markup exists.
- **`async`**: downloads in parallel, executes **the moment it arrives**,
  pausing the parser. Order is *not* guaranteed — whichever lands first runs
  first.
- **`defer`**: downloads in parallel, executes **after parsing completes**,
  strictly **in document order**, just before `DOMContentLoaded`.

## Choosing

- `defer` for your application code — it needs the DOM and usually has
  dependencies between files.
- `async` for genuinely independent third parties: analytics, error reporters.
  They neither depend on your code nor on each other.

## Traps

- Both are **ignored on inline scripts** — they only apply when `src` is present.
- `async` scripts racing means a small analytics file can execute before a large
  polyfill that arrived later. If order matters, `async` is wrong.
- `type="module"` is deferred by default; `async` still applies if specified.
