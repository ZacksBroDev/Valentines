import {
  Card,
  CardCategory,
  isTextCard,
  isVoucherCard,
  isPlaylistCard,
} from "../types";
import { getAvailableCards } from "../data/cards";

// Fisher-Yates shuffle
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Create a shuffled deck of card IDs
export const createShuffledDeck = (secretUnlocked: boolean): string[] => {
  const cards = getAvailableCards(secretUnlocked);
  return shuffleArray(cards.map((c) => c.id));
};

// Get card by ID
export const getCardById = (id: string, cards: Card[]): Card | undefined => {
  return cards.find((c) => c.id === id);
};

// Get text representation of a card
export const getCardText = (card: Card): string => {
  if (isTextCard(card)) {
    return `${card.emoji || "💕"} ${card.text}`;
  }
  if (isVoucherCard(card)) {
    return `${card.emoji || "🎟️"} ${card.title}`;
  }
  if (isPlaylistCard(card)) {
    return `${card.emoji || "🎵"} ${card.songTitle} by ${card.artist}`;
  }
  return "";
};

// Check if a tap sequence qualifies as rapid taps
export const isRapidTapSequence = (
  timestamps: number[],
  requiredTaps: number,
  maxDuration: number,
): boolean => {
  if (timestamps.length < requiredTaps) return false;

  const recentTaps = timestamps.slice(-requiredTaps);
  const duration = recentTaps[recentTaps.length - 1] - recentTaps[0];

  return duration <= maxDuration;
};

// Detect support for Web Share API
export const canShare = (): boolean => {
  return typeof navigator !== "undefined" && !!navigator.share;
};

// Share content
export const shareCompliment = async (text: string): Promise<boolean> => {
  if (canShare()) {
    try {
      await navigator.share({
        title: "A Sweet Compliment 💕",
        text: text,
      });
      return true;
    } catch (err) {
      // User cancelled or error
      if ((err as Error).name !== "AbortError") {
        console.error("Share failed:", err);
      }
      return false;
    }
  } else {
    // Fallback to clipboard
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error("Clipboard failed:", err);
      return false;
    }
  }
};

// Share a card
export const shareCard = async (card: Card): Promise<boolean> => {
  const text = getCardText(card);
  return shareCompliment(text);
};

// Format category for display
export const formatCategory = (category: CardCategory): string => {
  const labels: Record<CardCategory, string> = {
    sweet: "💗 Sweet",
    funny: "😄 Funny",
    supportive: "💪 Supportive",
    "spicy-lite": "🔥 Spicy",
    secret: "🔐 Secret",
  };
  return labels[category] || category;
};

// Check reduced motion preference
export const prefersReducedMotion = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

// Check if device has fine pointer (desktop)
export const hasFinPointer = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: fine)").matches;
};
