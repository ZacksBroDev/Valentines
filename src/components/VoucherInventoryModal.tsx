// ============================================================
// VOUCHER INVENTORY MODAL
// Shows available vouchers and redemption status
// Enhanced with filter chips for voucher state machine
// ============================================================

import { useState, useEffect, useMemo } from "react";
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
  Calendar,
  CheckCircle,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { Modal } from "./Modal";
import { useVoucherInventory } from "../api/hooks";
import {
  VoucherInventoryItem,
  VoucherInstance,
  VoucherTemplate,
} from "../api/types";
import { useToast } from "../context/ToastContext";
import {
  submitVoucherRequest,
  fetchVoucherRequests,
  updateVoucherRequestStatus,
  removeVoucherRequest,
  CloudVoucherRequest,
} from "../utils/cloudStorage";

interface VoucherInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Filter chip types for the voucher view
type VoucherFilter = "available" | "pending" | "approved" | "completed";

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
  const availableInstance = item.instances.find(
    (i) => i.status === "AVAILABLE",
  );
  const isLegendary = item.template.rarity === "legendary";
  const isRare = item.template.rarity === "rare";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        relative p-4 rounded-2xl border-2 transition-all
        ${
          item.available > 0
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
        <div
          className={`
          w-12 h-12 rounded-xl flex items-center justify-center
          ${item.available > 0 ? "bg-blush-100 text-accent-pink" : "bg-gray-100 text-gray-400"}
        `}
        >
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
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                item.available > 0
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
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

const RedemptionFlow = ({
  instance: _instance,
  template,
  onConfirm,
  onCancel,
}: RedemptionFlowProps) => {
  void _instance; // Reserved for future use (e.g., showing remaining uses)
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
              ${
                selectedOption === option
                  ? "bg-accent-pink text-white"
                  : "bg-gray-50 hover:bg-blush-50 text-gray-700"
              }
            `}
          >
            <div className="flex items-center gap-3">
              <div
                className={`
                w-5 h-5 rounded-full border-2 flex items-center justify-center
                ${
                  selectedOption === option
                    ? "border-white bg-white"
                    : "border-gray-300"
                }
              `}
              >
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
            ${
              selectedOption && !isSubmitting
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

export const VoucherInventoryModal = ({
  isOpen,
  onClose,
}: VoucherInventoryModalProps) => {
  const {
    inventory,
    isLoading,
    error,
    // pendingRedemptions available for future use
    requestRedemption,
    refreshInventory,
  } = useVoucherInventory();

  const { showUndoToast, showToast } = useToast();

  const [selectedInstance, setSelectedInstance] =
    useState<VoucherInstance | null>(null);
  const [cloudRequests, setCloudRequests] = useState<CloudVoucherRequest[]>([]);
  const [activeFilter, setActiveFilter] = useState<VoucherFilter>("available");

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

  // Categorize requests by status
  const categorizedRequests = useMemo(
    () => ({
      pending: cloudRequests.filter((r) => r.status === "pending"),
      approved: cloudRequests.filter((r) => r.status === "approved"),
      countered: cloudRequests.filter((r) => r.status === "counter-proposed"),
      redeemed: cloudRequests.filter(
        (r) => r.status === "redeemed" || r.status === "archived",
      ),
    }),
    [cloudRequests],
  );

  // Filter counts for chips
  const filterCounts = useMemo(
    () => ({
      available: inventory?.totalAvailable || 0,
      pending:
        categorizedRequests.pending.length +
        categorizedRequests.countered.length,
      approved: categorizedRequests.approved.length,
      completed: categorizedRequests.redeemed.length,
    }),
    [inventory, categorizedRequests],
  );

  // Action handlers for request responses with undo support
  const handleAcceptCounter = async (requestId: string) => {
    const previousStatus = cloudRequests.find(
      (r) => r.id === requestId,
    )?.status;
    await updateVoucherRequestStatus(requestId, "approved");
    fetchVoucherRequests().then(setCloudRequests);

    showUndoToast("Counter accepted!", async () => {
      if (previousStatus) {
        await updateVoucherRequestStatus(
          requestId,
          previousStatus as
            | "pending"
            | "approved"
            | "denied"
            | "counter-proposed"
            | "redeemed"
            | "archived",
        );
        fetchVoucherRequests().then(setCloudRequests);
        showToast("Reverted to previous status", "info");
      }
    });
  };

  const handleMarkRedeemed = async (requestId: string) => {
    const previousStatus = cloudRequests.find(
      (r) => r.id === requestId,
    )?.status;
    await updateVoucherRequestStatus(requestId, "redeemed");
    fetchVoucherRequests().then(setCloudRequests);
    refreshInventory();

    showUndoToast("Marked as redeemed!", async () => {
      if (previousStatus) {
        await updateVoucherRequestStatus(
          requestId,
          previousStatus as
            | "pending"
            | "approved"
            | "denied"
            | "counter-proposed"
            | "redeemed"
            | "archived",
        );
        fetchVoucherRequests().then(setCloudRequests);
        refreshInventory();
        showToast("Reverted to previous status", "info");
      }
    });
  };

  // Legacy filter compatibility
  const counterProposals = categorizedRequests.countered;
  const approvedRequests = categorizedRequests.approved;
  const cloudPending = categorizedRequests.pending;

  const handleRedeem = (instance: VoucherInstance) => {
    setSelectedInstance(instance);
  };

  const handleConfirmRedeem = async (option: string) => {
    if (!selectedInstance) return;

    let cloudRequestId: string | null = null;

    // Sync to cloud for admin to see
    try {
      const cloudResult = await submitVoucherRequest({
        voucherType: selectedInstance.templateType,
        voucherTitle:
          selectedInstance.template?.title || selectedInstance.templateType,
        requestedDate: null,
      });
      cloudRequestId = cloudResult?.id || null;
    } catch (err) {
      if (import.meta.env.DEV) console.error("Failed to sync to cloud:", err);
    }

    // Try local update (may fail but that's ok)
    try {
      await requestRedemption({
        voucherInstanceId: selectedInstance.id,
        selectedOption: option,
      });
    } catch (err) {
      if (import.meta.env.DEV) console.warn("Local redemption failed:", err);
      // Force refresh inventory to update counts anyway
      refreshInventory();
    }

    setSelectedInstance(null);

    // Refresh cloud requests to show the new pending request
    fetchVoucherRequests().then(setCloudRequests);

    // Show undo toast instead of success modal
    showUndoToast("Voucher requested!", async () => {
      if (cloudRequestId) {
        await removeVoucherRequest(cloudRequestId);
        fetchVoucherRequests().then(setCloudRequests);
        refreshInventory();
        showToast("Request cancelled", "info");
      }
    });
  };

  const handleCancelRedeem = () => {
    setSelectedInstance(null);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Vouchers"
      icon={<Ticket size={20} />}
    >
      <AnimatePresence mode="wait">
        {/* Redemption flow */}
        {selectedInstance && selectedInstance.template && (
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

        {/* Inventory list with filter chips */}
        {!selectedInstance && (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {/* Filter Chips */}
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
              {(
                [
                  { key: "available", label: "Available", icon: Gift },
                  { key: "pending", label: "Pending", icon: Clock },
                  { key: "approved", label: "Ready", icon: CheckCircle },
                  { key: "completed", label: "History", icon: Check },
                ] as const
              ).map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveFilter(key)}
                  className={`
                    flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium 
                    whitespace-nowrap transition-all min-h-[36px]
                    ${
                      activeFilter === key
                        ? "bg-accent-pink text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }
                  `}
                >
                  <Icon size={14} />
                  {label}
                  {filterCounts[key] > 0 && (
                    <span
                      className={`
                      ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold
                      ${activeFilter === key ? "bg-white/20" : "bg-gray-200"}
                    `}
                    >
                      {filterCounts[key]}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* AVAILABLE TAB */}
            {activeFilter === "available" && (
              <>
                {/* Month header */}
                {inventory && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      {new Date().toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    <span className="font-medium text-accent-pink">
                      {inventory.totalAvailable} available
                    </span>
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
                    <p className="text-gray-500">
                      No vouchers available this month
                    </p>
                  </div>
                )}
              </>
            )}

            {/* PENDING TAB - Shows requests awaiting response */}
            {activeFilter === "pending" && (
              <div className="space-y-3">
                {/* Counter-proposals - needs action! */}
                {counterProposals.length > 0 && (
                  <>
                    <h4 className="text-xs font-semibold text-amber-600 uppercase tracking-wide flex items-center gap-1">
                      <ArrowRight size={12} />
                      Needs Your Response
                    </h4>
                    {counterProposals.map((request) => (
                      <div
                        key={request.id}
                        className="bg-amber-50 rounded-xl p-4 border-2 border-amber-300"
                      >
                        <div className="flex items-center gap-2 text-amber-700 mb-2">
                          <Calendar size={16} />
                          <span className="text-sm font-bold">
                            Counter-Proposal
                          </span>
                        </div>
                        <p className="font-medium text-gray-800">
                          {request.voucherTitle}
                        </p>
                        {request.counterDate && (
                          <p className="text-sm text-amber-600 mt-1">
                            Suggested:{" "}
                            {new Date(request.counterDate).toLocaleDateString()}
                          </p>
                        )}
                        {request.adminNote && (
                          <p className="text-sm text-gray-600 mt-1 italic">
                            "{request.adminNote}"
                          </p>
                        )}
                        {/* Action buttons */}
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => handleAcceptCounter(request.id)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors min-h-[44px]"
                          >
                            <Check size={16} />
                            Accept Date
                          </button>
                          <button
                            onClick={() => {
                              /* TODO: propose new date */
                            }}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors min-h-[44px]"
                          >
                            <Calendar size={16} />
                            Propose New
                          </button>
                        </div>
                      </div>
                    ))}
                  </>
                )}

                {/* Pending requests */}
                {cloudPending.length > 0 && (
                  <>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Awaiting Response
                    </h4>
                    {cloudPending.map((request) => (
                      <div
                        key={request.id}
                        className="bg-yellow-50 rounded-xl p-4 border border-yellow-200"
                      >
                        <div className="flex items-center gap-2 text-yellow-700">
                          <Clock size={16} />
                          <span className="text-sm font-medium">Pending</span>
                        </div>
                        <p className="font-medium text-gray-800 mt-1">
                          {request.voucherTitle}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Requested{" "}
                          {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </>
                )}

                {/* Empty state */}
                {counterProposals.length === 0 && cloudPending.length === 0 && (
                  <div className="py-8 text-center">
                    <Clock size={48} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500">No pending requests</p>
                  </div>
                )}
              </div>
            )}

            {/* APPROVED TAB - Ready to use */}
            {activeFilter === "approved" && (
              <div className="space-y-3">
                {approvedRequests.length > 0 ? (
                  <>
                    <h4 className="text-xs font-semibold text-green-600 uppercase tracking-wide flex items-center gap-1">
                      <CheckCircle size={12} />
                      Ready to Redeem
                    </h4>
                    {approvedRequests.map((request) => (
                      <div
                        key={request.id}
                        className="bg-green-50 rounded-xl p-4 border-2 border-green-300"
                      >
                        <div className="flex items-center gap-2 text-green-700 mb-2">
                          <Check size={16} />
                          <span className="text-sm font-bold">Approved!</span>
                        </div>
                        <p className="font-medium text-gray-800">
                          {request.voucherTitle}
                        </p>
                        {request.counterDate && (
                          <p className="text-sm text-green-600 mt-1">
                            Scheduled:{" "}
                            {new Date(request.counterDate).toLocaleDateString()}
                          </p>
                        )}
                        {/* Mark as redeemed button */}
                        <button
                          onClick={() => handleMarkRedeemed(request.id)}
                          className="w-full mt-3 flex items-center justify-center gap-1.5 py-2.5 bg-accent-pink text-white rounded-lg text-sm font-medium hover:bg-accent-pink/90 transition-colors min-h-[44px]"
                        >
                          <CheckCircle size={16} />
                          Mark as Redeemed
                        </button>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="py-8 text-center">
                    <CheckCircle
                      size={48}
                      className="mx-auto text-gray-300 mb-3"
                    />
                    <p className="text-gray-500">No approved vouchers yet</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Request a voucher to get started
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* COMPLETED TAB - History */}
            {activeFilter === "completed" && (
              <div className="space-y-3">
                {categorizedRequests.redeemed.length > 0 ? (
                  <>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Redemption History
                    </h4>
                    {categorizedRequests.redeemed.map((request) => (
                      <div
                        key={request.id}
                        className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-gray-800">
                            {request.voucherTitle}
                          </p>
                          <span className="text-xs text-gray-500">
                            {new Date(request.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="py-8 text-center">
                    <Check size={48} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500">
                      No completed redemptions yet
                    </p>
                  </div>
                )}
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
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
};

export default VoucherInventoryModal;
