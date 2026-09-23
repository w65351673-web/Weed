"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { HiOutlineShieldCheck } from "react-icons/hi";
import { BsBoxSeam, BsPeople } from "react-icons/bs";
import { FiArrowRight, FiChevronRight } from "react-icons/fi";
import CannabisIcon from "@/components/CannabisIcon";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

const sections = [
  {
    icon: <CannabisIcon className="w-6 h-6" />,
    title: "Our Mission",
    text: "Founded in 2019, WeedLaps emerged from a simple observation: cannabis consumers deserved a dispensary they could trust. We bridge the gap between craft growers and customers, ensuring access to premium, lab-tested cannabis products without the typical industry headaches.",
  },
  {
    icon: <HiOutlineShieldCheck className="w-6 h-6" />,
    title: "Quality Without Compromise",
    text: "Every product in our catalog undergoes rigorous third-party lab testing. Our quality control includes potency verification, pesticide screening, and heavy metal analysis. We don't just meet industry standards—we exceed them. Every batch comes with verified lab results.",
  },
  {
    icon: <BsBoxSeam className="w-6 h-6" />,
    title: "Discretion as Standard",
    text: "We understand that privacy matters. Our packaging protocol ensures complete anonymity: vacuum-sealed, smell-proof inner containers, tamper-evident seals, and plain outer packaging with no identifying marks. Your order arrives securely and confidentially, every time.",
  },
  {
    icon: <BsPeople className="w-6 h-6" />,
    title: "Experts Supporting Customers",
    text: "Our support team isn't outsourced to a call center. You'll speak directly with people who know cannabis inside and out. Need help picking the right strain? Advice on storage or grading? We're here to help, not just transact.",
  },
];

const stats = [
  { value: "5+", label: "Years growing" },
  { value: "20k+", label: "Happy customers" },
  { value: "50+", label: "Countries served" },
  { value: "4.9", label: "Average rating" },
];

export default function AboutClient({ aboutText }) {
  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative overflow-hidden paper-grain border-b border-sand">
        <div className="absolute -top-40 -left-32 w-[460px] h-[460px] rounded-full bg-sage/30 blur-3xl pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 grid lg:grid-cols-12 gap-12 items-center">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="lg:col-span-7">
            <nav className="flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-bark/60">
              <Link href="/" className="hover:text-forest transition-colors">Home</Link>
              <FiChevronRight className="w-3 h-3" />
              <span className="text-clay">Our Story</span>
            </nav>
            <h1 className="mt-6 font-display text-5xl md:text-7xl leading-[1.02] text-forest">
              Rooted in <em className="text-moss">craft</em>,
              <br />
              grown with <em className="text-moss">care</em>.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-bark/80">
              We&apos;re a small team of cannabis lovers who got tired of guesswork. So we built the shop we always wanted
              — honest products, real lab results, and people who genuinely know the plant.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 relative mx-auto w-full max-w-sm"
          >
            <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-gold/90" />
            <div className="relative arch forest-grain aspect-[4/5] flex items-center justify-center overflow-hidden">
              <div className="absolute w-[75%] aspect-square rounded-full border border-gold/25" />
              <CannabisIcon className="w-[60%] h-[60%] text-gold-soft animate-sway" />
              <span className="absolute bottom-8 font-display italic text-2xl text-gold-soft">est. 2019</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-forest text-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              className="text-center"
            >
              <div className="font-display text-5xl text-gold-soft">{s.value}</div>
              <div className="mt-2 text-xs uppercase tracking-[0.2em] text-cream/60">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Custom about text from settings */}
        {aboutText && (
          <motion.figure
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative mb-20 rounded-[32px] bg-paper border border-sand px-8 py-12 md:px-16 text-center"
          >
            <span className="absolute left-1/2 -translate-x-1/2 -top-8 font-display text-8xl leading-none text-gold select-none">
              &ldquo;
            </span>
            <blockquote className="font-display text-2xl md:text-3xl leading-relaxed text-forest">{aboutText}</blockquote>
            <figcaption className="mt-6 text-xs uppercase tracking-[0.25em] text-clay">The WeedLaps team</figcaption>
          </motion.figure>
        )}

        {/* Values */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-clay">
            <span className="h-px w-6 bg-clay/60" />
            What we stand for
            <span className="h-px w-6 bg-clay/60" />
          </span>
          <h2 className="mt-4 font-display text-4xl sm:text-5xl text-forest">
            Four promises, <em className="text-moss">every order</em>
          </h2>
        </div>

        <div className="mt-14 grid md:grid-cols-2 gap-6">
          {sections.map((section, i) => (
            <motion.article
              key={section.title}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              custom={i}
              className="group relative overflow-hidden rounded-[28px] bg-paper border border-sand p-8 md:p-10 hover:border-gold/50 hover:shadow-[0_24px_50px_-28px_rgba(31,58,43,0.45)] transition-all duration-500"
            >
              <div className="flex items-center justify-between">
                <span className="w-14 h-14 blob-shape bg-sand text-moss flex items-center justify-center transition-transform duration-500 group-hover:rotate-12">
                  {section.icon}
                </span>
                <span className="font-display text-5xl text-sand">0{i + 1}</span>
              </div>
              <h3 className="mt-8 font-display text-3xl text-forest">{section.title}</h3>
              <p className="mt-4 text-bark/75 leading-relaxed">{section.text}</p>
            </motion.article>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-24 relative overflow-hidden rounded-[36px] forest-grain px-8 py-14 md:px-16 text-center"
        >
          <CannabisIcon className="absolute -left-10 -bottom-10 w-60 h-60 text-gold/10" />
          <CannabisIcon className="absolute -right-10 -top-10 w-60 h-60 text-gold/10 rotate-180" />
          <h2 className="relative font-display text-4xl md:text-5xl text-cream">
            Ready to taste the <em className="text-gold">difference</em>?
          </h2>
          <p className="relative mt-4 text-cream/70">Explore this week&apos;s harvest — sealed fresh, shipped discreetly.</p>
          <Link
            href="/shop"
            className="relative mt-8 group inline-flex items-center gap-2 rounded-full bg-gold px-8 py-4 font-semibold text-forest-deep hover:bg-gold-soft transition-colors"
          >
            Browse the menu
            <FiArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

