/**
 * deckmanager.js - Manage Decks dialog
 * Single-select deck list (custom, so it behaves on mobile), grouped actions,
 * premade deck browser, and file import/export sub-dialogs.
 */

const DeckManager = (() => {
    let selected = null; // name of the selected deck (always single)

    const $ = id => document.getElementById(id);
    const SELECTION_BUTTONS = ['btn-deck-open', 'btn-deck-rename', 'btn-deck-export', 'btn-deck-delete'];

    // ========================
    // Init
    // ========================

    function init() {
        $('btn-deck-open').addEventListener('click', openSelected);
        $('btn-deck-rename').addEventListener('click', openRenameModal);
        $('btn-deck-delete').addEventListener('click', deleteSelected);
        $('btn-deck-export').addEventListener('click', () => requireSelection('export') && Dialogs.openModal('export-deck-modal'));
        $('btn-deck-new').addEventListener('click', openNewDeckModal);
        $('btn-deck-import').addEventListener('click', () => Dialogs.openModal('import-deck-modal'));
        $('btn-premade-open').addEventListener('click', openPremade);

        // Export choices
        $('btn-export-json').addEventListener('click', () => exportSelected(false));
        $('btn-export-txt').addEventListener('click', () => exportSelected(true));

        // Import choices
        $('btn-import-json').addEventListener('click', () => { $('deck-file-input').value = ''; $('deck-file-input').click(); });
        $('btn-import-txt').addEventListener('click', () => { $('deck-txt-file-input').value = ''; $('deck-txt-file-input').click(); });
        $('deck-file-input').addEventListener('change', handleImportJson);
        $('deck-txt-file-input').addEventListener('change', handleImportTxt);

        // New deck / rename
        $('btn-new-deck-create').addEventListener('click', createNewDeck);
        $('new-deck-name').addEventListener('keydown', e => { if (e.key === 'Enter') createNewDeck(); });
        $('btn-rename-deck-confirm').addEventListener('click', confirmRename);
        $('rename-deck-name').addEventListener('keydown', e => { if (e.key === 'Enter') confirmRename(); });
    }

    // ========================
    // Deck list (single select)
    // ========================

    function open() {
        const names = Config.getDeckNames();
        const current = Config.getConfig().currentDeckName;
        selected = names.includes(current) ? current : (names[0] || null);
        refresh();
        Dialogs.openModal('deck-manager-modal');
    }

    function refresh() {
        const list = $('deck-list');
        list.innerHTML = '';

        const names = Config.getDeckNames();
        if (!names.includes(selected)) selected = null;
        const currentName = Config.getConfig().currentDeckName;

        if (names.length === 0) {
            const p = document.createElement('p');
            p.className = 'deck-list-empty';
            p.textContent = 'No decks yet. Tap "Browse Premade Decks" above to get started!';
            list.appendChild(p);
        }

        names.forEach(name => {
            const deck = Config.loadDeck(name);
            const count = deck ? deck.cards.length : 0;

            const item = document.createElement('div');
            item.className = 'deck-item' + (name === selected ? ' selected' : '');
            item.setAttribute('role', 'option');
            item.setAttribute('aria-selected', name === selected ? 'true' : 'false');
            item.tabIndex = 0;

            const label = document.createElement('span');
            label.className = 'deck-item-name';
            label.textContent = name;

            const meta = document.createElement('span');
            meta.className = 'deck-item-meta';
            meta.textContent = `${count} card${count !== 1 ? 's' : ''}`;

            item.appendChild(label);
            if (name === currentName) item.classList.add('is-open');
            item.appendChild(meta);

            item.addEventListener('click', () => select(name));
            item.addEventListener('dblclick', () => { select(name); openSelected(); });
            item.addEventListener('keydown', e => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(name); }
            });
            list.appendChild(item);
        });

        updateButtons();
    }

    function select(name) {
        selected = name;
        $('deck-list').querySelectorAll('.deck-item').forEach(el => {
            const isSel = el.querySelector('.deck-item-name').textContent === name;
            el.classList.toggle('selected', isSel);
            el.setAttribute('aria-selected', isSel ? 'true' : 'false');
        });
        updateButtons();
    }

    function updateButtons() {
        SELECTION_BUTTONS.forEach(id => { $(id).disabled = !selected; });
    }

    function requireSelection(verb) {
        if (!selected) { UI.showMessage(`Please select a deck to ${verb}.`, 'warning'); return false; }
        return true;
    }

    // ========================
    // Selected-deck actions
    // ========================

    function openSelected() {
        if (!requireSelection('open')) return;
        UI.openDeck(selected);
        refresh();
        if (!$('premade-modal').classList.contains('hidden')) renderPremade();
        UI.showMessage(`Opened "${selected}".`, 'success', 2000);
    }

    function openRenameModal() {
        if (!requireSelection('rename')) return;
        $('rename-deck-name').value = selected;
        Dialogs.openModal('rename-deck-modal');
        setTimeout(() => { $('rename-deck-name').focus(); $('rename-deck-name').select(); }, 50);
    }

    function confirmRename() {
        const oldName = selected;
        const newName = $('rename-deck-name').value.trim();

        if (!newName) { UI.showMessage('Please enter a new deck name.', 'error'); return; }
        if (newName === oldName) { Dialogs.closeModal('rename-deck-modal'); return; }
        if (Config.getDeckNames().includes(newName)) {
            UI.showMessage(`A deck named "${newName}" already exists.`, 'error');
            return;
        }
        if (!Config.renameDeck(oldName, newName)) {
            UI.showMessage('Failed to rename deck.', 'error');
            return;
        }

        const currentDeck = UI.getCurrentDeck();
        if (currentDeck && currentDeck.name === oldName) {
            currentDeck.name = newName;
            UI.renderDeckStatus();
        }

        selected = newName;
        Dialogs.closeModal('rename-deck-modal');
        refresh();
        UI.showMessage(`Deck renamed to "${newName}".`, 'success', 3000);
    }

    function deleteSelected() {
        if (!requireSelection('delete')) return;
        const name = selected;
        // In-app confirm instead of browser popup
        Dialogs.showConfirm({
            title: 'Delete Deck?',
            message: `Delete deck "${name}"? This cannot be undone.`,
            confirmText: 'Delete Deck',
            danger: true,
            onConfirm: () => {
                Config.deleteDeck(name);
                selected = null;
                refresh();

                if (!Config.getConfig().currentDeckName) {
                    UI.setCurrentDeck(null);
                    UI.updateState();
                }
                UI.showMessage(`Deck "${name}" deleted.`, 'info');
            }
        });
    }

    function exportSelected(asTxt) {
        if (!requireSelection('export')) return;
        const deck = Config.loadDeck(selected);
        if (!deck) return;

        if (asTxt) Config.exportDeckTxt(deck); else Config.exportDeck(deck);
        Dialogs.closeModal('export-deck-modal');
        UI.showMessage(`Deck "${selected}" exported as .${asTxt ? 'txt' : 'json'}.`, 'success', 3000);
    }

    // ========================
    // New deck
    // ========================

    function openNewDeckModal() {
        $('new-deck-name').value = '';
        Dialogs.openModal('new-deck-modal');
        setTimeout(() => $('new-deck-name').focus(), 50);
    }

    function createNewDeck() {
        const name = $('new-deck-name').value.trim();
        if (!name) { UI.showMessage('Please enter a deck name.', 'error'); return; }
        if (Config.getDeckNames().includes(name)) {
            UI.showMessage(`A deck named "${name}" already exists.`, 'error');
            return;
        }

        Config.saveDeck(Config.createEmptyDeck(name));
        Dialogs.closeModal('new-deck-modal');
        selected = name;
        UI.openDeck(name);
        refresh();
        UI.showMessage(`Deck "${name}" created.`, 'success');
    }

    // ========================
    // Import from file
    // ========================

    function handleImportJson(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = e => {
            try {
                const result = Config.importDeck(JSON.parse(e.target.result));
                if (typeof result === 'string') { UI.showMessage(result, 'error'); return; }

                if (Config.getDeckNames().includes(result.name)) result.name += ' (imported)';

                Config.saveDeck(result);
                selected = result.name;
                Dialogs.closeModal('import-deck-modal');
                refresh();
                UI.showMessage(`Deck "${result.name}" imported (${result.cards.length} cards).`, 'success');
            } catch (err) {
                UI.showMessage('Failed to parse deck file: ' + err.message, 'error');
            }
        };
        reader.readAsText(file);
    }

    function handleImportTxt(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = e => {
            const cards = [];
            let skipped = 0;

            e.target.result.split('\n').filter(l => l.trim()).forEach(line => {
                if (line.startsWith('#')) return; // Anki export comment/header lines
                const parsed = Dialogs.parseTxtLine(line);
                if (parsed) cards.push(Dialogs.newCard(parsed.word, parsed.translation, parsed.notes));
                else skipped++;
            });

            if (cards.length === 0) {
                UI.showMessage('No valid cards found. Use "Word - Translation" or tab-separated (Anki) format.', 'error');
                return;
            }

            let deckName = file.name.replace(/\.txt$/i, '').trim() || 'Imported Deck';
            if (Config.getDeckNames().includes(deckName)) deckName += ' (imported)';

            const deck = Config.createEmptyDeck(deckName);
            deck.cards = cards;
            Config.saveDeck(deck);
            selected = deckName;
            Dialogs.closeModal('import-deck-modal');
            refresh();

            let msg = `Deck "${deckName}" created with ${cards.length} card(s).`;
            if (skipped > 0) msg += ` ${skipped} line(s) skipped.`;
            UI.showMessage(msg, 'success');
        };
        reader.readAsText(file);
    }

    // ========================
    // Premade decks
    // ========================

    function openPremade() {
        renderPremade();
        Dialogs.openModal('premade-modal');
    }

    function renderPremade() {
        const grid = $('premade-grid');
        grid.innerHTML = '';
        const existing = Config.getDeckNames();

        Premade.getAll().forEach(entry => {
            const owned = existing.includes(entry.name);

            const card = document.createElement('div');
            card.className = 'premade-card' + (owned ? ' owned' : '');

            const flag = document.createElement('div');
            flag.className = 'premade-flag';
            flag.textContent = entry.flag;

            const body = document.createElement('div');
            body.className = 'premade-body';

            const title = document.createElement('div');
            title.className = 'premade-title';
            title.textContent = entry.name;

            const meta = document.createElement('div');
            meta.className = 'premade-meta';
            meta.textContent = `${entry.count} cards · ${entry.level}`;

            const blurb = document.createElement('div');
            blurb.className = 'premade-blurb';
            blurb.textContent = entry.blurb;

            body.append(title, meta, blurb);

            const btn = document.createElement('button');
            btn.className = 'modal-action-button ' + (owned ? '' : 'accent-button');
            btn.textContent = owned ? 'Open' : '+ Add';
            btn.addEventListener('click', () => owned ? openByName(entry.name) : addPremade(entry));

            card.append(flag, body, btn);
            grid.appendChild(card);
        });
    }

    function addPremade(entry) {
        const deck = Premade.buildDeck(entry.id);
        if (!deck) return;
        if (Config.getDeckNames().includes(deck.name)) { openByName(deck.name); return; }

        Config.saveDeck(deck);
        selected = deck.name;
        refresh();
        renderPremade();
        UI.showMessage(`"${deck.name}" added (${deck.cards.length} cards). Tap Open to start studying.`, 'success', 3500);
    }

    function openByName(name) {
        selected = name;
        openSelected();
    }

    return { init, open, refresh };
})();
