import { motion } from "framer-motion";

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
      className="w-full max-w-md mx-auto px-4 safe-bottom"
    >
      {/* Daily mode blocked message */}
      {isDailyBlocked && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-center text-sm mb-3 ${isDark ? "text-gray-300" : "text-blush-600"}`}
        >
          Come back tomorrow 💗
        </motion.p>
      )}

      {/* Main action row */}
      <div className="flex items-center justify-center gap-3">
        {/* Open When button */}
        <motion.button
          onClick={onOpenWhen}
          whileTap={{ scale: 0.95 }}
          className={`w-12 h-12 rounded-full shadow-button flex items-center justify-center text-lg transition-all btn-press ${
            isDark ? "bg-white/20 hover:bg-white/30" : "bg-white hover:bg-blush-50"
          }`}
          aria-label="Open when..."
          title="Open when..."
        >
          📬
        </motion.button>

        {/* Save button */}
        <motion.button
          onClick={onSave}
          disabled={!hasCard}
          whileTap={{ scale: 0.95 }}
          className={`w-14 h-14 rounded-full shadow-button flex items-center justify-center text-xl transition-all btn-press ${
            hasCard
              ? isDark
                ? "bg-white/20 hover:bg-white/30"
                : "bg-white hover:bg-blush-50"
              : "bg-gray-100 opacity-50 cursor-not-allowed"
          }`}
          aria-label={isFavorite ? "Remove from favorites" : "Save to favorites"}
          title={isFavorite ? "Remove from favorites" : "Save to favorites"}
        >
          <motion.span
            key={isFavorite ? "saved" : "unsaved"}
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500 }}
          >
            {isFavorite ? "💖" : "🤍"}
          </motion.span>
        </motion.button>

        {/* Draw button - primary */}
        <motion.button
          onClick={onDraw}
          disabled={!canDraw}
          whileTap={canDraw ? { scale: 0.95 } : undefined}
          whileHover={canDraw ? { scale: 1.02 } : undefined}
          className={`h-16 px-10 rounded-full font-semibold text-lg shadow-button transition-all btn-press flex items-center gap-2 ${
            canDraw
              ? "bg-gradient-button text-white hover:shadow-card-hover"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
          aria-label="Draw a new compliment"
        >
          <span className="text-xl">💌</span>
          <span>Draw</span>
        </motion.button>

        {/* Share button */}
        <motion.button
          onClick={onShare}
          disabled={!hasCard}
          whileTap={{ scale: 0.95 }}
          className={`w-14 h-14 rounded-full shadow-button flex items-center justify-center text-xl transition-all btn-press ${
            hasCard
              ? isDark
                ? "bg-white/20 hover:bg-white/30"
                : "bg-white hover:bg-blush-50"
              : "bg-gray-100 opacity-50 cursor-not-allowed"
          }`}
          aria-label="Share this compliment"
          title="Share"
        >
          📤
        </motion.button>

        {/* Shuffle button */}
        <motion.button
          onClick={onShuffle}
          whileTap={{ scale: 0.95, rotate: 180 }}
          className={`w-12 h-12 rounded-full shadow-button flex items-center justify-center text-lg transition-all btn-press ${
            isDark ? "bg-white/20 hover:bg-white/30" : "bg-white hover:bg-blush-50"
          }`}
          aria-label="Shuffle deck"
          title="Mix the deck"
        >
          🔀
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
            className={`text-xs flex items-center gap-1 px-3 py-1.5 rounded-full transition-colors ${
              isDark ? "text-gray-300 hover:bg-white/10" : "text-blush-500 hover:bg-blush-50"
            }`}
          >
            📸 Save as image
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};
