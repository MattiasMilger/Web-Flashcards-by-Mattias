/**
 * ui.js - Main UI controller
 * Manages application state, card rendering, and wires up all interactions.
 *
 * App states:
 *   NO_DECK          - no deck loaded
 *   SHOW_FRONT       - showing card front (question)
 *   SHOW_BACK        - showing card back (answer) + rating buttons
 *   SESSION_COMPLETE - all cards for today reviewed
 */

const UI = (() => {
    let currentDeck = null;
    let appState = 'NO_DECK';
    let showTranslationFirst = false;
    let rewindTranslationFirst = false; // tracks which face was shown for the last rated card

    // ========================
    // Deck loading
    // ========================

    function openDeck(name) {
        const deck = Config.loadDeck(name);
        if (!deck) {
            showMessage('Deck not found.', 'error');
            return;
        }
        currentDeck = deck;
        Config.getConfig().currentDeckName = name;
        Config.save();

        Session.buildQueue(deck);
        Config.saveDeck(deck); // persist day-reset changes
        updateState();
    }

    function getCurrentDeck() { return currentDeck; }
    function setCurrentDeck(deck) { currentDeck = deck; }

    // ========================
    // State machine
    // ========================

    function updateState() {
        if (!currentDeck) {
            appState = 'NO_DECK';
        } else if (Session.isComplete()) {
            appState = 'SESSION_COMPLETE';
        } else {
            appState = 'SHOW_FRONT';
            showTranslationFirst = Math.random() < 0.5;
        }
        render();
    }

    function refreshCurrentCard() {
        if (!currentDeck) {
            updateState();
            return;
        }
        if (Session.isComplete()) {
            appState = 'SESSION_COMPLETE';
            render();
            return;
        }
        renderDeckStatus();
        if (appState === 'SHOW_FRONT' || appState === 'SHOW_BACK') {
            renderCard(appState === 'SHOW_BACK');
        } else {
            updateState();
        }
    }

    function render() {
        const noArea       = document.getElementById('no-deck-area');
        const sessionArea  = document.getElementById('session-area');
        const completeArea = document.getElementById('complete-area');
        const statusBar    = document.getElementById('deck-status-bar');
        const btnEdit      = document.getElementById('btn-edit-cards');

        // Hide all state areas
        noArea.classList.add('hidden');
        sessionArea.classList.add('hidden');
        completeArea.classList.add('hidden');

        if (appState === 'NO_DECK') {
            noArea.classList.remove('hidden');
            statusBar.classList.add('hidden');
            btnEdit.classList.add('hidden');
            return;
        }

        statusBar.classList.remove('hidden');
        btnEdit.classList.remove('hidden');
        renderDeckStatus();

        if (appState === 'SHOW_FRONT' || appState === 'SHOW_BACK') {
            sessionArea.classList.remove('hidden');
            renderCard(appState === 'SHOW_BACK');
        } else if (appState === 'SESSION_COMPLETE') {
            completeArea.classList.remove('hidden');
            renderComplete();
        }
    }

    // ========================
    // Card rendering
    // ========================

    function renderCard(showBack) {
        const card = Session.getCurrentCard();
        if (!card) return;

        const cardText         = document.getElementById('card-text');
        const cardNotesDisplay = document.getElementById('card-notes-display');
        const noteActionArea   = document.getElementById('note-action-area');
        const btnNoteText      = document.getElementById('btn-session-note-text');
        const cardProgress     = document.getElementById('card-progress');
        const showAnswerArea   = document.getElementById('show-answer-area');
        const ratingButtons    = document.getElementById('rating-buttons');
        const btnBackToFront   = document.getElementById('btn-back-to-front');
        const btnRewind        = document.getElementById('btn-rewind');

        // Card text (randomly show word or translation as the question side)
        const questionSide = showTranslationFirst ? card.translation : card.word;
        const answerSide   = showTranslationFirst ? card.word : card.translation;
        cardText.textContent = showBack ? answerSide : questionSide;

        // Notes display & note action button (only available after pressing show answer).
        // When a note already exists, the note itself is clickable to edit — no separate "Edit Note" button needed.
        if (showBack) {
            if (card.notes && card.notes.trim()) {
                if (cardNotesDisplay) {
                    cardNotesDisplay.innerHTML = `<svg class="note-sil-icon" viewBox="0 0 16 16" width="13" height="13" fill="currentColor" aria-hidden="true"><path d="M3 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V5.414a1 1 0 0 0-.293-.707l-3.414-3.414A1 1 0 0 0 9.586 1H3zm6 1.414L11.586 5H9V2.414zM4 3h4v3a1 1 0 0 0 1 1h3v7H4V3zm2 5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1H6zm0 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1H6z"/></svg><span class="card-notes-label">Note:</span> <span class="card-notes-text">${card.notes.trim()}</span>`;
                    cardNotesDisplay.classList.remove('hidden');
                }
                if (noteActionArea) noteActionArea.classList.add('hidden');
            } else {
                if (cardNotesDisplay) {
                    cardNotesDisplay.innerHTML = '';
                    cardNotesDisplay.classList.add('hidden');
                }
                if (btnNoteText) btnNoteText.textContent = '+ Add Note';
                if (noteActionArea) noteActionArea.classList.remove('hidden');
            }
        } else {
            if (cardNotesDisplay) {
                cardNotesDisplay.innerHTML = '';
                cardNotesDisplay.classList.add('hidden');
            }
            if (noteActionArea) noteActionArea.classList.add('hidden');
        }

        // Progress indicator
        const progress = Session.getProgress();
        cardProgress.textContent = `Card ${progress.current + 1} of ${progress.total}`;

        // Show Answer vs rating buttons
        if (!showBack) {
            showAnswerArea.classList.remove('hidden');
            ratingButtons.classList.add('hidden');
            btnBackToFront.classList.add('hidden');
        } else {
            showAnswerArea.classList.add('hidden');
            btnBackToFront.classList.remove('hidden');
            ratingButtons.classList.remove('hidden');
        }

        // Rewind button
        if (Session.canRewind()) {
            btnRewind.classList.remove('hidden');
        } else {
            btnRewind.classList.add('hidden');
        }
    }

    function renderDeckStatus() {
        if (!currentDeck) return;

        document.getElementById('deck-name-label').textContent = currentDeck.name;

        const stats = Session.getDeckStats(currentDeck);
        document.getElementById('deck-progress-label').textContent =
            `${stats.due} due • ${stats.upcoming} upcoming • ${stats.total} total`;
    }

    function renderComplete() {
        const title    = document.getElementById('complete-title');
        const subtitle = document.getElementById('complete-subtitle');
        const btnRewindComplete = document.getElementById('btn-rewind-complete');
        const stats    = Session.getDeckStats(currentDeck);

        if (btnRewindComplete) {
            if (Session.canRewind()) {
                btnRewindComplete.classList.remove('hidden');
            } else {
                btnRewindComplete.classList.add('hidden');
            }
        }

        title.textContent = 'Session Complete!';
        subtitle.textContent = stats.due === 0
            ? `No more cards due today. ${stats.upcoming} card(s) coming up later.`
            : 'Daily goal reached.';
    }

    // ========================
    // Event handlers
    // ========================

    function onShowAnswer() {
        if (appState !== 'SHOW_FRONT') return;
        appState = 'SHOW_BACK';
        renderCard(true);
    }

    function onBackToFront() {
        if (appState !== 'SHOW_BACK') return;
        appState = 'SHOW_FRONT';
        renderCard(false);
    }

    function onRate(rating) {
        if (appState !== 'SHOW_BACK') return;
        rewindTranslationFirst = showTranslationFirst; // save before updateState re-rolls it
        Session.rateCard(currentDeck, rating);
        Config.saveDeck(currentDeck);
        updateState();
    }

    function onRewind() {
        if (!Session.canRewind()) return;
        if (Session.rewind(currentDeck)) {
            Config.saveDeck(currentDeck);
            showTranslationFirst = rewindTranslationFirst; // restore the original card face
            appState = 'SHOW_FRONT';
            render();
        }
    }

    function onExtendSession() {
        if (!currentDeck) return;
        const amount = parseInt(document.getElementById('extend-amount-main').value, 10) || 5;
        Session.extendSession(currentDeck, amount);
        Config.saveDeck(currentDeck);
        updateState();
    }

    function toggleTheme() {
        const cfg = Config.getConfig();
        cfg.theme = cfg.theme === 'dark' ? 'light' : 'dark';
        applyTheme(cfg.theme);
        Config.save();
    }

    function applyTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }

    // ========================
    // Keyboard shortcuts
    // ========================

    function handleKeyDown(e) {
        // Don't fire when focused on an input/textarea/select
        const tag = document.activeElement ? document.activeElement.tagName : '';
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

        // Don't fire when a modal is open
        const anyModalOpen = Array.from(document.querySelectorAll('.modal')).some(
            m => !m.classList.contains('hidden')
        );
        if (anyModalOpen) return;

        if (appState === 'SHOW_FRONT') {
            if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                onShowAnswer();
            }
        } else if (appState === 'SHOW_BACK') {
            if (e.key === '1') onRate('again');
            if (e.key === '2') onRate('hard');
            if (e.key === '3') onRate('good');
            if (e.key === '4') onRate('easy');
        }
    }

    // ========================
    // Message display
    // ========================

    function showMessage(text, type, duration) {
        type     = type     !== undefined ? type     : 'info';
        duration = duration !== undefined ? duration : 5000;

        const area = document.getElementById('message-area');
        if (!area) return;

        area.className = 'message-area ' + type;
        area.textContent = text;
        area.classList.remove('hidden');

        if (duration > 0) {
            setTimeout(() => area.classList.add('hidden'), duration);
        }
    }

    // ========================
    // Initialization
    // ========================

    function init() {
        Config.load();
        const cfg = Config.getConfig();
        applyTheme(cfg.theme);

        Dialogs.initCloseButtons();
        Dialogs.initEventListeners();

        // Header buttons
        document.getElementById('btn-manage-decks').addEventListener('click', Dialogs.openDeckManager);
        document.getElementById('btn-settings').addEventListener('click', Dialogs.openSettings);
        document.getElementById('btn-edit-cards').addEventListener('click', Dialogs.openCardEditor);
        document.getElementById('btn-toggle-theme').addEventListener('click', toggleTheme);
        document.getElementById('btn-info').addEventListener('click', () => Dialogs.openModal('info-modal'));

        // Session buttons
        document.getElementById('btn-show-answer').addEventListener('click', onShowAnswer);
        document.getElementById('btn-back-to-front').addEventListener('click', onBackToFront);
        document.getElementById('btn-rewind').addEventListener('click', onRewind);
        document.getElementById('btn-rewind-complete').addEventListener('click', onRewind);
        document.getElementById('btn-extend-session-main').addEventListener('click', onExtendSession);

        // Rating buttons
        document.getElementById('btn-again').addEventListener('click', () => onRate('again'));
        document.getElementById('btn-hard').addEventListener('click',  () => onRate('hard'));
        document.getElementById('btn-good').addEventListener('click',  () => onRate('good'));
        document.getElementById('btn-easy').addEventListener('click',  () => onRate('easy'));

        // Session note button
        const btnSessionNote = document.getElementById('btn-session-note');
        if (btnSessionNote) {
            btnSessionNote.addEventListener('click', () => {
                const card = Session.getCurrentCard();
                if (!card) return;
                Dialogs.openQuickNoteModal(card, (savedNote) => {
                    Config.saveDeck(currentDeck);
                    renderCard(true);
                    showMessage(savedNote ? 'Note saved.' : 'Note removed.', 'success', 2000);
                });
            });
        }

        // Card click - copy text to clipboard (unless clicking note)
        const cardDisplay = document.getElementById('card-display');
        cardDisplay.addEventListener('click', (e) => {
            if (e.target.closest('#card-notes-display') || e.target.closest('#note-action-area')) {
                // If clicked on note display, open note editor
                const card = Session.getCurrentCard();
                if (card && appState === 'SHOW_BACK') {
                    Dialogs.openQuickNoteModal(card, (savedNote) => {
                        Config.saveDeck(currentDeck);
                        renderCard(true);
                        showMessage(savedNote ? 'Note saved.' : 'Note removed.', 'success', 2000);
                    });
                }
                return;
            }
            if (!Session.getCurrentCard()) return;
            const text = document.getElementById('card-text').textContent;
            if (navigator.clipboard) {
                navigator.clipboard.writeText(text).then(() => {
                    showMessage('Copied!', 'success', 1500);
                }).catch(() => {});
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', handleKeyDown);

        // Load last-used deck
        if (cfg.currentDeckName && Config.loadDeck(cfg.currentDeckName)) {
            openDeck(cfg.currentDeckName);
        } else if (cfg.deckNames && cfg.deckNames.length > 0) {
            openDeck(cfg.deckNames[0]);
        } else {
            updateState();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    return {
        openDeck,
        getCurrentDeck,
        setCurrentDeck,
        updateState,
        refreshCurrentCard,
        renderDeckStatus,
        showMessage,
        applyTheme
    };
})();
