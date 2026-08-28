# Middleware, edge runtime, and environment variables

## The short answer

**Middleware** runs *before* a request is completed, on every matching route.
It runs on the **Edge runtime** — a Web-APIs-only subset — which is what makes
it fast and also what makes it limited.

```js
// middleware.js (project root)
export function middleware(request) {
  const token = request.cookies.get('session')
  if (!token) return NextResponse.redirect(new URL('/login', request.url))
  return NextResponse.next()
}

export const config = { matcher: ['/dashboard/:path*'] }
```

Good for: auth **redirects**, A/B bucketing, geo/locale routing, rewrites,
setting headers.

## The constraints are the interview content

**Edge runtime only.** No Node APIs, no `fs`, no native modules. Many libraries
simply do not work — including some database drivers and `jsonwebtoken`. Use
`jose` for JWT verification, which is Web Crypto based.

**It is on the hot path for every matched request.** Slow middleware slows your
entire site. Always constrain with `matcher`; a middleware that runs on every
image request is a self-inflicted tax.

**It cannot read the response body** or run after rendering.

## Middleware is NOT authorisation

This is the point that matters most.

Middleware redirects a *navigation*. It does not protect *data*. Anything
reachable directly — a Route Handler, a Server Action, a Server Component
fetching data — bypasses a UI redirect entirely.

```js
// middleware.js redirects /dashboard to /login   ← convenience
// but /api/users and every Server Action are still directly callable
```

So the real check must happen **where the data is touched**:

```js
export async function GET() {
  const session = await auth()          // ← the check that actually matters
  if (!session) return new Response('Unauthorized', { status: 401 })
}
```

Treat middleware as routing convenience and defence in depth, never as the
authorisation boundary.

## Edge vs Node runtime

```js
export const runtime = 'edge'   // or 'nodejs' (default)
```

| | Edge | Node |
|---|---|---|
| Cold start | near zero | slower |
| APIs | Web standard only | full Node |
| Location | close to the user | regional |
| Bundle limit | small (a few MB) | large |

**The non-obvious trade-off:** an edge function close to the user but far from
your **database** can be *slower* overall. Every query pays the full
edge→database round trip. Edge suits small, latency-sensitive work with data
that is also distributed (KV, edge config) — not a chatty Postgres app.

## Environment variables

```
DATABASE_URL=…                # server only
NEXT_PUBLIC_ANALYTICS_ID=…    # inlined into the CLIENT bundle
```

Only `NEXT_PUBLIC_`-prefixed variables reach the browser, and they are
**inlined at build time** — not read at runtime. Two consequences that bite:

1. **Changing one requires a rebuild**, not a restart. A Docker image baked with
   build-time values cannot be re-pointed by changing the environment — a very
   common deployment surprise.
2. **Anything prefixed is public.** Putting a secret behind `NEXT_PUBLIC_` ships
   it to every visitor. It will be in the JS bundle, readable by anyone.

```js
import 'server-only'    // makes an accidental client import a BUILD ERROR
```

Cheap insurance on any module touching credentials — it converts a silent secret
leak into a failed build.

## How to answer this out loud

"Middleware runs before the request completes, on the Edge runtime, so it's good
for redirects, rewrites, geo routing and A/B bucketing — but it's Web APIs only,
so a lot of Node libraries don't work, and it's on the hot path so you constrain
it with `matcher`. The thing I'd stress is that middleware isn't authorisation:
it redirects navigations, but Route Handlers and Server Actions are directly
callable, so the real check has to be where the data is touched. On env vars,
only `NEXT_PUBLIC_` reaches the browser and it's inlined at build time — so
changing it needs a rebuild, and anything with that prefix is public."

## Follow-ups to expect

- *When would you choose Node over Edge?* Anything needing a native module, a
  traditional database driver, or a large bundle.
- *How do you do auth properly?* Session check in the data layer, with middleware
  as a UX redirect on top.
- *Why is my env var undefined in the browser?* No `NEXT_PUBLIC_` prefix — and
  that is usually correct.
