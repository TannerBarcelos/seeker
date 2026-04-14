import * as Haptics from "expo-haptics";
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { Episode } from "@/constants/mockData";

interface PlayerContextValue {
  currentEpisode: Episode | null;
  currentQueueId: string | null;
  isPlaying: boolean;
  progress: number;
  positionSeconds: number;
  play: (episode: Episode, queueId: string, startPosition?: number) => void;
  pause: () => void;
  resume: () => void;
  seek: (seconds: number) => void;
  skipForward: () => void;
  skipBack: () => void;
  stop: () => void;
  onEpisodeComplete: ((episode: Episode, queueId: string) => void) | null;
  setOnEpisodeComplete: (fn: ((episode: Episode, queueId: string) => void) | null) => void;
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [currentQueueId, setCurrentQueueId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [positionSeconds, setPositionSeconds] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onCompleteRef = useRef<((episode: Episode, queueId: string) => void) | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startTimer = useCallback(
    (episode: Episode) => {
      clearTimer();
      intervalRef.current = setInterval(() => {
        setPositionSeconds((prev) => {
          const next = prev + 1;
          if (next >= episode.duration) {
            clearTimer();
            setIsPlaying(false);
            if (onCompleteRef.current && currentQueueId) {
              onCompleteRef.current(episode, currentQueueId);
            }
            return episode.duration;
          }
          return next;
        });
      }, 1000);
    },
    [clearTimer, currentQueueId]
  );

  const play = useCallback(
    (episode: Episode, queueId: string, startPosition = 0) => {
      clearTimer();
      setCurrentEpisode(episode);
      setCurrentQueueId(queueId);
      setPositionSeconds(startPosition);
      setIsPlaying(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      startTimer(episode);
    },
    [clearTimer, startTimer]
  );

  const pause = useCallback(() => {
    clearTimer();
    setIsPlaying(false);
  }, [clearTimer]);

  const resume = useCallback(() => {
    if (!currentEpisode) return;
    setIsPlaying(true);
    startTimer(currentEpisode);
  }, [currentEpisode, startTimer]);

  const seek = useCallback(
    (seconds: number) => {
      if (!currentEpisode) return;
      const clamped = Math.max(0, Math.min(seconds, currentEpisode.duration));
      setPositionSeconds(clamped);
      if (isPlaying) {
        clearTimer();
        startTimer(currentEpisode);
      }
    },
    [currentEpisode, isPlaying, clearTimer, startTimer]
  );

  const skipForward = useCallback(() => {
    if (!currentEpisode) return;
    seek(positionSeconds + 30);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  }, [currentEpisode, positionSeconds, seek]);

  const skipBack = useCallback(() => {
    if (!currentEpisode) return;
    seek(positionSeconds - 15);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  }, [currentEpisode, positionSeconds, seek]);

  const stop = useCallback(() => {
    clearTimer();
    setCurrentEpisode(null);
    setCurrentQueueId(null);
    setIsPlaying(false);
    setPositionSeconds(0);
  }, [clearTimer]);

  const setOnEpisodeComplete = useCallback(
    (fn: ((episode: Episode, queueId: string) => void) | null) => {
      onCompleteRef.current = fn;
    },
    []
  );

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  const progress =
    currentEpisode && currentEpisode.duration > 0
      ? positionSeconds / currentEpisode.duration
      : 0;

  return (
    <PlayerContext.Provider
      value={{
        currentEpisode,
        currentQueueId,
        isPlaying,
        progress,
        positionSeconds,
        play,
        pause,
        resume,
        seek,
        skipForward,
        skipBack,
        stop,
        onEpisodeComplete: onCompleteRef.current,
        setOnEpisodeComplete,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
  return ctx;
}
