# App Router vs Pages Router

> Next.js 15. Both are supported and **can coexist in one app**.

## The short answer

The fundamental difference is **what a component is by default**:

- **Pages Router** — every component is a **Client Component**. Data fetching is
  a special export (`getServerSideProps`) that runs on the server and passes
  serialised props down.
- **App Router** — components are **Server Components by default**. Data
  fetching is just `await` inside the component. `'use client'` opts a subtree
  into the browser.

Everything else follows from that.

## The mapping

| Pages | App |
|---|---|
| `pages/about.js` | `app/about/page.js` |
| `_app.js` / `_document.js` | `app/layout.js` (root) |
| `getServerSideProps` | `await` in a Server Component (+ `dynamic = 'force-dynamic'`) |
| `getStaticProps` | `await` with default caching |
| `getStaticPaths` | `generateStaticParams` |
| `pages/api/*` | `app/api/*/route.js` |
| `next/head` | `metadata` export / `generateMetadata` |
| `useRouter` (`next/router`) | `next/navigation` hooks |

## What the App Router buys

**Less client JavaScript.** Server-only components never ship. A page using a
heavy markdown or date library can send zero bytes of it.

**Nested layouts that preserve state.** `_app.js` re-rendered on every route
change; a layout does not. Sidebar scroll position, open accordions and form
state survive navigation — a genuine capability the Pages Router lacked.

**Streaming.** `loading.js` and `<Suspense>` mean a slow section does not block
the whole page.

**Colocated conventions** — `error.js`, `not-found.js`, `template.js` next to the
route they serve.

**Server Actions** — mutations without an API route, with progressive
enhancement.

## What it costs

**A genuinely new mental model.** "Which side does this run on?" becomes a
constant question and is a real source of bugs — `useState` in a Server
Component, `window` on the server, a callback passed across the boundary.

**Caching was aggressive and confusing** by default in 13/14 (softened in 15),
and most tutorials online still describe the old behaviour.

**Ecosystem friction.** Some libraries still assume client rendering and need a
`'use client'` wrapper file.

**More ceremony for simple interactive pages** — a small dashboard that is
interactive throughout gains little and pays the complexity.

## Choosing

**New projects:** App Router. It is where the framework's investment is going,
and RSC/streaming/Server Actions are only there.

**Existing Pages apps:** migrate **incrementally, and only if there is a
reason** — bundle size, streaming, or nested layouts. They interoperate route by
route, so a big-bang rewrite is unnecessary and unwise.

"Rewrite everything because it's new" is the wrong answer, and interviewers
listen for it.

## Gotchas worth naming

- **`useRouter` from `next/navigation` has a different API** to `next/router`:
  no `router.events`, no `router.query` (use `useSearchParams`).
- `useSearchParams()` opts a static route into client rendering unless wrapped
  in `<Suspense>`.
- **Layouts do not re-render on navigation between children** — which is the
  feature, but it means layout-level data does not refetch.
- `params` and `searchParams` are **async in Next 15**.

## How to answer this out loud

"The core difference is the default: in the Pages Router everything is a client
component and data fetching is a special export; in the App Router components
are Server Components by default and you just `await` in them. That gets you less
client JavaScript, nested layouts that preserve state across navigation, and
streaming. The costs are a genuinely new mental model about which side code runs
on, and caching defaults that changed between versions. For a new project I'd
use App Router; for an existing Pages app I'd migrate incrementally and only
where there's a concrete reason, since they interoperate per route."

## Follow-ups to expect

- *Can they coexist?* Yes — route by route, which is what makes incremental
  migration practical.
- *What's the hardest part of migrating?* Data fetching, and finding where
  `'use client'` boundaries should sit.
- *Is the Pages Router deprecated?* Not deprecated, but not where new features
  land.
