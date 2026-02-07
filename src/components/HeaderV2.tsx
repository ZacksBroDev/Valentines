// ============================================================
// HEADER V2 - Simplified with Lucide icons
// Top actions: Settings, Stats, Logo, Vouchers
// ============================================================

import { motion } from "framer-motion";
import { Settings, BarChart3, Ticket, Volume2, VolumeX, History } from "lucide-react";
import { IconButton } from "./icons";

interface HeaderV2Props {
  onOpenSettings: () => void;
  onOpenStats: () => void;
  onOpenVouchers: () => void;
  onOpenSeenCards?: () => void;
  onToggleMute: () => void;
  onAdminLongPress?: () => void;
  isMuted: boolean;
  voucherCount?: number;
  seenCount?: number;
  totalCards?: number;
  isDark?: boolean;
}

export const HeaderV2 = ({
  onOpenSettings,
  onOpenStats,
  onOpenVouchers,
  onOpenSeenCards,
  onToggleMute,
  onAdminLongPress,
  isMuted,
  voucherCount = 0,
  seenCount = 0,
  totalCards = 0,
  isDark = false,
}: HeaderV2Props) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full flex items-center justify-between px-3 py-2"
    >
      {/* Left actions */}
      <div className="flex items-center gap-1.5">
        <IconButton
          icon={isMuted ? VolumeX : Volume2}
          label={isMuted ? "Unmute sounds" : "Mute sounds"}
          onClick={onToggleMute}
          size="sm"
          variant="ghost"
          className={isDark ? "bg-white/20 hover:bg-white/30 text-white" : ""}
        />
        <IconButton
          icon={Settings}
          label="Settings (hold for admin)"
          onClick={onOpenSettings}
          onLongPress={onAdminLongPress}
          size="sm"
          variant="ghost"
          className={isDark ? "bg-white/20 hover:bg-white/30 text-white" : ""}
        />
      </div>

      {/* Center: Logo + Card Count */}
      <div className="flex flex-col items-center">
        <h1
          className={`text-sm font-semibold tracking-tight ${
            isDark ? "text-white" : "text-accent-pink"
          }`}
        >
          Compliment Deck
        </h1>
        {totalCards > 0 && (
          <button
            onClick={onOpenSeenCards}
            className={`text-[10px] mt-0.5 px-2 py-0.5 rounded-full flex items-center gap-1 transition-colors ${
              isDark 
                ? "text-white/70 hover:bg-white/10" 
                : "text-gray-500 hover:bg-blush-50"
            }`}
          >
            <History size={10} />
            {Math.min(seenCount, totalCards)} / {totalCards} cards
          </button>
        )}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1.5">
        <IconButton
          icon={BarChart3}
          label="Stats"
          onClick={onOpenStats}
          size="sm"
          variant="ghost"
          className={isDark ? "bg-white/20 hover:bg-white/30 text-white" : ""}
        />
        <IconButton
          icon={Ticket}
          label="Vouchers"
          onClick={onOpenVouchers}
          size="sm"
          variant="ghost"
          badge={voucherCount > 0 ? voucherCount : undefined}
          className={isDark ? "bg-white/20 hover:bg-white/30 text-white" : ""}
        />
      </div>
    </motion.header>
  );
};

export default HeaderV2;
