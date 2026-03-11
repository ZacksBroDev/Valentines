// ============================================================
// CARD CONTEXT - Provides cards fetched from DynamoDB post-auth
// Replaces all static imports from data/cards.ts
// ============================================================

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useCards } from "../hooks/useCards";
import type { Card } from "../types";
import { OPEN_WHEN_CATEGORIES, type OpenWhenKey } from "../config";
import { getRedeemedVoucherCardIds } from "../utils/storage";

// Pet name system — no private data, kept in frontend
const PET_POOL = ["babe", "baby", "Caitlyn"] as const;
const PET_WEIGHTS = [0.6, 0.25, 0.15];

export function pickPet(): string {
  const r = Math.random();
  let acc = 0;
  for (let i = 0; i < PET_POOL.length; i++) {
    acc += PET_WEIGHTS[i];
    if (r <= acc) return PET_POOL[i];
  }
  return "Caitlyn";
}

export function withPet(text: string): string {
  return text.replace(/{pet}/g, pickPet());
}

interface CardContextValue {
  allCards: Card[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  getCardById: (id: string) => Card | undefined;
  getAvailableCards: (
    includeSecret?: boolean,
    mood?: string,
    openWhenMode?: string,
  ) => Card[];
}

const CardContext = createContext<CardContextValue | null>(null);

export function CardProvider({ children }: { children: ReactNode }) {
  const { cards, isLoading, error, refetch } = useCards();

  const getCardById = useMemo(
    () => (id: string) => cards.find((c) => c.id === id),
    [cards],
  );

  const getAvailableCards = useMemo(
    () =>
      (
        includeSecret: boolean = false,
        _mood?: string,
        openWhenMode?: string,
      ): Card[] => {
        const redeemedVoucherIds = getRedeemedVoucherCardIds();

        let filtered = cards.filter((card) => {
          if (card.category === "secret" && !includeSecret) return false;
          if (card.type === "voucher" && redeemedVoucherIds.includes(card.id))
            return false;
          return true;
        });

        if (openWhenMode && openWhenMode !== "all") {
          const config = OPEN_WHEN_CATEGORIES[openWhenMode as OpenWhenKey];
          if (config) {
            const allowedCategories = config.categories as readonly string[];
            filtered = filtered.filter((card) => {
              const hasTag = card.tags?.includes(openWhenMode);
              const hasCategory = allowedCategories.includes(card.category);
              return hasTag || hasCategory;
            });
          } else {
            filtered = filtered.filter((card) =>
              card.tags?.includes(openWhenMode),
            );
          }
        }

        return filtered;
      },
    [cards],
  );

  const value: CardContextValue = {
    allCards: cards,
    isLoading,
    error,
    refetch,
    getCardById,
    getAvailableCards,
  };

  return <CardContext.Provider value={value}>{children}</CardContext.Provider>;
}

export function useCardContext(): CardContextValue {
  const ctx = useContext(CardContext);
  if (!ctx) throw new Error("useCardContext must be used within CardProvider");
  return ctx;
}
