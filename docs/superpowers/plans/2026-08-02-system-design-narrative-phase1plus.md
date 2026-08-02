# System Design Narrative Restructure — Phase 1+ Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the narrative-restructure template (`docs/superpowers/specs/2026-08-02-system-design-narrative-restructure-design.md`, as corrected after the pilot) to the 17 remaining backend-infra-style docs in `system-design/`, using `system-design/ride-booking-uber-rapido.md` (already restructured, twice-reviewed, pushed at commit `c4c7d46`) as the worked example of both target voice and target process.

**Architecture:** One reusable task template (below) defines the exact, fully-specified procedure for restructuring a single doc — read it, identify its own section boundaries, apply the spec's 12-section template with real prose narration (not tables-with-a-prose-coat), verify content preservation, get spec-compliance + quality review, commit. That template is written once here and is meant to be *composed* by whoever is executing this plan: for each doc-task below, combine the Reusable Task Template with that task's doc-specific notes into one full implementer prompt — this plan does not repeat the template's full text 17 times, but every doc-task is still fully specified once template + notes are combined. 17 docs are organized into 3 phases matching `site.config.json`'s star-priority tiers, with a phase-boundary checkpoint (present 2 completed docs to the user, wait for go-ahead) before starting the next phase.

**Tech Stack:** Markdown, `tools/md-site/build.py` (rebuild target after each doc/batch), Playwright/Chromium (already installed locally this session — `NODE_PATH` resolves via `find ~/.npm/_npx -maxdepth 4 -type d -name playwright`).

**Scope note (confirmed during planning, not to be re-litigated per doc):** `system-design/` has 25 files total. `ride-booking-uber-rapido.md` is done. `SystemDesignQuestions.md` is a flat list of interview-question prompts (zero `## ` section headers) — excluded, not a narrative-restructure candidate. 6 more files (`ecommerce-marketplace-amazon.md`, `video-conference-zoom.md`, `photo-grid-google-photos.md`, `instagram-photo-feed.md`, `bookmyshow-ticket-booking.md`, `travel-booking-airbnb-makemytrip.md`) are a *different genre* — deep frontend component-architecture specs (Zustand stores, WebRTC signaling, virtualization), not backend system designs, ranging 2,000–21,000 lines — explicitly excluded from this plan per user decision; they'd need their own template design in a future project, not a variant applied here. That leaves exactly 17 in scope, listed in the phases below.

---

## Reusable Task Template: Restructure One System-Design Doc

Use this procedure for every doc-task in Phases 1–3 below. When dispatching an implementer subagent for a specific doc, combine this template with that doc's notes (file path, one-line grounding fact, known structural quirks) into a single self-contained prompt — do not make the subagent read the plan file itself, and do not make it read the spec/pilot cold without the context below.

### Inputs every implementer needs

