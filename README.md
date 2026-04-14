# Seeker

A next-generation podcast app built with React Native (Expo) featuring the signature **multi-queue** system — because your true crime obsession and your morning tech deep-dives shouldn't have to share a queue.

---

## The Problem

Every podcast app gives you one queue. You start listening to a Lex Fridman episode, then randomly play a Serial episode, and suddenly your entire tech queue is gone. You've lost your place. You start rebuilding it from scratch. Again.

Seeker solves this with **named, independent queues** that each maintain their own episode list and playback position. Switching between categories never disrupts another.

---

## Features

### Multi-Queue Listening
- Create unlimited named queues (e.g. "Tech & Science", "True Crime", "Morning Commute")
- Each queue tracks its own episodes and playback position independently
- Set one queue as **active** — the one you're currently building up
- Long-press any episode anywhere in the app to add it to a specific queue
- Switch between queues freely; your spot in every other queue is preserved

### Discover
- Featured shows displayed with rich gradient artwork
- Trending episodes across all categories
- One tap to play, long-press to queue

### Full-Featured Player
- Full-screen player modal with gradient backgrounds derived from the show's color
- Skip back 15s / forward 30s
- Progress bar with real-time position and remaining time
- "Up Next" list showing what's coming in the current queue
- Persistent mini-player floating above the tab bar whenever something is playing

### Search
- Full-text search across all podcasts and episodes
- Category browsing (Technology, True Crime, Science, News, Business, History, Comedy)

### Library
- At-a-glance stats: queues, queued episodes, subscribed shows
- All your subscribed shows in one place
- Quick view of all your queues with episode counts

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Expo](https://expo.dev) (React Native) |
| Navigation | [Expo Router](https://expo.github.io/router) (file-based) |
| State | React Context + AsyncStorage |
| Animations | [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) |
| Gestures | React Native Gesture Handler |
| Icons | [@expo/vector-icons](https://icons.expo.fyi) (Ionicons, Feather) |
| Fonts | Inter via @expo-google-fonts |
| Gradients | expo-linear-gradient |
| Tab Bar | NativeTabs (Liquid Glass on iOS 26+) with BlurView fallback |
| Monorepo | pnpm workspaces |

---

## Project Structure

```
artifacts/queuecast/
├── app/
│   ├── _layout.tsx          # Root layout — providers, Stack config
│   ├── player.tsx           # Full-screen player modal
│   └── (tabs)/
│       ├── _layout.tsx      # Tab bar (NativeTabs / ClassicTabs + MiniPlayer)
│       ├── index.tsx        # Discover screen
│       ├── queues.tsx       # Multi-queue manager
│       ├── library.tsx      # Library screen
│       └── search.tsx       # Search screen
├── components/
│   ├── MiniPlayer.tsx       # Persistent mini-player above tab bar
│   ├── EpisodeRow.tsx       # Episode list item with play/queue actions
│   ├── PodcastCard.tsx      # Podcast grid card
│   ├── PodcastArtwork.tsx   # Gradient artwork with headset icon
│   ├── AddToQueueSheet.tsx  # Bottom sheet for adding to a specific queue
│   └── ErrorBoundary.tsx    # App-level error boundary
├── context/
│   ├── PlayerContext.tsx    # Playback state, progress timer, skip controls
│   └── QueuesContext.tsx    # Queue CRUD, AsyncStorage persistence
├── constants/
│   ├── colors.ts            # Deep navy dark theme tokens
│   └── mockData.ts          # 8 podcasts, 16 episodes, utility formatters
└── hooks/
    └── useColors.ts         # Theme-aware color hook
```

---

## Design

Seeker uses a deep navy dark theme inspired by premium audio apps:

| Token | Value | Use |
|---|---|---|
| Background | `#0D1117` | App background |
| Card | `#161B22` | Episode rows, cards |
| Primary | `#58A6FF` | Active states, links |
| Foreground | `#E6EDF3` | Primary text |
| Muted | `#8B949E` | Secondary text, timestamps |
| Border | `#30363D` | Dividers, card borders |

Each queue gets its own accent color from a curated palette. The full-screen player derives its gradient from the podcast's artwork colors, making every show feel distinct.

**iOS 26+ users** get the native Liquid Glass tab bar via `expo-router/unstable-native-tabs`. Everyone else gets a frosted glass BlurView fallback.

---

## Getting Started

### Prerequisites
- Node.js 24+
- pnpm 9+
- Expo Go app on your phone (for device testing)

### Install & Run

```bash
# Install dependencies
pnpm install

# Start the Expo dev server
pnpm --filter @workspace/queuecast run dev
```

Then:
- **Phone**: Scan the QR code with Expo Go
- **Web**: Open the printed localhost URL in your browser

### Also start the API server (if needed)

```bash
pnpm --filter @workspace/api-server run dev
```

---

## Queues: How They Work

```
User creates queues:
  "Tech & Science"  [Huberman ep1, Lex ep1, Huberman ep2, ...]  position: 0
  "True Crime"      [Serial ep1, Crime Junkie ep1, Serial ep2]  position: 1
  "Daily Mix"       [The Daily ep1, How I Built This ep1, ...]  position: 0

User plays from "Tech & Science" queue → position advances
User switches to "True Crime" → "Tech & Science" position is saved
User plays from "True Crime" → continues from where they left off
Switching back to "Tech" → picks up exactly where it was
```

Queues and their state are persisted to AsyncStorage so they survive app restarts.

---

## Roadmap

- [ ] Real podcast RSS feed integration (iTunes Search API)
- [ ] Actual audio playback via expo-av
- [ ] Playback speed control (0.5x – 3x)
- [ ] Sleep timer
- [ ] Chapter markers
- [ ] Cross-device sync via backend
- [ ] Push notifications for new episodes
- [ ] Download for offline playback

---

## Publishing

Seeker targets iOS via **Expo Launch** (Replit's built-in App Store publishing). Click the **Publish** button in Replit to trigger the production build and App Store submission.

Android support is planned for a future release.

---

## License

MIT
