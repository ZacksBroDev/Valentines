import { describe, it, expect, vi } from "vitest";
import { shuffleArray, formatCategory, shareCard } from "../helpers";
import { TextCard } from "../../types";

describe("helpers", () => {
  describe("shuffleArray", () => {
    it("should return an array of the same length", () => {
      const input = [1, 2, 3, 4, 5];
      const result = shuffleArray(input);

      expect(result).toHaveLength(input.length);
    });

    it("should contain all original elements", () => {
      const input = [1, 2, 3, 4, 5];
      const result = shuffleArray(input);

      expect(result.sort()).toEqual(input.sort());
    });

    it("should not mutate the original array", () => {
      const input = [1, 2, 3, 4, 5];
      const originalCopy = [...input];
      shuffleArray(input);

      expect(input).toEqual(originalCopy);
    });

    it("should handle empty arrays", () => {
      const result = shuffleArray([]);
      expect(result).toEqual([]);
    });

    it("should handle single element arrays", () => {
      const result = shuffleArray([1]);
      expect(result).toEqual([1]);
    });
  });

  describe("formatCategory", () => {
    it("should format sweet category", () => {
      expect(formatCategory("sweet")).toBe("Sweet");
    });

    it("should format funny category", () => {
      expect(formatCategory("funny")).toBe("Funny");
    });

    it("should format supportive category", () => {
      expect(formatCategory("supportive")).toBe("Supportive");
    });

    it("should format spicy-lite category with special handling", () => {
      expect(formatCategory("spicy-lite")).toBe("Spicy");
    });

    it("should format secret category", () => {
      expect(formatCategory("secret")).toBe("Secret");
    });
  });

  describe("shareCard", () => {
    const mockCard: TextCard = {
      id: "test-1",
      type: "text",
      text: "You are wonderful!",
      category: "sweet",
      intensity: 2,
      emoji: "💕",
      rarity: "common",
    };

    it("should use Web Share API when available", async () => {
      const mockShare = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, "share", {
        value: mockShare,
        writable: true,
      });
      Object.defineProperty(navigator, "canShare", {
        value: () => true,
        writable: true,
      });

      const result = await shareCard(mockCard);

      expect(result).toBe(true);
    });

    it("should fallback to clipboard when share is not available", async () => {
      Object.defineProperty(navigator, "share", {
        value: undefined,
        writable: true,
      });
      Object.defineProperty(navigator, "canShare", {
        value: undefined,
        writable: true,
      });

      const mockWriteText = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, "clipboard", {
        value: { writeText: mockWriteText },
        writable: true,
      });

      const result = await shareCard(mockCard);

      expect(mockWriteText).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it("should return false on error", async () => {
      Object.defineProperty(navigator, "share", {
        value: undefined,
        writable: true,
      });
      Object.defineProperty(navigator, "clipboard", {
        value: {
          writeText: vi.fn().mockRejectedValue(new Error("Clipboard error")),
        },
        writable: true,
      });

      const result = await shareCard(mockCard);

      expect(result).toBe(false);
    });
  });
});
