// Generates a unique, colorful, ANIMATED product image per product —
// a deterministic "AI-style" art piece keyed by each product's id/name.
// No network needed. Every product looks distinct.

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

// lightweight string hash → stable index
const hashStr = (s = "") => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
};

const pickPalette = (product) => {
  const key = String(product?._id || "") + (product?.name || "");
  return PALETTES[hashStr(key) % PALETTES.length];
};

// Build an animated SVG data-URI unique to this product.
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

// Decide which image to show:
//  - a real per-product upload (admin-created) if it's unique
//  - otherwise a REAL, distinct photograph per product (seeded → stable + unique),
//    with the generated art as an offline-safe fallback.
const SHARED_PLACEHOLDERS = /(tech|fashion|home|lifestyle)\.png$/;

const slugify = (s) => (s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export function getProductImage(product, size = "640x800") {
  if (!product) return "";
  const path = product.image_path || "";
  if (path && !SHARED_PLACEHOLDERS.test(path)) {
    return "/" + path; // real uploaded image (e.g. uploads/products/...)
  }
  // Distinct real photography per product, stable per id/name
  const slug = `${String(product._id || "p")}-${slugify(product.name) || "item"}`;
  const [w, h] = size.split("x");
  return `https://picsum.photos/seed/${encodeURIComponent(slug)}/${w}/${h}`;
}