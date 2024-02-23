const board = document.getElementById('game-board');
const instructionLogo = document.getElementById('instruction-logo');
const score = document.getElementById('score');
const highScoreText = document.getElementById('highScore');

// game variables
const gridSize = 20;
let snake = [{x: 10, y:10}];
let food = generateFood();
let highScore = 0;
let direction = 'right';
let gameInterval;
let gameSpeedDelay = 300;
let gameStarted = false;

// draw game-map, snake and food
function draw() {
    board.innerHTML = '';
    drawSnake();
    drawFood();
    updadeScore();
}

// draw the snake
function drawSnake() {
    snake.forEach((segment) => {
        const snakeElement = createGameElement('div', 'snake');
        setPosition(snakeElement, segment)
        board.appendChild(snakeElement);
    });
}

// create snake or food cube
function createGameElement(tag, className) {
    const element = document.createElement(tag);
    element.className = className;
    return element;
}

// set the position of snake or food
function setPosition(element, position) {
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}

// draw and generate food functions
function drawFood() {

    if (gameStarted) {
        const foodElement = createGameElement('div', 'food');
        setPosition(foodElement, food);
        board.appendChild(foodElement);
    }
}

function generateFood() {
    
    const x = Math.floor(Math.random() * gridSize) + 1;
    const y = Math.floor(Math.random() * gridSize) + 1;

    for (let i = 0; i < snake.length; i++) {

        if (x === snake[i].x && y === snake[i].y){
            return generateFood();

        } else {
            return {x, y};
        }
    }
}

// move the snake
function move() {
    const head = { ...snake[0] };

    switch (direction) {
        case 'right':
            head.x++;
            break;
        
        case 'left':
            head.x--;
            break;
        
        case 'up':
            head.y--;
            break;

        case 'down':
            head.y++;
            break;
    }

    snake.unshift(head);
    // snake.pop();

    if (head.x === food.x && head.y === food.y) {
        food = generateFood();
        increaseSpeed();
        clearInterval(gameInterval);
        gameInterval = setInterval(() => {
            move();
            checkCollision();
            draw();
        }, gameSpeedDelay);
  
    } else {
        snake.pop();
    }
}

// start game function
function startGame() {

    gameStarted = true;
    instructionLogo.style.display = 'none';

    gameInterval = setInterval(() => {
        console.log(gameSpeedDelay)
        move();
        checkCollision();
        draw();
    }, gameSpeedDelay);
}

// keypress event listener
function handleKeyPress(event) {

    if( (!gameStarted && event.code === 'Space') || 
    (!gameStarted && event.key === ' ')) {

        startGame();

    } else {
        switch (event.key) {
            case 'ArrowUp':
                if (direction !== 'down') {
                    direction = 'up';
                } 
                    break;
            case 'ArrowDown':
                if (direction !== 'up') {
                    direction = 'down';
                }
                    break;
            case 'ArrowRight':
                if (direction !== 'left') {
                    direction = 'right';
                }
                    break;
            case 'ArrowLeft':
                if (direction !== 'right') {
                    direction = 'left';
                }
                    break;
        }
    }
}

function increaseSpeed() {
    console.log(gameSpeedDelay);

    if (gameSpeedDelay > 150) {
        gameSpeedDelay -= 5;
    } else if (gameSpeedDelay > 100) {
        gameSpeedDelay -= 3;
    } else if (gameSpeedDelay > 50) {
        gameSpeedDelay -= 2;
    } else if (gameSpeedDelay > 25) {
        gameSpeedDelay -= 1;
    }
}

function checkCollision() {
    const head = snake[0];

    if(head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
        resetGame();         
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y){
            resetGame();
        }
    }
}

function resetGame() {
    updadeHighScore();
    stopGame();
    clearInterval(gameInterval);
    snake = [{x: 10, y: 10}];
    food = generateFood();
    direction = 'right';
    gameSpeedDelay = 300;
    updadeScore();
}

function updadeScore() {
    const currentScore = snake.length - 1;
    score.textContent = currentScore.toString().padStart(3, '0');
}

function stopGame() {
    clearInterval(gameInterval);
    gameStarted = false;
    instructionLogo.style.display = 'flex';
    gameSpeedDelay = 200;
}

function updadeHighScore() {
    const currentScore = snake.length - 1;
    if (currentScore > highScore) {
        highScore = currentScore;
        highScoreText.textContent = highScore.toString().padStart(3, '0');
    }
    highScoreText.style.display = 'block';
}

document.addEventListener('keydown', handleKeyPress);

// this will pause the game on 'p' press
document.addEventListener('keydown', (event) => {

    if (event.key === 'p' && gameStarted === true) {
        clearInterval(gameInterval);
        gameStarted = 'PAUSE';
        
    } else if (event.key = 'p' && gameStarted === 'PAUSE') {
        startGame();
    }
})