# Compliment Deck v2 — Implementation Plan

## Table of Contents
1. [UX Spec](#1-ux-spec)
2. [Icon Mapping](#2-icon-mapping)
3. [Backend Schema](#3-backend-schema)
4. [Auth Rules](#4-auth-rules)
5. [Implementation Order](#5-implementation-order)
6. [iPhone No-Scroll Checklist](#6-iphone-no-scroll-checklist)

---

## 1. UX Spec

### Layout Structure (100dvh, no scroll)

```
┌─────────────────────────────────────────────┐
│  HEADER (fixed, 44px)                       │
│  [Settings] [Stats]   💕 Deck   [Vouchers]  │
├─────────────────────────────────────────────┤
│  DECK SELECTOR (40px)                       │
│  ┌─────┬─────┬─────┐                        │
│  │ All │Moods│Open │  (segmented control)   │
│  └─────┴─────┴─────┘                        │
├─────────────────────────────────────────────┤
│                                             │
│            CARD AREA (flex: 1)              │
│                                             │
│         ┌─────────────────────┐             │
│         │                     │             │
│         │    Card X of Y      │             │
│         │                     │             │
│         │   [Card Content]    │             │
│         │                     │             │
│         │                     │             │
│         └─────────────────────┘             │
│                                             │
├─────────────────────────────────────────────┤
│  BOTTOM NAV (fixed, 64px + safe-area)       │
│  ┌─────┬─────┬─────┬─────┬─────┐           │
│  │ 📬  │ ❤️  │ 🎴  │ 📝  │ 🔀  │           │
│  │Open │Favs │Draw │Notes│Shuffle          │
│  └─────┴─────┴─────┴─────┴─────┘           │
│  [────────── safe-area-inset ──────────]   │
└─────────────────────────────────────────────┘
```

### Component Map

```
App.tsx
├── AuthProvider (new)
│   └── ApiProvider (new)
│       └── ToastProvider
│           └── AppShell (new)
│               ├── Header (simplified)
│               │   ├── SettingsButton (icon + tooltip)
│               │   ├── StatsButton (icon + tooltip)
│               │   ├── Logo/Title
│               │   └── VouchersButton (icon + tooltip)
│               │
│               ├── DeckSelector (new)
│               │   └── SegmentedControl (All | Mood | Open When)
│               │
│               ├── CardArea (flex: 1)
│               │   ├── CardCounter ("Card 3 of 47")
│               │   └── CardRenderer
│               │       ├── TextCard
│               │       ├── VoucherCard (shows redemption status)
│               │       └── PlaylistCard
│               │
│               ├── BottomNav (new)
│               │   ├── NavItem: Open When
│               │   ├── NavItem: Favorites
│               │   ├── NavItem: Draw (primary)
│               │   ├── NavItem: Notes
│               │   └── NavItem: Shuffle
│               │
│               └── Modals/Drawers
│                   ├── StatsDrawer (new)
│                   ├── SettingsModal
│                   ├── FavoritesModal
│                   ├── NotesModal
│                   ├── OpenWhenModal
│                   ├── VoucherInventoryModal (new)
│                   └── NightlyRecapModal (new)
```

### Key UX Changes

| Current | New |
|---------|-----|
| Emoji icons everywhere | Lucide icons only |
| No labels on buttons | All nav items have labels |
| "Card 7" (meaningless) | "Card 7 of 42 (Sweet)" |
| Scrollable layout | Fixed 100dvh layout |
| Vouchers mixed with cards | Vouchers in separate inventory |
| No progress visibility | Stats drawer with full breakdown |
| Toast spam | Minimal toasts (secrets, legendary only) |

---

## 2. Icon Mapping

Using **Lucide React** (lighter than Phosphor, excellent React support).

### Navigation Icons
| Action | Lucide Icon | Component |
|--------|-------------|-----------|
| Settings | `Settings` | `<Settings />` |
| Stats | `BarChart3` | `<BarChart3 />` |
| Vouchers/Redeemables | `Ticket` | `<Ticket />` |
| Open When | `Mail` | `<Mail />` |
| Favorites | `Heart` | `<Heart />` |
| Draw | `Sparkles` | `<Sparkles />` |
| Notes | `StickyNote` | `<StickyNote />` |
| Shuffle | `Shuffle` | `<Shuffle />` |
| Mute/Unmute | `Volume2` / `VolumeX` | Dynamic |
| Close | `X` | `<X />` |
| Back | `ChevronLeft` | `<ChevronLeft />` |

### Mood/Category Icons
| Mood/Category | Lucide Icon | Component |
|---------------|-------------|-----------|
| All | `Sparkles` | `<Sparkles />` |
| Sweet | `Heart` | `<Heart />` |
| Funny | `Smile` | `<Smile />` |
| Supportive | `HandHeart` | `<HandHeart />` |
| Spicy | `Flame` | `<Flame />` |
| Secret | `Lock` | `<Lock />` |
| Soft | `Cloud` | `<Cloud />` |
| Hype | `Zap` | `<Zap />` |
| Flirty | `HeartHandshake` | `<HeartHandshake />` |

### Open When Icons
| Feeling | Lucide Icon |
|---------|-------------|
| Stressed | `Brain` |
| Need a Laugh | `Laugh` |
| Doubting Yourself | `HelpCircle` |
| Feeling Lonely | `Heart` |
| Overstimulated | `Activity` |

### Card Type Icons
| Type | Lucide Icon |
|------|-------------|
| Text | `MessageSquare` |
| Voucher | `Ticket` |
| Playlist | `Music` |

### Rarity Indicators
| Rarity | Lucide Icon |
|--------|-------------|
| Common | `Circle` (outline) |
| Rare | `Diamond` |
| Legendary | `Star` |

---

## 3. Backend Schema

### Amplify Gen 1 GraphQL Schema

```graphql
# amplify/backend/api/complimentdeck/schema.graphql

type UserProfile @model @auth(rules: [{ allow: owner }]) {
  id: ID!
  owner: String! @index(name: "byOwner")
  displayName: String!
  
  # Settings
  theme: String! @default(value: "blush")
  soundEnabled: Boolean! @default(value: true)
  heartTrailEnabled: Boolean! @default(value: false)
  dailyModeEnabled: Boolean! @default(value: false)
  
  # Streaks
  currentDrawStreak: Int! @default(value: 0)
  longestDrawStreak: Int! @default(value: 0)
  currentLoveStreak: Int! @default(value: 0)
  longestLoveStreak: Int! @default(value: 0)
  lastDrawDate: AWSDate
  lastLoveLogDate: AWSDate
  
  # Progress
  totalDraws: Int! @default(value: 0)
  reasonsLogged: Int! @default(value: 0)
  loveMeterValue: Int! @default(value: 0)
  
  # Couple link
  coupleId: ID @index(name: "byCouple")
  couple: Couple @belongsTo(fields: ["coupleId"])
  
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}

type Couple @model @auth(rules: [
  { allow: owner, ownerField: "members" }
]) {
  id: ID!
  inviteCode: String! @index(name: "byInviteCode", queryField: "coupleByInviteCode")
  members: [String!]! # Array of user sub IDs
  
  # Shared progress
  secretsUnlocked: [String!]! @default(value: [])
  
  # Relations
  profiles: [UserProfile] @hasMany(indexName: "byCouple", fields: ["id"])
  favorites: [Favorite] @hasMany(indexName: "byCouple", fields: ["id"])
  notes: [Note] @hasMany(indexName: "byCouple", fields: ["id"])
  reactions: [Reaction] @hasMany(indexName: "byCouple", fields: ["id"])
  voucherInstances: [VoucherInstance] @hasMany(indexName: "byCouple", fields: ["id"])
  redemptions: [Redemption] @hasMany(indexName: "byCouple", fields: ["id"])
  
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}

type Favorite @model @auth(rules: [
  { allow: owner, ownerField: "userId" }
]) {
  id: ID!
  coupleId: ID! @index(name: "byCouple", sortKeyFields: ["createdAt"])
  userId: String!
  cardId: String!
  
  createdAt: AWSDateTime!
}

type Note @model @auth(rules: [
  { allow: owner, ownerField: "authorId" }
]) {
  id: ID!
  coupleId: ID! @index(name: "byCouple", sortKeyFields: ["createdAt"])
  authorId: String!
  content: String!
  isPrivate: Boolean! @default(value: false)
  
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}

type Reaction @model @auth(rules: [
  { allow: owner, ownerField: "userId" }
]) {
  id: ID!
  coupleId: ID! @index(name: "byCouple")
  userId: String!
  cardId: String!
  reactionType: String! # "love" | "lol" | "aww" | "fave"
  
  createdAt: AWSDateTime!
}

type SecretProgress @model @auth(rules: [
  { allow: owner, ownerField: "members" }
]) {
  id: ID!
  coupleId: ID! @index(name: "byCoupleSecret")
  members: [String!]!
  unlockedSecretIds: [String!]! @default(value: [])
  secretTapCount: Int! @default(value: 0)
  
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}

# Voucher System - Tamper-proof

enum VoucherStatus {
  AVAILABLE
  PENDING
  USED
  EXPIRED
}

type VoucherTemplate @model @auth(rules: [
  { allow: public, operations: [read] }
  { allow: groups, groups: ["Admin"] }
]) {
  id: ID!
  type: String! # "flowers" | "comfort" | "adventure" | "movie" | "dinner"
  title: String!
  options: [String!]!
  monthlyLimit: Int!
  rarity: String! # "rare" | "legendary"
  emoji: String! # Keep for card display, not UI labels
  
  instances: [VoucherInstance] @hasMany(indexName: "byTemplate", fields: ["id"])
}

type VoucherInstance @model @auth(rules: [
  { allow: owner, ownerField: "coupleMembers" }
]) {
  id: ID!
  coupleId: ID! @index(name: "byCouple", sortKeyFields: ["monthKey"])
  coupleMembers: [String!]! # Both user IDs for ownership
  templateId: ID! @index(name: "byTemplate")
  template: VoucherTemplate @belongsTo(fields: ["templateId"])
  
  monthKey: String! # "2026-02" format
  status: VoucherStatus! @default(value: "AVAILABLE")
  
  # Version for optimistic locking (anti-cheat)
  version: Int! @default(value: 1)
  
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}

type Redemption @model @auth(rules: [
  { allow: owner, ownerField: "coupleMembers" }
]) {
  id: ID!
  coupleId: ID! @index(name: "byCouple", sortKeyFields: ["createdAt"])
  coupleMembers: [String!]!
  
  voucherInstanceId: ID!
  voucherInstance: VoucherInstance @hasOne(fields: ["voucherInstanceId"])
  
  requestedByUserId: String!
  selectedOption: String!
  requestedForDate: AWSDate # Optional: schedule for specific date
  
  status: RedemptionStatus! @default(value: "PENDING")
  
  createdAt: AWSDateTime!
  completedAt: AWSDateTime
}

enum RedemptionStatus {
  PENDING
  APPROVED
  COMPLETED
  CANCELLED
}

# Daily tracking for streaks
type DailyLog @model @auth(rules: [
  { allow: owner }
]) {
  id: ID! # Format: {userId}#{date}
  owner: String!
  date: AWSDate!
  
  cardsDrawn: Int! @default(value: 0)
  loveLogged: Boolean! @default(value: false)
  favoritesSaved: Int! @default(value: 0)
  
  # Optional: nightly recap data
  topCardId: String
  recapCompleted: Boolean @default(value: false)
  
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}
```

### Lambda Functions Needed

1. **monthlyVoucherReset** (Scheduled, 1st of month at 00:00 UTC)
   - Creates new VoucherInstances for all Couples based on VoucherTemplates
   - Marks old AVAILABLE vouchers as EXPIRED

2. **lazyVoucherMint** (Triggered on getInventory if no vouchers for current month)
   - Creates vouchers on-demand if monthly reset was missed
   - Idempotent: checks if already exists first

3. **redeemVoucher** (Mutation resolver with condition)
   - Uses DynamoDB conditional update: `status = AVAILABLE AND version = :expected`
   - Prevents race conditions and double-redemption

---

## 4. Auth Rules

### Who Can Read/Write What

| Resource | Owner(s) | Read | Create | Update | Delete |
|----------|----------|------|--------|--------|--------|
| UserProfile | User | Self | Self | Self | ❌ |
| Couple | Both members | Members | System | Members | ❌ |
| Favorite | User | Couple | User | ❌ | User |
| Note | Author | Couple (if !private) | User | Author | Author |
| Reaction | User | Couple | User | ❌ | User |
| SecretProgress | Couple | Couple | System | Couple | ❌ |
| VoucherTemplate | Admin | Public | Admin | Admin | Admin |
| VoucherInstance | Couple | Couple | System | System* | ❌ |
| Redemption | Couple | Couple | Either | Either | ❌ |
| DailyLog | User | Self | Self | Self | ❌ |

*VoucherInstance updates go through Lambda with conditional checks

### Invite Code Flow

1. Zack signs up → gets UserProfile, no Couple yet
2. Zack creates Couple → gets inviteCode (e.g., "LOVE-2026-CAIT")
3. Zack shares code with Caitlyn
4. Caitlyn signs up → gets UserProfile
5. Caitlyn enters code → `joinCouple` mutation adds her to Couple.members
6. Both can now see shared Favorites, Notes, Vouchers

---

## 5. Implementation Order

### Phase 1: Frontend Shell (No Backend Yet)
*Goal: Fix iPhone scroll, add icons, clean up layout*

1. ✅ Install Lucide React
2. ✅ Create `src/components/icons.tsx` - icon mapping exports
3. ✅ Create `src/components/layout/AppShell.tsx` - 100dvh flex container
4. ✅ Create `src/components/layout/BottomNav.tsx` - fixed nav with labels
5. ✅ Update `Header.tsx` - simplify, use icons, add tooltips
6. ✅ Create `src/components/DeckSelector.tsx` - segmented control
7. ✅ Update `MainContent.tsx` - use new layout
8. ✅ Update `index.css` - safe-area, dvh units
9. ✅ Test on iPhone - verify no scroll

### Phase 2: Card Counter & No-Repeat Mode
*Goal: "Card X of Y" + seen tracking*

10. Update `useDeckNew.ts` - add proper counts
11. Create card counter component
12. Add "Seen X / Y" display
13. Add "Don't repeat until all seen" toggle

### Phase 3: Stats Drawer
*Goal: Full visibility into progress*

14. Create `src/components/StatsDrawer.tsx`
15. Wire up all stats (counts, streaks, secrets)
16. Add streak visualization

### Phase 4: Backend Setup
*Goal: Amplify infrastructure*

17. Initialize Amplify: `amplify init`
18. Add Auth: `amplify add auth` (Cognito)
19. Add API: `amplify add api` (GraphQL)
20. Add schema from Section 3
21. Push: `amplify push`
22. Create Lambda functions for vouchers

### Phase 5: Auth Integration
*Goal: Login flow*

23. Create `src/context/AuthContext.tsx`
24. Create `src/components/auth/LoginScreen.tsx`
25. Create `src/components/auth/PairScreen.tsx` (invite code)
26. Update App.tsx with auth flow

### Phase 6: Data Layer
*Goal: Sync local state to backend*

27. Create `src/api/client.ts` - Amplify API wrapper
28. Create `src/api/hooks/` - useUserProfile, useCouple, etc.
29. Create `src/api/hooks/useFavoritesSync.ts` - replace localStorage
30. Create `src/api/hooks/useNotesSync.ts`
31. Create `src/api/hooks/useReactionsSync.ts`

### Phase 7: Voucher System
*Goal: Tamper-proof redemption*

32. Create `src/api/hooks/useVoucherInventory.ts`
33. Create `src/components/VoucherInventoryModal.tsx`
34. Create `src/components/VoucherRedemptionFlow.tsx`
35. Update card renderer for voucher status
36. Test: clear localStorage → vouchers persist

### Phase 8: Streaks & Daily Log
*Goal: Engagement without spam*

37. Create `src/api/hooks/useStreaks.ts`
38. Create `src/components/NightlyRecapModal.tsx`
39. Add streak display to Stats drawer
40. Add optional nightly prompt (8pm local)

### Phase 9: Polish
*Goal: Premium feel*

41. Reduce toast frequency
42. Add long-press tooltips (mobile)
43. Add subtle animations
44. Final iPhone testing

---

## 6. iPhone No-Scroll Checklist

Run through this checklist after Phase 1:

### Setup
- [ ] Open on iPhone Safari (or Chrome iOS)
- [ ] Add to Home Screen for true full-screen test
- [ ] Test in portrait AND landscape

### Layout Checks
- [ ] App fills exactly 100% viewport (no white space)
- [ ] No vertical scrolling at all (try hard to scroll)
- [ ] No horizontal scrolling
- [ ] Content doesn't go under notch (safe-area-top works)
- [ ] Content doesn't go under home indicator (safe-area-bottom works)
- [ ] Draw button is fully visible above browser bar
- [ ] Card doesn't get cut off at bottom

### Interaction Checks
- [ ] Can tap all bottom nav items
- [ ] Can tap header buttons
- [ ] Card swipe/draw animation stays in bounds
- [ ] Modals open correctly (don't cause scroll)
- [ ] Keyboard doesn't break layout (notes input)

### Device-Specific
- [ ] iPhone SE (small screen) - everything fits
- [ ] iPhone 14/15 (notch) - safe areas work
- [ ] iPhone 14/15 Pro Max (large) - centered nicely
- [ ] iPad (if supporting) - responsive

### CSS Verification
```css
/* These must be present: */
html, body, #root {
  height: 100dvh;
  height: 100svh; /* fallback */
  overflow: hidden;
}

.app-shell {
  height: 100dvh;
  display: flex;
  flex-direction: column;
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
}

.bottom-nav {
  padding-bottom: env(safe-area-inset-bottom);
}
```

---

## Summary

| Metric | Before | After |
|--------|--------|-------|
| Scroll on iPhone | Yes ❌ | No ✅ |
| Icons | Emojis | Lucide |
| Labels | None | All nav items |
| Card counter | "Card 7" | "Card 7 of 42" |
| Voucher security | localStorage | DynamoDB + Lambda |
| Data persistence | localStorage | Amplify + Cognito |
| Streaks | None | Draw + Love logged |

---

*Created: February 4, 2026*
*Author: Implementation Plan for Compliment Deck v2*
