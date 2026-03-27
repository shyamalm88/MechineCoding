# System Design: Chat Application (WhatsApp / Facebook Messenger)

---

## 1. Problem Statement & Scope

Design a real-time chat application similar to WhatsApp or Facebook Messenger. The system must support one-to-one messaging, group messaging, media sharing, and message status tracking (sent, delivered, read) at massive scale — targeting 1 billion users exchanging 100 billion messages per day.

**In Scope:**
- User registration and authentication (phone-number based)
- One-to-one (1:1) real-time messaging
- Group messaging
- Message history with lazy loading (infinite scroll)
- Media file sharing (images, videos)
- Message status: Sent → Delivered → Read (1 tick, 2 ticks, blue ticks)
- Offline message delivery

**Out of Scope:**
- Voice and video calls
- Stories / Status features
- End-to-end encryption design (acknowledged as a real-world concern, not covered here)
- Payment features

---

## 2. Requirements

### 2.1 Functional Requirements (MVP)

1. **User sign-up / sign-in** — Phone number based registration, similar to WhatsApp. Users receive a JWT token upon successful login.
2. **One-to-one messaging** — Two users can send and receive text messages in real time.
3. **Group messaging** — Users can create groups, add/remove members, and send messages to all members.
4. **Message history** — Users can scroll back through past messages using lazy loading (pagination via offset + limit).
5. **Media file sharing** — Users can send images and videos; media is stored in blob storage (S3) and the URL is stored in the message record.
6. **Message status** — Each message shows delivery state:
   - Single tick: server received and stored the message
   - Double tick: message delivered to the recipient's device
   - Blue ticks: recipient has opened and read the message

### 2.2 Non-Functional Requirements

| Requirement         | Target                                      |
|---------------------|---------------------------------------------|
| Scale               | 1 billion total users                       |
| Message throughput  | 100 billion messages/day (~1.16M msg/sec)   |
| Storage             | ~100 TB/day (text messages alone)           |
| Availability        | High availability (99.99%+)                 |
| Consistency         | Eventual consistency (not a banking system) |
| Latency             | < 300ms end-to-end message delivery         |
| Reliability         | Zero message loss                           |
| CAP theorem choice  | AP (Availability + Partition Tolerance)     |

**Justification for eventual consistency:** A chat app can tolerate a message arriving slightly out of order or a recipient seeing a tick update a second late. We must never drop a message, but we do not need strict linearizability.

---

## 3. Back-of-the-Envelope Estimations

### 3.1 Users and Messages

```
Total users:                    1,000,000,000   (1 billion)
Assume 50% DAU:                   500,000,000   (500 million)
Messages per user per day:               ~100
Total messages per day:       100,000,000,000   (100 billion)

Messages per second (peak, 2x avg):
  100B / 86,400 sec ≈ 1,157,000 msg/sec
  Peak ≈ 2,300,000 msg/sec (2.3 million/sec)
```

### 3.2 Storage

```
Average message size:                    1 KB
Messages per day:                      100 B
Storage per day (text):          100 TB/day
Storage per year (text):      ~36.5 PB/year

Media messages (assume 10% of messages carry media):
  10B media messages/day
  Average media size: 500 KB (thumbnail + compressed video)
  Media storage per day:   ~5 PB/day (served via CDN, object storage)

Total message DB storage per year: ~36.5 PB (text only, before replication)
With 3x replication: ~110 PB/year
```

### 3.3 Bandwidth

```
Ingress (messages sent to system):
  1.16M msg/sec x 1 KB = ~1.16 GB/sec ingress

Egress (messages delivered, avg 1.5 recipients):
  ~1.74 GB/sec egress (text only)

WebSocket connections (active users at peak):
  ~100M concurrent WebSocket connections
```

### 3.4 WebSocket Server Sizing

```
Assumption: 1 Chat Server handles 50,000 concurrent WebSocket connections
Servers needed: 100M / 50,000 = 2,000 Chat Server instances
```

---

## 4. API Design

All REST endpoints go through the HTTP API Gateway. Real-time messaging uses a separate WebSocket endpoint through the WebSocket Gateway.

---

### 4.1 User Endpoints

**Register a new user**
```
POST /api/v1/users/register

Request Body:
{
  "phone": "+14155552671",
  "name": "Alice Smith",
  "metadata": { "device_type": "ios", "app_version": "2.4.1" }
}

Response 201:
{
  "user_id": "usr_8f3k2",
  "name": "Alice Smith",
  "phone": "+14155552671",
  "created_at": "2026-03-28T10:00:00Z"
}
```

**Login**
```
POST /api/v1/users/login

Request Body:
{
  "phone": "+14155552671",
  "otp": "482910"
}

Response 200:
{
  "user_id": "usr_8f3k2",
  "jwt_token": "eyJhbGciOiJIUzI1NiIs...",
  "expires_at": "2026-04-28T10:00:00Z"
}
```

---

### 4.2 Chat Endpoints

**List all chats for a user**
```
GET /api/v1/chats?userId={userId}
Authorization: Bearer <jwt_token>

Response 200:
{
  "chats": [
    {
      "chat_id": "chat_ab12",
      "type": "one_to_one",
      "participant": { "user_id": "usr_9b2k", "name": "Bob" },
      "last_message": "Hey, are you free tonight?",
      "last_message_at": "2026-03-28T09:55:00Z",
      "unread_count": 3
    }
  ]
}
```

