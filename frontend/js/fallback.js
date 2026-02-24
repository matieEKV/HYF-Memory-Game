//FALLBACK OPTIONS
import { DECK_IDS } from "../../shared/constants.js";

function getRandomSize() {
  return "15";
}

function getRandomDeck() {
  return DECK_IDS[Math.floor(Math.random() * DECK_IDS.length)];
}

export { getRandomDeck, getRandomSize };
