/**
 * Date utilities for handling timezone conversions
 * All exam times are stored and displayed in IST (Asia/Kolkata)
 */

const IST_TIMEZONE = 'Asia/Kolkata';

/**
 * Create a date with the specified date and time in IST
 * This ensures that 9:00 AM IST is stored correctly as 9:00 AM
 */
export function createISTDate(datePart: Date, timePart: Date): Date {
    // Extract date components from datePart
    const year = datePart.getFullYear();
    const month = datePart.getMonth();
    const day = datePart.getDate();

    // Extract time components from timePart
    const hours = timePart.getHours();
    const minutes = timePart.getMinutes();

    // Create a date string in IST format: YYYY-MM-DDTHH:mm:ss+05:30
    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00+05:30`;

    // Parse it to get the correct timestamp
    return new Date(dateString);
}

/**
 * Format a date to display in IST timezone
 */
export function formatISTTime(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: IST_TIMEZONE,
    });
}

/**
 * Format a date to display date and time in IST
 */
export function formatISTDateTime(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: IST_TIMEZONE,
    });
}

/**
 * Get current time in IST for comparison
 */
export function getNowInIST(): Date {
    const now = new Date();
    // Convert to IST string and back to Date to get the equivalent time
    const istString = now.toLocaleString('en-US', { timeZone: IST_TIMEZONE });
    return new Date(istString);
}

/**
 * Check if current time is within exam window (comparing in IST)
 */
export function isInExamWindowIST(windowStart: string | Date, windowEnd: string | Date): boolean {
    const now = Date.now(); // Current timestamp
    const start = new Date(windowStart).getTime();
    const end = new Date(windowEnd).getTime();
    return now >= start && now <= end;
}

/**
 * Convert UTC ISO string to IST Date object
 * This is useful when receiving dates from the database
 */
export function utcToISTDate(isoString: string): Date {
    // Parse the UTC date
    const utcDate = new Date(isoString);
    // Convert to IST string representation
    const istString = utcDate.toLocaleString('en-US', { timeZone: IST_TIMEZONE });
    // Parse back to Date (this gives us the wall clock time in IST)
    return new Date(istString);
}
