// One-off: update site settings copy (announcement, shipping note, tagline).
// Run: node scripts/update-settings.mjs
import mongoose from "mongoose";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

// Load .env manually (no dotenv dependency assumed)
const envPath = resolve(process.cwd(), ".env");
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/weedlaps";

const updates = {
  siteName: "WeedLaps",
  tagline: "Premium Cannabis Flower — Trusted Worldwide",
  announcement: "Discreet, tracked delivery on every order — worldwide.",
  shippingNote:
    "All orders ship in plain, smell-proof packaging with tracking. Delivery times vary by destination.",
};

async function run() {
  await mongoose.connect(MONGODB_URI);
  const res = await mongoose.connection
    .collection("settings")
    .updateOne({ key: "main" }, { $set: updates }, { upsert: true });
  console.log("Settings updated:", res.modifiedCount, "modified,", res.upsertedCount, "inserted");
  await mongoose.disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
