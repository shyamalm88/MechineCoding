---
title: Redis + Kafka — Interview Questions and Answers
tags:
  - redis
  - kafka
  - spring-boot
  - spring-data-redis
  - spring-kafka
  - caching
  - messaging
  - distributed-systems
  - interview
---

# Redis + Kafka — Interview Preparation

> [!note]
> This note is designed for a Java/Spring Boot full-stack developer preparing for senior-level interviews.
>
> The goal is not to memorize Redis commands or Kafka annotations.
>
> Learn each topic through:
>
> **What → Why → How → Internals → Production usage → Trade-offs → Failure modes → Interview traps**

---

# PART I — REDIS

# 1. What is Redis?

Redis is an in-memory data store commonly used for:

```text
Caching
Session storage
Counters
Rate limiting
Distributed coordination
Queues
Pub/Sub
Short-lived state
Leaderboards
Deduplication
```

Redis is primarily memory-oriented, but it can also persist data.

Mental model:

```text
Application
    ↓
Redis
    ↓
Fast in-memory operations
```

Important:

> Redis is not simply "a cache". It is a data-structure server with persistence, replication, clustering, and several messaging/coordination capabilities.

---

# 2. Why is Redis fast?

Redis is fast because:

```text
Data primarily resides in memory
+
Efficient data structures
+
Simple request/response model
+
Low overhead for many operations
```

But:

> "Redis is in memory, therefore every Redis operation is O(1)" is false.

Different commands have different complexity.

For example:

```text
GET → approximately O(1)
HGET → approximately O(1)
SADD → approximately O(1) average
ZRANGE → depends on requested range
```

Always understand the complexity of the command being used.

---

# 3. Redis vs Traditional Database

| Redis | Relational DB |
|---|---|
| Memory-oriented | Disk/storage-oriented |
| Very low latency | Generally higher latency |
| Key/data-structure model | Relational model |
| Great for cache/state | Great for durable business data |
| Limited query model | Rich SQL |
| TTL built-in | Usually application/schema dependent |
| Persistence available | Primarily durable storage |

Redis does not automatically replace PostgreSQL/MySQL.

---

# 4. Redis Data Types

Important Redis structures:

```text
String
Hash
List
Set
Sorted Set
Stream
Bitmap
HyperLogLog
Geospatial
```

Interview priority:

```text
String
Hash
List
Set
Sorted Set
Stream
```

---

# 5. Redis String

Example:

```text
SET user:1:name "Alice"
GET user:1:name
```

Strings can also store:

```text
numbers
JSON
serialized values
counters
tokens
```

Counter:

```text
INCR page:view:count
```

This is useful because increment operations can be atomic.

---

# 6. Redis Hash

Example:

```text
HSET user:1 name Alice age 30
HGET user:1 name
HGETALL user:1
```

Useful for representing an object:

```text
user:1
 ├── name
 ├── email
 ├── age
 └── status
```

Compared with storing the entire object as one serialized String:

```text
Hash
→ individual fields can be updated

String JSON
→ usually read/modify/write the whole value
```

---

# 7. Redis List

Example:

```text
LPUSH queue task1
RPUSH queue task2
LPOP queue
```

Useful for:

```text
simple queues
recent items
ordered collections
```

But Redis Lists should not automatically be considered a replacement for Kafka or a durable job queue.

---

# 8. Redis Set

Sets contain unique members.

```text
SADD users:active 101
SADD users:active 102
SADD users:active 101
```

The second `101` is not duplicated.

Useful for:

```text
unique membership
tags
deduplication
set intersection
set difference
```

---

# 9. Redis Sorted Set

A sorted set stores:

```text
member + score
```

Example:

```text
ZADD leaderboard 100 Alice
ZADD leaderboard 250 Bob
ZADD leaderboard 180 Charlie
```

Useful for:

```text
leaderboards
ranking
priority queues
time-based indexes
score-based retrieval
```

---

# 10. Redis Streams

Redis Streams provide an append-oriented log structure.

Useful concepts:

```text
stream
entry ID
consumer group
consumer
pending entries
acknowledgment
```

Example mental model:

```text
Producer
   ↓
Redis Stream
   ↓
Consumer Group
   ├── Consumer A
   ├── Consumer B
   └── Consumer C
```

Streams are substantially more capable for durable event processing than simple Pub/Sub.

---

# 11. Redis Pub/Sub

Pub/Sub:

```text
Publisher
    ↓
Channel
    ↓
Subscribers
```

Important property:

> Traditional Redis Pub/Sub is not a durable message log.

If a subscriber is disconnected when a message is published, it does not automatically receive the missed message later.

Use Streams when durable consumption and replay are required.

---

# 12. Redis TTL

Example:

```text
SET session:123 abc EX 3600
```

The key expires after the TTL.

Useful for:

```text
sessions
OTP state
temporary locks
cache entries
rate-limit windows
short-lived tokens
```

---

# 13. Cache-Aside Pattern

Most common caching pattern:

```text
Request
   ↓
Check Redis
   ↓
Hit?
 ┌───┴───┐
Yes      No
 ↓        ↓
Return   Database
          ↓
        Redis
          ↓
        Return
```

Pseudo-code:

```java
User user = redis.get(key);

if (user == null) {
    user = database.find(id);
    redis.set(key, user, ttl);
}

return user;
```

---

# 14. Why Cache-Aside Is Popular

Benefits:

```text
Application controls what gets cached
Database remains source of truth
Easy to introduce incrementally
Works well with read-heavy workloads
```

But:

```text
Cache misses
stale data
cache stampede
invalidation
cold cache
```

must be handled.

---

# 15. Cache Invalidation

Classic problem:

```text
Database
   ↓ update
Database = new value

Redis
   ↓
old value
```

Possible strategies:

```text
TTL
explicit eviction
write-through
write-behind
event-driven invalidation
versioned keys
```

Classic interview statement:

> Cache invalidation is one of the hardest parts of caching because correctness depends on keeping cached state consistent enough with the source of truth.

---

# 16. Cache-Aside Write Strategy

One common approach:

```text
Update DB
   ↓
Delete Redis key
```

Why delete instead of blindly writing cache first?

Because the database remains the source of truth.

But even this has race conditions.

Example:

```text
T1 reads old DB value
T2 updates DB
T2 deletes cache
T1 writes old value into cache
```

This is why cache consistency requires careful design.

---

# 17. Write-Through Cache

```text
Application
   ↓
Cache
   ↓
Database
```

Application writes to cache and cache synchronously updates the database.

Benefits:

```text
cache stays populated
```

Trade-off:

```text
more write latency
more coupling
```

---

# 18. Write-Behind Cache

```text
Application
   ↓
Cache
   ↓
asynchronous write
   ↓
Database
```

Potentially lower write latency.

But failure handling becomes more complex.

Risk:

```text
cache updated
database write not completed
system crashes
```

