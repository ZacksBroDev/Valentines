// ============================================================
// BOTTOM NAV - Main navigation with labeled icons
// ============================================================

import { motion } from "framer-motion";
import { NavItem } from "../icons";
import { Mail, Heart, Sparkles, StickyNote, Shuffle } from "lucide-react";

interface BottomNavProps {
  onOpenWhen: () => void;
  onFavorites: () => void;
  onDraw: () => void;
  onNotes: () => void;
  onShuffle: () => void;
  canDraw: boolean;
  favoritesCount: number;
  notesCount: number;
  unreadNotesCount?: number; // New notes from admin - shows red dot
  activeTab?: "openWhen" | "favorites" | "draw" | "notes" | "shuffle";
}

export const BottomNav = ({
  onOpenWhen,
  onFavorites,
  onDraw,
  onNotes,
  onShuffle,
  canDraw,
  favoritesCount,
  notesCount,
  unreadNotesCount = 0,
  activeTab,
}: BottomNavProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className="flex items-center justify-around w-full max-w-md mx-auto"
    >
      <NavItem
        icon={Mail}
        label="Open When"
        onClick={onOpenWhen}
        active={activeTab === "openWhen"}
      />
      
      <NavItem
        icon={Heart}
        label="Favorites"
        onClick={onFavorites}
        active={activeTab === "favorites"}
        badge={favoritesCount}
      />
      
      {/* Primary Draw Button */}
      <motion.button
        onClick={onDraw}
        disabled={!canDraw}
        whileTap={canDraw ? { scale: 0.95 } : undefined}
        whileHover={canDraw ? { scale: 1.02 } : undefined}
        className={`
          relative flex flex-col items-center justify-center
          w-16 h-16 -mt-4
          rounded-full shadow-lg
          transition-all duration-200
          ${canDraw
            ? "bg-gradient-button text-white"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }
        `}
        aria-label="Draw a card"
      >
        <Sparkles size={28} strokeWidth={2} />
        <span className="text-[10px] font-semibold mt-0.5">Draw</span>
        
        {/* Pulse animation when can draw */}
        {canDraw && (
          <span className="absolute inset-0 rounded-full bg-accent-pink animate-ping opacity-20" />
        )}
      </motion.button>
      
      <NavItem
        icon={StickyNote}
        label="Notes"
        onClick={onNotes}
        active={activeTab === "notes"}
        badge={unreadNotesCount > 0 ? unreadNotesCount : undefined}
        urgentBadge={unreadNotesCount > 0}
      />
      
      <NavItem
        icon={Shuffle}
        label="Shuffle"
        onClick={onShuffle}
        active={activeTab === "shuffle"}
      />
    </motion.div>
  );
};

export default BottomNav;
