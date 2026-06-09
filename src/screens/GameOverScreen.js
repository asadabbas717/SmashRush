import React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import GameButton from "../components/GameButton";
import { COLORS, SIZES } from "../constants/theme";

export default function GameOverScreen({ score, highScore, onRestart, onHome }) {
  const isNewHighScore = score >= highScore && score > 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.emoji}>{isNewHighScore ? "🏆" : "💥"}</Text>

        <Text style={styles.title}>
          {isNewHighScore ? "New High Score!" : "Game Over"}
        </Text>

        <View style={styles.scoreBox}>
          <Text style={styles.scoreLabel}>Your Score</Text>
          <Text style={styles.score}>{score}</Text>
        </View>

        <View style={styles.scoreBoxSmall}>
          <Text style={styles.highScoreText}>High Score: {highScore}</Text>
        </View>

        <GameButton title="Restart Game" onPress={onRestart} />

        <GameButton title="Back to Home" variant="secondary" onPress={onHome} />
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
    fontSize: 68,
    marginBottom: 12,
  },

  title: {
    fontSize: 34,
    fontWeight: "900",
    color: COLORS.text,
    marginBottom: 18,
    textAlign: "center",
  },

  scoreBox: {
    backgroundColor: COLORS.backgroundSoft,
    paddingVertical: 18,
    paddingHorizontal: 44,
    borderRadius: 26,
    alignItems: "center",
    marginBottom: 12,
  },

  scoreLabel: {
    fontSize: 14,
    color: COLORS.mutedText,
    fontWeight: "700",
  },

  score: {
    fontSize: 44,
    fontWeight: "900",
    color: COLORS.primaryDark,
  },

  scoreBoxSmall: {
    marginBottom: 20,
  },

  highScoreText: {
    fontSize: 16,
    color: COLORS.mutedText,
    fontWeight: "800",
  },
});