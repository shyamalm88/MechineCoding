# App Router file conventions and advanced routing

> Next.js 15 App Router.

## The special files

| File | Purpose |
|---|---|
| `page.js` | The route's UI — makes the segment publicly routable |
| `layout.js` | Shared shell; **preserves state** across navigation |
| `template.js` | Like layout but **remounts** on every navigation |
| `loading.js` | Suspense fallback for the segment |
| `error.js` | Error boundary (**must be a Client Component**) |
| `not-found.js` | 404 UI, triggered by `notFound()` |
| `route.js` | API endpoint (cannot coexist with `page.js`) |

## layout vs template

The distinction that gets asked: a **layout does not re-render** when navigating
between its children — scroll position, form state and animations persist. A
**template remounts**, which is what you want for enter animations or per-route
effects that must re-fire.

## Route groups and private folders

```
app/(marketing)/about/page.js   →  /about        — parentheses excluded from URL
app/_components/Button.js       →  not a route   — underscore = private
```

Route groups exist to apply **different layouts** to different sections without
affecting URLs.

## Dynamic segments

```
app/blog/[slug]/page.js        →  /blog/hello
app/shop/[...slug]/page.js     →  /shop/a/b/c    (catch-all)
app/shop/[[...slug]]/page.js   →  /shop and /shop/a/b  (optional catch-all)
```

**Next 15:** `params` and `searchParams` are now **async** — you must `await`
them. A breaking change that catches everyone migrating.

## Parallel routes

```
app/@team/page.js
app/@analytics/page.js
app/layout.js   → ({ children, team, analytics }) => ...
```

Render multiple pages in one layout simultaneously, each with independent
loading and error states. Useful for dashboards.

## Intercepting routes

```
app/feed/page.js
app/feed/@modal/(..)photo/[id]/page.js
```

Show `/photo/123` as a **modal over the feed** when navigated to client-side, but
as a full page on direct load or refresh. This is the Instagram photo-modal
behaviour, and it is genuinely hard to build by hand.

Matchers: `(.)` same level, `(..)` one up, `(...)` from root.

## Navigation

```js
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
```

`<Link>` prefetches automatically when in the viewport, which is why App Router
navigation feels instant.

**Trap:** `useSearchParams()` forces client rendering of the whole route unless
wrapped in `<Suspense>` — a build error on static routes that surprises people.
