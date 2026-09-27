import { UserSettings, TrainingSession, ProgressStats } from '../types';

const KEYS = {
  USER_CONFIG: 'SB_USER_CONFIG',
  SESSION_HISTORY: 'SB_SESSION_HISTORY',
  PROGRESS_STATS: 'SB_PROGRESS_STATS',
};

const DEFAULT_SETTINGS: UserSettings = {
  difficulty: "beginner",
  preferredRoundDurationSeconds: 120, // 2 mins
  preferredRestDurationSeconds: 60, // 1 min
  audioEnabled: true,
  tempo: 1.0, // Normal tempo
};

const DEFAULT_PROGRESS: ProgressStats = {
  currentStreak: 0,
  longestStreak: 0,
  totalSessions: 0,
  totalPracticeSeconds: 0,
  totalXp: 0,
  level: 1,
  badges: [],
  lastTrainingDate: null,
};

export function getSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(KEYS.USER_CONFIG);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: Partial<UserSettings>): UserSettings {
  const current = getSettings();
  const updated = { ...current, ...settings };
  localStorage.setItem(KEYS.USER_CONFIG, JSON.stringify(updated));
  return updated;
}

export function getProgress(): ProgressStats {
  try {
    const raw = localStorage.getItem(KEYS.PROGRESS_STATS);
    if (!raw) return { ...DEFAULT_PROGRESS };
    return { ...DEFAULT_PROGRESS, ...JSON.parse(raw) };
  } catch (e) {
    return { ...DEFAULT_PROGRESS };
  }
}

export function saveProgress(progress: ProgressStats): void {
  localStorage.setItem(KEYS.PROGRESS_STATS, JSON.stringify(progress));
}

export function getSessions(): TrainingSession[] {
  try {
    const raw = localStorage.getItem(KEYS.SESSION_HISTORY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

export function saveSession(session: TrainingSession): void {
  const history = getSessions();
  history.push(session);
  localStorage.setItem(KEYS.SESSION_HISTORY, JSON.stringify(history));
}
