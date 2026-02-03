import { motion, AnimatePresence } from "framer-motion";
import { Card, isTextCard, isVoucherCard, isPlaylistCard } from "../types";
import { allCards } from "../data/cards";
import { formatCategory } from "../utils/helpers";
import { Modal } from "./Modal";

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
  const favoriteCards = favoriteIds
    .map((id) => allCards.find((c) => c.id === id))
    .filter(Boolean) as Card[];

  const getCardDisplay = (card: Card): { text: string; emoji: string } => {
    if (isTextCard(card)) {
      return { text: card.text, emoji: card.emoji || "💕" };
    }
    if (isVoucherCard(card)) {
      return { text: card.title, emoji: card.emoji || "🎟️" };
    }
    if (isPlaylistCard(card)) {
      return { text: `${card.songTitle} by ${card.artist}`, emoji: card.emoji || "🎵" };
    }
    return { text: "", emoji: "💕" };
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Favorites" icon="💝">
      <p className="text-sm text-gray-400 mb-4">({favoriteCards.length} saved)</p>
      
      {favoriteCards.length === 0 ? (
        <div className="text-center py-12">
          <span className="text-5xl mb-4 block">💔</span>
          <p className="text-gray-500">No favorites yet!</p>
          <p className="text-gray-400 text-sm mt-1">
            Tap the heart to save compliments you love
          </p>
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          {favoriteCards.map((card) => {
            const { text, emoji } = getCardDisplay(card);
            return (
              <motion.div
                key={card.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, x: -100 }}
                className="bg-gradient-card rounded-2xl p-4 shadow-sm border border-blush-100 mb-3"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">{emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-700 leading-relaxed">"{text}"</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-blush-500">
                        {formatCategory(card.category)}
                      </span>
                      {isTextCard(card) && (
                        <>
                          <span className="text-blush-300">•</span>
                          <div className="flex gap-0.5">
                            {[1, 2, 3].map((level) => (
                              <span
                                key={level}
                                className={`w-1.5 h-1.5 rounded-full ${
                                  level <= card.intensity ? "bg-accent-pink" : "bg-blush-200"
                                }`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => onRemove(card.id)}
                    className="flex-shrink-0 w-8 h-8 rounded-full hover:bg-blush-100 flex items-center justify-center text-gray-400 hover:text-red-400 transition-colors"
                    aria-label="Remove from favorites"
                  >
                    ✕
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      )}
    </Modal>
  );
};
