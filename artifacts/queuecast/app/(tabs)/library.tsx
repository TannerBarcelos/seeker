import { Ionicons } from "@expo/vector-icons";
import { SymbolView } from "expo-symbols";
import React from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { EPISODES, PODCASTS } from "@/constants/mockData";
import { useColors } from "@/hooks/useColors";
import { useQueues } from "@/context/QueuesContext";
import { PodcastArtwork } from "@/components/PodcastArtwork";

const isIOS = Platform.OS === "ios";
const SUBSCRIBED = ["pod-huberman", "pod-lex", "pod-serial", "pod-daily"];

export default function LibraryScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { queues } = useQueues();

  const topInset = Platform.OS === "web" ? 67 : insets.top;
  const bottomInset = Platform.OS === "web" ? 34 : 0;

  const allQueuedEpisodeIds = new Set(queues.flatMap((q) => q.episodeIds));
  const queuedCount = allQueuedEpisodeIds.size;

  const stats = [
    { value: queues.length, label: "Queues", symbol: "list.bullet", icon: "list" as const },
    { value: queuedCount, label: "Queued", symbol: "bookmark.fill", icon: "bookmark" as const },
    { value: SUBSCRIBED.length, label: "Shows", symbol: "radio", icon: "radio" as const },
  ];

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
        {stats.map((s) => (
          <View
            key={s.label}
            style={[styles.statCard, { backgroundColor: colors.glass, borderColor: colors.glassBorder }]}
          >
            {isIOS ? (
              <SymbolView name={s.symbol as any} size={20} tintColor={colors.primary} />
            ) : (
              <Ionicons name={s.icon} size={20} color={colors.primary} />
            )}
            <Text style={[styles.statNum, { color: colors.foreground }]}>{s.value}</Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{s.label}</Text>
          </View>
        ))}
      </View>

      <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>SUBSCRIBED SHOWS</Text>

      {SUBSCRIBED.map((id) => {
        const podcast = PODCASTS[id];
        if (!podcast) return null;
        const episodes = podcast.episodeIds.map((eid) => EPISODES[eid]).filter(Boolean);
        return (
          <View
            key={id}
            style={[styles.showRow, { backgroundColor: colors.glass, borderColor: colors.glassBorder }]}
          >
            <PodcastArtwork colors={podcast.artworkColors} size={56} borderRadius={12} />
            <View style={styles.showInfo}>
              <Text style={[styles.showTitle, { color: colors.foreground }]}>{podcast.title}</Text>
              <Text style={[styles.showAuthor, { color: colors.mutedForeground }]}>{podcast.author}</Text>
              <Text style={[styles.showEpisodes, { color: colors.mutedForeground }]}>
                {episodes.length} episodes
              </Text>
            </View>
            {isIOS ? (
              <SymbolView name="chevron.right" size={15} tintColor={colors.mutedForeground} />
            ) : (
              <Ionicons name="chevron-forward" size={18} color={colors.mutedForeground} />
            )}
          </View>
        );
      })}

      <Text style={[styles.sectionLabel, { color: colors.mutedForeground, marginTop: 8 }]}>MY QUEUES</Text>

      {queues.map((q) => (
        <View
          key={q.id}
          style={[styles.queueRow, { backgroundColor: colors.glass, borderColor: colors.glassBorder, borderLeftColor: q.color, borderLeftWidth: 3 }]}
        >
          <View style={[styles.queueDot, { backgroundColor: q.color }]} />
          <View style={styles.queueInfo}>
            <Text style={[styles.queueName, { color: colors.foreground }]}>{q.name}</Text>
            <Text style={[styles.queueCount, { color: colors.mutedForeground }]}>
              {q.episodeIds.length} episodes
            </Text>
          </View>
          {isIOS ? (
            <SymbolView name="list.bullet" size={16} tintColor={q.color} />
          ) : (
            <Ionicons name="list" size={18} color={q.color} />
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { paddingHorizontal: 16, gap: 12 },
  title: { fontSize: 34, fontWeight: "800", letterSpacing: -1.5, marginBottom: 4 },
  statsRow: { flexDirection: "row", gap: 10 },
  statCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    alignItems: "center",
    gap: 4,
  },
  statNum: { fontSize: 28, fontWeight: "800", letterSpacing: -1 },
  statLabel: { fontSize: 11, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginTop: 6,
  },
  showRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  showInfo: { flex: 1, gap: 2 },
  showTitle: { fontSize: 15, fontWeight: "600", letterSpacing: -0.2 },
  showAuthor: { fontSize: 12 },
  showEpisodes: { fontSize: 11 },
  queueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  queueDot: { width: 10, height: 10, borderRadius: 5 },
  queueInfo: { flex: 1, gap: 2 },
  queueName: { fontSize: 15, fontWeight: "600", letterSpacing: -0.2 },
  queueCount: { fontSize: 12 },
});
