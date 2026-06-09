import AsyncStorage from "@react-native-async-storage/async-storage";

const HIGH_SCORE_KEY = "SMASH_RUSH_HIGH_SCORE";

export const getHighScore = async () => {
  try {
    const storedScore = await AsyncStorage.getItem(HIGH_SCORE_KEY);
    return storedScore ? Number(storedScore) : 0;
  } catch (error) {
    console.log("High score load error:", error);
    return 0;
  }
};

export const saveHighScore = async (newScore) => {
  try {
    const currentHighScore = await getHighScore();

    if (newScore > currentHighScore) {
      await AsyncStorage.setItem(HIGH_SCORE_KEY, String(newScore));
      return newScore;
    }

    return currentHighScore;
  } catch (error) {
    console.log("High score save error:", error);
    return newScore;
  }
};