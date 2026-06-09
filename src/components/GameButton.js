import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { COLORS } from "../constants/theme";

export default function GameButton({
  title,
  onPress,
  variant = "primary",
  small = false,
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        small && styles.smallButton,
        variant === "secondary" && styles.secondaryButton,
        variant === "danger" && styles.dangerButton,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.text, small && styles.smallText]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    paddingHorizontal: 28,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },

  secondaryButton: {
    backgroundColor: COLORS.secondary,
  },

  dangerButton: {
    backgroundColor: COLORS.danger,
  },

  smallButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginVertical: 0,
  },

  pressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.85,
  },

  text: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0.3,
  },

  smallText: {
    fontSize: 13,
  },
});