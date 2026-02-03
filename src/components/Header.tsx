import { motion } from "framer-motion";
import { getNotes } from "../utils/storage";

interface HeaderProps {
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenFavorites: () => void;
  onOpenSettings: () => void;
  onOpenNotes: () => void;
  favoritesCount: number;
  isDark?: boolean;
}

export const Header = ({
  isMuted,
  onToggleMute,
  onOpenFavorites,
  onOpenSettings,
  onOpenNotes,
  favoritesCount,
  isDark,
}: HeaderProps) => {
  const notesCount = getNotes().length;

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full flex items-center justify-between px-4 py-3 safe-top"
    >
      {/* Left buttons */}
      <div className="flex items-center gap-2">
        {/* Sound toggle */}
        <button
          onClick={onToggleMute}
          className={`w-10 h-10 rounded-full backdrop-blur-sm shadow-sm flex items-center justify-center text-lg transition-colors btn-press ${
            isDark
              ? "bg-white/20 hover:bg-white/30"
              : "bg-white/70 hover:bg-white"
          }`}
          aria-label={isMuted ? "Unmute sounds" : "Mute sounds"}
          title={isMuted ? "Unmute sounds" : "Mute sounds"}
        >
          {isMuted ? "🔇" : "🔊"}
        </button>

        {/* Settings */}
        <button
          onClick={onOpenSettings}
          className={`w-10 h-10 rounded-full backdrop-blur-sm shadow-sm flex items-center justify-center text-lg transition-colors btn-press ${
            isDark
              ? "bg-white/20 hover:bg-white/30"
              : "bg-white/70 hover:bg-white"
          }`}
          aria-label="Settings"
          title="Settings"
        >
          ⚙️
        </button>
      </div>

      {/* Title */}
      <div className="flex flex-col items-center">
        <h1
          className={`text-lg font-semibold tracking-tight ${isDark ? "text-white" : "text-accent-pink"}`}
        >
          Compliment Deck
        </h1>
        <span
          className={`text-xs opacity-70 ${isDark ? "text-gray-300" : "text-blush-500"}`}
        >
          made with 💕
        </span>
      </div>

      {/* Right buttons */}
      <div className="flex items-center gap-2">
        {/* Notes */}
        <button
          onClick={onOpenNotes}
          className={`relative w-10 h-10 rounded-full backdrop-blur-sm shadow-sm flex items-center justify-center text-lg transition-colors btn-press ${
            isDark
              ? "bg-white/20 hover:bg-white/30"
              : "bg-white/70 hover:bg-white"
          }`}
          aria-label={`Notes (${notesCount})`}
          title="Notes"
        >
          📝
          {notesCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-accent-pink text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {notesCount}
            </span>
          )}
        </button>

        {/* Favorites */}
        <button
          onClick={onOpenFavorites}
          className={`relative w-10 h-10 rounded-full backdrop-blur-sm shadow-sm flex items-center justify-center text-lg transition-colors btn-press ${
            isDark
              ? "bg-white/20 hover:bg-white/30"
              : "bg-white/70 hover:bg-white"
          }`}
          aria-label={`View favorites (${favoritesCount})`}
          title="Favorites"
        >
          💝
          {favoritesCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-accent-pink text-white text-xs font-bold rounded-full flex items-center justify-center"
            >
              {favoritesCount > 99 ? "99+" : favoritesCount}
            </motion.span>
          )}
        </button>
      </div>
    </motion.header>
  );
};
