const maze = document.getElementById('maze');
const player = document.createElement('div');
player.classList.add('player');
player.style.top = '15px';
player.style.left = '11px';
maze.appendChild(player);

const items = [];
let collectedCount = 0; 

const movementSound = new Audio("assets/game/songs/movement.mp3")
const coinSound = new Audio("assets/game/songs/coin.mp3")

function showCard(title, description, imageUrl) {
    const cardContainer = document.getElementById('card-container');
    cardContainer.style.zIndex = 1;
    // Cria o elemento do card
    const card = document.createElement('div');
    card.classList.add('item-card');
    
    // Define o conteúdo do card
    card.innerHTML = `<h2 class="card-title">${title}</h2>
    <div class="card-elements">
        <img height="400px" src="${imageUrl}" alt="${title}" class="card-image">
        <div>
            <p class="card-description">${description}</p>
            <div> 
                <button id="submit-buttom" type="button" onclick="closeCard()">→</button>
            </div> 
        </div>
    </div>`
    ;
    
  
    // Adiciona o card no container
    document.getElementById('card-container').appendChild(card);
  }
  
  // Função para remover o card (pode ser chamada ao clicar em "Fechar")
  function closeCard() {
    const cardContainer = document.getElementById('card-container');
    if (cardContainer.firstChild) {
        cardContainer.style.zIndex = -1;
        cardContainer.removeChild(cardContainer.firstChild);
    }
  }
  
// Crie os itens em locais fixos
const itemPositions = [
    { top: '15px', left: '131px',title: "rapaz", description: "",  backgroundImage: "url('./assets/game/images/itens/sleeping.png')"},
    { top: '135px', left: '371px',title: "rapaz",  description: "",  backgroundImage: "url('./assets/game/images/itens/sleeping.png')"},
    { top: '15px', left: '551px', title: "rapaz",  description: "", backgroundImage: "url('./assets/game/images/itens/sleeping.png')" },
    { top: '195px', left: '431px', title: "rapaz",  description: "", backgroundImage: "url('./assets/game/images/itens/sleeping.png')" },
    { top: '300px', left: '150px', title: "rapaz",  description: "", backgroundImage: "url('./assets/game/images/itens/sleeping.png')" },
    { top: '350px', left: '50px', title: "rapaz",  description: "", backgroundImage: "url('./assets/game/images/itens/sleeping.png')" },
    { top: '25x', left: '15px', title: "rapaz",  description: "", backgroundImage: "url('./assets/game/images/itens/sleeping.png')" }
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
        showCard(pos.title, pos.description, pos.backgroundImage);
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
            showCard('erick', 'perainda man', './assets/game/images/index/img/result1.png');
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

