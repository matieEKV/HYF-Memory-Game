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

// ===== FLIP CARD =====
function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  // ✅ THIS WAS THE MAIN BUG (must be 'flipped')
  this.classList.add("flipped");

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  lockBoard = true;

  counter++;
  counterElement.textContent = counter;

  checkForMatch();
}

// ===== CHECK MATCH =====
function checkForMatch() {
  const isMatch = firstCard.dataset.name === secondCard.dataset.name;

  isMatch ? disableCards() : unflipCards();
}

// ===== DISABLE MATCHED CARDS =====
function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);
  resetBoard();
}

// ===== UNFLIP WRONG PAIR =====
function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetBoard();
  }, 1000);
}

// ===== RESET TURN =====
function resetBoard() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

// ===== RESTART GAME =====
function restart() {
  resetBoard();
  shuffleCards(cards);
  counter = 0;
  counterElement.textContent = counter;
  gridContainer.innerHTML = "";
  createCards(cards);
}
