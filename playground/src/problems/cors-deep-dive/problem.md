# CORS — deep dive

## The short answer

CORS does not *add* security. It **relaxes** the Same-Origin Policy in a
controlled way. Without it, cross-origin reads would simply be forbidden.

And the single most important point: **CORS is enforced by the browser, and the
request usually still reached your server.** CORS decides whether JavaScript may
*read the response* — not whether the request happens.

## Simple vs preflighted

A request avoids a preflight only if it is "simple":

- method is `GET`, `HEAD` or `POST`
- headers are within a small safe-list
- `Content-Type` is `text/plain`, `multipart/form-data`, or
  `application/x-www-form-urlencoded`

Anything else — `PUT`, `DELETE`, an `Authorization` header, or the very common
`Content-Type: application/json` — triggers a **preflight**:

```http
OPTIONS /api/items                 →
Origin: https://app.example
Access-Control-Request-Method: PUT
Access-Control-Request-Headers: content-type
                                   ← 204 No Content
                                     Access-Control-Allow-Origin: https://app.example
                                     Access-Control-Allow-Methods: PUT
                                     Access-Control-Allow-Headers: content-type
                                     Access-Control-Max-Age: 86400
```

**`Access-Control-Max-Age` caches the preflight**, so you do not pay two round
trips on every call. Without it, every JSON POST costs double. This is the
cheapest CORS performance win and it is frequently missing.

## The credentials rules

With `credentials: 'include'` (cookies, TLS client certs):

- `Access-Control-Allow-Origin` **cannot be `*`** — it must name the exact origin
- `Access-Control-Allow-Credentials: true` is required
- `Vary: Origin` is required, or a shared cache serves one origin's response to
  another

Reflecting the `Origin` header back is the usual implementation — but reflecting
it **unconditionally** means every site can read authenticated responses. Check
it against an allow-list.

## The insight interviewers want

```js
fetch('https://api.other.com/delete-everything', { method: 'POST', mode: 'no-cors' })
```

A **simple** POST goes through and **executes on the server**. The browser
blocks you from reading the response, but the side effect already happened.

That is why:

- CORS is not a substitute for **CSRF** protection
- CORS is not authorisation — your server must still authenticate every request
- a "CORS error" in the console does not mean the request was stopped

Non-simple requests *are* stopped before the real request, because the preflight
fails first — which is one reason `application/json` is a mild CSRF mitigation.

## Debugging the common errors

| Error | Cause |
|---|---|
| "No 'Access-Control-Allow-Origin' header" | Server did not send it (often it 500'd — check the response, not the CORS message) |
| "…does not pass access control check" on OPTIONS | Preflight not handled; your router probably doesn't accept OPTIONS |
| Works in Postman, fails in browser | Postman has no origin and does not enforce CORS |
| Can't read a custom response header | Needs `Access-Control-Expose-Headers` |

That last one catches people constantly: a header like `X-Total-Count` is
invisible to JS unless explicitly exposed.

## Traps

- **Redirects during preflight are not allowed.**
- `mode: 'no-cors'` returns an **opaque** response — status 0, unreadable body.
  It is not a way around CORS.
- CORS does not apply to `<img>`, `<script>` or form submissions — those were
  always allowed to be sent cross-origin.

## How to answer this out loud

"CORS relaxes the same-origin policy so JavaScript can read a cross-origin
response. Requests are either simple — GET/HEAD/POST with safe headers — or
they trigger an OPTIONS preflight, which anything with JSON content-type or a
custom header does. The key thing I'd stress is that CORS is browser-enforced
and the request often still reaches the server: a simple POST executes and only
the *response* is hidden. So it's not CSRF protection and not authorisation.
Practically, I'd set `Access-Control-Max-Age` to avoid paying a preflight per
call, and remember `Allow-Origin` can't be `*` with credentials."

## Follow-ups to expect

- *Why does it work in Postman?* No origin, no browser enforcement.
- *How do you allow many origins?* Check `Origin` against an allow-list and
  reflect it, with `Vary: Origin`.
- *Does a proxy avoid CORS?* Yes — same-origin from the browser's view — but you
  have taken on being the authenticated caller.
