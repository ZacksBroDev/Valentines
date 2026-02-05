// ============================================================
// SHARED DATA STORAGE
// Stores requests, notes, and admin-created cards
// Uses localStorage for MVP, can upgrade to Amplify/DynamoDB
// ============================================================

// ============================================================
// TYPES
// ============================================================

export interface VoucherRequest {
  id: string;
  voucherType: string;
  voucherTitle: string;
  selectedOption: string;
  requestedDate: string | null;
  message: string | null;
  requestedAt: string;
  status: "pending" | "approved" | "denied" | "counter-proposed";
  counterDate?: string;
  counterMessage?: string;
  respondedAt?: string;
}

export interface SharedNote {
  id: string;
  content: string;
  createdAt: string;
  from: "her" | "admin";
  read: boolean;
  cardId?: string; // If attached to a card
}

export interface CustomCard {
  id: string;
  text: string;
  type: "text" | "voucher" | "playlist";
  category: "sweet" | "funny" | "supportive" | "spicy-lite" | "secret";
  rarity: "common" | "rare" | "legendary";
  createdAt: string;
  createdBy: "admin";
  active: boolean;
}

// ============================================================
// STORAGE KEYS
// ============================================================

const STORAGE_KEYS = {
  REQUESTS: "compliment-deck-voucher-requests",
  NOTES: "compliment-deck-shared-notes",
  CUSTOM_CARDS: "compliment-deck-custom-cards",
  LAST_SYNC: "compliment-deck-last-sync",
} as const;

// ============================================================
// REQUEST STORAGE
// ============================================================

export const getRequests = (): VoucherRequest[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.REQUESTS);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const saveRequest = (request: Omit<VoucherRequest, "id" | "requestedAt" | "status">): VoucherRequest => {
  const requests = getRequests();
  const newRequest: VoucherRequest = {
    ...request,
    id: `req_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    requestedAt: new Date().toISOString(),
    status: "pending",
  };
  requests.push(newRequest);
  localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
  return newRequest;
};

export const updateRequestStatus = (
  id: string, 
  status: VoucherRequest["status"],
  counterDate?: string,
  counterMessage?: string
): VoucherRequest | null => {
  const requests = getRequests();
  const index = requests.findIndex(r => r.id === id);
  if (index === -1) return null;
  
  requests[index] = {
    ...requests[index],
    status,
    counterDate,
    counterMessage,
    respondedAt: new Date().toISOString(),
  };
  
  localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
  return requests[index];
};

export const deleteRequest = (id: string): boolean => {
  const requests = getRequests();
  const filtered = requests.filter(r => r.id !== id);
  if (filtered.length === requests.length) return false;
  localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(filtered));
  return true;
};

export const getPendingRequestsCount = (): number => {
  return getRequests().filter(r => r.status === "pending").length;
};

export const getRequestsForUser = (): VoucherRequest[] => {
  // Returns requests that the user (girlfriend) should see
  // - Her pending requests
  // - Counter-proposals waiting for her response
  return getRequests().filter(r => 
    r.status === "pending" || r.status === "counter-proposed"
  );
};

// ============================================================
// SHARED NOTES STORAGE
// ============================================================

export const getSharedNotes = (): SharedNote[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.NOTES);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const addSharedNote = (
  content: string, 
  from: "her" | "admin",
  cardId?: string
): SharedNote => {
  const notes = getSharedNotes();
  const newNote: SharedNote = {
    id: `note_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    content,
    createdAt: new Date().toISOString(),
    from,
    read: from === "admin", // Admin's own notes are already "read"
    cardId,
  };
  notes.push(newNote);
  localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
  return newNote;
};

export const markNoteAsRead = (id: string): void => {
  const notes = getSharedNotes();
  const index = notes.findIndex(n => n.id === id);
  if (index !== -1) {
    notes[index].read = true;
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
  }
};

export const deleteSharedNote = (id: string): boolean => {
  const notes = getSharedNotes();
  const filtered = notes.filter(n => n.id !== id);
  if (filtered.length === notes.length) return false;
  localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(filtered));
  return true;
};

export const getUnreadNotesCount = (forAdmin: boolean): number => {
  const notes = getSharedNotes();
  if (forAdmin) {
    // Admin sees unread notes from "her"
    return notes.filter(n => n.from === "her" && !n.read).length;
  } else {
    // She sees unread notes from "admin"
    return notes.filter(n => n.from === "admin" && !n.read).length;
  }
};

// ============================================================
// CUSTOM CARDS STORAGE
// ============================================================

export const getCustomCards = (): CustomCard[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CUSTOM_CARDS);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const addCustomCard = (
  card: Omit<CustomCard, "id" | "createdAt" | "createdBy" | "active">
): CustomCard => {
  const cards = getCustomCards();
  const newCard: CustomCard = {
    ...card,
    id: `custom_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    createdAt: new Date().toISOString(),
    createdBy: "admin",
    active: true,
  };
  cards.push(newCard);
  localStorage.setItem(STORAGE_KEYS.CUSTOM_CARDS, JSON.stringify(cards));
  return newCard;
};

export const updateCustomCard = (
  id: string, 
  updates: Partial<Omit<CustomCard, "id" | "createdAt" | "createdBy">>
): CustomCard | null => {
  const cards = getCustomCards();
  const index = cards.findIndex(c => c.id === id);
  if (index === -1) return null;
  
  cards[index] = { ...cards[index], ...updates };
  localStorage.setItem(STORAGE_KEYS.CUSTOM_CARDS, JSON.stringify(cards));
  return cards[index];
};

export const deleteCustomCard = (id: string): boolean => {
  const cards = getCustomCards();
  const filtered = cards.filter(c => c.id !== id);
  if (filtered.length === cards.length) return false;
  localStorage.setItem(STORAGE_KEYS.CUSTOM_CARDS, JSON.stringify(filtered));
  return true;
};

export const getActiveCustomCards = (): CustomCard[] => {
  return getCustomCards().filter(c => c.active);
};

// ============================================================
// SYNC HELPERS (for future Amplify integration)
// ============================================================

export const getLastSyncTime = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.LAST_SYNC);
};

export const setLastSyncTime = (): void => {
  localStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
};

// Future: This will sync local data to Amplify
export const syncToCloud = async (): Promise<void> => {
  // TODO: Implement when Amplify is set up
  // 1. Get all local data
  // 2. Push to DynamoDB
  // 3. Pull latest from DynamoDB
  // 4. Merge conflicts
  // 5. Update local storage
  setLastSyncTime();
};

// Future: This will pull data from Amplify
export const syncFromCloud = async (): Promise<void> => {
  // TODO: Implement when Amplify is set up
  setLastSyncTime();
};
