import React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import GameButton from "../components/GameButton";
import { COLORS, SIZES } from "../constants/theme";

export default function HomeScreen({ highScore, onStartGame }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.emoji}>🔨</Text>

        <Text style={styles.title}>Smash Rush</Text>

        <Text style={styles.subtitle}>
          Hit the enemies before they cross the bottom line.
        </Text>

        <View style={styles.scoreBox}>
          <Text style={styles.scoreLabel}>High Score</Text>
          <Text style={styles.scoreValue}>{highScore}</Text>
        </View>

        <GameButton title="Start Game" onPress={onStartGame} />

        <Text style={styles.tip}>
          Game developed by Asad-Abbas.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
    padding: SIZES.screenPadding,
  },

  card: {
    width: "100%",
    backgroundColor: COLORS.card,
    borderRadius: 32,
    padding: 28,
    alignItems: "center",
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.22,
    shadowRadius: 18,
    elevation: 5,
  },

  emoji: {
    fontSize: 64,
    marginBottom: 10,
  },

  title: {
    fontSize: 40,
    fontWeight: "900",
    color: COLORS.text,
    letterSpacing: 0.5,
  },

  subtitle: {
    fontSize: 16,
    color: COLORS.mutedText,
    textAlign: "center",
    lineHeight: 24,
    marginTop: 10,
    marginBottom: 22,
  },

  scoreBox: {
    backgroundColor: COLORS.backgroundSoft,
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 22,
    marginBottom: 18,
    alignItems: "center",
  },

  scoreLabel: {
    fontSize: 13,
    color: COLORS.mutedText,
    fontWeight: "700",
  },

  scoreValue: {
    fontSize: 34,
    fontWeight: "900",
    color: COLORS.primaryDark,
  },

  tip: {
    marginTop: 18,
    color: COLORS.mutedText,
    fontSize: 13,
    textAlign: "center",
    lineHeight: 20,
  },
});