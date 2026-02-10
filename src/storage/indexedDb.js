import { openDB } from "idb";

const DB_NAME = "bluestock_phase1_db";
const DB_VERSION = 1;

const STORE_USER = "user";
const STORE_PROGRESS = "progress";

export async function getDB() {
    return openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_USER)) {
                db.createObjectStore(STORE_USER);
            }

            if (!db.objectStoreNames.contains(STORE_PROGRESS)) {
                db.createObjectStore(STORE_PROGRESS);
            }
        },
    });
}

// ---------------- USER ----------------
export async function saveUser(userData) {
    const db = await getDB();
    await db.put(STORE_USER, userData, "currentUser");
}

export async function getUser() {
    const db = await getDB();
    return db.get(STORE_USER, "currentUser");
}

export async function clearUser() {
    const db = await getDB();
    await db.delete(STORE_USER, "currentUser");
}

// ---------------- PROGRESS ----------------
export async function saveProgress(progressData) {
    const db = await getDB();
    await db.put(STORE_PROGRESS, progressData, "gameProgress");
}

export async function getProgress() {
    const db = await getDB();
    return db.get(STORE_PROGRESS, "gameProgress");
}

export async function clearProgress() {
    const db = await getDB();
    await db.delete(STORE_PROGRESS, "gameProgress");
}

