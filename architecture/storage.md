# Storage Architecture SOP

## Overview
The MVP uses `localStorage` for all persistent data to ensure local-first capabilities without complex backends. Data is synchronized into specific structures on startup and serialized on change.

## Constants & Keys
- `SB_USER_CONFIG`
- `SB_SESSION_HISTORY`
- `SB_PROGRESS_STATS`

## Data Interfaces
```typescript
interface UserSettings {
  difficulty: "beginner" | "intermediate" | "advanced";
  preferredRoundDurationSeconds: number; // e.g., 120 (2 mins)
  preferredRestDurationSeconds: number; // e.g., 60 (1 min)
  audioEnabled: boolean;
}

interface TrainingSession {
  id: string; // uuid
  startedAt: string; // ISO 8601
  completedAt?: string; // ISO 8601
  durationSeconds: number;
  completedSeconds: number;
  roundsPlanned: number;
  roundsCompleted: number;
  difficulty: string;
  combinationIds: string[];
  xpEarned: number;
}

interface ProgressStats {
  currentStreak: number;
  longestStreak: number;
  totalSessions: number;
  totalPracticeSeconds: number; // Used for XP
  totalXp: number;
  level: number;
  badges: string[];
  lastTrainingDate: string | null; // Format: YYYY-MM-DD
}
```

## Storage Handlers
Abstract functions located in `src/tools/storage.ts`:
- `saveSession(session: TrainingSession): void`
- `getSessions(): TrainingSession[]`
- `updateProgress(session: TrainingSession): ProgressStats`
- `getProgress(): ProgressStats`
- `updateSettings(settings: Partial<UserSettings>): UserSettings`
- `getSettings(): UserSettings`
