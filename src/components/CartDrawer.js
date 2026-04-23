import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { updateQty, getCartLineId } from "../redux/cartSlice";
import ShadeSwatch from "./ShadeSwatch";
import { useLang } from "../context/LangContext";
import { resolveMediaUrl } from "../utils/mediaUrl";
import IconImg from "./IconImg";

function resolveImg(img) {
  if (Array.isArray(img)) return img[0] || "";
  return img || "";
}

export default function CartDrawer({ open, setOpen }) {
  const dispatch = useDispatch();
  const cart = useSelector((s) => s.cart.items);
  const { t } = useLang();
  const qtyOf = (i) => i.quantity ?? i.qty ?? 1;
  const total = cart.reduce((s, i) => s + i.price * qtyOf(i), 0);
  const upd = (cartLineId, d) => dispatch(updateQty({ cartLineId, delta: d }));

  return (
    <>
      <div className={`cart-ov${open ? " open" : ""}`} onClick={() => setOpen(false)} role="presentation" />
      <div className={`cart-drawer${open ? " open" : ""}`}>

        {/* Header */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #E0E0E0", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#EEF3EC" }}>
          <div>
            <h3 style={{ fontFamily: "'Josefin Sans',sans-serif", fontWeight: 700, fontSize: 15, letterSpacing: ".06em", textTransform: "uppercase" }}>{t.cartTitle}</h3>
            {cart.length > 0 && <p style={{ fontSize: 11, color: "#666", marginTop: 2 }}>{cart.reduce((s, i) => s + qtyOf(i), 0)} article(s)</p>}
          </div>
          <button type="button" onClick={() => setOpen(false)} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#1A1A1A", lineHeight: 1 }}>×</button>
        </div>

        {/* COD banner */}
        <div style={{ background: "#1A1A1A", color: "#fff", padding: "9px 20px", fontSize: 12, display: "flex", alignItems: "center", gap: 8 }}>
          <IconImg name="money" height={18} alt="" style={{ filter: "brightness(0) invert(1)" }} />
          <strong>{t.cod}</strong>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "10px 20px" }}>
          {!cart.length ? (
            <div style={{ textAlign: "center", padding: "56px 0", color: "#BBB" }}>
              <div style={{ marginBottom: 12, display: "flex", justifyContent: "center" }}>
                <IconImg name="basket" height={48} alt="" />
              </div>
              <p style={{ fontFamily: "'Josefin Sans',sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: ".05em", textTransform: "uppercase" }}>{t.cartEmpty}</p>
            </div>
          ) : (
            cart.map((item) => {
              const imgSrc = resolveMediaUrl(resolveImg(item.img));
              const lineId = getCartLineId(item);
              return (
                <div key={lineId} style={{ display: "flex", gap: 12, padding: "12px 0", borderBottom: "1px solid #F0F0F0" }}>
                  {/* Thumbnail */}
                  <div
                    className="shop-thumb shop-thumb--cart"
                    style={{ background: item.bg || "#F7F7F7" }}
                  >
                    {imgSrc ? (
                      <img
                        src={imgSrc}
                        alt={item.name}
                        onError={(e) => { e.currentTarget.style.display = "none"; }}
                      />
                    ) : (
                      <IconImg name="basket" height={24} alt="" />
                    )}
                  </div>

                  {/* Details */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A", marginBottom: 3, lineHeight: 1.3, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      {item.selectedHex ? (
                        <ShadeSwatch hex={item.selectedHex} title={item.selectedOption || ""} />
                      ) : null}
                      <span>{item.name}</span>
                    </p>
                    {item.selectedOption ? (
                      <p style={{ fontSize: 11, color: "#D6247F", fontWeight: 600, marginBottom: 4 }}>{item.selectedOption}</p>
                    ) : null}
                    {item.old && (
                      <p style={{ fontSize: 10, color: "#D6247F", fontWeight: 700, marginBottom: 4 }}>
                        -{Math.round((1 - item.price / item.old) * 100)}% de réduction
                      </p>
                    )}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", border: "1px solid #E0E0E0", borderRadius: 3, overflow: "hidden" }}>
                        <button type="button" className="qty-btn" onClick={() => upd(lineId, -1)}>−</button>
                        <span style={{ width: 32, textAlign: "center", fontWeight: 700, fontSize: 13 }}>{qtyOf(item)}</span>
                        <button type="button" className="qty-btn" onClick={() => upd(lineId, 1)}>+</button>
                      </div>
                      <span style={{ fontWeight: 700, fontSize: 14 }}>
                        {(item.price * qtyOf(item)).toLocaleString()} {t.da}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {/* Free sample upsell */}
          {cart.length > 0 && total < 8500 && (
            <div style={{ background: "#FFF8E1", border: "1px solid #FFE082", borderRadius: 3, padding: "10px 13px", marginTop: 10, fontSize: 12, color: "#7A5C00", display: "flex", alignItems: "flex-start", gap: 8 }}>
              <IconImg name="delivery" height={18} alt="" style={{ flexShrink: 0, marginTop: 2 }} />
              <span>
                <strong>Ajoutez {(8500 - total).toLocaleString()} {t.da}</strong> pour 1 échantillon gratuit!
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div style={{ padding: "14px 20px", borderTop: "1px solid #E0E0E0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ fontSize: 13, color: "#666" }}>Sous-total :</span>
              <span style={{ fontWeight: 700, fontSize: 17 }}>{total.toLocaleString()} {t.da}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14, fontSize: 12, color: "#AAA" }}>
              <span>Expédition :</span>
              <span>à venir</span>
            </div>
            <Link
              to="/checkout"
              className="btn-pink"
              style={{ width: "100%", padding: "13px", justifyContent: "center", fontSize: 14, letterSpacing: ".06em", textDecoration: "none", display: "flex" }}
              onClick={() => setOpen(false)}
            >
              {t.checkout} →
            </Link>
            <button
              type="button"
              style={{ width: "100%", marginTop: 8, padding: "10px", background: "#fff", border: "1.5px solid #E0E0E0", borderRadius: 3, fontSize: 12, cursor: "pointer", color: "#666", fontFamily: "'Josefin Sans',sans-serif", fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase" }}
              onClick={() => setOpen(false)}
            >
              Continuer mes achats
            </button>
          </div>
        )}
      </div>
    </>
  );
}
