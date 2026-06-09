import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import Enemy from "../components/Enemy";
import GameButton from "../components/GameButton";
import { GAME_CONFIG } from "../constants/game";
import { COLORS } from "../constants/theme";
import { ENEMIES } from "../data/enemies";
import useGameAudio from "../hooks/useGameAudio";

export default function GameScreen({
  highScore,
  onGameOver,
  onQuit,
  onRestart,
}) {
  const { width, height } = useWindowDimensions();

  const [enemies, setEnemies] = useState([]);
  const [score, setScore] = useState(0);
  const [paused, setPaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const scoreRef = useRef(0);
  const gameOverRef = useRef(false);
  const enemyCounter = useRef(1);

  const { playHitSound } = useGameAudio({ paused, gameOver });

  const gameWidth = width;
  const gameHeight = height;
  const dangerLineY = gameHeight - GAME_CONFIG.dangerLineOffsetFromBottom;

  const laneCenters = useMemo(() => {
    const padding = 24;
    const usableWidth = gameWidth - padding * 2;
    const laneWidth = usableWidth / GAME_CONFIG.lanesCount;

    return [0, 1, 2].map((laneIndex) => {
      return padding + laneWidth * laneIndex + laneWidth / 2;
    });
  }, [gameWidth]);

  const currentFallDuration = useMemo(() => {
    const difficultyLevel = Math.floor(score / GAME_CONFIG.scoreDifficultyStep);
    return Math.max(
      GAME_CONFIG.baseFallDuration - difficultyLevel * 300,
      GAME_CONFIG.minFallDuration
    );
  }, [score]);

  const currentWaveInterval = useMemo(() => {
    const difficultyLevel = Math.floor(score / GAME_CONFIG.scoreDifficultyStep);
    return Math.max(
      GAME_CONFIG.waveInterval - difficultyLevel * 55,
      GAME_CONFIG.minWaveInterval
    );
  }, [score]);

  const getRandomEnemyType = () => {
    const randomIndex = Math.floor(Math.random() * ENEMIES.length);
    return ENEMIES[randomIndex];
  };

  const createEnemy = (laneIndex) => {
    const enemyType = getRandomEnemyType();

    return {
      instanceId: `enemy-${Date.now()}-${enemyCounter.current++}`,
      typeId: enemyType.id,
      name: enemyType.name,
      image: enemyType.image,
      points: enemyType.points,
      laneIndex,
    };
  };

  const spawnWave = useCallback(() => {
    if (paused || gameOverRef.current) return;

    const laneIndexes = [0, 1, 2].sort(() => Math.random() - 0.5);

    let enemiesInWave = 1;

    if (score > 60) enemiesInWave = 2;
    if (score > 160) enemiesInWave = Math.random() > 0.5 ? 2 : 3;

    const newEnemies = laneIndexes
      .slice(0, enemiesInWave)
      .map((laneIndex) => createEnemy(laneIndex));

    setEnemies((prev) => [...prev, ...newEnemies]);
  }, [paused, score]);

  useEffect(() => {
    const firstWaveTimer = setTimeout(() => {
      spawnWave();
    }, 500);

    return () => clearTimeout(firstWaveTimer);
  }, []);

  useEffect(() => {
    if (paused || gameOver) return;

    const waveTimer = setInterval(() => {
      spawnWave();
    }, currentWaveInterval);

    return () => clearInterval(waveTimer);
  }, [paused, gameOver, currentWaveInterval, spawnWave]);

  const removeEnemy = (enemyInstanceId) => {
    setEnemies((prev) =>
      prev.filter((enemy) => enemy.instanceId !== enemyInstanceId)
    );
  };

  const handleEnemyHit = async (enemy) => {
    if (gameOverRef.current) return;

    await playHitSound(enemy.typeId);

    removeEnemy(enemy.instanceId);

    const newScore = scoreRef.current + enemy.points;
    scoreRef.current = newScore;
    setScore(newScore);
  };

  const finishGame = useCallback(() => {
    if (gameOverRef.current) return;

    gameOverRef.current = true;
    setGameOver(true);
    setPaused(true);
    setEnemies([]);

    setTimeout(() => {
      onGameOver(scoreRef.current);
    }, 350);
  }, [onGameOver]);

  const handleEnemyMiss = () => {
    finishGame();
  };

  const handlePauseResume = () => {
    if (gameOver) return;
    setPaused((prev) => !prev);
  };

  const handleQuit = () => {
    setPaused(true);

    Alert.alert("Quit Game", "Do you want to quit this game?", [
      {
        text: "Cancel",
        style: "cancel",
        onPress: () => setPaused(false),
      },
      {
        text: "Quit",
        style: "destructive",
        onPress: onQuit,
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.label}>Score</Text>
          <Text style={styles.score}>{score}</Text>
        </View>

        <View style={styles.centerTop}>
          <Text style={styles.gameTitle}>Smash Rush</Text>
          <Text style={styles.highScore}>Best: {highScore}</Text>
        </View>

        <View>
          <Text style={styles.label}>Speed</Text>
          <Text style={styles.score}>
            {Math.round(GAME_CONFIG.baseFallDuration / currentFallDuration)}x
          </Text>
        </View>
      </View>

      <View style={styles.controls}>
        <GameButton
          title={paused ? "Resume" : "Pause"}
          small
          variant="secondary"
          onPress={handlePauseResume}
        />
        <GameButton title="Restart" small onPress={onRestart} />
        <GameButton title="Quit" small variant="danger" onPress={handleQuit} />
      </View>

      <View style={styles.gameArea}>
        {[0, 1, 2].map((laneIndex) => (
          <View
            key={laneIndex}
            style={[
              styles.lane,
              laneIndex !== 2 && styles.laneBorder,
              {
                width: gameWidth / GAME_CONFIG.lanesCount,
              },
            ]}
          />
        ))}

        <View
          style={[
            styles.dangerLine,
            {
              top: dangerLineY,
            },
          ]}
        >
          <Text style={styles.dangerText}>Danger Line</Text>
        </View>

        {enemies.map((enemy) => (
          <Enemy
            key={enemy.instanceId}
            enemy={enemy}
            laneX={laneCenters[enemy.laneIndex]}
            dangerLineY={dangerLineY}
            fallDuration={currentFallDuration}
            isPaused={paused}
            onHit={handleEnemyHit}
            onMiss={handleEnemyMiss}
          />
        ))}

        {paused && !gameOver && (
          <View style={styles.pauseOverlay}>
            <Text style={styles.pauseIcon}>⏸</Text>
            <Text style={styles.pauseText}>Game Paused</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  topBar: {
    paddingTop: 10,
    paddingHorizontal: 18,
    paddingBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },

  centerTop: {
    alignItems: "center",
  },

  gameTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: COLORS.text,
  },

  label: {
    fontSize: 12,
    color: COLORS.mutedText,
    fontWeight: "700",
  },

  score: {
    fontSize: 26,
    fontWeight: "900",
    color: COLORS.primaryDark,
  },

  highScore: {
    marginTop: 2,
    color: COLORS.mutedText,
    fontWeight: "700",
    fontSize: 13,
  },

  controls: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    paddingHorizontal: 12,
    paddingBottom: 10,
  },

  gameArea: {
    flex: 1,
    overflow: "hidden",
    backgroundColor: COLORS.backgroundSoft,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    flexDirection: "row",
  },

  lane: {
    height: "100%",
    backgroundColor: COLORS.lane,
    opacity: 0.55,
  },

  laneBorder: {
    borderRightWidth: 2,
    borderRightColor: COLORS.laneBorder,
  },

  dangerLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: COLORS.dangerDark,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },

  dangerText: {
    position: "absolute",
    top: -24,
    fontSize: 12,
    color: COLORS.dangerDark,
    fontWeight: "900",
    backgroundColor: "rgba(255,255,255,0.75)",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
  },

  pauseOverlay: {
    position: "absolute",
    left: 24,
    right: 24,
    top: "35%",
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 28,
    padding: 28,
    alignItems: "center",
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 15,
    elevation: 5,
  },

  pauseIcon: {
    fontSize: 42,
    marginBottom: 8,
  },

  pauseText: {
    fontSize: 24,
    fontWeight: "900",
    color: COLORS.text,
  },
});