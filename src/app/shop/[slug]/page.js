import Link from "next/link";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import ProductDetailClient from "./ProductDetailClient";

const BASE_URL = "https://weedlaps.com";

async function getProduct(slug) {
  try {
    await dbConnect();
    const product = await Product.findOne({ slug }).lean();
    if (!product) return null;
    return JSON.parse(JSON.stringify(product));
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: "Product Not Found | WeedLaps.com",
      description: "The product you are looking for could not be found.",
    };
  }

  const priceFrom = product.sizes?.[0]?.price || product.price || 0;
  const title = `${product.name} — Buy Online | WeedLaps.com`;
  const description = product.shortDescription
    ? `${product.shortDescription} From €${priceFrom}. Lab-tested quality. Discreet worldwide shipping.`
    : `Buy ${product.name} online. Premium, lab-tested cannabis. From €${priceFrom}. Discreet worldwide shipping.`;

  return {
    title,
    description,
    keywords: [
      product.name.toLowerCase(),
      `buy ${product.name.toLowerCase()}`,
      `${product.name.toLowerCase()} for sale`,
      `${product.name.toLowerCase()} online`,
      `${product.category} cannabis`,
      "buy weed online",
      "cannabis for sale",
      "premium cannabis",
      "lab tested cannabis",
      "discreet weed shipping",
      "buy marijuana online",
      "online dispensary",
    ],
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/shop/${slug}`,
      siteName: "WeedLaps.com",
      type: "website",
    },
    alternates: {
      canonical: `${BASE_URL}/shop/${slug}`,
    },
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
        <Link href="/shop" className="text-moss hover:underline">
          Back to Shop
        </Link>
      </div>
    );
  }

  return <ProductDetailClient product={product} />;
}
