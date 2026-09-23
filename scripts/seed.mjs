import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/weedlaps";

// ─── Inline schemas (can't use Next.js aliases in standalone script) ───

const SizeSchema = new mongoose.Schema(
  { label: String, price: Number },
  { _id: false }
);

const ProductSchema = new mongoose.Schema({
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
});

const SettingsSchema = new mongoose.Schema({
  key: { type: String, default: "main", unique: true },
  siteName: String,
  tagline: String,
  heroSubtitle: String,
  contactEmail: String,
  contactPhone: String,
  shippingNote: String,
  aboutText: String,
  announcement: String,
});

const AdminSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
});

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);
const Settings = mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);
const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

// ─── Seed Data ───

const products = [
  {
    slug: "og-kush-flower",
    name: "OG Kush — Premium Flower",
    price: 45.0,
    category: "powder",
    strainType: "indica",
    grade: "AAAA",
    shortDescription:
      "Legendary indica-dominant hybrid. Dense, frosty buds with earthy pine and citrus notes. 24% THC.",
    description:
      "Our OG Kush is grown indoors by craft cultivators and hand-trimmed to perfection. Expect dense, resin-coated buds with the classic earthy pine aroma and hints of citrus. This indica-dominant hybrid delivers deep relaxation and euphoria — perfect for evening use. Every batch is third-party lab tested for potency, pesticides, and heavy metals.",
    specifications: [
      "THC: 24%",
      "Type: Indica-dominant hybrid",
      "Aroma: Earthy pine, citrus, fuel",
      "Effects: Relaxing, euphoric, sleepy",
      "Lab tested: pesticides & heavy metals free",
    ],
    sizes: [
      { label: "3.5g (Eighth)", price: 45 },
      { label: "7g (Quarter)", price: 80 },
      { label: "14g (Half Oz)", price: 145 },
      { label: "28g (Ounce)", price: 260 },
    ],
    inStock: true,
    image: "/images/flower.jpg",
  },
  {
    slug: "blue-dream-flower",
    name: "Blue Dream — Premium Flower",
    price: 40.0,
    category: "powder",
    strainType: "sativa",
    grade: "AAA",
    shortDescription:
      "Classic sativa-dominant hybrid. Sweet berry aroma with balanced, uplifting effects. 21% THC.",
    description:
      "Blue Dream is a beloved sativa-dominant hybrid known for its sweet blueberry aroma and smooth, balanced high. Great for daytime use — uplifting and creative without heavy sedation. Grown organically, slow-cured for 30 days, and lab tested for purity and potency.",
    specifications: [
      "THC: 21%",
      "Type: Sativa-dominant hybrid",
      "Aroma: Sweet berry, herbal",
      "Effects: Uplifting, creative, focused",
      "Lab tested: pesticides & heavy metals free",
    ],
    sizes: [
      { label: "3.5g (Eighth)", price: 40 },
      { label: "7g (Quarter)", price: 72 },
      { label: "14g (Half Oz)", price: 130 },
      { label: "28g (Ounce)", price: 235 },
    ],
    inStock: true,
    image: "/images/flower2.jpg",
  },
  {
    slug: "pink-wagyu-flower",
    name: "Pink Wagyu — Craft Flower",
    price: 55.0,
    category: "powder",
    strainType: "hybrid",
    grade: "AAAA+",
    shortDescription:
      "Limited craft drop. Gassy, sweet and heavy-hitting with a smooth, creamy finish. 27% THC.",
    description:
      "Pink Wagyu is a small-batch craft strain grown in living soil and cold-cured for six weeks. Expect rock-hard, trichome-drenched buds with a gassy-sweet nose and a creamy exhale. The high hits fast — euphoric up front, settling into a warm, full-body melt. Very limited quantities.",
    specifications: [
      "THC: 27%",
      "Type: Hybrid (indica-leaning)",
      "Aroma: Gas, sweet cream, earth",
      "Effects: Euphoric, relaxing, heavy",
      "Lab tested: pesticides & heavy metals free",
    ],
    sizes: [
      { label: "3.5g (Eighth)", price: 55 },
      { label: "7g (Quarter)", price: 100 },
      { label: "14g (Half Oz)", price: 185 },
      { label: "28g (Ounce)", price: 340 },
    ],
    inStock: true,
    image: "/images/flower3.jpg",
  },
];

const settings = {
  key: "main",
  siteName: "WeedLaps",
  tagline: "Premium Cannabis Flower — Trusted Worldwide",
  heroSubtitle:
    "We supply premium cannabis flower — indica, sativa and hybrid strains — to customers across the globe. Fast, discreet shipping with every order.",
  contactEmail: "orders@weedlaps.com",
  contactPhone: "+1 (555) 902-4481",
  shippingNote:
    "All orders ship in plain, smell-proof packaging with tracking. Delivery times vary by destination.",
  aboutText:
    "WeedLaps has been a trusted name in the cannabis industry since 2019. We work directly with craft growers and licensed producers to source only the highest-quality cannabis products. Every batch is third-party lab tested for potency, pesticides, and heavy metals before it reaches your door.",
  announcement: "Discreet, tracked delivery on every order — worldwide.",
};

// ─── Run Seed ───

async function seed() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected.");

  // Products
  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log(`Seeded ${products.length} products.`);

  // Settings
  await Settings.deleteMany({});
  await Settings.create(settings);
  console.log("Seeded site settings.");

  // Admin (username: admin, password: admin123)
  await Admin.deleteMany({});
  const hashedPassword = await bcrypt.hash("admin123", 10);
  await Admin.create({ username: "admin", password: hashedPassword });
  console.log('Seeded admin user (username: "admin", password: "admin123").');

  await mongoose.disconnect();
  console.log("Done! Database seeded successfully.");
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
