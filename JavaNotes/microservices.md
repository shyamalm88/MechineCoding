---
title: Microservices — Interview Preparation
tags:
  - microservices
  - spring-boot
  - java
  - distributed-systems
  - kafka
  - redis
  - rest
  - resilience
  - api-gateway
  - observability
  - interview
---

# Microservices — Interview Preparation

> [!note]
> This note is designed for a Java/Spring Boot full-stack developer.
>
> You do not need to become a distributed-systems researcher.
>
> You do need to understand how services communicate, fail, scale, secure themselves, own data, and remain observable.
>
> Core mental model:
>
> **Service boundary → API → data ownership → communication → consistency → resilience → observability → deployment**

---

# PART I — FUNDAMENTALS

# 1. What Is a Microservice?

A microservice is a relatively small, independently deployable service organized around a business capability or bounded context.

Typical properties:

```text
independently deployable
business capability oriented
owns its logic
often owns its data
communicates through APIs/events
can scale independently
```

Important:

> "Small service" alone does not make a good microservice.

---

# 2. Monolith vs Microservices

Monolith:

```text
             Application
 ┌─────────────────────────────┐
 │ User │ Order │ Payment │ ...│
 └─────────────────────────────┘
          ↓
       Database
```

Microservices:

```text
User Service     → User DB
Order Service    → Order DB
Payment Service  → Payment DB
Inventory Service→ Inventory DB
```

Microservices introduce independence but also distributed-system complexity.

---

# 3. When Should You Use Microservices?

Good reasons:

```text
independent scaling
independent deployment
clear domain boundaries
large organization/team boundaries
different reliability requirements
different technology/runtime needs
```

Bad reason:

> "Everyone uses microservices."

---

# 4. Monolith Advantages

```text
simple deployment
simple debugging
local transactions
simple calls
easy refactoring
low operational overhead
```

For a small team/product, a modular monolith can be an excellent architecture.

---

# 5. Microservice Costs

```text
network calls
distributed failures
distributed tracing
eventual consistency
deployment complexity
service discovery
configuration
monitoring
security
cross-service transactions
data duplication
```

Senior answer:

> Microservices trade local simplicity for organizational and deployment scalability.

---

# 6. What Is a Service Boundary?

A service boundary should usually follow a business capability/bounded context rather than a technical layer.

Bad:

```text
UserController Service
UserRepository Service
PaymentRepository Service
```

Better:

```text
Order Service
Payment Service
Inventory Service
Notification Service
```

---

# 7. Bounded Context

A bounded context defines where a particular domain model and terminology apply.

For example:

```text
Order
```

may mean:

```text
Order Service → purchase lifecycle
Payment Service → payment transaction
Shipping Service → shipment
```

Do not force one giant universal domain model across services.

---

# 8. Database per Service

Preferred microservice principle:

```text
Order Service
 ↓
Order DB

Payment Service
 ↓
Payment DB
```

Benefits:

```text
ownership
independent scaling
schema independence
failure isolation
```

Costs:

```text
distributed queries
distributed transactions
data duplication
eventual consistency
```

---

# 9. Shared Database

```text
Order Service ─┐
Payment Service├──→ same DB
User Service ──┘
```

This can be practical during migration, but it creates:

```text
coupling
schema coordination
ownership ambiguity
```

It weakens independent service evolution.

---

# 10. API Gateway

Typical:

```text
Client
  ↓
API Gateway
  ↓
Services
```

Gateway responsibilities may include:

```text
routing
authentication
authorization
rate limiting
TLS termination
request aggregation
observability
```

Avoid putting large amounts of business logic into the gateway.

---

# 11. API Gateway vs Load Balancer

Load balancer primarily distributes traffic.

API Gateway can provide higher-level API concerns:

```text
routing
auth
rate limits
aggregation
transformation
```

They can coexist.

---

# 12. Service Discovery

Services need to find other services.

Options:

```text
DNS
service registry
Kubernetes Service
client-side discovery
server-side discovery
```

Kubernetes often provides service discovery through DNS and Services.

---

# 13. Synchronous Communication

Example:

