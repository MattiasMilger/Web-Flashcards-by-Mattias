/**
 * dialogs.js — Modal dialog management
 * Handles deck manager, card editor, card add/edit, import from text, and settings.
 */

const Dialogs = (() => {
    let editingCardIndex = null; // null = adding, number = editing

    // ========================
    // Generic modal helpers
    // ========================

    function openModal(id) {
        const el = document.getElementById(id);
        if (el) el.classList.remove('hidden');
    }

    function closeModal(id) {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
    }

    function initCloseButtons() {
        // [data-modal] buttons close that modal
        document.querySelectorAll('[data-modal]').forEach(btn => {
            btn.addEventListener('click', () => closeModal(btn.getAttribute('data-modal')));
        });

        // Escape key closes any open modal
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal:not(.hidden)').forEach(m => {
                    m.classList.add('hidden');
                });
            }
        });

        // Click outside modal-content to close (except deck/card editor modals)
        const noBackgroundClose = ['deck-manager-modal', 'card-editor-modal'];
        document.querySelectorAll('.modal').forEach(modal => {
            if (noBackgroundClose.includes(modal.id)) return;
            modal.addEventListener('click', e => {
                if (e.target === modal) modal.classList.add('hidden');
            });
        });
    }

    // ========================
    // Wire up all dialog button event listeners
    // ========================

    function initEventListeners() {
        // Deck manager
        document.getElementById('btn-deck-open').addEventListener('click', openSelectedDeck);
        document.getElementById('btn-deck-new').addEventListener('click', openNewDeckModal);
        document.getElementById('btn-deck-delete').addEventListener('click', deleteSelectedDeck);
        document.getElementById('btn-deck-export').addEventListener('click', exportSelectedDeck);
        document.getElementById('btn-deck-export-txt').addEventListener('click', exportSelectedDeckTxt);
        document.getElementById('btn-deck-import-trigger').addEventListener('click', triggerDeckImport);
        document.getElementById('deck-file-input').addEventListener('change', handleDeckImportFile);
        document.getElementById('btn-deck-import-txt-trigger').addEventListener('click', () => {
            document.getElementById('deck-txt-file-input').value = '';
            document.getElementById('deck-txt-file-input').click();
        });
        document.getElementById('deck-txt-file-input').addEventListener('change', handleDeckImportTxtFile);
        document.getElementById('btn-new-deck-create').addEventListener('click', createNewDeck);

        // Allow Enter in deck name field to create
        document.getElementById('new-deck-name').addEventListener('keydown', e => {
            if (e.key === 'Enter') createNewDeck();
        });

        // Card editor
        document.getElementById('card-search').addEventListener('input', () => {
            const deck = UI.getCurrentDeck();
            if (deck) renderCardList(deck.cards, document.getElementById('card-search').value.trim());
        });
        document.getElementById('btn-add-card').addEventListener('click', openAddCard);
        document.getElementById('btn-import-cards-open').addEventListener('click', openImportCards);

        // Card add/edit
        document.getElementById('btn-card-save').addEventListener('click', saveCard);
        document.getElementById('card-word-input').addEventListener('keydown', e => {
            if (e.key === 'Enter') document.getElementById('card-translation-input').focus();
        });
        document.getElementById('card-translation-input').addEventListener('keydown', e => {
            if (e.key === 'Enter') saveCard();
        });

        // Import from text
        document.getElementById('btn-import-confirm').addEventListener('click', importCards);
        document.getElementById('btn-import-txt-file').addEventListener('click', () => {
            document.getElementById('import-txt-file-input').value = '';
            document.getElementById('import-txt-file-input').click();
        });
        document.getElementById('import-txt-file-input').addEventListener('change', handleImportTxtFile);

        // Settings
        document.getElementById('btn-settings-save').addEventListener('click', saveSettings);
        document.getElementById('btn-extend-confirm').addEventListener('click', extendSessionFromSettings);
        document.getElementById('btn-reset-cards').addEventListener('click', resetDeckCards);

        // Re-build session queue when card editor closes (cards may have changed)
        document.getElementById('card-editor-modal').querySelector('.modal-close-button')
            .addEventListener('click', onCardEditorClose);
        document.getElementById('card-editor-modal').querySelector('.close-button')
            .addEventListener('click', onCardEditorClose);
    }

    function onCardEditorClose() {
        const deck = UI.getCurrentDeck();
        if (deck) {
            Config.saveDeck(deck);
            Session.buildQueue(deck);
            UI.updateState();
        }
    }

    // ========================
    // Deck Manager
    // ========================

    function openDeckManager() {
        refreshDeckList();
        openModal('deck-manager-modal');
    }

    function refreshDeckList() {
        const listbox = document.getElementById('deck-listbox');
        listbox.innerHTML = '';

        const names = Config.getDeckNames();
        const currentName = Config.getConfig().currentDeckName;

        if (names.length === 0) {
            const opt = document.createElement('option');
            opt.disabled = true;
            opt.textContent = '(No decks yet — create or import one)';
            listbox.appendChild(opt);
            return;
        }

        names.forEach(name => {
            const deck = Config.loadDeck(name);
            const count = deck ? deck.cards.length : 0;
            const mode  = deck ? (deck.learningMode === 'spaced' ? ' [Spaced]' : ' [Simple]') : '';
            const opt   = document.createElement('option');
            opt.value   = name;
            opt.textContent = `${name}${mode} — ${count} card${count !== 1 ? 's' : ''}${name === currentName ? ' ✓' : ''}`;
            listbox.appendChild(opt);
        });
    }

    function openSelectedDeck() {
        const listbox  = document.getElementById('deck-listbox');
        const selected = listbox.value;
        if (!selected) { UI.showMessage('Please select a deck.', 'warning'); return; }

        UI.openDeck(selected);
        closeModal('deck-manager-modal');
    }

    function openNewDeckModal() {
        document.getElementById('new-deck-name').value = '';
        openModal('new-deck-modal');
        setTimeout(() => document.getElementById('new-deck-name').focus(), 50);
    }

    function createNewDeck() {
        const name = document.getElementById('new-deck-name').value.trim();
        if (!name) { UI.showMessage('Please enter a deck name.', 'error'); return; }

        if (Config.getDeckNames().includes(name)) {
            UI.showMessage(`A deck named "${name}" already exists.`, 'error');
            return;
        }

        const deck = Config.createEmptyDeck(name);
        Config.saveDeck(deck);
        closeModal('new-deck-modal');
        refreshDeckList();
        UI.openDeck(name);
        closeModal('deck-manager-modal');
        UI.showMessage(`Deck "${name}" created.`, 'success');
    }

    function deleteSelectedDeck() {
        const listbox  = document.getElementById('deck-listbox');
        const selected = listbox.value;
        if (!selected) { UI.showMessage('Please select a deck to delete.', 'warning'); return; }

        if (!confirm(`Delete deck "${selected}"? This cannot be undone.`)) return;

        Config.deleteDeck(selected);
        refreshDeckList();

        if (!Config.getConfig().currentDeckName) {
            UI.setCurrentDeck(null);
            UI.updateState();
        }

        UI.showMessage(`Deck "${selected}" deleted.`, 'info');
    }

    function exportSelectedDeck() {
        const listbox  = document.getElementById('deck-listbox');
        const selected = listbox.value;
        if (!selected) { UI.showMessage('Please select a deck to export.', 'warning'); return; }

        const deck = Config.loadDeck(selected);
        if (!deck) return;

        Config.exportDeck(deck);
        UI.showMessage(`Deck "${selected}" exported.`, 'success', 3000);
    }

    function exportSelectedDeckTxt() {
        const listbox  = document.getElementById('deck-listbox');
        const selected = listbox.value;
        if (!selected) { UI.showMessage('Please select a deck to export.', 'warning'); return; }

        const deck = Config.loadDeck(selected);
        if (!deck) return;

        Config.exportDeckTxt(deck);
        UI.showMessage(`Deck "${selected}" exported as .txt.`, 'success', 3000);
    }

    function triggerDeckImport() {
        const fi = document.getElementById('deck-file-input');
        fi.value = '';
        fi.click();
    }

    function handleDeckImportFile(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = e => {
            try {
                const data   = JSON.parse(e.target.result);
                const result = Config.importDeck(data);

                if (typeof result === 'string') {
                    UI.showMessage(result, 'error');
                    return;
                }

                // Resolve name conflict
                let finalName = result.name;
                if (Config.getDeckNames().includes(finalName)) {
                    finalName = finalName + ' (imported)';
                    result.name = finalName;
                }

                Config.saveDeck(result);
                refreshDeckList();
                UI.showMessage(
                    `Deck "${finalName}" imported (${result.cards.length} cards).`,
                    'success'
                );
            } catch (err) {
                UI.showMessage('Failed to parse deck file: ' + err.message, 'error');
            }
        };
        reader.readAsText(file);
    }

    function handleDeckImportTxtFile(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = e => {
            const lines = e.target.result.split('\n').filter(l => l.trim());
            const cards = [];
            const skipped = [];

            lines.forEach(line => {
                if (line.startsWith('#')) return; // Anki export comment/header lines
                const parsed = parseTxtLine(line);
                if (parsed) {
                    cards.push({
                        word: parsed.word, translation: parsed.translation,
                        sessionStatus: 'TO_REVIEW',
                        dueDate: null, interval: 1, easeFactor: 2.5
                    });
                } else { skipped.push(line); }
            });

            if (cards.length === 0) {
                UI.showMessage('No valid cards found. Use "Word - Translation" or tab-separated (Anki) format.', 'error');
                return;
            }

            // Use filename (without extension) as deck name
            let deckName = file.name.replace(/\.txt$/i, '').trim() || 'Imported Deck';
            if (Config.getDeckNames().includes(deckName)) {
                deckName = deckName + ' (imported)';
            }

            const deck = Config.createEmptyDeck(deckName);
            deck.cards = cards;
            Config.saveDeck(deck);
            refreshDeckList();

            let msg = `Deck "${deckName}" created with ${cards.length} card(s).`;
            if (skipped.length > 0) msg += ` ${skipped.length} line(s) skipped.`;
            UI.showMessage(msg, 'success');
        };
        reader.readAsText(file);
    }

    // ========================
    // Card Editor
    // ========================

    function openCardEditor() {
        const deck = UI.getCurrentDeck();
        if (!deck) return;

        document.getElementById('editor-deck-name').textContent = deck.name;
        document.getElementById('card-search').value = '';
        renderCardList(deck.cards, '');
        openModal('card-editor-modal');
    }

    function renderCardList(cards, filter) {
        const container = document.getElementById('card-list');
        container.innerHTML = '';

        let list = filter
            ? cards.filter(c => {
                const term = filter.toLowerCase();
                return c.word.toLowerCase().includes(term) ||
                       c.translation.toLowerCase().includes(term);
              })
            : cards.slice();

        // Sort: TO_REVIEW first, then SPACED by due date, then FINISHED last
        const statusOrder = s => s === 'FINISHED' ? 2 : s === 'SPACED' ? 1 : 0;
        list.sort((a, b) => {
            const diff = statusOrder(a.sessionStatus) - statusOrder(b.sessionStatus);
            if (diff !== 0) return diff;
            // Within SPACED, sort by due date ascending
            if (a.sessionStatus === 'SPACED' && b.sessionStatus === 'SPACED') {
                return (a.dueDate || '') < (b.dueDate || '') ? -1 : 1;
            }
            return 0;
        });

        if (list.length === 0) {
            container.innerHTML = '<p class="placeholder-text" style="padding: 20px;">No cards found.</p>';
            return;
        }

        list.forEach(card => {
            const realIndex = cards.indexOf(card);

            const row = document.createElement('div');
            row.className = 'card-row';

            // Word — Translation
            const info = document.createElement('div');
            info.className = 'card-row-info';
            info.innerHTML =
                `<span class="card-word">${escHtml(card.word)}</span>` +
                `<span class="card-sep"> — </span>` +
                `<span class="card-translation">${escHtml(card.translation)}</span>`;

            // Status badge
            const badge = document.createElement('span');
            badge.className = 'card-status-badge';
            if (card.sessionStatus === 'FINISHED') {
                badge.textContent = 'Finished';
            } else if (card.dueDate) {
                badge.textContent = `Due: ${card.dueDate}`;
            } else {
                badge.textContent = 'To Review';
            }

            // Action buttons
            const actions = document.createElement('div');
            actions.className = 'card-row-actions';

            const editBtn = document.createElement('button');
            editBtn.className = 'card-action-btn';
            editBtn.textContent = 'Edit';
            editBtn.addEventListener('click', () => openEditCard(realIndex));

            const delBtn = document.createElement('button');
            delBtn.className = 'card-action-btn danger';
            delBtn.textContent = 'Delete';
            delBtn.addEventListener('click', () => deleteCard(realIndex));

            actions.appendChild(editBtn);
            actions.appendChild(delBtn);

            row.appendChild(info);
            row.appendChild(badge);
            row.appendChild(actions);
            container.appendChild(row);
        });
    }

    function openAddCard() {
        editingCardIndex = null;
        document.getElementById('card-edit-title').textContent = 'Add Card';
        document.getElementById('card-word-input').value = '';
        document.getElementById('card-translation-input').value = '';
        openModal('card-edit-modal');
        setTimeout(() => document.getElementById('card-word-input').focus(), 50);
    }

    function openEditCard(idx) {
        const deck = UI.getCurrentDeck();
        if (!deck || idx < 0 || idx >= deck.cards.length) return;

        const card = deck.cards[idx];
        editingCardIndex = idx;
        document.getElementById('card-edit-title').textContent = 'Edit Card';
        document.getElementById('card-word-input').value = card.word;
        document.getElementById('card-translation-input').value = card.translation;
        openModal('card-edit-modal');
        setTimeout(() => document.getElementById('card-word-input').focus(), 50);
    }

    function saveCard() {
        const word        = document.getElementById('card-word-input').value.trim();
        const translation = document.getElementById('card-translation-input').value.trim();

        if (!word || !translation) {
            UI.showMessage('Please enter both a word and a translation.', 'error');
            return;
        }

        const deck = UI.getCurrentDeck();
        if (!deck) return;

        if (editingCardIndex !== null) {
            deck.cards[editingCardIndex].word        = word;
            deck.cards[editingCardIndex].translation = translation;
            UI.showMessage('Card updated.', 'success', 2000);
        } else {
            deck.cards.push({
                word,
                translation,
                sessionStatus: 'TO_REVIEW',
                dueDate:       null,
                interval:      1,
                easeFactor:    2.5
            });
            UI.showMessage('Card added.', 'success', 2000);
        }

        Config.saveDeck(deck);
        closeModal('card-edit-modal');
        renderCardList(deck.cards, document.getElementById('card-search').value.trim());
    }

    function deleteCard(idx) {
        const deck = UI.getCurrentDeck();
        if (!deck || idx < 0 || idx >= deck.cards.length) return;

        const card = deck.cards[idx];
        if (!confirm(`Delete "${card.word} — ${card.translation}"?`)) return;

        deck.cards.splice(idx, 1);
        Config.saveDeck(deck);
        renderCardList(deck.cards, document.getElementById('card-search').value.trim());
        UI.showMessage('Card deleted.', 'info', 2000);
    }

    // ========================
    // Import Cards from Text
    // ========================

    function openImportCards() {
        document.getElementById('import-text-area').value = '';
        document.getElementById('import-file-name').textContent = 'or paste text below';
        openModal('import-cards-modal');
        setTimeout(() => document.getElementById('import-text-area').focus(), 50);
    }

    function handleImportTxtFile(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = e => {
            document.getElementById('import-text-area').value = e.target.result;
            document.getElementById('import-file-name').textContent = file.name;
        };
        reader.readAsText(file);
    }

    function importCards() {
        const text = document.getElementById('import-text-area').value.trim();
        if (!text) { UI.showMessage('Please enter cards to import.', 'warning'); return; }

        const deck = UI.getCurrentDeck();
        if (!deck) return;

        const lines   = text.split('\n').filter(l => l.trim());
        let   added   = 0;
        let   skipped = 0;

        lines.forEach(line => {
            if (line.startsWith('#')) return; // Anki export comment/header lines
            const parsed = parseTxtLine(line);
            if (parsed) {
                deck.cards.push({
                    word:          parsed.word,
                    translation:   parsed.translation,
                    sessionStatus: 'TO_REVIEW',
                    dueDate:       null,
                    interval:      1,
                    easeFactor:    2.5
                });
                added++;
            } else {
                skipped++;
            }
        });

        Config.saveDeck(deck);
        closeModal('import-cards-modal');
        renderCardList(deck.cards, document.getElementById('card-search').value.trim());

        let msg = `${added} card(s) imported.`;
        if (skipped > 0) msg += ` ${skipped} line(s) skipped (use "Word - Translation" or tab-separated format).`;
        UI.showMessage(msg, added > 0 ? 'success' : 'warning');
    }

    // ========================
    // Settings
    // ========================

    function openSettings() {
        const deck = UI.getCurrentDeck();
        const mode  = deck ? deck.learningMode : Config.DEFAULT_LEARNING_MODE;
        const limit = deck ? deck.dailyLimit   : Config.DEFAULT_DAILY_LIMIT;

        document.querySelectorAll('input[name="learning-mode"]').forEach(r => {
            r.checked = r.value === mode;
        });
        document.getElementById('daily-limit-input').value = limit;

        // Show extend only when a deck is active
        const extendGroup = document.getElementById('extend-session-group');
        if (deck) {
            extendGroup.classList.remove('hidden');
        } else {
            extendGroup.classList.add('hidden');
        }

        openModal('settings-modal');
    }

    function saveSettings() {
        const modeInput  = document.querySelector('input[name="learning-mode"]:checked');
        const mode       = modeInput ? modeInput.value : Config.DEFAULT_LEARNING_MODE;
        const limitInput = parseInt(document.getElementById('daily-limit-input').value, 10);
        const limit      = isNaN(limitInput) ? Config.DEFAULT_DAILY_LIMIT : Math.max(1, Math.min(500, limitInput));

        const deck = UI.getCurrentDeck();
        if (deck) {
            deck.learningMode = mode;
            deck.dailyLimit   = limit;
            Config.saveDeck(deck);
            Session.buildQueue(deck);
            UI.updateState();
        }

        closeModal('settings-modal');
        UI.showMessage('Settings saved.', 'success', 2000);
    }

    function extendSessionFromSettings() {
        const deck = UI.getCurrentDeck();
        if (!deck) return;

        const amountInput = parseInt(document.getElementById('extend-amount').value, 10);
        const amount      = isNaN(amountInput) ? 5 : Math.max(1, amountInput);

        Session.extendSession(deck, amount);
        Config.saveDeck(deck);
        closeModal('settings-modal');
        UI.updateState();
        UI.showMessage(`Session extended by ${amount} card(s).`, 'success', 3000);
    }

    function resetDeckCards() {
        const deck = UI.getCurrentDeck();
        if (!deck) return;

        if (!confirm(`Reset all ${deck.cards.length} cards in "${deck.name}" back to "To Review"? This clears all progress and spaced repetition data.`)) return;

        deck.cards.forEach(card => {
            card.sessionStatus = 'TO_REVIEW';
            card.dueDate       = null;
            card.interval      = 1;
            card.easeFactor    = 2.5;
        });
        deck.cardsReviewedToday = 0;
        deck.sessionExtension   = 0;
        deck.lastSessionDate    = null;

        Config.saveDeck(deck);
        Session.buildQueue(deck);
        renderCardList(deck.cards, '');
        UI.updateState();
        UI.showMessage(`All cards in "${deck.name}" reset to "To Review".`, 'success');
    }

    // ========================
    // Utility
    // ========================

    /**
     * Parse a single line from a text import.
     * Accepts tab-separated (Anki plain-text export: Front\tBack[\tTags...])
     * and dash-separated (Word - Translation) formats.
     * Returns { word, translation } or null if the line cannot be parsed.
     */
    function parseTxtLine(line) {
        // Tab-separated: first two fields are front and back; any further fields (e.g. tags) are ignored
        const tabIdx = line.indexOf('\t');
        if (tabIdx > 0) {
            const word        = line.substring(0, tabIdx).trim();
            const translation = line.substring(tabIdx + 1).split('\t')[0].trim();
            if (word && translation) return { word, translation };
        }
        // Dash-separated
        const dashIdx = line.indexOf(' - ');
        if (dashIdx > 0) {
            const word        = line.substring(0, dashIdx).trim();
            const translation = line.substring(dashIdx + 3).trim();
            if (word && translation) return { word, translation };
        }
        return null;
    }

    function escHtml(str) {
        const div = document.createElement('div');
        div.appendChild(document.createTextNode(str || ''));
        return div.innerHTML;
    }

    return {
        openModal,
        closeModal,
        initCloseButtons,
        initEventListeners,

        // Deck manager
        openDeckManager,
        refreshDeckList,

        // Card editor
        openCardEditor,

        // Settings
        openSettings
    };
})();
