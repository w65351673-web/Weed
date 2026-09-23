import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import Settings from "@/models/Settings";
import HomePage from "@/components/HomePage";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "WeedLaps — Premium Cannabis Flower",
  description:
    "WeedLaps.com — Premium cannabis flower. Indica, sativa & hybrid strains, independently lab tested and shipped discreetly worldwide.",
  keywords: [
    "buy weed online",
    "cannabis for sale",
    "buy cannabis flower",
    "AAAA weed",
    "craft cannabis",
    "premium cannabis",
    "top shelf weed",
    "lab tested cannabis",
    "discreet weed shipping",
    "cannabis worldwide delivery",
    "weed bulk discount",
    "best online dispensary",
    "trusted cannabis vendor",
    "online weed shop",
    "indica strains",
    "sativa strains",
    "hybrid weed",
    "buy marijuana online",
    "mail order marijuana",
    "organic cannabis flower",
    "high THC strains",
    "weed delivery",
    "420 online shop",
  ],
  openGraph: {
    title: "WeedLaps — Premium Cannabis Flower",
    description:
      "WeedLaps.com — Premium cannabis flower. Indica, sativa & hybrid strains, lab tested and shipped discreetly worldwide.",
    url: "https://weedlaps.com",
    siteName: "WeedLaps.com",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WeedLaps — Premium Cannabis Flower",
    description:
      "WeedLaps.com — Premium cannabis flower. Indica, sativa & hybrid strains, lab tested and shipped discreetly worldwide.",
  },
  alternates: {
    canonical: "https://weedlaps.com",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function Home() {
  const conn = await dbConnect();
  
  if (!conn) {
    const siteSettings = {
      announcement: "",
      heroSubtitle: "",
      siteName: "WeedLaps",
      tagline: "",
    };
    return <HomePage products={[]} siteSettings={siteSettings} />;
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

  let raw = await Settings.findOne({ key: "main" }).lean();
  const siteSettings = {
    announcement: raw?.announcement || "",
    heroSubtitle: raw?.heroSubtitle || "",
    siteName: raw?.siteName || "WeedLaps",
    tagline: raw?.tagline || "",
  };

  return <HomePage products={products} siteSettings={siteSettings} />;
}
