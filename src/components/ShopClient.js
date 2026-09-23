"use client";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronRight, FiX, FiChevronDown } from "react-icons/fi";
import CannabisIcon from "@/components/CannabisIcon";
import ProductCard from "@/components/ProductCard";
import { STRAINS, STRAIN_ORDER, normalizeStrain, startingPrice } from "@/lib/categories";

const strainOf = (p) => normalizeStrain(p.strainType || p.name);

const sorters = {
  featured: null,
  "price-asc": (a, b) => startingPrice(a) - startingPrice(b),
  "price-desc": (a, b) => startingPrice(b) - startingPrice(a),
  name: (a, b) => a.name.localeCompare(b.name),
};

export default function ShopClient({ products }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawFilter = searchParams?.get("strain");
  const activeFilter = rawFilter && STRAINS[rawFilter] ? rawFilter : "all";

  const [sort, setSort] = useState("featured");
  const [inStockOnly, setInStockOnly] = useState(false);

  const strains = STRAIN_ORDER.filter((s) => products.some((p) => strainOf(p) === s));

  const setFilter = (strain) => {
    const url = strain === "all" ? "/shop" : `/shop?strain=${encodeURIComponent(strain)}`;
    router.replace(url, { scroll: false });
  };

  const visible = useMemo(() => {
    let list = products.filter((p) => (inStockOnly ? p.inStock : true));
    if (sorters[sort]) list = [...list].sort(sorters[sort]);
    return list;
  }, [products, sort, inStockOnly]);

  const displayStrains = activeFilter === "all" ? strains : strains.filter((s) => s === activeFilter);
  const activeMeta = activeFilter !== "all" ? STRAINS[activeFilter] : null;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden paper-grain border-b border-sand">
        <div className="absolute -top-32 -right-24 w-96 h-96 rounded-full bg-gold-soft/40 blur-3xl pointer-events-none" />
        <CannabisIcon className="absolute right-6 md:right-24 top-1/2 -translate-y-1/2 w-56 h-56 md:w-72 md:h-72 text-moss/[0.07] animate-sway pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
          <nav className="flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-bark/60">
            <Link href="/" className="hover:text-forest transition-colors">Home</Link>
            <FiChevronRight className="w-3 h-3" />
            <Link href="/shop" className={activeMeta ? "hover:text-forest transition-colors" : "text-clay"}>Shop</Link>
            {activeMeta && (
              <>
                <FiChevronRight className="w-3 h-3" />
                <span className="text-clay">{activeMeta.label}</span>
              </>
            )}
          </nav>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
            >
              <h1 className="mt-6 font-display text-5xl md:text-6xl text-forest leading-[1.05]">
                {activeMeta ? (
                  <>
                    {activeMeta.long.split(" ")[0]} <em className="text-moss">{activeMeta.long.split(" ").slice(1).join(" ")}</em>
                  </>
                ) : (
                  <>
                    The <em className="text-moss">Menu</em>
                  </>
                )}
              </h1>
              <p className="mt-4 max-w-xl text-lg text-bark/75 leading-relaxed">
                {activeMeta
                  ? activeMeta.description
                  : "Small-batch cannabis flower — indica, sativa & hybrid strains. Independently lab tested, sealed fresh and shipped discreetly worldwide."}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Filter bar */}
      <div className="sticky top-[112px] z-30 bg-cream/90 backdrop-blur-md border-b border-sand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col lg:flex-row lg:items-center gap-4 justify-between">
          <div className="flex gap-2 overflow-x-auto -mx-1 px-1 pb-1 lg:pb-0">
            {["all", ...strains].map((strain) => {
              const count = strain === "all" ? products.length : products.filter((p) => strainOf(p) === strain).length;
              const active = activeFilter === strain;
              return (
                <button
                  key={strain}
                  onClick={() => setFilter(strain)}
                  className={`relative shrink-0 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors border ${
                    active ? "text-cream border-forest" : "text-forest border-sand bg-paper hover:border-forest/40"
                  }`}
                >
                  {active && (
                    <motion.span layoutId="shop-filter" className="absolute inset-0 rounded-full bg-forest" transition={{ type: "spring", bounce: 0.2, duration: 0.5 }} />
                  )}
                  <span className="relative flex items-center gap-2">
                    <CannabisIcon className="w-4 h-4" stem={false} />
                    {strain === "all" ? "All Flower" : STRAINS[strain].label}
                    <span className={`text-xs ${active ? "text-gold-soft" : "text-bark/50"}`}>{count}</span>
                  </span>
                </button>
              );
            })}
            {activeFilter !== "all" && (
              <button
                onClick={() => setFilter("all")}
                className="shrink-0 inline-flex items-center gap-1 px-3 py-2 text-sm text-bark/70 hover:text-clay transition-colors"
              >
                <FiX className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            <label className="inline-flex items-center gap-2 text-sm text-bark cursor-pointer select-none">
              <span
                className={`relative w-10 h-6 rounded-full transition-colors ${inStockOnly ? "bg-moss" : "bg-sand"}`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-paper shadow transition-transform ${inStockOnly ? "translate-x-4" : ""}`}
                />
              </span>
              <input type="checkbox" className="sr-only" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} />
              In stock only
            </label>

            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="appearance-none rounded-full border border-sand bg-paper pl-4 pr-10 py-2 text-sm text-forest focus:outline-none focus:border-gold"
                aria-label="Sort products"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
                <option value="name">Name A–Z</option>
              </select>
              <FiChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-bark/60" />
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {displayStrains.map((strain, idx) => {
          const list = visible.filter((p) => strainOf(p) === strain);
          if (list.length === 0) return null;
          const meta = STRAINS[strain];
          return (
            <section key={strain} className={idx > 0 ? "mt-20" : ""}>
              {activeFilter === "all" && (
                <div className="mb-8 flex items-end justify-between gap-6 border-b border-sand pb-5">
                  <div className="flex items-center gap-4">
                    <span className={`w-14 h-14 blob-shape ${meta.tint} text-moss flex items-center justify-center`}>
                      <CannabisIcon className="w-7 h-7" />
                    </span>
                    <div>
                      <h2 className="font-display text-3xl text-forest">{meta.long}</h2>
                      <p className="text-sm text-bark/65">{meta.tagline}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setFilter(strain)}
                    className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-moss hover:text-forest link-underline"
                  >
                    See all {list.length}
                    <FiChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence mode="popLayout">
                  {list.map((product, i) => (
                    <motion.div
                      key={product._id || product.slug}
                      layout
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0, transition: { delay: Math.min(i, 8) * 0.05, duration: 0.45 } }}
                      exit={{ opacity: 0, scale: 0.96 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </section>
          );
        })}

        {displayStrains.every((strain) => visible.filter((p) => strainOf(p) === strain).length === 0) && (
          <div className="rounded-[28px] border border-dashed border-sand bg-paper px-8 py-24 text-center">
            <div className="mx-auto w-20 h-20 blob-shape bg-sand flex items-center justify-center text-moss">
              <CannabisIcon className="w-10 h-10" />
            </div>
            <h3 className="mt-6 font-display text-3xl text-forest">Nothing on the shelf here yet</h3>
            <p className="mt-2 text-bark/70">
              {inStockOnly ? "Try showing sold-out items too." : "A fresh harvest is on its way — check back soon."}
            </p>
            {(activeFilter !== "all" || inStockOnly) && (
              <button
                onClick={() => {
                  setInStockOnly(false);
                  setFilter("all");
                }}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-semibold text-cream hover:bg-moss transition-colors"
              >
                Show everything
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}




