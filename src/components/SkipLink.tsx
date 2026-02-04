import { motion } from "framer-motion";

interface SkipLinkProps {
  targetId?: string;
  label?: string;
}

/**
 * Skip to main content link for keyboard users
 * Hidden visually but accessible to screen readers and keyboard navigation
 */
export const SkipLink = ({
  targetId = "main-content",
  label = "Skip to main content",
}: SkipLinkProps) => {
  const handleClick = () => {
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.a
      href={`#${targetId}`}
      onClick={(e) => {
        e.preventDefault();
        handleClick();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          handleClick();
        }
      }}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-white focus:text-accent-pink focus:rounded-lg focus:shadow-lg focus:font-medium focus:outline-none focus:ring-2 focus:ring-accent-pink"
    >
      {label}
    </motion.a>
  );
};

export default SkipLink;
