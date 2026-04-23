import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, clearError } from "../redux/authSlice";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const { loading, error } = useSelector((s) => s.auth);

  const onSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    const result = await dispatch(login({ email, password }));
    if (login.fulfilled.match(result)) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 400, border: "1px solid #E0E0E0", padding: 28, borderRadius: 4 }}>
        <h1 style={{ fontFamily: "'Josefin Sans',sans-serif", fontSize: 20, marginBottom: 20 }}>Connexion</h1>

        {error && (
          <div style={{ background: "#FFF0F0", border: "1px solid #FFCCCC", color: "#C0392B", padding: "10px 14px", borderRadius: 3, fontSize: 13, marginBottom: 16 }}>
            {error}
          </div>
        )}

        <form onSubmit={onSubmit}>
          <label style={{ display: "block", fontSize: 11, fontWeight: 700, marginBottom: 4 }}>Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: 10, marginBottom: 14, border: "1px solid #E0E0E0", borderRadius: 3 }}
          />
          <label style={{ display: "block", fontSize: 11, fontWeight: 700, marginBottom: 4 }}>Mot de passe</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: 10, marginBottom: 20, border: "1px solid #E0E0E0", borderRadius: 3 }}
          />
          <button
            type="submit"
            className="btn-pink"
            disabled={loading}
            style={{ width: "100%", justifyContent: "center", opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Connexion…" : "Se connecter"}
          </button>
        </form>

        <p style={{ marginTop: 16, fontSize: 13 }}>
          Pas de compte ? <Link to="/register">S&apos;inscrire</Link>
        </p>
      </div>
    </div>
  );
}
