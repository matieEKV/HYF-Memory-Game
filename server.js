import express, { request } from "express";
import knex from "knex";
import cors from "cors";

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

const boardSize = [9, 20, 25];
const decks = [1, 2, 3, 4, 5];

function getRandomSize() {
  return boardSize[Math.floor(Math.random() * boardSize.length)];
}

function getRandomDeck() {
  return decks[Math.floor(Math.random() * decks.length)];
}

app.use(express.json());
app.use(cors());

app.get("/", async (req, res) => {
  const limit = getRandomSize();
  const deck_id = getRandomDeck();
  const rows = await knexInstance.raw(querySQL, [deck_id, limit]);
  res.json(rows);
});

app.get("/:deck_id", async (req, res) => {
  const limit = req.query.limit || getRandomSize();
  const deck_id = parseInt(req.params.deck_id) || getRandomDeck();
  const rows = await knexInstance.raw(querySQL, [deck_id, limit]);
  res.json(rows);
});

app.listen(port);
