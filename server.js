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

// 🔴 [blocking] app.listen() is called here AND again at line 63 Remove one of them.
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

// 🟡 [important] This array has 20, but the frontend uses [9, 15, 25] — the 20 is
// inconsistent and means the server's random fallback can return a size the frontend
// doesn't expect. Should be [9, 15, 25] to match.
const boardSize = [9, 20, 25];
const decks = [1, 2, 3, 4, 5];


// 🟡 [important] You could abstract these utils fuctions in a more general 
// function () => getRandomElement(array) and then call getRandomElement(boardSize) 
// and getRandomElement(decks) instead of having two separate functions with duplicated logic.
function getRandomSize() {
  return boardSize[Math.floor(Math.random() * boardSize.length)];
}

function getRandomDeck() {
  return decks[Math.floor(Math.random() * decks.length)];
}

app.use(express.json());
app.use(cors());

// 🔴 [blocking] No error handling- if the DB file is missing or the query fails, the server
// crashes with an unhandled promise rejection. Wrap the body in try/catch and return
// res.status(500).json({ error: "Database error" }) in the catch block.
app.get("/", async (req, res) => {
  const limit = getRandomSize();
  const deck_id = getRandomDeck();
  const rows = await knexInstance.raw(querySQL, [deck_id, limit]);
  res.json(rows);
});

// 🔴 [blocking] Same here — needs try/catch error handling around the DB query.
app.get("/:deck_id", async (req, res) => {
  // 🟢 [nit] req.query.limit comes as a string — parseInt() would be more explicit and
  // consistent with how deck_id is parsed on the next line.
  const limit = req.query.limit || getRandomSize();
  const deck_id = parseInt(req.params.deck_id) || getRandomDeck();
  const rows = await knexInstance.raw(querySQL, [deck_id, limit]);
  res.json(rows);
});

// 🔴 [blocking] Duplicate app.listen()
app.listen(port);
