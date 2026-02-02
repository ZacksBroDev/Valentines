import { motion, AnimatePresence } from "framer-motion";
import { compliments, Compliment } from "../data/compliments";
import { formatCategory } from "../utils/helpers";

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  favoriteIds: string[];
  onRemove: (id: string) => void;
}

export const FavoritesModal = ({
  isOpen,
  onClose,
  favoriteIds,
  onRemove,
}: FavoritesModalProps) => {
  const favoriteCompliments = favoriteIds
    .map((id) => compliments.find((c) => c.id === id))
    .filter(Boolean) as Compliment[];

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

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] bg-white rounded-t-3xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-blush-100 flex-shrink-0">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                💝 Favorites
                <span className="text-sm font-normal text-gray-400">
                  ({favoriteCompliments.length})
                </span>
              </h2>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full hover:bg-blush-50 flex items-center justify-center transition-colors"
                aria-label="Close favorites"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {favoriteCompliments.length === 0 ? (
                <div className="text-center py-12">
                  <span className="text-5xl mb-4 block">💔</span>
                  <p className="text-gray-500">No favorites yet!</p>
                  <p className="text-gray-400 text-sm mt-1">
                    Tap the heart to save compliments you love
                  </p>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {favoriteCompliments.map((compliment) => (
                    <motion.div
                      key={compliment.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9, x: -100 }}
                      className="bg-gradient-card rounded-2xl p-4 shadow-sm border border-blush-100"
                    >
                      <div className="flex items-start gap-3">
                        {/* Emoji */}
                        <span className="text-2xl flex-shrink-0">
                          {compliment.emoji || "💕"}
                        </span>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-700 leading-relaxed">
                            "{compliment.text}"
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-blush-500">
                              {formatCategory(compliment.category)}
                            </span>
                            <span className="text-blush-300">•</span>
                            <div className="flex gap-0.5">
                              {[1, 2, 3].map((level) => (
                                <span
                                  key={level}
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    level <= compliment.intensity
                                      ? "bg-accent-pink"
                                      : "bg-blush-200"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Remove button */}
                        <button
                          onClick={() => onRemove(compliment.id)}
                          className="flex-shrink-0 w-8 h-8 rounded-full hover:bg-blush-100 flex items-center justify-center text-gray-400 hover:text-red-400 transition-colors"
                          aria-label="Remove from favorites"
                        >
                          ✕
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Safe area padding for iOS */}
            <div className="h-safe-area-inset-bottom" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