---

# 19. Cache Stampede

Suppose a popular key expires:

```text
1000 requests
     ↓
same cache miss
     ↓
1000 DB queries
```

This can overload the database.

Solutions:

```text
request coalescing
distributed lock
early refresh
randomized TTL
stale-while-revalidate
prewarming
```

---

# 20. Cache Penetration

Requests repeatedly ask for data that does not exist.

```text
Request ID=999999
 ↓
Redis miss
 ↓
DB miss
 ↓
No cache entry
```

Attack/request pattern repeats.

Solutions:

```text
negative caching
Bloom filter
input validation
rate limiting
```

---

# 21. Cache Avalanche

Large numbers of cache entries expire around the same time.

```text
Redis
 ↓
many keys expire
 ↓
massive DB traffic
```

Mitigation:

```text
TTL jitter
staggered expiration
prewarming
load protection
```

---

# 22. Redis Eviction

When Redis reaches its configured memory limit, an eviction policy may determine what gets removed.

Common policies include:

```text
noeviction
allkeys-lru
volatile-lru
allkeys-lfu
volatile-lfu
allkeys-random
volatile-random
volatile-ttl
```

Understand:

```text
LRU → least recently used
LFU → least frequently used
```

Important:

> Choosing an eviction policy is a workload decision.

---

# 23. Redis Persistence

Redis supports persistence mechanisms such as:

```text
RDB
AOF
```

### RDB

Periodic snapshots.

Advantages:

```text
compact
fast restart/load
good backup characteristics
```

Trade-off:

```text
recent writes may be lost depending on snapshot interval
```

### AOF

Records write operations.

Advantages:

```text
more frequent durability options
```

Trade-offs:

```text
larger logs
rewrite/maintenance overhead
```

---

# 24. RDB vs AOF

| RDB | AOF |
|---|---|
| Snapshot | Operation log |
| Compact | Usually larger |
| Fast restore | More write history |
| Possible larger loss window | Can offer stronger durability |
| Good backups | Good recovery characteristics |

Some systems use both.

---

# 25. Redis Replication

Typical:

```text
Primary
   ↓
Replica
```

Replication improves:

```text
read scaling
availability
failover capabilities
```

But replication is commonly asynchronous.

Therefore:

> A successful write on the primary does not automatically mean every replica has received it.

---

# 26. Redis Sentinel

Sentinel provides monitoring/failover coordination for Redis deployments.

Conceptually:

```text
Primary
  ↓
Replicas

Sentinels
  ↓
Monitor
  ↓
Detect failure
  ↓
Promote replica
```

Sentinel is different from Redis Cluster.

---

# 27. Redis Cluster

Redis Cluster distributes data across nodes.

Conceptually:

```text
Client
  ↓
Cluster
 ├── Node A
 ├── Node B
 ├── Node C
 └── replicas
```

Redis Cluster uses hash slots.

```text
16384 hash slots
```

Keys are mapped to slots.

---

# 28. Redis Cluster vs Sentinel

| Sentinel | Cluster |
|---|---|
| High availability/failover | Sharding + HA |
| Primarily one logical dataset | Dataset distributed |
| Replica promotion | Multiple shards |
| No data sharding by itself | Hash-slot partitioning |

---

# 29. Redis Hash Tags

Redis Cluster supports hash tags:

```text
user:{123}:profile
user:{123}:orders
```

The portion inside `{}` determines the hash slot.

Useful when multiple related keys need to be colocated.

This matters because multi-key operations generally require keys to belong to the same hash slot.

---

# 30. Redis Atomicity

Redis executes individual commands atomically from the perspective of other Redis commands.

For example:

```text
INCR counter
```

is atomic.

But:

```text
GET
application calculation
SET
```

is not automatically atomic as a sequence.

For multi-step atomic behavior, consider:

```text
MULTI / EXEC
Lua scripts
server-side functions
appropriate atomic commands
```

---

# 31. Redis Transactions

Redis transactions use:

```text
MULTI
EXEC
DISCARD
```

Example:

```text
MULTI
SET a 10
SET b 20
EXEC
```

Important:

> Redis transactions are not identical to relational database transactions.

Redis does not provide the same rollback model as a traditional SQL database.

---

# 32. Lua Scripts

Lua scripts can execute multiple Redis operations atomically from the perspective of other commands.

Useful for:

```text
rate limiting
atomic check-and-set
distributed coordination
multi-key logic
```

But avoid huge scripts because they can block Redis processing.

---

# 33. Distributed Lock with Redis

A common pattern:

```text
SET lock:key unique-value NX EX 30
```

Meaning conceptually:

```text
NX → only if key does not exist
EX → expiration
```

Important:

> A distributed lock is not simply "SET a key".

You must consider:

```text
ownership
expiration
safe release
client crashes
clock/time issues
lock renewal
network partitions
```

---

# 34. Safe Lock Release

Do not blindly:

```text
DEL lock:key
```

because another client might have acquired the lock after your lock expired.

Use an owner token and atomically verify ownership before deletion.

Conceptually:

```text
if value == myToken:
    delete
```

This is typically implemented atomically with a server-side script.

---

# 35. Redis Rate Limiting

Common approaches:

```text
fixed window
sliding window
token bucket
leaky bucket
```

Redis is useful because operations can be atomic and state can be shared across application instances.

Example:

```text
API request
   ↓
Redis counter
   ↓
limit exceeded?
 ├── yes → 429
 └── no  → continue
```

---

# 36. Redis and Sessions

Redis is commonly used as a shared session store:

```text
Client
 ↓
Application instance A
 ↓
Redis

or

Client
 ↓
Application instance B
 ↓
Redis
```

This allows horizontal scaling without requiring sticky sessions.

---

# 37. Redis Serialization

When storing Java objects, consider:

```text
JSON
binary serialization
String
Hash
```

Be careful with Java native serialization because of:

```text
security concerns
compatibility
versioning
coupling
```

Prefer an explicit, controlled serialization format for distributed systems.

---

# 38. Redis Key Design

Bad:

```text
user
```

Better:

```text
user:123
user:123:profile
user:123:orders
```

A key convention should make ownership and purpose obvious.

Think:

```text
domain:identifier:resource
```

---

# 39. Redis Big Keys

A "big key" can cause:

```text
high memory usage
slow operations
network overhead
replication impact
eviction problems
```

Avoid storing enormous blobs or giant collections without understanding access patterns.

---

# 40. Redis Hot Keys

A hot key receives enormous traffic.

Example:

```text
homepage:config
```

10 million requests may target the same key.

Potential solutions:

```text
local cache
key replication/sharding strategy
request coalescing
precomputation
CDN
```

---

# 41. Redis Failure Modes

Be prepared for:

```text
Redis unavailable
network partition
replica lag
memory exhaustion
eviction
hot keys
big keys
cache stampede
stale data
serialization incompatibility
slow commands
connection-pool exhaustion
```

