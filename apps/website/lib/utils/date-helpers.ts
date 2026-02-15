/**
 * Date utilities for handling timezone conversions
 * All exam times are displayed in IST (Asia/Kolkata)
 */

const IST_TIMEZONE = 'Asia/Kolkata';

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
 * Uses UTC comparison to ensure consistent behavior across timezones
 */
export function isDatePassed(date: string): boolean {
  const now = new Date().getTime();
  const target = new Date(date).getTime();
  return now > target;
}

/**
 * Check if current date is within exam window
 * Uses UTC timestamps for comparison
 */
export function isInExamWindow(windowStart: string, windowEnd: string): boolean {
  const now = new Date().getTime();
  const start = new Date(windowStart).getTime();
  const end = new Date(windowEnd).getTime();
  return now >= start && now <= end;
}

/**
 * Format time to IST timezone
 * This ensures 9:00 AM IST is displayed as 9:00 AM regardless of user's local timezone
 */
export function formatISTTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: IST_TIMEZONE,
  });
}

/**
 * Format exam date for display in IST
 */
export function formatExamDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: IST_TIMEZONE,
  });
}

/**
 * Format date to simple format (e.g., "Dec 23, 2025") in IST
 */
export function formatDateShort(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: IST_TIMEZONE,
  });
}

/**
 * Format date and time for display in IST
 */
export function formatDateTimeIST(date: string): string {
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: IST_TIMEZONE,
  });
}
