# REST vs GraphQL trade-offs

## The short answer

GraphQL solves two real REST problems — **over-fetching** and **waterfalls** —
and pays for it by **giving up HTTP caching** and adding operational complexity.

Neither is "better". The axis that decides is: *how varied are your clients'
data needs, and how much do you rely on HTTP caching?*

## The problems GraphQL set out to solve

**Over-fetching** — REST returns a fixed shape:

```
GET /users/1   → 40 fields, and you needed the name
```

**Under-fetching / waterfalls** — a screen needs user → posts → comments:

```
GET /users/1            (200ms)
GET /users/1/posts      (200ms)  ← can't start until the first returns
GET /posts/*/comments   (200ms)
                        = 600ms of sequential round trips
```

GraphQL fetches the whole graph in one request:

```graphql
query { user(id: 1) { name posts(last: 5) { title comments { body } } } }
```

For a mobile client on high latency, that difference is the entire pitch.

## What you give up

**HTTP caching.** This is the big one. REST gets it free — the URL *is* the
cache key, and browsers, CDNs and proxies all understand it. GraphQL POSTs
everything to `/graphql`, so every request looks identical to a cache.

You replace it with **client-side normalised caching** (Apollo, Relay, urql),
which is powerful but is now *your* problem, and gives you nothing at the CDN
edge.

**Predictable cost.** A single deeply-nested query can be catastrophically
expensive:

```graphql
{ users { friends { friends { friends { … } } } } }
```

You need depth limiting, complexity scoring, and ideally **persisted queries**
(clients send a hash of an allow-listed query) — which, note, gets you back
towards fixed endpoints.

**The N+1 problem.** Naive resolvers issue one DB query per node: fetching 50
posts with authors means 51 queries. **DataLoader-style batching is effectively
mandatory**, not optional.

## Error semantics differ

GraphQL commonly returns **HTTP 200 with an `errors` array**, including partial
successes — some fields resolved, others failed:

```json
{ "data": { "user": { "name": "Ada", "posts": null } },
  "errors": [{ "message": "posts unavailable" }] }
```

A client that only checks `response.ok` silently swallows failures. This bites
teams migrating from REST.

## Choosing

| Situation | Lean |
|---|---|
| Many varied clients (web, iOS, Android, partners) | GraphQL |
| Deeply relational data, mobile latency matters | GraphQL |
| Public, cache-heavy content | REST |
| Small team, handful of endpoints | REST |
| File uploads, streaming | REST |

## "It depends" — said properly

That answer is fine **if you name the axis**: client diversity and graph depth
versus caching and operational simplicity. Saying "it depends" without naming
what it depends on is what interviewers penalise.

Worth mentioning: **tRPC** for a TypeScript monorepo gives you type-safe RPC
without a schema language, and REST + **BFF** (backend-for-frontend) solves
over-fetching for a specific client without adopting GraphQL wholesale.

## How to answer this out loud

"GraphQL fixes over-fetching and request waterfalls by letting the client
describe exactly the graph it needs in one request — which matters most with
many different clients and high-latency mobile. The cost is that you lose HTTP
caching, because everything is a POST to one endpoint, so you take on normalised
client caching and get nothing at the CDN. You also need depth limiting and
DataLoader batching or a single query can melt your database. For public
cache-heavy content or a small set of endpoints I'd stay with REST, and I'd
mention a BFF as the middle ground."

## Follow-ups to expect

- *How do you cache GraphQL?* Normalised client cache, persisted queries with
  GET so the CDN can cache, or server-side response caching per query hash.
- *How do you version it?* You generally don't — add fields, deprecate old ones.
- *What is the N+1 fix?* DataLoader: batch the ids collected in one tick into a
  single query.
