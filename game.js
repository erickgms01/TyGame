const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
canvas.width = 500;
canvas.height = 500;

// Dimensões do labirinto
const cols = 10;  // número de colunas no labirinto
const rows = 10;  // número de linhas no labirinto
const cellSize = canvas.width / cols;

let grid = [];
let stack = [];
let player = { x: 0, y: 0, width: cellSize / 2, height: cellSize / 2 }; // posição inicial do jogador
let current;
let items = []; // lista para guardar itens
let itemCount = 3; // número de itens reduzido
let endPoint; // Ponto final do labirinto

// Array com informações sobre dor lombar
const backPainInfo = [
    "A dor lombar pode ser causada por lesões, má postura e esforços repetitivos.",
    "Exercícios de fortalecimento do core podem ajudar a prevenir a dor lombar.",
    "Mantenha uma boa ergonomia ao trabalhar em uma mesa para evitar a dor lombar.",
    "Alongamentos regulares podem aliviar a tensão na região lombar.",
    "Consultar um fisioterapeuta pode ser útil para tratar a dor lombar."
];

// Função que cria uma célula do labirinto
function Cell(x, y) {
  this.x = x;
  this.y = y;
  this.walls = [true, true, true, true]; // [top, right, bottom, left]
  this.visited = false;

  // Desenha as paredes da célula
  this.show = function() {
    const x = this.x * cellSize;
    const y = this.y * cellSize;

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;

    // Desenha as paredes
    if (this.walls[0]) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + cellSize, y);
      ctx.stroke(); // top
    }
    if (this.walls[1]) {
      ctx.beginPath();
      ctx.moveTo(x + cellSize, y);
      ctx.lineTo(x + cellSize, y + cellSize);
      ctx.stroke(); // right
    }
    if (this.walls[2]) {
      ctx.beginPath();
      ctx.moveTo(x + cellSize, y + cellSize);
      ctx.lineTo(x, y + cellSize);
      ctx.stroke(); // bottom
    }
    if (this.walls[3]) {
      ctx.beginPath();
      ctx.moveTo(x, y + cellSize);
      ctx.lineTo(x, y);
      ctx.stroke(); // left
    }

    // Preenche a célula
    if (this.visited) {
      ctx.fillStyle = 'white';
      ctx.fillRect(x, y, cellSize, cellSize);
    }
  };

  // Verifica os vizinhos não visitados
  this.checkNeighbors = function() {
    let neighbors = [];

    const top = grid[index(this.x, this.y - 1)];
    const right = grid[index(this.x + 1, this.y)];
    const bottom = grid[index(this.x, this.y + 1)];
    const left = grid[index(this.x - 1, this.y)];

    if (top && !top.visited) neighbors.push(top);
    if (right && !right.visited) neighbors.push(right);
    if (bottom && !bottom.visited) neighbors.push(bottom);
    if (left && !left.visited) neighbors.push(left);

    if (neighbors.length > 0) {
      return neighbors[Math.floor(Math.random() * neighbors.length)];
    } else {
      return undefined;
    }
  };
}

// Constrói a grade de células
function setup() {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let cell = new Cell(x, y);
      grid.push(cell);
    }
  }
  current = grid[0];

  // Define o ponto final fixo no canto inferior esquerdo
  endPoint = { x: 0, y: rows - 1 }; // Ponto final
}

// Converte as coordenadas x, y em um índice do array
function index(x, y) {
  if (x < 0 || y < 0 || x >= cols || y >= rows) {
    return -1;
  }
  return x + y * cols;
}

// Remove paredes entre a célula atual e a próxima
function removeWalls(a, b) {
  let x = a.x - b.x;
  if (x === 1) {
    a.walls[3] = false;
    b.walls[1] = false;
  } else if (x === -1) {
    a.walls[1] = false;
    b.walls[3] = false;
  }

  let y = a.y - b.y;
  if (y === 1) {
    a.walls[0] = false;
    b.walls[2] = false;
  } else if (y === -1) {
    a.walls[2] = false;
    b.walls[0] = false;
  }
}

function generateFullMaze() {
  while (stack.length > 0 || !current.visited) {
    generateMaze();
  }
}

