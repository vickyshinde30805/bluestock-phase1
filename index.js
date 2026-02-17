const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

// -------------------------
// Neon PostgreSQL connection
// -------------------------
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

// -------------------------
// Health check
// -------------------------
app.get("/health", (req, res) => {
    res.json({ success: true, status: "ok" });
});

// -------------------------
// DB test
// -------------------------
app.get("/db-test", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW() as time");
        res.json({ success: true, data: result.rows[0] });
    } catch (err) {
        res.json({ success: false, error: err.message });
    }
});

// -------------------------
// Create table automatically
// -------------------------
app.get("/setup", async (req, res) => {
    try {
        await pool.query(`
      CREATE TABLE IF NOT EXISTS daily_scores (
        id SERIAL PRIMARY KEY,
        user_email TEXT NOT NULL,
        date DATE NOT NULL,
        score INT,
        time_taken INT,
        UNIQUE(user_email, date)
      );
    `);

        res.json({ success: true, message: "Table ready ✅" });
    } catch (err) {
        res.json({ success: false, error: err.message });
    }
});

// -------------------------
// Sync API (Batch insert)
// -------------------------
app.post("/sync/daily-scores", async (req, res) => {
    try {
        const { userEmail, entries } = req.body;

        if (!userEmail) {
            return res.json({ success: false, error: "Missing userEmail" });
        }

        if (!Array.isArray(entries) || entries.length === 0) {
            return res.json({ success: false, error: "Entries missing" });
        }

        // validation + insert
        for (const e of entries) {
            if (!e.date) continue;

            const score = Number(e.score || 0);
            const timeTaken = Number(e.timeTaken || 0);

            // Basic security rules
            if (score < 0 || score > 1000) continue;
            if (timeTaken < 0 || timeTaken > 60 * 60) continue;

            await pool.query(
                `
        INSERT INTO daily_scores (user_email, date, score, time_taken)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (user_email, date)
        DO UPDATE SET score=$3, time_taken=$4
        `,
                [userEmail, e.date, score, timeTaken]
            );
        }

        res.json({ success: true, message: "Synced ✅" });
    } catch (err) {
        res.json({ success: false, error: err.message });
    }
});

// ----------
