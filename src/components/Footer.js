import { Link } from "react-router-dom";
import { LogoMark } from "./Logo";
import IconImg from "./IconImg";
import { BUSINESS } from "../data/business";

const socialLinks = [
  { href: BUSINESS.social.facebook, name: "facebook", label: "Facebook" },
  { href: BUSINESS.social.tiktok, name: "tiktok", label: "TikTok" },
  { href: BUSINESS.social.instagram, name: "instagram", label: "Instagram" },
];

export default function Footer() {
  return (
    <footer>
      <div style={{ padding: "40px 20px 28px", borderBottom: "1px solid #3A3A3A" }}>
        <div className="ft-grid" style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1.4fr", gap: 36 }}>
          <div>
            <div style={{ marginBottom: 14 }}>
              <LogoMark variant="black" height={44} alt="Badee Beauty" />
              <div style={{ fontFamily: "'Josefin Sans',sans-serif", fontWeight: 700, fontSize: 16, letterSpacing: ".12em", textTransform: "uppercase", color: "#fff", marginTop: 8 }}>
                BADEE BEAUTY
              </div>
              <div style={{ fontSize: 10, color: "#777", letterSpacing: ".1em", textTransform: "uppercase", marginTop: 3, fontFamily: "'Josefin Sans',sans-serif" }}>
                Système protection et Brillance
              </div>
            </div>
            <p style={{ fontSize: 12, lineHeight: 1.85, color: "#888", maxWidth: 220 }}>Beauté naturelle et luxueuse, née en Algérie pour sublimer chaque femme.</p>
            <div style={{ display: "flex", gap: 10, marginTop: 16, alignItems: "center" }}>
              {socialLinks.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  style={{
                    width: 36,
                    height: 36,
                    background: "#333",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "background .2s",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = "#D6247F";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = "#333";
                  }}
                >
                  <IconImg name={s.name} height={18} alt="" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4>À Propos</h4>
            <Link to="/about" style={{ color: "#999", textDecoration: "none", fontSize: 12, display: "block", marginBottom: 8 }}>
              À Propos
            </Link>
            <Link to="/mission" style={{ color: "#999", textDecoration: "none", fontSize: 12, display: "block", marginBottom: 8 }}>
              Notre mission
            </Link>
            <Link to="/blog" style={{ color: "#999", textDecoration: "none", fontSize: 12, display: "block", marginBottom: 8 }}>
              Blog beauté
            </Link>
          </div>
          <div>
            <h4>Liens Utiles</h4>
            <Link to="/privacy" style={{ color: "#999", textDecoration: "none", fontSize: 12, display: "block", marginBottom: 8 }}>
              Confidentialité
            </Link>
            <Link to="/terms" style={{ color: "#999", textDecoration: "none", fontSize: 12, display: "block", marginBottom: 8 }}>
              Conditions
            </Link>
            <Link to="/faq" style={{ color: "#999", textDecoration: "none", fontSize: 12, display: "block", marginBottom: 8 }}>
              FAQ
            </Link>
          </div>
          <div>
            <h4>Contact</h4>
            <div style={{ display: "flex", gap: 8, marginBottom: 10, fontSize: 12, alignItems: "flex-start" }}>
              <IconImg name="map" height={18} alt="" style={{ marginTop: 2 }} />
              <span style={{ color: "#888", lineHeight: 1.5 }}>{BUSINESS.address}</span>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 10, fontSize: 12, alignItems: "center" }}>
              <IconImg name="call" height={18} alt="" />
              <a href={`tel:${BUSINESS.phone}`} style={{ color: "#888", textDecoration: "none" }}>
                {BUSINESS.phoneDisplay}
              </a>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 10, fontSize: 12, alignItems: "center" }}>
              <IconImg name="email" height={18} alt="" />
              <a href={`mailto:${BUSINESS.email}`} style={{ color: "#888", textDecoration: "none" }}>
                {BUSINESS.email}
              </a>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 10, fontSize: 12, alignItems: "center" }}>
              <IconImg name="time" height={18} alt="" />
              <span style={{ color: "#888" }}>{BUSINESS.hours}</span>
            </div>
            <div style={{ marginTop: 12, padding: "10px 12px", background: "#111", borderRadius: 3, border: "1px solid #333", fontSize: 11, color: "#888", lineHeight: 1.7 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <IconImg name="delivery" height={16} alt="" />
                <strong style={{ color: "#fff" }}>Livraison COD</strong>
              </div>
              24H → Alger • 48-72H → Autres wilayas
            </div>
          </div>
        </div>
      </div>
      <div style={{ padding: "12px 20px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <p style={{ fontSize: 11, color: "#666" }}>© 2026 Badee Beauty. Tous droits réservés.</p>
          <span
            style={{
              background: "#333",
              border: "1px solid #444",
              borderRadius: 3,
              padding: "4px 10px",
              fontSize: 11,
              color: "#AAA",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <IconImg name="money" height={14} alt="" />
            Paiement COD uniquement
          </span>
          <p style={{ fontSize: 11, color: "#666", display: "flex", alignItems: "center", gap: 6 }}>
            <span>APPELEZ-NOUS :</span>
            <a href={`tel:${BUSINESS.phone}`} style={{ color: "#D6247F", fontWeight: 700, textDecoration: "none" }}>
              {BUSINESS.phoneDisplay}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
