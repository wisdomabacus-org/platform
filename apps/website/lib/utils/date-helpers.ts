/**
 * Calculate time remaining until a target date
 * Returns an object with days, hours, minutes, and seconds
 */
export function calculateTimeRemaining(targetDate: string) {
  const now = new Date().getTime();
  const target = new Date(targetDate).getTime();
  const distance = target - now;

  if (distance < 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isPast: true
    };
  }

  return {
    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((distance % (1000 * 60)) / 1000),
    isPast: false
  };
}

/**
 * Check if a date has passed
 */
export function isDatePassed(date: string): boolean {
  return new Date(date).getTime() < new Date().getTime();
}

/**
 * Check if current date is within exam window
 */
export function isInExamWindow(windowStart: string, windowEnd: string): boolean {
  const now = new Date().getTime();
  const start = new Date(windowStart).getTime();
  const end = new Date(windowEnd).getTime();
  return now >= start && now <= end;
}

/**
 * Format exam date for display
 */
export function formatExamDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Format date to simple format (e.g., "Dec 23, 2025")
 */
export function formatDateShort(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}
