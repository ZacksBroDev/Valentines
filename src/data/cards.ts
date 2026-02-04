// ============================================================
// CARD DATA - Personal compliments for Caitlyn
// ============================================================

import { Card, TextCard, VoucherCard, PlaylistCard } from "../types";

// ===== PET NAME SYSTEM =====
// Weighted pet name selection for variety
const PET_POOL = ["babe", "baby", "Caitlyn"] as const;
const PET_WEIGHTS = [0.6, 0.25, 0.15];

export function pickPet(): string {
  const r = Math.random();
  let acc = 0;
  for (let i = 0; i < PET_POOL.length; i++) {
    acc += PET_WEIGHTS[i];
    if (r <= acc) return PET_POOL[i];
  }
  return "Caitlyn";
}

export function withPet(text: string): string {
  return text.replace(/{pet}/g, pickPet());
}

// ===== TEXT COMPLIMENTS =====
const textCards: TextCard[] = [
  // ---------------- SWEET / ROMANTIC ----------------
  { id: "sweet-001", type: "text", category: "sweet", rarity: "common", intensity: 2, emoji: "💕", tags: ["lonely"], text: "{pet}, you're my favorite part of every day." },
  { id: "sweet-002", type: "text", category: "sweet", rarity: "common", intensity: 2, emoji: "🥹", tags: ["lonely"], text: "I still can't believe I get to love you." },
  { id: "sweet-003", type: "text", category: "sweet", rarity: "common", intensity: 2, emoji: "✨", tags: ["lonely"], text: "You're beautiful, kind, smart, funny, and somehow all of that at once." },
  { id: "sweet-004", type: "text", category: "sweet", rarity: "common", intensity: 2, emoji: "💪", tags: ["lonely"], text: "You're not 'out of my league.' You're my person. That's it." },
  { id: "sweet-005", type: "text", category: "sweet", rarity: "common", intensity: 2, emoji: "🪞", tags: ["lonely"], text: "I love who I am when I'm with you." },
  { id: "sweet-006", type: "text", category: "sweet", rarity: "common", intensity: 2, emoji: "😊", tags: ["lonely"], text: "Your smile fixes my mood faster than anything." },
  { id: "sweet-007", type: "text", category: "sweet", rarity: "common", intensity: 2, emoji: "🌟", tags: ["lonely"], text: "You make normal days feel like the best days." },
  { id: "sweet-008", type: "text", category: "sweet", rarity: "common", intensity: 2, emoji: "🔄", tags: ["lonely"], text: "I'd pick you again. Every time. No hesitation." },
  { id: "sweet-009", type: "text", category: "sweet", rarity: "common", intensity: 1, emoji: "🏠", tags: ["lonely"], text: "You feel like home to me." },
  { id: "sweet-010", type: "text", category: "sweet", rarity: "common", intensity: 2, emoji: "👑", tags: ["lonely"], text: "You're my favorite human." },
  { id: "sweet-011", type: "text", category: "sweet", rarity: "common", intensity: 2, emoji: "🎵", tags: ["lonely"], text: "I love your laugh. It's my favorite sound." },
  { id: "sweet-012", type: "text", category: "sweet", rarity: "common", intensity: 1, emoji: "🙏", tags: ["lonely"], text: "I'm grateful for you in the everyday, real-life way." },
  { id: "sweet-013", type: "text", category: "sweet", rarity: "common", intensity: 2, emoji: "🧸", tags: ["lonely"], text: "You make my life softer in the best way." },
  { id: "sweet-014", type: "text", category: "sweet", rarity: "common", intensity: 2, emoji: "✨", tags: ["lonely"], text: "I love the way you light up when you're happy." },
  { id: "sweet-015", type: "text", category: "sweet", rarity: "common", intensity: 2, emoji: "💗", tags: ["lonely"], text: "I love being yours." },
  { id: "sweet-016", type: "text", category: "sweet", rarity: "rare", intensity: 2, emoji: "📅", tags: ["lonely"], text: "Since April 13, 2024, my world has been better on purpose." },
  { id: "sweet-017", type: "text", category: "sweet", rarity: "rare", intensity: 2, emoji: "💯", tags: ["lonely"], text: "662 days with you… and I'm still obsessed." },
  { id: "sweet-018", type: "text", category: "sweet", rarity: "rare", intensity: 2, emoji: "🏡", tags: ["lonely"], text: "I want a life with you. The real kind." },
  { id: "sweet-019", type: "text", category: "sweet", rarity: "common", intensity: 2, emoji: "💝", tags: ["lonely"], text: "I love you more than I know how to explain." },
  { id: "sweet-020", type: "text", category: "sweet", rarity: "common", intensity: 1, emoji: "🛡️", tags: ["lonely"], text: "You're my safest place." },

  // ---------------- SPECIFIC MEMORIES ----------------
  { id: "mem-001", type: "text", category: "sweet", rarity: "legendary", intensity: 3, emoji: "🏒", tags: ["lonely"], text: "Our first date at the Avalanche game is still one of my favorite memories." },
  { id: "mem-002", type: "text", category: "sweet", rarity: "legendary", intensity: 3, emoji: "😍", tags: ["lonely"], text: "Seeing you all dolled up at the Avs game made my heart melt. I couldn't stop staring." },
  { id: "mem-003", type: "text", category: "sweet", rarity: "legendary", intensity: 3, emoji: "📣", tags: ["lonely"], text: "You cheering with that big smile—your whole face glowing—was unreal." },
  { id: "mem-004", type: "text", category: "sweet", rarity: "legendary", intensity: 3, emoji: "🏕️", tags: ["lonely"], text: "May 6, 2024: hiking with you, finding that teepee made of sticks… core memory." },
  { id: "mem-005", type: "text", category: "sweet", rarity: "legendary", intensity: 3, emoji: "🧗", tags: ["lonely"], text: "That moment you were on the little cliff—strong, fearless, beautiful—yeah. I remember." },
  { id: "mem-006", type: "text", category: "sweet", rarity: "rare", intensity: 2, emoji: "🥾", tags: ["lonely"], text: "I love remembering how fun that hike felt with you. Just us and the outdoors." },
  { id: "mem-007", type: "text", category: "sweet", rarity: "legendary", intensity: 3, emoji: "🤗", tags: ["lonely"], text: "The way you greet me when I come over—arms wide, huge smile—hits me every time." },
  { id: "mem-008", type: "text", category: "sweet", rarity: "legendary", intensity: 3, emoji: "❄️", tags: ["lonely"], text: "You come outside to hug and kiss me even when it's freezing. That's love, Caitlyn." },
  { id: "mem-009", type: "text", category: "sweet", rarity: "rare", intensity: 2, emoji: "😴", tags: ["lonely"], text: "When you sleep with your legs crossed and upright… it's the cutest thing I've ever seen." },
  { id: "mem-010", type: "text", category: "sweet", rarity: "rare", intensity: 2, emoji: "🏒", tags: ["lonely"], text: "When we play hockey together and we're both goofy—yeah… that's us. Perfect." },

  // ---------------- SUPPORTIVE (PhD / clinic / life goals) ----------------
  { id: "sup-001", type: "text", category: "supportive", rarity: "common", intensity: 2, emoji: "🎓", tags: ["stressed"], text: "Your PhD is hard. You're harder." },
  { id: "sup-002", type: "text", category: "supportive", rarity: "common", intensity: 2, emoji: "🌬️", tags: ["stressed"], text: "You don't need to earn rest. You're allowed to breathe." },
  { id: "sup-003", type: "text", category: "supportive", rarity: "common", intensity: 2, emoji: "🏗️", tags: ["doubting"], text: "You're not behind. You're building." },
  { id: "sup-004", type: "text", category: "supportive", rarity: "common", intensity: 2, emoji: "👏", tags: ["stressed"], text: "I'm proud of you for how you keep showing up." },
  { id: "sup-005", type: "text", category: "supportive", rarity: "common", intensity: 2, emoji: "🧠", tags: ["doubting"], text: "You're ridiculously smart. Watching you learn medicine stuff is honestly attractive." },
  { id: "sup-006", type: "text", category: "supportive", rarity: "common", intensity: 2, emoji: "🦴", tags: ["stressed"], text: "I don't need to understand all the bones and nerves to know you're brilliant." },
  { id: "sup-007", type: "text", category: "supportive", rarity: "rare", intensity: 2, emoji: "🏥", tags: ["doubting"], text: "Your future PT clinic is going to be real. I can already see your name on the door." },
  { id: "sup-008", type: "text", category: "supportive", rarity: "common", intensity: 2, emoji: "🩺", tags: ["stressed"], text: "Your future patients are going to feel so safe with you." },
  { id: "sup-009", type: "text", category: "supportive", rarity: "common", intensity: 2, emoji: "💪", tags: ["doubting"], text: "You're the kind of person who makes hard things look doable." },
  { id: "sup-010", type: "text", category: "supportive", rarity: "common", intensity: 1, emoji: "💧", tags: ["stressed"], text: "Drink water. Unclench your jaw. I love you." },

  // ---------------- BODY IMAGE ----------------
  { id: "bi-001", type: "text", category: "supportive", rarity: "common", intensity: 2, emoji: "💗", tags: ["doubting"], text: "I hate that you feel bad about your body sometimes. I love you exactly as you are." },
  { id: "bi-002", type: "text", category: "supportive", rarity: "common", intensity: 2, emoji: "🏃", tags: ["doubting"], text: "Your body is strong—it hikes, climbs, skates, snowboards, and carries you through everything." },
  { id: "bi-003", type: "text", category: "supportive", rarity: "common", intensity: 2, emoji: "🌸", tags: ["doubting"], text: "When your brain is mean to you, I'm going to be extra gentle with you." },
  { id: "bi-004", type: "text", category: "supportive", rarity: "common", intensity: 2, emoji: "👀", tags: ["doubting"], text: "You don't see what I see. I see beautiful. I see powerful. I see Caitlyn." },
  { id: "bi-005", type: "text", category: "supportive", rarity: "common", intensity: 2, emoji: "🤍", tags: ["doubting"], text: "You deserve kindness from everyone—including you." },

  // ---------------- OVERTHINKING / OVERSTIMULATION ----------------
  { id: "calm-001", type: "text", category: "supportive", rarity: "common", intensity: 2, emoji: "🔇", tags: ["overstimulated"], text: "If you're overstimulated, I'll lower the volume and stay close. No questions." },
  { id: "calm-002", type: "text", category: "supportive", rarity: "common", intensity: 2, emoji: "🤝", tags: ["overstimulated"], text: "You don't have to explain perfectly. I'm not going anywhere." },
  { id: "calm-003", type: "text", category: "supportive", rarity: "common", intensity: 2, emoji: "🧘", tags: ["overstimulated"], text: "If your brain is racing, I'll be your calm. We can just exist together." },
  { id: "calm-004", type: "text", category: "supportive", rarity: "common", intensity: 2, emoji: "🌀", tags: ["stressed"], text: "Overthinking is just your brain trying to protect you. I've got you." },
  { id: "calm-005", type: "text", category: "supportive", rarity: "common", intensity: 2, emoji: "⚔️", tags: ["doubting"], text: "You don't have to carry everything alone. I'm on your side." },

  // ---------------- FUNNY / PLAYFUL ----------------
  { id: "fun-001", type: "text", category: "funny", rarity: "common", intensity: 1, emoji: "🔥", tags: ["laugh"], text: "You're hot AND smart. It's honestly unfair." },
  { id: "fun-002", type: "text", category: "funny", rarity: "common", intensity: 1, emoji: "🔬", tags: ["laugh"], text: "I support women in STEM. Especially when the woman is you." },
  { id: "fun-003", type: "text", category: "funny", rarity: "common", intensity: 1, emoji: "🦴", tags: ["laugh"], text: "You know bones and blood vessels. I barely know what day it is. I'm still proud of us." },
  { id: "fun-004", type: "text", category: "funny", rarity: "common", intensity: 1, emoji: "🧩", tags: ["laugh"], text: "You overthink. I underthink. Together we make one functional adult." },
  { id: "fun-005", type: "text", category: "funny", rarity: "common", intensity: 1, emoji: "🐛", tags: ["laugh"], text: "If loving you is a bug, I'm not fixing it." },
  { id: "fun-006", type: "text", category: "funny", rarity: "common", intensity: 1, emoji: "📱", tags: ["laugh"], text: "You're my favorite notification." },
  { id: "fun-007", type: "text", category: "funny", rarity: "common", intensity: 1, emoji: "🍟", tags: ["laugh"], text: "I'd share my fries with you. That's real love." },
  { id: "fun-008", type: "text", category: "funny", rarity: "common", intensity: 1, emoji: "😤", tags: ["laugh"], text: "You're the cutest overreactor I've ever met. Respectfully." },
  { id: "fun-009", type: "text", category: "funny", rarity: "common", intensity: 1, emoji: "😈", tags: ["laugh"], text: "I rage-bait you because your reactions are elite… but I stop when you say stop." },
  { id: "fun-010", type: "text", category: "funny", rarity: "common", intensity: 1, emoji: "🏒", tags: ["laugh"], text: "When we play hockey and you look goofy—good. Because I'm goofy too. We match." },
  { id: "fun-011", type: "text", category: "funny", rarity: "common", intensity: 1, emoji: "👯", tags: ["laugh"], text: "We're goofy together. That's basically marriage." },
  { id: "fun-012", type: "text", category: "funny", rarity: "common", intensity: 1, emoji: "📄", tags: ["laugh"], text: "If you were a research paper, I'd actually read the whole thing." },

  // ---------------- FLIRTY-LITE ----------------
  { id: "flirt-001", type: "text", category: "spicy-lite", rarity: "common", intensity: 2, emoji: "⚠️", tags: ["lonely"], text: "You're dangerously pretty." },
  { id: "flirt-002", type: "text", category: "spicy-lite", rarity: "common", intensity: 2, emoji: "🤗", tags: ["lonely"], text: "Come here. I need a hug from you specifically." },
  { id: "flirt-003", type: "text", category: "spicy-lite", rarity: "common", intensity: 2, emoji: "🎮", tags: ["lonely"], text: "Your smile is basically a cheat code." },
  { id: "flirt-004", type: "text", category: "spicy-lite", rarity: "common", intensity: 2, emoji: "🚨", tags: ["lonely"], text: "I'm very into you. This is not a drill." },
  { id: "flirt-005", type: "text", category: "spicy-lite", rarity: "common", intensity: 2, emoji: "💯", tags: ["lonely"], text: "I love your body. I love your mind. I love you. Simple." },

  // ---------------- OUTDOORS / ADVENTURE ----------------
  { id: "out-001", type: "text", category: "sweet", rarity: "common", intensity: 2, emoji: "🥾", tags: ["lonely"], text: "I love that you love hiking. You make life feel bigger." },
  { id: "out-002", type: "text", category: "sweet", rarity: "common", intensity: 2, emoji: "🧗", tags: ["lonely"], text: "Climbing with you feels like being with a superhero." },
  { id: "out-003", type: "text", category: "sweet", rarity: "common", intensity: 2, emoji: "🏕️", tags: ["lonely"], text: "Camping with you feels like a core memory every time." },
  { id: "out-004", type: "text", category: "sweet", rarity: "common", intensity: 2, emoji: "🏂", tags: ["lonely"], text: "Snowboarding with you is my favorite kind of chaos." },
  { id: "out-005", type: "text", category: "supportive", rarity: "common", intensity: 2, emoji: "🌲", tags: ["stressed"], text: "When life is heavy, let's go outside. You always breathe life back into me." },
  { id: "out-006", type: "text", category: "sweet", rarity: "common", intensity: 2, emoji: "🗺️", tags: ["lonely"], text: "I want to keep doing adventures with you for a long time." },

  // ---------------- FLOWERS / LITTLE LOVE ----------------
  { id: "flw-001", type: "text", category: "sweet", rarity: "common", intensity: 2, emoji: "💐", tags: ["lonely"], text: "You deserve flowers way more often than I get them. I'm fixing that." },
  { id: "flw-002", type: "text", category: "sweet", rarity: "common", intensity: 1, emoji: "🌷", tags: ["lonely"], text: "I love how happy flowers make you. It's adorable." },
  { id: "flw-003", type: "text", category: "funny", rarity: "common", intensity: 1, emoji: "🌻", tags: ["laugh"], text: "If you want flowers, just say the word. I'm trainable." },

  // ---------------- FUTURE / MARRIAGE / MOVING OUT ----------------
  { id: "fut-001", type: "text", category: "sweet", rarity: "legendary", intensity: 3, emoji: "🏡", tags: ["lonely"], text: "I want to move out with you and build our little life together." },
  { id: "fut-002", type: "text", category: "sweet", rarity: "legendary", intensity: 3, emoji: "♾️", tags: ["lonely"], text: "When I imagine 'forever,' your face shows up first." },
  { id: "fut-003", type: "text", category: "supportive", rarity: "rare", intensity: 2, emoji: "✅", tags: ["doubting"], text: "Clinic dream. Home dream. Marriage dream. I'm in." },
  { id: "fut-004", type: "text", category: "sweet", rarity: "legendary", intensity: 3, emoji: "💑", tags: ["lonely"], text: "I don't want a life *near* you. I want a life *with* you." },

  // ---------------- SECRET (earned, personal) ----------------
  { id: "secret-001", type: "text", category: "secret", rarity: "legendary", intensity: 3, emoji: "🎬", tags: ["lonely"], text: "The Avs game first date still plays in my head like a movie." },
  { id: "secret-002", type: "text", category: "secret", rarity: "legendary", intensity: 3, emoji: "🏔️", tags: ["lonely"], text: "That May 6th cliff moment—yeah. That's when I thought: 'she's incredible.'" },
  { id: "secret-003", type: "text", category: "secret", rarity: "legendary", intensity: 3, emoji: "🤗", tags: ["lonely"], text: "Your cold-weather greeting hug is one of my favorite things in the world." },
  { id: "secret-004", type: "text", category: "secret", rarity: "legendary", intensity: 3, emoji: "😴", tags: ["lonely"], text: "When you sleep with your legs crossed and upright I want to protect you from the universe." },
  { id: "secret-005", type: "text", category: "secret", rarity: "legendary", intensity: 3, emoji: "💍", tags: ["lonely"], text: "I want to marry you. Not as an idea—like, actually you." },
  { id: "secret-006", type: "text", category: "secret", rarity: "legendary", intensity: 3, emoji: "💖", tags: ["lonely"], text: "Caitlyn Hoffman, you're it for me." },

  // ---------------- OPEN WHEN… (curated) ----------------
  { id: "ow-001", type: "text", category: "supportive", rarity: "common", intensity: 2, emoji: "😮‍💨", tags: ["stressed"], text: "Open when you're stressed: You don't have to do it all today." },
  { id: "ow-002", type: "text", category: "supportive", rarity: "common", intensity: 2, emoji: "🏆", tags: ["stressed"], text: "Open when you're stressed: I'm proud of you for still trying." },
  { id: "ow-003", type: "text", category: "supportive", rarity: "common", intensity: 2, emoji: "📈", tags: ["doubting"], text: "Open when you're doubting yourself: your track record is proof." },
  { id: "ow-004", type: "text", category: "supportive", rarity: "common", intensity: 2, emoji: "🧠", tags: ["doubting"], text: "Open when you're doubting yourself: you're brilliant and capable—no debate." },
  { id: "ow-005", type: "text", category: "funny", rarity: "common", intensity: 1, emoji: "😜", tags: ["laugh"], text: "Open when you need a laugh: you're the cutest menace I know." },
  { id: "ow-006", type: "text", category: "funny", rarity: "common", intensity: 1, emoji: "🦷", tags: ["laugh"], text: "Open when you need a laugh: I'd still choose you even if you tried to bite me." },
  { id: "ow-007", type: "text", category: "supportive", rarity: "common", intensity: 2, emoji: "🤫", tags: ["overstimulated"], text: "Open when you're overstimulated: no talking required, I'm here." },
  { id: "ow-008", type: "text", category: "supportive", rarity: "common", intensity: 2, emoji: "🤍", tags: ["overstimulated"], text: "Open when you're overstimulated: we can do quiet together." },
  { id: "ow-009", type: "text", category: "sweet", rarity: "common", intensity: 2, emoji: "💭", tags: ["lonely"], text: "Open when you feel lonely: I'm thinking about you right now." },
  { id: "ow-010", type: "text", category: "sweet", rarity: "common", intensity: 2, emoji: "💗", tags: ["lonely"], text: "Open when you feel lonely: you're loved more than you know." },

  // ---------------- EXTRA PET NAME CARDS ----------------
  { id: "pet-001", type: "text", category: "sweet", rarity: "legendary", intensity: 3, emoji: "🎬", tags: ["lonely"], text: "{pet}, our first date at the Avalanche game still plays in my head like a movie." },
  { id: "pet-002", type: "text", category: "sweet", rarity: "rare", intensity: 3, emoji: "😍", tags: ["lonely"], text: "Seeing you all dolled up at the Avs game made my heart melt, {pet}." },
  { id: "pet-003", type: "text", category: "sweet", rarity: "rare", intensity: 3, emoji: "📣", tags: ["lonely"], text: "That smile you had cheering at the Avs game? I was done for, {pet}." },
  { id: "pet-004", type: "text", category: "sweet", rarity: "legendary", intensity: 3, emoji: "🏕️", tags: ["lonely"], text: "May 6, 2024—hiking with you and finding that little teepee—core memory, {pet}." },
  { id: "pet-005", type: "text", category: "sweet", rarity: "rare", intensity: 2, emoji: "🤗", tags: ["lonely"], text: "Your 'arms wide + giant smile' greeting is my favorite welcome in the world, {pet}." },
  { id: "pet-006", type: "text", category: "supportive", rarity: "common", intensity: 2, emoji: "🎓", tags: ["stressed"], text: "{pet}, you're doing a PhD. That's not 'hard'—that's insane. And you're doing it." },
  { id: "pet-007", type: "text", category: "supportive", rarity: "common", intensity: 2, emoji: "🧠", tags: ["stressed"], text: "I don't need to understand your medical studies to know you're brilliant, {pet}." },
  { id: "pet-008", type: "text", category: "supportive", rarity: "rare", intensity: 2, emoji: "🏥", tags: ["doubting"], text: "You're going to change people's lives with your clinic, {pet}. That's not hype—that's fact." },
  { id: "pet-009", type: "text", category: "supportive", rarity: "common", intensity: 2, emoji: "🌬️", tags: ["stressed"], text: "You're allowed to rest without 'earning' it, {pet}." },
  { id: "pet-010", type: "text", category: "supportive", rarity: "common", intensity: 2, emoji: "💗", tags: ["doubting"], text: "{pet}, I'm sorry your brain is mean to you sometimes. I love you exactly as you are." },
  { id: "pet-011", type: "text", category: "supportive", rarity: "common", intensity: 2, emoji: "🔇", tags: ["overstimulated"], text: "{pet}, if you're overstimulated, I'll stop joking and start protecting your peace." },
  { id: "pet-012", type: "text", category: "supportive", rarity: "common", intensity: 2, emoji: "⚔️", tags: ["doubting"], text: "I'm on your side, {pet}. Not 'versus you.' Always on your side." },
  { id: "pet-013", type: "text", category: "supportive", rarity: "common", intensity: 2, emoji: "🌊", tags: ["stressed"], text: "It's okay to feel a lot. I can handle you, {pet}." },
  { id: "pet-014", type: "text", category: "sweet", rarity: "common", intensity: 2, emoji: "🥾", tags: ["lonely"], text: "I love that you love the outdoors, {pet}. You make life feel bigger." },
  { id: "pet-015", type: "text", category: "sweet", rarity: "common", intensity: 2, emoji: "🗺️", tags: ["lonely"], text: "You're my favorite adventure partner, {pet}." },
  { id: "pet-016", type: "text", category: "sweet", rarity: "common", intensity: 2, emoji: "💐", tags: ["lonely"], text: "{pet}, you deserve flowers more often than I get them. I'm fixing that." },
  { id: "pet-017", type: "text", category: "sweet", rarity: "common", intensity: 2, emoji: "💪", tags: ["lonely"], text: "I want to be consistent for you, {pet}." },
  { id: "pet-018", type: "text", category: "sweet", rarity: "legendary", intensity: 3, emoji: "🏡", tags: ["lonely"], text: "I want to move out together and build our little world, {pet}." },
  { id: "pet-019", type: "text", category: "sweet", rarity: "legendary", intensity: 3, emoji: "♾️", tags: ["lonely"], text: "I want forever with you, {pet}. The real kind." },
  { id: "pet-020", type: "text", category: "sweet", rarity: "common", intensity: 2, emoji: "🧘", tags: ["lonely"], text: "I want to be the calm in your life, {pet}." },
  { id: "pet-021", type: "text", category: "funny", rarity: "common", intensity: 1, emoji: "😈", tags: ["laugh"], text: "{pet}, I rage-bait you because your reactions are elite… but I stop when you say stop." },
  { id: "pet-022", type: "text", category: "funny", rarity: "common", intensity: 1, emoji: "🔥", tags: ["laugh"], text: "You're hot and smart. That's an illegal combo, {pet}." },
  { id: "pet-023", type: "text", category: "funny", rarity: "common", intensity: 1, emoji: "👯", tags: ["laugh"], text: "We're goofy together, {pet}. That's basically soulmates." },
  { id: "pet-024", type: "text", category: "spicy-lite", rarity: "common", intensity: 2, emoji: "⚠️", tags: ["lonely"], text: "{pet}, you're dangerously pretty." },
  { id: "pet-025", type: "text", category: "spicy-lite", rarity: "common", intensity: 2, emoji: "🎮", tags: ["lonely"], text: "Your smile is a cheat code, {pet}." },

  // ---------------- SHORT "INFINITE FEEL" MINIS ----------------
  { id: "mini-001", type: "text", category: "sweet", rarity: "common", intensity: 1, emoji: "💗", tags: ["lonely"], text: "You're my favorite." },
  { id: "mini-002", type: "text", category: "sweet", rarity: "common", intensity: 1, emoji: "❤️", tags: ["lonely"], text: "I love you." },
  { id: "mini-003", type: "text", category: "supportive", rarity: "common", intensity: 1, emoji: "🏆", tags: ["stressed"], text: "I'm proud of you." },
  { id: "mini-004", type: "text", category: "supportive", rarity: "common", intensity: 1, emoji: "👣", tags: ["stressed"], text: "One step at a time. I'm with you." },
  { id: "mini-005", type: "text", category: "supportive", rarity: "common", intensity: 1, emoji: "💪", tags: ["doubting"], text: "You've got this." },
  { id: "mini-006", type: "text", category: "funny", rarity: "common", intensity: 1, emoji: "🏅", tags: ["laugh"], text: "Certified cutie moment. It's you." },
  { id: "mini-007", type: "text", category: "sweet", rarity: "common", intensity: 1, emoji: "🥺", tags: ["lonely"], text: "I miss you." },
  { id: "mini-008", type: "text", category: "sweet", rarity: "common", intensity: 1, emoji: "🥇", tags: ["lonely"], text: "You're the best." },
  { id: "mini-009", type: "text", category: "supportive", rarity: "common", intensity: 1, emoji: "🤫", tags: ["overstimulated"], text: "Quiet time. Close to me." },
  { id: "mini-010", type: "text", category: "sweet", rarity: "common", intensity: 1, emoji: "🍀", tags: ["lonely"], text: "I'm lucky it's you." },
  { id: "mini-011", type: "text", category: "sweet", rarity: "common", intensity: 1, emoji: "👋", tags: ["lonely"], text: "{pet}. Come here." },
  { id: "mini-012", type: "text", category: "sweet", rarity: "common", intensity: 1, emoji: "💭", tags: ["lonely"], text: "I miss you, {pet}." },
  { id: "mini-013", type: "text", category: "supportive", rarity: "common", intensity: 1, emoji: "🏆", tags: ["stressed"], text: "Proud of you, {pet}." },
  { id: "mini-014", type: "text", category: "supportive", rarity: "common", intensity: 1, emoji: "🛡️", tags: ["stressed"], text: "You're safe with me." },
  { id: "mini-015", type: "text", category: "sweet", rarity: "common", intensity: 1, emoji: "💝", tags: ["lonely"], text: "You're loved. Period." },
  { id: "mini-016", type: "text", category: "supportive", rarity: "common", intensity: 1, emoji: "🌬️", tags: ["overstimulated"], text: "Breathe. I've got you." },
  { id: "mini-017", type: "text", category: "supportive", rarity: "common", intensity: 1, emoji: "⚔️", tags: ["doubting"], text: "I'm on your team, {pet}." },
  { id: "mini-018", type: "text", category: "sweet", rarity: "common", intensity: 1, emoji: "⭐", tags: ["lonely"], text: "I love you, {pet}." },
  { id: "mini-019", type: "text", category: "supportive", rarity: "common", intensity: 1, emoji: "✨", tags: ["stressed"], text: "You're doing great." },
  { id: "mini-020", type: "text", category: "supportive", rarity: "common", intensity: 1, emoji: "💯", tags: ["doubting"], text: "You're enough." },
  { id: "mini-021", type: "text", category: "sweet", rarity: "common", intensity: 1, emoji: "🌟", tags: ["lonely"], text: "You're amazing, {pet}." },
];

