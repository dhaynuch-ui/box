# Progress & Streak System SOP

## 1. Streak Rules
A day counts toward the streak if **5 minutes of completed training time** is reached on a single calendar day.
- Formula checks daily accumulation. Multiple small sessions sum together.
- Cancelled sessions only count completed time (e.g. paused midway or aborted, if the logic allows preserving partials, but MVP specifies "A session that is started but cancelled should not count its unfinished time toward the streak"). To be safe, we only add `completedSeconds` to the daily bucket.

### Calendar Day Detection
Compare `YYYY-MM-DD` string derived from user's local timezone.
- Same day: add time.
- Next day: increment streak if threshold hit the day prior.
- Missed day: reset streak to 0 (or 1 depending on UI logic) if previous day didn't hit threshold or more than 1 day passed. Wait, if more than 1 day passed since last qualified training day, streak resets.

## 2. Gamification Rules
- **XP Formula:** `completedSeconds / 60 * 10`
- **Level Formula:** `floor(sqrt(totalXP / 100)) + 1`

### Calculation Flow
`calculateSessionProgress(completedSeconds: number)`
1. Earn XP = `(completedSeconds / 60) * 10`
2. Update Total XP.
3. Calculate New Level.
4. Update Total Practice Seconds.
5. Check if daily threshold (300 seconds) is met.
6. Calculate streak persistence.
