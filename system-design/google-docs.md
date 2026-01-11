# 🧩 Google Docs — Requirements & Scale Estimation

> **System Scope**: Real-time collaborative document editor (Google Docs–like)  
> **Architecture Type**: Global, real-time, collaborative, conflict-free, offline-first, low-latency system

---

# Functional Requirements

## Core Editing

- Create / Read / Update / Delete documents
- Rich-text editing (bold, italics, lists, tables)
- Cursor tracking for collaborators
- Real-time collaboration
- Offline editing with later sync
- Undo / Redo
- Version history & restore
- Commenting & suggestions
- Document sharing & permissions

## Collaboration

- Multiple users can edit simultaneously
- Each user sees others’ cursors in real time
- Conflict-free merging
- Presence tracking

## Access Control

- Owner, Editor, Commenter, Viewer
- Public links
- Workspace sharing

## Reliability

- No data loss
- Full version recovery
- Offline continuity

---

# Non-Functional Requirements

| Category     | Target                            |
| ------------ | --------------------------------- |
| Latency      | < 120 ms P95                      |
| Availability | 99.99%                            |
| Durability   | 11 nines                          |
| Concurrency  | 100+ editors per doc              |
| Scalability  | 1B+ documents                     |
| Consistency  | Eventual (view), Strong (storage) |
| Offline      | Mandatory                         |
| Security     | TLS, RBAC, audit logs             |

---

# Why This System Is Hard

Google Docs is not CRUD. It is:

- A **distributed real-time state machine**
- Using **CRDTs**
- Under **network partitions**
- Supporting **offline clients**

Trade-offs:

| Requirement | Design                             |
| ----------- | ---------------------------------- |
| Multi-user  | CRDT instead of locks              |
| Offline     | Client-side operation logs         |
| History     | Append-only logs                   |
| Consistency | Eventual views, strong persistence |

---

# Scale Assumptions

## Users

| Metric             | Value |
| ------------------ | ----- |
| Total users        | 1B    |
| Daily active       | 200M  |
| Concurrent editors | 10M   |

## Documents

| Metric     | Value  |
| ---------- | ------ |
| Total docs | 1B     |
| Avg size   | 200 KB |
| Max size   | 10 MB  |

## Editing Load

| Metric                 | Value |
| ---------------------- | ----- |
| Avg edits per user/day | 500   |
| Peak writes/sec        | 10M   |
| Avg collaborators      | 3     |
| Max collaborators      | 100+  |

---

# Storage Estimation

```text
1B documents × 200 KB = 200 TB (raw)
Version history × 10 = 2 PB
Indexes, replicas, logs ≈ 6 PB total
```

---

# Write Throughput

Each keystroke is one operation.

```text
10M concurrent users × 1 keystroke/sec = 10M writes/sec
```

These writes do NOT go directly to a database.  
They flow through:

```text
- WebSocket servers
- CRDT engine
- Event streams
- Durable append-only logs
```

---

# Core Data Model

Documents are stored as **operations**, not text.

```text
Document = Ordered list of operations
Operation = { insert, delete, format, move }
```

This enables:

- Conflict-free collaboration
- Version history
- Undo / redo
- Offline merging

---

# Primary Bottlenecks

| Layer           | Why it is difficult           |
| --------------- | ----------------------------- |
| WebSocket layer | 10M+ open connections         |
| CRDT engine     | CPU heavy conflict resolution |
| Fan-out         | 1 keystroke → 100+ users      |
| Storage         | Huge append-only write volume |
| Cold starts     | Rebuilding doc from logs      |

---

# Architectural Implications

| Requirement  | Resulting Design           |
| ------------ | -------------------------- |
| Real-time    | WebSockets + PubSub        |
| Offline      | Client logs + merge engine |
| High fan-out | Topic-based event streams  |
| No data loss | Write-ahead logs + quorum  |
| Multi-region | Geo-replicated streams     |

---

# 📄 Google Docs — System Design from First Principles

---

## Chapter 1 — What problem are we really solving?

Google Docs looks like a simple text editor, but it is actually one of the most complex distributed systems ever built.

What users expect:

- Many people can edit the same document at the same time
- Everyone sees updates almost instantly
- Nobody’s work is ever lost
- People can go offline and continue editing
- Old versions can be restored
- The document always ends up in a consistent state

These expectations force us to solve problems in:

- Distributed systems
- Real-time networking
- Concurrency control
- Fault tolerance
- Data replication

---

## Why a normal “database + API” approach fails

A naive design would be:

```text
User types → API → Database → Other users read from database
```

This breaks immediately.

### Reason 1 — Too many writes

If 10 million people are typing, and each types 1 character per second, the database must handle:

```text
10,000,000 writes per second
```

No traditional database can do this reliably.

---

### Reason 2 — Conflicts

Two users edit the same sentence at the same time:

```text
User A writes: HelloX
User B writes: HelloY
```

If both send full text, whoever writes last wins — the other loses data.

---

### Reason 3 — Offline users

If someone edits while offline, they cannot write to the database.  
But their changes must still be merged later.

---

## The key idea that makes Google Docs possible

Instead of storing **text**, we store **operations**.

Users do not send:

```text
"Hello World"
```

They send:

```text
Insert "H" at position 0
Insert "e" at position 1
Insert "l" at position 2
...
```

Each keystroke becomes a small operation.

This gives us:

- No overwrites
- Mergeable changes
- Version history
- Offline support

---

## What is a document?

A Google Docs document is not a string.

It is:

```text
Document = ordered list of operations
```

To show the text:

1. Start with empty content
2. Apply each operation in order
3. The final text appears

This model is what enables collaboration.

---

## What an operation looks like

A single keystroke becomes a structured object:

```json
{
  "opId": "u7-51",
  "docId": "doc-123",
  "userId": "u7",
  "type": "insert",
  "char": "A",
  "position": 531,
  "vectorClock": {
    "u7": 51,
    "u9": 103
  },
  "timestamp": 1712345678
}
```

This contains:

- Who made the change
- What changed
- Where it happened
- What other changes it depends on

---

## Why operations scale

Operations are:

- Very small (tens of bytes)
- Immutable
- Append-only
- Easy to transmit

So instead of sending large text blobs, the system moves tiny events.

That is why millions of people can collaborate at once.

---

## What problem comes next?

We now have millions of users producing operations.

We still need to answer:

- How do they reach the server?
- How do we keep connections open?
- How do we deliver updates instantly?

That leads us to **real-time networking**.

---

## Chapter 2 - Real-Time Networking & Global Connection Fabric

---

## Why networking is the hardest part of Google Docs

Google Docs is not a web app.  
It is a **globally distributed real-time system**.

Every keystroke must:

- Reach other users in **<100ms**
- Survive packet loss
- Work across continents
- Recover from disconnections
- Support millions of concurrent sockets

This means:

