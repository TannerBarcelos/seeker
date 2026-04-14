import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";
import { useColors } from "@/hooks/useColors";
import { usePlayer } from "@/context/PlayerContext";
import { useQueues } from "@/context/QueuesContext";
import { PodcastArtwork } from "./PodcastArtwork";

export function MiniPlayer() {
  const colors = useColors();
  const { currentEpisode, isPlaying, progress, pause, resume, stop } = usePlayer();
  const { activeQueueId, getQueue } = useQueues();
  const router = useRouter();

  if (!currentEpisode) return null;

  const queue = activeQueueId ? getQueue(activeQueueId) : null;
  const queueColor = queue?.color ?? colors.primary;

  function handlePress() {
    router.push("/player");
  }

  function handlePlayPause() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    if (isPlaying) pause();
    else resume();
  }

  return (
    <Animated.View
      entering={FadeInDown}
      exiting={FadeOutDown}
      style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}
    >
      <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` as any, backgroundColor: queueColor }]} />
      </View>

      <Pressable onPress={handlePress} style={styles.inner}>
        <PodcastArtwork colors={currentEpisode.artworkColors} size={44} borderRadius={8} />

        <View style={styles.info}>
          <Text style={[styles.title, { color: colors.foreground }]} numberOfLines={1}>
            {currentEpisode.title}
          </Text>
          <View style={styles.meta}>
            {queue && <View style={[styles.queueDot, { backgroundColor: queueColor }]} />}
            <Text style={[styles.podcast, { color: colors.mutedForeground }]} numberOfLines={1}>
              {queue ? queue.name : currentEpisode.podcastTitle}
            </Text>
          </View>
        </View>

        <View style={styles.controls}>
          <Pressable onPress={handlePlayPause} hitSlop={8} style={styles.playBtn}>
            <Ionicons
              name={isPlaying ? "pause.fill" as any : "play.fill" as any}
              size={22}
              color={colors.foreground}
            />
          </Pressable>
          <Pressable onPress={stop} hitSlop={8} style={styles.closeBtn}>
            <Ionicons name="close" size={20} color={colors.mutedForeground} />
          </Pressable>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
    marginBottom: 8,
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  progressBar: {
    height: 2,
  },
  progressFill: {
    height: 2,
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
  },
  info: {
    flex: 1,
    gap: 3,
  },
  title: {
    fontSize: 13,
    fontWeight: "600",
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  queueDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  podcast: {
    fontSize: 11,
    flex: 1,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  playBtn: {
    padding: 6,
  },
  closeBtn: {
    padding: 6,
  },
});