- **The target file**, given in the doc-specific task below.
- **The spec**: `docs/superpowers/specs/2026-08-02-system-design-narrative-restructure-design.md` — read the full "The New Template" and "Content-Preservation Guarantee" sections before starting. This is the authoritative rulebook, including the corrected guidance that Deep Dives/Data Model/API Design/Bottlenecks/Failure Scenarios/Trade-offs must become **real causal prose**, not tables/bullets with a prose coat.
- **The worked example**: `system-design/ride-booking-uber-rapido.md` (current state on `master`, commit `c4c7d46` or later). Read it in full before writing a single word of the target doc. This is the quality bar — same voice, same structural moves (a plain-English "What Is X" opener, a persona-driven "Day in the Life" journey the rest of the doc calls back to, Points-to-Ponder checkpoints answered from the doc's own existing content, Deep Dives narrated as problem→why-naive-fails→mechanism rather than labeled bullets, a Data Model that reasons in prose before tabulating, an Evaluation that closes the loop on every non-functional requirement, a Conclusion, callouts that pay off *after* the prose builds up to them rather than repeating it).

### Step-by-step procedure

- [ ] **Step 1: Read the target file in full.** Do not skim. Note its actual current section headings and their order — **do not assume they match `ride-booking-uber-rapido.md`'s numbering.** Every doc in this project has some numbering quirk (one starts its first section at "0.", several have a duplicate or forward-referencing "🧠 Mental Model" header, some have extra sections like a "🧠 Consistency Model" or "⚡ Event-Driven Model" that don't exist in the pilot at all, several have a bonus "Frontend Notes" or "Frontend Design (N% of this system)" section near the end that the pilot doesn't have). Identify what this specific doc actually contains before mapping anything.

- [ ] **Step 2: Build your own old-section → new-section map** for this doc, following the spec's 12-section target order:
  1. What Is [System]? (new)
  2. A Day in the Life (new, persona journey)
  3. Requirements — and Why They Matter (old Functional + Non-Functional Requirements, reframed with user-impact "why," 1-2 Points to Ponder)
  4. Scale, From First Principles (old Assumptions & Scale, reframed as a reasoning walkthrough)
  5. High-Level Architecture (old Mental Model + old High-Level Architecture merged, plus the old End-to-End Flow's sequence diagram moved in under a "The Full Sequence" heading if the doc has one separately — check whether this doc's End-to-End Flow section has already-plain-English content that's now redundant with your new §2, the same way the pilot's did)
  6. API Design (old API Design / System Interface, reframed with prose framing — not left as bare tables)
  7. Data Model (old Data Model, reframed: group entities by usage, prose reasoning first, table drops to compact reference columns only)
  8. Deep Dives (old Deep Dives, rewritten as causal prose per the spec's corrected guidance — this is the section most likely to still read as a "grid" if you don't rewrite it fully; one deep dive gets full standalone-lesson treatment per the spec)
  9. Bottlenecks & Scaling / Failure Scenarios / Trade-offs (old sections, rewritten as prose per the spec's corrected guidance, `###` subsections nested under this section's `##` heading)
  10. Evaluation: Did We Meet the Requirements? (new)
  11. Conclusion (new)
  12. Interview Summary (old, unchanged, repositioned as bonus recall sheet)

  **If the doc has a bonus section the pilot doesn't have** (a "Frontend Notes" / "Frontend Design (N%)" section, or something specific to that domain like a "Consistency Model" deep dive), give it its own slot positioned between the renumbered Trade-offs subsection and the new Evaluation section — do not delete it, and do not force it into one of the 12 slots above if it doesn't actually fit there.

- [ ] **Step 3: Write the new sections.** For each of the five genuinely new pieces (What Is X, Day in the Life, Points to Ponder, Evaluation, Conclusion): follow the same rules as the pilot — zero jargon in §1/§2, zero fabricated statistics or real-world company facts not already implied by the doc's existing content, Points-to-Ponder answers mined from the doc's own existing Deep Dives/Trade-offs content (never invented fresh), rendered as `<details markdown="1"><summary>...</summary>...</details>`.

  For each reframed section (§3, §4, §5, §6, §7, §8, §9): **this is prose-writing work, not mechanical reformatting.** Read the existing table/bullet content, understand the actual reasoning it encodes, and write continuous paragraphs that walk a reader through *why*, the same way `ride-booking-uber-rapido.md`'s §8 (Deep Dives) does it now — problem stated plainly, why the obvious/naive approach fails (with the doc's own real numbers), how the actual mechanism works, narrated as connected reasoning. Tables survive only as post-explanation reference material (API parameters, a compact entity→storage recap) — never as the primary vehicle carrying the reasoning. `[!NOTE]`/`[!IMPORTANT]` callouts and `**Chosen:**` paragraphs stay as the closing punchline device, but the sentence immediately before one must not restate its content — build up to it, don't say it twice.

