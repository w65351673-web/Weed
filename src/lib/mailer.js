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

// Shared branded shell for all outgoing mail (table-safe inline styles).
const emailShell = (title, subtitle, bodyHtml) => `
  <div style="font-family: Arial, Helvetica, sans-serif; background: #f6f1e7; padding: 32px 16px;">
    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e9dfcc;">
      <div style="background: #1f3a2b; padding: 26px 32px;">
        <p style="margin: 0; color: #c9a24b; font-size: 11px; letter-spacing: 3px; text-transform: uppercase;">WeedLaps</p>
        <h1 style="margin: 6px 0 0; color: #f6f1e7; font-size: 22px; font-weight: bold;">${title}</h1>
        ${subtitle ? `<p style="margin: 6px 0 0; color: rgba(246,241,231,0.7); font-size: 13px;">${subtitle}</p>` : ""}
      </div>
      <div style="padding: 26px 32px;">
        ${bodyHtml}
      </div>
      <div style="background: #f6f1e7; border-top: 1px solid #e9dfcc; padding: 14px 32px;">
        <p style="margin: 0; color: #8a7a5c; font-size: 11px; text-align: center;">weedlaps.com — premium cannabis flower</p>
      </div>
    </div>
  </div>
`;

// Labelled field row used inside the shell.
const field = (label, value) => `
  <p style="color: #3f6b4a; font-size: 11px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; margin: 18px 0 4px;">${label}</p>
  <p style="color: #2b2b26; font-size: 15px; margin: 0;">${value}</p>
`;

export async function sendContactNotification({ name, email, phone, subject, message }) {
  const html = emailShell(
    "New contact message",
    `Sent via the contact form`,
    `
    ${field("From", `${esc(name)} &lt;${esc(email)}&gt;`)}
    ${phone ? field("Phone", esc(phone)) : ""}
    ${field("Subject", esc(subject) || "General Inquiry")}
    ${field("Message", `<span style="white-space: pre-wrap;">${esc(message)}</span>`)}
    <div style="margin-top: 24px; padding: 14px 18px; background: #f6f1e7; border-left: 3px solid #c9a24b; border-radius: 8px;">
      <p style="margin: 0; color: #6b5d43; font-size: 12px;">Reply directly to this email to respond to ${esc(name)}.</p>
    </div>
    `
  );

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
  const { orderId, productName, size, price, customerName, customerEmail, customerPhone, shippingAddress, message } = order;
  const total = typeof price === "number" ? `€${price.toFixed(2)}` : `€${price}`;

  const html = emailShell(
    "New order received",
    `${orderId}`,
    `
    <div style="background: #f6f1e7; border: 1px solid #e9dfcc; border-radius: 12px; padding: 16px 20px;">
      <p style="color: #3f6b4a; font-size: 11px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; margin: 0 0 4px;">Product</p>
      <p style="color: #2b2b26; font-size: 15px; margin: 0;">${esc(productName)} — ${esc(size)}</p>
      <p style="color: #1f3a2b; font-size: 26px; font-weight: bold; margin: 10px 0 0;">${total}</p>
    </div>
    ${field("Customer", esc(customerName))}
    ${field("Email", esc(customerEmail))}
    ${customerPhone ? field("Phone / WhatsApp", esc(customerPhone)) : ""}
    ${field("Shipping address", esc(shippingAddress))}
    ${message ? field("Customer note", `<span style="white-space: pre-wrap;">${esc(message)}</span>`) : ""}
    <div style="margin-top: 24px; padding: 14px 18px; background: #f6f1e7; border-left: 3px solid #c9a24b; border-radius: 8px;">
      <p style="margin: 0; color: #6b5d43; font-size: 12px;">Reply directly to this email to reach the customer. Payment is Bitcoin (BTC) only.</p>
    </div>
    `
  );

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

  const html = emailShell(
    "Order confirmed",
    `${orderId} — thank you for your order`,
    `
    <p style="color: #2b2b26; font-size: 15px; margin: 0;">Hi ${esc(customerName)},</p>
    <p style="color: #55504a; font-size: 14px; line-height: 1.6; margin: 10px 0 0;">Thanks for your order! Here is your summary — payment is by Bitcoin (BTC) only.</p>

    <div style="background: #f6f1e7; border: 1px solid #e9dfcc; border-radius: 12px; padding: 16px 20px; margin-top: 18px;">
      <p style="color: #3f6b4a; font-size: 11px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; margin: 0 0 4px;">Your order</p>
      <p style="color: #2b2b26; font-size: 15px; margin: 0;">${esc(productName)} — ${esc(size)}</p>
      <p style="color: #1f3a2b; font-size: 26px; font-weight: bold; margin: 10px 0 0;">${total}</p>
    </div>

    <div style="margin-top: 20px; padding: 16px 18px; border: 1px solid #c9a24b; border-radius: 12px; background: #fffdf7;">
      <p style="color: #1f3a2b; font-size: 13px; font-weight: bold; margin: 0 0 8px;">Payment — Bitcoin (BTC) only</p>
      ${wallet
        ? `<p style="color: #55504a; font-size: 13px; margin: 0 0 10px;">Send the BTC equivalent of <strong>${total}</strong> to:</p>
           <p style="background: #f6f1e7; border: 1px solid #e9dfcc; border-radius: 8px; padding: 12px; font-family: monospace; font-size: 13px; word-break: break-all; margin: 0 0 10px;">${esc(wallet)}</p>
           <p style="color: #55504a; font-size: 13px; margin: 0;">After sending, reply to this email with your transaction ID so we can confirm and ship your order.</p>`
        : `<p style="color: #55504a; font-size: 13px; margin: 0;">We will reply shortly with our Bitcoin wallet address and the exact BTC amount for <strong>${total}</strong>.</p>`}
    </div>

    <p style="color: #55504a; font-size: 13px; margin: 22px 0 0;">Questions? Reply to this email or message us on Telegram <strong>+1 (910) 227-9379</strong>.</p>
    `
  );

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
