import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, isTextCard, isVoucherCard, isPlaylistCard } from "../types";
import { RARITIES, StickerKey } from "../config";
import { formatCategory, prefersReducedMotion } from "../utils/helpers";
import { WaxSeal } from "./WaxSeal";
import { StickerDisplay } from "./StickerPicker";
import { redeemVoucher, getRedeemedVouchers } from "../utils/storage";

interface CardProps {
  card: Card | null;
  isFavorite: boolean;
  cardKey: number;
  sticker?: StickerKey;
  onStickerClick?: () => void;
  onVoucherRedeem?: (option: string) => void;
  onSealHint?: () => void;
  isDark?: boolean;
}

// Typewriter text component
const TypewriterText = ({
  text,
  delay = 0,
}: {
  text: string;
  delay?: number;
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const reducedMotion = prefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      setDisplayedText(text);
      return;
    }

    setDisplayedText("");
    const chars = text.split("");
    const totalDuration = 600; // Complete in 600ms
    const charDelay = totalDuration / chars.length;

    let index = 0;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        if (index < chars.length) {
          setDisplayedText(text.slice(0, index + 1));
          index++;
        } else {
          clearInterval(interval);
        }
      }, charDelay);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, delay, reducedMotion]);

  return <>{displayedText}</>;
};

// Equalizer animation for playlist cards
const Equalizer = () => (
  <div className="flex items-end gap-0.5 h-4">
    {[1, 2, 3, 4].map((i) => (
      <motion.div
        key={i}
        className="w-1 bg-accent-pink rounded-full"
        animate={{
          height: ["4px", "16px", "8px", "12px", "4px"],
        }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          delay: i * 0.1,
          ease: "easeInOut",
        }}
      />
    ))}
  </div>
);

