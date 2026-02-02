import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "./components/Header";
import { Mascots } from "./components/mascots/Mascots";
import { ComplimentCard } from "./components/ComplimentCard";
import { ActionBar } from "./components/ActionBar";
import { FavoritesModal } from "./components/FavoritesModal";
import { EndScreen } from "./components/EndScreen";
import { ToastProvider, useToast } from "./context/ToastContext";
import { useDeck } from "./hooks/useDeck";
import { useFavorites } from "./hooks/useFavorites";
import { useRapidTap } from "./hooks/useRapidTap";
import { useSound } from "./hooks/useSound";
import { shareCompliment } from "./utils/helpers";
import { smallConfetti, secretUnlockConfetti } from "./utils/confetti";

const AppContent = () => {
  const { showToast } = useToast();
  const { isMuted, toggleMute, playPop, playChime } = useSound();
  const {
    currentCard,
    drawCount,
    isLoading,
    isDeckExhausted,
    secretUnlocked,
    drawCard,
    resetDeck,
    unlockSecretDeck,
  } = useDeck();

  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const { handleTap: handleHeartBuddyTap } = useRapidTap(5, 3000);

  // UI state
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isHeartBuddyBlushing, setIsHeartBuddyBlushing] = useState(false);
  const [showFloatingHeart, setShowFloatingHeart] = useState(false);
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [cardKey, setCardKey] = useState(0);
  const [showEndScreen, setShowEndScreen] = useState(false);

  // Check for deck exhaustion
  useEffect(() => {
    if (isDeckExhausted) {
      setShowEndScreen(true);
    }
  }, [isDeckExhausted]);

  // Handle HeartBuddy tap for secret unlock
  const onHeartBuddyTap = useCallback(() => {
    if (secretUnlocked) {
      // Already unlocked, just show a playful message
      showToast("Secret deck already unlocked!", "🔓");
      return;
    }

    const shouldUnlock = handleHeartBuddyTap();
    if (shouldUnlock) {
      unlockSecretDeck();
      secretUnlockConfetti();
      playChime();
      showToast("Secret deck unlocked!", "💘");
    } else {
      // Small feedback on tap
      playPop();
    }
  }, [
    secretUnlocked,
    handleHeartBuddyTap,
    unlockSecretDeck,
    playChime,
    playPop,
    showToast,
  ]);

  // Handle draw
  const onDraw = useCallback(() => {
    // Animate envelope opening
    setIsEnvelopeOpen(true);
    setTimeout(() => setIsEnvelopeOpen(false), 500);

    // Draw new card
    drawCard();
    setCardKey((prev) => prev + 1);
    playPop();
  }, [drawCard, playPop]);

  // Handle save
  const onSave = useCallback(() => {
    if (!currentCard) return;

    const wasAdded = toggleFavorite(currentCard.id);

    if (wasAdded) {
      // Show blush animation
      setIsHeartBuddyBlushing(true);
      setShowFloatingHeart(true);
      setTimeout(() => {
        setIsHeartBuddyBlushing(false);
        setShowFloatingHeart(false);
      }, 800);

      // Confetti and sound
      smallConfetti();
      playPop();
      showToast("Saved to favorites!", "💖");
    } else {
      showToast("Removed from favorites", "💔");
    }
  }, [currentCard, toggleFavorite, playPop, showToast]);

  // Handle share
  const onShare = useCallback(async () => {
    if (!currentCard) return;

    const text = `${currentCard.emoji || "💕"} ${currentCard.text}`;
    const success = await shareCompliment(text);

    if (success) {
      showToast("Copied to clipboard!", "📋");
    } else {
      showToast("Could not share", "😕");
    }
  }, [currentCard, showToast]);

  // Handle restart from end screen
  const onRestart = useCallback(() => {
    setShowEndScreen(false);
    resetDeck();
    setCardKey((prev) => prev + 1);
  }, [resetDeck]);

  // Handle view favorites from end screen
  const onViewFavoritesFromEnd = useCallback(() => {
    setShowEndScreen(false);
    setIsFavoritesOpen(true);
  }, []);

  // Handle remove favorite
  const onRemoveFavorite = useCallback(
    (id: string) => {
      toggleFavorite(id);
      showToast("Removed from favorites", "💔");
    },
    [toggleFavorite, showToast],
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-blush hearts-bg hearts-pattern flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-5xl"
        >
          💕
        </motion.div>
      </div>
    );
  }

  const isCurrentFavorite = currentCard ? isFavorite(currentCard.id) : false;

  return (
    <div className="min-h-screen bg-gradient-blush hearts-bg hearts-pattern flex flex-col relative overflow-hidden">
      {/* Background pattern overlay */}
      <div className="hearts-pattern" />

      {/* Header */}
      <Header
        isMuted={isMuted}
        onToggleMute={toggleMute}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        favoritesCount={favorites.length}
      />

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-4 relative z-10">
        {/* Mascots */}
        <Mascots
          onHeartBuddyTap={onHeartBuddyTap}
          isHeartBuddyBlushing={isHeartBuddyBlushing}
          showFloatingHeart={showFloatingHeart}
          isEnvelopeOpen={isEnvelopeOpen}
          secretUnlocked={secretUnlocked}
        />

        {/* Draw count */}
        <AnimatePresence>
          {drawCount > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm text-blush-500 mb-4"
            >
              Card {drawCount} {secretUnlocked && "(+ secrets)"}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Compliment Card */}
        <div className="w-full max-w-sm mx-auto mb-6">
          <ComplimentCard
            compliment={currentCard}
            isFavorite={isCurrentFavorite}
            cardKey={cardKey}
          />
        </div>
      </main>

      {/* Action Bar */}
      <div className="sticky bottom-0 pb-4 pt-2 bg-gradient-to-t from-blush-100/80 to-transparent backdrop-blur-sm">
        <ActionBar
          onDraw={onDraw}
          onSave={onSave}
          onShare={onShare}
          isFavorite={isCurrentFavorite}
          hasCard={!!currentCard}
        />
      </div>

      {/* Favorites Modal */}
      <FavoritesModal
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favoriteIds={favorites}
        onRemove={onRemoveFavorite}
      />

      {/* End Screen */}
      <EndScreen
        isOpen={showEndScreen}
        onRestart={onRestart}
        onViewFavorites={onViewFavoritesFromEnd}
        playChime={playChime}
      />
    </div>
  );
};

function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}

export default App;
