# App Router file conventions and advanced routing

> Next.js 15 App Router.

## The short answer

Routing is **driven by the filesystem**, and specially-named files give a folder
its behaviour:

| File | Purpose |
|---|---|
| `page.js` | The route's UI — **this is what makes a folder routable** |
| `layout.js` | Shared shell; **preserves state** across navigation |
| `template.js` | Like layout but **remounts** every navigation |
| `loading.js` | Suspense fallback for the segment |
| `error.js` | Error boundary (**must be a Client Component**) |
| `not-found.js` | UI for `notFound()` |
| `route.js` | API endpoint (cannot coexist with `page.js`) |

A folder without `page.js` or `route.js` is **not** a route — it just organises
files. That is how you colocate components inside the app directory safely.

## layout vs template — the distinction that gets asked

A **layout does not re-render** when you navigate between its children.
Scroll position, form state, open/closed accordions and running animations all
persist.

```
/dashboard/settings  →  /dashboard/billing
   layout.js stays mounted; only the page swaps
```

That is a genuine improvement over `_app.js`, which re-rendered on every route
change — a sidebar's scroll position used to reset on navigation.

A **template remounts** on every navigation. Use it when you *want* that: enter
animations that should replay, or per-route effects that must re-fire.

## Route groups and private folders

```
app/(marketing)/about/page.js   →  /about        parentheses are NOT in the URL
app/(app)/dashboard/page.js     →  /dashboard
app/_components/Button.js       →  not a route   underscore = private
```

Route groups exist so you can apply **different layouts to different sections**
without affecting URLs — a marketing layout with a public header, an app layout
with a sidebar, sharing no chrome.

## Dynamic segments

```
app/blog/[slug]/page.js        →  /blog/hello
app/shop/[...slug]/page.js     →  /shop/a/b/c        catch-all
app/shop/[[...slug]]/page.js   →  /shop and /shop/a  optional catch-all
```

**Next 15 breaking change:** `params` and `searchParams` are now **async**:

```js
export default async function Page({ params }) {
  const { slug } = await params        // ← must await in 15
}
```

This catches everyone migrating, and the error message is not always obvious.

## Parallel routes

```
app/@team/page.js
app/@analytics/page.js
app/layout.js   →  ({ children, team, analytics }) => …
```

Render multiple pages in one layout **simultaneously**, each with its own
`loading.js` and `error.js`. A dashboard where one panel can fail or load slowly
without affecting the others.

## Intercepting routes

The clever one:

```
app/feed/page.js
app/feed/@modal/(..)photo/[id]/page.js
```

Navigating to `/photo/123` from the feed shows it **as a modal over the feed**;
loading that URL directly or refreshing shows the **full page**.

That is the Instagram photo behaviour — and it is genuinely hard to build by
hand, because you need the URL to be shareable while the in-app transition stays
contextual.

Matchers: `(.)` same level, `(..)` one level up, `(...)` from the root.

## Navigation

```js
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
```

Note this is **not** `next/router` — different module, different API. There is no
`router.events`, and no `router.query` (use `useSearchParams`).

`<Link>` **prefetches automatically** when it enters the viewport, which is why
App Router navigation feels instant.

**Trap:** `useSearchParams()` in a statically rendered route opts the whole route
into client rendering unless wrapped in `<Suspense>` — and this surfaces as a
**build error**, which surprises people.

## How to answer this out loud

"Routing is filesystem-based, and a folder only becomes a route when it has a
`page.js` or `route.js` — everything else in there is just colocated files.
The distinction I'd highlight is layout versus template: a layout doesn't
re-render when you navigate between its children, so sidebar scroll and form
state persist, which `_app.js` couldn't do. Route groups let you apply different
layouts without changing URLs. And parallel and intercepting routes are the
genuinely new capabilities — intercepting is how you get a shareable photo URL
that opens as a modal in-app but as a full page on refresh."

## Follow-ups to expect

- *How do you share a layout across only some routes?* A route group.
- *Why did my page become client-rendered?* Usually `useSearchParams` without a
  Suspense boundary, or `cookies()`/`headers()` making it dynamic.
- *Can layouts fetch data?* Yes, but they do **not** re-run on navigation between
  children — so layout-level data does not refresh.
