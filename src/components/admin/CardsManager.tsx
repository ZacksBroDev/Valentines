// ============================================================
// CARDS MANAGER - Admin CRUD for deck cards via GraphQL
// All cards live in DynamoDB, managed through AppSync
// ============================================================

import { useState, useEffect, useMemo, useCallback } from "react";
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
  RefreshCw,
  Loader2,
} from "lucide-react";
import { generateClient } from "aws-amplify/api";
import { CardCategory } from "../../types";
import { CONFIG, RarityKey } from "../../config";

// ============================================================
// GRAPHQL OPERATIONS
// ============================================================

const listCardsQuery = /* GraphQL */ `
  query ListCards($limit: Int, $nextToken: String) {
    listCards(limit: $limit, nextToken: $nextToken) {
      items {
        id
        type
        text
        emoji
        category
        subCategory
        rarity
        intensity
        tags
        title
        options
        songTitle
        artist
        link
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

const createCardMutation = /* GraphQL */ `
  mutation CreateCard($input: CreateCardInput!) {
    createCard(input: $input) {
      id
      type
      text
      emoji
      category
      subCategory
      rarity
      intensity
      tags
      title
      options
      songTitle
      artist
      link
    }
  }
`;

const updateCardMutation = /* GraphQL */ `
  mutation UpdateCard($input: UpdateCardInput!) {
    updateCard(input: $input) {
      id
      type
      text
      emoji
      category
      subCategory
      rarity
      intensity
      tags
      title
      options
      songTitle
      artist
      link
    }
  }
`;

const deleteCardMutation = /* GraphQL */ `
  mutation DeleteCard($input: DeleteCardInput!) {
    deleteCard(input: $input) {
      id
    }
  }
`;

// ============================================================
// TYPES
// ============================================================

interface CardFormData {
  type: "text" | "voucher" | "playlist";
  category: CardCategory;
  rarity: RarityKey;
  intensity: 1 | 2 | 3;
  text: string;
  emoji: string;
  tags: string[];
  title: string;
  options: string[];
  songTitle: string;
  artist: string;
  link: string;
}

type CardType = "all" | "text" | "voucher" | "playlist";

interface DbCard {
  id: string;
  type: string;
  text: string;
  emoji: string | null;
  category: string;
  subCategory: string | null;
  rarity: string | null;
  intensity: number | null;
  tags: string[] | null;
  title: string | null;
  options: string[] | null;
  songTitle: string | null;
  artist: string | null;
  link: string | null;
  createdAt: string;
  updatedAt: string;
}

const CATEGORY_OPTIONS: {
  value: CardCategory;
  label: string;
  icon: typeof Heart;
}[] = [
  { value: "sweet", label: "Sweet", icon: Heart },
  { value: "funny", label: "Funny", icon: Smile },
  { value: "supportive", label: "Supportive", icon: Shield },
  { value: "spicy-lite", label: "Spicy", icon: Flame },
  { value: "secret", label: "Secret", icon: Lock },
];

const RARITY_OPTIONS: { value: RarityKey; label: string; color: string }[] = [
  { value: "common", label: "Common", color: "bg-gray-100 text-gray-600" },
  { value: "rare", label: "Rare", color: "bg-blue-100 text-blue-600" },
  {
    value: "legendary",
    label: "Legendary",
    color: "bg-yellow-100 text-yellow-600",
  },
];

const defaultFormData: CardFormData = {
  type: "text",
  category: "sweet",
  rarity: "common",
  intensity: 2,
  text: "",
  emoji: "",
  tags: [],
  title: "",
  options: [],
  songTitle: "",
  artist: "",
  link: "",
};

const generateId = () =>
  `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// ============================================================
// MAIN COMPONENT
// ============================================================

