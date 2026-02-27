const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./card-decks.db");

db.serialize(() => {
  console.log("Starting Database Initialization...");

  // We drop Cards first because it depends on Decks (Foreign Key)
  db.run("DROP TABLE IF EXISTS Cards");
  db.run("DROP TABLE IF EXISTS Decks");
  console.log("Old tables dropped.");

  // Create tables
  db.run(`
    CREATE TABLE Decks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    );
  `);

  db.run(`
    CREATE TABLE Cards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      deck_id INTEGER,
      file_name TEXT,
      file_path TEXT,
      FOREIGN KEY(deck_id) REFERENCES Decks(id)
    );
  `);
  console.log("✅ Tables created.");

  // Insert Decks
  const insertDecks = `
    INSERT INTO Decks (id, name) VALUES 
    (1, 'Patterns'),
    (2, 'Food'),
    (3, 'Movies'),
    (4, 'Abstract'),
    (5, 'Animals'),
  `;
  db.run(insertDecks);

  // Insert Cards
  const insertAllCards = `
    INSERT INTO Cards (file_path, file_name, deck_id) VALUES 
    -- PATTERNS (Deck 1)
    ('images/pattern1.webp', 'pattern1', 1),
    ('images/pattern2.jpg', 'pattern2', 1),
    ('images/pattern3.jpg', 'pattern3', 1),
    ('images/pattern4.jpg', 'pattern4', 1),
    ('images/pattern5.png', 'pattern5', 1),
    ('images/pattern6.jpeg', 'pattern6', 1),
    ('images/pattern7.jpg', 'pattern7', 1),
    ('images/pattern8.jpeg', 'pattern8', 1),
    ('images/pattern9.jpg', 'pattern9', 1),
    ('images/pattern10.jpeg', 'pattern10', 1),
    ('images/pattern11.jpeg', 'pattern11', 1),
    ('images/pattern12.jpg', 'pattern12', 1),
    ('images/pattern13.webp', 'pattern13', 1),
    ('images/pattern14.jpeg', 'pattern14', 1),
    ('images/pattern15.webp', 'pattern15', 1),
    ('images/pattern16.jpg', 'pattern16', 1),
    ('images/pattern17.jpg', 'pattern17', 1),
    ('images/pattern18.jpeg', 'pattern18', 1),
    ('images/pattern19.jpeg', 'pattern19', 1),
    ('images/pattern20.jpg', 'pattern20', 1),
    ('images/pattern21.jpg', 'pattern21', 1),
    ('images/pattern22.webp', 'pattern22', 1),
    ('images/pattern23.webp', 'pattern23', 1),
    ('images/pattern24.webp', 'pattern24', 1),
    ('images/pattern25.webp', 'pattern25', 1),
    ('images/pattern26.webp', 'pattern26', 1),
    ('images/pattern27.webp', 'pattern27', 1),
    ('images/pattern28.png', 'pattern28', 1), 
    ('images/pattern29.png', 'pattern29', 1),

    -- FOOD (Deck 2)
    ('images/food1.jpg', 'food1', 2),
    ('images/food2.jpg', 'food2', 2),
    ('images/food3.jpg', 'food3', 2),
    ('images/food4.jpg', 'food4', 2),
    ('images/food5.jpg', 'food5', 2),
    ('images/food6.jpg', 'food6', 2),
    ('images/food7.jpg', 'food7', 2),
    ('images/food8.jpg', 'food8', 2),
    ('images/food9.jpg', 'food9', 2),
    ('images/food10.jpg', 'food10', 2),
    ('images/food11.jpg', 'food11', 2),
    ('images/food12.jpg', 'food12', 2),
    ('images/food13.jpg', 'food13', 2),
    ('images/food14.jpg', 'food14', 2),
    ('images/food15.jpg', 'food15', 2),
    ('images/food16.jpg', 'food16', 2),
    ('images/food17.jpg', 'food17', 2),
    ('images/food18.jpg', 'food18', 2),
    ('images/food19.jpg', 'food19', 2),
    ('images/food20.jpg', 'food20', 2),
    ('images/food21.jpg', 'food21', 2),
    ('images/food22.jpg', 'food22', 2),
    ('images/food23.jpg', 'food23', 2),
    ('images/food24.jpg', 'food24', 2),
    ('images/food25.jpg', 'food25', 2),
    ('images/food26.jpg', 'food26', 2),
    ('images/food27.jpg', 'food27', 2),
    ('images/food28.jpg', 'food28', 2),
    ('images/food29.jpg', 'food29', 2),

    -- MOVIES (Deck 3)
    ('images/movie1.jpg', 'movie1', 3),
    ('images/movie2.jpg', 'movie2', 3),
    ('images/movie3.jpg', 'movie3', 3),
    ('images/movie4.jpg', 'movie4', 3),
    ('images/movie5.jpg', 'movie5', 3),
    ('images/movie6.jpg', 'movie6', 3),
    ('images/movie7.jpg', 'movie7', 3),
    ('images/movie8.jpg', 'movie8', 3),
    ('images/movie9.jpg', 'movie9', 3),
    ('images/movie10.jpg', 'movie10', 3),
    ('images/movie11.jpg', 'movie11', 3),
    ('images/movie12.jpg', 'movie12', 3),
    ('images/movie13.jpg', 'movie13', 3),
    ('images/movie14.webp', 'movie14', 3),
    ('images/movie15.jpg', 'movie15', 3),
    ('images/movie16.jpg', 'movie16', 3),
    ('images/movie17.jpg', 'movie17', 3),
    ('images/movie18.webp', 'movie18', 3),
    ('images/movie19.webp', 'movie19', 3),
    ('images/movie20.jpg', 'movie20', 3),
    ('images/movie21.webp', 'movie21', 3),
    ('images/movie22.jpg', 'movie22', 3),
    ('images/movie23.jpg', 'movie23', 3),
    ('images/movie24.jpg', 'movie24', 3),
    ('images/movie25.jpg', 'movie25', 3),
    ('images/movie26.jpg', 'movie26', 3),
    ('images/movie27.jpg', 'movie27', 3),

    -- ABSTRACT (Deck 4)
    ('images/abstract1.webp', 'abstract1', 4),
    ('images/abstract2.webp', 'abstract2', 4),
    ('images/abstract3.webp', 'abstract3', 4),
    ('images/abstract4.jpg', 'abstract4', 4),
    ('images/abstract5.webp', 'abstract5', 4),
    ('images/abstract6.jpg', 'abstract6', 4),
    ('images/abstract7.png', 'abstract7', 4),
    ('images/abstract8.jpg', 'abstract8', 4),
    ('images/abstract9.jpg', 'abstract9', 4),
    ('images/abstract10.webp', 'abstract10', 4),
    ('images/abstract11.webp', 'abstract11', 4),
    ('images/abstract12.png', 'abstract12', 4),
    ('images/abstract13.jpg', 'abstract13', 4),
    ('images/abstract14.webp', 'abstract14', 4),
    ('images/abstract15.webp', 'abstract15', 4),
    ('images/abstract16.webp', 'abstract16', 4),
    ('images/abstract17.webp', 'abstract17', 4),
    ('images/abstract18.webp', 'abstract18', 4),
    ('images/abstract19.webp', 'abstract19', 4),
    ('images/abstract20.webp', 'abstract20', 4),
    ('images/abstract21.webp', 'abstract21', 4),
    ('images/abstract22.webp', 'abstract22', 4),
    ('images/abstract23.webp', 'abstract23', 4),
    ('images/abstract24.webp', 'abstract24', 4),
    ('images/abstract25.webp', 'abstract25', 4),
    ('images/abstract26.webp', 'abstract26', 4),
    ('images/abstract27.webp', 'abstract27', 4),

    -- ANIMALS (Deck 5)
    ('images/animal1.jpg', 'animal1', 5),
    ('images/animal2.png', 'animal2', 5),
    ('images/animal3.jpg', 'animal3', 5),
    ('images/animal4.jpg', 'animal4', 5),
    ('images/animal5.jpg', 'animal5', 5),
    ('images/animal6.jpg', 'animal6', 5),
    ('images/animal7.png', 'animal7', 5),
    ('images/animal8.jpg', 'animal8', 5),
    ('images/animal9.jpg', 'animal9', 5),
    ('images/animal10.jpg', 'animal10', 5),
    ('images/animal11.jpg', 'animal11', 5),
    ('images/animal12.jpg', 'animal12', 5),
    ('images/animal13.jpg', 'animal13', 5),
    ('images/animal14.jpg', 'animal14', 5),
    ('images/animal15.jpg', 'animal15', 5),
    ('images/animal16.jpg', 'animal16', 5),
    ('images/animal17.jpg', 'animal17', 5),
    ('images/animal18.jpg', 'animal18', 5),
    ('images/animal19.jpg', 'animal19', 5),
    ('images/animal20.jpg', 'animal20', 5),
    ('images/animal21.jpg', 'animal21', 5),
    ('images/animal22.jpg', 'animal22', 5),
    ('images/animal23.jpg', 'animal23', 5),
    ('images/animal24.jpg', 'animal24', 5),
    ('images/animal25.jpg', 'animal25', 5),
    ('images/animal26.jpg', 'animal26', 5),
    ('images/animal27.jpg', 'animal27', 5);
  `;

  db.run(insertAllCards);

  console.log("✅ Data inserted.");
});

// Close the connection
db.close((err) => {
  if (err) return console.error(err.message);
  console.log("🏁 Database ready! You can now run 'npm start'.");
});
