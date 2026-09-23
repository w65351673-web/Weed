// Quick check: which DB are we hitting and how many products/settings exist.
// Run: node scripts/check-db.mjs
import mongoose from "mongoose";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const envPath = resolve(process.cwd(), ".env");
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/weedlaps";
await mongoose.connect(uri);
const db = mongoose.connection.db;
console.log("Host:", mongoose.connection.host, "| DB:", db.databaseName);
console.log("Products:", await db.collection("products").countDocuments());
console.log("Settings:", await db.collection("settings").countDocuments());
const sample = await db.collection("products").findOne({}, { projection: { name: 1, strainType: 1, grade: 1 } });
console.log("Sample:", JSON.stringify(sample));
await mongoose.disconnect();
