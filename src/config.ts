// ============================================================
// CONFIGURATION FILE
// Customize these values for your Valentine!
// ============================================================

export const CONFIG = {
  // ----- SIGNATURE / WAX SEAL -----
  // This appears on the wax seal stamp
  sealText: "Love, Zack",

  // ----- END SCREEN -----
  // Shown when the deck is exhausted
  endMessage: "That's the whole deck—still true every time.",
  endSubtitle: "Every compliment was written with you in mind.",
  signedBy: "Love, Zack",

  // ----- PARTNER NAME -----
  // Used in personalized compliments
  partnerName: "Caitlyn",

  // ----- DECK SETTINGS -----
  // Show end screen after this many draws OR when deck exhausted
  // Set high to allow users to draw all cards - deck has 250+ cards
  drawThreshold: 500,
  // Required taps to unlock secret deck
  secretTapCount: 5,
  // Time window for secret unlock (ms)
  secretTapWindow: 3000,
  // Wax seal tap count for hint
  sealHintTaps: 3,
  
  // ----- SECRET DECK PROGRESS -----
  // Number of draws required to unlock the secret deck via progress
  secretUnlockDraws: 25,

  // ----- PROGRESS MILESTONES -----
  milestones: {
    lavenderTheme: 10,
    nightTheme: 25,
    sunsetTheme: 50,
  },

  // ----- LOVE METER -----
  loveMeter: {
    drawPoints: 1,
    savePoints: 2,
    secretUnlockPoints: 3,
    maxPoints: 100,
  },

  // ----- DAILY MODE -----
  // Daily draw limit (3 per calendar day)
  dailyDrawLimit: 3,
  dailyModeDefault: false,

  // ----- HEART TRAIL -----
  heartTrailDefault: false,
} as const;

// Theme definitions
export const THEMES = {
  blush: {
    name: "Blush",
    gradient: "linear-gradient(135deg, #fff5f7 0%, #ffe8ed 50%, #ffd6e0 100%)",
    accent: "#ff4da6",
    cardBg: "linear-gradient(145deg, #ffffff 0%, #fff8fa 100%)",
  },
  lavender: {
    name: "Lavender",
    gradient: "linear-gradient(135deg, #f5f3ff 0%, #ede9fe 50%, #ddd6fe 100%)",
    accent: "#8b5cf6",
    cardBg: "linear-gradient(145deg, #ffffff 0%, #faf5ff 100%)",
  },
  night: {
    name: "Night",
    gradient: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #3730a3 100%)",
    accent: "#c084fc",
    cardBg: "linear-gradient(145deg, #1f1f3d 0%, #2e2e5c 100%)",
  },
  sunset: {
    name: "Sunset",
    gradient:
      "linear-gradient(135deg, #fef3c7 0%, #fde68a 30%, #fca5a5 70%, #f87171 100%)",
    accent: "#f97316",
    cardBg: "linear-gradient(145deg, #fffbeb 0%, #fef3c7 100%)",
  },
} as const;

export type ThemeKey = keyof typeof THEMES;

// Open When categories
export const OPEN_WHEN_CATEGORIES = {
  stressed: {
    label: "Stressed",
    icon: "Brain",
    description: "For when you need calm",
    categories: ["supportive", "sweet"] as const,
  },
  laugh: {
    label: "Need a laugh",
    icon: "Smile",
    description: "For when you need joy",
    categories: ["funny"] as const,
  },
  doubting: {
    label: "Doubting yourself",
    icon: "HelpCircle",
    description: "For when you need confidence",
    categories: ["supportive"] as const,
  },
  lonely: {
    label: "Feeling lonely",
    icon: "Heart",
    description: "For when you need love",
    categories: ["sweet", "secret"] as const,
  },
  overstimulated: {
    label: "Overstimulated",
    icon: "Volume2",
    description: "For when you need quiet",
    categories: ["supportive"] as const,
  },
} as const;

export type OpenWhenKey = keyof typeof OPEN_WHEN_CATEGORIES;

// Mood categories
export const MOODS = {
  all: { label: "All", icon: "Sparkles", accent: null },
  soft: { label: "Soft", icon: "Flower2", accent: "#ffb8ca" },
  funny: { label: "Funny", icon: "Smile", accent: "#fbbf24" },
  hype: { label: "Hype", icon: "Flame", accent: "#f97316" },
  flirty: { label: "Flirty", icon: "Heart", accent: "#ec4899" },
} as const;

export type MoodKey = keyof typeof MOODS;

// Final 3 categories for end screen
export const FINAL_THREE_CATEGORIES = {
  comfort: {
    label: "Comfort",
    icon: "Users",
    categories: ["sweet", "supportive"] as const,
  },
  hype: {
    label: "Hype",
    icon: "PartyPopper",
    categories: ["funny", "spicy-lite"] as const,
  },
  laugh: {
    label: "Laugh",
    icon: "Smile",
    categories: ["funny"] as const,
  },
} as const;

// Sticker options
export const STICKERS = {
  love: { icon: "Heart", label: "Love" },
  lol: { icon: "Laugh", label: "LOL" },
  aww: { icon: "HeartHandshake", label: "Aww" },
  fave: { icon: "Star", label: "Fave" },
} as const;

export type StickerKey = keyof typeof STICKERS;

// Rarity definitions - use with RARITY_ICONS from components/icons.tsx
export const RARITIES = {
  common: {
    label: "Common",
    iconName: "Circle" as const,
    color: "text-gray-400",
    bgColor: "bg-gray-100",
    shimmer: false,
  },
  rare: {
    label: "Rare",
    iconName: "Diamond" as const,
    color: "text-purple-500",
    bgColor: "bg-purple-100",
    shimmer: true,
  },
  legendary: {
    label: "Legendary",
    iconName: "Star" as const,
    color: "text-yellow-500",
    bgColor: "bg-yellow-100",
    shimmer: true,
  },
} as const;

export type RarityKey = keyof typeof RARITIES;
