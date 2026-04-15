import { BlurView } from "expo-blur";
import { GlassView, isGlassEffectAPIAvailable, isLiquidGlassAvailable } from "expo-glass-effect";
import React from "react";
import { Platform, StyleSheet, View, type ViewStyle } from "react-native";

interface Props {
  children?: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  borderRadius?: number;
  glassStyle?: "regular" | "clear";
  tintColor?: string;
  isInteractive?: boolean;
  blurIntensity?: number;
  borderColor?: string;
  shadowIntensity?: "none" | "light" | "medium" | "strong";
}

const canUseGlassView =
  Platform.OS === "ios" && isLiquidGlassAvailable() && isGlassEffectAPIAvailable();

export function GlassCard({
  children,
  style,
  borderRadius = 20,
  glassStyle = "regular",
  tintColor,
  isInteractive = false,
  blurIntensity = 72,
  borderColor = "rgba(255,255,255,0.14)",
  shadowIntensity = "medium",
}: Props) {
  const flatStyle = StyleSheet.flatten(style ?? {});
  const shadows = getShadow(shadowIntensity);

  if (canUseGlassView) {
    return (
      <View style={[{ borderRadius, overflow: "hidden" }, shadows, flatStyle]}>
        <GlassView
          style={StyleSheet.absoluteFill}
          glassEffectStyle={glassStyle}
          tintColor={tintColor}
          isInteractive={isInteractive}
        />
        <View style={[styles.glassBorder, { borderRadius, borderColor }]} />
        {children}
      </View>
    );
  }

  if (Platform.OS === "ios") {
    return (
      <View style={[{ borderRadius, overflow: "hidden" }, shadows, flatStyle]}>
        <BlurView
          intensity={blurIntensity}
          tint="dark"
          style={[StyleSheet.absoluteFill, { borderRadius }]}
        />
        <View style={[styles.glassBorder, { borderRadius, borderColor }]} />
        {children}
      </View>
    );
  }

  return (
    <View
      style={[
        {
          borderRadius,
          backgroundColor: "rgba(20,20,28,0.90)",
          borderWidth: 1,
          borderColor,
        },
        shadows,
        flatStyle,
      ]}
    >
      {children}
    </View>
  );
}

function getShadow(intensity: Props["shadowIntensity"]) {
  if (intensity === "none") return {};
  const configs = {
    light: { shadowOpacity: 0.15, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
    medium: { shadowOpacity: 0.28, shadowRadius: 18, shadowOffset: { width: 0, height: 8 } },
    strong: { shadowOpacity: 0.42, shadowRadius: 32, shadowOffset: { width: 0, height: 14 } },
  };
  return {
    shadowColor: "#000",
    elevation: intensity === "strong" ? 16 : intensity === "medium" ? 8 : 4,
    ...configs[intensity!],
  };
}

const styles = StyleSheet.create({
  glassBorder: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
  },
});
