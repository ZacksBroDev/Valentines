// ============================================================
// MAIN CONTENT V2 - No-scroll layout with new components
// Uses AppShell for 100dvh fixed layout
// ============================================================

import { useState, useMemo, useEffect, useCallback, lazy, Suspense, startTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppShell, HeaderSection, MainSection, BottomNavSection, CardContainer } from "./layout";
import { BottomNav } from "./layout/BottomNav";
import { HeaderV2 } from "./HeaderV2";
import { ComplimentCard } from "./CardRenderer";
import { EndScreen } from "./EndScreen";
import { SkipLink } from "./SkipLink";
import { Mascots } from "./mascots/Mascots";
import { MoodPickerV2 } from "./MoodPickerV2";
import { AdminAuth, isAdminSessionValid } from "./admin";
import { Cloud, Heart, Loader2 } from "lucide-react";

import { MoodKey } from "../config";
import { AppStateReturn } from "../hooks/useAppState";
import { Card } from "../types";
import { useVoucherInventory } from "../api/hooks";
import { allCards, getAvailableCards } from "../data/cards";
import { getNotes, getRedeemedVoucherCount } from "../utils/storage";
import { fetchUnreadNotesCount, fetchSharedNotes } from "../utils/cloudStorage";

// Lazy-loaded heavy modals for performance
const StatsDrawer = lazy(() => import("./StatsDrawer").then(m => ({ default: m.StatsDrawer })));
const VoucherInventoryModal = lazy(() => import("./VoucherInventoryModal").then(m => ({ default: m.VoucherInventoryModal })));
const FavoritesModal = lazy(() => import("./FavoritesModal").then(m => ({ default: m.FavoritesModal })));
const SettingsModal = lazy(() => import("./SettingsModal").then(m => ({ default: m.SettingsModal })));
const NotesModal = lazy(() => import("./NotesModal").then(m => ({ default: m.NotesModal })));
const OpenWhenModalV2 = lazy(() => import("./OpenWhenModalV2").then(m => ({ default: m.OpenWhenModalV2 })));
const SeenCardsModal = lazy(() => import("./SeenCardsModal").then(m => ({ default: m.SeenCardsModal })));
const ReminderModal = lazy(() => import("./ReminderModal").then(m => ({ default: m.ReminderModal })));
const AdminDashboard = lazy(() => import("./admin").then(m => ({ default: m.AdminDashboard })));

