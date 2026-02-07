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
    content: "I made something special for you – a deck of compliments, love notes, and little surprises. Every single card was written with you in mind.",
    highlight: "This is yours.",
  },
  {
    id: 2,
    icon: Sparkles,
    title: "How it works",
    content: "Tap the draw button to reveal a new compliment. You can draw up to 3 times per day in daily mode, or freely browse whenever you want.",
    highlight: "Every draw is a little love note from me to you.",
  },
  {
    id: 3,
    icon: Gift,
    title: "Special surprises inside",
    content: "Some cards are vouchers you can redeem with me – like breakfast in bed or a movie night of your choice. Just tap to request!",
    highlight: "Yes, these are real. I promise to honor them. 💝",
  },
  {
    id: 4,
    icon: Star,
    title: "Secrets to discover",
    content: "There's a hidden deck of extra-special cards. Draw enough cards to unlock it, or find the secret way by tapping the heart mascot 5 times quickly!",
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
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #fff5f7 0%, #ffe8ed 50%, #ffd6e0 100%)",
          }}
        >
          {/* Skip button */}
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Skip intro"
          >
            <X size={24} />
          </button>

          {/* Progress dots */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2">
            {INTRO_STEPS.map((_, idx) => (
              <motion.div
                key={idx}
                initial={{ scale: 0.8 }}
                animate={{ 
                  scale: idx === currentStep ? 1.2 : 1,
                  backgroundColor: idx === currentStep ? "#ff4da6" : idx < currentStep ? "#ffa0c4" : "#ffd6e0"
                }}
                className="w-2 h-2 rounded-full"
              />
            ))}
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="max-w-md mx-auto px-6 text-center"
            >
              {/* Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-white shadow-lg flex items-center justify-center"
              >
                <step.icon size={36} className="text-accent-pink" fill={step.icon === Heart ? "currentColor" : "none"} />
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-gray-800 mb-4"
              >
                {step.title}
              </motion.h1>

              {/* Content */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-gray-600 mb-4 leading-relaxed"
              >
                {step.content}
              </motion.p>

              {/* Highlight */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-accent-pink font-medium italic"
              >
                {step.highlight}
              </motion.p>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4 px-6">
            {currentStep > 0 && (
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className="px-6 py-3 rounded-full bg-white/60 text-gray-600 font-medium hover:bg-white transition-colors"
              >
                Back
              </motion.button>
            )}
            
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              onClick={handleNext}
              className="px-8 py-3 rounded-full bg-accent-pink text-white font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
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

          {/* Floating hearts decoration */}
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
              className="absolute bottom-20 text-pink-300"
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
