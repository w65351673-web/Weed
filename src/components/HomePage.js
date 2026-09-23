"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowRight, FiArrowUpRight, FiStar, FiShield, FiPackage, FiTruck, FiMessageCircle } from "react-icons/fi";
import CannabisIcon from "@/components/CannabisIcon";
import ProductCard from "@/components/ProductCard";
import ProtectedImage from "@/components/ProtectedImage";
import { STRAINS, STRAIN_ORDER, normalizeStrain, startingPrice } from "@/lib/categories";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

const marqueeItems = [
  "Hand-trimmed flower",
  "Independently lab tested",
  "Smell-proof packaging",
  "Craft growers only",
  "Worldwide tracked delivery",
  "Real terpenes, no fillers",
  "Adults 18+",
];

const strains = [
  {
    name: "Indica",
    mood: "Unwind & rest",
    text: "Heavy, body-melting calm. The classic end-of-day strain for couch nights, deep sleep and letting go.",
    tags: ["Relaxing", "Sleepy", "Body high"],
    time: "Evening",
  },
  {
    name: "Sativa",
    mood: "Lift & create",
    text: "Bright, energetic and cerebral. Perfect for daytime adventures, creative sessions and good conversation.",
    tags: ["Uplifting", "Focused", "Social"],
    time: "Daytime",
  },
  {
    name: "Hybrid",
    mood: "Best of both",
    text: "Balanced blends that bring calm and clarity together. Our most-loved strains live right here.",
    tags: ["Balanced", "Euphoric", "Versatile"],
    time: "Anytime",
  },
];

const steps = [
  { title: "Grown with care", text: "Sourced from small craft growers using living soil and slow, patient cures." },
  { title: "Tested in the lab", text: "Every batch is checked for potency, pesticides, moulds and heavy metals." },
  { title: "Sealed for freshness", text: "Vacuum-sealed, smell-proof and packed in plain, unbranded boxes." },
  { title: "At your door", text: "Sent with tracking, discreetly and reliably — wherever you are." },
];

const reviews = [
  {
    name: "Elena K.",
    place: "Berlin",
    text: "Five years of consistent quality. Their flower has become my gold standard — always fresh, sticky and exactly as described.",
  },
  {
    name: "James M.",
    place: "Amsterdam",
    text: "The AAAA craft strains are a game changer. Real flavour, proper cure, and the discreet shipping means zero hassle. Best shop I've used.",
  },
  {
    name: "Yuki T.",
    place: "Lisbon",
    text: "Packaging is phenomenal. After two weeks in transit the buds arrived perfectly cured — still sticky, still loud.",
  },
];

