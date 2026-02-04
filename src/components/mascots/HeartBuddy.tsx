import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import { useHaptic } from "../../hooks/useHaptic";

interface HeartBuddyProps {
  onTap: () => void;
  onLongPress?: () => void;
  isBlusing?: boolean;
  showFloatingHeart?: boolean;
}

export const HeartBuddy = ({
  onTap,
  onLongPress,
  isBlusing,
  showFloatingHeart,
}: HeartBuddyProps) => {
  const [isBlinking, setIsBlinking] = useState(false);
  const [isSqueezed, setIsSqueezed] = useState(false);
  const [showHeartPop, setShowHeartPop] = useState(false);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLongPress = useRef(false);
  const { vibrate } = useHaptic();

  // Blink animation
  useEffect(() => {
    const interval = setInterval(
      () => {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 150);
      },
      4000 + Math.random() * 2000,
    );
    return () => clearInterval(interval);
  }, []);

  const handlePressStart = useCallback(() => {
    isLongPress.current = false;
    longPressTimer.current = setTimeout(() => {
      isLongPress.current = true;
      setIsSqueezed(true);
      setShowHeartPop(true);
      vibrate("medium");
      onLongPress?.();

      setTimeout(() => {
        setIsSqueezed(false);
        setShowHeartPop(false);
      }, 600);
    }, 450);
  }, [onLongPress, vibrate]);

  const handlePressEnd = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }

    if (!isLongPress.current) {
      onTap();
    }
  }, [onTap]);

  return (
    <div className="relative inline-block">
      {/* Floating heart on save */}
      <AnimatePresence>
        {showFloatingHeart && (
          <motion.span
            initial={{ opacity: 1, y: 0, scale: 1 }}
            animate={{ opacity: 0, y: -40, scale: 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute -top-2 left-1/2 -translate-x-1/2 text-2xl pointer-events-none z-10"
          >
            💗
          </motion.span>
        )}
      </AnimatePresence>

      {/* Heart pop on long press */}
      <AnimatePresence>
        {showHeartPop && (
          <motion.span
            initial={{ opacity: 1, scale: 0 }}
            animate={{ opacity: 0, scale: 1.5, y: -30 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute -top-2 left-1/2 -translate-x-1/2 text-xl pointer-events-none z-10"
          >
            💖
          </motion.span>
        )}
      </AnimatePresence>

      <motion.svg
        viewBox="0 0 100 90"
        className="w-20 h-20 cursor-pointer select-none"
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onMouseLeave={() => {
          if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
          }
        }}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
        animate={{
          y: isSqueezed ? [0, 0] : [0, -6, 0],
          scale: isSqueezed ? 0.9 : 1,
        }}
        transition={
          isSqueezed
            ? { duration: 0.15 }
            : { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
        }
        role="button"
        aria-label="HeartBuddy mascot - tap or hold me!"
      >
        {/* Heart body with gradient */}
        <defs>
          <linearGradient
            id="heartGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#ff5588" />
            <stop offset="100%" stopColor="#e6006e" />
          </linearGradient>
          <filter id="heartShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="0"
              dy="3"
              stdDeviation="3"
              floodColor="#cc0055"
              floodOpacity="0.4"
            />
          </filter>
        </defs>

        {/* Main heart shape */}
        <motion.path
          d="M50 85 C15 55 5 35 5 25 C5 10 20 5 35 5 C42 5 48 10 50 15 C52 10 58 5 65 5 C80 5 95 10 95 25 C95 35 85 55 50 85"
          fill="url(#heartGradient)"
          filter="url(#heartShadow)"
          stroke="#cc0055"
          strokeWidth="1.5"
          animate={{
            scale: isBlusing ? [1, 1.05, 1] : 1,
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Left blush cheek */}
        <motion.ellipse
          cx="30"
          cy="45"
          rx="10"
          ry="6"
          fill="#ff9ec4"
          opacity={isBlusing ? 0.9 : 0.4}
          animate={{
            opacity: isBlusing ? [0.4, 0.9, 0.6] : 0.4,
            scale: isBlusing ? [1, 1.15, 1] : 1,
          }}
          transition={{ duration: 0.5 }}
        />

        {/* Right blush cheek */}
        <motion.ellipse
          cx="70"
          cy="45"
          rx="10"
          ry="6"
          fill="#ff9ec4"
          opacity={isBlusing ? 0.9 : 0.4}
          animate={{
            opacity: isBlusing ? [0.4, 0.9, 0.6] : 0.4,
            scale: isBlusing ? [1, 1.15, 1] : 1,
          }}
          transition={{ duration: 0.5 }}
        />

        {/* Left eye */}
        <motion.ellipse
          cx="38"
          cy="35"
          rx="5"
          ry={isBlinking ? 1 : 6}
          fill="#333"
          transition={{ duration: 0.1 }}
        />
        {/* Left eye highlight */}
        <circle
          cx="36"
          cy="33"
          r="2"
          fill="white"
          opacity={isBlinking ? 0 : 1}
        />

        {/* Right eye */}
        <motion.ellipse
          cx="62"
          cy="35"
          rx="5"
          ry={isBlinking ? 1 : 6}
          fill="#333"
          transition={{ duration: 0.1 }}
        />
        {/* Right eye highlight */}
        <circle
          cx="60"
          cy="33"
          r="2"
          fill="white"
          opacity={isBlinking ? 0 : 1}
        />

        {/* Smile */}
        <path
          d="M42 52 Q50 62 58 52"
          fill="none"
          stroke="#333"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </motion.svg>
    </div>
  );
};
