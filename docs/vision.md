# Seeker: Product Vision

## The problem

Podcast apps funnel everything into a single master queue. Play something new and
whatever you were "up next" on either gets bumped to the bottom or silently
drops out of the queue while lingering in the UI as if it's still there. Worse,
the queue makes no distinction between contexts: an episode about true crime
sits next to an episode about distributed systems, and you're stuck skipping
around to find something that fits your current mood.

Discovery is also stuck in the past. Search is keyword matching against titles
and show names. There's no way to ask for what you actually want ("true crime
shows that focus on the detectives' side of the investigation") and get
episodes that match the idea, not just the words.

## The two pillars

### 1. Multiple, independent queues

Instead of one master queue, users create as many queues as they want (e.g.
"True Crime", "Tech"). Each queue:

- Is created and managed manually by the user.
- Has its own playback state and progress — playing an episode in one queue
  never affects, reorders, or drops anything in another queue.

This lets a listener keep unrelated interests (true crime vs. software
engineering, say) from ever colliding, without losing their place in either.

### 2. Semantic discovery search

Search understands intent, not just keywords. A query like "true crime shows
that focus on the retelling from the police and detectives on the case"
should surface episodes that match that angle, even if none of those exact
words appear in the title or description. This is powered by embeddings over
show/episode metadata (transcripts are a later enhancement — see Non-goals).

Together, these two pillars are the app's identity: **organize how you
listen, and find what you actually want to listen to** — both AI-native in a
way legacy podcast apps aren't.

## MVP scope

**Core differentiators**
- Multiple manually-created queues with fully independent playback state.
- Semantic search over show/episode metadata (titles, descriptions) for
  natural-language discovery.

**Supporting functionality (required to make the above usable)**
- Subscribe to shows, browse episodes.
- Add an episode to a chosen queue.
- Playback with resume position per episode.
- AI-assisted queue routing: an opt-in setting where the app suggests which
  queue a newly added episode belongs in. Suggestion only — the user still
  places it.

## Explicitly out of scope for v1 (v2+)

- Per-queue playback settings (speed, skip-intro, etc.)
- Queue sharing / social features (e.g. exporting a queue as a "starter
  pack")
- Mood- or context-based queue surfacing (commute, workout, bedtime)
- Cross-queue shuffle ("surprise me" pulling from every active queue)
- Per-episode AI summaries ("why you'll like this")
- Transcript-level semantic search (v1 search runs on metadata only; indexing
  full transcripts is a heavier, costlier step for later)

## Non-goals

- Seeker is not trying to be a general podcast directory or the biggest
  catalog — differentiation is in how you organize and find content, not
  catalog size.
- Auto-generated queues (fully automatic, no user confirmation) are
  explicitly not v1. AI assistance stays a suggestion, not a silent action.
