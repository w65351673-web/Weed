"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiChevronRight, FiArrowRight, FiStar, FiShield, FiPackage, FiTruck, FiCheck } from "react-icons/fi";
import ProtectedImage from "@/components/ProtectedImage";
import { STRAINS, CategoryIcon, normalizeStrain, strainLabel } from "@/lib/categories";

export default function ProductDetailClient({ product }) {
  const [selectedSize, setSelectedSize] = useState(0);

  const currentPrice = product.sizes?.[selectedSize]?.price || product.price || 0;
  const currentLabel = product.sizes?.[selectedSize]?.label || "";
  const strain = normalizeStrain(product.strainType || product.name);
  const tint = STRAINS[strain]?.tint || "bg-sand";
  const strainName = strainLabel(product.strainType || product.name) || "Flower";

  return (
    <div className="paper-grain">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-bark/60 mb-10 overflow-hidden">
          <Link href="/" className="hover:text-forest transition-colors shrink-0">Home</Link>
          <FiChevronRight className="w-3 h-3 shrink-0" />
          <Link href="/shop" className="hover:text-forest transition-colors shrink-0">Shop</Link>
          <FiChevronRight className="w-3 h-3 shrink-0" />
          <Link
            href={strain ? `/shop?strain=${strain}` : "/shop"}
            className="hover:text-forest transition-colors shrink-0"
          >
            {strainName}
          </Link>
          <FiChevronRight className="w-3 h-3 shrink-0" />
          <span className="text-clay truncate">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6"
          >
            <div className="lg:sticky lg:top-36">
              <div className={`relative overflow-hidden rounded-[36px] ${tint} aspect-square border border-sand image-container no-context-menu`}>
                {product.image ? (
                  <ProtectedImage src={product.image} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-56 h-56 blob-shape bg-cream/70 flex items-center justify-center text-moss">
                      <CategoryIcon className="w-24 h-24" />
                    </div>
                  </div>
                )}
                <span
                  className={`absolute top-5 left-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] ${
                    product.inStock ? "bg-cream/90 text-moss" : "bg-clay text-cream"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${product.inStock ? "bg-moss animate-pulse" : "bg-cream"}`} />
                  {product.inStock ? "In stock" : "Sold out"}
                </span>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                {[
                  { icon: <FiShield className="w-4 h-4" />, t: "Lab tested" },
                  { icon: <FiPackage className="w-4 h-4" />, t: "Smell-proof" },
                  { icon: <FiTruck className="w-4 h-4" />, t: "Tracked delivery" },
                ].map((b) => (
                  <div key={b.t} className="flex flex-col items-center gap-1.5 rounded-2xl bg-paper border border-sand py-3 text-center">
                    <span className="text-moss">{b.icon}</span>
                    <span className="text-[11px] font-medium text-bark">{b.t}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6"
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-sand bg-paper px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-moss">
                <CategoryIcon className="w-3.5 h-3.5" />
                {strainName}
              </span>
              <span className="inline-flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <FiStar key={s} className="w-4 h-4 text-gold fill-gold" />
                ))}
                <span className="ml-1 text-xs text-bark/60">5.0 · 128 reviews</span>
              </span>
            </div>

            <h1 className="mt-5 font-display text-4xl md:text-5xl lg:text-6xl leading-[1.05] text-forest">{product.name}</h1>

            {product.shortDescription && (
              <p className="mt-4 font-display italic text-xl text-moss">{product.shortDescription}</p>
            )}

            <div className="mt-8 flex items-end gap-3">
              <span className="font-display text-5xl text-forest">€{currentPrice.toFixed(2)}</span>
              {currentLabel && <span className="pb-2 text-sm text-bark/60">/ {currentLabel}</span>}
            </div>

            {/* Sizes */}
            {product.sizes?.length > 0 && (
              <div className="mt-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-bark/60 mb-3">Choose your amount</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {product.sizes.map((size, i) => {
                    const active = selectedSize === i;
                    return (
                      <button
                        key={size.label}
                        onClick={() => setSelectedSize(i)}
                        className={`relative rounded-2xl border px-4 py-3 text-left transition-all ${
                          active
                            ? "border-forest bg-forest text-cream shadow-[0_12px_30px_-15px_rgba(31,58,43,0.6)]"
                            : "border-sand bg-paper text-forest hover:border-forest/40"
                        }`}
                      >
                        {active && (
                          <span className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-gold text-forest-deep flex items-center justify-center">
                            <FiCheck className="w-3 h-3" />
                          </span>
                        )}
                        <span className="block font-semibold">{size.label}</span>
                        <span className={`block text-sm ${active ? "text-gold-soft" : "text-moss"}`}>€{size.price.toFixed(2)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* CTA */}
            {product.inStock ? (
              <Link
                href={`/order/${product.slug}${currentLabel ? `?size=${encodeURIComponent(currentLabel)}` : ""}`}
                className="mt-8 group w-full flex items-center justify-center gap-3 rounded-full bg-forest hover:bg-moss text-cream font-semibold py-4 text-lg transition-colors"
              >
                Order now — €{currentPrice.toFixed(2)}
                <FiArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            ) : (
              <Link
                href="/contact"
                className="mt-8 w-full flex items-center justify-center gap-3 rounded-full border border-forest/30 text-forest font-semibold py-4 text-lg hover:bg-paper transition-colors"
              >
                Ask when it&apos;s back
              </Link>
            )}
            <p className="mt-3 text-center text-xs text-bark/55">
              You&apos;ll confirm your details on the next step. Payment instructions are sent by email.
            </p>

            {/* Description */}
            {product.description && (
              <div className="mt-12 border-t border-sand pt-8">
                <h2 className="font-display text-2xl text-forest">About this product</h2>
                <p className="mt-3 text-bark/80 leading-relaxed whitespace-pre-line">{product.description}</p>
              </div>
            )}

            {/* Specs */}
            {product.specifications?.length > 0 && (
              <div className="mt-10 rounded-[28px] bg-paper border border-sand p-6 md:p-8">
                <h2 className="font-display text-2xl text-forest">The details</h2>
                <ul className="mt-5 divide-y divide-sand">
                  {product.specifications.map((spec) => (
                    <li key={spec} className="flex items-start gap-3 py-3 text-sm text-bark">
                      <span className="mt-0.5 w-5 h-5 rounded-full bg-sand text-moss flex items-center justify-center shrink-0">
                        <FiCheck className="w-3 h-3" />
                      </span>
                      {spec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
