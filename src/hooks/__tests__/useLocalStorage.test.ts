import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useLocalStorage } from "../useLocalStorage";

describe("useLocalStorage", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("should return initial value when localStorage is empty", () => {
    const { result } = renderHook(() =>
      useLocalStorage("test-key", "initial-value")
    );

    expect(result.current[0]).toBe("initial-value");
  });

  it("should return stored value from localStorage", () => {
    localStorage.setItem("test-key", JSON.stringify("stored-value"));

    const { result } = renderHook(() =>
      useLocalStorage("test-key", "initial-value")
    );

    expect(result.current[0]).toBe("stored-value");
  });

  it("should update localStorage when setValue is called", () => {
    const { result } = renderHook(() =>
      useLocalStorage("test-key", "initial-value")
    );

    act(() => {
      result.current[1]("new-value");
    });

    expect(result.current[0]).toBe("new-value");
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "test-key",
      JSON.stringify("new-value")
    );
  });

  it("should support functional updates", () => {
    const { result } = renderHook(() => useLocalStorage("counter", 0));

    act(() => {
      result.current[1]((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(1);

    act(() => {
      result.current[1]((prev) => prev + 5);
    });

    expect(result.current[0]).toBe(6);
  });

  it("should handle objects and arrays", () => {
    const { result } = renderHook(() =>
      useLocalStorage("data", { items: [] as string[] })
    );

    act(() => {
      result.current[1]({ items: ["a", "b", "c"] });
    });

    expect(result.current[0]).toEqual({ items: ["a", "b", "c"] });
  });

  it("should return initial value on parse error", () => {
    // Simulate corrupted localStorage
    localStorage.setItem("test-key", "not-valid-json{{{");
    vi.spyOn(JSON, "parse").mockImplementationOnce(() => {
      throw new Error("Parse error");
    });

    const { result } = renderHook(() =>
      useLocalStorage("test-key", "fallback")
    );

    expect(result.current[0]).toBe("fallback");
  });
});
