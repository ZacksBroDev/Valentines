// ============================================================
// STORAGE UTILITIES
// All localStorage keys and helpers in one place
// ============================================================

import { ThemeKey, StickerKey, MoodKey, OpenWhenKey } from "../config";
import { Note } from "../types";

const PREFIX = "valentine-deck-";

export const STORAGE_KEYS = {
  // Core deck state
  FAVORITES: `${PREFIX}favorites`,
  SECRET_UNLOCKED: `${PREFIX}secret-unlocked`,
  SEEN_IDS: `${PREFIX}seen-ids`,
  DECK_EXHAUSTED_ONCE: `${PREFIX}exhausted-once`,

  // Audio
  SOUND_MUTED: `${PREFIX}sound-muted`,

  // Theme
  CURRENT_THEME: `${PREFIX}current-theme`,
  UNLOCKED_THEMES: `${PREFIX}unlocked-themes`,

  // Progress
  REASONS_LOGGED: `${PREFIX}reasons-logged`,
  LOVE_METER: `${PREFIX}love-meter`,
  LOVE_METER_COMPLETE: `${PREFIX}love-meter-complete`,

  // Daily mode
  DAILY_MODE_ENABLED: `${PREFIX}daily-mode`,
  LAST_DRAW_DATE: `${PREFIX}last-draw-date`,

  // Stickers
  CARD_STICKERS: `${PREFIX}card-stickers`,

  // Vouchers
  REDEEMED_VOUCHERS: `${PREFIX}redeemed-vouchers`,

  // Notes
  NOTES: `${PREFIX}notes`,

  // Mood & filters
  CURRENT_MOOD: `${PREFIX}current-mood`,
  OPEN_WHEN_MODE: `${PREFIX}open-when-mode`,

  // Heart trail
  HEART_TRAIL: `${PREFIX}heart-trail`,

  // Seal hint shown
  SEAL_HINT_SHOWN: `${PREFIX}seal-hint-shown`,
} as const;

// ----- GENERIC HELPERS -----
const get = <T>(key: string, fallback: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
};

const set = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

// ----- FAVORITES -----
export const getFavorites = (): string[] => get(STORAGE_KEYS.FAVORITES, []);
export const saveFavorites = (ids: string[]) =>
  set(STORAGE_KEYS.FAVORITES, ids);
export const toggleFavorite = (id: string): boolean => {
  const favs = getFavorites();
  const idx = favs.indexOf(id);
  if (idx > -1) {
    favs.splice(idx, 1);
    saveFavorites(favs);
    return false;
  }
  favs.push(id);
  saveFavorites(favs);
  return true;
};
export const isFavorite = (id: string): boolean => getFavorites().includes(id);

// ----- SECRET UNLOCK -----
export const isSecretUnlocked = (): boolean =>
  localStorage.getItem(STORAGE_KEYS.SECRET_UNLOCKED) === "true";
export const unlockSecret = () =>
  localStorage.setItem(STORAGE_KEYS.SECRET_UNLOCKED, "true");

// ----- SEEN IDS -----
export const getSeenIds = (): string[] => get(STORAGE_KEYS.SEEN_IDS, []);
export const saveSeenIds = (ids: string[]) => set(STORAGE_KEYS.SEEN_IDS, ids);
export const clearSeenIds = () =>
  localStorage.removeItem(STORAGE_KEYS.SEEN_IDS);

// ----- DECK EXHAUSTED -----
export const wasDeckExhausted = (): boolean =>
  localStorage.getItem(STORAGE_KEYS.DECK_EXHAUSTED_ONCE) === "true";
export const setDeckExhausted = () =>
  localStorage.setItem(STORAGE_KEYS.DECK_EXHAUSTED_ONCE, "true");
export const resetDeckExhausted = () =>
  localStorage.removeItem(STORAGE_KEYS.DECK_EXHAUSTED_ONCE);

// ----- SOUND -----
export const isSoundMuted = (): boolean => {
  const stored = localStorage.getItem(STORAGE_KEYS.SOUND_MUTED);
  return stored === null ? true : stored === "true";
};
export const setSoundMuted = (muted: boolean) =>
  localStorage.setItem(STORAGE_KEYS.SOUND_MUTED, String(muted));

// ----- THEME -----
export const getCurrentTheme = (): ThemeKey =>
  get(STORAGE_KEYS.CURRENT_THEME, "blush");
