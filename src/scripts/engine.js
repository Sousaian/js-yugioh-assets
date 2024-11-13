const state = {
    score: {
        player: 0,
        computer: 0,
        scoreBox: document.getElementById("score_points"),
    },
    cardSprites: {
        avatar: document.getElementById("card_image"),
        name: document.getElementById("card_name"),
        type: document.getElementById("card_type"),
    },
    fieldCards: {
        player: document.getElementById("player_field_card"),
        computer: document.getElementById("computer_field_card"),
    },
    playerSides: {
        player1: "player_cards",
        player1Field: document.querySelector("#player_cards"),
        computer: "computer_cards",
        computerField: document.querySelector("#computer_cards"),
    },
    actions: {
        button: document.getElementById("next-duel"),
    }
};

// Enum dos fieldSides dos jogadores
const playerSides = {
    player1: "player_cards",
    computer: "computer_cards",
};

// Array com os dados das cartas
const cardData = [
    {
        id: 0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: "./src/assets/icons/dragon.png",
        WinOf: [1],
        LoseOf: [2],
    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        img: "./src/assets/icons/magician.png",
        WinOf: [2],
        LoseOf: [0],
    },
    {
        id: 2,
        name: "Exodia the Forbidden One",
        type: "Scissor",
        img: "./src/assets/icons/exodia.png",
        WinOf: [0],
        LoseOf: [1],
    }
];

// Função para escolher uma carta aleatória
function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}

// Função para criar a imagem da carta
function createCardImage(IdCard, fieldSide) {
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px"); 
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png"); 
    cardImage.setAttribute("data-id", IdCard);
    cardImage.classList.add("card");

    if (fieldSide === playerSides.player1) {
        cardImage.addEventListener("click", () => {
            setCardfield(cardImage.getAttribute("data-id"));
        });

        cardImage.addEventListener("mouseover", () => {
            drawSelectedCard(IdCard);
        });
    }


    return cardImage;
}

async function setCardfield(cardId) {
    await removeAllCardsImages();
 
    //Escolher uma carta para o computador
    let computerCardId = await getRandomCardId();
    
    await showHiddenCardFieldImages(true);
    await hiddenCardDetails();

    await drawCardsInfield(cardId, computerCardId);
    
    let duelResult = await checkDuelResult(cardId, computerCardId);
    
    await updateScore();
    await drawButton(duelResult);
}

//Definir a imagem das cartas
async function drawCardsInfield(cardId, computerCardId) {
    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;
}

// Função para mostrar as imagens das cartas
async function showHiddenCardFieldImages(value) {
    if (value === true){
        state.fieldCards.player.style.display = "block";
        state.fieldCards.computer.style.display = "block";
    }if (value === false){
        state.fieldCards.player.style.display = "none";
        state.fieldCards.computer.style.display = "none";
    }
}

// Função para esconder as imagens das cartas
async function hiddenCardDetails() {
    state.cardSprites.avatar.src = "";
    state.cardSprites.name.innerText = "Selecione Uma Carta";
    state.cardSprites.type.innerText = "";
}

// Função para resetar o duelo
async function resetDuel() {
    state.cardSprites.avatar.src ="",
    state.actions.button.style.display = "none";

    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";

    init();
}

// Função para atualizar o score
async function updateScore() {
    state.score.scoreBox.innerText = `Win : ${state.score.player} | Lose : ${state.score.computer}`;
}

// Função para desenhar o botão
async function drawButton(text) {
    state.actions.button.innerText = text;
    state.actions.button.style.display = "block";
}

// Função para verificar o resultado do duelo
async function checkDuelResult(playerCardId, computerCardId) {
    let duelResult = "Draw";
    let player_cards = cardData[playerCardId];

    if (player_cards.WinOf.includes(computerCardId)) {
        duelResult = "Win";
        state.score.player++;
    } else if (player_cards.LoseOf.includes(computerCardId)) {
        duelResult = "Lose";
        state.score.computer++;
    }
    
    await playAudio(duelResult);

    return duelResult;
}

// Função para remover as imagens das cartas quando clicar para jogar
async function removeAllCardsImages() {
    let cards = state.playerSides.computerField
    let imgElements = cards.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());

    cards = state.playerSides.player1Field
    imgElements = cards.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());
}

// Função para escolher uma carta 
async function drawSelectedCard(index) {
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = "Attribute: " + cardData[index].type;
}

// Função para criar uma carta
function drawCards(cardNumbers, fieldSide) {
    for (let i = 0; i < cardNumbers; i++) {
        const randomIdCard = getRandomCardId();
        const cardImage = createCardImage(randomIdCard, fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage);
    }
}

// Função para tocar o audio
async function playAudio(status){
    const audio = new Audio(`./src/assets/audios/${status}.wav`);

    try {
        audio.play();
    } catch {}
}

// Função para iniciar o jogo
function init() {
    showHiddenCardFieldImages(false);

    drawCards(5, playerSides.player1);
    drawCards(5, playerSides.computer);

    //Musica de fundo
    const bgm = document.getElementById("bgm");
    bgm.play();
}

init();
