import { motion, AnimatePresence } from "framer-motion";
import { ReactNode, useEffect, useRef } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon?: ReactNode; // Changed from string to ReactNode for Lucide icons
  children: ReactNode;
  fullHeight?: boolean; // Option for taller modals
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  icon,
  children,
  fullHeight = false,
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll and touch-move when open
  useEffect(() => {
    if (isOpen) {
      // Store original values
      const originalOverflow = document.body.style.overflow;
      const originalPosition = document.body.style.position;
      const originalWidth = document.body.style.width;
      const originalTop = document.body.style.top;
      const scrollY = window.scrollY;

      // Lock body scroll
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.top = `-${scrollY}px`;

      // Prevent touchmove on backdrop
      const preventTouchMove = (e: TouchEvent) => {
        // Allow scrolling inside modal content
        if (modalRef.current?.contains(e.target as Node)) {
          return;
        }
        e.preventDefault();
      };
      document.addEventListener("touchmove", preventTouchMove, { passive: false });

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.position = originalPosition;
        document.body.style.width = originalWidth;
        document.body.style.top = originalTop;
        window.scrollTo(0, scrollY);
        document.removeEventListener("touchmove", preventTouchMove);
      };
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl shadow-2xl overflow-hidden flex flex-col safe-bottom ${
              fullHeight ? "max-h-[85vh]" : "max-h-[60vh]"
            }`}
          >
            {/* Drag handle for mobile */}
            <div className="flex justify-center pt-2 pb-1">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>

            {/* Header - 44px minimum height */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-blush-100 flex-shrink-0 min-h-[44px]">
              <h2
                id="modal-title"
                className="text-base font-semibold text-gray-800 flex items-center gap-2"
              >
                {icon && <span className="text-accent-pink">{icon}</span>}
                {title}
              </h2>
              <button
                onClick={onClose}
                className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full hover:bg-blush-50 flex items-center justify-center transition-colors -mr-2"
                aria-label="Close"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto overscroll-contain p-4">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
