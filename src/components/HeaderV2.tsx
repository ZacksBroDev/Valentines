// ============================================================
// HEADER V2 - Simplified with Lucide icons
// Top actions: Settings, Stats, Logo, Vouchers
// ============================================================

import { motion } from "framer-motion";
import { Settings, BarChart3, Ticket, Volume2, VolumeX } from "lucide-react";
import { IconButton } from "./icons";

interface HeaderV2Props {
  onOpenSettings: () => void;
  onOpenStats: () => void;
  onOpenVouchers: () => void;
  onToggleMute: () => void;
  onAdminLongPress?: () => void;
  isMuted: boolean;
  voucherCount?: number;
  isDark?: boolean;
}

export const HeaderV2 = ({
  onOpenSettings,
  onOpenStats,
  onOpenVouchers,
  onToggleMute,
  onAdminLongPress,
  isMuted,
  voucherCount = 0,
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

      {/* Center: Logo */}
      <div className="flex flex-col items-center">
        <h1
          className={`text-sm font-semibold tracking-tight ${
            isDark ? "text-white" : "text-accent-pink"
          }`}
        >
          Compliment Deck
        </h1>
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
          label="Redeemables"
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
