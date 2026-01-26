export const EXAM_CONFIG = {
  DEFAULT_DURATION: 30 * 60, // 30 minutes
  TIME_WARNING_THRESHOLD: 5 * 60, // 5 minutes
  AUTO_SAVE_INTERVAL: 30 * 1000, // 30 seconds
} as const;

export const QUESTION_STATUS_COLORS = {
  current: 'hsl(var(--primary))',
  answered: 'hsl(var(--question-answered))',
  marked: 'hsl(var(--question-marked))',
  'answered-marked': 'hsl(var(--question-answered-marked))',
  'not-visited': 'transparent',
} as const;
