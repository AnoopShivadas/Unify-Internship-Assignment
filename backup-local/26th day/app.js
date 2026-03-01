console.log("🔥 CLOUD VERSION RUNNING");
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const app = express();
const PORT = 3000;
app.use(express.json());

const uri ="mongodb+srv://anoopshivadas25_db_user:rycoT0A6wTRvQO2A@cluster0.pirdilp.mongodb.net/shopDB?retryWrites=true&w=majority";

const client = new MongoClient(uri);
let db;
async function connectDB() {
    try {
        await client.connect();
        console.log("✅ Connected to MongoDB Atlas");

        // This will create/use shopDB in cloud
        db = client.db("shopDB");

    } catch (error) {
        console.error("❌ Database connection failed:", error);
    }
}

// ---------------- ROUTES ----------------

app.get("/", (req, res) => {
    res.send("🌍 Shop API Running (Cloud Connected)");
});

// GET ALL PRODUCTS
app.get("/products", async (req, res) => {
    try {
        const products = await db.collection("products").find().toArray();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST PRODUCT
app.post("/products", async (req, res) => {
    try {
        const { name, price, stock } = req.body;

        if (!name || !price || !stock) {
            return res.status(400).json({ message: "All fields required" });
        }

        const result = await db.collection("products").insertOne({
            name,
            price,
            stock
        });

        res.status(201).json({
            message: "Product added",
            id: result.insertedId
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PATCH STOCK
app.patch("/products/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { stock } = req.body;

        const result = await db.collection("products").updateOne(
            { _id: new ObjectId(id) },
            { $set: { stock: stock } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json({ message: "Stock updated" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE PRODUCT
app.delete("/products/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.collection("products").deleteOne({
            _id: new ObjectId(id)
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json({ message: "Product deleted successfully" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ---------------- SERVER START ----------------

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
});