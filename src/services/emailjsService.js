import emailjs from "@emailjs/browser";

/** Trim — .env values often have accidental spaces that break EmailJS. */
function env(name, ...fallbacks) {
  const pick = [name, ...fallbacks].map((k) => process.env[k]).find((v) => v != null && String(v).trim() !== "");
  return pick ? String(pick).trim() : "";
}

const PUBLIC_KEY = env("REACT_APP_EMAILJS_PUBLIC_KEY", "REACT_APP_EMAILJS_PUBLIC");
const SERVICE_ID = env("REACT_APP_EMAILJS_SERVICE_ID", "REACT_APP_EMAILJS_SERVICE");
const TEMPLATE_CONTACT = env(
  "REACT_APP_EMAILJS_TEMPLATE_CONTACT_ID",
  "REACT_APP_EMAILJS_TEMPLATE_CONTACT",
);
const TEMPLATE_ORDER = env(
  "REACT_APP_EMAILJS_TEMPLATE_ORDER_ID",
  "REACT_APP_EMAILJS_TEMPLATE_ORDER",
);

function sendOptions() {
  return PUBLIC_KEY ? { publicKey: PUBLIC_KEY } : undefined;
}

let inited = false;

function ensureInit() {
  if (!PUBLIC_KEY) return false;
  if (!inited) {
    emailjs.init({ publicKey: PUBLIC_KEY });
    inited = true;
  }
  return true;
}

/** True when public key + service + at least one template id are set. */
export function isEmailJsReady() {
  return Boolean(PUBLIC_KEY && SERVICE_ID && (TEMPLATE_CONTACT || TEMPLATE_ORDER));
}

export function isContactEmailConfigured() {
  return Boolean(PUBLIC_KEY && SERVICE_ID && TEMPLATE_CONTACT);
}

export function isOrderEmailConfigured() {
  return Boolean(PUBLIC_KEY && SERVICE_ID && TEMPLATE_ORDER);
}

/**
 * Contact page — template params (map names in EmailJS template to these keys):
 * - user_name, user_email, message
 */
export async function sendContactEmail({ user_name, user_email, message, user_phone }) {
  if (!TEMPLATE_CONTACT) throw new Error("EmailJS contact template id missing");
  if (!ensureInit()) throw new Error("EmailJS public key missing");
  const payload = {
    user_name,
    user_email,
    message,
  };
  if (user_phone) payload.user_phone = user_phone;
  return emailjs.send(SERVICE_ID, TEMPLATE_CONTACT, payload, sendOptions());
}

/**
 * Newsletter signup from blog — reuses the contact EmailJS template.
 * Template receives: user_name, user_email, message (and optional user_phone).
 */
export async function sendNewsletterSignupEmail(user_email) {
  const trimmed = String(user_email || "").trim();
  if (!trimmed) throw new Error("E-mail requis");
  return sendContactEmail({
    user_name: "Newsletter — Blog Kera Color",
    user_email: trimmed,
    message:
      "Inscription à la newsletter Badee Beauty (demande envoyée depuis l'article Kera Color sur le blog).",
    user_phone: "",
  });
}

/**
 * Order confirmation to the client — use these template variables in EmailJS:
 * - customer_email → set as "To Email" in template if you want the client to receive it
 * - customer_name, phone, wilaya, commune, note
 * - order_ref (e.g. BB-123456 or Mongo id), order_date (French long date)
 * - items_lines (plain-text lines), total, subtotal, delivery_fee
 */
export async function sendOrderConfirmationEmail(params) {
  if (!TEMPLATE_ORDER) {
    throw new Error("REACT_APP_EMAILJS_TEMPLATE_ORDER_ID is not set");
  }
  if (!ensureInit()) {
    throw new Error("REACT_APP_EMAILJS_PUBLIC_KEY is not set");
  }
  return emailjs.send(SERVICE_ID, TEMPLATE_ORDER, params, sendOptions());
}

export function buildOrderEmailParams({ summary, serverOrder, rawResponse }) {
  if (!summary) return null;
  const orderRef =
    serverOrder?._id ||
    serverOrder?.id ||
    rawResponse?.orderId ||
    summary.tempRef ||
    "—";
  const itemsLines = (summary.items || [])
    .map(
      (i) =>
        `• ${i.name}${i.selectedOption ? ` (${i.selectedOption})` : ""} × ${i.quantity} — ${(Number(i.price) * Number(i.quantity)).toLocaleString()} DA`,
    )
    .join("\n");
  return {
    customer_email: summary.customerEmail || "",
    customer_name: summary.customerName || "",
    phone: summary.phone || "",
    wilaya: summary.wilaya || "",
    commune: summary.commune || "",
    note: summary.note || "—",
    order_ref: String(orderRef),
    order_date: new Date().toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }),
    subtotal: String(summary.subtotal ?? ""),
    delivery_fee: String(summary.deliveryFee ?? ""),
    total: String(summary.total ?? ""),
    items_lines: itemsLines || "—",
  };
}