> The networking layer is more important than the database.

---

## What Google Docs needs from the network

A normal API system needs:

- Request
- Response

Google Docs needs:

- Continuous bidirectional streams
- Server push
- Ordering
- Low latency
- Fault recovery
- Geo-routing

So we must build a **global streaming fabric**.

---

## Why HTTP is impossible

HTTP is:

```
Connect → Request → Response → Disconnect
```

Google Docs requires:

```
Connect → Send → Receive → Send → Receive → … for hours
```

Polling would mean:

- Thousands of requests per minute
- Huge latency
- Battery drain
- Server overload

Therefore Google Docs is built on **WebSockets over TCP**.

---

## High-Level Networking Architecture

```text
                        ┌──────────────────────┐
                        │        Geo DNS        │
                        │  (Nearest Region)     │
                        └───────────┬──────────┘
                                    │
                                    ▼
┌──────────────┐         ┌──────────────────────┐
│   Browser    │ ──────▶ │  Global Load Balancer │
│  (User App)  │         │   (TLS, DDoS, Health) │
└───────┬──────┘         └───────────┬──────────┘
        │                             │
        │                             ▼
        │                  ┌──────────────────────┐
        │                  │   WebSocket Gateway  │
        │◀────────────────▶│ (Auth, Routing, Fan-out)│
        │                  └───────────┬──────────┘
        │                              │
        │                              ▼
        │                  ┌──────────────────────┐
        │                  │  Realtime Doc Server │
        │                  │  (CRDT, Doc State)   │
        │                  └───────────┬──────────┘
        │                              │
        │                              ▼
        │                  ┌──────────────────────┐
        │                  │ Internal Message Bus │
        │                  │ (Replication, Events)│
        │                  └───────────┬──────────┘
        │                              │
        │                              ▲
        │                  ┌──────────────────────┐
        │                  │  Realtime Doc Server │
        │                  │ (Other replicas / DC)│
        │                  └──────────────────────┘
```

Let’s walk this from left to right.

---

## Step 1 — Geo-aware DNS

When the user opens:

```

docs.google.com

```

DNS chooses the closest region using:

- GeoIP
- Latency probes
- Regional health

Why this matters:

> 100ms saved in physics = 100ms saved in UX.

---

## Step 2 — Global Load Balancer

The load balancer:

- Terminates TLS
- Blocks DDoS
- Routes to healthy regions

It does **not** know about documents.

Its job is:

> “Send this user to the best data center.”

---

## Step 3 — WebSocket Gateway (Connection Concentrator)

Gateways exist to solve one problem:

> You cannot attach 10 million TCP sockets directly to your application servers.

Gateways:

- Terminate WebSockets
- Authenticate tokens
- Track docId
- Forward traffic

They are stateless routers.

---

### Why Gateways Exist

Without gateways:

- 10M browsers → 10M TCP sockets → realtime servers die

Gateways provide:

- TCP termination
- TLS offload
- DDoS protection
- Backpressure
- Hot-document fan-out control

Realtime servers only handle:

- CRDT
- Document state
- Business logic

---

## Step 4 — Deterministic Doc Routing

We must guarantee:

> All users editing the same doc reach the same realtime server.

So we do:

```text
docShard = hash(docId) % numberOfRealtimeServers
```

The gateway reads `docId` from the handshake and forwards the connection to the correct realtime server.

This avoids:

- Distributed locks
- State syncing between servers
- Conflicts

---

## Step 5 — Realtime Collaboration Server

This server:

- Owns thousands of documents
- Holds CRDT state in memory
- Manages all users on those docs

This is the **single authority for each document’s live state**.

---

## Connection establishment flow

```text
Browser                    Gateway                    Realtime Server
   |                          |                              |
   |--- WebSocket + JWT ------>|                              |
   |        + docId           |                              |
   |                          |                              |
   |                          |--- Validate JWT ------------>|
   |                          |     (local check)            |
   |                          |                              |
   |                          |--- Forward connection ------>|
   |                          |          (docId hash)        |
   |                          |                              |
   |<----------- Snapshot + Active Users --------------------|
   |                          |                              |
```

Now the user is “inside” the document.

---

## Data flow for a keystroke

```text
Browser                   Realtime Server                Other Browsers
   |                              |                              |
   |---- CRDT Operation ---------->|                              |
   |                              |                              |
   |                              |---- Merge into CRDT State --->|
   |                              |     (in-memory)              |
   |                              |                              |
   |                              |---- Broadcast Operation ---->|
   |                              |                              |
   |<----------- Updated State ----------------------------------|
```

This loop runs hundreds of times per second.

---

## Why the document lives in memory

Databases are too slow for:

- Cursor updates
- Typing
- Selection changes

Realtime servers keep:

> The full CRDT state in RAM.

This allows:

- Microsecond updates
- Instant fan-out
- Smooth typing

Durability is handled by logs, not memory.

---

## Heartbeats & Failure Detection

WebSockets silently die.

So clients send:

```
PING every 10s
```

If no PONG:

- Gateway drops connection
- Client reconnects
- Resync begins

Users see no data loss.

---

## Reconnect & Catch-Up

When reconnecting, the browser sends:

```
lastKnownOpId
```

The realtime server:

- Replays missing operations
- CRDT merges
- UI catches up

No full reload needed.

---

## Backpressure & Abuse Control

If a user pastes 1MB of text:

- Server batches operations
- Rate limits the client
- Protects other users

The realtime server is a traffic cop.

---

## Why this networking model works

| Problem             | Solution           |
| ------------------- | ------------------ |
| Global users        | Geo DNS + regions  |
| Millions of sockets | Gateways           |
| Conflicts           | Doc sharding       |
| Low latency         | WebSockets         |
| Failures            | Reconnect + replay |

This network layer is what makes Google Docs feel **alive**.

---

## Chapter 3 — How Concurrency Is Solved (OT vs CRDT)

---

## The real problem: concurrent edits

Two people edit the same document at the same time.

Initial text:

```text
HELLO
```

User A inserts `X` after `H`  
User B inserts `Y` after `H`

Both are correct.  
But they happen **at the same time**.

If handled incorrectly:

- One edit is lost
- Or users see different results

A collaboration system must guarantee:

> All users eventually see the **same document**, with **all edits preserved**.

---

# Part 1 — Operational Transformation (OT)

OT was the first large-scale solution used by Google Docs.

The idea is simple:

> Transform operations so they still make sense when applied in a different order.

---

## How OT works

There is a **central server**.

All clients send their operations to it.

The server:

1. Decides the global order
2. Transforms operations
3. Broadcasts them

---

## OT concurrency example

Initial:

```text
HELLO
```

User A:

```text
Insert X at position 1
```

User B:

```text
Insert Y at position 1
```

Both send to server.

