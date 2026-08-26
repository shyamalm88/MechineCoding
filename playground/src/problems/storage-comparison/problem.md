# localStorage vs sessionStorage vs cookies

## The short answer

| | localStorage | sessionStorage | Cookies |
|---|---|---|---|
| Capacity | ~5–10 MB | ~5–10 MB | ~4 KB |
| Lifetime | Until cleared | Until tab closes | `Expires` / `Max-Age` |
| Sent to server | No | No | **On every request** |
| Scope | Origin | Origin **+ tab** | Origin + `Path`, optionally subdomains |
| API | Synchronous | Synchronous | `document.cookie` (string parsing) |

## The distinction interviewers probe

**sessionStorage is per-tab, not per-session.** Two tabs on the same origin get
two *separate* sessionStorage areas. Duplicating a tab copies the storage; a
normal new tab starts empty. localStorage is shared across all tabs of the
origin — and fires a `storage` event in the *other* tabs when written, which is
a neat way to sync state between tabs.

**Cookies cost bandwidth.** They are attached to every matching request,
including images and CSS. A 4 KB cookie on a page making 50 requests uploads
200 KB of redundant headers. That is why auth tokens live in cookies (the
server needs them) and UI preferences do not.

## Why auth tokens still use cookies

`HttpOnly` makes a cookie unreadable from JavaScript, which blunts XSS token
theft — `localStorage` has no equivalent. Combined with `Secure` (HTTPS only)
and `SameSite` (CSRF defence), cookies remain the safer place for session
credentials despite being clunkier.

## Traps

- Both Storage APIs are **synchronous** and block the main thread; large
  JSON round-trips there cause jank. `IndexedDB` is async and far larger.
- They store **strings only** — objects need `JSON.stringify`, and `undefined`
  silently becomes the string `"undefined"`.
- Storage can throw: Safari private mode historically threw on write, and
  quota exhaustion throws `QuotaExceededError`. Always guard writes.
