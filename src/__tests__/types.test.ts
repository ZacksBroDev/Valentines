import { describe, it, expect } from "vitest";
import {
  isTextCard,
  isVoucherCard,
  isPlaylistCard,
  TextCard,
  VoucherCard,
  PlaylistCard,
} from "../types";

describe("Type Guards", () => {
  const textCard: TextCard = {
    id: "text-1",
    type: "text",
    text: "You are amazing!",
    category: "sweet",
    intensity: 2,
    emoji: "💖",
    rarity: "common",
  };

  const voucherCard: VoucherCard = {
    id: "voucher-1",
    type: "voucher",
    title: "Date Night",
    options: ["Movie", "Dinner", "Walk"],
    category: "sweet",
    rarity: "rare",
  };

  const playlistCard: PlaylistCard = {
    id: "playlist-1",
    type: "playlist",
    songTitle: "Love Song",
    artist: "Artist Name",
    link: "https://spotify.com/...",
    category: "sweet",
    rarity: "common",
  };

  describe("isTextCard", () => {
    it("should return true for text cards", () => {
      expect(isTextCard(textCard)).toBe(true);
    });

    it("should return false for voucher cards", () => {
      expect(isTextCard(voucherCard)).toBe(false);
    });

    it("should return false for playlist cards", () => {
      expect(isTextCard(playlistCard)).toBe(false);
    });
  });

  describe("isVoucherCard", () => {
    it("should return true for voucher cards", () => {
      expect(isVoucherCard(voucherCard)).toBe(true);
    });

    it("should return false for text cards", () => {
      expect(isVoucherCard(textCard)).toBe(false);
    });

    it("should return false for playlist cards", () => {
      expect(isVoucherCard(playlistCard)).toBe(false);
    });
  });

  describe("isPlaylistCard", () => {
    it("should return true for playlist cards", () => {
      expect(isPlaylistCard(playlistCard)).toBe(true);
    });

    it("should return false for text cards", () => {
      expect(isPlaylistCard(textCard)).toBe(false);
    });

    it("should return false for voucher cards", () => {
      expect(isPlaylistCard(voucherCard)).toBe(false);
    });
  });
});