**Fetch message history (lazy load / infinite scroll)**
```
GET /api/v1/chats/{chatId}/messages?offset={x}&limit={y}
Authorization: Bearer <jwt_token>

Response 200:
{
  "messages": [
    {
      "message_id": "msg_001",
      "sender_id": "usr_8f3k2",
      "content": "Hey!",
      "media_url": null,
      "status": "read",
      "sent_at": "2026-03-28T09:50:00Z"
    }
  ],
  "next_offset": 20,
  "has_more": true
}
```

---

### 4.3 Group Endpoints

**Create a group**
```
POST /api/v1/groups
Authorization: Bearer <jwt_token>

Request Body:
{
  "name": "Team Alpha",
  "creator_id": "usr_8f3k2",
  "member_ids": ["usr_9b2k", "usr_7c1m"]
}

Response 201:
{
  "group_id": "grp_5x9z",
  "name": "Team Alpha",
  "member_count": 3
}
```

**Add a member**
```
POST /api/v1/groups/{groupId}/members
Authorization: Bearer <jwt_token>

Request Body:
{
  "user_id": "usr_4d8n"
}

Response 200:
{ "message": "Member added successfully" }
```

**Remove a member**
```
DELETE /api/v1/groups/{groupId}/members/{userId}
Authorization: Bearer <jwt_token>

Response 200:
{ "message": "Member removed successfully" }
```

**Group message history**
```
GET /api/v1/groups/{groupId}/messages?offset={x}&limit={y}
Authorization: Bearer <jwt_token>

Response 200: (same structure as chat message history)
```

---

### 4.4 WebSocket Endpoint

**Establish real-time connection**
```
WS /ws/chat
Headers:
  Authorization: Bearer <jwt_token>
  Upgrade: websocket
  Connection: Upgrade
```

Once connected, the client and server exchange JSON frames:

**Send a message (client → server):**
```json
{
  "type": "send_message",
  "chat_id": "chat_ab12",
  "recipient_id": "usr_9b2k",
  "content": "Hello Bob!",
  "media_url": null,
  "client_message_id": "local_uuid_001"
}
```

**Receive a message (server → client):**
```json
{
  "type": "new_message",
  "message_id": "msg_server_001",
  "chat_id": "chat_ab12",
  "sender_id": "usr_8f3k2",
  "content": "Hello Bob!",
  "sent_at": "2026-03-28T10:01:00Z"
}
```

**Delivery receipt (server → sender):**
```json
{
  "type": "delivery_receipt",
  "message_id": "msg_server_001",
  "status": "delivered",
  "delivered_at": "2026-03-28T10:01:01Z"
}
```

**Read receipt (server → sender):**
```json
{
  "type": "read_receipt",
  "message_id": "msg_server_001",
  "status": "read",
  "read_at": "2026-03-28T10:02:00Z"
}
```

---

## 5. System Architecture

### 5.1 Diagram 1 — Simple High-Level Design

A clean starting point: clients talk to an API Gateway, which routes to dedicated services backed by their own databases.

```mermaid
graph TD
    Client["Mobile / Web Client"]
    GW["API Gateway\n(auth · rate limit · routing)"]
    US["User Service"]
    CS["Chat Service\n(REST only — no WS yet)"]
    GS["Group Service"]
    UDB[("User DB\nPostgreSQL")]
    MDB[("Message DB\nPostgreSQL")]
    GDB[("Group DB\nPostgreSQL")]

    Client -->|HTTPS| GW
    GW --> US
    GW --> CS
    GW --> GS
    US --> UDB
    CS --> MDB
    GS --> GDB
```

**Limitations of this design:**
- REST polling required for message delivery — wasteful at scale
- Single message DB (Postgres) cannot handle 100B writes/day
- No real-time capability

---

### 5.2 Diagram 2 — Evolved Production Design

We introduce a dedicated WebSocket Gateway, Chat Server fleet, Redis for connection mapping, Kafka for cross-server message routing, Cassandra for message storage, S3 + CDN for media, and a separate Group Service.

```mermaid
graph TD
    Client["Mobile / Web Client"]

    HTTPGW["HTTP API Gateway\n(REST: auth · history · groups)"]
    WSGW["WebSocket Gateway\n(sticky routing · auth · rate limit)"]

    US["User Service"]
    GS["Group Service"]
    CS1["Chat Server 1"]
    CS2["Chat Server 2"]
    CSN["Chat Server N"]

    UDB[("User DB\nPostgreSQL")]
    GDB[("Group DB\nPostgreSQL")]

    Kafka[["Apache Kafka\n(cross-server delivery · fan-out)"]]
    Cassandra[("Cassandra\nMessage Store\npartitioned by conversation_id")]
    Redis(["Redis Cluster\nsession map: user_id → server_id\nmessage cache"])

    S3["S3 / Blob Storage\n(raw media files)"]
    CDN["CDN Edge\n(global media delivery)"]

    Client -->|HTTPS REST| HTTPGW
    Client -->|WebSocket| WSGW
    Client -->|presigned URL upload| S3
    S3 --> CDN

    HTTPGW --> US
    HTTPGW --> GS
    US --> UDB
    GS --> GDB

    WSGW --> CS1
    WSGW --> CS2
    WSGW --> CSN

    CS1 <--> Kafka
    CS2 <--> Kafka
    CSN <--> Kafka

    Kafka --> Cassandra
    CS1 <--> Redis
    CS2 <--> Redis
```

