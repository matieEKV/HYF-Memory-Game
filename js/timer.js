// 🎉 The callback pattern (onTick) is a nice touch that keeps the timer decoupled from the DOM.
let timerInterval;
let minutes = 0;
let seconds = 0;

function startTimer(onTick) {
  if (!timerInterval) {
    timerInterval = setInterval(() => {
      seconds += 1;
      // 🟡 [important] Use === (strict equality) instead of == (loose equality). Both work here
      // since both sides are numbers, but === is the modern JS convention.
      if (seconds == 60) {
        minutes++;
        seconds = 0;
      }
      if (onTick) {
        onTick(`${minutes} : ${seconds}`);
      }
    }, 1000);
  }
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function resetTimer() {
  minutes = 0;
  seconds = 0;
}

export { startTimer, stopTimer, resetTimer };