```text
User A                 OT Server                   User B
  |                        |                         |
  |---- Insert X @ pos 1 -->|                         |
  |                        |                         |
  |                        |<-- Insert Y @ pos 1 ----|
  |                        |                         |
```

Server receives A first.

Applies A:

```text
H X ELLO
```

Now B must be **transformed**.

Original B:

```text
Insert Y at pos 1
```

But X was inserted at pos 1, so B becomes:

```text
Insert Y at pos 2
```

Final:

```text
H X Y ELLO
```

---

## Why OT needs a central server

OT only works if:

- One machine knows the correct order
- All operations pass through it
- Transform history is complete

That server is the “truth”.

---

## Why OT breaks in the real world

### Offline users

If someone edits offline:

- The server cannot transform their ops
- When they reconnect, history is missing
- Merges become incorrect

---

### Multi-region systems

If users connect to different data centers:

- Operations arrive in different orders
- Transformations diverge
- Documents fork

OT assumes:

> One brain, one timeline

Google Docs has:

> Millions of brains, global timelines

---

# Part 2 — CRDT (Conflict-free Replicated Data Types)

CRDT takes a different approach.

Instead of fixing conflicts after they happen,  
CRDT designs operations so **conflicts cannot happen**.

---

## Core idea

CRDT removes positions.

Instead of:

```text
Insert X at position 5
```

We do:

```text
Insert X between ID 17 and ID 23
```

Every character has a unique ID.

---

## CRDT concurrency example

Initial:

```text
HELLO
IDs: 10 20 30 40 50
```

User A inserts `X` between 10 and 20 → ID 15  
User B inserts `Y` between 10 and 20 → ID 16

Now all replicas sort by ID:

```text
H(10) X(15) Y(16) E(20) L(30) L(40) O(50)
```

Everyone gets the same result.

No transformations.
No server ordering.
No conflicts.

---

## CRDT concurrency model

```text
        ┌───────────┐              ┌───────────┐
        │  User A   │              │  User B   │
        └─────┬─────┘              └─────┬─────┘
              │                              │
              ▼                              ▼
        ┌───────────┐              ┌───────────┐
        │  Server 1 │◀────────────▶│  Server 2 │
        │  (CRDT)   │              │  (CRDT)   │
        └───────────┘              └───────────┘
              ▲                              ▲
              │                              │
              └────────────── Users send ops ┘
```

Each node:

- Applies operations locally
- Exchanges them
- Sorts by ID
- Converges automatically

---

## Why CRDT handles concurrency better

CRDT operations are:

- Commutative
- Associative
- Idempotent

This means:

```
Apply A then B = Apply B then A
```

So:

- Message order does not matter
- Network delays do not matter
- Offline does not matter

---

## Why Google Docs still uses one writer per document

CRDT allows multiple writers, but Google Docs chooses:

> One write authority per document shard

Why:

- Kafka partitions require total order
- Snapshots must be deterministic
- Permission checks must be centralized
- Backpressure must be enforced

CRDT removes conflicts  
It does NOT remove the need for ordering, security, or durability.

---

## Why Google Docs moved from OT to CRDT

| Requirement     | OT  | CRDT |
| --------------- | --- | ---- |
| Offline editing | ❌  | ✅   |
| Mobile devices  | ❌  | ✅   |
| Multi-region    | ❌  | ✅   |
| Fault tolerance | ❌  | ✅   |
| 100+ editors    | ❌  | ✅   |

CRDT matches how the internet really works.

---

## What comes next?

We can now:

- Send operations
- Merge them safely

Next we must ensure:

> We never lose them

That leads to **event logs, snapshots, and version history**.

---

## Chapter 4 — Event Logs, Persistence, and Version History

---

## Why persistence is hard in Google Docs

In normal apps:

- You save a file
- It overwrites the old one

In Google Docs:

- Millions of users edit
- Hundreds of versions per minute
- People go offline
- Servers crash

We need:

> A way to never lose a single keystroke.

This requires a very different storage model.

---

## The fundamental idea

We do **not** store the document.

We store the **history of changes**.

This is called **event sourcing**.

```text
Document = Snapshot + Operation Log
```

---

## What is an event log?

Every edit becomes an **immutable event**.

Example:

```json
{ "docId": "d1", "op": "insert", "char": "A", "id": "u7-51" }
```

These events are appended to a distributed log.

Once written:

- They are never changed
- Never deleted
- Never reordered

---

## Why clients never read from Kafka

Kafka is:

- Write-optimized
- Not indexed
- Not designed for random reads

So users always read:

- Snapshots from CDN / S3
- Then tail Kafka from an offset

They never query Kafka directly.

---

## Why we need a log

The event log gives us:

- Durability
- Version history
- Crash recovery
- Offline replay
- Auditing

It is the **source of truth**.

---

## High-level persistence architecture

```text
          ┌──────────────────────┐
          │   Realtime Server     │
          │   (CRDT Engine)       │
          └───────────┬──────────┘
                      │
                      ▼
          ┌──────────────────────┐
          │ Distributed Event Log│
          │   (Kafka / PubSub)    │
          └───────────┬──────────┘
                      │
              ┌───────┴────────┐
              │                │
              ▼                ▼
    ┌──────────────────┐   ┌──────────────────┐
    │  Snapshot Store  │   │    Query API     │
    │   (S3 / GCS)     │   │ (Doc Read Layer) │
    └──────────┬──────┘   └──────────────────┘
               │
               ▼
      Fast document loads
```

---

## What happens when a user types

1. Realtime server merges operation via CRDT
2. Operation is appended to Event Log
3. Operation is broadcast to collaborators
4. Later, snapshot is updated

The log write happens **before** confirmation.

This is a **write-ahead log**.

---

## Why not write directly to a database?

Databases are:

- Slow for 10M writes/sec
- Expensive to scale
- Hard to replay

Logs are:

- Sequential
- Append-only
- Cheap
- Streamable

This is exactly what Kafka / PubSub is designed for.

---

## Snapshots

Replaying from the beginning would be slow.

So periodically:

- The CRDT state is saved
- The log offset is recorded

```text
Snapshot = (CRDT State, Log Position)
```

To load a document:

1. Load snapshot
2. Replay newer events

---

## Version history

Every version is:

> A point in the event log

So “Restore to yesterday” means:

- Load snapshot
- Replay up to yesterday’s offset

No special backups needed.

---

## What happens if a server crashes?

1. New server loads snapshot
2. Reads event log
3. Rebuilds CRDT state
4. Continues

No data loss.

---

## What happens if a data center fails?

Event logs are:

- Replicated
- Quorum written
- Geo-distributed

So another region can:

- Read the same log
- Rebuild documents
- Continue service

---

## Why this model is unbeatable

| Requirement  | How it is achieved    |
| ------------ | --------------------- |
| No data loss | Write-ahead event log |
| History      | Log replay            |
| Undo         | Log replay            |
| Audit        | Log inspection        |
| Recovery     | Snapshot + log        |

