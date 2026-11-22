/**
 * session.js - Session logic and SM-2 spaced repetition algorithm
 * Handles queue building, card rating, rewind, and deck statistics.
 */

const Session = (() => {
    let queue = [];          // Cards selected for this session (references into deck.cards)
    let currentIndex = 0;    // Position in queue
    let rewindBackup = null; // Saved state for undo

    const RATINGS = ['again', 'hard', 'good', 'easy'];
    const AGAIN_GAP = 3;     // "Again" cards come back after this many other cards

    // ========================
    // Date helpers (local time, so the day changes at the user's midnight)
    // ========================

    function localDateStr(d) {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
    }

    function getTodayStr() {
        return localDateStr(new Date());
    }

    function addDays(dateStr, days) {
        const d = new Date(dateStr + 'T12:00:00');
        d.setDate(d.getDate() + days);
        return localDateStr(d);
    }

    function daysBetween(fromStr, toStr) {
        const a = new Date(fromStr + 'T12:00:00');
        const b = new Date(toStr + 'T12:00:00');
        return Math.round((b - a) / 86400000);
    }

    // ========================
    // Day reset
    // ========================

    /**
     * If the deck was last used on a previous day, reset daily counters.
     * If accumulateDailyLimit is enabled, every card of the goal that was not
     * studied carries over - including whole days the app was not opened.
     *
     * accumulatedExtra = cards carried into the current day (stays fixed during the day).
     */
    function checkDayReset(deck) {
        const today = getTodayStr();
        if (deck.lastSessionDate === today) return;

        const limit = deck.dailyLimit || 5;

        if (deck.accumulateDailyLimit && deck.lastSessionDate) {
            // Unfinished part of the last day the deck was used
            const owedLastDay = limit + (deck.accumulatedExtra || 0);
            const done = deck.cardsReviewedToday || 0;
            let missed = Math.max(0, owedLastDay - done);

            // Whole days in between where the deck was never opened
            const gap = daysBetween(deck.lastSessionDate, today) - 1;
            if (gap > 0) missed += gap * limit;

            deck.accumulatedExtra = missed;
        } else if (!deck.accumulateDailyLimit) {
            deck.accumulatedExtra = 0;
        }

        deck.lastSessionDate = today;
        deck.cardsReviewedToday = 0;
        deck.sessionExtension = 0;
    }

    // ========================
    // Queue building
    // ========================

    /**
     * Build the session queue: new cards and cards due today or overdue,
     * shuffled, up to the remaining daily limit.
     */
    function buildQueue(deck) {
        checkDayReset(deck);

        const today = getTodayStr();
        const effectiveLimit = (deck.dailyLimit || 5) + (deck.sessionExtension || 0) + (deck.accumulatedExtra || 0);
        const alreadyDone = deck.cardsReviewedToday || 0;
        const remaining = Math.max(0, effectiveLimit - alreadyDone);

        const candidates = deck.cards.filter(c => !c.dueDate || c.dueDate <= today);

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
    // Scheduling (SM-2 variant)
    // ========================

    /**
     * Work out what a rating would do to a card, without changing it.
     * Returns { interval, ease } where interval is in days (0 = again this session).
     * Each better rating is always at least one day longer than the one before.
     */
    function computeNext(card, rating) {
        const interval = card.interval || 1;
        const ease = card.easeFactor || 2.5;

        const hardI = Math.max(1, Math.round(interval * 1.2));
        const goodI = Math.max(hardI + 1, Math.round(interval * ease));
        const easyI = Math.max(goodI + 1, Math.round(interval * ease * 1.3));

        switch (rating) {
            case 'again': return { interval: 0, ease: Math.max(1.3, ease - 0.2) };
            case 'hard':  return { interval: hardI, ease: Math.max(1.3, ease - 0.15) };
            case 'good':  return { interval: goodI, ease };
            case 'easy':  return { interval: easyI, ease: ease + 0.15 };
        }
        return { interval, ease };
    }

    /**
     * Short human-readable label for what each button will do, e.g. "3d", "2mo".
     */
    function previewLabel(card, rating) {
        const { interval } = computeNext(card, rating);
        if (interval <= 0) return 'Soon';
        if (interval < 30) return `${interval}d`;
        if (interval < 365) return `${Math.round(interval / 30)}mo`;
        return `${(interval / 365).toFixed(1).replace(/\.0$/, '')}y`;
    }

    function applySpacedRating(card, rating, today) {
        const next = computeNext(card, rating);
        card.interval = Math.max(1, next.interval);
        card.easeFactor = Math.round(next.ease * 1000) / 1000;
        card.dueDate = next.interval <= 0 ? today : addDays(today, next.interval);
        card.sessionStatus = 'SPACED';
    }

    // ========================
    // Card rating
    // ========================

    /**
     * Rate the current card: 'again' | 'hard' | 'good' | 'easy'
     * "Again" puts the card back into this session a few cards later and does
     * not count toward the daily goal until it is finally passed.
     */
    function rateCard(deck, rating) {
        if (currentIndex >= queue.length) return;
        if (!RATINGS.includes(rating)) return;

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
            cardsReviewedToday: deck.cardsReviewedToday || 0,
            reinsertedAt: null
        };

        applySpacedRating(deckCard, rating, getTodayStr());

        if (rating === 'again') {
            const pos = Math.min(queue.length, currentIndex + 1 + AGAIN_GAP);
            queue.splice(pos, 0, deckCard);
            rewindBackup.reinsertedAt = pos;
        } else {
            deck.cardsReviewedToday = (deck.cardsReviewedToday || 0) + 1;
        }
        currentIndex++;
    }

    // ========================
    // Rewind
    // ========================

    /**
     * Undo the last card rating. Returns true on success.
     */
    function rewind(deck) {
        if (!rewindBackup) return false;

        const { index, cardSnapshot, deckCardRef, cardsReviewedToday, reinsertedAt } = rewindBackup;

        // Restore card state
        Object.assign(deckCardRef, cardSnapshot);

        // Remove the extra copy an "Again" rating added to the queue
        if (reinsertedAt !== null && queue[reinsertedAt] === deckCardRef) {
            queue.splice(reinsertedAt, 1);
        }

        queue[index] = deckCardRef;
        currentIndex = index;

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

    /**
     * Synchronize the current session queue after edits in the card editor,
     * preserving the current card position without restarting or reshuffling.
     */
    function syncDeck(deck) {
        if (!deck || !Array.isArray(deck.cards)) return;
        if (queue.length === 0) {
            buildQueue(deck);
            return;
        }

        // Update cards in queue to match deck.cards
        for (let i = 0; i < queue.length; i++) {
            const match = deck.cards.find(c => c === queue[i] ||
                (c.word === queue[i].word && c.translation === queue[i].translation));
            if (match) {
                queue[i] = match;
            }
        }

        // Remove deleted cards, shifting the position back for each one removed before it
        const removedBefore = queue.slice(0, currentIndex).filter(q => !deck.cards.includes(q)).length;
        const before = queue.length;
        queue = queue.filter(qCard => deck.cards.includes(qCard));
        currentIndex = Math.max(0, currentIndex - removedBefore);

        // Undo would point at stale queue positions once cards were removed
        if (queue.length !== before) rewindBackup = null;
    }

    // ========================
    // Stats
    // ========================

    /**
     * Get deck statistics for display.
     */
    function getDeckStats(deck) {
        const today = getTodayStr();
        const total = deck.cards.length;
        const due = deck.cards.filter(c => !c.dueDate || c.dueDate <= today).length;
        return { total, due, upcoming: total - due };
    }

    return {
        getTodayStr,
        buildQueue,
        syncDeck,
        getCurrentCard,
        isComplete,
        getProgress,
        canRewind,
        rateCard,
        rewind,
        extendSession,
        previewLabel,
        getDeckStats
    };
})();