**Component responsibilities:**

| Component            | Role                                                                 |
|----------------------|----------------------------------------------------------------------|
| HTTP API Gateway     | REST endpoints for auth, history, group management                   |
| WebSocket Gateway    | Sticky routing, authentication, rate limiting for WS connections     |
| Chat Service         | Manages WebSocket connections, message routing, receipt handling      |
| User Service         | Registration, login, profile management                              |
| Group Service        | Group CRUD, member management, fan-out coordination                  |
| Cassandra            | Primary message store — high write throughput, partition tolerant    |
| PostgreSQL (User DB) | User accounts — relational, easy to query                           |
| PostgreSQL (Group DB)| Group metadata and group_members mapping                             |
| Redis                | WebSocket server mapping (user_id → server_id), session tokens       |
| Kafka                | Cross-server message delivery and async group fan-out                |
| S3 / Blob Storage    | Raw media files (images, videos)                                     |
| CDN                  | Media delivery at edge — low latency downloads globally              |

---

## 6. Deep Dives

### 6.1 Deep Dive 1 — WebSocket Connection Management & Sticky Sessions

#### Why WebSocket?

Before choosing WebSocket, let us consider the alternatives:

| Protocol      | How it works                                       | Problem                                                     |
|---------------|----------------------------------------------------|-------------------------------------------------------------|
| HTTP Polling  | Client polls server every N seconds                | Wasteful, high latency, unnecessary requests                |
| Long Polling  | Client holds connection open, server responds late | Reconnects every ~30 sec, doubles the connection count      |
| SSE           | Server pushes events, client listens               | Unidirectional — client needs a separate POST to send       |
| **WebSocket** | Full-duplex persistent TCP connection              | Single connection handles send and receive — **chosen**     |

WebSocket is the correct choice for a chat application because both client and server need to push data at any time. The connection is established once and reused for the entire session.

#### WebSocket Handshake

```mermaid
sequenceDiagram
    participant C as Client
    participant S as Chat Server

    Note over C: Wants to open a WebSocket
    C->>S: HTTP GET /ws/chat
    Note over C,S: Headers: Upgrade: websocket, Connection: Upgrade, Sec-WebSocket-Key
    S-->>C: HTTP 101 Switching Protocols
    Note over C,S: Headers: Upgrade: websocket, Sec-WebSocket-Accept
    Note over C,S: TCP connection upgraded — full-duplex WS active
    C->>S: WS Frame: send_message
    S->>C: WS Frame: new_message / delivery_receipt
```

After the HTTP 101 response, the TCP connection is "upgraded" and both sides can send frames freely.

#### Sticky Sessions Problem

Each Chat Server holds WebSocket connections **in memory**. User A's connection lives inside Chat Server 1's process. If a subsequent request from User A hits Chat Server 2, there is no connection object there. Therefore:

- The WebSocket Gateway uses **sticky routing** — once a user connects to Chat Server 1, all subsequent WS frames from that user go to Chat Server 1.
- Sticky routing is implemented via consistent hashing on user_id at the WS Gateway level.

#### Connection Mapping in Redis

When User A connects to Chat Server 1, the server writes:

```
Redis Key:   ws:session:usr_8f3k2
Redis Value: chat_server_1
TTL:         30 seconds (refreshed on each heartbeat)
```

Any other Chat Server that needs to deliver a message to User A can look up this key to find the right server.

#### Heartbeat and Reconnection

```
Client sends PING frame every 25 seconds
Chat Server responds with PONG frame
If no PING received in 30s → server closes connection and deletes Redis key
Client detects disconnect → reconnects with exponential backoff
On reconnect → fetches missed messages via REST (GET /chats/{chatId}/messages)
```

#### Database Schema — Session Mapping

Redis handles the live session mapping. No persistent DB needed for this — TTL handles stale sessions automatically.

```
Redis Hash (alternative structure for richer data):
HSET ws:session:usr_8f3k2 server_id "chat_server_1"
                           connected_at "2026-03-28T10:00:00Z"
                           device_id "iphone_14_abc"
EXPIRE ws:session:usr_8f3k2 30
```

---

### 6.2 Deep Dive 2 — Message Delivery Flow (1:1 and Group) + Offline Handling

#### 6.2.1 One-to-One Message Delivery

```mermaid
sequenceDiagram
    participant A as User A
    participant CS1 as Chat Server 1
    participant R as Redis
    participant K as Kafka
    participant CS2 as Chat Server 2
    participant B as User B

    A->>CS1: WS: send_message { to: UserB, content }
    CS1->>CS1: Persist to Cassandra
    CS1->>R: GET ws:session:UserB
    R-->>CS1: "chat_server_2"
    CS1->>K: Publish to user_B.inbox topic
    CS1-->>A: ACK - Single tick (stored)
    K->>CS2: CS2 consumes delivery event
    CS2->>B: WS: push new_message
    CS2->>K: Publish delivery_ack
    K->>CS1: CS1 consumes ack
    CS1-->>A: ACK - Double tick (delivered)
    B->>CS2: WS: read_receipt
    CS2->>K: Publish read_ack
    K->>CS1: CS1 consumes read_ack
    CS1-->>A: ACK - Blue ticks (read)
```

