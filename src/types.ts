// ============================================================
// TYPE DEFINITIONS
// Card types, state types, and utility types
// ============================================================

import { RarityKey, StickerKey, MoodKey, OpenWhenKey, ThemeKey } from "./config";

// Re-export for convenience
export type Mood = MoodKey;
export type OpenWhenCategory = OpenWhenKey;

// ----- BASE CARD CATEGORIES -----
export type CardCategory =
  | "sweet"
  | "funny"
  | "supportive"
  | "spicy-lite"
  | "secret";

// ----- BASE COMPLIMENT -----
export interface BaseCard {
  id: string;
  category: CardCategory;
  rarity: RarityKey;
  tags?: string[]; // for filtering (stressed, hype, etc.)
}

// ----- TEXT CARD -----
export interface TextCard extends BaseCard {
  type: "text";
  text: string;
  emoji?: string;
  intensity: 1 | 2 | 3;
}

// ----- VOUCHER CARD -----
export interface VoucherCard extends BaseCard {
  type: "voucher";
  title: string;
  options: string[];
  emoji?: string;
}

// ----- PLAYLIST CARD -----
export interface PlaylistCard extends BaseCard {
  type: "playlist";
  songTitle: string;
  artist: string;
  link: string;
  emoji?: string;
}

// ----- UNION TYPE -----
export type Card = TextCard | VoucherCard | PlaylistCard;

// ----- TYPE GUARDS -----
export const isTextCard = (card: Card): card is TextCard => card.type === "text";
export const isVoucherCard = (card: Card): card is VoucherCard => card.type === "voucher";
export const isPlaylistCard = (card: Card): card is PlaylistCard => card.type === "playlist";

// ----- APP STATE -----
export interface AppState {
  // Theme
  currentTheme: ThemeKey;
  unlockedThemes: ThemeKey[];

  // Deck state
  secretUnlocked: boolean;
  seenIds: string[];
  drawCount: number;
  reasonsLogged: number;

  // Daily mode
  dailyModeEnabled: boolean;
  lastDrawDate: string | null;

  // Love meter
  loveMeterValue: number;
  loveMeterComplete: boolean;

  // Mood and filters
  currentMood: MoodKey;
  openWhenMode: OpenWhenKey | null;

  // Stickers
  cardStickers: Record<string, StickerKey>;

  // Vouchers
  redeemedVouchers: Record<string, string>; // cardId -> selected option

  // Notes
  notes: Note[];

  // Favorites
  favorites: string[];

  // UI toggles
  isMuted: boolean;
  heartTrailEnabled: boolean;

  // Progress
  deckExhaustedOnce: boolean;
}

// ----- NOTE -----
export interface Note {
  id: string;
  content: string;
  timestamp: number;
}

// ----- HOOK RETURNS -----
export interface UseDeckReturn {
  currentCard: Card | null;
  drawCount: number;
  isLoading: boolean;
  isDeckExhausted: boolean;
  secretUnlocked: boolean;
  canDraw: boolean;
  dailyModeEnabled: boolean;
  currentMood: MoodKey;
  openWhenMode: OpenWhenKey | null;
  drawCard: () => void;
  resetDeck: () => void;
  shuffleDeck: () => void;
  unlockSecretDeck: () => void;
  setMood: (mood: MoodKey) => void;
  setOpenWhenMode: (mode: OpenWhenKey | null) => void;
  toggleDailyMode: () => void;
  drawFinalThree: (category: "comfort" | "hype" | "laugh") => Card[];
}

export interface UseProgressReturn {
  reasonsLogged: number;
  loveMeterValue: number;
  loveMeterComplete: boolean;
  unlockedThemes: ThemeKey[];
  logReason: () => void;
  addLovePoints: (points: number) => void;
  checkMilestone: () => ThemeKey | null;
}

export interface UseThemeReturn {
  currentTheme: ThemeKey;
  unlockedThemes: ThemeKey[];
  setTheme: (theme: ThemeKey) => void;
  isThemeUnlocked: (theme: ThemeKey) => boolean;
}
