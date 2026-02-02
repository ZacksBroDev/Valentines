import { motion } from "framer-motion";

interface EnvelopeProps {
  isOpen?: boolean;
}

export const Envelope = ({ isOpen = false }: EnvelopeProps) => {
  return (
    <svg
      viewBox="0 0 80 60"
      className="w-14 h-10"
      aria-label="Cute envelope mascot"
    >
      <defs>
        <linearGradient id="envelopeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fff5f7" />
          <stop offset="100%" stopColor="#ffe8ed" />
        </linearGradient>
        <linearGradient
          id="envelopeFlapGrad"
          x1="0%"
          y1="100%"
          x2="100%"
          y2="0%"
        >
          <stop offset="0%" stopColor="#ffb8ca" />
          <stop offset="100%" stopColor="#ffd6e0" />
        </linearGradient>
        <filter
          id="envelopeShadow"
          x="-10%"
          y="-10%"
          width="120%"
          height="120%"
        >
          <feDropShadow
            dx="0"
            dy="2"
            stdDeviation="2"
            floodColor="#ff4da6"
            floodOpacity="0.2"
          />
        </filter>
      </defs>

      {/* Envelope body */}
      <rect
        x="5"
        y="20"
        width="70"
        height="38"
        rx="4"
        fill="url(#envelopeGrad)"
        stroke="#ffb8ca"
        strokeWidth="2"
        filter="url(#envelopeShadow)"
      />

      {/* Bottom triangle fold */}
      <path
        d="M5 58 L40 38 L75 58"
        fill="url(#envelopeGrad)"
        stroke="#ffb8ca"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Flap - animated */}
      <motion.path
        d="M5 20 L40 42 L75 20"
        fill="url(#envelopeFlapGrad)"
        stroke="#ff8aa8"
        strokeWidth="2"
        strokeLinejoin="round"
        animate={{
          d: isOpen ? "M5 20 L40 5 L75 20" : "M5 20 L40 42 L75 20",
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        style={{ transformOrigin: "40px 20px" }}
      />

      {/* Heart seal */}
      <motion.path
        d="M40 30 C38 27 34 27 34 31 C34 34 40 38 40 38 C40 38 46 34 46 31 C46 27 42 27 40 30"
        fill="#ff4da6"
        animate={{
          scale: isOpen ? [1, 1.2, 0] : 1,
          opacity: isOpen ? [1, 1, 0] : 1,
        }}
        transition={{ duration: 0.3 }}
        style={{ transformOrigin: "40px 32px" }}
      />

      {/* Eyes on flap when closed */}
      {!isOpen && (
        <>
          <circle cx="32" cy="28" r="2.5" fill="#333" />
          <circle cx="31" cy="27" r="0.8" fill="white" />
          <circle cx="48" cy="28" r="2.5" fill="#333" />
          <circle cx="47" cy="27" r="0.8" fill="white" />
          {/* Tiny smile */}
          <path
            d="M36 32 Q40 35 44 32"
            fill="none"
            stroke="#333"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </>
      )}
    </svg>
  );
};
