# 💕 Valentine Compliment Deck

A beautiful, mobile-first web app featuring a deck of heartfelt compliments. Built with React, TypeScript, and Tailwind CSS, featuring cute animated mascots and delightful interactions.

![Made with Love](https://img.shields.io/badge/Made%20with-💕-ff4da6)

## ✨ Features

- **Compliment Deck**: 40+ unique compliments across categories (sweet, funny, supportive, spicy-lite)
- **Non-repeating draws**: Cards shuffle and don't repeat until the deck is exhausted
- **Favorites**: Save your favorite compliments with a tap
- **Share**: Share compliments via Web Share API or clipboard
- **Cute Mascots**: HeartBuddy, CoupleDots, and Envelope - all animated inline SVGs!
- **Secret Mode**: Tap HeartBuddy 5 times quickly to unlock 12 secret compliments 🔐
- **Confetti**: Delightful confetti bursts on saves and milestones
- **End Screen**: Beautiful celebration when you've seen all cards
- **Sound Effects**: Subtle audio feedback (muted by default)
- **Persistent Storage**: Favorites and unlocks saved to localStorage
- **Mobile-First**: Designed for iPhone screens first, responsive on desktop

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Navigate to the project directory
cd Valentines

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
# Build the app
npm run build

# Preview the production build
npm run preview
```

## 📱 Best Experience

This app is optimized for mobile viewing. For the best experience:

1. Open on your phone or use Chrome DevTools mobile view
2. Add to home screen for a full-screen app-like experience
3. Share the link with your special someone! 💕

## 🎨 Customization Checklist

Make this app personal! Here's exactly what to edit:

### 1. Compliments (`src/data/compliments.ts`)

Edit the compliments array to add personal touches:

```typescript
// Line 15-onwards: Edit any compliment text
{
  id: 'sweet-1',
  text: "You make ordinary moments feel extraordinary, [Partner's Name].", // Add their name!
  category: 'sweet',
  intensity: 2,
  emoji: '✨'
}
```

**Personalizable sections:**

- Lines 15-95: **Sweet compliments** (15 total)
- Lines 97-145: **Funny compliments** (10 total) - Add inside jokes!
- Lines 147-195: **Supportive compliments** (10 total)
- Lines 197-235: **Spicy-lite compliments** (7 total)
- Lines 237-310: **Secret compliments** (12 total) - Make these extra special!

### 2. End Screen Message (`src/components/EndScreen.tsx`)

```typescript
// Line 17-18: Change the end message
const END_MESSAGE = "That's the whole deck—still true every time.";
const SUBTITLE = "Every compliment was written with you in mind 💕";
```

Change these to something personal like:

```typescript
const END_MESSAGE = "Every word is true, [Name]. Always and forever.";
const SUBTITLE = "You're my favorite person 💕";
```

### 3. App Title (`index.html`)

```html
<!-- Line 10: Change the page title -->
<title>Valentine Compliment Deck 💕</title>
```

### 4. Header Title (`src/components/Header.tsx`)

```typescript
// Line 27-28: Change the app header
<h1>Compliment Deck</h1>
<span>made with 💕</span>
```

### 5. Categories & Intensity

Each compliment has:

- `category`: 'sweet' | 'funny' | 'supportive' | 'spicy-lite' | 'secret'
- `intensity`: 1 (mild) | 2 (medium) | 3 (strong)
- `emoji`: Optional emoji shown on the card

Feel free to adjust these to match the tone you want!

### 6. Draw Threshold (`src/hooks/useDeck.ts`)

```typescript
// Line 22: Change when the end screen appears
const DRAW_THRESHOLD = 30; // Show end screen after this many draws
```

### 7. Colors (`tailwind.config.js`)

The color palette is defined in the Tailwind config. Key colors:

- `accent.pink`: #ff4da6 (main accent color)
- `blush`: Various pink shades for backgrounds
- `accent.lavender`: #e6d5ff (used for secret mode)

## 🔐 Secret Mode Easter Egg

Tap HeartBuddy (the floating heart mascot) **5 times within 3 seconds** to unlock the secret deck!

Secret compliments are:

- Hidden from normal draws until unlocked
- Marked with a special badge and purple styling
- Extra personal (customize these in `compliments.ts`)

## 🗂️ Project Structure

```
src/
├── App.tsx                 # Main app component
├── main.tsx               # Entry point
├── index.css              # Global styles + Tailwind
├── components/
│   ├── Header.tsx         # Top bar with mute & favorites
│   ├── ComplimentCard.tsx # The main card display
│   ├── WaxSeal.tsx        # Animated seal stamp
│   ├── ActionBar.tsx      # Draw, Save, Share buttons
│   ├── FavoritesModal.tsx # Saved cards drawer
│   ├── EndScreen.tsx      # Deck completion celebration
│   └── mascots/
│       ├── HeartBuddy.tsx # Main heart mascot (tap for secrets!)
│       ├── CoupleDots.tsx # Two dots leaning together
│       ├── Envelope.tsx   # Cute animated envelope
│       └── Mascots.tsx    # Container component
├── context/
│   └── ToastContext.tsx   # Toast notification system
├── data/
│   └── compliments.ts     # ⭐ EDIT THIS: All compliments live here
├── hooks/
│   ├── useDeck.ts         # Deck state & shuffling logic
│   ├── useFavorites.ts    # Favorites management
│   ├── useRapidTap.ts     # Secret mode tap detection
│   └── useSound.ts        # Audio feedback
└── utils/
    ├── storage.ts         # localStorage helpers
    ├── confetti.ts        # Confetti animations
    └── helpers.ts         # Misc utilities
```

## 🛠️ Tech Stack

- **Vite** - Build tool
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **canvas-confetti** - Celebration effects
- **localStorage** - Persistence (no backend needed!)

## 💡 Tips

1. **Make it personal**: The more inside jokes and personal references you add, the more special it becomes!
2. **Test on mobile**: Use Chrome DevTools to preview on iPhone sizes
3. **Sound is off by default**: Users can enable it with the speaker icon
4. **Deck auto-reshuffles**: After all cards are seen, it reshuffles automatically
5. **Favorites persist**: Even after refreshing, favorites stay saved

## 🎉 Deploy

The build output is a static site. Deploy anywhere:

- **Vercel**: `npx vercel`
- **Netlify**: Drag & drop the `dist` folder
- **GitHub Pages**: Push to gh-pages branch
- **Any static host**: Upload the `dist` folder

## 📄 License

Made with 💕 for your special someone. Use it however you like!

---

**Pro tip**: Send this to your partner on Valentine's Day and watch them tap through all the compliments! 💕
