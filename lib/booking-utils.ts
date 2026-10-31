/**
 * Booking Utilities for Free 15-Minute Discovery Calls
 * Timezone: Africa/Nairobi (EAT, UTC+3)
 * Operating Hours:
 *   - Mon - Thu: 09:00 - 17:00 EAT
 *   - Fri: 09:00 - 12:00 EAT (Half-Day)
 *   - Sat - Sun: Closed
 * Slot Architecture:
 *   - Call Duration: 15 minutes
 *   - Break Buffer: 20 minutes between slots (Total cycle: 35 minutes)
 */

export const BOOKING_CONFIG = {
    TIMEZONE: "Africa/Nairobi",
    CALL_DURATION_MINUTES: 15,
    BREAK_BUFFER_MINUTES: 20,
    TOTAL_CYCLE_MINUTES: 35,
    MIN_ADVANCE_NOTICE_HOURS: 2, // Cannot book on same day within 2 hours
    MAX_BOOKING_DAYS_AHEAD: 30,  // 30-day rolling booking window
    DEFAULT_SCHEDULE: {
        1: { name: "Monday", start: "09:00", end: "17:00", active: true },
        2: { name: "Tuesday", start: "09:00", end: "17:00", active: true },
        3: { name: "Wednesday", start: "09:00", end: "17:00", active: true },
        4: { name: "Thursday", start: "09:00", end: "17:00", active: true },
        5: { name: "Friday", start: "09:00", end: "12:00", active: true }, // Friday cutoff 12:00 PM
        6: { name: "Saturday", start: "00:00", end: "00:00", active: false },
        0: { name: "Sunday", start: "00:00", end: "00:00", active: false },
    } as Record<number, { name: string; start: string; end: string; active: boolean }>,
};

export interface TimeSlot {
    startTime: string; // "09:00"
    endTime: string;   // "09:15"
    formatted: string; // "09:00 AM - 09:15 AM EAT"
    available: boolean;
    reason?: "booked" | "past" | "buffer_blocked";
}

/**
 * Converts a "HH:MM" string to minutes since midnight
 */
export function timeToMinutes(timeStr: string): number {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
}

/**
 * Converts minutes since midnight to "HH:MM" 24h format
 */
export function minutesToTime(totalMinutes: number): string {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}

/**
 * Formats "HH:MM" 24h time to 12h display with AM/PM (e.g. "09:35" -> "9:35 AM", "13:05" -> "1:05 PM")
 */
export function formatTime12h(timeStr: string): string {
    const [h, m] = timeStr.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    return `${hour12}:${m.toString().padStart(2, "0")} ${period}`;
}

/**
 * Calculates slot end time given start time and 15-minute call duration
 */
export function calculateSlotEndTime(startTime: string): string {
    const startMins = timeToMinutes(startTime);
    return minutesToTime(startMins + BOOKING_CONFIG.CALL_DURATION_MINUTES);
}

/**
 * Generates all valid 15-minute time slots separated by 20-minute breaks
 * within a given window.
 * Cycle: 15 min call + 20 min break = 35 min total per step.
 */
export function generateDayTimeSlots(
    dayStart: string = "09:00",
    dayEnd: string = "17:00"
): { startTime: string; endTime: string }[] {
    const slots: { startTime: string; endTime: string }[] = [];
    const startMins = timeToMinutes(dayStart);
    const endMins = timeToMinutes(dayEnd);

    let currentStart = startMins;

    while (currentStart + BOOKING_CONFIG.CALL_DURATION_MINUTES <= endMins) {
        const slotEnd = currentStart + BOOKING_CONFIG.CALL_DURATION_MINUTES;
        slots.push({
            startTime: minutesToTime(currentStart),
            endTime: minutesToTime(slotEnd),
        });

        // Advance by Call Duration (15m) + Break Buffer (20m) = 35m
        currentStart += BOOKING_CONFIG.TOTAL_CYCLE_MINUTES;
    }

    return slots;
}

/**
 * Gets current date/time in Africa/Nairobi (EAT / UTC+3)
 */
export function getCurrentEATDate(): Date {
    const now = new Date();
    // Convert to Nairobi time string and re-parse
    const nairobiStr = now.toLocaleString("en-US", { timeZone: BOOKING_CONFIG.TIMEZONE });
    return new Date(nairobiStr);
}

/**
 * Checks if a date string ("YYYY-MM-DD") is in the past in EAT
 */
