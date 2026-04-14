export interface Episode {
  id: string;
  title: string;
  podcastId: string;
  podcastTitle: string;
  artworkColors: [string, string];
  duration: number;
  publishDate: string;
  description: string;
}

export interface Podcast {
  id: string;
  title: string;
  author: string;
  artworkColors: [string, string];
  category: string;
  description: string;
  episodeIds: string[];
}

export const EPISODES: Record<string, Episode> = {
  "ep-hub-1": {
    id: "ep-hub-1",
    title: "The Science of Sleep & Neuroplasticity",
    podcastId: "pod-huberman",
    podcastTitle: "Huberman Lab",
    artworkColors: ["#0a3d2e", "#1a7a5e"],
    duration: 5400,
    publishDate: "Apr 8, 2026",
    description: "Dr. Andrew Huberman explores the neuroscience of sleep and how to optimize it for peak performance.",
  },
  "ep-hub-2": {
    id: "ep-hub-2",
    title: "Optimizing Dopamine for Motivation",
    podcastId: "pod-huberman",
    podcastTitle: "Huberman Lab",
    artworkColors: ["#0a3d2e", "#1a7a5e"],
    duration: 6300,
    publishDate: "Apr 1, 2026",
    description: "A deep dive into the dopamine system and how to leverage it for sustained motivation and focus.",
  },
  "ep-hub-3": {
    id: "ep-hub-3",
    title: "Cold Exposure & The Immune System",
    podcastId: "pod-huberman",
    podcastTitle: "Huberman Lab",
    artworkColors: ["#0a3d2e", "#1a7a5e"],
    duration: 4800,
    publishDate: "Mar 25, 2026",
    description: "The science behind deliberate cold exposure and its effects on the immune system and resilience.",
  },
  "ep-lex-1": {
    id: "ep-lex-1",
    title: "Sam Altman: OpenAI, AGI & the Future",
    podcastId: "pod-lex",
    podcastTitle: "Lex Fridman Podcast",
    artworkColors: ["#0d1b2a", "#1a3a5c"],
    duration: 9000,
    publishDate: "Apr 10, 2026",
    description: "Sam Altman and Lex discuss the progress toward AGI, safety challenges, and what comes next.",
  },
  "ep-lex-2": {
    id: "ep-lex-2",
    title: "Elon Musk: Mars, AI & Physics",
    podcastId: "pod-lex",
    podcastTitle: "Lex Fridman Podcast",
    artworkColors: ["#0d1b2a", "#1a3a5c"],
    duration: 11400,
    publishDate: "Apr 3, 2026",
    description: "A wide-ranging conversation about SpaceX, Neuralink, and the future of human civilization.",
  },
  "ep-lex-3": {
    id: "ep-lex-3",
    title: "Jeff Dean: Google DeepMind",
    podcastId: "pod-lex",
    podcastTitle: "Lex Fridman Podcast",
    artworkColors: ["#0d1b2a", "#1a3a5c"],
    duration: 7800,
    publishDate: "Mar 27, 2026",
    description: "Google's Chief Scientist on large-scale ML systems, scientific discovery, and AI's trajectory.",
  },
  "ep-serial-1": {
    id: "ep-serial-1",
    title: "S03 E01: A Bar Fight Walks Into Court",
    podcastId: "pod-serial",
    podcastTitle: "Serial",
    artworkColors: ["#1a0a2e", "#4a2080"],
    duration: 3600,
    publishDate: "Apr 5, 2026",
    description: "Sarah Koenig takes us inside a Cleveland courthouse for a year, watching ordinary criminal cases.",
  },
  "ep-serial-2": {
    id: "ep-serial-2",
    title: "S03 E02: Pleas Baby Pleas",
    podcastId: "pod-serial",
    podcastTitle: "Serial",
    artworkColors: ["#1a0a2e", "#4a2080"],
    duration: 4200,
    publishDate: "Mar 29, 2026",
    description: "The majority of criminal cases end in plea deals. We look at three of them.",
  },
  "ep-cj-1": {
    id: "ep-cj-1",
    title: "CASE 247: The Unfound Ones",
    podcastId: "pod-crimejunkie",
    podcastTitle: "Crime Junkie",
    artworkColors: ["#2a0a0a", "#7a1f1f"],
    duration: 2700,
    publishDate: "Apr 7, 2026",
    description: "Investigative deep dive into a series of cold cases that share a disturbing common thread.",
  },
  "ep-cj-2": {
    id: "ep-cj-2",
    title: "CASE 248: Whisper Network",
    podcastId: "pod-crimejunkie",
    podcastTitle: "Crime Junkie",
    artworkColors: ["#2a0a0a", "#7a1f1f"],
    duration: 3000,
    publishDate: "Mar 31, 2026",
    description: "A small town's worst-kept secret finally breaks open after two decades of silence.",
  },
  "ep-daily-1": {
    id: "ep-daily-1",
    title: "The State of Global AI Regulation",
    podcastId: "pod-daily",
    podcastTitle: "The Daily",
    artworkColors: ["#0a1628", "#1e3a5f"],
    duration: 1800,
    publishDate: "Apr 14, 2026",
    description: "How governments around the world are grappling with the rapid pace of AI development.",
  },
  "ep-daily-2": {
    id: "ep-daily-2",
    title: "Housing Crisis: A New Approach",
    podcastId: "pod-daily",
    podcastTitle: "The Daily",
    artworkColors: ["#0a1628", "#1e3a5f"],
    duration: 1980,
    publishDate: "Apr 13, 2026",
    description: "Cities are trying radical new policies to address the affordable housing shortage.",
  },
  "ep-hibt-1": {
    id: "ep-hibt-1",
    title: "Airbnb: Brian Chesky",
    podcastId: "pod-hibt",
    podcastTitle: "How I Built This",
    artworkColors: ["#2a1500", "#7a3d00"],
    duration: 4500,
    publishDate: "Apr 9, 2026",
    description: "Brian Chesky tells the story of how Airbnb survived near-death and became a global phenomenon.",
  },
  "ep-hibt-2": {
    id: "ep-hibt-2",
    title: "Glossier: Emily Weiss",
    podcastId: "pod-hibt",
    podcastTitle: "How I Built This",
    artworkColors: ["#2a1500", "#7a3d00"],
    duration: 3900,
    publishDate: "Apr 2, 2026",
    description: "How a beauty blog became one of the most disruptive brands in the industry.",
  },
  "ep-hh-1": {
    id: "ep-hh-1",
    title: "Wrath of the Khans I",
    podcastId: "pod-hardcore",
    podcastTitle: "Hardcore History",
    artworkColors: ["#1a1a1a", "#444444"],
    duration: 18000,
    publishDate: "Jan 1, 2026",
    description: "Dan Carlin explores the devastating and awe-inspiring story of the Mongol Empire.",
  },
  "ep-conan-1": {
    id: "ep-conan-1",
    title: "Bill Hader Breaks Character",
    podcastId: "pod-conan",
    podcastTitle: "Conan O'Brien Needs a Friend",
    artworkColors: ["#0a2a1a", "#1a6040"],
    duration: 3300,
    publishDate: "Apr 11, 2026",
    description: "Bill Hader visits and the two get into a deep conversation about comedy and anxiety.",
  },
};

