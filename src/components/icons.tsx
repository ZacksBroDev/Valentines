// ============================================================
// ICON SYSTEM
// Centralized Lucide icon exports with consistent styling
// Replaces all emoji icons in the UI
// ============================================================

import React from "react";
import {
  Settings,
  BarChart3,
  Ticket,
  Mail,
  MailOpen,
  Heart,
  Sparkles,
  StickyNote,
  Shuffle,
  Volume2,
  VolumeX,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Smile,
  HandHeart,
  Flame,
  Lock,
  Unlock,
  Cloud,
  Zap,
  Brain,
  Laugh,
  HelpCircle,
  Activity,
  MessageSquare,
  Music,
  Circle,
  Diamond,
  Star,
  Check,
  Plus,
  Minus,
  Trash2,
  Share2,
  Copy,
  Calendar,
  Clock,
  Sun,
  Moon,
  Palette,
  Info,
  AlertCircle,
  Gift,
  Crown,
  Trophy,
  Target,
  TrendingUp,
  Flower2,
  Mountain,
  Film,
  UtensilsCrossed,
  Eye,
  EyeOff,
  type LucideIcon,
} from "lucide-react";

// Re-export all icons
export {
  Settings,
  BarChart3,
  Ticket,
  Mail,
  MailOpen,
  Heart,
  Sparkles,
  StickyNote,
  Shuffle,
  Volume2,
  VolumeX,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Smile,
  HandHeart,
  Flame,
  Lock,
  Unlock,
  Cloud,
  Zap,
  Brain,
  Laugh,
  HelpCircle,
  Activity,
  MessageSquare,
  Music,
  Circle,
  Diamond,
  Star,
  Check,
  Plus,
  Minus,
  Trash2,
  Share2,
  Copy,
  Calendar,
  Clock,
  Sun,
  Moon,
  Palette,
  Info,
  AlertCircle,
  Gift,
  Crown,
  Trophy,
  Target,
  TrendingUp,
  Flower2,
  Mountain,
  Film,
  UtensilsCrossed,
  Eye,
  EyeOff,
  type LucideIcon,
};

// ============================================================
// ICON MAPPINGS
// ============================================================

// Navigation icons
export const NAV_ICONS = {
  settings: Settings,
  stats: BarChart3,
  vouchers: Ticket,
  openWhen: Mail,
  openWhenActive: MailOpen,
  favorites: Heart,
  draw: Sparkles,
  notes: StickyNote,
  shuffle: Shuffle,
  mute: VolumeX,
  unmute: Volume2,
  close: X,
  back: ChevronLeft,
  next: ChevronRight,
  expand: ChevronDown,
} as const;

// Mood icons (replaces MOODS emoji mapping)
export const MOOD_ICONS = {
  all: Sparkles,
  soft: Cloud,
  funny: Smile,
  hype: Zap,
  flirty: Flame,
} as const;

// Category icons
export const CATEGORY_ICONS = {
  sweet: Heart,
  funny: Smile,
  supportive: HandHeart,
  "spicy-lite": Flame,
  secret: Lock,
} as const;

// Open When icons
export const OPEN_WHEN_ICONS = {
  stressed: Brain,
  laugh: Laugh,
  doubting: HelpCircle,
  lonely: Heart,
  overstimulated: Activity,
} as const;

// Card type icons
export const CARD_TYPE_ICONS = {
  text: MessageSquare,
  voucher: Ticket,
  playlist: Music,
} as const;

// Rarity icons
export const RARITY_ICONS = {
  common: Circle,
  rare: Diamond,
  legendary: Star,
} as const;

// Sticker/reaction icons
export const REACTION_ICONS = {
  love: Heart,
  lol: Laugh,
  aww: Cloud,
  fave: Star,
} as const;

// ============================================================
// ICON COMPONENT HELPERS
// ============================================================

interface IconProps {
  icon: LucideIcon;
  size?: number;
  className?: string;
  strokeWidth?: number;
  filled?: boolean;
}

/**
 * Standardized icon component with consistent defaults
 */
