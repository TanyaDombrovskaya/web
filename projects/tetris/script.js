// ====== НАСТРОЙКИ ИГРЫ ======
const COLS = 20;
const ROWS = 20;
const BLOCK_SIZE = 30;

const canvas = document.getElementById('tetris-canvas');
const ctx = canvas.getContext('2d');

canvas.width = COLS * BLOCK_SIZE;
canvas.height = ROWS * BLOCK_SIZE;

// Цвета фигур
const COLORS = {
    I: '#00f0f0',
    O: '#f0f000',
    T: '#a000f0',
    S: '#00f000',
    Z: '#f00000',
    J: '#0000f0',
    L: '#f0a000'
};

// Формы фигур
const SHAPES = {
    I: [[1, 1, 1, 1]],
    O: [[1, 1],
        [1, 1]],
    T: [[0, 1, 0],
        [1, 1, 1]],
    S: [[0, 1, 1],
        [1, 1, 0]],
    Z: [[1, 1, 0],
        [0, 1, 1]],
    J: [[1, 0, 0],
        [1, 1, 1]],
    L: [[0, 0, 1],
        [1, 1, 1]]
};

// ====== СОСТОЯНИЕ ИГРЫ ======
let board = [];
let currentPiece = null;
let gameOver = false;
let gameRunning = false;
let dropInterval = 500;
let lastDropTime = 0;
let score = 0;

// ====== ИНИЦИАЛИЗАЦИЯ ======
function createBoard() {
    board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
}

function randomPiece() {
    const types = Object.keys(SHAPES);
    const type = types[Math.floor(Math.random() * types.length)];
    const shape = SHAPES[type].map(row => [...row]);
    return {
        shape,
        color: COLORS[type],
        x: Math.floor((COLS - shape[0].length) / 2),
        y: 0
    };
}

// ====== ОТРИСОВКА ======
function drawBlock(x, y, color, size = BLOCK_SIZE) {
    ctx.fillStyle = color;
    ctx.fillRect(x * size, y * size, size, size);
}

function draw() {
    ctx.fillStyle = '#0d0b2b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= COLS; i++) {
        ctx.beginPath();
        ctx.moveTo(i * BLOCK_SIZE, 0);
        ctx.lineTo(i * BLOCK_SIZE, canvas.height);
        ctx.stroke();
    }
    for (let j = 0; j <= ROWS; j++) {
        ctx.beginPath();
        ctx.moveTo(0, j * BLOCK_SIZE);
        ctx.lineTo(canvas.width, j * BLOCK_SIZE);
        ctx.stroke();
    }

    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            if (board[y][x]) drawBlock(x, y, board[y][x]);
        }
    }

    if (currentPiece) {
        const { shape, color, x: px, y: py } = currentPiece;
        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                if (shape[y][x]) drawBlock(px + x, py + y, color);
            }
        }
    }

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Score: ' + score, 10, 25);

    if (gameOver) {
        ctx.fillStyle = 'rgba(0,0,0,0.75)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 36px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 10);
        ctx.font = '20px Arial';
        ctx.fillText('Score: ' + score, canvas.width / 2, canvas.height / 2 + 30);
        ctx.textAlign = 'left';
    }
}

// ====== ЛОГИКА ======
function collides(shape, offX, offY) {
    for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
            if (!shape[y][x]) continue;
            const nx = offX + x;
            const ny = offY + y;
            if (nx < 0 || nx >= COLS || ny >= ROWS) return true;
            if (ny >= 0 && board[ny][nx]) return true;
        }
    }
    return false;
}

function mergePiece() {
    const { shape, color, x: px, y: py } = currentPiece;
    for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
            if (shape[y][x]) {
                const ny = py + y;
                const nx = px + x;
                if (ny >= 0) board[ny][nx] = color;
            }
        }
    }
}

function rotate(shape) {
    const N = shape.length;
    const M = shape[0].length;
    const rotated = Array.from({ length: M }, () => Array(N).fill(0));
    for (let y = 0; y < N; y++) {
        for (let x = 0; x < M; x++) {
            rotated[x][N - 1 - y] = shape[y][x];
        }
    }
    return rotated;
}

function rotatePiece() {
    if (!currentPiece) return;
    const rotated = rotate(currentPiece.shape);
    const kicks = [0, -1, 1, -2, 2];
    for (const dx of kicks) {
        if (!collides(rotated, currentPiece.x + dx, currentPiece.y)) {
            currentPiece.shape = rotated;
            currentPiece.x += dx;
            return;
        }
    }
}

function movePiece(dx) {
    if (!currentPiece) return;
    if (!collides(currentPiece.shape, currentPiece.x + dx, currentPiece.y)) {
        currentPiece.x += dx;
    }
}

function dropPiece() {
    if (!currentPiece) return;
    if (!collides(currentPiece.shape, currentPiece.x, currentPiece.y + 1)) {
        currentPiece.y++;
    } else {
        lockPiece();
    }
}

function hardDrop() {
    if (!currentPiece) return;
    while (!collides(currentPiece.shape, currentPiece.x, currentPiece.y + 1)) {
        currentPiece.y++;
        score += 1;
    }
    lockPiece();
}

function lockPiece() {
    mergePiece();
    clearLines();
    currentPiece = randomPiece();
    if (collides(currentPiece.shape, currentPiece.x, currentPiece.y)) {
        gameOver = true;
        gameRunning = false;
    }
}

function clearLines() {
    let linesCleared = 0;
    for (let y = ROWS - 1; y >= 0; y--) {
        if (board[y].every(cell => cell)) {
            board.splice(y, 1);
            board.unshift(Array(COLS).fill(null));
            linesCleared++;
            y++;
        }
    }

    const points = [0, 100, 300, 500, 800];
    score += points[linesCleared] || 0;
}

// ====== ИГРОВОЙ ЦИКЛ ======
function update(time = 0) {
    if (!gameRunning) {
        draw();
        return;
    }

    const delta = time - lastDropTime;
    if (delta > dropInterval) {
        dropPiece();
        lastDropTime = time;
    }

    draw();
    requestAnimationFrame(update);
}

// ====== УПРАВЛЕНИЕ ======
document.addEventListener('keydown', (e) => {
    if (!gameRunning || gameOver) return;
    switch (e.key) {
        case 'ArrowLeft':  movePiece(-1); break;
        case 'ArrowRight': movePiece(1);  break;
        case 'ArrowDown':  dropPiece();   break;
        case 'ArrowUp':    rotatePiece(); break;
        case ' ':
            hardDrop();
            e.preventDefault();
            break;
    }
    draw();
});

// ====== КНОПКА PLAY ======
const playButton = document.querySelector('.play-button');

playButton.addEventListener('click', () => {
    createBoard();
    score = 0;
    gameOver = false;
    currentPiece = randomPiece();
    lastDropTime = performance.now();
    gameRunning = true;

    playButton.textContent = 'Restart';

    update();
});

createBoard();
draw();