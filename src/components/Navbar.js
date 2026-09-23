"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineMenuAlt3, HiX } from "react-icons/hi";
import { FiShoppingBag, FiTruck, FiShield, FiArrowRight } from "react-icons/fi";
import CannabisIcon from "@/components/CannabisIcon";

const links = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/shop?strain=indica", label: "Indica" },
  { href: "/shop?strain=sativa", label: "Sativa" },
  { href: "/shop?strain=hybrid", label: "Hybrid" },
  { href: "/about", label: "Our Story" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (href) => {
    const base = href.split("?")[0];
    if (base === "/") return pathname === "/";
    return pathname === base && !href.includes("?");
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Announcement strip */}
      <div className="bg-forest-deep text-gold-soft text-[11px] sm:text-xs tracking-[0.18em] uppercase">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-center gap-6">
          <span className="flex items-center gap-2">
            <FiTruck className="w-3.5 h-3.5 text-gold" />
            Discreet, tracked delivery worldwide
          </span>
          <span className="hidden sm:flex items-center gap-2">
            <FiShield className="w-3.5 h-3.5 text-gold" />
            Independently lab tested
          </span>
          <span className="hidden md:flex items-center gap-2">
            <CannabisIcon className="w-3.5 h-3.5 text-gold" stem={false} />
            Adults 18+ only
          </span>
        </div>
      </div>

      {/* Main bar */}
      <nav
        className={`transition-all duration-300 border-b ${
          scrolled
            ? "bg-cream/90 backdrop-blur-md border-sand shadow-[0_8px_30px_-12px_rgba(31,58,43,0.25)]"
            : "bg-cream border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="shrink-0" aria-label="WeedLaps home">
              <img src="/logo.svg" alt="WeedLaps.com" className="h-11 w-auto" />
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`relative px-3.5 py-2 text-[13px] font-medium tracking-wide transition-colors ${
                    isActive(l.href) ? "text-forest" : "text-bark/80 hover:text-forest"
                  }`}
                >
                  {l.label}
                  {isActive(l.href) && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute left-3.5 right-3.5 -bottom-0.5 h-[2px] rounded-full bg-gold"
                    />
                  )}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/shop"
                className="hidden sm:inline-flex items-center gap-2 bg-forest hover:bg-moss text-cream text-sm font-semibold pl-5 pr-4 py-2.5 rounded-full transition-colors group"
              >
                <FiShoppingBag className="w-4 h-4" />
                Shop the Harvest
                <FiArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>

              <button
                onClick={() => setOpen(!open)}
                className="lg:hidden w-11 h-11 rounded-full border border-sand bg-paper flex items-center justify-center text-forest hover:border-gold transition-colors"
                aria-label="Toggle menu"
              >
                {open ? <HiX className="w-5 h-5" /> : <HiOutlineMenuAlt3 className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden overflow-hidden border-t border-sand bg-paper"
            >
              <div className="px-4 py-6">
                <ul className="divide-y divide-sand">
                  {links.map((l, i) => (
                    <motion.li
                      key={l.href}
                      initial={{ x: -12, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <Link
                        href={l.href}
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-between py-3.5 font-display text-xl text-forest"
                      >
                        {l.label}
                        <FiArrowRight className="w-4 h-4 text-gold" />
                      </Link>
                    </motion.li>
                  ))}
                </ul>
                <Link
                  href="/shop"
                  onClick={() => setOpen(false)}
                  className="mt-6 flex items-center justify-center gap-2 bg-forest text-cream font-semibold py-3.5 rounded-full"
                >
                  <FiShoppingBag className="w-4 h-4" />
                  Shop the Harvest
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}

