import { motion } from "framer-motion";

export const WaxSeal = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, rotate: -20 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 15,
        delay: 0.3,
      }}
      className="relative"
    >
      <svg
        viewBox="0 0 60 60"
        className="w-14 h-14"
        aria-label="Wax seal stamp"
      >
        <defs>
          <linearGradient id="sealGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff6b9d" />
            <stop offset="50%" stopColor="#ff4da6" />
            <stop offset="100%" stopColor="#e60054" />
          </linearGradient>
          <filter id="sealShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow
              dx="1"
              dy="2"
              stdDeviation="2"
              floodColor="#a0003a"
              floodOpacity="0.4"
            />
          </filter>
          <filter id="innerGlow">
            <feFlood floodColor="#ffb8ca" floodOpacity="0.5" />
            <feComposite in2="SourceAlpha" operator="in" />
            <feGaussianBlur stdDeviation="2" />
            <feComposite in2="SourceGraphic" operator="atop" />
          </filter>
        </defs>

        {/* Wavy edge seal shape */}
        <path
          d="M30 2
             C35 6 38 4 42 6
             C46 8 48 5 52 8
             C56 11 58 9 58 14
             C58 19 56 21 58 25
             C60 29 58 32 58 36
             C58 40 60 43 56 47
             C52 51 54 53 50 55
             C46 57 44 55 40 57
             C36 59 34 57 30 58
             C26 59 24 57 20 57
             C16 57 14 59 10 55
             C6 51 8 49 4 45
             C0 41 2 38 2 34
             C2 30 0 27 2 23
             C4 19 2 16 4 12
             C6 8 4 6 8 4
             C12 2 14 4 18 3
             C22 2 25 -2 30 2Z"
          fill="url(#sealGradient)"
          filter="url(#sealShadow)"
        />

        {/* Inner circle */}
        <circle
          cx="30"
          cy="30"
          r="18"
          fill="none"
          stroke="#ffb8ca"
          strokeWidth="1.5"
          opacity="0.6"
        />

        {/* Heart icon in center */}
        <path
          d="M30 22
             C28 18 22 18 22 24
             C22 29 30 36 30 36
             C30 36 38 29 38 24
             C38 18 32 18 30 22Z"
          fill="#fff"
          opacity="0.9"
        />

        {/* "For You" text arc - simplified */}
        <text
          x="30"
          y="46"
          textAnchor="middle"
          fill="#fff"
          fontSize="6"
          fontFamily="system-ui, sans-serif"
          fontWeight="600"
          opacity="0.9"
        >
          FOR YOU
        </text>
      </svg>

      {/* Subtle shine effect */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 to-transparent pointer-events-none"
        style={{
          clipPath: "ellipse(40% 30% at 35% 30%)",
        }}
      />
    </motion.div>
  );
};
