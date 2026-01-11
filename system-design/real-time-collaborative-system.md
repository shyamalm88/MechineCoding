# Real-Time Collaboration Systems

## Operational Transformation (OT) and CRDTs

---

# Chapter 1 — The Nature of Concurrent Editing

Real-time collaboration is not a UI problem.  
It is one of the hardest problems in distributed systems.

Systems like Google Docs, Figma, Notion, Slack Canvas, and collaborative IDEs allow many users to edit the same logical document at the same time.

They must survive:

- network delay
- message reordering
- offline edits
- reconnection
- concurrent conflicting changes

Yet all users must eventually see the same document.

This is harder than it sounds.

---

## 1.1 A document is not a string

We often imagine a document as a string:

```
hello world
```

But in a collaborative system, the document is not the string.  
It is the result of a sequence of operations.

For example:

```
Insert("h", 0)
Insert("e", 1)
Insert("l", 2)
Insert("l", 3)
Insert("o", 4)
```

The string `hello` is just the materialized view of these operations.

When two people edit, they are not editing the string.  
They are creating streams of operations.

The system must merge those streams.

---

## 1.2 What concurrency means

Start with:

```
cat
```

Alice inserts `s` at the end → `cats`  
Bob inserts `r` at the beginning → `rcat`

These edits are concurrent if:

- Alice does not know about Bob’s edit
- Bob does not know about Alice’s edit

There is no global “who was first”.

Concurrency means:
The system must choose a consistent order for operations created independently.

---

## 1.3 Network order is wrong

Alice types first.  
Bob types second.

Alice’s packet is delayed.  
Bob’s arrives first.

If we apply by arrival order:

```
Bob → Alice
```

If we apply by user time:

```
Alice → Bob
```

These produce different results.

Network time is not causal time.

---

## 1.4 What users actually expect

If Alice inserts a character at position 5, she expects it to appear after the fifth character she saw.

Bob’s edit should not move her cursor.

This is intention preservation.

Even if the final text matches, the experience is broken if intention is violated.

---

## 1.5 The impossible triangle

A collaborative editor must have:

1. Instant local edits
2. Offline support
3. Strong convergence

Locks break 1  
Central servers break 2  
Last-write-wins breaks 3

So we need mathematics to merge operations.

That is why OT and CRDT exist.

---

## 1.6 What we are really solving

Given:

- many replicas
- many operations
- no global clock
- unreliable networks

We must guarantee:

- everyone converges
- nobody’s intent is lost

Everything else follows from this.

Next chapter:  
Why naive merging fails.

---

# Chapter 2 — Why Naive Merging Always Fails

To understand why Operational Transformation and CRDTs exist, we must first understand why every simple approach to merging edits fails.

Most engineers instinctively try one of the following:

- Last write wins
- Server decides order
- Lock the document
- Merge strings

All of them break in subtle but catastrophic ways.

---

## 2.1 The illusion of “just send the full document”

The simplest idea is:

Every time a user types, send the entire document to the server.  
The server keeps the latest version.  
Everyone else downloads it.

This is how file sync systems work.

This fails immediately for collaboration.

Example:

Start with:

```
hello
```

Alice changes it to:

```
hello world
```

Bob changes it to:

```
hello there
```

Both send their full documents.

Whichever arrives last overwrites the other.

One user’s work disappears.

This violates:

- Convergence (they won’t match)
- Intention (someone loses data)

---

## 2.2 Last write wins is data loss

Last-write-wins means:
The system orders updates by timestamp and keeps the latest.

This works for:

- configuration values
- counters
- key-value stores

It fails for text.

Alice inserts “A” at position 5.  
Bob inserts “B” at position 5.

Both have valid intent.

One of them must not be deleted.

But LWW will drop one.

---

## 2.3 Server-ordered streams

Another idea:

Clients send operations to the server.  
The server assigns a global order.  
Everyone replays operations in that order.

This works only if:
All edits go through the server.

That breaks:

- offline editing
- high-latency links
- peer-to-peer

And even with a server, race conditions still occur.

Example:

Alice and Bob both send “insert at position 5”.

Whichever arrives first shifts the document.  
The second one is now wrong.

Positions are relative to the user’s view, not the server’s view.

---

## 2.4 Why positions are unstable

Positions are not absolute.

They are based on the document state when the user typed.

If the document changes before the operation is applied, the position must move.

Naive systems do not adjust positions.

This creates:

- scrambled text
- characters in wrong places
- corrupted documents

---

## 2.5 The core unsolved problem

The real problem is:

How do you apply an operation created on an old document to a newer document and still preserve what the user meant?