```text
Order Service
    ↓ HTTP
Payment Service
```

Benefits:

```text
simple request/response
immediate result
easy to understand
```

Costs:

```text
latency
availability coupling
cascading failures
```

---

# 14. Asynchronous Communication

```text
Order Service
     ↓
   Kafka
     ↓
Payment Service
```

Benefits:

```text
decoupling
buffering
replay
independent processing
```

Costs:

```text
eventual consistency
debugging complexity
duplicate events
ordering
retry/DLT management
```

---

# 15. REST vs Messaging

REST:

```text
"I need an answer now."
```

Event:

```text
"Something happened."
```

Command:

```text
"Please perform this action."
```

This distinction helps determine communication style.

---

# 16. REST vs gRPC

REST:

```text
HTTP/JSON
widely accessible
browser-friendly
simple debugging
```

gRPC:

```text
HTTP/2
binary serialization
strong contracts
streaming
efficient service-to-service communication
```

For browser-facing APIs, REST is often simpler.

For internal high-performance service-to-service calls, gRPC can be attractive.

---

# PART II — DATA AND CONSISTENCY

# 17. Why Is Database per Service Important?

Because the service should own:

```text
schema
data lifecycle
business rules
```

Other services should ideally access it through:

```text
API
events
```

rather than direct SQL queries.

---

# 18. Distributed Transactions

Suppose:

```text
Order DB
+
Payment DB
```

must commit atomically.

A normal local DB transaction cannot cover both independently.

Options:

```text
2PC
Saga
outbox
compensation
```

---

# 19. Two-Phase Commit

2PC conceptually:

```text
Coordinator
 ↓
prepare
 ↓
all participants agree
 ↓
commit
```

Problem:

```text
coordination
blocking
latency
failure complexity
```

Many microservice architectures prefer eventual consistency and Saga-style workflows instead.

---

# 20. Saga Pattern

A Saga breaks a distributed transaction into local transactions.

Example:

```text
Create Order
 ↓
Reserve Inventory
 ↓
Charge Payment
 ↓
Confirm Order
```

If payment fails:

```text
release inventory
 ↓
cancel order
```

The reverse actions are compensating transactions.

---

# 21. Choreography Saga

Services react to events.

```text
OrderCreated
 ↓
InventoryReserved
 ↓
PaymentCompleted
 ↓
OrderConfirmed
```

Advantages:

```text
less central orchestration
loosely coupled
```

Disadvantages:

```text
event flow becomes hard to understand
business process can become scattered
```

---

# 22. Orchestration Saga

A central orchestrator coordinates:

```text
Order Saga
 ├── reserve inventory
 ├── charge payment
 ├── confirm order
 └── compensate failures
```

Advantages:

```text
central workflow visibility
easier business process reasoning
```

Disadvantages:

```text
orchestrator complexity
central coordination
```

---

# 23. Idempotency

An operation is idempotent when repeating it produces the same intended business outcome.

Example:

```text
POST /payments
Idempotency-Key: abc123
```

If request is retried:

```text
same key
 ↓
same payment result
```

Important for:

```text
retries
network failures
Kafka duplicate delivery
client retries
```

---

# 24. Idempotency Implementation

Possible:

```text
idempotency key
 ↓
database unique constraint
 ↓
stored result
```

Redis can accelerate lookup:

```text
Redis
 ↓
fast duplicate detection
```

But durable correctness often belongs in the database.

---

# 25. Outbox Pattern

Problem:

```text
DB update succeeds
Kafka publish fails
```

Outbox:

```text
DB transaction
 ├── business data
 └── outbox event
        ↓
      COMMIT
        ↓
Outbox Publisher
        ↓
      Kafka
```

This prevents the business update and event record from becoming inconsistent due to a simple dual-write failure.

---

# 26. Inbox Pattern

Consumer receives:

```text
eventId=123
```

Store it:

```text
inbox(eventId)
```

inside the same business transaction.

If event 123 arrives again:

```text
already processed
 ↓
skip
```

Useful for at-least-once delivery.

---

# 27. Eventual Consistency

Microservices often accept:

