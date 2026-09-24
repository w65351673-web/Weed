"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import CannabisIcon from "@/components/CannabisIcon";
import { CATEGORIES, CategoryIcon, categoryLabel } from "@/lib/categories";
import { FiCheck, FiUser, FiMail, FiPhone, FiMapPin, FiMessageSquare, FiShoppingBag, FiChevronRight, FiLoader, FiArrowLeft, FiPackage, FiShield, FiTruck, FiLock } from "react-icons/fi";
import { FaBitcoin, FaTelegramPlane, FaWhatsapp } from "react-icons/fa";

const inputCls =
  "w-full bg-cream border border-sand text-ink rounded-2xl pl-11 pr-4 py-3.5 text-sm transition-colors placeholder:text-bark/40 focus:outline-none focus:border-moss focus:bg-paper focus:ring-4 focus:ring-moss/10";
const labelCls = "block text-[11px] font-semibold text-bark/70 uppercase tracking-[0.18em] mb-2";
const iconCls = "absolute left-4 top-4 w-4 h-4 text-bark/40";

// WhatsApp business number and Telegram contact (digits only for wa.me)
const WHATSAPP_NUMBER = "19062613088";
const TELEGRAM_URL = "https://t.me/+19102279379";

export default function OrderPage() {
  const { slug } = useParams();
  const searchParams = useSearchParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(0);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", message: "" });
  const [method, setMethod] = useState("form");

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        const found = data.products?.find((p) => p.slug === slug);
        setProduct(found || null);
        // If size was passed via query param
        const sizeParam = searchParams.get("size");
        if (sizeParam && found?.sizes?.length) {
          const idx = found.sizes.findIndex((s) => s.label === sizeParam);
          if (idx >= 0) setSelectedSize(idx);
        }
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [slug, searchParams]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <CannabisIcon className="w-12 h-12 text-moss animate-sway mx-auto mb-4" />
        <p className="font-display text-xl text-forest">Preparing your order&hellip;</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <div className="mx-auto w-20 h-20 blob-shape bg-sand flex items-center justify-center text-moss">
          <CannabisIcon className="w-10 h-10" />
        </div>
        <h1 className="mt-6 font-display text-4xl text-forest">We couldn&apos;t find that one</h1>
        <p className="mt-2 text-bark/70">It may have sold out or moved. Take a look at the rest of the menu.</p>
        <Link
          href="/shop"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-forest px-7 py-3.5 font-semibold text-cream hover:bg-moss transition-colors"
        >
          Back to the shop
        </Link>
      </div>
    );
  }

  const handleOrder = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.slug,
          productName: product.name,
          size: product.sizes?.[selectedSize]?.label || "Standard",
          price: product.sizes?.[selectedSize]?.price || product.price || 0,
          customerName: form.name,
          customerEmail: form.email,
          customerPhone: form.phone,
          shippingAddress: form.address,
          message: form.message,
        }),
      });
      if (res.ok) {
        setOrderPlaced(true);
        toast.success("Order placed successfully!");
      } else {
        toast.error("Failed to place order. Try again.");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const currentPrice = product.sizes?.[selectedSize]?.price || product.price || 0;

  const orderText = `Hi! I'd like to order:\n\n${product.name} — ${product.sizes?.[selectedSize]?.label || "Standard"}\nTotal: €${currentPrice.toFixed(2)}\n\nName:\nDelivery address:`;

  const chatChannel =
    method === "whatsapp"
      ? { name: "WhatsApp", Icon: FaWhatsapp, href: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(orderText)}` }
      : { name: "Telegram", Icon: FaTelegramPlane, href: TELEGRAM_URL };

  const copyOrder = async () => {
    try {
      await navigator.clipboard.writeText(orderText);
      toast.success(`Order details copied — paste them in ${chatChannel.name}`);
    } catch {
      toast.error("Couldn't copy — please type your order manually");
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-[70vh] paper-grain flex items-center justify-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full text-center"
        >
          <div className="relative overflow-hidden bg-paper border border-sand rounded-[36px] p-10 md:p-12 shadow-[0_30px_60px_-30px_rgba(31,58,43,0.35)]">
            <CannabisIcon className="absolute -right-10 -top-10 w-40 h-40 text-moss/[0.06]" />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.15 }}
              className="w-20 h-20 bg-forest text-gold-soft rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <FiCheck className="w-10 h-10" />
            </motion.div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-clay">Order received</p>
            <h1 className="mt-2 font-display text-4xl text-forest">Thank you, {form.name.split(" ")[0]}!</h1>
            <p className="mt-4 text-bark/75 leading-relaxed">
              Your order for{" "}
              <span className="font-semibold text-forest">
                {product.name} — {product.sizes?.[selectedSize]?.label || "Standard"}
              </span>{" "}
              is in. We'll email{" "}
              <span className="font-semibold text-forest">{form.email}</span>{" "}
              our Bitcoin wallet address and the exact BTC amount to complete your order.
            </p>
            <Link
              href="/shop"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-forest px-8 py-3.5 font-semibold text-cream hover:bg-moss transition-colors"
            >
              <FiShoppingBag className="w-4 h-4" />
              Keep browsing
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const tint = CATEGORIES[product.category]?.tint || "bg-sand";

  return (
    <div className="min-h-screen paper-grain">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-bark/60 overflow-hidden">
          <Link href="/" className="hover:text-forest transition-colors shrink-0">Home</Link>
          <FiChevronRight className="w-3 h-3 shrink-0" />
          <Link href="/shop" className="hover:text-forest transition-colors shrink-0">Shop</Link>
          <FiChevronRight className="w-3 h-3 shrink-0" />
          <Link href={`/shop/${product.slug}`} className="hover:text-forest transition-colors truncate max-w-[160px]">{product.name}</Link>
          <FiChevronRight className="w-3 h-3 shrink-0" />
          <span className="text-clay shrink-0">Checkout</span>
        </nav>

        <div className="mt-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <h1 className="font-display text-4xl md:text-5xl text-forest">
            Almost <em className="text-moss">yours</em>
          </h1>
          <Link
            href={`/shop/${product.slug}`}
            className="inline-flex items-center gap-1.5 text-sm text-bark/70 hover:text-forest transition-colors"
          >
            <FiArrowLeft className="w-3.5 h-3.5" />
            Back to product
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          {/* Form */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div className="rounded-[32px] bg-paper border border-sand p-6 md:p-10">
              <p className={labelCls}>How would you like to order?</p>
              <div className="mt-3 grid grid-cols-3 gap-2.5">
                {[
                  { id: "form", icon: FiMail, title: "Order form", desc: "We email payment info" },
                  { id: "telegram", icon: FaTelegramPlane, title: "Telegram", desc: "Fastest response" },
                  { id: "whatsapp", icon: FaWhatsapp, title: "WhatsApp", desc: "Chat & order" },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMethod(m.id)}
                    className={`rounded-2xl border px-4 py-3.5 text-left transition-all ${
                      method === m.id ? "border-forest bg-forest text-cream" : "border-sand bg-cream text-forest hover:border-forest/40"
                    }`}
                  >
                    <m.icon className={`w-4 h-4 ${method === m.id ? "text-gold-soft" : "text-moss"}`} />
                    <span className="mt-1.5 block font-semibold text-sm">{m.title}</span>
                    <span className={`block text-[11px] mt-0.5 ${method === m.id ? "text-cream/70" : "text-bark/60"}`}>{m.desc}</span>
                  </button>
                ))}
              </div>

              {method !== "form" ? (
                <div className="mt-8 space-y-5">
                  <div className="rounded-2xl border border-sand bg-cream p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-bark/60">Your order</p>
                    <p className="mt-2 font-display text-xl text-forest">
                      {product.name} — {product.sizes?.[selectedSize]?.label || "Standard"}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-moss">€{currentPrice.toFixed(2)} · Bitcoin (BTC) only</p>
                  </div>
                  <p className="text-sm text-bark/70 leading-relaxed">
                    Send us a message on {chatChannel.name} with this product, your chosen amount and your delivery address — we'll confirm your order and send the Bitcoin payment details right away.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={copyOrder}
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-forest/30 bg-cream px-6 py-3.5 font-semibold text-forest hover:border-forest transition-colors"
                    >
                      <FiPackage className="w-4 h-4" />
                      Copy order details
                    </button>
                    <a
                      href={chatChannel.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-forest px-6 py-3.5 font-semibold text-cream hover:bg-moss transition-colors"
                    >
                      <chatChannel.Icon className="w-4 h-4" />
                      Open {chatChannel.name}
                    </a>
                  </div>
                </div>
              ) : (
              <form onSubmit={handleOrder} className="mt-8">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-full bg-forest text-cream font-display flex items-center justify-center">1</span>
                <h2 className="font-display text-2xl text-forest">Your details</h2>
              </div>
              <p className="mt-2 text-sm text-bark/65 pl-12">We only use these to ship your order and send payment instructions.</p>

              <div className="mt-8 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelCls}>Full name</label>
                    <div className="relative">
                      <FiUser className={iconCls} />
                      <input
                        type="text"
                        placeholder="Jane Doe"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className={inputCls}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Email address</label>
                    <div className="relative">
                      <FiMail className={iconCls} />
                      <input
                        type="email"
                        placeholder="jane@example.com"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className={inputCls}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Phone / WhatsApp number</label>
                  <div className="relative">
                    <FiPhone className={iconCls} />
                    <input
                      type="tel"
                      placeholder="+49 170 1234567"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className={inputCls}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Shipping address</label>
                  <div className="relative">
                    <FiMapPin className={iconCls} />
                    <input
                      type="text"
                      placeholder="123 Main St, Berlin, Germany"
                      required
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      className={inputCls}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>
                    Note <span className="normal-case tracking-normal font-normal text-bark/45">(optional)</span>
                  </label>
                  <div className="relative">
                    <FiMessageSquare className={iconCls} />
                    <textarea
                      placeholder="Any special requests or questions..."
                      rows={3}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className={`${inputCls} resize-none`}
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="mt-8 w-full flex items-center justify-center gap-2 rounded-full bg-forest hover:bg-moss disabled:opacity-60 text-cream font-semibold py-4 text-base transition-colors"
              >
                {submitting ? <FiLoader className="w-5 h-5 animate-spin" /> : <FiLock className="w-4 h-4" />}
                {submitting ? "Placing order..." : `Place order — €${currentPrice.toFixed(2)}`}
              </button>
              <div className="mt-5 flex items-start gap-3 rounded-2xl border border-gold/40 bg-gold-soft/20 px-4 py-3.5 text-left">
                <FaBitcoin className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <p className="text-xs leading-relaxed text-bark/80">
                  <span className="font-semibold text-forest">Bitcoin (BTC) only.</span>{" "}
                  We accept Bitcoin as our sole payment method. After you place your order, we'll email you the wallet address and exact BTC amount.
                </p>
              </div>
              </form>
              )}
            </div>
          </div>

          {/* Summary */}
          <aside className="lg:col-span-5 order-1 lg:order-2">
            <div className="lg:sticky lg:top-36 space-y-5">
              <div className="rounded-[32px] bg-paper border border-sand p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-bark/60">Order summary</p>

                <div className="mt-4 flex items-center gap-4">
                  <div className={`w-20 h-20 rounded-2xl ${tint} flex items-center justify-center shrink-0 overflow-hidden text-moss`}>
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <CategoryIcon category={product.category} className="w-9 h-9" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-clay">{categoryLabel(product.category)}</p>
                    <p className="font-display text-xl leading-tight text-forest">{product.name}</p>
                  </div>
                </div>

                {product.sizes?.length > 0 && (
                  <div className="mt-6">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-bark/60 mb-3">Amount</p>
                    <div className="grid grid-cols-2 gap-2.5">
                      {product.sizes.map((size, i) => {
                        const active = selectedSize === i;
                        return (
                          <button
                            key={size.label}
                            type="button"
                            onClick={() => setSelectedSize(i)}
                            className={`rounded-2xl border px-3 py-2.5 text-left text-sm transition-all ${
                              active ? "border-forest bg-forest text-cream" : "border-sand bg-cream text-forest hover:border-forest/40"
                            }`}
                          >
                            <span className="block font-semibold">{size.label}</span>
                            <span className={`block ${active ? "text-gold-soft" : "text-moss"}`}>€{size.price.toFixed(2)}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <dl className="mt-6 space-y-2.5 border-t border-dashed border-sand pt-5 text-sm">
                  <div className="flex justify-between text-bark/75">
                    <dt>Amount</dt>
                    <dd>{product.sizes?.[selectedSize]?.label || "Standard"}</dd>
                  </div>
                  <div className="flex justify-between text-bark/75">
                    <dt>Shipping</dt>
                    <dd>Discreet &amp; tracked</dd>
                  </div>
                  <div className="flex justify-between items-end pt-3 border-t border-sand">
                    <dt className="font-semibold text-forest">Total</dt>
                    <dd className="font-display text-3xl text-forest">€{currentPrice.toFixed(2)}</dd>
                  </div>
                </dl>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: FiShield, label: "Secure order" },
                  { icon: FiTruck, label: "Discreet shipping" },
                  { icon: FiPackage, label: "Lab-tested" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="rounded-2xl bg-paper border border-sand p-3 flex flex-col items-center gap-1.5 text-center">
                    <Icon className="w-4 h-4 text-moss" />
                    <span className="text-[11px] font-medium text-bark">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </motion.div>
      </div>
    </div>
  );
}
