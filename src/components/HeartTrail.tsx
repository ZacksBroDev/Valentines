import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Heart {
  id: number;
  x: number;
  y: number;
}

interface HeartTrailProps {
  enabled: boolean;
}

export const HeartTrail = ({ enabled }: HeartTrailProps) => {
  const [hearts, setHearts] = useState<Heart[]>([]);
  const [nextId, setNextId] = useState(0);

  const addHeart = useCallback((x: number, y: number) => {
    const id = nextId;
    setNextId((prev) => prev + 1);
    setHearts((prev) => [...prev.slice(-12), { id, x, y }]); // Keep max 12 hearts
    
    // Remove heart after animation
    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => h.id !== id));
    }, 1000);
  }, [nextId]);

  useEffect(() => {
    if (!enabled) return;

    let lastX = 0;
    let lastY = 0;
    let lastTime = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Only add heart if moved enough distance and enough time passed
      if (distance > 40 && now - lastTime > 80) {
        addHeart(e.clientX, e.clientY);
        lastX = e.clientX;
        lastY = e.clientY;
        lastTime = now;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [enabled, addHeart]);

  if (!enabled) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      <AnimatePresence>
        {hearts.map((heart) => (
          <motion.div
            key={heart.id}
            initial={{ 
              opacity: 0.8, 
              scale: 0.5,
              x: heart.x - 8,
              y: heart.y - 8,
            }}
            animate={{ 
              opacity: 0, 
              scale: 1,
              y: heart.y - 40,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute text-accent-pink"
            style={{ fontSize: "16px" }}
          >
            💕
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
