import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { formatDuration } from "@/constants/mockData";
import type { Episode } from "@/constants/mockData";
import { useColors } from "@/hooks/useColors";
import { usePlayer } from "@/context/PlayerContext";
import { PodcastArtwork } from "./PodcastArtwork";

interface Props {
  episode: Episode;
  queueId: string;
  isActive?: boolean;
  queueColor?: string;
  onLongPress?: (episode: Episode) => void;
  showQueueColor?: boolean;
  index?: number;
}

export function EpisodeRow({
  episode,
  queueId,
  isActive = false,
  queueColor,
  onLongPress,
  showQueueColor = false,
  index,
}: Props) {
  const colors = useColors();
  const { play, pause, resume, isPlaying, currentEpisode } = usePlayer();

  const isCurrent = currentEpisode?.id === episode.id;
  const isCurrentlyPlaying = isCurrent && isPlaying;

  function handlePress() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    if (isCurrent) {
      if (isPlaying) pause();
      else resume();
    } else {
      play(episode, queueId);
    }
  }

  return (
    <Pressable
      onPress={handlePress}
      onLongPress={() => onLongPress?.(episode)}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: isActive ? colors.secondary : colors.card,
          borderColor: isCurrent ? (queueColor ?? colors.primary) : colors.border,
          opacity: pressed ? 0.75 : 1,
        },
      ]}
    >
      {typeof index !== "undefined" && (
        <Text style={[styles.index, { color: colors.mutedForeground }]}>{index + 1}</Text>
      )}

      <PodcastArtwork colors={episode.artworkColors} size={50} borderRadius={8} />

      <View style={styles.info}>
        <Text
          style={[styles.title, { color: isCurrent ? (queueColor ?? colors.primary) : colors.foreground }]}
          numberOfLines={2}
        >
          {episode.title}
        </Text>
        <Text style={[styles.meta, { color: colors.mutedForeground }]} numberOfLines={1}>
          {episode.podcastTitle} · {formatDuration(episode.duration)}
        </Text>
        <Text style={[styles.date, { color: colors.mutedForeground }]}>{episode.publishDate}</Text>
      </View>

      <View style={styles.actions}>
        {showQueueColor && queueColor && (
          <View style={[styles.dot, { backgroundColor: queueColor }]} />
        )}
        <Pressable
          onPress={handlePress}
          hitSlop={8}
          style={[
            styles.playBtn,
            { backgroundColor: isCurrent ? (queueColor ?? colors.primary) : colors.secondary },
          ]}
        >
          <Ionicons
            name={isCurrentlyPlaying ? "pause" : "play"}
            size={16}
            color={isCurrent ? colors.primaryForeground : colors.foreground}
          />
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  index: {
    width: 20,
    textAlign: "center",
    fontSize: 13,
    fontWeight: "600",
  },
  info: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 19,
  },
  meta: {
    fontSize: 12,
    fontWeight: "500",
  },
  date: {
    fontSize: 11,
  },
  actions: {
    alignItems: "center",
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  playBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 2,
  },
});
