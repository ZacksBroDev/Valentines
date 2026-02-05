// ============================================================
// MOOD PICKER V2 - With icons instead of emojis
// ============================================================

import { motion } from "framer-motion";
import { Sparkles, Cloud, Smile, Zap, Flame } from "lucide-react";
import { MOODS, MoodKey } from "../config";

// Icon mapping for moods
const MOOD_ICONS = {
  all: Sparkles,
  soft: Cloud,
  funny: Smile,
  hype: Zap,
  flirty: Flame,
} as const;

interface MoodPickerV2Props {
  currentMood: MoodKey;
  onSelectMood: (mood: MoodKey) => void;
  showLabels?: boolean;
  size?: "sm" | "md" | "lg";
}

export const MoodPickerV2 = ({
  currentMood,
  onSelectMood,
  showLabels = true,
  size = "md",
}: MoodPickerV2Props) => {
  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  };

  const iconSizes = {
    sm: 12,
    md: 16,
    lg: 20,
  };

  return (
    <div className="flex items-center justify-center gap-2 flex-wrap">
      {(Object.entries(MOODS) as [MoodKey, (typeof MOODS)[MoodKey]][]).map(
        ([key, { label }]) => {
          const Icon = MOOD_ICONS[key];
          const isActive = currentMood === key;

          return (
            <motion.button
              key={key}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectMood(key)}
              className={`
                ${sizeClasses[size]}
                rounded-full font-medium transition-all
                flex items-center gap-1.5
                ${isActive
                  ? "bg-accent-pink text-white shadow-md"
                  : "bg-white/60 text-gray-600 hover:bg-white"
                }
              `}
            >
              <Icon 
                size={iconSizes[size]} 
                strokeWidth={isActive ? 2.5 : 2}
              />
              {showLabels && <span>{label}</span>}
            </motion.button>
          );
        }
      )}
    </div>
  );
};

export default MoodPickerV2;
