import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { Modal } from "./Modal";
import { THEMES, ThemeKey, CONFIG } from "../config";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ThemeKey;
  unlockedThemes: ThemeKey[];
  onThemeChange: (theme: ThemeKey) => void;
  dailyModeEnabled: boolean;
  onDailyModeToggle: () => void;
  heartTrailEnabled: boolean;
  onHeartTrailToggle: () => void;
  reduceMotionEnabled: boolean;
  onReduceMotionToggle: () => void;
  noRepeatEnabled: boolean;
  onNoRepeatToggle: () => void;
  reasonsLogged: number;
}

const Toggle = ({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: () => void;
}) => (
  <button
    onClick={onToggle}
    className={`w-10 h-5 rounded-full transition-colors relative flex-shrink-0 ${
      enabled ? "bg-accent-pink" : "bg-gray-300"
    }`}
    aria-checked={enabled}
    role="switch"
  >
    <motion.div
      className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow"
      animate={{ left: enabled ? 20 : 2 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    />
  </button>
);

export const SettingsModal = ({
  isOpen,
  onClose,
  currentTheme,
  unlockedThemes,
  onThemeChange,
  dailyModeEnabled,
  onDailyModeToggle,
  heartTrailEnabled,
  onHeartTrailToggle,
  reduceMotionEnabled,
  onReduceMotionToggle,
  noRepeatEnabled,
  onNoRepeatToggle,
  reasonsLogged,
}: SettingsModalProps) => {
  const isDesktop =
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: fine)").matches;

  const getUnlockHint = (key: ThemeKey) => {
    if (key === "lavender") return `${CONFIG.milestones.lavenderTheme} reasons`;
    if (key === "night") return `${CONFIG.milestones.nightTheme} reasons`;
    if (key === "sunset") return `${CONFIG.milestones.sunsetTheme} reasons`;
    return "";
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Settings">
      <div className="space-y-2">
        {/* Theme Section */}
        <div>
          <div className="grid grid-cols-2 gap-1">
            {(
              Object.entries(THEMES) as [ThemeKey, (typeof THEMES)[ThemeKey]][]
            ).map(([key, theme]) => {
              const isUnlocked = unlockedThemes.includes(key);
              const isActive = currentTheme === key;

              return (
                <motion.button
                  key={key}
                  whileTap={isUnlocked ? { scale: 0.97 } : undefined}
                  onClick={() => isUnlocked && onThemeChange(key)}
                  disabled={!isUnlocked}
                  className={`py-1.5 px-2 rounded-lg text-left transition-all relative ${
                    isActive
                      ? "ring-2 ring-accent-pink"
                      : isUnlocked
                        ? ""
                        : "opacity-50 cursor-not-allowed"
                  }`}
                  style={{ background: theme.gradient }}
                >
                  <span
                    className={`text-xs font-medium ${key === "night" ? "text-white" : "text-gray-700"}`}
                  >
                    {theme.name}
                  </span>
                  {!isUnlocked && (
                    <span className="absolute top-0.5 right-1">
                      <Lock size={10} className="text-gray-500" />
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
          <p className="text-[10px] text-gray-400 mt-1">
            {reasonsLogged} logged •{" "}
            {reasonsLogged < CONFIG.milestones.lavenderTheme
              ? `Next: ${getUnlockHint("lavender")}`
              : reasonsLogged < CONFIG.milestones.nightTheme
                ? `Next: ${getUnlockHint("night")}`
                : reasonsLogged < CONFIG.milestones.sunsetTheme
                  ? `Next: ${getUnlockHint("sunset")}`
                  : "All unlocked!"}
          </p>
        </div>

        {/* Toggles */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-gray-100">
          <span className="text-xs text-gray-700">Daily Mode</span>
          <Toggle enabled={dailyModeEnabled} onToggle={onDailyModeToggle} />
        </div>

        <div className="flex items-center justify-between gap-2">
          <div>
            <span className="text-xs text-gray-700">Reduce Motion</span>
            <p className="text-[10px] text-gray-400">Disables typing animation</p>
          </div>
          <Toggle enabled={reduceMotionEnabled} onToggle={onReduceMotionToggle} />
        </div>

        <div className="flex items-center justify-between gap-2">
          <div>
            <span className="text-xs text-gray-700">No Repeat</span>
            <p className="text-[10px] text-gray-400">Don't show seen cards</p>
          </div>
          <Toggle enabled={noRepeatEnabled} onToggle={onNoRepeatToggle} />
        </div>

        {isDesktop && (
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-gray-700">Heart Trail ✨</span>
            <Toggle enabled={heartTrailEnabled} onToggle={onHeartTrailToggle} />
          </div>
        )}
      </div>
    </Modal>
  );
};
