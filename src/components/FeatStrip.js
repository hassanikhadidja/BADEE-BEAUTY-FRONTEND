import IconImg from "./IconImg";

export default function FeatStrip() {
  const rows = [
    { icon: "heart", label: "100% Naturel & Testé" },
    { icon: "delivery", label: "Livraison 24H Alger" },
    { icon: "returncircle", label: "Retours gratuits" },
    { icon: "money", label: "Paiement COD" },
    { icon: "call", label: "Support 7j/7" },
  ];
  return (
    <div style={{ background: "#EEF3EC", borderTop: "1px solid #D4E8CF", borderBottom: "1px solid #D4E8CF", padding: "12px 20px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 10 }}>
        {rows.map(({ icon, label }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 12, color: "#3A5A35", fontWeight: 700, fontFamily: "'Josefin Sans',sans-serif", letterSpacing: ".03em" }}>
            <IconImg name={icon} height={18} alt="" />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
