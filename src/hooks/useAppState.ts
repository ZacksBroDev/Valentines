import { useState, useCallback, useEffect } from "react";
import { useToast } from "../context/ToastContext";
import { useDeckNew } from "./useDeckNew";
import { useFavorites } from "./useFavorites";
import { useRapidTap } from "./useRapidTap";
import { useSound } from "./useSound";
import { useProgress } from "./useProgress";
import { useTheme } from "./useTheme";
import { useHaptic } from "./useHaptic";
import { shareCard } from "../utils/helpers";
import {
  smallConfetti,
  secretUnlockConfetti,
  legendaryConfetti,
  sparkleConfetti,
} from "../utils/confetti";
import { MOODS, OPEN_WHEN_CATEGORIES } from "../config";
import { Mood, OpenWhenCategory, isTextCard } from "../types";

interface UseAppStateProps {
  heartTrailEnabled: boolean;
  setHeartTrailEnabled: (enabled: boolean) => void;
}

export const useAppState = ({
  heartTrailEnabled,
  setHeartTrailEnabled,
}: UseAppStateProps) => {
  const { showToast } = useToast();
  const { isMuted, toggleMute, playPop, playChime } = useSound();
  const {
    reasonsLogged,
    unlockedThemes,
    logReason,
    addLovePoints,
    checkMilestone,
  } = useProgress();
  const { currentTheme, setTheme } = useTheme(unlockedThemes);
  const { vibrate } = useHaptic();

  // Track which cards have had reasons logged (only allow once per card)
  const [loggedCardIds, setLoggedCardIds] = useState<Set<string>>(new Set());

  const {
    currentCard,
    drawCount,
    isLoading,
    isDeckExhausted,
    secretUnlocked,
    dailyMode,
    dailyCardDrawn,
    currentMood,
    drawCard,
    resetDeck,
    unlockSecretDeck,
    toggleDailyMode,
    setMood,
    shuffleDeck,
    drawFinalThree,
    filterByOpenWhen,
  } = useDeckNew();

  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const { handleTap: handleHeartBuddyTap } = useRapidTap(5, 3000);

  // Reduce motion setting (persisted in localStorage)
  const [reduceMotionEnabled, setReduceMotionEnabled] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("reduce-motion") === "true";
  });

  const toggleReduceMotion = useCallback(() => {
    setReduceMotionEnabled((prev) => {
      const next = !prev;
      localStorage.setItem("reduce-motion", String(next));
      return next;
    });
  }, []);

  // No repeat setting (persisted in localStorage)
  const [noRepeatEnabled, setNoRepeatEnabled] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("no-repeat") === "true";
  });

  const toggleNoRepeat = useCallback(() => {
    setNoRepeatEnabled((prev) => {
      const next = !prev;
      localStorage.setItem("no-repeat", String(next));
      return next;
    });
  }, []);

  // UI state
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isOpenWhenOpen, setIsOpenWhenOpen] = useState(false);
  const [showMoodPicker, setShowMoodPicker] = useState(false);
  const [isHeartBuddyBlushing, setIsHeartBuddyBlushing] = useState(false);
  const [showFloatingHeart, setShowFloatingHeart] = useState(false);
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [cardKey, setCardKey] = useState(0);
  const [showEndScreen, setShowEndScreen] = useState(false);
  const [selectedSticker] = useState<string | null>(null);

  // Check for deck exhaustion
  useEffect(() => {
    if (isDeckExhausted) {
      setShowEndScreen(true);
    }
  }, [isDeckExhausted]);

  // Check for milestone unlocks
  useEffect(() => {
    const newTheme = checkMilestone();
    if (newTheme) {
      showToast(`Unlocked ${newTheme} theme!`, "success");
      sparkleConfetti();
    }
  }, [reasonsLogged, checkMilestone, showToast]);

  // Handle HeartBuddy tap for secret unlock
  const onHeartBuddyTap = useCallback(() => {
    vibrate("short");
    if (secretUnlocked) {
      showToast("Secret deck already unlocked!", "info");
      return;
    }
    const shouldUnlock = handleHeartBuddyTap();
    if (shouldUnlock) {
      unlockSecretDeck();
      secretUnlockConfetti();
      playChime();
      showToast("Secret deck unlocked!", "success");
      vibrate("long");
    } else {
      playPop();
    }
  }, [
    secretUnlocked,
    handleHeartBuddyTap,
    unlockSecretDeck,
    playChime,
    playPop,
    showToast,
    vibrate,
  ]);

  // Handle HeartBuddy long press - only allow once per card
  const onHeartBuddyLongPress = useCallback(() => {
    if (!currentCard) {
      showToast("Draw a card first!", "info");
      return;
    }
    if (loggedCardIds.has(currentCard.id)) {
      showToast("Already logged on this card! Draw a new one.", "info");
      return;
    }
    vibrate("medium");
    logReason();
    addLovePoints(5);
    setLoggedCardIds((prev) => new Set(prev).add(currentCard.id));
    showToast("Love logged!", "success");
    sparkleConfetti();
  }, [
    currentCard,
    loggedCardIds,
    vibrate,
    logReason,
    addLovePoints,
    showToast,
  ]);

  // Handle draw
  const onDraw = useCallback(() => {
    if (dailyMode && dailyCardDrawn) {
      showToast("Daily card already drawn! Come back tomorrow.", "info");
      return;
    }
    setIsEnvelopeOpen(true);
    setTimeout(() => setIsEnvelopeOpen(false), 500);
    drawCard();
    setCardKey((prev) => prev + 1);
    playPop();
    vibrate("short");
  }, [drawCard, playPop, vibrate, dailyMode, dailyCardDrawn, showToast]);

  // Watch for legendary cards
  useEffect(() => {
    if (
      currentCard &&
      isTextCard(currentCard) &&
      currentCard.rarity === "legendary"
    ) {
      legendaryConfetti();
      showToast("LEGENDARY CARD!", "success");
    }
  }, [currentCard, showToast]);

  // Handle save
  const onSave = useCallback(() => {
    if (!currentCard) return;
    const wasAdded = toggleFavorite(currentCard.id);
    if (wasAdded) {
      setIsHeartBuddyBlushing(true);
      setShowFloatingHeart(true);
      setTimeout(() => {
        setIsHeartBuddyBlushing(false);
        setShowFloatingHeart(false);
      }, 800);
      smallConfetti();
      playPop();
      vibrate("short");
      showToast("Saved to favorites!", "success");
    } else {
      showToast("Removed from favorites", "info");
    }
  }, [currentCard, toggleFavorite, playPop, vibrate, showToast]);

  // Handle share
  const onShare = useCallback(async () => {
    if (!currentCard) return;
    const success = await shareCard(currentCard);
    showToast(
      success ? "Copied to clipboard!" : "Could not share",
      success ? "success" : "error"
    );
  }, [currentCard, showToast]);

  // Handle shuffle ritual
  const onShuffle = useCallback(() => {
    shuffleDeck();
    vibrate("medium");
    playPop();
    showToast("Deck shuffled with love!", "success");
    sparkleConfetti();
  }, [shuffleDeck, vibrate, playPop, showToast]);

  // Handle OpenWhen selection
  const onOpenWhenSelect = useCallback(
    (category: OpenWhenCategory) => {
      filterByOpenWhen(category);
      setIsOpenWhenOpen(false);
      setCardKey((prev) => prev + 1);
      showToast(
        `Filtered: ${OPEN_WHEN_CATEGORIES[category]?.label || category}`,
        "success"
      );
    },
    [filterByOpenWhen, showToast]
  );

  // Handle mood selection
  const onMoodSelect = useCallback(
    (mood: Mood) => {
      setMood(mood);
      setShowMoodPicker(false);
      showToast(`Mood: ${MOODS[mood]?.label || mood}`, "info");
    },
    [setMood, showToast]
  );

  // Handle restart
  const onRestart = useCallback(() => {
    setShowEndScreen(false);
    resetDeck();
    setCardKey((prev) => prev + 1);
  }, [resetDeck]);

  // Handle Final 3 from end screen
  const onDrawFinalThree = useCallback(
    (category: "comfort" | "hype" | "laugh") => {
      const cards = drawFinalThree(category);
      if (cards.length > 0) {
        showToast(`Drew your Final 3 ${category} cards!`, "🎴");
      }
      return cards;
    },
    [drawFinalThree, showToast]
  );

  // Handle remove favorite
  const onRemoveFavorite = useCallback(
    (id: string) => {
      toggleFavorite(id);
      showToast("Removed from favorites", "💔");
    },
    [toggleFavorite, showToast]
  );

  const isCurrentFavorite = currentCard ? isFavorite(currentCard.id) : false;

  return {
    // Sound
    isMuted,
    toggleMute,
    playChime,

    // Theme
    currentTheme,
    setTheme,
    unlockedThemes,

    // Progress
    reasonsLogged,

    // Deck state
    currentCard,
    drawCount,
    isLoading,
    secretUnlocked,
    dailyMode,
    dailyCardDrawn,
    currentMood,
    cardKey,
    selectedSticker,

    // Favorites
    favorites,
    isCurrentFavorite,

    // UI state
    isFavoritesOpen,
    setIsFavoritesOpen,
    isSettingsOpen,
    setIsSettingsOpen,
    isNotesOpen,
    setIsNotesOpen,
    isOpenWhenOpen,
    setIsOpenWhenOpen,
    showMoodPicker,
    setShowMoodPicker,
    showEndScreen,

    // Mascot state
    isHeartBuddyBlushing,
    showFloatingHeart,
    isEnvelopeOpen,

    // Settings props
    heartTrailEnabled,
    setHeartTrailEnabled,
    toggleDailyMode,
    reduceMotionEnabled,
    toggleReduceMotion,
    noRepeatEnabled,
    toggleNoRepeat,

    // Handlers
    onHeartBuddyTap,
    onHeartBuddyLongPress,
    onDraw,
    onSave,
    onShare,
    onShuffle,
    onOpenWhenSelect,
    onMoodSelect,
    onRestart,
    onDrawFinalThree,
    onRemoveFavorite,
  };
};

export type AppStateReturn = ReturnType<typeof useAppState>;
