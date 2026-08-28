# async vs defer on script tags

## The short answer

A plain `<script>` **stops the browser from building the page** while it fetches
and runs. `async` and `defer` both let the page keep building — they differ in
*when* the script is allowed to run:

- **`defer`** — wait until the page is fully parsed, then run scripts **in order**.
- **`async`** — run **the instant it downloads**, whichever arrives first.

Use `defer` for your own app code. Use `async` for independent third parties.

## Why this matters at all

To show a page, the browser reads your HTML top to bottom and builds the DOM.
A `<script>` tag interrupts that: the parser stops dead, downloads the file,
executes it, and only then continues.

That pause is the problem. A 200KB script on a slow connection means the user
stares at a blank screen for a second, even though the HTML below it was ready
to display all along.

Why does the browser behave so rudely? Because scripts can call
`document.write()` and inject markup at that exact point. The browser cannot
know whether the script will change what comes next, so it waits.

## The three behaviours, drawn out

```
<script src="a.js">
  parse ▓▓▓▓ ──STOP── fetch ──── execute ── ▓▓▓▓ resume parse
                └── page is frozen here ──┘

<script async src="a.js">
  parse ▓▓▓▓▓▓▓▓▓▓ ─STOP─ ▓▓▓▓▓▓▓▓▓▓▓
        └ fetch ┘   execute
        (parsing continues during the download, pauses only to execute)

<script defer src="a.js">
  parse ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ── execute ── DOMContentLoaded
        └──── fetch ────┘
        (never interrupts parsing at all)
```

Both `async` and `defer` download **in parallel** with parsing. The difference
is purely about execution timing.

## Worked example: why order matters

Say you load two files:

```html
<script async src="jquery.js"></script>
<script async src="uses-jquery.js"></script>
```

`uses-jquery.js` is small, so it very often downloads **first** — and runs
first, throwing `$ is not defined`. It works on your fast laptop and fails
intermittently in production, which is the worst kind of bug.

With `defer`, both wait for parsing to finish and then run in **document
order**, so jQuery is always defined first.

```html
<script defer src="jquery.js"></script>      <!-- runs 1st, guaranteed -->
<script defer src="uses-jquery.js"></script> <!-- runs 2nd, guaranteed -->
```

## Choosing between them

| Situation | Use |
|---|---|
| Your application bundle | `defer` |
| Anything that needs the DOM | `defer` |
| Scripts that depend on each other | `defer` (order guaranteed) |
| Analytics, error reporting, ads | `async` |
| A polyfill that must run before everything | plain `<script>` in `<head>` |

The rule of thumb: **`defer` unless the script is genuinely independent of your
code, the DOM, and every other script.** That description fits very few things
besides third-party beacons.

## Traps interviewers probe

**Both attributes are ignored on inline scripts.** They only apply when `src`
is present:

```html
<script defer>console.log('runs immediately')</script>  <!-- defer does nothing -->
```

**`defer` guarantees order; `async` explicitly does not.** If someone says
"async is just a faster defer", that is the misunderstanding to correct.

**`type="module"` is deferred by default.** You do not need to write `defer` on
a module script — though adding `async` still changes it to async behaviour.

**`defer` scripts run *before* `DOMContentLoaded` fires**, so that event still
sees the effects of your deferred code. `async` scripts may run before or after
it, which is another reason ordering-sensitive code should not use them.

## How to answer this out loud

"A normal script blocks HTML parsing while it downloads and runs. Both `async`
and `defer` download in parallel, but `async` executes the moment it lands —
so order isn't guaranteed — while `defer` waits until parsing is complete and
runs scripts in document order. I default to `defer` for app code, and only
use `async` for genuinely independent third parties like analytics."

## Follow-ups to expect

- *Where do you put the script tag?* Historically at the end of `<body>` to
  avoid blocking; with `defer` you can keep it in `<head>`, which lets the
  browser discover and start downloading it earlier.
- *What about `preload`?* `<link rel="preload">` starts the download sooner but
  does not execute — it pairs with, rather than replaces, these attributes.
- *How does this relate to the critical rendering path?* Scripts also wait on
  pending CSS (they might read computed styles), so CSS can block JS which
  blocks the DOM.
