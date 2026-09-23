import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { sendOrderNotification, sendOrderConfirmation } from "@/lib/mailer";

// POST — place a new order (public)
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { productId, productName, size, price, customerName, customerEmail, shippingAddress, message } = body;

    if (!productId || !customerName || !customerEmail || !shippingAddress) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const order = await Order.create({
      orderId: `ORD-${Date.now()}`,
      productId,
      productName,
      size,
      price,
      customerName,
      customerEmail,
      shippingAddress,
      message: message || "",
      status: "pending",
    });

    // Send email notifications (non-blocking): admin alert + customer confirmation
    sendOrderNotification(order).catch((err) => {
      console.error("[ORDER EMAIL ERROR]", err.message);
    });
    sendOrderConfirmation(order).catch((err) => {
      console.error("[ORDER CONFIRMATION EMAIL ERROR]", err.message);
    });

    return NextResponse.json({ success: true, orderId: order.orderId }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

// GET — list all orders (admin only)
export async function GET(request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  const user = verifyToken(token);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const orders = await Order.find({}).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ orders });
}
