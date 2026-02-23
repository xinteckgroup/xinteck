
/**
 * Strict UTC Date Parsing Utilities
 * 
 * Purpose: 
 * To convert "YYYY-MM-DD" strings (from UI) into deterministic UTC Date objects
 * for database querying, bypassing the server's local timezone settings.
 * 
 * Rules:
 * 1. Inputs must constitute a valid "YYYY-MM-DD" string.
 * 2. Outputs are strictly UTC timestamps.
 * 3. Start of day is 00:00:00.000 UTC.
 * 4. End of day is 23:59:59.999 UTC.
 */

/**
 * Validates if the string matches YYYY-MM-DD format.
 */
function isValidDateString(dateStr: string): boolean {
    return /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
}

/**
 * Parses a "YYYY-MM-DD" string into a UTC Date object at 00:00:00.000 UTC.
 * Throws error if format is invalid to prevent silent logic failures.
 * 
 * @param dateStr "YYYY-MM-DD"
 */
export function parseUtcStart(dateStr: string): Date {
    if (!isValidDateString(dateStr)) {
        throw new Error(`Invalid date format: "${dateStr}". Expected YYYY-MM-DD.`);
    }

    const [y, m, d] = dateStr.split("-").map(Number);
    // Date.UTC(year, monthIndex, day, hour, min, sec, ms)
    // monthIndex is 0-based (0 = Jan, 11 = Dec)
    return new Date(Date.UTC(y, m - 1, d, 0, 0, 0, 0));
}

/**
 * Parses a "YYYY-MM-DD" string into a UTC Date object at 23:59:59.999 UTC.
 * Throws error if format is invalid.
 * 
 * @param dateStr "YYYY-MM-DD"
 */
export function parseUtcEnd(dateStr: string): Date {
    if (!isValidDateString(dateStr)) {
        throw new Error(`Invalid date format: "${dateStr}". Expected YYYY-MM-DD.`);
    }

    const [y, m, d] = dateStr.split("-").map(Number);
    return new Date(Date.UTC(y, m - 1, d, 23, 59, 59, 999));
}

