import { startTimer, stopTimer, resetTimer } from "./js/timer.js";
import {
  openModal,
  createMessageEl,
  closeModal,
  getUserName,
} from "./js/modal.js";
import { getRandomDeck, getRandomSize } from "./js/fallback.js";
// 🎉 good use of modules to keep code organized and separate concerns. Nice!

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

// 🟡 [important] Clean game state management with well-named variables. 
// However an object would have helped making 
// the state more explicit and easier to manage
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

  let selectedSize = document.querySelector(
    "input[name=board_size]:checked",
  )?.value;
  let deck = document.querySelector(
    "input[name=deck_selection]:checked",
  )?.value;

  //select the size of the grid based on the number of cards
  // 🟡 [important] from an UX perspective you should leave a default selection, not giving a random difficulty. Otherwise you could 
  // end up with a very hard board without knowing why. Consider adding a default "medium" selection in the HTML and removing the random fallback. 
  // (or state it clearly in the UI that if no selection is made, a random one will be chosen for you)
  if (!deck) {
    deck = getRandomDeck();
  }
  if (!selectedSize) {
    selectedSize = getRandomSize();
  }
  gridContainer.classList.remove("grid-small", "grid-medium", "grid-large");
  if (selectedSize === "9") {
    gridContainer?.classList.add("grid-small");
  } else if (selectedSize === "15") {
    gridContainer?.classList.add("grid-medium");
  } else {
    gridContainer?.classList.add("grid-large");
  }

  // 🔴 [blocking] No .catch() on fetch
  fetch(`https://hyf-memory-game.onrender.com/${deck}?limit=${selectedSize}`)
    .then((res) => res.json())
    .then((data) => {
      // duplicate cards to make pairs
      cards = [...data, ...data];
      shuffleCards(cards);
      originalDeck = [...cards];
      createCards(cards);
    });
}

// 🎉  Excellent!
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

// 🟢 Modern JS can simplify the swap to a one-liner:
// [cards[currentIndex], cards[randomIndex]] = [cards[randomIndex], cards[currentIndex]];
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
// 🟡 visibility: "hidden" leaves empty gaps in the grid. Consider using
// opacity: 0 with pointer-events: "none" instead keeps the layout stable while hiding.
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
