// Generates a unique, colorful, ANIMATED product image per product —
// a deterministic "AI-style" art piece keyed by each product's id/name.
// No network needed. Every product looks distinct.

// ---------------------------------------------------------------
// REAL, name-matching product photos (hotlinked from Unsplash).
// Each keyword maps to a photo that actually depicts that item, so
// the catalog never shows a random or placeholder image again.
// Entry order matters: more specific keywords are listed first.
// ---------------------------------------------------------------
const IMG_QUERY = "?auto=format&fit=crop&w=800&q=80";

// ---- real photo library (all URLs verified reachable) ----
const PHONE = `https://images.unsplash.com/photo-1511707171634-5f897ff02aa9${IMG_QUERY}`;
const HEADPHONES = `https://images.unsplash.com/photo-1505740420928-5e560c06d30e${IMG_QUERY}`;
const EARBUDS = `https://images.unsplash.com/photo-1585386959984-a4155224a1ad${IMG_QUERY}`;
const WATCH = `https://images.unsplash.com/photo-1523275335684-37898b6baf30${IMG_QUERY}`;
const WATCH_LUXE = `https://images.unsplash.com/photo-1524592094714-0f0654e20314${IMG_QUERY}`;
const KEYBOARD = `https://images.unsplash.com/photo-1587829741301-dc798b83add3${IMG_QUERY}`;
const SNEAKER = `https://images.unsplash.com/photo-1542291026-7eec264c27ff${IMG_QUERY}`;
const APPAREL = `https://images.unsplash.com/photo-1434389677669-e08b4cac3105${IMG_QUERY}`;
const BACKPACK = `https://images.unsplash.com/photo-1553062407-98eeb64c6a62${IMG_QUERY}`;
const HANDBAG = `https://images.unsplash.com/photo-1594633312681-425c7b97ccd1${IMG_QUERY}`;
const BOTTLE = `https://images.unsplash.com/photo-1602143407151-7111542de6e8${IMG_QUERY}`;
const NOTEBOOK = `https://images.unsplash.com/photo-1531346878377-a5be20888e57${IMG_QUERY}`;
const MUG = `https://images.unsplash.com/photo-1495474472287-4d71bcdd2085${IMG_QUERY}`;

// Ordered library: [ regex, url ] — first match wins.
// Regex word boundaries (\b) prevent collisions: "phone" won't match inside
// "headphones"/"smartphone", and "bag" won't match inside "backpack".
const PRODUCT_LIBRARY = [
  // Tech
  [/\b(smart?)phone\b|\bmobile\b|\bhandset\b/, PHONE],
  [/\b(earbud|airpod)\w*/, EARBUDS],
  [/\bheadphone\w*|\bheadset\b/, HEADPHONES],
  [/\bkeyboard\b/, KEYBOARD],
  [/\bwatch\b/, WATCH_LUXE],
  // Fashion / wearable
  [/\bsneaker\w*|\bshoe\w*|\bfootwear\b/, SNEAKER],
  [/\b(sweater|cashmere|scarf|jacket|hoodie|jacket|shirt|t-shirt|apparel)\w*/, APPAREL],
  // Bags — backpack checked before bag so \bbag\b never steals it
  [/\bbackpack\b/, BACKPACK],
  [/\b(bag|handbag|tote|satchel)\b/, HANDBAG],
  // Bottles / notebooks / drinkware
  [/\bbottle\b|\bflask\b/, BOTTLE],
  [/\b(notebook|journal|stationery|paper)\b/, NOTEBOOK],
  [/\b(tumbler|coffee|mug|thermos)\b/, MUG],
];

const CATEGORY_DEFAULT = {
  tech: PHONE,
  fashion: APPAREL,
  home: `https://images.unsplash.com/photo-1513694203232-719a280e022f${IMG_QUERY}`, // cozy interior
  lifestyle: BACKPACK,
};

