import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { calculateLevel, getTodayTotalSeconds, finalizeSession } from './progress';
import { TrainingSession } from '../types';

// ── helpers ──────────────────────────────────────────────────────────────────
const todayPrefix = new Date().toISOString().slice(0, 10);

const makeSession = (completedSeconds: number, datePrefix = todayPrefix): TrainingSession => ({
  id: Math.random().toString(36).slice(2),
  startedAt: `${datePrefix}T07:00:00.000Z`,
  completedAt: `${datePrefix}T07:10:00.000Z`,
  durationSeconds: completedSeconds,
  completedSeconds,
  roundsPlanned: 3,
  roundsCompleted: 3,
  difficulty: 'beginner',
  combinationIds: [],
  xpEarned: Math.floor((completedSeconds / 60) * 10),
});

// ── calculateLevel ───────────────────────────────────────────────────────────
describe('calculateLevel', () => {
  it('level 1 for 0-99 XP',    () => { expect(calculateLevel(0)).toBe(1);   expect(calculateLevel(99)).toBe(1);   });
  it('level 2 for 100-399 XP', () => { expect(calculateLevel(100)).toBe(2); expect(calculateLevel(399)).toBe(2); });
  it('level 3 for 400-899 XP', () => { expect(calculateLevel(400)).toBe(3); expect(calculateLevel(899)).toBe(3); });
  it('level 5 for 1600 XP',    () => { expect(calculateLevel(1600)).toBe(5); });
});

// ── getTodayTotalSeconds ─────────────────────────────────────────────────────
describe('getTodayTotalSeconds', () => {
  it('sums only today\'s sessions', () => {
    const sessions = [
      makeSession(120, todayPrefix),
      makeSession(90,  todayPrefix),
      makeSession(300, '2020-01-01'),
    ];
    expect(getTodayTotalSeconds(sessions)).toBe(210);
  });
});

// ── finalizeSession — streak & XP ───────────────────────────────────────────
// Use vi.stubGlobal to inject a fresh localStorage per test.
describe('finalizeSession', () => {
  beforeEach(() => {
    const mem: Record<string, string> = {};
    vi.stubGlobal('localStorage', {
      getItem:    (k: string) => mem[k] ?? null,
      setItem:    (k: string, v: string) => { mem[k] = v; },
      removeItem: (k: string) => { delete mem[k]; },
      clear:      () => { Object.keys(mem).forEach(k => delete mem[k]); },
      length: 0, key: () => null,
    } as Storage);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('first session ≥300s → streak 1', () => {
    const s = finalizeSession(makeSession(300));
    expect(s.currentStreak).toBe(1);
    expect(s.totalXp).toBe(50);
    expect(s.totalSessions).toBe(1);
  });

  it('first session <300s → streak 0', () => {
    const s = finalizeSession(makeSession(200));
    expect(s.currentStreak).toBe(0);
  });

  it('two sessions summing to exactly 300s qualify the day', () => {
    finalizeSession(makeSession(150));
    const s2 = finalizeSession(makeSession(150));
    expect(s2.currentStreak).toBe(1);
  });

  it('XP accumulates correctly across two sessions', () => {
    finalizeSession(makeSession(60)); // 10 XP
    const s = finalizeSession(makeSession(60)); // +10 XP → total 20
    expect(s.totalXp).toBe(20);
    expect(s.totalSessions).toBe(2);
  });

  it('0s session does not change qualifying streak', () => {
    finalizeSession(makeSession(300)); // qualify
    const s = finalizeSession(makeSession(0));
    expect(s.currentStreak).toBe(1);
  });
});
