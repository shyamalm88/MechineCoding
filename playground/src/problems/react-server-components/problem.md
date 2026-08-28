# React Server Components (RSC) overview

## The short answer

A Server Component **runs only on the server**. Its code is never sent to the
browser — the client receives the *rendered output* as a serialised stream, not
JavaScript to execute.

The practical consequence: a component using a 300KB markdown parser adds
**zero bytes** to your bundle.

## Not the same as SSR

The single most common confusion:

| | SSR | Server Components |
|---|---|---|
| Component JS sent to browser | **Yes** | **No** |
| Runs on the client | Yes (hydration) | **Never** |
| Output | HTML string | Serialised element stream |
| Can hold state | Yes | **No** |

SSR renders your components to HTML on the server **and then ships those same
components** so the browser can hydrate them. You pay for the code twice —
once as HTML, once as JavaScript.

RSC removes them from the bundle entirely. There is nothing to hydrate because
there is no client-side counterpart.

## What you gain

**Zero bundle cost for server-only work.** Date formatting, markdown rendering,
syntax highlighting, heavy validation — all free at the client.

**Direct data access, no API layer:**

```jsx
async function Post({ id }) {
  const post = await db.post.findUnique({ where: { id } })   // straight to the DB
  return <article>{post.body}</article>
}
```

No route to write, no fetch, no loading state, no client-side waterfall — and
secrets stay on the server because that code never leaves it.

## The rules

Server Components **cannot**:

- use `useState`, `useReducer`, `useEffect` or any hook with state/lifecycle
- attach event handlers (`onClick`, `onChange`)
- use browser APIs (`window`, `localStorage`)

Anything interactive needs `'use client'`.

**Props crossing the boundary must be serialisable.** Passing a function to a
Client Component throws — which trips people constantly, because passing
callbacks down is such an ingrained React habit.

## The composition trick that makes it usable

A Client Component **cannot import** a Server Component. But it can **receive
one as `children`**:

```jsx
// page.js — server
<ClientTabs>
  <ServerRenderedPanel />     {/* rendered on the server, passed as a slot */}
</ClientTabs>
```

The server renders the panel and passes the resulting element through the
boundary. This is how you keep an interactive shell around server-rendered
content, and it is the most useful thing to know about RSC in practice.

## Where the mental model breaks

The hard part is not the API — it is holding "which side does this run on?" in
your head. Common failures:

- adding `'use client'` too high, quietly shipping the whole subtree
- reaching for `useState` in what turns out to be a Server Component
- assuming a server module is safe when a client file imports it
  (`import 'server-only'` turns that into a build error instead of a leak)

## Trade-offs

Requires a framework with a compatible bundler and router — Next.js App Router,
React Router 7. You cannot bolt RSC onto a plain Vite SPA.

And it moves work to your servers: rendering that used to happen on the user's
device now costs you CPU and needs caching.

## How to answer this out loud

"Server Components run only on the server and their code never ships to the
browser, so they're different from SSR — SSR renders to HTML and *also* sends
the components for hydration. That means you can use a heavy library or query
the database directly with no bundle cost and no API layer. The constraints are
no state, no effects, no event handlers, and props crossing to client components
must be serialisable. The pattern that makes it practical is passing a server
component as `children` to a client one, since a client component can't import
one."

## Follow-ups to expect

- *Does `'use client'` mean client-only?* No — those components still SSR; it
  marks where the *client bundle* begins.
- *How do you fetch data?* `await` directly in the component; Next dedupes
  identical requests within a render.
- *What about state that must be shared?* Lift the interactive part into a
  Client Component and pass server-rendered content into it.
