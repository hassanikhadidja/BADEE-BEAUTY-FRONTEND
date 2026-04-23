import { useState } from "react";
import IconImg from "../components/IconImg";
import { BUSINESS } from "../data/business";
import { isContactEmailConfigured, sendContactEmail } from "../services/emailjsService";

export default function Contact() {
  const [user_name, setUserName] = useState("");
  const [user_phone, setUserPhone] = useState("");
  const [user_email, setUserEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isContactEmailConfigured()) {
      setFeedback({
        type: "err",
        text: "L’envoi depuis le site n’est pas encore configuré. Ajoutez vos identifiants EmailJS dans le fichier .env (voir .env.example).",
      });
      return;
    }
    setSending(true);
    setFeedback(null);
    try {
      await sendContactEmail({
        user_name: user_name.trim(),
        user_email: user_email.trim(),
        user_phone: user_phone.trim(),
        message: message.trim(),
      });
      setFeedback({ type: "ok", text: "Message envoyé. Nous vous répondrons bientôt." });
      setUserName("");
      setUserPhone("");
      setUserEmail("");
      setMessage("");
    } catch (err) {
      const msg =
        err?.text || err?.message || (typeof err === "string" ? err : "Échec de l’envoi. Réessayez plus tard.");
      setFeedback({ type: "err", text: msg });
    } finally {
      setSending(false);
    }
  };

  const fieldStyle = {
    width: "100%",
    padding: "10px 13px",
    border: "1.5px solid #E0E0E0",
    borderRadius: 3,
    fontSize: 13,
    outline: "none",
  };

  return (
    <div style={{ background: "#fff" }}>
      <div style={{ background: "#EEF3EC", borderBottom: "1px solid #D4E8CF", padding: "16px 20px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <span style={{ fontSize: 12, color: "#666" }}>Badee Beauty › Contact</span>
          <h1 style={{ fontFamily: "'Josefin Sans',sans-serif", fontWeight: 700, fontSize: 20, letterSpacing: ".05em", textTransform: "uppercase", marginTop: 6 }}>Contactez-nous</h1>
        </div>
      </div>
      <div className="contact-grid" style={{ maxWidth: 780, margin: "0 auto", padding: "44px 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 36, alignItems: "flex-start" }}>
        <div>
          <h2 style={{ fontFamily: "'Josefin Sans',sans-serif", fontWeight: 700, fontSize: 16, letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 18 }}>Formulaire</h2>
          <form id="contact-form" onSubmit={onSubmit}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 11, fontFamily: "'Josefin Sans',sans-serif", fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 5, color: "#444" }}>Prénom et Nom *</label>
              <input
                name="user_name"
                type="text"
                required
                value={user_name}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Votre nom"
                style={fieldStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = "#D6247F";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#E0E0E0";
                }}
              />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 11, fontFamily: "'Josefin Sans',sans-serif", fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 5, color: "#444" }}>Téléphone</label>
              <input
                name="user_phone"
                type="tel"
                value={user_phone}
                onChange={(e) => setUserPhone(e.target.value)}
                placeholder="0X XX XX XX XX"
                style={fieldStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = "#D6247F";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#E0E0E0";
                }}
              />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 11, fontFamily: "'Josefin Sans',sans-serif", fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 5, color: "#444" }}>E-mail *</label>
              <input
                name="user_email"
                type="email"
                required
                value={user_email}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="vous@exemple.com"
                autoComplete="email"
                style={fieldStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = "#D6247F";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#E0E0E0";
                }}
              />
            </div>
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: "block", fontSize: 11, fontFamily: "'Josefin Sans',sans-serif", fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 5, color: "#444" }}>Message *</label>
              <textarea
                name="message"
                rows={5}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Votre message..."
                style={{ ...fieldStyle, resize: "vertical" }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#D6247F";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#E0E0E0";
                }}
              />
            </div>
            {feedback ? (
              <p
                role="status"
                style={{
                  fontSize: 13,
                  marginBottom: 12,
                  color: feedback.type === "ok" ? "#2e7d32" : "#c62828",
                }}
              >
                {feedback.text}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={sending}
              className="btn-pink"
              style={{ width: "100%", padding: "12px", justifyContent: "center", fontSize: 13, letterSpacing: ".06em", opacity: sending ? 0.75 : 1 }}
            >
              {sending ? "Envoi…" : "Envoyer le message"}
            </button>
          </form>
        </div>
        <div>
          <h2 style={{ fontFamily: "'Josefin Sans',sans-serif", fontWeight: 700, fontSize: 16, letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 18 }}>Coordonnées</h2>
          {[
            { icon: "map", k: "Adresse", v: BUSINESS.address },
            { icon: "call", k: "Téléphone", v: BUSINESS.phoneDisplay, href: `tel:${BUSINESS.phone}` },
            { icon: "email", k: "Email", v: BUSINESS.email, href: `mailto:${BUSINESS.email}` },
            { icon: "time", k: "Horaires", v: BUSINESS.hours },
          ].map((row) => (
            <div key={row.k} style={{ display: "flex", gap: 12, marginBottom: 14, padding: "12px 14px", border: "1px solid #E0E0E0", borderRadius: 3 }}>
              <IconImg name={row.icon} height={22} alt="" />
              <div>
                <div style={{ fontFamily: "'Josefin Sans',sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 3 }}>{row.k}</div>
                {row.href ? (
                  <a href={row.href} style={{ fontSize: 13, color: "#666", textDecoration: "none" }}>
                    {row.v}
                  </a>
                ) : (
                  <div style={{ fontSize: 13, color: "#666", lineHeight: 1.5 }}>{row.v}</div>
                )}
              </div>
            </div>
          ))}
          <div style={{ background: "#EEF3EC", border: "1px solid #D4E8CF", borderRadius: 3, padding: "14px", marginTop: 6 }}>
            <div style={{ fontFamily: "'Josefin Sans',sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: ".06em", textTransform: "uppercase", color: "#3A5A35", marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
              <IconImg name="delivery" height={18} alt="" />
              Livraison & Paiement
            </div>
            <p style={{ fontSize: 12, color: "#555", lineHeight: 1.7 }}>Livraison COD uniquement. 24H → Alger & limitrophes. 48-72H → Autres wilayas.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
