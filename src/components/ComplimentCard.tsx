import { motion, AnimatePresence } from "framer-motion";
import { Heart, Smile, Shield, Flame, Lock } from "lucide-react";
import { Compliment, withPet } from "../data/compliments";
import { formatCategory } from "../utils/helpers";
import { WaxSeal } from "./WaxSeal";

// Category icons mapping
const CATEGORY_ICONS = {
  sweet: Heart,
  funny: Smile,
  supportive: Shield,
  "spicy-lite": Flame,
  secret: Lock,
} as const;

interface ComplimentCardProps {
  compliment: Compliment | null;
  isFavorite: boolean;
  cardKey: number;
}

export const ComplimentCard = ({
  compliment,
  isFavorite,
  cardKey,
}: ComplimentCardProps) => {
  if (!compliment) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-sm mx-auto aspect-[3/4] rounded-3xl bg-gradient-card shadow-card flex flex-col items-center justify-center p-8 text-center"
      >
        <div className="mb-4">
          <Heart size={64} className="text-accent-pink" />
        </div>
        <p className="text-gray-500 text-lg">
          Tap "Draw" to reveal a compliment just for you
        </p>
      </motion.div>
    );
  }

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
        className="relative w-full max-w-sm mx-auto aspect-[3/4] rounded-3xl bg-gradient-card shadow-card overflow-hidden"
      >
        {/* Subtle paper texture effect */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Category badge */}
        <div className="absolute top-4 left-4">
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
              compliment.category === "secret"
                ? "bg-accent-lavender text-purple-700"
                : "bg-blush-100 text-blush-700"
            }`}
          >
            {formatCategory(compliment.category)}
          </motion.span>
        </div>

        {/* Favorite indicator */}
        <AnimatePresence>
          {isFavorite && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute top-4 right-4"
            >
              <Heart size={24} className="text-accent-pink fill-accent-pink" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 pt-16">
          {/* Category Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, type: "spring" }}
            className="mb-6"
          >
            {(() => {
              const CategoryIcon = CATEGORY_ICONS[compliment.category] || Heart;
              return <CategoryIcon size={48} className="text-accent-pink" />;
            })()}
          </motion.div>

          {/* Compliment text */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-xl md:text-2xl text-gray-700 text-center font-medium leading-relaxed"
          >
            "{withPet(compliment.text)}"
          </motion.p>

          {/* Intensity dots */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex gap-1.5 mt-6"
          >
            {[1, 2, 3].map((level) => (
              <span
                key={level}
                className={`w-2 h-2 rounded-full transition-colors ${
                  level <= compliment.intensity
                    ? "bg-accent-pink"
                    : "bg-blush-200"
                }`}
              />
            ))}
          </motion.div>
        </div>

        {/* Wax seal stamp */}
        <div className="absolute bottom-6 right-6">
          <WaxSeal key={cardKey} />
        </div>

        {/* Decorative corner flourishes */}
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
