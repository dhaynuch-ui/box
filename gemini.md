# Gemini Constitution - Shadow Boxing App

## 1. Application Purpose
Make it extremely easy and engaging for a person to practice shadow boxing consistently by giving them a guided session and making their progress visible.

## 2. MVP Scope
- Home Dashboard (streak, total sessions, quick start)
- Guided Shadow Boxing Session (preparation, rounds, rest, textual/audio cues)
- Punch Combination Library (hardcoded levels: beginner, intermediate, advanced)
- Deterministic Combination Engine
- Progressive history and streak engine (daily tracker, milestones)
- Gamification (XP, Levels, Badges)
- Energy Estimation (Approximate KCAL)
- Reference Guide for Punches

## 3. Punch-Numbering Convention
- **1** = Jab
- **2** = Cross
- **3** = Lead Hook
- **4** = Rear Hook
- **5** = Lead Uppercut
- **6** = Rear Uppercut

## 4. Combination Rules
- Beginners favor shorter (2-3) basic punches.
- Intermediate introduces complexity and length (4-5).
- Advanced uses complex variations (5-6).
- The randomizer must use the local internal database, minimizing immediate repetition.

## 5. Session Rules
- A session consists of a Warmup/Countdown, N Rounds of T length, and N-1 Rests of R length.
- Visual guidance is REQUIRED and the core of the app. The user should be able to see punches and ignore them if they wish (it's a practice guide, not a rigid checker).
- Voice guidance / Audio is an OPTIONAL enhancement. The session must remain fully usable with audio disabled. Do not spend significant effort on fallback audio beeps.

## 6. Streak Rules
- A minimum of **5 minutes of completed training time per calendar day** is required to qualify as a training day.
- Multiple sessions on the same day accumulate toward the 5-minute threshold.
- Cancelled sessions do not count unfinished time.

## 7. Gamification Rules
- **XP** = 10 XP per completed training minute.
- **Level** = `floor(sqrt(totalXP / 100)) + 1`

## 8. Estimated-Energy Rules
- Rough estimate, no specific biometric data required.
- E.g., ~10 kcal per active shadow boxing minute.

## 9. Architecture Decisions
- A.N.T. 3-layer architecture.
- Local-first architecture (localStorage / IndexedDB for initial data).
- Next.js / React (likely choice for PWA) or similar frontend tech.
- Mobile-first visual design: large numbers, strong contrast.

## 10. Technical Decisions & Known Limitations
- Audio is completely optional. Focus entirely on visual cues; no complex audio fail-safes are needed for the MVP.
- **Timer**: Delta-time based (`Date.now()`), avoiding `seconds += 1`. Uses explicit `visibilitychange` handling to reconcile timestamps if page is backgrounded.
- **Wake Lock**: Use progressive enhancement `navigator.wakeLock.request("screen")`. Does not block if unavailable.
