import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../redux/cartSlice";
import { placeOrder } from "../redux/orderSlice";
import { WILAYAS, COMMUNES_BY_WILAYA } from "../data/algeria";
import { useLang } from "../context/LangContext";
import { getCartLineId } from "../redux/cartSlice";
import ShadeSwatch from "../components/ShadeSwatch";
import {
  buildOrderEmailParams,
  isOrderEmailConfigured,
  sendOrderConfirmationEmail,
} from "../services/emailjsService";

function resolveImg(img) {
  if (Array.isArray(img)) return img[0] || "";
  return img || "";
}

export default function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useLang();
  const cart = useSelector((s) => s.cart.items);
  const user = useSelector((s) => s.auth.user);
  const placing = useSelector((s) => s.orders.placing);
  const [wilaya, setWilaya] = useState("");
  const [commune, setCommune] = useState("");
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [note, setNote] = useState("");

  const orderMailConfigured = isOrderEmailConfigured();

  const qtyOf = (i) => i.quantity ?? i.qty ?? 1;
  const productIdOf = (i) => i._id || i.id;
  const subtotal = cart.reduce((s, i) => s + Number(i.price) * qtyOf(i), 0);
  const freeDeliveryThreshold = 5000;
  const deliveryFee = subtotal >= freeDeliveryThreshold ? 0 : 500;
  const total = subtotal + deliveryFee;

  const communes = wilaya ? (COMMUNES_BY_WILAYA[wilaya] || []) : [];

  const submit = async (e) => {
    e.preventDefault();
    if (!cart.length) return;

    const w = WILAYAS.find((x) => x.code === wilaya);
    const wilayaLabel = w ? `${w.code} — ${w.name}` : wilaya;
    const communeVal = commune.trim();

    // Build body matching the backend orderSchema exactly
    const body = {
      customerName: name.trim(),
      phone: phone.trim(),
      wilaya: wilayaLabel,
      commune: communeVal,
      subtotal,          // required by backend
      deliveryFee,       // required by backend
      total,             // required by backend
      status: "pending",
      note: note.trim(),
      customerEmail: email.trim(),
      items: cart.map((i) => ({
        productId: productIdOf(i),
        name: i.name || "Produit",
        price: Number(i.price) || 0,
        quantity: qtyOf(i),
        img: resolveImg(i.img),
        selectedOption: String(i.selectedOption || "").trim(),
      })),
    };

    // Only attach userId if logged in
    const uid = user?._id || user?.id;
    if (uid) body.userId = uid;        // backend field name (not user)

    const tempRef = `BB-${Date.now().toString().slice(-6)}`;
    const orderSummary = {
      tempRef,
      customerName: name.trim(),
      phone: phone.trim(),
      wilaya: wilayaLabel,
      commune: communeVal,
      subtotal,
      deliveryFee,
      total,
      note: note.trim(),
      customerEmail: email.trim(),
      items: cart.map((i) => ({
        name: i.name || "Produit",
        quantity: qtyOf(i),
        price: Number(i.price) || 0,
        img: resolveImg(i.img),
        selectedOption: String(i.selectedOption || "").trim(),
        selectedHex: String(i.selectedHex || "").trim(),
      })),
    };

    try {
      const result = await dispatch(placeOrder(body)).unwrap();
      const clientMail = email.trim();
      if (orderMailConfigured && clientMail) {
        const params = buildOrderEmailParams({
          summary: orderSummary,
          serverOrder: result?.serverOrder,
          rawResponse: result?.raw,
        });
        if (params?.customer_email) {
          try {
            await sendOrderConfirmationEmail(params);
          } catch (mailErr) {
            console.error("Confirmation e-mail (EmailJS) :", mailErr?.text || mailErr?.message || mailErr);
          }
        }
      }
      dispatch(clearCart());
      navigate("/order-confirmation", {
        replace: true,
        state: {
          serverOrder: result?.serverOrder || null,
          summary: orderSummary,
        },
      });
    } catch (err) {
      window.alert(typeof err === "string" ? err : "Impossible d'envoyer la commande. Réessayez.");
    }
  };

  if (!cart.length) {
    return (
      <div style={{ padding: 60, textAlign: "center" }}>
        <p>Panier vide.</p>
        <button type="button" className="btn-pink" onClick={() => navigate("/products")} style={{ marginTop: 16 }}>
          Continuer vos achats
        </button>
      </div>
    );
  }

  return (
    <div style={{ background: "#fff", padding: "32px 20px 48px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <h1 style={{ fontFamily: "'Josefin Sans',sans-serif", fontSize: 22, marginBottom: 8 }}>
          Commande — Paiement à la livraison
        </h1>
        <p style={{ color: "#666", marginBottom: 24, fontSize: 13 }}>
          Livraison gratuite à partir de {freeDeliveryThreshold.toLocaleString()} {t.da}.
        </p>

        <form onSubmit={submit}>
          <label style={{ display: "block", marginBottom: 8, fontWeight: 700, fontSize: 12 }}>Nom complet *</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="checkout-field"
          />

          <label style={{ display: "block", marginBottom: 8, fontWeight: 700, fontSize: 12 }}>Téléphone *</label>
          <input
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="0X XX XX XX XX"
            className="checkout-field"
          />

          <label style={{ display: "block", marginBottom: 8, fontWeight: 700, fontSize: 12 }}>
            E-mail <span style={{ fontWeight: 400, color: "#888" }}>(optionnel)</span>
            {orderMailConfigured ? (
              <span style={{ fontWeight: 400, color: "#888", display: "block", marginTop: 4 }}>
                Si renseigné, une confirmation peut vous être envoyée par e-mail.
              </span>
            ) : null}
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="vous@exemple.com"
            autoComplete="email"
            className="checkout-field"
          />

          <label style={{ display: "block", marginBottom: 8, fontWeight: 700, fontSize: 12 }}>Wilaya *</label>
          <select
            required
            value={wilaya}
            onChange={(e) => { setWilaya(e.target.value); setCommune(""); }}
            className="checkout-field"
          >
            <option value="">— Choisir une wilaya —</option>
            {WILAYAS.map((w) => (
              <option key={w.code} value={w.code}>{w.code} — {w.name}</option>
            ))}
          </select>

          <label style={{ display: "block", marginBottom: 8, fontWeight: 700, fontSize: 12 }}>
            Commune <span style={{ fontWeight: 400, color: "#888" }}>(optionnel)</span>
          </label>
          <select
            value={commune}
            onChange={(e) => setCommune(e.target.value)}
            className="checkout-field"
            disabled={!wilaya}
          >
            <option value="">{wilaya ? "— Choisir une commune —" : "— Choisissez d’abord une wilaya —"}</option>
            {communes.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <label style={{ display: "block", marginBottom: 8, fontWeight: 700, fontSize: 12 }}>Note (optionnel)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            placeholder="Instructions de livraison, étage, code portail..."
            className="checkout-field"
            style={{ marginBottom: 24, resize: "vertical" }}
          />

          {/* Order summary */}
          <div style={{ background: "#F7F7F7", padding: 16, borderRadius: 3, marginBottom: 20 }}>
            {cart.map((i) => (
              <div key={getCartLineId(i)} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
                <span style={{ color: "#444", display: "inline-flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                  {i.selectedHex ? <ShadeSwatch hex={i.selectedHex} title={i.selectedOption || ""} /> : null}
                  {i.name}
                  {i.selectedOption ? <span style={{ color: "#D6247F" }}> — {i.selectedOption}</span> : null} × {qtyOf(i)}
                </span>
                <span>{(Number(i.price) * qtyOf(i)).toLocaleString()} {t.da}</span>
              </div>
            ))}
            <div style={{ borderTop: "1px solid #E0E0E0", marginTop: 10, paddingTop: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: "#666" }}>Sous-total</span>
                <strong>{subtotal.toLocaleString()} {t.da}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: 13, color: "#666" }}>Livraison</span>
                <strong>{deliveryFee === 0 ? "Gratuit" : `${deliveryFee} ${t.da}`}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #E0E0E0", paddingTop: 10 }}>
                <span style={{ fontWeight: 700 }}>Total</span>
                <strong style={{ color: "#D6247F", fontSize: 18 }}>{total.toLocaleString()} {t.da}</strong>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={placing}
            className="btn-pink"
            style={{ width: "100%", justifyContent: "center", padding: 14, fontSize: 14, opacity: placing ? 0.7 : 1 }}
          >
            {placing ? "Envoi en cours…" : "Confirmer la commande (COD)"}
          </button>
        </form>
      </div>
    </div>
  );
}