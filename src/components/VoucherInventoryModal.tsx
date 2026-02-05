// ============================================================
// VOUCHER INVENTORY MODAL
// Shows available vouchers and redemption status
// ============================================================

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Ticket,
  Check,
  Clock,
  ChevronRight,
  Gift,
  Flower2,
  Heart,
  Mountain,
  Film,
  UtensilsCrossed,
  Star,
  Coffee,
  Music,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { Modal } from "./Modal";
import { useVoucherInventory } from "../api/hooks";
import { VoucherInventoryItem, VoucherInstance, VoucherTemplate } from "../api/types";
import { submitVoucherRequest, fetchVoucherRequests, CloudVoucherRequest } from "../utils/cloudStorage";
import { Calendar } from "lucide-react";

interface VoucherInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Map icon names to Lucide components
const ICON_MAP: Record<string, LucideIcon> = {
  Gift,
  Flower2,
  Heart,
  Mountain,
  Film,
  UtensilsCrossed,
  Star,
  Coffee,
  Music,
  Sparkles,
  Ticket,
};

// Helper to get icon from template
const getVoucherIcon = (template: VoucherTemplate): LucideIcon => {
  if (template.iconName && ICON_MAP[template.iconName]) {
    return ICON_MAP[template.iconName];
  }
  return Gift;
};

interface VoucherCardProps {
  item: VoucherInventoryItem;
  onRedeem: (instance: VoucherInstance) => void;
}

const VoucherCard = ({ item, onRedeem }: VoucherCardProps) => {
  const Icon = getVoucherIcon(item.template);
  const availableInstance = item.instances.find((i) => i.status === "AVAILABLE");
  const isLegendary = item.template.rarity === "legendary";
  const isRare = item.template.rarity === "rare";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        relative p-4 rounded-2xl border-2 transition-all
        ${item.available > 0
          ? "bg-white border-blush-200 hover:border-accent-pink cursor-pointer"
          : "bg-gray-50 border-gray-200 opacity-60"
        }
        ${isLegendary ? "ring-2 ring-yellow-200" : ""}
        ${isRare ? "ring-2 ring-purple-200" : ""}
      `}
      onClick={() => availableInstance && onRedeem(availableInstance)}
    >
      {/* Rarity badge */}
      {isLegendary && (
        <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
          Legendary
        </div>
      )}
      {isRare && (
        <div className="absolute -top-2 -right-2 bg-purple-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
          Rare
        </div>
      )}

      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`
          w-12 h-12 rounded-xl flex items-center justify-center
          ${item.available > 0 ? "bg-blush-100 text-accent-pink" : "bg-gray-100 text-gray-400"}
        `}>
          <Icon size={24} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-800 text-sm">
            {item.template.title}
          </h4>
          <p className="text-xs text-gray-500 mt-0.5">
            {item.template.description}
          </p>

          {/* Status counts */}
          <div className="flex items-center gap-2 mt-2">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
              item.available > 0 ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
            }`}>
              {item.available} available
            </span>
            {item.pending > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-yellow-100 text-yellow-700">
                {item.pending} pending
              </span>
            )}
            {item.used > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-500">
                {item.used} used
              </span>
            )}
          </div>
        </div>

        {/* Arrow if available */}
        {item.available > 0 && (
          <ChevronRight size={20} className="text-gray-400" />
        )}
      </div>
    </motion.div>
  );
};

interface RedemptionFlowProps {
  instance: VoucherInstance;
  template: VoucherTemplate;
  onConfirm: (option: string) => Promise<void>;
  onCancel: () => void;
}

