import { BUSINESS } from "../data/business";

export default function Privacy() {
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 20px" }}>
      <h1 style={{ fontFamily: "'Josefin Sans',sans-serif", fontSize: 22, marginBottom: 16 }}>Politique de confidentialité</h1>
      <p style={{ color: "#555", lineHeight: 1.8, marginBottom: 12 }}>
        Badee Beauty respecte votre vie privée. Les données collectées via les formulaires de contact et de commande servent uniquement au traitement de vos demandes et à la livraison de vos achats (paiement à la livraison — COD).
      </p>
      <p style={{ color: "#555", lineHeight: 1.8 }}>
        Nous ne vendons pas vos informations à des tiers. Pour toute question :{" "}
        <a href={`mailto:${BUSINESS.email}`} style={{ color: "var(--pink, #d6247f)" }}>
          {BUSINESS.email}
        </a>
      </p>
    </div>
  );
}