A production application should define:

```text
cache failure behavior
timeouts
fallback
circuit breaking
```

Do not let Redis being unavailable automatically take down the entire application if Redis is only a cache.

---

# 42. Spring Data Redis

Spring Boot commonly integrates Redis using Spring Data Redis.

Common abstractions:

```text
RedisTemplate
StringRedisTemplate
Spring Cache
```

Example conceptual flow:

```text
@Service
 ↓
RedisTemplate
 ↓
Redis
```

For straightforward caching:

```java
@Cacheable("users")
public User getUser(Long id) {
    ...
}
```

---

# 43. Redis Interview Traps

### Trap 1

"Redis is always persistent."

False.

Redis can be configured for persistence, but it is fundamentally memory-oriented and durability depends on configuration.

### Trap 2

"Redis is a database replacement."

Not generally.

### Trap 3

"Pub/Sub guarantees delivery."

Traditional Pub/Sub does not provide durable replay.

### Trap 4

"All Redis commands are O(1)."

False.

### Trap 5

"DEL lock:key is a safe distributed lock release."

Not necessarily.

### Trap 6

"TTL solves cache consistency."

TTL reduces staleness duration but does not solve all consistency races.

---

# PART II — KAFKA

# 44. What is Apache Kafka?

Kafka is a distributed event streaming platform.

It is commonly used for:

```text
Event streaming
Messaging
Data pipelines
Log aggregation
Asynchronous processing
Event-driven architectures
Integration between services
```

Mental model:

```text
Producer
   ↓
Kafka Topic
   ↓
Partitions
   ↓
Consumer Groups
   ↓
Consumers
```

---

# 45. Why Kafka?

Kafka is designed for:

```text
high throughput
durable event storage
horizontal scalability
partitioned processing
replay
decoupling
```

Kafka is not simply a queue.

A Kafka topic behaves more like a distributed append-only log.

---

# 46. Kafka Core Components

Know:

```text
Broker
Topic
Partition
Producer
Consumer
Consumer Group
Offset
Replica
Leader
Follower
```

---

# 47. Kafka Broker

A broker is a Kafka server.

A Kafka cluster contains multiple brokers.

```text
Kafka Cluster
 ├── Broker 1
 ├── Broker 2
 └── Broker 3
```

Partitions are distributed across brokers.

---

# 48. Kafka Topic

A topic is a logical stream/category of events.

Example:

```text
payment-events
order-events
user-events
```

A topic contains partitions.

```text
payment-events
 ├── partition 0
 ├── partition 1
 └── partition 2
```

---

# 49. Kafka Partition

A partition is an ordered append-only log.

```text
Partition 0:

offset 0 → event A
offset 1 → event B
offset 2 → event C
offset 3 → event D
```

Important:

> Kafka guarantees ordering within a partition, not globally across an entire topic.

---

# 50. Why Partitions?

Partitions provide:

```text
parallelism
scalability
distribution
ordering boundaries
```

Example:

```text
Topic
 ├── P0 → Consumer A
 ├── P1 → Consumer B
 └── P2 → Consumer C
```

---

# 51. Kafka Offset

Each record in a partition has an offset.

```text
P0
0
1
2
3
4
```

Offset identifies the position of a record within that partition.

Offsets are partition-specific.

---

# 52. Consumer

A consumer reads records from Kafka.

```text
Kafka
  ↓
Consumer
  ↓
Application logic
```

Consumers track their progress through offsets.

---

# 53. Consumer Group

A consumer group allows multiple consumers to divide partitions.

Example:

```text
Topic: 4 partitions

Consumer Group A
 ├── Consumer 1 → P0
 ├── Consumer 2 → P1
 ├── Consumer 3 → P2
 └── Consumer 4 → P3
```

Within one consumer group:

> A partition is assigned to at most one active consumer at a time.

---

# 54. More Consumers Than Partitions

Suppose:

```text
4 partitions
6 consumers
```

Only four consumers can actively consume partitions.

```text
C1 → P0
C2 → P1
C3 → P2
C4 → P3
C5 → idle
C6 → idle
```

Therefore:

> Maximum active parallelism for a consumer group is bounded by partition count.

---

# 55. Multiple Consumer Groups

Suppose:

```text
Topic
 ↓
Group A
Group B
Group C
```

Each group gets its own logical consumption position.

Therefore the same event can be independently processed by:

```text
Payment service
Analytics service
Notification service
```

This is one of Kafka's most important differences from a traditional work queue.

---

# 56. Kafka Ordering

Kafka guarantees ordering:

```text
within a partition
```

Not:

```text
across all partitions
```

If events for the same entity must remain ordered, use a stable key.

Example:

```text
key = orderId
```

Then events for the same order can be routed to the same partition.

---

# 57. Kafka Message Key

Example:

```java
producer.send(
    new ProducerRecord<>(
        "orders",
        orderId,
        orderEvent
    )
);
```

The key influences partition selection.

Common strategy:

```text
key = entity ID
```

This gives:

```text
same entity
   ↓
same partition
   ↓
preserved ordering for that entity
```

---

# 58. Kafka Producer

Producer sends records:

```text
Application
   ↓
Kafka Producer
   ↓
Broker
```

Important producer settings/concepts:

```text
acks
retries
batching
linger
compression
idempotence
delivery timeout
```

---

# 59. acks

Important settings conceptually:

```text
acks=0
acks=1
acks=all
```

### acks=0

Producer does not wait for broker acknowledgment.

Lower latency but weaker delivery guarantees.

### acks=1

Leader acknowledges.

### acks=all

Acknowledgment waits for required in-sync replicas according to replication configuration.

Stronger durability.

---

# 60. Kafka Replication

A partition can have multiple replicas.

```text
Partition P0
 ├── Leader
 ├── Follower
 └── Follower
```

Producer normally writes to the leader.

Followers replicate the data.

---

# 61. ISR — In-Sync Replicas

ISR means replicas considered sufficiently caught up with the leader according to Kafka's replication rules.

Example:

```text
Leader
Follower A
Follower B
```

If a follower falls too far behind, it may leave ISR.

This matters for durability and leader failover.

---

# 62. Replication Factor

Example:

```text
replication.factor = 3
```

means each partition has three replicas.

Higher replication improves resilience but costs:

```text
storage
network
replication overhead
```

---

# 63. Producer Batching

Kafka producers can batch records.

Conceptually:

```text
event
event
event
event
 ↓
batch
 ↓
broker
```

Benefits:

```text
higher throughput
fewer network requests
better compression
```

Trade-off:

```text
potentially increased latency
```

---

# 64. Kafka Compression

Common compression codecs:

```text
gzip
snappy
lz4
zstd
```

Compression can reduce:

```text
network bandwidth
disk usage
```

but uses CPU.

---

# 65. Kafka Consumer Poll Model

