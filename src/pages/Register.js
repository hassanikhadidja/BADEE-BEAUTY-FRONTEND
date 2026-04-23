import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register, clearError } from "../redux/authSlice";

const todayYmd = () => new Date().toISOString().slice(0, 10);

export default function Register() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [birthday, setBirthday] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);

  const onSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    const result = await dispatch(register({ name, email, password, birthday: birthday.trim() || undefined }));
    if (register.fulfilled.match(result)) {
      navigate("/");
    }
  };

  return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 400, border: "1px solid #E0E0E0", padding: 28, borderRadius: 4 }}>
        <h1 style={{ fontFamily: "'Josefin Sans',sans-serif", fontSize: 20, marginBottom: 20 }}>Inscription</h1>

        {error && (
          <div style={{ background: "#FFF0F0", border: "1px solid #FFCCCC", color: "#C0392B", padding: "10px 14px", borderRadius: 3, fontSize: 13, marginBottom: 16 }}>
            {error}
          </div>
        )}

        <form onSubmit={onSubmit}>
          <label style={{ display: "block", fontSize: 11, fontWeight: 700, marginBottom: 4 }}>Nom</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: "100%", padding: 10, marginBottom: 14, border: "1px solid #E0E0E0", borderRadius: 3 }}
          />
          <label style={{ display: "block", fontSize: 11, fontWeight: 700, marginBottom: 4 }}>Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: 10, marginBottom: 14, border: "1px solid #E0E0E0", borderRadius: 3 }}
          />
          <label style={{ display: "block", fontSize: 11, fontWeight: 700, marginBottom: 4 }}>
            Date de naissance <span style={{ fontWeight: 400, color: "#888" }}>(optionnel)</span>
          </label>
          <input
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            min="1900-01-01"
            max={todayYmd()}
            style={{ width: "100%", padding: 10, marginBottom: 6, border: "1px solid #E0E0E0", borderRadius: 3 }}
          />
          <p style={{ fontSize: 12, color: "#666", margin: "0 0 14px", lineHeight: 1.45 }}>
            Si vous l’indiquez, nous pourrons vous envoyer par e-mail des offres ou petits cadeaux pour votre anniversaire.
          </p>
          <label style={{ display: "block", fontSize: 11, fontWeight: 700, marginBottom: 4 }}>Mot de passe</label>
          <input
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
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
            {loading ? "Création…" : "Créer un compte"}
          </button>
        </form>

        <p style={{ marginTop: 16, fontSize: 13 }}>
          Déjà inscrit ? <Link to="/login">Connexion</Link>
        </p>
      </div>
    </div>
  );
}