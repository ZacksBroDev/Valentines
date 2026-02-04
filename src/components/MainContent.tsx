import { motion, AnimatePresence } from "framer-motion";
import { Header } from "./Header";
import { Mascots } from "./mascots/Mascots";
import { ComplimentCard } from "./CardRenderer";
import { ActionBar } from "./ActionBar";
import { FavoritesModal } from "./FavoritesModal";
import { EndScreen } from "./EndScreen";
import { SettingsModal } from "./SettingsModal";
import { NotesModal } from "./NotesModal";
import { OpenWhenModal } from "./OpenWhenModal";
import { MoodPicker } from "./MoodPicker";
import { SkipLink } from "./SkipLink";
import { MOODS, MoodKey, StickerKey } from "../config";
import { AppStateReturn } from "../hooks/useAppState";

interface MainContentProps {
  state: AppStateReturn;
}

/**
 * Desktop side panel showing stats
 */
const StatsPanel = ({
  favoritesCount,
  reasonsLogged,
}: {
  favoritesCount: number;
  reasonsLogged: number;
}) => (
  <div className="hidden lg:flex flex-col items-center justify-center gap-4 w-32">
    <div className="bg-white/30 backdrop-blur-sm rounded-xl p-3 text-center">
      <p className="text-2xl font-bold text-accent-pink">{favoritesCount}</p>
      <p className="text-xs text-gray-600">Favorites</p>
    </div>
    <div className="bg-white/30 backdrop-blur-sm rounded-xl p-3 text-center">
      <p className="text-2xl font-bold text-accent-pink">{reasonsLogged}</p>
      <p className="text-xs text-gray-600">Love logged</p>
    </div>
  </div>
);

/**
 * Desktop side panel showing tips
 */
const TipsPanel = ({ secretUnlocked }: { secretUnlocked: boolean }) => (
  <div className="hidden lg:flex flex-col items-center justify-center gap-4 w-32">
    <div className="bg-white/30 backdrop-blur-sm rounded-xl p-3 text-center">
      <p className="text-sm mb-1">💡 Tip</p>
      <p className="text-[10px] text-gray-600 leading-tight">
        Long-press the heart mascot to log why you love your partner!
      </p>
    </div>
    <div className="bg-white/30 backdrop-blur-sm rounded-xl p-3 text-center">
      <p className="text-sm mb-1">🔮 Secret</p>
      <p className="text-[10px] text-gray-600 leading-tight">
        Tap the heart 5x fast to unlock secret cards!
      </p>
    </div>
    {secretUnlocked && (
      <div className="bg-accent-lavender/50 backdrop-blur-sm rounded-xl p-3 text-center">
        <p className="text-sm">🔓</p>
        <p className="text-[10px] text-purple-700">Secret deck active!</p>
      </div>
    )}
  </div>
);

/**
 * Mood picker bottom sheet modal
 */
const MoodPickerModal = ({
  isOpen,
  currentMood,
  onClose,
  onSelect,
}: {
  isOpen: boolean;
  currentMood: MoodKey;
  onClose: () => void;
  onSelect: (mood: MoodKey) => void;
}) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex items-end justify-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Select your mood"
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        className="bg-white rounded-t-3xl p-6 pb-10 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-center mb-4">
          How are you feeling?
        </h3>
        <MoodPicker
          currentMood={currentMood}
          onSelectMood={(mood) => {
            onSelect(mood);
          }}
        />
      </motion.div>
    </motion.div>
  );
};

/**
 * Main content component - renders the card deck UI
 */
export const MainContent = ({ state }: MainContentProps) => {
  const {
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
  } = state;

  return (
    <div
      className={`h-screen max-h-screen overflow-hidden hearts-bg hearts-pattern flex flex-col relative theme-${currentTheme}`}
    >
      <SkipLink targetId="main-content" />
      <div className="hearts-pattern" />

      <Header
        isMuted={isMuted}
        onToggleMute={toggleMute}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenNotes={() => setIsNotesOpen(true)}
        favoritesCount={favorites.length}
      />

      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 flex flex-col items-center justify-center px-3 py-1 relative z-10 min-h-0"
        role="main"
        aria-label="Compliment card deck"
      >
        {/* Mascots - always visible above card */}
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
          className="mb-1 text-xs text-blush-500 flex items-center gap-1 hover:text-blush-700 transition-colors"
          aria-label={`Current mood: ${currentMood ? MOODS[currentMood]?.label : "All"}. Click to change mood`}
        >
          {currentMood ? MOODS[currentMood]?.emoji : "💭"}
          {currentMood ? MOODS[currentMood]?.label : "All"}
        </button>

        <AnimatePresence>
          {drawCount > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs text-blush-500 mb-1"
              aria-live="polite"
            >
              Card {drawCount} {secretUnlocked && "(+ secrets)"}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Desktop: 3-column layout with side panels */}
        <div className="w-full flex-1 flex items-center justify-center min-h-0 gap-4 lg:gap-8">
          <StatsPanel
            favoritesCount={favorites.length}
            reasonsLogged={reasonsLogged}
          />

          {/* Card - Responsive sizing */}
          <div className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] lg:max-w-[400px] xl:max-w-[440px] flex items-center min-h-0">
            <ComplimentCard
              card={currentCard}
              isFavorite={isCurrentFavorite}
              cardKey={cardKey}
              sticker={selectedSticker as StickerKey | undefined}
              onStickerClick={() => {}}
            />
          </div>

          <TipsPanel secretUnlocked={secretUnlocked} />
        </div>
      </main>

      <div className="pb-2 pt-1">
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

      {/* Modals */}
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

      <NotesModal isOpen={isNotesOpen} onClose={() => setIsNotesOpen(false)} />

      <OpenWhenModal
        isOpen={isOpenWhenOpen}
        onClose={() => setIsOpenWhenOpen(false)}
        currentMode={null}
        onSelectMode={(mode) => mode && onOpenWhenSelect(mode)}
      />

      <MoodPickerModal
        isOpen={showMoodPicker}
        currentMood={currentMood}
        onClose={() => setShowMoodPicker(false)}
        onSelect={onMoodSelect}
      />

      <EndScreen
        isOpen={showEndScreen}
        onRestart={onRestart}
        onViewFavorites={() => {
          setIsFavoritesOpen(true);
        }}
        onFinalThree={onDrawFinalThree}
        playChime={playChime}
      />
    </div>
  );
};

export default MainContent;
