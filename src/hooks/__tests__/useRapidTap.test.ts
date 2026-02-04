import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useRapidTap } from "../useRapidTap";

describe("useRapidTap", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.setSystemTime(new Date(2024, 1, 14, 12, 0, 0));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should not trigger on single tap", () => {
    const { result } = renderHook(() => useRapidTap(5, 3000));

    let triggered: boolean;
    act(() => {
      triggered = result.current.handleTap();
    });

    expect(triggered!).toBe(false);
  });

  it("should trigger when required taps are reached within duration", () => {
    const { result } = renderHook(() => useRapidTap(5, 3000));

    let triggered = false;

    // Do 4 taps with small delays
    for (let i = 0; i < 4; i++) {
      act(() => {
        triggered = result.current.handleTap();
      });
      act(() => {
        vi.advanceTimersByTime(100);
      });
    }

    expect(triggered).toBe(false);

    // 5th tap should trigger
    act(() => {
      triggered = result.current.handleTap();
    });

    expect(triggered).toBe(true);
  });

  it("should not trigger if taps are too slow", () => {
    const { result } = renderHook(() => useRapidTap(5, 3000));

    let triggered = false;

    // 5 taps but spread over too long a period (each tap after maxDuration expires)
    for (let i = 0; i < 5; i++) {
      act(() => {
        triggered = result.current.handleTap();
      });
      if (i < 4) {
        act(() => {
          vi.advanceTimersByTime(1000); // 1 second between taps
        });
      }
    }

    // Total time is 4 seconds which exceeds 3 seconds maxDuration
    expect(triggered).toBe(false);
  });

  it("should reset after timeout", () => {
    const { result } = renderHook(() => useRapidTap(5, 3000));

    // Do 3 taps
    act(() => {
      result.current.handleTap();
    });
    act(() => {
      vi.advanceTimersByTime(50);
    });
    act(() => {
      result.current.handleTap();
    });
    act(() => {
      vi.advanceTimersByTime(50);
    });
    act(() => {
      result.current.handleTap();
    });

    // Wait for timeout to reset
    act(() => {
      vi.advanceTimersByTime(4000);
    });

    // Now we need 5 fresh taps
    let triggered = false;
    for (let i = 0; i < 4; i++) {
      act(() => {
        triggered = result.current.handleTap();
      });
      act(() => {
        vi.advanceTimersByTime(50);
      });
    }

    expect(triggered).toBe(false);

    act(() => {
      triggered = result.current.handleTap();
    });

    expect(triggered).toBe(true);
  });

  it("should reset manually", () => {
    const { result } = renderHook(() => useRapidTap(5, 3000));

    act(() => {
      result.current.handleTap();
      result.current.handleTap();
      result.current.handleTap();
      result.current.reset();
    });

    // After reset, need full 5 taps again
    let triggered = false;
    act(() => {
      for (let i = 0; i < 4; i++) {
        triggered = result.current.handleTap();
      }
    });

    expect(triggered).toBe(false);
  });

  it("should work with custom tap count", () => {
    const { result } = renderHook(() => useRapidTap(3, 2000));

    let triggered = false;

    act(() => {
      triggered = result.current.handleTap();
    });
    act(() => {
      vi.advanceTimersByTime(50);
    });
    act(() => {
      triggered = result.current.handleTap();
    });
    act(() => {
      vi.advanceTimersByTime(50);
    });
    act(() => {
      triggered = result.current.handleTap();
    });

    expect(triggered).toBe(true);
  });
});
