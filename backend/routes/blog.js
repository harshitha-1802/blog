// backend/routes/blog.js
require("dotenv").config();
const express = require("express");
const router = express.Router();
const db = require("../models/db");

// Use table name from .env or fallback to "blogs"
const BLOG_TABLE = process.env.DB_BLOG_TABLE || "blogs";

// Get all blogs
router.get("/", async (req, res) => {
  try {
    const result = await db.query(
      `SELECT * FROM ${BLOG_TABLE} ORDER BY date DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Get a single blog by ID
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await db.query(
      `SELECT * FROM ${BLOG_TABLE} WHERE id = $1`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Blog not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Create a new blog
router.post("/", async (req, res) => {
  const { title, category, content, tags } = req.body;
  try {
    const sql = `
      INSERT INTO ${BLOG_TABLE} (title, category, content, tags, date)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING id
    `;
    const result = await db.query(sql, [
      title,
      category,
      content,
      Array.isArray(tags) ? tags.join(",") : tags,
    ]);
    res.status(201).json({ message: "Blog created", id: result.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Delete a blog
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await db.query(`DELETE FROM ${BLOG_TABLE} WHERE id = $1`, [id]);
    res.json({ message: "Blog deleted" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
