/** Asset paths (from `public/`). */
export const LOGO_WHITE = "/whiteb.png";
export const LOGO_BLACK = "/blackb.png";
export const LOGO_FAVICON = "/logoB.png";

/**
 * Brand mark image. Use `whiteb` across the site; use `blackb` in the footer only.
 */
export function LogoMark({ variant = "white", height = 40, alt = "Badee Beauty", className, style }) {
  const src = variant === "black" ? LOGO_BLACK : LOGO_WHITE;
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={{
        height,
        width: "auto",
        maxWidth: "100%",
        objectFit: "contain",
        display: "block",
        ...style,
      }}
    />
  );
}

/** @deprecated Use `<LogoMark variant="white" />` — kept for quick refactors */
export function BIcon({ size = 36 }) {
  return <LogoMark variant="white" height={size} alt="" />;
}

export default function LogoFull({ compact = false }) {
  const h = compact ? 32 : 44;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
      <LogoMark variant="white" height={h} alt="" />
      <div>
        <div
          style={{
            fontFamily: "'Josefin Sans',sans-serif",
            fontWeight: 700,
            fontSize: compact ? 14 : 17,
            letterSpacing: ".05em",
            color: "#1A1A1A",
            lineHeight: 1.1,
          }}
        >
          BADEE <span style={{ fontFamily: "Georgia,serif", fontWeight: 400, fontSize: compact ? 15 : 18 }}>بديع</span>
        </div>
        {!compact && (
          <div
            style={{
              fontSize: 9,
              color: "#888",
              letterSpacing: ".1em",
              textTransform: "uppercase",
              marginTop: 2,
              fontFamily: "'Josefin Sans',sans-serif",
            }}
          >
            Système protection et Brillance
          </div>
        )}
      </div>
    </div>
  );
}
