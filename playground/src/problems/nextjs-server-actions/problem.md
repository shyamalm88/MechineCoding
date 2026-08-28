# Server Actions

> Stable since Next.js 14.

## The short answer

A Server Action is an `async` function marked `'use server'` that **runs on the
server but you call it like a normal function from the client**. No API route to
create, no `fetch`, no JSON serialisation by hand.

```js
// app/actions.js
'use server'

export async function createTodo(formData) {
  const text = formData.get('text')
  await db.todo.create({ data: { text } })
  revalidatePath('/todos')          // refresh any page showing todos
}
```

```jsx
// a component -- note there is no onSubmit, no fetch, no useState
<form action={createTodo}>
  <input name="text" />
  <button>Add</button>
</form>
```

## What it replaces

Before, adding a todo meant writing all of this:

1. an API route (`/api/todos`) with its own validation and error handling
2. a `fetch` call with method, headers, and `JSON.stringify`
3. `useState` for loading and error state
4. manual cache invalidation or a refetch afterwards

The Server Action collapses that into one function plus `action={...}`. Next.js
generates the endpoint, wires up the request, and refreshes the affected data.

## The bit that surprises people: it works without JavaScript

Because it is a real `<form>` with a real `action`, the browser can submit it
natively. If your JS bundle has not loaded yet — slow connection, older device,
a hydration error — **the form still works**. Next.js progressively enhances it
once JS is ready.

That is genuinely hard to achieve with a hand-rolled `onSubmit` + `fetch`, which
does nothing at all until JS runs.

## `'use server'` vs `'use client'`

Symmetric names, opposite meanings, and constantly mixed up:

| Directive | Means |
|---|---|
| `'use client'` | This module and everything it imports ships **to the browser** |
| `'use server'` | These exports are **server functions the client may call** |

`'use server'` does **not** mean "run this on the server" — in the App Router
that is already the default for components. It specifically marks a
*remotely callable* boundary.

## The security point that matters most

**A Server Action is a public HTTP endpoint.** Next.js creates a route for it
and sends an identifier to the browser. Anyone can call it directly, with any
arguments they like, using `curl`.

The fact that your UI only renders the delete button for admins protects
*nothing*. So every action must independently:

1. **Authenticate** — who is this?
2. **Authorise** — may *this user* act on *this resource*?
3. **Validate** — the input is attacker-controlled

```js
'use server'
export async function deletePost(id) {
  const session = await auth()
  if (!session) throw new Error('Unauthorized')

  const post = await db.post.findUnique({ where: { id } })
  if (post.authorId !== session.userId) throw new Error('Forbidden')

  await db.post.delete({ where: { id } })
  revalidatePath('/posts')
}
```

Treating an action as "internal because only my component calls it" is the
classic mistake, and a favourite interview probe.

## Loading and error states

Three hooks pair with actions:

```js
// the result and pending flag of the last run
const [state, formAction, isPending] = useActionState(createTodo, null)

// inside the <form>, read the parent form's pending state
function SubmitButton() {
  const { pending } = useFormStatus()
  return <button disabled={pending}>{pending ? 'Saving…' : 'Save'}</button>
}

// show the change instantly, roll back automatically if it fails
const [optimistic, addOptimistic] = useOptimistic(todos, (s, next) => [...s, next])
```

`useFormStatus` is the neat one: it lets a **child** button know the form is
submitting without threading a prop down.

## Return errors, don't throw them

For *expected* failures ("email already taken"), return a value rather than
throwing:

```js
if (exists) return { error: 'That email is already registered' }
```

Thrown errors are redacted in production — the user gets a generic message and
you get a digest hash in the logs. `useActionState` gives you the returned
object directly, so returning is both safer and easier to render inline.

## Traps

- Actions are **POST only** and run sequentially per client. They are for
  mutations, not for parallel data loading.
- Arguments and return values must be **serialisable** — no functions, no class
  instances.
- Long-running work blocks the response; hand it to a queue instead.
- Forgetting `revalidatePath`/`revalidateTag` means the mutation succeeds but
  the UI still shows stale data.

## How to answer this out loud

"A Server Action is an async function marked `'use server'` that the client can
call directly — Next generates the endpoint. Because it's wired to a form's
`action`, it works before JS loads, which gives you progressive enhancement for
free. The key thing I'd stress is that it's a public endpoint: the UI hiding a
button is not authorisation, so every action has to authenticate, authorise and
validate on its own."

## Follow-ups to expect

- *How do you show a loading spinner?* `useActionState`'s `isPending`, or
  `useFormStatus` in a child.
- *How do you do optimistic UI?* `useOptimistic`, which reverts automatically on
  failure.
- *When would you still write an API route?* External consumers — webhooks,
  mobile apps, third parties — anything not calling from your own React tree.
