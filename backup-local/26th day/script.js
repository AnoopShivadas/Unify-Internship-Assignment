const { MongoClient } = require("mongodb");

const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

async function connectDB() {
  try {
    await client.connect();
    console.log("Database connected successfully");

    const db = client.db("unify_labs");
    const collection = db.collection("products");

    const products = await collection.find({}).toArray();
    console.log("Products:");
    console.log(products);

  } catch (error) {
    console.error("Connection failed:", error.message);
  } finally {
    await client.close();
  }
}

connectDB();