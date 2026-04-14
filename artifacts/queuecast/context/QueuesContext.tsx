import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { EPISODES, Episode, QUEUE_COLORS } from "@/constants/mockData";

export interface Queue {
  id: string;
  name: string;
  color: string;
  episodeIds: string[];
  currentIndex: number;
}

interface QueuesContextValue {
  queues: Queue[];
  activeQueueId: string | null;
  setActiveQueueId: (id: string | null) => void;
  createQueue: (name: string, color: string) => Queue;
  deleteQueue: (id: string) => void;
  renameQueue: (id: string, name: string) => void;
  addEpisodeToQueue: (queueId: string, episodeId: string) => void;
  removeEpisodeFromQueue: (queueId: string, episodeId: string) => void;
  moveEpisodeInQueue: (queueId: string, fromIndex: number, toIndex: number) => void;
  getQueue: (id: string) => Queue | undefined;
  getEpisodesForQueue: (id: string) => Episode[];
  setQueueCurrentIndex: (queueId: string, index: number) => void;
}

const QueuesContext = createContext<QueuesContextValue | null>(null);

const STORAGE_KEY = "seeker_queues_v1";
const ACTIVE_KEY = "seeker_active_queue_v1";

const DEFAULT_QUEUES: Queue[] = [
  {
    id: "q-tech",
    name: "Tech & Science",
    color: QUEUE_COLORS[0],
    episodeIds: ["ep-hub-1", "ep-lex-1", "ep-hub-2", "ep-lex-2", "ep-hub-3"],
    currentIndex: 0,
  },
  {
    id: "q-crime",
    name: "True Crime",
    color: QUEUE_COLORS[2],
    episodeIds: ["ep-serial-1", "ep-cj-1", "ep-serial-2", "ep-cj-2"],
    currentIndex: 0,
  },
  {
    id: "q-mix",
    name: "Daily Mix",
    color: QUEUE_COLORS[4],
    episodeIds: ["ep-daily-1", "ep-hibt-1", "ep-conan-1", "ep-daily-2", "ep-hh-1"],
    currentIndex: 0,
  },
];

export function QueuesProvider({ children }: { children: React.ReactNode }) {
  const [queues, setQueues] = useState<Queue[]>(DEFAULT_QUEUES);
  const [activeQueueId, setActiveQueueIdState] = useState<string | null>("q-tech");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [storedQueues, storedActive] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEY),
          AsyncStorage.getItem(ACTIVE_KEY),
        ]);
        if (storedQueues) {
          setQueues(JSON.parse(storedQueues));
        }
        if (storedActive) {
          setActiveQueueIdState(storedActive);
        }
      } catch {
      } finally {
        setLoaded(true);
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(queues)).catch(() => {});
  }, [queues, loaded]);

  const setActiveQueueId = useCallback((id: string | null) => {
    setActiveQueueIdState(id);
    if (id) {
      AsyncStorage.setItem(ACTIVE_KEY, id).catch(() => {});
    }
  }, []);

  const createQueue = useCallback((name: string, color: string): Queue => {
    const queue: Queue = {
      id: `q-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name,
      color,
      episodeIds: [],
      currentIndex: 0,
    };
    setQueues((prev) => [...prev, queue]);
    return queue;
  }, []);

  const deleteQueue = useCallback((id: string) => {
    setQueues((prev) => prev.filter((q) => q.id !== id));
    setActiveQueueIdState((prev) => (prev === id ? null : prev));
  }, []);

  const renameQueue = useCallback((id: string, name: string) => {
    setQueues((prev) => prev.map((q) => (q.id === id ? { ...q, name } : q)));
  }, []);

  const addEpisodeToQueue = useCallback((queueId: string, episodeId: string) => {
    setQueues((prev) =>
      prev.map((q) => {
        if (q.id !== queueId) return q;
        if (q.episodeIds.includes(episodeId)) return q;
        return { ...q, episodeIds: [...q.episodeIds, episodeId] };
      })
    );
  }, []);

  const removeEpisodeFromQueue = useCallback((queueId: string, episodeId: string) => {
    setQueues((prev) =>
      prev.map((q) => {
        if (q.id !== queueId) return q;
        const idx = q.episodeIds.indexOf(episodeId);
        const newIds = q.episodeIds.filter((id) => id !== episodeId);
        const newIndex = q.currentIndex > idx && idx !== -1 ? Math.max(0, q.currentIndex - 1) : q.currentIndex;
        return { ...q, episodeIds: newIds, currentIndex: Math.min(newIndex, Math.max(0, newIds.length - 1)) };
      })
    );
  }, []);

  const moveEpisodeInQueue = useCallback((queueId: string, fromIndex: number, toIndex: number) => {
    setQueues((prev) =>
      prev.map((q) => {
        if (q.id !== queueId) return q;
        const ids = [...q.episodeIds];
        const [moved] = ids.splice(fromIndex, 1);
        ids.splice(toIndex, 0, moved);
        return { ...q, episodeIds: ids };
      })
    );
  }, []);

  const getQueue = useCallback((id: string) => queues.find((q) => q.id === id), [queues]);

  const getEpisodesForQueue = useCallback(
    (id: string): Episode[] => {
      const queue = queues.find((q) => q.id === id);
      if (!queue) return [];
      return queue.episodeIds.map((eid) => EPISODES[eid]).filter(Boolean) as Episode[];
    },
    [queues]
  );

  const setQueueCurrentIndex = useCallback((queueId: string, index: number) => {
    setQueues((prev) =>
      prev.map((q) => (q.id === queueId ? { ...q, currentIndex: index } : q))
    );
  }, []);

  return (
    <QueuesContext.Provider
      value={{
        queues,
        activeQueueId,
        setActiveQueueId,
        createQueue,
        deleteQueue,
        renameQueue,
        addEpisodeToQueue,
        removeEpisodeFromQueue,
        moveEpisodeInQueue,
        getQueue,
        getEpisodesForQueue,
        setQueueCurrentIndex,
      }}
    >
      {children}
    </QueuesContext.Provider>
  );
}

export function useQueues() {
  const ctx = useContext(QueuesContext);
  if (!ctx) throw new Error("useQueues must be used within QueuesProvider");
  return ctx;
}