- [ ] **Step 4: Content-preservation self-check**, before considering the doc done:
  - Extract every mermaid fence (` ```mermaid `) from the pre-edit version (`git show HEAD:system-design/<file> | grep -c '```mermaid'`) and confirm the same count survives in your rewritten version.
  - For every table you converted to prose, go row-by-row (or entity-by-entity) and confirm every fact/number from that row appears somewhere in your new prose — not just "the section got longer so it's probably fine."
  - For every callout/`**Chosen:**` paragraph, confirm the sentence immediately before it doesn't restate its content (this was the specific defect the pilot's second review round caught — check for it proactively this time instead of discovering it in review).
  - Any sentence in your new prose that states a count of items in another section (e.g. "N requirements were set out in §3") — count the actual rows/items in that section yourself and confirm the number is right.
  - Run `wc -w` before and after as a sanity check for the doc as a whole (not a strict per-section gate — some converted sections may be more concise than their original table once redundant restatement is removed, and that's fine).

- [ ] **Step 5: Rebuild and spot-check.**
  ```bash
  python3 tools/md-site/build.py system-design/ system-design-notes/
  git status --short system-design-notes/
  ```
  Confirm only `system-design-notes/notes/<slug>.html` for this doc changed (the sidebar is client-side/`nav.json`-driven, so no other page should show a diff).

- [ ] **Step 6: Commit**, one commit for the source doc and one for the rebuilt site (matching the pilot's pattern):
  ```bash
  git add system-design/<file>
  git commit -m "$(cat <<'EOF'
  Restructure <file> into a narrative doc

  Follows the 12-section template from docs/superpowers/specs/
  2026-08-02-system-design-narrative-restructure-design.md, applied
  consistently with system-design/ride-booking-uber-rapido.md (the
  pilot). All existing technical content preserved and verified
  (mermaid diagrams, tables converted to prose retain every original
  fact/number); Deep Dives, Data Model, Bottlenecks/Failure/Trade-offs
  rewritten as causal narration per the spec's corrected guidance.

  Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
  EOF
  )"
  git add system-design-notes/notes/<slug>.html
  git commit -m "$(cat <<'EOF'
  Rebuild system-design-notes/ for <file>

  Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
  EOF
  )"
  ```

### Two-stage review (dispatch after every doc's implementer step, same as the pilot)

**Spec compliance reviewer** — independently verify, by reading the actual diff and the actual current file (not trusting the implementer's report): every mermaid diagram count matches pre/post; every fact from a converted table is traceable in the new prose; the 12-section (or 13, if a bonus section exists) order is correct and complete with no duplicate/leftover old headings; no fabricated facts; cross-references (`§N`) point to sections that actually exist under those numbers.

**Code quality reviewer** (`superpowers:code-reviewer`, using the `requesting-code-review` template) — apply a documentation-quality lens: does Deep Dives/Bottlenecks/Trade-offs read as walked-through reasoning or still list-like; is there redundancy between prose and callouts; does the whole doc read as one voice or does it seam between old-unchanged and newly-rewritten parts; would a reader with no system-design background come away understanding *why*, not just *what*.

If either reviewer finds issues, the same subagent (or a fresh fix-dispatch) fixes them and gets re-reviewed — do not proceed to the next doc with unresolved findings, exactly as happened with the pilot's `9.1`/`9.2` heading-level bug and the "Six vs Seven" miscount.

---

## Phase 1 — 3-star docs (highest revision priority)

7 docs. Suggested batching: 3 + 3 + 1 (dispatch/review one doc at a time regardless — batching here is for plan readability and checkpoint pacing, not parallel execution).

### Task 1.1: `system-design/video-streaming-youtube.md`
Grounding fact: "YouTube is a video platform where creators upload videos and viewers watch them globally at any quality. The core challenge is that upload throughput and watch latency are opposing forces — solved with separate, purpose-built pipelines." Structural note: has a stray unnumbered `## 🧠 Mental Model` heading (no "5." prefix) between Non-Functional Requirements and API Design — treat it as old-§5 regardless of the missing number.

### Task 1.2: `system-design/chat-app-whatsapp-web.md`
Grounding fact: "A real-time chat application at WhatsApp scale — 1 billion users, 100 billion messages/day, supporting 1:1 and group messaging, media sharing, and delivery/read status tracking, with zero message loss and sub-300ms end-to-end latency." Structural note: numbering is clean (1-14, matches the pilot's original numbering closely) — this is the most pilot-like doc in Phase 1.

### Task 1.3: `system-design/google-docs.md`
Grounding fact: "Google Docs allows multiple users to edit the same document simultaneously in real time; changes must appear in every other user's browser within 100ms, at billions of documents and millions of concurrent editors, with zero data loss via an immutable operations log." Structural note: numbering is clean (1-14).

**— Checkpoint after Task 1.3: present these 3 completed docs to the user before continuing Phase 1. —**

### Task 1.4: `system-design/notification-system.md`
Grounding fact: "An industry-grade, multi-tenant notification platform that any third-party app (Amazon, Uber, Flipkart) can integrate with to deliver notifications across Email, SMS, and In-App Push." Structural note: has a bonus `## 13. Frontend Notes` section before the (unnumbered) `## Interview Summary` — give it its own slot per Step 2's bonus-section rule. Also has the same unnumbered `## 🧠 Mental Model` quirk as Task 1.1.

### Task 1.5: `system-design/payment-gateway-stripe.md`
Grounding fact: title is "System Design: Payment Gateway (Stripe / Razorpay / PayPal)" — read the doc's own Problem+Scope section directly for the exact scope statement (it wasn't captured cleanly by automated extraction during planning). Structural note: **this whole doc's numbering is offset by one** — it starts at `## 0. Problem + Scope`, so old-§0 through old-§13 map to the same *relative* positions as the pilot's old-§1 through old-§14. Map by position/content, not by literal number.

