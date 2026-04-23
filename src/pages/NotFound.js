import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "80px 20px" }}>
      <h1 style={{ fontFamily: "'Josefin Sans',sans-serif", fontSize: 48, marginBottom: 12 }}>404</h1>
      <p style={{ color: "#888", marginBottom: 24 }}>Page introuvable.</p>
      <Link to="/" className="btn-pink" style={{ textDecoration: "none", display: "inline-flex" }}>
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
