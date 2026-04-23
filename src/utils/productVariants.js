import { getShadeVariants } from "./shadeUtils";

/** Categories where admin may define customer-selectable shades (Makeup / Hair Color). */
export function categoryAllowsOptions(cat) {
  const c = String(cat || "").trim();
  return c === "Makeup" || c === "Hair Color";
}

/** True when the customer must pick exactly one shade/option before add-to-cart. */
export function productRequiresOptionSelection(product) {
  if (!product || !categoryAllowsOptions(product.cat || product.category)) return false;
  return getShadeVariants(product).length > 0;
}
