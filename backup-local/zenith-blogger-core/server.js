/**
 * ZENITH: The Blogger Core
 * Express.js + MongoDB Atlas Backend
 */

require("dotenv").config();
const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ─── MongoDB Connection ───────────────────────────────────────────────────────
let db;

async function connectDB() {
  try {
    const client = new MongoClient(process.env.MONGO_URI);
    await client.connect();
    db = client.db("zenith_cms");
    console.log("✅ Connected to MongoDB Atlas — zenith_cms");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
}

// Helper to get the blogs collection
const blogs = () => db.collection("blogs");

// ─── API Routes ───────────────────────────────────────────────────────────────

/**
 * GET /api/posts
 * Returns all blog posts sorted newest first
 */
app.get("/api/posts", async (req, res) => {
  try {
    const posts = await blogs()
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    res.json({ success: true, data: posts });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch posts" });
  }
});

/**
 * GET /api/posts/:id
 * Returns a single blog post by ID
 */
app.get("/api/posts/:id", async (req, res) => {
  try {
    const post = await blogs().findOne({ _id: new ObjectId(req.params.id) });
    if (!post) return res.status(404).json({ success: false, error: "Post not found" });
    res.json({ success: true, data: post });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch post" });
  }
});

/**
 * POST /api/posts
 * Creates a new blog post
 * Body: { title, category, content }
 */
app.post("/api/posts", async (req, res) => {
  try {
    const { title, category, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ success: false, error: "Title and content are required" });
    }
    const post = {
      title: title.trim(),
      category: (category || "General").trim(),
      content: content.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await blogs().insertOne(post);
    res.status(201).json({ success: true, data: { ...post, _id: result.insertedId } });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to create post" });
  }
});

/**
 * PATCH /api/posts/:id
 * Updates an existing blog post
 * Body: { title?, category?, content? }
 */
app.patch("/api/posts/:id", async (req, res) => {
  try {
    const { title, category, content } = req.body;
    const updates = { updatedAt: new Date() };
    if (title) updates.title = title.trim();
    if (category) updates.category = category.trim();
    if (content) updates.content = content.trim();

    const result = await blogs().findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: updates },
      { returnDocument: "after" }
    );
    if (!result) return res.status(404).json({ success: false, error: "Post not found" });
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to update post" });
  }
});

/**
 * DELETE /api/posts/:id
 * Deletes a blog post by ID
 */
app.delete("/api/posts/:id", async (req, res) => {
  try {
    const result = await blogs().deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, error: "Post not found" });
    }
    res.json({ success: true, message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to delete post" });
  }
});

// ─── SPA Fallback (serve HTML pages) ─────────────────────────────────────────
app.get("/post", (req, res) => res.sendFile(path.join(__dirname, "public/post.html")));
app.get("/editor", (req, res) => res.sendFile(path.join(__dirname, "public/editor.html")));

// ─── Start Server ─────────────────────────────────────────────────────────────
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 ZENITH running at http://localhost:${PORT}`);
  });
});
