# next/image, next/font, and the Metadata API

Three built-ins that exist to fix specific Core Web Vitals problems.

## next/image — mostly about CLS and LCP

```jsx
<Image src="/hero.jpg" alt="" width={1200} height={600} priority />
```

What it does: modern formats (AVIF/WebP) by content negotiation, responsive
`srcset` generation, lazy loading below the fold, and **reserving space** from
the width/height so the layout does not shift.

**`priority`** disables lazy loading and adds a preload — put it on the LCP
image. Lazy-loading your hero image is a classic own goal that directly worsens
LCP.

`fill` + a positioned parent when dimensions are unknown; `sizes` is then
required or the browser downloads the largest candidate.

Remote images need `remotePatterns` in `next.config.js` — a deliberate
restriction so your optimiser cannot be used to resize arbitrary internet images.

**Cost:** on-demand optimisation is CPU and cache. Self-hosted deployments need
`sharp` and a thought-out cache strategy.

## next/font — eliminating font CLS entirely

```js
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'], display: 'swap' })
```

Fonts are downloaded **at build time and self-hosted** — no request to Google at
runtime, which removes a third-party round trip *and* the GDPR concern.

The real win is automatic **size-adjust fallback metrics**: Next computes a
fallback font adjusted to match the webfont's dimensions, so the swap causes
near-zero layout shift. Doing that by hand is fiddly.

`variable` for a CSS custom property; subset aggressively, since `latin` alone is
a fraction of the full file.

## Metadata API

```js
export const metadata = { title: 'Home', description: '…' }

export async function generateMetadata({ params }) {
  const post = await getPost((await params).slug)
  return { title: post.title, openGraph: { images: [post.image] } }
}
```

Replaces `next/head`. Because it runs on the server, tags are in the **initial
HTML** — which matters for crawlers and link unfurlers that do not execute JS.

`generateMetadata`'s fetches are deduplicated against the page's own fetches, so
it does not double-request.

`opengraph-image.tsx` generates OG images at build/request time with JSX — a
neat trick worth knowing.

**Trap:** metadata exports only work in **Server Components**. Adding
`'use client'` to a page silently kills its metadata.
