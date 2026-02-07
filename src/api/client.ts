// ============================================================
// API CLIENT - Amplify API wrapper
// Provides typed access to GraphQL operations
// ============================================================

// NOTE: This file assumes Amplify is configured.
// Uncomment the actual Amplify imports after running `amplify push`

/*
import { API, graphqlOperation } from 'aws-amplify';
import { GraphQLResult } from '@aws-amplify/api-graphql';
*/

import {
  UserProfile,
  Couple,
  Favorite,
  Note,
  Reaction,
  VoucherInstance,
  Redemption,
  DailyLog,
  VoucherTemplate,
  CreateUserProfileInput,
  UpdateUserProfileInput,
  CreateFavoriteInput,
  CreateNoteInput,
  CreateReactionInput,
  RequestRedemptionInput,
  CompleteRedemptionInput,
  MonthlyVoucherInventory,
  VoucherInventoryItem,
  StreakInfo,
} from "./types";

import { submitVoucherRequest, fetchVoucherTemplates, CloudVoucherTemplate, getRarityFromLimit } from "../utils/cloudStorage";
import { setServerTimeOffset } from "../utils/storage";

// ============================================================
// PLACEHOLDER - Replace with actual Amplify calls
// For now, this provides the API shape for development
// ============================================================

const MOCK_MODE = true; // Set to false when Amplify is configured

// Helper to get current month key
export const getCurrentMonthKey = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
};

// Helper to get today's date key
export const getTodayKey = (): string => {
  return new Date().toISOString().split("T")[0];
};

// ============================================================
// SERVER TIME SYNC
// Fetches server time and calculates offset for timezone hardening
// ============================================================

export const syncServerTime = async (): Promise<void> => {
  if (MOCK_MODE) {
    // In mock mode, use local time (offset = 0)
    setServerTimeOffset(0);
    return;
  }
  
  try {
    // When Amplify is configured, call a lightweight API endpoint
    // that returns the server timestamp
    // const response = await API.graphql(graphqlOperation(getServerTime));
    // const serverTime = response.data.getServerTime.timestamp;
    // const clientTime = Date.now();
    // const offset = serverTime - clientTime;
    // setServerTimeOffset(offset);
    
    // Fallback: Use a public time API or AWS time sync
    const response = await fetch('https://worldtimeapi.org/api/timezone/Etc/UTC', {
      method: 'GET',
      cache: 'no-cache',
    });
    
    if (response.ok) {
      const data = await response.json();
      const serverTime = new Date(data.datetime).getTime();
      const clientTime = Date.now();
      const offset = serverTime - clientTime;
      setServerTimeOffset(offset);
      console.log(`[TimeSync] Server time offset: ${offset}ms`);
    }
  } catch (error) {
    console.warn('[TimeSync] Failed to sync server time, using local time', error);
    // Use local time as fallback
    setServerTimeOffset(0);
  }
};

// ============================================================
// USER PROFILE API
// ============================================================

