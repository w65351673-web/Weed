// Pulls cannabis flower products (descriptions, weight units, prices) from bulkbuddy.co's public
// WooCommerce Store API and writes them to data/bulkbuddy-cannabis.json + data/bulkbuddy-notes.md.
// Usage: node scripts/scrape-bulkbuddy.mjs
import fs from "node:fs/promises";
import path from "node:path";

const BASE = "https://www.bulkbuddy.co/wp-json/wc/store/v1";
const OUT_DIR = path.resolve("data");
const IMG_DIR = path.resolve("public/uploads/bulkbuddy");
const CONCURRENCY = 3;
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Anything whose name/category hits these is not plain cannabis flower and is skipped.
const EXCLUDE = /vape|cart|pen\b|gumm|edible|chocolate bar|tincture|oil|shatter|hash|kief|wax|resin|rosin|distillate|capsule|cbd isolate|cara melt|pre-?roll|joint/i;

const UNIT_ORDER = ["3-5-grams", "7-grams", "1-4-ounce", "1-2-ounce", "1-ounce", "quarter-pound", "half-pound", "pound"];
const MIN_UNIT = "7-grams"; // smallest size we sell — anything below is dropped

const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", ndash: "–", mdash: "—", ldquo: "“", rdquo: "”", lsquo: "‘", rsquo: "’", hellip: "…" };

function decode(str = "") {
  return str
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z]+);/gi, (m, n) => ENTITIES[n.toLowerCase()] ?? m);
}

function stripTags(html = "") {
  return decode(html.replace(/<[^>]+>/g, ""));
}

