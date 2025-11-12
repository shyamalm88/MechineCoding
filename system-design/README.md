# System Design Notes

Large-scale system architecture prep for FAANG interviews.

## Structure

Each `.md` file covers a specific design problem or concept:

```
system-design/
  sample-notes.md          - Template for system design problems
  url-shortener.md         - Design a URL shortener (TinyURL)
  news-feed.md             - Design a social media news feed
  rate-limiter.md          - Design a rate limiting service
  chat-system.md           - Design a real-time chat system
```

## Framework

Use this structure for every system design problem:

1. **Requirements**
   - Functional (what the system does)
   - Non-functional (scale, performance, availability)
   - Assumptions & constraints

2. **High-Level Design**
   - Client → Edge → Services → Storage
   - Key components and data flow

3. **API Design**
   - REST/GraphQL endpoints
   - Request/response schemas

4. **Data Model**
   - Database schema (SQL/NoSQL choice)
   - Indexes, partitioning keys

5. **Scaling**
   - Caching (Redis, CDN)
   - Load balancing
   - Sharding/partitioning
   - Queues (async processing)
   - Backpressure & rate limits

6. **Consistency & Reliability**
   - CAP trade-offs (CP vs AP)
   - Replication strategy
   - Retries, idempotency
   - SLA/SLO targets

7. **Capacity Planning**
   - QPS estimates
   - Storage growth (per day/year)
   - Bandwidth requirements
   - Cache hit rate targets

8. **Security**
   - Authentication & authorization
   - PII handling
   - Encryption (at rest, in transit)
   - GDPR compliance

9. **Evolution**
   - MVP → v2 roadmap
   - Bottlenecks to address
   - Future optimizations

## Tips

- **Start with requirements**: Clarify scope before diving into design
- **Use numbers**: "1M DAU, 100 QPS, 1TB/day" beats vague "lots of users"
- **Trade-offs**: Every choice has pros/cons — articulate them
- **Draw diagrams**: Even ASCII art helps (client → LB → service → DB)
- **Ask questions**: Interviewers expect you to clarify ambiguities
- **Think aloud**: Explain your reasoning as you design

## Common Patterns

- **Read-heavy**: Add caching (Redis, CDN)
- **Write-heavy**: Use message queues, batch writes
- **Global scale**: Multi-region, geo-sharding, CDN
- **Real-time**: WebSockets, polling, Server-Sent Events
- **Analytics**: Data warehouses, OLAP, stream processing
