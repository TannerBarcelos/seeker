import * as Haptics from "expo-haptics";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { SymbolView } from "expo-symbols";
import { useRouter } from "expo-router";
import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";
import { useColors } from "@/hooks/useColors";
import { usePlayer } from "@/context/PlayerContext";
import { useQueues } from "@/context/QueuesContext";
import { PodcastArtwork } from "./PodcastArtwork";

const isIOS = Platform.OS === "ios";

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

  const Inner = (
    <View style={styles.inner}>
      <View style={[styles.progressBar]}>
        <View
          style={[
            styles.progressFill,
            { width: `${progress * 100}%` as any, backgroundColor: queueColor },
          ]}
        />
      </View>

      <Pressable onPress={handlePress} style={styles.content}>
        <PodcastArtwork colors={currentEpisode.artworkColors} size={44} borderRadius={10} />

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
          <Pressable onPress={handlePlayPause} hitSlop={10} style={styles.controlBtn}>
            {isIOS ? (
              <SymbolView
                name={isPlaying ? "pause.fill" : "play.fill"}
                size={22}
                tintColor={colors.foreground}
              />
            ) : (
              <Ionicons
                name={isPlaying ? "pause" : "play"}
                size={22}
                color={colors.foreground}
              />
            )}
          </Pressable>
          <Pressable onPress={stop} hitSlop={10} style={styles.controlBtn}>
            {isIOS ? (
              <SymbolView name="xmark" size={17} tintColor={colors.mutedForeground} />
            ) : (
              <Ionicons name="close" size={18} color={colors.mutedForeground} />
            )}
          </Pressable>
        </View>
      </Pressable>
    </View>
  );

  return (
    <Animated.View
      entering={FadeInDown.springify().damping(18)}
      exiting={FadeOutDown.springify().damping(18)}
      style={styles.container}
    >
      {isIOS ? (
        <BlurView intensity={72} tint="dark" style={[StyleSheet.absoluteFill, { borderRadius: 20 }]} />
      ) : (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(20,20,28,0.92)", borderRadius: 20 }]} />
      )}
      <View style={[styles.glassBorder, StyleSheet.absoluteFill]} />
      {Inner}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 14,
    marginBottom: 10,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 12,
  },
  glassBorder: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
  },
  inner: {
    overflow: "hidden",
  },
  progressBar: {
    height: 2,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  progressFill: {
    height: 2,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  info: {
    flex: 1,
    gap: 3,
  },
  title: {
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: -0.2,
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
    gap: 2,
  },
  controlBtn: {
    padding: 7,
  },
});