function rebrand(text) {
  return text.replace(/Bulk Buddy(['’]s)?/gi, (_, s) => (s ? "WeedLaps'" + "s" : "WeedLaps")).replace(/\s{2,}/g, " ");
}

function cleanDescription(html = "") {
  const noHeading = html.replace(/<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>/gi, "");
  const paragraphs = noHeading
    .split(/<\/p>|<br\s*\/?>/i)
    .map((p) => stripTags(p).replace(/\s+/g, " ").trim())
    .filter(Boolean);
  return rebrand(paragraphs.join("\n\n"));
}

function parseShortDescription(html = "") {
  const lines = html
    .split(/<br\s*\/?>|<\/p>/i)
    .map((l) => stripTags(l).replace(/\s+/g, " ").trim())
    .filter(Boolean);
  const specs = [];
  let grade = "";
  for (const line of lines) {
    if (/^batch/i.test(line)) continue;
    const rating = line.match(/^ratings?\s*:?\s*\(?([A-Z+\-]+)\)?/i);
    if (rating) {
      grade = rating[1];
      continue;
    }
    const thcCbd = line.match(/^(THC\s*:.*?)(CBD\s*:.*)$/i);
    if (thcCbd) {
      specs.push(thcCbd[1].trim(), thcCbd[2].trim());
      continue;
    }
    specs.push(line.replace(/\s*:\s*/, ": "));
  }
  return { specs, grade };
}

async function getJSON(url, attempt = 1) {
  const res = await fetch(url, { headers: { Accept: "application/json", "User-Agent": UA } });
  if (!res.ok) {
    if (attempt < 4) {
      await sleep(1500 * attempt);
      return getJSON(url, attempt + 1);
    }
    throw new Error(`${res.status} ${url}`);
  }
  return { data: await res.json(), headers: res.headers };
}

// Fetch a product page once and read the embedded data-product_variations JSON —
// one request per product instead of one per variation (avoids the API rate limit).
async function fetchVariationPrices(p) {
  try {
    const res = await fetch(p.permalink, { headers: { "User-Agent": UA, Accept: "text/html" } });
    if (res.ok) {
      const html = await res.text();
      const m = html.match(/data-product_variations="([^"]*)"/);
      if (m) {
        const variations = JSON.parse(decode(m[1]));
        return variations.map((v) => ({
          unit: v.attributes?.attribute_pa_weight || "",
          price: Number(v.display_price),
          inStock: v.is_in_stock !== false,
        }));
      }
    }
  } catch {
    // fall through to the API fallback
  }

  // Fallback: per-variation Store API calls (slower, may hit rate limits)
  return mapLimit(p.variations || [], 2, async (v) => {
    const unit = v.attributes.find((a) => a.name === "Weight")?.value;
    try {
      const { data } = await getJSON(`${BASE}/products/${v.id}`);
      const minor = data.prices?.currency_minor_unit ?? 2;
      return { unit, price: Number(data.prices?.price) / 10 ** minor, inStock: data.is_in_stock !== false };
    } catch (e) {
      console.warn(`  ! variation ${v.id} (${p.name}) failed: ${e.message}`);
      return null;
    }
  });
}

// Download a product image into public/uploads/bulkbuddy and return its local path.
async function downloadImage(url, slug) {
  if (!url) return "";
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (!res.ok) return "";
    const ext = (url.split("?")[0].match(/\.(jpe?g|png|webp|gif|avif)$/i)?.[1] || "jpg").toLowerCase();
    const file = `${slug}.${ext}`;
    await fs.writeFile(path.join(IMG_DIR, file), Buffer.from(await res.arrayBuffer()));
    return `/uploads/bulkbuddy/${file}`;
  } catch {
    return "";
  }
}

async function mapLimit(items, limit, fn) {
  const out = new Array(items.length);
  let i = 0;
  await Promise.all(
    Array.from({ length: limit }, async () => {
      while (i < items.length) {
        const idx = i++;
        out[idx] = await fn(items[idx], idx);
      }
    })
  );
  return out;
}

async function fetchAllCannabis() {
  const all = [];
  for (let page = 1; ; page++) {
    const { data, headers } = await getJSON(`${BASE}/products?category=cannabis&per_page=100&page=${page}`);
    all.push(...data);
    const totalPages = Number(headers.get("x-wp-totalpages") || 1);
    console.log(`Page ${page}/${totalPages}: ${data.length} products`);
    if (page >= totalPages || data.length === 0) break;
  }
  return all;
}

function strainType(categories) {
  const slugs = categories.map((c) => c.slug);
  if (slugs.includes("indica")) return "indica";
  if (slugs.includes("sativa")) return "sativa";
  if (slugs.includes("hybrid")) return "hybrid";
  return "";
}

function tier(categories) {
  const slugs = categories.map((c) => c.slug);
  if (slugs.some((s) => s.includes("craft"))) return "Craft";
  if (slugs.includes("aaaa")) return "AAAA";
  if (slugs.includes("aaa")) return "AAA";
  if (slugs.some((s) => s.includes("shake"))) return "Shake/Trim";
  return "";
}

async function main() {
  const raw = await fetchAllCannabis();
  const skipped = [];
  const flower = raw.filter((p) => {
    const hay = `${p.name} ${p.categories.map((c) => c.name).join(" ")}`;
    const bad = EXCLUDE.test(hay) || !p.categories.some((c) => c.slug === "cannabis");
    if (bad) skipped.push(p.name);
    return !bad;
  });
  console.log(`Kept ${flower.length} flower products, skipped ${skipped.length}.`);

  await fs.mkdir(IMG_DIR, { recursive: true });
  const weightTerms = new Map();
  let done = 0;
  const products = await mapLimit(flower, CONCURRENCY, async (p) => {
    const weightAttr = p.attributes.find((a) => a.taxonomy === "pa_weight");
    weightAttr?.terms.forEach((t) => weightTerms.set(t.slug, t.name));

    const variations = await fetchVariationPrices(p);
    const image = await downloadImage(p.images?.[0]?.src, p.slug);
    await sleep(250);

    const sizes = variations
      .filter((v) => v && v.price > 0 && v.inStock && UNIT_ORDER.indexOf(v.unit) >= UNIT_ORDER.indexOf(MIN_UNIT))
      .sort((a, b) => UNIT_ORDER.indexOf(a.unit) - UNIT_ORDER.indexOf(b.unit))
      .map(({ unit, price }) => ({ label: weightTerms.get(unit) || unit, price }));

    const { specs, grade } = parseShortDescription(p.short_description);
    const type = strainType(p.categories);
    const typeLabel = type ? type[0].toUpperCase() + type.slice(1) : "";
    const quality = grade || tier(p.categories);
    const minor = p.prices?.currency_minor_unit ?? 2;

    done++;
    if (done % 10 === 0) console.log(`  priced ${done}/${flower.length}`);

    return {
      slug: p.slug,
      name: decode(p.name),
      category: "powder",
      price: sizes[0]?.price ?? Number(p.prices?.price) / 10 ** minor,
      shortDescription: [typeLabel, quality].filter(Boolean).join(" · ") + (specs.find((s) => /^THC/i.test(s)) ? ` · ${specs.find((s) => /^THC/i.test(s))}` : ""),
      description: cleanDescription(p.description),
      specifications: [typeLabel && `Type: ${typeLabel}`, quality && `Grade: ${quality}`, ...specs].filter(Boolean),
      sizes,
      inStock: p.is_in_stock && sizes.length > 0,
      image,
      // reference-only fields (not in the Product schema)
      strainType: type,
      grade: quality,
      rating: Number(p.average_rating) || null,
      reviewCount: p.review_count || 0,
      sourceUrl: p.permalink,
      sourceImage: p.images?.[0]?.src || "",
      currency: p.prices?.currency_code || "CAD",
    };
  });

  await fs.mkdir(OUT_DIR, { recursive: true });
  await fs.writeFile(path.join(OUT_DIR, "bulkbuddy-cannabis.json"), JSON.stringify(products, null, 2));

  // ---- notes ----
  const byType = products.reduce((acc, p) => ((acc[p.strainType || "Unknown"] = (acc[p.strainType || "Unknown"] || 0) + 1), acc), {});
  const byGrade = products.reduce((acc, p) => ((acc[p.grade || "Unknown"] = (acc[p.grade || "Unknown"] || 0) + 1), acc), {});
  const unitStats = {};
  for (const p of products) {
    for (const s of p.sizes) {
      (unitStats[s.label] ||= []).push(s.price);
    }
  }
  const orderedUnits = UNIT_ORDER.map((u) => weightTerms.get(u)).filter((l) => l && unitStats[l]);
  const priceTiers = {};
  for (const p of products) {
    const key = p.sizes.map((s) => `${s.label}=${s.price}`).join(" | ");
    (priceTiers[key] ||= []).push(p.name);
  }
  const topTiers = Object.entries(priceTiers).sort((a, b) => b[1].length - a[1].length).slice(0, 8);

  const md = [
    "# Bulk Buddy cannabis reference notes",
    "",
    `Scraped: ${new Date().toISOString()}  `,
    `Source: https://www.bulkbuddy.co/product-category/cannabis/  `,
    `Currency on source: **${products[0]?.currency || "CAD"}** (our site shows €)`,
    "",
    `- **Flower products kept:** ${products.length}`,
    `- **Skipped (not flower):** ${skipped.length}${skipped.length ? ` — ${skipped.join(", ")}` : ""}`,
    `- **By type:** ${Object.entries(byType).map(([k, v]) => `${k} ${v}`).join(", ")}`,
    `- **By grade:** ${Object.entries(byGrade).map(([k, v]) => `${k} ${v}`).join(", ")}`,
    "",
    "## Weight units (in order) and price ranges",
    "",
    "| Unit | Products | Min | Median | Max |",
    "|---|---|---|---|---|",
    ...orderedUnits.map((u) => {
      const arr = unitStats[u].slice().sort((a, b) => a - b);
      return `| ${u} | ${arr.length} | ${arr[0]} | ${arr[Math.floor(arr.length / 2)]} | ${arr[arr.length - 1]} |`;
    }),
    "",
    "## Most common price ladders",
    "",
    ...topTiers.map(([ladder, names]) => `- **${names.length} products:** ${ladder}  \n  e.g. ${names.slice(0, 5).join(", ")}`),
    "",
    "## Description format on source",
    "",
    "- Short description = spec lines: Bud Size, Ratings, Texture, Flavour, Medical Usage, THC, CBD, Batch (batch dropped).",
    "- Long description = H1 sales heading (dropped) + paragraphs; \"Bulk Buddy\" rebranded to \"WeedLaps\".",
    "- Images are downloaded to `public/uploads/bulkbuddy/` and referenced locally; `sourceImage` keeps the original URL.",
    "- Sizes start at 7 grams — smaller units are dropped. Prices are the exact variation prices from the source.",
    "",
  ].join("\n");
  await fs.writeFile(path.join(OUT_DIR, "bulkbuddy-notes.md"), md);

  console.log(`\nWrote ${products.length} products to data/bulkbuddy-cannabis.json and notes to data/bulkbuddy-notes.md`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
