export type Difficulty = "beginner" | "intermediate" | "advanced";

export interface UserSettings {
  difficulty: Difficulty;
  preferredRoundDurationSeconds: number;
  preferredRestDurationSeconds: number;
  audioEnabled: boolean;
  tempo: number; // Tempo multiplier (1.0 = normal speed)
}

export interface TrainingSession {
  id: string; // uuid
  startedAt: string; // ISO 8601
  completedAt?: string; // ISO 8601
  durationSeconds: number;
  completedSeconds: number; // The actual time trained
  roundsPlanned: number;
  roundsCompleted: number;
  difficulty: Difficulty;
  combinationIds: string[];
  xpEarned: number;
}

export interface ProgressStats {
  currentStreak: number;
  longestStreak: number;
  totalSessions: number;
  totalPracticeSeconds: number; // Used for XP
  totalXp: number;
  level: number;
  badges: string[];
  lastTrainingDate: string | null; // Format: YYYY-MM-DD
}

export interface Punch {
  number: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  name: "Jab" | "Cross" | "Lead Hook" | "Rear Hook" | "Lead Uppercut" | "Rear Uppercut" | "Jab (Body)" | "Cross (Body)" | "Lead Hook (Body)" | "Rear Hook (Body)" | "Lead Uppercut (Body)" | "Rear Uppercut (Body)";
}

export interface Combination {
  id: string;
  name: string;
  sequence: number[]; // e.g., [1, 2]
  difficulty: Difficulty;
  category: "basic" | "power" | "speed" | "body";
}
