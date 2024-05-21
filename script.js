const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const resolution = 10;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight / 2;
const COLS = Math.floor(canvas.width / resolution);
const ROWS = Math.floor(canvas.height / resolution);

function buildGrid() {
    return new Array(COLS).fill(null)
        .map(() => new Array(ROWS).fill(null)
        .map(() => Math.floor(Math.random() * 2)));
}

let grid = buildGrid();
let hue = 0; // 色相を初期化

function render(grid) {
    hue = (hue + 1) % 360; // 色相を更新
    for (let col = 0; col < grid.length; col++) {
        for (let row = 0; row < grid[col].length; row++) {
            const cell = grid[col][row];
            ctx.beginPath();
            ctx.rect(col * resolution, row * resolution, resolution, resolution);
            ctx.fillStyle = cell ? `hsl(${hue}, 100%, 50%)` : 'black'; // 生細胞を虹色、背景を黒色に設定
            ctx.fill();
            ctx.strokeStyle = 'black'; // マスの線の色も黒色に設定
            ctx.stroke();
        }
    }
}

function nextGen(grid) {
    const nextGen = grid.map(arr => [...arr]);
    for (let col = 0; col < grid.length; col++) {
        for (let row = 0; row < grid[col].length; row++) {
            const cell = grid[col][row];
            let numNeighbours = 0;
            for (let i = -1; i < 2; i++) {
                for (let j = -1; j < 2; j++) {
                    if (i === 0 && j === 0) {
                        continue;
                    }
                    const x_cell = col + i;
                    const y_cell = row + j;
                    if (x_cell >= 0 && y_cell >= 0 && x_cell < COLS && y_cell < ROWS) {
                        const currentNeighbour = grid[col + i][row + j];
                        numNeighbours += currentNeighbour;
                    }
                }
            }
            if (cell === 1 && numNeighbours < 2) {
                nextGen[col][row] = 0;
            } else if (cell === 1 && numNeighbours > 3) {
                nextGen[col][row] = 0;
            } else if (cell === 0 && numNeighbours === 3) {
                nextGen[col][row] = 1;
            }
        }
    }
    return nextGen;
}

function update() {
    grid = nextGen(grid);
    render(grid);
    requestAnimationFrame(update);
}

canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const col = Math.floor(x / resolution);
    const row = Math.floor(y / resolution);
    grid[col][row] = 1; // クリックしたマスを生細胞に設定
    render(grid);
});

render(grid);
requestAnimationFrame(update);
