import { motion } from "framer-motion";
import { MOODS, MoodKey } from "../config";

interface MoodPickerProps {
  currentMood: MoodKey;
  onSelectMood: (mood: MoodKey) => void;
  accentColor?: string;
}

export const MoodPicker = ({
  currentMood,
  onSelectMood,
  accentColor,
}: MoodPickerProps) => {
  return (
    <div className="flex items-center justify-center gap-2 flex-wrap">
      {(Object.entries(MOODS) as [MoodKey, typeof MOODS[MoodKey]][]).map(
        ([key, { label, emoji }]) => (
          <motion.button
            key={key}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectMood(key)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              currentMood === key
                ? "bg-accent-pink text-white shadow-md"
                : "bg-white/60 text-gray-600 hover:bg-white"
            }`}
            style={
              currentMood === key && accentColor
                ? { backgroundColor: accentColor }
                : undefined
            }
          >
            <span className="mr-1">{emoji}</span>
            {label}
          </motion.button>
        )
      )}
    </div>
  );
};
