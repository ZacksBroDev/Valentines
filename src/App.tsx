import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "./components/Header";
import { Mascots } from "./components/mascots/Mascots";
import { ComplimentCard } from "./components/CardRenderer";
import { ActionBar } from "./components/ActionBar";
import { FavoritesModal } from "./components/FavoritesModal";
import { EndScreen } from "./components/EndScreen";
import { SettingsModal } from "./components/SettingsModal";
import { NotesModal } from "./components/NotesModal";
import { OpenWhenModal } from "./components/OpenWhenModal";
import { MoodPicker } from "./components/MoodPicker";
import { HeartTrail } from "./components/HeartTrail";
import { ToastProvider, useToast } from "./context/ToastContext";
import { useDeckNew } from "./hooks/useDeckNew";
import { useFavorites } from "./hooks/useFavorites";
import { useRapidTap } from "./hooks/useRapidTap";
import { useSound } from "./hooks/useSound";
import { useProgress } from "./hooks/useProgress";
import { useTheme } from "./hooks/useTheme";
import { useHaptic } from "./hooks/useHaptic";
import { shareCard } from "./utils/helpers";
import { smallConfetti, secretUnlockConfetti, legendaryConfetti, sparkleConfetti } from "./utils/confetti";
import { MOODS, OPEN_WHEN_CATEGORIES } from "./config";
import { Mood, OpenWhenCategory, isTextCard } from "./types";

interface AppContentProps {
  heartTrailEnabled: boolean;
  setHeartTrailEnabled: (enabled: boolean) => void;
}

