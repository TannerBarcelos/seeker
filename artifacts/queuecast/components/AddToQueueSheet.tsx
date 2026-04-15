import * as Haptics from "expo-haptics";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { SymbolView } from "expo-symbols";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { Episode } from "@/constants/mockData";
import { QUEUE_COLORS } from "@/constants/mockData";
import { useColors } from "@/hooks/useColors";
import { useQueues } from "@/context/QueuesContext";

const isIOS = Platform.OS === "ios";

interface Props {
  visible: boolean;
  episode: Episode | null;
  onClose: () => void;
}

export function AddToQueueSheet({ visible, episode, onClose }: Props) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { queues, addEpisodeToQueue, createQueue } = useQueues();
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [selectedColor, setSelectedColor] = useState(QUEUE_COLORS[0]);

  function handleAddToQueue(queueId: string) {
    if (!episode) return;
    addEpisodeToQueue(queueId, episode.id);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    onClose();
  }

  function handleCreateQueue() {
    if (!newName.trim() || !episode) return;
    const q = createQueue(newName.trim(), selectedColor);
    addEpisodeToQueue(q.id, episode.id);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    setCreating(false);
    setNewName("");
    onClose();
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.sheetWrapper}
      >
        <View style={[styles.sheetOuter, { paddingBottom: insets.bottom + 16 }]}>
          {isIOS ? (
            <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
          ) : (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(18,18,24,0.96)" }]} />
          )}
          <View style={[styles.glassBorder, StyleSheet.absoluteFill]} />

          <View style={styles.sheetContent}>
            <View style={[styles.handle, { backgroundColor: "rgba(255,255,255,0.25)" }]} />

            <Text style={[styles.heading, { color: colors.foreground }]}>Add to Queue</Text>
            {episode && (
              <Text style={[styles.episodeTitle, { color: colors.mutedForeground }]} numberOfLines={1}>
                {episode.title}
              </Text>
            )}

            <View style={styles.queueList}>
              {queues.map((q) => {
                const already = episode ? q.episodeIds.includes(episode.id) : false;
                return (
                  <Pressable
                    key={q.id}
                    onPress={() => !already && handleAddToQueue(q.id)}
                    style={({ pressed }) => [
                      styles.queueRow,
                      {
                        backgroundColor: pressed ? colors.glassBold : colors.glass,
                        borderColor: colors.glassBorder,
                        opacity: already ? 0.55 : 1,
                      },
                    ]}
                  >
                    <View style={[styles.queueDot, { backgroundColor: q.color }]} />
                    <Text style={[styles.queueName, { color: colors.foreground }]}>{q.name}</Text>
                    <Text style={[styles.queueCount, { color: colors.mutedForeground }]}>
                      {q.episodeIds.length} eps
                    </Text>
                    {already && (
                      isIOS ? (
                        <SymbolView name="checkmark.circle.fill" size={18} tintColor={q.color} />
                      ) : (
                        <Ionicons name="checkmark-circle" size={18} color={q.color} />
                      )
                    )}
                  </Pressable>
                );
              })}
            </View>

            {creating ? (
              <View style={styles.createForm}>
                <TextInput
                  value={newName}
                  onChangeText={setNewName}
                  placeholder="Queue name..."
                  placeholderTextColor={colors.mutedForeground}
                  style={[
                    styles.input,
                    {
                      color: colors.foreground,
                      backgroundColor: colors.glass,
                      borderColor: colors.glassBorder,
                    },
                  ]}
                  autoFocus
                  returnKeyType="done"
                  onSubmitEditing={handleCreateQueue}
                />
                <View style={styles.colorRow}>
                  {QUEUE_COLORS.map((c) => (
                    <Pressable
                      key={c}
                      onPress={() => setSelectedColor(c)}
                      style={[
                        styles.colorSwatch,
                        { backgroundColor: c },
                        selectedColor === c && styles.colorSelected,
                      ]}
                    />
                  ))}
                </View>
                <View style={styles.createActions}>
                  <Pressable
                    onPress={() => setCreating(false)}
                    style={[styles.cancelBtn, { borderColor: colors.glassBorder, backgroundColor: colors.glass }]}
                  >
                    <Text style={{ color: colors.mutedForeground, fontSize: 15 }}>Cancel</Text>
                  </Pressable>
                  <Pressable
                    onPress={handleCreateQueue}
                    style={[styles.confirmBtn, { backgroundColor: selectedColor }]}
                  >
                    <Text style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>Create & Add</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <Pressable
                onPress={() => setCreating(true)}
                style={({ pressed }) => [
                  styles.newQueueBtn,
                  {
                    borderColor: colors.glassBorder,
                    backgroundColor: pressed ? colors.glass : "transparent",
                  },
                ]}
              >
                {isIOS ? (
                  <SymbolView name="plus.circle.fill" size={20} tintColor={colors.primary} />
                ) : (
                  <Ionicons name="add-circle" size={20} color={colors.primary} />
                )}
                <Text style={[styles.newQueueText, { color: colors.primary }]}>New Queue</Text>
              </Pressable>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sheetWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  sheetOuter: {
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    overflow: "hidden",
  },
  glassBorder: {
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
  },
  sheetContent: {
    padding: 20,
    paddingTop: 12,
    gap: 12,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 8,
  },
  heading: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  episodeTitle: {
    fontSize: 13,
    marginTop: -4,
    lineHeight: 17,
  },
  queueList: {
    gap: 8,
  },
  queueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  queueDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  queueName: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
  },
  queueCount: {
    fontSize: 12,
  },
  newQueueBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderStyle: "dashed",
  },
  newQueueText: {
    fontSize: 15,
    fontWeight: "600",
  },
  createForm: {
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
  },
  colorRow: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
  },
  colorSwatch: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  colorSelected: {
    borderWidth: 3,
    borderColor: "#ffffff",
  },
  createActions: {
    flexDirection: "row",
    gap: 10,
  },
  cancelBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
  },
  confirmBtn: {
    flex: 2,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
});
