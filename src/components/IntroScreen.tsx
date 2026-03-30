// ============================================================
// INTRO SCREEN - First-run welcome experience for Caitlyn
// ============================================================

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, ArrowRight, Gift, Star, X } from "lucide-react";
import { CONFIG } from "../config";

interface IntroScreenProps {
  isOpen: boolean;
  onComplete: () => void;
}

const INTRO_STEPS = [
  {
    id: 1,
    icon: Heart,
    title: `Hi ${CONFIG.partnerName}! 💕`,
    content:
      "I made something special for you – a deck of compliments, love notes, and little surprises. Every single card was written with you in mind.",
    highlight: "This is yours.",
  },
  {
    id: 2,
    icon: Sparkles,
    title: "How it works",
    content:
      "Tap the draw button to reveal a new compliment. You can draw up to 3 times per day in daily mode, or freely browse whenever you want.",
    highlight: "Every draw is a little love note from me to you.",
  },
  {
    id: 3,
    icon: Gift,
    title: "Special surprises inside",
    content:
      "Some cards are vouchers you can redeem with me – like breakfast in bed or a movie night of your choice. Just tap to request!",
    highlight: "Yes, these are real. I promise to honor them. 💝",
  },
  {
    id: 4,
    icon: Star,
    title: "Secrets to discover",
    content:
      "There's a hidden deck of extra-special cards. Draw enough cards to unlock it, or find the secret way by tapping the heart mascot 5 times quickly!",
    highlight: "Shh... it's our little secret. 🤫",
  },
];

export const IntroScreen = ({ isOpen, onComplete }: IntroScreenProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const isLastStep = currentStep === INTRO_STEPS.length - 1;
  const step = INTRO_STEPS[currentStep];

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex flex-col h-[100dvh] overflow-y-auto"
          style={{
            background:
              "linear-gradient(135deg, #fff5f7 0%, #ffe8ed 50%, #ffd6e0 100%)",
          }}
        >
          {/* Top bar: progress dots + skip */}
          <div className="flex items-center justify-between px-4 pt-3 pb-2 sm:pt-4 sm:pb-3 shrink-0">
            <div className="w-8" /> {/* spacer */}
            <div className="flex gap-2">
              {INTRO_STEPS.map((_, idx) => (
                <motion.div
                  key={idx}
                  initial={{ scale: 0.8 }}
                  animate={{
                    scale: idx === currentStep ? 1.2 : 1,
                    backgroundColor:
                      idx === currentStep
                        ? "#ff4da6"
                        : idx < currentStep
                          ? "#ffa0c4"
                          : "#ffd6e0",
                  }}
                  className="w-2 h-2 rounded-full"
                />
              ))}
            </div>
            <button
              onClick={handleSkip}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Skip intro"
            >
              <X size={22} />
            </button>
          </div>

          {/* Content — grows to fill space, centers vertically */}
          <div className="flex-1 flex items-center justify-center min-h-0 px-4 sm:px-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="max-w-md w-full text-center"
              >
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                  className="w-14 h-14 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-5 rounded-full bg-white shadow-lg flex items-center justify-center"
                >
                  <step.icon
                    className="text-accent-pink w-7 h-7 sm:w-9 sm:h-9"
                    fill={step.icon === Heart ? "currentColor" : "none"}
                  />
                </motion.div>

                {/* Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-4"
                >
                  {step.title}
                </motion.h1>

                {/* Content */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-sm sm:text-base text-gray-600 mb-2 sm:mb-4 leading-relaxed"
                >
                  {step.content}
                </motion.p>

                {/* Highlight */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-sm sm:text-base text-accent-pink font-medium italic"
                >
                  {step.highlight}
                </motion.p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation — pinned to bottom */}
          <div className="flex justify-center gap-3 px-6 pb-6 pt-2 sm:pb-8 sm:pt-3 shrink-0">
            {currentStep > 0 && (
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-white/60 text-gray-600 font-medium hover:bg-white transition-colors"
              >
                Back
              </motion.button>
            )}

            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              onClick={handleNext}
              className="px-7 py-2.5 sm:px-8 sm:py-3 rounded-full bg-accent-pink text-white font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
            >
              {isLastStep ? (
                <>
                  Let's Go!
                  <Heart size={18} fill="currentColor" />
                </>
              ) : (
                <>
                  Next
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>
          </div>

          {/* Floating hearts decoration — hidden on very small screens */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 100 }}
              animate={{
                opacity: [0, 0.6, 0],
                y: [-20, -200],
                x: Math.sin(i) * 50,
              }}
              transition={{
                duration: 4,
                delay: i * 0.8,
                repeat: Infinity,
                repeatDelay: 2,
              }}
              className="absolute bottom-16 text-pink-300 hidden sm:block pointer-events-none"
              style={{ left: `${15 + i * 14}%` }}
            >
              <Heart size={16 + i * 2} fill="currentColor" />
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroScreen;