const AppContent = ({ heartTrailEnabled, setHeartTrailEnabled }: AppContentProps) => {
  const { showToast } = useToast();
  const { isMuted, toggleMute, playPop, playChime } = useSound();
  const { reasonsLogged, unlockedThemes, logReason, addLovePoints, checkMilestone } = useProgress();
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
      showToast(`🎉 Unlocked ${newTheme} theme!`, "🎉");
      sparkleConfetti();
    }
  }, [reasonsLogged, checkMilestone, showToast]);

  // Handle HeartBuddy tap for secret unlock
  const onHeartBuddyTap = useCallback(() => {
    vibrate("short");
    if (secretUnlocked) {
      showToast("Secret deck already unlocked!", "🔓");
      return;
    }
    const shouldUnlock = handleHeartBuddyTap();
    if (shouldUnlock) {
      unlockSecretDeck();
      secretUnlockConfetti();
      playChime();
      showToast("Secret deck unlocked!", "💘");
      vibrate("long");
    } else {
      playPop();
    }
  }, [secretUnlocked, handleHeartBuddyTap, unlockSecretDeck, playChime, playPop, showToast, vibrate]);

  // Handle HeartBuddy long press - only allow once per card
  const onHeartBuddyLongPress = useCallback(() => {
    if (!currentCard) {
      showToast("Draw a card first!", "💭");
      return;
    }
    if (loggedCardIds.has(currentCard.id)) {
      showToast("Already logged on this card! Draw a new one 💕", "✨");
      return;
    }
    vibrate("medium");
    logReason();
    addLovePoints(5);
    setLoggedCardIds(prev => new Set(prev).add(currentCard.id));
    showToast("Love logged! 💕", "📝");
    sparkleConfetti();
  }, [currentCard, loggedCardIds, vibrate, logReason, addLovePoints, showToast]);

  // Handle draw
  const onDraw = useCallback(() => {
    if (dailyMode && dailyCardDrawn) {
      showToast("Daily card already drawn! Come back tomorrow 💕", "🌙");
      return;
    }
    setIsEnvelopeOpen(true);
    setTimeout(() => setIsEnvelopeOpen(false), 500);
    drawCard();
    setCardKey((prev) => prev + 1);
    playPop();
    vibrate("short");
    
    // Check for legendary card after draw - we'll check currentCard in next render
  }, [drawCard, playPop, vibrate, dailyMode, dailyCardDrawn, showToast]);
  
  // Watch for legendary cards
  useEffect(() => {
    if (currentCard && isTextCard(currentCard) && currentCard.rarity === "legendary") {
      legendaryConfetti();
      showToast("✨ LEGENDARY CARD! ✨", "💎");
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
      showToast("Saved to favorites!", "💖");
    } else {
      showToast("Removed from favorites", "💔");
    }
  }, [currentCard, toggleFavorite, playPop, vibrate, showToast]);

  // Handle share
  const onShare = useCallback(async () => {
    if (!currentCard) return;
    const success = await shareCard(currentCard);
    showToast(success ? "Copied to clipboard!" : "Could not share", success ? "📋" : "😕");
  }, [currentCard, showToast]);

  // Handle shuffle ritual
  const onShuffle = useCallback(() => {
    shuffleDeck();
    vibrate("medium");
    playPop();
    showToast("Deck shuffled with love! 💝", "🔀");
    sparkleConfetti();
  }, [shuffleDeck, vibrate, playPop, showToast]);

  // Handle OpenWhen selection
  const onOpenWhenSelect = useCallback((category: OpenWhenCategory) => {
    filterByOpenWhen(category);
    setIsOpenWhenOpen(false);
    setCardKey((prev) => prev + 1);
    showToast(`Filtered: ${OPEN_WHEN_CATEGORIES[category]?.label || category}`, "📬");
  }, [filterByOpenWhen, showToast]);

  // Handle mood selection
  const onMoodSelect = useCallback((mood: Mood) => {
    setMood(mood);
    setShowMoodPicker(false);
    showToast(`Mood: ${MOODS[mood]?.label || mood}`, "💭");
  }, [setMood, showToast]);

  // Handle restart
  const onRestart = useCallback(() => {
    setShowEndScreen(false);
    resetDeck();
    setCardKey((prev) => prev + 1);
  }, [resetDeck]);

  // Handle Final 3 from end screen
  const onDrawFinalThree = useCallback((category: "comfort" | "hype" | "laugh") => {
    const cards = drawFinalThree(category);
    if (cards.length > 0) {
      showToast(`Drew your Final 3 ${category} cards!`, "🎴");
    }
    return cards;
  }, [drawFinalThree, showToast]);

  // Handle remove favorite
  const onRemoveFavorite = useCallback((id: string) => {
    toggleFavorite(id);
    showToast("Removed from favorites", "💔");
  }, [toggleFavorite, showToast]);

  if (isLoading) {
    return (
      <div className={`min-h-screen theme-bg hearts-bg hearts-pattern flex items-center justify-center theme-${currentTheme}`}>
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-5xl">💕</motion.div>
      </div>
    );
  }

  const isCurrentFavorite = currentCard ? isFavorite(currentCard.id) : false;

  return (
    <div className={`min-h-screen theme-bg hearts-bg hearts-pattern flex flex-col relative overflow-hidden theme-${currentTheme}`}>
      <div className="hearts-pattern" />

      <Header
        isMuted={isMuted}
        onToggleMute={toggleMute}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenNotes={() => setIsNotesOpen(true)}
        favoritesCount={favorites.length}
      />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-4 relative z-10">
        <Mascots
          onHeartBuddyTap={onHeartBuddyTap}
          onHeartBuddyLongPress={onHeartBuddyLongPress}
          isHeartBuddyBlushing={isHeartBuddyBlushing}
          showFloatingHeart={showFloatingHeart}
          isEnvelopeOpen={isEnvelopeOpen}
          secretUnlocked={secretUnlocked}
        />

        {/* Mood Picker Toggle */}
        <button
          onClick={() => setShowMoodPicker(true)}
          className="mb-2 text-sm text-blush-500 flex items-center gap-1 hover:text-blush-700 transition-colors"
        >
          {currentMood ? MOODS[currentMood]?.emoji : "💭"} 
          {currentMood ? MOODS[currentMood]?.label : "Set mood"}
        </button>

        <AnimatePresence>
          {drawCount > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm text-blush-500 mb-4"
            >
              Card {drawCount} {secretUnlocked && "(+ secrets)"} {dailyMode && "• Daily Mode"}
            </motion.p>
          )}
        </AnimatePresence>

        <div className="w-full max-w-sm mx-auto mb-6">
          <ComplimentCard
            card={currentCard}
            isFavorite={isCurrentFavorite}
            cardKey={cardKey}
            sticker={selectedSticker as any}
            onStickerClick={() => {}}
          />
        </div>
      </main>

      <div className="sticky bottom-0 pb-4 pt-2 bg-gradient-to-t from-blush-100/80 to-transparent backdrop-blur-sm">
        <ActionBar
          onDraw={onDraw}
          onSave={onSave}
          onShare={onShare}
          onShuffle={onShuffle}
          onOpenWhen={() => setIsOpenWhenOpen(true)}
          isFavorite={isCurrentFavorite}
          hasCard={!!currentCard}
          canDraw={!dailyMode || !dailyCardDrawn}
          isDailyBlocked={dailyMode && dailyCardDrawn}
        />
      </div>

      <FavoritesModal
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favoriteIds={favorites}
        onRemove={onRemoveFavorite}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentTheme={currentTheme}
        onThemeChange={setTheme}
        unlockedThemes={unlockedThemes}
        dailyModeEnabled={dailyMode}
        onDailyModeToggle={toggleDailyMode}
        heartTrailEnabled={heartTrailEnabled}
        onHeartTrailToggle={() => setHeartTrailEnabled(!heartTrailEnabled)}
        reasonsLogged={reasonsLogged}
      />

      <NotesModal
        isOpen={isNotesOpen}
        onClose={() => setIsNotesOpen(false)}
      />

      <OpenWhenModal
        isOpen={isOpenWhenOpen}
        onClose={() => setIsOpenWhenOpen(false)}
        currentMode={null}
        onSelectMode={(mode) => mode && onOpenWhenSelect(mode)}
      />

      {showMoodPicker && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex items-end justify-center"
          onClick={() => setShowMoodPicker(false)}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            className="bg-white rounded-t-3xl p-6 pb-10 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-center mb-4">How are you feeling?</h3>
            <MoodPicker
              currentMood={currentMood}
              onSelectMood={(mood) => { onMoodSelect(mood); setShowMoodPicker(false); }}
            />
          </motion.div>
        </motion.div>
      )}

      <EndScreen
        isOpen={showEndScreen}
        onRestart={onRestart}
        onViewFavorites={() => { setShowEndScreen(false); setIsFavoritesOpen(true); }}
        onFinalThree={onDrawFinalThree}
        playChime={playChime}
      />
    </div>
  );
};

function App() {
  return (
    <ToastProvider>
      <AppWithTrail />
    </ToastProvider>
  );
}

// Wrapper to handle heart trail at top level
const AppWithTrail = () => {
  const [heartTrailEnabled, setHeartTrailEnabled] = useState(false);
  
  return (
    <>
      <HeartTrail enabled={heartTrailEnabled} />
      <AppContent 
        heartTrailEnabled={heartTrailEnabled} 
        setHeartTrailEnabled={setHeartTrailEnabled} 
      />
    </>
  );
};

export default App;