**Step-by-step:**

1. User A sends a WS frame to Chat Server 1 with message content and recipient_id.
2. Chat Server 1 persists the message to Cassandra immediately. Generates a server-side message_id.
3. Chat Server 1 looks up Redis: `GET ws:session:usr_UserB` → returns `chat_server_2`.
4. Chat Server 1 publishes the message to a Kafka topic (e.g., `user.{userB_id}.inbox`).
5. Chat Server 2 is a Kafka consumer subscribed to User B's inbox topic.
6. Chat Server 1 sends a single-tick ACK back to User A over WS (server has stored the message).
7. Chat Server 2 pushes the message to User B over their active WebSocket connection.
8. Chat Server 2 sends a delivery ACK back through Kafka (or directly via internal gRPC) to Chat Server 1, which forwards a double-tick to User A.

#### 6.2.2 Group Message Delivery

Group messaging adds a fan-out problem: one message must be delivered to N members.

**For small groups (< 100 members) — synchronous fan-out:**

```mermaid
graph TD
    A["User A sends to Group G"]
    CS1["Chat Server 1"]
    GS["Group Service\nfetch all member_ids"]
    R["Redis\nlookup: user → server"]
    SrvN["Target Chat Servers"]
    Members["Group Members 1..N"]

    A --> CS1
    CS1 --> GS
    GS --> R
    R --> SrvN
    SrvN --> Members
```

**For large groups (1000+ members) — asynchronous fan-out:**

```mermaid
graph TD
    A["User A sends to Group G"]
    CS1["Chat Server 1"]
    K[["Kafka\ngroup.groupId.messages"]]
    FC["Fan-out Consumer Service\n(dedicated async worker)"]
    GDB[("Group DB\nfetch member list")]
    SrvN["Each Member's Chat Server"]
    Members["Group Members 1..N"]

    A --> CS1
    CS1 -->|"single Kafka event"| K
    CS1 -->|"immediate single tick"| A
    K --> FC
    FC --> GDB
    GDB --> FC
    FC -->|individual delivery events| SrvN
    SrvN --> Members
```

The async fan-out approach decouples the sender's acknowledgment from the delivery complexity. User A gets their single tick immediately; the fan-out happens in the background.

#### 6.2.3 Offline Message Handling

When User B is offline (no entry in Redis session map):

```mermaid
flowchart TD
    A["User A sends message"]
    CS1["Chat Server 1"]
    Cass[("Cassandra\nstatus: stored")]
    R{"Redis lookup:\nUser B online?"}
    Push["Send push notification\nAPNs / FCM"]
    Wake["User B device wakes up\nopens app"]
    Reconnect["User B establishes\nnew WS connection"]
    Fetch["Client fetches missed messages\nGET /chats/chatId/messages"]
    Ack["Client sends delivery ACKs"]
    Notify["Server notifies User A\ndouble tick"]

    A --> CS1
    CS1 --> Cass
    CS1 --> R
    R -->|"not connected"| Push
    Push --> Wake
    Wake --> Reconnect
    Reconnect --> Fetch
    Fetch --> Ack
    Ack --> Notify
```

**Key insight:** Push notifications are a "wake-up call," not a delivery mechanism. The actual messages are always fetched from Cassandra. This avoids push notification size limits and ordering issues.

#### 6.2.4 Message Storage Schema (Cassandra)

```sql
-- Cassandra table for messages
CREATE TABLE messages (
    conversation_id  UUID,           -- partition key (chat_id or group_id)
    sent_at          TIMESTAMP,      -- clustering key (DESC for recent-first)
    message_id       UUID,
    sender_id        UUID,
    content          TEXT,
    media_url        TEXT,           -- null if text-only
    message_type     TEXT,           -- 'text', 'image', 'video'
    status           TEXT,           -- 'stored', 'delivered', 'read'
    PRIMARY KEY ((conversation_id), sent_at, message_id)
) WITH CLUSTERING ORDER BY (sent_at DESC);
```

**Why Cassandra over PostgreSQL for messages?**

| Dimension             | Cassandra                              | PostgreSQL                         |
|-----------------------|----------------------------------------|------------------------------------|
| Write throughput      | Millions of writes/sec per node        | Thousands of writes/sec per node   |
| Horizontal scaling    | Native, linear scaling                 | Complex sharding required          |
| Single point of fail  | No SPOF, multi-master                  | Primary node is SPOF               |
| Consistency model     | Tunable (eventual default)             | Strong (ACID)                      |
| Message workload fit  | Excellent (append-heavy, partition by  | Poor at this scale                 |
|                       | conversation_id, time-range queries)   |                                    |

At 100B messages/day, Cassandra is the only realistic choice. PostgreSQL would require hundreds of shards with complex routing logic, and still could not match Cassandra's write path performance.

---

### 6.3 Deep Dive 3 (Bonus) — Message Status: Sent / Delivered / Read Receipts

The three-tick system requires careful state tracking and is often tricky at scale.

#### State Machine

