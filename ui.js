/**
 * ui.js — Main UI controller
 * Manages application state, card rendering, and wires up all interactions.
 *
 * App states:
 *   NO_DECK          — no deck loaded
 *   SHOW_FRONT       — showing card front (question)
 *   SHOW_BACK        — showing card back (answer) + rating buttons
 *   SESSION_COMPLETE — all cards for today reviewed
 */

const UI = (() => {
    let currentDeck = null;
    let appState = 'NO_DECK';
    let showTranslationFirst = false;

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
        const cardProgress     = document.getElementById('card-progress');
        const showAnswerArea   = document.getElementById('show-answer-area');
        const ratingSimple     = document.getElementById('rating-simple');
        const ratingSpaced     = document.getElementById('rating-spaced');
        const btnBackToFront   = document.getElementById('btn-back-to-front');
        const btnRewind        = document.getElementById('btn-rewind');

        // Card text (randomly show word or translation as the question side)
        const questionSide = showTranslationFirst ? card.translation : card.word;
        const answerSide   = showTranslationFirst ? card.word : card.translation;
        cardText.textContent = showBack ? answerSide : questionSide;

        // Progress indicator
        const progress = Session.getProgress();
        cardProgress.textContent = `Card ${progress.current + 1} of ${progress.total}`;

        // Show Answer vs rating buttons
        if (!showBack) {
            showAnswerArea.classList.remove('hidden');
            ratingSimple.classList.add('hidden');
            ratingSpaced.classList.add('hidden');
            btnBackToFront.classList.add('hidden');
        } else {
            showAnswerArea.classList.add('hidden');
            btnBackToFront.classList.remove('hidden');

            if (currentDeck.learningMode === 'spaced') {
                ratingSpaced.classList.remove('hidden');
                ratingSimple.classList.add('hidden');
            } else {
                ratingSimple.classList.remove('hidden');
                ratingSpaced.classList.add('hidden');
            }
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
        document.getElementById('deck-mode-label').textContent =
            currentDeck.learningMode === 'spaced' ? 'Spaced Repetition' : 'Simple';

        const stats = Session.getDeckStats(currentDeck);
        const prog  = document.getElementById('deck-progress-label');

        if (stats.mode === 'spaced') {
            prog.textContent = `${stats.due} due • ${stats.upcoming} upcoming • ${stats.total} total`;
        } else {
            prog.textContent = `${stats.toReview} to review • ${stats.finished} finished • ${stats.total} total`;
        }
    }

    function renderComplete() {
        const title    = document.getElementById('complete-title');
        const subtitle = document.getElementById('complete-subtitle');
        const stats    = Session.getDeckStats(currentDeck);

        if (stats.mode === 'simple') {
            if (stats.toReview === 0) {
                title.textContent    = 'All Done!';
                subtitle.textContent = `You have finished all ${stats.total} cards in this deck.`;
            } else {
                title.textContent    = 'Session Complete!';
                subtitle.textContent =
                    `Daily limit reached. ${stats.toReview} card(s) still to review.`;
            }
        } else {
            if (stats.due === 0) {
                title.textContent    = 'Session Complete!';
                subtitle.textContent =
                    `No more cards due today. ${stats.upcoming} card(s) coming up later.`;
            } else {
                title.textContent    = 'Session Complete!';
                subtitle.textContent =
                    `Daily limit reached. ${stats.due} card(s) still due today.`;
            }
        }
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
        Session.rateCard(currentDeck, rating);
        Config.saveDeck(currentDeck);
        updateState();
    }

    function onRewind() {
        if (!Session.canRewind()) return;
        if (Session.rewind(currentDeck)) {
            Config.saveDeck(currentDeck);
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
        const tag = document.activeElement.tagName;
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
            if (currentDeck.learningMode === 'simple') {
                if (e.key === '1') onRate('forgot');
                if (e.key === '2') onRate('remembered');
            } else {
                if (e.key === '1') onRate('again');
                if (e.key === '2') onRate('hard');
                if (e.key === '3') onRate('good');
                if (e.key === '4') onRate('easy');
            }
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
        document.getElementById('btn-extend-session-main').addEventListener('click', onExtendSession);

        // Rating buttons
        document.getElementById('btn-forgot').addEventListener('click',     () => onRate('forgot'));
        document.getElementById('btn-remembered').addEventListener('click', () => onRate('remembered'));
        document.getElementById('btn-again').addEventListener('click',      () => onRate('again'));
        document.getElementById('btn-hard').addEventListener('click',       () => onRate('hard'));
        document.getElementById('btn-good').addEventListener('click',       () => onRate('good'));
        document.getElementById('btn-easy').addEventListener('click',       () => onRate('easy'));

        // Card click — copy text to clipboard
        document.getElementById('card-display').addEventListener('click', () => {
            const card = Session.getCurrentCard();
            if (!card) return;
            const text = appState === 'SHOW_FRONT' ? card.word : card.translation;
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
        } else {
            updateState();
        }
    }

    document.addEventListener('DOMContentLoaded', init);

    return {
        openDeck,
        getCurrentDeck,
        setCurrentDeck,
        updateState,
        renderDeckStatus,
        showMessage,
        applyTheme
    };
})();
