# Seeker: Product Requirements Document (v1)

**Status:** Draft 1 · **Owner:** Tanner Barcelos · **Target:** January 2027 ·
**Platform:** iOS 17+ (iPhone)

**Companion documents:** [`vision.md`](vision.md) (problem statement) ·
[`prfaq.md`](prfaq.md) (working-backwards press release and FAQ)

---

## 1. North Star

> **Seeker exists so that a person's listening life can hold more than one
> interest at a time — without any of them getting lost.**

### North Star metric

**Weekly Multi-Queue Listeners (WMQL):** users who play episodes from **two or
more distinct queues** within a rolling 7-day window.

This metric is deliberately unforgiving. It does not move when someone uses
Seeker as an ordinary podcast player, only when they use it as Seeker. It is
the operational form of the thesis.

### Input metrics (the ladder)

| Stage | Metric | Why it matters |
|---|---|---|
| Activate | % of new users with ≥2 queues within 7 days | The thesis cannot start without a second queue |
| Fill | Median episodes per queue, 7 days after creation | An empty queue is a queue that will never be played |
| Return | % of queues played again ≥3 days after last play | Proves state preservation has felt value |
| Discover | % of searches ending in an add-to-queue | Whether semantic search feeds the queues |
| Sustain | Week-4 retention | Long-term health |

### Guardrail / counter-metrics

- **Queue sprawl:** queues created but never played within 14 days. High
  sprawl means we're gaming WMQL with onboarding pressure instead of earning it.
- **Silent-loss incidents:** any detected case of a queue changing without a
  corresponding user action. Target: zero. This is a correctness bug, not a
  metric regression.
- **Search abandonment:** searches with no result opened.
- **Monthly infrastructure cost.** Ceiling: $20/month.

---

## 2. Customer

**Primary persona — the completionist listener.** Treats podcasts as a library:
maintains backlogs, finishes series in order, and knows exactly where they left
off. Follows 8–25 shows across genuinely unrelated subjects. Their pain is not
finding content — it's *losing state*. They currently work around it with
multiple apps, playlists-as-queues, or notes files.

**Explicit non-target for v1:** the casual single-show listener and the "just
play me something" radio-mode listener. Both are well served by existing apps
and would pull the product toward the generic middle.

**Priority consequence.** For this persona, **queues are the product; semantic
search is a feature.** Queue integrity work always outranks search work. If
scope must be cut, search depth is cut first and queue correctness never is.

---

## 3. The core promise (product invariants)

These are not features. They are properties the app must never violate, and
any one of them failing is a P0 bug regardless of what else works.

1. **Isolation.** An action in queue A never changes the contents, order, or
   position of queue B.
2. **No silent mutation.** Nothing is added to, removed from, or reordered
   within a queue except by direct user action or an explicit, user-enabled
   setting.
3. **Durable position.** A queue's position and each episode's resume
   timestamp survive app termination, device restart, and arbitrary time away.
4. **Truthful UI.** What's displayed is what's stored. The app never shows an
   episode in a queue it no longer belongs to.
5. **Reversible AI.** Every AI-driven action is a suggestion the user accepts
   or declines. Declining costs one tap. Nothing files itself.

---

## 4. Data model (conceptual)

| Entity | Key fields | Notes |
|---|---|---|
| `Show` | feedURL, title, author, artwork, description | From catalog provider; refreshed on demand |
| `Episode` | guid, showID, title, description, audioURL, duration, publishedAt | Unique per feed guid |
| `PlaybackState` | episodeID, positionSeconds, isPlayed, lastPlayedAt | **One per episode, global** — see decision D1 |
| `Queue` | id, name, sortIndex, autoRemovePlayed | User-created; no system-owned queue exists |
| `QueueEntry` | queueID, episodeID, position, addedAt | Ordering lives here |
| `QueueCursor` | queueID, currentEntryID | **Per queue** — the independence mechanism |

**Decision D1 — progress is global to the episode; order and position are per
queue.** If the same episode sits in two queues, listening from one advances it
in both. Independence is meaningful at the level of organization, not audio.
Reversible: if usage shows deliberate per-context re-listening, `PlaybackState`
moves to `QueueEntry`.

---

## 5. Requirements

Priority: **P0** = required to ship v1 · **P1** = ship if it doesn't delay P0 ·
**P2** = post-v1.

### 5.1 Subscriptions and catalog

| ID | Requirement | Pri |
|---|---|---|
| SUB-1 | Search the catalog by show name or author and view results | P0 |
| SUB-2 | Subscribe / unsubscribe to a show | P0 |
| SUB-3 | View a show's episode list, newest first, with played state | P0 |
| SUB-4 | Refresh subscribed feeds on app foreground and pull-to-refresh | P0 |
| SUB-5 | Unsubscribing does **not** remove that show's episodes from queues | P0 |
| SUB-6 | Import subscriptions via OPML | P2 |

