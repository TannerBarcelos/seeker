import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";

interface Props {
  colors: [string, string];
  size: number;
  borderRadius?: number;
  iconSize?: number;
}

export function PodcastArtwork({ colors, size, borderRadius = 10, iconSize }: Props) {
  const icon = iconSize ?? Math.floor(size * 0.4);
  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.base, { width: size, height: size, borderRadius }]}
    >
      <Ionicons name="headset" size={icon} color="rgba(255,255,255,0.5)" />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
  },
});
