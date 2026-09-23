"use client";
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";
import ProtectedImage from "@/components/ProtectedImage";
import { STRAINS, CategoryIcon, normalizeStrain, startingPrice } from "@/lib/categories";

export default function ProductCard({ product, compact = false }) {
  const from = startingPrice(product);
  const multi = (product.sizes?.length || 0) > 1;
  const strain = normalizeStrain(product.strainType || product.name);
  const tint = STRAINS[strain]?.tint || "bg-sand";
  const badge = STRAINS[strain]?.label || "Flower";

  return (
    <Link
      href={`/shop/${product.slug}`}
      className="product-card group block rounded-[28px] bg-paper border border-sand p-3 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_50px_-24px_rgba(31,58,43,0.45)] hover:border-gold/50"
    >
      {/* Image */}
      <div
        className={`relative overflow-hidden rounded-[22px] ${tint} ${compact ? "aspect-square" : "aspect-[4/5]"} image-container no-context-menu`}
      >
        {product.image ? (
          <ProtectedImage
            src={product.image}
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
              product.inStock ? "" : "grayscale opacity-70"
            }`}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 blob-shape bg-cream/70 flex items-center justify-center text-moss transition-transform duration-700 group-hover:rotate-6 group-hover:scale-105">
              <CategoryIcon className="w-14 h-14" />
            </div>
          </div>
        )}

        <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-cream/90 backdrop-blur px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-forest">
          <CategoryIcon className="w-3 h-3 text-moss" />
          {badge}
        </span>

        {!product.inStock && (
          <span className="absolute top-3 right-3 rounded-full bg-clay text-cream px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]">
            Sold out
          </span>
        )}

        <span className="absolute bottom-3 right-3 w-11 h-11 rounded-full bg-forest text-cream flex items-center justify-center translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <FiArrowUpRight className="w-5 h-5" />
        </span>
      </div>

      {/* Body */}
      <div className="px-2 pt-4 pb-2">
        <h3 className="font-display text-xl leading-snug text-forest line-clamp-1 group-hover:text-moss transition-colors">
          {product.name}
        </h3>
        {!compact && product.shortDescription && (
          <p className="mt-1.5 text-sm text-bark/70 leading-relaxed line-clamp-2">{product.shortDescription}</p>
        )}
        <div className="mt-4 flex items-end justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-bark/50">{multi ? "From" : "Price"}</p>
            <p className="font-display text-2xl text-forest">€{from.toFixed(2)}</p>
          </div>
          {multi && (
            <span className="text-[11px] text-bark/60 border border-sand rounded-full px-2.5 py-1">
              {product.sizes.length} sizes
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}


