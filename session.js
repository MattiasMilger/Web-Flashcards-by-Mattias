/**
 * session.js — Session logic and SM-2 spaced repetition algorithm
 * Handles queue building, card rating, rewind, and deck statistics.
 */

const Session = (() => {
    let queue = [];          // Cards selected for this session
    let currentIndex = 0;    // Position in queue
    let rewindBackup = null; // Saved state for undo

    // ========================
    // Date helpers
    // ========================

    function getTodayStr() {
        return new Date().toISOString().split('T')[0];
    }

    function addDays(dateStr, days) {
        const d = new Date(dateStr + 'T12:00:00');
        d.setDate(d.getDate() + days);
        return d.toISOString().split('T')[0];
    }

    // ========================
    // Day reset
    // ========================

    /**
     * If the deck was last used on a previous day, reset daily counters.
     */
    function checkDayReset(deck) {
        const today = getTodayStr();
        if (deck.lastSessionDate !== today) {
            deck.lastSessionDate = today;
            deck.cardsReviewedToday = 0;
            deck.sessionExtension = 0;
        }
    }

    // ========================
    // Queue building
    // ========================

    /**
     * Build the session queue from the deck cards.
     * Respects daily limit and learning mode.
     */
    function buildQueue(deck) {
        checkDayReset(deck);

        const today = getTodayStr();
        const effectiveLimit = (deck.dailyLimit || 5) + (deck.sessionExtension || 0);
        const alreadyDone = deck.cardsReviewedToday || 0;
        const remaining = Math.max(0, effectiveLimit - alreadyDone);

        let candidates = [];

        if (deck.learningMode === 'spaced') {
            // Cards with no due date (new) or due date <= today
            candidates = deck.cards.filter(c => !c.dueDate || c.dueDate <= today);
        } else {
            // Simple mode: any card that isn't finished (includes SPACED cards from previous mode)
            candidates = deck.cards.filter(c => c.sessionStatus !== 'FINISHED');
        }

        // Shuffle candidates
        for (let i = candidates.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
        }

        queue = candidates.slice(0, remaining);
        currentIndex = 0;
        rewindBackup = null;
    }

    // ========================
    // Session state queries
    // ========================

    function getCurrentCard() {
        if (currentIndex >= queue.length) return null;
        return queue[currentIndex];
    }

    function isComplete() {
        return currentIndex >= queue.length;
    }

    function getProgress() {
        return { current: currentIndex, total: queue.length };
    }

    function canRewind() {
        return rewindBackup !== null;
    }

    // ========================
    // Card rating
    // ========================

    /**
     * Rate the current card.
     * Simple mode:  rating = 'forgot' | 'remembered'
     * Spaced mode:  rating = 'again' | 'hard' | 'good' | 'easy'
     */
    function rateCard(deck, rating) {
        if (currentIndex >= queue.length) return;

        const queueCard = queue[currentIndex];

        // Find the matching card in deck.cards (by reference or value)
        const deckCard = deck.cards.find(c => c === queueCard ||
            (c.word === queueCard.word && c.translation === queueCard.translation));

        if (!deckCard) { currentIndex++; return; }

        // Save backup before mutating
        rewindBackup = {
            index: currentIndex,
            cardSnapshot: { ...deckCard },
            deckCardRef: deckCard,
            cardsReviewedToday: deck.cardsReviewedToday || 0
        };

        const today = getTodayStr();

        if (deck.learningMode === 'spaced') {
            applySpacedRating(deckCard, rating, today);
        } else {
            // Simple mode
            if (rating === 'remembered') {
                deckCard.sessionStatus = 'FINISHED';
            }
            // 'forgot' keeps sessionStatus as 'TO_REVIEW'
        }

        deck.cardsReviewedToday = (deck.cardsReviewedToday || 0) + 1;
        currentIndex++;
    }

    /**
     * Apply SM-2 algorithm to a card.
     */
    function applySpacedRating(card, rating, today) {
        let interval = card.interval || 1;
        let ease = card.easeFactor || 2.5;

        if (rating === 'again') {
            interval = 1;
            ease = Math.max(1.3, ease - 0.2);
            card.dueDate = today;
        } else if (rating === 'hard') {
            interval = Math.max(1, Math.round(interval * 1.2));
            ease = Math.max(1.3, ease - 0.15);
            card.dueDate = addDays(today, interval);
        } else if (rating === 'good') {
            interval = Math.max(1, Math.round(interval * ease));
            card.dueDate = addDays(today, interval);
        } else if (rating === 'easy') {
            interval = Math.max(1, Math.round(interval * ease * 1.3));
            ease = ease + 0.15;
            card.dueDate = addDays(today, interval);
        }

        card.interval = interval;
        card.easeFactor = Math.round(ease * 1000) / 1000;
        card.sessionStatus = 'SPACED';
    }

    // ========================
    // Rewind
    // ========================

    /**
     * Undo the last card rating. Returns true on success.
     */
    function rewind(deck) {
        if (!rewindBackup) return false;

        const { index, cardSnapshot, deckCardRef, cardsReviewedToday } = rewindBackup;

        // Restore card state
        Object.assign(deckCardRef, cardSnapshot);

        // Restore queue position and also restore queue card snapshot
        queue[index] = deckCardRef;
        currentIndex = index;

        // Restore counter
        deck.cardsReviewedToday = cardsReviewedToday;

        rewindBackup = null;
        return true;
    }

    // ========================
    // Session extension
    // ========================

    function extendSession(deck, amount) {
        deck.sessionExtension = (deck.sessionExtension || 0) + Math.max(1, amount);
        buildQueue(deck);
    }

    // ========================
    // Stats
    // ========================

    /**
     * Get deck statistics for display.
     */
    function getDeckStats(deck) {
        const today = getTodayStr();

        if (deck.learningMode === 'spaced') {
            const total = deck.cards.length;
            const due = deck.cards.filter(c => !c.dueDate || c.dueDate <= today).length;
            const upcoming = deck.cards.filter(c => c.dueDate && c.dueDate > today).length;
            return { mode: 'spaced', total, due, upcoming };
        } else {
            const total = deck.cards.length;
            const finished = deck.cards.filter(c => c.sessionStatus === 'FINISHED').length;
            const toReview = deck.cards.filter(c => c.sessionStatus !== 'FINISHED').length;
            return { mode: 'simple', total, finished, toReview };
        }
    }

    return {
        buildQueue,
        getCurrentCard,
        isComplete,
        getProgress,
        canRewind,
        rateCard,
        rewind,
        extendSession,
        getDeckStats
    };
})();
