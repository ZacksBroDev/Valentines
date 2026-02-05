// ============================================================
// DECK SELECTOR - Segmented control for filtering cards
// ============================================================

import { motion } from "framer-motion";
import { Sparkles, Mail } from "lucide-react";
import { MOOD_ICONS } from "./icons";
import { MoodKey } from "../config";

type DeckMode = "all" | "mood" | "openWhen";

interface DeckSelectorProps {
  activeMode: DeckMode;
  currentMood: MoodKey;
  hasOpenWhenFilter: boolean;
  onModeChange: (mode: DeckMode) => void;
  onMoodClick: () => void;
  onOpenWhenClick: () => void;
}

export const DeckSelector = ({
  activeMode,
  currentMood,
  hasOpenWhenFilter,
  onModeChange,
  onMoodClick,
  onOpenWhenClick,
}: DeckSelectorProps) => {
  const MoodIcon = MOOD_ICONS[currentMood] || Sparkles;
  
  const segments = [
    {
      key: "all" as DeckMode,
      label: "All",
      icon: Sparkles,
      onClick: () => onModeChange("all"),
    },
    {
      key: "mood" as DeckMode,
      label: currentMood === "all" ? "Mood" : currentMood.charAt(0).toUpperCase() + currentMood.slice(1),
      icon: MoodIcon,
      onClick: onMoodClick,
    },
    {
      key: "openWhen" as DeckMode,
      label: hasOpenWhenFilter ? "Filtered" : "Open",
      icon: Mail,
      onClick: onOpenWhenClick,
    },
  ];

  return (
    <div className="w-full max-w-xs mx-auto px-4 py-1">
      {/* Segmented Control */}
      <div className="relative bg-white/50 backdrop-blur-sm rounded-xl p-1 flex">
        {/* Active indicator */}
        <motion.div
          className="absolute top-1 bottom-1 bg-white rounded-lg shadow-sm"
          initial={false}
          animate={{
            left: `${(segments.findIndex(s => s.key === activeMode) / segments.length) * 100}%`,
            width: `${100 / segments.length}%`,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          style={{ marginLeft: 4, marginRight: 4, width: `calc(${100 / segments.length}% - 8px)` }}
        />
        
        {segments.map((segment) => {
          const Icon = segment.icon;
          const isActive = activeMode === segment.key;
          
          return (
            <button
              key={segment.key}
              onClick={segment.onClick}
              className={`
                relative flex-1 flex items-center justify-center gap-1.5
                py-2 px-3 rounded-lg
                text-xs font-medium
                transition-colors duration-200
                z-10
                ${isActive ? "text-accent-pink" : "text-gray-500 hover:text-gray-700"}
              `}
              aria-pressed={isActive}
            >
              <Icon size={14} strokeWidth={isActive ? 2.5 : 2} />
              <span className="hidden xs:inline">{segment.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DeckSelector;