// ===== VOUCHER CARDS =====
const voucherCards: VoucherCard[] = [
  {
    id: "voucher-001",
    type: "voucher",
    category: "sweet",
    rarity: "rare",
    tags: ["lonely"],
    emoji: "💐",
    title: "Redeem for flowers 💐",
    options: ["Surprise bouquet + note", "Pick the flowers together", "Flowers + coffee date"],
  },
  {
    id: "voucher-002",
    type: "voucher",
    category: "supportive",
    rarity: "legendary",
    tags: ["stressed"],
    emoji: "🫶",
    title: "Redeem for comfort mode 🫶",
    options: ["Quiet cuddle + show", "Snack run + blanket burrito", "Massage + early night"],
  },
  {
    id: "voucher-003",
    type: "voucher",
    category: "sweet",
    rarity: "rare",
    tags: ["lonely"],
    emoji: "🏔️",
    title: "Redeem for an adventure day 🏔️",
    options: ["Hike + photos", "Climbing + food after", "Snow day + hot drinks"],
  },
  {
    id: "voucher-004",
    type: "voucher",
    category: "sweet",
    rarity: "rare",
    tags: ["lonely"],
    emoji: "🎬",
    title: "Redeem for movie night 🎬",
    options: ["You pick the movie", "Cozy blankets + snacks", "Movie marathon"],
  },
  {
    id: "voucher-005",
    type: "voucher",
    category: "sweet",
    rarity: "rare",
    tags: ["lonely"],
    emoji: "🍕",
    title: "Redeem for dinner date 🍕",
    options: ["Your restaurant pick", "Cook together at home", "Takeout + candlelight"],
  },
];

