// ============================================================
// useVoucherInventory - Hook for voucher management
// Tamper-proof inventory with monthly reset
// ============================================================

import { useState, useEffect, useCallback } from "react";
import {
  voucherApi,
  getCurrentMonthKey,
} from "../client";
import {
  MonthlyVoucherInventory,
  VoucherInstance,
  Redemption,
  RequestRedemptionInput,
} from "../types";

interface UseVoucherInventoryReturn {
  // Data
  inventory: MonthlyVoucherInventory | null;
  redemptions: Redemption[];
  isLoading: boolean;
  error: string | null;
  
  // Computed
  hasAvailableVouchers: boolean;
  pendingRedemptions: Redemption[];
  
  // Actions
  refreshInventory: () => Promise<void>;
  requestRedemption: (input: RequestRedemptionInput) => Promise<Redemption>;
  completeRedemption: (redemptionId: string) => Promise<Redemption>;
  
  // Helpers
  getAvailableByType: (type: string) => VoucherInstance[];
  canRedeem: (type: string) => boolean;
}

export const useVoucherInventory = (): UseVoucherInventoryReturn => {
  const [inventory, setInventory] = useState<MonthlyVoucherInventory | null>(null);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshInventory = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const monthKey = getCurrentMonthKey();
      const [inv, reds] = await Promise.all([
        voucherApi.getInventory(monthKey),
        voucherApi.getRedemptions(),
      ]);
      
      setInventory(inv);
      setRedemptions(reds);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load inventory");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshInventory();
  }, [refreshInventory]);

  const requestRedemption = useCallback(async (input: RequestRedemptionInput): Promise<Redemption> => {
    try {
      const redemption = await voucherApi.requestRedemption(input);
      
      // Refresh inventory to reflect change
      await refreshInventory();
      
      return redemption;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to request redemption";
      setError(message);
      throw new Error(message);
    }
  }, [refreshInventory]);

  const completeRedemption = useCallback(async (redemptionId: string): Promise<Redemption> => {
    try {
      const redemption = await voucherApi.completeRedemption({ redemptionId });
      
      // Refresh inventory to reflect change
      await refreshInventory();
      
      return redemption;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to complete redemption";
      setError(message);
      throw new Error(message);
    }
  }, [refreshInventory]);

  const getAvailableByType = useCallback((type: string): VoucherInstance[] => {
    if (!inventory) return [];
    const item = inventory.items.find((i) => i.templateType === type);
    return item?.instances.filter((i) => i.status === "AVAILABLE") || [];
  }, [inventory]);

  const canRedeem = useCallback((type: string): boolean => {
    return getAvailableByType(type).length > 0;
  }, [getAvailableByType]);

  return {
    inventory,
    redemptions,
    isLoading,
    error,
    
    hasAvailableVouchers: (inventory?.totalAvailable || 0) > 0,
    pendingRedemptions: redemptions.filter((r) => r.status === "PENDING"),
    
    refreshInventory,
    requestRedemption,
    completeRedemption,
    getAvailableByType,
    canRedeem,
  };
};

export default useVoucherInventory;
