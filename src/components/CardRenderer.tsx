import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, isTextCard, isVoucherCard, isPlaylistCard } from "../types";
import { RARITIES } from "../config";
import { withPet } from "../data/cards";
import { formatCategory, prefersReducedMotion } from "../utils/helpers";
import { redeemVoucher, getRedeemedVouchers } from "../utils/storage";
import { CATEGORY_ICONS } from "./icons";
import { Heart, Mail, Circle, Diamond, Star } from "lucide-react";

interface CardProps {
  card: Card | null;
  isFavorite: boolean;
  cardKey: number;
  onSave?: () => void;
  onVoucherRedeem?: (option: string) => void;
  isDark?: boolean;
  reduceMotion?: boolean;
}

// Typewriter text component
const TypewriterText = ({
  text,
  delay = 0,
  forceReduceMotion = false,
}: {
  text: string;
  delay?: number;
  forceReduceMotion?: boolean;
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const systemReducedMotion = prefersReducedMotion();
  const reducedMotion = forceReduceMotion || systemReducedMotion;

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
  onSave,
  onVoucherRedeem,
  isDark,
  reduceMotion,
}: CardProps) => {
  const [selectedVoucher, setSelectedVoucher] = useState<string | null>(null);

  // Check if voucher already redeemed
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const redeemedVouchers = useMemo(() => getRedeemedVouchers(), [card?.id]);
  const isVoucherRedeemed =
    card && isVoucherCard(card) && redeemedVouchers[card.id];

  if (!card) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full aspect-[3/4] max-h-[42vh] sm:max-h-[50vh] lg:max-h-[60vh] rounded-2xl bg-gradient-card shadow-card flex flex-col items-center justify-center p-4 sm:p-6 text-center"
      >
        <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-blush-100 flex items-center justify-center mb-3">
          <Mail size={28} className="text-accent-pink" />
        </div>
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
        className={`relative w-full aspect-[3/4] max-h-[42vh] sm:max-h-[50vh] lg:max-h-[60vh] rounded-2xl lg:rounded-3xl shadow-card overflow-hidden ${
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
          {(() => {
            const CategoryIcon = CATEGORY_ICONS[card.category];
            return (
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
                <CategoryIcon size={10} strokeWidth={2.5} />
                {formatCategory(card.category)}
              </motion.span>
            );
          })()}

          {/* Rarity label with icon */}
          {(() => {
            const RarityIcon = card.rarity === "legendary" ? Star : card.rarity === "rare" ? Diamond : Circle;
            return (
              <motion.span
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                  card.rarity === "legendary"
                    ? "bg-yellow-100 text-yellow-700"
                    : card.rarity === "rare"
                      ? "bg-purple-100 text-purple-600"
                      : isDark ? "bg-white/10 text-gray-300" : "bg-gray-100 text-gray-500"
                }`}
                title={rarity.label}
              >
                <RarityIcon size={10} strokeWidth={2.5} fill={card.rarity !== "common" ? "currentColor" : "none"} />
                {rarity.label}
              </motion.span>
            );
          })()}
        </div>

        {/* Favorite button - top-right with proper 44px hit area */}
        {onSave && (
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onSave();
            }}
            whileTap={{ scale: 0.85 }}
            whileHover={{ scale: 1.1 }}
            className={`absolute top-10 right-3 z-20 w-11 h-11 min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center shadow-md transition-all cursor-pointer ${
              isFavorite 
                ? "bg-accent-pink text-white" 
                : isDark ? "bg-white/10 hover:bg-white/20 text-gray-400" : "bg-white/90 hover:bg-white text-gray-400 hover:text-accent-pink"
            }`}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            type="button"
          >
            <motion.div
              key={isFavorite ? "saved" : "unsaved"}
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500 }}
            >
              <Heart 
                size={20} 
                strokeWidth={2} 
                fill={isFavorite ? "currentColor" : "none"}
              />
            </motion.div>
          </motion.button>
        )}

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
                "<TypewriterText text={withPet(card.text)} delay={200} forceReduceMotion={reduceMotion} />"
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
                        redeemVoucher(card.id, option, card.title);
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
      </motion.div>
    </AnimatePresence>
  );
};
