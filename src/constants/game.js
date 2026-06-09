import { Dimensions } from "react-native";

export const SCREEN = Dimensions.get("window");

export const GAME_CONFIG = {
  lanesCount: 3,

  enemySize: 74,

  topOffset: 20,

  dangerLineOffsetFromBottom: 130,

  waveInterval: 950,

  minWaveInterval: 520,

  baseFallDuration: 3600,

  minFallDuration: 1700,

  maxEnemiesPerWave: 3,

  scoreDifficultyStep: 80,
};