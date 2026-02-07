// ============================================================
// CARDS MANAGER - Admin CRUD for ALL deck cards
// No emojis - uses category icons instead
// Supports editing both built-in and custom cards
// ============================================================

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit3,
  Trash2,
  Search,
  Filter,
  Heart,
  Smile,
  Shield,
  Flame,
  Lock,
  Ticket,
  Music,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Save,
  X,
  Database,
  FolderPlus,
  Eye,
  EyeOff,
  RotateCcw,
} from "lucide-react";
import { Card, TextCard, CardCategory, VoucherCard, PlaylistCard } from "../../types";
import { RarityKey } from "../../config";
import { textCards, voucherCards, playlistCards, extraTextCards } from "../../data/cards";

// ============================================================
// STORAGE KEYS & HELPERS
// ============================================================

const CUSTOM_CARDS_KEY = "valentine-deck-custom-cards";
const HIDDEN_CARDS_KEY = "valentine-deck-hidden-cards";
const CARD_OVERRIDES_KEY = "valentine-deck-card-overrides";

// Overrides for built-in cards (only changed fields are stored)
interface CardOverride {
  category?: CardCategory;
  rarity?: RarityKey;
  intensity?: 1 | 2 | 3;
  text?: string;
  tags?: string[];
}

interface CardFormData {
  type: "text";
  category: CardCategory;
  rarity: RarityKey;
  intensity: 1 | 2 | 3;
  text: string;
  tags: string[];
}

type CardSource = "all" | "built-in" | "custom" | "modified";
type CardType = "all" | "text" | "voucher" | "playlist";

const CATEGORY_OPTIONS: { value: CardCategory; label: string; icon: typeof Heart }[] = [
  { value: "sweet", label: "Sweet", icon: Heart },
  { value: "funny", label: "Funny", icon: Smile },
  { value: "supportive", label: "Supportive", icon: Shield },
  { value: "spicy-lite", label: "Spicy", icon: Flame },
  { value: "secret", label: "Secret", icon: Lock },
];

const RARITY_OPTIONS: { value: RarityKey; label: string; color: string }[] = [
  { value: "common", label: "Common", color: "bg-gray-100 text-gray-600" },
  { value: "rare", label: "Rare", color: "bg-blue-100 text-blue-600" },
  { value: "legendary", label: "Legendary", color: "bg-yellow-100 text-yellow-600" },
];

