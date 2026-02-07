import { motion } from "framer-motion";
import { Mail, Heart, Sparkles, Share2, Shuffle, Camera } from "lucide-react";

interface ActionBarProps {
  onDraw: () => void;
  onSave: () => void;
  onShare: () => void;
  onOpenWhen: () => void;
  onShuffle: () => void;
  onScreenshot?: () => void;
  isFavorite: boolean;
  hasCard: boolean;
  canDraw: boolean;
  isDailyBlocked?: boolean;
  isDark?: boolean;
}

export const ActionBar = ({
  onDraw,
  onSave,
  onShare,
  onOpenWhen,
  onShuffle,
  onScreenshot,
  isFavorite,
  hasCard,
  canDraw,
  isDailyBlocked,
  isDark,
}: ActionBarProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="w-full max-w-md mx-auto px-3 safe-bottom"
    >
      {/* Daily mode blocked message */}
      {isDailyBlocked && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-center text-xs mb-2 ${isDark ? "text-gray-300" : "text-blush-600"}`}
        >
          Come back tomorrow
        </motion.p>
      )}

      {/* Main action row */}
      <div className="flex items-center justify-center gap-2">
        {/* Open When button - 44px min touch target */}
        <motion.button
          onClick={onOpenWhen}
          whileTap={{ scale: 0.95 }}
          className={`w-11 h-11 min-w-[44px] min-h-[44px] rounded-full shadow-button flex items-center justify-center transition-all btn-press ${
            isDark
              ? "bg-white/20 hover:bg-white/30 text-white"
              : "bg-white hover:bg-blush-50 text-accent-pink"
          }`}
          aria-label="Open when..."
          title="Open when..."
        >
          <Mail size={18} strokeWidth={2} />
        </motion.button>

        {/* Save button - 44px min touch target */}
        <motion.button
          onClick={onSave}
          disabled={!hasCard}
          whileTap={{ scale: 0.95 }}
          className={`w-11 h-11 min-w-[44px] min-h-[44px] rounded-full shadow-button flex items-center justify-center transition-all btn-press ${
            hasCard
              ? isFavorite
                ? "bg-accent-pink text-white"
                : isDark
                  ? "bg-white/20 hover:bg-white/30 text-white"
                  : "bg-white hover:bg-blush-50 text-gray-500 hover:text-accent-pink"
              : "bg-gray-100 text-gray-300 opacity-50 cursor-not-allowed"
          }`}
          aria-label={
            isFavorite ? "Remove from favorites" : "Save to favorites"
          }
          title={isFavorite ? "Remove from favorites" : "Save to favorites"}
        >
          <motion.div
            key={isFavorite ? "saved" : "unsaved"}
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500 }}
          >
            <Heart size={18} strokeWidth={2} fill={isFavorite ? "currentColor" : "none"} />
          </motion.div>
        </motion.button>

        {/* Draw button - primary */}
        <motion.button
          onClick={onDraw}
          disabled={!canDraw}
          whileTap={canDraw ? { scale: 0.95 } : undefined}
          whileHover={canDraw ? { scale: 1.02 } : undefined}
          className={`h-11 min-h-[44px] px-6 rounded-full font-semibold text-sm shadow-button transition-all btn-press flex items-center gap-1.5 ${
            canDraw
              ? "bg-gradient-button text-white hover:shadow-card-hover"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
          aria-label="Draw a new compliment"
        >
          <Sparkles size={18} strokeWidth={2} />
          <span>Draw</span>
        </motion.button>

        {/* Share button - 44px min touch target */}
        <motion.button
          onClick={onShare}
          disabled={!hasCard}
          whileTap={{ scale: 0.95 }}
          className={`w-11 h-11 min-w-[44px] min-h-[44px] rounded-full shadow-button flex items-center justify-center transition-all btn-press ${
            hasCard
              ? isDark
                ? "bg-white/20 hover:bg-white/30 text-white"
                : "bg-white hover:bg-blush-50 text-gray-500 hover:text-accent-pink"
              : "bg-gray-100 text-gray-300 opacity-50 cursor-not-allowed"
          }`}
          aria-label="Share this compliment"
          title="Share"
        >
          <Share2 size={18} strokeWidth={2} />
        </motion.button>

        {/* Shuffle button - 44px min touch target */}
        <motion.button
          onClick={onShuffle}
          whileTap={{ scale: 0.95, rotate: 180 }}
          className={`w-11 h-11 min-w-[44px] min-h-[44px] rounded-full shadow-button flex items-center justify-center transition-all btn-press ${
            isDark
              ? "bg-white/20 hover:bg-white/30 text-white"
              : "bg-white hover:bg-blush-50 text-gray-500 hover:text-accent-pink"
          }`}
          aria-label="Shuffle deck"
          title="Mix the deck"
        >
          <Shuffle size={18} strokeWidth={2} />
        </motion.button>
      </div>

      {/* Secondary row */}
      {hasCard && onScreenshot && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center mt-3"
        >
          <button
            onClick={onScreenshot}
            className={`text-xs flex items-center gap-1 px-3 py-1.5 rounded-full transition-colors min-h-[44px] ${
              isDark
                ? "text-gray-300 hover:bg-white/10"
                : "text-blush-500 hover:bg-blush-50"
            }`}
          >
            <Camera size={14} strokeWidth={2} />
            Save as image
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};
