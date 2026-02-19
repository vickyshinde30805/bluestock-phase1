import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pkg from "pg";

dotenv.config();
const { Pool } = pkg;

const app = express();

app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "https://bluestock-phase1-ch6dm0j6p-vicky-shindes-projects-b1d3a340.vercel.app",
        ],
    })
);
app.get("/", (req, res) => {
    res.send("Bluestock Backend is Running ✅");
});
app.use(express.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// ✅ Health check
app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

// ✅ DB test
app.get("/db-test", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW() as time");
        res.json({ success: true, data: result.rows[0] });
    } catch (err) {
        console.error("DB ERROR:", err);
        res.status(500).json({
            success: false,
            error: err.message,
        });
    }
});

// ✅ Sync endpoint (REAL DB UPSERT)
app.post("/sync/daily-scores", async (req, res) => {
    try {
        const { email, entries } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, error: "Missing email" });
        }

        if (!Array.isArray(entries) || entries.length === 0) {
            return res
                .status(400)
                .json({ success: false, error: "No entries to sync" });
        }

        // Create table if not exists (safe)
        await pool.query(`
      CREATE TABLE IF NOT EXISTS daily_scores (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL,
        date DATE NOT NULL,
        score INT,
        time_taken INT,
        UNIQUE(email, date)
      );
    `);

        let syncedCount = 0;

        for (const e of entries) {
            const { date, score, timeTaken } = e;

            // Basic validation
            if (!date || typeof date !== "string") continue;

            // Prevent future dates
            const today = new Date().toISOString().slice(0, 10);
            if (date > today) continue;

            // Score validation
            if (typeof score !== "number" || score < 0 || score > 10000) continue;

            // Time validation (seconds)
            if (typeof timeTaken !== "number" || timeTaken < 1 || timeTaken > 86400)
                continue;

            await pool.query(
                `
        INSERT INTO daily_scores (email, date, score, time_taken)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (email, date)
        DO UPDATE SET score = EXCLUDED.score, time_taken = EXCLUDED.time_taken;
        `,
                [email, date, score, timeTaken]
            );

            syncedCount++;
        }

        return res.json({ success: true, synced: syncedCount });
    } catch (err) {
        console.error("SYNC ERROR:", err);
        return res.status(500).json({ success: false, error: err.message });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});