Example:

Document at time T0:

```
abcd
```

Alice sees:

```
abcd
```

and deletes “b”.

Bob inserts “X” at position 0.

Now Alice’s delete at position 1 is wrong.

We must **translate** Alice’s operation so it still deletes “b” in the new document.

That translation is the heart of OT.

---

## 2.6 What must be true for any correct system

Any correct collaboration system must do all three:

1. Allow concurrent operations
2. Reconcile them deterministically
3. Preserve user intent

Naive merging cannot do this.

Only two known families of algorithms can:

- Operational Transformation
- CRDTs

Next chapter:  
The formal operation model.

---

# Chapter 3 — The Operation Model

Before we can understand OT or CRDTs, we must define what an “edit” actually is.

We cannot reason about strings.  
We must reason about operations.

---

## 3.1 What is an operation?

An operation is a minimal change to the document.

For text, the basic operations are:

- Insert(character, position)
- Delete(position)

Everything else — replace, paste, cut — reduces to these.

Example:

Typing “hi” at position 3 becomes:

```
Insert("h", 3)
Insert("i", 4)
```

Deleting “o” at position 5 becomes:

```
Delete(5)
```

Operations are:

- Small
- Ordered
- Relative to a document state

---

## 3.2 Operations are state-dependent

An operation is not absolute.

Insert("A", 5) means:
Insert A after the 5th character **in the document I saw**.

If the document changes, position 5 may no longer be the same place.

Therefore:
An operation is valid only in the state it was created.

---

## 3.3 Local vs remote operations

Each replica sees two streams:

- Local operations (from the user)
- Remote operations (from others)

Local operations are applied immediately.

Remote operations arrive later and must be merged.

This means every replica is temporarily diverged.

Convergence must be achieved later.

---

## 3.4 Causality

If Alice types A then B, every replica must apply A before B.

This is causality.

But Bob’s edits may interleave anywhere.

We therefore need:

- causal ordering
- concurrent operation resolution

---

## 3.5 Version vectors and clocks

To reason about causality, replicas attach metadata:

Each operation includes:

- replica ID
- sequence number
- vector clock or Lamport clock

This allows us to know:

- which operations happened before others
- which are concurrent

Without this, conflict resolution is impossible.

---

## 3.6 The real abstraction

A collaborative document is:

A replicated log of operations.

Not a file.  
Not a string.

OT and CRDT define how those logs merge.

Next chapter:  
Operational Transformation — how it actually works.

---

# Chapter 4 — Operational Transformation (OT)

Operational Transformation is a technique for making operations created on one version of a document work on a different version.

It does not change the data.

It changes the operations.

---

## 4.1 The core idea

When a remote operation arrives, the document may already contain other changes.

So instead of applying it directly, we **transform** it.

We rewrite:

```
op_remote
```

into:

```
op_remote'
```

so that it still does what the user intended on the current document.

---

## 4.2 A simple example

Start with:

```
abcd
```

Alice deletes `b`:

```
Delete(1)
```

Bob inserts `X` at the beginning:

```
Insert("X", 0)
```

If Bob’s insert is applied first, the document becomes:

```
Xabcd
```

Now Alice’s Delete(1) would delete `a`, not `b`.

So we transform Alice’s delete:

Bob inserted before Alice’s position, so shift Alice’s position right:

```
Delete(2)
```

Applying Delete(2) to `Xabcd` deletes `b`.

Alice’s intent is preserved.

---

## 4.3 Transform functions

For every pair of operation types, we define a transform:

```
Transform(Insert, Insert)
Transform(Insert, Delete)
Transform(Delete, Insert)
Transform(Delete, Delete)
```

Each function adjusts positions.

Example:

```
Transform(Delete(p), Insert(q)):
  if q <= p: return Delete(p + 1)
  else: return Delete(p)
```

This is the algebra of OT.

---

## 4.4 OT requires a total order

OT systems require that all replicas agree on the same order of operations.

Typically:

- A server assigns sequence numbers
- Clients replay operations in that order

The server is not applying edits.
It is ordering them.

## 4.4.1 Why OT works

OT guarantees:

If every replica:

- Receives all operations
- Applies them in the same order
- Uses the same transform functions

Then all documents converge.

And user intent is preserved.

Next chapter:  
CRDT — a completely different philosophy.

---

## 4.5 The hidden complexity

When more than two users edit concurrently, operations must be transformed multiple times.

Each operation must be transformed against every concurrent operation.

This leads to:

- complex state
- large buffers
- tricky correctness

Google Docs uses OT, but the implementation is extremely intricate.

