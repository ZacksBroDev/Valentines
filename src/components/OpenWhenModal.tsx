import { motion } from "framer-motion";
import { OPEN_WHEN_CATEGORIES, OpenWhenKey } from "../config";
import { Modal } from "./Modal";

interface OpenWhenModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMode: OpenWhenKey | null;
  onSelectMode: (mode: OpenWhenKey | null) => void;
}

export const OpenWhenModal = ({
  isOpen,
  onClose,
  currentMode,
  onSelectMode,
}: OpenWhenModalProps) => {
  const handleSelect = (mode: OpenWhenKey) => {
    onSelectMode(mode);
    onClose();
  };

  const handleClear = () => {
    onSelectMode(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Open When..." icon="📬">
      <div className="space-y-3">
        <p className="text-gray-500 text-sm mb-4">
          Pick a feeling, and I'll find the perfect words for you.
        </p>

        {(Object.entries(OPEN_WHEN_CATEGORIES) as [OpenWhenKey, typeof OPEN_WHEN_CATEGORIES[OpenWhenKey]][]).map(
          ([key, { label, emoji, description }]) => (
            <motion.button
              key={key}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelect(key)}
              className={`w-full p-4 rounded-2xl text-left transition-all ${
                currentMode === key
                  ? "bg-accent-pink text-white shadow-lg"
                  : "bg-blush-50 hover:bg-blush-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{emoji}</span>
                <div>
                  <p className="font-medium">{label}</p>
                  <p
                    className={`text-sm ${
                      currentMode === key ? "text-white/80" : "text-gray-500"
                    }`}
                  >
                    {description}
                  </p>
                </div>
              </div>
            </motion.button>
          )
        )}

        {currentMode && (
          <button
            onClick={handleClear}
            className="w-full py-3 text-gray-500 text-sm hover:text-gray-700 transition-colors"
          >
            Clear filter & return to normal deck
          </button>
        )}
      </div>
    </Modal>
  );
};