Consumers typically poll Kafka for records.

Conceptually:

```text
consumer.poll()
      ↓
records
      ↓
application processing
      ↓
commit offset
```

Important:

> Consumer liveness and processing time are connected to polling behavior and consumer configuration.

---

# 66. Kafka Offset Commit

Offsets indicate processed position.

Common approaches:

```text
automatic commit
manual commit
manual immediate commit
```

For critical processing, understand exactly when the offset is committed relative to business processing.

---

# 67. At-Most-Once

Conceptually:

```text
commit offset
   ↓
process message
```

If processing fails after the commit:

```text
message may be lost
```

Guarantee:

```text
at-most-once
```

---

# 68. At-Least-Once

Conceptually:

```text
process message
   ↓
commit offset
```

If the application crashes after processing but before committing:

```text
message processed again
```

Therefore duplicates are possible.

Kafka applications commonly use at-least-once processing plus idempotent business logic.

---

# 69. Exactly-Once

Exactly-once semantics are more nuanced than:

> "Kafka never processes a message twice."

Kafka supports transactional/idempotent mechanisms for specific processing patterns.

You must distinguish:

```text
Kafka's transactional guarantees
vs
external side effects
```

If a consumer:

```text
reads Kafka
 ↓
charges external payment API
 ↓
commits Kafka transaction
```

Kafka cannot automatically roll back the external payment.

---

# 70. Idempotent Consumer

Suppose:

```text
event ID = 123
```

Consumer receives it twice.

Store processed IDs:

```text
event:123 → processed
```

or use a database uniqueness constraint.

Then:

```text
duplicate event
 ↓
detect
 ↓
skip duplicate side effect
```

---

# 71. Consumer Rebalancing

When group membership changes:

```text
consumer joins
consumer leaves
consumer crashes
partition count changes
```

Kafka may rebalance partitions.

Example:

```text
Before:
C1 → P0,P1
C2 → P2,P3

After C2 leaves:
C1 → P0,P1,P2,P3
```

Rebalancing can temporarily affect throughput and processing.

---

# 72. Consumer Group Coordinator

Kafka coordinates consumer groups so partitions can be assigned to consumers.

Know conceptually:

```text
group membership
heartbeats
partition assignment
rebalance
offset management
```

---

# 73. Consumer Lag

Consumer lag indicates how far behind a consumer/group is from the latest available records.

Conceptually:

```text
Latest offset = 1000
Consumer offset = 700

Lag ≈ 300
```

High lag may indicate:

```text
slow processing
traffic spike
too few partitions/consumers
downstream bottleneck
consumer failures
rebalancing
```

---

# 74. How to Reduce Kafka Consumer Lag

Possible approaches:

```text
increase consumer instances
increase partition count where appropriate
optimize processing
batch processing
parallelize work carefully
increase downstream capacity
reduce expensive DB calls
avoid unnecessary retries
```

Important:

> Adding consumers does nothing if there are not enough partitions to distribute.

---

# 75. Kafka Delivery Flow

Producer:

```text
Application
 ↓
Producer
 ↓
Partition leader
 ↓
Replication
```

Consumer:

```text
Partition
 ↓
Consumer
 ↓
Business processing
 ↓
Offset commit
```

---

# 76. Kafka vs Redis Pub/Sub

| Kafka | Redis Pub/Sub |
|---|---|
| Durable log | Ephemeral delivery |
| Replay | No normal replay |
| Consumer groups | Subscribers |
| Partitioning | Channels |
| High-scale event streaming | Lightweight real-time messaging |
| Persistent events | Messages can be missed while offline |

---

# 77. Kafka vs Redis Streams

| Kafka | Redis Streams |
|---|---|
| Distributed event log | Redis-based stream |
| Built for large event pipelines | Useful inside Redis ecosystem |
| Strong partition model | Stream/consumer groups |
| Large-scale retention | Memory/storage-oriented Redis deployment |
| Ecosystem for event streaming | Convenient when Redis already exists |

Choose based on architecture, scale, durability, operational requirements, and existing infrastructure.

---

# 78. Kafka vs RabbitMQ

Kafka:

```text
event log
replay
high throughput
partitioning
stream processing
```

RabbitMQ:

```text
message broker
routing
work queues
acknowledgment
complex routing patterns
```

The correct choice depends on the workload.

---

# 79. Kafka Retention

Kafka normally retains records based on configured policies rather than deleting them immediately after consumption.

Retention can be based on:

```text
time
size
```

This allows consumers to replay older events as long as they remain available.

---

# 80. Log Compaction

Compaction keeps the latest record for a key, subject to Kafka's compaction semantics.

Example:

```text
key=user123 value=ACTIVE
key=user123 value=SUSPENDED
key=user123 value=DELETED
```

Compaction can eventually retain the latest state representation for that key.

Useful for:

```text
latest state
configuration
CDC/state topics
```

---

# 81. Tombstone Records

In compacted topics, a null-value record for a key can act as a tombstone indicating deletion.

Conceptually:

```text
key=user123
value=null
```

This allows deletion information to propagate through a compacted log.

---

# 82. Kafka Partition Count

Choosing partitions is an architectural decision.

More partitions can provide:

```text
more parallelism
higher throughput
more consumer concurrency
```

But also:

```text
more metadata
more open resources
more operational overhead
more complicated rebalancing
```

Do not choose an enormous partition count without a scaling reason.

---

# 83. Can You Reduce Kafka Partitions?

Changing partition count downward is not a normal supported operation.

Therefore:

> Partition count should be chosen carefully because increasing partitions later is possible, but it can change key-to-partition distribution and therefore affect ordering behavior.

---

# 84. Kafka Schema Evolution

Events are APIs.

If producers and consumers evolve independently, schema compatibility matters.

Common technologies:

```text
Avro
Protobuf
JSON Schema
```

Schema registry systems can enforce compatibility policies.

Important compatibility concepts:

```text
backward
forward
full
```

---

# 85. Kafka Event Design

A good event should contain enough context for consumers.

Example:

```json
{
  "eventId": "evt-123",
  "eventType": "ORDER_CREATED",
  "version": 1,
  "occurredAt": "2026-08-17T10:00:00Z",
  "orderId": "order-123",
  "customerId": "customer-42"
}
```

Important fields:

```text
event ID
event type
schema/version
timestamp
entity identifier
relevant payload
```

---

# 86. Event vs Command

Event:

```text
OrderCreated
```

Means:

> Something happened.

Command:

```text
CreateOrder
```

Means:

> Please perform an action.

This distinction helps design event-driven systems.

---

# 87. Kafka Dead Letter Topic

If a message repeatedly fails:

```text
Consumer
 ↓
process
 ↓
failure
 ↓
retry
 ↓
failure
 ↓
DLT
```

DLT/DLQ can retain failed records for investigation or later reprocessing.

Important:

> A DLT is not a substitute for fixing the underlying failure.

