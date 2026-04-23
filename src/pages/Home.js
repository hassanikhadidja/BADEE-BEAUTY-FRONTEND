import { useMemo } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useSelector } from "react-redux";
import { adaptProduct } from "../utils/shopAdapters";
import Hero from "../components/Hero";
import FeatStrip from "../components/FeatStrip";
import ProductCard from "../components/ProductCard";
import { LogoMark } from "../components/Logo";
import IconImg from "../components/IconImg";
import { useLang } from "../context/LangContext";

export default function Home() {
  const navigate = useNavigate();
  const { t } = useLang();
  const { openCart } = useOutletContext();
  const raw = useSelector((s) => s.products.products);
  const prods = useMemo(() => (raw || []).map(adaptProduct).filter(Boolean), [raw]);

  const newAndTrending = useMemo(
    () => prods.filter((p) => p.isNew || p.isTrending),
    [prods],
  );
  const soldes = useMemo(() => prods.filter((p) => p.old).slice(0, 4), [prods]);

  return (
    <>
      <Hero />
      <FeatStrip />
      <div style={{ padding: "36px 20px", background: "#fff" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 18, borderBottom: "2px solid #E0E0E0", paddingBottom: 10 }}>
            <div>
              <div style={{ fontSize: 10, color: "#D6247F", fontFamily: "'Josefin Sans',sans-serif", fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 3 }}>
                — Collection vedette —
              </div>
              <h2 style={{ fontFamily: "'Josefin Sans',sans-serif", fontWeight: 700, fontSize: 20, letterSpacing: ".05em", textTransform: "uppercase" }}>New &amp; Trending</h2>
            </div>
            <button type="button" className="btn-pk-out" onClick={() => navigate("/products")} style={{ padding: "8px 18px", fontSize: 11 }}>
              {t.viewAll} →
            </button>
          </div>
          <div className="product-grid">
            {newAndTrending.length === 0 ? (
              <p style={{ gridColumn: "1 / -1", fontSize: 14, color: "#777", margin: "8px 0 0" }}>
                Aucun produit n’est marqué <strong>nouveau</strong> ou <strong>tendance</strong> pour le moment. Cochez au moins l’une des deux options dans l’admin produit pour les afficher ici.
              </p>
            ) : (
              newAndTrending.map((p) => <ProductCard key={p.id} product={p} openCart={openCart} />)
            )}
          </div>
        </div>
      </div>
      <div style={{ padding: "36px 20px", background: "#F7F7F7" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 18, borderBottom: "2px solid #D6247F", paddingBottom: 10 }}>
            <div>
              <div style={{ fontSize: 10, color: "#D6247F", fontFamily: "'Josefin Sans',sans-serif", fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 3 }}>Offres exclusives</div>
              <h2 style={{ fontFamily: "'Josefin Sans',sans-serif", fontWeight: 700, fontSize: 20, letterSpacing: ".05em", textTransform: "uppercase", color: "#D6247F", display: "flex", alignItems: "center", gap: 8 }}>
                <IconImg name="fire" height={22} alt="" />
                Soldes
              </h2>
            </div>
            <button type="button" className="btn-pink" onClick={() => navigate("/products")} style={{ padding: "8px 18px", fontSize: 11 }}>
              {t.viewAll} →
            </button>
          </div>
          <div className="product-grid">
            {soldes.length === 0 ? (
              <p style={{ gridColumn: "1 / -1", fontSize: 14, color: "#777", margin: "8px 0 0" }}>
                Aucun produit en solde pour le moment.
              </p>
            ) : (
              soldes.map((p) => <ProductCard key={p.id} product={p} openCart={openCart} />)
            )}
          </div>
        </div>
      </div>
      <div style={{ background: "#1A1A1A", color: "#fff", padding: "48px 20px" }}>
        <div className="brand-grid" style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 10, color: "#D6247F", fontFamily: "'Josefin Sans',sans-serif", fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 14 }}>Notre Marque</div>
            <h2 style={{ fontFamily: "'Josefin Sans',sans-serif", fontWeight: 700, fontSize: 26, letterSpacing: ".05em", textTransform: "uppercase", marginBottom: 14, lineHeight: 1.3 }}>
              BADEE <span style={{ fontFamily: "Georgia,serif", fontWeight: 400, fontSize: 28 }}>بديع</span>
              <br />
              <span style={{ fontWeight: 300, fontSize: 17, letterSpacing: ".12em" }}>Système protection et Brillance</span>
            </h2>
            <p style={{ color: "#999", lineHeight: 1.85, fontSize: 14, marginBottom: 24 }}>
              Fondée en Algérie, Badee Beauty est née d'une passion pour la beauté authentique. Chaque produit est formulé pour protéger, nourrir et révéler l'éclat naturel de votre peau avec des ingrédients naturels soigneusement sélectionnés.
            </p>
            <div style={{ display: "flex", gap: 36 }}>
              {[
                ["100%", "Naturel"],
                ["2K+", "Clientes"],
              ].map(([n, l]) => (
                <div key={l}>
                  <div style={{ fontFamily: "'Josefin Sans',sans-serif", fontWeight: 700, fontSize: 22, color: "#D6247F" }}>{n}</div>
                  <div style={{ fontSize: 12, color: "#777", marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 12 }}>
            <LogoMark variant="black" height={100} alt="" />
            <div style={{ fontFamily: "'Josefin Sans',sans-serif", fontWeight: 700, fontSize: 20, letterSpacing: ".14em", textTransform: "uppercase" }}>BADEE BEAUTY</div>
            <div style={{ fontSize: 11, color: "#666", letterSpacing: ".1em", textTransform: "uppercase", fontFamily: "'Josefin Sans',sans-serif" }}>Système protection et Brillance</div>
          </div>
        </div>
      </div>
    </>
  );
}