// ===== PLAYLIST CARDS =====
const playlistCards: PlaylistCard[] = [
  {
    id: "playlist-001",
    type: "playlist",
    category: "sweet",
    rarity: "rare",
    tags: ["lonely"],
    emoji: "🎵",
    songTitle: "Our Avs-date song",
    artist: "Artist TBD",
    link: "https://open.spotify.com",
  },
  {
    id: "playlist-002",
    type: "playlist",
    category: "supportive",
    rarity: "rare",
    tags: ["stressed"],
    emoji: "🎧",
    songTitle: "Calm reset song",
    artist: "Artist TBD",
    link: "https://open.spotify.com",
  },
  {
    id: "playlist-003",
    type: "playlist",
    category: "supportive",
    rarity: "rare",
    tags: ["doubting"],
    emoji: "💪",
    songTitle: "Confidence song",
    artist: "Artist TBD",
    link: "https://open.spotify.com",
  },
];

// ===== COMBINE ALL CARDS =====
export const allCards: Card[] = [...textCards, ...voucherCards, ...playlistCards];

// ===== HELPER FUNCTIONS =====
export function getCardById(id: string): Card | undefined {
  return allCards.find((card) => card.id === id);
}

export function getAvailableCards(
  includeSecret: boolean = false,
  _mood?: string,
  openWhenMode?: string
): Card[] {
  let cards = allCards.filter((card) => {
    // Filter out secret cards unless unlocked
    if (card.category === "secret" && !includeSecret) {
      return false;
    }
    return true;
  });

  // Filter by open when mode
  if (openWhenMode && openWhenMode !== "all") {
    cards = cards.filter((card) => card.tags?.includes(openWhenMode));
  }

  return cards;
}

// ===== EXPORTS FOR BACKWARDS COMPATIBILITY =====
export { textCards, voucherCards, playlistCards };
export default allCards;
