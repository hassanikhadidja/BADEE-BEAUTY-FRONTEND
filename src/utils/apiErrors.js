/** Detect HTML bodies (Vercel deployment protection, CDN errors, wrong URL). */
export function isLikelyHtmlGatewayBody(data) {
  if (data == null) return false;
  const s = typeof data === "string" ? data : "";
  if (!s || s.length < 80) return false;
  if (/<!DOCTYPE\s+html/i.test(s) || /<html[\s>]/i.test(s)) return true;
  if (/Authentication Required/i.test(s) && /vercel/i.test(s)) return true;
  return false;
}

export function apiUnreachableMessage() {
  return (
    "L’API ne répond pas correctement (page HTML au lieu de JSON). " +
    "Si l’API est sur Vercel : désactivez la protection des déploiements (Deployment Protection) " +
    "pour l’URL utilisée, ou utilisez l’URL de production publique. " +
    "Vérifiez aussi REACT_APP_API_BASE_URL dans le frontend."
  );
}
