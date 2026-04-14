import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { Podcast } from "@/constants/mockData";
import { useColors } from "@/hooks/useColors";
import { PodcastArtwork } from "./PodcastArtwork";

interface Props {
  podcast: Podcast;
  onPress?: (podcast: Podcast) => void;
  size?: "sm" | "md" | "lg";
}

export function PodcastCard({ podcast, onPress, size = "md" }: Props) {
  const colors = useColors();
  const dim = size === "sm" ? 80 : size === "lg" ? 160 : 120;

  return (
    <Pressable
      onPress={() => onPress?.(podcast)}
      style={({ pressed }) => [styles.container, { opacity: pressed ? 0.75 : 1 }]}
    >
      <PodcastArtwork colors={podcast.artworkColors} size={dim} borderRadius={12} />
      <View style={{ maxWidth: dim }}>
        <Text style={[styles.title, { color: colors.foreground }]} numberOfLines={2}>
          {podcast.title}
        </Text>
        <Text style={[styles.author, { color: colors.mutedForeground }]} numberOfLines={1}>
          {podcast.author}
        </Text>
        <View style={[styles.badge, { backgroundColor: colors.secondary }]}>
          <Text style={[styles.category, { color: colors.mutedForeground }]}>{podcast.category}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
    alignItems: "flex-start",
  },
  title: {
    fontSize: 13,
    fontWeight: "600",
    marginTop: 4,
  },
  author: {
    fontSize: 11,
    fontWeight: "400",
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  category: {
    fontSize: 10,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
