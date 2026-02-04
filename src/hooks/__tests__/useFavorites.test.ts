import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useFavorites } from "../useFavorites";

describe("useFavorites", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should initialize with empty favorites", () => {
    const { result } = renderHook(() => useFavorites());

    expect(result.current.favorites).toEqual([]);
  });

  it("should add a favorite when toggleFavorite is called", () => {
    const { result } = renderHook(() => useFavorites());

    act(() => {
      const wasAdded = result.current.toggleFavorite("card-1");
      expect(wasAdded).toBe(true);
    });

    expect(result.current.favorites).toContain("card-1");
    expect(result.current.isFavorite("card-1")).toBe(true);
  });

  it("should remove a favorite when toggleFavorite is called twice", () => {
    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.toggleFavorite("card-1");
    });

    expect(result.current.isFavorite("card-1")).toBe(true);

    act(() => {
      const wasAdded = result.current.toggleFavorite("card-1");
      expect(wasAdded).toBe(false);
    });

    expect(result.current.favorites).not.toContain("card-1");
    expect(result.current.isFavorite("card-1")).toBe(false);
  });

  it("should handle multiple favorites", () => {
    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.toggleFavorite("card-1");
      result.current.toggleFavorite("card-2");
      result.current.toggleFavorite("card-3");
    });

    expect(result.current.favorites).toHaveLength(3);
    expect(result.current.isFavorite("card-1")).toBe(true);
    expect(result.current.isFavorite("card-2")).toBe(true);
    expect(result.current.isFavorite("card-3")).toBe(true);
    expect(result.current.isFavorite("card-4")).toBe(false);
  });

  it("should persist favorites to localStorage", () => {
    const { result, unmount } = renderHook(() => useFavorites());

    act(() => {
      result.current.toggleFavorite("persisted-card");
    });

    unmount();

    // Re-mount and check persistence
    const { result: newResult } = renderHook(() => useFavorites());
    expect(newResult.current.favorites).toContain("persisted-card");
  });

  it("should refresh favorites from storage", () => {
    const { result } = renderHook(() => useFavorites());

    // Simulate external storage change
    localStorage.setItem(
      "valentine-deck-favorites",
      JSON.stringify(["external-card"])
    );

    act(() => {
      result.current.refreshFavorites();
    });

    expect(result.current.favorites).toContain("external-card");
  });
});
