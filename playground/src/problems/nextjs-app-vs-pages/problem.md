# App Router vs Pages Router

> Next.js 15. Both routers are supported and can coexist in one app.

## The fundamental difference

**Pages Router**: every component is a Client Component. Data fetching is a
special export (`getServerSideProps`, `getStaticProps`) that runs on the server
and passes serialised props down.

**App Router**: components are **Server Components by default**. Data fetching is
just `await` inside the component. `'use client'` opts a subtree into the client.

## Mapping

| Pages | App |
|---|---|
| `pages/about.js` | `app/about/page.js` |
| `_app.js` / `_document.js` | `app/layout.js` (root) |
| `getServerSideProps` | `await` in a Server Component + `dynamic = 'force-dynamic'` |
| `getStaticProps` | `await` + default caching |
| `getStaticPaths` | `generateStaticParams` |
| `pages/api/*` | `app/api/*/route.js` |
| `next/head` | `metadata` export / `generateMetadata` |
| `useRouter` (`next/router`) | `useRouter`/`usePathname`/`useSearchParams` (`next/navigation`) |

## What the App Router buys

- **Less client JS** — server-only components never ship.
- **Nested layouts that preserve state** across navigation. `_app.js` could not
  do this; a sidebar's scroll position survives a route change.
- **Streaming** via `loading.js` and `<Suspense>`, so a slow section does not
  block the whole page.
- **Colocated conventions**: `error.js`, `not-found.js`, `template.js`.
- Server Actions — mutations without an API route.

## What it costs

- A genuinely new mental model; "which side does this run on?" is a constant
  question and a real source of bugs.
- Caching was aggressive and confusing by default (softened in 15).
- Some libraries still assume client rendering and need `'use client'` wrappers.
- More boilerplate for simple interactive pages.

## Choosing

New projects: App Router — it is where the work is going. Existing Pages apps:
migrate **incrementally** if there is a reason (bundle size, streaming, layouts).
They interoperate, so a rewrite is not required. "Rewrite everything because it
is new" is the wrong answer.

## Gotchas worth naming

- `useRouter` from `next/navigation` has a **different API** to `next/router` —
  no `router.events`, and `query` is gone (use `useSearchParams`).
- `useSearchParams()` in a statically rendered route opts it into client
  rendering unless wrapped in `<Suspense>`.
- Layouts do **not** re-render on navigation between their children — which is
  the feature, but it means layout-level data does not refetch.
