# next/image, next/font, and the Metadata API

## The short answer

Three built-ins, each fixing a **specific Core Web Vitals problem**:

| Built-in | Fixes |
|---|---|
| `next/image` | LCP (format, sizing, priority) and CLS (reserved space) |
| `next/font` | CLS from font swap, plus a third-party round trip |
| Metadata API | SEO — tags must be in the initial HTML |

## next/image

```jsx
<Image src="/hero.jpg" alt="" width={1200} height={600} priority />
```

What it does for you:

- **Modern formats** — serves AVIF/WebP by content negotiation, falling back
  automatically
- **Responsive `srcset`** — generates sizes so a phone does not download a
  desktop image
- **Lazy loading** below the fold
- **Reserves space** from `width`/`height`, so the layout never jumps

**`priority` is the one that matters most.** It disables lazy loading and adds a
preload — put it on the LCP image.

Lazy-loading your hero image is a classic own goal: `loading="lazy"` delays the
very element LCP measures, so the metric gets *worse* from an optimisation.

`fill` when dimensions are unknown, but then `sizes` is required — without it
the browser assumes 100vw and downloads the largest candidate.

Remote images need `remotePatterns` in `next.config.js`. That is a deliberate
restriction: without it your optimiser becomes an open image-resizing proxy for
anyone on the internet.

**Cost:** on-demand optimisation is CPU and cache. Self-hosted deployments need
`sharp` installed and a real cache strategy, or the first request for every size
is slow.

## next/font

```js
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'], display: 'swap' })
```

Fonts are downloaded **at build time and self-hosted**. Two wins immediately:
no runtime request to Google (a whole origin's DNS + TLS + fetch removed), and
no GDPR question about visitor IPs going to Google.

The bigger win is subtler: Next computes a **metrics-adjusted fallback font** —
`size-adjust`, `ascent-override` and friends tuned so the fallback occupies
almost exactly the same space as the real font. The swap then causes **near-zero
layout shift**.

Doing that by hand means measuring both fonts and calculating override
percentages. Getting it free is the actual reason to use `next/font`.

Subset aggressively — `latin` alone is a fraction of the full file.

## Metadata API

```js
export const metadata = { title: 'Home', description: '…' }

export async function generateMetadata({ params }) {
  const post = await getPost((await params).slug)
  return { title: post.title, openGraph: { images: [post.image] } }
}
```

Replaces `next/head`. Because it runs on the server, tags are in the **initial
HTML** — which matters because crawlers and link unfurlers (Slack, Twitter,
WhatsApp) generally do **not** execute JavaScript. Client-side-injected meta tags
are invisible to them.

`generateMetadata`'s fetches are **deduplicated against the page's own fetches**,
so asking for the post in both places costs one request.

`opengraph-image.tsx` generates OG images at build or request time using JSX —
a neat trick worth knowing about.

**Trap:** metadata exports only work in **Server Components**. Adding
`'use client'` to a page silently kills its metadata — no error, the tags just
disappear.

## How to answer this out loud

"They each target a specific vital. `next/image` handles format negotiation,
responsive sizing and reserving space, and `priority` on the LCP image is the
single most impactful flag — lazy-loading the hero actively hurts LCP.
`next/font` self-hosts at build time, which removes a third-party round trip,
and more importantly generates a metrics-matched fallback so the font swap
causes almost no layout shift. The Metadata API puts tags in the initial HTML,
which matters because crawlers and unfurlers don't run JavaScript — and the
gotcha is that it only works in Server Components, so `'use client'` on a page
silently removes it."

## Follow-ups to expect

- *When would you not use `next/image`?* An SVG icon, or when you already have a
  dedicated image CDN doing the same work.
- *How do you avoid CLS with ads?* Reserve the slot dimensions up front — same
  principle as images.
- *How do you set metadata for a dynamic route?* `generateMetadata`, which can
  await the same data the page uses.