export const ComplimentCard = ({
  card,
  isFavorite,
  cardKey,
  sticker,
  onStickerClick,
  onVoucherRedeem,
  onSealHint,
  isDark,
}: CardProps) => {
  const [selectedVoucher, setSelectedVoucher] = useState<string | null>(null);
  const [stickerAnimating, setStickerAnimating] = useState(false);

  // Check if voucher already redeemed
  const redeemedVouchers = useMemo(() => getRedeemedVouchers(), [cardKey]);
  const isVoucherRedeemed =
    card && isVoucherCard(card) && redeemedVouchers[card.id];

  // Handle sticker animation
  useEffect(() => {
    if (sticker) {
      setStickerAnimating(true);
      const timer = setTimeout(() => setStickerAnimating(false), 500);
      return () => clearTimeout(timer);
    }
  }, [sticker]);

  if (!card) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full aspect-[3/4] max-h-[50vh] lg:max-h-[60vh] rounded-2xl bg-gradient-card shadow-card flex flex-col items-center justify-center p-4 sm:p-6 text-center"
      >
        <div className="text-3xl sm:text-4xl lg:text-5xl mb-3">💌</div>
        <p className="text-gray-500 text-xs sm:text-sm lg:text-base">
          Tap "Draw" to reveal a compliment just for you
        </p>
      </motion.div>
    );
  }

  const rarity = RARITIES[card.rarity];
  const isLegendary = card.rarity === "legendary";

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={cardKey}
        initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        exit={{ opacity: 0, scale: 0.95, x: 50 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 25,
          duration: 0.4,
        }}
        className={`relative w-full aspect-[3/4] max-h-[50vh] lg:max-h-[60vh] rounded-2xl lg:rounded-3xl shadow-card overflow-hidden ${
          isDark
            ? "bg-gradient-to-br from-gray-800 to-gray-900"
            : "bg-gradient-card"
        } ${isLegendary ? "ring-2 ring-yellow-400/50" : ""}`}
      >
        {/* Legendary shimmer effect */}
        {isLegendary && (
          <div className="absolute inset-0 opacity-30 pointer-events-none shimmer-legendary" />
        )}

        {/* Paper texture */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Top row: Category + Rarity */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
              card.category === "secret"
                ? "bg-accent-lavender text-purple-700"
                : isDark
                  ? "bg-white/20 text-white"
                  : "bg-blush-100 text-blush-700"
            }`}
          >
            {formatCategory(card.category)}
          </motion.span>

          {/* Rarity icon */}
          <motion.span
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className={`text-sm ${
              card.rarity === "legendary"
                ? "text-yellow-500"
                : card.rarity === "rare"
                  ? "text-purple-400"
                  : "text-gray-300"
            }`}
            title={rarity.label}
          >
            {rarity.icon}
          </motion.span>
        </div>

        {/* Favorite indicator */}
        <AnimatePresence>
          {isFavorite && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute top-8 right-3"
            >
              <span className="text-lg">💖</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 pt-10 sm:pt-12">
          {/* Text Card */}
          {isTextCard(card) && (
            <>
              {card.emoji && (
                <motion.span
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1, type: "spring" }}
                  className="text-3xl sm:text-4xl lg:text-5xl mb-2 sm:mb-4"
                >
                  {card.emoji}
                </motion.span>
              )}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className={`text-sm sm:text-base md:text-lg lg:text-xl text-center font-medium leading-relaxed ${
                  isDark ? "text-white" : "text-gray-800"
                }`}
              >
                "<TypewriterText text={card.text} delay={200} />"
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex gap-1 sm:gap-1.5 mt-2 sm:mt-4"
              >
                {[1, 2, 3].map((level) => (
                  <span
                    key={level}
                    className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-colors ${
                      level <= card.intensity
                        ? "bg-accent-pink"
                        : "bg-blush-200"
                    }`}
                  />
                ))}
              </motion.div>
            </>
          )}

          {/* Voucher Card */}
          {isVoucherCard(card) && (
            <>
              <span className="text-3xl mb-2">{card.emoji || "🎫"}</span>
              <h3
                className={`text-base font-bold mb-2 text-center ${isDark ? "text-white" : "text-gray-800"}`}
              >
                {card.title}
              </h3>
              {isVoucherRedeemed ? (
                <div className="text-center">
                  <p className="text-accent-pink font-medium mb-2">
                    ✓ Redeemed!
                  </p>
                  <p
                    className={`text-sm ${isDark ? "text-gray-300" : "text-gray-500"}`}
                  >
                    {redeemedVouchers[card.id]}
                  </p>
                </div>
              ) : (
                <div className="space-y-2 w-full">
                  {card.options.map((option, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setSelectedVoucher(option);
                        redeemVoucher(card.id, option);
                        onVoucherRedeem?.(option);
                      }}
                      className={`w-full p-3 rounded-xl text-sm transition-all ${
                        selectedVoucher === option
                          ? "bg-accent-pink text-white"
                          : isDark
                            ? "bg-white/10 text-white hover:bg-white/20"
                            : "bg-blush-50 hover:bg-blush-100 text-gray-700"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Playlist Card */}
          {isPlaylistCard(card) && (
            <>
              <span className="text-5xl mb-4">{card.emoji || "🎵"}</span>
              <Equalizer />
              <h3
                className={`text-xl font-bold mt-4 text-center ${isDark ? "text-white" : "text-gray-800"}`}
              >
                {card.songTitle}
              </h3>
              <p
                className={`text-sm mb-4 ${isDark ? "text-gray-300" : "text-gray-500"}`}
              >
                {card.artist}
              </p>
              <a
                href={card.link}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 rounded-full bg-accent-pink text-white text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Listen Now →
              </a>
            </>
          )}
        </div>

        {/* Sticker (if applied) */}
        {sticker && (
          <motion.div
            className="absolute top-14 left-4 cursor-pointer"
            onClick={onStickerClick}
          >
            <StickerDisplay sticker={sticker} isAnimating={stickerAnimating} />
          </motion.div>
        )}

        {/* Sticker button (if no sticker) */}
        {!sticker && onStickerClick && (
          <button
            onClick={onStickerClick}
            className="absolute top-14 left-4 w-10 h-10 rounded-full bg-white/50 hover:bg-white/80 flex items-center justify-center text-lg transition-colors"
            aria-label="Add sticker reaction"
          >
            😊
          </button>
        )}

        {/* Wax seal */}
        <div className="absolute bottom-6 right-6">
          <WaxSeal key={cardKey} onHintReveal={onSealHint} />
        </div>

        {/* Corner flourishes */}
        <div className="absolute top-0 left-0 w-20 h-20 pointer-events-none opacity-20">
          <svg viewBox="0 0 80 80" className="w-full h-full text-blush-300">
            <path d="M0 0 Q40 10 40 40 Q10 40 0 0" fill="currentColor" />
          </svg>
        </div>
        <div className="absolute bottom-0 right-0 w-20 h-20 pointer-events-none opacity-20 rotate-180">
          <svg viewBox="0 0 80 80" className="w-full h-full text-blush-300">
            <path d="M0 0 Q40 10 40 40 Q10 40 0 0" fill="currentColor" />
          </svg>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
