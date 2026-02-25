import { gameState } from "./game-state.js";

export function storeUserScore() {
  fetch("http://localhost:3000/scoreboard", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_name: gameState.userName,
      total_score: gameState.totalScore,
      board_size: gameState.selectedBoardSize,
      difficulty: gameState.selectedDeck,
    }),
  })
    .then((response) => {
      if (response.ok) {
        console.log("Score saved successfully!");
      }
    })
    .catch((error) => console.error("Error saving score:", error));
}
