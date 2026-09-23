// Imports scraped cannabis flower products from data/bulkbuddy-cannabis.json into MongoDB.
// Replaces ALL existing products so the shop is flower-only. Keeps settings/admin untouched.
// Usage: node scripts/import-bulkbuddy.mjs
//   MONGODB_URI env var is used if set, otherwise mongodb://localhost:27017/weedlaps
import fs from "node:fs/promises";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import mongoose from "mongoose";

// Load .env so we hit the same database as the app
const envPath = path.resolve(process.cwd(), ".env");
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/weedlaps";
const DATA_FILE = path.resolve("data/bulkbuddy-cannabis.json");

const SizeSchema = new mongoose.Schema({ label: String, price: Number }, { _id: false });

const ProductSchema = new mongoose.Schema(
  {
    slug: { type: String, unique: true },
    name: String,
    price: Number,
    category: String,
    strainType: String,
    grade: String,
    shortDescription: String,
    description: String,
    specifications: [String],
    sizes: [SizeSchema],
    inStock: { type: Boolean, default: true },
    image: String,
  },
  { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

async function main() {
  const raw = JSON.parse(await fs.readFile(DATA_FILE, "utf8"));
  console.log(`Read ${raw.length} products from ${DATA_FILE}`);

  const docs = raw.map((p) => ({
    slug: p.slug,
    name: p.name,
    price: p.price ?? p.sizes?.[0]?.price ?? 0,
    category: "powder",
    strainType: p.strainType || "",
    grade: p.grade || "",
    shortDescription: p.shortDescription || "",
    description: p.description || "",
    specifications: p.specifications || [],
    sizes: p.sizes || [],
    inStock: p.inStock !== false,
    image: p.image || "",
  }));

  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB.");

  await Product.deleteMany({});
  await Product.insertMany(docs);
  console.log(`Imported ${docs.length} cannabis flower products.`);

  await mongoose.disconnect();
  console.log("Done.");
}

main().catch((e) => {
  console.error("Import failed:", e);
  process.exit(1);
});
