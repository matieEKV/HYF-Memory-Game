//FALLBACK OPTIONS

const boardSizeFallback = ["9", "15", "25"];
const decksFallback = [1, 2, 3, 4, 5];

function getRandomSize() {
  return "15";
}

function getRandomDeck() {
  return decksFallback[Math.floor(Math.random() * decksFallback.length)];
}

export { getRandomDeck, getRandomSize };
