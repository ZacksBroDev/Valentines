// ============================================================
// STATS DRAWER - Full breakdown of progress and stats
// ============================================================

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Heart,
  Sparkles,
  Lock,
  Unlock,
  Star,
  Diamond,
  MessageSquare,
  Ticket,
  Music,
  TrendingUp,
  Crown,
  Target,
  Flame,
} from "lucide-react";
import { CATEGORY_ICONS, MOOD_ICONS } from "./icons";
import { SecretProgressIndicator } from "./SecretProgressIndicator";

interface StatsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  stats: {
    // Card counts
    totalCards: number;
    seenCards: number;
    remainingCards: number;
    
    // By type
    textCardCount: number;
    voucherCardCount: number;
    playlistCardCount: number;
    
    // By category
    sweetCount: number;
    funnyCount: number;
    supportiveCount: number;
    spicyCount: number;
    secretCount: number;
    
    // By rarity
    commonCount: number;
    rareCount: number;
    legendaryCount: number;
    legendaryDrawn: number;
    
    // User progress
    favoritesCount: number;
    notesCount: number;
    reasonsLogged: number;
    
    // Secrets
    secretUnlocked: boolean;
    secretsSeenCount: number;
    secretProgressDraws: number;
    secretUnlockThreshold: number;
    
    // Streaks
    currentDrawStreak: number;
    longestDrawStreak: number;
    currentLoveStreak: number;
    longestLoveStreak: number;
    
    // Milestones
    unlockedThemes: string[];
    loveMeterValue: number;
    loveMeterMax: number;
  };
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  subtext?: string;
  color?: string;
}

const StatCard = ({ icon, label, value, subtext, color = "text-accent-pink" }: StatCardProps) => (
  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 flex items-center gap-3">
    <div className={`${color}`}>{icon}</div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-gray-500 truncate">{label}</p>
      <p className="text-lg font-bold text-gray-800">{value}</p>
      {subtext && <p className="text-[10px] text-gray-400">{subtext}</p>}
    </div>
  </div>
);

interface StatRowProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  color?: string;
}

const StatRow = ({ icon, label, value, color = "text-gray-600" }: StatRowProps) => (
  <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
    <div className="flex items-center gap-2">
      <span className={color}>{icon}</span>
      <span className="text-sm text-gray-600">{label}</span>
    </div>
    <span className="text-sm font-semibold text-gray-800">{value}</span>
  </div>
);

