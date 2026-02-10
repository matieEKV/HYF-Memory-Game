//timer logic
import { startTimer, stopTimer } from "./timer.js";
let isStarted = false;

const timeDisplay = document.querySelector(".showTime");
const cardContainer = document.querySelector(".container");
const check = document.querySelector(".whatever");
const button = document.querySelector(".click");

// starts the timer once the first card is turned
cardContainer?.addEventListener("change", () => {
  if (!isStarted) {
    startTimer((passedTime) => {
      timeDisplay.textContent = passedTime;
    });
    isStarted = true;
  }
});

//just a temporary function that stops timer on button click. Will change this later to end of game
button.addEventListener("click", () => {
  isStarted = false;
  stopTimer();
});
