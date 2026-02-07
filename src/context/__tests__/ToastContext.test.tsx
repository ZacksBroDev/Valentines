import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { screen, render, fireEvent, act } from "@testing-library/react";
import { ToastProvider, useToast } from "../ToastContext";

// Test component that triggers toasts
const TestComponent = () => {
  const { showToast } = useToast();

  return (
    <div>
      <button onClick={() => showToast("Test message", "🎉")}>
        Show Toast
      </button>
      <button onClick={() => showToast("No emoji message")}>
        Show Plain Toast
      </button>
    </div>
  );
};

// Wrapped version for most tests
const WrappedTestComponent = () => (
  <ToastProvider>
    <TestComponent />
  </ToastProvider>
);

describe("ToastContext", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("should show toast when showToast is called", () => {
    render(<WrappedTestComponent />);

    fireEvent.click(screen.getByText("Show Toast"));

    expect(screen.getByText("Test message")).toBeInTheDocument();
    // Icons are now Lucide SVGs, not emoji text
  });

  it("should show toast without emoji", () => {
    render(<WrappedTestComponent />);

    fireEvent.click(screen.getByText("Show Plain Toast"));

    expect(screen.getByText("No emoji message")).toBeInTheDocument();
  });

  it("should schedule toast removal after timeout", () => {
    // This test verifies the setTimeout is called, not the animation completion
    const setTimeoutSpy = vi.spyOn(globalThis, "setTimeout");
    
    render(<WrappedTestComponent />);
    fireEvent.click(screen.getByText("Show Toast"));

    // Verify setTimeout was called with 2500ms for auto-dismiss
    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 2500);
    
    setTimeoutSpy.mockRestore();
  });

  it("should throw error when useToast is used outside provider", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow("useToast must be used within a ToastProvider");

    consoleError.mockRestore();
  });

  it("should handle multiple toasts", () => {
    // Advance time between clicks to ensure unique IDs
    render(<WrappedTestComponent />);

    fireEvent.click(screen.getByText("Show Toast"));
    
    act(() => {
      vi.advanceTimersByTime(100);
    });
    
    fireEvent.click(screen.getByText("Show Plain Toast"));

    expect(screen.getByText("Test message")).toBeInTheDocument();
    expect(screen.getByText("No emoji message")).toBeInTheDocument();
  });
});
