import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { removeFromWishlist } from "../redux/wishlistSlice";
import { useLang } from "../context/LangContext";
import { adaptProduct } from "../utils/shopAdapters";
import ProductCard from "./ProductCard";
import IconImg from "./IconImg";

export default function WishlistDrawer({ open, setOpen, openCart }) {
  const dispatch = useDispatch();
  const { t } = useLang();
  const ids = useSelector((s) => s.wishlist.ids);
  const raw = useSelector((s) => s.products.products);

  const { resolved, staleIds } = useMemo(() => {
    const all = (raw || []).map(adaptProduct).filter(Boolean);
    const byId = new Map(all.map((p) => [String(p.id), p]));
    const resolved = [];
    const staleIds = [];
    ids.forEach((id) => {
      const p = byId.get(String(id));
      if (p) resolved.push(p);
      else staleIds.push(String(id));
    });
    return { resolved, staleIds };
  }, [ids, raw]);

  return (
    <>
      <div className={`cart-ov${open ? " open" : ""}`} onClick={() => setOpen(false)} role="presentation" />
      <div className={`cart-drawer wishlist-drawer${open ? " open" : ""}`}>
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid #f5c6db",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "linear-gradient(90deg, #fdf2f7 0%, #fff 100%)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <IconImg name="heart" height={20} alt="" style={{ opacity: 0.9 }} />
            <div>
              <h3 style={{ fontFamily: "'Josefin Sans',sans-serif", fontWeight: 700, fontSize: 15, letterSpacing: ".06em", textTransform: "uppercase", color: "#1A1A1A" }}>
                {t.wishlistTitle}
              </h3>
              {ids.length > 0 && (
                <p style={{ fontSize: 11, color: "#666", marginTop: 2 }}>
                  {ids.length} article{ids.length > 1 ? "s" : ""}
                </p>
              )}
            </div>
          </div>
          <button type="button" onClick={() => setOpen(false)} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#1A1A1A", lineHeight: 1 }}>
            ×
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px 20px" }}>
          {ids.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 12px", color: "#888" }}>
              <div style={{ marginBottom: 14, display: "flex", justifyContent: "center", opacity: 0.5 }}>
                <IconImg name="heart" height={52} alt="" />
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.6, maxWidth: 280, margin: "0 auto" }}>{t.wishlistEmpty}</p>
              <Link
                to="/products"
                className="btn-pink"
                style={{ marginTop: 20, display: "inline-flex", padding: "11px 22px", textDecoration: "none", fontSize: 12 }}
                onClick={() => setOpen(false)}
              >
                {t.viewAll}
              </Link>
            </div>
          ) : (
            <>
              {staleIds.length > 0 && (
                <div style={{ marginBottom: 14, padding: "10px 12px", background: "#FFF8E1", border: "1px solid #FFE082", borderRadius: 6, fontSize: 12, color: "#7A5C00" }}>
                  {staleIds.length} favori(s) ne figurent plus au catalogue — vous pouvez les retirer.
                  <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {staleIds.map((sid) => (
                      <button
                        key={sid}
                        type="button"
                        onClick={() => dispatch(removeFromWishlist(sid))}
                        style={{
                          fontSize: 11,
                          padding: "4px 10px",
                          borderRadius: 4,
                          border: "1px solid #E0C96A",
                          background: "#fff",
                          cursor: "pointer",
                        }}
                      >
                        Retirer ({sid.slice(-6)})
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="product-grid product-grid--dense">
                {resolved.map((p) => (
                  <ProductCard key={p.id} product={p} openCart={openCart} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
