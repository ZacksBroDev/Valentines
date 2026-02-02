import { motion } from 'framer-motion';

interface HeaderProps {
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenFavorites: () => void;
  favoritesCount: number;
}

export const Header = ({ isMuted, onToggleMute, onOpenFavorites, favoritesCount }: HeaderProps) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full flex items-center justify-between px-4 py-3 safe-top"
    >
      {/* Sound toggle */}
      <button
        onClick={onToggleMute}
        className="w-10 h-10 rounded-full bg-white/70 backdrop-blur-sm shadow-sm flex items-center justify-center text-lg hover:bg-white transition-colors btn-press"
        aria-label={isMuted ? 'Unmute sounds' : 'Mute sounds'}
        title={isMuted ? 'Unmute sounds' : 'Mute sounds'}
      >
        {isMuted ? '🔇' : '🔊'}
      </button>

      {/* Title */}
      <div className="flex flex-col items-center">
        <h1 className="text-lg font-semibold text-accent-pink tracking-tight">
          Compliment Deck
        </h1>
        <span className="text-xs text-blush-500 opacity-70">made with 💕</span>
      </div>

      {/* Favorites button */}
      <button
        onClick={onOpenFavorites}
        className="relative w-10 h-10 rounded-full bg-white/70 backdrop-blur-sm shadow-sm flex items-center justify-center text-lg hover:bg-white transition-colors btn-press"
        aria-label={`View favorites (${favoritesCount})`}
        title="View favorites"
      >
        💝
        {favoritesCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-accent-pink text-white text-xs font-bold rounded-full flex items-center justify-center"
          >
            {favoritesCount > 99 ? '99+' : favoritesCount}
          </motion.span>
        )}
      </button>
    </motion.header>
  );
};
