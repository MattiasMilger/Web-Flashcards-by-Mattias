/**
 * dialogs.js - Modal dialog management
 * Handles deck manager, card editor, card add/edit, import from text, settings, data config, and in-app confirms.
 */

const Dialogs = (() => {
    let editingCardIndex = null; // null = adding, number = editing
    let currentConfirmCallback = null;

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
        if (id === 'card-editor-modal') {
            onCardEditorClose();
        }
    }

    function initCloseButtons() {
        // [data-modal] buttons close that modal
        document.querySelectorAll('[data-modal]').forEach(btn => {
            btn.addEventListener('click', () => closeModal(btn.getAttribute('data-modal')));
        });

        // Escape key closes any open modal
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') {
                const open = Array.from(document.querySelectorAll('.modal:not(.hidden)'));
                if (open.length === 0) return;
                // Topmost = highest z-index, then latest in the page
                let top = open[0];
                open.forEach(m => {
                    const z = parseInt(getComputedStyle(m).zIndex, 10) || 0;
                    const tz = parseInt(getComputedStyle(top).zIndex, 10) || 0;
                    if (z >= tz) top = m;
                });
                closeModal(top.id);
            }
        });

        // Click outside modal-content to close ALL modals (no exceptions, responsive and cancelable)
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', e => {
                if (e.target === modal) {
                    closeModal(modal.id);
                }
            });
        });
    }

    // ========================
    // In-App Confirm Dialog (Replaces browser popup confirm())
    // ========================

    function showConfirm({ title, message, confirmText = 'Confirm', danger = false, onConfirm }) {
        const modal = document.getElementById('confirm-modal');
        const titleEl = document.getElementById('confirm-modal-title');
        const msgEl = document.getElementById('confirm-modal-message');
        const confirmBtn = document.getElementById('btn-confirm-action');

        if (!modal || !titleEl || !msgEl || !confirmBtn) {
            if (onConfirm) onConfirm();
            return;
        }

        titleEl.textContent = title || 'Confirm Action';
        msgEl.textContent = message || 'Are you sure?';
        confirmBtn.textContent = confirmText;

        if (danger) {
            confirmBtn.className = 'modal-action-button danger-button';
        } else {
            confirmBtn.className = 'modal-action-button accent-button';
        }

        currentConfirmCallback = onConfirm;
        openModal('confirm-modal');
    }

    function handleConfirmAction() {
        closeModal('confirm-modal');
        if (typeof currentConfirmCallback === 'function') {
            const cb = currentConfirmCallback;
            currentConfirmCallback = null;
            cb();
        }
    }

    // ========================
    // Wire up all dialog button event listeners
    // ========================

    function initEventListeners() {
        // Confirm dialog button
        const confirmBtn = document.getElementById('btn-confirm-action');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', handleConfirmAction);
        }

        // Deck manager (see deckmanager.js)
        DeckManager.init();

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
            if (e.key === 'Enter') {
                const notesInput = document.getElementById('card-notes-input');
                if (notesInput) notesInput.focus();
                else saveCard();
            }
        });

        // Import from text
        document.getElementById('btn-import-confirm').addEventListener('click', importCards);
        document.getElementById('btn-import-txt-file').addEventListener('click', () => {
            document.getElementById('import-txt-file-input').value = '';
            document.getElementById('import-txt-file-input').click();
        });
        document.getElementById('import-txt-file-input').addEventListener('change', handleImportTxtFile);

        // Import from JSON (card editor)
        document.getElementById('btn-import-json-file').addEventListener('click', () => {
            document.getElementById('import-json-file-input').value = '';
            document.getElementById('import-json-file-input').click();
        });
        document.getElementById('import-json-file-input').addEventListener('change', handleImportJsonFile);

        // Settings
        document.getElementById('btn-settings-save').addEventListener('click', saveSettings);
        document.getElementById('btn-extend-confirm').addEventListener('click', extendSessionFromSettings);
        document.getElementById('btn-reset-cards').addEventListener('click', resetDeckCards);

        // Data Config listeners
        initDataConfigListeners();

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
            Session.syncDeck(deck);
            UI.refreshCurrentCard();
        }
    }

    // ========================
    // Data Config Logic
    // ========================

    function openDataConfig() {
        openModal('data-config-modal');
    }

    function openResetConfigModal() {
        const count = Config.getDeckNames().length;
        const countText = document.getElementById('reset-deck-count-text');
        if (countText) {
            countText.textContent = `${count} deck${count !== 1 ? 's' : ''} and all settings will be permanently deleted, restoring the defaults.`;
        }
        const input = document.getElementById('reset-confirm-input');
        if (input) {
            input.value = '';
        }
        const eraseBtn = document.getElementById('btn-erase-everything');
        if (eraseBtn) {
            eraseBtn.disabled = true;
        }
        openModal('reset-config-modal');
        setTimeout(() => {
            if (input) input.focus();
        }, 50);
    }

    function initDataConfigListeners() {
        // Link to open Data Config at bottom
        const link = document.getElementById('link-data-config');
        if (link) {
            link.addEventListener('click', e => {
                e.preventDefault();
                openDataConfig();
            });
        }

        // Export full config
        const btnExport = document.getElementById('btn-export-full-config');
        if (btnExport) {
            btnExport.addEventListener('click', () => {
                Config.exportFullConfig();
                UI.showMessage('Configuration backup exported.', 'success', 2500);
            });
        }

        // Import full config
        const btnImport = document.getElementById('btn-import-full-config');
        const fileInput = document.getElementById('full-config-file-input');
        if (btnImport && fileInput) {
            btnImport.addEventListener('click', () => {
                showConfirm({
                    title: 'Import Config?',
                    message: 'Importing a config overwrites any of your decks that have the same name as a deck in the file, and replaces your current settings. Export your config first if you want a backup.',
                    confirmText: 'Choose File',
                    danger: true,
                    onConfirm: () => {
                        fileInput.value = '';
                        fileInput.click();
                    }
                });
            });
            fileInput.addEventListener('change', handleImportFullConfigFile);
        }

        // Reset Config button in Data Config modal
        const btnResetConfig = document.getElementById('btn-open-reset-config');
        if (btnResetConfig) {
            btnResetConfig.addEventListener('click', openResetConfigModal);
        }

        // Confirmation input validation for reset
        const resetInput = document.getElementById('reset-confirm-input');
        const eraseBtn = document.getElementById('btn-erase-everything');
        if (resetInput && eraseBtn) {
            resetInput.addEventListener('input', () => {
                eraseBtn.disabled = (resetInput.value.trim() !== 'RESET');
            });
            resetInput.addEventListener('keydown', e => {
                if (e.key === 'Enter' && !eraseBtn.disabled) {
                    performResetAll();
                }
            });
        }

        // Erase everything button click
        if (eraseBtn) {
            eraseBtn.addEventListener('click', performResetAll);
        }
    }

    function handleImportFullConfigFile(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = ev => {
            try {
                const parsed = JSON.parse(ev.target.result);
                const res = Config.importFullConfig(parsed);
                if (typeof res === 'string') {
                    UI.showMessage(res, 'error');
                    return;
                }

                closeModal('data-config-modal');
                const cfg = Config.getConfig();
                UI.applyTheme(cfg.theme);

                if (cfg.currentDeckName && Config.loadDeck(cfg.currentDeckName)) {
                    UI.openDeck(cfg.currentDeckName);
                } else if (cfg.deckNames.length > 0) {
                    UI.openDeck(cfg.deckNames[0]);
                } else {
                    UI.updateState();
                }
                DeckManager.refresh();
                UI.showMessage(`Configuration imported (${res.count} deck(s)).`, 'success', 3500);
            } catch (err) {
                UI.showMessage('Failed to parse configuration file: ' + err.message, 'error');
            }
        };
        reader.readAsText(file);
    }

    function performResetAll() {
        Config.resetAllConfig();
        closeModal('reset-config-modal');
        closeModal('data-config-modal');

        const cfg = Config.getConfig();
        UI.applyTheme(cfg.theme);
        if (cfg.currentDeckName && Config.loadDeck(cfg.currentDeckName)) {
            UI.openDeck(cfg.currentDeckName);
        } else {
            UI.updateState();
        }
        DeckManager.refresh();
        UI.showMessage('Configuration reset to defaults.', 'success', 3500);
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
                       c.translation.toLowerCase().includes(term) ||
                       (c.notes && c.notes.toLowerCase().includes(term));
              })
            : cards.slice();

        // Sort: new cards first, then by due date ascending
        list.sort((a, b) => {
            if (!a.dueDate || !b.dueDate) return (a.dueDate ? 1 : 0) - (b.dueDate ? 1 : 0);
            return a.dueDate < b.dueDate ? -1 : a.dueDate > b.dueDate ? 1 : 0;
        });

        if (list.length === 0) {
            container.innerHTML = '<p class="placeholder-text" style="padding: 20px;">No cards found.</p>';
            return;
        }

        list.forEach(card => {
            const realIndex = cards.indexOf(card);

            const row = document.createElement('div');
            row.className = 'card-row';

            // Word - Translation (+ Note preview if present)
            const info = document.createElement('div');
            info.className = 'card-row-info';
            let infoHtml =
                `<span class="card-word">${escHtml(card.word)}</span>` +
                `<span class="card-sep"> - </span>` +
                `<span class="card-translation">${escHtml(card.translation)}</span>`;
            if (card.notes && card.notes.trim()) {
                infoHtml += `<div class="card-notes-preview"><svg class="note-sil-icon" viewBox="0 0 16 16" width="12" height="12" fill="currentColor" aria-hidden="true"><path d="M3 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V5.414a1 1 0 0 0-.293-.707l-3.414-3.414A1 1 0 0 0 9.586 1H3zm6 1.414L11.586 5H9V2.414zM4 3h4v3a1 1 0 0 0 1 1h3v7H4V3zm2 5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1H6zm0 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1H6z"/></svg>${escHtml(card.notes.trim())}</div>`;
            }
            info.innerHTML = infoHtml;

            // Status badge
            const badge = document.createElement('span');
            badge.className = 'card-status-badge';
            badge.textContent = card.dueDate ? `Due: ${card.dueDate}` : 'To Review';

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

    function newCard(word, translation, notes = '') {
        const card = {
            word,
            translation,
            sessionStatus: 'TO_REVIEW',
            dueDate:       null,
            interval:      1,
            easeFactor:    2.5
        };
        if (notes && typeof notes === 'string' && notes.trim()) {
            card.notes = notes.trim();
        }
        return card;
    }

    function openAddCard() {
        editingCardIndex = null;
        document.getElementById('card-edit-title').textContent = 'Add Card';
        document.getElementById('card-word-input').value = '';
        document.getElementById('card-translation-input').value = '';
        const notesInput = document.getElementById('card-notes-input');
        if (notesInput) notesInput.value = '';
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
        const notesInput = document.getElementById('card-notes-input');
        if (notesInput) notesInput.value = card.notes || '';
        openModal('card-edit-modal');
        setTimeout(() => document.getElementById('card-word-input').focus(), 50);
    }

    function saveCard() {
        const word        = document.getElementById('card-word-input').value.trim();
        const translation = document.getElementById('card-translation-input').value.trim();
        const notesInput  = document.getElementById('card-notes-input');
        const notes       = notesInput ? notesInput.value.trim() : '';

        if (!word || !translation) {
            UI.showMessage('Please enter both a word and a translation.', 'error');
            return;
        }

        const deck = UI.getCurrentDeck();
        if (!deck) return;

        if (editingCardIndex !== null) {
            deck.cards[editingCardIndex].word        = word;
            deck.cards[editingCardIndex].translation = translation;
            if (notes) {
                deck.cards[editingCardIndex].notes = notes;
            } else {
                delete deck.cards[editingCardIndex].notes;
            }
            UI.showMessage('Card updated.', 'success', 2000);
        } else {
            deck.cards.push(newCard(word, translation, notes));
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
        // Use in-app confirmation modal without browser popup
        showConfirm({
            title: 'Delete Card?',
            message: `Are you sure you want to delete "${card.word} - ${card.translation}"?`,
            confirmText: 'Delete',
            danger: true,
            onConfirm: () => {
                deck.cards.splice(idx, 1);
                Config.saveDeck(deck);
                renderCardList(deck.cards, document.getElementById('card-search').value.trim());
                UI.showMessage('Card deleted.', 'info', 2000);
            }
        });
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

    function handleImportJsonFile(event) {
        const file = event.target.files[0];
        if (!file) return;

        const deck = UI.getCurrentDeck();
        if (!deck) return;

        const reader = new FileReader();
        reader.onload = e => {
            let data;
            try {
                data = JSON.parse(e.target.result);
            } catch (err) {
                UI.showMessage('Failed to parse .json file: ' + err.message, 'error');
                return;
            }

            const result = Config.importDeck(data);
            if (typeof result === 'string') {
                UI.showMessage(result, 'error');
                return;
            }

            // Merge cards into current deck, skipping exact duplicates
            let added = 0;
            let skipped = 0;
            result.cards.forEach(importedCard => {
                const isDuplicate = deck.cards.some(
                    c => c.word === importedCard.word && c.translation === importedCard.translation
                );
                if (isDuplicate) {
                    skipped++;
                } else {
                    deck.cards.push(newCard(importedCard.word, importedCard.translation, importedCard.notes));
                    added++;
                }
            });

            Config.saveDeck(deck);
            closeModal('import-cards-modal');
            renderCardList(deck.cards, document.getElementById('card-search').value.trim());

            let msg = `${added} card(s) imported from "${file.name}".`;
            if (skipped > 0) msg += ` ${skipped} duplicate(s) skipped.`;
            UI.showMessage(msg, added > 0 ? 'success' : 'warning');
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
                deck.cards.push(newCard(parsed.word, parsed.translation, parsed.notes));
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
        const limit      = deck ? deck.dailyLimit : Config.DEFAULT_DAILY_LIMIT;
        const accumulate = deck ? !!deck.accumulateDailyLimit : false;

        document.getElementById('daily-limit-input').value = limit;

        document.querySelectorAll('input[name="accumulate-limit"]').forEach(r => {
            r.checked = r.value === (accumulate ? 'yes' : 'no');
        });

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
        const limitInput = parseInt(document.getElementById('daily-limit-input').value, 10);
        const limit      = isNaN(limitInput) ? Config.DEFAULT_DAILY_LIMIT : Math.max(1, Math.min(500, limitInput));
        const accumInput = document.querySelector('input[name="accumulate-limit"]:checked');
        const accumulate = accumInput ? accumInput.value === 'yes' : false;

        const deck = UI.getCurrentDeck();
        if (deck) {
            deck.dailyLimit           = limit;
            deck.accumulateDailyLimit = accumulate;
            // If accumulation is turned off, clear any stored extra
            if (!accumulate) deck.accumulatedExtra = 0;
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

        // Use in-app confirmation modal without browser popup
        showConfirm({
            title: 'Reset Cards to "To Review"?',
            message: `Reset all ${deck.cards.length} cards in "${deck.name}" back to "To Review"? This clears all progress and spaced repetition data.`,
            confirmText: 'Reset Cards',
            danger: true,
            onConfirm: () => {
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
        });
    }

    // ========================
    // Quick Note Modal (during review)
    // ========================

    function openQuickNoteModal(card, onSave) {
        if (!card) return;
        const textDisplay = document.getElementById('quick-note-card-text');
        if (textDisplay) {
            textDisplay.textContent = `${card.word} - ${card.translation}`;
        }
        const input = document.getElementById('quick-note-input');
        if (input) {
            input.value = card.notes || '';
        }
        const delBtn = document.getElementById('btn-quick-note-delete');
        if (delBtn) {
            delBtn.classList.toggle('hidden', !card.notes);
        }

        const saveBtn = document.getElementById('btn-quick-note-save');
        if (saveBtn) {
            saveBtn.onclick = () => {
                const newNote = input ? input.value.trim() : '';
                if (newNote) {
                    card.notes = newNote;
                } else {
                    delete card.notes;
                }
                closeModal('quick-note-modal');
                if (typeof onSave === 'function') onSave(card.notes || '');
            };
        }

        if (delBtn) {
            delBtn.onclick = () => {
                delete card.notes;
                closeModal('quick-note-modal');
                if (typeof onSave === 'function') onSave('');
            };
        }

        openModal('quick-note-modal');
        setTimeout(() => {
            if (input) {
                input.focus();
                input.setSelectionRange(input.value.length, input.value.length);
            }
        }, 50);
    }

    // ========================
    // Utility
    // ========================

    /**
     * Parse a single line from a text import.
     * Accepts tab-separated (Anki plain-text export: Front\tBack[\tNotes/Tags...])
     * and dash-separated (Word - Translation or Word - Translation - Notes) formats.
     * Returns { word, translation, notes } or null if the line cannot be parsed.
     */
    function parseTxtLine(line) {
        // Tab-separated: fields are front, back, and optional notes
        const tabIdx = line.indexOf('\t');
        if (tabIdx > 0) {
            const parts = line.split('\t');
            const word        = parts[0].trim();
            const translation = parts[1] ? parts[1].trim() : '';
            const notes       = parts[2] ? parts[2].trim() : '';
            if (word && translation) return { word, translation, notes };
        }
        // Dash-separated: "Word - Translation" or "Word - Translation - Notes"
        const dashIdx = line.indexOf(' - ');
        if (dashIdx > 0) {
            const word = line.substring(0, dashIdx).trim();
            const rest = line.substring(dashIdx + 3);
            const secondDash = rest.indexOf(' - ');
            let translation, notes;
            if (secondDash > 0) {
                translation = rest.substring(0, secondDash).trim();
                notes = rest.substring(secondDash + 3).trim();
            } else {
                translation = rest.trim();
                notes = '';
            }
            if (word && translation) return { word, translation, notes };
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
        showConfirm,

        // Deck manager (implemented in deckmanager.js)
        openDeckManager: () => DeckManager.open(),
        refreshDeckList: () => DeckManager.refresh(),

        // Shared helpers
        parseTxtLine,
        newCard,

        // Card editor
        openCardEditor,

        // Quick Note
        openQuickNoteModal,

        // Settings
        openSettings,

        // Data Config
        openDataConfig
    };
})();