export function isDateInPast(dateStr: string): boolean {
    const currentEAT = getCurrentEATDate();
    const todayStr = currentEAT.toISOString().split("T")[0];
    return dateStr < todayStr;
}

/**
 * Checks if a slot on today's date violates the 2-hour advance buffer
 */
export function isSlotWithinLeadBuffer(dateStr: string, slotStartTime: string): boolean {
    const currentEAT = getCurrentEATDate();
    const todayStr = currentEAT.toISOString().split("T")[0];

    if (dateStr !== todayStr) return false;

    const nowMinutes = currentEAT.getHours() * 60 + currentEAT.getMinutes();
    const slotMinutes = timeToMinutes(slotStartTime);

    // If slot starts in less than 2 hours (120 minutes) from now, it is blocked
    const minNoticeMinutes = BOOKING_CONFIG.MIN_ADVANCE_NOTICE_HOURS * 60;
    return slotMinutes <= nowMinutes + minNoticeMinutes;
}

/**
 * Generates an Add to Google Calendar URL
 */
export function generateGoogleCalendarUrl({
    title,
    description,
    startDate,
    startTime,
    endTime,
    meetLink,
}: {
    title: string;
    description: string;
    startDate: string; // YYYY-MM-DD
    startTime: string; // HH:MM
    endTime: string;   // HH:MM
    meetLink?: string;
}): string {
    const cleanDate = startDate.replace(/-/g, "");
    const cleanStartTime = startTime.replace(/:/g, "") + "00";
    const cleanEndTime = endTime.replace(/:/g, "") + "00";

    // EAT is UTC+3. To convert EAT to UTC (Z): subtract 3 hours
    const startMinsUTC = timeToMinutes(startTime) - 3 * 60;
    const endMinsUTC = timeToMinutes(endTime) - 3 * 60;

    const startHUTC = Math.floor((startMinsUTC + 1440) % 1440 / 60);
    const startMUTC = (startMinsUTC + 1440) % 60;
    const endHUTC = Math.floor((endMinsUTC + 1440) % 1440 / 60);
    const endMUTC = (endMinsUTC + 1440) % 60;

    const startUtcStr = `${cleanDate}T${startHUTC.toString().padStart(2, "0")}${startMUTC.toString().padStart(2, "0")}00Z`;
    const endUtcStr = `${cleanDate}T${endHUTC.toString().padStart(2, "0")}${endMUTC.toString().padStart(2, "0")}00Z`;

    const details = `${description}\n\nGoogle Meet: ${meetLink || "Link will be provided before call"}`;
    const params = new URLSearchParams({
        action: "TEMPLATE",
        text: title,
        dates: `${startUtcStr}/${endUtcStr}`,
        details: details,
        location: meetLink || "Google Meet",
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export interface IcsAttendee {
    name: string;
    email: string;
    role?: "REQ-PARTICIPANT" | "OPT-PARTICIPANT";
}

/**
 * Generates an iCalendar (.ics) string for Google Calendar, Apple Calendar & Outlook
 * Includes native 15-minute push alarms and RFC 5545 METHOD:REQUEST
 */
export function generateIcsContent({
    id,
    title,
    description,
    startDate,
    startTime,
    endTime,
    meetLink,
    organizer = { name: "Xinteck Technologies", email: "info@xinteck.co.ke" },
    attendees = [],
    sequence = 0,
}: {
    id: string;
    title: string;
    description: string;
    startDate: string; // YYYY-MM-DD
    startTime: string; // HH:MM
    endTime: string;   // HH:MM
    meetLink?: string;
    organizer?: { name: string; email: string };
    attendees?: IcsAttendee[];
    sequence?: number;
}): string {
    const cleanDate = startDate.replace(/-/g, "");
    const startMinsUTC = timeToMinutes(startTime) - 3 * 60;
    const endMinsUTC = timeToMinutes(endTime) - 3 * 60;

    const startHUTC = Math.floor((startMinsUTC + 1440) % 1440 / 60);
    const startMUTC = (startMinsUTC + 1440) % 60;
    const endHUTC = Math.floor((endMinsUTC + 1440) % 1440 / 60);
    const endMUTC = (endMinsUTC + 1440) % 60;

    const dtStart = `${cleanDate}T${startHUTC.toString().padStart(2, "0")}${startMUTC.toString().padStart(2, "0")}00Z`;
    const dtEnd = `${cleanDate}T${endHUTC.toString().padStart(2, "0")}${endMUTC.toString().padStart(2, "0")}00Z`;
    const nowStamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

    const lines = [
        "BEGIN:VCALENDAR",
        "PRODID:-//Xinteck Technologies//Discovery Call Scheduler//EN",
        "VERSION:2.0",
        "CALSCALE:GREGORIAN",
        "METHOD:REQUEST",
        "BEGIN:VEVENT",
        `UID:discovery-${id}@xinteck.co.ke`,
        `DTSTAMP:${nowStamp}`,
        `SEQUENCE:${sequence}`,
        `DTSTART:${dtStart}`,
        `DTEND:${dtEnd}`,
        `SUMMARY:${title}`,
        `DESCRIPTION:${description.replace(/\n/g, "\\n")}`,
        `LOCATION:${meetLink || "Google Meet"}`,
        `ORGANIZER;CN="${organizer.name}":mailto:${organizer.email}`,
    ];

    attendees.forEach((att) => {
        lines.push(`ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=${att.role || "REQ-PARTICIPANT"};PARTSTAT=ACCEPTED;CN="${att.name}":mailto:${att.email}`);
    });

    lines.push("STATUS:CONFIRMED");
    lines.push("TRANSP:OPAQUE");

    // Native alarm: 15 minutes before event
    lines.push(
        "BEGIN:VALARM",
        "ACTION:DISPLAY",
        "DESCRIPTION:Reminder: Xinteck Discovery Call starting in 15 minutes",
        "TRIGGER:-PT15M",
        "END:VALARM"
    );

    lines.push("END:VEVENT");
    lines.push("END:VCALENDAR");

    return lines.join("\r\n");
}

/**
 * Generates an iCalendar (.ics) cancellation string with METHOD:CANCEL
 * Automatically removes/updates the event in Google Calendar, Apple Calendar & Outlook
 */
export function generateIcsCancelContent({
    id,
    title,
    description = "This discovery call has been cancelled.",
    startDate,
    startTime,
    endTime,
    organizer = { name: "Xinteck Technologies", email: "info@xinteck.co.ke" },
    attendees = [],
    sequence = 1,
}: {
    id: string;
    title: string;
    description?: string;
    startDate: string; // YYYY-MM-DD
    startTime: string; // HH:MM
    endTime: string;   // HH:MM
    organizer?: { name: string; email: string };
    attendees?: IcsAttendee[];
    sequence?: number;
}): string {
    const cleanDate = startDate.replace(/-/g, "");
    const startMinsUTC = timeToMinutes(startTime) - 3 * 60;
    const endMinsUTC = timeToMinutes(endTime) - 3 * 60;

    const startHUTC = Math.floor((startMinsUTC + 1440) % 1440 / 60);
    const startMUTC = (startMinsUTC + 1440) % 60;
    const endHUTC = Math.floor((endMinsUTC + 1440) % 1440 / 60);
    const endMUTC = (endMinsUTC + 1440) % 60;

    const dtStart = `${cleanDate}T${startHUTC.toString().padStart(2, "0")}${startMUTC.toString().padStart(2, "0")}00Z`;
    const dtEnd = `${cleanDate}T${endHUTC.toString().padStart(2, "0")}${endMUTC.toString().padStart(2, "0")}00Z`;
    const nowStamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

    const lines = [
        "BEGIN:VCALENDAR",
        "PRODID:-//Xinteck Technologies//Discovery Call Scheduler//EN",
        "VERSION:2.0",
        "CALSCALE:GREGORIAN",
        "METHOD:CANCEL",
        "BEGIN:VEVENT",
        `UID:discovery-${id}@xinteck.co.ke`,
        `DTSTAMP:${nowStamp}`,
        `SEQUENCE:${sequence}`,
        `DTSTART:${dtStart}`,
        `DTEND:${dtEnd}`,
        `SUMMARY:${title}`,
        `DESCRIPTION:${description.replace(/\n/g, "\\n")}`,
        `ORGANIZER;CN="${organizer.name}":mailto:${organizer.email}`,
    ];

    attendees.forEach((att) => {
        lines.push(`ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=${att.role || "REQ-PARTICIPANT"};PARTSTAT=DECLINED;CN="${att.name}":mailto:${att.email}`);
    });

    lines.push("STATUS:CANCELLED");
    lines.push("END:VEVENT");
    lines.push("END:VCALENDAR");

    return lines.join("\r\n");
}