### Task 1.6: `system-design/rate-limiter.md`
Grounding fact: "A server-side distributed rate limiter that protects backend services by controlling how many requests any given client can make within a configurable time window." Structural note: uses `## 5. System Interface` instead of `## 5. API Design` as a heading name — keep that heading's own name in the new §6 (don't force-rename it to "API Design" if "System Interface" is the more accurate name for a rate limiter's surface). Also has a bonus `## 13. Frontend Notes` section, same rule as Task 1.4.

### Task 1.7: `system-design/autocomplete-typeahead.md`
Grounding fact: "A search autocomplete system (Google-scale) that returns top-K query suggestions as the user types, ranked by relevance, recency, and personalization." Structural note: bonus `## 13. Frontend Notes` section, same rule as Task 1.4/1.6.

**— Phase 1 checkpoint: present all 7 completed docs (or at minimum the 4 since the mid-phase checkpoint) to the user. Wait for explicit go-ahead before starting Phase 2. —**

---

## Phase 2 — 2-star docs

8 docs (11 at this star tier minus 3 excluded Family-B docs: `ecommerce-marketplace-amazon.md`, `instagram-photo-feed.md`, `video-conference-zoom.md`). Suggested batching: 3 + 3 + 2.

### Task 2.1: `system-design/config-driven-shopping-cart-homepage.md`
Grounding fact: "A configurable homepage platform (Amazon/Flipkart-style) where the UI is driven entirely by backend configuration; business teams change layouts 5-10x/week without code deploys; different cohorts/geographies/device types/A-B experiments see different templates; FCP under 1s, LCP under 2.5s, CLS under 0.1." Structural note: numbering is clean (1-14) — closest to the pilot's own structure.

### Task 2.2: `system-design/facebook-social-media-platform.md`
Grounding fact: "A social media platform like Facebook at 500M DAU — sign up, create/share posts (text/image/video), follow, like/comment, and a personalized feed from people the user follows." Structural note: **has a duplicate/forward-referencing heading** — `## 🧠 Mental Model` appears once near the very top (before Problem+Scope even starts) as a preview, then again later as `## 🧠 Mental Model *(see above)*` in its normal position. Treat the *later* occurrence as old-§5 for mapping purposes; the early duplicate is likely meant as a teaser and should be dropped or folded into the new §1/§2 opening rather than kept as a second copy of the same content. Also has a bonus `## Frontend Design (40% of this system)` section before Interview Summary — same bonus-section rule as Phase 1's Frontend Notes docs, but note this one claims to be 40% of the whole design, so don't compress it.

### Task 2.3: `system-design/zomato-food-delivery.md`
Grounding fact: "A food delivery platform connecting customers, restaurants, and delivery partners — restaurant discovery, order placement, payment, real-time GPS tracking; 300 orders/sec peak, 100K GPS writes/sec from drivers, and no order lost after payment succeeds." Structural note: numbering is clean (1-14).

**— Checkpoint after Task 2.3: present these 3 completed docs to the user before continuing Phase 2. —**

### Task 2.4: `system-design/google-drive-dropbox.md`
Grounding fact: "A cloud storage platform (Google Drive / Dropbox) — file upload, download, cross-device sync, folder management, and permissioned sharing, at 50 million DAU storing 10 billion files." Structural note: jumps directly from the unnumbered `## 🧠 Mental Model` to `## 6. API Design` — there is no explicitly-numbered "5." section; treat the Mental Model heading as old-§5 by position.

