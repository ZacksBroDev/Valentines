import { motion, AnimatePresence } from "framer-motion";
import { ReactNode, useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon?: string;
  children: ReactNode;
}

export const Modal = ({ isOpen, onClose, title, icon, children }: ModalProps) => {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
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
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-50 max-h-[50vh] bg-white rounded-t-2xl shadow-2xl overflow-hidden flex flex-col safe-bottom"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-blush-100 flex-shrink-0">
              <h2
                id="modal-title"
                className="text-base font-semibold text-gray-800 flex items-center gap-2"
              >
                {icon && <span>{icon}</span>}
                {title}
              </h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full hover:bg-blush-50 flex items-center justify-center transition-colors text-sm"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-3">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
