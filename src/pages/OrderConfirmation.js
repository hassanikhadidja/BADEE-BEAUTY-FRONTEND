import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useLang } from "../context/LangContext";
import { resolveMediaUrl } from "../utils/mediaUrl";
import ShadeSwatch from "../components/ShadeSwatch";
import IconImg from "../components/IconImg";

/**
 * Shown after checkout. Expects `location.state` from Checkout:
 * { serverOrder?, summary: { customerName, phone, wilaya, commune, items, subtotal, deliveryFee, total, note, tempRef } }
 */
export default function OrderConfirmation() {
  const location = useLocation();
  const lastOrder = useSelector((s) => s.orders.lastOrder);
  const { t } = useLang();

  const state = location.state || {};
  const serverOrder = state.serverOrder || lastOrder;
  const summary = state.summary;

  const hasData = Boolean(summary || serverOrder);

  const refLabel = useMemo(() => {
    if (serverOrder?._id) return String(serverOrder._id).slice(-8).toUpperCase();
    if (serverOrder?.id) return String(serverOrder.id).slice(-8).toUpperCase();
    if (summary?.tempRef) return summary.tempRef;
    return "—";
  }, [serverOrder, summary]);

  const customerName = serverOrder?.customerName || summary?.customerName || "—";
  const phone = serverOrder?.phone || summary?.phone || "—";
  const wilaya = serverOrder?.wilaya || summary?.wilaya || "—";
  const commune = String(serverOrder?.commune ?? summary?.commune ?? "").trim();
  const subtotal = Number(serverOrder?.subtotal ?? summary?.subtotal) || 0;
  const deliveryFee = Number(serverOrder?.deliveryFee ?? summary?.deliveryFee) || 0;
  const total = Number(serverOrder?.total ?? summary?.total) || 0;
  const note = serverOrder?.note ?? summary?.note ?? "";
  const status = serverOrder?.status || "pending";

  const lineItems = useMemo(() => {
    if (Array.isArray(serverOrder?.items) && serverOrder.items.length) {
      return serverOrder.items.map((it) => ({
        name: it.name || "Produit",
        quantity: it.quantity || it.qty || 1,
        price: Number(it.price) || 0,
        img: it.img,
        selectedOption: it.selectedOption || "",
        selectedHex: it.selectedHex || "",
      }));
    }
    if (Array.isArray(summary?.items)) return summary.items;
    return [];
  }, [serverOrder, summary]);

  if (!hasData) {
    return (
      <div style={{ padding: "48px 20px", textAlign: "center", maxWidth: 480, margin: "0 auto" }}>
        <p style={{ color: "#666", marginBottom: 20 }}>Aucune information de commande à afficher.</p>
        <Link to="/" className="btn-pink" style={{ display: "inline-flex", textDecoration: "none", padding: "12px 24px" }}>
          Retour à l&apos;accueil
        </Link>
      </div>
    );
  }

  return (
    <div style={{ background: "#F7F7F7", padding: "40px 20px 56px", minHeight: "60vh" }}>
      <div style={{ maxWidth: 520, margin: "0 auto" }}>
        <div
          style={{
            background: "#fff",
            border: "1px solid #E0E0E0",
            borderRadius: 8,
            boxShadow: "0 12px 40px rgba(0,0,0,.08)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #EEF3EC 0%, #fff 100%)",
              borderBottom: "2px solid #D6247F",
              padding: "28px 24px",
              textAlign: "center",
            }}
          >
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "#D6247F",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <IconImg name="delivery" height={28} alt="" style={{ filter: "brightness(0) invert(1)" }} />
              </div>
            </div>
            <h1 style={{ fontFamily: "'Josefin Sans',sans-serif", fontSize: 22, margin: 0, letterSpacing: ".04em", textTransform: "uppercase" }}>
              Commande envoyée
            </h1>
            <p style={{ margin: "10px 0 0", fontSize: 13, color: "#555", lineHeight: 1.5 }}>
              Merci ! Nous avons bien reçu votre commande. Référence&nbsp;:
              <strong style={{ color: "#D6247F", marginLeft: 6 }}>{refLabel}</strong>
            </p>
            <p style={{ margin: "8px 0 0", fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: ".08em" }}>
              Statut : {status}
            </p>
          </div>

          <div style={{ padding: "22px 24px" }}>
            <h2 style={{ fontFamily: "'Josefin Sans',sans-serif", fontSize: 12, letterSpacing: ".1em", textTransform: "uppercase", color: "#888", margin: "0 0 12px" }}>
              Livraison
            </h2>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>{customerName}</p>
            <p style={{ margin: "6px 0 0", fontSize: 14, color: "#555" }}>{phone}</p>
            <p style={{ margin: "6px 0 0", fontSize: 13, color: "#666" }}>
              {commune ? `${commune}, ${wilaya}` : wilaya}
            </p>
            {note ? (
              <p style={{ margin: "12px 0 0", fontSize: 12, color: "#777", fontStyle: "italic" }}>Note : {note}</p>
            ) : null}
          </div>

          <div style={{ padding: "0 24px 22px" }}>
            <h2 style={{ fontFamily: "'Josefin Sans',sans-serif", fontSize: 12, letterSpacing: ".1em", textTransform: "uppercase", color: "#888", margin: "0 0 12px" }}>
              Articles
            </h2>
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {lineItems.map((it, idx) => (
                <li
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 0",
                    borderBottom: idx < lineItems.length - 1 ? "1px solid #F0F0F0" : "none",
                  }}
                >
                  <div
                    className="shop-thumb shop-thumb--sm"
                    style={{ background: "#F5EDE4" }}
                  >
                    {it.img ? (
                      <img
                        src={resolveMediaUrl(it.img)}
                        alt=""
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : null}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}>
                      {it.selectedHex ? <ShadeSwatch hex={it.selectedHex} title={it.selectedOption || ""} /> : null}
                      <span>{it.name}</span>
                    </div>
                    {it.selectedOption ? (
                      <div style={{ fontSize: 12, color: "#D6247F", fontWeight: 600 }}>{it.selectedOption}</div>
                    ) : null}
                    <div style={{ fontSize: 12, color: "#888" }}>
                      {it.quantity} × {Number(it.price).toLocaleString()} {t.da}
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>
                    {(Number(it.price) * Number(it.quantity)).toLocaleString()} {t.da}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div style={{ padding: "16px 24px 24px", background: "#FAFAFA", borderTop: "1px solid #ECECEC" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13 }}>
              <span style={{ color: "#666" }}>Sous-total</span>
              <span>{subtotal.toLocaleString()} {t.da}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, fontSize: 13 }}>
              <span style={{ color: "#666" }}>Livraison</span>
              <span>{deliveryFee === 0 ? "Gratuit" : `${deliveryFee} ${t.da}`}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12, borderTop: "1px solid #E0E0E0" }}>
              <span style={{ fontFamily: "'Josefin Sans',sans-serif", fontWeight: 700, fontSize: 14 }}>Total</span>
              <span style={{ fontFamily: "'Josefin Sans',sans-serif", fontWeight: 700, fontSize: 20, color: "#D6247F" }}>
                {total.toLocaleString()} {t.da}
              </span>
            </div>
            <p style={{ margin: "16px 0 0", fontSize: 12, color: "#888", textAlign: "center" }}>
              Paiement à la livraison (COD). Conservez cette référence pour le suivi.
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 24, justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/products" className="btn-pk-out" style={{ padding: "12px 22px", textDecoration: "none", fontSize: 13 }}>
            Continuer mes achats
          </Link>
          <Link to="/" className="btn-pink" style={{ padding: "12px 22px", textDecoration: "none", fontSize: 13 }}>
            Accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
