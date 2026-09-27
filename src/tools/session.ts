import { Combination, UserSettings } from '../types';
import { selectNextCombination } from './combinations';
import { audioEngine } from './audio';

export type SessionState = 'IDLE' | 'COUNTDOWN' | 'ROUND_ACTIVE' | 'REST' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';

export interface SessionEngineState {
  status: SessionState;
  currentRound: number;
  totalRounds: number;
  timeRemaining: number;
  totalDurationSeconds: number;
  completedSeconds: number;
  currentCombination: Combination | null;
  nextCueTime: number; // ms remaining in phase when next cue should fire
}

export type EngineCallback = (state: SessionEngineState) => void;

const COUNTDOWN_SECS = 10;

export class SessionEngine {
  private state: SessionEngineState;
  private settings: UserSettings;
  private onUpdate: EngineCallback;

  private activeHistory: string[] = [];

  private phaseEndTime: number = 0;
  private pauseTime: number = 0;
  private loopId: number = 0;
  private prevStatus: SessionState = 'COUNTDOWN';

  private cueArmed: boolean = false; // true when the scheduled cue has not yet fired

  constructor(settings: UserSettings, totalRounds: number, onUpdate: EngineCallback) {
    this.settings = settings;
    this.onUpdate = onUpdate;
    this.state = {
      status: 'IDLE',
      currentRound: 1,
      totalRounds,
      timeRemaining: 0,
      totalDurationSeconds:
        totalRounds * (settings.preferredRoundDurationSeconds / settings.tempo) +
        (totalRounds - 1) * (settings.preferredRestDurationSeconds / settings.tempo),
      completedSeconds: 0,
      currentCombination: null,
      nextCueTime: 0,
    };
  }

  public start() {
    if (this.state.status !== 'IDLE') return;
    this.requestWakeLock();
    this.state.status = 'COUNTDOWN';
    this.phaseEndTime = Date.now() + COUNTDOWN_SECS * 1000;
    if (this.settings.audioEnabled) {
      audioEngine.init();
      audioEngine.playSpeech('Get ready.', this.settings.tempo);
    }
    this.loop();
  }

  public togglePause() {
    if (this.state.status === 'PAUSED') {
      // Resume
      const pausedDuration = Date.now() - this.pauseTime;
      this.phaseEndTime += pausedDuration;
      this.state.status = this.prevStatus;
      this.loop();
    } else if (
      this.state.status !== 'COMPLETED' &&
      this.state.status !== 'CANCELLED' &&
      this.state.status !== 'IDLE'
    ) {
      // Pause
      this.prevStatus = this.state.status;
      this.state.status = 'PAUSED';
      this.pauseTime = Date.now();
      cancelAnimationFrame(this.loopId);
      if (this.settings.audioEnabled) {
        audioEngine.stop();
      }
      this.onUpdate({ ...this.state });
    }
  }

  // Keep separate pause/resume for tests
  public pause() {
    if (this.state.status === 'PAUSED' || this.state.status === 'COMPLETED' || this.state.status === 'CANCELLED') return;
    this.prevStatus = this.state.status;
    this.state.status = 'PAUSED';
    this.pauseTime = Date.now();
    cancelAnimationFrame(this.loopId);
    this.onUpdate({ ...this.state });
  }

  public resume() {
    if (this.state.status !== 'PAUSED') return;
    const pausedDuration = Date.now() - this.pauseTime;
    this.phaseEndTime += pausedDuration;
    this.state.status = this.prevStatus;
    this.loop();
  }

  public cancel() {
    this.state.status = 'CANCELLED';
    cancelAnimationFrame(this.loopId);
    audioEngine.stop();
    this.onUpdate({ ...this.state });
  }

  public getState(): SessionEngineState {
    return this.state;
  }

  public handleVisibilityChange() {
    // When the page becomes visible again, re-request wake lock and let the
    // existing loop reconcile the elapsed time naturally on its next tick.
    if (document.visibilityState === 'visible' && this.state.status !== 'PAUSED') {
      this.requestWakeLock();
    }
  }

  // ---------- private loop ----------

