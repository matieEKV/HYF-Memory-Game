let running = false;
let timer = 0;

const timeDisplay = document.querySelector(".showTime");
const cardContainer = document.querySelector(".container");
const check = document.querySelector(".whatever");
const button = document.querySelector(".click");

cardContainer?.addEventListener("change", () => {
  running = true;
  console.log("I am clicked");
});

button.addEventListener("click", () => {
  running = false;
});
let lastTime = Date.now();

const tick = () => {
  const now = Date.now();
  const delta = now - lastTime;
  lastTime = now;

  if (running) {
    timer += delta;
    timeDisplay.textContent = (timer / 1000).toFixed(2) + "s";
  }

  // Loop us around
  requestAnimationFrame(tick);
};

// Kick things off
tick();
