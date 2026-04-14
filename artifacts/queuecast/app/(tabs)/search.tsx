import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { EPISODES, PODCASTS } from "@/constants/mockData";
import type { Episode } from "@/constants/mockData";
import { useColors } from "@/hooks/useColors";
import { useQueues } from "@/context/QueuesContext";
import { AddToQueueSheet } from "@/components/AddToQueueSheet";
import { EpisodeRow } from "@/components/EpisodeRow";
import { PodcastCard } from "@/components/PodcastCard";

const CATEGORIES = ["Technology", "True Crime", "Science", "News", "Business", "History", "Comedy"];

export default function SearchScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { activeQueueId } = useQueues();
  const [query, setQuery] = useState("");
  const [sheetEpisode, setSheetEpisode] = useState<Episode | null>(null);

  const topInset = Platform.OS === "web" ? 67 : insets.top;
  const bottomInset = Platform.OS === "web" ? 34 : 0;

  const q = query.trim().toLowerCase();
  const matchingEpisodes = q
    ? Object.values(EPISODES).filter(
        (ep) =>
          ep.title.toLowerCase().includes(q) ||
          ep.podcastTitle.toLowerCase().includes(q) ||
          ep.description.toLowerCase().includes(q)
      )
    : [];

  const matchingPodcasts = q
    ? Object.values(PODCASTS).filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.author.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      )
    : [];

  const catPodcasts = (cat: string) =>
    Object.values(PODCASTS).filter((p) => p.category === cat);

  return (
    <ScrollView
      style={[styles.root, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: topInset + 16, paddingBottom: bottomInset + 160 },
      ]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.title, { color: colors.foreground }]}>Search</Text>

      <View style={[styles.searchBar, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
        <Ionicons name="search" size={18} color={colors.mutedForeground} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Podcasts, episodes, topics..."
          placeholderTextColor={colors.mutedForeground}
          style={[styles.searchInput, { color: colors.foreground }]}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {query.length > 0 && (
          <Pressable onPress={() => setQuery("")} hitSlop={8}>
            <Ionicons name="close-circle" size={18} color={colors.mutedForeground} />
          </Pressable>
        )}
      </View>

      {q === "" ? (
        <>
          <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>BROWSE CATEGORIES</Text>
          <View style={styles.categoryGrid}>
            {CATEGORIES.map((cat) => {
              const pods = catPodcasts(cat);
              const mainColor = pods[0]?.artworkColors[1] ?? colors.primary;
              return (
                <Pressable
                  key={cat}
                  style={({ pressed }) => [
                    styles.categoryCard,
                    { backgroundColor: mainColor + "30", borderColor: mainColor + "60", opacity: pressed ? 0.7 : 1 },
                  ]}
                >
                  <Text style={[styles.categoryText, { color: mainColor }]}>{cat}</Text>
                  <Text style={[styles.categoryCount, { color: mainColor + "aa" }]}>
                    {pods.length} show{pods.length !== 1 ? "s" : ""}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={[styles.sectionLabel, { color: colors.mutedForeground, marginTop: 8 }]}>ALL SHOWS</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hList}>
            {Object.values(PODCASTS).map((p) => (
              <PodcastCard key={p.id} podcast={p} size="md" />
            ))}
          </ScrollView>
        </>
      ) : (
        <>
          {matchingPodcasts.length > 0 && (
            <>
              <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>SHOWS</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hList}>
                {matchingPodcasts.map((p) => (
                  <PodcastCard key={p.id} podcast={p} size="md" />
                ))}
              </ScrollView>
            </>
          )}

          {matchingEpisodes.length > 0 && (
            <>
              <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>EPISODES</Text>
              {matchingEpisodes.map((ep) => (
                <EpisodeRow
                  key={ep.id}
                  episode={ep}
                  queueId={activeQueueId ?? "q-tech"}
                  onLongPress={(e) => setSheetEpisode(e)}
                />
              ))}
            </>
          )}

          {matchingPodcasts.length === 0 && matchingEpisodes.length === 0 && (
            <View style={styles.noResults}>
              <Ionicons name="search" size={40} color={colors.mutedForeground} />
              <Text style={[styles.noResultsText, { color: colors.mutedForeground }]}>
                No results for "{query}"
              </Text>
            </View>
          )}
        </>
      )}

      <AddToQueueSheet
        visible={!!sheetEpisode}
        episode={sheetEpisode}
        onClose={() => setSheetEpisode(null)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { paddingHorizontal: 16, gap: 12 },
  title: { fontSize: 32, fontWeight: "800", letterSpacing: -1, marginBottom: 4 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  searchInput: { flex: 1, fontSize: 16 },
  sectionLabel: { fontSize: 11, fontWeight: "700", letterSpacing: 1, marginTop: 8 },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  categoryCard: {
    width: "47%",
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    gap: 4,
  },
  categoryText: { fontSize: 15, fontWeight: "700" },
  categoryCount: { fontSize: 12 },
  hList: { gap: 16, paddingVertical: 4 },
  noResults: { alignItems: "center", gap: 12, paddingVertical: 48 },
  noResultsText: { fontSize: 16, textAlign: "center" },
});
