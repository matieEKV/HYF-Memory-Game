let timerInterval;
let minutes = 0;
let seconds = 0;

function startTimer(onTick) {
  if (!timerInterval) {
    timerInterval = setInterval(() => {
      seconds += 1;
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

export { startTimer, stopTimer };