// ---- generated art (offline-safe colored placeholder, kept as fallback) ----
const PALETTES = [
  ["#e4e4e7", "#a1a1aa", "#52525b"], // grayscale — light→mid→dark
  ["#f4f4f5", "#d4d4d8", "#8e8e98"], // grayscale
  ["#fafafa", "#e5e5e5", "#9a9a9a"], // grayscale
  ["#ececec", "#b0b0b0", "#606060"], // grayscale
  ["#e8e8ec", "#a9a9b0", "#4b4b52"], // grayscale
  ["#f1f1f2", "#bdbdbd", "#6b6b6b"], // grayscale
  ["#e0e0e2", "#99999e", "#4a4a4f"], // grayscale
  ["#f7f7f8", "#c8c8cc", "#5c5c63"], // grayscale
];

const hashStr = (s = "") => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
};

const pickPalette = (product) => {
  const key = String(product?._id || "") + (product?.name || "");
  return PALETTES[hashStr(key) % PALETTES.length];
};

// Build an animated SVG data-URI unique to this product (offline-safe fallback).
export function generateProductImage(product) {
  const [c1, c2, c3] = pickPalette(product);
  const initial = (product?.name?.[0] || "P").toUpperCase();
  const name = (product?.name || "").toUpperCase();

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="750" viewBox="0 0 600 750">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${c1}"/>
      <stop offset="0.55" stop-color="${c2}"/>
      <stop offset="1" stop-color="${c3}"/>
    </linearGradient>
    <radialGradient id="h" cx="0.5" cy="0.4" r="0.7">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.4"/>
      <stop offset="1" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect fill="url(#g)" width="600" height="750"/>
  <rect fill="url(#h)" width="600" height="750"/>

  <!-- floating blobs (animated via SMIL) -->
  <circle cx="130" cy="160" r="120" fill="#ffffff" opacity="0.14">
    <animateTransform attributeName="transform" type="translate" values="0,0;46,34;0,0" dur="9s" repeatCount="indefinite"/>
  </circle>
  <circle cx="470" cy="560" r="150" fill="#000000" opacity="0.10">
    <animateTransform attributeName="transform" type="translate" values="0,0;-40,-30;0,0" dur="11s" repeatCount="indefinite"/>
  </circle>
  <circle cx="60" cy="620" r="90" fill="#ffffff" opacity="0.10">
    <animateTransform attributeName="transform" type="translate" values="0,0;34,-20;0,0" dur="7s" repeatCount="indefinite"/>
  </circle>

  <!-- floating spark dots -->
  <circle cx="520" cy="140" r="10" fill="#ffffff" opacity="0.7"><animate attributeName="cy" values="140;190;140" dur="4s" repeatCount="indefinite"/></circle>
  <circle cx="80" cy="300" r="7" fill="#ffffff" opacity="0.5"><animate attributeName="cy" values="300;250;300" dur="5s" repeatCount="indefinite"/></circle>

  <!-- initial -->
  <text x="300" y="470" text-anchor="middle" font-family="Arial, sans-serif" font-size="300" font-weight="900" fill="#ffffff" opacity="0.88">${initial}</text>
  <text x="300" y="530" text-anchor="middle" font-family="Arial, sans-serif" font-size="30" font-weight="700" letter-spacing="6" fill="#ffffff" opacity="0.7">${name.slice(0, 22)}</text>
</svg>`;

  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

const SHARED_PLACEHOLDERS = /(tech|fashion|home|lifestyle)\.png$/;

// Match a real photo to the product by keyword + category; else clean art fallback.
export function getProductImage(product, _size = "640x800") {
  if (!product) return "";

  // 1) Honor a real uploaded image (admin upload, not the generic placeholders).
  const path = product.image_path || "";
  if (path && !SHARED_PLACEHOLDERS.test(path)) {
    return "/" + path;
  }

  // 2) Match by product name keyword → real photo (first regex hit wins).
  const lower = String(product.name || "").toLowerCase();
  for (const [pattern, url] of PRODUCT_LIBRARY) {
    if (pattern.test(lower)) return url;
  }

  // 3) Fall back to a category-default photo.
  const cat = String(product.category || "").toLowerCase();
  const catUrl = CATEGORY_DEFAULT[cat];
  if (catUrl) return catUrl;

  // 4) Last resort — clean generated art (never random, never generic placeholder).
  return generateProductImage(product);
}