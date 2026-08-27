# Server vs Client Components in Next.js

> Next.js 15 App Router.

## The default is server

Every component under `app/` is a **Server Component** unless it (or an ancestor
in the import graph) has `'use client'`.

Server Components:
- run only on the server; their code is **never sent to the browser**
- can `await` directly, query a database, read secrets
- **cannot** use state, effects, event handlers, or browser APIs

## `'use client'` marks a boundary, not a file

This is the most misunderstood part. `'use client'` does not mean "this one
component is a client component" — it means **everything imported from here
down** is in the client bundle.

```js
'use client'
import HeavyChart from './HeavyChart'   // now client-side too
```

So placing the directive too high in the tree quietly ships your whole app to
the browser. **Push it to the leaves** — the interactive bits.

## Composing across the boundary

A Client Component cannot *import* a Server Component. But it can **receive one
as `children`**:

```jsx
// app/page.js  (server)
<ClientTabs>
  <ServerRenderedPanel />     {/* rendered on the server, passed as a slot */}
</ClientTabs>
```

The server renders the panel and passes the resulting element through. That
pattern is how you keep an interactive shell around server-rendered content, and
it is the single most useful thing to know here.

## Props must be serialisable

Anything crossing the boundary is serialised: no functions, no class instances,
no `Date`… (dates actually survive; functions do not). Passing a callback to a
Client Component throws.

The exception is a **Server Action**, which is a function reference the framework
knows how to send as an id.

## Server Components ≠ SSR

| | SSR (Pages) | Server Components |
|---|---|---|
| Component JS shipped | Yes | **No** |
| Runs on client | Yes (hydration) | Never |
| Output | HTML | Serialised element stream |

SSR renders your components to HTML *and then ships them* to hydrate. RSC removes
them from the bundle entirely.

## Traps

- `useState` in a Server Component → build error. Usually means a missing
  `'use client'`, or state that belongs one level down.
- Reading `window` in a Server Component → crash. Guard, or move to the client.
- A `'use client'` file importing a server-only library leaks it into the bundle
  — `import 'server-only'` makes that a build error instead of a silent leak.
- Third-party components using hooks need a `'use client'` wrapper file.