---

# 88. Retry Strategies

Possible:

```text
immediate retry
fixed delay
exponential backoff
retry topic
dead letter topic
```

Be careful with:

```text
retry storms
poison messages
ordering
duplicate processing
```

---

# 89. Poison Message

A poison message consistently fails processing.

Bad pattern:

```text
message
 ↓
fail
 ↓
retry
 ↓
fail
 ↓
retry forever
```

This can block progress or consume resources.

Better:

```text
bounded retries
 ↓
DLT
 ↓
investigate
```

---

# 90. Kafka Transactions

Kafka supports transactions for certain producer/consumer workflows.

Conceptually:

```text
Consume input
   ↓
Process
   ↓
Produce output
   ↓
Commit transaction
```

Useful for Kafka-to-Kafka processing.

But remember:

```text
Kafka transaction
≠
global transaction across arbitrary external systems
```

---

# 91. Kafka Exactly-Once Processing Trap

Question:

> If Kafka supports exactly-once semantics, can I safely call an external payment API exactly once?

No.

Kafka can coordinate Kafka-side transactional operations, but an external API is outside that transaction.

For external side effects, consider:

```text
idempotency
outbox/inbox
deduplication
sagas
transactional state
```

---

# 92. Kafka Backpressure

Suppose:

```text
Kafka produces 100k events/sec
Consumer processes 20k/sec
```

Lag increases.

Possible strategies:

```text
increase partitions
increase consumers
batch processing
optimize consumer
buffer carefully
rate-limit producer
scale downstream systems
```

Do not solve every backpressure problem by simply adding memory.

---

# 93. Kafka Ordering vs Parallelism

Suppose an order needs:

```text
CREATED
PAID
SHIPPED
```

If all events use:

```text
key = orderId
```

they can go to the same partition.

Then:

```text
CREATED
  ↓
PAID
  ↓
SHIPPED
```

ordering is preserved for that order.

If you use random keys:

```text
CREATED → P0
PAID    → P1
SHIPPED → P2
```

global ordering for that order is no longer guaranteed.

---

# 94. Kafka Consumer Concurrency

In Spring Kafka, consumer concurrency can create multiple consumer instances/threads.

But:

```text
concurrency > partition count
```

does not create additional partition-level parallelism.

Think:

```text
parallelism ≤ available partitions
```

---

# 95. Spring Kafka

Spring Boot commonly integrates Kafka through Spring Kafka.

Typical concepts:

```text
KafkaTemplate
@KafkaListener
ConsumerFactory
ProducerFactory
ConcurrentKafkaListenerContainerFactory
```

Producer:

```java
kafkaTemplate.send(
    "orders",
    orderId,
    event
);
```

Consumer:

```java
@KafkaListener(
    topics = "orders",
    groupId = "payment-service"
)
public void consume(OrderEvent event) {
    ...
}
```

---

# 96. @KafkaListener

A listener receives Kafka records.

Important configuration areas:

```text
group ID
concurrency
ack mode
error handling
retry
deserialization
batch listeners
```

---

# 97. Spring Kafka Error Handling

Production consumers should define what happens when processing fails.

Possible:

```text
retry
backoff
dead-letter topic
skip
recover
```

A listener should not simply crash forever on one malformed message.

---

# 98. Kafka Serialization

Producer:

```text
Java object
 ↓
Serializer
 ↓
bytes
```

Consumer:

```text
bytes
 ↓
Deserializer
 ↓
Java object
```

Common:

```text
StringSerializer
JsonSerializer
Avro
Protobuf
```

Schema evolution must be considered.

---

# 99. Kafka Consumer Database Transaction

A common pattern:

```text
Kafka message
 ↓
DB transaction
 ├── update DB
 └── record processed event
 ↓
commit DB
 ↓
commit Kafka offset
```

If the DB commit succeeds but offset commit fails:

```text
message may be consumed again
```

Therefore the DB operation should be idempotent.

A uniqueness constraint on `event_id` can be an effective deduplication mechanism.

---

# 100. Inbox Pattern

The inbox pattern stores incoming event IDs before applying business effects.

```text
Kafka event
 ↓
Inbox table
 ↓
business transaction
 ↓
mark processed
```

Useful for:

```text
deduplication
at-least-once consumers
```

---

# 101. Outbox + Kafka

A common reliable architecture:

```text
Application
   ↓
DB transaction
 ├── business update
 └── outbox event
        ↓
Outbox publisher
        ↓
Kafka
        ↓
Consumer
        ↓
DB transaction
 ├── inbox/dedup
 └── business update
```

This creates a robust event-driven pipeline.

---

# 102. Kafka Consumer Failure

Suppose:

```text
Consumer reads message
 ↓
DB update
 ↓
Consumer crashes
 ↓
offset not committed
```

The message may be delivered again.

Therefore:

```text
at-least-once
+
idempotent processing
```

is a very common production design.

---

# 103. Kafka Consumer Rebalance Trap

Long processing can interfere with consumer group membership if the consumer does not poll within configured limits.

Potential symptoms:

```text
rebalances
duplicate processing
lag
partition ownership changes
```

Mitigations include:

```text
shorter processing batches
appropriate poll configuration
pause/resume strategies where appropriate
moving slow work to controlled executors
scaling consumers
```

Do not simply increase every timeout without understanding why processing is slow.

---

# 104. Kafka Large Messages

Large messages create:

```text
memory pressure
network overhead
serialization overhead
broker storage impact
consumer latency
```

Better:

```text
store large payload externally
put reference/metadata in Kafka
```

Example:

```json
{
  "documentId": "doc-123",
  "storageUri": "..."
}
```

Kafka should usually carry events, not giant binary objects.

---

# 105. Kafka Security

Important:

```text
TLS
authentication
authorization
ACLs
secret/key management
encryption in transit
```

Kafka security should be designed around:

```text
who can produce?
who can consume?
which topics?
which consumer groups?
```

---

# 106. Kafka Monitoring

Important metrics:

```text
consumer lag
records in/out
request latency
producer errors
consumer errors
under-replicated partitions
ISR changes
broker disk usage
network throughput
CPU
GC
request queue time
```

Consumer lag is important but not sufficient.

---

# 107. Under-Replicated Partitions

If a partition has fewer in-sync replicas than expected:

```text
replication health problem
```

Potential causes:

```text
broker failure
network problems
disk pressure
slow broker
resource saturation
```

This is a critical Kafka health signal.

---

# 108. Kafka Failure Modes

Be prepared for:

```text
broker failure
leader election
consumer crash
producer retries
duplicate delivery
consumer lag
rebalancing
poison messages
DLT growth
under-replicated partitions
disk exhaustion
network partition
schema incompatibility
hot partitions
```

---

# 109. Hot Partition

Suppose:

```text
99% of events
key = celebrityUser
```

All events may go to one partition.

Then:

