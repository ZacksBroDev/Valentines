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
      className="flex items-center justify-center gap-3 mb-4"
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
            className="absolute -top-1 -right-1 w-5 h-5 bg-accent-lavender rounded-full flex items-center justify-center text-xs"
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
