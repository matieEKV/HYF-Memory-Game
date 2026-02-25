import { startTimer, stopTimer, resetTimer } from "./timer.js";
import {
  openModal,
  createMessageEl,
  closeModal,
  getUserName,
} from "./modal.js";
import { getRandomDeck, getRandomSize } from "./fallback.js";
import { gameState } from "./game-state.js";

const timeDisplay = document.querySelector(".showTime");
const startGame = document.querySelector(".start-game");
const gridContainer = document.querySelector(".grid-container");
const counterElement = document.querySelector(".counter");
const gameStart = document.querySelector(".modal-start");
const gameEnd = document.querySelector(".modal-end");
const restartButton = document.querySelector(".restart");
const startNewGame = document.querySelector(".reopen-options");

// ===== CLOSE THE MODAL ONCE BUTTON IS CLICKED =====
startGame?.addEventListener("click", () => {
  closeModal();
  fetchData();
});

// ===== RESTART SAME BOARD ONCE BUTTON IS CLICKED =====
restartButton?.addEventListener("click", () => {
  restart();
});

// ===== OPEN OPTIONS TO START NEW BOARD =====
startNewGame?.addEventListener("click", () => {
  openModal(gameStart, gameEnd);
  gridContainer.innerHTML = "";
  resetStats();
});

// ===== SHOW INITIAL SCORE =====
counterElement.textContent = gameState.counter;

// ===== GET DATA FROM DATABASE =====
function fetchData() {
  //get the value of the clicked card

  let selectedSize = document.querySelector(
    "input[name=board_size]:checked",
  )?.value;
  let deck = document.querySelector(
    "input[name=deck_selection]:checked",
  )?.value;

  //select the size of the grid based on the number of cards
  if (!deck) {
    deck = getRandomDeck();
  }
  if (!selectedSize) {
    selectedSize = getRandomSize();
  }
  gridContainer.classList.remove("grid-small", "grid-medium", "grid-large");
  if (selectedSize === "9") {
    gridContainer?.classList.add("grid-small");
    gameState.basePoints = 100;
  } else if (selectedSize === "15") {
    gridContainer?.classList.add("grid-medium");
    gameState.basePoints = 150;
  } else {
    gridContainer?.classList.add("grid-large");
    gameState.basePoints = 200;
  }

  gameState.selectedBoardSize = parseInt(selectedSize);
  gameState.selectedDeck = deck;

  fetch(`https://hyf-memory-game.onrender.com/${deck}?limit=${selectedSize}`)
    .then((res) => res.json())
    .then((data) => {
      // duplicate cards to make pairs
      gameState.cards = [...data, ...data];
      shuffleCards(gameState.cards);
      gameState.originalDeck = [...gameState.cards];
      createCards(gameState.cards);
    })
    .catch((error) => {
      console.error("Could not fetch the cards:", error);
      alert(
        "Oops! We couldn't load the cards. Please check your connection or try again later.",
      );
      openModal(gameStart, gameEnd);
    });
}

// ===== ADD EVENT LISTENER TO THE CONTAINER AND THE CLICKED CARD =====
gridContainer?.addEventListener("click", (event) => {
  const clickedCard = event.target.closest(".card");

  if (!clickedCard) return;
  flipCard(clickedCard);
});

// ===== CREATE CARD ELEMENTS =====
function createCards(cards) {
  for (let card of cards) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");

    // store card name for matching
    cardElement.dataset.name = card.file_name;

    cardElement.innerHTML = `
      <div class="front">
        <img src="${card.file_path}" />
      </div>
      <div class="back"></div>
    `;

    gridContainer.appendChild(cardElement);
  }
}

// ===== SHUFFLE CARDS =====
function shuffleCards(cards) {
  let currentIndex = cards.length;
  let randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [cards[currentIndex], cards[randomIndex]] = [
      cards[randomIndex],
      cards[currentIndex],
    ];
  }
}

