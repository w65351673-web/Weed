import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import ShopClient from "@/components/ShopClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Shop Cannabis Flower — Indica, Sativa & Hybrid | WeedLaps.com",
  description:
    "Shop premium cannabis flower at WeedLaps.com. Top-shelf indica, sativa & hybrid strains. Independently lab tested. Discreet worldwide shipping.",
  keywords: [
    "buy cannabis flower",
    "weed flower for sale",
    "AAAA weed online",
    "craft cannabis flower",
    "order weed online",
    "online dispensary",
    "premium cannabis strains",
    "indica flower for sale",
    "sativa flower online",
    "hybrid weed strains",
    "lab tested cannabis products",
    "discreet cannabis delivery",
    "weed fast shipping",
    "cannabis bulk buy",
    "weed wholesale prices",
    "buy marijuana online",
    "mail order weed",
    "top shelf bud",
    "organic weed online",
    "high THC flower",
    "420 shop online",
    "buy bud online",
    "cannabis shop",
    "weed store online",
  ],
  openGraph: {
    title: "Shop Cannabis Flower — Indica, Sativa & Hybrid",
    description:
      "WeedLaps.com — Buy premium cannabis flower. Indica, sativa & hybrid strains, lab tested. Discreet worldwide shipping.",
    url: "https://weedlaps.com/shop",
  },
  alternates: {
    canonical: "https://weedlaps.com/shop",
  },
};

export default async function ShopPage() {
  const conn = await dbConnect();
  
  if (!conn) {
    return <ShopClient products={[]} />;
  }
  const productsRaw = await Product.find({}).lean();
  const products = productsRaw.map((p) => ({
    _id: p._id.toString(),
    name: p.name || "",
    slug: p.slug || "",
    price: p.price || 0,
    category: p.category || "",
    strainType: p.strainType || "",
    grade: p.grade || "",
    shortDescription: p.shortDescription || "",
    description: p.description || "",
    specifications: p.specifications || [],
    sizes: (p.sizes || []).map((s) => ({ label: s.label, price: s.price })),
    inStock: p.inStock ?? true,
    image: p.image || "",
  }));

  return <ShopClient products={products} />;
}
