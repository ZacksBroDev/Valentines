import { useState, useCallback, useEffect, useMemo } from "react";
import { Card, CardCategory } from "../types";
import {
  MoodKey,
  OpenWhenKey,
  OPEN_WHEN_CATEGORIES,
  CONFIG,
  FINAL_THREE_CATEGORIES,
} from "../config";
import { allCards, getAvailableCards, getCardById } from "../data/cards";
import {
  getSeenIds,
  saveSeenIds,
  clearSeenIds,
  isSecretUnlocked as checkSecretUnlocked,
  unlockSecret as storeSecretUnlock,
  getSecretProgressDraws,
  incrementSecretProgress,
  resetSecretProgress,
  wasDeckExhausted,
  setDeckExhausted,
  resetDeckExhausted,
  isDailyModeEnabled,
  setDailyModeEnabled as saveDailyMode,
  canDrawToday,
  getDrawsRemaining,
  getDailyDrawsToday,
  incrementDailyDraws,
  getTimeUntilNextDraw,
  getCurrentMood,
  setCurrentMood as saveCurrentMood,
  getOpenWhenMode,
  setOpenWhenMode as saveOpenWhenMode,
} from "../utils/storage";
import { shuffleArray } from "../utils/helpers";

export const useDeckNew = () => {
  const [secretUnlocked, setSecretUnlocked] = useState(checkSecretUnlocked);
  const [secretProgressDraws, setSecretProgressDraws] = useState(getSecretProgressDraws);
  const [seenIds, setSeenIds] = useState<string[]>(getSeenIds);
  const [shuffledDeck, setShuffledDeck] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeckExhausted, setIsDeckExhausted] = useState(false);
  const [drawCount, setDrawCount] = useState(0);
  const [hasShownEndScreen, setHasShownEndScreen] = useState(false);

  // Filters
  const [currentMood, setCurrentMoodState] = useState<MoodKey>(getCurrentMood);
  const [openWhenMode, setOpenWhenModeState] = useState<OpenWhenKey | null>(
    getOpenWhenMode,
  );
  const [dailyModeEnabled, setDailyModeState] = useState(isDailyModeEnabled);
  const [dailyDrawsToday, setDailyDrawsToday] = useState(getDailyDrawsToday);
  const [drawsRemaining, setDrawsRemaining] = useState(getDrawsRemaining(CONFIG.dailyDrawLimit));
  const [timeUntilNextDraw, setTimeUntilNextDraw] = useState(getTimeUntilNextDraw);
  
  // Legacy compatibility
  const dailyCardDrawn = dailyModeEnabled && drawsRemaining <= 0;

  // Get filtered cards based on mood and open when mode
  const availableCards = useMemo(() => {
    let cards = getAvailableCards(secretUnlocked);

    // Apply Open When filter
    if (openWhenMode && OPEN_WHEN_CATEGORIES[openWhenMode]) {
      const allowedCategories = OPEN_WHEN_CATEGORIES[openWhenMode]
        .categories as readonly string[];
      cards = cards.filter((c) => {
        const hasTag = c.tags?.includes(openWhenMode);
        const hasCategory = allowedCategories.includes(c.category);
        return hasTag || hasCategory;
      });
    }
    // Apply Mood filter
    else if (currentMood !== "all") {
      const moodToCategoryMap: Record<string, CardCategory[]> = {
        soft: ["sweet", "supportive"],
        funny: ["funny"],
        hype: ["supportive", "spicy-lite"],
        flirty: ["spicy-lite", "sweet"],
      };
      const allowedCategories = moodToCategoryMap[currentMood] || [];
      if (allowedCategories.length > 0) {
        cards = cards.filter((c) => allowedCategories.includes(c.category));
      }
    }

    return cards;
  }, [secretUnlocked, currentMood, openWhenMode]);

  // Initialize or reshuffle deck
  const initializeDeck = useCallback(
    (preserveSeen = false) => {
      const ids = availableCards.map((c) => c.id);
      const shuffled = shuffleArray(ids);
      setShuffledDeck(shuffled);
      setCurrentIndex(0);

      if (!preserveSeen) {
        setSeenIds([]);
        clearSeenIds();
        setDrawCount(0);
        setHasShownEndScreen(false);
        resetDeckExhausted();
      }

      setIsLoading(false);
    },
    [availableCards],
  );

  // Initial load
  useEffect(() => {
    const wasExhausted = wasDeckExhausted();
    setHasShownEndScreen(wasExhausted);

    initializeDeck(true);

    const savedSeenIds = getSeenIds();
    if (savedSeenIds.length > 0) {
      setDrawCount(savedSeenIds.length);
      const lastSeenId = savedSeenIds[savedSeenIds.length - 1];
      const lastCard = getCardById(lastSeenId);
      if (lastCard) setCurrentCard(lastCard);
    }
  }, [initializeDeck]);

  // Re-initialize when filters change
  useEffect(() => {
    if (!isLoading) {
      initializeDeck(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMood, openWhenMode, secretUnlocked]);

  // Check daily mode on mount and date changes
  useEffect(() => {
    // Update draws remaining and time until next draw
    const updateDailyState = () => {
      setDailyDrawsToday(getDailyDrawsToday());
      setDrawsRemaining(getDrawsRemaining(CONFIG.dailyDrawLimit));
      setTimeUntilNextDraw(getTimeUntilNextDraw());
    };
    
    updateDailyState();
    
    // Update every minute for countdown
    const interval = setInterval(updateDailyState, 60000);
    return () => clearInterval(interval);
  }, [dailyModeEnabled]);

  // Draw a new card
  const drawCard = useCallback(() => {
    // Check daily mode (3 draws per day limit)
    if (dailyModeEnabled && !canDrawToday(CONFIG.dailyDrawLimit)) {
      // Update state to reflect exhausted draws
      setDrawsRemaining(0);
      setTimeUntilNextDraw(getTimeUntilNextDraw());
      return null;
    }

    // Find next unseen card
    let nextCard: Card | null = null;
    let searchIndex = currentIndex;
    let looped = false;

    while (!nextCard) {
      if (searchIndex >= shuffledDeck.length) {
        if (looped) {
          const newDeck = shuffleArray(shuffledDeck);
          setShuffledDeck(newDeck);
          searchIndex = 0;
          setSeenIds([]);
          clearSeenIds();
          looped = false;
        } else {
          looped = true;
          searchIndex = 0;
        }
      }

      const candidateId = shuffledDeck[searchIndex];
      if (!seenIds.includes(candidateId)) {
        nextCard = getCardById(candidateId) || null;
        if (nextCard) {
          setCurrentIndex(searchIndex + 1);
          break;
        }
      }
      searchIndex++;

      if (searchIndex > shuffledDeck.length * 2) {
        initializeDeck();
        return;
      }
    }

    if (nextCard) {
      setCurrentCard(nextCard);
      const newSeenIds = [...seenIds, nextCard.id];
      setSeenIds(newSeenIds);
      saveSeenIds(newSeenIds);
      setDrawCount((prev) => prev + 1);

      // Update daily mode - increment draw count
      if (dailyModeEnabled) {
        const newDrawsToday = incrementDailyDraws();
        setDailyDrawsToday(newDrawsToday);
        setDrawsRemaining(Math.max(0, CONFIG.dailyDrawLimit - newDrawsToday));
      }

      // Update secret progress (if not already unlocked)
      if (!secretUnlocked) {
        const newProgress = incrementSecretProgress();
        setSecretProgressDraws(newProgress);
        
        // Auto-unlock when progress threshold is reached
        if (newProgress >= CONFIG.secretUnlockDraws) {
          storeSecretUnlock();
          setSecretUnlocked(true);
          resetSecretProgress();
          setSecretProgressDraws(0);
        }
      }

      // Check for deck exhaustion
      const totalAvailable = availableCards.length;
      const newDrawCount = drawCount + 1;

      if (
        newSeenIds.length >= totalAvailable ||
        newDrawCount >= CONFIG.drawThreshold
      ) {
        if (!hasShownEndScreen) {
          setIsDeckExhausted(true);
          setDeckExhausted();
        }
      }
    }
  }, [
    shuffledDeck,
    currentIndex,
    secretUnlocked,
    seenIds,
    drawCount,
    availableCards,
    hasShownEndScreen,
    dailyModeEnabled,
    initializeDeck,
  ]);

  // Reset deck
  const resetDeck = useCallback(() => {
    setIsDeckExhausted(false);
    setHasShownEndScreen(true);
    initializeDeck(false);
    setCurrentCard(null);
  }, [initializeDeck]);

  // Shuffle deck (without resetting progress)
  const shuffleDeck = useCallback(() => {
    const ids = availableCards.map((c) => c.id);
    const shuffled = shuffleArray(ids);
    setShuffledDeck(shuffled);
    setCurrentIndex(0);
  }, [availableCards]);

  // Unlock secret deck
  const unlockSecretDeck = useCallback(() => {
    if (!secretUnlocked) {
      storeSecretUnlock();
      setSecretUnlocked(true);
    }
  }, [secretUnlocked]);

  // Set mood
  const setMood = useCallback((mood: MoodKey) => {
    setCurrentMoodState(mood);
    saveCurrentMood(mood);
    setOpenWhenModeState(null);
    saveOpenWhenMode(null);
  }, []);

  // Set open when mode (filter by open when)
  const filterByOpenWhen = useCallback((mode: OpenWhenKey | null) => {
    setOpenWhenModeState(mode);
    saveOpenWhenMode(mode);
    setCurrentMoodState("all");
    saveCurrentMood("all");
  }, []);

  // Toggle daily mode
  const toggleDailyMode = useCallback(() => {
    const newValue = !dailyModeEnabled;
    setDailyModeState(newValue);
    saveDailyMode(newValue);
    if (newValue) {
      // Reset daily draws state when enabling
      setDailyDrawsToday(getDailyDrawsToday());
      setDrawsRemaining(getDrawsRemaining(CONFIG.dailyDrawLimit));
    }
  }, [dailyModeEnabled]);

  // Draw final 3 cards
  const drawFinalThree = useCallback(
    (category: keyof typeof FINAL_THREE_CATEGORIES): Card[] => {
      const config = FINAL_THREE_CATEGORIES[category];
      const allowedCats = config.categories as readonly string[];
      const pool = allCards.filter(
        (c) => allowedCats.includes(c.category) && c.category !== "secret",
      );
      const shuffled = shuffleArray(pool);
      return shuffled.slice(0, 3);
    },
    [],
  );

  // Alias for daily mode
  const dailyMode = dailyModeEnabled;
  const dailyLimit = CONFIG.dailyDrawLimit;
  const secretUnlockThreshold = CONFIG.secretUnlockDraws;

  return {
    currentCard,
    drawCount,
    isLoading,
    isDeckExhausted,
    secretUnlocked,
    secretProgressDraws,
    secretUnlockThreshold,
    dailyMode,
    dailyCardDrawn,
    dailyDrawsToday,
    drawsRemaining,
    timeUntilNextDraw,
    dailyLimit,
    currentMood,
    openWhenMode,
    seenIds,
    drawCard,
    resetDeck,
    shuffleDeck,
    unlockSecretDeck,
    setMood,
    filterByOpenWhen,
    toggleDailyMode,
    drawFinalThree,
  };
};