---

## What comes next?

We can now:

- Edit safely
- Merge safely
- Store safely

Next we must answer:

> How do we let billions of users find, load, and share documents?

That is the **metadata and indexing layer**.

---

## Chapter 5 — The Edit → Merge → Store Pipeline

---

## What really happens when you press a key?

When you type a single letter in Google Docs, it does **not** go straight into a file.

It passes through **three major systems**:

```text
Edit → Merge → Store
```

Understanding this pipeline explains almost everything about Google Docs.

---

## High-level pipeline

```text
User Browser
     |
     |  WebSocket
     v
+--------------------+
|  Realtime Server   |
| (Connection Layer) |
+---------+----------+
          |
          v
+--------------------+
|    CRDT Engine     |
| (Merge & Ordering) |
+---------+----------+
          |
          v
+--------------------+
|  Realtime Server   |
| (Merged State)     |
+---------+----------+
          |
          v
+--------------------+
|    Event Log       |
|  (Kafka / PubSub)  |
+---------+----------+
          |
          v
+--------------------+
|   Snapshot Store   |
|     (S3 / GCS)     |
+--------------------+

          ▲
          |
+--------------------+
|   WebSocket        |
+--------------------+
          |
     User Browser
```

Let’s walk through this slowly.

---

## Step 1 — Edit (Client)

When a user types:

```text
Hello → HelloA
```

The browser:

- Computes the difference
- Converts it into an operation

Example:

```json
{
  "type": "insert",
  "char": "A",
  "between": ["id_40", "id_41"]
}
```

It does **not** send full text.

It sends intent.

---

## Step 2 — Send (Network)

The operation is sent over WebSocket.

Why WebSocket?

- No handshake
- Low latency
- Server push enabled

The server receives the operation in milliseconds.

---

## Step 3 — Merge (CRDT Engine)

The realtime server:

- Passes the operation to the CRDT engine
- The CRDT assigns IDs
- Integrates it into the document state

This ensures:

- No conflicts
- Correct ordering
- Convergence

---

## Step 4 — Broadcast

The merged operation is:

- Sent to all connected users
- Applied locally in their CRDT

Everyone sees the same update.

---

## Step 5 — Store (Event Log)

Before the server acknowledges success:

- The operation is appended to the event log

This guarantees:

> If the server crashes after this, the change still exists.

This is called **write-ahead logging**.

---

## Step 6 — Snapshotting

Periodically:

- The CRDT state is saved
- The log offset is recorded

This makes loading fast.

---

## Why this design is safe

| Failure      | What happens     |
| ------------ | ---------------- |
| Server crash | Log replays      |
| Client crash | Local ops resend |
| Network cut  | CRDT merges      |
| Region loss  | Geo log replay   |

No single point can destroy data.

---

## Why this design is fast

- CRDT runs in memory
- No database in hot path
- Only sequential log writes
- WebSockets avoid overhead

---

## Why this design scales

- Documents are sharded
- Logs are partitioned
- CRDTs converge
- No locks

---

## What comes next?

We can now:

- Edit
- Merge
- Persist

Next we need to understand:

> How do we find documents, control access, and share them?

That is the **metadata and permission system**.

---

## Chapter 6 — Metadata, Permissions, and Sharing (Deep Dive)

---

## Why metadata is a first-class system

Google Docs is not just a text editor.

It is also:

- A file system
- A collaboration platform
- A security system

That means the system must always answer:

- Who owns this document?
- Who is allowed to view it?
- Who is allowed to edit it?
- Who shared it with whom?
- Where does it appear in folders?
- Can it be found by search?

This data must be:

- Correct
- Immediately consistent
- Never lost

So it **cannot** live in CRDTs or event logs.

---

## Two very different types of data

| Data Type        | Examples                  | Requirements                           |
| ---------------- | ------------------------- | -------------------------------------- |
| Document content | Text, formatting, edits   | Eventually consistent, high-throughput |
| Metadata         | Owner, title, permissions | Strongly consistent, transactional     |

These must be stored separately.

---

## High-level architecture

```text
                 ┌──────────────────┐
                 │      Docs UI      │
                 │ (Web / Mobile App)│
                 └─────────┬────────┘
                           │
                           ▼
                 ┌──────────────────┐
                 │   Metadata API    │
                 │ (Docs, Folders,   │
                 │  Sharing)         │
                 └───────┬───────┬───┘
                         │       │
                         │       │
                         ▼       ▼
              ┌────────────────┐ ┌──────────────────┐
              │  Metadata DB    │ │  Permission       │
              │ (Docs, Owners,  │ │  Engine           │
              │  Folders)       │ │ (Access Control)  │
              └────────────────┘ └─────────┬────────┘
                                             │
                                             ▼
                                   ┌──────────────────┐
                                   │   Metadata DB     │
                                   │ (Permission Rows)│
                                   └──────────────────┘

                           ┌──────────────────┐
                           │   Search Index    │
                           │ (ElasticSearch)   │
                           └─────────┬────────┘
                                     ▲
                                     │
                           Metadata API updates

            ┌──────────────────┐
            │ Realtime Server   │
            │ (CRDT, Live Edits)│
            └─────────┬────────┘
                      │
                      ▼
            ┌──────────────────┐
            │ Permission Engine │
            │ (Edit / View?)    │
            └──────────────────┘
```

---

## Metadata database

This is a globally consistent database (like Spanner).

It stores tables such as:

```text
Documents
---------
doc_id (PK)
owner_id
title
created_at
last_modified
folder_id
is_deleted

Permissions
------------
doc_id
user_id
role   (owner, editor, commenter, viewer)
granted_by
granted_at
```

This database:

- Supports transactions
- Supports queries
- Is strongly consistent

---

## Why strong consistency is mandatory

If Alice removes Bob’s access:

- Bob must lose access immediately
- Even if he has the document open

Eventual consistency would allow security leaks.

So permissions always come from this database.

---

## How sharing works (step-by-step)

Alice clicks **Share** → adds Bob as editor.

```text
Alice                    UI                 Metadata API            Metadata DB
  |                       |                       |                       |
  |---- Add Bob ---------->|                       |                       |
  |                       |                       |                       |
  |                       |---- grant(doc,Bob) --->|                       |
  |                       |        (editor)       |                       |
  |                       |                       |---- begin txn ------>|
  |                       |                       |---- insert permission|
  |                       |                       |---- commit ---------->|
  |                       |                       |                       |
  |                       |<------ success -------|                       |
  |<------ UI update -----|                       |                       |
```

The document itself is not touched.

---

## How access is enforced in realtime editing

When Bob opens a document:

