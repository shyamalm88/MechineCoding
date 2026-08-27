# Data fetching patterns in the App Router

## Fetch where you use it

```jsx
async function UserProfile({ id }) {
  const user = await fetch(`/api/users/${id}`).then(r => r.json())
  return <h1>{user.name}</h1>
}
```

No `useEffect`, no loading state, no `getServerSideProps` plumbing. Two
components fetching the same URL in one render are **deduplicated** by Request
Memoization, so colocation does not cost extra requests — which is why the
"lift data fetching to the top" instinct from the Pages Router is now wrong.

## Parallel vs sequential

The most common performance bug in App Router code:

```js
// ✗ waterfall — 400ms
const user = await getUser(id)
const posts = await getPosts(id)

// ✓ parallel — 200ms
const [user, posts] = await Promise.all([getUser(id), getPosts(id)])
```

A **genuine** dependency (you need `user.teamId` to fetch the team) is a real
waterfall — the fix there is separate Suspense boundaries so the rest of the page
does not wait.

Also: starting a promise **without awaiting it**, then awaiting later, lets
independent work overlap:

```js
const postsPromise = getPosts(id)      // starts now
const user = await getUser(id)
const posts = await postsPromise       // already in flight
```

## Caching non-fetch data

The Data Cache only covers `fetch`. A direct database call needs:

```js
import { cache } from 'react'
export const getUser = cache(async (id) => db.user.findUnique({ where: { id } }))
```

`cache()` memoizes **per request** (like fetch's memoization).
`unstable_cache` persists across requests, like the Data Cache.

## Client-side fetching still has a place

Server fetching is not always right. Use a client fetch (React Query / SWR) for:

- data that changes while the user watches (polling, websockets)
- infinite scroll and pagination driven by interaction
- anything depending on browser state (viewport, geolocation)
- optimistic mutation flows

The two compose well: server-render the first page, hydrate a client cache with
it, and let the client own subsequent interaction.

## Route Handlers

```js
// app/api/items/route.js
export async function GET(request) {
  return Response.json(await getItems())
}
```

Standard `Request`/`Response`. **Next 15: `GET` handlers are no longer cached by
default.**

Note that a Server Component calling your own Route Handler is usually
pointless — an extra HTTP hop to your own server. Call the data layer directly;
Route Handlers are for *external* consumers (webhooks, mobile clients, third
parties).
