import { startTimer, stopTimer, resetTimer } from "./timer.js";

const timeDisplay = document.querySelector(".showTime");
const modal = document.querySelector(".modal-container");
const startGame = document.querySelector(".start-game");
const overlay = document.querySelector(".overlay");
const gridContainer = document.querySelector(".grid-container");
const counterElement = document.querySelector(".counter");
const gameStart = document.querySelector(".modal-start");
const gameEnd = document.querySelector(".modal-end");
const restartButton = document.querySelector(".restart");
const startNewGame = document.querySelector(".reopen-options");
const buttons = document.querySelector(".actions");

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
  buttons.style.zIndex = "1";
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
  if (selectedSize === "9") {
    gridContainer?.classList.add("grid-small");
  } else if (selectedSize === "20") {
    gridContainer?.classList.add("grid-medium");
  } else {
    gridContainer?.classList.add("grid-large");
  }
  if (!deck) {
    deck = getRandomDeck();
  }
  if (!selectedSize) {
    selectedSize = getRandomSize();
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
    openModal(gameEnd, gameStart);
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
  timeDisplay.textContent = "0 : 0";
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

// ===== GET USER NAME =====
function getUserName() {
  let name = document.querySelector("#user-name");
  if (!name.value) {
    name = "Player";
    return name;
  }
  return name.value.trim();
}

function closeModal() {
  modal.style.display = "none";
  overlay.style.display = "none";
}

function openModal(open, close) {
  modal.style.display = "block";
  overlay.style.display = "block";
  open.classList.remove("hidden");
  close.classList.add("hidden");
  if (open === gameEnd) {
    buttons.style.zIndex = "20";
  }
}

function createMessageEl(name, time, turns) {
  const message1 = document.querySelector(".message1");
  const message2 = document.querySelector(".message2");

  message1.textContent = `Congratulations ${name}!`;
  message2.textContent = `You finished the game with ${turns} turns in ${time} `;
}

//FALLBACK OPTIONS

const boardSizeFallback = [9, 20, 25];
const decksFallback = [1, 2, 3, 4, 5];

function getRandomSize() {
  return boardSizeFallback[
    Math.floor(Math.random() * boardSizeFallback.length)
  ];
}

function getRandomDeck() {
  return decksFallback[Math.floor(Math.random() * decksFallback.length)];
}