```text
Bob                    Gateway            Realtime Server        Permission Engine        Metadata DB
 |                        |                       |                      |                      |
 |---- Open doc --------->|                       |                      |                      |
 |                        |---- Connect Bob ----->|                      |                      |
 |                        |                       |---- Can Bob edit? -->|                      |
 |                        |                       |                      |---- Query ---------->|
 |                        |                       |                      |<--- Role = Editor ---|
 |                        |                       |<--- Allow edit ------|                      |
 |                        |                       |                      |                      |
```

If Bob is only a viewer, the CRDT engine will refuse his operations.

---

## Why permissions are NOT in CRDT

CRDTs:

- Are eventually consistent
- Allow replicas to diverge temporarily

Permissions must be:

- Immediate
- Global
- Unambiguous

So they are enforced outside the CRDT layer.

---

## Folder & file listing

When you open Google Docs home page:

1. UI calls Metadata API
2. API queries:
   - Documents where user has permission
   - Sorted by last_modified
3. Results returned

This is fast because:

- It uses indexed tables
- Not event logs
- Not CRDTs

---

## Search

Metadata DB feeds a search index.

So when you search:

- You query the index
- It returns doc_ids
- Permissions are rechecked before showing results

This prevents information leaks.

---

## What we have achieved

We now have:

| Layer             | Solves                |
| ----------------- | --------------------- |
| CRDT + Logs       | Editing and history   |
| Metadata DB       | Ownership and sharing |
| Permission Engine | Security              |
| Search Index      | Discovery             |

Each system does one job well.

---

## What comes next?

Now the system works — but it must be fast for users everywhere.

Next we design:

> Caching, CDN, and performance optimization

---

## Chapter 7 — Caching & Performance

---

## Why caching is critical in Google Docs

Google Docs has:

- Billions of documents
- Millions of active users
- People opening the same docs repeatedly

Without caching:

- Every open would hit storage
- Latency would be high
- Costs would explode

Caching makes the system:

- Fast
- Cheap
- Scalable

---

## What needs to be cached?

Three very different things:

| Data               | Why                          |
| ------------------ | ---------------------------- |
| Document snapshots | Large, frequently opened     |
| Metadata           | Needed for listing & sharing |
| Permissions        | Needed on every access       |

Each requires a different caching strategy.

---

## High-level caching architecture

```text
        ┌──────────┐
        │  User    │
        └────┬─────┘
             │
             ▼
     ┌────────────────┐
     │   Global CDN    │
     │ (Snapshots, JS) │
     └───────┬────────┘
             │
             ▼
     ┌────────────────┐
     │ WebSocket Gate  │
     │ (Auth + Route)  │
     └───────┬────────┘
             │
             ▼
     ┌────────────────┐
     │ Realtime Server │
     │ (CRDT + Docs)   │
     └───────┬────────┘
             │
      ┌──────┴───────┐
      │              │
      ▼              ▼
┌──────────────┐  ┌────────────────┐
│ Redis Cache  │  │   Event Log     │
│ (Metadata,   │  │ (Kafka / PubSub)│
│ Permissions) │  └────────────────┘
└───────┬──────┘
        │
        ▼
┌────────────────┐
│  Metadata DB   │
│ (Spanner / SQL)│
└────────────────┘
```

---

## CDN for static and snapshot data

When you open a large doc:

- The initial snapshot is fetched
- This snapshot rarely changes

So it is cached in a global CDN:

- Near the user
- Extremely fast
- Very cheap

Only realtime edits go to servers.

---

## What happens when a user opens a document

1. UI calls Metadata API → permissions
2. UI downloads snapshot from CDN
3. UI opens WebSocket to Realtime Server
4. Server sends Kafka tail ops
5. CRDT merges snapshot + ops
6. Live collaboration begins

---

## Redis for hot metadata

Metadata like:

- Titles
- Owner
- Last modified
- Folder

Is stored in Redis.

So listing documents does not hit Spanner every time.

Cache invalidation happens when:

- Sharing changes
- Title changes
- Folder moves

---

## Permission cache

Every edit requires:

> Is this user allowed to do this?

Permissions are cached in memory and Redis.

But:

- Writes go to DB
- Cache is invalidated immediately

This ensures:

- Security
- Low latency

---

## Realtime document cache

Realtime servers keep:

- CRDT state in memory
- Recently used documents hot

So active documents never touch disk.

---

## Why write data is not cached

Operations are:

- Write-heavy
- Append-only
- Sequential

Caching writes adds:

- Complexity
- Risk of data loss

So writes always go directly to the event log.

---

## What happens when cache misses?

If:

- Snapshot not in CDN
- Metadata not in Redis

Then:

- Data is fetched from storage
- Cache is filled
- Next user is fast

---

## Why this works

| Layer          | Benefit           |
| -------------- | ----------------- |
| CDN            | Fast initial load |
| Redis          | Fast listings     |
| In-memory CRDT | Real-time speed   |
| Event log      | Durable writes    |

---

## What comes next?

Now that reads are fast and writes are safe, we can look at:

> How the browser works  
> How it stores data  
> How it syncs

That is the **Frontend Architecture**.

---

## Chapter 8 — Frontend, Offline Storage, and Sync Engine

---

## Frontend Component Architecture

```
┌───────────────────────────────────────────────────────────────┐
│                         GOOGLE DOCS APP                        │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                 Document Editor Module                  │  │
│  │ ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │  │
│  │ │ Text Canvas  │  │ Formatting   │  │ Cursor Layer │   │  │
│  │ │              │  │ Toolbar      │  │              │   │  │
│  │ │ - Paragraphs │  │ - Bold/Italic │  │ - Carets     │   │  │
│  │ │ - Tables     │  │ - Lists       │  │ - Colors     │   │  │
│  │ │ - Images     │  │ - Headers     │  │ - Names      │   │  │
│  │ └──────────────┘  └──────────────┘  └──────────────┘   │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                Collaboration Module                     │  │
│  │ ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │  │
│  │ │ CRDT Engine  │  │ Presence     │  │ Commenting   │   │  │
│  │ │              │  │ Service      │  │ & Suggest   │   │  │
│  │ │ - Insert     │  │ - Online users│  │ - Threads   │   │  │
│  │ │ - Delete     │  │ - Cursors     │  │ - Mentions  │   │  │
│  │ │ - Merge      │  │               │  │             │   │  │
│  │ └──────────────┘  └──────────────┘  └──────────────┘   │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │               Offline & Sync Module                     │  │
│  │ ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │  │
│  │ │ IndexedDB    │  │ Local Op Log │  │ Sync Manager │   │  │
│  │ │              │  │              │  │              │   │  │
│  │ │ - Snapshot   │  │ - Pending Ops│  │ - Retry      │   │  │
│  │ │ - CRDT State │  │ - Acked Ops   │  │ - Dedup      │   │  │
│  │ └──────────────┘  └──────────────┘  └──────────────┘   │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                Networking Layer                         │  │
│  │ ┌──────────────┐  ┌──────────────┐                     │  │
│  │ │ WebSocket    │  │ Auth Token   │                     │  │
│  │ │ Client       │  │ Manager      │                     │  │
│  │ └──────────────┘  └──────────────┘                     │  │
│  └─────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────┘
```

