# seeker

A podcast app built around two ideas most podcast apps get wrong: your
listening contexts shouldn't collide, and search should understand what you
mean, not just what you typed.

- **Multiple, independent queues** — instead of one master queue, create as
  many queues as you want (e.g. "True Crime", "Tech"), each with its own
  playback state. Playing an episode in one queue never touches another.
- **Semantic discovery search** — find episodes by describing what you want
  ("true crime shows that focus on the detectives' side of the case"), not
  just by matching keywords in a title.

**North Star:** Seeker exists so that a person's listening life can hold more
than one interest at a time — without any of them getting lost.

## Product docs

- [`docs/vision.md`](docs/vision.md) — the problem statement and MVP scope.
- [`docs/prfaq.md`](docs/prfaq.md) — the working-backwards artifact: launch
  press release, customer FAQ, and the internal FAQ that stress-tests it.
- [`docs/prd.md`](docs/prd.md) — requirements, product invariants, acceptance
  criteria, milestones, and open technical decisions.

## Getting started

Open `seeker.xcodeproj` in Xcode, select an iOS Simulator, and run the **seeker** scheme.
