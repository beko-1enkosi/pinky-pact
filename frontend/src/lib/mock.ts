import type { Pact } from "@/components/pinky/PactCard";

export const mockPacts: Pact[] = [
  {
    id: "1",
    emoji: "🏃",
    title: "Run 5km daily",
    category: "Fitness",
    stake: 0.5,
    witnesses: 3,
    daysLeft: 6,
    progress: 42,
    status: "Active",
  },
  {
    id: "2",
    emoji: "📚",
    title: "Study Rust for 1 hour",
    category: "Education",
    stake: 0.3,
    witnesses: 2,
    daysLeft: 11,
    progress: 28,
    status: "Active",
  },
];

export const mockWitnessing = [
  { id: "w1", title: "Mpho's Gym Pact", creator: "Mpho", status: "Vote pending" },
];

export const categories = [
  { emoji: "🏃", label: "Fitness" },
  { emoji: "🎨", label: "Art" },
  { emoji: "📚", label: "Education" },
  { emoji: "🥗", label: "Nutrition" },
  { emoji: "💰", label: "Finance" },
  { emoji: "✨", label: "Personal Growth" },
];