// ===== FLIP CARD =====
function flipCard(clickedCard) {
  if (gameState.lockBoard) return;

  //timer starts with flip of the first card
  if (!gameState.isStarted) {
    startTimer((passedTime) => {
      timeDisplay.textContent = passedTime;
    });
    gameState.isStarted = true;
  }

  if (gameState.firstCard === clickedCard) return;

  clickedCard.classList.add("flipped");

  if (!gameState.firstCard) {
    gameState.firstCard = clickedCard;
    return;
  }

  gameState.secondCard = clickedCard;
  gameState.lockBoard = true;

  gameState.counter++;
  counterElement.textContent = gameState.counter;

  checkForMatch();
}

// ===== CHECK MATCH =====
function checkForMatch() {
  const isMatch =
    gameState.firstCard.dataset.name === gameState.secondCard.dataset.name;

  if (isMatch) {
    disableCards();
    gameState.matchCounter++;
  } else {
    unflipCards();
  }

  //stop the timer once all the cards have been matched
  if (gameState.matchCounter === gameState.cards.length / 2) {
    gameState.isStarted = false;
    stopTimer();
    const name = getUserName();
    getTime(timeDisplay.textContent);
    createMessageEl(
      name,
      gameState.minutesPassed,
      gameState.secondsPassed,
      gameState.counter,
    );
    openModal(gameEnd, gameStart, true);
  }
}

// ===== DISABLE MATCHED CARDS =====
function disableCards() {
  setTimeout(() => {
    gameState.firstCard.style.opacity = "0";
    gameState.firstCard.style.pointerEvents = "none";
    gameState.secondCard.style.opacity = "0";
    gameState.secondCard.style.pointerEvents = "none";
    anotherTurn();
  }, 1000);
}

// ===== UNFLIP WRONG PAIR =====
function unflipCards() {
  setTimeout(() => {
    gameState.firstCard.classList.remove("flipped");
    gameState.secondCard.classList.remove("flipped");
    anotherTurn();
  }, 1000);
}

// ===== RESET TURN =====
function anotherTurn() {
  gameState.firstCard = null;
  gameState.secondCard = null;
  gameState.lockBoard = false;
}

function resetStats() {
  gameState.firstCard = null;
  gameState.secondCard = null;
  gameState.isStarted = false;
  gameState.matchCounter = 0;
  gameState.counter = 0;
  gameState.lockBoard = false;

  timeDisplay.textContent = "0:0";
  counterElement.textContent = 0;
  resetTimer();
  stopTimer();
}

// ===== RESTART GAME =====
function restart() {
  anotherTurn();
  gridContainer.innerHTML = "";
  createCards(gameState.originalDeck);
  resetStats();
  closeModal();
}

// ===== SCORES =====

function getScore() {
  const pointsPerMatch = 50;
  const matchIncome = gameState.matchCounter * pointsPerMatch;

  const difficulty = difficultyMultiplier(gameState.selectedDeck);
  const totalIncome = matchIncome * difficulty;

  const totalSeconds = gameState.minutesPassed * 60 + gameState.secondsPassed;

  const mistakes = gameState.counter - gameState.matchCounter;

  const mistakeCost = 10;
  const timeCost = 2;

  const penalties = mistakes * mistakeCost + totalSeconds * timeCost;

  const finalScore = totalIncome - penalties;

  // Safety Net, so points to go lower than 1
  gameState.totalScore = Math.max(
    gameState.matchCounter,
    Math.floor(finalScore),
  );
}

// get the multiplier of difficulty based on selected deck
function difficultyMultiplier(deck) {
  const difficultyPoints = {
    1: 1.5,
    2: 1.2,
    3: 1.3,
    4: 2.0,
    5: 1.0,
  };
  return difficultyPoints[deck] || 1.0;
}

function getTime(timeString) {
  const array = timeString.split(":");
  gameState.minutesPassed = Number(array[0]);
  gameState.secondsPassed = Number(array[1]);
}
