import { startTimer, stopTimer, resetTimer } from "./js/timer.js";
import {
  openModal,
  createMessageEl,
  closeModal,
  getUserName,
} from "./js/modal.js";
import { getRandomDeck, getRandomSize } from "./js/fallback.js";

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

// ===== GAME STATE =====
let cards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let counter = 0;
let matchCounter = 0;
let isStarted = false;
let originalDeck;

// ===== SHOW INITIAL SCORE =====
counterElement.textContent = counter;

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
  } else if (selectedSize === "20") {
    gridContainer?.classList.add("grid-medium");
  } else {
    gridContainer?.classList.add("grid-large");
  }

  fetch(`http://localhost:3000/${deck}?limit=${selectedSize}`)
    .then((res) => res.json())
    .then((data) => {
      // duplicate cards to make pairs
      cards = [...data, ...data];
      shuffleCards(cards);
      originalDeck = [...cards];
      createCards(cards);
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
  let temporaryValue;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    temporaryValue = cards[currentIndex];
    cards[currentIndex] = cards[randomIndex];
    cards[randomIndex] = temporaryValue;
  }
}

// ===== FLIP CARD =====
function flipCard(clickedCard) {
  if (lockBoard) return;

  //timer starts with flip of the first card
  if (!isStarted) {
    startTimer((passedTime) => {
      timeDisplay.textContent = passedTime;
    });
    isStarted = true;
  }
  if (firstCard === clickedCard) return;

  // ✅ THIS WAS THE MAIN BUG (must be 'flipped')
  clickedCard.classList.add("flipped");

  if (!firstCard) {
    firstCard = clickedCard;
    return;
  }
  secondCard = clickedCard;
  lockBoard = true;

  counter++;
  counterElement.textContent = counter;

  checkForMatch();
}

// ===== CHECK MATCH =====
function checkForMatch() {
  const isMatch = firstCard.dataset.name === secondCard.dataset.name;

  if (isMatch) {
    disableCards();
    matchCounter++;
  } else {
    unflipCards();
  }

  //stop the timer once all the cards have been matched
  if (matchCounter === cards.length / 2) {
    isStarted = false;
    stopTimer();
    const name = getUserName();
    createMessageEl(name, timeDisplay.textContent, counter);
    openModal(gameEnd, gameStart, true);
  }
}

// ===== DISABLE MATCHED CARDS =====
function disableCards() {
  setTimeout(() => {
    firstCard.style.visibility = "hidden";
    secondCard.style.visibility = "hidden";
    anotherTurn();
  }, 1000);
}

// ===== UNFLIP WRONG PAIR =====
function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    anotherTurn();
  }, 1000);
}

// ===== RESET TURN =====
function anotherTurn() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function resetStats() {
  firstCard = null;
  timeDisplay.textContent = "0:0";
  resetTimer();
  isStarted = false;
  stopTimer();
  matchCounter = 0;
  counter = 0;
  counterElement.textContent = 0;
}

// ===== RESTART GAME =====
function restart() {
  anotherTurn();
  gridContainer.innerHTML = "";
  createCards(originalDeck);
  resetStats();
  closeModal();
}
