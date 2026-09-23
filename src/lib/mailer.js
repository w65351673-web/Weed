import nodemailer from "nodemailer";

// Escape user-supplied text before embedding it in HTML emails.
const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

let transporter = null;

// Built lazily so missing env vars produce a clear error instead of a silent failure.
function getTransporter() {
  const user = process.env.GMAIL_USER;
  const pass = (process.env.GMAIL_APP_PASSWORD || "").replace(/\s/g, "");
  if (!user || !pass) {
    throw new Error("Gmail not configured — set GMAIL_USER and GMAIL_APP_PASSWORD in .env");
  }
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user, pass },
    });
  }
  return transporter;
}

const adminEmail = () => process.env.ADMIN_EMAIL || process.env.GMAIL_USER;
const fromAddress = () => `"WeedLaps" <${process.env.GMAIL_USER}>`;

export async function sendContactNotification({ name, email, phone, subject, message }) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; color: #333; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
      <div style="background: #4ade80; padding: 20px 30px;">
        <h1 style="margin: 0; color: #000; font-size: 20px;">📩 New Contact Message</h1>
      </div>
      <div style="padding: 30px;">
        <p style="color: #22c55e; font-size: 14px; font-weight: bold; margin-bottom: 5px;">From</p>
        <p style="color: #333; margin-top: 0;">${esc(name)} (${esc(email)})${phone ? ` — ${esc(phone)}` : ""}</p>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 15px 0;" />

        <p style="color: #22c55e; font-size: 14px; font-weight: bold; margin-bottom: 5px;">Subject</p>
        <p style="color: #333; margin-top: 0;">${esc(subject) || "General Inquiry"}</p>

        <p style="color: #22c55e; font-size: 14px; font-weight: bold; margin-bottom: 5px;">Message</p>
        <p style="color: #333; margin-top: 0; white-space: pre-wrap;">${esc(message)}</p>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 15px 0;" />
        <p style="color: #999; font-size: 12px; text-align: center;">You can reply directly to this email to respond to the customer.</p>
      </div>
    </div>
  `;

  try {
    await getTransporter().sendMail({
      from: fromAddress(),
      to: adminEmail(),
      replyTo: email,
      subject: `Contact: ${subject || "General Inquiry"} — from ${name}`,
      html,
    });
    console.log(`Contact notification sent for ${name}`);
  } catch (err) {
    console.error("Failed to send contact email:", err.message);
    throw err;
  }
}

export async function sendOrderNotification(orderDoc) {
  const order = orderDoc?.toObject ? orderDoc.toObject() : orderDoc;
  const { orderId, productName, size, price, customerName, customerEmail, shippingAddress, message } = order;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; color: #333; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
      <div style="background: #4ade80; padding: 20px 30px;">
        <h1 style="margin: 0; color: #000; font-size: 20px;">🛒 New Order Received!</h1>
      </div>
      <div style="padding: 30px;">
        <p style="color: #22c55e; font-size: 14px; font-weight: bold; margin-bottom: 5px;">Order ID</p>
        <p style="color: #333; margin-top: 0;">${orderId}</p>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 15px 0;" />

        <p style="color: #22c55e; font-size: 14px; font-weight: bold; margin-bottom: 5px;">Product</p>
        <p style="color: #333; margin-top: 0;">${esc(productName)} — ${esc(size)}</p>

        <p style="color: #22c55e; font-size: 14px; font-weight: bold; margin-bottom: 5px;">Price</p>
        <p style="color: #4ade80; margin-top: 0; font-size: 22px; font-weight: bold;">€${typeof price === 'number' ? price.toFixed(2) : price}</p>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 15px 0;" />

        <p style="color: #22c55e; font-size: 14px; font-weight: bold; margin-bottom: 5px;">Customer</p>
        <p style="color: #333; margin-top: 0;">${esc(customerName)}</p>

        <p style="color: #22c55e; font-size: 14px; font-weight: bold; margin-bottom: 5px;">Email</p>
        <p style="color: #333; margin-top: 0;">${esc(customerEmail)}</p>

        <p style="color: #22c55e; font-size: 14px; font-weight: bold; margin-bottom: 5px;">Shipping Address</p>
        <p style="color: #333; margin-top: 0;">${esc(shippingAddress)}</p>

        ${message ? `
        <p style="color: #22c55e; font-size: 14px; font-weight: bold; margin-bottom: 5px;">Customer Message</p>
        <p style="color: #333; margin-top: 0; white-space: pre-wrap;">${esc(message)}</p>
        ` : ''}

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 15px 0;" />
        <p style="color: #999; font-size: 12px; text-align: center;">This is an automated notification from WeedLaps</p>
      </div>
    </div>
  `;

  try {
    await getTransporter().sendMail({
      from: fromAddress(),
      to: adminEmail(),
      replyTo: customerEmail,
      subject: `New Order ${orderId} — ${productName} (€${typeof price === 'number' ? price.toFixed(2) : price})`,
      html,
    });
    console.log(`Order notification sent for ${orderId}`);
  } catch (err) {
    console.error("Failed to send order email:", err.message);
    throw err;
  }
}