  private loop = () => {
    const { status } = this.state;
    if (status === 'PAUSED' || status === 'COMPLETED' || status === 'CANCELLED') return;

    const now = Date.now();
    const remaining = Math.max(0, this.phaseEndTime - now);
    this.state.timeRemaining = Math.ceil(remaining / 1000);

    // Update completedSeconds in real-time (delta-time based on phaseEndTime)
    if (status === 'ROUND_ACTIVE') {
      const roundElapsed = (this.settings.preferredRoundDurationSeconds / this.settings.tempo) - remaining / 1000;
      this.state.completedSeconds =
        (this.state.currentRound - 1) * (this.settings.preferredRoundDurationSeconds / this.settings.tempo) +
        Math.max(0, roundElapsed);
    }

    if (remaining <= 0) {
      // Phase transition
      if (status === 'COUNTDOWN') {
        this.startRound();
      } else if (status === 'ROUND_ACTIVE') {
        if (this.state.currentRound >= this.state.totalRounds) {
          this.completeSession();
          return;
        } else {
          this.startRest();
        }
      } else if (status === 'REST') {
        this.state.currentRound++;
        this.startRound();
      }
    } else {
      // Fire cue when remaining crosses below the scheduled nextCueTime
      if (status === 'ROUND_ACTIVE' && this.cueArmed && remaining <= this.state.nextCueTime) {
        this.triggerCue();
      }
    }

    this.onUpdate({ ...this.state });
    this.loopId = requestAnimationFrame(this.loop);
  };

  // ---------- phase transitions ----------

  private startRound() {
    this.state.status = 'ROUND_ACTIVE';
    this.phaseEndTime = Date.now() + (this.settings.preferredRoundDurationSeconds / this.settings.tempo) * 1000;
    if (this.settings.audioEnabled) {
      audioEngine.playSpeech(`Round ${this.state.currentRound}`, this.settings.tempo);
    }
    this.scheduleNextCue(3000); // 3-second grace before first combination
  }

  private startRest() {
    this.state.status = 'REST';
    this.phaseEndTime = Date.now() + (this.settings.preferredRestDurationSeconds / this.settings.tempo) * 1000;
    this.state.currentCombination = null;
    this.cueArmed = false;
    if (this.settings.audioEnabled) {
      audioEngine.playSpeech('Rest.', this.settings.tempo);
    }
  }

  private completeSession() {
    this.state.status = 'COMPLETED';
    cancelAnimationFrame(this.loopId);
    this.state.currentCombination = null;
    // completedSeconds is already accurately tracked during the session loop
    if (this.settings.audioEnabled) {
      audioEngine.playSpeech('Session complete. Great work.', this.settings.tempo);
    }
    this.onUpdate({ ...this.state });
  }

  // ---------- combination cue scheduling ----------

  private scheduleNextCue(initialDelayMs?: number) {
    let delayMs = initialDelayMs;
    if (!delayMs) {
      const base =
        this.settings.difficulty === 'advanced'
          ? 2500
          : this.settings.difficulty === 'intermediate'
          ? 3000
          : 4000;
      delayMs = base + Math.random() * 2000;
    }
    const remaining = this.phaseEndTime - Date.now();
    // Schedule the cue to fire when `remaining` drops to this level
    this.state.nextCueTime = remaining - delayMs;
    this.cueArmed = true;
  }

  private triggerCue() {
    this.cueArmed = false; // disarm until rescheduled
    const combo = selectNextCombination(this.activeHistory, this.settings.difficulty);
    this.activeHistory.push(combo.id);
    if (this.activeHistory.length > 5) this.activeHistory.shift();
    this.state.currentCombination = combo;

    if (this.settings.audioEnabled) {
      const punchText = combo.sequence.map(p => {
        if (p <= 6) {
          return p.toString();
        } else {
          return (p - 6).toString() + ' b';
        }
      }).join(', ');
      audioEngine.playSpeech(punchText, this.settings.tempo);
    }

    this.scheduleNextCue(); // schedule the next one
  }

  // ---------- wake lock ----------

  private async requestWakeLock() {
    try {
      if ('wakeLock' in navigator) {
        // Acquire and discard sentinel — keeping it alive is enough for the screen to stay on
        await navigator.wakeLock.request('screen');
      }
    } catch {
      // Not available — fine, session continues without it
    }
  }
}