```text
Service A updated
 ↓
event published
 ↓
Service B eventually updates
```

For a short period:

```text
A = new
B = old
```

This is eventual consistency.

---

# 28. Strong Consistency vs Eventual Consistency

Use strong consistency where correctness requires it:

```text
ledger
inventory constraints
critical state transition
```

Eventual consistency can be acceptable for:

```text
notifications
analytics
search indexes
recommendation data
read models
```

---

# 29. Distributed Cache

Typical:

```text
Service
 ↓
Redis
```

Questions:

```text
What is source of truth?
How is invalidation handled?
What happens when Redis fails?
How stale can data be?
```

---

# PART III — RESILIENCE

# 30. Network Calls Are Not Method Calls

Java method:

```java
paymentService.charge();
```

is typically:

```text
in-process
```

Microservice call:

```text
HTTP POST /payments
```

can fail due to:

```text
network
DNS
timeout
service overload
connection pool
load balancer
serialization
deployment
```

Therefore:

> Treat remote calls as unreliable boundaries.

---

# 31. Timeout

Every remote call should have an appropriate timeout.

Without timeout:

```text
Service B hangs
 ↓
Service A thread waits
 ↓
many requests accumulate
 ↓
thread pool exhaustion
```

Timeouts are a fundamental resilience mechanism.

---

# 32. Retry

Retry transient failures:

```text
temporary network failure
503
connection reset
```

Do not blindly retry:

```text
validation error
authentication failure
business rejection
non-idempotent operation
```

---

# 33. Exponential Backoff

Instead of:

```text
retry immediately
retry immediately
retry immediately
```

use increasing delay:

```text
100ms
200ms
400ms
800ms
...
```

This reduces pressure on a struggling service.

---

# 34. Jitter

If 10,000 clients retry at exactly:

```text
1 second
```

they create another traffic spike.

Jitter randomizes retry timing.

```text
1.0s
1.2s
0.9s
1.4s
...
```

---

# 35. Circuit Breaker

Concept:

```text
CLOSED
 ↓ failures
OPEN
 ↓ timeout
HALF-OPEN
 ↓ test
CLOSED
```

When a dependency is failing repeatedly:

```text
stop sending traffic
```

This prevents cascading failures.

---

# 36. Bulkhead

Separate resources so one dependency cannot consume everything.

Example:

```text
Service
 ├── payment pool
 ├── notification pool
 └── reporting pool
```

If reporting becomes slow:

```text
reporting resources exhausted
```

Payment can continue.

---

# 37. Rate Limiting

Protect services from excessive traffic.

Common algorithms:

```text
fixed window
sliding window
token bucket
leaky bucket
```

Redis is often useful for distributed rate limiting.

---

# 38. Load Shedding

When overloaded, reject some work rather than allowing the entire system to collapse.

Example:

```text
system overloaded
 ↓
return 429/503
```

This protects remaining capacity.

---

# 39. Backpressure

Producer:

```text
100k events/sec
```

Consumer:

```text
20k/sec
```

Without control:

```text
queue/lag grows
```

Backpressure mechanisms:

```text
bounded queues
rate limiting
consumer scaling
batching
load shedding
```

---

# 40. Cascading Failure

Example:

```text
A → B → C → D
```

If D becomes slow:

```text
C waits
 ↓
B waits
 ↓
A waits
```

Soon the whole system can become unhealthy.

Mitigate with:

```text
timeouts
circuit breakers
bulkheads
bounded concurrency
fallbacks
```

---

# 41. Fallback

If recommendation service fails:

```text
Recommendation unavailable
 ↓
return popular products
```

Fallback should be:

```text
safe
useful
bounded
```

Do not hide serious correctness failures with fake fallback data.

---

# PART IV — API DESIGN

# 42. API Versioning

Strategies:

```text
/v1/orders
/v2/orders
```

or:

```text
header versioning
content negotiation
```

URL versioning is easy to understand, but the right strategy depends on organizational API policy.

---

# 43. Backward Compatibility

A new service version should ideally not break old clients.

Safer:

```text
add optional field
```

Risky:

```text
rename/remove field
change meaning
change type incompatibly
```

