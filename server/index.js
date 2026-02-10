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

app.use(express.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

app.get("/db-test", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW() as time");
        res.json({ success: true, data: result.rows[0] });
    } catch (err) {
        console.error("DB ERROR:", err);
        res.status(500).json({
            success: false,
            error: err.message,
            detail: err,
        });
    }

});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});