// Confirmation email to the customer — includes BTC payment instructions.
export async function sendOrderConfirmation(orderDoc) {
  const order = orderDoc?.toObject ? orderDoc.toObject() : orderDoc;
  const { orderId, productName, size, price, customerName, customerEmail } = order;
  const total = typeof price === "number" ? `€${price.toFixed(2)}` : `€${price}`;
  const wallet = process.env.BTC_WALLET || "";

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; color: #333; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
      <div style="background: #1f3a2b; padding: 20px 30px;">
        <h1 style="margin: 0; color: #f6f1e7; font-size: 20px;">Order confirmed — WeedLaps</h1>
      </div>
      <div style="padding: 30px;">
        <p style="color: #333; margin-top: 0;">Hi ${esc(customerName)}, thanks for your order!</p>

        <p style="color: #3f6b4a; font-size: 14px; font-weight: bold; margin-bottom: 5px;">Order</p>
        <p style="color: #333; margin-top: 0;">${orderId} — ${esc(productName)} (${esc(size)})</p>

        <p style="color: #3f6b4a; font-size: 14px; font-weight: bold; margin-bottom: 5px;">Total</p>
        <p style="color: #1f3a2b; margin-top: 0; font-size: 22px; font-weight: bold;">${total}</p>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 15px 0;" />

        <p style="color: #3f6b4a; font-size: 14px; font-weight: bold; margin-bottom: 5px;">Payment — Bitcoin (BTC) only</p>
        ${wallet
          ? `<p style="color: #333; margin-top: 0;">Send the BTC equivalent of <strong>${total}</strong> to:</p>
             <p style="background: #f6f1e7; border: 1px solid #e9dfcc; border-radius: 8px; padding: 12px; font-family: monospace; font-size: 13px; word-break: break-all;">${esc(wallet)}</p>
             <p style="color: #333;">After sending, reply to this email with your transaction ID so we can confirm and ship your order.</p>`
          : `<p style="color: #333; margin-top: 0;">We will reply shortly with our Bitcoin wallet address and the exact BTC amount for <strong>${total}</strong>.</p>`}

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 15px 0;" />
        <p style="color: #999; font-size: 12px; text-align: center;">Questions? Reply to this email or message us on Telegram @chemsolution12mal</p>
      </div>
    </div>
  `;

  try {
    await getTransporter().sendMail({
      from: fromAddress(),
      to: customerEmail,
      subject: `Your WeedLaps order ${orderId} — payment instructions`,
      html,
    });
    console.log(`Order confirmation sent to ${customerEmail} for ${orderId}`);
  } catch (err) {
    console.error("Failed to send order confirmation:", err.message);
    throw err;
  }
}
