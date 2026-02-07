import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useRef,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Info, AlertCircle, Undo2 } from "lucide-react";

type ToastType = "success" | "info" | "error" | "undo" | string;

interface Toast {
  id: string;
  message: string;
  type?: ToastType;
  onUndo?: () => void;
  undoLabel?: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
  showUndoToast: (
    message: string, 
    onUndo: () => Promise<void> | void, 
    options?: { undoLabel?: string; duration?: number }
  ) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

const ToastIcon = ({ type }: { type?: ToastType }) => {
  switch (type) {
    case "success":
      return <Check size={16} className="text-green-500" />;
    case "error":
      return <AlertCircle size={16} className="text-red-500" />;
    case "undo":
      return <Undo2 size={16} className="text-accent-pink" />;
    case "info":
    default:
      return <Info size={16} className="text-accent-pink" />;
  }
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timeout = timeoutsRef.current.get(id);
    if (timeout) {
      clearTimeout(timeout);
      timeoutsRef.current.delete(id);
    }
  }, []);

  const showToast = useCallback((message: string, type?: ToastType) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);

    const timeout = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      timeoutsRef.current.delete(id);
    }, 2500);
    
    timeoutsRef.current.set(id, timeout);
  }, []);

  const showUndoToast = useCallback((
    message: string, 
    onUndo: () => Promise<void> | void,
    options?: { undoLabel?: string; duration?: number }
  ) => {
    const id = Date.now().toString();
    const duration = options?.duration || 5000;
    
    const handleUndo = async () => {
      dismissToast(id);
      try {
        await onUndo();
      } catch (error) {
        console.error("Undo action failed:", error);
        showToast("Undo failed. Please try again.", "error");
      }
    };
    
    setToasts((prev) => [...prev, { 
      id, 
      message, 
      type: "undo", 
      onUndo: handleUndo,
      undoLabel: options?.undoLabel || "Undo",
      duration
    }]);

    const timeout = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      timeoutsRef.current.delete(id);
    }, duration);
    
    timeoutsRef.current.set(id, timeout);
  }, [dismissToast, showToast]);

  return (
    <ToastContext.Provider value={{ showToast, showUndoToast, dismissToast }}>
      {children}
      <div className="fixed bottom-24 left-0 right-0 flex flex-col items-center gap-2 z-50 px-4">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              className={`
                bg-white/95 backdrop-blur-sm text-gray-800 px-5 py-3 rounded-full shadow-card text-sm font-medium 
                flex items-center gap-2
                ${toast.onUndo ? "pointer-events-auto" : "pointer-events-none"}
              `}
            >
              <ToastIcon type={toast.type} />
              <span>{toast.message}</span>
              {toast.onUndo && (
                <button
                  onClick={toast.onUndo}
                  className="ml-2 px-3 py-1 bg-accent-pink text-white rounded-full text-xs font-semibold hover:bg-accent-pink/90 transition-colors min-h-[32px] min-w-[44px]"
                >
                  {toast.undoLabel}
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
