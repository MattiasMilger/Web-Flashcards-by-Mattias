/**
 * config.js — Configuration and deck management
 * Stores app config and individual decks in localStorage.
 */

const Config = (() => {
    const CONFIG_KEY = 'flashcards_config';
    const DECK_PREFIX = 'flashcards_deck_';

    const DEFAULT_DAILY_LIMIT = 5;
    const DEFAULT_LEARNING_MODE = 'simple';

    let config = {
        currentDeckName: null,
        theme: 'dark',
        deckNames: []
    };

    // ========================
    // Config load/save
    // ========================

    function load() {
        const raw = localStorage.getItem(CONFIG_KEY);
        if (raw) {
            try {
                const parsed = JSON.parse(raw);
                config = { ...config, ...parsed };
                if (!Array.isArray(config.deckNames)) config.deckNames = [];
            } catch (e) {
                console.warn('Config: Failed to parse stored config, using defaults.');
                config = { currentDeckName: null, theme: 'dark', deckNames: [] };
            }
        }

        // First launch: create and open the example deck
        if (config.deckNames.length === 0) {
            const example = createExampleDeck();
            saveDeck(example);
            config.currentDeckName = example.name;
            save();
        }
    }

    function save() {
        try {
            localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
        } catch (e) {
            console.error('Config: Failed to save config:', e);
        }
    }

    function getConfig() {
        return config;
    }

    // ========================
    // Deck management
    // ========================

    function deckKey(name) {
        return DECK_PREFIX + name;
    }

    function getDeckNames() {
        return config.deckNames || [];
    }

    function loadDeck(name) {
        const raw = localStorage.getItem(deckKey(name));
        if (!raw) return null;
        try {
            return JSON.parse(raw);
        } catch (e) {
            console.warn('Config: Failed to parse deck:', name);
            return null;
        }
    }

    function saveDeck(deck) {
        if (!deck || !deck.name) return false;
        try {
            localStorage.setItem(deckKey(deck.name), JSON.stringify(deck));
            if (!config.deckNames.includes(deck.name)) {
                config.deckNames.push(deck.name);
                save();
            }
            return true;
        } catch (e) {
            console.error('Config: Failed to save deck:', e);
            return false;
        }
    }

    function deleteDeck(name) {
        localStorage.removeItem(deckKey(name));
        config.deckNames = config.deckNames.filter(n => n !== name);
        if (config.currentDeckName === name) {
            config.currentDeckName = null;
        }
        save();
    }

    function createEmptyDeck(name) {
        return {
            name,
            dailyLimit: DEFAULT_DAILY_LIMIT,
            learningMode: DEFAULT_LEARNING_MODE,
            cards: [],
            lastSessionDate: null,
            cardsReviewedToday: 0,
            sessionExtension: 0
        };
    }

    function createExampleDeck() {
        const deck = createEmptyDeck('Spanish Basics (Example)');
        deck.dailyLimit = 5;
        deck.cards = [
            { word: 'Hola',            translation: 'Hello',        sessionStatus: 'TO_REVIEW', dueDate: null, interval: 1, easeFactor: 2.5 },
            { word: 'Adiós',           translation: 'Goodbye',      sessionStatus: 'TO_REVIEW', dueDate: null, interval: 1, easeFactor: 2.5 },
            { word: 'Gracias',         translation: 'Thank you',    sessionStatus: 'TO_REVIEW', dueDate: null, interval: 1, easeFactor: 2.5 },
            { word: 'Por favor',       translation: 'Please',       sessionStatus: 'TO_REVIEW', dueDate: null, interval: 1, easeFactor: 2.5 },
            { word: 'Sí',              translation: 'Yes',          sessionStatus: 'TO_REVIEW', dueDate: null, interval: 1, easeFactor: 2.5 },
            { word: 'Lo siento',       translation: 'I am sorry',   sessionStatus: 'TO_REVIEW', dueDate: null, interval: 1, easeFactor: 2.5 },
            { word: 'Gato',            translation: 'Cat',          sessionStatus: 'TO_REVIEW', dueDate: null, interval: 1, easeFactor: 2.5 },
            { word: 'Perro',           translation: 'Dog',          sessionStatus: 'TO_REVIEW', dueDate: null, interval: 1, easeFactor: 2.5 },
            { word: 'Agua',            translation: 'Water',        sessionStatus: 'TO_REVIEW', dueDate: null, interval: 1, easeFactor: 2.5 },
            { word: 'Pan',             translation: 'Bread',        sessionStatus: 'TO_REVIEW', dueDate: null, interval: 1, easeFactor: 2.5 },
            { word: 'Casa',            translation: 'House',        sessionStatus: 'TO_REVIEW', dueDate: null, interval: 1, easeFactor: 2.5 },
            { word: 'Libro',           translation: 'Book',         sessionStatus: 'TO_REVIEW', dueDate: null, interval: 1, easeFactor: 2.5 }
        ];
        return deck;
    }

    // ========================
    // Export / Import
    // ========================

    function exportDeck(deck) {
        const data = JSON.stringify(deck, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = deck.name.replace(/[^a-z0-9_\-]/gi, '_') + '.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * Validate and normalize an imported deck JSON object.
     * Returns the normalized deck on success, or an error string on failure.
     */
    function importDeck(data) {
        if (!data || typeof data !== 'object') return 'Invalid deck format.';
        if (!data.name || typeof data.name !== 'string') return 'Deck is missing a name.';
        if (!Array.isArray(data.cards)) return 'Deck is missing a cards array.';

        // Normalize cards (support both camelCase and snake_case keys from Python export)
        data.cards = data.cards.map(card => ({
            word: card.word || '',
            translation: card.translation || '',
            sessionStatus: card.sessionStatus || card.session_status || 'TO_REVIEW',
            dueDate: card.dueDate || card.due_date || null,
            interval: card.interval != null ? card.interval : 1,
            easeFactor: card.easeFactor || card.ease_factor || 2.5
        })).filter(c => c.word || c.translation);

        // Normalize deck-level fields
        data.dailyLimit = data.dailyLimit || data.daily_limit || DEFAULT_DAILY_LIMIT;
        data.learningMode = data.learningMode || data.learning_mode || DEFAULT_LEARNING_MODE;
        data.lastSessionDate = data.lastSessionDate || data.last_session_date || null;
        data.cardsReviewedToday = data.cardsReviewedToday || data.cards_reviewed_today || 0;
        data.sessionExtension = data.sessionExtension || data.session_extension || 0;

        return data;
    }

    return {
        DEFAULT_DAILY_LIMIT,
        DEFAULT_LEARNING_MODE,
        load,
        save,
        getConfig,
        getDeckNames,
        loadDeck,
        saveDeck,
        deleteDeck,
        createEmptyDeck,
        exportDeck,
        importDeck
    };
})();