```text
P0 → overloaded
P1 → low traffic
P2 → low traffic
```

Increasing total partition count does not automatically fix a hot key.

You may need:

```text
better key distribution
key salting where ordering allows
different partitioning strategy
local aggregation
```

But salting can destroy ordering for that entity.

---

# 110. Kafka Partitioning Strategy

Choose a key based on the business ordering requirement.

Examples:

```text
orderId → order ordering
customerId → customer ordering
accountId → account ordering
```

Question to ask:

> What entity must remain ordered?

That entity is often the partition key.

---

# 111. Redis + Kafka Together

They solve different problems.

Typical architecture:

```text
                  ┌──────────┐
                  │  Kafka   │
                  │ Event Log│
                  └────┬─────┘
                       │
                       ▼
                 Consumers
                       │
              ┌────────┴────────┐
              ▼                 ▼
           Database           Redis
        Source of truth       Cache
```

Kafka:

```text
events
durability
replay
decoupling
```

Redis:

```text
low-latency state
cache
counters
shared ephemeral state
```

---

# 112. Example: Order System

```text
Client
  ↓
Order Service
  ├── PostgreSQL
  ├── Redis
  └── Kafka
```

Create order:

```text
POST /orders
 ↓
DB transaction
 ├── create order
 └── outbox event
 ↓
Outbox publisher
 ↓
Kafka: OrderCreated
 ↓
 ├── Payment Service
 ├── Inventory Service
 └── Notification Service
```

Redis can store:

```text
order:123
inventory counters
rate limits
short-lived state
```

---

# 113. Example: Rate Limiting

```text
Request
 ↓
API Gateway
 ↓
Redis
 ↓
counter/token bucket
 ↓
Allowed?
 ├── no → 429
 └── yes
       ↓
      API
```

Kafka is not the natural choice for the per-request counter itself.

---

# 114. Example: Notification System

```text
Order Service
   ↓
Kafka
   ↓
Notification Service
   ↓
Redis / DB
   ↓
Email/SMS/Push providers
```

Kafka decouples notification processing from order creation.

Redis can be used for:

```text
deduplication
rate limits
provider state
short-lived delivery state
```

---

# 115. Redis vs Kafka Decision Framework

Ask:

### Do I need a cache?

```text
Redis
```

### Do I need an event log and replay?

```text
Kafka
```

### Do I need extremely low-latency shared state?

```text
Redis
```

### Do I need multiple independent consumers?

```text
Kafka
```

### Do messages need durable retention?

```text
Kafka
```

### Do I need a simple counter?

```text
Redis
```

### Do I need stream processing?

```text
Kafka
```

### Do I need a temporary distributed lock?

```text
Redis
```

---

# 116. Senior Interview Trap: Redis Is Not Automatically the Source of Truth

Bad architecture:

```text
DB
 ↓
Redis

Application assumes Redis is always correct
```

If Redis is being used as a cache:

```text
Database = source of truth
Redis = acceleration layer
```

Unless the architecture explicitly defines Redis as authoritative state.

---

# 117. Senior Interview Trap: Kafka Is Not a Database

Kafka stores events durably, but using Kafka as the primary transactional query database for arbitrary application queries is usually a poor design.

Kafka is excellent for:

```text
event history
stream processing
integration
replay
```

A database is generally better for:

```text
arbitrary queries
transactions
constraints
relational integrity
```

---

# 118. Senior Interview Trap: Kafka Does Not Guarantee Business Exactly-Once

Even if Kafka processing is exactly-once within Kafka's transactional model:

```text
Kafka
 ↓
external payment API
```

does not become exactly-once automatically.

External side effects require:

```text
idempotency
deduplication
transactional state
compensation
```

---

# 119. Senior Interview Trap: More Partitions Is Not Always Better

More partitions provide potential parallelism.

But also increase:

```text
metadata
resources
rebalancing cost
operational complexity
```

Choose based on expected throughput and consumer parallelism.

---

# 120. Senior Interview Trap: More Redis Memory Is Not a Scaling Strategy

If memory grows because of:

```text
big keys
missing TTL
unbounded collections
hot data
```

simply increasing RAM may hide the architectural problem.

Investigate:

```text
key sizes
TTL
eviction
access patterns
memory fragmentation
```

---

# 121. Senior Interview Scenario: Redis Goes Down

If Redis is only a cache:

```text
Redis unavailable
 ↓
fallback to DB
```

But:

```text
100k requests
 ↓
Redis unavailable
 ↓
100k DB requests
```

can cause a database meltdown.

Therefore use:

```text
timeouts
circuit breaker
request coalescing
local cache
rate limiting
load shedding
```

---

# 122. Senior Interview Scenario: Kafka Consumer Is Slow

Start with:

```text
Is consumer lag increasing?
```

Then investigate:

```text
processing latency
DB latency
external API latency
partition distribution
consumer count
partition count
rebalances
retry rate
GC
CPU
```

Do not automatically add consumers.

---

# 123. Senior Interview Scenario: Messages Are Duplicated

Possible reasons:

```text
consumer processed message
 ↓
crashed before offset commit
 ↓
message replayed
```

Solution:

```text
idempotent consumer
```

Possible implementation:

```text
eventId UNIQUE
```

in a database table.

---

# 124. Senior Interview Scenario: Messages Are Out of Order

Ask:

```text
Are events in the same partition?
```

If not:

```text
same entity
 ↓
different partitions
 ↓
no ordering guarantee
```

Use a stable partition key where ordering is required.

---

# 125. Senior Interview Scenario: One Kafka Consumer Group Is Slow

Remember:

```text
one consumer group
```

does not affect another consumer group directly in terms of partition ownership.

Example:

```text
Topic
 ├── Payment Group
 ├── Analytics Group
 └── Notification Group
```

Each group maintains its own consumption position.

---

# 126. Senior Interview Scenario: Redis Cache Has Stale Data

Ask:

```text
When is cache written?
When is cache invalidated?
What is TTL?
Can concurrent requests race?
Can stale values be written after invalidation?
Is DB the source of truth?
```

Possible solutions:

```text
explicit invalidation
versioning
short TTL
event-driven invalidation
locking/coalescing
```

---

# 127. Senior Interview Scenario: Need a Distributed Lock

Before Redis locking, ask:

```text
Can the operation be made idempotent?
Can a DB unique constraint solve it?
Can the workload be partitioned?
```

A distributed lock should not be the first tool for every concurrency problem.

---

# 128. Senior Interview Scenario: Redis and DB Must Stay Consistent

Possible architecture:

```text
DB
 ↓
Outbox/event
 ↓
Kafka
 ↓
Cache invalidation consumer
 ↓
Redis
```

This can decouple cache invalidation from the DB transaction.

But asynchronous invalidation means temporary staleness must be accepted.

---

# 129. Senior Interview Scenario: Kafka Event Is Published Before DB Commit