# Chapter 4.5.0 — Where Operational Transformation Breaks

Operational Transformation works — but only under strict assumptions.

Those assumptions quietly shape its architecture.

When they are violated, OT collapses.

This is why CRDT exists.

---

## 4.5.1 OT assumes a total order

OT requires:
All replicas see operations in the same sequence.

This means:
There must be a single authority that decides order.

Usually:

- A central server
- Or a leader in a cluster

This is not optional.

Without total order, different replicas will transform against different histories and diverge.

---

## 4.5.2 Offline editing breaks OT

If Alice edits offline for 10 minutes:

- She accumulates 500 operations
- Bob continues editing online

When Alice reconnects, there is no shared ordering point.

The server must replay Alice’s operations into a world that has radically changed.

Transforming hundreds of operations against hundreds of others becomes:

- expensive
- fragile
- bug-prone

---

## 4.5.3 OT is hard to reason about

OT requires:

- operation buffers
- transformation graphs
- causal histories

One missing transform rule causes corruption.

Small bugs produce:

- duplicated characters
- deleted text
- diverging documents

OT is correct in theory.
It is extremely hard in practice.

---

## 4.5.4 OT does not support peer-to-peer

OT assumes a central ordering point.

Peer-to-peer collaboration:

- no server
- mobile devices
- edge-first apps

break this assumption.

There is no place to impose a global sequence.

---

## 4.5.5 The fundamental problem

OT solves conflicts by **rewriting history**.

But distributed systems hate rewriting history.

What if we could design the data so that:
Order does not matter?

That is the CRDT idea.

Next chapter:  
Conflict-free Replicated Data Types.

---

# Chapter 5 — Conflict-Free Replicated Data Types (CRDT)

CRDTs take the opposite approach from OT.

OT rewrites operations so they fit the current state.  
CRDTs design the data so operations do not conflict.

Instead of fixing history, CRDT makes history unnecessary.

---

## 5.1 The core idea

CRDTs guarantee:

No matter the order in which operations arrive,  
all replicas will converge to the same state.

This is called strong eventual consistency.

There is no server ordering.
No transforms.
No central coordinator.

Just math.

---

## 5.2 Make operations commutative

CRDTs rely on one idea:

If all operations commute, order does not matter.

That means:

```
apply(A, apply(B, state)) == apply(B, apply(A, state))
```

If this is true for all A and B, replicas always converge.

---

## 5.3 Why normal inserts don’t commute

Text insertion normally does not commute.

Insert("A", 0) then Insert("B", 0) gives "BA"  
Insert("B", 0) then Insert("A", 0) gives "AB"

Different results.

So CRDTs change what a “position” means.

---

## 5.4 Identifiers instead of positions

Instead of saying “insert at index 5”, CRDTs say:

Insert character after element X.

Every character has a globally unique ID.

The document becomes:
An ordered list of (ID, character) pairs.

Ordering is defined by ID comparison.

---

## 5.5 A simple sequence CRDT

Start empty.

Alice inserts A with ID 1.1  
Bob inserts B with ID 1.2

Order by ID → A B

If both insert at the same logical position, their IDs still differ.

So both survive.

---

## 5.6 Deletes are tombstones

CRDTs never remove elements.

They mark them as deleted.

This ensures:
A delete arriving before an insert still works.

---

## 5.7 Why CRDTs support offline and P2P

CRDTs do not require:

- servers
- ordering
- transformation

You can:

- edit offline
- sync later
- merge without coordination

This is why CRDTs power:

- Figma
- distributed whiteboards
- peer-to-peer editors

# Chapter 5A — The Internal Mechanics of CRDTs

CRDTs are not “data structures”.
They are **distributed convergence protocols encoded into data itself**.

To understand them, we must understand what exactly is replicated.

---

## 5A.1 What a CRDT actually replicates

In OT, replicas replicate:

- operations

In CRDTs, replicas replicate:

- state
- or operation logs that can be merged without order

But the crucial rule is:

Two replicas that receive the same set of updates — in any order — must converge to the same state.

This is stronger than eventual consistency.

It is mathematical convergence.

---

## 5A.2 The CRDT contract

A CRDT defines:

- a set of states
- a merge function

The merge function must be:

- associative
- commutative
- idempotent

That guarantees:
Merging replicas in any order, any number of times, always produces the same result.

---

## 5A.3 Why IDs replace positions

Text indices are unstable.

So CRDTs use:
Globally unique identifiers for every character.

Each character is stored as:

```
(id, value, tombstone)
```

The document is not:
"hello"

