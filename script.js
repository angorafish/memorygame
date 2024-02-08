const gameContainer = document.getElementById("game");
const startGameButton = document.getElementById("start-game");
const restartGameButton = document.getElementById("restart-game");
const scoreDisplay = document.getElementById("score");
const bestScoreDisplay = document.getElementById("best-score");

let images = generateImages(24);
let shuffledImages;
let flippedCards = 0;
let card1 = null;
let card2 = null;
let matches = 0;
let score = 0;
let bestScore = parseInt(localStorage.getItem("bestScore")) || Infinity;

bestScoreDisplay.textContent = bestScore === Infinity ? "N/A" : bestScore;

startGameButton.addEventListener("click", startGame);
restartGameButton.addEventListener("click", restartGame);

function generateImages(pairs) {
    const baseImages = [
      "url('One.jpg')",
      "url('Two.jpg')",
      "url('Three.jpg')",
      "url('Four.jpg')",
      "url('Five.jpg')",
      "url('Six.jpg')",
      "url('Seven.jpg')",
      "url('Eight.jpg')",
      "url('Nine.jpg')",
      "url('Ten.jpg')",
      "url('Eleven.jpg')",
      "url('Twelve.jpg')"
    ];
    let gameImages = baseImages.slice(0, pairs);
    return shuffle([...gameImages, ...gameImages]);
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // swap elements
}
return array;
}

function createDivsForImages(imageArray) {
    gameContainer.innerHTML = '';
    for (let imageUrl of imageArray) {
        const newDiv = document.createElement("div");
        newDiv.classList.add("card");
        newDiv.dataset.image = imageUrl;
        newDiv.addEventListener("click", handleCardClick);
        gameContainer.append(newDiv);
    }
}

function handleCardClick(event) {
    if (flippedCards >= 2) {
        return;
    }

    let clickedCard = event.target;
    if (clickedCard === card1 || clickedCard.classList.contains('flipped')) {
        return;
    }

    clickedCard.style.backgroundImage = clickedCard.dataset.image;
    clickedCard.classList.add('flipped');

    if (!card1 || !card2) {
        flippedCards++;
        if (!card1) {
            card1 = clickedCard;
        } else if (!card2) {
            card2 = clickedCard;

            if (card1.dataset.image === card2.dataset.image) {
                matches++;
                checkForWin();
                flippedCards = 0;
                card1 = null;
                card2 = null;
            } else {
                setTimeout(() => {
                    resetCards();
                }, 1000);
            }
        }
    }
}

function resetCards() {
    if (card1 && card2 && card1.dataset.image !== card2.dataset.image) {
        card1.style.backgroundImage = 'none';
        card2.style.backgroundImage = 'none';
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
    }
    flippedCards = 0;
    card1 = null;
    card2 = null;
}

function checkForWin() {
    if (matches === images.length / 2) {
        alert("Congratulations! You've won!");
        updateBestScore();
        restartGameButton.style.display = 'block';
    }
}

function startGame() {
    shuffledImages = generateImages(12);
    createDivsForImages(shuffledImages);
    startGameButton.style.display = 'none';
    restartGameButton.style.display = 'none';
    matches = 0;
    score = 0;
    updateScoreDisplay();
}

function restartGame() {
    startGame();
    restartGameButton.style.display = 'none';
}

function updateScoreDisplay() {
    scoreDisplay.textContent = score;
}

function updateBestScore() {
    if (score < bestScore) {
        bestScore = score;
        localStorage.setItem("bestScore", bestScore);
        bestScoreDisplay.textContent = bestScore;
    }
}