---

# 44. API Error Model

Use a consistent error format.

Example:

```json
{
  "code": "ORDER_NOT_FOUND",
  "message": "Order does not exist",
  "traceId": "abc123"
}
```

Avoid leaking:

```text
stack traces
database errors
internal secrets
```

---

# 45. API Gateway Aggregation

Client needs:

```text
user
orders
recommendations
```

Instead of three browser calls:

```text
Client
 ↓
Gateway
 ├── User
 ├── Orders
 └── Recommendations
 ↓
combined response
```

This can reduce client complexity and round trips.

Trade-off:

```text
gateway coupling
latency
failure handling
```

---

# 46. Pagination

For large collections:

```text
page + size
```

or preferably for deep pagination:

```text
cursor
```

Cursor pagination often scales better than huge OFFSET queries.

---

# 47. PUT vs PATCH

PUT commonly represents replacement of a resource representation.

PATCH represents partial modification.

Be precise about API semantics rather than saying:

> PUT is always idempotent and PATCH is never idempotent.

HTTP method semantics and implementation determine actual behavior.

---

# 48. API Idempotency

Important operations:

```text
payment
order creation
refund
inventory reservation
```

Use:

```text
Idempotency-Key
```

when clients may retry.

---

# PART V — SERVICE SECURITY

# 49. Authentication vs Authorization

Authentication:

```text
Who are you?
```

Authorization:

```text
What are you allowed to do?
```

---

# 50. Service-to-Service Authentication

Possible:

```text
OAuth2 client credentials
mTLS
signed tokens
service identity
```

Do not assume a private network means trusted traffic.

---

# 51. JWT

JWT can carry claims:

```text
sub
iss
aud
exp
scope
roles
```

Service should validate:

```text
signature
issuer
audience
expiry
```

Do not blindly trust decoded payloads.

---

# 52. Token Propagation

Example:

```text
Client
 ↓ token
Gateway
 ↓ token/context
Order Service
 ↓
Payment Service
```

Be careful about:

```text
audience
scope
token lifetime
least privilege
```

---

# 53. mTLS

Mutual TLS authenticates both sides of a connection.

Useful for:

```text
service identity
encrypted communication
zero-trust environments
```

---

# PART VI — OBSERVABILITY

# 54. Three Pillars

```text
Logs
Metrics
Traces
```

---

# 55. Correlation ID

Request:

```text
X-Request-ID: abc123
```

Propagate it:

```text
Gateway
 ↓ abc123
Order
 ↓ abc123
Payment
 ↓ abc123
Kafka event
```

Then logs can be correlated.

Distributed tracing is generally more powerful than a manually propagated correlation ID alone.

---

# 56. Distributed Tracing

Example:

```text
Trace
 └── Gateway 20ms
      └── Order 50ms
           ├── Redis 2ms
           ├── DB 15ms
           └── Payment 100ms
```

You immediately see:

```text
Payment
```

is the major contributor.

---

# 57. OpenTelemetry

OpenTelemetry provides standard instrumentation concepts for:

```text
traces
metrics
logs
```

It can export telemetry to compatible observability systems.

---

# 58. Metrics

Useful microservice metrics:

```text
request rate
error rate
latency
CPU
memory
DB connections
Kafka lag
Redis hit ratio
queue depth
circuit breaker state
```

---

# 59. SLI / SLO / SLA

SLI:

```text
measured indicator
```

SLO:

```text
target
```

SLA:

```text
contract/commitment
```

Example:

```text
SLI = successful request percentage

SLO = 99.9% success

SLA = contractual commitment
```

---

# PART VII — DEPLOYMENT

# 60. Containerization

Spring Boot:

```text
Docker image
 ↓
container
 ↓
Kubernetes
```

Benefits:

```text
consistent environment
packaging
deployment automation
```

---

# 61. Kubernetes Deployment

Conceptual:

```text
Deployment
 ↓
Pods
 ↓
Spring Boot containers
```

Kubernetes handles:

```text
replicas
rolling deployment
service discovery
health checks
```

---

# 62. Readiness vs Liveness

Readiness:

