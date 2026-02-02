import { useState, useCallback, useEffect, useMemo } from "react";
import {
  compliments,
  Compliment,
  getAvailableCompliments,
} from "../data/compliments";
import {
  getSeenIds,
  saveSeenIds,
  clearSeenIds,
  isSecretUnlocked as checkSecretUnlocked,
  unlockSecret as storeSecretUnlock,
  wasDeckExhausted,
  setDeckExhausted,
  resetDeckExhausted,
} from "../utils/storage";
import { shuffleArray, getComplimentById } from "../utils/helpers";

interface UseDeckReturn {
  currentCard: Compliment | null;
  drawCount: number;
  isLoading: boolean;
  isDeckExhausted: boolean;
  secretUnlocked: boolean;
  drawCard: () => void;
  resetDeck: () => void;
  unlockSecretDeck: () => void;
}

const DRAW_THRESHOLD = 30; // Show end screen after this many draws OR when deck exhausted

export const useDeck = (): UseDeckReturn => {
  const [secretUnlocked, setSecretUnlocked] = useState(checkSecretUnlocked);
  const [seenIds, setSeenIds] = useState<string[]>(() => getSeenIds());
  const [shuffledDeck, setShuffledDeck] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentCard, setCurrentCard] = useState<Compliment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeckExhausted, setIsDeckExhausted] = useState(false);
  const [drawCount, setDrawCount] = useState(0);
  const [hasShownEndScreen, setHasShownEndScreen] = useState(false);

  // Get available compliments based on secret unlock status
  const availableCompliments = useMemo(
    () => getAvailableCompliments(secretUnlocked),
    [secretUnlocked],
  );

  // Initialize or reshuffle deck
  const initializeDeck = useCallback(
    (preserveSeen = false) => {
      const ids = availableCompliments.map((c) => c.id);
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
    [availableCompliments],
  );

  // Initial load
  useEffect(() => {
    // Check if we've already shown the end screen before
    const wasExhausted = wasDeckExhausted();
    setHasShownEndScreen(wasExhausted);

    // Initialize deck
    initializeDeck(true);

    // Restore draw count from seen IDs
    const savedSeenIds = getSeenIds();
    if (savedSeenIds.length > 0) {
      setDrawCount(savedSeenIds.length);

      // Set the last seen card as current
      const lastSeenId = savedSeenIds[savedSeenIds.length - 1];
      const lastCard = getComplimentById(lastSeenId, compliments);
      if (lastCard) {
        setCurrentCard(lastCard);
      }
    }
  }, [initializeDeck]);

  // Re-initialize when secret is unlocked
  useEffect(() => {
    if (secretUnlocked) {
      // Re-shuffle to include secret cards
      initializeDeck(true);
    }
  }, [secretUnlocked, initializeDeck]);

  // Draw a new card
  const drawCard = useCallback(() => {
    // Find next unseen card
    let nextCard: Compliment | null = null;
    let searchIndex = currentIndex;
    let looped = false;

    while (!nextCard) {
      if (searchIndex >= shuffledDeck.length) {
        if (looped) {
          // All cards have been seen, reshuffle
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
        nextCard = getComplimentById(candidateId, compliments) || null;
        if (nextCard) {
          setCurrentIndex(searchIndex + 1);
          break;
        }
      }
      searchIndex++;

      // Safety: if we've checked all cards
      if (searchIndex > shuffledDeck.length * 2) {
        // Reshuffle completely
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

      // Check for deck exhaustion
      const totalAvailable = availableCompliments.length;
      const newDrawCount = drawCount + 1;

      if (
        newSeenIds.length >= totalAvailable ||
        newDrawCount >= DRAW_THRESHOLD
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
    seenIds,
    drawCount,
    availableCompliments,
    hasShownEndScreen,
    initializeDeck,
  ]);

  // Reset deck completely
  const resetDeck = useCallback(() => {
    setIsDeckExhausted(false);
    setHasShownEndScreen(true);
    initializeDeck(false);
    setCurrentCard(null);
  }, [initializeDeck]);

  // Unlock secret deck
  const unlockSecretDeck = useCallback(() => {
    if (!secretUnlocked) {
      storeSecretUnlock();
      setSecretUnlocked(true);
    }
  }, [secretUnlocked]);

  return {
    currentCard,
    drawCount,
    isLoading,
    isDeckExhausted,
    secretUnlocked,
    drawCard,
    resetDeck,
    unlockSecretDeck,
  };
};