export default function HomePage({ products = [], siteSettings = {} }) {
  const settings = siteSettings || {};
  const featured = products.find((p) => p.image && p.inStock) || products.find((p) => p.inStock) || products[0];

  const counts = useMemo(() => {
    const c = {};
    products.forEach((p) => {
      const key = normalizeStrain(p.strainType || p.name);
      if (key) c[key] = (c[key] || 0) + 1;
    });
    return c;
  }, [products]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "WeedLaps.com",
    url: "https://weedlaps.com",
    description: "Premium small-batch cannabis flower — indica, sativa & hybrid strains.",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden paper-grain">
        <div className="absolute -top-40 -right-40 w-[520px] h-[520px] rounded-full bg-gold-soft/40 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-48 -left-32 w-[480px] h-[480px] rounded-full bg-sage/30 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20 lg:pt-8 lg:pb-28 grid lg:grid-cols-12 gap-14 items-center">
          {/* Copy */}
          <div className="lg:col-span-6">
            <motion.span
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="inline-flex items-center gap-2 rounded-full border border-sand bg-paper px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-moss"
            >
              <CannabisIcon className="w-3.5 h-3.5 text-gold" stem={false} />
              {settings.announcement || "Small-batch · Lab-tested · Since 2019"}
            </motion.span>

            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={1}
              className="mt-6 font-display text-[44px] leading-[1.02] sm:text-6xl lg:text-[80px] text-forest tracking-tight"
            >
              Grown slow.
              <br />
              <em className="text-moss">Enjoyed</em> better.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={2}
              className="mt-6 max-w-xl text-lg leading-relaxed text-bark/80"
            >
              {settings.heroSubtitle ||
                "Hand-trimmed, slow-cured cannabis flower from growers who put the plant first — sealed fresh and shipped discreetly to your door."}
            </motion.p>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={3}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <Link
                href="/shop"
                className="group inline-flex items-center gap-2 rounded-full bg-forest px-7 py-4 text-cream font-semibold hover:bg-moss transition-colors"
              >
                Shop the Harvest
                <FiArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#strains"
                className="inline-flex items-center gap-2 rounded-full border border-forest/25 px-7 py-4 text-forest font-semibold hover:border-forest hover:bg-paper transition-colors"
              >
                Find your strain
              </a>
            </motion.div>

            <motion.dl
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={4}
              className="mt-12 grid grid-cols-3 max-w-md divide-x divide-sand"
            >
              {[
                { v: "20k+", l: "Happy customers" },
                { v: "4.9", l: "Average rating", star: true },
                { v: "140+", l: "Strains on the menu" },
              ].map((s) => (
                <div key={s.l} className="px-4 first:pl-0">
                  <dt className="font-display text-3xl text-forest flex items-center gap-1">
                    {s.v}
                    {s.star && <FiStar className="w-4 h-4 text-gold fill-gold" />}
                  </dt>
                  <dd className="mt-1 text-xs text-bark/60">{s.l}</dd>
                </div>
              ))}
            </motion.dl>
          </div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 relative mx-auto w-full max-w-[520px]"
          >
            <div className="absolute top-6 -left-2 sm:-left-8 w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gold/90" />
            <div className="relative arch forest-grain aspect-[4/5] overflow-hidden shadow-[0_40px_80px_-30px_rgba(21,40,30,0.55)]">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute w-[70%] aspect-square rounded-full border border-gold/25" />
                <div className="absolute w-[88%] aspect-square rounded-full border border-dashed border-gold/15" />
                <ProtectedImage
                  src="/uploads/Chocolate-kush-strain.jpg"
                  alt="Chocolate Kush cannabis flower"
                  className="w-[62%] aspect-square object-cover rounded-full border-4 border-gold-soft/40 animate-sway drop-shadow-[0_20px_30px_rgba(0,0,0,0.35)]"
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-forest-deep/70 to-transparent" />
            </div>

            {/* Floating: strain card */}
            <div className="absolute -left-4 sm:-left-12 bottom-24 animate-float rounded-2xl bg-paper/95 backdrop-blur border border-sand px-4 py-3 shadow-xl">
              <p className="text-[10px] uppercase tracking-[0.2em] text-bark/50">Potency</p>
              <p className="font-display text-xl text-forest">THC 18–28%</p>
              <div className="mt-2 flex gap-1.5">
                {["Indica", "Sativa", "Hybrid"].map((t) => (
                  <span key={t} className="rounded-full bg-sand px-2 py-0.5 text-[10px] text-bark">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Floating: featured product */}
            {featured && (
              <Link
                href={`/shop/${featured.slug}`}
                className="absolute -right-2 sm:-right-8 top-12 animate-float-delayed w-56 rounded-2xl bg-paper/95 backdrop-blur border border-sand p-3 shadow-xl group"
              >
                <p className="text-[10px] uppercase tracking-[0.2em] text-clay">Staff pick</p>
                <p className="mt-0.5 font-display text-lg leading-tight text-forest line-clamp-2">{featured.name}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-display text-xl text-moss">€{startingPrice(featured).toFixed(2)}</span>
                  <span className="w-8 h-8 rounded-full bg-forest text-cream flex items-center justify-center group-hover:bg-moss transition-colors">
                    <FiArrowUpRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            )}

            {/* Floating: seal */}
            <div className="absolute -bottom-6 right-8 w-24 h-24 rounded-full bg-cream border border-sand shadow-lg flex flex-col items-center justify-center text-center">
              <FiShield className="w-5 h-5 text-moss" />
              <span className="mt-1 text-[9px] font-bold uppercase tracking-[0.18em] text-forest leading-tight">
                Lab
                <br />
                Tested
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Marquee ─── */}
      <div className="bg-forest text-gold-soft overflow-hidden border-y border-forest-deep">
        <div className="flex w-max animate-marquee py-4">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="flex items-center gap-6 px-6 font-display text-xl italic whitespace-nowrap">
              {item}
              <CannabisIcon className="w-4 h-4 text-gold" stem={false} />
            </span>
          ))}
        </div>
      </div>

      {/* ─── Strains ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <SectionHeading
          eyebrow="Shop by strain"
          title={
            <>
              Something for every <em className="text-moss">kind of evening</em>
            </>
          }
          text="Indica, sativa or hybrid — every strain is hand-picked, slow-cured and tested before it earns a spot on our shelves."
        />

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-5">
          {STRAIN_ORDER.map((key, i) => {
            const strain = STRAINS[key];
            const count = counts[key] || 0;
            return (
              <motion.div
                key={key}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                custom={i}
              >
                <Link
                  href={`/shop?strain=${key}`}
                  className={`group relative flex h-full flex-col overflow-hidden rounded-[28px] ${strain.tint} p-7 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_50px_-24px_rgba(31,58,43,0.45)]`}
                >
                  <div className="w-16 h-16 blob-shape bg-cream/80 flex items-center justify-center text-moss transition-transform duration-500 group-hover:rotate-12">
                    <CannabisIcon className="w-8 h-8" />
                  </div>
                  <h3 className="mt-10 font-display text-3xl text-forest">{strain.long}</h3>
                  <p className="mt-2 text-sm text-bark/75 leading-relaxed">{strain.tagline}</p>
                  <div className="mt-auto pt-8 flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.2em] text-bark/60">
                      {count > 0 ? `${count} strain${count !== 1 ? "s" : ""}` : "Coming soon"}
                    </span>
                    <span className="w-10 h-10 rounded-full border border-forest/20 flex items-center justify-center text-forest transition-colors group-hover:bg-forest group-hover:text-cream group-hover:border-forest">
                      <FiArrowUpRight className="w-4 h-4" />
                    </span>
                  </div>
                  <CannabisIcon className="absolute -right-6 -bottom-6 w-36 h-36 text-forest/[0.05] transition-transform duration-700 group-hover:scale-110" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ─── Featured products ─── */}
      <FeaturedProducts products={products} />

      {/* ─── Strains ─── */}
      <section id="strains" className="forest-grain text-cream scroll-mt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <SectionHeading
            dark
            eyebrow="Find your strain"
            title={
              <>
                How do you want to <em className="text-gold">feel</em> tonight?
              </>
            }
            text="Not sure where to begin? Start with the mood you're after. Our budtenders are always happy to point you to the perfect match."
          />

          <div className="mt-14 grid md:grid-cols-3 gap-6">
            {strains.map((s, i) => (
              <motion.article
                key={s.name}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                custom={i}
                className="group relative overflow-hidden rounded-[28px] border border-cream/10 bg-cream/[0.03] p-8 hover:bg-cream/[0.06] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-[0.25em] text-gold">{s.time}</span>
                  <span className="font-display text-5xl text-cream/10">0{i + 1}</span>
                </div>
                <h3 className="mt-6 font-display text-4xl text-cream">{s.name}</h3>
                <p className="mt-1 font-display italic text-lg text-gold-soft">{s.mood}</p>
                <p className="mt-4 text-sm leading-relaxed text-cream/65">{s.text}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {s.tags.map((t) => (
                    <span key={t} className="rounded-full border border-gold/30 px-3 py-1 text-xs text-gold-soft">
                      {t}
                    </span>
                  ))}
                </div>
                <CannabisIcon className="absolute -right-10 -bottom-10 w-44 h-44 text-gold/[0.06] transition-transform duration-700 group-hover:rotate-12" />
              </motion.article>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/shop"
              className="group inline-flex items-center gap-2 rounded-full bg-gold px-7 py-4 font-semibold text-forest-deep hover:bg-gold-soft transition-colors"
            >
              Browse all flower
              <FiArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Process ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <SectionHeading
          eyebrow="From seed to doorstep"
          title={
            <>
              Quality you can <em className="text-moss">taste</em>, care you can trust
            </>
          }
        />
        <ol className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-10 relative">
          <div className="hidden lg:block absolute top-7 left-[12%] right-[12%] border-t-2 border-dashed border-sand" />
          {steps.map((s, i) => (
            <motion.li
              key={s.title}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              custom={i}
              className="relative text-center"
            >
              <div className="relative mx-auto w-14 h-14 rounded-full bg-forest text-cream font-display text-xl flex items-center justify-center ring-8 ring-cream">
                {i + 1}
              </div>
              <h3 className="mt-6 font-display text-2xl text-forest">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-bark/70 max-w-[240px] mx-auto">{s.text}</p>
            </motion.li>
          ))}
        </ol>

        <div className="mt-16 grid sm:grid-cols-3 gap-4">
          {[
            { icon: <FiShield className="w-5 h-5" />, t: "Verified lab results", d: "Potency & purity on every batch" },
            { icon: <FiPackage className="w-5 h-5" />, t: "Smell-proof & unbranded", d: "Nobody knows but you" },
            { icon: <FiTruck className="w-5 h-5" />, t: "Tracked worldwide", d: "Discreet delivery to your door" },
          ].map((b) => (
            <div key={b.t} className="flex items-center gap-4 rounded-2xl border border-sand bg-paper px-5 py-4">
              <span className="w-11 h-11 rounded-full bg-sand text-moss flex items-center justify-center shrink-0">{b.icon}</span>
              <div>
                <p className="font-semibold text-forest text-sm">{b.t}</p>
                <p className="text-xs text-bark/60">{b.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Reviews ─── */}
      <section className="bg-sand/50 border-y border-sand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <SectionHeading
            eyebrow="Kind words"
            title={
              <>
                Loved by <em className="text-moss">20,000+</em> happy customers
              </>
            }
          />
          <div className="mt-14 grid md:grid-cols-3 gap-6">
            {reviews.map((r, i) => (
              <motion.figure
                key={r.name}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                custom={i}
                className="relative rounded-[28px] bg-paper border border-sand p-8"
              >
                <span className="absolute top-4 right-7 font-display text-8xl leading-none text-gold/25 select-none">&ldquo;</span>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <FiStar key={s} className="w-4 h-4 text-gold fill-gold" />
                  ))}
                </div>
                <blockquote className="mt-5 font-display text-xl leading-relaxed text-forest">{r.text}</blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-moss text-cream font-display flex items-center justify-center">
                    {r.name.charAt(0)}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-forest">{r.name}</span>
                    <span className="block text-xs text-bark/60">{r.place} · Verified buyer</span>
                  </span>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="relative overflow-hidden rounded-[36px] forest-grain px-8 py-16 sm:px-16 sm:py-20">
          <CannabisIcon className="absolute -right-16 -top-10 w-80 h-80 text-gold/10 animate-sway" />
          <div className="relative max-w-2xl">
            <span className="text-[11px] uppercase tracking-[0.25em] text-gold">Talk to a budtender</span>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl leading-tight text-cream">
              Not sure where to start? <em className="text-gold">We&apos;ll help you choose.</em>
            </h2>
            <p className="mt-5 text-cream/70 leading-relaxed">
              Real people, real cannabis knowledge. Tell us what you&apos;re looking for and we&apos;ll recommend the
              perfect strain, dose or product — usually within two hours.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-gold px-7 py-4 font-semibold text-forest-deep hover:bg-gold-soft transition-colors"
              >
                <FiMessageCircle className="w-4 h-4" />
                Ask our team
              </Link>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 rounded-full border border-cream/25 px-7 py-4 font-semibold text-cream hover:border-cream transition-colors"
              >
                Browse the shop
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function SectionHeading({ eyebrow, title, text, dark = false }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      className="max-w-2xl mx-auto text-center"
    >
      <span className={`inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] ${dark ? "text-gold" : "text-clay"}`}>
        <span className={`h-px w-6 ${dark ? "bg-gold/60" : "bg-clay/60"}`} />
        {eyebrow}
        <span className={`h-px w-6 ${dark ? "bg-gold/60" : "bg-clay/60"}`} />
      </span>
      <h2 className={`mt-4 font-display text-4xl sm:text-5xl leading-tight ${dark ? "text-cream" : "text-forest"}`}>{title}</h2>
      {text && <p className={`mt-5 leading-relaxed ${dark ? "text-cream/65" : "text-bark/70"}`}>{text}</p>}
    </motion.div>
  );
}

function FeaturedProducts({ products }) {
  const available = STRAIN_ORDER.filter((s) =>
    products.some((p) => normalizeStrain(p.strainType || p.name) === s)
  );
  const [tab, setTab] = useState("all");

  const list = products
    .filter((p) => {
      if (tab === "all") return true;
      return normalizeStrain(p.strainType || p.name) === tab;
    })
    .slice(0, 8);

  return (
    <section className="bg-paper border-y border-sand">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          <div>
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-clay">
              <span className="h-px w-6 bg-clay/60" />
              Fresh from the jar
            </span>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl text-forest">
              This week&apos;s <em className="text-moss">harvest</em>
            </h2>
          </div>

          {available.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {["all", ...available].map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`relative rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
                    tab === t ? "text-cream" : "text-forest hover:bg-sand/60"
                  }`}
                >
                  {tab === t && (
                    <motion.span layoutId="home-tab" className="absolute inset-0 rounded-full bg-forest" transition={{ type: "spring", bounce: 0.2, duration: 0.5 }} />
                  )}
                  <span className="relative">{t === "all" ? "Everything" : STRAINS[t].label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {list.length === 0 ? (
          <div className="mt-14 rounded-[28px] border border-dashed border-sand bg-cream px-8 py-20 text-center">
            <div className="mx-auto w-20 h-20 blob-shape bg-sand flex items-center justify-center text-moss">
              <CannabisIcon className="w-10 h-10" />
            </div>
            <h3 className="mt-6 font-display text-3xl text-forest">The new harvest is curing</h3>
            <p className="mt-2 text-bark/70">Fresh products are landing very soon. Check back shortly.</p>
          </div>
        ) : (
          <motion.div layout className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {list.map((product) => (
                <motion.div
                  key={product._id || product.slug}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.4 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        <div className="mt-14 text-center">
          <Link
            href="/shop"
            className="group inline-flex items-center gap-2 rounded-full border border-forest/25 px-7 py-4 font-semibold text-forest hover:bg-forest hover:text-cream hover:border-forest transition-colors"
          >
            View the full menu
            <FiArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
