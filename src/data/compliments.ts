export interface Compliment {
  id: string;
  text: string;
  category: "sweet" | "funny" | "supportive" | "spicy-lite" | "secret";
  intensity: 1 | 2 | 3;
  emoji?: string;
}

// ============================================================
// CUSTOMIZATION: Edit these compliments to personalize!
// - Add your partner's name where you see [Name]
// - Add inside jokes and personal references
// - Adjust intensity (1=mild, 2=medium, 3=strong)
// ============================================================

export const compliments: Compliment[] = [
  // ===== SWEET (15) =====
  {
    id: "sweet-1",
    text: "You make ordinary moments feel extraordinary.",
    category: "sweet",
    intensity: 2,
    emoji: "✨",
  },
  {
    id: "sweet-2",
    text: "My favorite place is next to you.",
    category: "sweet",
    intensity: 2,
    emoji: "🏠",
  },
  {
    id: "sweet-3",
    text: "You're the reason I believe in love stories.",
    category: "sweet",
    intensity: 3,
    emoji: "📖",
  },
  {
    id: "sweet-4",
    text: "Every love song makes sense because of you.",
    category: "sweet",
    intensity: 2,
    emoji: "🎵",
  },
  {
    id: "sweet-5",
    text: "You have the most beautiful soul I've ever known.",
    category: "sweet",
    intensity: 3,
    emoji: "💫",
  },
  {
    id: "sweet-6",
    text: "Falling for you was the best decision I never made.",
    category: "sweet",
    intensity: 2,
    emoji: "🍂",
  },
  {
    id: "sweet-7",
    text: "You're my favorite notification.",
    category: "sweet",
    intensity: 1,
    emoji: "📱",
  },
  {
    id: "sweet-8",
    text: "I'd choose you in every lifetime.",
    category: "sweet",
    intensity: 3,
    emoji: "♾️",
  },
  {
    id: "sweet-9",
    text: "Your smile is my favorite sight in the whole world.",
    category: "sweet",
    intensity: 2,
    emoji: "😊",
  },
  {
    id: "sweet-10",
    text: "You make my heart do that fluttery thing.",
    category: "sweet",
    intensity: 1,
    emoji: "🦋",
  },
  {
    id: "sweet-11",
    text: "Being loved by you is the greatest gift.",
    category: "sweet",
    intensity: 3,
    emoji: "🎁",
  },
  {
    id: "sweet-12",
    text: "You're my person. Always.",
    category: "sweet",
    intensity: 2,
    emoji: "💕",
  },
  {
    id: "sweet-13",
    text: "Home is wherever I'm with you.",
    category: "sweet",
    intensity: 2,
    emoji: "🏡",
  },
  {
    id: "sweet-14",
    text: "You make everything better just by being here.",
    category: "sweet",
    intensity: 1,
    emoji: "🌸",
  },
  {
    id: "sweet-15",
    text: "I fall more in love with you every single day.",
    category: "sweet",
    intensity: 3,
    emoji: "💝",
  },

  // ===== FUNNY (10) =====
  {
    id: "funny-1",
    text: "You're the cheese to my macaroni (I'm very serious about this).",
    category: "funny",
    intensity: 1,
    emoji: "🧀",
  },
  {
    id: "funny-2",
    text: "I love you more than pizza. And I REALLY love pizza.",
    category: "funny",
    intensity: 1,
    emoji: "🍕",
  },
  {
    id: "funny-3",
    text: "You're so cute it's actually annoying (in the best way).",
    category: "funny",
    intensity: 1,
    emoji: "😤",
  },
  {
    id: "funny-4",
    text: "If you were a vegetable, you'd be a cute-cumber.",
    category: "funny",
    intensity: 1,
    emoji: "🥒",
  },
  {
    id: "funny-5",
    text: "I like you even when I'm hungry. That's real love.",
    category: "funny",
    intensity: 2,
    emoji: "🍔",
  },
  {
    id: "funny-6",
    text: "You're the only person whose snoring I find adorable.",
    category: "funny",
    intensity: 1,
    emoji: "😴",
  },
  {
    id: "funny-7",
    text: "My Netflix password? That's commitment.",
    category: "funny",
    intensity: 1,
    emoji: "📺",
  },
  {
    id: "funny-8",
    text: "You make my dopamine levels do crazy things.",
    category: "funny",
    intensity: 1,
    emoji: "🧠",
  },
  {
    id: "funny-9",
    text: "Are you a parking ticket? Because you've got fine written all over you.",
    category: "funny",
    intensity: 1,
    emoji: "🎫",
  },
  {
    id: "funny-10",
    text: "You're the reason I check my phone 47 times a day.",
    category: "funny",
    intensity: 1,
    emoji: "👀",
  },

  // ===== SUPPORTIVE (10) =====
  {
    id: "supportive-1",
    text: "I believe in you more than you believe in yourself.",
    category: "supportive",
    intensity: 2,
    emoji: "💪",
  },
  {
    id: "supportive-2",
    text: "Your strength inspires me every day.",
    category: "supportive",
    intensity: 2,
    emoji: "🌟",
  },
  {
    id: "supportive-3",
    text: "Whatever you're going through, I'm right here.",
    category: "supportive",
    intensity: 2,
    emoji: "🤝",
  },
  {
    id: "supportive-4",
    text: "You handle life's challenges with such grace.",
    category: "supportive",
    intensity: 2,
    emoji: "👑",
  },
  {
    id: "supportive-5",
    text: "I'm so proud of who you are and who you're becoming.",
    category: "supportive",
    intensity: 3,
    emoji: "🌱",
  },
  {
    id: "supportive-6",
    text: "Your dreams matter to me as much as my own.",
    category: "supportive",
    intensity: 3,
    emoji: "🚀",
  },
  {
    id: "supportive-7",
    text: "You deserve every good thing coming your way.",
    category: "supportive",
    intensity: 2,
    emoji: "🎯",
  },
  {
    id: "supportive-8",
    text: "Even on hard days, you're incredible.",
    category: "supportive",
    intensity: 2,
    emoji: "💎",
  },
  {
    id: "supportive-9",
    text: "I'll always be your biggest fan.",
    category: "supportive",
    intensity: 2,
    emoji: "📣",
  },
  {
    id: "supportive-10",
    text: "You make me want to be a better person.",
    category: "supportive",
    intensity: 3,
    emoji: "🌈",
  },

  // ===== SPICY-LITE (7) =====
  {
    id: "spicy-1",
    text: "Is it hot in here or is it just you?",
    category: "spicy-lite",
    intensity: 1,
    emoji: "🔥",
  },
  {
    id: "spicy-2",
    text: "You're absolutely stunning and I'm so lucky.",
    category: "spicy-lite",
    intensity: 2,
    emoji: "😍",
  },
  {
    id: "spicy-3",
    text: "The way you look at me makes me forget how to think.",
    category: "spicy-lite",
    intensity: 2,
    emoji: "🫠",
  },
  {
    id: "spicy-4",
    text: "You have this effect on me that I can't explain.",
    category: "spicy-lite",
    intensity: 2,
    emoji: "✨",
  },
  {
    id: "spicy-5",
    text: "Every time I see you, I fall for you all over again.",
    category: "spicy-lite",
    intensity: 2,
    emoji: "💘",
  },
  {
    id: "spicy-6",
    text: "You're the most attractive person in any room.",
    category: "spicy-lite",
    intensity: 2,
    emoji: "🌹",
  },
  {
    id: "spicy-7",
    text: "That smile of yours should come with a warning label.",
    category: "spicy-lite",
    intensity: 1,
    emoji: "⚠️",
  },

  // ============================================================
  // SECRET COMPLIMENTS (12) - Unlocked via easter egg
  // CUSTOMIZATION: Make these extra personal!
  // ============================================================
  {
    id: "secret-1",
    text: "This is just between us: you're the one I've been waiting for my whole life.",
    category: "secret",
    intensity: 3,
    emoji: "🔐",
  },
  {
    id: "secret-2",
    text: "Secret confession: I think about you way more than I let on.",
    category: "secret",
    intensity: 2,
    emoji: "🤫",
  },
  {
    id: "secret-3",
    text: "In my dreams, it's always you.",
    category: "secret",
    intensity: 3,
    emoji: "💭",
  },
  {
    id: "secret-4",
    text: "You found the secret deck! Just like you found your way into my heart.",
    category: "secret",
    intensity: 2,
    emoji: "🗝️",
  },
  {
    id: "secret-5",
    text: "I wrote this one just for you: You're my forever person.",
    category: "secret",
    intensity: 3,
    emoji: "✍️",
  },
  {
    id: "secret-6",
    text: "Whisper mode: I love everything about you. Even the weird stuff.",
    category: "secret",
    intensity: 2,
    emoji: "🌙",
  },
  {
    id: "secret-7",
    text: "Top secret: My heart races every time you're near.",
    category: "secret",
    intensity: 2,
    emoji: "💓",
  },
  {
    id: "secret-8",
    text: "Hidden message: You + Me = Everything I've ever wanted.",
    category: "secret",
    intensity: 3,
    emoji: "💌",
  },
  {
    id: "secret-9",
    text: "For your eyes only: I'm head over heels, completely, hopelessly in love with you.",
    category: "secret",
    intensity: 3,
    emoji: "👁️",
  },
  {
    id: "secret-10",
    text: "Classified: You make me believe in soulmates.",
    category: "secret",
    intensity: 3,
    emoji: "🔏",
  },
  {
    id: "secret-11",
    text: "Private note: You're the plot twist I never saw coming.",
    category: "secret",
    intensity: 2,
    emoji: "📝",
  },
  {
    id: "secret-12",
    text: "Secret's out: You're the love of my life. There. I said it. 💕",
    category: "secret",
    intensity: 3,
    emoji: "💕",
  },
];

// Helper to get non-secret compliments
export const getRegularCompliments = (): Compliment[] =>
  compliments.filter((c) => c.category !== "secret");

// Helper to get secret compliments
export const getSecretCompliments = (): Compliment[] =>
  compliments.filter((c) => c.category === "secret");

// Get all available compliments based on unlock status
export const getAvailableCompliments = (
  secretUnlocked: boolean,
): Compliment[] => (secretUnlocked ? compliments : getRegularCompliments());
