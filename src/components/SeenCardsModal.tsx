// ============================================================
// SEEN CARDS MODAL
// Shows history of cards the user has already drawn
// Supports filtering by category and search
// ============================================================

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  History, 
  Search, 
  Filter, 
  X, 
  Eye,
  Heart,
  Smile,
  Sparkles,
  Flame,
  Lock,
  ChevronRight,
} from "lucide-react";
import { Modal } from "./Modal";
import { Card, CardCategory, isTextCard, isVoucherCard } from "../types";
import { getCardById } from "../data/cards";
import { CATEGORY_ICONS } from "./icons";

interface SeenCardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  seenIds: string[];
  onViewCard: (card: Card) => void;
  favorites: string[];
}

type CategoryFilter = "all" | CardCategory;

const CATEGORY_LABELS: Record<CardCategory, string> = {
  sweet: "Sweet",
  funny: "Funny",
  supportive: "Supportive",
  "spicy-lite": "Spicy",
  secret: "Secret",
};

const CATEGORY_FILTER_ICONS: Record<CategoryFilter, typeof Heart> = {
  all: Eye,
  sweet: Heart,
  funny: Smile,
  supportive: Sparkles,
  "spicy-lite": Flame,
  secret: Lock,
};

export const SeenCardsModal = ({ 
  isOpen, 
  onClose, 
  seenIds, 
  onViewCard,
  favorites,
}: SeenCardsModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [showFilters, setShowFilters] = useState(false);

  // Get all seen cards
  const seenCards = useMemo(() => {
    return seenIds
      .map(id => getCardById(id))
      .filter((card): card is Card => card !== null);
  }, [seenIds]);

  // Filter cards
  const filteredCards = useMemo(() => {
    let cards = seenCards;

    // Category filter
    if (categoryFilter !== "all") {
      cards = cards.filter(c => c.category === categoryFilter);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      cards = cards.filter(card => {
        if (isTextCard(card)) {
          return card.text.toLowerCase().includes(query);
        }
        if (isVoucherCard(card)) {
          return card.title.toLowerCase().includes(query);
        }
        return false;
      });
    }

    return cards;
  }, [seenCards, categoryFilter, searchQuery]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: seenCards.length };
    seenCards.forEach(card => {
      counts[card.category] = (counts[card.category] || 0) + 1;
    });
    return counts;
  }, [seenCards]);

  const handleCardClick = (card: Card) => {
    onViewCard(card);
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Seen Cards" 
      icon={<History size={20} className="text-accent-pink" />}
      fullHeight
    >
      <div className="flex flex-col h-full -mx-4">
        {/* Search and Filter Bar */}
        <div className="px-4 pb-3 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search cards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-accent-pink/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            
            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`
                p-2 rounded-xl transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center
                ${showFilters ? "bg-accent-pink text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}
              `}
            >
              <Filter size={18} />
            </button>
          </div>

          {/* Category Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap gap-2 pt-3">
                  {(["all", "sweet", "funny", "supportive", "spicy-lite", "secret"] as CategoryFilter[]).map(cat => {
                    const Icon = CATEGORY_FILTER_ICONS[cat];
                    const count = categoryCounts[cat] || 0;
                    const isActive = categoryFilter === cat;
                    
                    return (
                      <button
                        key={cat}
                        onClick={() => setCategoryFilter(cat)}
                        disabled={count === 0 && cat !== "all"}
                        className={`
                          px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5
                          transition-all min-h-[32px]
                          ${isActive 
                            ? "bg-accent-pink text-white" 
                            : count > 0
                              ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              : "bg-gray-50 text-gray-300 cursor-not-allowed"
                          }
                        `}
                      >
                        <Icon size={12} />
                        {cat === "all" ? "All" : CATEGORY_LABELS[cat as CardCategory]}
                        <span className={`
                          ml-1 px-1.5 py-0.5 rounded-full text-[10px]
                          ${isActive ? "bg-white/20" : "bg-gray-200"}
                        `}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Stats Bar */}
        <div className="px-4 py-2 bg-blush-50 text-sm text-gray-600 shrink-0">
          <span className="font-medium text-accent-pink">{seenCards.length}</span> cards seen
          {filteredCards.length !== seenCards.length && (
            <span> • Showing <span className="font-medium">{filteredCards.length}</span></span>
          )}
        </div>

        {/* Cards List */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
          {filteredCards.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <History size={48} className="mx-auto mb-2 opacity-50" />
              <p>
                {seenCards.length === 0 
                  ? "No cards seen yet. Start drawing!" 
                  : "No cards match your filters"
                }
              </p>
            </div>
          ) : (
            filteredCards.map((card, index) => {
              const CategoryIcon = CATEGORY_ICONS[card.category] || Heart;
              const isFavorite = favorites.includes(card.id);
              
              return (
                <motion.button
                  key={card.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  onClick={() => handleCardClick(card)}
                  className="w-full p-3 rounded-xl bg-white border border-gray-100 hover:border-accent-pink 
                    transition-all text-left flex items-start gap-3 group min-h-[44px]"
                >
                  {/* Category Icon */}
                  <div className="w-8 h-8 rounded-lg bg-blush-100 flex items-center justify-center shrink-0">
                    <CategoryIcon size={16} className="text-accent-pink" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 line-clamp-2">
                      {isTextCard(card) ? card.text : isVoucherCard(card) ? card.title : "Card"}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-gray-400 uppercase">
                        {CATEGORY_LABELS[card.category]}
                      </span>
                      <span className="text-[10px] text-gray-300">•</span>
                      <span className={`text-[10px] capitalize ${
                        card.rarity === "legendary" ? "text-yellow-500 font-medium" :
                        card.rarity === "rare" ? "text-purple-500 font-medium" :
                        "text-gray-400"
                      }`}>
                        {card.rarity}
                      </span>
                      {isFavorite && (
                        <>
                          <span className="text-[10px] text-gray-300">•</span>
                          <Heart size={10} className="text-red-400 fill-red-400" />
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* Arrow */}
                  <ChevronRight size={16} className="text-gray-300 group-hover:text-accent-pink transition-colors shrink-0" />
                </motion.button>
              );
            })
          )}
        </div>
      </div>
    </Modal>
  );
};

export default SeenCardsModal;
