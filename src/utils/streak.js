import dayjs from "dayjs";

/**
 * activityArray example:
 * [
 *  { date: "2026-02-14", solved: true, ... }
 * ]
 *
 * streak means:
 * count of continuous solved days till today (including today)
 */
export function calculateStreak(activityArray = []) {
    // Convert array -> map for fast lookup
    const map = {};
    for (const a of activityArray) {
        map[a.date] = a;
    }

    let streak = 0;
    let current = dayjs(); // today

    while (true) {
        const key = current.format("YYYY-MM-DD");
        const entry = map[key];

        if (entry && entry.solved === true) {
            streak++;
            current = current.subtract(1, "day");
        } else {
            break;
        }
    }

    return streak;
}
