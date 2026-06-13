const grid = document.querySelector(".game-grid");
const yourScoreEl = document.querySelector('.your-score');
const recordScoreEl = document.querySelector('.record-score')

let score = 0;
let bestScore = parseInt(localStorage.getItem('bestScore')) || 0;
let direction = {x:0, y:0};
let lastDirection = {x:0, y:0};
let snakeBody = [ {x:1, y:1} ];
let appleData = {x:0, y:0, element:undefined};
let gameInterval;

gameInterval = setInterval(() => {
    drawSnake();
    checkCollision();
    update();
}, 200);

updateScoreText();

function updateScoreText() {
    yourScoreEl.innerText = `Your Score : ${score}`;
    recordScoreEl.innerText = `Best Score : ${bestScore}`;

}
function drawSnake() {
    Array.from(grid.children).forEach((block) => {
        if (block.classList.contains('snake')) {
            block.remove();
        }
    })
    snakeBody.forEach((segment, i) => {
        let block = document.createElement('div');
        block.classList.add('snake');
        block.style.gridColumnStart = segment.x;
        block.style.gridRowStart = segment.y;
        grid.appendChild(block);
    })
}

function drawApple() {
    let randomX;
    let randomY;
    function randomApple() {
        randomX = Math.floor(Math.random() * 29) + 1;
        randomY = Math.floor(Math.random() * 29) + 1;
        
        let applePos = {x:randomX, y:randomY};
        
        let appleIsOnSnake = snakeBody.some(segment => isOverLapping(applePos, segment));
        if (appleIsOnSnake) randomApple();
    }
    randomApple();
    let apple = document.createElement('div');
    apple.classList.add('apple');
    apple.style.gridColumnStart = randomX;
    apple.style.gridRowStart = randomY;
    appleData = {x: randomX, y: randomY, element:apple};
    grid.appendChild(apple);
}

function checkCollision() {
    const snakeBitItSelf = snakeBody.slice(1).some(segment => {
        return isOverLapping(segment, snakeBody[0]);
    })
    if (snakeBody[0].x <= 0 || snakeBody[0].x >= 30 || snakeBody[0].y <= 0 || snakeBody[0].y >= 30) {
        clearInterval(gameInterval);
        playHitSound();
        playDeathSound();
        gameOver();
    } else if (snakeBitItSelf) {
        clearInterval(gameInterval);
        playDeathSound();
        gameOver();
    } else if (isOverLapping(snakeBody[0], appleData)) {
        grid.removeChild(appleData.element);
        playScoreSound();
        drawApple();
        ExtendSnake();
        score++;
        if (score > bestScore) {
            bestScore = score;
            localStorage.setItem('bestScore', bestScore);
        }
        updateScoreText();
    }
}

function update() {
    let direction = getDirection();
    for (let i = snakeBody.length - 2; i >= 0 ; i--) {
        snakeBody[i+1] = {...snakeBody[i]};
    }
    snakeBody[0].x += direction.x;
    snakeBody[0].y += direction.y;
}

function restartGame() {
    const popup = document.querySelector('.popup');
    if (popup) {
        popup.remove();
    }
    
    score = 0;
    updateScoreText();

    snakeBody = [{x:1, y:1}];
    direction = {x:0, y:0};
    lastDirection = {x:0, y:0};

    if (appleData.element) {
        appleData.element.remove();
    }
    drawApple();

    clearInterval(gameInterval);
    gameInterval = setInterval(() => {
        drawSnake();
        checkCollision();
        update();
    }, 200);
}

function ExtendSnake() {
    const lastSegment = snakeBody[snakeBody.length - 1];
    snakeBody.push({ ...lastSegment });
}

window.addEventListener('keydown', changeDirection);

function changeDirection(event) {
    const wasd = ['w', 'a', 's', 'd']
    let key = event.key.toLowerCase();
    switch (key) {
        case 'arrowup':
        case 'w':
            if (lastDirection.y != 0) break;
            direction = {x:0, y:-1};
            break;
        case 'arrowdown':
        case 's':
            if (lastDirection.y != 0) break;
            direction = {x:0, y:1};
            break;
        case 'arrowright':
        case 'd':
            if (lastDirection.x != 0) break;
            direction = {x:1, y:0};
            break;
        case 'arrowleft':
        case 'a':
            if (lastDirection.x != 0) break;
            direction = {x:-1, y:0};
            break;
        default:
            break;
    }
}

function getDirection() {
    lastDirection = direction;
    return direction;
}

function isOverLapping(pos1, pos2) {
    return pos1.x === pos2.x && pos1.y === pos2.y;
}

drawApple();


function playScoreSound() {
    const scoreSound = new Audio('./sfx/score.wav');
    scoreSound.currentTime = 0;
    scoreSound.play();
}

function playHitSound() {
    const hitSound = new Audio('./sfx/hit.wav');
    hitSound.currentTime = 0;
    hitSound.play();
}

function playDeathSound() {
    const deathSound = new Audio('./sfx/death.wav');
    deathSound.currentTime = 0;
    deathSound.play();
}

function gameOver() {
    const gameContainer = document.querySelector('.game-container');
    const popup = document.createElement('div');
    const popupTitle = document.createElement('span');
    const restartButton = document.createElement('button');

    popup.classList.add('popup');
    popupTitle.classList.add('popup-title');
    restartButton.classList.add('restart-button');

    popupTitle.innerText = 'GAME OVER';
    restartButton.innerText = 'Restart';
    restartButton.addEventListener('click', restartGame);

    popup.appendChild(popupTitle);
    popup.appendChild(restartButton);

    gameContainer.appendChild(popup);   
}