const ProgressBar = ({ value, max, color = "bg-accent-pink" }: { value: number; max: number; color?: string }) => (
  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${Math.min((value / max) * 100, 100)}%` }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`h-full ${color} rounded-full`}
    />
  </div>
);

export const StatsDrawer = ({ isOpen, onClose, stats }: StatsDrawerProps) => {
  const deckProgress = stats.totalCards > 0 
    ? Math.round((stats.seenCards / stats.totalCards) * 100) 
    : 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-gradient-to-b from-blush-50 to-white shadow-2xl z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-blush-100 px-4 py-3 flex items-center justify-between safe-top">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <TrendingUp size={20} className="text-accent-pink" />
                Your Stats
              </h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                aria-label="Close stats"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="p-4 space-y-6">
              {/* Deck Progress */}
              <section>
                <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Target size={16} />
                  Deck Progress
                </h3>
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Cards Seen</span>
                    <span className="text-sm font-semibold">
                      {stats.seenCards} / {stats.totalCards}
                    </span>
                  </div>
                  <ProgressBar value={stats.seenCards} max={stats.totalCards} />
                  <p className="text-xs text-gray-400 mt-2 text-center">
                    {stats.remainingCards} cards remaining • {deckProgress}% complete
                  </p>
                </div>
              </section>
              
              {/* Quick Stats Grid */}
              <section>
                <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Sparkles size={16} />
                  Highlights
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <StatCard
                    icon={<Heart size={20} fill="currentColor" />}
                    label="Favorites"
                    value={stats.favoritesCount}
                    color="text-pink-500"
                  />
                  <StatCard
                    icon={<MessageSquare size={20} />}
                    label="Notes"
                    value={stats.notesCount}
                    color="text-purple-500"
                  />
                  <StatCard
                    icon={<Flame size={20} />}
                    label="Draw Streak"
                    value={`${stats.currentDrawStreak} days`}
                    subtext={`Best: ${stats.longestDrawStreak}`}
                    color="text-orange-500"
                  />
                  <StatCard
                    icon={<Heart size={20} />}
                    label="Love Streak"
                    value={`${stats.currentLoveStreak} days`}
                    subtext={`Best: ${stats.longestLoveStreak}`}
                    color="text-red-500"
                  />
                </div>
              </section>
              
              {/* Love Meter */}
              <section>
                <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Crown size={16} />
                  Love Meter
                </h3>
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Progress</span>
                    <span className="text-sm font-semibold">
                      {stats.loveMeterValue} / {stats.loveMeterMax}
                    </span>
                  </div>
                  <ProgressBar 
                    value={stats.loveMeterValue} 
                    max={stats.loveMeterMax} 
                    color="bg-gradient-to-r from-pink-400 to-purple-400"
                  />
                  <p className="text-xs text-gray-400 mt-2">
                    Log love to fill the meter and unlock themes!
                  </p>
                </div>
              </section>
              
              {/* Cards by Type */}
              <section>
                <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <MessageSquare size={16} />
                  Cards by Type
                </h3>
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4">
                  <StatRow icon={<MessageSquare size={16} />} label="Text Cards" value={stats.textCardCount} color="text-blue-500" />
                  <StatRow icon={<Ticket size={16} />} label="Vouchers" value={stats.voucherCardCount} color="text-green-500" />
                  <StatRow icon={<Music size={16} />} label="Playlists" value={stats.playlistCardCount} color="text-purple-500" />
                </div>
              </section>
              
              {/* Cards by Category */}
              <section>
                <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Heart size={16} />
                  Cards by Category
                </h3>
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4">
                  <StatRow icon={<Heart size={16} />} label="Sweet" value={stats.sweetCount} color="text-pink-500" />
                  <StatRow icon={<MOOD_ICONS.funny size={16} />} label="Funny" value={stats.funnyCount} color="text-yellow-500" />
                  <StatRow icon={<CATEGORY_ICONS.supportive size={16} />} label="Supportive" value={stats.supportiveCount} color="text-blue-500" />
                  <StatRow icon={<Flame size={16} />} label="Spicy" value={stats.spicyCount} color="text-orange-500" />
                  <StatRow 
                    icon={stats.secretUnlocked ? <Unlock size={16} /> : <Lock size={16} />} 
                    label="Secret" 
                    value={stats.secretUnlocked ? stats.secretCount : "Locked"} 
                    color={stats.secretUnlocked ? "text-purple-500" : "text-gray-400"}
                  />
                </div>
              </section>
              
              {/* Cards by Rarity */}
              <section>
                <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Star size={16} />
                  Cards by Rarity
                </h3>
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4">
                  <StatRow icon={<div className="w-4 h-4 rounded-full border-2 border-gray-400" />} label="Common" value={stats.commonCount} color="text-gray-500" />
                  <StatRow icon={<Diamond size={16} />} label="Rare" value={stats.rareCount} color="text-blue-500" />
                  <StatRow 
                    icon={<Star size={16} fill="currentColor" />} 
                    label="Legendary" 
                    value={`${stats.legendaryDrawn} / ${stats.legendaryCount}`} 
                    color="text-yellow-500"
                  />
                </div>
              </section>
              
              {/* Secrets */}
              <section>
                <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  {stats.secretUnlocked ? <Unlock size={16} /> : <Lock size={16} />}
                  Secret Deck
                </h3>
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 space-y-4">
                  {stats.secretUnlocked ? (
                    <>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <Unlock size={14} className="text-purple-500" /> Secret deck unlocked!
                        </p>
                        <span className="text-sm font-semibold text-purple-600">
                          {stats.secretsSeenCount} / {stats.secretCount}
                        </span>
                      </div>
                      <ProgressBar 
                        value={stats.secretsSeenCount} 
                        max={stats.secretCount} 
                        color="bg-purple-500" 
                      />
                      <p className="text-xs text-gray-400 text-center">
                        {stats.secretCount - stats.secretsSeenCount} secret cards remaining
                      </p>
                    </>
                  ) : (
                    <>
                      <SecretProgressIndicator
                        currentDraws={stats.secretProgressDraws}
                        maxDraws={stats.secretUnlockThreshold}
                        isUnlocked={false}
                        size="md"
                      />
                      <div className="pt-2 border-t border-gray-100">
                        <p className="text-xs text-gray-400 text-center">
                          💡 Or tap the heart mascot 5 times quickly to unlock instantly!
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </section>
              
              {/* Unlocked Themes */}
              <section>
                <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Crown size={16} />
                  Unlocked Themes
                </h3>
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex flex-wrap gap-2">
                    {["blush", "lavender", "night", "sunset"].map((theme) => {
                      const isUnlocked = stats.unlockedThemes.includes(theme);
                      return (
                        <span
                          key={theme}
                          className={`
                            px-3 py-1 rounded-full text-xs font-medium capitalize flex items-center gap-1
                            ${isUnlocked 
                              ? "bg-accent-pink text-white" 
                              : "bg-gray-100 text-gray-400"
                            }
                          `}
                        >
                          {!isUnlocked && <Lock size={10} />}
                          {theme}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </section>
              
              {/* Reasons Logged */}
              <section className="pb-safe">
                <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl p-4 text-center">
                  <p className="text-sm text-gray-600 mb-1">Reasons you've logged love</p>
                  <p className="text-3xl font-bold text-accent-pink">{stats.reasonsLogged}</p>
                </div>
              </section>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default StatsDrawer;