export const setCurrentTheme = (theme: ThemeKey) =>
  set(STORAGE_KEYS.CURRENT_THEME, theme);
export const getUnlockedThemes = (): ThemeKey[] =>
  get(STORAGE_KEYS.UNLOCKED_THEMES, ["blush"]);
export const setUnlockedThemes = (themes: ThemeKey[]) =>
  set(STORAGE_KEYS.UNLOCKED_THEMES, themes);

// ----- PROGRESS -----
export const getReasonsLogged = (): number =>
  get(STORAGE_KEYS.REASONS_LOGGED, 0);
export const setReasonsLogged = (count: number) =>
  set(STORAGE_KEYS.REASONS_LOGGED, count);
export const getLoveMeter = (): number => get(STORAGE_KEYS.LOVE_METER, 0);
export const setLoveMeter = (value: number) =>
  set(STORAGE_KEYS.LOVE_METER, value);
export const isLoveMeterComplete = (): boolean =>
  get(STORAGE_KEYS.LOVE_METER_COMPLETE, false);
export const setLoveMeterComplete = (complete: boolean) =>
  set(STORAGE_KEYS.LOVE_METER_COMPLETE, complete);

// ----- DAILY MODE -----
export const isDailyModeEnabled = (): boolean =>
  get(STORAGE_KEYS.DAILY_MODE_ENABLED, false);
export const setDailyModeEnabled = (enabled: boolean) =>
  set(STORAGE_KEYS.DAILY_MODE_ENABLED, enabled);
export const getLastDrawDate = (): string | null =>
  get(STORAGE_KEYS.LAST_DRAW_DATE, null);
export const setLastDrawDate = (date: string) =>
  set(STORAGE_KEYS.LAST_DRAW_DATE, date);

// ----- STICKERS -----
export const getCardStickers = (): Record<string, StickerKey> =>
  get(STORAGE_KEYS.CARD_STICKERS, {});
export const setCardSticker = (cardId: string, sticker: StickerKey) => {
  const stickers = getCardStickers();
  stickers[cardId] = sticker;
  set(STORAGE_KEYS.CARD_STICKERS, stickers);
};

// ----- VOUCHERS -----
export const getRedeemedVouchers = (): Record<string, string> =>
  get(STORAGE_KEYS.REDEEMED_VOUCHERS, {});
export const redeemVoucher = (cardId: string, option: string) => {
  const vouchers = getRedeemedVouchers();
  vouchers[cardId] = option;
  set(STORAGE_KEYS.REDEEMED_VOUCHERS, vouchers);
};

// ----- NOTES -----
export const getNotes = (): Note[] => get(STORAGE_KEYS.NOTES, []);
export const saveNote = (note: Note) => {
  const notes = getNotes();
  notes.unshift(note);
  set(STORAGE_KEYS.NOTES, notes);
};
export const deleteNote = (id: string) => {
  const notes = getNotes().filter((n) => n.id !== id);
  set(STORAGE_KEYS.NOTES, notes);
};

// ----- MOOD & FILTERS -----
export const getCurrentMood = (): MoodKey =>
  get(STORAGE_KEYS.CURRENT_MOOD, "all");
export const setCurrentMood = (mood: MoodKey) =>
  set(STORAGE_KEYS.CURRENT_MOOD, mood);
export const getOpenWhenMode = (): OpenWhenKey | null =>
  get(STORAGE_KEYS.OPEN_WHEN_MODE, null);
export const setOpenWhenMode = (mode: OpenWhenKey | null) =>
  set(STORAGE_KEYS.OPEN_WHEN_MODE, mode);

// ----- HEART TRAIL -----
export const isHeartTrailEnabled = (): boolean =>
  get(STORAGE_KEYS.HEART_TRAIL, false);
export const setHeartTrailEnabled = (enabled: boolean) =>
  set(STORAGE_KEYS.HEART_TRAIL, enabled);

// ----- SEAL HINT -----
export const wasSealHintShown = (): boolean =>
  get(STORAGE_KEYS.SEAL_HINT_SHOWN, false);
export const setSealHintShown = () => set(STORAGE_KEYS.SEAL_HINT_SHOWN, true);

// ----- DATE HELPERS -----
export const getLocalDateString = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
};

export const canDrawToday = (): boolean => {
  if (!isDailyModeEnabled()) return true;
  const lastDraw = getLastDrawDate();
  if (!lastDraw) return true;
  return lastDraw !== getLocalDateString();
};