// Gera o labirinto com o algoritmo DFS
function generateMaze() {
  current.visited = true;
  let next = current.checkNeighbors();

  if (next) {
    next.visited = true;
    stack.push(current);
    removeWalls(current, next);
    current = next;
  } else if (stack.length > 0) {
    current = stack.pop();
  }
}

// Coloca itens aleatoriamente no labirinto
function placeItems() {
  for (let i = 0; i < itemCount; i++) {
    let itemX, itemY;
    // Garante que os itens não apareçam na mesma célula do jogador ou do ponto final
    do {
      itemX = Math.floor(Math.random() * cols);
      itemY = Math.floor(Math.random() * rows);
    } while ((itemX === player.x && itemY === player.y) || (itemX === endPoint.x && itemY === endPoint.y));
    
    // Escolhe uma mensagem aleatória sobre dor lombar para cada item
    const randomInfo = backPainInfo[Math.floor(Math.random() * backPainInfo.length)];
    items.push({ x: itemX, y: itemY, collected: false, info: randomInfo });
  }
}

// Desenha o jogador
function drawPlayer() {
  ctx.fillStyle = 'blue';
  ctx.fillRect(player.x * cellSize + cellSize / 4, player.y * cellSize + cellSize / 4, player.width, player.height);
}

// Desenha os itens no labirinto
function drawItems() {
  ctx.fillStyle = 'green';
  items.forEach(item => {
    if (!item.collected) {
      ctx.fillRect(item.x * cellSize + cellSize / 4, item.y * cellSize + cellSize / 4, cellSize / 2, cellSize / 2);
    }
  });
}

// Desenha o ponto de fim
function drawEndPoint() {
  ctx.fillStyle = 'red';
  ctx.fillRect(endPoint.x * cellSize + cellSize / 4, endPoint.y * cellSize + cellSize / 4, cellSize / 2, cellSize / 2);
}

// Verifica se o jogador pegou algum item ou alcançou o ponto final
function checkCollisions() {
  items.forEach(item => {
    if (player.x === item.x && player.y === item.y && !item.collected) {
      showPopup(item.info);
      item.collected = true;
    }
  });

  // Verifica se o jogador alcançou o ponto final
  if (player.x === endPoint.x && player.y === endPoint.y) {
    showPopup("Você alcançou o ponto final! Parabéns!");
    resetGame(); // Reseta o jogo após alcançar o fim
  }
}

// Mostra o popup com a informação do item
function showPopup(text) {
  const popup = document.getElementById('popup');
  const popupText = document.getElementById('popup-text');
  popupText.textContent = text;
  popup.style.display = 'block';
}

// Fecha o popup
document.getElementById('close-popup').addEventListener('click', () => {
  document.getElementById('popup').style.display = 'none';
});

// Reseta o jogo
function resetGame() {
  player.x = 0;
  player.y = 0;
  items = [];
  stack = [];
  setup();
  generateFullMaze();
  placeItems();
}

// Função principal de loop do jogo
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  grid.forEach(cell => cell.show());
  drawItems();
  drawPlayer();
  drawEndPoint(); // Desenha o ponto final

  if (stack.length > 0) {
    generateMaze();
  }

  checkCollisions(); // Verifica colisões
}

// Movimento do jogador
window.addEventListener('keydown', (e) => {
  let newX = player.x;
  let newY = player.y;

  switch (e.key) {
    case 'ArrowUp':
      if (!grid[index(player.x, player.y)].walls[0]) newY--;
      break;
    case 'ArrowDown':
      if (!grid[index(player.x, player.y)].walls[2]) newY++;
      break;
    case 'ArrowLeft':
      if (!grid[index(player.x, player.y)].walls[3]) newX--;
      break;
    case 'ArrowRight':
      if (!grid[index(player.x, player.y)].walls[1]) newX++;
      break;
  }

  if (newX >= 0 && newX < cols && newY >= 0 && newY < rows) {
    player.x = newX;
    player.y = newY;
  }

  draw();
});

// Inicializa o labirinto e itens
setup();
generateFullMaze();
placeItems();
setInterval(draw, 100);
