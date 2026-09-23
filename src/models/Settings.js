import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: "main", unique: true },
    siteName: { type: String, default: "WeedLaps" },
    tagline: { type: String, default: "Premium Cannabis Flower — Trusted Worldwide" },
    heroSubtitle: { type: String, default: "" },
    contactEmail: { type: String, default: "" },
    contactPhone: { type: String, default: "" },
    shippingNote: { type: String, default: "" },
    aboutText: { type: String, default: "" },
    announcement: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);
