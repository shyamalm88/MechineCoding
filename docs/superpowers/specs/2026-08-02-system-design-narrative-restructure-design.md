# System Design Docs — Narrative Restructure

## Goal

The 25 docs in `system-design/*.md` are structurally consistent but read as a
dense reference/crib-sheet: correct, senior-level technical content (real
Redis command sequences, WATCH/MULTI/EXEC race-condition walkthroughs,
WebSocket-vs-HTTP bandwidth math, trade-off tables, failure-scenario tables)
organized by *category* rather than by *reading order toward understanding*.
A reader with no prior context on the domain can't follow one start-to-finish
and come out understanding the whole system — the docs assume the reader
already knows what Redis Geo/Kafka/WATCH-EXEC are before explaining why
you'd reach for them.

Restructure each doc into a narrative shape modeled on Grokking System
Design's chapter style (`grokking-system-design/chapters/30-design-uber.html`,
read in full) — workflow-first, requirements explained in terms of user
impact, Socratic checkpoint questions, an explicit close that checks the
design against every requirement it opened with — **without losing any of
the existing technical depth**. Nothing gets deleted; content gets
resequenced, reframed, and has narrative connective tissue added around it.

## Non-Goals

- Not splitting each system into multiple linked pages (Grokking's actual
  multi-lesson-page structure). Confirmed with the user: stay one `.md` file
  per system, reordered internally. No sidebar/`nav.json`/site-structure
  changes required by this project — the one exception is a single-line
  addition to `tools/md-site/build.py`'s markdown extensions list (enabling
  `md_in_html`, see the Points-to-Ponder note below), which is a markdown
  *rendering* fix, not a structural change.
- Not fabricating specific real-world statistics, company facts, or claims
  about how the real Uber/Stripe/Zerodha/etc. actually operates. Grokking's
  chapter cites a real Statista chart and a real "Uber migrated to Cloud
  Spanner" fact — those came from real research the user's docs don't have
  and this project shouldn't invent. "What Is X" sections stay at the
  product-description level (what the app does, who uses it) using only
  facts already implied by the existing doc content, not new unverifiable
  claims.
- Not touching `CLAUDE.md`'s stale "10-section template" description as
  part of this work (confirmed during exploration that the real template is
  the ~14-section one seen in every doc, not what `CLAUDE.md` currently
  says) — worth a follow-up note but out of scope here.
- Not rewriting `system-design-notes/` (generated output) by hand — it stays
  a `tools/md-site/build.py` rebuild target as usual, done after each doc
  edit.

## The New Template

Applied uniformly to all 25 docs. Old section numbers refer to the current
template (confirmed identical across a sample of 4 docs spanning different
categories: `ride-booking-uber-rapido.md`, `config-driven-shopping-cart-homepage.md`,
`google-calendar-day-view.md`, `notification-system.md`,
`autocomplete-typeahead.md`).

1. **What Is [System]?** — *NEW.* 2-4 plain-English sentences: what the
   product does, who uses it. Zero jargon, zero invented stats.