### Task 2.5: `system-design/trello-issue-manager.md`
Grounding fact: "A real-time collaborative kanban board (Trello/Jira-lite) — multiple users manage boards/lists/cards simultaneously with changes propagating to all active collaborators in real time." Structural note: **the messiest doc in this project.** Has `## 🧠 Core Problem` before Problem+Scope (likely foldable into the new §1/§2 opening, similar to Task 2.2's duplicate), plus THREE extra sections between Non-Functional Requirements and API Design that don't exist in the pilot at all: `## 🧠 Mental Model`, `## ⚡ Event-Driven Model`, `## 🧠 Consistency Model`, and `## 4.5 Permissions & Access Control`. Do not force all of these into the single new §5 (High-Level Architecture) slot — if genuinely distinct, they may need their own bonus-section treatment (Step 2's rule) positioned within/after §5, or merged if they're actually saying the same thing three ways (read all three before deciding — this is exactly the kind of judgment call Step 1 exists for). Also has the bonus `## 13. Frontend Notes` pattern.

### Task 2.6: `system-design/email-delivery-system-gmail.md`
Grounding fact: "An email delivery platform like Gmail — register with a unique address, compose/send with CC/BCC and attachments, receive across domains, and search the mailbox by keyword." Structural note: bonus `## Frontend Notes (10% of design)` section before Interview Summary.

**— Checkpoint after Task 2.6: present these 3 completed docs to the user before continuing Phase 2. —**

### Task 2.7: `system-design/stock-broker-platform-zerodha-groww.md`
Grounding fact: "A stock broker platform like Zerodha/Groww — KYC registration, near-real-time stock prices and historical data, buy/sell orders (market and limit), a watchlist, and portfolio P&L." Structural note: bonus `## Frontend Design (15% of this system — your differentiator)` section before Interview Summary.

### Task 2.8: `system-design/top-k-leaderboard.md`
Grounding fact: "A Top K Leaderboard system ingesting 1M score/view/like events per second, serving a ranked list of top K entities filtered by region and time window in under 100ms." Structural note: has the same early unnumbered `## 🧠 Mental Model` teaser-before-Problem+Scope pattern as Task 2.2/2.5 — fold or drop the duplicate the same way. Also has bonus `## Frontend Notes (10% of design)`.

**— Phase 2 checkpoint: present all 8 completed docs (or at minimum the 6 since mid-phase checkpoints) to the user. Wait for explicit go-ahead before starting Phase 3. —**

---

## Phase 3 — 1-star docs

2 docs (5 at this star tier minus 3 excluded Family-B docs: `photo-grid-google-photos.md`, `bookmyshow-ticket-booking.md`, `travel-booking-airbnb-makemytrip.md`).

### Task 3.1: `system-design/google-calendar-day-view.md`
Grounding fact: "The Google Calendar Day View — a time-grid UI displaying all events for a single day, supporting create/edit/delete via drag/resize/click, recurring events, and real-time updates broadcast to shared-calendar collaborators." Structural note: numbering is clean (1-12, no bonus sections), unnumbered `## 🧠 Mental Model`.

### Task 3.2: `system-design/leetcode-online-judge.md`
Grounding fact: "LeetCode — browse coding problems, write solutions in a browser IDE, submit code for automated judging, compete in timed competitions with a live leaderboard. Hard problems: safe untrusted code execution at scale, and serving a live aggregated ranking to 100K concurrent users without destroying the database." Structural note: bonus `## Frontend Notes (10% of design)` section, and the same missing-"5."-number jump from unnumbered Mental Model directly to `## 6. API Design` as Task 2.4.

**— Phase 3 / project checkpoint: present both completed docs to the user. This is the last phase — after sign-off, all 17 in-scope docs are done. —**

---

## Final Wrap-Up (after Phase 3 sign-off)

- [ ] Confirm all 17 docs' commits are on `master` and pushed (`git log --oneline origin/master..HEAD` should be empty after a final push).
- [ ] Rebuild both sites one last time to confirm a clean, no-diff rebuild:
  ```bash
  python3 tools/md-site/build.py Theory/ theory-notes/
  python3 tools/md-site/build.py system-design/ system-design-notes/
  git status --short
  ```
- [ ] Report the final count to the user: 18 of 25 docs now narrative (pilot + 17), `SystemDesignQuestions.md` excluded (wrong shape), 6 Family-B docs excluded (different genre, noted as future work).
