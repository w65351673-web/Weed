import { Plus_Jakarta_Sans, DM_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ToastProvider from "@/components/ToastProvider";
import SocialFloat from "@/components/SocialFloat";
import ImageProtection from "@/components/ImageProtection";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://weedlaps.com"),
  title: {
    default: "WeedLaps — Premium Cannabis Flower | WeedLaps.com",
    template: "%s | WeedLaps.com",
  },
  description:
    "WeedLaps.com — Premium cannabis flower. Indica, sativa & hybrid strains, independently lab tested and shipped discreetly worldwide.",
  keywords: [
    "buy weed online",
    "cannabis for sale",
    "order cannabis online",
    "weed shop",
    "cannabis store",
    "buy cannabis flower",
    "premium cannabis flower",
    "weed flower for sale",
    "indica flower",
    "sativa flower",
    "hybrid strains",
    "AAAA weed",
    "craft cannabis",
    "lab tested cannabis",
    "premium cannabis",
    "top shelf weed",
    "discreet weed shipping",
    "cannabis worldwide delivery",
    "weed bulk order",
    "cannabis wholesale",
    "buy marijuana online",
    "marijuana for sale",
    "mail order marijuana",
    "online dispensary",
    "cannabis dispensary online",
    "WeedLaps",
    "weedlaps.com",
    "weed strains",
    "high THC flower",
    "organic cannabis",
    "cannabis delivery",
    "420 shop",
    "buy bud online",
  ],
  authors: [{ name: "WeedLaps.com" }],
  creator: "WeedLaps.com",
  publisher: "WeedLaps.com",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://weedlaps.com",
    siteName: "WeedLaps.com",
    title: "WeedLaps — Premium Cannabis Flower",
    description:
      "WeedLaps.com — Premium cannabis flower. Indica, sativa & hybrid strains, independently lab tested and shipped discreetly worldwide.",
  },
  twitter: {
    card: "summary_large_image",
    title: "WeedLaps — Premium Cannabis Flower",
    description:
      "WeedLaps.com — Premium cannabis flower. Indica, sativa & hybrid strains, lab tested and shipped discreetly worldwide.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://weedlaps.com",
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${dmSans.variable} h-full antialiased`}
    >
      <head></head>
      <body className="min-h-full flex flex-col bg-cream text-ink font-sans">
        <ImageProtection />
        <ToastProvider />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <SocialFloat />
      </body>
    </html>
  );
}
