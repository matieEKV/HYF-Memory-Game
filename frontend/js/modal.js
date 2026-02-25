import { gameState } from "./game-state.js";

const overlay = document.querySelector(".overlay");
const modal = document.querySelector(".modal-container");
const buttons = document.querySelector(".actions");

// ===== GET USER NAME =====
function getUserName() {
  const input = document.querySelector("#user-name");
  return input.value ? input.value.trim() : "Player";
}

function closeModal() {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
}

function openModal(open, close, isGameWon = false) {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
  open.classList.remove("hidden");
  close.classList.add("hidden");
  if (isGameWon) {
    buttons.style.zIndex = "20";
  } else {
    buttons.style.zIndex = "1";
  }
}

function createMessageEl() {
  const message1 = document.querySelector(".message1");
  const message2 = document.querySelector(".message2");

  message1.textContent = `Congratulations ${gameState.userName}!`;
  if (gameState.minutesPassed === 0) {
    message2.textContent = `You finished the game with ${gameState.counter} turns in ${gameState.secondsPassed} seconds. Your score ${gameState.totalScore}`;
  } else if (gameState.minutesPassed > 1) {
    message2.textContent = `You finished the game with ${gameState.counter} turns in ${gameState.minutesPassed} minutes and ${gameState.secondsPassed} seconds. Your score ${gameState.totalScore}`;
  } else {
    message2.textContent = `You finished the game with ${gameState.counter} turns in ${gameState.minutesPassed} minute and ${gameState.secondsPassed} seconds. Your score ${gameState.totalScore}`;
  }
}

export { openModal, createMessageEl, closeModal, getUserName };