```text
Should this instance receive traffic?
```

Liveness:

```text
Is this process alive?
```

Do not use liveness to detect every temporary dependency failure.

Otherwise Kubernetes may continuously restart healthy applications.

---

# 63. Graceful Shutdown

During deployment:

```text
instance receives SIGTERM
 ↓
stop accepting new traffic
 ↓
finish in-flight requests
 ↓
close resources
 ↓
exit
```

Spring Boot supports graceful shutdown features.

This matters for:

```text
HTTP requests
Kafka consumers
DB transactions
```

---

# 64. Rolling Deployment

```text
old v1
old v1
old v1

 ↓

old v1
old v1
new v2

 ↓

old v1
new v2
new v2

 ↓

new v2
new v2
new v2
```

Requires backward-compatible APIs/schema during transition.

---

# 65. Blue-Green Deployment

```text
Blue → current
Green → new
```

Switch traffic:

```text
Blue
 ↓
Green
```

Rollback can be fast.

Cost:

```text
duplicate environment capacity
```

---

# 66. Canary Deployment

Send a small percentage of traffic to the new version.

```text
95% → v1
5%  → v2
```

Monitor:

```text
errors
latency
business metrics
```

Then gradually increase.

---

# PART VIII — MICROSERVICE DESIGN PATTERNS

# 67. API Gateway

```text
Client
 ↓
Gateway
 ↓
Services
```

---

# 68. Backend for Frontend (BFF)

Different clients can have tailored APIs:

```text
Web BFF
Mobile BFF
```

Useful when:

```text
client requirements differ significantly
```

---

# 69. Strangler Fig Pattern

Used to migrate a monolith incrementally.

```text
Monolith
 ↓
new service extracts one capability
 ↓
traffic routed to new service
 ↓
repeat
```

This is safer than rewriting everything at once.

---

# 70. Sidecar

A helper process/container runs beside the service.

Common historical/service-mesh uses:

```text
proxy
telemetry
security
network policy
```

---

# 71. Service Mesh

A service mesh can provide infrastructure-level:

```text
traffic management
mTLS
observability
retries
service identity
```

Examples include ecosystems built around Envoy.

But do not add a service mesh merely because the architecture is microservices.

---

# PART IX — MICROSERVICE FAILURE SCENARIOS

# 72. Service B Is Down

Bad:

```text
A → B
```

A waits indefinitely.

Better:

```text
A
 ↓ timeout
 ↓ retry if appropriate
 ↓ circuit breaker
 ↓ fallback
```

---

# 73. Service B Is Slow

This can be more dangerous than B being completely down.

Why?

Because requests accumulate.

```text
B slow
 ↓
A waits
 ↓
threads/connections consumed
 ↓
A becomes slow
 ↓
cascading failure
```

Use:

```text
timeout
bounded concurrency
bulkhead
circuit breaker
```

---

# 74. Service B Returns 500

Ask:

```text
Is failure transient?
Is operation idempotent?
Should we retry?
Should we fallback?
Should we fail fast?
```

Never blindly retry all 500 responses.

---

# 75. Kafka Is Down

If Kafka is asynchronous:

```text
API request
 ↓
DB
 ↓
outbox
 ↓
Kafka temporarily unavailable
```

The business transaction can still succeed if the event remains safely in the outbox.

Publisher retries later.

This is one reason the Outbox pattern is powerful.

---

# 76. Redis Is Down

If Redis is a cache:

```text
Redis unavailable
 ↓
fallback to DB
```

But protect the DB from a cache stampede.

Use:

```text
timeouts
circuit breaker
local cache
request coalescing
rate limiting
```

---

# 77. Database Is Down

Unlike a cache, the database may be the source of truth.

Possible:

```text
fail fast
retry carefully
queue asynchronous commands where appropriate
return degraded response
```

Do not pretend the system succeeded if the business transaction did not commit.

---

# 78. Duplicate Kafka Event

```text
eventId=123
 ↓
processed
 ↓
same event arrives
```

Use:

```text
idempotency
inbox
unique constraint
state/version checks
```

---

# 79. Out-of-Order Event

Suppose:

