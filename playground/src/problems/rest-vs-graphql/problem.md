# REST vs GraphQL trade-offs

## The problems GraphQL set out to solve

- **Over-fetching** — REST returns a fixed shape; you take the whole user
  object to display a name.
- **Under-fetching / waterfalls** — a screen needs user → posts → comments as
  three sequential round trips. GraphQL fetches the graph in one.

```graphql
query { user(id: 1) { name posts(last: 5) { title comments { body } } } }
```

## What you give up

- **HTTP caching.** REST gets it free — URLs are cache keys, and CDNs, browsers
  and proxies all understand them. GraphQL POSTs everything to `/graphql`, so
  you need client-side normalised caching (Apollo, Relay, urql) instead.
- **Simplicity.** Schema, resolvers, and a type system to maintain.
- **Predictable cost.** A single malicious deeply-nested query can be
  catastrophically expensive. You need depth limiting, complexity scoring, and
  persisted queries.
- **The N+1 problem.** Naive resolvers issue one DB query per node; DataLoader
  batching is effectively mandatory, not optional.

## Error semantics differ

GraphQL commonly returns **HTTP 200 with an `errors` array**, including partial
successes — data for some fields, errors for others. Clients that only check
`response.ok` silently swallow failures.

## Choosing

- Many varied clients (mobile, web, third party) with different data needs, and
  a deeply relational graph → GraphQL earns its complexity.
- A handful of endpoints, cache-heavy public content, or a small team → REST is
  usually the better engineering trade.

"It depends" is fine here **if** you name the axis: client diversity and graph
depth versus caching and operational simplicity.
