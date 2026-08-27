# Next.js rendering strategies: SSG, SSR, ISR, PPR

> Written against Next.js 15 / App Router. This area changes fast — verify
> details against the current docs.

## The four

| | When HTML is built | Freshness | Use for |
|---|---|---|---|
| **SSG** (static) | Build time | Stale until rebuild | Docs, marketing, blogs |
| **SSR** (dynamic) | Every request | Always fresh | Personalised, auth'd pages |
| **ISR** | Build, then regenerated | Stale up to `revalidate` | Catalogues, articles |
| **PPR** | Static shell + streamed dynamic holes | Both, per-region | Mostly-static pages with a personalised part |

## How you choose in the App Router

Rendering is **inferred from what you use**, not declared:

```js
export const dynamic = 'force-dynamic'   // opt out of static
export const revalidate = 60             // ISR: regenerate at most every 60s
export const dynamic = 'force-static'
```

Touching `cookies()`, `headers()`, or `searchParams` makes a route **dynamic
automatically**, because the output now depends on the request. A very common
surprise: adding one `cookies()` call silently converts a static page to
per-request rendering.

## ISR in detail

`revalidate: 60` is **stale-while-revalidate**, not "rebuild every 60s":

1. Request arrives; cached HTML is served **immediately** (even if stale).
2. If older than 60s, a regeneration is triggered **in the background**.
3. The *next* request gets the fresh copy.

So the user never waits — but the first visitor after expiry still sees stale
content. That is the trade, and it is the detail people miss.

`revalidatePath('/blog')` / `revalidateTag('posts')` give on-demand invalidation
from a webhook or Server Action, which is usually better than a short timer.

## Partial Prerendering (PPR)

A static shell is served instantly, with dynamic regions streamed in as they
resolve — the holes are the `<Suspense>` boundaries. It removes the
all-or-nothing choice at the *page* level.

Still experimental at the time of writing; check its status before proposing it.

## `generateStaticParams`

Pre-render dynamic routes at build:

```js
export async function generateStaticParams() {
  return posts.map(p => ({ slug: p.slug }))
}
```

`dynamicParams` (default `true`) decides whether an unlisted slug renders on
demand or 404s. Pre-rendering 100k pages is a build-time trap — pre-render the
popular ones and let the long tail be dynamic.

## The interview answer

Do not recite definitions. Say: **how fresh must this be, and can it be the same
for everyone?** Same for everyone + tolerates staleness → static/ISR.
Per-user or must be current → dynamic. Mostly the former with a small
personalised region → PPR or a client component fetching after load.
