import React, { useEffect } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { GAME_CONFIG } from "../constants/game";

export default function Enemy({
  enemy,
  laneX,
  dangerLineY,
  fallDuration,
  isPaused,
  onHit,
  onMiss,
}) {
  const translateY = useSharedValue(-GAME_CONFIG.enemySize);
  const opacity = useSharedValue(1);
  const scaleX = useSharedValue(1);
  const scaleY = useSharedValue(1);
  const rotate = useSharedValue(-18);

  const hammerOpacity = useSharedValue(0);
  const hammerScale = useSharedValue(0.5);

  const hasBeenHit = useSharedValue(false);

  const targetY = dangerLineY + 12;

  useEffect(() => {
    startFalling(fallDuration);

    return () => {
      cancelAnimation(translateY);
    };
  }, []);

  useEffect(() => {
    if (isPaused) {
      cancelAnimation(translateY);
      return;
    }

    if (!hasBeenHit.value) {
      const currentY = translateY.value;
      const remainingDistance = Math.max(targetY - currentY, 1);
      const totalDistance = targetY + GAME_CONFIG.enemySize;
      const remainingDuration = Math.max(
        (remainingDistance / totalDistance) * fallDuration,
        250
      );

      startFalling(remainingDuration);
    }
  }, [isPaused]);

  const startFalling = (duration) => {
    translateY.value = withTiming(
      targetY,
      {
        duration,
        easing: Easing.linear,
      },
      (finished) => {
        if (finished && !hasBeenHit.value) {
          runOnJS(onMiss)(enemy.instanceId);
        }
      }
    );
  };

  const handlePress = () => {
    if (hasBeenHit.value || isPaused) return;

    hasBeenHit.value = true;
    cancelAnimation(translateY);

    hammerOpacity.value = 1;
    hammerScale.value = withSequence(
      withTiming(1.25, { duration: 80 }),
      withTiming(0.95, { duration: 90 })
    );

    rotate.value = withSequence(
      withTiming(28, { duration: 90 }),
      withTiming(-8, { duration: 90 })
    );

    scaleY.value = withTiming(0.22, {
      duration: 180,
      easing: Easing.out(Easing.quad),
    });

    scaleX.value = withTiming(1.48, {
      duration: 180,
      easing: Easing.out(Easing.quad),
    });

    opacity.value = withDelay(
      150,
      withTiming(0, { duration: 150 }, () => {
        runOnJS(onHit)(enemy);
      })
    );
  };

  const enemyAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        { translateY: translateY.value },
        { scaleX: scaleX.value },
        { scaleY: scaleY.value },
      ],
    };
  });

  const hammerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: hammerOpacity.value,
      transform: [
        { translateY: translateY.value - 45 },
        { rotate: `${rotate.value}deg` },
        { scale: hammerScale.value },
      ],
    };
  });

  return (
    <>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.hammer,
          {
            left: laneX - 28,
          },
          hammerAnimatedStyle,
        ]}
      >
        <Text style={styles.hammerText}>🔨</Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.enemyWrapper,
          {
            left: laneX - GAME_CONFIG.enemySize / 2,
          },
          enemyAnimatedStyle,
        ]}
      >
        <Pressable onPress={handlePress} style={styles.pressArea}>
          <Image source={enemy.image} style={styles.enemyImage} />
          <View style={styles.softGlow} />
        </Pressable>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  enemyWrapper: {
    position: "absolute",
    top: 0,
    width: GAME_CONFIG.enemySize,
    height: GAME_CONFIG.enemySize,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 5,
  },

  pressArea: {
    width: GAME_CONFIG.enemySize,
    height: GAME_CONFIG.enemySize,
    alignItems: "center",
    justifyContent: "center",
  },

  enemyImage: {
    width: GAME_CONFIG.enemySize,
    height: GAME_CONFIG.enemySize,
    resizeMode: "contain",
    zIndex: 2,
  },

  softGlow: {
    position: "absolute",
    width: GAME_CONFIG.enemySize * 0.75,
    height: GAME_CONFIG.enemySize * 0.75,
    borderRadius: 999,
    backgroundColor: "rgba(126, 200, 227, 0.16)",
  },

  hammer: {
    position: "absolute",
    top: 0,
    width: 70,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },

  hammerText: {
    fontSize: 42,
  },
});