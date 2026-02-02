import { Compliment, getAvailableCompliments } from "../data/compliments";

// Fisher-Yates shuffle
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Create a shuffled deck of compliment IDs
export const createShuffledDeck = (secretUnlocked: boolean): string[] => {
  const compliments = getAvailableCompliments(secretUnlocked);
  return shuffleArray(compliments.map((c) => c.id));
};

// Get compliment by ID
export const getComplimentById = (
  id: string,
  compliments: Compliment[],
): Compliment | undefined => {
  return compliments.find((c) => c.id === id);
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

// Format category for display
export const formatCategory = (category: Compliment["category"]): string => {
  const labels: Record<Compliment["category"], string> = {
    sweet: "💗 Sweet",
    funny: "😄 Funny",
    supportive: "💪 Supportive",
    "spicy-lite": "🔥 Spicy",
    secret: "🔐 Secret",
  };
  return labels[category];
};
