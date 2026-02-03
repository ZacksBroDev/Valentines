import { HeartBuddy } from "./HeartBuddy";
import { CoupleDots } from "./CoupleDots";
import { Envelope } from "./Envelope";
import { motion } from "framer-motion";

interface MascotsProps {
  onHeartBuddyTap: () => void;
  onHeartBuddyLongPress?: () => void;
  isHeartBuddyBlushing?: boolean;
  showFloatingHeart?: boolean;
  isEnvelopeOpen?: boolean;
  secretUnlocked?: boolean;
}

export const Mascots = ({
  onHeartBuddyTap,
  onHeartBuddyLongPress,
  isHeartBuddyBlushing,
  showFloatingHeart,
  isEnvelopeOpen,
  secretUnlocked,
}: MascotsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="flex items-center justify-center gap-3 mb-2 scale-75 lg:scale-100 bg-white/40 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-sm"
    >
      <CoupleDots />

      <div className="relative">
        <HeartBuddy
          onTap={onHeartBuddyTap}
          onLongPress={onHeartBuddyLongPress}
          isBlusing={isHeartBuddyBlushing}
          showFloatingHeart={showFloatingHeart}
        />
        {secretUnlocked && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-4 h-4 bg-accent-lavender rounded-full flex items-center justify-center text-[10px]"
            title="Secret deck unlocked!"
          >
            🔓
          </motion.div>
        )}
      </div>

      <Envelope isOpen={isEnvelopeOpen} />
    </motion.div>
  );
};
