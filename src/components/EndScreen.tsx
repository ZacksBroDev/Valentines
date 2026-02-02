import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { bigConfetti } from "../utils/confetti";

interface EndScreenProps {
  isOpen: boolean;
  onRestart: () => void;
  onViewFavorites: () => void;
  playChime: () => void;
}

// ============================================================
// CUSTOMIZATION: Edit this message for your partner!
// ============================================================
const END_MESSAGE = "That's the whole deck—still true every time.";
const SUBTITLE = "Every compliment was written with you in mind 💕";

export const EndScreen = ({
  isOpen,
  onRestart,
  onViewFavorites,
  playChime,
}: EndScreenProps) => {
  useEffect(() => {
    if (isOpen) {
      // Trigger big confetti
      bigConfetti();
      // Play chime sound (respects mute)
      playChime();
    }
  }, [isOpen, playChime]);

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

          {/* Floating hearts animation */}
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
              {END_MESSAGE}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-gray-600 mb-8"
            >
              {SUBTITLE}
            </motion.p>

            {/* Action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-3 justify-center"
            >
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
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
