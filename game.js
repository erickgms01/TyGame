const maze = document.getElementById('maze');
const player = document.createElement('div');
player.classList.add('player');
player.style.top = '15px';
player.style.left = '11px';
maze.appendChild(player);

const items = [];
let collectedCount = 0; 

const movementSound = new Audio("assets/songs/movement.mp3")
const coinSound = new Audio("assets/songs/coin.mp3")
// Crie os itens em locais fixos
const itemPositions = [
    { top: '15px', left: '131px', backgroundImage: "url('assets/images/itens/sleeping.png')"},
    { top: '135px', left: '371px', backgroundImage: "url('assets/images/itens/sleeping.png')"},
    { top: '15px', left: '551px', backgroundImage: "url('assets/images/itens/sleeping.png')" },
    { top: '195px', left: '431px', backgroundImage: "url('assets/images/itens/sleeping.png')" },
    { top: '300px', left: '150px', backgroundImage: "url('assets/images/itens/sleeping.png')" },
    { top: '350px', left: '50px', backgroundImage: "url('assets/images/itens/sleeping.png')" },
    { top: '25x', left: '15px', backgroundImage: "url('assets/images/itens/sleeping.png')" }
];

itemPositions.forEach((pos, index) => {
    const item = document.createElement('div');
    item.classList.add('item');
    item.style.top = pos.top;
    item.style.left = pos.left;
    item.style.backgroundImage = pos.backgroundImage;
    item.onclick = () => {
        item.style.display = 'none';
        collectedCount++;
        document.getElementById('item-counter').textContent = "Itens coletados: ${collectedCount}";
        
    };
    maze.appendChild(item);
    items.push(item);
});

let playerPosition = { top: 15, left: 11 };
function movePlayer(direction) {
    const oldPosition = { ...playerPosition };
    
    // Mover o jogador na direção especificada
    if (direction === 'up') playerPosition.top -= 20;
    if (direction === 'down') playerPosition.top += 20;
    if (direction === 'left') playerPosition.left -= 20;
    if (direction === 'right') playerPosition.left += 20;
  
    // Atualiza a posição do jogador
    player.style.top = `${playerPosition.top}px`;
    player.style.left = `${playerPosition.left}px`;

    // Detectar colisão com as paredes
    const wallElements = document.querySelectorAll('.wall');
    let collisionDetected = false;

    wallElements.forEach((wall) => {
        if (detectCollision(player, wall)) {
            collisionDetected = true;
        }
    });

    // Detectar colisão com a borda do labirinto
    const borderGame = document.querySelector('.border-game');
    const borderRect = borderGame.getBoundingClientRect();
    
    if (playerPosition.top < 0 || 
        playerPosition.left < 0 || 
        playerPosition.top + player.offsetHeight > borderRect.height || 
        playerPosition.left + player.offsetWidth > borderRect.width) {
        collisionDetected = true; 
    }

    if (collisionDetected) {
        playerPosition = oldPosition;
    }

    // Atualiza a posição do jogador caso tenha colidido
    player.style.top = `${playerPosition.top}px`;
    player.style.left = `${playerPosition.left}px`;

    // Detectar coleta de itens
    items.forEach((item, index) => {
        if (detectCollision(player, item)) {
            coinSound.play()
            item.style.display = 'none'; // Oculta o item
            collectedCount++; // Incrementa o contador
            
            document.getElementById('count').textContent = `${collectedCount}/7`;
            alert(`Você pegou o item ${index + 1}`);
        }
    });

    // Detectar chegada ao ponto final
    const endPoint = document.querySelector('.end-point');
    if (endPoint && detectCollision(player, endPoint)) {
        alert("Parabéns, você completou o labirinto!");
    }
}

function detectCollision(obj1, obj2) {
    const rect1 = obj1.getBoundingClientRect();
    const rect2 = obj2.getBoundingClientRect();
    return !(
        rect1.top > rect2.bottom ||
        rect1.right < rect2.left ||
        rect1.bottom < rect2.top ||
        rect1.left > rect2.right
    );
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp') movePlayer('up');
    if (event.key === 'ArrowDown') movePlayer('down');
    if (event.key === 'ArrowLeft') movePlayer('left');
    if (event.key === 'ArrowRight') movePlayer('right');
});

