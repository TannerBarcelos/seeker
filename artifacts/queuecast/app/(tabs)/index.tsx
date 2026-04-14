import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { EPISODES, FEATURED_PODCAST_IDS, PODCASTS, TRENDING_EPISODE_IDS } from "@/constants/mockData";
import { useColors } from "@/hooks/useColors";
import { usePlayer } from "@/context/PlayerContext";
import { useQueues } from "@/context/QueuesContext";
import { AddToQueueSheet } from "@/components/AddToQueueSheet";
import { EpisodeRow } from "@/components/EpisodeRow";
import { PodcastCard } from "@/components/PodcastCard";
import type { Episode } from "@/constants/mockData";

export default function DiscoverScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { activeQueueId } = useQueues();
  const { play } = usePlayer();
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [sheetVisible, setSheetVisible] = useState(false);

  const topInset = Platform.OS === "web" ? 67 : insets.top;
  const bottomInset = Platform.OS === "web" ? 34 : 0;

  function handleEpisodeLongPress(ep: Episode) {
    setSelectedEpisode(ep);
    setSheetVisible(true);
  }

  function handleEpisodePlay(ep: Episode) {
    const qId = activeQueueId ?? "q-tech";
    play(ep, qId);
  }

  return (
    <ScrollView
      style={[styles.root, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: topInset + 16, paddingBottom: bottomInset + 160 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={[styles.appName, { color: colors.foreground }]}>Seeker</Text>
        <Pressable style={[styles.searchHint, { backgroundColor: colors.secondary }]}>
          <Ionicons name="search" size={16} color={colors.mutedForeground} />
          <Text style={[styles.searchText, { color: colors.mutedForeground }]}>Search podcasts & episodes</Text>
        </Pressable>
      </View>

      <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>FEATURED SHOWS</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalList}
      >
        {FEATURED_PODCAST_IDS.map((id) => {
          const podcast = PODCASTS[id];
          if (!podcast) return null;
          return (
            <PodcastCard
              key={id}
              podcast={podcast}
              size="lg"
            />
          );
        })}
      </ScrollView>

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>TRENDING EPISODES</Text>
      </View>

      {TRENDING_EPISODE_IDS.map((id) => {
        const ep = EPISODES[id];
        if (!ep) return null;
        return (
          <EpisodeRow
            key={id}
            episode={ep}
            queueId={activeQueueId ?? "q-tech"}
            onLongPress={handleEpisodeLongPress}
          />
        );
      })}

      <Text style={[styles.sectionLabel, { color: colors.mutedForeground, marginTop: 16 }]}>ALL SHOWS</Text>
      <View style={styles.podcastGrid}>
        {Object.values(PODCASTS).map((podcast) => (
          <PodcastCard key={podcast.id} podcast={podcast} size="sm" />
        ))}
      </View>

      <AddToQueueSheet
        visible={sheetVisible}
        episode={selectedEpisode}
        onClose={() => setSheetVisible(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    gap: 12,
  },
  header: {
    gap: 12,
    marginBottom: 8,
  },
  appName: {
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: -1,
  },
  searchHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 12,
  },
  searchText: {
    fontSize: 14,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  horizontalList: {
    gap: 16,
    paddingVertical: 4,
  },
  podcastGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
  },
});