```mermaid
stateDiagram-v2
    direction TB
    [*] --> PENDING : User taps send
    PENDING --> SENT : Server ACK\n(message_id assigned)
    SENT --> DELIVERED : Recipient device\nreceived message
    DELIVERED --> READ : Recipient opens\nconversation

    PENDING : PENDING\nclock icon · local only
    SENT : SENT\nsingle tick ✓
    DELIVERED : DELIVERED\ndouble tick ✓✓
    READ : READ\nblue ticks ✓✓
```

#### How Each State Transition Works

**SENT (single tick):**
- Chat Server 1 receives the WS frame from User A.
- Persists to Cassandra with status = `stored`.
- Sends ACK frame back to User A with the server-generated `message_id`.
- Client shows single tick.

**DELIVERED (double tick):**
- Chat Server 2 successfully pushes the message to User B's device over WS.
- Chat Server 2 sends a delivery event back (via Kafka or gRPC) to Chat Server 1.
- Chat Server 1 sends a `delivery_receipt` WS frame to User A.
- Client shows double tick.
- Cassandra message status updated to `delivered`.

**READ (blue ticks):**
- User B opens the conversation in the app.
- Client sends a WS frame: `{ type: "read_receipt", message_ids: [...] }`.
- Chat Server 2 receives this, updates Cassandra status to `read`.
- Chat Server 2 publishes a read event → Chat Server 1 delivers a `read_receipt` frame to User A.
- User A's client shows blue ticks.

**Batch read receipts (Modern Optimization):**
Rather than sending one read receipt per message, the client sends a single receipt with `{ last_read_message_id: "msg_099" }`, implying all messages up to that ID are read. This reduces WS frame volume significantly in active conversations.

#### Read Receipt Privacy

Some applications (like WhatsApp) allow users to disable read receipts. In that case:
- The client does not send read receipt WS frames.
- The server never updates status to `read` for that user.
- The sender never sees blue ticks.

This is a per-user preference stored in the User DB and checked by the Chat Server before forwarding read events.

---

## 7. Trade-offs & Bottlenecks

### 7.1 Cassandra vs MySQL/PostgreSQL for Message Storage

**Decision: Cassandra**

The primary argument is write throughput. At 1.16 million messages per second (average), no single PostgreSQL instance can keep up. Even with read replicas and connection pooling, PostgreSQL's write path is limited to the primary node.

Cassandra's multi-master architecture means every node accepts writes. Adding nodes scales write capacity linearly. The partition key (conversation_id) ensures all messages in a conversation land on the same set of nodes, making range queries efficient.

**Trade-off accepted:** Cassandra does not support joins or transactions. Group membership cannot be stored in Cassandra alongside messages — that is why we use a separate PostgreSQL Group DB. Also, Cassandra's eventual consistency means a brief window where two clients might see slightly different message orderings. For a chat app, this is acceptable.

---

### 7.2 WebSocket vs HTTP Polling vs Long Polling vs SSE

**Decision: WebSocket**

| Option       | Latency         | Server load              | Duplex?       | Verdict           |
|--------------|-----------------|--------------------------|---------------|-------------------|
| HTTP Polling | High (1-10 sec) | Very high (empty polls)  | Yes (ugly)    | Rejected          |
| Long Polling | Medium (~30 sec)| High (reconnect storms)  | Yes (ugly)    | Rejected          |
| SSE          | Low             | Medium                   | No (send via  | Rejected          |
|              |                 |                          | separate POST)|                   |
| WebSocket    | < 50ms          | Low (persistent conn)    | Yes           | **Chosen**        |

For a chat app, full-duplex low-latency communication is non-negotiable. WebSocket is the industry standard for this use case.

**Trade-off accepted:** WebSocket connections are stateful and sticky. This complicates horizontal scaling and load balancing. We solve this with sticky routing in the WS Gateway and the Redis session map.

---

### 7.3 Redis vs Database for Session/Connection Mapping

**Decision: Redis**

The session map (`user_id → server_id`) is read on every message send operation. With 1.16M messages/sec, that is 1.16M Redis lookups per second. Redis handles millions of reads/sec at sub-millisecond latency from memory.

Storing this in PostgreSQL would require disk I/O on every message route decision — latency would be 10-100x higher and the DB would become a bottleneck.

**Trade-off accepted:** Redis is in-memory. A Redis node failure loses session data. We mitigate this with Redis Cluster (multi-node replication) and the TTL mechanism — clients reconnect automatically and re-register their session within seconds.

---

### 7.4 Kafka vs Direct Server-to-Server Calls for Cross-Server Delivery

**Decision: Kafka**

If Chat Server 1 calls Chat Server 2 directly (via gRPC or HTTP) to forward a message, we introduce tight coupling and a failure mode: if Chat Server 2 is temporarily unavailable, the message is dropped.

Kafka decouples the producer (Chat Server 1) from the consumer (Chat Server 2). If Chat Server 2 is down, the message sits in Kafka. When Chat Server 2 recovers, it consumes the backlog. This gives us the zero message loss guarantee.

**Trade-off accepted:** Kafka introduces added latency (typically 5-20ms additional). For our < 300ms target, this is acceptable. Kafka also adds operational complexity — it requires its own cluster, ZooKeeper/KRaft management, and topic partitioning strategy.

