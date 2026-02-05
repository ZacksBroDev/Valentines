// ============================================================
// CARD COUNTER - Shows "Card X of Y" with filter info
// ============================================================

import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { CATEGORY_ICONS, MOOD_ICONS } from "./icons";
import { MoodKey, OpenWhenKey } from "../config";
import { CardCategory } from "../types";

interface CardCounterProps {
  currentIndex: number;
  totalCards: number;
  seenCount?: number;
  
  // Current filters
  currentMood?: MoodKey;
  openWhenMode?: OpenWhenKey | null;
  currentCategory?: CardCategory;
  
  // No-repeat mode
  noRepeatEnabled?: boolean;
  onToggleNoRepeat?: () => void;
  
  // Secret deck
  secretUnlocked?: boolean;
}

export const CardCounter = ({
  currentIndex,
  totalCards,
  // seenCount available in props for future use
  currentMood,
  openWhenMode,
  currentCategory,
  noRepeatEnabled = false,
  onToggleNoRepeat,
  secretUnlocked,
}: CardCounterProps) => {
  // Get the appropriate icon for current filter
  const FilterIcon = currentMood && currentMood !== "all" 
    ? MOOD_ICONS[currentMood] 
    : currentCategory 
      ? CATEGORY_ICONS[currentCategory]
      : null;

  const filterLabel = openWhenMode
    ? `"Open When"`
    : currentMood && currentMood !== "all"
      ? currentMood.charAt(0).toUpperCase() + currentMood.slice(1)
      : null;

  return (
    <div className="flex items-center justify-center gap-2 text-center">
      {/* Main counter */}
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          initial={{ opacity: 0, y: -3 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 3 }}
          className="text-xs sm:text-sm font-medium text-gray-700"
        >
          Card {currentIndex > 0 ? currentIndex : "–"} of {totalCards}
        </motion.span>
      </AnimatePresence>
      
      {/* Secret indicator */}
      {secretUnlocked && (
        <span className="text-[9px] sm:text-[10px] px-1.5 py-0.5 bg-purple-100 text-purple-600 rounded-full">
          +secrets
        </span>
      )}

      {/* Filter badge */}
      {filterLabel && (
        <span className="flex items-center gap-0.5 text-[9px] sm:text-[10px] px-1.5 py-0.5 bg-blush-100 text-blush-600 rounded-full">
          {FilterIcon && <FilterIcon size={10} />}
          {filterLabel}
        </span>
      )}

      {/* No-repeat toggle */}
      {onToggleNoRepeat && (
        <button
          onClick={onToggleNoRepeat}
          className={`
            flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] transition-colors
            ${noRepeatEnabled 
              ? "bg-blush-100 text-blush-600" 
              : "bg-gray-100 text-gray-400 hover:bg-gray-200"
            }
          `}
          aria-pressed={noRepeatEnabled}
          title={noRepeatEnabled ? "Repeats off" : "Enable no-repeat"}
        >
          {noRepeatEnabled ? <EyeOff size={10} /> : <Eye size={10} />}
        </button>
      )}
    </div>
  );
};

export default CardCounter;