## Why frontend must behave like a database

In Google Docs, the browser must guarantee:

> “If the user types something, it is never lost.”

The server might be unreachable.
The tab might crash.
The laptop might shut down.

So the browser must be able to:

- Persist data locally
- Recover after crashes
- Sync later
- Merge safely

This turns the browser into a **distributed database node**.

---

## What the browser stores locally

The browser uses **IndexedDB** (or similar) for persistence.

We store:

```text
LocalSnapshot
-------------
docId
crdtStateBlob
lastSyncedLogOffset

LocalOperations
----------------
opId (PK)
docId
operationBlob
timestamp
sentToServer (boolean)
```

This is a **mini write-ahead log**.

---

## High-level frontend architecture

```text
                ┌──────────────────┐
                │     Editor UI     │
                │  (Typing, Cursor) │
                └─────────┬────────┘
                          │
                          ▼
                ┌──────────────────┐
                │    CRDT Engine    │
                │ (Local Merge)     │
                └───────┬───────┬──┘
                        │       │
                        │       │
                        ▼       ▼
              ┌────────────────┐ ┌────────────────────┐
              │ Local Op Log    │ │  Local Snapshot     │
              │ (Pending Ops)  │ │ (CRDT State)        │
              └───────┬────────┘ └──────────┬─────────┘
                      │                     │
                      ▼                     ▼
                ┌────────────────────────────────┐
                │          IndexedDB              │
                │ (Persistent Browser Storage)   │
                └─────────────┬──────────────────┘
                              │
                              ▼
                     ┌──────────────────┐
                     │   Sync Engine     │
                     │ (Retry, Dedup)    │
                     └───────┬──────────┘
                             │
                             ▼
                     ┌──────────────────┐
                     │   WebSocket       │
                     │ (Server Link)     │
                     └──────────────────┘
```

---

## What happens when you type

1. User types `A`
2. CRDT creates an operation
3. CRDT applies it locally
4. UI updates immediately
5. Operation is written to `LocalOperations` in IndexedDB
6. If online, Sync Engine sends it to server

Nothing waits for the network.

---

## What happens when the network drops

WebSocket disconnects.

From now on:

- CRDT continues generating operations
- Each operation is appended to `LocalOperations`
- `sentToServer = false`

The document keeps evolving locally.

No data is lost.

---

## What happens when the browser crashes

Because every operation is in IndexedDB:

- Nothing disappears

On reload:

1. Snapshot is loaded
2. CRDT state is restored
3. Unsynced ops are replayed
4. UI becomes exactly what it was

---

## What happens when the network comes back

The Sync Engine runs this loop:

```text
for each operation where sentToServer = false:
    send to server
    wait for ack
    mark sentToServer = true
```

At the same time:

- Server sends any missing remote operations
- CRDT merges both streams

---

## How duplicates are avoided

Every operation has a globally unique `opId`.

The server:

- Stores opIds in the event log
- Rejects duplicates

So retries are safe.

---

## What if server is ahead of client

If server has newer operations:

- It streams them
- CRDT merges them
- Local UI updates

If client is ahead:

- Client streams local ops
- Server merges them

Both sides converge.

---

## Why this is safe

This is a **two-phase sync**:

| Phase     | Purpose                |
| --------- | ---------------------- |
| Local log | Never lose user edits  |
| Event log | Global durability      |
| CRDT      | Merge without conflict |

Even if:

- Browser crashes
- Network flaps
- Server restarts

All edits survive.

---

## Why this scales

Millions of browsers:

- Do their own logging
- Do their own merging
- Do their own caching

The backend only coordinates.

This is why Google Docs can support billions of users.

---

## What comes next?

Now that we understand the browser and offline sync, we can finally define:

> The backend databases  
> Which DB stores what  
> Why they are chosen

That is **Backend Data Architecture**.

---

## APIs & Cursor/Presence System

---

# Part 1 — API Contract Tables

These are the **real interfaces** between:

- Frontend
- Gateways
- Metadata
- Realtime servers

---

## 1️⃣ Authentication

| Method | Endpoint      | Description          |
| ------ | ------------- | -------------------- |
| POST   | /auth/login   | Login & get JWT      |
| POST   | /auth/refresh | Refresh access token |
| GET    | /auth/me      | Get user profile     |

---

## 2️⃣ Document Metadata APIs

| Method | Endpoint       | Description           |
| ------ | -------------- | --------------------- |
| POST   | /docs          | Create new document   |
| GET    | /docs/{docId}  | Get document metadata |
| GET    | /docs?folder=X | List documents        |
| PATCH  | /docs/{docId}  | Rename / move         |
| DELETE | /docs/{docId}  | Soft delete           |

---

## 3️⃣ Sharing & Permissions

| Method | Endpoint                     | Description      |
| ------ | ---------------------------- | ---------------- |
| POST   | /docs/{docId}/share          | Add collaborator |
| GET    | /docs/{docId}/permissions    | List users       |
| DELETE | /docs/{docId}/share/{userId} | Remove access    |

---

## 4️⃣ Realtime WebSocket Protocol

WebSocket URL:

```
wss://docs.example.com/ws?docId=123&token=JWT
```

Messages:

| Type   | Payload        | Purpose           |
| ------ | -------------- | ----------------- |
| JOIN   | userId         | Join document     |
| OP     | CRDT operation | Edit              |
| CURSOR | {pos, color}   | Cursor update     |
| ACK    | opId           | Confirm operation |
| SNAP   | snapshot       | Initial state     |
| PING   | —              | Keep alive        |

---

# Part 2 — Cursor & Presence System

---

## Why cursors are critical

Without seeing other users:

- People type over each other
- Collaboration feels chaotic

So every user must see:

- Where others are typing
- Their selection range
- Their name & color

This is **not part of the document text**.

---

## Presence vs Cursor vs Edits

Google Docs runs **three independent realtime streams**:

| Stream   | What it carries      | Durability |
| -------- | -------------------- | ---------- |
| Edits    | CRDT operations      | Kafka      |
| Cursors  | Selection, caret     | Memory     |
| Presence | Online/offline state | Memory     |

Why they are separated:

- **Edits** must survive crashes → go to Kafka
- **Cursors** are ephemeral → never stored
- **Presence** is heartbeat-based → auto expires

This prevents:

- Kafka overload
- Replaying cursor junk
- Wasting bandwidth on presence history

---

## Cursor data model

Each user has:

```json
{
  "userId": "u7",
  "docId": "d1",
  "anchorId": "char_512",
  "focusId": "char_520",
  "color": "#4CAF50",
  "lastSeen": 1712345678
}
```

