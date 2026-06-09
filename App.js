import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import HomeScreen from "./src/screens/HomeScreen";
import GameScreen from "./src/screens/GameScreen";
import GameOverScreen from "./src/screens/GameOverScreen";
import {
  getHighScore,
  saveHighScore,
} from "./src/services/highScoreStorage";

export default function App() {
  const [screen, setScreen] = useState("home");
  const [highScore, setHighScore] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [gameKey, setGameKey] = useState(1);

  useEffect(() => {
    loadHighScore();
  }, []);

  const loadHighScore = async () => {
    const score = await getHighScore();
    setHighScore(score);
  };

  const startGame = () => {
    setGameKey((prev) => prev + 1);
    setScreen("game");
  };

  const handleGameOver = async (score) => {
    setFinalScore(score);
    const updatedHighScore = await saveHighScore(score);
    setHighScore(updatedHighScore);
    setScreen("gameOver");
  };

  return (
    <>
      <StatusBar style="dark" />

      {screen === "home" && (
        <HomeScreen highScore={highScore} onStartGame={startGame} />
      )}

      {screen === "game" && (
        <GameScreen
          key={gameKey}
          highScore={highScore}
          onGameOver={handleGameOver}
          onQuit={() => setScreen("home")}
          onRestart={startGame}
        />
      )}

      {screen === "gameOver" && (
        <GameOverScreen
          score={finalScore}
          highScore={highScore}
          onRestart={startGame}
          onHome={() => setScreen("home")}
        />
      )}
    </>
  );
}