// Loading fallback for lazy-loaded modals
const ModalLoadingFallback = () => (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
    <div className="bg-white rounded-xl p-6 flex items-center gap-3">
      <Loader2 className="w-5 h-5 animate-spin text-accent-pink" />
      <span className="text-sm text-gray-600">Loading...</span>
    </div>
  </div>
);

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
    secretProgressDraws,
    secretUnlockThreshold,
    dailyMode,
    dailyCardDrawn,
    currentMood,
    openWhenMode,
    cardKey,
    // selectedSticker available but not currently used

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
    // onShare available in state but not currently used
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
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const [isSeenCardsOpen, setIsSeenCardsOpen] = useState(false);
  const [viewingCard, setViewingCard] = useState<Card | null>(null);
  
  // Admin states
  const [showAdminAuth, setShowAdminAuth] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);

  // Wrapped state setters for lazy-loaded modals to avoid Suspense issues
  const openStats = useCallback(() => startTransition(() => setIsStatsOpen(true)), []);
  const closeStats = useCallback(() => setIsStatsOpen(false), []);
  const openVouchers = useCallback(() => startTransition(() => setIsVouchersOpen(true)), []);
  const closeVouchers = useCallback(() => setIsVouchersOpen(false), []);
  const openSeenCards = useCallback(() => startTransition(() => setIsSeenCardsOpen(true)), []);
  const closeSeenCards = useCallback(() => setIsSeenCardsOpen(false), []);
  const openAdminDashboard = useCallback(() => startTransition(() => setShowAdminDashboard(true)), []);
  const closeAdminDashboard = useCallback(() => setShowAdminDashboard(false), []);
  
  // Handler for viewing a specific card from seen history
  const handleViewSeenCard = useCallback((card: Card) => {
    setViewingCard(card);
    setIsSeenCardsOpen(false); // Close modal to show the card
  }, []);

  // Handle admin long-press on settings
  const handleAdminLongPress = () => {
    if (isAdminSessionValid()) {
      // Already authenticated, go straight to dashboard
      openAdminDashboard();
    } else {
      // Need to authenticate first
      setShowAdminAuth(true);
    }
  };

  const handleAdminAuthSuccess = () => {
    setShowAdminAuth(false);
    openAdminDashboard();
  };

  // Voucher inventory (API-based) + local deck vouchers
  const { inventory } = useVoucherInventory();
  const [localVoucherCount, setLocalVoucherCount] = useState(getRedeemedVoucherCount);
  const voucherCount = (inventory?.totalAvailable || 0) + localVoucherCount;
  
  // Handler for when a voucher is redeemed from the deck
  const handleVoucherRedeemed = useCallback(() => {
    // Update local voucher count
    setLocalVoucherCount(getRedeemedVoucherCount());
    // Note: The deck will automatically exclude the redeemed voucher on next draw
    // since getAvailableCards filters out redeemed voucher IDs
  }, []);

  // Calculate card counts - include openWhenMode filter for accurate count
  // Also re-calculate when local voucher count changes (voucher redeemed = removed from deck)
  const availableCards = useMemo(() => getAvailableCards(secretUnlocked, undefined, openWhenMode || undefined), [secretUnlocked, openWhenMode, localVoucherCount]);
  const localNotesCount = getNotes().length;
  
  // Fetch shared notes count from cloud (async)
  const [sharedNotesCount, setSharedNotesCount] = useState(0);
  const [unreadNotesFromAdmin, setUnreadNotesFromAdmin] = useState(0);
  
  useEffect(() => {
    const fetchNotesData = async () => {
      const [unreadCount, sharedNotes] = await Promise.all([
        fetchUnreadNotesCount(false),
        fetchSharedNotes()
      ]);
      setUnreadNotesFromAdmin(unreadCount);
      // Count notes from admin ("From Him" tab)
      setSharedNotesCount(sharedNotes.filter(n => n.from === "admin").length);
    };
    fetchNotesData();
    // Poll every 30 seconds for new notes
    const interval = setInterval(fetchNotesData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Total notes = local personal notes + shared notes from him
  const notesCount = localNotesCount + sharedNotesCount;

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
      secretsSeenCount: secretUnlocked 
        ? (state.seenIds || []).filter(id => {
            const card = allCards.find(c => c.id === id);
            return card?.category === "secret";
          }).length 
        : 0,
      secretProgressDraws: secretProgressDraws || 0,
      secretUnlockThreshold: secretUnlockThreshold || 25,
      
      currentDrawStreak: 0, // TODO: from API
      longestDrawStreak: 0,
      currentLoveStreak: 0,
      longestLoveStreak: 0,
      
      unlockedThemes: unlockedThemes as string[],
      loveMeterValue: state.loveMeterValue,
      loveMeterMax: 100,
    };
  }, [availableCards, drawCount, favorites.length, notesCount, reasonsLogged, secretUnlocked, secretProgressDraws, secretUnlockThreshold, state.seenIds, state.loveMeterValue, unlockedThemes]);

  // Determine if dark theme
  const isDark = currentTheme === "night";

  return (
    <AppShell theme={currentTheme}>
      <SkipLink targetId="main-content" />
      
      {/* Header */}
      <HeaderSection>
        <HeaderV2
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenStats={openStats}
          onOpenVouchers={openVouchers}
          onOpenSeenCards={openSeenCards}
          onToggleMute={toggleMute}
          onAdminLongPress={handleAdminLongPress}
          isMuted={isMuted}
          voucherCount={voucherCount}
          seenCount={state.seenIds?.length || 0}
          totalCards={availableCards.length}
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

        {/* Card - show viewingCard from seen history if selected, otherwise currentCard */}
        <CardContainer>
          <ComplimentCard
            card={viewingCard || currentCard}
            isFavorite={viewingCard ? favorites.includes(viewingCard.id) : isCurrentFavorite}
            cardKey={viewingCard ? Date.now() : cardKey}
            onSave={viewingCard ? undefined : (currentCard ? _onSave : undefined)}
            onVoucherRedeem={handleVoucherRedeemed}
            isDark={isDark}
            reduceMotion={reduceMotionEnabled}
          />
          {viewingCard && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setViewingCard(null)}
              className={`
                mt-3 px-4 py-2 rounded-full text-xs font-medium
                flex items-center gap-1.5 min-h-[44px] mx-auto
                transition-all hover:scale-105
                ${isDark 
                  ? "bg-white/10 text-white/80 hover:bg-white/20" 
                  : "bg-blush-100 text-blush-700 hover:bg-blush-200"
                }
              `}
            >
              Back to current card
            </motion.button>
          )}
        </CardContainer>

        {/* Need a reminder button */}
        {!viewingCard && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onClick={() => setIsReminderOpen(true)}
            className={`
              -mt-6 px-4 py-2 rounded-full text-xs font-medium
              flex items-center gap-1.5 min-h-[44px] mx-auto
              transition-all hover:scale-105
              ${isDark 
                ? "bg-white/10 text-white/80 hover:bg-white/20" 
                : "bg-blush-100 text-blush-700 hover:bg-blush-200"
              }
            `}
          >
            <Heart size={14} fill="currentColor" />
            Need a reminder?
          </motion.button>
        )}
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
          dailyMode={dailyMode}
          drawsRemaining={state.drawsRemaining}
          dailyLimit={state.dailyLimit}
          timeUntilNextDraw={state.timeUntilNextDraw}
        />
      </BottomNavSection>

      {/* ============================================================ */}
      {/* MODALS & DRAWERS */}
      {/* ============================================================ */}

      {/* Reminder Modal */}
      <ReminderModal
        isOpen={isReminderOpen}
        onClose={() => setIsReminderOpen(false)}
      />

      {/* Lazy-loaded modals wrapped in Suspense */}
      <Suspense fallback={<ModalLoadingFallback />}>
        {/* Stats Drawer */}
        {isStatsOpen && (
          <StatsDrawer
            isOpen={isStatsOpen}
            onClose={closeStats}
            stats={stats}
          />
        )}

        {/* Voucher Inventory */}
        {isVouchersOpen && (
          <VoucherInventoryModal
            isOpen={isVouchersOpen}
            onClose={closeVouchers}
          />
        )}

        {/* Favorites */}
        {isFavoritesOpen && (
          <FavoritesModal
            isOpen={isFavoritesOpen}
            onClose={() => setIsFavoritesOpen(false)}
            favoriteIds={favorites}
            onRemove={onRemoveFavorite}
          />
        )}

        {/* Settings */}
        {isSettingsOpen && (
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
        )}

        {/* Notes */}
        {isNotesOpen && (
          <NotesModal
            isOpen={isNotesOpen}
            onClose={async () => {
              setIsNotesOpen(false);
              // Refresh notes counts when modal closes
              const [unreadCount, sharedNotes] = await Promise.all([
                fetchUnreadNotesCount(false),
                fetchSharedNotes()
              ]);
              setUnreadNotesFromAdmin(unreadCount);
              setSharedNotesCount(sharedNotes.filter(n => n.from === "admin").length);
            }}
            onNotesRead={async () => {
              // Refresh counts after notes are marked as read
              const [unreadCount, sharedNotes] = await Promise.all([
                fetchUnreadNotesCount(false),
                fetchSharedNotes()
              ]);
              setUnreadNotesFromAdmin(unreadCount);
              setSharedNotesCount(sharedNotes.filter(n => n.from === "admin").length);
            }}
          />
        )}

        {/* Open When */}
        {isOpenWhenOpen && (
          <OpenWhenModalV2
            isOpen={isOpenWhenOpen}
            onClose={() => setIsOpenWhenOpen(false)}
            currentMode={null}
            onSelectMode={(mode) => mode && onOpenWhenSelect(mode)}
            secretUnlocked={secretUnlocked}
          />
        )}
        
        {/* Seen Cards History */}
        {isSeenCardsOpen && (
          <SeenCardsModal
            isOpen={isSeenCardsOpen}
            onClose={closeSeenCards}
            seenIds={state.seenIds || []}
            onViewCard={handleViewSeenCard}
            favorites={favorites as string[]}
          />
        )}
      </Suspense>

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

      {/* Admin Dashboard (lazy loaded) */}
      <Suspense fallback={<ModalLoadingFallback />}>
        {showAdminDashboard && (
          <AdminDashboard
            isOpen={showAdminDashboard}
            onClose={closeAdminDashboard}
          />
        )}
      </Suspense>
    </AppShell>
  );
};

export default MainContentV2;
