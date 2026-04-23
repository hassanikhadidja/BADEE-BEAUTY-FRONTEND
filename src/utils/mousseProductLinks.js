/**
 * Liens blog « Choisissez votre mousse » → fiche produit.
 *
 * 1) Définir dans .env (recommandé en prod) :
 *    REACT_APP_MOUSSE_ROSE_PRODUCT_ID, REACT_APP_MOUSSE_CITRON_PRODUCT_ID, REACT_APP_MOUSSE_MYRTILLE_PRODUCT_ID
 *    (valeur = _id Mongo du produit)
 * 2) Sinon : recherche dans le catalogue (nom contient "mousse" + rose / citron / myrtille).
 */

const ENV_IDS = {
  rose: process.env.REACT_APP_MOUSSE_ROSE_PRODUCT_ID,
  citron: process.env.REACT_APP_MOUSSE_CITRON_PRODUCT_ID,
  myrtille: process.env.REACT_APP_MOUSSE_MYRTILLE_PRODUCT_ID,
};

function normalize(str) {
  return String(str || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function nameMatchesVariant(normalizedName, variant) {
  if (!normalizedName.includes("mousse")) return false;
  if (variant === "rose") return normalizedName.includes("rose");
  if (variant === "citron") return normalizedName.includes("citron");
  if (variant === "myrtille") return normalizedName.includes("myrtille");
  return false;
}

function shadeNeedle(variant) {
  if (variant === "rose") return "rose";
  if (variant === "citron") return "citron";
  if (variant === "myrtille") return "myrtille";
  return "";
}

/** Un seul produit « mousse » avec teintes Rose / Citron / Myrtille dans shades[]. */
function findMousseProductAndShadeName(rawProducts, variant) {
  const needle = shadeNeedle(variant);
  if (!needle) return null;
  const list = Array.isArray(rawProducts) ? rawProducts : [];
  for (const p of list) {
    const n = normalize(p.name || "");
    if (!n.includes("mousse")) continue;
    const shades = p.shades;
    if (!Array.isArray(shades) || !shades.length) continue;
    const hit = shades.find((s) => normalize(String(s.name || "")).includes(needle));
    if (hit && String(hit.name || "").trim()) {
      return { id: p._id || p.id, teinte: String(hit.name).trim() };
    }
  }
  return null;
}

function productPathWithOptionalTeinte(id, teinte) {
  const base = `/product/${id}`;
  if (!teinte) return base;
  return `${base}?teinte=${encodeURIComponent(teinte)}`;
}

export function getMousseProductPath(rawProducts, variant) {
  const envId = String(ENV_IDS[variant] || "").trim();
  if (envId) return `/product/${envId}`;

  const list = Array.isArray(rawProducts) ? rawProducts : [];

  const byName = list.find((p) => nameMatchesVariant(normalize(p.name || ""), variant));
  if (byName) {
    const id = byName._id || byName.id;
    if (id != null && String(id).length) return `/product/${id}`;
  }

  const byShade = findMousseProductAndShadeName(list, variant);
  if (byShade && byShade.id != null && String(byShade.id).length) {
    return productPathWithOptionalTeinte(byShade.id, byShade.teinte);
  }

  return "/products";
}
