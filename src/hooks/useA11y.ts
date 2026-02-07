import { useCallback, useRef, KeyboardEvent } from "react";

/**
 * Hook for managing focus and keyboard navigation
 * Provides accessible keyboard interactions for interactive elements
 */
export const useA11y = () => {
  const announcerRef = useRef<HTMLDivElement | null>(null);

  /**
   * Announce a message to screen readers
   */
  const announce = useCallback((message: string, priority: "polite" | "assertive" = "polite") => {
    if (!announcerRef.current) {
      // Create announcer element if it doesn't exist
      const announcer = document.createElement("div");
      announcer.setAttribute("aria-live", priority);
      announcer.setAttribute("aria-atomic", "true");
      announcer.setAttribute("role", "status");
      announcer.className = "sr-only";
      document.body.appendChild(announcer);
      announcerRef.current = announcer;
    }

    // Clear and set message to trigger announcement
    announcerRef.current.textContent = "";
    setTimeout(() => {
      if (announcerRef.current) {
        announcerRef.current.setAttribute("aria-live", priority);
        announcerRef.current.textContent = message;
      }
    }, 100);
  }, []);

  /**
   * Handle keyboard events for button-like elements
   * Makes non-button elements accessible with Enter/Space
   */
  const handleKeyDown = useCallback(
    (callback: () => void) => (event: KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        callback();
      }
    },
    []
  );

  /**
   * Handle Escape key to close modals/dialogs
   */
  const handleEscape = useCallback(
    (callback: () => void) => (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        callback();
      }
    },
    []
  );

  /**
   * Trap focus within a container (for modals)
   */
  const trapFocus = useCallback((containerRef: React.RefObject<HTMLElement>) => {
    const container = containerRef.current;
    if (!container) return;

    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: globalThis.KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey && document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable?.focus();
      } else if (!e.shiftKey && document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable?.focus();
      }
    };

    container.addEventListener("keydown", handleTabKey);
    firstFocusable?.focus();

    return () => {
      container.removeEventListener("keydown", handleTabKey);
    };
  }, []);

  return {
    announce,
    handleKeyDown,
    handleEscape,
    trapFocus,
  };
};

export default useA11y;
