//timer logic
import { startTimer, stopTimer } from "./timer.js";
let isStarted = false;

const timeDisplay = document.querySelector(".showTime");
const cardContainer = document.querySelector(".container");
const button = document.querySelector(".click");

// starts the timer once the first card is turned
cardContainer?.addEventListener("change", () => {});

// ===== GET GRID FROM HTML =====
const gridContainer = document.querySelector(".grid-container");

// ===== GAME STATE =====
let cards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let counter = 0;

// ===== SHOW INITIAL SCORE =====
const counterElement = document.querySelector(".counter");
counterElement.textContent = counter;

// ===== FETCH CARD DATA =====
fetch("../data/cards.json")
  .then((res) => res.json())
  .then((data) => {
    // duplicate cards to make pairs
    cards = [...data, ...data];
    shuffleCards(cards);
    createCards(cards);
  });

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

// ===== CREATE CARD ELEMENTS =====
function createCards(cards) {
  for (let card of cards) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");

    // store card name for matching
    cardElement.dataset.name = card.name;

    cardElement.innerHTML = `
      <div class="front">
        <img src="${card.image}" />
      </div>
      <div class="back"></div>
    `;

    gridContainer.appendChild(cardElement);
    cardElement.addEventListener("click", flipCard);
  }
}

// ===== FLIP CARD ===== // change this function
function flipCard(event) {
  if (lockBoard) return;

  //timer starts with flip of the first card
  if (!isStarted) {
    startTimer((passedTime) => {
      timeDisplay.textContent = passedTime;
    });
    isStarted = true;
  }
  const clickedCard = event.currentTarget;
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

//just a temporary function that stops timer on button click. Will change this later to end of game
button.addEventListener("click", () => {
  isStarted = false;
  stopTimer();
});

// ===== CHECK MATCH =====
function checkForMatch() {
  const isMatch = firstCard.dataset.name === secondCard.dataset.name;

  isMatch ? disableCards() : unflipCards();
}

// ===== DISABLE MATCHED CARDS =====
function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);
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
  shuffleCards(cards);
  counter = 0;
  counterElement.textContent = counter;
  gridContainer.innerHTML = "";
  createCards(cards);
}
