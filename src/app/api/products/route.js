import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

// GET — list all products (public)
export async function GET() {
  await dbConnect();
  const products = await Product.find({}).lean();
  return NextResponse.json({ products });
}

// POST — create a product (admin only)
export async function POST(request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  const user = verifyToken(token);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const body = await request.json();

  let slug = body.name
    ?.toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  // Ensure unique slug
  const existing = await Product.findOne({ slug });
  if (existing) {
    slug = `${slug}-${Date.now().toString(36)}`;
  }

  const product = await Product.create({
    slug,
    name: body.name,
    price: parseFloat(body.price) || 0,
    category: "powder",
    strainType: body.strainType || "",
    grade: body.grade || "",
    shortDescription: body.shortDescription || "",
    description: body.description || "",
    specifications: body.specifications || [],
    sizes: body.sizes || [],
    inStock: body.inStock ?? true,
    image: body.image || "",
  });

  return NextResponse.json({ success: true, product }, { status: 201 });
}

// PATCH — update a product (admin only)
export async function PATCH(request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  const user = verifyToken(token);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const body = await request.json();

  const updateFields = {};
  if (body.name !== undefined) updateFields.name = body.name;
  if (body.price !== undefined) updateFields.price = body.price;
  if (body.shortDescription !== undefined) updateFields.shortDescription = body.shortDescription;
  if (body.description !== undefined) updateFields.description = body.description;
  if (body.inStock !== undefined) updateFields.inStock = body.inStock;
  if (body.sizes !== undefined) updateFields.sizes = body.sizes;
  if (body.category !== undefined) updateFields.category = body.category;
  if (body.strainType !== undefined) updateFields.strainType = body.strainType;
  if (body.grade !== undefined) updateFields.grade = body.grade;
  if (body.specifications !== undefined) updateFields.specifications = body.specifications;
  if (body.image !== undefined) updateFields.image = body.image;

  const product = await Product.findOneAndUpdate(
    { slug: body.id },
    updateFields,
    { new: true }
  ).lean();

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, product });
}

// DELETE — delete a product (admin only)
export async function DELETE(request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  const user = verifyToken(token);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  const result = await Product.findOneAndDelete({ slug });
  if (!result) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