```text
OrderPaid
OrderCreated
```

arrive in wrong order.

Solutions:

```text
partition by orderId
sequence number
event version
state machine
ignore stale events
buffering
```

---

# 80. Distributed Clock Problem

Do not rely blindly on:

```text
server timestamp A
server timestamp B
```

for ordering distributed events.

Use:

```text
Kafka partition ordering
sequence numbers
database version
logical timestamps
event IDs
```

where appropriate.

---

# 81. Retry Storm

```text
dependency fails
 ↓
10k requests retry
 ↓
dependency becomes more overloaded
 ↓
more failures
 ↓
more retries
```

Mitigate:

```text
exponential backoff
jitter
retry budgets
circuit breakers
load shedding
```

---

# 82. Thundering Herd

A popular cache key expires:

```text
100k requests
 ↓
all miss cache
 ↓
100k DB calls
```

Solutions:

```text
request coalescing
jittered TTL
early refresh
distributed lock
stale-while-revalidate
```

---

# PART X — MICROSERVICE INTERVIEW QUESTIONS

# 83. Fundamentals

1. What is a microservice?
2. Microservice vs monolith?
3. When should you use microservices?
4. What are the disadvantages?
5. What is a bounded context?
6. How do you identify service boundaries?
7. What is database-per-service?
8. Why avoid shared databases?
9. What is an API Gateway?
10. API Gateway vs Load Balancer?
11. What is service discovery?
12. Client-side vs server-side discovery?
13. REST vs messaging?
14. REST vs gRPC?
15. Event vs command?
16. Synchronous vs asynchronous communication?
17. What is eventual consistency?
18. What is strong consistency?

---

# 84. Data / Transactions

19. Why is distributed transaction difficult?
20. What is 2PC?
21. What is Saga?
22. Choreography vs orchestration?
23. What is a compensating transaction?
24. What is idempotency?
25. How do you implement idempotency?
26. What is the Outbox pattern?
27. What is the Inbox pattern?
28. DB + Kafka dual-write problem?
29. How do you handle DB → Kafka reliability?
30. How do you handle Kafka → DB reliability?
31. How do you handle duplicate events?
32. How do you handle out-of-order events?
33. How do you handle stale read models?

---

# 85. Resilience

34. Why are remote calls different from method calls?
35. What is a timeout?
36. How should retries work?
37. When should you NOT retry?
38. What is exponential backoff?
39. What is jitter?
40. What is a circuit breaker?
41. What is bulkhead isolation?
42. What is rate limiting?
43. What is backpressure?
44. What is load shedding?
45. What is a cascading failure?
46. What is a retry storm?
47. What is a thundering herd?
48. What is graceful degradation?

---

# 86. API

49. How do you version APIs?
50. How do you maintain backward compatibility?
51. PUT vs PATCH?
52. How do you implement pagination?
53. Offset vs cursor pagination?
54. How do you design error responses?
55. How do you make POST idempotent?
56. What is API aggregation?
57. What is BFF?
58. How do you handle partial failure in API aggregation?

---

# 87. Security

59. Authentication vs authorization?
60. Service-to-service authentication?
61. OAuth2 client credentials?
62. JWT validation?
63. Token propagation?
64. mTLS?
65. How do you implement least privilege?
66. Should internal services trust each other automatically?

---

# 88. Observability

67. Logs vs metrics vs traces?
68. What is distributed tracing?
69. What is OpenTelemetry?
70. What is correlation ID?
71. What metrics would you monitor?
72. What is consumer lag?
73. What is an SLI?
74. What is an SLO?
75. What is an SLA?
76. How do you debug a slow request across 5 services?

---

# 89. Deployment

77. What is rolling deployment?
78. Blue-green vs canary?
79. What is graceful shutdown?
80. Readiness vs liveness?
81. What happens during Kubernetes pod termination?
82. How do you avoid breaking API compatibility during deployment?
83. How do you perform zero-downtime DB migration?
84. What is Strangler Fig?

---

# 90. Senior Scenario Questions

