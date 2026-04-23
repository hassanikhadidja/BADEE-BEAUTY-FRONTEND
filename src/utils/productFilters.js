/** Allowed shop categories (URL slug → matches DB `category` variants). */
export const CATEGORY_SLUGS = ["skincare", "makeup", "hair-care", "hair-color", "fragrance"];

export const CATEGORY_SLUG_LABELS = {
  skincare: "Skincare",
  makeup: "Makeup",
  "hair-care": "Hair Care",
  "hair-color": "Couleur de cheveux",
  fragrance: "Fragrance",
};

/** Top nav + sidebar: Boutique + categories + Soins + Soldes */
export const NAV_PRODUCT_LINKS = [
  { to: "/products", label: "Boutique" },
  { to: "/products?category=skincare", label: "Skincare" },
  { to: "/products?category=makeup", label: "Makeup" },
  { to: "/products?category=hair-care", label: "Hair Care" },
  { to: "/products?category=hair-color", label: "Couleur cheveux" },
  { to: "/products?view=soins", label: "Soins" },
  { to: "/products?view=sale", label: "Soldes", variant: "sale" },
];

/** Sidebar: Tous + same category slugs + special views */
export const SIDEBAR_FILTER_OPTIONS = [
  { label: "Tous", params: {} },
  { label: "Skincare", params: { category: "skincare" } },
  { label: "Makeup", params: { category: "makeup" } },
  { label: "Hair Care", params: { category: "hair-care" } },
  { label: "Couleur de cheveux", params: { category: "hair-color" } },
  { label: "Fragrance", params: { category: "fragrance" } },
  { label: "Soins", params: { view: "soins" } },
  { label: "Soldes", params: { view: "sale" } },
];

function norm(s) {
  return String(s || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");
}

/**
 * Map product.category (adapted `cat`) to a slug, or null if outside the 5 rayons.
 */
export function getProductCategorySlug(p) {
  const c = norm(p.cat || p.category);
  if (c === "skincare") return "skincare";
  if (c === "makeup") return "makeup";
  if (c === "hair care" || c === "haircare") return "hair-care";
  if (c === "hair color" || c === "couleur de cheveux" || c.replace(/[\s-]/g, "") === "haircolor") return "hair-color";
  if (c === "fragrance") return "fragrance";
  return null;
}

export function productMatchesCategorySlug(p, slug) {
  if (!slug || !CATEGORY_SLUGS.includes(slug)) return false;
  return getProductCategorySlug(p) === slug;
}

export function productOnSale(p) {
  const old = p.old;
  if (old == null || old === "") return false;
  return Number(old) > Number(p.price);
}

/** Sous-catégorie ou tag contient « soins » (insensible à la casse / accents). */
export function productMatchesSoins(p) {
  const sub = norm(p.subCategory);
  if (sub.includes("soins")) return true;
  const tags = Array.isArray(p.tags) ? p.tags : [];
  return tags.some((t) => norm(t).includes("soins"));
}

export function parseProductListParams(searchParams) {
  const view = (searchParams.get("view") || "").toLowerCase();
  const category = (searchParams.get("category") || "").toLowerCase();
  return { view: view === "sale" || view === "soins" ? view : "", category: CATEGORY_SLUGS.includes(category) ? category : "" };
}

export function filterProductsByParams(products, { view, category }) {
  let list = products;
  if (view === "sale") list = list.filter(productOnSale);
  else if (view === "soins") list = list.filter(productMatchesSoins);
  else if (category) list = list.filter((p) => productMatchesCategorySlug(p, category));
  return list;
}

export function pageTitleFromParams({ view, category }) {
  if (view === "sale") return "Soldes";
  if (view === "soins") return "Soins";
  if (category && CATEGORY_SLUG_LABELS[category]) return CATEGORY_SLUG_LABELS[category];
  return "Tous";
}

export function isSidebarOptionActive(opt, searchParams) {
  const { view, category } = parseProductListParams(searchParams);
  const p = opt.params;
  if (!p || Object.keys(p).length === 0) return !view && !category;
  if (p.view) return view === p.view;
  if (p.category) return category === p.category && !view;
  return false;
}