export const userProfileApi = {
  async get(): Promise<UserProfile | null> {
    if (MOCK_MODE) {
      // Return from localStorage for now
      const stored = localStorage.getItem("compliment-deck-profile");
      return stored ? JSON.parse(stored) : null;
    }
    // TODO: Implement with Amplify
    // const result = await API.graphql(graphqlOperation(getMyProfile));
    return null;
  },

  async create(input: CreateUserProfileInput): Promise<UserProfile> {
    if (MOCK_MODE) {
      const profile: UserProfile = {
        id: crypto.randomUUID(),
        owner: "mock-user",
        displayName: input.displayName,
        theme: input.theme || "blush",
        soundEnabled: true,
        heartTrailEnabled: false,
        dailyModeEnabled: false,
        currentDrawStreak: 0,
        longestDrawStreak: 0,
        currentLoveStreak: 0,
        longestLoveStreak: 0,
        lastDrawDate: null,
        lastLoveLogDate: null,
        totalDraws: 0,
        reasonsLogged: 0,
        loveMeterValue: 0,
        seenCardIds: [],
        coupleId: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem("compliment-deck-profile", JSON.stringify(profile));
      return profile;
    }
    // TODO: Implement with Amplify
    throw new Error("Not implemented");
  },

  async update(input: UpdateUserProfileInput): Promise<UserProfile> {
    if (MOCK_MODE) {
      const current = await this.get();
      if (!current) throw new Error("Profile not found");
      const updated = { ...current, ...input, updatedAt: new Date().toISOString() };
      localStorage.setItem("compliment-deck-profile", JSON.stringify(updated));
      return updated;
    }
    // TODO: Implement with Amplify
    throw new Error("Not implemented");
  },
};

// ============================================================
// COUPLE API
// ============================================================

export const coupleApi = {
  async get(): Promise<Couple | null> {
    if (MOCK_MODE) {
      const stored = localStorage.getItem("compliment-deck-couple");
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  },

  async create(): Promise<Couple> {
    if (MOCK_MODE) {
      const code = `LOVE-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      const couple: Couple = {
        id: crypto.randomUUID(),
        inviteCode: code,
        members: ["mock-user"],
        memberNames: ["You"],
        secretsUnlocked: [],
        secretDeckActive: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem("compliment-deck-couple", JSON.stringify(couple));
      return couple;
    }
    throw new Error("Not implemented");
  },

  async joinWithCode(_inviteCode: string, displayName: string): Promise<Couple> {
    if (MOCK_MODE) {
      // In real implementation, this would query by invite code
      const couple = await this.get();
      if (couple) {
        couple.members.push("partner-user");
        couple.memberNames.push(displayName);
        couple.updatedAt = new Date().toISOString();
        localStorage.setItem("compliment-deck-couple", JSON.stringify(couple));
        return couple;
      }
      throw new Error("Invite code not found");
    }
    throw new Error("Not implemented");
  },

  async unlockSecret(): Promise<Couple> {
    if (MOCK_MODE) {
      const couple = await this.get();
      if (!couple) throw new Error("No couple found");
      couple.secretDeckActive = true;
      couple.updatedAt = new Date().toISOString();
      localStorage.setItem("compliment-deck-couple", JSON.stringify(couple));
      return couple;
    }
    throw new Error("Not implemented");
  },
};

// ============================================================
// FAVORITES API
// ============================================================

export const favoritesApi = {
  async list(): Promise<Favorite[]> {
    if (MOCK_MODE) {
      const stored = localStorage.getItem("compliment-deck-favorites");
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  },

  async add(input: CreateFavoriteInput): Promise<Favorite> {
    if (MOCK_MODE) {
      const favorites = await this.list();
      const newFav: Favorite = {
        id: crypto.randomUUID(),
        coupleId: "mock-couple",
        userId: "mock-user",
        cardId: input.cardId,
        createdAt: new Date().toISOString(),
      };
      favorites.push(newFav);
      localStorage.setItem("compliment-deck-favorites", JSON.stringify(favorites));
      return newFav;
    }
    throw new Error("Not implemented");
  },

  async remove(cardId: string): Promise<void> {
    if (MOCK_MODE) {
      const favorites = await this.list();
      const filtered = favorites.filter((f) => f.cardId !== cardId);
      localStorage.setItem("compliment-deck-favorites", JSON.stringify(filtered));
      return;
    }
    throw new Error("Not implemented");
  },

  async isFavorite(cardId: string): Promise<boolean> {
    const favorites = await this.list();
    return favorites.some((f) => f.cardId === cardId);
  },
};

// ============================================================
// NOTES API
// ============================================================

export const notesApi = {
  async list(): Promise<Note[]> {
    if (MOCK_MODE) {
      const stored = localStorage.getItem("compliment-deck-notes");
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  },

  async add(input: CreateNoteInput): Promise<Note> {
    if (MOCK_MODE) {
      const notes = await this.list();
      const newNote: Note = {
        id: crypto.randomUUID(),
        coupleId: "mock-couple",
        authorId: "mock-user",
        authorName: "You",
        content: input.content,
        isPrivate: input.isPrivate || false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      notes.unshift(newNote);
      localStorage.setItem("compliment-deck-notes", JSON.stringify(notes));
      return newNote;
    }
    throw new Error("Not implemented");
  },

  async remove(noteId: string): Promise<void> {
    if (MOCK_MODE) {
      const notes = await this.list();
      const filtered = notes.filter((n) => n.id !== noteId);
      localStorage.setItem("compliment-deck-notes", JSON.stringify(filtered));
      return;
    }
    throw new Error("Not implemented");
  },
};

// ============================================================
// REACTIONS API
// ============================================================

export const reactionsApi = {
  async listForCard(cardId: string): Promise<Reaction[]> {
    if (MOCK_MODE) {
      const stored = localStorage.getItem("compliment-deck-reactions");
      const all: Reaction[] = stored ? JSON.parse(stored) : [];
      return all.filter((r) => r.cardId === cardId);
    }
    return [];
  },

  async add(input: CreateReactionInput): Promise<Reaction> {
    if (MOCK_MODE) {
      const stored = localStorage.getItem("compliment-deck-reactions");
      const reactions: Reaction[] = stored ? JSON.parse(stored) : [];
      const newReaction: Reaction = {
        id: crypto.randomUUID(),
        coupleId: "mock-couple",
        userId: "mock-user",
        cardId: input.cardId,
        reactionType: input.reactionType,
        createdAt: new Date().toISOString(),
      };
      reactions.push(newReaction);
      localStorage.setItem("compliment-deck-reactions", JSON.stringify(reactions));
      return newReaction;
    }
    throw new Error("Not implemented");
  },
};

// ============================================================
// VOUCHER API - Tamper-proof inventory
// ============================================================

// Default voucher templates (seeded to backend)
const DEFAULT_TEMPLATES: VoucherTemplate[] = [
  {
    id: "tpl-flowers",
    type: "flowers",
    title: "Redeem for flowers",
    description: "A beautiful bouquet just for you",
    options: ["Surprise bouquet + note", "Pick the flowers together", "Flowers + coffee date"],
    monthlyLimit: 1,
    rarity: "rare",
    emoji: "💐",
    iconName: "Flower2",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "tpl-comfort",
    type: "comfort",
    title: "Redeem for comfort mode",
    description: "When you need to be taken care of",
    options: ["Quiet cuddle + show", "Snack run + blanket burrito", "Massage + early night"],
    monthlyLimit: 2,
    rarity: "legendary",
    emoji: "🫶",
    iconName: "Heart",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "tpl-adventure",
    type: "adventure",
    title: "Redeem for adventure day",
    description: "Let's go explore together",
    options: ["Hike + photos", "Climbing + food after", "Snow day + hot drinks"],
    monthlyLimit: 1,
    rarity: "rare",
    emoji: "🏔️",
    iconName: "Mountain",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "tpl-movie",
    type: "movie",
    title: "Redeem for movie night",
    description: "Cozy movie time",
    options: ["You pick the movie", "Cozy blankets + snacks", "Movie marathon"],
    monthlyLimit: 2,
    rarity: "rare",
    emoji: "🎬",
    iconName: "Film",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "tpl-dinner",
    type: "dinner",
    title: "Redeem for dinner date",
    description: "A delicious meal together",
    options: ["Your restaurant pick", "Cook together at home", "Takeout + candlelight"],
    monthlyLimit: 2,
    rarity: "rare",
    emoji: "🍕",
    iconName: "UtensilsCrossed",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const voucherApi = {
  async getTemplates(): Promise<VoucherTemplate[]> {
    try {
      // Try to fetch from cloud first
      const cloudTemplates = await fetchVoucherTemplates();
      
      if (cloudTemplates.length > 0) {
        // Map cloud templates to VoucherTemplate format
        return cloudTemplates.map((ct: CloudVoucherTemplate) => ({
          id: ct.id,
          type: ct.type,
          title: ct.title,
          description: ct.description,
          options: ct.options || [],
          monthlyLimit: ct.monthlyLimit,
          rarity: getRarityFromLimit(ct.monthlyLimit),
          emoji: "", // deprecated
          iconName: ct.iconName || "Gift",
          createdAt: ct.createdAt || new Date().toISOString(),
          updatedAt: ct.updatedAt || new Date().toISOString(),
        }));
      }
      
      // Fallback to defaults if cloud is empty
      console.log("No cloud templates found, using defaults");
      return DEFAULT_TEMPLATES;
    } catch (error) {
      console.error("Failed to fetch cloud templates, using defaults:", error);
      return DEFAULT_TEMPLATES;
    }
  },

  async getInventory(monthKey?: string): Promise<MonthlyVoucherInventory> {
    const key = monthKey || getCurrentMonthKey();
    
    if (MOCK_MODE) {
      // Check if we need to mint vouchers for this month
      const storageKey = `compliment-deck-vouchers-${key}`;
      let instances: VoucherInstance[] = [];
      const stored = localStorage.getItem(storageKey);
      const templates = await this.getTemplates();
      
      if (!stored) {
        // Lazy mint: create vouchers for the month
        for (const template of templates) {
          for (let i = 0; i < template.monthlyLimit; i++) {
            instances.push({
              id: crypto.randomUUID(),
              coupleId: "mock-couple",
              coupleMembers: ["mock-user"],
              templateId: template.id,
              templateType: template.type,
              monthKey: key,
              status: "AVAILABLE",
              version: 1,
              redemptionId: null,
              template,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
          }
        }
        localStorage.setItem(storageKey, JSON.stringify(instances));
      } else {
        instances = JSON.parse(stored);
        
        // Check for new templates that aren't in stored instances
        const existingTypes = new Set(instances.map(i => i.templateId));
        let updated = false;
        
        for (const template of templates) {
          if (!existingTypes.has(template.id)) {
            // New template - mint instances for it
            console.log(`Minting new template: ${template.type}`);
            for (let i = 0; i < template.monthlyLimit; i++) {
              instances.push({
                id: crypto.randomUUID(),
                coupleId: "mock-couple",
                coupleMembers: ["mock-user"],
                templateId: template.id,
                templateType: template.type,
                monthKey: key,
                status: "AVAILABLE",
                version: 1,
                redemptionId: null,
                template,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              });
            }
            updated = true;
          } else {
            // Update existing instances with latest template data
            instances = instances.map(inst => 
              inst.templateId === template.id 
                ? { ...inst, template }
                : inst
            );
          }
        }
        
        // Remove instances for templates that no longer exist
        const currentTemplateIds = new Set(templates.map(t => t.id));
        const filteredInstances = instances.filter(i => currentTemplateIds.has(i.templateId));
        if (filteredInstances.length !== instances.length) {
          instances = filteredInstances;
          updated = true;
        }
        
        if (updated) {
          localStorage.setItem(storageKey, JSON.stringify(instances));
        }
      }
      
      // Group by template type
      const items: VoucherInventoryItem[] = templates.map((template) => {
        const typeInstances = instances.filter((i) => i.templateType === template.type);
        return {
          templateType: template.type,
          template,
          instances: typeInstances,
          available: typeInstances.filter((i) => i.status === "AVAILABLE").length,
          pending: typeInstances.filter((i) => i.status === "REQUESTED" || i.status === "APPROVED" || i.status === "COUNTERED").length,
          used: typeInstances.filter((i) => i.status === "REDEEMED" || i.status === "ARCHIVED").length,
          total: typeInstances.length,
        };
      });
      
      return {
        monthKey: key,
        items,
        totalAvailable: items.reduce((sum, i) => sum + i.available, 0),
        totalUsed: items.reduce((sum, i) => sum + i.used, 0),
      };
    }
    
    throw new Error("Not implemented");
  },

  async requestRedemption(input: RequestRedemptionInput): Promise<Redemption> {
    if (MOCK_MODE) {
      const monthKey = getCurrentMonthKey();
      const storageKey = `compliment-deck-vouchers-${monthKey}`;
      const stored = localStorage.getItem(storageKey);
      if (!stored) throw new Error("No vouchers found");
      
      const instances: VoucherInstance[] = JSON.parse(stored);
      const instance = instances.find((i) => i.id === input.voucherInstanceId);
      
      if (!instance) throw new Error("Voucher not found");
      if (instance.status !== "AVAILABLE") throw new Error("Voucher not available");
      
      // Update instance status (simulates conditional update)
      instance.status = "REQUESTED";
      instance.version += 1;
      instance.updatedAt = new Date().toISOString();
      
      // Create redemption
      const redemption: Redemption = {
        id: crypto.randomUUID(),
        coupleId: "mock-couple",
        coupleMembers: ["mock-user"],
        voucherInstanceId: instance.id,
        voucherTemplateType: instance.templateType,
        requestedByUserId: "mock-user",
        requestedByName: "You",
        selectedOption: input.selectedOption,
        requestedForDate: input.requestedForDate || null,
        message: input.message || null,
        status: "REQUESTED",
        createdAt: new Date().toISOString(),
        completedAt: null,
        completedByUserId: null,
      };
      
      instance.redemptionId = redemption.id;
      localStorage.setItem(storageKey, JSON.stringify(instances));
      
      // Store redemption
      const redemptionsKey = "compliment-deck-redemptions";
      const redemptions: Redemption[] = JSON.parse(localStorage.getItem(redemptionsKey) || "[]");
      redemptions.push(redemption);
      localStorage.setItem(redemptionsKey, JSON.stringify(redemptions));
      
      // Sync to cloud for admin to see
      console.log("📤 Syncing redemption to cloud for admin...");
      submitVoucherRequest({
        voucherType: instance.templateType,
        voucherTitle: instance.template?.title || instance.templateType,
        requestedDate: input.requestedForDate || null,
      })
        .then(result => console.log("✅ Redemption synced to cloud:", result))
        .catch(err => console.error("❌ Failed to sync redemption:", err));
      
      return redemption;
    }
    throw new Error("Not implemented");
  },

  async completeRedemption(input: CompleteRedemptionInput): Promise<Redemption> {
    if (MOCK_MODE) {
      const redemptionsKey = "compliment-deck-redemptions";
      const redemptions: Redemption[] = JSON.parse(localStorage.getItem(redemptionsKey) || "[]");
      const redemption = redemptions.find((r) => r.id === input.redemptionId);
      
      if (!redemption) throw new Error("Redemption not found");
      if (redemption.status !== "REQUESTED" && redemption.status !== "APPROVED") throw new Error("Redemption not in requestable state");
      
      redemption.status = "COMPLETED";
      redemption.completedAt = new Date().toISOString();
      redemption.completedByUserId = "mock-user";
      localStorage.setItem(redemptionsKey, JSON.stringify(redemptions));
      
      // Update voucher instance
      const monthKey = getCurrentMonthKey();
      const storageKey = `compliment-deck-vouchers-${monthKey}`;
      const instances: VoucherInstance[] = JSON.parse(localStorage.getItem(storageKey) || "[]");
      const instance = instances.find((i) => i.id === redemption.voucherInstanceId);
      if (instance) {
        instance.status = "REDEEMED";
        instance.version += 1;
        instance.updatedAt = new Date().toISOString();
        localStorage.setItem(storageKey, JSON.stringify(instances));
      }
      
      return redemption;
    }
    throw new Error("Not implemented");
  },

  async getRedemptions(): Promise<Redemption[]> {
    if (MOCK_MODE) {
      const stored = localStorage.getItem("compliment-deck-redemptions");
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  },
};

// ============================================================
// STREAKS API
// ============================================================

export const streaksApi = {
  async getStreakInfo(): Promise<StreakInfo> {
    if (MOCK_MODE) {
      const profile = await userProfileApi.get();
      const today = getTodayKey();
      
      return {
        currentDrawStreak: profile?.currentDrawStreak || 0,
        longestDrawStreak: profile?.longestDrawStreak || 0,
        currentLoveStreak: profile?.currentLoveStreak || 0,
        longestLoveStreak: profile?.longestLoveStreak || 0,
        lastDrawDate: profile?.lastDrawDate || null,
        lastLoveLogDate: profile?.lastLoveLogDate || null,
        drewToday: profile?.lastDrawDate === today,
        loggedLoveToday: profile?.lastLoveLogDate === today,
      };
    }
    throw new Error("Not implemented");
  },

  async logDraw(cardId: string): Promise<StreakInfo> {
    if (MOCK_MODE) {
      const profile = await userProfileApi.get();
      if (!profile) throw new Error("No profile found");
      
      const today = getTodayKey();
      const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
      
      let newStreak = profile.currentDrawStreak;
      
      if (profile.lastDrawDate === today) {
        // Already drew today, no streak change
      } else if (profile.lastDrawDate === yesterday) {
        // Consecutive day, increment streak
        newStreak += 1;
      } else {
        // Streak broken, start fresh
        newStreak = 1;
      }
      
      const updates: UpdateUserProfileInput = {
        id: profile.id,
        seenCardIds: [...profile.seenCardIds, cardId],
        currentDrawStreak: newStreak,
        longestDrawStreak: Math.max(newStreak, profile.longestDrawStreak),
        lastDrawDate: today,
        totalDraws: profile.totalDraws + 1,
      };
      
      await userProfileApi.update(updates);
      
      return this.getStreakInfo();
    }
    throw new Error("Not implemented");
  },

  async logLove(message?: string): Promise<StreakInfo> {
    // message parameter reserved for future cloud implementation
    void message;
    if (MOCK_MODE) {
      const profile = await userProfileApi.get();
      if (!profile) throw new Error("No profile found");
      
      const today = getTodayKey();
      const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
      
      let newStreak = profile.currentLoveStreak;
      
      if (profile.lastLoveLogDate === today) {
        // Already logged today
      } else if (profile.lastLoveLogDate === yesterday) {
        newStreak += 1;
      } else {
        newStreak = 1;
      }
      
      const updates: UpdateUserProfileInput = {
        id: profile.id,
        currentLoveStreak: newStreak,
        longestLoveStreak: Math.max(newStreak, profile.longestLoveStreak),
        lastLoveLogDate: today,
        reasonsLogged: profile.reasonsLogged + 1,
      };
      
      await userProfileApi.update(updates);
      
      return this.getStreakInfo();
    }
    throw new Error("Not implemented");
  },
};

// ============================================================
// DAILY LOG API
// ============================================================

export const dailyLogApi = {
  async getToday(): Promise<DailyLog | null> {
    if (MOCK_MODE) {
      const today = getTodayKey();
      const stored = localStorage.getItem(`compliment-deck-daily-${today}`);
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  },

  async logCard(cardId: string): Promise<DailyLog> {
    if (MOCK_MODE) {
      const today = getTodayKey();
      let log = await this.getToday();
      
      if (!log) {
        log = {
          id: `mock-user#${today}`,
          owner: "mock-user",
          date: today,
          cardsDrawn: 0,
          cardIdsDrawn: [],
          loveLogged: false,
          loveLogMessage: null,
          favoritesSaved: 0,
          reactionsGiven: 0,
          recapShown: false,
          recapCompleted: false,
          topCardId: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }
      
      log.cardsDrawn += 1;
      log.cardIdsDrawn.push(cardId);
      log.updatedAt = new Date().toISOString();
      
      localStorage.setItem(`compliment-deck-daily-${today}`, JSON.stringify(log));
      return log;
    }
    throw new Error("Not implemented");
  },
};
