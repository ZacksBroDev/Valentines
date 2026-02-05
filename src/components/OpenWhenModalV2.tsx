// ============================================================
// OPEN WHEN MODAL V2 - With icons instead of emojis
// Shows available card counts per mood
// ============================================================

import { motion } from "framer-motion";
import { Brain, Laugh, HelpCircle, Heart, Activity, X, Sparkles } from "lucide-react";
import { OPEN_WHEN_CATEGORIES, OpenWhenKey } from "../config";
import { Modal } from "./Modal";
import { getAvailableCards } from "../data/cards";
import { useMemo } from "react";

interface OpenWhenModalV2Props {
  isOpen: boolean;
  onClose: () => void;
  currentMode: OpenWhenKey | null;
  onSelectMode: (mode: OpenWhenKey | null) => void;
  secretUnlocked: boolean;
}

// Icon mapping for Open When categories
const OPEN_WHEN_ICONS = {
  stressed: Brain,
  laugh: Laugh,
  doubting: HelpCircle,
  lonely: Heart,
  overstimulated: Activity,
} as const;

interface CategoryCardProps {
  categoryKey: OpenWhenKey;
  label: string;
  description: string;
  isActive: boolean;
  cardCount: number;
  onClick: () => void;
}

const CategoryCard = ({
  categoryKey,
  label,
  description,
  isActive,
  cardCount,
  onClick,
}: CategoryCardProps) => {
  const Icon = OPEN_WHEN_ICONS[categoryKey];

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        w-full p-4 rounded-2xl text-left transition-all
        ${isActive
          ? "bg-accent-pink text-white shadow-lg"
          : "bg-blush-50 hover:bg-blush-100"
        }
      `}
    >
      <div className="flex items-center gap-3">
        <div className={`
          w-10 h-10 rounded-xl flex items-center justify-center
          ${isActive ? "bg-white/20" : "bg-white"}
        `}>
          <Icon
            size={22}
            className={isActive ? "text-white" : "text-accent-pink"}
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <p className="font-medium">{label}</p>
            <span className={`
              text-xs px-2 py-0.5 rounded-full
              ${isActive 
                ? "bg-white/20 text-white" 
                : "bg-blush-100 text-blush-600"
              }
            `}>
              {cardCount} cards
            </span>
          </div>
          <p className={`text-sm ${isActive ? "text-white/80" : "text-gray-500"}`}>
            {description}
          </p>
        </div>
      </div>
    </motion.button>
  );
};

export const OpenWhenModalV2 = ({
  isOpen,
  onClose,
  currentMode,
  onSelectMode,
  secretUnlocked,
}: OpenWhenModalV2Props) => {
  // Calculate card counts for each category
  const categoryCounts = useMemo(() => {
    const available = getAvailableCards(secretUnlocked);
    const counts: Record<string, number> = {};
    
    for (const [key, config] of Object.entries(OPEN_WHEN_CATEGORIES)) {
      const allowedCategories = config.categories as readonly string[];
      counts[key] = available.filter((card) => {
        const hasTag = card.tags?.includes(key);
        const hasCategory = allowedCategories.includes(card.category);
        return hasTag || hasCategory;
      }).length;
    }
    
    return counts;
  }, [secretUnlocked]);

  const handleSelect = (mode: OpenWhenKey) => {
    onSelectMode(mode);
    onClose();
  };

  const handleClear = () => {
    onSelectMode(null);
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Open When..." 
      icon={<Sparkles size={20} className="text-accent-pink" />}
    >
      <div className="space-y-3">
        <p className="text-gray-500 text-sm mb-4">
          Pick a feeling, and I'll find the perfect words for you.
        </p>

        {(Object.entries(OPEN_WHEN_CATEGORIES) as [OpenWhenKey, typeof OPEN_WHEN_CATEGORIES[OpenWhenKey]][]).map(
          ([key, { label, description }]) => (
            <CategoryCard
              key={key}
              categoryKey={key}
              label={label}
              description={description}
              isActive={currentMode === key}
              cardCount={categoryCounts[key] || 0}
              onClick={() => handleSelect(key)}
            />
          )
        )}

        {currentMode && (
          <button
            onClick={handleClear}
            className="w-full py-3 text-gray-500 text-sm hover:text-gray-700 transition-colors flex items-center justify-center gap-2"
          >
            <X size={14} />
            Clear filter & return to normal deck
          </button>
        )}
      </div>
    </Modal>
  );
};

export default OpenWhenModalV2;
