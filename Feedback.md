# Folder Architecture

## Suggested Structure

A cleaner separation of frontend and backend, with better grouping:

```
HYF-Memory-Game/
│
├── frontend/                       # ── Frontend (served as static files) ──
│   ├── index.html                  # Entry point
│   │
│   ├── js/                         # JavaScript modules
│   │   ├── script.js               # Main game logic
│   │   ├── modal.js                # Modal UI
│   │   ├── timer.js                # Timer
│   │   └── fallback.js             # Default options
│   │
│   ├── styles/                     # CSS
│   │   ├── styles.css              # Main entry (imports everything)
│   │   ├── variables.css           # Custom properties
│   │   ├── base.css                # 🆕 Reset + html/body + typography
│   │   ├── utility.css             # Reusable layout classes
│   │   ├── keyframes.css           # 🆕 All @keyframes in one place
│   │   ├── modal.css               # Modal-specific styles only
│   │   ├── card.css                # Card flip styles only
│   │   ├── grid.css                # Grid layouts
│   │   └── buttons.css             # 🆕 Merge large + small into one file
│   │
│   └── images/                     # Game assets
│       └── ...
│
├── backend/                        # ── Backend ──
│   ├── server.js                   # Express app + routes
│   └── card_decks.db               # SQLite database
│
├── shared/                         # ── Shared constants between frontend & backend ──
│   └── constants.js                # Board sizes, deck IDs, config values
│
├── package.json
├── .gitignore
└── README.md
```

### Why a `shared/` folder?

Right now `fallback.js` (frontend) and `server.js` (backend) both define their own board sizes and deck lists independently — and they're already out of sync (`[9, 15, 25]` vs `[9, 20, 25]`). A shared constants file is the single source of truth:

```js
// shared/constants.js
export const BOARD_SIZES = [9, 15, 25];
export const DECK_IDS = [1, 2, 3, 4, 5];
```

Both frontend and backend import from the same place, so they can never drift apart.

### What changed and why
💪
| Change | Why |
|--------|-----|
| `backend/` folder | Separates backend from frontend — clearer boundary |
| `frontend/` folder | Everything the browser needs in one place; Express can serve it with `express.static("frontend")` |
| `shared/` folder | Single source of truth for constants used by both sides (board sizes, deck IDs) — prevents the sync bugs you already have |
| `script.js` moved into `js/` | All JS lives together, no loose files in root |
| `base.css` (new) | The `html { font-size: 10px }` rule and body reset don't belong in `modal.css` — give them a proper home |
| `keyframes.css` (new) | Collects `@keyframes animate-window` and `@keyframes fadeInOpacity` so animations are easy to find |
---



I really like the features you have implemented, the different difficulties and the UI. 

Good job and keep going ☺️💪 !! 