// Get custom cards from localStorage
const getCustomCards = (): TextCard[] => {
  try {
    const stored = localStorage.getItem(CUSTOM_CARDS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Save custom cards to localStorage
const saveCustomCards = (cards: TextCard[]) => {
  localStorage.setItem(CUSTOM_CARDS_KEY, JSON.stringify(cards));
};

// Get hidden card IDs from localStorage
const getHiddenCardIds = (): string[] => {
  try {
    const stored = localStorage.getItem(HIDDEN_CARDS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Save hidden card IDs to localStorage
const saveHiddenCardIds = (ids: string[]) => {
  localStorage.setItem(HIDDEN_CARDS_KEY, JSON.stringify(ids));
};

// Get card overrides from localStorage
const getCardOverrides = (): Record<string, CardOverride> => {
  try {
    const stored = localStorage.getItem(CARD_OVERRIDES_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

// Save card overrides to localStorage
const saveCardOverrides = (overrides: Record<string, CardOverride>) => {
  localStorage.setItem(CARD_OVERRIDES_KEY, JSON.stringify(overrides));
};

// Generate unique ID
const generateId = () => `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const defaultFormData: CardFormData = {
  type: "text",
  category: "sweet",
  rarity: "common",
  intensity: 2,
  text: "",
  tags: [],
};

// ============================================================
// MAIN COMPONENT
// ============================================================

export const CardsManager = () => {
  // Built-in cards from cards.ts
  const builtInTextCards = useMemo(() => [...textCards, ...extraTextCards], []);
  const builtInVoucherCards = useMemo(() => voucherCards, []);
  const builtInPlaylistCards = useMemo(() => playlistCards, []);
  
  // Custom cards (user-added)
  const [customCards, setCustomCards] = useState<TextCard[]>(getCustomCards);
  
  // Hidden cards (built-in cards hidden from deck)
  const [hiddenCardIds, setHiddenCardIds] = useState<string[]>(getHiddenCardIds);
  
  // Card overrides (edits to built-in cards)
  const [cardOverrides, setCardOverrides] = useState<Record<string, CardOverride>>(getCardOverrides);
  
  // UI state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<CardCategory | "all">("all");
  const [filterSource, setFilterSource] = useState<CardSource>("all");
  const [filterType, setFilterType] = useState<CardType>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [showHiddenOnly, setShowHiddenOnly] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editingSource, setEditingSource] = useState<"built-in" | "custom" | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<CardFormData>(defaultFormData);

  // Save to localStorage whenever state changes
  useEffect(() => {
    saveCustomCards(customCards);
  }, [customCards]);
  
  useEffect(() => {
    saveHiddenCardIds(hiddenCardIds);
  }, [hiddenCardIds]);
  
  useEffect(() => {
    saveCardOverrides(cardOverrides);
  }, [cardOverrides]);

  // Apply overrides to a card
  const applyOverrides = (card: Card): Card => {
    const override = cardOverrides[card.id];
    if (!override) return card;
    
    if (card.type === "text") {
      return {
        ...card,
        category: override.category ?? card.category,
        rarity: override.rarity ?? card.rarity,
        intensity: override.intensity ?? (card as TextCard).intensity,
        text: override.text ?? (card as TextCard).text,
        tags: override.tags ?? card.tags,
      } as TextCard;
    }
    return card;
  };

  // Combine all cards with source indicator
  const allCardsWithSource = useMemo(() => {
    const cards: Array<{ card: Card; source: "built-in" | "custom"; cardType: "text" | "voucher" | "playlist"; isModified: boolean }> = [];
    
    // Built-in text cards (with overrides applied)
    builtInTextCards.forEach(card => {
      const isModified = !!cardOverrides[card.id];
      cards.push({ card: applyOverrides(card), source: "built-in", cardType: "text", isModified });
    });
    
    // Built-in voucher cards
    builtInVoucherCards.forEach(card => {
      cards.push({ card, source: "built-in", cardType: "voucher", isModified: false });
    });
    
    // Built-in playlist cards
    builtInPlaylistCards.forEach(card => {
      cards.push({ card, source: "built-in", cardType: "playlist", isModified: false });
    });
    
    // Custom cards
    customCards.forEach(card => {
      cards.push({ card, source: "custom", cardType: "text", isModified: false });
    });
    
    return cards;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [builtInTextCards, builtInVoucherCards, builtInPlaylistCards, customCards, cardOverrides]);

  // Filter cards
  const filteredCards = useMemo(() => {
    return allCardsWithSource.filter(({ card, source, cardType, isModified }) => {
      // Hidden filter
      const isHidden = hiddenCardIds.includes(card.id);
      if (showHiddenOnly && !isHidden) return false;
      if (!showHiddenOnly && isHidden) return false;
      
      // Source filter
      if (filterSource === "modified" && !isModified) return false;
      if (filterSource === "built-in" && source !== "built-in") return false;
      if (filterSource === "custom" && source !== "custom") return false;
      
      // Type filter
      if (filterType !== "all" && cardType !== filterType) return false;
      
      // Category filter
      if (filterCategory !== "all" && card.category !== filterCategory) return false;
      
      // Search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const textContent = card.type === "text" 
          ? (card as TextCard).text 
          : card.type === "voucher" 
            ? (card as VoucherCard).title
            : (card as PlaylistCard).songTitle + " - " + (card as PlaylistCard).artist;
        const matchesText = textContent.toLowerCase().includes(query);
        const matchesId = card.id.toLowerCase().includes(query);
        const matchesTags = card.tags?.some(t => t.toLowerCase().includes(query));
        if (!matchesText && !matchesId && !matchesTags) return false;
      }
      
      return true;
    });
  }, [allCardsWithSource, hiddenCardIds, showHiddenOnly, filterSource, filterType, filterCategory, searchQuery]);

  // Stats
  const stats = useMemo(() => ({
    total: allCardsWithSource.length,
    builtIn: allCardsWithSource.filter(c => c.source === "built-in").length,
    custom: customCards.length,
    hidden: hiddenCardIds.length,
    modified: Object.keys(cardOverrides).length,
    text: allCardsWithSource.filter(c => c.cardType === "text").length,
    voucher: allCardsWithSource.filter(c => c.cardType === "voucher").length,
    playlist: allCardsWithSource.filter(c => c.cardType === "playlist").length,
  }), [allCardsWithSource, customCards, hiddenCardIds, cardOverrides]);

  // Handlers
  const handleAddCard = () => {
    if (!formData.text.trim()) return;
    
    const newCard: TextCard = {
      id: generateId(),
      type: "text",
      category: formData.category,
      rarity: formData.rarity,
      intensity: formData.intensity,
      emoji: "", // Deprecated, kept for compatibility
      text: formData.text,
      tags: formData.tags,
    };
    
    setCustomCards(prev => [...prev, newCard]);
    setShowAddForm(false);
    resetForm();
  };

  const handleUpdateCard = (id: string) => {
    if (editingSource === "custom") {
      // Update custom card directly
      setCustomCards(prev => 
        prev.map(card => 
          card.id === id 
            ? { 
                ...card, 
                category: formData.category,
                rarity: formData.rarity,
                intensity: formData.intensity,
                text: formData.text,
                tags: formData.tags,
              }
            : card
        )
      );
    } else {
      // Store override for built-in card
      setCardOverrides(prev => ({
        ...prev,
        [id]: {
          category: formData.category,
          rarity: formData.rarity,
          intensity: formData.intensity,
          text: formData.text,
          tags: formData.tags,
        },
      }));
    }
    setIsEditing(null);
    setEditingSource(null);
    resetForm();
  };

  const handleResetToOriginal = (id: string) => {
    if (confirm("Reset this card to its original state? Your changes will be lost.")) {
      setCardOverrides(prev => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    }
  };

  const handleDeleteCard = (id: string) => {
    if (confirm("Delete this card? This action cannot be undone.")) {
      setCustomCards(prev => prev.filter(card => card.id !== id));
    }
  };

  const handleToggleHidden = (id: string) => {
    if (hiddenCardIds.includes(id)) {
      setHiddenCardIds(prev => prev.filter(hid => hid !== id));
    } else {
      setHiddenCardIds(prev => [...prev, id]);
    }
  };

  const startEditing = (card: TextCard, source: "built-in" | "custom") => {
    setIsEditing(card.id);
    setEditingSource(source);
    setFormData({
      type: "text",
      category: card.category,
      rarity: card.rarity,
      intensity: card.intensity,
      text: card.text,
      tags: card.tags || [],
    });
  };

  const resetForm = () => {
    setFormData(defaultFormData);
  };

  const cancelEdit = () => {
    setIsEditing(null);
    setEditingSource(null);
    setShowAddForm(false);
    resetForm();
  };

  const getCategoryIcon = (category: CardCategory) => {
    const found = CATEGORY_OPTIONS.find(c => c.value === category);
    return found?.icon || Heart;
  };

  const getCardDisplayText = (card: Card): string => {
    if (card.type === "text") return (card as TextCard).text;
    if (card.type === "voucher") return (card as VoucherCard).title;
    if (card.type === "playlist") return `${(card as PlaylistCard).songTitle} - ${(card as PlaylistCard).artist}`;
    return "";
  };

  const getCardIcon = (card: Card, category: CardCategory) => {
    if (card.type === "voucher") return Ticket;
    if (card.type === "playlist") return Music;
    return getCategoryIcon(category);
  };

  return (
    <div className="space-y-4">
      {/* Header with Stats */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-4 flex-wrap">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            All Cards ({stats.total})
          </h3>
          <div className="flex gap-2 text-xs flex-wrap">
            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full flex items-center gap-1">
              <Database size={10} />{stats.builtIn} built-in
            </span>
            <span className="px-2 py-0.5 bg-green-50 text-green-600 rounded-full flex items-center gap-1">
              <FolderPlus size={10} />{stats.custom} custom
            </span>
            {stats.modified > 0 && (
              <span className="px-2 py-0.5 bg-orange-50 text-orange-600 rounded-full flex items-center gap-1">
                <Edit3 size={10} />{stats.modified} modified
              </span>
            )}
            {stats.hidden > 0 && (
              <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full flex items-center gap-1">
                <EyeOff size={10} />{stats.hidden} hidden
              </span>
            )}
          </div>
        </div>
        <button
          onClick={() => {
            setShowAddForm(true);
            resetForm();
          }}
          className="px-3 py-1.5 bg-accent-pink text-white rounded-lg text-sm font-medium flex items-center gap-1"
          disabled={showAddForm || isEditing !== null}
        >
          <Plus size={14} /> Add Card
        </button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search cards by text, ID, or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3 py-2 rounded-lg text-sm flex items-center gap-1 ${
              showFilters ? "bg-accent-pink text-white" : "bg-gray-100 text-gray-600"
            }`}
          >
            <Filter size={14} />
            {showFilters ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {/* Filter Section */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3 pt-2"
            >
              {/* Source Filter */}
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Source</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: "all" as CardSource, label: "All", count: stats.total },
                    { value: "built-in" as CardSource, label: "Built-in", count: stats.builtIn },
                    { value: "custom" as CardSource, label: "Custom", count: stats.custom },
                    { value: "modified" as CardSource, label: "Modified", count: stats.modified },
                  ].map(({ value, label, count }) => (
                    <button
                      key={value}
                      onClick={() => setFilterSource(value)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        filterSource === value
                          ? "bg-accent-pink text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {label} ({count})
                    </button>
                  ))}
                </div>
              </div>

              {/* Type Filter */}
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Type</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: "all" as CardType, label: "All", icon: MessageSquare },
                    { value: "text" as CardType, label: "Text", icon: MessageSquare },
                    { value: "voucher" as CardType, label: "Voucher", icon: Ticket },
                    { value: "playlist" as CardType, label: "Playlist", icon: Music },
                  ].map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => setFilterType(value)}
                      className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 transition-colors ${
                        filterType === value
                          ? "bg-accent-pink text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      <Icon size={12} /> {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Category</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setFilterCategory("all")}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      filterCategory === "all"
                        ? "bg-accent-pink text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    All
                  </button>
                  {CATEGORY_OPTIONS.map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => setFilterCategory(value)}
                      className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 transition-colors ${
                        filterCategory === value
                          ? "bg-accent-pink text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      <Icon size={12} /> {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Show Hidden Toggle */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowHiddenOnly(!showHiddenOnly)}
                  className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 transition-colors ${
                    showHiddenOnly
                      ? "bg-gray-800 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {showHiddenOnly ? <EyeOff size={12} /> : <Eye size={12} />}
                  {showHiddenOnly ? "Showing Hidden" : "Show Hidden Cards"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Add/Edit Form */}
      <AnimatePresence>
        {(showAddForm || isEditing) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-blush-50 rounded-xl border-2 border-blush-200 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-800">
                {isEditing 
                  ? editingSource === "built-in" 
                    ? "Edit Built-in Card" 
                    : "Edit Custom Card" 
                  : "Add New Card"}
              </h4>
              <button onClick={cancelEdit} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            {editingSource === "built-in" && (
              <p className="text-xs text-orange-600 bg-orange-50 px-3 py-2 rounded-lg">
                Editing a built-in card creates an override. You can reset to original anytime.
              </p>
            )}

            {/* Category & Rarity Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as CardCategory })}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                >
                  {CATEGORY_OPTIONS.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Rarity</label>
                <select
                  value={formData.rarity}
                  onChange={(e) => setFormData({ ...formData, rarity: e.target.value as RarityKey })}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                >
                  {RARITY_OPTIONS.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Intensity */}
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Intensity (1-3)</label>
              <input
                type="number"
                min="1"
                max="3"
                value={formData.intensity}
                onChange={(e) => setFormData({ ...formData, intensity: Math.min(3, Math.max(1, parseInt(e.target.value) || 2)) as 1 | 2 | 3 })}
                className="w-24 px-3 py-2 border rounded-lg text-sm text-center"
              />
            </div>

            {/* Card Text */}
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Card Text</label>
              <textarea
                value={formData.text}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                placeholder="Write your compliment here... Use {pet} for random pet name"
                rows={3}
                className="w-full px-3 py-2 border rounded-lg text-sm resize-none"
              />
              <p className="text-xs text-gray-400 mt-1">
                Tip: Use {"{pet}"} to insert "babe", "baby", or name randomly
              </p>
            </div>

            {/* Tags */}
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Tags (comma separated)</label>
              <input
                type="text"
                value={formData.tags.join(", ")}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean) 
                })}
                placeholder="lonely, stressed, doubting"
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={cancelEdit}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => isEditing ? handleUpdateCard(isEditing) : handleAddCard()}
                disabled={!formData.text.trim()}
                className="flex-1 px-4 py-2 bg-accent-pink text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Save size={14} />
                {isEditing ? "Save Changes" : "Add Card"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cards List */}
      <div className="space-y-2 max-h-[50vh] overflow-y-auto">
        {filteredCards.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <MessageSquare size={48} className="mx-auto mb-2 opacity-50" />
            <p className="font-medium">
              {showHiddenOnly ? "No hidden cards" : "No cards match your filters"}
            </p>
            <p className="text-sm mt-1">
              {showHiddenOnly 
                ? "Hidden cards will appear here" 
                : "Try adjusting your search or filters"}
            </p>
          </div>
        ) : (
          filteredCards.map(({ card, source, cardType, isModified }) => {
            const CategoryIcon = getCardIcon(card, card.category);
            const rarityOption = RARITY_OPTIONS.find(r => r.value === card.rarity);
            const isExpanded = expandedCard === card.id;
            const isHidden = hiddenCardIds.includes(card.id);
            const isCustom = source === "custom";
            const isTextCard = cardType === "text";
            
            return (
              <motion.div
                key={card.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white rounded-xl border overflow-hidden ${
                  isHidden ? "border-gray-300 opacity-60" : isModified ? "border-orange-200" : "border-gray-100"
                }`}
              >
                {/* Card Header */}
                <div 
                  className="p-3 flex items-center gap-3 cursor-pointer hover:bg-gray-50"
                  onClick={() => setExpandedCard(isExpanded ? null : card.id)}
                >
                  <div className="w-10 h-10 rounded-lg bg-blush-50 flex items-center justify-center flex-shrink-0">
                    <CategoryIcon size={20} className="text-accent-pink" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 truncate">{getCardDisplayText(card)}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      {/* Source badge */}
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                        isCustom ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"
                      }`}>
                        {isCustom ? "custom" : "built-in"}
                      </span>
                      {/* Modified badge */}
                      {isModified && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-orange-100 text-orange-600">
                          modified
                        </span>
                      )}
                      {/* Type badge */}
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 text-purple-600">
                        {cardType}
                      </span>
                      {/* Category */}
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        {card.category}
                      </span>
                      {/* Rarity */}
                      <span className={`text-xs px-1.5 py-0.5 rounded ${rarityOption?.color}`}>
                        {card.rarity}
                      </span>
                      {/* Hidden indicator */}
                      {isHidden && (
                        <span className="text-xs text-gray-400 flex items-center gap-0.5">
                          <EyeOff size={10} /> hidden
                        </span>
                      )}
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>

                {/* Expanded Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-3 pb-3 border-t border-gray-100"
                    >
                      <div className="pt-3 space-y-2">
                        <p className="text-sm text-gray-600">{getCardDisplayText(card)}</p>
                        
                        {/* Tags */}
                        {card.tags && card.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {card.tags.map((tag, idx) => (
                              <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        {/* ID */}
                        <p className="text-xs text-gray-400 font-mono">{card.id}</p>
                        
                        {/* Actions */}
                        <div className="flex gap-2 pt-2 flex-wrap">
                          {/* Toggle visibility */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleHidden(card.id);
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 ${
                              isHidden 
                                ? "bg-green-100 text-green-600 hover:bg-green-200"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                          >
                            {isHidden ? <Eye size={12} /> : <EyeOff size={12} />}
                            {isHidden ? "Show" : "Hide"}
                          </button>
                          
                          {/* Edit (all text cards) */}
                          {isTextCard && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                startEditing(card as TextCard, source);
                              }}
                              className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium flex items-center gap-1 hover:bg-gray-200"
                            >
                              <Edit3 size={12} /> Edit
                            </button>
                          )}
                          
                          {/* Reset to original (modified built-in only) */}
                          {isModified && !isCustom && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleResetToOriginal(card.id);
                              }}
                              className="px-3 py-1.5 bg-orange-50 text-orange-600 rounded-lg text-xs font-medium flex items-center gap-1 hover:bg-orange-100"
                            >
                              <RotateCcw size={12} /> Reset
                            </button>
                          )}
                          
                          {/* Delete (custom only) */}
                          {isCustom && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteCard(card.id);
                              }}
                              className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-medium flex items-center gap-1 hover:bg-red-100"
                            >
                              <Trash2 size={12} /> Delete
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Footer Stats */}
      <div className="flex items-center justify-center gap-4 text-xs text-gray-400 pt-2 flex-wrap">
        <span>Showing: {filteredCards.length}</span>
        <span>•</span>
        <span>Text: {stats.text}</span>
        <span>•</span>
        <span>Voucher: {stats.voucher}</span>
        <span>•</span>
        <span>Playlist: {stats.playlist}</span>
      </div>
    </div>
  );
};

export default CardsManager;
