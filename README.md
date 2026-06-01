# Smash Rush

**Smash Rush** is a 2D arcade-style mobile game built with **React Native Expo**. The game has three vertical lanes where enemies fall from the top of the screen. The player must tap and smash the enemies before they cross the danger line at the bottom. If an enemy crosses the line, the game is over.

## Features

* Three-lane enemy movement system
* Tap-to-smash gameplay
* Hammer smash animation effect
* Enemy squash/pie-style hit effect
* Unique sound effect for each enemy
* Background music
* Live score display
* High score saved locally
* Pause and resume game
* Restart game
* Quit to home screen
* Light and smooth user interface

## Tech Stack

* React Native
* Expo
* Expo Audio
* React Native Reanimated
* React Native Gesture Handler
* AsyncStorage

## Project Structure

```bash
assets/
  enemies/
  sounds/

src/
  components/
  constants/
  data/
  hooks/
  screens/
  services/
```

## How to Run

```bash
npm install
npx expo start
```

Then scan the QR code using **Expo Go** on your mobile device.

## Asset Customization

Enemy images and sound effects can be changed from the `assets` folder.
To add or modify enemies, update the enemy configuration file:

```bash
src/data/enemies.js
```

## Game Objective

Smash all enemies before they cross the bottom danger line. The longer you survive, the faster the enemies appear and the higher your score becomes.

## Author

Developed as a React Native Expo mobile game project.
