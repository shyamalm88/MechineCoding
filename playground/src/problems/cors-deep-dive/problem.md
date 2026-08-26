# CORS — deep dive

CORS does not *add* security. It **relaxes** the Same-Origin Policy in a
controlled way. Without it, cross-origin reads would simply be forbidden.

## Simple vs preflighted

A request is "simple" (no preflight) only if it uses `GET`/`HEAD`/`POST`, and
its headers and `Content-Type` fall within a small allow-list
(`text/plain`, `multipart/form-data`,
`application/x-www-form-urlencoded`).

Anything else — `PUT`, `DELETE`, a custom header like `Authorization`, or
`Content-Type: application/json` — triggers a **preflight**:

```http
OPTIONS /api/items                 →
Origin: https://app.example
Access-Control-Request-Method: PUT
Access-Control-Request-Headers: content-type
                                   ← 204
                                     Access-Control-Allow-Origin: https://app.example
                                     Access-Control-Allow-Methods: PUT
                                     Access-Control-Allow-Headers: content-type
                                     Access-Control-Max-Age: 86400
```

`Access-Control-Max-Age` caches the preflight so you do not pay two round trips
on every call.

## The credentials rule

With `credentials: 'include'`:

- `Access-Control-Allow-Origin` **cannot be `*`** — it must name the exact
  origin.
- `Access-Control-Allow-Credentials: true` is required.
- `Vary: Origin` is required, or a shared cache will serve one origin's
  response to another.

## The insight interviewers want

**The request usually still reached the server.** CORS blocks the *browser*
from exposing the response to JavaScript; it does not prevent the request
arriving. A non-simple request is stopped by preflight, but a simple `POST`
goes through and executes — which is exactly why CSRF protection is a separate
concern from CORS.

Also: it is enforced **by the browser only**. `curl` and your server-to-server
calls are unaffected.

## Traps

- Reading a custom response header cross-origin requires
  `Access-Control-Expose-Headers`.
- Redirects during preflight are not allowed.
- An opaque `no-cors` response has status 0 and an unreadable body — it is not
  a way around CORS.
