import { normalizeShadeRow } from "./shadeUtils";

/** Map API / mixed product docs to UI shape used by ProductCard, filters, routes. */
export function adaptProduct(p) {
  if (!p) return null;
  const id = p._id || p.id;

  // img: backend stores an array of strings. Normalise to array always.
  // Filter out the Mongoose default placeholder "product image".
  const rawImg = p.img ?? p.images ?? p.image ?? [];
  const imgArr = (Array.isArray(rawImg) ? rawImg : [rawImg])
    .map((x) => (typeof x === "string" ? x : x && typeof x === "object" && x.url ? x.url : x))
    .filter((s) => s && typeof s === "string" && s !== "product image");

  // Backend: `price` = catalogue price, `discountPrice` = reduced price when on sale
  const listPrice = Number(p.price) || 0;
  const discRaw = p.discountPrice;
  const hasDiscount =
    discRaw != null && discRaw !== "" && !Number.isNaN(Number(discRaw)) && Number(discRaw) > 0;
  const salePrice = hasDiscount ? Number(discRaw) : listPrice;
  const showStrike = hasDiscount && salePrice < listPrice;
  const old = showStrike ? listPrice : p.oldPrice != null || p.old != null
    ? Number(p.oldPrice ?? p.old) || null
    : null;
  const price = showStrike ? salePrice : listPrice;

  const skinType = Array.isArray(p.skinType) ? p.skinType : p.skinType ? [p.skinType] : [];
  const benefits = Array.isArray(p.benefits)
    ? p.benefits
    : typeof p.benefits === "string" && p.benefits
      ? p.benefits.split(",").map((b) => b.trim()).filter(Boolean)
      : [];
  const tags = Array.isArray(p.tags)
    ? p.tags
    : typeof p.tags === "string" && p.tags
      ? p.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

  let options = [];
  const rawOpt = p.options;
  if (Array.isArray(rawOpt)) {
    options = rawOpt.map((x) => (typeof x === "string" ? x : x?.name)).map((s) => String(s || "").trim()).filter(Boolean);
  } else if (typeof rawOpt === "string" && rawOpt.trim()) {
    try {
      const parsed = JSON.parse(rawOpt);
      options = Array.isArray(parsed) ? parsed.map((s) => String(s).trim()).filter(Boolean) : [];
    } catch {
      options = rawOpt.split(",").map((s) => s.trim()).filter(Boolean);
    }
  }

  let packProducts = [];
  const rawPack = p.packProducts;
  if (Array.isArray(rawPack) && rawPack.length) {
    packProducts = rawPack
      .map((x) => ({
        name: String(x?.name || "").trim(),
        volume: String(x?.volume || "").trim(),
        type: String(x?.type || "").trim(),
      }))
      .filter((row) => row.name || row.volume || row.type);
  }

  let shades = [];
  const rawShades = p.shades;
  if (Array.isArray(rawShades) && rawShades.length) {
    shades = rawShades.map(normalizeShadeRow).filter(Boolean);
  } else if (typeof rawShades === "string" && rawShades.trim()) {
    try {
      const parsed = JSON.parse(rawShades);
      shades = Array.isArray(parsed) ? parsed.map(normalizeShadeRow).filter(Boolean) : [];
    } catch {
      shades = [];
    }
  }

  return {
    ...p,
    id,
    _id: id,
    name: p.name || "",
    cat: p.category || p.cat || "",
    category: p.category || p.cat || "",
    subCategory: p.subCategory || "",
    brand: p.brand || "",
    description: p.description || "",
    price,
    old,
    img: imgArr,
    r: Number(p.rating ?? p.r) || 0,
    rev: Number(p.reviews ?? p.rev) || 0,
    badge: p.badge || null,
    isNew: Boolean(p.isNew),
    isTrending: Boolean(p.isTrending),
    offer: Boolean(p.offer),
    bg: p.bg || "#F5EDE4",
    skinType,
    benefits,
    tags,
    options,
    shades,
    isAvailable: p.isAvailable !== false,
    isPack: Boolean(p.isPack),
    packProducts,
  };
}

/** Map API order docs to dashboard table shape. */
export function adaptOrder(o) {
  if (!o) return null;
  const id = o._id || o.id;
  let lineItems = [];
  let itemsCount = 0;
  if (Array.isArray(o.items)) {
    lineItems = o.items;
    itemsCount = lineItems.reduce((n, line) => n + (line.quantity || line.qty || 1), 0);
  } else if (typeof o.items === "number") {
    itemsCount = o.items;
  }
  const created = o.createdAt ? new Date(o.createdAt) : null;
  return {
    ...o,
    id,
    _id: id,
    lineItems,
    cust: o.customerName || o.user?.name || o.cust || o.phone || "—",
    w: o.wilaya || o.w || "—",
    date: created
      ? created.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })
      : o.date || "—",
    items: itemsCount,
    subtotal: Number(o.subtotal) || 0,
    deliveryFee: Number(o.deliveryFee) || 0,
    total: Number(o.total) || 0,
    status: o.status || "pending",
  };
}