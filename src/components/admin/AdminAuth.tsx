// ============================================================
// ADMIN AUTH - Simple PIN entry for admin access
// ============================================================

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, X, Shield } from "lucide-react";

interface AdminAuthProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// Store PIN hash in localStorage (set on first use)
const ADMIN_PIN_KEY = "compliment-deck-admin-pin";
const ADMIN_SESSION_KEY = "compliment-deck-admin-session";

// Simple hash function for PIN (not cryptographically secure, but fine for this use case)
const hashPin = (pin: string): string => {
  let hash = 0;
  for (let i = 0; i < pin.length; i++) {
    const char = pin.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32-bit integer
  }
  return hash.toString(36);
};

export const AdminAuth = ({ isOpen, onClose, onSuccess }: AdminAuthProps) => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isSettingPin, setIsSettingPin] = useState(false);
  const [confirmPin, setConfirmPin] = useState("");

  const storedPinHash = localStorage.getItem(ADMIN_PIN_KEY);
  const needsSetup = !storedPinHash;

  const handlePinChange = (value: string) => {
    // Only allow digits, exactly 4
    const digits = value.replace(/\D/g, "").slice(0, 4);
    setPin(digits);
    setError("");
  };

  const handleConfirmChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    setConfirmPin(digits);
    setError("");
  };

  const handleSubmit = () => {
    if (needsSetup || isSettingPin) {
      // Setting up new PIN
      if (pin.length !== 4) {
        setError("PIN must be exactly 4 digits");
        return;
      }
      if (pin !== confirmPin) {
        setError("PINs don't match");
        return;
      }
      // Save PIN hash
      localStorage.setItem(ADMIN_PIN_KEY, hashPin(pin));
      localStorage.setItem(ADMIN_SESSION_KEY, Date.now().toString());
      onSuccess();
    } else if (hashPin(pin) === storedPinHash) {
      // Verifying existing PIN - correct
      localStorage.setItem(ADMIN_SESSION_KEY, Date.now().toString());
      onSuccess();
    } else {
      // Verifying existing PIN - incorrect
      setError("Incorrect PIN");
      setPin("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-accent-pink" />
              <h2 className="text-lg font-semibold text-gray-800">
                {needsSetup || isSettingPin ? "Set Admin PIN" : "Admin Access"}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-500 mb-4">
            {needsSetup || isSettingPin
              ? "Create a PIN to protect admin features. Only you (the admin) should know this."
              : "Enter your PIN to access admin features."
            }
          </p>

          {/* PIN Input */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {needsSetup || isSettingPin ? "Create PIN" : "Enter PIN"}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={pin}
                  onChange={(e) => handlePinChange(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="••••••"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent-pink focus:border-transparent text-center text-2xl tracking-widest"
                  autoFocus
                />
              </div>
            </div>

            {/* Confirm PIN (when setting up) */}
            {(needsSetup || isSettingPin) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm PIN
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={confirmPin}
                    onChange={(e) => handleConfirmChange(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="••••••"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent-pink focus:border-transparent text-center text-2xl tracking-widest"
                  />
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-500 text-center"
              >
                {error}
              </motion.p>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={pin.length < 4}
              className={`
                w-full py-3 rounded-xl font-semibold transition-all
                ${pin.length >= 4
                  ? "bg-accent-pink text-white hover:bg-accent-pink/90"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }
              `}
            >
              {needsSetup || isSettingPin ? "Set PIN & Enter" : "Enter Admin Mode"}
            </button>

            {/* Reset PIN option */}
            {!needsSetup && !isSettingPin && (
              <button
                onClick={() => setIsSettingPin(true)}
                className="w-full text-sm text-gray-500 hover:text-gray-700"
              >
                Forgot PIN? Reset it
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Check if admin session is still valid (24 hours)
export const isAdminSessionValid = (): boolean => {
  const session = localStorage.getItem(ADMIN_SESSION_KEY);
  if (!session) return false;
  const sessionTime = parseInt(session, 10);
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;
  return now - sessionTime < oneDay;
};

// Clear admin session
export const clearAdminSession = () => {
  localStorage.removeItem(ADMIN_SESSION_KEY);
};

export default AdminAuth;