export const Icon = ({
  icon: IconComponent,
  size = 20,
  className = "",
  strokeWidth = 2,
  filled = false,
}: IconProps) => (
  <IconComponent
    size={size}
    strokeWidth={strokeWidth}
    className={className}
    fill={filled ? "currentColor" : "none"}
  />
);

/**
 * Icon button with tooltip support
 */
interface IconButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  onLongPress?: () => void;
  size?: "sm" | "md" | "lg";
  variant?: "ghost" | "solid" | "outline";
  active?: boolean;
  disabled?: boolean;
  badge?: number;
  className?: string;
}

const sizeClasses = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-12 h-12",
};

const iconSizes = {
  sm: 16,
  md: 20,
  lg: 24,
};

const variantClasses = {
  ghost: "bg-white/70 hover:bg-white backdrop-blur-sm",
  solid: "bg-accent-pink text-white hover:bg-accent-pink/90",
  outline: "border-2 border-accent-pink text-accent-pink hover:bg-accent-pink/10",
};

export const IconButton = ({
  icon: IconComponent,
  label,
  onClick,
  onLongPress,
  size = "md",
  variant = "ghost",
  active = false,
  disabled = false,
  badge,
  className = "",
}: IconButtonProps) => {
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLongPress = React.useRef(false);

  const startPress = () => {
    if (!onLongPress) return;
    isLongPress.current = false;
    timerRef.current = setTimeout(() => {
      isLongPress.current = true;
      onLongPress();
    }, 800); // 800ms for long press
  };

  const endPress = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  const handleClick = () => {
    if (!isLongPress.current) {
      onClick();
    }
  };

  return (
    <button
      onClick={handleClick}
      onMouseDown={startPress}
      onMouseUp={endPress}
      onMouseLeave={endPress}
      onTouchStart={startPress}
      onTouchEnd={endPress}
      disabled={disabled}
      className={`
        relative rounded-full shadow-sm flex items-center justify-center
        transition-all duration-200 btn-press
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${active ? "ring-2 ring-accent-pink ring-offset-2" : ""}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `}
      aria-label={label}
      title={label}
    >
      <IconComponent size={iconSizes[size]} strokeWidth={2} />
      {badge !== undefined && badge > 0 && (
        <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-accent-pink text-white text-[10px] font-bold rounded-full flex items-center justify-center">
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </button>
  );
};

/**
 * Nav item with icon + label for bottom navigation
 */
interface NavItemProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  active?: boolean;
  primary?: boolean;
  badge?: number;
  urgentBadge?: boolean; // Makes badge red and pulsing for new notifications
}

export const NavItem = ({
  icon: IconComponent,
  label,
  onClick,
  active = false,
  primary = false,
  badge,
  urgentBadge = false,
}: NavItemProps) => (
  <button
    onClick={onClick}
    className={`
      relative flex flex-col items-center justify-center gap-0.5 py-2 px-2 w-16
      transition-all duration-200 rounded-xl
      ${primary
        ? "bg-gradient-button text-white shadow-lg scale-105 -translate-y-1"
        : active
          ? "text-accent-pink"
          : "text-gray-500 hover:text-accent-pink"
      }
    `}
    aria-label={label}
    aria-current={active ? "page" : undefined}
  >
    <div className="relative">
      <IconComponent
        size={primary ? 24 : 20}
        strokeWidth={active || primary ? 2.5 : 2}
        fill={primary || !active ? "none" : "currentColor"}
      />
      {badge !== undefined && badge > 0 && (
        <>
          <span className={`absolute -top-1 -right-2 min-w-4 h-4 px-0.5 text-white text-[9px] font-bold rounded-full flex items-center justify-center ${
            urgentBadge ? "bg-red-500" : "bg-accent-pink"
          }`}>
            {badge > 9 ? "9+" : badge}
          </span>
          {urgentBadge && (
            <span className="absolute -top-1 -right-2 min-w-4 h-4 bg-red-500 rounded-full animate-ping opacity-50" />
          )}
        </>
      )}
    </div>
    <span className={`text-[10px] font-medium ${primary ? "text-white" : ""}`}>
      {label}
    </span>
  </button>
);
