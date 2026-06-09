import { useEffect, useMemo } from "react";
import { createAudioPlayer, setAudioModeAsync } from "expo-audio";
import { BACKGROUND_MUSIC, ENEMIES } from "../data/enemies";

export default function useGameAudio({ paused, gameOver }) {
  const backgroundPlayer = useMemo(() => {
    return createAudioPlayer(BACKGROUND_MUSIC);
  }, []);

  const hitPlayers = useMemo(() => {
    const players = {};

    ENEMIES.forEach((enemy) => {
      players[enemy.id] = createAudioPlayer(enemy.hitSound);
    });

    return players;
  }, []);

  useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: false,
    }).catch((error) => {
      console.log("Audio mode error:", error);
    });
  }, []);

  useEffect(() => {
    backgroundPlayer.loop = true;
    backgroundPlayer.volume = 0.28;

    return () => {
      try {
        backgroundPlayer.pause();
        backgroundPlayer.remove();
      } catch (error) {
        console.log("Background audio cleanup error:", error);
      }
    };
  }, [backgroundPlayer]);

  useEffect(() => {
    try {
      if (!paused && !gameOver) {
        backgroundPlayer.play();
      } else {
        backgroundPlayer.pause();
      }
    } catch (error) {
      console.log("Background audio play/pause error:", error);
    }
  }, [paused, gameOver, backgroundPlayer]);

  useEffect(() => {
    return () => {
      Object.values(hitPlayers).forEach((player) => {
        try {
          player.pause();
          player.remove();
        } catch (error) {
          console.log("Hit audio cleanup error:", error);
        }
      });
    };
  }, [hitPlayers]);

  const playHitSound = async (enemyId) => {
    try {
      const player = hitPlayers[enemyId];

      if (!player) return;

      await player.seekTo(0);
      player.volume = 0.9;
      player.play();
    } catch (error) {
      console.log("Hit sound error:", error);
    }
  };

  return {
    playHitSound,
  };
}