85. Design an order microservice architecture.
86. Design a payment microservice.
87. Design inventory reservation.
88. Design notification service.
89. Design a ride-booking backend.
90. Design a URL-shortening service.
91. Design a distributed rate limiter.
92. Design an event-driven order pipeline.
93. How would you migrate a monolith to microservices?
94. How would you split a large monolith?
95. How would you handle service B being unavailable?
96. How would you handle service B being slow?
97. How would you prevent cascading failure?
98. How would you guarantee no duplicate payment?
99. How would you guarantee DB + Kafka consistency?
100. How would you maintain cache consistency?
101. How would you handle Kafka duplicate events?
102. How would you handle out-of-order events?
103. How would you debug a production latency spike?
104. How would you handle a database outage?
105. How would you handle a Redis outage?
106. How would you handle Kafka outage?
107. How would you scale one extremely hot service?
108. How would you handle a hot database partition?
109. How would you deploy a breaking schema change safely?
110. How would you design multi-region microservices?

---

# PART XI — DEEP SCENARIOS

# 91. Order System

Requirements:

```text
create order
reserve inventory
charge payment
send notification
```

Possible architecture:

```text
                    Client
                      ↓
                 API Gateway
                      ↓
                 Order Service
                      ↓
                PostgreSQL
                      ↓
                    Outbox
                      ↓
                    Kafka
              ┌───────┼────────┐
              ↓       ↓        ↓
         Inventory  Payment  Notification
           Service   Service    Service
              ↓       ↓
             DB      DB
```

Redis:

```text
cache
rate limiting
idempotency acceleration
```

---

# 92. Order Failure

Payment fails:

```text
OrderCreated
 ↓
InventoryReserved
 ↓
PaymentFailed
 ↓
ReleaseInventory
 ↓
OrderCancelled
```

This is a Saga-style workflow.

---

# 93. Payment Idempotency

Client:

```text
POST /payments
Idempotency-Key: abc
```

Payment service:

```text
BEGIN
 ↓
check idempotency record
 ↓
create payment
 ↓
store result
 ↓
COMMIT
```

Retry:

```text
same key
 ↓
return stored result
```

---

# 94. Inventory Reservation

Use atomic database operation:

```sql
UPDATE inventory
SET available = available - 1
WHERE product_id = ?
  AND available > 0;
```

Then:

```text
affected rows = 1
→ success

affected rows = 0
→ unavailable
```

This can be preferable to a distributed lock.

---

# 95. Notification Service

```text
Kafka
 ↓
Notification Consumer
 ↓
Provider
```

Provider may fail.

Use:

```text
retry
backoff
DLT
idempotency
provider-specific rate limits
```

---

# 96. Multi-Region

Possible:

```text
Region A
 ├── services
 └── database

Region B
 ├── services
 └── database
```

Questions:

```text
active-active?
active-passive?
data replication?
conflict resolution?
latency?
data residency?
failover?
```

Multi-region is not automatically better; it dramatically increases complexity.

---

# 97. Service Ownership

Each service should have:

```text
clear owner
clear API contract
clear data ownership
clear SLO
clear operational responsibility
```

Microservices without ownership become distributed monoliths.

---

# 98. Distributed Monolith

A system can have many services and still behave like a monolith:

```text
A requires B
B requires C
C requires D
D requires A
```

Every deployment requires all services.

This is a distributed monolith.

Warning signs:

```text
tight synchronous coupling
shared database
shared release cycle
shared codebase/domain model
```

---

# 99. How to Avoid Distributed Monolith

Use:

```text
clear boundaries
asynchronous events where appropriate
independent data ownership
backward-compatible APIs
failure isolation
independent deployment
```

But don't force asynchronous messaging everywhere.

---

# 100. Microservices vs Modular Monolith

A modular monolith can provide:

```text
strong module boundaries
single deployment
local method calls
simple transactions
```

Microservices add:

```text
deployment independence
scaling independence
network boundaries
operational complexity
```

A well-designed modular monolith can be a better starting point.

---

# 101. Final Mental Model

