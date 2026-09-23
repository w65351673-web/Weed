import dbConnect from "@/lib/mongodb";
import Settings from "@/models/Settings";
import AboutClient from "@/components/AboutClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "About WeedLaps — Trusted Cannabis Dispensary Since 2019 | WeedLaps.com",
  description:
    "WeedLaps.com has been a trusted name in premium cannabis since 2019. Learn about our craft growers, rigorous lab testing, and commitment to top-shelf quality with every product.",
  keywords: [
    "trusted cannabis supplier",
    "reliable weed vendor",
    "best online dispensary",
    "cannabis dispensary since 2019",
    "premium cannabis supplier",
    "lab tested weed",
    "cannabis quality standards",
    "trusted online weed shop",
    "discreet cannabis supplier",
    "weed worldwide shipping",
    "about WeedLaps",
    "weedlaps.com review",
  ],
  openGraph: {
    title: "About WeedLaps — Quality & Trust Since 2019",
    description:
      "Craft-grown cannabis, lab-tested quality, discreet shipping with every order. Learn why customers worldwide trust WeedLaps.com.",
    url: "https://weedlaps.com/about",
  },
  alternates: {
    canonical: "https://weedlaps.com/about",
  },
};

export default async function AboutPage() {
  await dbConnect();
  let siteSettings = await Settings.findOne({ key: "main" }).lean();
  if (!siteSettings) {
    siteSettings = { aboutText: "" };
  }

  return <AboutClient aboutText={siteSettings.aboutText || ""} />;
}


