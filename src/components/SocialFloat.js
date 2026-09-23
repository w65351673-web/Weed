"use client";
import { useState } from "react";
import { FiMessageCircle, FiMail, FiX } from "react-icons/fi";
import { FaTelegramPlane, FaWhatsapp } from "react-icons/fa";

const links = [
  {
    label: "Telegram",
    href: "https://t.me/chemsolution12mal",
    icon: <FaTelegramPlane className="w-5 h-5" />,
    bg: "bg-moss text-cream",
    hover: "hover:bg-forest",
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/15559024481",
    icon: <FaWhatsapp className="w-5 h-5" />,
    bg: "bg-forest text-cream",
    hover: "hover:bg-moss",
  },
  {
    label: "Email",
    href: "mailto:orders@weedlaps.com",
    icon: <FiMail className="w-5 h-5" />,
    bg: "bg-gold text-forest-deep",
    hover: "hover:bg-gold-soft",
  },
];

export default function SocialFloat() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col-reverse items-start gap-3">
      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close contact options" : "Open contact options"}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-[0_12px_30px_-10px_rgba(21,40,30,0.6)] ring-4 ring-cream transition-all duration-300 ${
          open ? "bg-forest-deep text-gold-soft" : "bg-forest text-cream hover:bg-moss"
        }`}
      >
        {open ? <FiX className="w-6 h-6" /> : <FiMessageCircle className="w-6 h-6" />}
      </button>

      {/* Social links */}
      {open && (
        <div className="flex flex-col gap-3">
          {links.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex items-center gap-3 ${link.bg} ${link.hover} w-14 hover:w-auto rounded-full shadow-lg transition-all duration-300 overflow-hidden`}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="w-14 h-14 flex items-center justify-center shrink-0">
                {link.icon}
              </div>
              <span className="pr-5 text-sm font-semibold whitespace-nowrap hidden group-hover:inline-block">
                {link.label}
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

