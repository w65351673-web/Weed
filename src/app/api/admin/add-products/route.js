import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

// Cannabis flower only — bulk-add helper for admins.
const flowerProducts = [
  {
    name: "OG Kush — Premium Flower",
    strainType: "indica",
    grade: "AAAA",
    shortDescription: "Legendary indica-dominant hybrid. Dense, frosty buds with earthy pine and citrus notes.",
    description: "Our OG Kush is grown indoors by craft cultivators and hand-trimmed to perfection. Expect dense, resin-coated buds with the classic earthy pine aroma and hints of citrus. This indica-dominant hybrid delivers deep relaxation and euphoria — perfect for evening use. Every batch is third-party lab tested for potency, pesticides, and heavy metals.",
    sizes: [
      { label: "3.5g (Eighth)", price: 45 },
      { label: "7g (Quarter)", price: 80 },
      { label: "14g (Half Oz)", price: 145 },
      { label: "28g (Ounce)", price: 260 }
    ]
  },
  {
    name: "Blue Dream — Premium Flower",
    strainType: "sativa",
    grade: "AAA",
    shortDescription: "Classic sativa-dominant hybrid. Sweet berry aroma with balanced, uplifting effects.",
    description: "Blue Dream is a beloved sativa-dominant hybrid known for its sweet blueberry aroma and smooth, balanced high. Great for daytime use — uplifting and creative without heavy sedation. Grown organically, slow-cured for 30 days, and lab tested for purity and potency.",
    sizes: [
      { label: "3.5g (Eighth)", price: 40 },
      { label: "7g (Quarter)", price: 72 },
      { label: "14g (Half Oz)", price: 130 },
      { label: "28g (Ounce)", price: 235 }
    ]
  },
  {
    name: "Pink Wagyu — Craft Flower",
    strainType: "hybrid",
    grade: "AAAA+",
    shortDescription: "Limited craft drop. Gassy, sweet and heavy-hitting with a smooth, creamy finish.",
    description: "Pink Wagyu is a small-batch craft strain grown in living soil and cold-cured for six weeks. Expect rock-hard, trichome-drenched buds with a gassy-sweet nose and a creamy exhale. The high hits fast — euphoric up front, settling into a warm, full-body melt. Very limited quantities.",
    sizes: [
      { label: "3.5g (Eighth)", price: 55 },
      { label: "7g (Quarter)", price: 100 },
      { label: "14g (Half Oz)", price: 185 },
      { label: "28g (Ounce)", price: 340 }
    ]
  }
];

export async function POST(request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  const user = verifyToken(token);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  const results = [];

  for (const product of flowerProducts) {
    let slug = product.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    // Ensure unique slug
    const existing = await Product.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    const createdProduct = await Product.create({
      slug,
      name: product.name,
      price: product.sizes[0].price, // Use smallest size as base price
      category: "powder",
      strainType: product.strainType,
      grade: product.grade,
      shortDescription: product.shortDescription,
      description: product.description,
      specifications: [],
      sizes: product.sizes,
      inStock: true,
      image: ""
    });

    results.push(createdProduct);
  }

  return NextResponse.json({
    success: true,
    message: `Added ${results.length} products successfully`,
    products: results
  });
}
