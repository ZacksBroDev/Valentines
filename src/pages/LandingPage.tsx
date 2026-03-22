// ============================================================
// PUBLIC LANDING PAGE - Portfolio / resume-safe showcase
// No private card content — just project summary & tech stack
// ============================================================

import { useNavigate } from "react-router-dom";
import { Heart, Code, Shield, Sparkles, Layers, Palette } from "lucide-react";

const TECH_STACK = [
  { name: "React 18", icon: "⚛️" },
  { name: "TypeScript", icon: "🟦" },
  { name: "Tailwind CSS", icon: "🎨" },
  { name: "Framer Motion", icon: "🎬" },
  { name: "AWS Amplify", icon: "☁️" },
  { name: "Amazon Cognito", icon: "🔐" },
  { name: "AWS AppSync (GraphQL)", icon: "📡" },
  { name: "DynamoDB", icon: "🗄️" },
  { name: "Vite", icon: "⚡" },
];

const FEATURES = [
  {
    icon: <Layers className="w-6 h-6" />,
    title: "Dynamic Card Deck Engine",
    description:
      "Swipe-driven card deck with mood filtering, daily draw limits, rarity tiers, and secret deck unlocking via progress milestones.",
  },
  {
    icon: <Palette className="w-6 h-6" />,
    title: "Theming & Animations",
    description:
      "Four unlockable themes (Blush, Lavender, Night, Sunset) with Framer Motion transitions, heart trail particles, and sticker reactions.",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Auth & Privacy",
    description:
      "Cognito-backed authentication with role-based access and protected backend reads for private app features.",
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: "Cross-Device Sync",
    description:
      "Cloud-synced voucher system (request → approve → redeem), shared note inbox, and real-time template management via AppSync.",
  },
  {
    icon: <Code className="w-6 h-6" />,
    title: "Admin Dashboard",
    description:
      "Admin-only panel for card CRUD, voucher template management, and shared note moderation — all role-gated via Cognito groups.",
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: "Engagement Mechanics",
    description:
      "Love meter, progress-based rewards, streak tracking, favorites, personal notes, and 'Open When' emotional categories.",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-50">
      {/* Hero */}
      <header className="relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-700 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Heart className="w-4 h-4 fill-current" />
            Personal Project
          </div>

          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-gray-900 mb-4">
            Compliment Deck
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            A full-stack React app that delivers personalized compliment cards
            with mood filtering, unlockable themes, a voucher redemption system,
            and cloud-synced cross-device state — built with love and serious
            engineering.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate("/login")}
              className="inline-flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-xl px-8 py-3.5 transition-colors shadow-lg shadow-pink-200"
            >
              <Shield className="w-5 h-5" />
              Launch Private App
            </button>

            <a
              href="https://github.com/ZacksBroDev/Valentines"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-800 font-semibold rounded-xl px-8 py-3.5 ring-1 ring-gray-200 transition-colors"
            >
              <Code className="w-5 h-5" />
              View Source
            </a>
          </div>
        </div>
      </header>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Architecture & Features
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(({ icon, title, description }) => (
            <div
              key={title}
              className="bg-white rounded-2xl p-6 shadow-sm ring-1 ring-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-pink-100 text-pink-600 rounded-xl mb-4">
                {icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="bg-white/60 backdrop-blur border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
            Tech Stack
          </h2>

          <div className="flex flex-wrap justify-center gap-3">
            {TECH_STACK.map(({ name, icon }) => (
              <span
                key={name}
                className="inline-flex items-center gap-2 bg-gray-50 ring-1 ring-gray-200 rounded-full px-5 py-2.5 text-sm font-medium text-gray-700"
              >
                <span>{icon}</span>
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture Diagram placeholder */}
      <section className="max-w-5xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
          The live app fetches protected data after Cognito authentication, and
          admin and user roles are enforced with Cognito groups plus AppSync
          authorization rules.
        </p>

        <div className="bg-gray-50 rounded-2xl p-8 ring-1 ring-gray-200 max-w-3xl mx-auto">
          <pre className="text-left text-sm text-gray-600 leading-relaxed font-mono whitespace-pre-wrap">
            {`┌─────────────┐     ┌──────────────┐     ┌────────────┐
│  React SPA  │────▶│ AWS Cognito  │────▶│  AppSync   │
│  (Vite)     │     │  Auth + RBAC │     │  GraphQL   │
└─────────────┘     └──────────────┘     └─────┬──────┘
                                               │
                                         ┌─────▼──────┐
                                         │  DynamoDB   │
                                         │  (Cards,    │
                                         │  Settings,  │
                                         │  Vouchers)  │
                                         └────────────┘`}
          </pre>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-500 text-sm">
        Built by Zackary Brown &middot;{" "}
        <a
          href="https://github.com/ZacksBroDev"
          target="_blank"
          rel="noopener noreferrer"
          className="text-pink-600 hover:underline"
        >
          @ZacksBroDev
        </a>
      </footer>
    </div>
  );
}
