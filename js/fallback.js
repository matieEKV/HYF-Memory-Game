//FALLBACK OPTIONS

const boardSizeFallback = [9, 20, 25];
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
