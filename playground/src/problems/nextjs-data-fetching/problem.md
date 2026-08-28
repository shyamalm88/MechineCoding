# Data fetching patterns in the App Router

## The short answer

Fetch **where you use it**. There is no `getServerSideProps` to funnel
everything through:

```jsx
async function UserProfile({ id }) {
  const user = await fetch(`${API}/users/${id}`).then(r => r.json())
  return <h1>{user.name}</h1>
}
```

No `useEffect`, no loading state, no props drilling. Two components fetching the
same URL in one render are **deduplicated** by Request Memoization, so
colocation costs nothing.

That inverts the Pages Router instinct of lifting data fetching to the top —
here, lifting it is the anti-pattern.

## The most common performance bug: waterfalls

```js
// ✗ sequential — 400ms
const user = await getUser(id)
const posts = await getPosts(id)

// ✓ parallel — 200ms
const [user, posts] = await Promise.all([getUser(id), getPosts(id)])
```

`await` on its own line looks harmless and reads naturally, which is exactly why
this slips through review. Anything not *actually* dependent should be
parallelised.

A **genuine** dependency (you need `user.teamId` before fetching the team) is a
real waterfall — there, the fix is separate Suspense boundaries so the rest of
the page does not wait.

## The trick worth knowing: start without awaiting

```js
const postsPromise = getPosts(id)      // starts NOW
const user = await getUser(id)         // runs concurrently
const posts = await postsPromise       // already in flight
```

You get parallelism without restructuring into `Promise.all`, which is useful
when the two results are consumed at different points.

## The four ways to cache

```js
// 1. fetch — Data Cache (NOT cached by default in Next 15)
fetch(url, { next: { revalidate: 60, tags: ['posts'] } })

// 2. non-fetch, per request
import { cache } from 'react'
export const getUser = cache(async (id) => db.user.findUnique({ where: { id } }))

// 3. non-fetch, persistent
const getPosts = unstable_cache(async () => db.post.findMany(), ['posts'], { tags: ['posts'] })

// 4. opt out entirely
import { unstable_noStore as noStore } from 'next/cache'
```

**The Data Cache only covers `fetch`.** A direct database call is not cached by
anything unless you wrap it — a very common misunderstanding, because people
assume "Next caches my data".

React's `cache()` gives per-request memoization (the same dedup `fetch` gets);
`unstable_cache` persists across requests.

## Route Handlers

```js
// app/api/items/route.js
export async function GET(request) {
  return Response.json(await getItems())
}
```

Standard Web `Request`/`Response`. **Next 15: `GET` handlers are no longer
cached by default.**

**The anti-pattern:** a Server Component calling your *own* Route Handler.

```js
// ✗ inside a Server Component
const data = await fetch('http://localhost:3000/api/items').then(r => r.json())
```

That is an extra HTTP round trip to your own server, plus serialisation, for
nothing. Call the data layer directly. Route Handlers are for **external**
consumers — webhooks, mobile clients, third parties.

## Client-side fetching still has a place

Server fetching is not always right. Use React Query/SWR for:

- data that changes while the user watches (polling, websockets)
- infinite scroll and interaction-driven pagination
- anything depending on browser state (viewport, geolocation)
- optimistic mutation flows

They compose well: server-render the first page, hydrate a client cache with it,
and let the client own subsequent interaction.

## How to answer this out loud

"You fetch directly in the component that needs it — no `getServerSideProps`,
and duplicate fetches in one render are deduplicated automatically, so
colocation is free. The bug I'd look for first is sequential awaits creating a
waterfall; independent fetches should be `Promise.all`, and genuinely dependent
ones want separate Suspense boundaries so the rest of the page streams. A
misconception worth flagging is that the Data Cache only covers `fetch` — a
direct DB query needs React's `cache()` or `unstable_cache`. And calling your own
Route Handler from a Server Component is an extra hop for nothing."

## Follow-ups to expect

- *How do you handle a slow third-party API?* Suspense boundary plus a cached
  fetch with a tag, and a fallback if it fails.
- *Where do you put auth checks?* In the data-access layer, so every path is
  covered.
- *How do you avoid a client waterfall too?* Prefetch on the server and pass the
  data as initial state to the client cache.
