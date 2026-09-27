import { describe, it, expect } from 'vitest';
import { selectNextCombination, getCombinationsByDifficulty } from './combinations';

describe('Combination Engine', () => {
  it('filters correctly by difficulty', () => {
    const beginner = getCombinationsByDifficulty('beginner');
    expect(beginner.every(c => c.difficulty === 'beginner')).toBe(true);

    const intermediate = getCombinationsByDifficulty('intermediate');
    expect(intermediate.some(c => c.difficulty === 'beginner')).toBe(true);
    expect(intermediate.some(c => c.difficulty === 'intermediate')).toBe(true);
    expect(intermediate.every(c => c.difficulty !== 'advanced')).toBe(true);
  });

  it('selects valid combination from library', () => {
    const combo = selectNextCombination([], 'beginner');
    expect(combo).toBeDefined();
    expect(combo.sequence.length).toBeGreaterThan(0);
    expect(combo.difficulty).toBe('beginner');
  });

  it('avoids immediately repeating recent sequences', () => {
    // Avoid last 3 combinations
    const pool = getCombinationsByDifficulty('beginner');
    const first = pool[0];
    const second = pool[1];
    const third = pool[2];

    const avoidIds = [first.id, second.id, third.id];
    const combo = selectNextCombination(avoidIds, 'beginner');
    
    expect(avoidIds.includes(combo.id)).toBe(false);
  });
});
