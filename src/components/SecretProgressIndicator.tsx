// ============================================================
// SECRET PROGRESS INDICATOR
// Shows progress toward unlocking the secret deck
// ============================================================

import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock, Sparkles } from "lucide-react";
import { CONFIG } from "../config";

interface SecretProgressIndicatorProps {
  currentDraws: number;
  maxDraws?: number;
  isUnlocked: boolean;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  onUnlock?: () => void;
}

export const SecretProgressIndicator = ({
  currentDraws,
  maxDraws = CONFIG.secretUnlockDraws,
  isUnlocked,
  showLabel = true,
  size = "md",
  onUnlock,
}: SecretProgressIndicatorProps) => {
  const progress = Math.min((currentDraws / maxDraws) * 100, 100);
  const isAlmostThere = progress >= 80 && !isUnlocked;
  const justUnlocked = progress >= 100 && !isUnlocked;

  // Trigger unlock callback when progress reaches 100%
  if (justUnlocked && onUnlock) {
    onUnlock();
  }

  const sizeClasses = {
    sm: {
      container: "h-1.5",
      icon: 12,
      text: "text-[10px]",
    },
    md: {
      container: "h-2",
      icon: 14,
      text: "text-xs",
    },
    lg: {
      container: "h-3",
      icon: 16,
      text: "text-sm",
    },
  };

  const { container, icon, text } = sizeClasses[size];

  if (isUnlocked) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex items-center gap-2"
      >
        <div className="flex items-center gap-1 text-purple-500">
          <Unlock size={icon} />
          {showLabel && (
            <span className={`${text} font-medium`}>Secret deck unlocked!</span>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {/* Label */}
      {showLabel && (
        <div className="flex items-center justify-between">
          <span className={`${text} text-gray-500 flex items-center gap-1`}>
            <Lock size={icon - 2} />
            Secret progress
          </span>
          <span className={`${text} font-medium text-gray-600`}>
            {currentDraws} / {maxDraws}
          </span>
        </div>
      )}

      {/* Progress bar */}
      <div className={`${container} bg-gray-200 rounded-full overflow-hidden relative`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`h-full rounded-full ${
            isAlmostThere
              ? "bg-gradient-to-r from-purple-400 to-purple-600"
              : "bg-gradient-to-r from-purple-300 to-purple-500"
          }`}
        />

        {/* Shimmer effect when almost there */}
        <AnimatePresence>
          {isAlmostThere && (
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: "200%", opacity: 0.6 }}
              transition={{ 
                repeat: Infinity, 
                duration: 1.5, 
                ease: "linear",
                repeatDelay: 0.5
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
            />
          )}
        </AnimatePresence>
      </div>

      {/* Hint text */}
      {showLabel && (
        <span className={`${text} text-gray-400 text-center`}>
          {isAlmostThere ? (
            <span className="text-purple-500 flex items-center justify-center gap-1">
              <Sparkles size={icon - 2} /> Almost there!
            </span>
          ) : (
            `${maxDraws - currentDraws} more draws to unlock`
          )}
        </span>
      )}
    </div>
  );
};

// Compact version for header or inline use
export const SecretProgressBadge = ({
  currentDraws,
  maxDraws = CONFIG.secretUnlockDraws,
  isUnlocked,
}: Pick<SecretProgressIndicatorProps, "currentDraws" | "maxDraws" | "isUnlocked">) => {
  if (isUnlocked) {
    return (
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        className="flex items-center gap-1 px-2 py-1 bg-purple-100 rounded-full"
      >
        <Sparkles size={12} className="text-purple-500" />
        <span className="text-[10px] font-medium text-purple-600">Secret!</span>
      </motion.div>
    );
  }

  const progress = Math.min((currentDraws / maxDraws) * 100, 100);
  
  return (
    <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-100 rounded-full">
      <Lock size={10} className="text-gray-500" />
      <div className="w-8 h-1 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-full bg-purple-400 rounded-full"
        />
      </div>
      <span className="text-[10px] text-gray-500">{currentDraws}/{maxDraws}</span>
    </div>
  );
};

export default SecretProgressIndicator;