export const PODCASTS: Record<string, Podcast> = {
  "pod-huberman": {
    id: "pod-huberman",
    title: "Huberman Lab",
    author: "Dr. Andrew Huberman",
    artworkColors: ["#0a3d2e", "#1a7a5e"],
    category: "Science",
    description: "Neuroscience tools for everyday life.",
    episodeIds: ["ep-hub-1", "ep-hub-2", "ep-hub-3"],
  },
  "pod-lex": {
    id: "pod-lex",
    title: "Lex Fridman Podcast",
    author: "Lex Fridman",
    artworkColors: ["#0d1b2a", "#1a3a5c"],
    category: "Technology",
    description: "Conversations about AI, science, and the nature of intelligence.",
    episodeIds: ["ep-lex-1", "ep-lex-2", "ep-lex-3"],
  },
  "pod-serial": {
    id: "pod-serial",
    title: "Serial",
    author: "Sarah Koenig",
    artworkColors: ["#1a0a2e", "#4a2080"],
    category: "True Crime",
    description: "One story. Told week by week.",
    episodeIds: ["ep-serial-1", "ep-serial-2"],
  },
  "pod-crimejunkie": {
    id: "pod-crimejunkie",
    title: "Crime Junkie",
    author: "Ashley Flowers",
    artworkColors: ["#2a0a0a", "#7a1f1f"],
    category: "True Crime",
    description: "A true crime podcast done in an addictive, bingeable format.",
    episodeIds: ["ep-cj-1", "ep-cj-2"],
  },
  "pod-daily": {
    id: "pod-daily",
    title: "The Daily",
    author: "The New York Times",
    artworkColors: ["#0a1628", "#1e3a5f"],
    category: "News",
    description: "The biggest stories of our time, told by the best journalists in the world.",
    episodeIds: ["ep-daily-1", "ep-daily-2"],
  },
  "pod-hibt": {
    id: "pod-hibt",
    title: "How I Built This",
    author: "Guy Raz",
    artworkColors: ["#2a1500", "#7a3d00"],
    category: "Business",
    description: "Guy Raz dives into the stories behind the world's best-known companies.",
    episodeIds: ["ep-hibt-1", "ep-hibt-2"],
  },
  "pod-hardcore": {
    id: "pod-hardcore",
    title: "Hardcore History",
    author: "Dan Carlin",
    artworkColors: ["#1a1a1a", "#444444"],
    category: "History",
    description: "In Hardcore History, journalist and broadcaster Dan Carlin uses a groundbreaking approach.",
    episodeIds: ["ep-hh-1"],
  },
  "pod-conan": {
    id: "pod-conan",
    title: "Conan O'Brien Needs a Friend",
    author: "Conan O'Brien",
    artworkColors: ["#0a2a1a", "#1a6040"],
    category: "Comedy",
    description: "Conan attempts to make real, actual friends through the power of the podcast.",
    episodeIds: ["ep-conan-1"],
  },
};

export const FEATURED_PODCAST_IDS = [
  "pod-huberman",
  "pod-lex",
  "pod-serial",
  "pod-daily",
  "pod-hibt",
  "pod-conan",
];

export const TRENDING_EPISODE_IDS = [
  "ep-lex-1",
  "ep-hub-1",
  "ep-cj-1",
  "ep-daily-1",
  "ep-hibt-1",
  "ep-serial-1",
];

export const QUEUE_COLORS = [
  "#58A6FF",
  "#3FB950",
  "#FF7B72",
  "#D2A8FF",
  "#FFA657",
  "#79C0FF",
  "#56D364",
  "#F85149",
];

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m} min`;
}

export function formatProgress(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}
