// ============================================================
// MAIN CONTENT V2 - No-scroll layout with new components
// Uses AppShell for 100dvh fixed layout
// ============================================================

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppShell, HeaderSection, MainSection, BottomNavSection, CardContainer } from "./layout";
import { BottomNav } from "./layout/BottomNav";
import { HeaderV2 } from "./HeaderV2";
import { ComplimentCard } from "./CardRenderer";
import { StatsDrawer } from "./StatsDrawer";
import { VoucherInventoryModal } from "./VoucherInventoryModal";
import { FavoritesModal } from "./FavoritesModal";
import { SettingsModal } from "./SettingsModal";
import { NotesModal } from "./NotesModal";
import { OpenWhenModalV2 } from "./OpenWhenModalV2";
import { EndScreen } from "./EndScreen";
import { SkipLink } from "./SkipLink";
import { Mascots } from "./mascots/Mascots";
import { MoodPickerV2 } from "./MoodPickerV2";
import { AdminAuth, AdminDashboard, isAdminSessionValid } from "./admin";
import { Cloud } from "lucide-react";

import { MoodKey } from "../config";
import { AppStateReturn } from "../hooks/useAppState";
import { useVoucherInventory } from "../api/hooks";
import { allCards, getAvailableCards } from "../data/cards";
import { getNotes } from "../utils/storage";
import { fetchUnreadNotesCount } from "../utils/cloudStorage";