We store:

- Which CRDT elements the cursor spans
- Not numeric positions

This avoids shifting problems.

---

## Cursor update flow

```text
User                     Realtime Server               Other Users
  |                              |                            |
  |---- CURSOR {anchor,focus} --->|                            |
  |                              |---- Broadcast cursor ----->|
  |                              |                            |
```

This is:

- Not written to Kafka
- Not stored in DB
- Only in memory

Because:

> Cursor state is ephemeral.

---

## How CRDT prevents overwrite

If Alice and Bob both type:

- CRDT assigns unique IDs
- Characters never overwrite
- Cursors move relative to IDs

So:

- Even if Bob types inside Alice’s selection
- Both changes survive

---

## How UI uses cursor data

The frontend:

- Maps CRDT IDs → screen positions
- Renders colored carets
- Shows name tags

When text shifts:

- CRDT updates mapping
- Cursor moves visually

---

## Why this works

| Problem                  | Solution            |
| ------------------------ | ------------------- |
| Two users type same spot | CRDT IDs            |
| Cursor jumps             | Anchor IDs          |
| Network delay            | Independent cursors |
| Performance              | No persistence      |

---

## Chapter 9 — Backend Storage: How Every Keystroke Is Stored Forever

---

## Backend Component Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    GOOGLE DOCS BACKEND                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │            API & Authentication Layer                │   │
│  │  - OAuth2                                           │   │
│  │  - JWT Validation                                   │   │
│  │  - Rate Limiting                                    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │          WebSocket Gateway Layer                     │   │
│  │  - Connection mgmt                                  │   │
│  │  - Geo routing                                      │   │
│  │  - Doc sharding                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │        Realtime Collaboration Servers                │   │
│  │  - CRDT Engine                                      │   │
│  │  - In-memory Doc State                               │   │
│  │  - Fan-out                                          │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │           Persistence Layer                          │   │
│  │  ┌────────────┐   ┌────────────┐   ┌─────────────┐ │   │
│  │  │ Kafka      │   │ Snapshot DB│   │ PostgreSQL  │ │   │
│  │  │ (Ops Log)  │   │ (S3/GCS)    │   │ (Metadata)  │ │   │
│  │  └────────────┘   └────────────┘   └─────────────┘ │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         Search & Indexing                            │   │
│  │  - Elasticsearch                                   │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Why storage is not just “save to database”

In Google Docs, we do not save files.

We save:

- Millions of keystrokes
- From millions of users
- In real time
- With full history
- With zero data loss

This creates three fundamentally different storage problems:

| Type          | Example                          |
| ------------- | -------------------------------- |
| Transactional | Who owns this doc?               |
| Event-based   | User typed “A”                   |
| State-based   | What does the doc look like now? |

One database cannot do all three well.

So we split them.

---

## The three storage layers

```text
        ┌──────────────────┐
        │  Realtime Server │
        │ (CRDT + Live Ops)│
        └─────────┬────────┘
                  │
                  ▼
        ┌──────────────────┐
        │  Operation Log   │
        │ (Kafka / PubSub) │
        └─────────┬────────┘
                  │
                  ▼
        ┌──────────────────┐
        │ Snapshot Store   │
        │   (S3 / GCS)     │
        └──────────────────┘

        ┌──────────────────┐
        │  Metadata Store  │
        │ (Docs, Users,    │
        │  Permissions)   │
        └─────────┬────────┘
                  │
                  ▼
        ┌──────────────────┐
        │   Search Index   │
        │ (ElasticSearch)  │
        └──────────────────┘
```

Each layer solves a different problem.

---

## Layer 1 — Metadata Store (Who can access what?)

This stores:

- Document titles
- Owners
- Sharing
- Folder structure

These are:

- Small
- Frequently queried
- Must be correct

This data behaves like:

> A file system

So it needs:

- Transactions
- Indexes
- Strong consistency

---

## Layer 2 — Operation Log (What changed?)

This stores:

- Every CRDT operation
- In strict order
- Forever

This data is:

- Huge
- Write-heavy
- Append-only
- Never updated

This behaves like:

> A video recording of the document

---

## Layer 3 — Snapshot Store (What is the current state?)

Replaying 10 million operations would be slow.

So periodically we store:

- The full CRDT state
- At a certain point in the log

This allows fast loading.

---

## How a keystroke is stored

User types `A`.

```text
User                 Realtime Server            Operation Log           Snapshot Store
  |                        |                         |                         |
  |---- Insert "A" ------->|                         |                         |
  |                        |---- CRDT merge -------->|                         |
  |                        |                         |                         |
  |                        |---- Append operation -->|                         |
  |                        |                         |                         |
  |<--------- Ack ---------|                         |                         |
  |                        |                         |---- Periodic snapshot ->|
  |                        |                         |                         |
```

The key rule:

> The operation is written to the log before success is confirmed.

---

## Why logs are better than databases for edits

If we tried to store operations in a normal database:

| Database     | Problem         |
| ------------ | --------------- |
| Updates      | We never update |
| Indexes      | We never query  |
| Transactions | We don’t need   |
| Writes/sec   | Too slow        |

Logs are perfect:

- Sequential
- Append-only
- Replicated
- Replayable

---

## How history works

Version history is just:

> Different positions in the log

“Restore yesterday” = replay log until yesterday’s offset.

No backups. No copies.

---

## Now map this to real technologies

We implement the three layers using:

| Layer          | Real Tech          |
| -------------- | ------------------ |
| Metadata       | PostgreSQL / MySQL |
| Operation Log  | Kafka              |
| Snapshot Store | S3 / GCS           |
| Search Index   | ElasticSearch      |

---

## Metadata — PostgreSQL

Schema:

```sql
Documents(doc_id, owner_id, title, folder_id, last_modified)
Permissions(doc_id, user_id, role)
Folders(folder_id, owner_id, name)
```

This powers:

- Sharing
- Listing
- Access control

---

## Operation Log — Kafka

Each operation is written to Kafka.

Documents are partitioned by:

```text
hash(docId)
```

So:

- All ops for a doc are ordered
- Writes scale horizontally

---

## Snapshot Store — S3

Every few seconds:

- CRDT state is serialized
- Stored in S3

On load:

- Fetch snapshot
- Replay Kafka from offset

---

## Why this design is unbeatable

| Requirement  | How it is achieved |
| ------------ | ------------------ |
| No data loss | Kafka              |
| Fast load    | S3 snapshots       |
| History      | Kafka offsets      |
| Security     | PostgreSQL         |
| Scale        | Partitioning       |

---

Now we have:

- Frontend
- Networking
- CRDT
- Logs
- Databases

The final step is:

> How do we scale this globally?

That is **Chapter 10 — Sharding, Hot Docs, and Global Scale**.

---

## Chapter 10 — Scaling, Sharding, and Hot Documents

---

