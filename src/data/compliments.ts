// ============================================================
// COMPLIMENTS ADAPTER - Legacy compatibility layer
// Imports from cards.ts (single source of truth)
// ============================================================

import { textCards, pickPet, withPet } from "./cards";

// Re-export pet name utilities
export { pickPet, withPet };

// Legacy Compliment interface (subset of TextCard)
export interface Compliment {
  id: string;
  text: string;
  category: "sweet" | "funny" | "supportive" | "spicy-lite" | "secret";
  intensity: 1 | 2 | 3;
  emoji?: string;
}

// Map TextCards to legacy Compliment format
export const compliments: Compliment[] = textCards.map((card) => ({
  id: card.id,
  text: card.text,
  category: card.category,
  intensity: card.intensity,
  emoji: card.emoji,
}));

// Export for backwards compatibility
export default compliments;