export const CardsManager = () => {
  const [cards, setCards] = useState<DbCard[]>([]);
  const [isLoadingCards, setIsLoadingCards] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // UI state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<CardCategory | "all">(
    "all",
  );
  const [filterType, setFilterType] = useState<CardType>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [formData, setFormData] = useState<CardFormData>(defaultFormData);

  // Fetch all cards from DynamoDB
  const fetchCards = useCallback(async () => {
    setIsLoadingCards(true);
    try {
      const client = generateClient();
      const allItems: DbCard[] = [];
      let nextToken: string | null = null;

      do {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response: any = await client.graphql({
          query: listCardsQuery,
          variables: { limit: CONFIG.graphqlPageLimit, nextToken },
          authMode: "userPool",
        });
        const items = response.data?.listCards?.items ?? [];
        allItems.push(...items);
        nextToken = response.data?.listCards?.nextToken ?? null;
      } while (nextToken);

      setCards(allItems.sort((a, b) => a.id.localeCompare(b.id)));
    } catch (err) {
      console.error("[CardsManager] Failed to fetch cards:", err);
    } finally {
      setIsLoadingCards(false);
    }
  }, []);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  // Filter cards
  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      if (filterType !== "all" && card.type !== filterType) return false;
      if (filterCategory !== "all" && card.category !== filterCategory)
        return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const text = (
          card.text ||
          card.title ||
          `${card.songTitle} ${card.artist}`
        ).toLowerCase();
        if (
          !text.includes(q) &&
          !card.id.toLowerCase().includes(q) &&
          !card.tags?.some((t) => t.toLowerCase().includes(q))
        )
          return false;
      }
      return true;
    });
  }, [cards, filterType, filterCategory, searchQuery]);

  // Stats
  const stats = useMemo(
    () => ({
      total: cards.length,
      text: cards.filter((c) => c.type === "text").length,
      voucher: cards.filter((c) => c.type === "voucher").length,
      playlist: cards.filter((c) => c.type === "playlist").length,
    }),
    [cards],
  );

  // CRUD Handlers
  const handleAddCard = async () => {
    if (formData.type === "text" && !formData.text.trim()) return;
    if (formData.type === "voucher" && !formData.title.trim()) return;
    if (formData.type === "playlist" && !formData.songTitle.trim()) return;

    setIsSaving(true);
    try {
      const client = generateClient();
      const input: Record<string, unknown> = {
        id: generateId(),
        type: formData.type,
        text: formData.text || "",
        emoji: formData.emoji || null,
        category: formData.category,
        rarity: formData.rarity,
        intensity: formData.intensity,
        tags: formData.tags.length > 0 ? formData.tags : null,
      };
      if (formData.type === "voucher") {
        input.title = formData.title;
        input.options = formData.options;
      }
      if (formData.type === "playlist") {
        input.songTitle = formData.songTitle;
        input.artist = formData.artist;
        input.link = formData.link;
      }

      await client.graphql({
        query: createCardMutation,
        variables: { input },
        authMode: "userPool",
      });
      await fetchCards();
      setShowAddForm(false);
      resetForm();
    } catch (err) {
      console.error("[CardsManager] Create failed:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateCard = async (id: string) => {
    setIsSaving(true);
    try {
      const client = generateClient();
      const input: Record<string, unknown> = {
        id,
        type: formData.type,
        text: formData.text,
        emoji: formData.emoji || null,
        category: formData.category,
        rarity: formData.rarity,
        intensity: formData.intensity,
        tags: formData.tags.length > 0 ? formData.tags : null,
      };
      if (formData.type === "voucher") {
        input.title = formData.title;
        input.options = formData.options;
      }
      if (formData.type === "playlist") {
        input.songTitle = formData.songTitle;
        input.artist = formData.artist;
        input.link = formData.link;
      }

      await client.graphql({
        query: updateCardMutation,
        variables: { input },
        authMode: "userPool",
      });
      await fetchCards();
      setIsEditing(null);
      resetForm();
    } catch (err) {
      console.error("[CardsManager] Update failed:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCard = async (id: string) => {
    if (!confirm("Delete this card permanently? This cannot be undone."))
      return;
    setIsSaving(true);
    try {
      const client = generateClient();
      await client.graphql({
        query: deleteCardMutation,
        variables: { input: { id } },
        authMode: "userPool",
      });
      await fetchCards();
    } catch (err) {
      console.error("[CardsManager] Delete failed:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const startEditing = (card: DbCard) => {
    setIsEditing(card.id);
    setFormData({
      type: (card.type as CardFormData["type"]) || "text",
      category: card.category as CardCategory,
      rarity: (card.rarity as RarityKey) || "common",
      intensity: (card.intensity as 1 | 2 | 3) || 2,
      text: card.text || "",
      emoji: card.emoji || "",
      tags: card.tags || [],
      title: card.title || "",
      options: card.options || [],
      songTitle: card.songTitle || "",
      artist: card.artist || "",
      link: card.link || "",
    });
  };

  const resetForm = () => setFormData(defaultFormData);
  const cancelEdit = () => {
    setIsEditing(null);
    setShowAddForm(false);
    resetForm();
  };

  const getCategoryIcon = (category: string) => {
    const found = CATEGORY_OPTIONS.find((c) => c.value === category);
    return found?.icon || Heart;
  };

  const getCardDisplayText = (card: DbCard): string => {
    if (card.type === "voucher") return card.title || "(untitled voucher)";
    if (card.type === "playlist")
      return `${card.songTitle || ""} - ${card.artist || ""}`;
    return card.text || "(empty)";
  };

  const getCardIcon = (card: DbCard) => {
    if (card.type === "voucher") return Ticket;
    if (card.type === "playlist") return Music;
    return getCategoryIcon(card.category);
  };

  if (isLoadingCards) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-400">
        <Loader2 size={24} className="animate-spin mr-2" />
        Loading cards from database...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-4 flex-wrap">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Cards ({stats.total})
          </h3>
          <div className="flex gap-2 text-xs flex-wrap">
            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full">
              {stats.text} text
            </span>
            <span className="px-2 py-0.5 bg-purple-50 text-purple-600 rounded-full">
              {stats.voucher} voucher
            </span>
            <span className="px-2 py-0.5 bg-green-50 text-green-600 rounded-full">
              {stats.playlist} playlist
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchCards}
            className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium flex items-center gap-1 hover:bg-gray-200"
            disabled={isSaving}
          >
            <RefreshCw size={14} /> Refresh
          </button>
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
      </div>

      {/* Search and Filters */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
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
            className={`px-3 py-2 rounded-lg text-sm flex items-center gap-1 ${showFilters ? "bg-accent-pink text-white" : "bg-gray-100 text-gray-600"}`}
          >
            <Filter size={14} />
            {showFilters ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3 pt-2"
            >
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Type</label>
                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      ["all", "All", MessageSquare],
                      ["text", "Text", MessageSquare],
                      ["voucher", "Voucher", Ticket],
                      ["playlist", "Playlist", Music],
                    ] as const
                  ).map(([value, label, Icon]) => (
                    <button
                      key={value}
                      onClick={() => setFilterType(value as CardType)}
                      className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 transition-colors ${filterType === value ? "bg-accent-pink text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                    >
                      <Icon size={12} /> {label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setFilterCategory("all")}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${filterCategory === "all" ? "bg-accent-pink text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                  >
                    All
                  </button>
                  {CATEGORY_OPTIONS.map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => setFilterCategory(value)}
                      className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 transition-colors ${filterCategory === value ? "bg-accent-pink text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                    >
                      <Icon size={12} /> {label}
                    </button>
                  ))}
                </div>
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
                {isEditing ? "Edit Card" : "Add New Card"}
              </h4>
              <button
                onClick={cancelEdit}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            {/* Type selector (add only) */}
            {showAddForm && (
              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Card Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      type: e.target.value as CardFormData["type"],
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                >
                  <option value="text">Text</option>
                  <option value="voucher">Voucher</option>
                  <option value="playlist">Playlist</option>
                </select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value as CardCategory,
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                >
                  {CATEGORY_OPTIONS.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Rarity
                </label>
                <select
                  value={formData.rarity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      rarity: e.target.value as RarityKey,
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                >
                  {RARITY_OPTIONS.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {formData.type === "text" && (
              <>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">
                    Intensity (1-3)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="3"
                    value={formData.intensity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        intensity: Math.min(
                          3,
                          Math.max(1, parseInt(e.target.value) || 2),
                        ) as 1 | 2 | 3,
                      })
                    }
                    className="w-24 px-3 py-2 border rounded-lg text-sm text-center"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">
                    Card Text
                  </label>
                  <textarea
                    value={formData.text}
                    onChange={(e) =>
                      setFormData({ ...formData, text: e.target.value })
                    }
                    placeholder="Write your compliment here..."
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg text-sm resize-none"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Tip: Use {"{pet}"} for random pet name
                  </p>
                </div>
              </>
            )}

            {formData.type === "voucher" && (
              <>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">
                    Voucher Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="e.g. Movie Night"
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">
                    Options (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.options.join(", ")}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        options: e.target.value
                          .split(",")
                          .map((t) => t.trim())
                          .filter(Boolean),
                      })
                    }
                    placeholder="Option A, Option B"
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
              </>
            )}

            {formData.type === "playlist" && (
              <>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">
                    Song Title
                  </label>
                  <input
                    type="text"
                    value={formData.songTitle}
                    onChange={(e) =>
                      setFormData({ ...formData, songTitle: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">
                    Artist
                  </label>
                  <input
                    type="text"
                    value={formData.artist}
                    onChange={(e) =>
                      setFormData({ ...formData, artist: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">
                    Link
                  </label>
                  <input
                    type="text"
                    value={formData.link}
                    onChange={(e) =>
                      setFormData({ ...formData, link: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
              </>
            )}

            <div>
              <label className="text-xs text-gray-500 mb-1 block">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={formData.tags.join(", ")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tags: e.target.value
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean),
                  })
                }
                placeholder="lonely, stressed, doubting"
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={cancelEdit}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  isEditing ? handleUpdateCard(isEditing) : handleAddCard()
                }
                disabled={isSaving}
                className="flex-1 px-4 py-2 bg-accent-pink text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSaving ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Save size={14} />
                )}
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
            <p className="font-medium">No cards match your filters</p>
          </div>
        ) : (
          filteredCards.map((card) => {
            const CategoryIcon = getCardIcon(card);
            const rarityOption = RARITY_OPTIONS.find(
              (r) => r.value === card.rarity,
            );
            const isExpanded = expandedCard === card.id;

            return (
              <motion.div
                key={card.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden"
              >
                <div
                  className="p-3 flex items-center gap-3 cursor-pointer hover:bg-gray-50"
                  onClick={() => setExpandedCard(isExpanded ? null : card.id)}
                >
                  <div className="w-10 h-10 rounded-lg bg-blush-50 flex items-center justify-center flex-shrink-0">
                    <CategoryIcon size={20} className="text-accent-pink" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 truncate">
                      {getCardDisplayText(card)}
                    </p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 text-purple-600">
                        {card.type}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        {card.category}
                      </span>
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded ${rarityOption?.color || "bg-gray-100 text-gray-600"}`}
                      >
                        {card.rarity}
                      </span>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-3 pb-3 border-t border-gray-100"
                    >
                      <div className="pt-3 space-y-2">
                        <p className="text-sm text-gray-600">
                          {getCardDisplayText(card)}
                        </p>
                        {card.tags && card.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {card.tags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <p className="text-xs text-gray-400 font-mono">
                          {card.id}
                        </p>
                        <div className="flex gap-2 pt-2 flex-wrap">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              startEditing(card);
                            }}
                            className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium flex items-center gap-1 hover:bg-gray-200"
                          >
                            <Edit3 size={12} /> Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCard(card.id);
                            }}
                            disabled={isSaving}
                            className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-medium flex items-center gap-1 hover:bg-red-100 disabled:opacity-50"
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

      <div className="flex items-center justify-center gap-4 text-xs text-gray-400 pt-2 flex-wrap">
        <span>Showing: {filteredCards.length}</span>
        <span>·</span>
        <span>Text: {stats.text}</span>
        <span>·</span>
        <span>Voucher: {stats.voucher}</span>
        <span>·</span>
        <span>Playlist: {stats.playlist}</span>
      </div>
    </div>
  );
};

export default CardsManager;
