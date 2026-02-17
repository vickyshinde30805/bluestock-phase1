import { openDB } from "idb";

const DB_NAME = "bluestock-db";
const DB_VERSION = 1;
const STORE = "dailyActivity";

async function getDB() {
    return openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE)) {
                const store = db.createObjectStore(STORE, { keyPath: "date" });
                store.createIndex("synced", "synced");
            }
        },
    });
}

// Save or update one day activity
export async function saveDailyActivity(activity) {
    const db = await getDB();
    await db.put(STORE, activity);
}

// Get activity for one date
export async function getDailyActivity(date) {
    const db = await getDB();
    return db.get(STORE, date);
}

// Get all activity (for heatmap)
export async function getAllDailyActivity() {
    const db = await getDB();
    return db.getAll(STORE);
}

// Get unsynced solved entries
export async function getUnsyncedActivity() {
    const db = await getDB();
    const all = await db.getAll(STORE);

    return all.filter((a) => a.solved === true && a.synced === false);
}

// Mark multiple entries as synced
export async function markActivitySynced(dates = []) {
    const db = await getDB();

    for (const date of dates) {
        const existing = await db.get(STORE, date);

        if (existing) {
            await db.put(STORE, { ...existing, synced: true });
        }
    }
}

// Clear all activity (for testing)
export async function clearAllActivity() {
    const db = await getDB();
    await db.clear(STORE);
}
