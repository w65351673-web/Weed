import Link from "next/link";
import { FiMail, FiTruck, FiArrowUpRight, FiShield, FiPackage } from "react-icons/fi";
import { FaTelegramPlane } from "react-icons/fa";
import CannabisIcon from "@/components/CannabisIcon";

const shopLinks = [
  { href: "/shop?strain=indica", label: "Indica Strains" },
  { href: "/shop?strain=sativa", label: "Sativa Strains" },
  { href: "/shop?strain=hybrid", label: "Hybrid Strains" },
  { href: "/shop", label: "All Flower" },
];

const companyLinks = [
  { href: "/about", label: "Our Story" },
  { href: "/contact", label: "Contact Us" },
  { href: "/contact", label: "Shipping & Discretion" },
  { href: "/contact", label: "Wholesale Enquiries" },
];

export default function Footer() {
  return (
    <footer className="mt-auto forest-grain text-cream/80">
      {/* Promise strip */}
      <div className="border-b border-cream/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: <FiShield className="w-5 h-5" />, title: "Independently tested", text: "Verified results for every batch" },
            { icon: <FiPackage className="w-5 h-5" />, title: "Smell-proof & discreet", text: "Plain, vacuum-sealed packaging" },
            { icon: <FiTruck className="w-5 h-5" />, title: "Worldwide delivery", text: "Tracked shipping, wherever you are" },
          ].map((p) => (
            <div key={p.title} className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-full border border-gold/40 text-gold flex items-center justify-center shrink-0">
                {p.icon}
              </div>
              <div>
                <p className="font-display text-lg text-cream leading-tight">{p.title}</p>
                <p className="text-xs text-cream/60">{p.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand */}
          <div className="md:col-span-5">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="w-12 h-12 rounded-full bg-cream/5 border border-gold/40 flex items-center justify-center">
                <CannabisIcon className="w-7 h-7 text-gold-soft" />
              </span>
              <span className="font-display text-3xl text-cream">
                Weed<em className="text-gold italic">Laps</em>
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-cream/65">
              Small-batch cannabis flower from growers who care. Hand-trimmed, slow-cured buds — sealed with
              love and shipped discreetly to your door.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://t.me/chemsolution12mal"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
                className="w-10 h-10 rounded-full border border-cream/20 flex items-center justify-center hover:bg-gold hover:text-forest-deep hover:border-gold transition-colors"
              >
                <FaTelegramPlane className="w-4 h-4" />
              </a>
              <a
                href="mailto:orders@weedlaps.com"
                aria-label="Email"
                className="w-10 h-10 rounded-full border border-cream/20 flex items-center justify-center hover:bg-gold hover:text-forest-deep hover:border-gold transition-colors"
              >
                <FiMail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div className="md:col-span-3">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold mb-5">The Shop</h4>
            <ul className="space-y-3 text-sm">
              {shopLinks.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="link-underline hover:text-cream transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="md:col-span-2">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold mb-5">Company</h4>
            <ul className="space-y-3 text-sm">
              {companyLinks.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="link-underline hover:text-cream transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-2">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold mb-5">Say Hello</h4>
            <a
              href="mailto:orders@weedlaps.com"
              className="group inline-flex items-center gap-1 text-sm hover:text-cream transition-colors break-all"
            >
              orders@weedlaps.com
              <FiArrowUpRight className="w-3.5 h-3.5 text-gold transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
            <p className="mt-3 text-xs text-cream/55 leading-relaxed">
              Replies within 2 hours, 7 days a week.
            </p>
          </div>
        </div>

        {/* Big wordmark */}
        <div aria-hidden="true" className="mt-16 select-none font-display text-[18vw] md:text-[11rem] leading-none text-cream/[0.04] text-center tracking-tight">
          weedlaps
        </div>

        <div className="mt-6 pt-6 border-t border-cream/10 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-cream/50">
          <p>&copy; {new Date().getFullYear()} WeedLaps.com — Grown with care.</p>
          <p>For adults 18+ only. Please consume responsibly and follow your local laws.</p>
        </div>
      </div>
    </footer>
  );
}


