import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { formatDuration, formatProgress } from "@/constants/mockData";
import { useColors } from "@/hooks/useColors";
import { usePlayer } from "@/context/PlayerContext";
import { useQueues } from "@/context/QueuesContext";
import { PodcastArtwork } from "@/components/PodcastArtwork";

export default function PlayerScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { currentEpisode, isPlaying, progress, positionSeconds, pause, resume, skipForward, skipBack, seek } = usePlayer();
  const { getQueue, activeQueueId, getEpisodesForQueue } = useQueues();

  const topInset = Platform.OS === "web" ? 67 : insets.top;
  const bottomInset = Platform.OS === "web" ? 34 : insets.bottom;

  if (!currentEpisode) {
    return (
      <View style={[styles.empty, { backgroundColor: colors.background, paddingTop: topInset }]}>
        <Ionicons name="headset" size={48} color={colors.mutedForeground} />
        <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>Nothing playing</Text>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-down" size={24} color={colors.foreground} />
        </Pressable>
      </View>
    );
  }

  const queue = activeQueueId ? getQueue(activeQueueId) : null;
  const queueColor = queue?.color ?? colors.primary;
  const upNextEpisodes = queue ? getEpisodesForQueue(queue.id).filter((ep) => ep.id !== currentEpisode.id).slice(0, 3) : [];

  function handleSeek(fraction: number) {
    seek(currentEpisode.duration * fraction);
  }

  return (
    <LinearGradient
      colors={[currentEpisode.artworkColors[0], "#0D1117"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 0.6 }}
      style={[styles.root, { paddingTop: topInset }]}
    >
      <View style={[styles.handle, { backgroundColor: "rgba(255,255,255,0.2)" }]} />

      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.headerBtn}>
          <Ionicons name="chevron-down" size={28} color="#fff" />
        </Pressable>
        <View style={styles.headerCenter}>
          {queue && (
            <View style={[styles.queuePill, { backgroundColor: queueColor + "30", borderColor: queueColor + "60" }]}>
              <View style={[styles.queueDot, { backgroundColor: queueColor }]} />
              <Text style={[styles.queuePillText, { color: queueColor }]}>{queue.name}</Text>
            </View>
          )}
        </View>
        <Pressable hitSlop={12} style={styles.headerBtn}>
          <Ionicons name="ellipsis-horizontal" size={22} color="rgba(255,255,255,0.7)" />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[styles.body, { paddingBottom: bottomInset + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.artwork}>
          <PodcastArtwork
            colors={currentEpisode.artworkColors}
            size={280}
            borderRadius={24}
            iconSize={80}
          />
        </View>

        <View style={styles.episodeInfo}>
          <Text style={styles.episodeTitle}>{currentEpisode.title}</Text>
          <Text style={styles.podcastName}>{currentEpisode.podcastTitle}</Text>
        </View>

        <View style={styles.progressSection}>
          <Pressable
            style={styles.progressTrack}
            onPress={(e) => {
              const fraction = e.nativeEvent.locationX / (e.nativeEvent.target ? 300 : 300);
              handleSeek(Math.max(0, Math.min(1, fraction)));
            }}
          >
            <View style={[styles.progressBg, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
              <View
                style={[styles.progressFill, { width: `${progress * 100}%` as any, backgroundColor: queueColor }]}
              />
              <View style={[styles.progressThumb, { left: `${progress * 100}%` as any, backgroundColor: queueColor }]} />
            </View>
          </Pressable>
          <View style={styles.progressLabels}>
            <Text style={styles.timeLabel}>{formatProgress(positionSeconds)}</Text>
            <Text style={styles.timeLabel}>-{formatProgress(currentEpisode.duration - positionSeconds)}</Text>
          </View>
        </View>

        <View style={styles.controls}>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
              skipBack();
            }}
            style={styles.skipBtn}
          >
            <Ionicons name="play-back" size={30} color="rgba(255,255,255,0.8)" />
            <Text style={styles.skipLabel}>15</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
              if (isPlaying) pause();
              else resume();
            }}
            style={[styles.playBtn, { backgroundColor: queueColor }]}
          >
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={36}
              color="#fff"
              style={isPlaying ? undefined : { marginLeft: 4 }}
            />
          </Pressable>

          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
              skipForward();
            }}
            style={styles.skipBtn}
          >
            <Ionicons name="play-forward" size={30} color="rgba(255,255,255,0.8)" />
            <Text style={styles.skipLabel}>30</Text>
          </Pressable>
        </View>

        <View style={styles.extras}>
          <Pressable style={styles.extraBtn}>
            <Ionicons name="volume-high" size={20} color="rgba(255,255,255,0.6)" />
          </Pressable>
          <Pressable style={styles.extraBtn}>
            <Ionicons name="share-outline" size={20} color="rgba(255,255,255,0.6)" />
          </Pressable>
          <Pressable style={styles.extraBtn}>
            <Ionicons name="bookmark-outline" size={20} color="rgba(255,255,255,0.6)" />
          </Pressable>
          <Pressable style={styles.extraBtn}>
            <Ionicons name="timer-outline" size={20} color="rgba(255,255,255,0.6)" />
          </Pressable>
        </View>

        <Text style={[styles.descriptionText, { color: "rgba(255,255,255,0.6)" }]}>
          {currentEpisode.description}
        </Text>

        {upNextEpisodes.length > 0 && (
          <>
            <Text style={styles.upNextLabel}>UP NEXT IN {queue?.name.toUpperCase()}</Text>
            {upNextEpisodes.map((ep, i) => (
              <View
                key={ep.id}
                style={[styles.upNextRow, { backgroundColor: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.1)" }]}
              >
                <Text style={styles.upNextNum}>{i + 1}</Text>
                <PodcastArtwork colors={ep.artworkColors} size={40} borderRadius={8} />
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={styles.upNextTitle} numberOfLines={1}>{ep.title}</Text>
                  <Text style={styles.upNextPodcast} numberOfLines={1}>{ep.podcastTitle} · {formatDuration(ep.duration)}</Text>
                </View>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  emptyText: { fontSize: 18 },
  backBtn: { padding: 12 },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerBtn: { width: 40 },
  headerCenter: { flex: 1, alignItems: "center" },
  queuePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  queueDot: { width: 6, height: 6, borderRadius: 3 },
  queuePillText: { fontSize: 12, fontWeight: "700" },
  body: {
    paddingHorizontal: 24,
    gap: 24,
    alignItems: "center",
  },
  artwork: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.5,
    shadowRadius: 32,
    elevation: 20,
  },
  episodeInfo: { alignItems: "center", gap: 6, width: "100%" },
  episodeTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    lineHeight: 28,
  },
  podcastName: {
    fontSize: 14,
    color: "rgba(255,255,255,0.6)",
    textAlign: "center",
  },
  progressSection: { width: "100%", gap: 8 },
  progressTrack: {
    width: "100%",
    paddingVertical: 10,
  },
  progressBg: {
    height: 4,
    borderRadius: 2,
    position: "relative",
  },
  progressFill: {
    height: 4,
    borderRadius: 2,
  },
  progressThumb: {
    position: "absolute",
    top: -5,
    width: 14,
    height: 14,
    borderRadius: 7,
    marginLeft: -7,
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  timeLabel: { fontSize: 12, color: "rgba(255,255,255,0.6)" },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 32,
  },
  skipBtn: { alignItems: "center" },
  skipLabel: { fontSize: 10, color: "rgba(255,255,255,0.6)", marginTop: 2 },
  playBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  extras: {
    flexDirection: "row",
    gap: 20,
  },
  extraBtn: { padding: 10 },
  descriptionText: { fontSize: 13, lineHeight: 20, textAlign: "center" },
  upNextLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "rgba(255,255,255,0.4)",
    letterSpacing: 1,
    alignSelf: "flex-start",
  },
  upNextRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    width: "100%",
  },
  upNextNum: { fontSize: 13, color: "rgba(255,255,255,0.4)", width: 16, textAlign: "center" },
  upNextTitle: { fontSize: 13, fontWeight: "600", color: "#fff" },
  upNextPodcast: { fontSize: 11, color: "rgba(255,255,255,0.5)" },
});
