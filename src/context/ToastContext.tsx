import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Info, AlertCircle } from "lucide-react";

type ToastType = "success" | "info" | "error" | string;

interface Toast {
  id: string;
  message: string;
  type?: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
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
    case "info":
    default:
      return <Info size={16} className="text-accent-pink" />;
  }
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type?: ToastType) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2500);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-24 left-0 right-0 flex flex-col items-center gap-2 pointer-events-none z-50 px-4">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              className="bg-white/95 backdrop-blur-sm text-gray-800 px-5 py-3 rounded-full shadow-card text-sm font-medium flex items-center gap-2"
            >
              <ToastIcon type={toast.type} />
              <span>{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
