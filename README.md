# 💕 Valentine Compliment Deck

A mobile-first web app featuring a dynamic deck of heartfelt compliments for Caitlyn. Built with React, TypeScript, Tailwind CSS, and AWS Amplify.

![Made with Love](https://img.shields.io/badge/Made%20with-💕-ff4da6)

## Features

- **Dynamic Card Deck** — Cards include text messages, redeemable vouchers, and playlist recommendations
- **Open When Moods** — Filter cards by mood: Lonely, Stressed, Sad, Bored, Happy
- **Non-Repeating Draws** — Cards shuffle and don't repeat until deck is exhausted
- **Favorites & Notes** — Save cards, add personal notes, sync across devices via AWS
- **Admin Panel** — Add custom cards and send notes (access via long-press on wax seal)
- **Secret Mode** — Tap the HeartBuddy mascot 5× quickly to unlock secret compliments
- **Themes** — Unlock lavender, night, and sunset themes at milestones
- **Stats Tracking** — View cards seen, favorites, vouchers redeemed, and more
- **Daily Mode** — Optional mode limiting draws to 3 per day
- **Mobile-First** — Designed for iPhone, works on all devices

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Run tests
npm run test
```

Dev server runs at `http://localhost:5173`

## Project Structure

```
src/
├── App.tsx                    # Entry point, routing
├── config.ts                  # All customization settings
├── main.tsx                   # React mount
├── types.ts                   # TypeScript types
├── api/                       # AWS Amplify API client
├── components/
│   ├── MainContentV2.tsx      # Main app view
│   ├── HeaderV2.tsx           # Top bar with stats and settings
│   ├── CardRenderer.tsx       # Card display component
│   ├── ActionBar.tsx          # Draw/Save/Share buttons
│   ├── MoodPickerV2.tsx       # Open When mood selector
│   ├── EndScreen.tsx          # Deck completion celebration
│   ├── StatsDrawer.tsx        # Stats and achievements
│   ├── FavoritesModal.tsx     # Saved cards drawer
│   ├── NotesModal.tsx         # Notes from admin
│   ├── SettingsModal.tsx      # App preferences
│   ├── VoucherInventoryModal  # Redeemed vouchers
│   ├── SeenCardsModal.tsx     # Browse all seen cards
│   ├── OpenWhenModalV2.tsx    # View cards by mood
│   ├── WaxSeal.tsx            # Animated seal (long-press for admin)
│   ├── admin/                 # Admin dashboard and card manager
│   ├── layout/                # AppShell and BottomNav
│   └── mascots/               # HeartBuddy, CoupleDots, Envelope
├── context/
│   └── ToastContext.tsx       # Toast notification system
├── data/
│   ├── cards.ts               # All card definitions
│   └── compliments.ts         # Adapter for backward compatibility
├── hooks/
│   ├── useAppState.ts         # Main app state manager
│   ├── useDeckNew.ts          # Deck shuffling and draws
│   ├── useFavorites.ts        # Favorites management
│   ├── useProgress.ts         # Milestone tracking
│   ├── useRapidTap.ts         # Secret mode detection
│   ├── useSound.ts            # Audio feedback
│   ├── useTheme.ts            # Theme management
│   └── useHaptic.ts           # Vibration feedback
└── utils/
    ├── storage.ts             # localStorage helpers
    ├── cloudStorage.ts        # AWS Amplify sync
    ├── confetti.ts            # Celebration effects
    └── helpers.ts             # Formatting utilities
```

## Customization

All settings are in `src/config.ts`:

```typescript
export const CONFIG = {
  sealText: "Love, Zack",           // Wax seal stamp text
  endMessage: "...",                 // End screen message
  partnerName: "Caitlyn",           // Used in {pet} placeholders
  secretTapCount: 5,                 // Taps to unlock secrets
  dailyDrawLimit: 3,                 // Daily mode limit
  milestones: { ... },               // Theme unlock thresholds
}
```

### Adding Cards

Edit `src/data/cards.ts`. Card types:

```typescript
// Text card
{
  id: "sweet-001",
  type: "text",
  category: "sweet",           // sweet | funny | supportive | spicy-lite | secret
  rarity: "common",            // common | rare | epic | legendary
  openWhen: "lonely",          // lonely | stressed | sad | bored | happy
  emoji: "💕",
  text: "{pet}, you make everything better."
}

// Voucher card
{
  id: "voucher-001",
  type: "voucher",
  emoji: "💐",
  title: "Redeem for flowers",
  options: ["Surprise bouquet", "Pick together", "Flower + date"]
}

// Playlist card
{
  id: "playlist-001",
  type: "playlist",
  emoji: "🎵",
  songTitle: "Die With A Smile",
  artist: "Lady Gaga, Bruno Mars",
  link: "https://open.spotify.com/track/..."
}
```

The `{pet}` placeholder is replaced with the partner name at runtime.

## Tech Stack

| Technology | Purpose |
|------------|---------|
| React 18 | UI framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Vite | Build tool |
| Framer Motion | Animations |
| AWS Amplify | Backend (API, Auth) |
| Vitest | Testing |
| canvas-confetti | Celebrations |
| lucide-react | Icons |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests in watch mode |
| `npm run test:run` | Run tests once |
| `npm run test:coverage` | Generate coverage report |

## Deployment

Build output is static. Deploy anywhere:

```bash
npm run build    # Creates dist/ folder
```

- **AWS Amplify**: Push to repo, auto-deploys via amplify.yml
- **Vercel/Netlify**: Point to dist/ folder
- **Any static host**: Upload dist/ contents

## AWS Amplify Backend

The app uses AWS Amplify for:
- **API**: GraphQL for syncing favorites, notes, voucher requests
- **Auth**: Cognito for admin authentication

Backend config is in `amplify/` directory. Run `amplify push` to deploy changes.

---

Made with 💕 for Caitlyn