Bad:

```text
publish Kafka event
 ↓
DB transaction
 ↓
DB fails
```

Kafka contains an event describing something that never committed.

Prefer:

```text
DB transaction
 ├── business data
 └── outbox
       ↓
commit
       ↓
publisher
       ↓
Kafka
```

---

# 130. Senior Interview Scenario: Consumer DB Update Succeeds, Kafka Offset Commit Fails

Then:

```text
same message
 ↓
consumed again
```

Therefore:

```text
DB operation must be idempotent
```

Use:

```text
unique event ID
upsert
version check
inbox table
```

---

# 131. Redis Interview Questions — Basic to Advanced

1. What is Redis?
2. Why is Redis fast?
3. Redis vs database?
4. What Redis data types do you know?
5. String vs Hash?
6. When would you use Set?
7. When would you use Sorted Set?
8. What are Redis Streams?
9. Redis Pub/Sub?
10. Pub/Sub vs Streams?
11. What is TTL?
12. What is cache-aside?
13. Write-through vs write-behind?
14. What is cache invalidation?
15. What is cache stampede?
16. What is cache penetration?
17. What is cache avalanche?
18. What are Redis eviction policies?
19. LRU vs LFU?
20. What is RDB?
21. What is AOF?
22. RDB vs AOF?
23. What is Redis replication?
24. What is Sentinel?
25. Sentinel vs Cluster?
26. What are Redis hash slots?
27. What are hash tags?
28. Why can multi-key operations be problematic in Cluster?
29. Are Redis commands atomic?
30. What are MULTI/EXEC?
31. Does Redis support rollback like SQL?
32. What are Lua scripts used for?
33. How do you implement a Redis lock?
34. Why is `SET NX EX` useful?
35. Why should lock release verify ownership?
36. How do you implement distributed rate limiting?
37. Redis sessions?
38. Redis serialization?
39. How do you design Redis keys?
40. What is a big key?
41. What is a hot key?
42. How do you monitor Redis?
43. What happens when Redis memory is full?
44. What happens if Redis goes down?
45. How do you prevent Redis from becoming a single point of failure?
46. Redis Cluster vs database sharding?
47. How would you handle stale cache data?
48. How would you prevent cache stampede?
49. How would you design a distributed lock?
50. When should Redis NOT be used?

---

# 132. Kafka Interview Questions — Basic to Advanced

51. What is Kafka?
52. Kafka vs traditional message queue?
53. What is a broker?
54. What is a topic?
55. What is a partition?
56. Why do partitions exist?
57. What is an offset?
58. What is a producer?
59. What is a consumer?
60. What is a consumer group?
61. What happens when consumers exceed partitions?
62. Can multiple consumer groups consume the same topic?
63. What ordering guarantees does Kafka provide?
64. How does the message key affect partitioning?
65. What is a partition leader?
66. What are follower replicas?
67. What is replication factor?
68. What is ISR?
69. What does `acks=all` mean?
70. What is producer idempotence?
71. What is producer batching?
72. What is compression?
73. How does a consumer commit offsets?
74. Auto vs manual offset commits?
75. At-most-once vs at-least-once?
76. What is exactly-once semantics?
77. Why is exactly-once difficult with external APIs?
78. What is consumer lag?
79. How do you reduce lag?
80. What is consumer rebalancing?
81. What causes rebalancing?
82. What is a poison message?
83. What is a dead-letter topic?
84. How should retries work?
85. What is Kafka retention?
86. What is log compaction?
87. What is a tombstone record?
88. Why does partition count matter?
89. Can Kafka partition count be reduced?
90. What is a hot partition?
91. How do you design a partition key?
92. What is schema evolution?
93. Avro vs JSON vs Protobuf?
94. What is Schema Registry?
95. Event vs command?
96. What is Kafka Streams?
97. What are Kafka transactions?
98. What is the outbox pattern?
99. What is the inbox pattern?
100. How do you implement an idempotent Kafka consumer?
101. Kafka vs Redis Pub/Sub?
102. Kafka vs Redis Streams?
103. Kafka vs RabbitMQ?
104. How do you monitor Kafka?
105. What are under-replicated partitions?
106. What happens if a broker dies?
107. What happens if a consumer dies?
108. What happens if the producer retries?
109. How do you handle duplicate messages?
110. How do you guarantee per-order ordering?
111. How do you handle large Kafka messages?
112. How do you secure Kafka?
113. How do you design Kafka for high throughput?
114. How do you design Kafka for high availability?
115. When should Kafka NOT be used?

---

# 133. Combined Redis + Kafka Questions

116. Redis vs Kafka?
117. Why would you use both Redis and Kafka?
118. Redis cache + Kafka event invalidation?
119. Kafka event + Redis materialized view?
120. Redis for rate limiting and Kafka for audit events?
121. How would you prevent duplicate Kafka processing using Redis?
122. Redis vs Kafka for distributed locking?
123. Redis Pub/Sub vs Kafka?
124. Redis Streams vs Kafka?
125. How would you build a notification system with Kafka and Redis?
126. How would you build an order system with Kafka, Redis, and PostgreSQL?
127. How would you maintain cache consistency after Kafka events?
128. What if Redis is unavailable but Kafka is healthy?
129. What if Kafka is unavailable but Redis is healthy?
130. How would you handle DB → Kafka reliability?
131. How would you handle Kafka → DB reliability?
132. How would you implement idempotency using Redis?
133. Why might a database uniqueness constraint be safer than Redis-only deduplication?
134. How would you handle cache stampede in a Kafka-driven system?
135. How would you build a distributed rate limiter using Redis?
136. How would you build an event-driven cache invalidation system?
137. How would you handle ordering + caching?
138. How would you design a payment system using Kafka and Redis?
139. How would you design inventory reservation?
140. How would you prevent overselling inventory?

---

# 134. High-Value Follow-Up Chain — Redis

```text
What is Redis?
   ↓
Why is it fast?
   ↓
What data structures exist?
   ↓
Why String vs Hash?
   ↓
What is TTL?
   ↓
Cache-aside?
   ↓
Cache invalidation?
   ↓
Stampede?
   ↓
Eviction?
   ↓
Persistence?
   ↓
Replication?
   ↓
Cluster?
   ↓
Hot key?
   ↓
Distributed lock?
   ↓
Failure handling?
```

---

# 135. High-Value Follow-Up Chain — Kafka

```text
What is Kafka?
   ↓
Topic?
   ↓
Partition?
   ↓
Offset?
   ↓
Producer?
   ↓
Consumer?
   ↓
Consumer group?
   ↓
Ordering?
   ↓
Partition key?
   ↓
Replication?
   ↓
ISR?
   ↓
acks?
   ↓
Consumer lag?
   ↓
Rebalancing?
   ↓
At-least-once?
   ↓
Idempotency?
   ↓
Exactly-once?
   ↓
External side effects?
```

