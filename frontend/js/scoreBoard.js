import { gameState } from "./game-state.js";

export function storeUserScore(user_name, total_score, board_size, difficulty) {
  fetch("http://localhost:3000/scoreboard", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_name,
      total_score,
      board_size,
      difficulty,
    }),
  })
    .then((response) => {
      if (response.ok) {
        console.log("Score saved successfully!");
      }
    })
    .catch((error) => console.error("Error saving score:", error));
}
