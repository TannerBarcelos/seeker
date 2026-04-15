import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { SymbolView } from "expo-symbols";
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

const isIOS = Platform.OS === "ios";

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
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingTop: topInset + 16, paddingBottom: bottomInset + 160 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Text style={[styles.appName, { color: colors.foreground }]}>Seeker</Text>
            <View style={[styles.headerBadge, { backgroundColor: colors.glass, borderColor: colors.glassBorder }]}>
              <Text style={[styles.headerBadgeText, { color: colors.mutedForeground }]}>
                {Object.keys(PODCASTS).length} shows
              </Text>
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.searchHint,
              {
                backgroundColor: pressed ? colors.glassBold : colors.glass,
                borderColor: colors.glassBorder,
              },
            ]}
          >
            {isIOS ? (
              <SymbolView name="magnifyingglass" size={16} tintColor={colors.mutedForeground} />
            ) : (
              <Ionicons name="search" size={16} color={colors.mutedForeground} />
            )}
            <Text style={[styles.searchText, { color: colors.mutedForeground }]}>
              Search podcasts & episodes
            </Text>
          </Pressable>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>FEATURED SHOWS</Text>
        </View>
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

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>ALL SHOWS</Text>
        </View>
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
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    gap: 10,
  },
  header: {
    gap: 12,
    marginBottom: 4,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  appName: {
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: -1.5,
  },
  headerBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
  },
  headerBadgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  searchHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 13,
    borderRadius: 14,
    borderWidth: 1,
  },
  searchText: {
    fontSize: 14,
    flex: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
  },
  horizontalList: {
    gap: 16,
    paddingVertical: 4,
    paddingRight: 8,
  },
  podcastGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
  },
});
