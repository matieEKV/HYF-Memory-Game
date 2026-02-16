import { startTimer, stopTimer } from "./timer.js";

const timeDisplay = document.querySelector(".showTime");

// ===== GET GRID FROM HTML =====
const gridContainer = document.querySelector(".grid-container");

// ===== GAME STATE =====
let cards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let counter = 0;
let matchCounter = 0;
let isStarted = false;

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

// ===== ADD EVENT LISTENER TO THE CONTAINER AND THE CLICKED CARD =====
gridContainer.addEventListener("click", (event) => {
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
    cardElement.dataset.name = card.name;

    cardElement.innerHTML = `
      <div class="front">
        <img src="${card.image}" />
      </div>
      <div class="back"></div>
    `;

    gridContainer.appendChild(cardElement);
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

  if (matchCounter === cards.length / 2) {
    isStarted = false;
    stopTimer();
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
  shuffleCards(cards);
  counter = 0;
  counterElement.textContent = counter;
  gridContainer.innerHTML = "";
  createCards(cards);
}
