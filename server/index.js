import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pkg from "pg";

dotenv.config();
const { Pool } = pkg;

const app = express();
app.use(cors());
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

app.listen(5000, () => {
    console.log("Backend running on http://localhost:5000");
});
