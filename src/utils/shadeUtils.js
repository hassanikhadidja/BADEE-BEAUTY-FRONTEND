/** Ensure #RRGGBB or #RGB for CSS */
export function normalizeHex(hex) {
  if (hex == null || String(hex).trim() === "") return "#CCCCCC";
  let h = String(hex).trim();
  if (!h.startsWith("#")) h = `#${h}`;
  if (/^#[0-9A-Fa-f]{3}$/.test(h) || /^#[0-9A-Fa-f]{6}$/.test(h)) return h;
  return "#CCCCCC";
}

/** Normalized shade row from API or legacy. */
export function normalizeShadeRow(s) {
  if (!s || typeof s !== "object") return null;
  const name = String(s.name ?? "").trim();
  if (!name) return null;
  const hex = normalizeHex(s.hex);
  const stock = s.stock != null && s.stock !== "" && !Number.isNaN(Number(s.stock)) ? Number(s.stock) : null;
  const price = s.price != null && s.price !== "" && !Number.isNaN(Number(s.price)) && Number(s.price) > 0 ? Number(s.price) : null;
  return { name, hex, stock, price };
}

/**
 * Prefer `shades` from API; fallback: legacy string[] `options` as gray swatches.
 */
export function getShadeVariants(product) {
  if (!product) return [];
  const raw = product.shades;
  if (Array.isArray(raw) && raw.length) {
    return raw.map(normalizeShadeRow).filter(Boolean);
  }
  const opts = product.options;
  if (Array.isArray(opts) && opts.length) {
    return opts.map((name) => normalizeShadeRow({ name: String(name), hex: "#E0E0E0" })).filter(Boolean);
  }
  return [];
}

export function findShadeByName(product, name) {
  const n = String(name || "").trim();
  if (!n) return null;
  return getShadeVariants(product).find((s) => s.name === n) || null;
}

/** Line price: shade override or product (already adapted) price. */
export function resolveLinePriceForShade(product, shade) {
  const base = Number(product?.price) || 0;
  if (shade && shade.price != null && shade.price > 0) return shade.price;
  return base;
}

/** Strike price only when using base product sale, not custom shade price. */
export function resolveLineOldForShade(product, shade) {
  if (shade && shade.price != null && shade.price > 0) return null;
  const o = product?.old;
  return o != null && o !== "" ? Number(o) : null;
}
