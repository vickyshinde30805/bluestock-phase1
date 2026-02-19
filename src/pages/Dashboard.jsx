import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

import Heatmap from "../components/Heatmap";
import { calculateStreak } from "../utils/streak";

// IndexedDB functions
import {
    saveDailyActivity,
    getAllDailyActivity,
    getUnsyncedActivity,
    markActivitySynced,
} from "../storage/activityDb";

// API sync function
import { syncDailyScores } from "../api/sync";

export default function Dashboard() {
    const navigate = useNavigate();

    // ✅ store firebase user in state
    const [user, setUser] = useState(null);

    const [activity, setActivity] = useState([]);
    const [streak, setStreak] = useState(0);

    const today = useMemo(() => dayjs().format("YYYY-MM-DD"), []);

    // ✅ Listen for Firebase auth state changes
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => {
            setUser(u);

            // if user is logged out, redirect to login
            if (!u) {
                navigate("/login");
            }
        });

        return () => unsub();
    }, [navigate]);

    // Load activity from IndexedDB on page load
    useEffect(() => {
        const load = async () => {
            const all = await getAllDailyActivity();
            setActivity(all);
        };
        load();
    }, []);

    // Update streak whenever activity changes
    useEffect(() => {
        const streakCount = calculateStreak(activity);
        setStreak(streakCount);
    }, [activity]);

    const handleLogout = async () => {
        await signOut(auth);
        alert("Logged out ✅");
        window.location.href = "/login";
    };
    // TEST BUTTON: Save today as solved
    const handleMarkTodaySolved = async () => {
        const entry = {
            date: today,
            solved: true,
            score: 120,
            timeTaken: 45,
            difficulty: 2,
            synced: false,
        };

        await saveDailyActivity(entry);

        // refresh activity list
        const all = await getAllDailyActivity();
        setActivity(all);
    };

    // SYNC BUTTON: Push unsynced data to backend
    const handleSync = async () => {
        // ✅ Always check latest user state
        if (!user?.email) {
            alert("Please login first");
            return;
        }

        const unsynced = await getUnsyncedActivity();

        if (unsynced.length === 0) {
            alert("Nothing to sync ✅");
            return;
        }

        const payload = unsynced.map((a) => ({
            date: a.date,
            score: a.score,
            timeTaken: a.timeTaken,
        }));

        const result = await syncDailyScores(user.email, payload);

        if (result.success) {
            await markActivitySynced(unsynced.map((x) => x.date));
            alert("Synced successfully ✅");

            const all = await getAllDailyActivity();
            setActivity(all);
        } else {
            alert("Sync failed: " + result.error);
        }
    };

    return (
        <div className="min-h-screen bg-[#F6F5F5] p-6">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* TOP CARD */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
                    <h1 className="text-2xl font-bold text-[#222222] flex items-center gap-2">
                        Dashboard <span>✅</span>
                    </h1>

                    <p className="mt-4 text-slate-700">
                        Firebase user: <b>{user?.email || "Loading..."}</b>
                    </p>

                    <p className="mt-2 text-slate-700">
                        🔥 Current Streak: <b>{streak} days</b>
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                        {/* Logout */}
                        <button
                            onClick={handleLogout}
                            className="px-6 py-3 rounded-xl bg-[#F05537] text-white font-semibold hover:opacity-90 transition"
                        >
                            Logout
                        </button>

                        {/* Test Button */}
                        <button
                            onClick={handleMarkTodaySolved}
                            className="px-6 py-3 rounded-xl bg-[#414BEA] text-white font-semibold hover:opacity-90 transition"
                        >
                            Mark Today Solved (Test)
                        </button>

                        {/* Sync Button */}
                        <button
                            onClick={handleSync}
                            className="px-6 py-3 rounded-xl bg-[#190482] text-white font-semibold hover:opacity-90 transition"
                        >
                            Sync Now
                        </button>
                    </div>
                </div>

                {/* HEATMAP CARD */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
                    <h2 className="text-xl font-bold text-[#222222]">Activity Heatmap</h2>

                    <p className="mt-2 text-slate-600">
                        GitHub-style daily completion tracker (offline-first)
                    </p>

                    <div className="mt-6">
                        <Heatmap activity={activity} />
                    </div>
                </div>
            </div>
        </div>
    );
}