```text
                    CLIENT
                       │
                       ▼
                 API GATEWAY
                       │
       ┌───────────────┼────────────────┐
       ▼               ▼                ▼
   ORDER SERVICE   PAYMENT SERVICE  USER SERVICE
       │               │                │
       ▼               ▼                ▼
   Order DB        Payment DB         User DB
       │
       ▼
    OUTBOX
       │
       ▼
     KAFKA
       │
 ┌─────┼──────────────┐
 ▼     ▼              ▼
Inventory Notification Analytics
Service   Service      Service
   │
   ▼
  Redis
```

Cross-cutting:

```text
Security
Observability
Resilience
Configuration
Service discovery
Deployment
```

---

# 102. The Golden Rules

1. Microservices are about boundaries and independent deployment, not small classes.
2. Split by business capability, not technical layer.
3. Prefer clear data ownership.
4. A shared database creates coupling.
5. Remote calls are unreliable.
6. Every remote call needs a timeout.
7. Retry only when failure is plausibly transient and the operation is safe to retry.
8. Use exponential backoff and jitter.
9. Circuit breakers prevent repeated calls to unhealthy dependencies.
10. Bulkheads prevent one dependency from exhausting shared resources.
11. Idempotency is essential when retries and duplicate delivery exist.
12. Database constraints provide durable correctness.
13. Outbox solves an important DB-to-event dual-write problem.
14. Inbox/deduplication helps with event-to-database reliability.
15. Eventual consistency must be explicitly accepted.
16. Sagas use local transactions plus compensation.
17. Kafka gives durable event streaming; it does not magically provide distributed transactions across arbitrary systems.
18. Redis is usually a cache/state layer, not automatically the source of truth.
19. API contracts must evolve backward-compatibly.
20. Observability is part of the architecture, not an afterthought.
21. Logs tell you what happened; metrics tell you how much; traces tell you where.
22. Readiness and liveness are different.
23. Graceful shutdown matters during rolling deployments.
24. More services do not automatically mean better architecture.
25. A distributed monolith is often worse than a modular monolith.
26. Do not introduce microservices before understanding the boundaries.
27. Prefer simple synchronous communication when the workflow requires an immediate answer and failure coupling is acceptable.
28. Prefer asynchronous communication when decoupling, buffering, and independent processing are valuable.
29. Multi-region architecture introduces substantial consistency and operational complexity.
30. The best microservice architecture is the simplest architecture that satisfies the business and scaling requirements.

---

# 103. Interview Answer Framework

When asked:

> "How would you design this microservice system?"

Answer in this order:

```text
1. Requirements
2. Service boundaries
3. APIs
4. Synchronous vs asynchronous communication
5. Database ownership
6. Cache
7. Kafka/events
8. Consistency
9. Idempotency
10. Failure handling
11. Scaling
12. Security
13. Observability
14. Deployment
15. Trade-offs
```

Do not jump directly to:

```text
Kafka + Redis + Kubernetes
```

Technology should follow requirements.

---

# 104. Final Self-Test

You should be able to explain without notes:

```text
Microservices
Monolith
Modular monolith
Service boundary
Bounded context
Database per service
API Gateway
Service discovery
REST
gRPC
Kafka
Synchronous communication
Asynchronous communication
Event
Command
Distributed transaction
2PC
Saga
Choreography
Orchestration
Compensation
Eventual consistency
Strong consistency
Idempotency
Outbox
Inbox
Timeout
Retry
Backoff
Jitter
Circuit breaker
Bulkhead
Rate limiting
Backpressure
Load shedding
Cascading failure
Retry storm
Thundering herd
API versioning
Backward compatibility
BFF
JWT
OAuth2
mTLS
Distributed tracing
OpenTelemetry
Correlation ID
SLI
SLO
SLA
Docker
Kubernetes
Readiness
Liveness
Graceful shutdown
Rolling deployment
Blue-green
Canary
Strangler Fig
Distributed monolith
Multi-region
```

And you should be able to design:

```text
Order system
Payment system
Inventory system
Notification system
Ride booking
Rate limiter
Event-driven pipeline
Monolith migration
Multi-region service
```

with explicit discussion of:

```text
data ownership
failure modes
consistency
idempotency
scaling
observability
security
trade-offs
```