**Alternative Approach:** For a smaller system or team, Redis pub/sub can replace Kafka for cross-server message routing. Redis pub/sub is simpler but does not persist messages — if the subscriber is down when the event fires, the message is lost. Kafka's durable log is worth the complexity at our scale.

---

### 7.5 Eventual Consistency Trade-off

The system is designed for AP (Availability + Partition Tolerance) per the CAP theorem.

**What this means in practice:**
- A message may be stored on one Cassandra node and briefly unavailable on replicas during a network partition. A recipient on a different read replica might not immediately see the latest message.
- Read receipts may arrive slightly out of order.
- Two users may briefly see different tick statuses for the same message.

**Why this is acceptable:**
- We are not a banking system. Message ordering within a few milliseconds does not harm the user experience.
- WhatsApp and Facebook Messenger both operate with eventual consistency and users find it acceptable.

**What we never compromise on:**
- Zero message loss: Kafka's durable log and Cassandra's replication factor (typically 3) ensure a message written to the system is never dropped.
- Monotonic reads within a session: A user will never see a message disappear after seeing it (Cassandra's LWW last-write-wins policy handles this cleanly with timestamps as clustering keys).

---

### 7.6 Bottlenecks and How We Mitigate Them

| Bottleneck                         | Mitigation                                                          |
|------------------------------------|---------------------------------------------------------------------|
| WebSocket Gateway becoming SPOF    | Horizontal scaling, multiple WS Gateway nodes behind a TCP LB      |
| Chat Server memory limits          | Limit connections per server, auto-scale fleet, shed connections    |
| Cassandra hot partition            | Good partition key (conversation_id distributes load evenly)        |
| Redis single point of failure      | Redis Cluster with replication and sentinel                         |
| Kafka consumer lag during peak     | Increase partition count, scale consumer fleet, monitor lag         |
| Large group fan-out (1M members)   | Async fan-out service, rate-limited delivery, async Kafka pipeline  |
| Media storage costs                | CDN caching reduces S3 egress, lifecycle policies archive old media |

---

## 8. Summary

This design supports 1 billion users exchanging 100 billion messages per day with end-to-end delivery under 300ms, zero message loss, and high availability.

**Key architectural decisions:**

1. **WebSocket** for real-time bidirectional messaging — the only protocol that efficiently supports chat at scale.
2. **Sticky sessions** with a Redis connection map — solves the stateful WebSocket routing problem without sacrificing horizontal scalability.
3. **Kafka** between Chat Servers — decouples delivery, enables zero message loss, and handles group fan-out asynchronously.
4. **Cassandra** for messages — the only database capable of handling 1M+ writes/sec with linear horizontal scaling and no single point of failure.
5. **PostgreSQL** for Users and Groups — relational data that benefits from joins and ACID guarantees.
6. **S3 + CDN** for media — offloads binary data from the message pipeline, serves content at global edge locations.
7. **Eventual consistency** — deliberately chosen because the use case (chat) does not require strict linearizability, and availability is more important than perfect ordering.

---

---

# Frontend System Design: Chat Application (WhatsApp Web)

---

## F1. Problem Statement & Scope

Design the frontend of a real-time chat web application (like WhatsApp Web). The client must maintain a persistent WebSocket connection, render thousands of messages efficiently, handle offline states gracefully, and deliver a sub-100ms perceived response to user actions.

**In Scope:**
- Authentication flow (phone number + OTP)
- Chat list view (conversation list)
- Message thread view (1:1 and group)
- Real-time message sending and receiving via WebSocket
- Message status indicators (sent, delivered, read)
- Media upload and preview (images, videos)
- Infinite scroll / lazy loading of message history
- Typing indicators and online/offline presence
- Push notifications (background tab)
- Offline support (IndexedDB queue)

**Out of Scope:**
- Voice/video calls UI
- End-to-end encryption UI
- Native mobile app design

---

## F2. Requirements

### F2.1 Functional Requirements

1. User can log in with phone number and OTP.
2. User sees a list of all conversations, ordered by most recent message.
3. User can open a conversation and see message history (lazy-loaded).
4. User can type and send messages in real time.
5. Messages show status: clock (sending) → single tick (sent) → double tick (delivered) → blue ticks (read).
6. User can upload and preview images/videos before sending.
7. User can create/manage groups.
8. Typing indicators appear when the other party is typing.
9. Online/offline presence shown per contact.
10. App works partially when offline (read cached messages, queue outgoing messages).

### F2.2 Non-Functional Requirements

| Requirement        | Target                                              |
|--------------------|-----------------------------------------------------|
| Initial load time  | < 3s on 4G (TTI — Time to Interactive)             |
| Message render     | < 100ms perceived latency on send                  |
| Scroll performance | 60 fps while scrolling through 10,000+ messages    |
| Offline support    | Read last 50 messages per chat without network      |
| Bundle size        | < 200KB gzipped JS (code-split aggressively)       |
| Accessibility      | WCAG 2.1 AA compliance                             |

---

## F3. Back-of-the-Envelope Estimations (Frontend)

```
Concurrent browser sessions (DAU on web): ~50 million
WebSocket connections sustained per client: 1 persistent connection
Messages rendered per user session: ~500-2000 messages across chats
Average chat list size: 30-50 conversations
Average message size (payload to client): ~500 bytes JSON
Media thumbnail size: ~20KB (compressed preview)
IndexedDB budget per user: ~50MB (last 50 messages × 1000 chats)
```

---

## F4. API Contracts (Frontend Perspective)

### REST endpoints consumed by the client

```
GET  /api/v1/chats?userId={id}
     Response: [{ chatId, lastMessage, unreadCount, participants }]

GET  /api/v1/chats/{chatId}/messages?offset={x}&limit=50
     Response: [{ messageId, senderId, content, mediaUrl, status, timestamp }]

POST /api/v1/users/register
     Body: { phone, name }

POST /api/v1/users/login
     Body: { phone, otp }
     Response: { jwtToken, userId }

POST /api/v1/media/upload
     Body: FormData (multipart)
     Response: { mediaUrl, thumbnailUrl }
```

### WebSocket events (client ↔ server)

```
Client → Server:
  { type: "send_message",   chatId, content, mediaUrl?, clientMsgId }
  { type: "typing_start",   chatId }
  { type: "typing_stop",    chatId }
  { type: "read_receipt",   chatId, messageId }

Server → Client:
  { type: "new_message",    chatId, message }
  { type: "message_status", chatId, messageId, status }   // delivered | read
  { type: "typing",         chatId, userId, isTyping }
  { type: "presence",       userId, status }               // online | offline
```

---

## F5. Progressive UI Architecture Diagrams

### Diagram 1 — Simple Component Tree

```mermaid
graph TD
    AppShell["App Shell\nauth check · WS init · route guard"]

    Sidebar["Sidebar"]
    SearchBar["SearchBar"]
    ChatList["ChatList"]
    ChatItem["ChatItem"]

    ChatWindow["Chat Window"]
    MessageList["MessageList\nvirtual list"]
    MessageBubble["MessageBubble"]
    TypingIndicator["TypingIndicator"]
    MessageInput["MessageInput"]
    MediaUploader["MediaUploader"]

    AppShell --> Sidebar
    AppShell --> ChatWindow

    Sidebar --> SearchBar
    Sidebar --> ChatList
    ChatList --> ChatItem

    ChatWindow --> MessageList
    ChatWindow --> TypingIndicator
    ChatWindow --> MessageInput
    MessageList --> MessageBubble
    MessageInput --> MediaUploader
```

### Diagram 2 — Evolved Architecture with State & Data Flow

```mermaid
graph TD
    Auth["Auth Module\nOTP + JWT"]
    APIGW["API Gateway\nBackend"]
    AppShell["App Shell"]
    WSClient["WebSocket Client\nsingleton\n· reconnect · heartbeat · outbox"]
    GlobalState["Global State\nZustand / Redux\nmessages · chats · presence · typing"]
    Sidebar["Sidebar\nChatList · Search · Unread"]
    MessageList["MessageList\nvirtual list\nMessageBubble · lazy load · sticky scroll"]
    MediaUpload["MediaUploader\npresigned S3 URL"]
    IndexedDB[("IndexedDB\noffline cache\nmessages · chat metadata")]
    S3["S3 / CDN"]

    Auth -->|HTTP REST| APIGW
    APIGW -->|JWT stored in memory| AppShell
    AppShell --> WSClient
    AppShell --> GlobalState
    WSClient <-->|WS frames| APIGW
    WSClient -->|dispatch events| GlobalState
    GlobalState --> Sidebar
    GlobalState --> MessageList
    GlobalState --> MediaUpload
    AppShell -->|cache miss| IndexedDB
    MediaUpload -->|direct upload| S3
```

---

## F6. Deep Dives

### F6.1 WebSocket Client Management

The WebSocket connection is the most critical frontend concern. It must be a **singleton** — opened once when the user authenticates and kept alive for the entire session.

**Connection lifecycle:**
```mermaid
flowchart LR
    Start([App Start]) --> Auth[Authenticate\nOTP + JWT]
    Auth --> OpenWS[Open WebSocket]
    OpenWS --> Subscribe[Subscribe to events]
    Subscribe --> Active{Connected?}
    Active -->|Yes| Active
    Active -->|Disconnect| Backoff[Exponential backoff\n1s · 2s · 4s · max 30s]
    Backoff --> ReAuth[Re-authenticate]
    ReAuth --> Fetch[Fetch missed messages\nsince lastSeen]
    Fetch --> Subscribe
```

**Outgoing message queue (offline support):**
When the device is offline, outgoing messages should NOT be dropped. Instead:
```mermaid
flowchart TD
    UserSend["User sends message"] --> GenID["Generate clientMsgId\nUUID"]
    GenID --> ShowUI["Show in UI\nclock — pending status"]
    ShowUI --> Enqueue["Enqueue in IndexedDB outbox"]
    Enqueue --> Online{Online?}
    Online -->|Yes| SendWS["Send via WebSocket"]
    Online -->|No| Wait["Wait for reconnect"]
    Wait --> SendWS
    SendWS --> ACK["Server ACK\n(message_id returned)"]
    ACK --> UpdateStatus["Update status\nclock → single tick"]
```

This gives the user instant perceived feedback even without network.

**Heartbeat / Keep-alive:**
Send a ping frame every 25 seconds to prevent NAT/proxy timeouts. If no pong received within 5 seconds, close and reconnect.

---

### F6.2 Virtual List for Message Rendering

Rendering 10,000+ messages in the DOM will freeze the browser. Use **windowed / virtual rendering** — only the visible messages (+ a small buffer above/below) are actually in the DOM.

```
Visible viewport (~15 messages rendered in DOM)

+-------------------------------+
|  [msg 4980]  out of DOM      |  ^
|  [msg 4981]  out of DOM      |  |  scroll buffer (10 msgs)
|  [msg 4982]  in DOM          |  |
|  [msg 4983]  in DOM          |  |  visible window
|  ...                         |  |
|  [msg 4995]  in DOM          |  |
|  [msg 4996]  out of DOM      |  v
+-------------------------------+

Only ~25-30 DOM nodes exist at any time regardless of total message count.
Library: react-window or react-virtual (TanStack Virtual)
```

**Sticky scroll:** When the user is at the bottom, new messages should auto-scroll down. When the user has scrolled up (reading history), do NOT auto-scroll — just show a "X new messages" badge.

**Lazy loading upward:**
```
User scrolls to top of visible window
  → Trigger fetch: GET /chats/{chatId}/messages?offset={currentOldest}&limit=50
  → Prepend to message list
  → Restore scroll position (preserve viewport position during DOM update)
```

---

### F6.3 Media Upload Flow

Never send binary data through the WebSocket. Use a pre-signed URL pattern:

```
+--------+   POST /api/v1/media/upload-url   +-----------+
| Client | ---------------------------------> | Media Svc |
|        | <--------------------------------- |           |
|        |   { presignedUrl, mediaUrl }       +-----------+
|        |
|        |   PUT presignedUrl (direct to S3)  +-----+
|        | ---------------------------------> | S3  |
|        | <---------------------------------  |     |
|        |   200 OK                           +-----+
|        |
|        |   WS: send_message { mediaUrl }    +-----------+
|        | ---------------------------------> | Chat Svc  |
+--------+                                   +-----------+
```

Show a **local blob preview** (`URL.createObjectURL`) immediately while upload is in progress. Replace with the CDN URL once the upload completes. This gives instant visual feedback.

---

## F7. State Management Design

Use a lightweight store (Zustand or Redux Toolkit) with the following slices:

```
store/
  authSlice         — userId, jwtToken, isAuthenticated
  chatsSlice        — chat list, unread counts, last message per chat
  messagesSlice     — Map<chatId, Message[]>, loading states, pagination cursors
  presenceSlice     — Map<userId, "online" | "offline" | lastSeen>
  typingSlice       — Map<chatId, Set<userId>> (who is typing in each chat)
  uiSlice           — activeChat, modals, theme
```

**WebSocket events update the store directly:**
```
WS "new_message"    → messagesSlice.addMessage + chatsSlice.updateLastMessage
WS "message_status" → messagesSlice.updateStatus
WS "typing"         → typingSlice.setTyping
WS "presence"       → presenceSlice.setPresence
```

---

## F8. Caching Strategy (Frontend)

| Data               | Cache Location  | TTL / Strategy                                  |
|--------------------|-----------------|--------------------------------------------------|
| Chat list          | In-memory store | Invalidate on new message WS event               |
| Message history    | IndexedDB       | Keep last 50 messages per chat, LRU evict older |
| User profiles      | In-memory Map   | 5 min TTL, re-fetch on stale                     |
| Media thumbnails   | Browser cache   | CDN sets Cache-Control: max-age=31536000         |
| Auth token         | Memory only     | Never in localStorage (XSS risk)                 |

---

## F9. Trade-offs & Bottlenecks (Frontend)

| Decision                          | Chosen Approach             | Why / Trade-off                                                                 |
|-----------------------------------|-----------------------------|---------------------------------------------------------------------------------|
| Real-time protocol                | WebSocket (singleton)       | Full-duplex; polling would waste bandwidth and add latency                     |
| Message rendering                 | Virtual list                | DOM with 10K+ nodes → jank; virtual list keeps it at ~30 nodes at all times   |
| Auth token storage                | JS memory (not localStorage)| localStorage is XSS-readable; memory is wiped on tab close (acceptable trade-off) |
| Optimistic UI on send             | Yes (show immediately)      | Perceived latency drops to 0ms; rollback on server error                       |
| Media upload path                 | Direct S3 presigned URL     | Avoids routing binary data through backend; cheaper and faster                 |
| Offline message queue             | IndexedDB outbox            | Survives page refresh; localStorage size limit too small for message data      |
| State management library          | Zustand (or Redux Toolkit)  | Zustand: simpler for real-time apps; Redux: better devtools for larger teams   |
| Typing indicator debounce         | 300ms debounce on keypress  | Prevents flooding the server with WS events on every keystroke                 |

---

## F10. Frontend Summary

The frontend design revolves around three core challenges:

1. **Persistent WebSocket management** — singleton connection, reconnect strategy, offline outbox, and missed-message recovery on reconnect.
2. **Performant message rendering** — virtual list (windowed rendering) to handle unlimited message history at 60fps without DOM overload.
3. **Optimistic UI** — every user action (send message, media upload) provides instant feedback before server confirmation, with clean rollback paths.

The REST API handles authentication, history loading, and group management. The WebSocket handles everything real-time: messages, status updates, typing indicators, and presence.

