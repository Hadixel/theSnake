const grid = document.querySelector(".game-grid");

let direction = { x:0, y:0};
let lastDirection = { x:0, y:0};
let snakeBody = [
    {x:1, y:1},
];

let appleData = { x:0, y:0, element:undefined };

setInterval(() => {
    drawSnake();
    checkCollision();
    update();
}, 200);

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
        randomX = Math.floor(Math.random() * 30) + 1;
        randomY = Math.floor(Math.random() * 30) + 1;

        let appleIsOnSnake = snakeBody.some(segment => segment.x === randomX && segment.y === randomY);

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
    if (snakeBody[0].x == appleData.x && snakeBody[0].y == appleData.y) {
        grid.removeChild(appleData.element);
        drawApple();
        ExtendSnake();
        return;
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
//restartGame()
function ExtendSnake() {
    let newTail = { x:snakeBody[snakeBody.length - 1].x + Math.abs(direction.x), y:snakeBody[snakeBody.length - 1] + Math.abs(direction.y)};
    snakeBody.push(newTail);
}
window.addEventListener('keydown', changeDirection);

function changeDirection(event) {
    let key = event.key;
    switch (key) {
        case 'ArrowUp':
            if (lastDirection.y != 0) break;
            direction = {x:0, y:-1};
            break;
        case 'ArrowDown':
            if (lastDirection.y != 0) break;
            direction = {x:0, y:1};
            break;
        case 'ArrowRight':
            if (lastDirection.x != 0) break;
            direction = {x:1, y:0};
            break;
        case 'ArrowLeft':
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

drawApple();