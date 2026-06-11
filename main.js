const grid = document.querySelector(".game-grid");

let direction = { x:0, y:0};
let lastDirection = { x:0, y:0};
let snakeBody = [
    {x:1, y:1},
    {x:2, y:1},
    {x:2, y:2},
];

setInterval(() => {
    drawSnake();
    checkCollision();
    update();
}, 500);

function drawSnake() {
    snakeBody.forEach((segment, i) => {
        let block = document.createElement('div');
        block.classList.add('snake');
        block.style.gridColumnStart = segment.x;
        block.style.gridRowStart = segment.y;
        var snake = grid.appendChild(block);
    })
}

function checkCollision() {
    let gridBoundaries = grid.getBoundingClientRect();
}


update()
//restartGame()
//ExtendSnake()
window.addEventListener('keydown', changeDirection);

function changeDirection(event) {
    let key = event.key;
    switch (key) {
        case 'ArrowUp':
            direction = {x:0, y:-1};
            break;
        case 'ArrowDown':
            direction = {x:0, y:1};
            break;
        case 'ArrowRight':
            direction = {x:1, y:0};
            break;
        case 'ArrowLeft':
            direction = {x:-1, y:0};
            break;
        default:
            break;
    }
}

function getDirection() {
    let snake = document.querySelector('.snake');
    let snakeRect = snake.getBoundingClientRect();
    let snakeTop = snakeRect.top;
    let snakeBottom = snakeRect.bottom;
    let snakeLeft = snakeRect.left;
    let snakeRight = snakeRect.right;
    return snakeRect;
}