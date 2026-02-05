// ============================================================
// APP SHELL - Main layout container
// Fixed 100dvh layout with no scrolling
// ============================================================

import { ReactNode } from "react";
import { ThemeKey } from "../../config";

interface AppShellProps {
  children: ReactNode;
  theme: ThemeKey;
}

/**
 * App shell provides the fixed viewport layout structure.
 * Uses 100dvh for proper mobile viewport handling.
 * 
 * Structure:
 * - Header (fixed, ~44px)
 * - Content (flex: 1, scrolls internally if needed)
 * - Bottom Nav (fixed, ~64px + safe area)
 */
export const AppShell = ({ children, theme }: AppShellProps) => {
  return (
    <div
      className={`
        app-shell
        h-dvh h-svh
        w-full
        overflow-hidden
        flex flex-col
        hearts-bg hearts-pattern
        theme-${theme}
      `}
      style={{
        // Fallback for browsers without dvh support
        height: "100dvh",
        minHeight: "-webkit-fill-available",
      }}
    >
      {children}
    </div>
  );
};

/**
 * Header section - fixed height, safe area aware
 */
interface HeaderSectionProps {
  children: ReactNode;
  className?: string;
}

export const HeaderSection = ({ children, className = "" }: HeaderSectionProps) => (
  <header
    className={`
      shrink-0
      w-full
      px-3 py-2
      safe-top
      flex items-center justify-between
      z-20
      ${className}
    `}
  >
    {children}
  </header>
);

/**
 * Main content area - flexes to fill available space
 * Card area lives here
 */
interface MainSectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

export const MainSection = ({ children, className = "", id }: MainSectionProps) => (
  <main
    id={id}
    tabIndex={-1}
    className={`
      flex-1
      flex flex-col
      items-center justify-center
      px-3
      min-h-0
      overflow-hidden
      relative
      z-10
      ${className}
    `}
    role="main"
    aria-label="Compliment card deck"
  >
    {children}
  </main>
);

/**
 * Bottom navigation - fixed height, safe area aware
 */
interface BottomNavSectionProps {
  children: ReactNode;
  className?: string;
}

export const BottomNavSection = ({ children, className = "" }: BottomNavSectionProps) => (
  <nav
    className={`
      shrink-0
      w-full
      px-2
      pt-1
      pb-safe
      bg-white/80
      backdrop-blur-md
      border-t border-blush-100
      z-20
      ${className}
    `}
    role="navigation"
    aria-label="Main navigation"
  >
    {children}
  </nav>
);

/**
 * Card container - properly sized for aspect ratio
 */
interface CardContainerProps {
  children: ReactNode;
  className?: string;
}

export const CardContainer = ({ children, className = "" }: CardContainerProps) => (
  <div
    className={`
      w-full
      max-w-[260px] xs:max-w-[280px] sm:max-w-[320px] md:max-w-[360px]
      flex-1
      flex items-center justify-center
      min-h-0
      ${className}
    `}
  >
    {children}
  </div>
);
