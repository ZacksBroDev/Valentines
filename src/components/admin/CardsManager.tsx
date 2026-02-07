// ============================================================
// CARDS MANAGER - Admin CRUD for deck cards
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
} from "lucide-react";
import { TextCard, CardCategory } from "../../types";
import { RarityKey } from "../../config";

// For demo, we'll work with localStorage for custom cards
// In production, this would sync to the cloud
const CUSTOM_CARDS_KEY = "valentine-deck-custom-cards";

interface CardFormData {
  type: "text";
  category: CardCategory;
  rarity: RarityKey;
  intensity: 1 | 2 | 3;
  emoji: string;
  text: string;
  tags: string[];
}

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

const TYPE_OPTIONS: { value: "text" | "voucher" | "playlist"; label: string; icon: typeof MessageSquare }[] = [
  { value: "text", label: "Text", icon: MessageSquare },
  { value: "voucher", label: "Voucher", icon: Ticket },
  { value: "playlist", label: "Playlist", icon: Music },
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

// Generate unique ID
const generateId = () => `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const defaultFormData: CardFormData = {
  type: "text",
  category: "sweet",
  rarity: "common",
  intensity: 2,
  emoji: "💕",
  text: "",
  tags: [],
};

export const CardsManager = () => {
  const [customCards, setCustomCards] = useState<TextCard[]>(getCustomCards);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<CardCategory | "all">("all");
  const [showFilters, setShowFilters] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<CardFormData>(defaultFormData);

  // Save to localStorage whenever cards change
  useEffect(() => {
    saveCustomCards(customCards);
  }, [customCards]);

  // Filter cards
  const filteredCards = useMemo(() => {
    return customCards.filter(card => {
      const matchesSearch = 
        card.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === "all" || card.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [customCards, searchQuery, filterCategory]);

  const handleAddCard = () => {
    if (!formData.text.trim()) return;
    
    const newCard: TextCard = {
      id: generateId(),
      type: "text",
      category: formData.category,
      rarity: formData.rarity,
      intensity: formData.intensity,
      emoji: formData.emoji,
      text: formData.text,
      tags: formData.tags,
    };
    
    setCustomCards(prev => [...prev, newCard]);
    setShowAddForm(false);
    resetForm();
  };

  const handleUpdateCard = (id: string) => {
    setCustomCards(prev => 
      prev.map(card => 
        card.id === id 
          ? { 
              ...card, 
              category: formData.category,
              rarity: formData.rarity,
              intensity: formData.intensity,
              emoji: formData.emoji,
              text: formData.text,
              tags: formData.tags,
            }
          : card
      )
    );
    setIsEditing(null);
    resetForm();
  };

  const handleDeleteCard = (id: string) => {
    if (confirm("Delete this card? This action cannot be undone.")) {
      setCustomCards(prev => prev.filter(card => card.id !== id));
    }
  };

  const startEditing = (card: TextCard) => {
    setIsEditing(card.id);
    setFormData({
      type: "text",
      category: card.category,
      rarity: card.rarity,
      intensity: card.intensity,
      emoji: card.emoji || "💕",
      text: card.text,
      tags: card.tags || [],
    });
  };

  const resetForm = () => {
    setFormData(defaultFormData);
  };

  const cancelEdit = () => {
    setIsEditing(null);
    setShowAddForm(false);
    resetForm();
  };

  const getCategoryIcon = (category: CardCategory) => {
    const found = CATEGORY_OPTIONS.find(c => c.value === category);
    return found?.icon || Heart;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
          Custom Cards ({customCards.length})
        </h3>
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
              placeholder="Search cards..."
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

        {/* Filter Pills */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap gap-2"
            >
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
                {isEditing ? "Edit Card" : "Add New Card"}
              </h4>
              <button onClick={cancelEdit} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            {/* Type Selection (for now, only text cards supported) */}
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Type</label>
              <div className="flex gap-2">
                {TYPE_OPTIONS.map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => {/* Only text supported for now */}}
                    disabled={value !== "text"}
                    className={`px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors ${
                      value === "text"
                        ? "bg-accent-pink text-white"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <Icon size={14} /> {label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-1">Voucher and Playlist cards coming soon</p>
            </div>

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

            {/* Emoji & Intensity */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Emoji</label>
                <input
                  type="text"
                  value={formData.emoji}
                  onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                  placeholder="💕"
                  className="w-full px-3 py-2 border rounded-lg text-sm text-center text-xl"
                  maxLength={4}
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Intensity (1-3)</label>
                <input
                  type="number"
                  min="1"
                  max="3"
                  value={formData.intensity}
                  onChange={(e) => setFormData({ ...formData, intensity: Math.min(3, Math.max(1, parseInt(e.target.value) || 2)) as 1 | 2 | 3 })}
                  className="w-full px-3 py-2 border rounded-lg text-sm text-center"
                />
              </div>
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
                Tip: Use {"{pet}"} to insert "babe", "baby", or "Caitlyn" randomly
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
                {isEditing ? "Update" : "Add Card"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cards List */}
      <div className="space-y-2 max-h-[40vh] overflow-y-auto">
        {filteredCards.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <MessageSquare size={48} className="mx-auto mb-2 opacity-50" />
            <p className="font-medium">No custom cards yet</p>
            <p className="text-sm mt-1">Add your first custom card above</p>
          </div>
        ) : (
          filteredCards.map((card) => {
            const CategoryIcon = getCategoryIcon(card.category);
            const rarityOption = RARITY_OPTIONS.find(r => r.value === card.rarity);
            const isExpanded = expandedCard === card.id;
            
            return (
              <motion.div
                key={card.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden"
              >
                {/* Card Header */}
                <div 
                  className="p-3 flex items-center gap-3 cursor-pointer hover:bg-gray-50"
                  onClick={() => setExpandedCard(isExpanded ? null : card.id)}
                >
                  <span className="text-2xl">{card.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 truncate">{card.text}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <CategoryIcon size={10} /> {card.category}
                      </span>
                      <span className={`text-xs px-1.5 py-0.5 rounded ${rarityOption?.color}`}>
                        {card.rarity}
                      </span>
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
                        <p className="text-sm text-gray-600">{card.text}</p>
                        {card.tags && card.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {card.tags.map((tag, idx) => (
                              <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              startEditing(card);
                            }}
                            className="flex-1 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium flex items-center justify-center gap-1 hover:bg-gray-200"
                          >
                            <Edit3 size={12} /> Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCard(card.id);
                            }}
                            className="flex-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-medium flex items-center justify-center gap-1 hover:bg-red-100"
                          >
                            <Trash2 size={12} /> Delete
                          </button>
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

      {/* Stats */}
      {customCards.length > 0 && (
        <div className="flex items-center justify-center gap-4 text-xs text-gray-400 pt-2">
          <span>Total: {customCards.length}</span>
          <span>•</span>
          <span>Filtered: {filteredCards.length}</span>
        </div>
      )}
    </div>
  );
};

export default CardsManager;
