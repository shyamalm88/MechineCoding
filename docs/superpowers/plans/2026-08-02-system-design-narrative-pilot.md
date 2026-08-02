# System Design Narrative Restructure — Phase 0 Pilot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure `system-design/ride-booking-uber-rapido.md` from a 14-section reference/crib-sheet into the 12-section narrative template from `docs/superpowers/specs/2026-08-02-system-design-narrative-restructure-design.md`, with zero loss of existing technical content, and get it rebuilt/verified in `system-design-notes/`.

**Architecture:** One markdown source file gets fully rewritten in place, section by section, following an exact old→new content map (no content is invented for sections that already exist; five sections are genuinely new prose, drafted in full below — not left as instructions). A one-line addition to the shared `tools/md-site/build.py` markdown converter enables `<details markdown="1">` blocks for the new Points-to-Ponder device. The generated `system-design-notes/` site is rebuilt and spot-checked in a real browser afterward.

**Tech Stack:** Markdown, Python (`tools/md-site/build.py`, Python's `markdown` library), the existing `unittest` suite in `tools/md-site/tests/`, Playwright/Chromium (already installed locally in this environment — `npx playwright install chromium` was run earlier this session; the package resolves via `NODE_PATH=/Users/arghyamajumder/.npm/_npx/e41f203b7505f1fb/node_modules`).

**Out of scope for this plan:** The remaining 24 docs in `system-design/`. This plan stops at the pilot review checkpoint (Task 4) — do not proceed to other docs without explicit user sign-off on this pilot's result.

---

## Task 1: Enable `md_in_html` in the markdown converter

**Files:**
- Modify: `tools/md-site/build.py` (the `convert_markdown` function, currently around line 110)
- Test: `tools/md-site/tests/test_build.py` (add one new test to the existing `TestConvertMarkdown` class)

- [ ] **Step 1: Write the failing test**

Open `tools/md-site/tests/test_build.py`, find the `TestConvertMarkdown` class (search for `class TestConvertMarkdown`), and add this test method inside it (anywhere among the other `test_*` methods in that class):

```python
    def test_processes_markdown_inside_details_with_markdown_attribute(self):
        # Points-to-Ponder blocks use <details markdown="1"> so inline
        # formatting (bold, inline code) inside the collapsible answer
        # renders correctly instead of showing literal ** and ` characters.
        text = (
            '<details markdown="1">\n'
            "<summary>Q</summary>\n\n"
            "Uses **strong consistency** via `WATCH/MULTI/EXEC`.\n\n"
            "</details>\n"
        )
        result = build.convert_markdown(text)
        self.assertIn("<strong>strong consistency</strong>", result)
        self.assertIn("<code>WATCH/MULTI/EXEC</code>", result)
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `python3 -m unittest tools.md-site.tests.test_build.TestConvertMarkdown.test_processes_markdown_inside_details_with_markdown_attribute -v`

If that module path fails to import (the tests use `-s tools/md-site/tests -t tools/md-site` discovery, not dotted-package import), instead run the whole discovery command and confirm the new test is the only failure:

Run: `python3 -m unittest discover -s tools/md-site/tests -t tools/md-site -v 2>&1 | tail -20`

Expected: FAIL — the new test fails because `**strong consistency**` and `` `WATCH/MULTI/EXEC` `` are emitted literally (unprocessed) inside the `<details>` block, not wrapped in `<strong>`/`<code>`. All other tests still pass.

- [ ] **Step 3: Add the extension**

In `tools/md-site/build.py`, find this line inside `convert_markdown` (around line 111-113):

```python
    body = md_lib.markdown(
        text, extensions=["fenced_code", "tables", "toc", "attr_list"]
    )
```

Replace it with:

```python
    body = md_lib.markdown(
        text,
        extensions=["fenced_code", "tables", "toc", "attr_list", "md_in_html"],
    )
```

- [ ] **Step 4: Run the full test suite to verify everything passes**

Run: `python3 -m unittest discover -s tools/md-site/tests -t tools/md-site -v 2>&1 | tail -10`

Expected: `OK`, all 40 tests pass (39 existing + 1 new).

- [ ] **Step 5: Rebuild both generated sites and confirm no regressions**

```bash
python3 tools/md-site/build.py Theory/ theory-notes/
python3 tools/md-site/build.py system-design/ system-design-notes/
git status --short
```

Expected: `git status` shows changes only where legitimately expected — since this is a markdown-library extension addition with no visual/structural change for existing content (no doc currently uses `<details>`), there should be **no diff at all** in the regenerated HTML. If any existing page's output changed, stop and investigate before proceeding — that would mean `md_in_html` altered behavior for content that doesn't use it, which the throwaway verification during spec-writing didn't show.

- [ ] **Step 6: Commit**

```bash
git add tools/md-site/build.py tools/md-site/tests/test_build.py
git commit -m "$(cat <<'EOF'
Enable md_in_html so <details markdown="1"> blocks process inline markdown

Needed for the upcoming Points-to-Ponder collapsible checkpoints in
system-design/ride-booking-uber-rapido.md (docs/superpowers/plans/
2026-08-02-system-design-narrative-pilot.md, Task 1) -- without this,
bold/inline-code formatting inside a <details> block renders as
literal ** and ` characters instead of being processed.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Restructure `ride-booking-uber-rapido.md`

**Files:**
- Modify: `system-design/ride-booking-uber-rapido.md` (currently 622 lines, 14 sections)

This task rewrites the file section by section. The **old section numbers below refer to the file's current state** (before any edits in this task). Work top to bottom — each step's `old_string` still exists in the file at the time you reach that step, because earlier steps only touch content above or unrelated to it. After Step 12, do a final Step 13 read-through.

Every step that moves existing content specifies the **exact old line range** so you can verify you're moving the right block before deleting it. Every step that adds new content includes the **complete text to insert** — nothing is left for you to compose freeform beyond assembling the specified pieces in the specified order.

- [ ] **Step 1: Read the current file in full**

Before making any edit, read `system-design/ride-booking-uber-rapido.md` completely (622 lines) so you have exact current line numbers and can verify each `old_string` match below is unique. Line numbers cited in this task match this pre-edit state.

- [ ] **Step 2: Replace the title block and old §1 (Problem + Scope) with new §1 (What Is Uber/Rapido?)**

Find (lines 1-11):
```markdown
# System Design: Ride Booking (Uber / Rapido)

---

## 1. Problem + Scope

Design a ride-booking platform (Uber / Rapido) supporting fare estimation, driver matching, real-time location tracking, and payment — at millions of concurrent users and drivers.

**In Scope:** Fare estimation, ride booking, driver matching, real-time location tracking (rider and driver), trip start/end, ratings, payments, surge pricing.

**Out of Scope:** Driver onboarding, fleet management, surge zone boundary drawing, fraud detection internals, driver incentive programs.
```

Replace with:
```markdown
# System Design: Ride Booking (Uber / Rapido)

---

## 1. What Is Uber / Rapido?

Uber and Rapido are ride-booking platforms: a rider opens an app, requests a trip from their current location to a destination, and the app connects them with a nearby available driver who accepts the ride, picks them up, and drives them to their destination. The rider pays through the app, and both sides rate each other afterward.

At the scale these platforms operate — millions of riders and drivers active at the same time in the same cities — the hard part isn't the ride itself, it's connecting the right driver to the right rider fast enough, correctly enough (never double-booking a driver), while both sides' locations are constantly changing.
```

(The **In Scope / Out of Scope** lists that were here are not discarded — they move into the new §3 in Step 4 below, since they're requirements-boundary content, not part of a plain-English product description.)

- [ ] **Step 3: Insert new §2 (A Day in the Life) directly after the block from Step 2**

Immediately after the paragraph ending "...while both sides' locations are constantly changing." (the text you just inserted in Step 2), insert:

```markdown

---

## 2. A Day in the Life

Priya finishes dinner and opens the app to head home. She taps "Request Ride," and the map already shows a few nearby cars. A few seconds later, her screen updates: "Driver assigned — Arjun, 4 minutes away." She watches Arjun's car icon creep closer to her pin on the map in real time.

Across town, Arjun had just dropped off another rider and was marked available again. His phone buzzed with the new offer — pickup 1.2km away — and he had 15 seconds to accept before it would go to the next closest driver. He tapped accept.

As Arjun drives toward her, Priya can see his position update every couple of seconds — smooth enough that it doesn't feel like she's watching a slideshow. When he arrives, he taps "Arrived," Priya gets in, and he starts the trip. Now his position updates even more frequently — she's actively tracking him drive her home.

At her destination, Arjun ends the trip. The fare is calculated automatically and charged to Priya's saved payment method — no cash, no negotiation. Both of them rate each other, and Arjun's app immediately shows him as available again, ready for the next rider.

The whole thing — from Priya's tap to Arjun being free again — usually takes under 20 minutes, and neither of them ever thought about a database, a queue, or a server. Everything from here on is how that experience actually gets built.
```

- [ ] **Step 4: Replace old §3 + §4 (Functional/Non-Functional Requirements) with new §3 (Requirements — and Why They Matter)**

Find the old section header + content spanning from `## 3. Functional Requirements` through the end of the CAP Theorem callout, right before `## 5. 🧠 Mental Model` (original lines 48-85):

```markdown
## 3. Functional Requirements

1. Rider gets a fare estimate (per vehicle type) for a pickup and drop location
2. Rider books a ride; system matches a nearby available driver within 60 seconds
3. Driver accepts or denies the ride offer (15-second window)
4. Both rider and driver track each other on a live map
5. Trip starts and ends; fare is finalized and payment is processed
6. Rider and driver rate each other after trip completion
7. Rider can cancel a ride before driver arrival; driver can cancel before trip start

---

## 4. Non-Functional Requirements

| Requirement | Target |
|---|---|
| Latency — driver matching | < 300ms to dispatch first offer |
| Latency — location update visible to rider | < 2s end-to-end |
| Availability (rider-facing) | 99.9% — app down = revenue loss |
| Consistency (driver assignment) | Strong — a driver must never be assigned to two rides simultaneously |
| Durability (trip + billing data) | Zero loss — replicated DB + Kafka retention |
| Location update throughput | 1.67M writes/sec sustained |
| WebSocket connections | 7M concurrent at peak |

**Consistency Model by Component:**

| Component | Consistency | Why |
|---|---|---|
| Driver assignment (Redis WATCH/EXEC) | Strong | Prevents double-booking |
| Driver location (Redis Geo) | Eventual | Overwrites on next tick; ephemeral |
| Trip record (PostgreSQL) | Strong (ACID) | Financial correctness |
| Surge multiplier (Redis cache) | Eventual (60s TTL) | Slight staleness is acceptable |
| Ride history (read replica) | Eventual | Acceptable for non-real-time reads |

> [!IMPORTANT]
> **CAP Theorem framing:** This system intentionally makes different consistency trade-offs per component. Rider-facing read services (fare estimate, history) prefer availability. Driver assignment prefers strong consistency. Stating this explicitly in an interview shows CAP awareness at a component level — not a single global answer.
```

Replace with:

```markdown
## 3. Requirements — and Why They Matter

**Scope.** In scope: fare estimation, ride booking, driver matching, real-time location tracking (rider and driver), trip start/end, ratings, payments, surge pricing. Out of scope: driver onboarding, fleet management, surge zone boundary drawing, fraud detection internals, driver incentive programs.

**Functional requirements:**

1. Rider gets a fare estimate (per vehicle type) for a pickup and drop location
2. Rider books a ride; system matches a nearby available driver within 60 seconds
3. Driver accepts or denies the ride offer (15-second window)
4. Both rider and driver track each other on a live map
5. Trip starts and ends; fare is finalized and payment is processed
6. Rider and driver rate each other after trip completion
7. Rider can cancel a ride before driver arrival; driver can cancel before trip start

<details markdown="1">
<summary><strong>Point to Ponder:</strong> What if two drivers are exactly equidistant from a rider — how do we pick?</summary>

It's not actually about distance — matching ranks by predicted ETA, not raw distance. A driver 0.5km away stuck in traffic can have a worse ETA than one 1.2km away on an open road, so ties are broken by ETA, which already accounts for real-world route and traffic conditions. See §8 Deep Dives for the full ranking pipeline.

</details>

**Non-functional requirements — and why each one matters to a real user, not just as a target:**

| Requirement | Target | Why it matters |
|---|---|---|
| Latency — driver matching | < 300ms to dispatch first offer | A slower dispatch means the rider stares at a spinner wondering if the app is broken — trust erodes fast in the first few seconds of any request. |
| Latency — location update visible to rider | < 2s end-to-end | If the driver's dot on the map lags noticeably behind their real position, the rider can't trust the ETA or know where to actually stand. |
| Availability (rider-facing) | 99.9% — app down = revenue loss | A rider trying to get home late at night with a dead app isn't a minor bug — it's a stranded person. |
| Consistency (driver assignment) | Strong — a driver must never be assigned to two rides simultaneously | If two riders are both told "you have Arjun's car," one of them gets left behind — and Arjun can't be in two places. |
| Durability (trip + billing data) | Zero loss — replicated DB + Kafka retention | A lost trip record means a driver doesn't get paid for a ride they completed, or a rider gets charged with no record of why. |
| Location update throughput | 1.67M writes/sec sustained | Not a promise to the user directly — it's the throughput the system must sustain merely to keep the two latency promises above true for millions of concurrent users. |
| WebSocket connections | 7M concurrent at peak | Same as above: this is what "real-time tracking for everyone online right now" costs in raw connection count. |

**Consistency Model by Component:**

| Component | Consistency | Why |
|---|---|---|
| Driver assignment (Redis WATCH/EXEC) | Strong | Prevents double-booking |
| Driver location (Redis Geo) | Eventual | Overwrites on next tick; ephemeral |
| Trip record (PostgreSQL) | Strong (ACID) | Financial correctness |
| Surge multiplier (Redis cache) | Eventual (60s TTL) | Slight staleness is acceptable |
| Ride history (read replica) | Eventual | Acceptable for non-real-time reads |

> [!IMPORTANT]
> **CAP Theorem framing:** This system intentionally makes different consistency trade-offs per component. Rider-facing read services (fare estimate, history) prefer availability. Driver assignment prefers strong consistency. Stating this explicitly in an interview shows CAP awareness at a component level — not a single global answer.

<details markdown="1">
<summary><strong>Point to Ponder:</strong> What if a rider requests a ride but there's no driver within a reasonable distance?</summary>

The system doesn't just fail immediately — it expands its search radius in rounds (2km → 3km → 5km, each with its own timeout), trading a longer wait for a match instead of giving up right away. Only after the widest radius is exhausted does it return "no driver found." See the Dispatch Expansion table in §8 Deep Dives.

</details>
```

- [ ] **Step 5: Replace old §2 (Assumptions & Scale) — moving it after the new §3, reframed as §4**

Find (original lines 15-44, the section that currently sits between the title block and old §3 — note this step runs *after* Step 4 textually in the final file even though it's numbered lower in the original; make this edit by finding the section's own unique text, independent of surrounding step edits):

```markdown
## 2. Assumptions & Scale

```
Inputs:
  Total drivers online:       5 million
  Daily rides:                20 million
  Peak concurrent requests:   500,000
  Location update frequency:  every 1s (ON_TRIP), every 2s (RESERVED), every 5s (IDLE)

Location writes/sec:
  5M drivers x (1 update / 3s avg) = ~1.67M writes/sec -> Redis must handle this

WebSocket connections (peak):
  5M drivers + ~2M active riders = ~7M persistent connections

Trip events/sec (Kafka):
  20M rides/day / 86,400s = ~232 events/sec (well within Kafka capacity)

Storage:
  Trip record: ~1 KB x 20M rides/day = 20 GB/day (PostgreSQL)
  Location history (waypoints): ~500 GPS points x 16B x 20M trips = ~160 GB/day (cold)
  Driver metadata: 5M drivers x 1 KB = 5 GB (static, fits in memory)

Bandwidth comparison:
  Location update frame (WebSocket): ~20 bytes
  Location update frame (HTTP polling): ~2 KB (headers + body)
  At 1.67M updates/sec: WebSocket = 33 MB/s vs HTTP = 3.3 GB/s -> WebSocket wins 100x
```

These numbers drive the following decisions: Redis for geospatial search (not PostGIS), WebSocket (not HTTP polling), Kafka for fan-out (not direct server-to-server calls), and state-adaptive location frequency (not a fixed 1s tick).
```

Replace with:

```markdown
## 4. Scale, From First Principles

Before designing anything, it's worth asking: how many drivers, riders, and requests are we actually dealing with — and what does that imply for the technology choices ahead?

**Starting assumptions:**
```
Total drivers online:       5 million
Daily rides:                20 million
Peak concurrent requests:   500,000
Location update frequency:  every 1s (ON_TRIP), every 2s (RESERVED), every 5s (IDLE)
```

**How many location writes per second does that create?** If 5 million drivers each send an update roughly every 3 seconds on average (blending the three frequencies above), that's:
```
5M drivers x (1 update / 3s avg) = ~1.67M writes/sec -> Redis must handle this
```
That single number rules out a relational database for driver location before we've designed anything else — no single PostgreSQL primary survives 1.67 million writes per second.

**How many persistent connections does live tracking require?** Every online driver plus every rider mid-trip needs an open connection to receive updates:
```
5M drivers + ~2M active riders = ~7M persistent connections
```
That's the number that rules out HTTP polling — see the bandwidth comparison below — and points toward WebSocket.

**What about the durable side — trip records, not location?** Trip starts/ends are far rarer events than location pings:
```
20M rides/day / 86,400s = ~232 events/sec (well within Kafka capacity)
```
232 events/sec is a completely different scale problem than 1.67M writes/sec — which is exactly why this system treats location (fast, ephemeral) and trip records (rare, durable) as two entirely different pipelines, not one.

**Storage:**
```
Trip record: ~1 KB x 20M rides/day = 20 GB/day (PostgreSQL)
Location history (waypoints): ~500 GPS points x 16B x 20M trips = ~160 GB/day (cold)
Driver metadata: 5M drivers x 1 KB = 5 GB (static, fits in memory)
```

**Why WebSocket beats HTTP polling at this scale:**
```
Location update frame (WebSocket): ~20 bytes
Location update frame (HTTP polling): ~2 KB (headers + body)
At 1.67M updates/sec: WebSocket = 33 MB/s vs HTTP = 3.3 GB/s -> WebSocket wins 100x
```

These numbers are what drive every major decision in this design: Redis for geospatial search (not PostGIS), WebSocket (not HTTP polling), Kafka for fan-out (not direct server-to-server calls), and state-adaptive location frequency (not a fixed 1-second tick for every driver regardless of what they're doing).
```

- [ ] **Step 6: Verify section ordering after Steps 2-5**

After Steps 2-5, read the file from the top through the end of the new §4. Confirm the order is: title → §1 What Is Uber/Rapido? → §2 A Day in the Life → §3 Requirements — and Why They Matter → §4 Scale, From First Principles. If §4 landed in the wrong position (before §3 instead of after), move the whole `## 4. Scale, From First Principles` block (everything from that heading up to, but not including, the next `---` before the old Mental Model section) to directly follow §3's closing `</details>` block from Step 4.

- [ ] **Step 7: Merge old §5 (Mental Model) + old §8 (High-Level Architecture) into new §5**

Find the old §5 heading and content (original lines 87-124):

```markdown
## 5. 🧠 Mental Model
```

Change just this heading line to:

```markdown
## 5. High-Level Architecture

Remember Priya's request and Arjun's acceptance from the story above — here's what actually happens underneath.
```

Leave everything else in old §5 (the Mental Model paragraph, the fast-path/reliable-path diagram, the Core Design Principles table, and both `[!IMPORTANT]`/`[!NOTE]` callouts) unchanged, immediately following the two lines above.

Then, directly after old §5's content ends (right before the old `## 6. API Design` heading), insert:

```markdown
<details markdown="1">
<summary><strong>Point to Ponder:</strong> Why does the fast path (matching) never touch PostgreSQL directly?</summary>

Because driver location and matching state are ephemeral — only the latest value matters, and it's fine if a value is lost on a crash since it'll be overwritten in 1-5 seconds anyway. PostgreSQL is for data that must never be lost (trip records for billing) — mixing the two would mean either slowing matching down to hit a durable disk on every update, or risking billing data with a fire-and-forget cache.

</details>

---

### From Simple to Evolved
```

Then move old §8's entire content (original lines 231-298, from `## 8. High-Level Architecture` through the end of the "Evolved Design" mermaid block) to directly follow the `### From Simple to Evolved` heading you just inserted — but drop old §8's own `## 8. High-Level Architecture` line (it's now redundant with the new §5 heading) and keep only its `### Simple Design` / `### Evolved Design (with Kafka and Surge Pricing)` subheadings and their diagrams.

- [ ] **Step 8: Renumber old §6 (API Design) to §6 — verify only, no content change**

Old §6 (`## 6. API Design`, original lines 126-147) already has the right number for its new position. Confirm the heading still reads `## 6. API Design` and its content (Rider APIs table, Driver APIs table, the async-matching `[!NOTE]`) is untouched.

- [ ] **Step 9: Fold old §7's technical flow into §5, remove the now-duplicate plain-English list**

Old §7 (`## 7. End-to-End Flow`, original lines 151-227) contains two things: (a) an 11-step plain-English list (lines 155-165) whose content has already been superseded by the new §2 "A Day in the Life" narrative from Step 3, and (b) a mermaid sequence diagram (lines 167-227) with its own heading context, which is genuinely new technical detail not present anywhere else in the doc.

Delete the `## 7. End-to-End Flow` heading and the 11-item numbered list (lines 151-165) entirely — its narrative content now lives in §2.

Keep the mermaid sequence diagram (lines 167-227). Move it to the end of §5 (High-Level Architecture), directly after the "Evolved Design" mermaid graph from Step 7, with this lead-in inserted directly above the diagram:

```markdown
### The Full Sequence

The diagrams above show the components; this shows the actual message sequence between them, end to end:
```

- [ ] **Step 10: Renumber old §9 (Data Model) to §7, add prose-first reasoning**

Find the old §9 heading (original line 302):

```markdown
## 9. Data Model
```

Replace with:

```markdown
## 7. Data Model

Seven different pieces of data live in this system, and none of them belong in the same store — each has different durability, consistency, and throughput needs. Driver location needs sub-millisecond geospatial queries and can tolerate total loss (it's stale in 5 seconds anyway) — that's Redis Geo, not a relational database. Trip and payment records need ACID guarantees because they're money — that's PostgreSQL, not a cache. Ride request logs are high-volume and read for analytics, not transactional correctness — that's a wide-column/analytics store, not a relational join target. The table below maps every entity to the store whose guarantees actually match what that entity needs:
```

Leave the existing table (original lines 304-314) unchanged directly below this new intro.

- [ ] **Step 11: Renumber old §10 (Deep Dives) to §8, add "What This Must Prevent" to Driver Matching**

Find the old §10 heading (original line 318):

```markdown
## 10. Deep Dives
```

Replace with:

```markdown
## 8. Deep Dives
```

Then find, inside "### 7.1 Driver Matching with Geohash and Atomic Assignment" (original lines 320-322), the text ending:

```markdown
**Naive solution fails:** A full-table scan of 5M driver rows per ride request at 500K peak requests/sec = 2.5 trillion row scans per second. No relational DB survives this.
```

Insert this new block directly after that paragraph (before `**Chosen solution — five-step pipeline:**`):

```markdown

**What this must prevent:**
- Two different ride requests both being assigned the same driver at the same moment (double-booking)
- A driver being offered a ride, timing out, and never being returned to the available pool (driver starvation)
- Search always returning empty when there are only a few nearby available drivers rather than degrading gracefully
```

Also rename this subsection's own heading from `### 7.1 Driver Matching with Geohash and Atomic Assignment` to `### 8.1 Driver Matching with Geohash and Atomic Assignment`, and similarly rename `### 7.2 Surge Pricing Algorithm` → `### 8.2 Surge Pricing Algorithm` and `### 7.3 Real-Time Location Write Architecture` → `### 8.3 Real-Time Location Write Architecture`. Leave all other content in this section (original lines 318-488) completely unchanged.

- [ ] **Step 12: Renumber old §11-13 to §9, insert new §10 Evaluation and §11 Conclusion, renumber old §14 to §12**

Find the old §11 heading (original line 492):
```markdown
## 11. Bottlenecks & Scaling
```
Replace with:
```markdown
## 9. Bottlenecks & Scaling
```

Find old §12 heading (original line 514) and §13 heading (original line 529) and renumber them to keep them as subsections of the same "§9" grouping — change:
```markdown
## 12. Failure Scenarios
```
to:
```markdown
## 9.1 Failure Scenarios
```
and change:
```markdown
## 13. Trade-offs
```
to:
```markdown
## 9.2 Trade-offs
```
Leave all table/content under these three headings (original lines 492-577) completely unchanged.

Directly after the last Trade-offs subsection ends (after the "WebSocket vs HTTP is a math problem" `[!NOTE]`, right before the original `## 14. Interview Summary` heading), insert:

```markdown
---

## 10. Evaluation: Did We Meet the Requirements?

Six non-functional requirements were set out in §3. Here's how the design actually satisfies each one — not just what was promised, but the specific mechanism doing the work.

**Latency (dispatch < 300ms, location visible < 2s):** The fast path never touches a disk-backed database — `GEORADIUS` runs against an in-memory Redis sorted set, and the `WATCH/MULTI/EXEC` atomic assignment is a handful of Redis commands, not a distributed transaction. Location updates skip the database entirely and flow Driver → Redis GEOADD → Kafka → rider WebSocket, each hop sub-millisecond to low-single-digit milliseconds.

**Availability (99.9% rider-facing):** Redis Sentinel/Cluster failover recovers a lost primary in under 30 seconds, and drivers self-heal into the pool via heartbeat re-registration. Because location state is ephemeral (§9.1 Failure Scenarios), a Redis failover doesn't corrupt anything — it just means a brief gap in live tracking, not lost data or a stuck trip.

**Consistency (driver assignment must be strong):** This is the one place the design refuses to be eventually consistent. `WATCH/MULTI/EXEC` makes the IDLE→RESERVED transition atomic — two servers racing to reserve the same driver, only one EXEC commits, the other gets `nil` and moves to the next candidate. No separate lock service, because the state itself is the lock.

**Durability (zero loss on trip + billing data):** Trip events go through Kafka (replication factor 3) before landing in PostgreSQL — if a broker or the database briefly goes down, Kafka retains the event and replays it on recovery, so a billing event is never silently dropped, only delayed.

**Location throughput (1.67M writes/sec) and WebSocket connections (7M peak):** These aren't separately "achieved" — they're the reason Redis Geo and WebSocket were chosen over PostGIS and HTTP polling in the first place (§4 Scale, From First Principles). The design doesn't scale up to meet these numbers after the fact; they were the numbers that ruled out the alternatives before any component was chosen.

| Requirement | Mechanism |
|---|---|
| Latency — matching < 300ms | In-memory Redis GEORADIUS + WATCH/MULTI/EXEC, no disk-backed DB on the fast path |
| Latency — location < 2s | Driver → Redis GEOADD → Kafka → rider WebSocket, no polling |
| Availability 99.9% | Redis Sentinel/Cluster failover (<30s), driver heartbeat re-registration |
| Consistency — driver assignment | WATCH/MULTI/EXEC atomic state transition, state is the lock |
| Durability — trip/billing | Kafka (RF=3) buffers PostgreSQL writes, replays on recovery |
| 1.67M writes/sec, 7M connections | Architectural constraints that selected Redis Geo + WebSocket up front |

---

## 11. Conclusion

This design treats Uber/Rapido as two concurrent systems wearing one UI: a high-frequency, ephemeral location-tracking pipeline, and a low-frequency, durable trip-and-billing pipeline — and it never lets the two mix. The hardest problem wasn't finding a nearby driver; it was atomically reserving one without a separate lock service, and deciding, precisely, which data can be lost for a few seconds (location) and which never can (money). Every other decision — Redis over PostGIS, WebSocket over polling, Kafka in the middle — falls out of getting that one distinction right.

---
```

Finally, find the old §14 heading (original line 581):
```markdown
## 14. Interview Summary
```
Replace with:
```markdown
## 12. Interview Summary
```
Leave all content under it (original lines 581-622) completely unchanged.

- [ ] **Step 13: Full read-through and structural verification**

Read the entire rewritten file. Confirm:
1. Section order top to bottom: 1 What Is Uber/Rapido?, 2 A Day in the Life, 3 Requirements — and Why They Matter, 4 Scale From First Principles, 5 High-Level Architecture (with the merged Simple/Evolved diagrams and the moved sequence diagram), 6 API Design, 7 Data Model, 8 Deep Dives (8.1/8.2/8.3), 9 Bottlenecks & Scaling (9.1 Failure Scenarios, 9.2 Trade-offs), 10 Evaluation, 11 Conclusion, 12 Interview Summary.
2. No duplicate headings, no leftover old section numbers.
3. Every mermaid fence from the original still present: run `grep -c '```mermaid' system-design/ride-booking-uber-rapido.md` and confirm it returns `6` (the original file has 6 mermaid blocks: Mental Model's isn't mermaid/is ASCII so doesn't count — verify by also running this same grep against `git show HEAD:system-design/ride-booking-uber-rapido.md` before your edits and confirming the counts match).
4. Word count did not shrink: run `wc -w system-design/ride-booking-uber-rapido.md` and compare against `git show HEAD:system-design/ride-booking-uber-rapido.md | wc -w` — the new file must have a higher count.

- [ ] **Step 14: Commit**

```bash
git add system-design/ride-booking-uber-rapido.md
git commit -m "$(cat <<'EOF'
Restructure ride-booking-uber-rapido.md into a narrative doc

Follows the 12-section template from docs/superpowers/specs/
2026-08-02-system-design-narrative-restructure-design.md: opens with
a plain-English "what is this" + user-journey story before any
component is introduced, explains non-functional requirements in
terms of user impact, adds three Points-to-Ponder checkpoints, and
closes with an Evaluation section that explicitly checks the design
against every requirement raised at the start, plus a short
Conclusion. All existing technical content (Redis command sequences,
mermaid diagrams, trade-off tables, failure scenarios) is preserved
verbatim, only resequenced and given connective narration.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Rebuild and verify in a browser

**Files:**
- No file changes — this task runs the existing build tool and a verification script.

- [ ] **Step 1: Rebuild `system-design-notes/`**

```bash
python3 tools/md-site/build.py system-design/ system-design-notes/
```

- [ ] **Step 2: Confirm the rebuild only touched expected files**

```bash
git status --short system-design-notes/
```

Expected: `system-design-notes/notes/ride-booking-uber-rapido.html` modified. All other `system-design-notes/notes/*.html` files unchanged (the sidebar is client-side now, rendered from `assets/nav.json` per the earlier session's work — so unlike the old architecture, other pages should show **zero diff**, not just a shared-sidebar diff). If any other page changed, investigate before proceeding.

- [ ] **Step 3: Serve the site locally**

```bash
(cd /Volumes/Personal/MechineCoding && nohup python3 -m http.server 8090 >/tmp/pilot-verify-server.log 2>&1 &)
sleep 1
curl -s -o /dev/null -w "HTTP %{http_code}\n" http://localhost:8090/system-design-notes/notes/ride-booking-uber-rapido.html
```

Expected: `HTTP 200`.

- [ ] **Step 4: Browser-verify with Playwright**

Write this script to `/private/tmp/claude-501/-Volumes-Personal-MechineCoding/7d379f93-ce05-4892-81e2-95b33ec53cb8/scratchpad/verify_pilot.js` (adjust the scratchpad path if the session's actual scratchpad directory differs from this plan's assumption — check the current session's system prompt for the exact path):

```javascript
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));

  await page.goto('http://localhost:8090/system-design-notes/notes/ride-booking-uber-rapido.html');
  await page.waitForSelector('#sidebar h2.brand');

  const h1 = await page.textContent('main h1');
  const detailsCount = await page.locator('main details[markdown]').count();
  // Note: the `markdown="1"` attribute is stripped by the markdown processor
  // during HTML generation (it's a processing instruction, not meant to
  // survive into output) -- so also check for details elements generically:
  const allDetailsCount = await page.locator('main details').count();
  const mermaidCount = await page.locator('.mermaid').count();

  // Expand the first Point-to-Ponder and confirm the answer becomes visible
  const firstDetails = page.locator('main details').first();
  const summaryText = await firstDetails.locator('summary').textContent();
  await firstDetails.locator('summary').click();
  const isOpen = await firstDetails.evaluate((el) => el.open);

  await page.screenshot({ path: '/tmp/pilot-verify-screenshot.png', fullPage: false });

  console.log(JSON.stringify({
    h1, allDetailsCount, mermaidCount, summaryText, isOpen,
  }, null, 2));
  console.log('ERRORS:', JSON.stringify(errors));

  await browser.close();
})();
```

Run it:

```bash
NODE_PATH="/Users/arghyamajumder/.npm/_npx/e41f203b7505f1fb/node_modules" node /private/tmp/claude-501/-Volumes-Personal-MechineCoding/7d379f93-ce05-4892-81e2-95b33ec53cb8/scratchpad/verify_pilot.js
```

(If that `NODE_PATH` no longer resolves — the npx cache directory hash can change between sessions — run `find ~/.npm/_npx -maxdepth 4 -type d -name playwright 2>/dev/null` first to find the current path.)

Expected: `h1` is `"System Design: Ride Booking (Uber / Rapido)"`, `allDetailsCount` is `3` (three Points to Ponder), `mermaidCount` is `6`, `isOpen` is `true` after clicking, and `ERRORS` is `[]`.

- [ ] **Step 5: Look at the screenshot**

Read `/tmp/pilot-verify-screenshot.png`. Confirm the page renders with visible sidebar, heading, and readable body text — not a blank or broken-looking page.

- [ ] **Step 6: Clean up the verification server and script**

```bash
lsof -ti:8090 -sTCP:LISTEN | xargs -r kill
rm -f /private/tmp/claude-501/-Volumes-Personal-MechineCoding/7d379f93-ce05-4892-81e2-95b33ec53cb8/scratchpad/verify_pilot.js /tmp/pilot-verify-screenshot.png /tmp/pilot-verify-server.log
```

- [ ] **Step 7: Commit the rebuilt site**

```bash
git add system-design-notes/notes/ride-booking-uber-rapido.html
git commit -m "$(cat <<'EOF'
Rebuild system-design-notes/ for the restructured ride-booking doc

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Present to user for pilot review

**Files:** None — this is a checkpoint, not a code change.

- [ ] **Step 1: Stop and report**

Summarize for the user: the restructured doc's new section list, confirmation that all 6 mermaid diagrams and the full word count survived (cite the actual before/after numbers from Task 2 Step 13), and a link/path to view it (`system-design-notes/notes/ride-booking-uber-rapido.html`, or the deployed GitHub Pages URL once pushed). **Do not proceed to any of the other 24 docs in `system-design/` until the user explicitly approves this pilot.** If they request changes, make them, re-run Task 3's verification, and re-present — do not silently expand scope to other docs.

---

## Self-Review Notes (completed during plan authoring, not a step to execute)

- **Spec coverage:** Every one of the spec's 12 template sections has a corresponding Task 2 step. The content-preservation guarantee (mermaid/code/table survival, word count) is checked mechanically in Task 2 Step 13. The `md_in_html` implementation note from the spec is Task 1. The pilot-first rollout and stop-before-other-24-docs constraint is Task 4.
- **Placeholder scan:** All five new-prose sections (What Is X, Day in the Life, both Points to Ponder in §3, the Point to Ponder in §5, Evaluation, Conclusion) are written out in full in Task 2 — none deferred to "write appropriate content here."
- **Type/name consistency:** Section numbers are cross-referenced consistently after renumbering (Evaluation references "§3", "§9.1 Failure Scenarios", "§4 Scale, From First Principles" — matching the final numbering established across Steps 2-12, not the original numbering).
