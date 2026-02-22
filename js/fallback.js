//FALLBACK OPTIONS
// 🟡 [important] you have duplicated code between server and script js
// for getting random deck and size. Consider centralizing this logic in a shared module that both server.js and script.js can import from.
// (Also abstracting the random selection into a getRandomElement(array) utility function would reduce duplication and make it more flexible for future use.)
const boardSizeFallback = ["9", "15", "25"];
const decksFallback = [1, 2, 3, 4, 5];

function getRandomSize() {
  return boardSizeFallback[
    Math.floor(Math.random() * boardSizeFallback.length)
  ];
}

function getRandomDeck() {
  return decksFallback[Math.floor(Math.random() * decksFallback.length)];
}

export { getRandomDeck, getRandomSize };