interface MainContentV2Props {
  state: AppStateReturn;
}

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
        className="bg-white rounded-t-3xl p-6 w-full max-w-md safe-bottom"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-center mb-4 flex items-center justify-center gap-2">
          <Cloud size={20} className="text-accent-pink" />
          How are you feeling?
        </h3>
        <MoodPickerV2
          currentMood={currentMood}
          onSelectMood={(mood) => {
            onSelect(mood);
            onClose();
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export const MainContentV2 = ({ state }: MainContentV2Props) => {
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
    reduceMotionEnabled,
    toggleReduceMotion,
    noRepeatEnabled,
    toggleNoRepeat,

    // Handlers
    onHeartBuddyTap,
    onHeartBuddyLongPress,
    onDraw,
    onSave: _onSave,
    onShare: _onShare,
    onShuffle,
    onOpenWhenSelect,
    onMoodSelect,
    onRestart,
    onDrawFinalThree,
    onRemoveFavorite,
  } = state;

  // New modal states
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isVouchersOpen, setIsVouchersOpen] = useState(false);
  
  // Admin states
  const [showAdminAuth, setShowAdminAuth] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);

  // Handle admin long-press on settings
  const handleAdminLongPress = () => {
    if (isAdminSessionValid()) {
      // Already authenticated, go straight to dashboard
      setShowAdminDashboard(true);
    } else {
      // Need to authenticate first
      setShowAdminAuth(true);
    }
  };

  const handleAdminAuthSuccess = () => {
    setShowAdminAuth(false);
    setShowAdminDashboard(true);
  };

  // Voucher inventory
  const { inventory } = useVoucherInventory();
  const voucherCount = inventory?.totalAvailable || 0;

  // Calculate card counts
  const availableCards = useMemo(() => getAvailableCards(secretUnlocked), [secretUnlocked]);
  const notesCount = getNotes().length;
  
  // Fetch unread notes count from cloud (async)
  const [unreadNotesFromAdmin, setUnreadNotesFromAdmin] = useState(0);
  useEffect(() => {
    const fetchUnread = async () => {
      const count = await fetchUnreadNotesCount(false);
      setUnreadNotesFromAdmin(count);
    };
    fetchUnread();
    // Poll every 30 seconds for new notes
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, []);

  // Calculate stats for drawer
  const stats = useMemo(() => {
    const all = allCards;
    const available = availableCards;
    
    // By type
    const textCards = available.filter(c => c.type === "text");
    const voucherCards = available.filter(c => c.type === "voucher");
    const playlistCards = available.filter(c => c.type === "playlist");
    
    // By category
    const sweetCards = available.filter(c => c.category === "sweet");
    const funnyCards = available.filter(c => c.category === "funny");
    const supportiveCards = available.filter(c => c.category === "supportive");
    const spicyCards = available.filter(c => c.category === "spicy-lite");
    const secretCards = all.filter(c => c.category === "secret");
    
    // By rarity
    const commonCards = available.filter(c => c.rarity === "common");
    const rareCards = available.filter(c => c.rarity === "rare");
    const legendaryCards = available.filter(c => c.rarity === "legendary");

    return {
      totalCards: available.length,
      seenCards: drawCount,
      remainingCards: Math.max(0, available.length - drawCount),
      
      textCardCount: textCards.length,
      voucherCardCount: voucherCards.length,
      playlistCardCount: playlistCards.length,
      
      sweetCount: sweetCards.length,
      funnyCount: funnyCards.length,
      supportiveCount: supportiveCards.length,
      spicyCount: spicyCards.length,
      secretCount: secretCards.length,
      
      commonCount: commonCards.length,
      rareCount: rareCards.length,
      legendaryCount: legendaryCards.length,
      legendaryDrawn: 0, // TODO: track this
      
      favoritesCount: favorites.length,
      notesCount,
      reasonsLogged,
      
      secretUnlocked,
      secretsSeenCount: 0, // TODO: track this
      
      currentDrawStreak: 0, // TODO: from API
      longestDrawStreak: 0,
      currentLoveStreak: 0,
      longestLoveStreak: 0,
      
      unlockedThemes: unlockedThemes as string[],
      loveMeterValue: 0, // TODO: from state
      loveMeterMax: 100,
    };
  }, [availableCards, drawCount, favorites.length, notesCount, reasonsLogged, secretUnlocked, unlockedThemes]);

  // Determine if dark theme
  const isDark = currentTheme === "night";

  return (
    <AppShell theme={currentTheme}>
      <SkipLink targetId="main-content" />
      
      {/* Header */}
      <HeaderSection>
        <HeaderV2
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenStats={() => setIsStatsOpen(true)}
          onOpenVouchers={() => setIsVouchersOpen(true)}
          onToggleMute={toggleMute}
          onAdminLongPress={handleAdminLongPress}
          isMuted={isMuted}
          voucherCount={voucherCount}
          isDark={isDark}
        />
      </HeaderSection>

      {/* Main Card Area */}
      <MainSection id="main-content">
        {/* Mascots - compact */}
        <div className="shrink-0">
          <Mascots
            onHeartBuddyTap={onHeartBuddyTap}
            onHeartBuddyLongPress={onHeartBuddyLongPress}
            isHeartBuddyBlushing={isHeartBuddyBlushing}
            showFloatingHeart={showFloatingHeart}
            isEnvelopeOpen={isEnvelopeOpen}
            secretUnlocked={secretUnlocked}
          />
        </div>

        {/* Card */}
        <CardContainer>
          <ComplimentCard
            card={currentCard}
            isFavorite={isCurrentFavorite}
            cardKey={cardKey}
            onSave={currentCard ? _onSave : undefined}
            isDark={isDark}
            reduceMotion={reduceMotionEnabled}
          />
        </CardContainer>
      </MainSection>

      {/* Bottom Navigation */}
      <BottomNavSection>
        <BottomNav
          onOpenWhen={() => setIsOpenWhenOpen(true)}
          onFavorites={() => setIsFavoritesOpen(true)}
          onDraw={onDraw}
          onNotes={() => setIsNotesOpen(true)}
          onShuffle={onShuffle}
          canDraw={!dailyMode || !dailyCardDrawn}
          favoritesCount={favorites.length}
          notesCount={notesCount}
          unreadNotesCount={unreadNotesFromAdmin}
        />
      </BottomNavSection>

      {/* ============================================================ */}
      {/* MODALS & DRAWERS */}
      {/* ============================================================ */}

      {/* Stats Drawer */}
      <StatsDrawer
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        stats={stats}
      />

      {/* Voucher Inventory */}
      <VoucherInventoryModal
        isOpen={isVouchersOpen}
        onClose={() => setIsVouchersOpen(false)}
      />

      {/* Favorites */}
      <FavoritesModal
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favoriteIds={favorites}
        onRemove={onRemoveFavorite}
      />

      {/* Settings */}
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
        reduceMotionEnabled={reduceMotionEnabled}
        onReduceMotionToggle={toggleReduceMotion}
        noRepeatEnabled={noRepeatEnabled}
        onNoRepeatToggle={toggleNoRepeat}
        reasonsLogged={reasonsLogged}
      />

      {/* Notes */}
      <NotesModal
        isOpen={isNotesOpen}
        onClose={() => setIsNotesOpen(false)}
      />

      {/* Open When */}
      <OpenWhenModalV2
        isOpen={isOpenWhenOpen}
        onClose={() => setIsOpenWhenOpen(false)}
        currentMode={null}
        onSelectMode={(mode) => mode && onOpenWhenSelect(mode)}
        secretUnlocked={secretUnlocked}
      />

      {/* Mood Picker */}
      <AnimatePresence>
        {showMoodPicker && (
          <MoodPickerModal
            isOpen={showMoodPicker}
            currentMood={currentMood}
            onClose={() => setShowMoodPicker(false)}
            onSelect={onMoodSelect}
          />
        )}
      </AnimatePresence>

      {/* End Screen */}
      <EndScreen
        isOpen={showEndScreen}
        onRestart={onRestart}
        onViewFavorites={() => setIsFavoritesOpen(true)}
        onFinalThree={onDrawFinalThree}
        playChime={playChime}
      />

      {/* Admin Auth */}
      <AdminAuth
        isOpen={showAdminAuth}
        onClose={() => setShowAdminAuth(false)}
        onSuccess={handleAdminAuthSuccess}
      />

      {/* Admin Dashboard */}
      <AdminDashboard
        isOpen={showAdminDashboard}
        onClose={() => setShowAdminDashboard(false)}
      />
    </AppShell>
  );
};

export default MainContentV2;
