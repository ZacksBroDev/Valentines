import { motion, AnimatePresence } from "framer-motion";
import { STICKERS, StickerKey } from "../config";

interface StickerPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (sticker: StickerKey) => void;
  currentSticker?: StickerKey;
}

export const StickerPicker = ({
  isOpen,
  onClose,
  onSelect,
  currentSticker,
}: StickerPickerProps) => {
  const handleSelect = (key: StickerKey) => {
    onSelect(key);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-xl p-2 flex gap-1 z-50"
        >
          {(Object.entries(STICKERS) as [StickerKey, typeof STICKERS[StickerKey]][]).map(
            ([key, { emoji, label }]) => (
              <motion.button
                key={key}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleSelect(key)}
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-colors ${
                  currentSticker === key
                    ? "bg-blush-100"
                    : "hover:bg-blush-50"
                }`}
                title={label}
                aria-label={`React with ${label}`}
              >
                {emoji}
              </motion.button>
            )
          )}

          {/* Arrow pointer */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 shadow-sm" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Display sticker on card
interface StickerDisplayProps {
  sticker: StickerKey;
  isAnimating?: boolean;
}

export const StickerDisplay = ({ sticker, isAnimating }: StickerDisplayProps) => {
  const { emoji } = STICKERS[sticker];

  return (
    <motion.div
      initial={isAnimating ? { scale: 0, rotate: -30 } : false}
      animate={{ scale: 1, rotate: 0 }}
      transition={
        isAnimating
          ? { type: "spring", stiffness: 400, damping: 15 }
          : undefined
      }
      className="text-3xl drop-shadow-lg"
    >
      {emoji}
    </motion.div>
  );
};
