// ============================================================
// CLOUD STORAGE - Amplify GraphQL integration
// Syncs voucher requests and notes across devices
// ============================================================

import { generateClient } from "aws-amplify/api";
import {
  listVoucherRequests,
  listSharedNotes,
  listVoucherTemplates,
} from "../graphql/queries";
import {
  createVoucherRequest,
  updateVoucherRequest,
  deleteVoucherRequest as deleteVoucherRequestMutation,
  createSharedNote,
  updateSharedNote,
  deleteSharedNote as deleteSharedNoteMutation,
  createVoucherTemplate,
  updateVoucherTemplate,
  deleteVoucherTemplate as deleteVoucherTemplateMutation,
} from "../graphql/mutations";

// Lazy-initialize the GraphQL client to ensure Amplify is configured first
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _client: any = null;
const getClient = () => {
  if (!_client) {
    _client = generateClient();
  }
  return _client;
};

// ============================================================
// TYPES (match the GraphQL schema)
// Voucher State Machine: AVAILABLE → REQUESTED → APPROVED/COUNTERED/DECLINED → REDEEMED → ARCHIVED
// ============================================================

// Cloud voucher request status types
export type CloudVoucherStatus = 
  | "pending"          // REQUESTED - awaiting admin action
  | "approved"         // APPROVED - ready for use
  | "denied"           // DECLINED - admin rejected
  | "counter-proposed" // COUNTERED - admin suggested alternative
  | "redeemed"         // REDEEMED - successfully used
  | "archived";        // ARCHIVED - historical record

export interface CloudVoucherRequest {
  id: string;
  voucherType: string;
  voucherTitle: string;
  requestedDate: string | null;
  status: CloudVoucherStatus;
  counterDate?: string | null;
  adminNote?: string | null;
  redeemedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  owner?: string | null;
}

export interface CloudSharedNote {
  id: string;
  content: string;
  from: "her" | "admin";
  read: boolean;
  createdAt: string;
  updatedAt: string;
  owner?: string | null;
}

// ============================================================
// VOUCHER REQUESTS - Cloud operations
// ============================================================

/**
 * Fetch all voucher requests from the cloud
 */
export const fetchVoucherRequests = async (): Promise<CloudVoucherRequest[]> => {
  try {
    const response = await getClient().graphql({
      query: listVoucherRequests,
      authMode: "apiKey", // Use API key for public access
    });
    
    const data = response as { data?: { listVoucherRequests?: { items?: CloudVoucherRequest[] } } };
    const items = data?.data?.listVoucherRequests?.items || [];
    return items.filter((item): item is CloudVoucherRequest => item !== null);
  } catch (error) {
    console.error("Error fetching voucher requests:", error);
    return [];
  }
};

/**
 * Create a new voucher request in the cloud
 */
export const submitVoucherRequest = async (request: {
  voucherType: string;
  voucherTitle: string;
  requestedDate?: string | null;
}): Promise<CloudVoucherRequest | null> => {
  console.log("🚀 submitVoucherRequest called with:", request);
  try {
    const input = {
      voucherType: request.voucherType,
      voucherTitle: request.voucherTitle,
      requestedDate: request.requestedDate || null,
      status: "pending",
    };
    console.log("📤 Sending to GraphQL:", input);
    
    const response = await getClient().graphql({
      query: createVoucherRequest,
      variables: { input },
      authMode: "apiKey",
    });
    
    console.log("✅ GraphQL response:", response);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (response as any)?.data?.createVoucherRequest as CloudVoucherRequest;
  } catch (error) {
    console.error("❌ Error creating voucher request:", error);
    return null;
  }
};

/**
 * Update a voucher request status (admin action)
 */
export const updateVoucherRequestStatus = async (
  id: string,
  status: "pending" | "approved" | "denied" | "counter-proposed" | "redeemed" | "archived",
  counterDate?: string,
  adminNote?: string
): Promise<CloudVoucherRequest | null> => {
  try {
    const response = await getClient().graphql({
      query: updateVoucherRequest,
      variables: {
        input: {
          id,
          status,
          counterDate: counterDate || null,
          adminNote: adminNote || null,
        },
      },
      authMode: "apiKey",
    });
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (response as any)?.data?.updateVoucherRequest as CloudVoucherRequest;
  } catch (error) {
    console.error("Error updating voucher request:", error);
    return null;
  }
};

/**
 * Delete a voucher request
 */
export const removeVoucherRequest = async (id: string): Promise<boolean> => {
  try {
    await getClient().graphql({
      query: deleteVoucherRequestMutation,
      variables: {
        input: { id },
      },
      authMode: "apiKey",
    });
    return true;
  } catch (error) {
    console.error("Error deleting voucher request:", error);
    return false;
  }
};

/**
 * Get pending requests count
 */
export const fetchPendingRequestsCount = async (): Promise<number> => {
  const requests = await fetchVoucherRequests();
  return requests.filter(r => r.status === "pending").length;
};

// ============================================================
// SHARED NOTES - Cloud operations
// ============================================================

