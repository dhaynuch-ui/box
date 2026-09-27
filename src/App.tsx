import { useState, useEffect, useCallback } from 'react';
import './index.css';
import { getProgress, getSettings, saveSettings, getSessions } from './tools/storage';
import { finalizeSession, getTodayTotalSeconds } from './tools/progress';
import { SessionEngine, SessionEngineState } from './tools/session';
import { ProgressStats, UserSettings, TrainingSession } from './types';
import { PUNCH_NAMES } from './tools/combinations';
import { v4 as uuidv4 } from 'uuid';

type Screen = 'HOME' | 'SETUP' | 'TRAINING' | 'SUMMARY';

function App() {
  const [screen, setScreen] = useState<Screen>('HOME');
  const [stats, setStats] = useState<ProgressStats>(getProgress());
  const [settings, setSettings] = useState<UserSettings>(getSettings());
  const [roundsChoice, setRoundsChoice] = useState(3);

  const [engine, setEngine] = useState<SessionEngine | null>(null);
  const [sessionState, setSessionState] = useState<SessionEngineState | null>(null);
  const [sessionRecord, setSessionRecord] = useState<TrainingSession | null>(null);

  // Visibility change handler — let the engine reconcile elapsed time
  useEffect(() => {
    const handleVisChange = () => {
      if (engine) engine.handleVisibilityChange();
    };
    document.addEventListener('visibilitychange', handleVisChange);
    return () => document.removeEventListener('visibilitychange', handleVisChange);
  }, [engine]);

  const handleSessionEnd = useCallback(
    (state: SessionEngineState, isComplete: boolean) => {
      const session: TrainingSession = {
        id: uuidv4(),
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        durationSeconds: state.totalDurationSeconds,
        completedSeconds: Math.round(state.completedSeconds),
        roundsPlanned: state.totalRounds,
        roundsCompleted: isComplete ? state.totalRounds : Math.max(0, state.currentRound - 1),
        difficulty: settings.difficulty,
        combinationIds: [],
        xpEarned: Math.floor((state.completedSeconds / 60) * 10),
      };

      // Only save and credit if a completed session (cancelled sessions don't count)
      if (isComplete) {
        const newStats = finalizeSession(session);
        setStats(newStats);
      } else {
        // Refresh stats in case a prior session on the same day crossed the threshold
        setStats(getProgress());
      }

      setSessionRecord(session);
      setScreen('SUMMARY');
      setEngine(null);
    },
    [settings.difficulty]
  );

  const startTraining = () => {
    saveSettings(settings);
    const eng = new SessionEngine(settings, roundsChoice, (state) => {
      setSessionState({ ...state });
      if (state.status === 'COMPLETED') {
        handleSessionEnd(state, true);
      } else if (state.status === 'CANCELLED') {
        handleSessionEnd(state, false);
      }
    });
    setEngine(eng);
    setSessionState(null);
    setScreen('TRAINING');
    eng.start();
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // ── HOME ────────────────────────────────────────────────────────────────────
  const renderHome = () => {
    const todaySeconds = getTodayTotalSeconds(getSessions());
    const todayMins = Math.floor(todaySeconds / 60);
    const goalMins = 5;
    const todayProgress = Math.min(1, todaySeconds / 300);

    return (
      <div className="screen">
        <div className="home-header">
          <h1 className="text-accent">BLAST</h1>
          <p className="text-muted">SHADOW BOXING</p>
        </div>

        {/* Streak */}
        <div className="panel streak-panel">
          <div className="streak-fire">{stats.currentStreak} 🔥</div>
          <div className="text-muted" style={{ fontSize: '0.85rem', marginTop: '0.3rem' }}>
            {stats.currentStreak === 1 ? 'day streak' : 'day streak'}
          </div>
          <div style={{ marginTop: '1rem', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>TODAY</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{todayMins}/{goalMins} min</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${todayProgress * 100}%` }} />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-box">
            <span className="stat-val">{stats.level}</span>
            <span className="stat-lbl">LEVEL</span>
          </div>
          <div className="stat-box">
            <span className="stat-val">{stats.totalSessions}</span>
            <span className="stat-lbl">SESSIONS</span>
          </div>
          <div className="stat-box">
            <span className="stat-val">{Math.floor(stats.totalPracticeSeconds / 60)}</span>
            <span className="stat-lbl">MINUTES</span>
          </div>
          <div className="stat-box">
            <span className="stat-val">{stats.totalXp}</span>
            <span className="stat-lbl">XP</span>
          </div>
        </div>

        <button id="btn-start-session" className="primary large" onClick={() => setScreen('SETUP')}>
          START SESSION
        </button>
      </div>
    );
  };

  // ── SETUP ───────────────────────────────────────────────────────────────────
  const renderSetup = () => (
    <div className="screen">
      <h2 style={{ marginBottom: '1.5rem' }}>SESSION SETUP</h2>

      <div className="panel">
        <label className="stat-lbl">DIFFICULTY</label>
        <select
          id="select-difficulty"
          value={settings.difficulty}
          onChange={(e) => {
            const value = e.target.value;
            if (['beginner', 'intermediate', 'advanced'].includes(value)) {
              setSettings({ ...settings, difficulty: value as UserSettings['difficulty'] });
            }
          }}
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>

        <label className="stat-lbl">ROUNDS</label>
        <select
          id="select-rounds"
          value={roundsChoice}
          onChange={(e) => {
            const value = Number(e.target.value);
            if (!isNaN(value) && value >= 1 && value <= 6) {
              setRoundsChoice(value);
            }
          }}
        >
          {[1, 2, 3, 4, 5, 6].map(n => (
            <option key={n} value={n}>{n} round{n !== 1 ? 's' : ''}</option>
          ))}
        </select>

        <label className="stat-lbl">ROUND LENGTH</label>
        <select
          id="select-round-length"
          value={settings.preferredRoundDurationSeconds}
          onChange={(e) => {
            const value = Number(e.target.value);
            if (!isNaN(value) && value > 0) {
              setSettings({ ...settings, preferredRoundDurationSeconds: value });
            }
          }}
        >
          <option value={60}>1 min</option>
          <option value={90}>1.5 min</option>
          <option value={120}>2 min</option>
          <option value={180}>3 min</option>
        </select>

        <label className="stat-lbl">REST BETWEEN ROUNDS</label>
        <select
          id="select-rest-length"
          value={settings.preferredRestDurationSeconds}
          onChange={(e) => {
            const value = Number(e.target.value);
            if (!isNaN(value) && value >= 0) {
              setSettings({ ...settings, preferredRestDurationSeconds: value });
            }
          }}
        >
          <option value={30}>30 sec</option>
          <option value={60}>1 min</option>
          <option value={90}>1.5 min</option>
        </select>

        <label className="stat-lbl">TEMPO</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            id="tempo-slider"
            type="range"
            min="0.5"
            max="2.0"
            step="0.1"
            value={settings.tempo}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              if (!isNaN(value) && value >= 0.5 && value <= 2.0) {
                setSettings({ ...settings, tempo: value });
              }
            }}
          />
          <span style={{ fontSize: '0.9rem', minWidth: '3rem', textAlign: 'center' }}>
            {settings.tempo.toFixed(1)}x
          </span>
        </div>
        <div className="audio-toggle-row">
          <span>Voice cues</span>
          <label className="toggle-switch">
            <input
              id="toggle-audio"
              type="checkbox"
              checked={settings.audioEnabled}
              onChange={(e) => setSettings({ ...settings, audioEnabled: e.target.checked })}
            />
            <span className="toggle-slider" />
          </label>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto' }}>
        <button id="btn-back" onClick={() => setScreen('HOME')} style={{ flex: 1 }}>BACK</button>
        <button id="btn-begin" className="primary" onClick={startTraining} style={{ flex: 2 }}>BEGIN</button>
      </div>
    </div>
  );

  // ── TRAINING ────────────────────────────────────────────────────────────────
  const renderTraining = () => {
    if (!sessionState) {
      return (
        <div className="screen" style={{ alignItems: 'center', justifyContent: 'center' }}>
          <p className="text-muted">Starting...</p>
        </div>
      );
    }

    const { status, currentRound, totalRounds, timeRemaining, currentCombination } = sessionState;

    const phaseLabel =
      status === 'COUNTDOWN'
        ? 'GET READY'
        : status === 'ROUND_ACTIVE'
        ? `ROUND ${currentRound} / ${totalRounds}`
        : status === 'REST'
        ? 'REST'
        : status === 'PAUSED'
        ? 'PAUSED'
        : status;

    return (
      <div className="screen training-screen">
        {/* Phase label */}
        <div className="phase-label">{phaseLabel}</div>

        {/* Big timer */}
        <div className="timer-display">{formatTime(timeRemaining)}</div>

        {/* Combination — the primary visual cue */}
        <div className="combo-area">
          {(status === 'ROUND_ACTIVE' || status === 'PAUSED') && currentCombination ? (
            <>
              {/* Punch circles with numbers */}
              <div className="combo-circles">
                {currentCombination.sequence.map((p, i) => (
                  <div key={i} className="punch-circle">
                    <span className="punch-num">
                      {p <= 6 ? p : p - 6}
                      {p > 6 ? 'b' : ''}
                    </span>
                  </div>
                ))}
              </div>
              {/* Punch name labels (below numbers)*/}
              <div className="combo-labels">
                {currentCombination.sequence.map((p, i) => (
                  <span key={i} className="punch-label">{PUNCH_NAMES[p <= 6 ? p : p - 6]}</span>
                ))}
              </div>
            </>
          ) : status === 'REST' ? (
            <div className="rest-message">Breathe. Recover.</div>
          ) : status === 'COUNTDOWN' ? (
            <div className="rest-message">Prepare your stance.</div>
          ) : status === 'PAUSED' ? (
            <div className="rest-message">Session paused.</div>
          ) : null}
        </div>

        {/* Controls */}
        <div className="training-controls">
          <button
            id="btn-pause"
            className="ctrl-btn"
            onClick={() => engine?.togglePause()}
          >
            {status === 'PAUSED' ? '▶ RESUME' : '⏸ PAUSE'}
          </button>
          <button
            id="btn-end"
            className="ctrl-btn danger-btn"
            onClick={() => engine?.cancel()}
          >
            END
          </button>
        </div>
      </div>
    );
  };

  // ── SUMMARY ─────────────────────────────────────────────────────────────────
  const renderSummary = () => {
    if (!sessionRecord) return null;
    const isComplete = sessionRecord.roundsCompleted === sessionRecord.roundsPlanned;
    const kcal = Math.round((sessionRecord.completedSeconds / 60) * 10);

    return (
      <div className="screen">
        <div className="summary-header">
          <div className="summary-icon">{isComplete ? '🏆' : '⏹'}</div>
          <h2 style={{ color: isComplete ? 'var(--success)' : 'var(--text-muted)' }}>
            {isComplete ? 'SESSION COMPLETE' : 'SESSION ENDED'}
          </h2>
        </div>

        <div className="panel" style={{ textAlign: 'center' }}>
          <div className="stat-lbl text-muted">TRAINING TIME</div>
          <div style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1.5rem' }}>
            {formatTime(sessionRecord.completedSeconds)}
          </div>

          <div className="stats-grid">
            <div className="stat-box">
              <span className="stat-val text-accent">+{sessionRecord.xpEarned}</span>
              <span className="stat-lbl">XP EARNED</span>
            </div>
            <div className="stat-box">
              <span className="stat-val">{sessionRecord.roundsCompleted}/{sessionRecord.roundsPlanned}</span>
              <span className="stat-lbl">ROUNDS</span>
            </div>
            <div className="stat-box">
              <span className="stat-val">{stats.currentStreak} 🔥</span>
              <span className="stat-lbl">STREAK</span>
            </div>
            <div className="stat-box">
              <span className="stat-val">{stats.level}</span>
              <span className="stat-lbl">LEVEL</span>
            </div>
          </div>

          <p className="text-muted" style={{ marginTop: '1.5rem', fontSize: '0.85rem' }}>
            Est. energy: ~{kcal} kcal (rough estimate only)
          </p>
        </div>

        <button id="btn-home" className="primary large" onClick={() => setScreen('HOME')}>
          RETURN HOME
        </button>
      </div>
    );
  };

  return (
    <>
      {screen === 'HOME' && renderHome()}
      {screen === 'SETUP' && renderSetup()}
      {screen === 'TRAINING' && renderTraining()}
      {screen === 'SUMMARY' && renderSummary()}
    </>
  );
}

export default App;