It is:
[(1.1, h), (1.2, e), (1.3, l), (1.4, l), (1.5, o)]

Ordering is by ID, not insertion time.

---

## 5A.4 How concurrent inserts work

Alice inserts X after 1.3 → gets ID 1.3.1  
Bob inserts Y after 1.3 → gets ID 1.3.2

Both reference the same anchor.

They sort by ID:
1.3.1 < 1.3.2

So both appear, in deterministic order.

No conflict.  
No transform.  
No server.

---

## 5A.5 How deletes work

Deletes do not remove elements.

They mark tombstones:

```
(1.3, l, deleted=true)
```

Why?

Because a delete might arrive before the insert.

Tombstones allow:
Late inserts to still be deleted.

---

## 5A.6 Garbage collection problem

CRDTs accumulate:

- IDs
- tombstones
- metadata

This grows without bound.

So systems must:

- periodically compact
- agree on safe delete points

This is one of CRDT’s real costs.

---

## 5A.7 Why CRDTs scale so well

CRDTs have:

- no central ordering
- no transforms
- no locks

They work:

- peer-to-peer
- offline
- across data centers

They trade memory and metadata for simplicity and availability.

# Chapter 5B — Sequence CRDTs in Detail

Most real-world CRDTs are not sets or counters.

They are:
Ordered sequences of characters.

This is the hardest kind of CRDT.

---

## 5B.1 Why lists are harder than sets

A counter CRDT just adds numbers.

A set CRDT just tracks adds and removes.

A text document is:
An ordered list with infinite insert positions.

Order makes everything harder.

---

## 5B.2 Logical positions instead of indexes

CRDTs do not use numeric indexes.

They use:
Paths.

Each element gets a position identifier like:

```
[3, 15, 9]
```

These are compared lexicographically.

Between any two positions, you can always generate another.

This is how infinite insertions are possible.

---

## 5B.3 How IDs are generated

When inserting between:

```
[3, 15] and [3, 16]
```

We pick something in between:

```
[3, 15, 5]
```

This creates infinite density.

But also:

- Long IDs
- Metadata growth

---

## 5B.4 Why this guarantees convergence

All replicas:

- generate IDs in the same range
- compare IDs the same way

So order is deterministic.

No matter who inserts first.

---

## 5B.5 Real implementations

These ideas are implemented in:

- RGA
- Logoot
- LSEQ
- Yjs
- Automerge

Each balances:

- ID length
- memory growth
- merge speed

---

## 5B.6 The performance tradeoff

CRDTs trade:

- time complexity
  for
- memory and metadata

In huge docs:
IDs become large.
Traversal slows.
Garbage collection is needed.

This is why Google Docs still uses OT.

# Chapter 5C — Visualizing CRDTs with ASCII Diagrams

CRDTs are easier to understand when you stop thinking about strings and start thinking about trees and timelines.

---

## 5C.1 A document is a linked structure

Instead of:

```
hello
```

CRDT stores:

```
[1] h → [2] e → [3] l → [4] l → [5] o
```

Each node has a globally unique ID.

---

## 5C.2 Concurrent inserts

Start with:

```
[1] h → [2] e → [3] l → [4] l → [5] o
```

Alice inserts X after [2]  
Bob inserts Y after [2]

They generate:

```
Alice: [2.1] X
Bob:   [2.2] Y
```

The structure becomes:

```
[1] h → [2] e → [2.1] X → [2.2] Y → [3] l → [4] l → [5] o
```

Order is by ID.

Both survive.

---

## 5C.3 Deletes with tombstones

Alice deletes [3] (the first l)

CRDT marks:

```
[3] l (tombstone)
```

So structure becomes:

```
[1] h → [2] e → [2.1] X → [2.2] Y → [3] l (X) → [4] l → [5] o
```

Rendering ignores tombstones.

---

## 5C.4 Why this handles reordering

Bob may receive delete before insert.

The tombstone sits there.

When insert arrives, it attaches correctly.

This is why order does not matter.

---

## 5C.5 Why CRDTs never lose data

Every insert has an ID.

Every delete marks an ID.

Nothing is overwritten.

This is the price of safety.

Next:  
Why CRDTs grow forever and how real systems deal with it.

---

# Chapter 5D — Why CRDTs Grow Forever and How Real Systems Deal with It

CRDTs achieve safety by never throwing information away.

This is both their superpower and their biggest problem.

---

## 5D.1 Why nothing can be deleted

In a CRDT:

- Inserts create elements with IDs
- Deletes only mark tombstones

Why not remove them?

Because:
A delete might arrive before the insert.

