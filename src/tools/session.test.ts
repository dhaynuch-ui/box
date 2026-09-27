import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { SessionEngine } from './session';
import { UserSettings } from '../types';

// Stub requestAnimationFrame to use setTimeout so fake timers can drive the engine loop
vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
  return setTimeout(() => cb(Date.now()), 16);
});
vi.stubGlobal('cancelAnimationFrame', (id: number) => clearTimeout(id));

describe('Session Engine', () => {
  let settings: UserSettings;

  beforeEach(() => {
    settings = {
      difficulty: 'beginner',
      preferredRoundDurationSeconds: 10, // short for test
      preferredRestDurationSeconds: 5,
      audioEnabled: false,
      tempo: 1.0,
    };
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('initializes to IDLE', () => {
    const engine = new SessionEngine(settings, 3, () => {});
    expect(engine.getState().status).toBe('IDLE');
  });

  it('transitions to COUNTDOWN on start', () => {
    const engine = new SessionEngine(settings, 3, () => {});
    engine.start();
    expect(engine.getState().status).toBe('COUNTDOWN');
  });

  it('transitions from COUNTDOWN to ROUND_ACTIVE after 10s', () => {
    const engine = new SessionEngine(settings, 3, () => {});
    engine.start();
    vi.advanceTimersByTime(10_500); // past 10s countdown
    expect(engine.getState().status).toBe('ROUND_ACTIVE');
  });

  it('transitions from ROUND_ACTIVE to REST after round duration', () => {
    const engine = new SessionEngine(settings, 3, () => {});
    engine.start();
    vi.advanceTimersByTime(10_500); // countdown
    vi.advanceTimersByTime(10_500); // round 1
    expect(engine.getState().status).toBe('REST');
  });

  it('transitions from REST to second ROUND_ACTIVE', () => {
    const engine = new SessionEngine(settings, 3, () => {});
    engine.start();
    vi.advanceTimersByTime(10_500); // countdown
    vi.advanceTimersByTime(10_500); // round 1
    vi.advanceTimersByTime(5_500);  // rest
    expect(engine.getState().status).toBe('ROUND_ACTIVE');
    expect(engine.getState().currentRound).toBe(2);
  });

  it('handles pause and resume', () => {
    const engine = new SessionEngine(settings, 3, () => {});
    engine.start();
    expect(engine.getState().status).toBe('COUNTDOWN');
    engine.pause();
    expect(engine.getState().status).toBe('PAUSED');
    engine.resume();
    expect(engine.getState().status).toBe('COUNTDOWN');
  });

  it('completes the session after final round', () => {
    const engine = new SessionEngine(settings, 1, () => {}); // 1 round only
    engine.start();
    vi.advanceTimersByTime(10_500); // countdown
    vi.advanceTimersByTime(10_500); // round 1 → COMPLETED (no rest after last round)
    expect(engine.getState().status).toBe('COMPLETED');
  });

  it('cancel transitions to CANCELLED', () => {
    const engine = new SessionEngine(settings, 3, () => {});
    engine.start();
    engine.cancel();
    expect(engine.getState().status).toBe('CANCELLED');
  });
});
