const canvas = document.querySelector(".canvas");
const ctx = canvas.getContext("2d");

const scale = 20;
const rows = canvas.height / scale;
const columns = canvas.width / scale;

let foodSound = new Audio("sounds/snake-hiss-95241.mp3");
let snake = [];
snake[0] = {
	x: Math.floor(Math.random() * columns) * scale,
	y: Math.floor(Math.random() * rows) * scale,
};

let food = {
	x: Math.floor(Math.random() * columns) * scale,
	y: Math.floor(Math.random() * rows) * scale,
};
let dirn = "right";

let score = 0; // Add a variable to keep track of the score

let isNightMode = false; // Variable to track night mode state

const nightModeButton = document.getElementById("nightModeButton");
nightModeButton.addEventListener("click", () => {
	toggleNightMode();
});

function toggleNightMode() {
	isNightMode = !isNightMode;

	if (isNightMode) {
		document.body.classList.add("night-mode");
	} else {
		document.body.classList.remove("night-mode");
	}
}

document.onkeydown = changeDirection;

function changeDirection(e) {
	let key = e.keyCode;

	if (key == 37 && dirn != "right") {
		dirn = "left";
	} else if (key == 38 && dirn != "down") {
		dirn = "up";
	} else if (key == 39 && dirn != "left") {
		dirn = "right";
	} else if (key == 40 && dirn != "up") {
		dirn = "down";
	}
}
let isPaused = false;
let playGame;

const pauseButton = document.getElementById("pauseButton");
const restartButton = document.getElementById("restartButton");

pauseButton.addEventListener("click", () => {
	if (!isPaused) {
		clearInterval(playGame);
		isPaused = true;
		pauseButton.textContent = "Resume";
	} else {
		playGame = setInterval(draw, 200); // Adjust the interval time as needed
		isPaused = false;
		pauseButton.textContent = "Pause";
	}
});

restartButton.addEventListener("click", () => {
	clearInterval(playGame);
	isPaused = false;
	pauseButton.textContent = "Pause";
	resetGame();
	playGame = setInterval(draw, 200); // Adjust the interval time as needed
});

function resetGame() {
	snake = [];
	snake[0] = {
		x: Math.floor(Math.random() * columns) * scale,
		y: Math.floor(Math.random() * rows) * scale,
	};
	food = {
		x: Math.floor(Math.random() * columns) * scale,
		y: Math.floor(Math.random() * rows) * scale,
	};
	dirn = "right";
	score = 0;
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// Draw the snake
	for (let i = 0; i < snake.length; i++) {
		ctx.fillStyle = "#66ffff";
		ctx.fillRect(snake[i].x, snake[i].y, scale, scale);
	}

	// Draw the food
	ctx.fillStyle = "#ff0";
	ctx.fillRect(food.x, food.y, scale, scale);

	// Draw the score
	ctx.fillStyle = "#fff";
	ctx.font = "20px Arial";
	ctx.fillText("Score: " + score, 10, 30);

	// Move the snake
	let snakeX = snake[0].x;
	let snakeY = snake[0].y;

	if (dirn == "left") snakeX -= scale;
	if (dirn == "up") snakeY -= scale;
	if (dirn == "right") snakeX += scale;
	if (dirn == "down") snakeY += scale;

	if (snakeX > canvas.width) {
		snakeX = 0;
	}
	if (snakeY > canvas.height) {
		snakeY = 0;
	}
	if (snakeX < 0) {
		snakeX = canvas.width;
	}
	if (snakeY < 0) {
		snakeY = canvas.height;
	}

	// Check if the snake eats the food
	if (snakeX == food.x && snakeY == food.y) {
		foodSound.play();
		score++;
		food = {
			x: Math.floor(Math.random() * columns) * scale,
			y: Math.floor(Math.random() * rows) * scale,
		};
	} else {
		snake.pop();
	}

	// Create a new head for the snake
	let newSnakeHead = {
		x: snakeX,
		y: snakeY,
	};

	// Check for collisions with the walls or itself
	if (
		// snakeX >= canvas.width ||
		// snakeX < 0 ||
		// snakeY >= canvas.height ||
		// snakeY < 0 ||
		eatSelf(newSnakeHead, snake)
	) {
		clearInterval(playGame);
		showGameOverScreen();
	}

	// Update the snake
	snake.unshift(newSnakeHead);
}

function eatSelf(head, array) {
	for (let i = 0; i < array.length; i++) {
		if (head.x == array[i].x && head.y == array[i].y) {
			return true;
		}
	}
	return false;
}

function showGameOverScreen() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	ctx.fillStyle = "#fff";
	ctx.font = "30px Arial";
	ctx.fillText("Game Over", canvas.width / 2 - 70, canvas.height / 2 - 30);

	ctx.fillText("Score: " + score, canvas.width / 2 - 50, canvas.height / 2);

	ctx.font = "20px Arial";
	ctx.fillText(
		"Press Enter key to play again",
		canvas.width / 2 - 110,
		canvas.height / 2 + 30
	);

	document.addEventListener("keydown", restartGameOnEnter);

	function restartGameOnEnter(event) {
		if (event.keyCode === 13) {
			// Check for Enter key (keyCode 13)
			// Reset the game state
			snake = [];
			snake[0] = {
				x: Math.floor(Math.random() * columns) * scale,
				y: Math.floor(Math.random() * rows) * scale,
			};
			score = 0;
			dirn = "right";
			food = {
				x: Math.floor(Math.random() * columns) * scale,
				y: Math.floor(Math.random() * rows) * scale,
			};
			playGame = setInterval(draw, 100);
			document.removeEventListener("keydown", restartGameOnEnter);
		}
	}
}
