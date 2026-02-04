import { motion } from "framer-motion";

interface LoadingScreenProps {
  theme?: string;
}

/**
 * Loading screen shown while the app initializes
 */
export const LoadingScreen = ({ theme = "blush" }: LoadingScreenProps) => {
  return (
    <div
      className={`min-h-screen hearts-bg hearts-pattern flex items-center justify-center theme-${theme}`}
      role="status"
      aria-label="Loading compliment deck"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="text-5xl"
        aria-hidden="true"
      >
        💕
      </motion.div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingScreen;
