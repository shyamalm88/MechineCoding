# Server Actions

> Stable since Next.js 14.

An async function marked `'use server'` that runs **on the server** but is called
like a normal function from the client — no API route, no fetch, no manual
serialisation.

```js
// app/actions.js
'use server'
export async function createTodo(formData) {
  const text = formData.get('text')
  await db.todo.create({ data: { text } })
  revalidatePath('/todos')
}
```

```jsx
<form action={createTodo}>
  <input name="text" />
</form>
```

## What you get

- **Progressive enhancement** — the form works before JS loads, because it is a
  real form POST. That is genuinely hard to achieve otherwise.
- Colocation: the mutation lives beside the component.
- No API surface to design, version, or secure separately.
- Automatic revalidation when paired with `revalidatePath`/`revalidateTag`.

## `'use server'` vs `'use client'`

Symmetric names, opposite meanings, and constantly confused:

- `'use client'` — this module and its imports go to the **browser**.
- `'use server'` — these exports are **server functions callable from the
  client**. It does *not* mean "run this on the server" (that is already the
  default for RSC).

## The security point that matters most

**A Server Action is a public HTTP endpoint.** Next.js creates a route for it and
sends the id to the browser. Anyone can invoke it with arbitrary arguments.

So every action must independently:

1. **Authenticate** — never trust that the UI only showed the button to admins.
2. **Authorise** — check this user may act on this resource.
3. **Validate input** — with Zod or equivalent; `formData` is attacker-controlled.

```js
'use server'
export async function deletePost(id) {
  const session = await auth()
  if (!session) throw new Error('Unauthorized')
  const post = await db.post.findUnique({ where: { id } })
  if (post.authorId !== session.userId) throw new Error('Forbidden')
  // ...
}
```

Treating an action as "internal" because it is only called from your own
component is the classic mistake.

## Client-side usage

```js
const [state, formAction, isPending] = useActionState(createTodo, null)
const { pending } = useFormStatus()   // inside the <form>, for a submit button
```

Pair with `useOptimistic` for instant feedback with automatic rollback.

## Traps

- Actions are **POST only** and run sequentially per client — not a route to
  parallel data loading.
- Arguments and return values must be serialisable.
- Long-running work blocks the response; use a queue for anything slow.
- Errors thrown in an action surface as a generic message in production; return
  structured error state instead of throwing for expected failures.
