import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { EPISODES, PODCASTS } from "@/constants/mockData";
import { useColors } from "@/hooks/useColors";
import { useQueues } from "@/context/QueuesContext";
import { PodcastArtwork } from "@/components/PodcastArtwork";

const SUBSCRIBED = ["pod-huberman", "pod-lex", "pod-serial", "pod-daily"];

export default function LibraryScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { queues } = useQueues();

  const topInset = Platform.OS === "web" ? 67 : insets.top;
  const bottomInset = Platform.OS === "web" ? 34 : 0;

  const allQueuedEpisodeIds = new Set(queues.flatMap((q) => q.episodeIds));
  const queuedCount = allQueuedEpisodeIds.size;

  return (
    <ScrollView
      style={[styles.root, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: topInset + 16, paddingBottom: bottomInset + 160 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.title, { color: colors.foreground }]}>Library</Text>

      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.statNum, { color: colors.primary }]}>{queues.length}</Text>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Queues</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.statNum, { color: colors.primary }]}>{queuedCount}</Text>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Queued</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.statNum, { color: colors.primary }]}>{SUBSCRIBED.length}</Text>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Shows</Text>
        </View>
      </View>

      <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>SUBSCRIBED SHOWS</Text>

      {SUBSCRIBED.map((id) => {
        const podcast = PODCASTS[id];
        if (!podcast) return null;
        const episodes = podcast.episodeIds.map((eid) => EPISODES[eid]).filter(Boolean);
        return (
          <View
            key={id}
            style={[styles.showRow, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <PodcastArtwork colors={podcast.artworkColors} size={56} borderRadius={10} />
            <View style={styles.showInfo}>
              <Text style={[styles.showTitle, { color: colors.foreground }]}>{podcast.title}</Text>
              <Text style={[styles.showAuthor, { color: colors.mutedForeground }]}>{podcast.author}</Text>
              <Text style={[styles.showEpisodes, { color: colors.mutedForeground }]}>
                {episodes.length} episodes
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.mutedForeground} />
          </View>
        );
      })}

      <Text style={[styles.sectionLabel, { color: colors.mutedForeground, marginTop: 8 }]}>MY QUEUES</Text>

      {queues.map((q) => (
        <View
          key={q.id}
          style={[styles.queueRow, { backgroundColor: colors.card, borderColor: colors.border, borderLeftColor: q.color, borderLeftWidth: 3 }]}
        >
          <View style={[styles.queueDot, { backgroundColor: q.color }]} />
          <View style={styles.queueInfo}>
            <Text style={[styles.queueName, { color: colors.foreground }]}>{q.name}</Text>
            <Text style={[styles.queueCount, { color: colors.mutedForeground }]}>
              {q.episodeIds.length} episodes
            </Text>
          </View>
          <Ionicons name="list" size={18} color={q.color} />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { paddingHorizontal: 16, gap: 12 },
  title: { fontSize: 32, fontWeight: "800", letterSpacing: -1, marginBottom: 4 },
  statsRow: { flexDirection: "row", gap: 10 },
  statCard: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    alignItems: "center",
    gap: 4,
  },
  statNum: { fontSize: 28, fontWeight: "800" },
  statLabel: { fontSize: 11, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    marginTop: 8,
  },
  showRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  showInfo: { flex: 1, gap: 2 },
  showTitle: { fontSize: 15, fontWeight: "600" },
  showAuthor: { fontSize: 12 },
  showEpisodes: { fontSize: 11 },
  queueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  queueDot: { width: 10, height: 10, borderRadius: 5 },
  queueInfo: { flex: 1, gap: 2 },
  queueName: { fontSize: 15, fontWeight: "600" },
  queueCount: { fontSize: 12 },
});