If you physically delete an element and later receive an insert referencing it, the structure breaks.

So CRDTs keep:

- all elements
- all tombstones
- all metadata

Forever.

---

## 5D.2 The memory explosion

A document edited for years can have:

- millions of deleted characters
- deeply nested IDs
- large causal metadata

The visible document might be 10 KB.

The CRDT structure might be 100 MB.

This is called metadata bloat.

---

## 5D.3 Garbage collection is hard

To safely remove tombstones, all replicas must agree that:
No one can ever reference that element again.

That requires:

- version vectors
- global knowledge of replica states
- or checkpoints

This is extremely hard in peer-to-peer systems.

---

## 5D.4 Practical solutions

Real systems use:

- Periodic snapshots
- Log truncation
- State compaction
- Background GC

For example:
Figma periodically rewrites the document into a new clean CRDT.

Old IDs are discarded once everyone syncs.

---

## 5D.5 The tradeoff

CRDTs trade:

- strong availability
- offline support
- peer-to-peer

for:

- memory growth
- complexity in garbage collection

OT trades:

- availability
  for:
- simpler memory
- central coordination

Next:  
CRDT memory, compaction, and real-world scaling limits.

---

# Chapter 5E — CRDT Memory, Compaction, and Real-World Scaling Limits

CRDTs look mathematically elegant on paper.  
At scale, they become engineering monsters.

This chapter explains why.

---

## 5E.1 The hidden size of a CRDT document

A CRDT document is not:

```
"hello"
```

It is something like:

```
[(id1, h, live),
 (id2, e, live),
 (id3, l, tombstone),
 (id4, l, live),
 (id5, o, live)]
```

Plus:

- causal metadata
- vector clocks
- replica IDs
- insertion paths

For every visible character, you store 10–100 bytes of metadata.

For every deleted character, you store it forever.

This means:
A 1MB document can require 50–200MB of CRDT state.

---

## 5E.2 ID explosion

Sequence CRDTs use hierarchical IDs:

```
[3]
[3, 5]
[3, 5, 7]
[3, 5, 7, 1]
```

As users insert between the same positions, IDs get deeper.

This causes:

- slower comparisons
- more memory
- larger network payloads

Figma and Automerge both had to redesign ID schemes to control this.

---

## 5E.3 Network cost

Every CRDT sync includes:

- element IDs
- tombstones
- version vectors

Even small edits send large payloads.

On mobile networks, this hurts badly.

---

## 5E.4 Compaction by snapshotting

The only practical way to keep CRDTs sane is:

Periodically:

1. Pick a moment
2. Materialize the document into plain text
3. Rebuild a fresh CRDT from it
4. Discard old IDs

This is called:
Checkpointing or snapshot compaction.

But:
All replicas must agree on the snapshot point.

This reintroduces coordination.

---

## 5E.5 The scaling cliff

CRDTs work brilliantly for:

- whiteboards
- short documents
- P2P tools

They struggle for:

- 100-page docs
- years of history
- massive concurrency

This is why:
Google Docs uses OT
Figma uses CRDT with heavy compaction
Notion uses hybrid models

Next chapter:
OT vs CRDT — the brutal comparison.

---

# Chapter 6 — OT vs CRDT: The Brutal Comparison

| Dimension               | Operational Transformation (OT)         | CRDT                                 |
| ----------------------- | --------------------------------------- | ------------------------------------ |
| Core idea               | Rewrite operations to fit current state | Design data so order does not matter |
| Where complexity lives  | In transform functions and server logic | In data structure and identifiers    |
| Need for central server | Mandatory (for total order)             | Optional (can be peer-to-peer)       |
| Offline editing         | Difficult and fragile                   | Native and safe                      |
| Concurrency handling    | Through operation transformation        | Through commutative data design      |
| Memory usage            | Low                                     | High (IDs, tombstones, metadata)     |
| Network payload         | Small operations                        | Larger state deltas                  |
| Failure handling        | Server is single point of coordination  | Any replica can recover              |
| Ease of reasoning       | Hard to implement correctly             | Hard to design but simple to apply   |
| Garbage collection      | Easy                                    | Extremely hard                       |
| Typical products        | Google Docs, Office Online              | Figma, Notion, Automerge             |
| Scalability model       | Vertical (central server)               | Horizontal (peer-to-peer, edge)      |
| Main tradeoff           | Efficiency over availability            | Availability over efficiency         |

OT optimizes for:

- low memory
- server authority
- predictable behavior

CRDT optimizes for:

- offline
- decentralization
- fault tolerance

Neither is universally better.
They reflect different philosophies about distributed systems.
