// ============================================================
// API TYPES - TypeScript types for backend data
// These mirror the GraphQL schema
// ============================================================

// Voucher Status State Machine:
// AVAILABLE → REQUESTED → (APPROVED | COUNTERED | DECLINED) → REDEEMED → ARCHIVED
// 
// State transitions:
// - AVAILABLE: Fresh voucher, ready to be requested
// - REQUESTED: User has requested to redeem (pending admin action)
// - APPROVED: Admin approved the request (ready for use)
// - COUNTERED: Admin proposed a different date/time
// - DECLINED: Admin declined (returns to AVAILABLE or ARCHIVED)
// - REDEEMED: Successfully used
// - ARCHIVED: Historical record (used or expired)
// - EXPIRED: Monthly voucher that expired without use

// Enums - Enhanced voucher state machine
export type VoucherStatus = 
  | "AVAILABLE"   // Ready to request
  | "REQUESTED"   // Pending admin approval
  | "APPROVED"    // Admin approved, ready to use
  | "COUNTERED"   // Admin proposed alternative
  | "DECLINED"    // Admin declined
  | "REDEEMED"    // Successfully used
  | "ARCHIVED"    // Historical record
  | "EXPIRED";    // Unused and expired

// Redemption status - tracks a specific redemption request/fulfillment
export type RedemptionStatus = 
  | "REQUESTED"   // User requested redemption
  | "APPROVED"    // Admin approved the request
  | "COMPLETED"   // Redemption was fulfilled
  | "CANCELLED"   // User or admin cancelled
  | "PENDING";    // Legacy: awaiting action

// User Profile
export interface UserProfile {
  id: string;
  owner: string;
  displayName: string;
  
  // Settings
  theme: string;
  soundEnabled: boolean;
  heartTrailEnabled: boolean;
  dailyModeEnabled: boolean;
  
  // Streaks
  currentDrawStreak: number;
  longestDrawStreak: number;
  currentLoveStreak: number;
  longestLoveStreak: number;
  lastDrawDate: string | null;
  lastLoveLogDate: string | null;
  
  // Progress
  totalDraws: number;
  reasonsLogged: number;
  loveMeterValue: number;
  
  // Seen cards
  seenCardIds: string[];
  
  // Couple
  coupleId: string | null;
  
  createdAt: string;
  updatedAt: string;
}

// Couple
export interface Couple {
  id: string;
  inviteCode: string;
  members: string[];
  memberNames: string[];
  secretsUnlocked: string[];
  secretDeckActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Favorite
export interface Favorite {
  id: string;
  coupleId: string;
  userId: string;
  cardId: string;
  createdAt: string;
}

// Note
export interface Note {
  id: string;
  coupleId: string;
  authorId: string;
  authorName: string;
  content: string;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}

// Reaction
export interface Reaction {
  id: string;
  coupleId: string;
  userId: string;
  cardId: string;
  reactionType: "love" | "lol" | "aww" | "fave";
  createdAt: string;
}

// Secret Progress
export interface SecretProgress {
  id: string;
  coupleId: string;
  members: string[];
  unlockedSecretIds: string[];
  secretTapCount: number;
  secretDeckUnlocked: boolean;
  createdAt: string;
  updatedAt: string;
}

// Voucher Template
export interface VoucherTemplate {
  id: string;
  type: string;
  title: string;
  description: string | null;
  options: string[];
  monthlyLimit: number;
  rarity: "rare" | "legendary" | "common";
  emoji: string | null;
  iconName: string | null;
  createdAt: string;
  updatedAt: string;
}

// Voucher Instance
export interface VoucherInstance {
  id: string;
  coupleId: string;
  coupleMembers: string[];
  templateId: string;
  templateType: string;
  monthKey: string;
  status: VoucherStatus;
  version: number;
  redemptionId: string | null;
  template?: VoucherTemplate;
  createdAt: string;
  updatedAt: string;
}

// Redemption
export interface Redemption {
  id: string;
  coupleId: string;
  coupleMembers: string[];
  voucherInstanceId: string;
  voucherTemplateType: string;
  requestedByUserId: string;
  requestedByName: string;
  selectedOption: string;
  requestedForDate: string | null;
  message: string | null;
  status: RedemptionStatus;
  createdAt: string;
  completedAt: string | null;
  completedByUserId: string | null;
}

// Daily Log
export interface DailyLog {
  id: string;
  owner: string;
  date: string;
  cardsDrawn: number;
  cardIdsDrawn: string[];
  loveLogged: boolean;
  loveLogMessage: string | null;
  favoritesSaved: number;
  reactionsGiven: number;
  recapShown: boolean;
  recapCompleted: boolean;
  topCardId: string | null;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// INPUT TYPES for mutations
// ============================================================

export interface CreateUserProfileInput {
  displayName: string;
  theme?: string;
}

export interface UpdateUserProfileInput {
  id: string;
  displayName?: string;
  theme?: string;
  soundEnabled?: boolean;
  heartTrailEnabled?: boolean;
  dailyModeEnabled?: boolean;
  seenCardIds?: string[];
  // Streak fields
  currentDrawStreak?: number;
  longestDrawStreak?: number;
  currentLoveStreak?: number;
  longestLoveStreak?: number;
  lastDrawDate?: string | null;
  lastLoveLogDate?: string | null;
  totalDraws?: number;
  reasonsLogged?: number;
}

export interface CreateCoupleInput {
  memberNames: string[];
}

export interface JoinCoupleInput {
  inviteCode: string;
  displayName: string;
}

export interface CreateFavoriteInput {
  cardId: string;
}

export interface CreateNoteInput {
  content: string;
  isPrivate?: boolean;
}

export interface CreateReactionInput {
  cardId: string;
  reactionType: "love" | "lol" | "aww" | "fave";
}

export interface RequestRedemptionInput {
  voucherInstanceId: string;
  selectedOption: string;
  requestedForDate?: string;
  message?: string;
}

export interface CompleteRedemptionInput {
  redemptionId: string;
}

export interface LogDrawInput {
  cardId: string;
}

export interface LogLoveInput {
  message?: string;
}

// ============================================================
// VOUCHER INVENTORY for display
// ============================================================

export interface VoucherInventoryItem {
  templateType: string;
  template: VoucherTemplate;
  instances: VoucherInstance[];
  available: number;
  pending: number;
  used: number;
  total: number;
}

export interface MonthlyVoucherInventory {
  monthKey: string;
  items: VoucherInventoryItem[];
  totalAvailable: number;
  totalUsed: number;
}

// ============================================================
// STREAK INFO
// ============================================================

export interface StreakInfo {
  currentDrawStreak: number;
  longestDrawStreak: number;
  currentLoveStreak: number;
  longestLoveStreak: number;
  lastDrawDate: string | null;
  lastLoveLogDate: string | null;
  drewToday: boolean;
  loggedLoveToday: boolean;
}

// ============================================================
// STATS AGGREGATE
// ============================================================

export interface UserStats {
  totalDraws: number;
  reasonsLogged: number;
  loveMeterValue: number;
  favoritesCount: number;
  notesCount: number;
  reactionsCount: number;
  secretsUnlockedCount: number;
  streaks: StreakInfo;
}
