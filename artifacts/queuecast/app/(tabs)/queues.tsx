import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { QUEUE_COLORS } from "@/constants/mockData";
import type { Episode } from "@/constants/mockData";
import { useColors } from "@/hooks/useColors";
import { useQueues } from "@/context/QueuesContext";
import { usePlayer } from "@/context/PlayerContext";
import { AddToQueueSheet } from "@/components/AddToQueueSheet";
import { EpisodeRow } from "@/components/EpisodeRow";

export default function QueuesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { queues, activeQueueId, setActiveQueueId, createQueue, deleteQueue, renameQueue, removeEpisodeFromQueue, getEpisodesForQueue } = useQueues();
  const { play, currentEpisode, currentQueueId } = usePlayer();
  const [expandedId, setExpandedId] = useState<string | null>(activeQueueId);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [selectedColor, setSelectedColor] = useState(QUEUE_COLORS[0]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [sheetEpisode, setSheetEpisode] = useState<Episode | null>(null);

  const topInset = Platform.OS === "web" ? 67 : insets.top;
  const bottomInset = Platform.OS === "web" ? 34 : 0;

  function handleCreateQueue() {
    if (!newName.trim()) return;
    createQueue(newName.trim(), selectedColor);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    setCreating(false);
    setNewName("");
  }

  function handleDeleteQueue(id: string, name: string) {
    Alert.alert("Delete Queue", `Delete "${name}"? Episodes won't be removed from Seeker.`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteQueue(id);
          if (expandedId === id) setExpandedId(null);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
        },
      },
    ]);
  }

  function handleEditQueue(id: string, name: string) {
    setEditingId(id);
    setEditName(name);
  }

  function handleSaveRename() {
    if (editingId && editName.trim()) {
      renameQueue(editingId, editName.trim());
    }
    setEditingId(null);
    setEditName("");
  }

  function handlePlayFromQueue(queueId: string, episodeIndex: number) {
    const episodes = getEpisodesForQueue(queueId);
    const ep = episodes[episodeIndex];
    if (ep) {
      setActiveQueueId(queueId);
      play(ep, queueId);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    }
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
      <View style={styles.titleRow}>
        <Text style={[styles.title, { color: colors.foreground }]}>My Queues</Text>
        <Pressable
          onPress={() => setCreating(!creating)}
          style={[styles.addBtn, { backgroundColor: creating ? colors.secondary : colors.primary }]}
        >
          <Ionicons name={creating ? "close" : "add"} size={20} color={creating ? colors.foreground : colors.primaryForeground} />
        </Pressable>
      </View>

      <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
        Separate your episodes by topic — no more losing your place
      </Text>

      {creating && (
        <View style={[styles.createCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.createLabel, { color: colors.foreground }]}>New Queue</Text>
          <TextInput
            value={newName}
            onChangeText={setNewName}
            placeholder="Queue name..."
            placeholderTextColor={colors.mutedForeground}
            style={[styles.input, { color: colors.foreground, backgroundColor: colors.secondary, borderColor: colors.border }]}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={handleCreateQueue}
          />
          <View style={styles.colorRow}>
            {QUEUE_COLORS.map((c) => (
              <Pressable
                key={c}
                onPress={() => setSelectedColor(c)}
                style={[styles.colorSwatch, { backgroundColor: c }, selectedColor === c && styles.colorSelected]}
              />
            ))}
          </View>
          <Pressable
            onPress={handleCreateQueue}
            style={[styles.createBtn, { backgroundColor: selectedColor }]}
          >
            <Text style={styles.createBtnText}>Create Queue</Text>
          </Pressable>
        </View>
      )}

      {queues.map((queue) => {
        const episodes = getEpisodesForQueue(queue.id);
        const isExpanded = expandedId === queue.id;
        const isActive = activeQueueId === queue.id;
        const isPlayingHere = currentQueueId === queue.id;

        return (
          <View key={queue.id} style={[styles.queueCard, { backgroundColor: colors.card, borderColor: isActive ? queue.color : colors.border }]}>
            <Pressable
              onPress={() => setExpandedId(isExpanded ? null : queue.id)}
              style={styles.queueHeader}
            >
              <View style={[styles.queueColorBar, { backgroundColor: queue.color }]} />

              <View style={styles.queueMeta}>
                {editingId === queue.id ? (
                  <TextInput
                    value={editName}
                    onChangeText={setEditName}
                    style={[styles.renameInput, { color: colors.foreground, borderColor: queue.color }]}
                    autoFocus
                    returnKeyType="done"
                    onSubmitEditing={handleSaveRename}
                    onBlur={handleSaveRename}
                  />
                ) : (
                  <Text style={[styles.queueName, { color: colors.foreground }]}>{queue.name}</Text>
                )}
                <Text style={[styles.queueCount, { color: colors.mutedForeground }]}>
                  {episodes.length} episodes{isPlayingHere ? " · Playing" : ""}
                </Text>
              </View>

              <View style={styles.queueActions}>
                {isActive ? (
                  <View style={[styles.activeBadge, { backgroundColor: queue.color + "30" }]}>
                    <Text style={[styles.activeBadgeText, { color: queue.color }]}>Active</Text>
                  </View>
                ) : (
                  <Pressable
                    onPress={() => {
                      setActiveQueueId(queue.id);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                    }}
                    style={[styles.setActiveBtn, { borderColor: queue.color }]}
                  >
                    <Text style={[styles.setActiveBtnText, { color: queue.color }]}>Set Active</Text>
                  </Pressable>
                )}

                <Pressable
                  onPress={() => episodes.length > 0 && handlePlayFromQueue(queue.id, queue.currentIndex)}
                  style={[styles.playQueueBtn, { backgroundColor: episodes.length > 0 ? queue.color : colors.secondary }]}
                >
                  <Ionicons name="play" size={14} color={episodes.length > 0 ? "#fff" : colors.mutedForeground} />
                </Pressable>

                <Pressable onPress={() => setExpandedId(isExpanded ? null : queue.id)}>
                  <Ionicons
                    name={isExpanded ? "chevron-up" : "chevron-down"}
                    size={18}
                    color={colors.mutedForeground}
                  />
                </Pressable>
              </View>
            </Pressable>

            {isExpanded && (
              <View style={styles.episodeList}>
                <View style={[styles.divider, { backgroundColor: colors.border }]} />

                {episodes.length === 0 ? (
                  <View style={styles.emptyState}>
                    <Ionicons name="list" size={32} color={colors.mutedForeground} />
                    <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                      No episodes yet. Long-press any episode to add it here.
                    </Text>
                  </View>
                ) : (
                  episodes.map((ep, idx) => (
                    <View key={ep.id} style={styles.episodeWrapper}>
                      <EpisodeRow
                        episode={ep}
                        queueId={queue.id}
                        isActive={idx === queue.currentIndex}
                        queueColor={queue.color}
                        index={idx}
                        onLongPress={(e) => setSheetEpisode(e)}
                      />
                      <Pressable
                        onPress={() => removeEpisodeFromQueue(queue.id, ep.id)}
                        hitSlop={8}
                        style={styles.removeBtn}
                      >
                        <Ionicons name="close-circle" size={18} color={colors.mutedForeground} />
                      </Pressable>
                    </View>
                  ))
                )}

                <View style={styles.queueFooter}>
                  <Pressable onPress={() => handleEditQueue(queue.id, queue.name)} style={styles.footerBtn}>
                    <Ionicons name="pencil" size={14} color={colors.mutedForeground} />
                    <Text style={[styles.footerBtnText, { color: colors.mutedForeground }]}>Rename</Text>
                  </Pressable>
                  <Pressable onPress={() => handleDeleteQueue(queue.id, queue.name)} style={styles.footerBtn}>
                    <Ionicons name="trash-outline" size={14} color={colors.destructive} />
                    <Text style={[styles.footerBtnText, { color: colors.destructive }]}>Delete</Text>
                  </Pressable>
                </View>
              </View>
            )}
          </View>
        );
      })}

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
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  title: { fontSize: 32, fontWeight: "800", letterSpacing: -1 },
  subtitle: { fontSize: 13, lineHeight: 18, marginBottom: 8, marginTop: -8 },
  addBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  createCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  createLabel: { fontSize: 15, fontWeight: "700" },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
  },
  colorRow: { flexDirection: "row", gap: 10, flexWrap: "wrap" },
  colorSwatch: { width: 28, height: 28, borderRadius: 14 },
  colorSelected: { borderWidth: 3, borderColor: "#ffffff" },
  createBtn: {
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  createBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  queueCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  queueHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12,
  },
  queueColorBar: {
    width: 4,
    height: 40,
    borderRadius: 2,
  },
  queueMeta: { flex: 1, gap: 2 },
  queueName: { fontSize: 17, fontWeight: "700" },
  queueCount: { fontSize: 12 },
  renameInput: {
    fontSize: 17,
    fontWeight: "700",
    borderBottomWidth: 2,
    paddingVertical: 2,
  },
  queueActions: { flexDirection: "row", alignItems: "center", gap: 8 },
  activeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  activeBadgeText: { fontSize: 11, fontWeight: "700" },
  setActiveBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  setActiveBtnText: { fontSize: 11, fontWeight: "600" },
  playQueueBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 2,
  },
  divider: { height: 1, marginHorizontal: 14, marginBottom: 10 },
  episodeList: { paddingHorizontal: 14, paddingBottom: 14 },
  episodeWrapper: { position: "relative" },
  removeBtn: {
    position: "absolute",
    top: 8,
    right: -4,
    zIndex: 10,
  },
  emptyState: {
    alignItems: "center",
    gap: 8,
    paddingVertical: 24,
  },
  emptyText: {
    fontSize: 13,
    textAlign: "center",
    maxWidth: 260,
    lineHeight: 18,
  },
  queueFooter: {
    flexDirection: "row",
    gap: 16,
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.06)",
  },
  footerBtn: { flexDirection: "row", alignItems: "center", gap: 4 },
  footerBtnText: { fontSize: 13 },
});