2. **A Day in the Life** — *NEW, rewritten from existing old-§7 material.*
   A pure user-facing story (a named persona taking the app's core action),
   zero backend vocabulary. This becomes the anchor every later section
   calls back to.
3. **Requirements — and Why They Matter** — *old §3+§4, reframed.* Same
   functional/non-functional lists, each non-functional requirement gets a
   one-line user-impact justification. Include 1-2 **Points to Ponder**
   checkpoint questions at natural decision forks (e.g. "what happens if two
   drivers are equidistant?") with the answer revealed via existing doc
   content (mined from Deep Dives/Trade-offs, never invented fresh) —
   `<details markdown="1"><summary>` collapsible in the rendered HTML,
   matching how `tools/md-site` already renders `<details>` for sidebar
   categories. **Verified via a throwaway script against the real
   `convert_markdown()`:** plain `<details>` passes through fine for
   plain-text answers, but inline markdown (bold, inline code) inside the
   block is left unprocessed unless the `md_in_html` extension is enabled —
   it currently isn't (`convert_markdown()` only enables `fenced_code`,
   `tables`, `toc`, `attr_list`). Confirmed `md_in_html` fixes it cleanly
   with no observed side effects on the existing extensions. **Implementation
   note:** add `md_in_html` to the extensions list in
   `tools/md-site/build.py::convert_markdown()` as the first step of Phase 0,
   then rerun the full `tools/md-site` test suite and rebuild both sites to
   confirm no regressions before writing any doc content.
4. **Scale, From First Principles** — *old §2, reframed as a walkthrough.*
   Same real numbers, shown as reasoning: assumption → formula → what it
   implies for the architecture, instead of a pre-computed block.
5. **High-Level Architecture** — *merge of old §5 (Mental Model) + old §8.*
   Same diagrams, each component introduced as solving a problem surfaced in
   the user journey. 1-2 more Points to Ponder at key architectural forks.
6. **API Design** — *old §6, unchanged.*
7. **Data Model** — *old §9, reframed.* Storage/technology selection
   narrated as prose reasoning first ("this store must satisfy X, Y →
   therefore Postgres/Cassandra/Redis"), *then* the existing table.
8. **Deep Dives** — *old §10, content unchanged* (already matches Grokking's
   "naive solution fails → chosen solution" arc — verified against the
   actual chapter text, not assumed). One deep dive per doc — whichever is
   the system's hardest domain-specific cross-cutting concern (fraud/payment
   for Uber-style docs; may be encryption for a chat app, adaptive bitrate
   for video streaming, order-matching for a stock broker, etc. — a
   per-doc judgment call made during restructuring, not decided up front)
   gets expanded to full standalone-lesson treatment: what it does, what to
   prevent/guard against, its own components, its own plain-English
   workflow, the chosen mechanism explained step by step.
9. **Bottlenecks, Failure Scenarios, Trade-offs** — *old §11-13, unchanged.* Failure Scenarios and Trade-offs render as `###` (h3) subsections nested under this section's `##` (h2) heading — matching the `8.1`/`8.2`/`8.3` precedent in Deep Dives, not siblings at the same heading level as §9 itself (a mismatch caught in the pilot's code-quality review).
10. **Evaluation: Did We Meet the Requirements?** — *NEW.* A prose
    paragraph per non-functional requirement from section 3, explaining the
    actual mechanism that satisfies it (not just restating the requirement),
    followed by a compact summary table (Requirement → Technique).
11. **Conclusion** — *NEW.* A short paragraph recapping the chapter's arc
    (what was designed, the hardest problems solved) — distinct from the
    Interview Summary, which stays a fast-recall cram sheet, not a narrative
    recap.
12. **Interview Summary** — *old §14, unchanged*, repositioned as the bonus
    recall sheet after a reader has already understood the system
    narratively, not the only thing on offer.

## Content-Preservation Guarantee

Every old section maps to a specific new section above — there is no old
content without a destination. During restructuring, verify per doc:

- Every mermaid diagram, code block, and table from the original survives
  somewhere in the new version (spot-checked by extracting fenced blocks
  before/after and confirming the same count and content, not just eyeballing
  prose).
- New word count is *higher* than the original (new sections are additive;
  a shrink would indicate accidental content loss, not tightening).
- The five genuinely new elements (intro, user-journey rewrite, Points to
  Ponder, Evaluation, Conclusion) are the only wholly-new prose — everything
  else is existing content moved and given connective sentences.
- Any sentence stating a count of items in another section (e.g. "N requirements were set out in §3") has that count verified against the actual number of rows/items in the referenced section before the doc is considered done — this class of error isn't caught by the word-count or mermaid-count checks above.

## Rollout

**Phase 0 (this spec):** Pilot on `ride-booking-uber-rapido.md` — the doc
already picked apart in conversation. User reviews the actual before/after
result, not just this template description, before the remaining 24 proceed.

**Phase 1+ (after pilot sign-off):** Remaining 24 docs, ordered by existing
`site.config.json` star rating (3-star docs first, since those are already
flagged as highest revision priority) — detailed phasing is for the
implementation plan (`writing-plans` skill), not this spec.

After each doc (or each batch), rebuild `system-design-notes/`:
```bash
python3 tools/md-site/build.py system-design/ system-design-notes/
```
and spot-check the rebuilt page renders (headings, mermaid diagrams,
`<details>` checkpoints) without errors.

## Testing / Verification

No code is being written — verification is:
1. Content-preservation checklist above, per doc.
2. `tools/md-site` rebuild completes without error after each doc/batch.
3. A quick browser check (already have a working local Playwright/Chromium
   setup in this environment from prior verification work this session) on
   at least the pilot doc, confirming `<details>` Points-to-Ponder render
   and collapse correctly and mermaid diagrams still render.
