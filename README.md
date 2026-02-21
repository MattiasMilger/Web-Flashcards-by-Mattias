# Web Flashcards by Mattias

A browser-based flashcard study app built with vanilla HTML, CSS, and JavaScript. Runs entirely client-side, no server or backend required. Designed for GitHub Pages.

## Try It Out

The live version is available at: **https://mattiasmilger.github.io/Web-Flashcards-by-Mattias/**

### Run Locally

Open `index.html` in a modern browser. No build tools or dependencies required.

## Features

- **Two Learning Modes** — Simple mode (Remembered / Forgot) and Spaced Repetition (SM-2 algorithm).
- **Deck Management** — Create, open, and delete multiple decks stored in your browser.
- **Card Editor** — Add, edit, delete, and search cards within any deck.
- **Import from .txt** — Create a deck directly from a `.txt` file (one card per line: `Word - Translation`).
- **Import/Export Decks** — Save decks as JSON files and reload them at any time.
- **Daily Limit** — Configure how many cards to study per day. Extend when you want more.
- **Undo Last Rating** — Rewind the last card rating if you made a mistake.
- **Keyboard Shortcuts** — Space/Enter to show answer; 1–4 to rate cards.
- **Click to Copy** — Click the card to copy its text to clipboard.
- **Dark / Light Theme** — Toggle between dark and light modes (dark by default).
- **Responsive Design** — Works on desktop and mobile devices.
- **Persistent Storage** — All data saved in your browser's `localStorage`.

## Project Structure

```
Web Flashcards by Mattias/
├── index.html      # Main HTML structure, layout, and all modals
├── style.css       # Styling, theming (CSS variables), responsive design
├── config.js       # App config, deck storage (localStorage), export/import
├── session.js      # Session logic: queue building, SM-2 algorithm, rewind
├── dialogs.js      # Modal dialog logic: deck manager, card editor, settings
├── ui.js           # Main UI controller: state machine, rendering, keyboard shortcuts
└── README.md       # This file
```

### Module Responsibilities

| Module | Purpose |
|---|---|
| `config.js` | App constants, config and deck persistence in `localStorage`, export/import |
| `session.js` | Queue building, SM-2 spaced repetition, card rating, rewind, stats |
| `dialogs.js` | All modal dialogs: deck manager, card editor, add/edit cards, import, settings |
| `ui.js` | Application state machine, card rendering, event wiring, keyboard shortcuts |

## Learning Modes

### Simple Mode
Cards are marked as **To Review** or **Finished**. Each session reviews cards up to the daily limit. Rate each card as:
- **Remembered** — card moves to Finished.
- **Forgot** — card stays in the queue.

### Spaced Repetition (SM-2)
Cards are scheduled based on your performance. Rate each card as:
- **Again** (<10m) — failed, shown again soon.
- **Hard** (1–2d) — struggled, short interval.
- **Good** (3–7d) — normal, standard interval.
- **Easy** (7d+) — easy, long interval.

The interval between reviews grows each time you rate a card as Good or Easy, following the SM-2 algorithm. Cards only appear when they are due.

## Importing Decks from a Text File

You can create a deck from a plain `.txt` file without any manual card entry. The file must have one card per line in this format:

```
word 1 - word 2
word 3 - word 4
```

For example:

```
Cześć - Hello
Dzień - Day
Kot - Cat
Herbata - Tea
```

**How to import:**
1. Open **Manage Decks**
2. Click **Import from .txt**
3. Select your `.txt` file

The deck is created automatically, named after the filename (minus the `.txt` extension). Lines that don't match the `Word - Translation` format are skipped and reported in the confirmation message.

You can also add cards from a `.txt` file into an *existing* deck via **Edit Cards → Import from Text**, which loads the file into a preview textarea before importing.

## How It Works

1. **Configuration** loads from `localStorage` on startup. Last-used deck is reopened automatically.
2. **Session queue** is built from cards that are due (or not yet started), up to the daily limit.
3. The app shows the **card front** (word). Click "Show Answer" or press Space to reveal the back.
4. **Rate the card** using the buttons or keyboard shortcuts (1–4). The card is updated and saved immediately.
5. **Undo** the last rating at any time with the "↩ Undo Last Rating" button.
6. When the session ends, use **Study More Cards** to extend the session.

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Space / Enter | Show Answer |
| 1 | Forgot / Again |
| 2 | Remembered / Hard |
| 3 | Good (spaced mode) |
| 4 | Easy (spaced mode) |
| Escape | Close modal |

## Technical Notes

- **No external dependencies** — pure vanilla HTML, CSS, and JavaScript.
- **localStorage** — All decks and settings persist in the browser. Clearing browser data will erase your decks — export them as JSON first.
- **JSON format** — Deck files are compatible with the desktop *Flashcards by Mattias* Python app (with automatic field normalization on import).

## Browser Support

Works in all modern browsers (Chrome, Firefox, Edge, Safari). Requires JavaScript enabled.

## Credits

**Developer**: Mattias Milger
**Email**: mattias.r.milger@gmail.com
**GitHub**: [MattiasMilger](https://github.com/MattiasMilger)
