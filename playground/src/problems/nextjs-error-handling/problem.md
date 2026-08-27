# Error handling and loading states in the App Router

## The file conventions

```
app/dashboard/
  error.js        → error boundary for this segment
  loading.js      → Suspense fallback for this segment
  not-found.js    → rendered by notFound()
app/global-error.js → catches errors in the ROOT layout
```

## error.js must be a Client Component

```jsx
'use client'
export default function Error({ error, reset }) {
  useEffect(() => { logToService(error) }, [error])
  return <button onClick={() => reset()}>Try again</button>
}
```

It must be a Client Component because error boundaries are class components with
lifecycle methods — server-side there is no such mechanism.

`reset()` re-renders the segment, which is what makes recovery possible without a
full page reload.

## What each boundary catches

**`error.js` catches errors in its own segment's `page` and children — not in
its own `layout.js`.** The layout is *outside* the boundary, so a layout that
throws escapes to the parent segment's error boundary. That asymmetry surprises
people constantly.

`global-error.js` is the last resort for root-layout failures, and must render
its own `<html>` and `<body>` because the root layout is what failed.

## Production error messages are redacted

Server error messages are **not** sent to the browser in production — you get a
generic message plus a `digest` hash to correlate with your server logs. That is
deliberate (messages leak schema and paths), and it is why you need real logging
rather than relying on what the user reports.

## Expected vs unexpected errors

Do not throw for expected failures. Return them:

```js
// Server Action
if (!valid) return { error: 'Email already in use' }   // ✓ renderable
throw new Error('Email already in use')                // ✗ generic 500 UI
```

Throwing is for genuinely exceptional conditions. `useActionState` gives you the
returned value directly, which makes structured errors easy to render inline.

## notFound() and redirect()

```js
import { notFound, redirect } from 'next/navigation'
if (!post) notFound()
```

Both work by **throwing a special error** the framework catches. Two
consequences:

- A `try/catch` around them **swallows the control flow** and breaks the
  redirect. A very common bug.
- Called inside a streamed Suspense boundary, the status code has already been
  sent, so it cannot produce a real 404/307 — the UI changes but the HTTP status
  does not, which matters for SEO.
