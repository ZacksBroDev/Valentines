import { motion } from "framer-motion";

interface ActionBarProps {
  onDraw: () => void;
  onSave: () => void;
  onShare: () => void;
  isFavorite: boolean;
  hasCard: boolean;
}

export const ActionBar = ({
  onDraw,
  onSave,
  onShare,
  isFavorite,
  hasCard,
}: ActionBarProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="w-full max-w-md mx-auto px-4 safe-bottom"
    >
      <div className="flex items-center justify-center gap-3">
        {/* Save button */}
        <motion.button
          onClick={onSave}
          disabled={!hasCard}
          whileTap={{ scale: 0.95 }}
          className={`w-14 h-14 rounded-full shadow-button flex items-center justify-center text-xl transition-all btn-press ${
            hasCard
              ? "bg-white hover:bg-blush-50"
              : "bg-gray-100 opacity-50 cursor-not-allowed"
          }`}
          aria-label={
            isFavorite ? "Remove from favorites" : "Save to favorites"
          }
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
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.02 }}
          className="h-16 px-10 rounded-full bg-gradient-button text-white font-semibold text-lg shadow-button hover:shadow-card-hover transition-all btn-press flex items-center gap-2"
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
              ? "bg-white hover:bg-blush-50"
              : "bg-gray-100 opacity-50 cursor-not-allowed"
          }`}
          aria-label="Share this compliment"
          title="Share this compliment"
        >
          📤
        </motion.button>
      </div>

      {/* Draw count indicator */}
      {hasCard && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-xs text-blush-400 mt-3"
        >
          Tap the heart to save your favorites
        </motion.p>
      )}
    </motion.div>
  );
};
