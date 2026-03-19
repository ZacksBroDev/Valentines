// ============================================================
// PUBLIC-SAFE SAMPLE CARD DATA
// The real seed source belongs in private/cards.private.ts
// so this repository can stay public without exposing content.
// ============================================================

import type { Card, TextCard, VoucherCard, PlaylistCard } from "../types";

const PET_POOL = ["love", "sunshine", "sweetheart"] as const;
const PET_WEIGHTS = [0.5, 0.3, 0.2];

export function pickPet(): string {
  const roll = Math.random();
  let total = 0;

  for (let i = 0; i < PET_POOL.length; i++) {
    total += PET_WEIGHTS[i];
    if (roll <= total) return PET_POOL[i];
  }

  return PET_POOL[0];
}

export function withPet(text: string): string {
  return text.replace(/{pet}/g, pickPet());
}

const textCards: TextCard[] = [
  {
    id: "sample-text-001",
    type: "text",
    category: "sweet",
    rarity: "common",
    tags: ["lonely"],
    text: "Sample card for {pet}. Keep private content in private/cards.private.ts.",
    intensity: 1,
  },
  {
    id: "sample-text-002",
    type: "text",
    category: "supportive",
    rarity: "rare",
    tags: ["stressed"],
    text: "Public repo example only. Seed real content from a private file.",
    intensity: 2,
  },
];

const voucherCards: VoucherCard[] = [
  {
    id: "sample-voucher-001",
    type: "voucher",
    category: "sweet",
    rarity: "legendary",
    title: "Sample date idea",
    options: ["Coffee walk", "Movie night", "Cook together"],
  },
];

const playlistCards: PlaylistCard[] = [
  {
    id: "sample-playlist-001",
    type: "playlist",
    category: "funny",
    rarity: "common",
    songTitle: "Sample Song",
    artist: "Demo Artist",
    link: "https://example.com/playlist",
  },
];

const extraTextCards: TextCard[] = [];

const builtInCards: Card[] = [
  ...textCards,
  ...voucherCards,
  ...playlistCards,
  ...extraTextCards,
];

function getCustomCards(): Card[] {
  return [];
}

export const allCards: Card[] = [...builtInCards, ...getCustomCards()];

export function getAllCards(): Card[] {
  return [...builtInCards, ...getCustomCards()];
}

export function getCardById(id: string): Card | undefined {
  return getAllCards().find((card) => card.id === id);
}

export function getAvailableCards(
  includeSecret: boolean = false,
  _mood?: string,
  openWhenMode?: string,
): Card[] {
  return getAllCards().filter((card) => {
    if (card.category === "secret" && !includeSecret) return false;
    if (!openWhenMode || openWhenMode === "all") return true;
    return card.tags?.includes(openWhenMode) ?? false;
  });
}

export { textCards, voucherCards, playlistCards, extraTextCards };
