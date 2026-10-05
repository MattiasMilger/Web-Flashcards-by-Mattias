# Web Flashcards by Mattias

A browser-based flashcard study app built with vanilla HTML, CSS, and JavaScript. Runs entirely client-side, no server or backend required. Designed for GitHub Pages.

## Try It Out

The live version is available at: **https://mattiasmilger.github.io/Web-Flashcards-by-Mattias/**

### Run Locally

Open `index.html` in a modern browser. No build tools or dependencies required.

## Features

- **Spaced Repetition** - SM-2 scheduling with Again / Hard / Good / Easy ratings.
- **Premade Decks** - One-tap vocabulary decks for Spanish, French, German, Italian, Portuguese, Polish, Ukrainian, Japanese, Mandarin, Korean, Indonesian, Swedish and Turkish.
- **Deck Management** - Create, open, rename, and delete multiple decks stored in your browser.
- **Card Editor** - Add, edit, delete, and search cards within any deck.
- **Import Deck (.txt)** - Create a deck from a `.txt` file. Accepts `Word - Translation` format and tab-separated (Anki export) format.
- **Import/Export Decks** - Save decks as `.json` or `.txt` files and reload them at any time.
- **Data Config** - Accessible from the bottom link:
  - **Export Config**: Download a full JSON backup of all your decks and settings.
  - **Import Config**: Restore your entire deck library and settings from a JSON backup.
  - **Danger Zone (Reset Config)**: Restore defaults safely by requiring a typed `RESET` confirmation.
- **Background Dismissal** - All modal menus and dialogs can be canceled and closed by clicking anywhere on the background overlay or pressing Escape.
- **Zero Browser Popups** - Clean, responsive in-app modals handle card deletion, deck deletion, and resets without native browser `confirm()` or `alert()` popups.
- **Daily Limit** - Configure how many cards to study per day. Extend when you want more.
- **Undo Last Rating** - Rewind the last card rating if you made a mistake.
- **Keyboard Shortcuts** - Space/Enter to show answer; 1–4 to rate cards.
- **Click to Copy** - Click the card to copy its text to clipboard.
- **Dark / Light Theme** - Toggle between dark and light modes (dark by default).
- **Responsive Design** - Works on desktop and mobile devices without layout shifts.
- **Persistent Storage** - All data saved in your browser's `localStorage`.

## Project Structure

```
Web Flashcards by Mattias/
├── index.html      # Main HTML structure, layout, and all modals
├── style.css       # Styling, theming (CSS variables), responsive design
├── premade.js      # Built-in premade vocabulary decks
├── config.js       # App config, deck storage (localStorage), migration, export/import
├── session.js      # Session logic: queue building, SM-2 algorithm, rewind
├── dialogs.js      # Modal dialog logic: card editor, card add/edit, import, settings
├── deckmanager.js  # Manage Decks dialog: deck list, premade browser, import/export
├── ui.js           # Main UI controller: state machine, rendering, keyboard shortcuts
└── README.md       # This file
```

### Module Responsibilities

| Module | Purpose |
|---|---|
| `config.js` | App constants, config and deck persistence in `localStorage`, full backup export/import, reset, schema migration |
| `session.js` | Queue building, SM-2 spaced repetition, card rating, rewind, stats |
| `premade.js` | Premade decks (compact text data) and the builder that turns them into decks |
| `deckmanager.js` | Manage Decks dialog: single-select deck list, premade browser, import/export |
| `dialogs.js` | Card editor, add/edit cards, import cards, settings, data config dialogs, in-app confirms |
| `ui.js` | Application state machine, card rendering, event wiring, keyboard shortcuts |

## Spaced Repetition (SM-2)

Cards are scheduled based on your performance. Rate each card as:
- **Again** (<10m) - failed, shown again soon.
- **Hard** (1–2d) - struggled, short interval.
- **Good** (3–7d) - normal, standard interval.
- **Easy** (7d+) - easy, long interval.

The interval between reviews grows each time you rate a card as Good or Easy, following the SM-2 algorithm. New cards and cards that are due appear in each session, up to the daily limit.

## Older Saves (Simple Mode Removed)

The app used to have a second, Simple mode (Remembered / Forgot). It has been removed. Decks saved by earlier versions are converted automatically the first time the app loads, and the same conversion is applied to imported `.json` decks:

- Cards you had marked **Finished** are scheduled for review 7–20 days from the day of conversion (spread out so they don't all come due at once).
- All other cards keep their spaced-repetition progress, or start as new cards if they had none.
- Invalid or missing fields (dates, intervals, ease factors, counters, limits) are repaired, and snake_case exports from the desktop Python app are accepted.
- Converted decks carry `schemaVersion: 2`. `learningMode` is kept as `"spaced"` in the data for compatibility.

## Premade Decks

Open **Manage Decks** and tap **Browse Premade Decks**. Each deck is named `Language - English` (foreign word on the front). The default first-launch deck is a 200-card Spanish deck, and every premade deck has exactly 200 cards. Add more languages by adding an entry to `premade.js`.

## Data Config & Backups

At the bottom of the page, click **Data Config** to access:
- **Export Config**: Exports all your decks, cards, review intervals, and preferences into a single timestamped JSON file.
- **Import Config**: Restore your full collection from a previously saved JSON configuration file.
- **Danger Zone**: To reset all decks and settings to clean factory defaults, click **Reset Config** and type `RESET` to confirm.

## Importing Decks from a Text File

You can create a deck from a plain `.txt` file without any manual card entry. Two formats are supported:

**Dash-separated** (default format):
```
Cześć - Hello
Dzień - Day
Kot - Cat
Herbata - Tea
```

**Tab-separated** (Anki plain-text export):
```
Cześć	Hello
Dzień	Day
Kot	Cat
```

Anki decks can be exported via **File → Export → Notes in Plain Text (.txt)** inside Anki. Extra columns such as tags are ignored automatically, and comment lines beginning with `#` are skipped.

Both formats can be mixed freely in the same file. Lines that cannot be parsed are skipped and reported in the confirmation message.

**How to import:**
1. Open **Manage Decks**
2. Click **Import from File…**
3. Choose **.txt** and select your file

The deck is created automatically, named after the filename (minus the `.txt` extension).

You can also add cards from a `.txt` file into an *existing* deck via **Edit Cards → Import Cards**, which loads the file into a preview textarea before importing.

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Space / Enter | Show Answer |
| 1 | Again |
| 2 | Hard |
| 3 | Good |
| 4 | Easy |
| Escape | Close any open modal |

## Technical Notes

- **No external dependencies** - pure vanilla HTML, CSS, and JavaScript.
- **localStorage** - All decks and settings persist in the browser. Clearing browser data will erase your decks - export them via Data Config first.
- **JSON format** - Deck files are compatible with the desktop *Flashcards by Mattias* Python app (with automatic field normalization on import).

## Browser Support

Works in all modern browsers (Chrome, Firefox, Edge, Safari). Requires JavaScript enabled.

## Credits

**Developer**: Mattias Milger
**Email**: mattias.r.milger@gmail.com
**GitHub**: [MattiasMilger](https://github.com/MattiasMilger)
