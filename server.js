import express, { request } from "express";
import knex from "knex";
import cors from "cors";
import path from "path";

//try to awake the server where the page is deployed
fetch("https://hyf-memory-game.onrender.com/")
  .then(() => console.log("Server waking up..."))
  .catch((err) => console.error("Server wake-up failed", err));

const app = express();

//added a different port for Render deployment
const port = process.env.PORT || 3000;

app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on port ${port}`);
});

const querySQL =
  "SELECT * FROM Cards WHERE deck_id = ? ORDER BY RANDOM() LIMIT ?";

// This connects to the database stored in the file mentioned below
const knexInstance = knex({
  client: "sqlite3",
  connection: {
    filename: path.resolve(process.cwd(), "card_decks.db"),
  },
  useNullAsDefault: true, // Omit warning in console
});

const boardSize = [9, 15, 25];
const decks = [1, 2, 3, 4, 5];

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

app.use(express.json());
app.use(cors());

app.get("/", async (req, res) => {
  try {
    const limit = getRandomElement(boardSize);
    const deck_id = getRandomElement(decks);
    const rows = await knexInstance.raw(querySQL, [deck_id, limit]);

    res.json(rows);
  } catch (error) {
    console.error("Database query failed:", error);
    res.status(500).json({ error: "Database error" });
  }
});

app.get("/:deck_id", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || getRandomElement(boardSize);
    const deck_id = parseInt(req.params.deck_id) || getRandomElement(decks);
    const rows = await knexInstance.raw(querySQL, [deck_id, limit]);
    res.json(rows);
  } catch (error) {
    console.error("Database query failed:", error);
    res.status(500).json({ error: "Database error" });
  }
});
