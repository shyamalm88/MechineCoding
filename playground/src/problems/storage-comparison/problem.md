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

## Worked example: the cookie that costs 200KB

A 4KB session cookie on a page making 50 requests to the same origin uploads
**200KB of redundant headers** — on a connection where upload is typically much
slower than download. Serving static assets from a cookieless origin used to be
standard practice for exactly this reason.

localStorage sends nothing, which is why UI preferences belong there and session
credentials do not.

## How to answer this out loud

"All three persist data client-side but they differ on lifetime, size and whether
the server sees them. Cookies are ~4KB and sent on *every* matching request,
which is why they're for things the server needs — session tokens — and not UI
state. localStorage and sessionStorage are ~5-10MB and never sent; the
distinction is that sessionStorage is per-tab, not per-session, so two tabs on
the same origin get separate stores. For auth tokens I'd still use an HttpOnly
cookie, because localStorage is readable by any injected script, so an XSS is a
token theft."

## Follow-ups to expect

- *Where would you store a JWT?* HttpOnly + Secure + SameSite cookie. If it must
  be in JS memory, keep it in a variable rather than localStorage so an XSS
  cannot simply read it back.
- *How do you sync state between tabs?* The `storage` event fires in *other*
  tabs when localStorage changes — or `BroadcastChannel`.
- *When would you use IndexedDB instead?* Anything large or structured;
  localStorage is synchronous and blocks the main thread.