### 5.2 Queues — the core

| ID | Requirement | Pri |
|---|---|---|
| Q-1 | Create, rename, reorder, and delete queues; no cap below 20 | P0 |
| Q-2 | Add an episode to a specific, user-chosen queue | P0 |
| Q-3 | Add one episode to multiple queues | P0 |
| Q-4 | Reorder episodes within a queue by drag | P0 |
| Q-5 | Remove an episode from a queue without affecting other queues | P0 |
| Q-6 | Move an episode between queues, preserving resume position | P0 |
| Q-7 | Each queue maintains its own cursor, persisted across launches | P0 |
| Q-8 | Deleting a queue requires confirmation and names what's inside | P0 |
| Q-9 | Per-queue setting: keep played episodes (default) or auto-remove | P0 |
| Q-10 | Queue list shows episode count and total remaining time | P1 |
| Q-11 | Undo for destructive queue actions (remove, delete, clear) | P1 |
| Q-12 | Per-queue playback settings (speed, skip intro) | P2 |
| Q-13 | Queue sharing / export | P2 |

### 5.3 Playback

| ID | Requirement | Pri |
|---|---|---|
| PLAY-1 | Stream an episode with play/pause, scrub, ±30s/15s skip | P0 |
| PLAY-2 | Persist resume position continuously; resume on replay | P0 |
| PLAY-3 | Background audio, lock screen and Control Center controls | P0 |
| PLAY-4 | On finish: mark played, advance that queue's cursor only | P0 |
| PLAY-5 | Playing an episode outside any queue never mutates a queue | P0 |
| PLAY-6 | Variable playback speed (global setting) | P1 |
| PLAY-7 | Download for offline playback | P1 |
| PLAY-8 | Sleep timer, chapters, CarPlay | P2 |

### 5.4 Semantic search

| ID | Requirement | Pri |
|---|---|---|
| SRCH-1 | Natural-language query returns ranked episodes by semantic match | P0 |
| SRCH-2 | Search runs over show + episode titles and descriptions | P0 |
| SRCH-3 | Results are addable to any queue directly from the result row | P0 |
| SRCH-4 | Results show why they matched (show, date, snippet) | P0 |
| SRCH-5 | Graceful degradation to keyword search when offline or on error | P0 |
| SRCH-6 | p95 latency under 1.5s on a warm connection | P0 |
| SRCH-7 | Scope toggle: my subscriptions vs. discover everything | P1 |
| SRCH-8 | Transcript-level indexing | P2 |

### 5.5 AI queue routing (opt-in)

| ID | Requirement | Pri |
|---|---|---|
| AI-1 | Off by default; a single setting enables it | P0 |
| AI-2 | When adding an episode, suggest the most likely queue | P0 |
| AI-3 | Suggestion is a preselection the user confirms — never an auto-file | P0 |
| AI-4 | Dismissing a suggestion is one tap and is remembered as signal | P1 |
| AI-5 | With the setting off, no episode content leaves the device for routing | P0 |

### 5.6 Onboarding

| ID | Requirement | Pri |
|---|---|---|
| ON-1 | First run asks for **two or more** interests and creates a queue for each | P0 |
| ON-2 | Suggest shows per stated interest so each queue starts non-empty | P0 |
| ON-3 | Reach "first episode playing" in under 60 seconds | P0 |

ON-1 exists because of the riskiest assumption in the internal FAQ: the second
queue must be the default outcome of setup, not a discovery the user makes
later.

---

## 6. Acceptance criteria for the core promise

These are the tests that decide whether v1 is real. Each maps to an invariant
in §3 and should exist as an automated test.

1. **Isolation under play.** Given queues A (3 episodes) and B (3 episodes),
   play all of A to completion. B's contents, order, and cursor are byte-identical
   to before.
2. **Isolation under mutation.** Adding, reordering, and removing episodes in A
   produces no change to B.
3. **Cold-start durability.** Set distinct cursors and mid-episode positions in
   three queues, force-quit, reboot the device, relaunch: all three restore
   exactly, to the second.
4. **Shared episode, shared progress.** An episode in A and B, played to 20:00
   from A, opens at 20:00 from B — while A and B keep separate order and cursor.
5. **Out-of-queue playback.** Playing an episode from a show page with no queue
   involvement leaves every queue untouched.
6. **No silent removal.** With the default keep-played setting, a finished
   episode is still present in the queue, marked played, cursor advanced by one.
7. **UI truthfulness.** No code path removes an entry from storage without the
   corresponding view updating in the same transaction.
8. **AI is inert when off.** With routing disabled, no network request carries
   episode content for classification.