---

# 136. High-Value Follow-Up Chain — Event-Driven Architecture

```text
REST request
   ↓
Service
   ↓
Database transaction
   ↓
Outbox
   ↓
Kafka
   ↓
Consumer Group
   ↓
Consumer
   ↓
Idempotency / Inbox
   ↓
Database
   ↓
Redis cache
   ↓
API read
```

Be able to explain:

```text
What happens if DB commit fails?
What happens if Kafka publish fails?
What happens if consumer crashes?
What happens if offset commit fails?
What happens if Redis is unavailable?
What happens if the same event arrives twice?
What happens if events arrive out of order?
```

---

# 137. Redis + Kafka Architecture Example

```text
                         ┌──────────────┐
                         │   Client     │
                         └──────┬───────┘
                                │
                                ▼
                         ┌──────────────┐
                         │ Spring Boot  │
                         │ API Service  │
                         └──────┬───────┘
                                │
                 ┌──────────────┼──────────────┐
                 │              │              │
                 ▼              ▼              ▼
              Redis          Database        Outbox
              Cache          Source           Table
                 │              │              │
                 │              │              ▼
                 │              │           Publisher
                 │              │              │
                 │              │              ▼
                 │              │           Kafka
                 │              │              │
                 │              │       ┌──────┼──────┐
                 │              │       ▼      ▼      ▼
                 │              │    Payment Inventory Notification
                 │              │
                 └──────────────┴───────────────┘
```

---

# 138. Final Mental Model

## Redis

Think:

```text
FAST SHARED STATE
      │
      ├── Cache
      ├── TTL
      ├── Counter
      ├── Set
      ├── Sorted Set
      ├── Session
      ├── Rate Limiter
      ├── Lock
      └── Stream
```

## Kafka

Think:

```text
DURABLE EVENT LOG
       │
       ├── Topic
       │
       ├── Partition
       │
       ├── Offset
       │
       ├── Consumer Group
       │
       ├── Replication
       │
       ├── Ordering
       │
       ├── Replay
       │
       └── Event Processing
```

---

# 139. Golden Rules

### Redis

1. Redis is not automatically a database replacement.
2. Redis is not automatically persistent.
3. Not every command is O(1).
4. TTL does not solve every consistency problem.
5. Cache invalidation requires deliberate design.
6. Do not blindly use Redis locks.
7. Verify lock ownership before release.
8. Avoid huge keys.
9. Watch for hot keys.
10. Cache failure must have a defined fallback.
11. Use TTL for temporary data where appropriate.
12. Choose eviction policies based on workload.
13. Do not treat Pub/Sub as durable messaging.
14. Redis Streams are different from Pub/Sub.
15. Serialization is part of the distributed-system contract.

### Kafka

16. Kafka is an event log, not simply a queue.
17. Ordering is guaranteed within a partition.
18. Partition key determines ordering boundaries.
19. Consumer parallelism is bounded by partitions.
20. More partitions are not always better.
21. At-least-once processing means duplicates are possible.
22. Idempotency is essential for many consumers.
23. Exactly-once Kafka semantics do not make external APIs exactly-once.
24. Consumer lag is a critical metric.
25. Rebalancing affects processing.
26. Poison messages need bounded retry/DLT strategies.
27. Schema evolution must be designed.
28. Large messages are usually a smell.
29. Kafka retention enables replay.
30. Kafka should not automatically become the source of truth for arbitrary queries.
31. Outbox solves an important DB → Kafka reliability gap.
32. Inbox/deduplication helps Kafka → DB reliability.
33. Monitor under-replicated partitions.
34. Choose partition keys around business ordering requirements.
35. Treat Kafka events as public contracts between services.

---

# 140. Final Interview Framework

When asked:

> "What is Redis?"

Do not answer:

> "Redis is an in-memory cache."

Instead:

```text
Definition
 ↓
Why it is fast
 ↓
Data structures
 ↓
Persistence
 ↓
Replication
 ↓
Cluster
 ↓
Typical use cases
 ↓
Failure modes
 ↓
Trade-offs
```

When asked:

> "What is Kafka?"

Do not answer:

> "Kafka is a messaging system."

Instead:

```text
Distributed event log
 ↓
Topic
 ↓
Partitions
 ↓
Offsets
 ↓
Consumer groups
 ↓
Ordering
 ↓
Replication
 ↓
Retention
 ↓
Delivery semantics
 ↓
Idempotency
 ↓
Failure handling
```

That is the level expected in a strong Java/Spring Boot interview.

---

# 141. Final Self-Test

You are interview-ready on Redis when you can explain without notes:

```text
Redis
Data types
Strings
Hashes
Sets
Sorted Sets
Streams
Pub/Sub
TTL
Cache-aside
Write-through
Write-behind
Invalidation
Stampede
Penetration
Avalanche
Eviction
RDB
AOF
Replication
Sentinel
Cluster
Hash slots
Hash tags
Atomicity
MULTI/EXEC
Lua
Distributed locks
Rate limiting
Sessions
Serialization
Big keys
Hot keys
Failure handling
Spring Data Redis
```

You are interview-ready on Kafka when you can explain:

```text
Kafka
Broker
Topic
Partition
Offset
Producer
Consumer
Consumer Group
Partition key
Ordering
Replication
Leader
Follower
ISR
Replication factor
acks
Producer retries
Idempotent producer
Batching
Compression
Offset commits
At-most-once
At-least-once
Exactly-once
Consumer lag
Rebalancing
Retention
Compaction
Tombstones
Schema evolution
DLT
Retries
Poison messages
Transactions
Outbox
Inbox
Idempotent consumer
Hot partitions
Large messages
Security
Monitoring
Spring Kafka
```

And finally, you should be able to design:

```text
1. Distributed cache
2. Rate limiter
3. Distributed lock
4. Notification system
5. Order event pipeline
6. Payment event pipeline
7. Inventory reservation
8. Event-driven cache invalidation
9. Kafka-based audit system
10. Redis + Kafka + PostgreSQL architecture
```

---

# 142. The Most Important Mental Model

For a full-stack Java/Spring Boot developer, remember:

```text
                 USER REQUEST
                      │
                      ▼
                 REST API
                      │
              ┌───────┴───────┐
              │               │
              ▼               ▼
            Redis          Database
             Cache         Source of Truth
              │               │
              │               │
              │            Transaction
              │               │
              │               ▼
              │             Outbox
              │               │
              │               ▼
              │             Kafka
              │               │
              │        ┌──────┼──────┐
              │        ▼      ▼      ▼
              │     Service Service Service
              │        │      │      │
              │        └──────┴──────┘
              │               │
              └───────────────┘
```

The core distinction:

```text
Redis
→ "What state do I need extremely quickly right now?"

Kafka
→ "What happened, and which services need to know about it?"
```

That distinction will help you answer a surprisingly large number of senior interview questions.
