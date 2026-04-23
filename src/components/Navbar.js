import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { NAV_PRODUCT_LINKS } from "../utils/productFilters";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { useLang } from "../context/LangContext";
import LogoFull from "./Logo";
import IconImg from "./IconImg";

export default function Navbar({ setCartOpen, setWishlistOpen }) {
  const [mob, setMob] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartCount = useSelector((s) => s.cart.items.reduce((n, i) => n + (i.quantity ?? i.qty ?? 1), 0));
  const wishCount = useSelector((s) => s.wishlist.ids.length);
  const { user, isAuthenticated } = useSelector((s) => s.auth);
  const isAdmin = user?.role === "admin";
  const { t } = useLang();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <>
      {/* Top utility bar */}
      <div className="nav-utility-wrap" style={{ background: "#EEF3EC", borderBottom: "1px solid #D4E8CF" }}>
        <div className="nav-utility-inner">
          <div className="nav-utility-left">
            <button
              type="button"
              className="nav-reorder-btn"
              aria-label={t.reorder}
              onClick={() => navigate("/products")}
              style={{ background: "none", border: "none", borderRight: "1px solid #D4E8CF", padding: "0 16px", minHeight: 50, cursor: "pointer", fontSize: 12, color: "#3A5A35", fontFamily: "'Josefin Sans',sans-serif", letterSpacing: ".04em", display: "flex", alignItems: "center", gap: 6, fontWeight: 600 }}
            >
              <IconImg name="returncircle" height={16} alt="" />
              <span className="nav-label-reorder">{t.reorder}</span>
            </button>

            {isAuthenticated ? (
              <>
                {/* Logged-in: show name + logout */}
                <span style={{ padding: "0 14px", minHeight: 50, display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#3A5A35", fontFamily: "'Josefin Sans',sans-serif", fontWeight: 600 }}>
                  <IconImg name="email" height={16} alt="" />
                  <span className="nav-user-name" title={user?.name || user?.email || ""}>
                    {user?.name || user?.email}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  style={{ background: "none", border: "none", borderLeft: "1px solid #D4E8CF", padding: "0 14px", minHeight: 50, cursor: "pointer", fontSize: 12, color: "#D6247F", fontFamily: "'Josefin Sans',sans-serif", letterSpacing: ".04em", display: "flex", alignItems: "center", gap: 6, fontWeight: 600 }}
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <Link
                to="/login"
                style={{ border: "none", padding: "0 16px", minHeight: 50, cursor: "pointer", fontSize: 12, color: "#3A5A35", fontFamily: "'Josefin Sans',sans-serif", letterSpacing: ".04em", display: "flex", alignItems: "center", gap: 6, fontWeight: 600, textDecoration: "none" }}
              >
                <IconImg name="email" height={16} alt="" />
                {t.signIn}
              </Link>
            )}
          </div>

          <div className="nav-utility-actions">
            {setWishlistOpen && (
              <button
                type="button"
                onClick={() => setWishlistOpen(true)}
                title={t.wishlistBtn}
                aria-label={t.wishlistBtn}
                style={{
                  padding: "8px 14px",
                  position: "relative",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  background: "#fff",
                  border: "1.5px solid #D6247F",
                  color: "#D6247F",
                  borderRadius: 3,
                  cursor: "pointer",
                  fontSize: 12,
                  fontFamily: "'Josefin Sans',sans-serif",
                  fontWeight: 700,
                  letterSpacing: ".04em",
                }}
              >
                <IconImg name="heart" height={17} alt="" />
                <span className="nav-wish-label">{t.wishlistBtn}</span>
                {wishCount > 0 && (
                  <span
                    style={{
                      background: "#D6247F",
                      color: "#fff",
                      borderRadius: "50%",
                      minWidth: 18,
                      height: 18,
                      fontSize: 11,
                      fontWeight: 900,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "0 5px",
                    }}
                  >
                    {wishCount}
                  </span>
                )}
              </button>
            )}
            <button type="button" className="btn-pink" onClick={() => setCartOpen(true)} aria-label={t.cartBtn} style={{ padding: "8px 16px", position: "relative", display: "inline-flex", alignItems: "center", gap: 6 }}>
              <IconImg name="basket" height={18} alt="" />
              <span className="nav-cart-label">{t.cartBtn}</span>
              {cartCount > 0 && (
                <span style={{ background: "#fff", color: "#D6247F", borderRadius: "50%", width: 18, height: 18, fontSize: 11, fontWeight: 900, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main nav bar */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E0E0E0", padding: "0 clamp(12px, 3vw, 20px)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", gap: 20, minHeight: 68, padding: "8px 0" }}>
          <button type="button" onClick={() => navigate("/")} style={{ background: "none", border: "none", cursor: "pointer", flexShrink: 0 }}>
            <LogoFull />
          </button>
          <div className="srch-area" style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", border: "1.5px solid #E0E0E0", borderRadius: 3, overflow: "hidden", maxWidth: 600 }}>
              <input
                placeholder="Recherchez des produits, des marques ou des catégories..."
                style={{ border: "none", outline: "none", padding: "10px 14px", fontSize: 13, flex: 1, fontFamily: "'Lato',sans-serif" }}
              />
              <button
                type="button"
                style={{ background: "#1A1A1A", color: "#fff", border: "none", padding: "10px 14px", cursor: "pointer", transition: "background .2s", display: "flex", alignItems: "center", justifyContent: "center" }}
                onMouseOver={(e) => { e.currentTarget.style.background = "#D6247F"; }}
                onMouseOut={(e) => { e.currentTarget.style.background = "#1A1A1A"; }}
                aria-label="Rechercher"
              >
                <IconImg name="search" height={18} alt="" style={{ filter: "brightness(0) invert(1)" }} />
              </button>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
            <button type="button" className="hamburger" onClick={() => setMob(true)}>
              <span /><span /><span />
            </button>
          </div>
        </div>
      </div>

      <NavCats isAdmin={isAdmin} />

      {/* Mobile menu */}
      <div className={`mob-menu${mob ? " open" : ""}`}>
        <div style={{ background: "#EEF3EC", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #D4E8CF" }}>
          <LogoFull compact />
          <button type="button" onClick={() => setMob(false)} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#1A1A1A" }}>×</button>
        </div>
        {[
          ["Accueil", "/"],
          ["Produits", "/products"],
          ["À Propos", "/about"],
          ["Notre mission", "/mission"],
          ["Blog beauté", "/blog"],
          ["FAQ", "/faq"],
          ["Contact", "/contact"],
        ].map(([label, path]) => (
          <div key={path} className="mob-item" onClick={() => { navigate(path); setMob(false); }}>
            {label}
            <span style={{ color: "#ccc" }}>›</span>
          </div>
        ))}
        {isAdmin && (
          <div className="mob-item" onClick={() => { navigate("/dashboard"); setMob(false); }} style={{ color: "#D6247F" }}>
            {t.dashboard}
            <span>›</span>
          </div>
        )}
        {isAuthenticated && (
          <div className="mob-item" onClick={() => { handleLogout(); setMob(false); }} style={{ color: "#888" }}>
            Déconnexion <span>›</span>
          </div>
        )}
      </div>
      {mob && <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", zIndex: 599 }} onClick={() => setMob(false)} role="presentation" />}
    </>
  );
}

function NavCats({ isAdmin }) {
  const navigate = useNavigate();
  return (
    <div className="desk-nav" style={{ background: "#fff", borderBottom: "2px solid #E0E0E0", padding: "0 20px", overflowX: "auto" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "stretch", flexWrap: "nowrap", gap: 0 }}>
        {NAV_PRODUCT_LINKS.map((item) =>
          item.variant === "sale" ? (
            <Link
              key={item.to}
              to={item.to}
              className="nav-tab sale"
              style={{ display: "inline-flex", alignItems: "center", gap: 6, textDecoration: "none", color: "inherit" }}
            >
              <IconImg name="fire" height={14} alt="" />
              {item.label}
            </Link>
          ) : (
            <Link key={item.to} to={item.to} className="nav-tab" style={{ textDecoration: "none", color: "inherit" }}>
              {item.label}
            </Link>
          ),
        )}

        {isAdmin && (
          <button
            type="button"
            className="nav-tab"
            onClick={() => navigate("/dashboard")}
            style={{ marginLeft: "auto", color: "#D6247F", fontSize: 11, fontWeight: 700 }}
          >
            ⚙ Admin
          </button>
        )}
      </div>
    </div>
  );
}
