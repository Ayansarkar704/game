// Get canvas and context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set canvas size
canvas.width = 400;
canvas.height = 600;

// Game settings
let score = 0;
let gameOver = false;

// Car settings
const carWidth = 50;
const carHeight = 100;
const carSpeed = 5;

const car = {
    x: canvas.width / 2 - carWidth / 2,
    y: canvas.height - carHeight - 10,
    width: carWidth,
    height: carHeight,
    speed: carSpeed,
    dx: 0,
    image: new Image(),
};

car.image.src = "https://img.icons8.com/ios/452/car.png";  // Add a car image or URL

// Obstacles
const obstacles = [];
const obstacleWidth = 50;
const obstacleHeight = 100;
const obstacleSpeed = 3;

// Controls
let leftKey = false;
let rightKey = false;

// Event listeners for controls
window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") leftKey = true;
    if (e.key === "ArrowRight") rightKey = true;
    if (e.key === "r" && gameOver) resetGame();
});

window.addEventListener("keyup", (e) => {
    if (e.key === "ArrowLeft") leftKey = false;
    if (e.key === "ArrowRight") rightKey = false;
});

// Move car
function moveCar() {
    if (leftKey && car.x > 0) car.x -= car.speed;
    if (rightKey && car.x + car.width < canvas.width) car.x += car.speed;
}

// Spawn obstacles
function spawnObstacle() {
    const x = Math.random() * (canvas.width - obstacleWidth);
    const y = -obstacleHeight;
    obstacles.push({ x, y });
}

// Draw obstacles
function drawObstacles() {
    for (let i = 0; i < obstacles.length; i++) {
        ctx.fillStyle = "red";
        ctx.fillRect(obstacles[i].x, obstacles[i].y, obstacleWidth, obstacleHeight);
    }
}

// Move obstacles
function moveObstacles() {
    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].y += obstacleSpeed;
    }
}

// Check collisions
function checkCollisions() {
    for (let i = 0; i < obstacles.length; i++) {
        if (
            car.x < obstacles[i].x + obstacleWidth &&
            car.x + car.width > obstacles[i].x &&
            car.y < obstacles[i].y + obstacleHeight &&
            car.y + car.height > obstacles[i].y
        ) {
            gameOver = true;
            document.getElementById("gameOver").style.display = "block";
            return;
        }
    }
}

// Remove off-screen obstacles
function removeOffScreenObstacles() {
    for (let i = 0; i < obstacles.length; i++) {
        if (obstacles[i].y > canvas.height) {
            obstacles.splice(i, 1);
            score++;
            document.getElementById("score").textContent = `Score: ${score}`;
        }
    }
}

// Reset the game
function resetGame() {
    score = 0;
    obstacles.length = 0;
    gameOver = false;
    document.getElementById("gameOver").style.display = "none";
    car.x = canvas.width / 2 - carWidth / 2;
    car.y = canvas.height - carHeight - 10;
    gameLoop();
}

// Game loop
function gameLoop() {
    if (gameOver) return;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Move the car
    moveCar();

    // Draw the car
    ctx.drawImage(car.image, car.x, car.y, car.width, car.height);

    // Draw and move obstacles
    drawObstacles();
    moveObstacles();

    // Check for collisions
    checkCollisions();

    // Remove obstacles that have gone off-screen
    removeOffScreenObstacles();

    // Spawn new obstacles at random intervals
    if (Math.random() < 0.02) spawnObstacle();

    // Call the game loop again
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
