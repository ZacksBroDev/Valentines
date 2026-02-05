import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Users, PartyPopper, Smile, type LucideIcon } from "lucide-react";
import { bigConfetti } from "../utils/confetti";
import { CONFIG, FINAL_THREE_CATEGORIES } from "../config";
import { Card } from "../types";

// Map icon names to Lucide components
const FINAL_THREE_ICONS: Record<string, LucideIcon> = {
  Users,
  PartyPopper,
  Smile,
};

interface EndScreenProps {
  isOpen: boolean;
  onRestart: () => void;
  onViewFavorites: () => void;
  onFinalThree: (category: keyof typeof FINAL_THREE_CATEGORIES) => Card[];
  playChime: () => void;
}

export const EndScreen = ({
  isOpen,
  onRestart,
  onViewFavorites,
  onFinalThree,
  playChime,
}: EndScreenProps) => {
  const [showFinalThree, setShowFinalThree] = useState(false);
  const [finalCards, setFinalCards] = useState<Card[]>([]);

  useEffect(() => {
    if (isOpen) {
      bigConfetti();
      playChime();
      setShowFinalThree(false);
      setFinalCards([]);
    }
  }, [isOpen, playChime]);

  const handleFinalThree = (category: keyof typeof FINAL_THREE_CATEGORIES) => {
    const cards = onFinalThree(category);
    setFinalCards(cards);
    setShowFinalThree(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-blush"
        >
          {/* Background hearts pattern */}
          <div className="absolute inset-0 hearts-pattern opacity-50" />

          {/* Floating hearts */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <motion.span
                key={i}
                className="absolute text-2xl"
                initial={{
                  opacity: 0,
                  x: `${10 + Math.random() * 80}%`,
                  y: "110%",
                }}
                animate={{
                  opacity: [0, 1, 0],
                  y: "-10%",
                  rotate: [0, 20, -20, 0],
                }}
                transition={{
                  duration: 4 + Math.random() * 3,
                  delay: i * 0.3,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              >
                {["💕", "💗", "💖", "💘", "✨"][i % 5]}
              </motion.span>
            ))}
          </div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.2, type: "spring", damping: 20 }}
            className="relative z-10 text-center px-8 max-w-md"
          >
            {!showFinalThree ? (
              <>
                {/* Big heart */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="text-8xl mb-6"
                >
                  💝
                </motion.div>

                {/* Main message */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-2xl md:text-3xl font-bold text-gray-800 mb-3 leading-tight"
                >
                  {CONFIG.endMessage}
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-gray-600 mb-2"
                >
                  {CONFIG.endSubtitle}
                </motion.p>

                {/* Signature */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.55 }}
                  className="text-accent-pink font-medium mb-8"
                >
                  — {CONFIG.signedBy}
                </motion.p>

                {/* Action buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-col gap-3"
                >
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={onRestart}
                      className="px-8 py-4 rounded-full bg-gradient-button text-white font-semibold shadow-button hover:shadow-card-hover transition-all btn-press flex items-center justify-center gap-2"
                    >
                      <span>🔄</span>
                      <span>Restart Deck</span>
                    </button>
                    <button
                      onClick={onViewFavorites}
                      className="px-8 py-4 rounded-full bg-white text-accent-pink font-semibold shadow-card hover:shadow-card-hover transition-all btn-press flex items-center justify-center gap-2"
                    >
                      <span>💝</span>
                      <span>View Favorites</span>
                    </button>
                  </div>

                  {/* Final 3 option */}
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-3">
                      Or draw a Final 3:
                    </p>
                    <div className="flex justify-center gap-2">
                      {(
                        Object.entries(FINAL_THREE_CATEGORIES) as [
                          keyof typeof FINAL_THREE_CATEGORIES,
                          (typeof FINAL_THREE_CATEGORIES)[keyof typeof FINAL_THREE_CATEGORIES],
                        ][]
                      ).map(([key, { label, icon }]) => {
                        const IconComponent = FINAL_THREE_ICONS[icon] || Smile;
                        return (
                          <button
                            key={key}
                            onClick={() => handleFinalThree(key)}
                            className="px-4 py-2 rounded-full bg-white/70 hover:bg-white text-sm font-medium text-gray-700 transition-colors flex items-center gap-1"
                          >
                            <IconComponent size={16} />
                            <span>{label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              </>
            ) : (
              <>
                {/* Final 3 Cards View */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4"
                >
                  <h2 className="text-xl font-bold text-gray-800 mb-4">
                    Your Final 3 💕
                  </h2>
                  {finalCards.map((card, i) => (
                    <motion.div
                      key={card.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.15 }}
                      className="bg-white rounded-2xl p-4 shadow-card text-left"
                    >
                      <p className="text-gray-700">
                        {card.type === "text" && `"${card.text}"`}
                        {card.type === "voucher" && card.title}
                        {card.type === "playlist" &&
                          `${card.songTitle} by ${card.artist}`}
                      </p>
                    </motion.div>
                  ))}
                  <button
                    onClick={() => setShowFinalThree(false)}
                    className="mt-4 px-6 py-2 rounded-full bg-white text-gray-600 text-sm hover:bg-gray-50 transition-colors"
                  >
                    ← Back
                  </button>
                </motion.div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
