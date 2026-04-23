function FaqItem({ q, a }) {
  return (
    <details
      style={{
        border: "1px solid #E0E0E0",
        borderRadius: 6,
        marginBottom: 10,
        background: "#fff",
      }}
    >
      <summary
        style={{
          padding: "14px 16px",
          cursor: "pointer",
          fontFamily: "'Josefin Sans',sans-serif",
          fontWeight: 700,
          fontSize: 13,
          letterSpacing: ".04em",
          listStyle: "none",
        }}
      >
        {q}
      </summary>
      <p style={{ padding: "0 16px 16px", fontSize: 14, color: "#555", lineHeight: 1.75, margin: 0 }}>{a}</p>
    </details>
  );
}

const ITEMS = [
  {
    q: "Comment passer commande ?",
    a: "Ajoutez vos produits au panier, puis allez au paiement. Renseignez vos coordonnées et la wilaya / commune de livraison. La commande est validée en paiement à la livraison (COD).",
  },
  {
    q: "Quels sont les délais de livraison ?",
    a: "En général : environ 24 h pour Alger, 48 à 72 h pour les autres wilayas, selon disponibilité du transporteur et la période.",
  },
  {
    q: "La livraison est-elle gratuite ?",
    a: "La livraison est offerte à partir d’un montant minimum indiqué sur le site (panier / page commande). En dessous, des frais de livraison s’appliquent.",
  },
  {
    q: "Puis-je payer en ligne ?",
    a: "Pour l’instant, Badee Beauty propose uniquement le paiement à la livraison (COD), en espèces au moment de la réception.",
  },
  {
    q: "Comment suivre ma commande ?",
    a: "Après validation, vous pouvez nous contacter par téléphone ou e-mail avec votre référence de commande pour connaître l’état d’expédition.",
  },
  {
    q: "Proposez-vous des échantillons ?",
    a: "Les offres échantillons dépendent des campagnes en cours. Suivez nos réseaux ou la newsletter pour en être informée.",
  },
];

export default function FAQ() {
  return (
    <div style={{ background: "#fff" }}>
      <div style={{ background: "#EEF3EC", borderBottom: "1px solid #D4E8CF", padding: "16px 20px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <span style={{ fontSize: 12, color: "#666" }}>Badee Beauty › FAQ</span>
          <h1 style={{ fontFamily: "'Josefin Sans',sans-serif", fontWeight: 700, fontSize: 20, letterSpacing: ".05em", textTransform: "uppercase", marginTop: 6 }}>
            Questions fréquentes
          </h1>
        </div>
      </div>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 20px 56px" }}>
        <p style={{ fontSize: 14, color: "#666", lineHeight: 1.7, marginBottom: 28 }}>
          Retrouvez les réponses aux questions les plus courantes sur les commandes, la livraison et le paiement. Pour toute autre demande, utilisez la page Contact.
        </p>
        {ITEMS.map((item) => (
          <FaqItem key={item.q} q={item.q} a={item.a} />
        ))}
      </div>
    </div>
  );
}
