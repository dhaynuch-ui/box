# Audio Cue System SOP

## Responsibilities
Provide spoken and visual cues. Adhere strictly to browser limitations.

## Optional Enhancement
1. **Primary (`SpeechSynthesis`)**
   - Utterances: "Jab", "Cross", sequence numbers "One, Two", countdowns ("Three, Two, One").
2. **Fallback logic**
   - Beeps are optional and not strictly required for MVP. If `SpeechSynthesis` is unavailable or disabled, rely silently on the UI.

## Known Limitations & Requirements
- **User Interaction Requirement:** Audio contexts (including `SpeechSynthesis`) must be initialized during a user gesture (e.g., clicking "Start Session").
- **State:** The engine must pre-load or 'warm up' a silent utterance on start.
- **Fail-Safe:** If an utterance throws an error, log it. Visual changes are the source of truth, so the app continues functioning.

## Structure
```typescript
class AudioEngine {
  init(userGestureEvent: Event): void;
  playSpeech(text: string): void;
  playBeep(type: 'start' | 'stop' | 'cue'): void;
  stop(): void; // Cancel any ongoing speech
}
```
Audio will not strictly block the timer; the timer is the source of truth. Audio acts as a side-effect.
