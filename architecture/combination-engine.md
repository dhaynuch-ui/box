# Combination Engine SOP

## Responsibilities
Provides deterministic selection of punch combinations based on difficulty and prevents excessive immediate repetition.

## Static Database (Types)
```typescript
interface Punch {
  number: 1 | 2 | 3 | 4 | 5 | 6;
  name: "Jab" | "Cross" | "Lead Hook" | "Rear Hook" | "Lead Uppercut" | "Rear Uppercut";
}

interface Combination {
  id: string;
  name: string;
  sequence: number[]; // e.g., [1, 2, 3]
  difficulty: "beginner" | "intermediate" | "advanced";
  category: "basic" | "power" | "speed" | "body";
}
```

## Logic Rules
1. **Filtering:** `getCombinationsByDifficulty(diff)`
2. **Deterministic Selection:** `selectNextCombination(activeComboHistory, difficulty)`
   - Takes the last 3-5 combinations selected in the session.
   - Filters the candidate pool to exclude recent combos if the pool is large enough.
   - Randomly picks from the valid remainder pool. (Note: Randomization uses `Math.random` but guarantees valid output from the predefined set.)
3. **Invalidity Check:** Never return an empty array or undefined. Always have a default fallback sequence (e.g., `1-2`).
