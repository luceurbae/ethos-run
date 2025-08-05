import "./style.css";

// DOM Elements
const character = document.getElementById("character");
const gameContainer = document.getElementById("game-container");
const scoreSpan = document.getElementById("score");
const startScreen = document.getElementById("start-screen");
const gameOverScreen = document.getElementById("game-over-screen");
const startButton = document.getElementById("start-button");
const restartButton = document.getElementById("restart-button");

// Game State
let isJumping = false;
let score = 0;
let isGameOver = true;
let gameLoopInterval = null;
let obstacleInterval = null;

// Jump function
function jump() {
  if (!isJumping && !isGameOver) {
    isJumping = true;
    character.classList.add("jump-animation");
    setTimeout(() => {
      character.classList.remove("jump-animation");
      isJumping = false;
    }, 500); // Must match the animation duration in CSS
  }
}

// Event listener for jump (Space key)
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    jump();
  }
});

// Generate obstacles
function generateObstacle() {
  if (isGameOver) return;

  const obstacle = document.createElement("div");
  obstacle.classList.add("obstacle");

  // Randomize obstacle height slightly
  const randomHeight = Math.floor(Math.random() * 30) + 40; // Height between 40px and 70px
  obstacle.style.height = `${randomHeight}px`;

  gameContainer.appendChild(obstacle);

  // Remove obstacle when it goes off-screen to prevent memory leaks
  setTimeout(() => {
    if (obstacle.parentElement) {
      obstacle.parentElement.removeChild(obstacle);
    }
  }, 3000); // Must match the animation duration
}

// Main game loop for collision detection and scoring
function gameLoop() {
  if (isGameOver) {
    clearInterval(gameLoopInterval);
    clearInterval(obstacleInterval);
    return;
  }

  // Update score
  score++;
  scoreSpan.textContent = score;

  // Collision detection
  const characterRect = character.getBoundingClientRect();
  const obstacles = document.querySelectorAll(".obstacle");

  obstacles.forEach((obstacle) => {
    const obstacleRect = obstacle.getBoundingClientRect();

    // A simple collision check
    if (
      characterRect.right > obstacleRect.left &&
      characterRect.left < obstacleRect.right &&
      characterRect.bottom > obstacleRect.top &&
      characterRect.top < obstacleRect.bottom
    ) {
      endGame();
    }
  });
}

// Start the game
function startGame() {
  isGameOver = false;
  score = 0;
  scoreSpan.textContent = score;

  // Hide start screen
  startScreen.style.display = "none";
  gameOverScreen.style.display = "none";

  // Clear any existing obstacles
  document.querySelectorAll(".obstacle").forEach((o) => o.remove());

  // Start game loops
  gameLoopInterval = setInterval(gameLoop, 50); // Check for collisions 20 times per second
  obstacleInterval = setInterval(generateObstacle, 2000); // Generate a new obstacle every 2 seconds
}

// End the game
function endGame() {
  isGameOver = true;
  clearInterval(gameLoopInterval);
  clearInterval(obstacleInterval);
  gameOverScreen.style.display = "flex";
}

// Event listeners for buttons
startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", startGame);