## Why scaling Google Docs is uniquely hard

Most apps scale by:

- Adding more servers
- Adding more databases

Google Docs cannot do this easily because:

- Many users edit the **same document**
- That document must have a **single authoritative state**

This creates a **hotspot problem**.

---

## How documents are sharded

We shard by `docId`.

```text
shard = hash(docId) % N
```

Each shard owns:

- A set of documents
- Their CRDT state
- Their active users

This allows horizontal scaling.

---

## What happens when a document is hot?

A normal document:

- 1–3 users
- Few ops per second

A hot document:

- 100+ users
- Thousands of ops per second

One server might not handle this.

---

## Hot document architecture

```text
        ┌──────────────┐      ┌──────────────┐
        │    Users     │      │    Users     │
        └──────┬───────┘      └──────┬───────┘
               │                         │
               ▼                         ▼
        ┌────────────────────────────────────┐
        │      Primary Realtime Node          │
        │   (CRDT + Write Authority)          │
        └───────────────┬────────────────────┘
                        │
                        ▼
                ┌────────────────┐
                │     Kafka       │
                │  (Ops Log)      │
                └────────────────┘
                        ▲
                        │
        ┌────────────────────────────────────┐
        │          Replica Realtime Node      │
        │     (Read Fan-out / Mirror)          │
        └───────────────┬────────────────────┘
                        │
                        └──────── Sync ───────┘
```

Primary handles writes.  
Replica helps with fan-out.

---

## Why we don’t allow multiple writers

If two servers write:

- Order breaks
- CRDT becomes complex
- Latency increases

So:

> One writer, many readers

---

## Load shedding

If a document is overloaded:

- Typing rate is throttled
- Operations are batched
- UI shows “high activity”

This protects the system.

---

## Scaling Kafka

Kafka is sharded by `docId`.

So:

- Hot documents use one partition
- Cold documents use others

Kafka scales linearly.

---

## Kafka Hot Partition Protection

If a document becomes extremely hot:

- Its Kafka partition is rate-limited
- Operations are batched
- Snapshots are generated more frequently
- Replica fan-out absorbs read load

This prevents:

- Broker overload
- Consumer lag explosion

---

## Scaling metadata

Postgres is:

- Replicated
- Read-scaled
- Cached

Sharing and listing do not hit CRDT servers.

---

## Disaster recovery

If a region dies:

- Kafka replicas survive
- Snapshots are in S3
- Metadata DB fails over

Docs continue.

---

## Why this scales to billions

| Layer    | Scale mechanism  |
| -------- | ---------------- |
| Frontend | Local CRDT       |
| Realtime | Doc sharding     |
| Logs     | Kafka partitions |
| Storage  | S3               |
| Metadata | SQL + replicas   |

Every bottleneck has a horizontal escape hatch.

---

## Chapter 11 — Security, Privacy, and Abuse Prevention

---

## Why security is existential for Google Docs

Google Docs stores:

- Personal notes
- Legal contracts
- Financial data
- Company secrets

A single bug could expose:

- Millions of private documents

So security is not optional. It is built into every layer.

---

## The threat model

We must defend against:

| Threat              | Example                                |
| ------------------- | -------------------------------------- |
| Unauthorized access | Someone opens a doc without permission |
| Token theft         | Session hijacking                      |
| Replay attacks      | Resending old operations               |
| Malicious edits     | Injecting fake CRDT ops                |
| Insider abuse       | Staff accessing private docs           |

---

## Identity & Authentication

All users authenticate via:

- OAuth2
- Short-lived access tokens

Tokens are:

- Signed
- Time-limited
- Bound to devices

WebSocket connections require valid tokens.

---

## Authorization flow

```text
User                    Gateway               Realtime Server        Permission Engine
  |                        |                       |                        |
  |---- Open WebSocket --->|                       |                        |
  |        + token         |                       |                        |
  |                        |---- Validate token -->|                        |
  |                        |                       |                        |
  |                        |---- Connect user ---->|                        |
  |                        |                       |---- Can edit doc? ---->|
  |                        |                       |<--- Allow / Deny ------|
  |                        |                       |                        |
```

Permissions are checked:

- On connect
- On every operation

---

## Why permissions are not cached blindly

Caching permissions too aggressively risks:

- A user keeping access after removal

So:

- Permissions have short TTLs
- Revocations are pushed to servers

---

## Operation-level security

Every CRDT operation includes:

- userId
- docId
- opId

Server verifies:

- Sender matches token
- User has edit rights
- opId is new

This prevents:

- Spoofing
- Replay
- Injection

---

## Data encryption

| Layer            | Encryption        |
| ---------------- | ----------------- |
| Browser → Server | TLS               |
| Kafka            | Encrypted at rest |
| S3               | Encrypted         |
| PostgreSQL       | Encrypted         |

Even Google engineers cannot see plaintext easily.

---

## Chapter 12 — Interview-Style Deep Dives

---

## 1️⃣ How do you guarantee no data loss?

We use **three layers of durability**:

| Layer             | What it protects   |
| ----------------- | ------------------ |
| Local browser log | Offline & crashes  |
| Kafka             | Server crashes     |
| S3 snapshots      | Long-term recovery |

If any layer fails, another can replay.

---

## 2️⃣ What if Kafka loses a partition?

Kafka runs with:

- Replication
- Quorum writes

So:

- Data exists on multiple nodes
- Leader election happens
- Realtime servers reconnect

No operations are lost.

---

## 3️⃣ What if two regions both get edits?

CRDT guarantees:

- Order doesn’t matter
- Merges are deterministic
- Replicas converge

This allows:

- Active-active regions
- Global collaboration

---

## 4️⃣ How do you handle 1,000 people editing one doc?

We:

- Use one primary realtime server
- Add fan-out replicas
- Batch operations
- Throttle abusive users

CRDT still keeps state consistent.

---

## 5️⃣ How do you rollback a document?

We:

- Load a snapshot
- Replay Kafka up to old offset
- Publish new CRDT state

This is instant and safe.

---

## 6️⃣ What happens if a realtime server crashes?

1. Users reconnect
2. New server loads snapshot
3. Replays Kafka
4. CRDT state rebuilt

No data loss.

---

## 7️⃣ Why not store full text?

Because:

- Too slow
- No history
- Conflicts overwrite data

Operations + logs are superior.

---

## 8️⃣ How do you keep latency low globally?

- Geo routing
- CDN snapshots
- WebSockets
- Local CRDT

The hot path never touches databases.

---

## 9️⃣ How do you handle schema changes?

Operations are versioned.

CRDT engine:

- Knows how to apply old ops
- Can migrate state

This allows zero-downtime upgrades.

---

## 🔟 Why is this design better than locking?

Locks:

- Block users
- Fail offline
- Break under latency

CRDT:

- Never blocks
- Always merges
- Scales globally

---
