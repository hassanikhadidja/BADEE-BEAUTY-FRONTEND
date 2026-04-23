import { API_BASE_URL } from "../services/api";

/**
 * Optional: set REACT_APP_MEDIA_BASE_URL in .env when files are served from another host than the API
 * (e.g. CDN or a static subdomain). Defaults to API_BASE_URL.
 */
function mediaBase() {
  const env = typeof process !== "undefined" && process.env.REACT_APP_MEDIA_BASE_URL;
  const base = (env || API_BASE_URL || "").replace(/\/$/, "");
  return base;
}

/**
 * Turn a stored path (/uploads/...), filename, or absolute URL into a browser-loadable URL.
 */
export function resolveMediaUrl(src) {
  if (src == null || src === "") return "";
  if (typeof src === "object" && src !== null) {
    if (typeof src.url === "string") return resolveMediaUrl(src.url);
    return "";
  }

  let s = typeof src === "string" ? src.trim() : String(src);
  if (!s || s === "product image") return "";

  s = s.replace(/\\/g, "/");

  if (/^https?:\/\//i.test(s)) {
    if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i.test(s)) {
      try {
        const u = new URL(s);
        return `${mediaBase()}${u.pathname}${u.search}`;
      } catch {
        return s;
      }
    }
    return s;
  }

  if (s.startsWith("//")) {
    return `https:${s}`;
  }

  if (s.startsWith("data:") || s.startsWith("blob:")) return s;

  const base = mediaBase();
  let path = s.startsWith("/") ? s : `/${s}`;

  // Bare filename → common Express static folder
  const tail = path.startsWith("/") ? path.slice(1) : path;
  if (!tail.includes("/") && /\.(jpe?g|png|webp|gif|svg|avif)$/i.test(tail)) {
    path = `/uploads/${tail}`;
  }

  return base ? `${base}${path}` : path;
}
