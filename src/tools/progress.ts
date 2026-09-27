import { getProgress, saveProgress, saveSession, getSessions } from './storage';
import { TrainingSession, ProgressStats } from '../types';

export function calculateLevel(totalXp: number): number {
  return Math.floor(Math.sqrt(totalXp / 100)) + 1;
}

function getLocalDateString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function getYesterdayDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/**
 * Calculates total completed seconds for the current calendar day
 * from the saved session history (not counting the session about to be saved).
 */
export function getTodayTotalSeconds(sessions: TrainingSession[]): number {
  const dateStr = getLocalDateString();
  return sessions
    .filter(s => s.startedAt.startsWith(dateStr))
    .reduce((acc, curr) => acc + curr.completedSeconds, 0);
}

/**
 * Saves a completed session and updates the progress stats:
 * - Adds XP and recalculates level.
 * - Updates streak (requires 5 min / 300s total today to qualify).
 * - Saves updated progress to localStorage.
 */
export function finalizeSession(session: TrainingSession): ProgressStats {
  // Compute today's total BEFORE this session (from persisted history)
  const history = getSessions();
  const todayTotalBeforeSession = getTodayTotalSeconds(history);

  // Save the session record
  saveSession(session);

  const progress = getProgress();

  // XP + level
  progress.totalXp += session.xpEarned;
  progress.level = calculateLevel(progress.totalXp);
  progress.totalPracticeSeconds += session.completedSeconds;
  progress.totalSessions += 1;

  // Streak — needs 300s total today
  const dateStr = getLocalDateString();
  const yesterdayStr = getYesterdayDateString();
  const totalSecondsToday = todayTotalBeforeSession + session.completedSeconds;
  const MINIMUM_SECONDS = 300; // 5 minutes

  if (totalSecondsToday >= MINIMUM_SECONDS) {
    if (progress.lastTrainingDate === dateStr) {
      // Already counted this calendar day — no change to streak
    } else if (progress.lastTrainingDate === yesterdayStr) {
      // Consecutive day
      progress.currentStreak += 1;
      progress.lastTrainingDate = dateStr;
    } else {
      // Missed a day or very first session
      progress.currentStreak = 1;
      progress.lastTrainingDate = dateStr;
    }
  } else {
    // Below threshold today — check if streak should be broken
    // Only break streak if we had a previous qualifying day and missed more than one day
    if (progress.lastTrainingDate && progress.lastTrainingDate < yesterdayStr) {
      progress.currentStreak = 0;
    }
    // Note: We intentionally do NOT reset streak to 0 here for same-day sub-threshold sessions
    // The streak only changes on qualifying days (>= 300s)
  }

  if (progress.currentStreak > progress.longestStreak) {
    progress.longestStreak = progress.currentStreak;
  }

  saveProgress(progress);
  return progress;
}
