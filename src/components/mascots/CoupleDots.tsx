import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export const CoupleDots = () => {
  const [isWinking, setIsWinking] = useState(false);

  // Occasional wink
  useEffect(() => {
    const interval = setInterval(
      () => {
        setIsWinking(true);
        setTimeout(() => setIsWinking(false), 200);
      },
      5000 + Math.random() * 3000,
    );

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative inline-block">
      {/* Floating hearts */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute text-xs opacity-60"
            initial={{
              opacity: 0,
              x: 30 + Math.random() * 20,
              y: 40,
            }}
            animate={{
              opacity: [0, 0.7, 0],
              y: [40, -10],
              x: 30 + Math.random() * 20,
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 1.5,
              ease: "easeOut",
            }}
          >
            💕
          </motion.span>
        ))}
      </div>

      <svg
        viewBox="0 0 80 60"
        className="w-16 h-12"
        aria-label="CoupleDots mascot - two dots leaning together"
      >
        <defs>
          <linearGradient id="pinkDotGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffa0b8" />
            <stop offset="100%" stopColor="#ff6690" />
          </linearGradient>
          <linearGradient id="redDotGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff5588" />
            <stop offset="100%" stopColor="#cc0044" />
          </linearGradient>
          <filter id="dotShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow
              dx="0"
              dy="2"
              stdDeviation="2"
              floodColor="#cc0055"
              floodOpacity="0.35"
            />
          </filter>
        </defs>

        {/* Pink dot (left) - leaning right */}
        <motion.g
          animate={{ rotate: [0, 3, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "25px 35px" }}
        >
          {/* Body */}
          <circle
            cx="25"
            cy="35"
            r="18"
            fill="url(#pinkDotGrad)"
            filter="url(#dotShadow)"
            stroke="#cc0055"
            strokeWidth="1"
          />

          {/* Left eye */}
          <ellipse cx="20" cy="32" rx="3" ry="3.5" fill="#333" />
          <circle cx="19" cy="31" r="1" fill="white" />

          {/* Right eye */}
          <ellipse cx="30" cy="32" rx="3" ry="3.5" fill="#333" />
          <circle cx="29" cy="31" r="1" fill="white" />

          {/* Blush */}
          <ellipse
            cx="17"
            cy="38"
            rx="4"
            ry="2.5"
            fill="#ff9ec4"
            opacity="0.6"
          />
          <ellipse
            cx="33"
            cy="38"
            rx="4"
            ry="2.5"
            fill="#ff9ec4"
            opacity="0.6"
          />

          {/* Smile */}
          <path
            d="M20 42 Q25 47 30 42"
            fill="none"
            stroke="#333"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </motion.g>

        {/* Red dot (right) - leaning left */}
        <motion.g
          animate={{ rotate: [0, -3, 0] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
          style={{ transformOrigin: "55px 35px" }}
        >
          {/* Body */}
          <circle
            cx="55"
            cy="35"
            r="18"
            fill="url(#redDotGrad)"
            filter="url(#dotShadow)"
            stroke="#990033"
            strokeWidth="1"
          />

          {/* Left eye */}
          <motion.ellipse
            cx="50"
            cy="32"
            rx="3"
            ry={isWinking ? 0.5 : 3.5}
            fill="#333"
            transition={{ duration: 0.1 }}
          />
          <circle
            cx="49"
            cy="31"
            r="1"
            fill="white"
            opacity={isWinking ? 0 : 1}
          />

          {/* Right eye */}
          <ellipse cx="60" cy="32" rx="3" ry="3.5" fill="#333" />
          <circle cx="59" cy="31" r="1" fill="white" />

          {/* Blush */}
          <ellipse
            cx="47"
            cy="38"
            rx="4"
            ry="2.5"
            fill="#ffb8ca"
            opacity="0.6"
          />
          <ellipse
            cx="63"
            cy="38"
            rx="4"
            ry="2.5"
            fill="#ffb8ca"
            opacity="0.6"
          />

          {/* Smile */}
          <path
            d="M50 42 Q55 47 60 42"
            fill="none"
            stroke="#333"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </motion.g>

        {/* Small heart between them */}
        <motion.path
          d="M40 20 C38 17 34 17 34 21 C34 24 40 28 40 28 C40 28 46 24 46 21 C46 17 42 17 40 20"
          fill="#ff4da6"
          animate={{
            scale: [1, 1.1, 1],
            y: [0, -2, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ transformOrigin: "40px 22px" }}
        />
      </svg>
    </div>
  );
};
