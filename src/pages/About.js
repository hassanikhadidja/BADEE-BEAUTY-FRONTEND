import { LogoMark } from "../components/Logo";
import IconImg from "../components/IconImg";

const cards = [
  { icon: "heart", title: "Naturel", desc: "Ingrédients 100% naturels soigneusement sélectionnés" },
  { icon: "search", title: "Expert", desc: "Formulé par des experts en dermatologie" },
  { icon: "call", title: "Testé", desc: "Testé dermatologiquement sur tous types de peaux" },
  { icon: "map", title: "Algérien", desc: "Fier de ses racines algériennes" },
];

export default function About() {
  return (
    <div style={{ background: "#fff" }}>
      <div style={{ background: "#EEF3EC", borderBottom: "1px solid #D4E8CF", padding: "16px 20px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <span style={{ fontSize: 12, color: "#666" }}>Badee Beauty › À Propos</span>
          <h1 style={{ fontFamily: "'Josefin Sans',sans-serif", fontWeight: 700, fontSize: 20, letterSpacing: ".05em", textTransform: "uppercase", marginTop: 6 }}>À Propos de Badee Beauty</h1>
        </div>
      </div>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "44px 20px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <LogoMark variant="white" height={70} alt="" />
          <h2 style={{ fontFamily: "'Josefin Sans',sans-serif", fontWeight: 700, fontSize: 26, letterSpacing: ".08em", textTransform: "uppercase", marginTop: 14, marginBottom: 6 }}>
            BADEE <span style={{ fontFamily: "Georgia,serif", fontWeight: 400 }}>بديع</span>
          </h2>
          <p style={{ fontSize: 12, color: "#AAA", letterSpacing: ".12em", textTransform: "uppercase", fontFamily: "'Josefin Sans',sans-serif" }}>Système protection et Brillance</p>
        </div>
        <p style={{ fontSize: 14, lineHeight: 1.9, color: "#444", marginBottom: 16 }}>
          Badee Beauty est née d'une passion pour la beauté authentique et les soins naturels. Fondée en Algérie, notre marque célèbre la beauté de la femme algérienne en combinant des ingrédients naturels locaux avec des formules modernes et cliniquement éprouvées.
        </p>
        <p style={{ fontSize: 14, lineHeight: 1.9, color: "#444", marginBottom: 36 }}>
          Chaque produit est conçu avec soin pour respecter, protéger et sublimer votre peau. Notre système unique &quot;Protection et Brillance&quot; garantit des résultats visibles dès les premières applications.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16 }}>
          {cards.map(({ icon, title, desc }) => (
            <div key={title} style={{ border: "1px solid #E0E0E0", borderTop: "3px solid #D6247F", padding: "18px 16px" }}>
              <div style={{ marginBottom: 8 }}>
                <IconImg name={icon} height={26} alt="" />
              </div>
              <div style={{ fontFamily: "'Josefin Sans',sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 6 }}>{title}</div>
              <p style={{ fontSize: 12, color: "#666", lineHeight: 1.7 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
