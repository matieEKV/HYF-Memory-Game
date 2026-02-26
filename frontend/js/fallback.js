//FALLBACK OPTIONS
import { BOARD_SIZES } from "../../shared/constants.js";

function getRandomSize() {
  return BOARD_SIZES[Math.floor(Math.random() * BOARD_SIZES.length)];
}

// function getRandomDeck() {
//   return DECK_IDS[Math.floor(Math.random() * DECK_IDS.length)];
// }

export { getRandomSize };
