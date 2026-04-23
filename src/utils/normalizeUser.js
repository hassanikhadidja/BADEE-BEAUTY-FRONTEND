/** Align backend user shape with the app (role casing, admin flag). */
export function normalizeUser(u) {
  if (!u || typeof u !== "object") return null;
  const role = String(u.role ?? "").toLowerCase().trim() || "client";
  return {
    ...u,
    role,
    isAdmin: role === "admin",
  };
}
