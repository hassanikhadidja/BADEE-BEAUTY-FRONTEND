import IconImg from "../components/IconImg";

const pillars = [
  {
    icon: "heart",
    title: "Beauté responsable",
    text: "Des formules pensées pour respecter la peau et l’environnement, avec une exigence de qualité à chaque étape.",
  },
  {
    icon: "map",
    title: "Racines algériennes",
    text: "Valoriser le savoir-faire local et des ingrédients pertinents pour les besoins des peaux en Méditerranée et au-delà.",
  },
  {
    icon: "search",
    title: "Transparence",
    text: "Vous informer clairement sur nos soins, nos engagements et la manière dont nous construisons la marque avec vous.",
  },
];

export default function Mission() {
  return (
    <div style={{ background: "#fff" }}>
      <div style={{ background: "#EEF3EC", borderBottom: "1px solid #D4E8CF", padding: "16px 20px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <span style={{ fontSize: 12, color: "#666" }}>Badee Beauty › Notre mission</span>
          <h1 style={{ fontFamily: "'Josefin Sans',sans-serif", fontWeight: 700, fontSize: 20, letterSpacing: ".05em", textTransform: "uppercase", marginTop: 6 }}>
            Notre mission
          </h1>
        </div>
      </div>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "44px 20px 56px" }}>
        <p style={{ fontSize: 18, lineHeight: 1.65, color: "#1a1a1a", fontFamily: "'Josefin Sans',sans-serif", fontWeight: 600, marginBottom: 20 }}>
          Offrir des soins de beauté accessibles, efficaces et alignés avec votre quotidien — en plaçant la confiance et le soin au centre de tout ce que nous faisons.
        </p>
        <p style={{ fontSize: 14, lineHeight: 1.9, color: "#444", marginBottom: 16 }}>
          Badee Beauty existe pour accompagner chaque femme dans une routine simple et agréable : protéger, nourrir et révéler l’éclat naturel de la peau. Notre système « Protection et Brillance » résume cette promesse : des produits cohérents entre eux, conçus pour travailler ensemble.
        </p>
        <p style={{ fontSize: 14, lineHeight: 1.9, color: "#444", marginBottom: 40 }}>
          Nous croyons que la beauté n’est pas une injonction, mais un moment pour soi. Notre mission est de rendre ces moments possibles partout en Algérie, avec une livraison claire et un service à l’écoute.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
          {pillars.map(({ icon, title, text }) => (
            <div key={title} style={{ border: "1px solid #E0E0E0", borderTop: "3px solid #D6247F", padding: "22px 18px" }}>
              <IconImg name={icon} height={28} alt="" style={{ marginBottom: 12 }} />
              <h2 style={{ fontFamily: "'Josefin Sans',sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 10 }}>
                {title}
              </h2>
              <p style={{ fontSize: 13, color: "#666", lineHeight: 1.75, margin: 0 }}>{text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
