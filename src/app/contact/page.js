"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { FiMail, FiPhone, FiTruck, FiClock, FiUser, FiSend, FiMessageSquare, FiLoader, FiCheckCircle, FiMapPin, FiArrowRight, FiHeadphones, FiPaperclip, FiCalendar, FiGlobe } from "react-icons/fi";
import { BsShieldCheck, BsLightningCharge } from "react-icons/bs";
import { FaTelegramPlane, FaWhatsapp } from "react-icons/fa";
import CannabisIcon from "@/components/CannabisIcon";

export default function ContactPage() {
  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    phone: "",
    subject: "", 
    message: ""
  });
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [siteSettings, setSiteSettings] = useState({});
  const [focusedField, setFocusedField] = useState(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => setSiteSettings(data.settings || {}))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSent(true);
        setForm({ 
          name: "", 
          email: "", 
          phone: "",
          subject: "", 
          message: ""
        });
        toast.success("Message sent successfully!");
      } else {
        toast.error("Failed to send message.");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const contactCards = [
    {
      icon: <FiMail className="w-5 h-5" />,
      label: "Email us",
      value: siteSettings.contactEmail || "orders@weedlaps.com",
      desc: "Replies within 2 hours",
      href: `mailto:${siteSettings.contactEmail || "orders@weedlaps.com"}`,
    },
    {
      icon: <FaTelegramPlane className="w-5 h-5" />,
      label: "Telegram",
      value: "@chemsolution12mal",
      desc: "Fastest way to reach us",
      href: "https://t.me/chemsolution12mal",
    },
    {
      icon: <FaWhatsapp className="w-5 h-5" />,
      label: "WhatsApp",
      value: siteSettings.contactPhone || "+1 (555) 902-4481",
      desc: "Chat with us directly",
      href: "https://wa.me/15559024481",
    },
  ];

  const faqs = [
    { q: "How long does shipping take?", a: "Every order is packed promptly and sent with tracking. Delivery times depend on your destination — you'll get a tracking number as soon as it ships." },
    { q: "Do you offer bulk pricing?", a: "Yes! Contact us with your requirements and we'll provide a custom quote for large orders." },
    { q: "Is shipping discreet?", a: "Absolutely. All packages are shipped in plain, unmarked packaging with no product references." },
    { q: "What payment methods do you accept?", a: "We accept Bitcoin (BTC) only. After you place an order we email you our wallet address and the exact amount to send." },
  ];

  const inputCls =
    "w-full bg-cream border border-sand text-ink rounded-2xl pl-11 pr-4 py-3.5 text-sm transition-colors placeholder:text-bark/40 focus:outline-none focus:border-moss focus:bg-paper focus:ring-4 focus:ring-moss/10";
  const labelCls = "block text-[11px] font-semibold text-bark/70 uppercase tracking-[0.18em] mb-2";
  const iconCls = (field) =>
    `absolute left-4 top-4 w-4 h-4 transition-colors ${focusedField === field ? "text-moss" : "text-bark/40"}`;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden paper-grain border-b border-sand">
        <div className="absolute -top-32 -right-24 w-96 h-96 rounded-full bg-gold-soft/40 blur-3xl pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 grid lg:grid-cols-12 gap-10 items-end">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7"
          >
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-clay">
              <span className="h-px w-6 bg-clay/60" />
              Say hello
            </span>
            <h1 className="mt-4 font-display text-5xl md:text-6xl leading-[1.05] text-forest">
              Real people,
              <br />
              <em className="text-moss">real answers.</em>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-bark/75 leading-relaxed">
              Questions about a strain, dosing, shipping or a bulk order? Our budtenders are here to help — no bots, no
              scripts.
            </p>
          </motion.div>

          <div className="lg:col-span-5 grid sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {contactCards.map((card, i) => (
              <motion.a
                key={card.label}
                href={card.href}
                target={card.href?.startsWith("http") ? "_blank" : undefined}
                rel={card.href?.startsWith("http") ? "noopener noreferrer" : undefined}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
                className="group flex items-center gap-4 rounded-[24px] bg-paper border border-sand p-5 hover:border-gold/60 hover:shadow-[0_20px_40px_-24px_rgba(31,58,43,0.45)] transition-all"
              >
                <span className="w-12 h-12 rounded-full bg-forest text-gold-soft flex items-center justify-center shrink-0 group-hover:bg-moss transition-colors">
                  {card.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[11px] uppercase tracking-[0.2em] text-bark/55">{card.label}</span>
                  <span className="block font-display text-lg text-forest truncate">{card.value}</span>
                  <span className="block text-xs text-bark/60">{card.desc}</span>
                </span>
                <FiArrowRight className="w-4 h-4 text-gold transition-transform group-hover:translate-x-1" />
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Form + side */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="relative overflow-hidden rounded-[32px] bg-paper border border-sand p-12 text-center"
                >
                  <CannabisIcon className="absolute -right-10 -top-10 w-40 h-40 text-moss/[0.06]" />
                  <div className="w-20 h-20 bg-forest text-gold-soft rounded-full flex items-center justify-center mx-auto mb-6">
                    <FiCheckCircle className="w-10 h-10" />
                  </div>
                  <h3 className="font-display text-4xl text-forest">Message sent!</h3>
                  <p className="mt-3 text-bark/75 max-w-sm mx-auto">
                    Thanks for reaching out. Our team will get back to you as soon as possible.
                  </p>
                  <button
                    onClick={() => setSent(false)}
                    className="mt-8 inline-flex items-center gap-2 rounded-full bg-forest px-7 py-3.5 font-semibold text-cream hover:bg-moss transition-colors"
                  >
                    Send another message
                    <FiArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  onSubmit={handleSubmit}
                  className="rounded-[32px] bg-paper border border-sand p-6 md:p-10"
                >
                  <h2 className="font-display text-3xl text-forest">Send us a note</h2>
                  <p className="mt-1 text-sm text-bark/65">We&apos;ll respond as soon as possible.</p>

                  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className={labelCls}>Full name *</label>
                      <div className="relative">
                        <FiUser className={iconCls("name")} />
                        <input
                          type="text"
                          placeholder="Your full name"
                          required
                          value={form.name}
                          onFocus={() => setFocusedField("name")}
                          onBlur={() => setFocusedField(null)}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className={inputCls}
                        />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Email address *</label>
                      <div className="relative">
                        <FiMail className={iconCls("email")} />
                        <input
                          type="email"
                          placeholder="your@email.com"
                          required
                          value={form.email}
                          onFocus={() => setFocusedField("email")}
                          onBlur={() => setFocusedField(null)}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className={inputCls}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className={labelCls}>Phone</label>
                      <div className="relative">
                        <FiPhone className={iconCls("phone")} />
                        <input
                          type="tel"
                          placeholder="+1 (555) 123-4567"
                          value={form.phone}
                          onFocus={() => setFocusedField("phone")}
                          onBlur={() => setFocusedField(null)}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          className={inputCls}
                        />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Subject *</label>
                      <div className="relative">
                        <FiMessageSquare className={iconCls("subject")} />
                        <input
                          type="text"
                          placeholder="How can we help?"
                          required
                          value={form.subject}
                          onFocus={() => setFocusedField("subject")}
                          onBlur={() => setFocusedField(null)}
                          onChange={(e) => setForm({ ...form, subject: e.target.value })}
                          className={inputCls}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-5">
                    <label className={labelCls}>Message *</label>
                    <div className="relative">
                      <FiSend className={iconCls("message")} />
                      <textarea
                        placeholder="Tell us a little about what you're looking for..."
                        required
                        rows={6}
                        maxLength={1000}
                        value={form.message}
                        onFocus={() => setFocusedField("message")}
                        onBlur={() => setFocusedField(null)}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className={`${inputCls} resize-none pb-8`}
                      />
                      <div className="absolute bottom-3 right-4 text-[11px] text-bark/45">{form.message.length}/1000</div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="mt-8 w-full flex items-center justify-center gap-2.5 rounded-full bg-forest hover:bg-moss disabled:opacity-50 text-cream font-semibold py-4 text-base transition-colors"
                  >
                    {submitting ? <FiLoader className="w-5 h-5 animate-spin" /> : <FiSend className="w-4 h-4" />}
                    {submitting ? "Sending..." : "Send message"}
                  </button>

                  <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] text-bark/60">
                    <span className="flex items-center gap-1.5"><BsShieldCheck className="w-3.5 h-3.5 text-moss" />Private &amp; secure</span>
                    <span className="flex items-center gap-1.5"><BsLightningCharge className="w-3.5 h-3.5 text-moss" />Quick response</span>
                    <span className="flex items-center gap-1.5"><FiHeadphones className="w-3.5 h-3.5 text-moss" />Real humans</span>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Side */}
          <div className="lg:col-span-5 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="rounded-[32px] bg-paper border border-sand p-6 md:p-8"
            >
              <h3 className="font-display text-2xl text-forest">Common questions</h3>
              <div className="mt-4 divide-y divide-sand">
                {faqs.map((item, i) => (
                  <details key={item.q} className="group py-4" open={i === 0}>
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-forest text-sm">
                      {item.q}
                      <span className="w-7 h-7 rounded-full border border-sand flex items-center justify-center shrink-0 text-moss transition-transform group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="mt-2 text-sm text-bark/70 leading-relaxed">{item.a}</p>
                  </details>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="relative overflow-hidden rounded-[32px] forest-grain p-8 text-center text-cream"
            >
              <CannabisIcon className="absolute -right-8 -bottom-8 w-36 h-36 text-gold/10" />
              <div className="w-12 h-12 rounded-full border border-gold/40 text-gold flex items-center justify-center mx-auto">
                <FiClock className="w-5 h-5" />
              </div>
              <p className="mt-4 text-[11px] uppercase tracking-[0.25em] text-gold">Average reply</p>
              <p className="mt-1 font-display text-5xl text-cream">&lt; 2 hrs</p>
              <p className="mt-2 text-xs text-cream/60">during business hours</p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}


