# Pac-man
[Play][link]
[link]: shph119.github.io/Pacman/

## Overview
This project was inspired by the OG arcade game Pac-man. This version of Pac-man was created using JavaScript and Canvas. Pac-man, the yellow almost-circle, wanders around the map, eating pellets, while avoiding the four ghosts, Blinky, Pinky, Inky, and Clyde. Pac-man can eat a super-pellet (the big ones) to turn ghosts into food. The ghosts become weaker, and are reset into their base when eaten.

## Specifics
Use 'WASD' to move Pac-man around the map. Once the game is over, won or lost, press 'r' to restart the game.

### Graphics
All characters (pac-man and ghosts) were drawn individually using canvas. Many circles were harmed during the design process.

### Current Ghost AI
The current version of pac-man features a very basic AI for the ghosts. After coming out of the ghost-house, their movements will be completely random. However, they will not change directions unless they hit a wall or enter an intersection to avoid constant back and forth. 

## Future Directions
I had a lot of fun making this game, and I definitely plan on coming back to it once I have a little more free time on my hands.

### Sound Effects
First of all, I want to get the sound working. I ran into a bit of problem trying to figure out how to make the special effect sounds work a little more smoother, and didn't quiet get to perfecting the timing.

### Ghost AI
Once that is done, I want to implement the real AI for each ghost. In the original Pac-man, each of the ghosts work with different AI. Blinky, the red ghost, blindly follows pac-man, Pinky, the pink ghost, predict's pac-man's moves by 2 steps, and tries to cut him off. Inky, the teal ghost, tries to mirror Blinky's movements, trying to stay on the opposite side of pac-man. Clyde, the orange ghost, will run away from pac-man when close, and follow him when far. There's also a 'scatter mode' and 'chase mode' that comes in waves, as well as trying to run away from pac-man when weakened.
