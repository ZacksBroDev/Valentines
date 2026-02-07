import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, isTextCard, isVoucherCard, isPlaylistCard } from "../types";
import { RARITIES } from "../config";
import { withPet } from "../data/cards";
import { formatCategory, prefersReducedMotion } from "../utils/helpers";
import { redeemVoucher, getRedeemedVouchers } from "../utils/storage";
import { CATEGORY_ICONS } from "./icons";
import { Heart, Mail, Circle, Diamond, Star, Ticket, Music, Clock, Check } from "lucide-react";

// Anniversary date constant
const ANNIVERSARY_DATE = new Date("2024-04-13T00:00:00");

interface CardProps {
  card: Card | null;
  isFavorite: boolean;
  cardKey: number;
  onSave?: () => void;
  onVoucherRedeem?: (option: string) => void;
  isDark?: boolean;
  reduceMotion?: boolean;
}

// Anniversary counter component - updates every second when visible
const AnniversaryCounter = ({ isDark }: { isDark?: boolean }) => {
  const [now, setNow] = useState(new Date());
  
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  const getTimeDiff = useCallback(() => {
    const diff = now.getTime() - ANNIVERSARY_DATE.getTime();
    
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    return {
      days,
      hours: hours % 24,
      minutes: minutes % 60,
      seconds: seconds % 60,
    };
  }, [now]);
  
  const time = getTimeDiff();
  
  return (
    <div className="flex flex-col items-center gap-3">
      {/* Days - prominent */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <span className={`text-4xl sm:text-5xl font-bold ${isDark ? "text-white" : "text-accent-pink"}`}>
          {time.days.toLocaleString()}
        </span>
        <p className={`text-xs sm:text-sm ${isDark ? "text-gray-300" : "text-gray-500"}`}>days</p>
      </motion.div>
      
      {/* Hours, Minutes, Seconds row */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex gap-3 sm:gap-4"
      >
        {[
          { value: time.hours, label: "hrs" },
          { value: time.minutes, label: "min" },
          { value: time.seconds, label: "sec" },
        ].map(({ value, label }) => (
          <div key={label} className="text-center min-w-[40px]">
            <span className={`text-lg sm:text-xl font-semibold tabular-nums ${isDark ? "text-white" : "text-gray-700"}`}>
              {value.toString().padStart(2, "0")}
            </span>
            <p className={`text-[10px] ${isDark ? "text-gray-400" : "text-gray-400"}`}>{label}</p>
          </div>
        ))}
      </motion.div>
      
      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className={`text-xs sm:text-sm text-center mt-1 ${isDark ? "text-gray-300" : "text-gray-600"}`}
      >
        ...and I'm still obsessed with you
      </motion.p>
    </div>
  );
};

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
  const [justRedeemed, setJustRedeemed] = useState(false);

  // Check if voucher already redeemed
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const redeemedVouchers = useMemo(() => getRedeemedVouchers(), [card?.id]);
  const isVoucherRedeemed =
    justRedeemed || (card && isVoucherCard(card) && redeemedVouchers[card.id]);

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

        {/* Favorite button - top-right with proper 44px hit area (hidden for vouchers) */}
        {onSave && !isVoucherCard(card) && (
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
          {/* Anniversary Counter Card - special handling */}
          {isTextCard(card) && card.id === "anniversary-counter" && (
            <>
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, type: "spring" }}
                className="mb-2 sm:mb-4"
              >
                <Clock size={48} className="text-accent-pink" />
              </motion.div>
              <AnniversaryCounter isDark={isDark} />
            </>
          )}
          
          {/* Regular Text Card */}
          {isTextCard(card) && card.id !== "anniversary-counter" && (
            <>
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, type: "spring" }}
                className="mb-2 sm:mb-4"
              >
                {(() => {
                  const CategoryIcon = CATEGORY_ICONS[card.category] || Heart;
                  return <CategoryIcon size={48} className="text-accent-pink" />;
                })()}
              </motion.div>
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
            </>
          )}

          {/* Voucher Card */}
          {isVoucherCard(card) && (
            <>
              <Ticket size={32} className="text-accent-pink mb-2" />
              <h3
                className={`text-base font-bold mb-2 text-center ${isDark ? "text-white" : "text-gray-800"}`}
              >
                {card.title}
              </h3>
              {isVoucherRedeemed ? (
                <div className="text-center">
                  <p className="text-accent-pink font-medium mb-2">
                    ✓ Added to your stockpile!
                  </p>
                  <p
                    className={`text-sm ${isDark ? "text-gray-300" : "text-gray-500"}`}
                  >
                    {redeemedVouchers[card.id]}
                  </p>
                </div>
              ) : (
                <div className="space-y-2 w-full">
                  <p className={`text-xs text-center mb-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    Pick an option:
                  </p>
                  {card.options.map((option, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedVoucher(option)}
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
                  
                  {/* Redeem button - only shows after selection */}
                  <AnimatePresence>
                    {selectedVoucher && (
                      <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        onClick={() => {
                          redeemVoucher(card.id, selectedVoucher, card.title);
                          setJustRedeemed(true);
                          onVoucherRedeem?.(selectedVoucher);
                        }}
                        className="w-full mt-3 p-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-medium text-sm transition-colors flex items-center justify-center gap-2"
                      >
                        <Check size={16} />
                        Redeem This Voucher
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </>
          )}

          {/* Playlist Card */}
          {isPlaylistCard(card) && (
            <>
              <Music size={48} className="text-accent-pink mb-4" />
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