**Search quality gate (SRCH-1).** Before launch, evaluate against a fixed set
of ~25 hand-written intent queries with human-judged relevance. Semantic search
must beat keyword baseline on precision@10 on a clear majority of them. If it
doesn't, either the corpus or the framing changes — the launch claim gets
adjusted rather than overstated.

---

## 7. Milestones

Ordered so that the differentiator is proven before anything is decorated.

- **M0 — Foundation.** Data model, persistence, catalog integration, subscribe
  and browse. *Exit:* subscribe to a show and see its episodes.
- **M1 — Queues.** Full queue CRUD, ordering, membership, per-queue cursors.
  *Exit:* acceptance criteria 1, 2, 5, 6, 7 pass.
- **M2 — Playback.** AVPlayer integration, background audio, remote controls,
  durable resume. *Exit:* criteria 3 and 4 pass; a real week of personal use
  loses nothing.
- **M3 — Semantic search.** Corpus indexing, embedding pipeline, query path,
  keyword fallback. *Exit:* search quality gate passes.
- **M4 — AI routing + onboarding.** Suggestion flow, opt-in setting,
  two-interest onboarding. *Exit:* criterion 8 passes; a new user reaches two
  populated queues in under 60 seconds.
- **M5 — Launch readiness.** Instrumentation for the metric ladder, empty
  states, error handling, App Store submission.

M1 and M2 are the product. M3 and M4 are what make it Seeker rather than a
well-behaved player — but they are built on top of something that already works.

---

## 8. Technical direction and open decisions

Recommendations, not commitments. Each is a decision to make before its
milestone, not now.

| # | Decision | Recommendation | Open question |
|---|---|---|---|
| T1 | Catalog source | Podcast Index API — open, free, no licensing friction; iTunes Search API as fallback for artwork/metadata gaps | Coverage quality on niche shows |
| T2 | Persistence | SwiftData, local-first, with explicit transactional writes for queue mutations | Migration story if sync is added later |
| T3 | Audio | AVPlayer + `MPNowPlayingInfoCenter` / `MPRemoteCommandCenter`; background audio capability | Position-write frequency vs. battery |
| T4 | Embeddings + vector search | Supabase with pgvector; batch-embed a **bounded corpus**, refresh incrementally | Which embedding model, at what dimension and cost |
| T5 | Corpus scope | All subscribed shows' episodes + a curated discovery set (target ~5–10k shows, recent episodes only) | Is a bounded corpus enough for discovery to feel real? |
| T6 | Query path | Client → serverless function → embed query → pgvector ANN search → ranked results | Cache common queries to stay under the cost ceiling |
| T7 | AI routing | Reuse the episode embedding; nearest-centroid against each queue's existing episodes — no LLM call needed | Cold start: a queue with 0–1 episodes has no usable centroid |
| T8 | Analytics | Local-first event log, minimal and privacy-preserving; enough to compute the ladder in §1 | Does WMQL need any server-side aggregation at all? |

**T5 is the load-bearing one.** The whole cost ceiling rests on refusing to
index the entire podcast catalog. If a bounded corpus makes discovery feel thin,
the honest response is to narrow the *claim* — position search as "find the
right episode among shows worth knowing about" — rather than to blow the budget.

---

## 9. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Users create one queue and stop | Fatal to the thesis | ON-1 makes two queues the default outcome of onboarding; queue-sprawl guardrail keeps us honest about whether they're real |
| Descriptions are too noisy to embed well (ad reads, link dumps, boilerplate) | Search underdelivers on the loudest launch claim | Strip boilerplate before embedding; enforce the quality gate in §6; be willing to soften the claim |
| Bounded corpus makes discovery feel thin | Weakens the second pillar | Scope toggle (SRCH-7) so subscription search — which is always complete — carries the experience |
| A queue-corruption bug ships | Destroys the one promise the product makes | Invariants in §3 as automated tests, run on every change; treat any violation as P0 |
| Scope creep toward "a better general podcast app" | Product loses its identity | Anything not serving the North Star sentence is P2 by default |
| Solo-developer bandwidth | Slipped launch | Milestones ordered so M1+M2 alone are a usable, shippable app |

---

## 10. Out of scope for v1

From [`vision.md`](vision.md): per-queue playback settings, queue sharing and
social features, mood- or context-based queue surfacing, cross-queue shuffle,
per-episode AI summaries, transcript-level search, and fully automatic queue
generation.

Added by this working-backwards session: Android, web, and Apple Watch apps;
cross-device sync; accounts and cloud backup; any social layer.

**First candidate to reconsider post-launch:** cross-device sync. "Your queue is
exactly where you left it" is a promise that gets stronger across devices, not
weaker — but it requires accounts and conflict resolution, which is a second
product's worth of work.