/**
 * Fetch all shared notes from the cloud
 */
export const fetchSharedNotes = async (): Promise<CloudSharedNote[]> => {
  try {
    const response = await getClient().graphql({
      query: listSharedNotes,
      authMode: "apiKey",
    });
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const items = (response as any)?.data?.listSharedNotes?.items || [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return items.filter((item: any) => item !== null) as CloudSharedNote[];
  } catch (error) {
    console.error("Error fetching shared notes:", error);
    return [];
  }
};

/**
 * Create a new shared note in the cloud
 */
export const submitSharedNote = async (
  content: string,
  from: "her" | "admin"
): Promise<CloudSharedNote | null> => {
  try {
    const response = await getClient().graphql({
      query: createSharedNote,
      variables: {
        input: {
          content,
          from,
          read: from === "admin", // Admin's notes are pre-read from admin's perspective
        },
      },
      authMode: "apiKey",
    });
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (response as any)?.data?.createSharedNote as CloudSharedNote;
  } catch (error) {
    console.error("Error creating shared note:", error);
    return null;
  }
};

/**
 * Mark a note as read
 */
export const markCloudNoteAsRead = async (id: string): Promise<boolean> => {
  try {
    await getClient().graphql({
      query: updateSharedNote,
      variables: {
        input: {
          id,
          read: true,
        },
      },
      authMode: "apiKey",
    });
    return true;
  } catch (error) {
    console.error("Error marking note as read:", error);
    return false;
  }
};

/**
 * Delete a shared note
 */
export const removeSharedNote = async (id: string): Promise<boolean> => {
  try {
    await getClient().graphql({
      query: deleteSharedNoteMutation,
      variables: {
        input: { id },
      },
      authMode: "apiKey",
    });
    return true;
  } catch (error) {
    console.error("Error deleting shared note:", error);
    return false;
  }
};

/**
 * Get unread notes count
 */
export const fetchUnreadNotesCount = async (forAdmin: boolean): Promise<number> => {
  const notes = await fetchSharedNotes();
  if (forAdmin) {
    // Admin sees unread notes from "her"
    return notes.filter(n => n.from === "her" && !n.read).length;
  } else {
    // She sees unread notes from "admin"
    return notes.filter(n => n.from === "admin" && !n.read).length;
  }
};

// ============================================================
// VOUCHER TEMPLATES - Cloud operations (synced across devices)
// ============================================================

export interface CloudVoucherTemplate {
  id: string;
  type: string;
  title: string;
  description: string;
  options: string[];
  monthlyLimit: number;
  iconName: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Fetch all voucher templates from the cloud
 */
export const fetchVoucherTemplates = async (): Promise<CloudVoucherTemplate[]> => {
  try {
    const response = await getClient().graphql({
      query: listVoucherTemplates,
      authMode: "apiKey",
    });
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const items = (response as any)?.data?.listVoucherTemplates?.items || [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return items.filter((item: any) => item !== null) as CloudVoucherTemplate[];
  } catch (error) {
    console.error("Error fetching voucher templates:", error);
    return [];
  }
};

/**
 * Create a new voucher template
 */
export const createCloudVoucherTemplate = async (template: {
  type: string;
  title: string;
  description: string;
  options: string[];
  monthlyLimit: number;
  iconName: string;
}): Promise<CloudVoucherTemplate | null> => {
  try {
    const response = await getClient().graphql({
      query: createVoucherTemplate,
      variables: { input: template },
      authMode: "apiKey",
    });
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (response as any)?.data?.createVoucherTemplate as CloudVoucherTemplate;
  } catch (error) {
    console.error("Error creating voucher template:", error);
    return null;
  }
};

/**
 * Update a voucher template
 */
export const updateCloudVoucherTemplate = async (
  id: string,
  updates: Partial<{
    type: string;
    title: string;
    description: string;
    options: string[];
    monthlyLimit: number;
    iconName: string;
  }>
): Promise<CloudVoucherTemplate | null> => {
  try {
    const response = await getClient().graphql({
      query: updateVoucherTemplate,
      variables: { input: { id, ...updates } },
      authMode: "apiKey",
    });
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (response as any)?.data?.updateVoucherTemplate as CloudVoucherTemplate;
  } catch (error) {
    console.error("Error updating voucher template:", error);
    return null;
  }
};

/**
 * Delete a voucher template
 */
export const deleteCloudVoucherTemplate = async (id: string): Promise<boolean> => {
  try {
    await getClient().graphql({
      query: deleteVoucherTemplateMutation,
      variables: { input: { id } },
      authMode: "apiKey",
    });
    return true;
  } catch (error) {
    console.error("Error deleting voucher template:", error);
    return false;
  }
};

/**
 * Get rarity based on monthly limit
 */
export const getRarityFromLimit = (monthlyLimit: number): "legendary" | "rare" | "common" => {
  if (monthlyLimit === 1) return "legendary";
  if (monthlyLimit <= 3) return "rare";
  return "common";
};
