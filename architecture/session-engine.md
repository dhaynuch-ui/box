# Session Timer Engine SOP

## Responsibilities
The session engine manages the progression of a training session deterministically based on timestamps, accounting for background/visibility changes.

## States
`IDLE` -> `COUNTDOWN` -> `ROUND_ACTIVE` <-> `REST`
Terminal states: `COMPLETED`, `PAUSED`, `CANCELLED`

## Core Mechanism (Delta-Time)
- Use `requestAnimationFrame` loop or `setInterval(~100)` for UI updates.
- Real tracking is done by checking `Date.now() - sessionStartTime`.
- `expectedEndTime`: Calculated at phase start. Time remaining = `expectedEndTime - Date.now()`.
- If `Time remaining <= 0`, evaluate transition (e.g., Round -> Rest, or Next Round).

## Visibility & Suspension Handling
- When `document.visibilityState === 'hidden'`: the browser throttles UI rendering. Audio might stop unless playing aggressively.
- The Engine should cache `lastTickTime`.
- When `visibilityState === 'visible'`: Force a `Date.now()` evaluation. The session will automatically fast-forward to the exact point in time according to elapsed real-world time.

### Pause Mechanics
- On PAUSE, track `pauseTime`.
- On RESUME, add `Date.now() - pauseTime` to `sessionStartTime` (and expected endpoints) to push the schedule back.
