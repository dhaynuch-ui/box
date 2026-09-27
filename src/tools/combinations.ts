import { Combination, Difficulty } from "../types";

export const PUNCH_NAMES: Record<number, string> = {
  1: "Jab",
  2: "Cross",
  3: "Lead Hook",
  4: "Rear Hook",
  5: "Lead Uppercut",
  6: "Rear Uppercut",
  7: "Jab (Body)",
  8: "Cross (Body)",
  9: "Lead Hook (Body)",
  10: "Rear Hook (Body)",
  11: "Lead Uppercut (Body)",
  12: "Rear Uppercut (Body)"
};

export const COMBINATION_DB: Combination[] = [
  // Beginner
  { id: "b1", name: "One-Two", sequence: [1, 8], difficulty: "beginner", category: "basic" }, // Jab, Cross Body
  { id: "b2", name: "Double Jab Cross", sequence: [1, 1, 2], difficulty: "beginner", category: "basic" },
  { id: "b3", name: "One-Two-Hook", sequence: [1, 2, 9], difficulty: "beginner", category: "power" }, // Jab, Cross, Lead Hook Body
  { id: "b4", name: "Jab Hook", sequence: [1, 9], difficulty: "beginner", category: "basic" }, // Jab, Lead Hook Body
  { id: "b5", name: "Cross Hook Cross", sequence: [2, 3, 2], difficulty: "beginner", category: "power" },
  { id: "b6", name: "One-Two-One-Two", sequence: [1, 2, 1, 2], difficulty: "beginner", category: "speed" },
  // Beginner - Additional
  { id: "b7", name: "Jab-Jab", sequence: [1, 1], difficulty: "beginner", category: "speed" },
  { id: "b8", name: "Cross-Cross", sequence: [2, 2], difficulty: "beginner", category: "power" },
  { id: "b9", name: "Lead Hook-Lead Hook", sequence: [3, 3], difficulty: "beginner", category: "power" },
  { id: "b10", name: "Jab-Lead Hook", sequence: [1, 3], difficulty: "beginner", category: "basic" },
  { id: "b11", name: "Jab-Lead Hook Body", sequence: [1, 9], difficulty: "beginner", category: "body" },
  { id: "b12", name: "Cross-Lead Hook Body", sequence: [2, 9], difficulty: "beginner", category: "body" },
  { id: "b13", name: "Jab-Cross-Lead Hook", sequence: [1, 2, 3], difficulty: "beginner", category: "basic" },
  { id: "b14", name: "Lead Hook-Cross", sequence: [3, 2], difficulty: "beginner", category: "power" },
  { id: "b15", name: "Jab-Cross-Body-Lead Hook", sequence: [1, 2, 8, 3], difficulty: "beginner", category: "basic" },
  { id: "b16", name: "Double Jab-Lead Hook", sequence: [1, 1, 3], difficulty: "beginner", category: "basic" },
  // Beginner - More
  { id: "b17", name: "Jab-Rear Hook", sequence: [1, 4], difficulty: "beginner", category: "basic" },
  { id: "b18", name: "Jab-Lead Uppercut", sequence: [1, 5], difficulty: "beginner", category: "basic" },
  { id: "b19", name: "Jab-Rear Uppercut", sequence: [1, 6], difficulty: "beginner", category: "basic" },
  { id: "b20", name: "Cross-Jab", sequence: [2, 1], difficulty: "beginner", category: "power" },
  { id: "b21", name: "Cross-Rear Hook", sequence: [2, 4], difficulty: "beginner", category: "power" },
  { id: "b22", name: "Cross-Lead Uppercut", sequence: [2, 5], difficulty: "beginner", category: "power" },
  { id: "b23", name: "Cross-Rear Uppercut", sequence: [2, 6], difficulty: "beginner", category: "power" },
  { id: "b24", name: "Lead Hook-Jab", sequence: [3, 1], difficulty: "beginner", category: "power" },
  { id: "b25", name: "Lead Hook-Rear Hook", sequence: [3, 4], difficulty: "beginner", category: "power" },
  { id: "b26", name: "Lead Hook-Lead Uppercut", sequence: [3, 5], difficulty: "beginner", category: "power" },
  { id: "b27", name: "Lead Hook-Rear Uppercut", sequence: [3, 6], difficulty: "beginner", category: "power" },
  { id: "b28", name: "Rear Hook-Jab", sequence: [4, 1], difficulty: "beginner", category: "power" },
  { id: "b29", name: "Rear Hook-Cross", sequence: [4, 2], difficulty: "beginner", category: "power" },
  { id: "b30", name: "Rear Hook-Lead Uppercut", sequence: [4, 5], difficulty: "beginner", category: "power" },

  // Intermediate
  { id: "i1", name: "One-Two-Hook-Cross", sequence: [1, 2, 9, 2], difficulty: "intermediate", category: "power" }, // Jab, Cross, Lead Hook Body, Cross
  { id: "i2", name: "One-Two-Hook-Rear Hook", sequence: [1, 2, 3, 4], difficulty: "intermediate", category: "power" },
  { id: "i3", name: "One-Two-Lead Upper-Cross", sequence: [1, 2, 5, 2], difficulty: "intermediate", category: "power" },
  { id: "i4", name: "Double Jab-Cross-Hook", sequence: [1, 1, 2, 3], difficulty: "intermediate", category: "basic" },
  { id: "i5", name: "Lead Upper-Cross-Hook", sequence: [5, 2, 3], difficulty: "intermediate", category: "power" },
  // Intermediate - Additional
  { id: "i6", name: "Jab-Cross-Lead Hook-Cross", sequence: [1, 2, 3, 2], difficulty: "intermediate", category: "basic" },
  { id: "i7", name: "Jab-Lead Hook-Cross-Lead Hook", sequence: [1, 3, 2, 3], difficulty: "intermediate", category: "power" },
  { id: "i8", name: "Cross-Lead Hook-Cross-Lead Hook", sequence: [2, 3, 2, 3], difficulty: "intermediate", category: "power" },
  { id: "i9", name: "Jab-Cross-Lead Uppercut", sequence: [1, 2, 5], difficulty: "intermediate", category: "power" },
  { id: "i10", name: "Jab-Cross-Lead Uppercut Body", sequence: [1, 2, 11], difficulty: "intermediate", category: "body" },
  { id: "i11", name: "Lead Hook-Cross-Lead Hook", sequence: [3, 2, 3], difficulty: "intermediate", category: "power" },
  { id: "i12", name: "Rear Hook-Cross-Rear Hook", sequence: [4, 2, 4], difficulty: "intermediate", category: "power" },
  { id: "i13", name: "Jab-Cross-Body-Lead Hook", sequence: [1, 2, 8, 3], difficulty: "intermediate", category: "basic" },
  { id: "i14", name: "Jab-Lead Hook Body-Cross", sequence: [1, 9, 2], difficulty: "intermediate", category: "body" },
  { id: "i15", name: "Cross-Lead Hook Body-Lead Hook", sequence: [2, 9, 3], difficulty: "intermediate", category: "body" },
  // Intermediate - More
  { id: "i16", name: "Jab-Jab Body-Cross", sequence: [1, 7, 2], difficulty: "intermediate", category: "body" },
  { id: "i17", name: "Jab-Cross Body-Cross", sequence: [1, 8, 2], difficulty: "intermediate", category: "basic" },
  { id: "i18", name: "Jab-Rear Hook Body-Cross", sequence: [1, 10, 2], difficulty: "intermediate", category: "body" },
  { id: "i19", name: "Jab-Lead Uppercut Body-Cross", sequence: [1, 11, 2], difficulty: "intermediate", category: "body" },
  { id: "i20", name: "Jab-Rear Uppercut Body-Cross", sequence: [1, 12, 2], difficulty: "intermediate", category: "body" },
  { id: "i21", name: "Cross-Jab Body-Jab", sequence: [2, 7, 1], difficulty: "intermediate", category: "body" },
  { id: "i22", name: "Cross-Cross Body-Jab", sequence: [2, 8, 1], difficulty: "intermediate", category: "basic" },
  { id: "i23", name: "Cross-Lead Hook Body-Jab", sequence: [2, 9, 1], difficulty: "intermediate", category: "body" },
  { id: "i24", name: "Cross-Rear Hook Body-Jab", sequence: [2, 10, 1], difficulty: "intermediate", category: "body" },
  { id: "i25", name: "Cross-Lead Uppercut Body-Jab", sequence: [2, 11, 1], difficulty: "intermediate", category: "body" },
  { id: "i26", name: "Cross-Rear Uppercut Body-Jab", sequence: [2, 12, 1], difficulty: "intermediate", category: "body" },
  { id: "i27", name: "Lead Hook-Jab Body-Rear Hook", sequence: [3, 7, 4], difficulty: "intermediate", category: "body" },
  { id: "i28", name: "Lead Hook-Cross Body-Rear Hook", sequence: [3, 8, 4], difficulty: "intermediate", category: "power" },
  { id: "i29", name: "Lead Hook-Lead Hook Body-Rear Hook", sequence: [3, 9, 4], difficulty: "intermediate", category: "power" },
  { id: "i30", name: "Lead Hook-Rear Hook Body-Rear Hook", sequence: [3, 10, 4], difficulty: "intermediate", category: "power" },

  // Advanced
  { id: "a1", name: "One-Two-Hook-Cross-Lead Upper-Cross", sequence: [1, 2, 3, 2, 5, 2], difficulty: "advanced", category: "power" },
  { id: "a2", name: "Double Jab-Cross-Hook-Cross", sequence: [1, 1, 8, 3, 2], difficulty: "advanced", category: "power" }, // Jab, Jab, Cross Body, Hook, Cross
  { id: "a3", name: "One-Two-Hook-Rear Hook-Cross-Hook", sequence: [1, 2, 3, 10, 2, 3], difficulty: "advanced", category: "power" }, // Jab, Cross, Hook, Rear Hook Body, Cross, Hook
  // Advanced - Additional
  { id: "a4", name: "Jab-Cross-Lead Hook-Rear Hook-Cross", sequence: [1, 2, 3, 4, 2], difficulty: "advanced", category: "power" },
  { id: "a5", name: "Jab-Cross-Lead Hook-Lead Uppercut-Cross", sequence: [1, 2, 3, 5, 2], difficulty: "advanced", category: "power" },
  { id: "a6", name: "Jab-Cross-Lead Hook Body-Rear Hook Body-Cross", sequence: [1, 2, 9, 10, 2], difficulty: "advanced", category: "body" },
  { id: "a7", name: "Jab-Lead Hook-Cross-Lead Uppercut-Lead Hook", sequence: [1, 3, 2, 5, 3], difficulty: "advanced", category: "power" },
  { id: "a8", name: "Cross-Lead Hook-Cross-Rear Uppercut-Cross", sequence: [2, 3, 2, 6, 2], difficulty: "advanced", category: "power" },
  { id: "a9", name: "Jab-Cross-Lead Uppercut-Lead Hook-Cross", sequence: [1, 2, 5, 3, 2], difficulty: "advanced", category: "power" },
  { id: "a10", name: "Double Jab-Cross-Lead Hook-Cross-Lead Hook", sequence: [1, 1, 2, 3, 2, 3], difficulty: "advanced", category: "speed" },
  { id: "a11", name: "Jab-Cross-Lead Hook-Rear Uppercut-Lead Hook", sequence: [1, 2, 3, 6, 3], difficulty: "advanced", category: "power" },
  { id: "a12", name: "Lead Uppercut-Cross-Lead Hook-Cross-Lead Uppercut", sequence: [5, 2, 3, 2, 5], difficulty: "advanced", category: "power" },
  { id: "a13", name: "Jab-Lead Hook Body-Cross-Lead Hook Body-Cross", sequence: [1, 9, 2, 9, 2], difficulty: "advanced", category: "body" },
  { id: "a14", name: "Cross-Lead Hook Body-Lead Uppercut Body-Cross", sequence: [2, 9, 11, 2], difficulty: "advanced", category: "body" },
  { id: "a15", name: "Jab-Cross-Lead Hook-Cross-Lead Hook-Cross", sequence: [1, 2, 3, 2, 3, 2], difficulty: "advanced", category: "speed" },
  // Advanced - More
  { id: "a16", name: "Jab-Jab Body-Cross-Cross Body", sequence: [1, 7, 2, 8], difficulty: "advanced", category: "body" },
  { id: "a17", name: "Jab-Jab Body-Cross-Lead Hook Body", sequence: [1, 7, 2, 9], difficulty: "advanced", category: "body" },
  { id: "a18", name: "Jab-Jab Body-Cross-Rear Hook Body", sequence: [1, 7, 2, 10], difficulty: "advanced", category: "body" },
  { id: "a19", name: "Jab-Jab Body-Cross-Lead Uppercut Body", sequence: [1, 7, 2, 11], difficulty: "advanced", category: "body" },
  { id: "a20", name: "Jab-Jab Body-Cross-Rear Uppercut Body", sequence: [1, 7, 2, 12], difficulty: "advanced", category: "body" },
  { id: "a21", name: "Jab-Cross Body-Jab-Jab Body", sequence: [1, 8, 2, 7], difficulty: "advanced", category: "body" },
  { id: "a22", name: "Jab-Cross Body-Jab-Cross Body", sequence: [1, 8, 2, 8], difficulty: "advanced", category: "body" },
  { id: "a23", name: "Jab-Cross Body-Jab-Lead Hook Body", sequence: [1, 8, 2, 9], difficulty: "advanced", category: "body" },
  { id: "a24", name: "Jab-Cross Body-Jab-Rear Hook Body", sequence: [1, 8, 2, 10], difficulty: "advanced", category: "body" },
  { id: "a25", name: "Jab-Cross Body-Jab-Lead Uppercut Body", sequence: [1, 8, 2, 11], difficulty: "advanced", category: "body" },
  { id: "a26", name: "Jab-Cross Body-Jab-Rear Uppercut Body", sequence: [1, 8, 2, 12], difficulty: "advanced", category: "body" },
  { id: "a27", name: "Jab-Lead Hook Body-Cross-Jab Body", sequence: [1, 9, 2, 7], difficulty: "advanced", category: "body" },
  { id: "a28", name: "Jab-Lead Hook Body-Cross-Cross Body", sequence: [1, 9, 2, 8], difficulty: "advanced", category: "body" },
  { id: "a29", name: "Jab-Lead Hook Body-Cross-Lead Hook Body", sequence: [1, 9, 2, 9], difficulty: "advanced", category: "body" },
  { id: "a30", name: "Jab-Lead Hook Body-Cross-Rear Hook Body", sequence: [1, 9, 2, 10], difficulty: "advanced", category: "body" },
  { id: "a31", name: "Jab-Lead Hook Body-Cross-Lead Uppercut Body", sequence: [1, 9, 2, 11], difficulty: "advanced", category: "body" },
  { id: "a32", name: "Jab-Lead Hook Body-Cross-Rear Uppercut Body", sequence: [1, 9, 2, 12], difficulty: "advanced", category: "body" },
  { id: "a33", name: "Jab-Rear Hook Body-Cross-Jab Body", sequence: [1, 10, 2, 7], difficulty: "advanced", category: "body" },
  { id: "a34", name: "Jab-Rear Hook Body-Cross-Cross Body", sequence: [1, 10, 2, 8], difficulty: "advanced", category: "body" },
  { id: "a35", name: "Jab-Rear Hook Body-Cross-Lead Hook Body", sequence: [1, 10, 2, 9], difficulty: "advanced", category: "body" },
  { id: "a36", name: "Jab-Rear Hook Body-Cross-Rear Hook Body", sequence: [1, 10, 2, 10], difficulty: "advanced", category: "body" },
  { id: "a37", name: "Jab-Rear Hook Body-Cross-Lead Uppercut Body", sequence: [1, 10, 2, 11], difficulty: "advanced", category: "body" },
  { id: "a38", name: "Jab-Rear Hook Body-Cross-Rear Uppercut Body", sequence: [1, 10, 2, 12], difficulty: "advanced", category: "body" },
  { id: "a39", name: "Jab-Lead Uppercut Body-Cross-Jab Body", sequence: [1, 11, 2, 7], difficulty: "advanced", category: "body" },
  { id: "a40", name: "Jab-Lead Uppercut Body-Cross-Cross Body", sequence: [1, 11, 2, 8], difficulty: "advanced", category: "body" }
];

export function getCombinationsByDifficulty(difficulty: Difficulty): Combination[] {
  let diffs: Difficulty[] = [difficulty];
  if (difficulty === "intermediate") diffs = ["beginner", "intermediate"];
  if (difficulty === "advanced") diffs = ["beginner", "intermediate", "advanced"];
  return COMBINATION_DB.filter(c => diffs.includes(c.difficulty));
}

export function selectNextCombination(
  activeHistory: string[],
  difficulty: Difficulty
): Combination {
  const pool = getCombinationsByDifficulty(difficulty);
  if (pool.length === 0) return COMBINATION_DB[0]; // safety fallback

  // Avoid last 3 combinations
  const avoidIds = activeHistory.slice(-3);
  let validPool = pool.filter(c => !avoidIds.includes(c.id));

  // If pool too small due to filtering, ignore filtering
  if (validPool.length === 0) {
    validPool = pool;
  }

  const randomIndex = Math.floor(Math.random() * validPool.length);
  return validPool[randomIndex];
}