const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export async function syncDailyScores(email, entries) {
    try {
        if (!BASE_URL) {
            return { success: false, error: "Backend URL missing in .env" };
        }

        const res = await fetch(`${BASE_URL}/sync/daily-scores`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, entries }),
        });

        const data = await res.json();

        if (!res.ok) {
            return { success: false, error: data?.error || "Sync failed" };
        }

        return { success: true, data };
    } catch (err) {
        return { success: false, error: err.message };
    }
}
