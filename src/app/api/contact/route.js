import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Message from "@/models/Message";
import { sendContactNotification } from "@/lib/mailer";

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await Message.create({
      name,
      email,
      subject: subject || "General Inquiry",
      message,
    });

    // Send email notification (non-blocking)
    sendContactNotification({ name, email, phone, subject, message }).catch((err) => {
      console.error("[CONTACT EMAIL ERROR]", err.message);
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

// GET — admin can retrieve messages
export async function GET() {
  await dbConnect();
  const messages = await Message.find({}).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ messages });
}
