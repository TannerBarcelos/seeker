# Seeker: Working Backwards (PR/FAQ)

> **What this document is.** The output of a working-backwards session: we
> write the launch announcement *first*, as if the product already shipped,
> then interrogate it with questions until the story either holds up or
> forces us to change the product. Nothing here is a commitment to build —
> it's a commitment to a customer. Requirements derived from it live in
> [`prd.md`](prd.md); the underlying problem statement lives in
> [`vision.md`](vision.md).
>
> **Status:** Draft 1 — approved as the basis for v1 scope.
> **Target launch:** January 2027 (iOS, App Store).

---

## North Star

**Seeker exists so that a person's listening life can hold more than one
interest at a time — without any of them getting lost.**

Everything we build is judged against that sentence. A feature that makes it
easier to keep three unrelated backlogs alive and distinct is on-mission. A
feature that makes the app a better generic podcast player is not, however
good it is.

**North Star metric:** *Weekly Multi-Queue Listeners (WMQL)* — the number of
people who, in a given week, play episodes from **two or more** distinct
queues.

We chose this over listening hours because hours can go up while the product
thesis stays unproven. A user with one queue is using a podcast app. A user
with three live queues is using Seeker. The metric only moves when the thing
we believe is true turns out to be true.

---

## The press release

*(Written as if it's launch day. This is the artifact we work backwards from.)*

---

### Seeker launches an iOS podcast app that finally lets your backlogs coexist

**Every other podcast app has one queue. Seeker has as many as your interests
do — and none of them touch each other.**

**BOISE, ID — January 2027** — Seeker, a new podcast app for iPhone,
launched today on the App Store. It's built for people who don't listen to
one kind of thing: listeners keeping a true crime backlog, a software
engineering backlog, and a history series in progress, all at once, without
any of them interfering.

Podcast apps have converged on a single master queue, and it quietly breaks
for anyone with more than one interest. Start something new and your carefully
ordered "up next" gets bumped, reshuffled, or silently dropped — sometimes
while still appearing in the interface, so you don't find out until you go
looking for it. The result is a listener who stops trusting their own queue and
starts hoarding episodes in a mental list instead.

Seeker replaces the master queue with **independent queues**. You create as
many as you want — "True Crime," "Distributed Systems," "Long Drives" — and
each one keeps its own order and its own place. Playing three episodes out of
one queue does not move, reorder, or remove a single thing in another. Come
back to a queue after two weeks and it is exactly as you left it, down to the
second you stopped at.

Seeker also rethinks how you find episodes worth filing. Instead of matching
keywords against titles, **semantic search** understands what you're
describing. Ask for "true crime that focuses on the detectives' side of the
investigation, not the victims" and Seeker surfaces episodes that match that
angle — including ones whose titles share none of those words.

"I kept losing my place in my own listening," said Tanner Barcelos, who built
Seeker. "I'd line up four episodes about databases, then play one true crime
episode on a drive, and the database queue would be gone — or worse, still
sitting there in the UI while the app had actually forgotten it. I didn't want
a smarter app. I wanted an app that didn't lose things."

Seeker's queues are strictly manual by design. The app can *suggest* which
queue a newly added episode belongs in — an opt-in setting that reads the
episode and proposes a home — but it never files anything on its own. The user
places every episode.

"The promise is that nothing moves unless you move it," Barcelos said. "The
moment an app starts reorganizing your queue for you, you're back to not
trusting it."

Seeker is available today on the App Store for iPhone. Subscribe to shows,
create your first queue, and start listening in under a minute.

---

## Customer FAQ

**What actually makes a queue "independent"?**
Three guarantees. First, order: adding, playing, or finishing an episode in
one queue never reorders another. Second, position: each queue remembers which
episode it was on, independently. Third, membership: nothing leaves a queue
unless you remove it, or unless you've explicitly asked for finished episodes
to be cleared. There is no hidden "up next" that overwrites your queues.

**What happens when an episode finishes?**
By default it's marked played and stays in the queue, visually settled rather
than deleted, and the queue advances to the next episode. You can switch a
queue to auto-remove finished episodes if you'd rather it drain. Nothing is
ever removed silently under the default.

**If the same episode is in two queues, do I have to listen twice?**
No. Progress belongs to the episode, so if you get 20 minutes into it from
your "Tech" queue, it's 20 minutes in from "Long Drives" too. What stays
separate is order, position, and membership — the things that make a queue
*yours*. (See the internal FAQ for why we made this call.)

**Can I reorder episodes?**
Yes. Drag to reorder, and move episodes between queues without losing your
place in either.

**Does semantic search work on transcripts?**
Not in v1. Search runs over show and episode metadata — titles and
descriptions. Transcript-level search is a real improvement and a much heavier
one; it's on the roadmap, not in the first release.

**Will the app ever move my episodes for me?**
No. Optional suggestions, never automatic filing. If you turn the suggestion
setting off, the app makes no inferences about your queues at all.

**Does it work offline?**
Your queues, subscriptions, and playback positions are stored on-device and
work offline. Semantic search requires a connection, since matching happens
server-side.

**Is there an Android version / a web app / a Watch app?**
Not at launch. Seeker is an iPhone app in v1.

---

## Internal FAQ

*(The questions that decide whether the press release above is honest.)*

### On the customer

**Who is this for, specifically?**
The **completionist listener** — someone who treats podcasts as a library
rather than a radio station. They keep backlogs, they finish series in order,
they know where they left off, and they are actively annoyed by apps that
lose that state. They are not necessarily high-volume; they are high-intent.

**Isn't that a small audience?**
Yes, and deliberately. This is a portfolio-scale product, not a land grab. A
narrow customer with a sharp, unmet need produces a coherent app; "any podcast
listener" produces a worse Pocket Casts.

**The vision doc treats queues and semantic search as equal pillars. Does that
survive contact with this customer?**
No, and this is the most important thing the session surfaced. For a
completionist, **queues are the product and search is a feature**. Their pain
is losing state, not failing to find content. We're keeping semantic search in
v1 because it's a genuine differentiator and the second half of the app's
identity — but it is explicitly the *second* pillar, it ships after queues are
solid, and it is not allowed to delay a correct queue implementation. If we
have to cut scope, we cut search depth, never queue integrity.

**What does this customer do today?**
Manual workarounds: multiple podcast apps, playlists-as-queues in Apple
Podcasts, notes files listing "what's next," or simply re-finding episodes
each session. The workaround is the evidence the need is real.

### On the product

**Why is progress global to the episode but order is per-queue?**
Because a listener who filed an episode in two queues did not decide to listen
to it twice. Duplicating progress would create a bug that feels like a bug.
Independence is meaningful at the level of *organization* — order, cursor,
membership — not at the level of the audio itself. This is a reversible
decision; if usage shows people intentionally re-listening per context, we can
move progress to the queue entry.

**Why manual queues instead of auto-generated ones? Isn't AI the point?**
Auto-filing directly attacks the promise. The entire value proposition is
"nothing moves unless you move it" — an app that silently sorts your episodes
is the app we're replacing, with better technology. AI earns its place as a
suggestion the user accepts, which keeps the trust model intact and makes a
wrong suggestion cost one tap instead of one lost backlog.

**What's the riskiest assumption?**
That people will create a second queue at all. The North Star metric is
essentially a bet that multi-queue behavior emerges. If most users create one
queue and stop, the thesis is wrong and the app is a well-built ordinary
podcast player. Mitigation: onboarding that makes the second queue the
*default* outcome — asking for two interests during setup rather than one.

**Second riskiest?**
That semantic search over titles and descriptions isn't actually better than
keyword search. Descriptions are often marketing copy, ad reads, and link
dumps. If embeddings over that text produce mush, the feature underdelivers on
the press release's most quotable claim. Mitigation: evaluate on a fixed set
of ~25 hand-written intent queries with human-judged relevance before
committing to the feature's launch framing — and be willing to describe it
more modestly if the results warrant it.

**What would make us kill semantic search for v1?**
If evaluation shows it losing to keyword search on the intent query set, or if
the indexed corpus needed to make discovery feel real exceeds the cost ceiling
(below). Queues ship either way.

### On scope and cost

**This is a personal project. What's the cost ceiling?**
Under $20/month at portfolio scale. That constraint does real work: it rules
out embedding the entire podcast catalog (millions of shows, tens of millions
of episodes), and pushes us toward a **bounded discovery corpus** — a curated
set of shows plus everything the user subscribes to — indexed once and
refreshed incrementally. The press release promises good discovery, not
exhaustive discovery, and the non-goals in `vision.md` already say catalog
size isn't the differentiator.

**What's explicitly not in v1?**
Per-queue playback settings, queue sharing, mood-based surfacing, cross-queue
shuffle, per-episode AI summaries, and transcript search — as listed in
`vision.md`. Added by this session: no Android, no web, no Watch app, no
cross-device sync, and no social layer.

**Is cross-device sync really cuttable?**
For v1, yes — single device, local-first. It's the first thing to reconsider
post-launch, because "my queue is exactly where I left it" is a promise that
gets stronger, not weaker, across devices.

**How do we know when we're done?**
When a new user can subscribe to shows, build two distinct queues, listen from
both across several days, and return to find both exactly as they left them —
and when the North Star metric can actually be measured. See the milestones
and acceptance criteria in [`prd.md`](prd.md).