const RedemptionFlow = ({ instance: _instance, template, onConfirm, onCancel }: RedemptionFlowProps) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const Icon = getVoucherIcon(template);

  const handleConfirm = async () => {
    if (!selectedOption) return;
    setIsSubmitting(true);
    try {
      await onConfirm(selectedOption);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-blush-100 flex items-center justify-center mb-3">
          <Icon size={32} className="text-accent-pink" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">
          {template.title}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Choose how you'd like to redeem this voucher
        </p>
      </div>

      {/* Options */}
      <div className="space-y-2">
        {template.options.map((option) => (
          <button
            key={option}
            onClick={() => setSelectedOption(option)}
            className={`
              w-full p-3 rounded-xl text-left transition-all
              ${selectedOption === option
                ? "bg-accent-pink text-white"
                : "bg-gray-50 hover:bg-blush-50 text-gray-700"
              }
            `}
          >
            <div className="flex items-center gap-3">
              <div className={`
                w-5 h-5 rounded-full border-2 flex items-center justify-center
                ${selectedOption === option
                  ? "border-white bg-white"
                  : "border-gray-300"
                }
              `}>
                {selectedOption === option && (
                  <Check size={12} className="text-accent-pink" />
                )}
              </div>
              <span className="text-sm font-medium">{option}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={onCancel}
          className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleConfirm}
          disabled={!selectedOption || isSubmitting}
          className={`
            flex-1 py-3 rounded-xl font-medium transition-all
            ${selectedOption && !isSubmitting
              ? "bg-gradient-button text-white"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }
          `}
        >
          {isSubmitting ? "Redeeming..." : "Redeem"}
        </button>
      </div>
    </div>
  );
};

export const VoucherInventoryModal = ({ isOpen, onClose }: VoucherInventoryModalProps) => {
  const {
    inventory,
    isLoading,
    error,
    pendingRedemptions,
    requestRedemption,
    refreshInventory,
  } = useVoucherInventory();

  const [selectedInstance, setSelectedInstance] = useState<VoucherInstance | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [cloudRequests, setCloudRequests] = useState<CloudVoucherRequest[]>([]);
  
  // Fetch cloud requests to show counter-proposals and approved requests
  useEffect(() => {
    if (isOpen) {
      fetchVoucherRequests().then(setCloudRequests);
      // Poll every 30 seconds
      const interval = setInterval(() => {
        fetchVoucherRequests().then(setCloudRequests);
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);
  
  // Filter for counter-proposals and approved requests
  const counterProposals = cloudRequests.filter(r => r.status === "counter-proposed");
  const approvedRequests = cloudRequests.filter(r => r.status === "approved");
  const cloudPending = cloudRequests.filter(r => r.status === "pending");

  const handleRedeem = (instance: VoucherInstance) => {
    setSelectedInstance(instance);
  };

  const handleConfirmRedeem = async (option: string) => {
    if (!selectedInstance) return;
    
    // ALWAYS sync to cloud for admin to see, regardless of local success
    console.log("📤 Syncing voucher request to cloud...");
    try {
      const cloudResult = await submitVoucherRequest({
        voucherType: selectedInstance.templateType,
        voucherTitle: selectedInstance.template?.title || selectedInstance.templateType,
        requestedDate: null,
      });
      console.log("✅ Voucher request synced to cloud:", cloudResult);
    } catch (err) {
      console.error("❌ Failed to sync to cloud:", err);
    }
    
    // Try local update (may fail but that's ok)
    try {
      await requestRedemption({
        voucherInstanceId: selectedInstance.id,
        selectedOption: option,
      });
    } catch (err) {
      console.warn("Local redemption failed (ok, cloud sync already done):", err);
      // Force refresh inventory to update counts anyway
      refreshInventory();
    }
    
    setSelectedInstance(null);
    setShowSuccess(true);
    
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const handleCancelRedeem = () => {
    setSelectedInstance(null);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Redeemables" icon={<Ticket size={20} />}>
      <AnimatePresence mode="wait">
        {/* Success state */}
        {showSuccess && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="py-8 text-center"
          >
            <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4">
              <Check size={32} className="text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Voucher Requested!</h3>
            <p className="text-sm text-gray-500 mt-1">
              Your partner will see this redemption request
            </p>
          </motion.div>
        )}

        {/* Redemption flow */}
        {selectedInstance && selectedInstance.template && !showSuccess && (
          <motion.div
            key="redeem"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <RedemptionFlow
              instance={selectedInstance}
              template={selectedInstance.template}
              onConfirm={handleConfirmRedeem}
              onCancel={handleCancelRedeem}
            />
          </motion.div>
        )}

        {/* Inventory list */}
        {!selectedInstance && !showSuccess && (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {/* Month header */}
            {inventory && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">
                  {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </span>
                <span className="font-medium text-accent-pink">
                  {inventory.totalAvailable} available
                </span>
              </div>
            )}

            {/* Counter-proposals from Admin - IMPORTANT! */}
            {counterProposals.length > 0 && (
              <div className="space-y-2">
                {counterProposals.map(request => (
                  <div key={request.id} className="bg-amber-50 rounded-xl p-4 border-2 border-amber-300">
                    <div className="flex items-center gap-2 text-amber-700 mb-2">
                      <Calendar size={16} />
                      <span className="text-sm font-bold">Counter-Proposal!</span>
                    </div>
                    <p className="font-medium text-gray-800">{request.voucherTitle}</p>
                    {request.counterDate && (
                      <p className="text-sm text-amber-600 mt-1">
                        📅 Suggested date: {new Date(request.counterDate).toLocaleDateString()}
                      </p>
                    )}
                    {request.adminNote && (
                      <p className="text-sm text-gray-600 mt-1 italic">"{request.adminNote}"</p>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {/* Approved requests - Celebrate! */}
            {approvedRequests.length > 0 && (
              <div className="space-y-2">
                {approvedRequests.map(request => (
                  <div key={request.id} className="bg-green-50 rounded-xl p-4 border-2 border-green-300">
                    <div className="flex items-center gap-2 text-green-700">
                      <Check size={16} />
                      <span className="text-sm font-bold">Approved! 🎉</span>
                    </div>
                    <p className="font-medium text-gray-800">{request.voucherTitle}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Cloud pending redemptions */}
            {cloudPending.length > 0 && (
              <div className="bg-yellow-50 rounded-xl p-3 border border-yellow-200">
                <div className="flex items-center gap-2 text-yellow-700">
                  <Clock size={16} />
                  <span className="text-sm font-medium">
                    {cloudPending.length} pending redemption{cloudPending.length > 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            )}

            {/* Loading */}
            {isLoading && (
              <div className="py-8 text-center text-gray-500">
                Loading vouchers...
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="py-4 text-center text-red-500 text-sm">
                {error}
              </div>
            )}

            {/* Voucher list */}
            {inventory && (
              <div className="space-y-3">
                {inventory.items.map((item) => (
                  <VoucherCard
                    key={item.templateType}
                    item={item}
                    onRedeem={handleRedeem}
                  />
                ))}
              </div>
            )}

            {/* Empty state */}
            {inventory && inventory.items.length === 0 && (
              <div className="py-8 text-center">
                <Gift size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">No vouchers available</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
};

export default VoucherInventoryModal;
