const STORAGE_KEYS = {
  bestScore: 'desafio-compostagem-best-score',
  achievements: 'desafio-compostagem-achievements',
};

export function readBestScore() {
  const saved = Number(window.localStorage.getItem(STORAGE_KEYS.bestScore) ?? 0);
  return Number.isFinite(saved) ? saved : 0;
}

export function saveBestScore(value) {
  window.localStorage.setItem(STORAGE_KEYS.bestScore, String(value));
}

export function readAchievements() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEYS.achievements);
    if (!saved) return {};
    const parsed = JSON.parse(saved);
    return { ...DEFAULT_ACHIEVEMENTS, ...parsed };
  } catch {
    return { ...DEFAULT_ACHIEVEMENTS };
  }
}

export function saveAchievements(data) {
  window.localStorage.setItem(STORAGE_KEYS.achievements, JSON.stringify(data));
}

export const DEFAULT_ACHIEVEMENTS = {
  'first-hit': false,
  'ten-hits': false,
  'combo-5': false,
  'combo-10': false,
  'score-100': false,
  'score-200': false,
  'master': false,
};
