/**
 * config.js - Configuration and deck management
 * Stores app config and individual decks in localStorage.
 */

const Config = (() => {
    const CONFIG_KEY = 'flashcards_config';
    const DECK_PREFIX = 'flashcards_deck_';

    const DEFAULT_DAILY_LIMIT = 5;
    const SCHEMA_VERSION = 2; // 2 = spaced repetition only

    let config = {
        currentDeckName: null,
        theme: 'dark',
        deckNames: []
    };

    // ========================
    // Date / migration helpers
    // ========================

    function todayStr() {
        return new Date().toISOString().split('T')[0];
    }

    function addDays(dateStr, days) {
        const d = new Date(dateStr + 'T12:00:00');
        d.setDate(d.getDate() + days);
        return d.toISOString().split('T')[0];
    }

    function isValidDate(s) {
        return typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(new Date(s + 'T12:00:00'));
    }

    function toCount(v) {
        const n = parseInt(v, 10);
        return n >= 0 ? n : 0;
    }

    /**
     * Bring any deck (old Simple-mode save, Python-app export, partial data)
     * up to the current schema. Mutates and returns the deck.
     */
    function normalizeDeck(deck) {
        const today = todayStr();
        let finishedCount = 0;

        deck.cards = (Array.isArray(deck.cards) ? deck.cards : []).map(c => {
            let dueDate = c.dueDate || c.due_date || null;
            if (!isValidDate(dueDate)) dueDate = null;

            let interval = Math.round(Number(c.interval));
            if (!(interval >= 1)) interval = 1;

            let ease = Number(c.easeFactor != null ? c.easeFactor : c.ease_factor);
            if (!(ease >= 1.3)) ease = 2.5;

            // Simple-mode "Finished" cards: schedule them instead of resurfacing as new
            const status = c.sessionStatus || c.session_status;
            if (status === 'FINISHED' && !dueDate) {
                interval = Math.max(interval, 7);
                dueDate = addDays(today, 7 + (finishedCount++ % 14));
            }

            return {
                word: String(c.word != null ? c.word : ''),
                translation: String(c.translation != null ? c.translation : ''),
                sessionStatus: dueDate ? 'SPACED' : 'TO_REVIEW',
                dueDate,
                interval,
                easeFactor: Math.round(ease * 1000) / 1000
            };
        }).filter(c => c.word || c.translation);

        const limit = parseInt(deck.dailyLimit != null ? deck.dailyLimit : deck.daily_limit, 10);
        deck.dailyLimit = limit >= 1 ? Math.min(500, limit) : DEFAULT_DAILY_LIMIT;
        deck.learningMode = 'spaced'; // pinned; Simple mode no longer exists
        deck.accumulateDailyLimit = !!deck.accumulateDailyLimit;
        const last = deck.lastSessionDate || deck.last_session_date;
        deck.lastSessionDate = isValidDate(last) ? last : null;
        deck.cardsReviewedToday = toCount(deck.cardsReviewedToday != null ? deck.cardsReviewedToday : deck.cards_reviewed_today);
        deck.sessionExtension = toCount(deck.sessionExtension != null ? deck.sessionExtension : deck.session_extension);
        deck.accumulatedExtra = toCount(deck.accumulatedExtra);
        deck.schemaVersion = SCHEMA_VERSION;

        ['daily_limit', 'learning_mode', 'last_session_date', 'cards_reviewed_today', 'session_extension']
            .forEach(k => delete deck[k]);
        return deck;
    }

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

        // Migrate any older saves once, up front
        config.deckNames.forEach(n => loadDeck(n));
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
            const deck = JSON.parse(raw);
            if (!deck || typeof deck !== 'object') return null;
            if (deck.schemaVersion !== SCHEMA_VERSION) {
                if (!deck.name) deck.name = name;
                normalizeDeck(deck);
                try { localStorage.setItem(deckKey(name), JSON.stringify(deck)); } catch (e) { /* ignore */ }
            }
            return deck;
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
        return true;
    }

    /**
     * Rename a deck: copies data under the new key, removes the old key,
     * and updates all references in config. Returns true on success.
     */
    function renameDeck(oldName, newName) {
        if (!oldName || !newName || oldName === newName) return false;
        if (config.deckNames.includes(newName)) return false;

        const deck = loadDeck(oldName);
        if (!deck) return false;

        // Write under new name, remove old key
        deck.name = newName;
        localStorage.setItem(deckKey(newName), JSON.stringify(deck));
        localStorage.removeItem(deckKey(oldName));

        // Update deckNames list in place (preserves order)
        const idx = config.deckNames.indexOf(oldName);
        if (idx !== -1) config.deckNames[idx] = newName;

        // Update current deck pointer if needed
        if (config.currentDeckName === oldName) {
            config.currentDeckName = newName;
        }

        save();
        return true;
    }

    function createEmptyDeck(name) {
        return {
            name,
            dailyLimit: DEFAULT_DAILY_LIMIT,
            learningMode: 'spaced',
            schemaVersion: SCHEMA_VERSION,
            accumulateDailyLimit: false,
            cards: [],
            lastSessionDate: null,
            cardsReviewedToday: 0,
            sessionExtension: 0,
            accumulatedExtra: 0
        };
    }

    function createExampleDeck() {
        // First-launch default: the premade "Spanish - English" deck
        return Premade.buildDeck('spanish');
    }

    // ========================
    // Export / Import
    // ========================

    function downloadBlob(content, type, filename) {
        const blob = new Blob([content], { type });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href     = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function exportDeckTxt(deck) {
        const lines = deck.cards.map(c => `${c.word} - ${c.translation}`).join('\n');
        downloadBlob(lines, 'text/plain', deck.name.replace(/[^a-z0-9_\-]/gi, '_') + '.txt');
    }

    function exportDeck(deck) {
        downloadBlob(JSON.stringify(deck, null, 2), 'application/json',
            deck.name.replace(/[^a-z0-9_\-]/gi, '_') + '.json');
    }

    /**
     * Validate and normalize an imported deck JSON object.
     * Returns the normalized deck on success, or an error string on failure.
     */
    function importDeck(data) {
        if (!data || typeof data !== 'object') return 'Invalid deck format.';
        if (!data.name || typeof data.name !== 'string') return 'Deck is missing a name.';
        if (!Array.isArray(data.cards)) return 'Deck is missing a cards array.';
        return normalizeDeck(data);
    }

    // ========================
    // Full Data Config (Export, Import, Reset)
    // ========================

    function exportFullConfig() {
        const allDecks = [];
        (config.deckNames || []).forEach(name => {
            const d = loadDeck(name);
            if (d) allDecks.push(d);
        });

        const fullData = {
            appName: 'Web Flashcards by Mattias',
            version: SCHEMA_VERSION,
            exportedAt: new Date().toISOString(),
            config: {
                currentDeckName: config.currentDeckName,
                theme: config.theme,
                deckNames: config.deckNames
            },
            decks: allDecks
        };

        const dateStr = todayStr();
        downloadBlob(JSON.stringify(fullData, null, 2), 'application/json', `flashcards_config_backup_${dateStr}.json`);
    }

    function importFullConfig(data) {
        if (!data || typeof data !== 'object') {
            return 'Invalid backup file: not a JSON object.';
        }

        // Support both full wrapper format or legacy/direct formats
        let incomingDecks = [];
        let incomingConfig = null;

        if (Array.isArray(data.decks)) {
            incomingDecks = data.decks;
            incomingConfig = data.config || {};
        } else if (Array.isArray(data)) {
            incomingDecks = data;
        } else if (data.cards && data.name) {
            // Single deck imported via config
            incomingDecks = [data];
        } else {
            return 'No deck data found in this configuration file.';
        }

        let importedCount = 0;
        incomingDecks.forEach(rawDeck => {
            const validated = importDeck(rawDeck);
            if (typeof validated !== 'string') {
                saveDeck(validated);
                importedCount++;
            }
        });

        if (importedCount === 0) {
            return 'No valid decks could be imported from this file.';
        }

        if (incomingConfig) {
            if (incomingConfig.theme) config.theme = incomingConfig.theme;
            if (incomingConfig.currentDeckName && config.deckNames.includes(incomingConfig.currentDeckName)) {
                config.currentDeckName = incomingConfig.currentDeckName;
            } else if (!config.currentDeckName && config.deckNames.length > 0) {
                config.currentDeckName = config.deckNames[0];
            }
            save();
        }

        return { success: true, count: importedCount };
    }

    function resetAllConfig() {
        // Clear all flashcards_deck_ keys from localStorage
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && (key.startsWith(DECK_PREFIX) || key === CONFIG_KEY)) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(k => localStorage.removeItem(k));

        // Re-initialize clean config
        config = {
            currentDeckName: null,
            theme: 'dark',
            deckNames: []
        };
        const example = createExampleDeck();
        saveDeck(example);
        config.currentDeckName = example.name;
        save();
        return true;
    }

    return {
        DEFAULT_DAILY_LIMIT,
        load,
        save,
        getConfig,
        getDeckNames,
        loadDeck,
        saveDeck,
        deleteDeck,
        renameDeck,
        createEmptyDeck,
        exportDeckTxt,
        exportDeck,
        importDeck,
        exportFullConfig,
        importFullConfig,
        resetAllConfig
    };
})();
