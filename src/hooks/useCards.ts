// ============================================================
// useCards - Fetch cards from DynamoDB via AppSync after auth
// Replaces static import from data/cards.ts
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { generateClient } from "aws-amplify/api";
import type { Card, TextCard, VoucherCard, PlaylistCard } from "../types";
import { CONFIG } from "../config";

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
      }
      nextToken
    }
  }
`;

interface RawCard {
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
}

function toTypedCard(raw: RawCard): Card {
  const base = {
    id: raw.id,
    category: raw.category as Card["category"],
    rarity: (raw.rarity ?? "common") as Card["rarity"],
    tags: raw.tags ?? undefined,
  };

  if (raw.type === "voucher") {
    return {
      ...base,
      type: "voucher",
      title: raw.title ?? "",
      options: raw.options ?? [],
      emoji: raw.emoji ?? undefined,
    } as VoucherCard;
  }

  if (raw.type === "playlist") {
    return {
      ...base,
      type: "playlist",
      songTitle: raw.songTitle ?? "",
      artist: raw.artist ?? "",
      link: raw.link ?? "",
      emoji: raw.emoji ?? undefined,
    } as PlaylistCard;
  }

  return {
    ...base,
    type: "text",
    text: raw.text,
    emoji: raw.emoji ?? undefined,
    intensity: (raw.intensity ?? 1) as TextCard["intensity"],
  } as TextCard;
}

export function useCards() {
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAllCards = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const client = generateClient();
      const allItems: RawCard[] = [];
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

      setCards(allItems.map(toTypedCard));
    } catch (err) {
      console.error("[useCards] Failed to fetch cards:", err);
      setError(err instanceof Error ? err : new Error("Failed to load cards"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllCards();
  }, [fetchAllCards]);

  return { cards, isLoading, error, refetch: fetchAllCards };
}
