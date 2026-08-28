# Error handling and loading states in the App Router

## The short answer

Error and loading UI are **file conventions** rather than components you wire up:

```
app/dashboard/
  loading.js        → Suspense fallback for this segment
  error.js          → error boundary for this segment
  not-found.js      → rendered by notFound()
app/global-error.js → catches errors in the ROOT layout
```

Next wraps your `page.js` in the corresponding boundary automatically.

## error.js must be a Client Component

```jsx
'use client'

export default function Error({ error, reset }) {
  useEffect(() => { logToService(error) }, [error])
  return (
    <div>
      <h2>Something went wrong</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}
```

It **must** be a Client Component because error boundaries are class components
with lifecycle methods — server-side there is no such mechanism.

`reset()` re-renders the segment, which is what makes recovery possible without a
full page reload. Note it only helps if the cause was transient; a deterministic
error will immediately re-throw.

## What each boundary actually catches

The asymmetry that surprises everyone:

> **`error.js` catches errors in its own segment's `page` and children — but
> NOT in its own `layout.js`.**

The layout sits *outside* the boundary (the boundary is rendered *by* the
layout), so a layout that throws escapes to the **parent** segment's error
boundary.

```
app/error.js              ← catches app/dashboard/layout.js throwing
app/dashboard/error.js    ← catches app/dashboard/page.js throwing
```

`global-error.js` is the last resort for root-layout failures, and it must
render its own `<html>` and `<body>` — because the root layout is precisely what
failed.

## Production messages are redacted

Server error messages are **not** sent to the browser in production. You get a
generic message plus a `digest` hash to correlate with your server logs.

That is deliberate — messages leak schema names, file paths and query structure —
and it is why real logging in `error.js` is not optional. Relying on what users
report will tell you nothing.

## Expected vs unexpected errors

Do not throw for things you expect to happen:

```js
// ✗ generic 500 UI, message redacted, user learns nothing
throw new Error('Email already in use')

// ✓ renderable, specific, inline
return { error: 'That email is already registered' }
```

Throwing is for genuinely exceptional conditions. `useActionState` hands you the
returned value directly, so structured errors are easy to display next to the
field that caused them.

## notFound() and redirect() throw

```js
import { notFound, redirect } from 'next/navigation'
if (!post) notFound()
```

Both work by **throwing a special error** the framework catches. Two
consequences:

**A `try/catch` around them swallows the control flow** and silently breaks the
redirect:

```js
try {
  redirect('/login')     // ✗ caught by your own catch — nothing happens
} catch (e) {
  console.error(e)
}
```

This is a genuinely common bug, and the symptom (a redirect that does nothing)
gives no hint about the cause.

**Inside a streamed Suspense boundary the status code has already been sent**, so
`notFound()` changes the UI but cannot produce a real 404 — which matters for
SEO and monitoring.

## How to answer this out loud

"Loading and error UI are file conventions — `loading.js` wraps the segment in
Suspense, `error.js` is an error boundary, and it has to be a Client Component
because boundaries are classes. The asymmetry worth knowing is that `error.js`
doesn't catch errors in its own layout, since the layout renders the boundary —
those go to the parent segment, and `global-error.js` is the root fallback.
Production redacts server error messages to a digest, so logging in the boundary
is essential. And `notFound()` and `redirect()` work by throwing, so wrapping
them in a try/catch silently breaks them."

## Follow-ups to expect

- *How do you show a retry?* `reset()`, ideally with a `key` change so a
  deterministic error does not immediately recur.
- *Where do you log?* An effect in `error.js`, sending the digest plus context.
- *How do you handle errors in Server Actions?* Return structured error state for
  expected failures; throw only for the exceptional.
