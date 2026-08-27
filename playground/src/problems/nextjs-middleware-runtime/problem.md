# Middleware, edge runtime, and environment variables

## Middleware

Runs **before** a request is completed, on every matching route.

```js
// middleware.js (project root)
export function middleware(request) {
  const token = request.cookies.get('session')
  if (!token) return NextResponse.redirect(new URL('/login', request.url))
  return NextResponse.next()
}
export const config = { matcher: ['/dashboard/:path*'] }
```

Good for: auth redirects, A/B bucketing, geo/locale routing, rewrites, setting
headers.

**The constraints are the interview content:**

- Runs on the **Edge runtime** — a Web-APIs-only subset. No Node APIs, no `fs`,
  no native modules. Many libraries (including some database drivers and
  `jsonwebtoken`) simply do not work; use `jose` for JWT verification.
- It is on the **hot path for every matched request**, so slow middleware slows
  the entire site. Always constrain with `matcher`.
- It cannot read the response body or run after rendering.

**Middleware is not authorisation.** It is a routing-level convenience. The
actual check must happen in the Server Component, Route Handler, or Server Action
that touches data — anything reachable directly bypasses a UI redirect.

## Edge vs Node runtime

```js
export const runtime = 'edge'   // or 'nodejs' (default)
```

| | Edge | Node |
|---|---|---|
| Cold start | Near zero | Slower |
| APIs | Web standard only | Full Node |
| Location | Close to the user | Regional |
| Bundle limit | Small (a few MB) | Large |

Edge suits small, latency-sensitive, geo-distributed work. Node suits anything
touching a traditional database, native modules, or heavy libraries — and note
that an edge function far from your database can be *slower* overall despite
being close to the user.

## Environment variables

```
DATABASE_URL=…              # server only
NEXT_PUBLIC_ANALYTICS_ID=…  # inlined into the CLIENT bundle
```

Only `NEXT_PUBLIC_`-prefixed variables reach the browser, and they are
**inlined at build time** — not read at runtime. Two consequences that bite:

1. Changing one requires a **rebuild**, not just a restart. Docker images baked
   with build-time values cannot be re-pointed by changing the env.
2. Anything prefixed is **public**. Putting a secret behind `NEXT_PUBLIC_`
   ships it to every visitor.

`import 'server-only'` turns an accidental client import of a server module into
a **build error** rather than a silent secret leak — cheap insurance on any file
touching credentials.
