import { startTimer, stopTimer, resetTimer } from "./timer.js";

const timeDisplay = document.querySelector(".showTime");
const modal = document.querySelector(".modal-container");
const startGame = document.querySelector(".start-game");
const overlay = document.querySelector(".overlay");
const gridContainer = document.querySelector(".grid-container");
const counterElement = document.querySelector(".counter");
const boardSize = document.querySelector(".button-radio");
const gameStart = document.querySelector(".modal-start");
const gameEnd = document.querySelector(".hidden");
const restartButton = document.querySelector(".restart");

let limit, time;

// // ===== DETERMINE THE VALUE OF BOARD SIZE =====
// switch (true) {
//   case boardSize.value === "small":
//     limit = 8;
//     break;
//   case boardSize.value === "medium":
//     limit = 18;
//     break;
//   case boardSize.value === "large":
//     limit = 25;
//     break;
// }

// ===== CLOSE THE MODAL ONCE BUTTON IS CLICKED =====
startGame?.addEventListener("click", () => {
  closeModal();
  fetchData();
});

// ===== RESTART SAME BOARD ONCE BUTTON IS CLICKED =====
restartButton?.addEventListener("click", () => {
  restart();
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
let data;
function fetchData() {
  //get the value of the clicked card
  const selectedSize = document.querySelector(
    "input[name=board_size]:checked",
  ).value;
  const deck = document.querySelector(
    "input[name=deck_selection]:checked",
  ).value;
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
    time = stopTimer();
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

// ===== RESTART GAME =====
function restart() {
  anotherTurn();
  counter = 0;
  counterElement.textContent = counter;
  gridContainer.innerHTML = "";
  createCards(originalDeck);
  resetTimer();
  isStarted = false;
  time = stopTimer();
  timeDisplay.textContent = "0 : 0";
}

// ===== GET USER NAME =====
function getUserName() {
  const name = document.querySelector("#user-name");
  if (!name.value) {
    name = "Player";
  }
  return name.value.trim();
}

function closeModal() {
  modal.style.display = "none";
  overlay.style.display = "none";
}

function openModal(open, close) {
  modal.style.display = "block";
  open.classList.remove("hidden");
  close.classList.add("hidden");
}

function createMessageEl(name, time, turns) {
  const element1 = document.createElement("p");
  const element2 = document.createElement("p");
  gameEnd.appendChild(element1);
  gameEnd.appendChild(element2);

  element1.textContent = `Congratulations ${name}!`;
  element2.textContent = `You finished the game with ${turns} turns in ${time} `;
}
