# React Server Components (RSC) overview

## What they are

Components that render **only on the server**. Their code is never sent to the
browser; the client receives the rendered output as a serialised stream, not as
JavaScript to execute.

## Not the same as SSR

| | SSR | RSC |
|---|---|---|
| Ships component JS | Yes | **No** |
| Runs on client | Yes (hydration) | Never |
| Output | HTML string | Serialised element stream |
| Can hold state | Yes | **No** |

SSR renders your components to HTML then ships the same components to hydrate
them. RSC removes them from the bundle entirely.

## What you gain

- **Zero bundle cost.** A large date library used only for formatting on the
  server adds nothing to the client bundle.
- **Direct data access.** Query the database in the component; no API layer, no
  loading state, no client-side waterfall.
- Secrets stay on the server.

## The rules

Server Components **cannot**: use hooks (`useState`, `useEffect`), attach event
handlers, or access browser APIs. Anything interactive needs `'use client'`.

Props crossing the boundary must be **serialisable** — passing a function to a
Client Component throws. This trips people constantly.

Composition still works: a Server Component can pass a Server Component as
`children` to a Client Component, so an interactive shell can wrap server-
rendered content.

## Trade-offs

Requires a framework with a compatible bundler and router (Next.js App Router,
React Router 7). The mental model of which side a component runs on is genuinely
new and a common source of bugs.
