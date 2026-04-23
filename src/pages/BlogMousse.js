import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { getMousseProductPath } from "../utils/mousseProductLinks";
import { BUSINESS } from "../data/business";
import { isContactEmailConfigured, sendNewsletterSignupEmail } from "../services/emailjsService";

const IMG = {
  hero: "https://res.cloudinary.com/dbtkfjrvd/image/upload/v1776353390/mousse7_luhqs9.jpg",
  routine: "https://res.cloudinary.com/dbtkfjrvd/image/upload/v1776353590/mousse5_vvdtqd.jpg",
  mousse: "https://res.cloudinary.com/dbtkfjrvd/image/upload/v1776896178/photo_2026-04-22_23-15-22_cwdffl.jpg",
};

export default function BlogMousse() {
  const rawProducts = useSelector((s) => s.products.products);
  const moussePaths = useMemo(
    () => ({
      rose: getMousseProductPath(rawProducts, "rose"),
      citron: getMousseProductPath(rawProducts, "citron"),
      myrtille: getMousseProductPath(rawProducts, "myrtille"),
    }),
    [rawProducts],
  );

  const [newsEmail, setNewsEmail] = useState("");
  const [newsStatus, setNewsStatus] = useState(null);
  const [newsSending, setNewsSending] = useState(false);

  const submitNewsletter = async (e) => {
    e.preventDefault();
    const email = newsEmail.trim();
    if (!email) {
      setNewsStatus({ type: "err", text: "Veuillez saisir votre adresse e-mail." });
      return;
    }
    setNewsSending(true);
    setNewsStatus(null);
    try {
      if (isContactEmailConfigured()) {
        await sendNewsletterSignupEmail(email);
        setNewsStatus({ type: "ok", text: "Merci ! Votre inscription a bien été envoyée." });
        setNewsEmail("");
      } else {
        const subj = encodeURIComponent("Newsletter Badee Beauty — Blog");
        const body = encodeURIComponent(
          `Bonjour,\n\nJe souhaite recevoir la newsletter.\nMon e-mail : ${email}\n\n(Article La Mousse rituelle — blog)`,
        );
        window.location.href = `mailto:${BUSINESS.email}?subject=${subj}&body=${body}`;
        setNewsStatus({
          type: "ok",
          text: "Votre messagerie s’ouvre pour envoyer la demande. Il suffit de valider l’envoi.",
        });
      }
    } catch (err) {
      setNewsStatus({
        type: "err",
        text: err?.text || err?.message || "Impossible d’envoyer pour le moment. Réessayez plus tard.",
      });
    } finally {
      setNewsSending(false);
    }
  };

  return (
    <div className="blog-page">
      <div className="blog-breadcrumb">
        <div className="blog-breadcrumb-inner">
          <span className="blog-breadcrumb-path">
            Badee Beauty › <Link to="/blog">Blog beauté</Link> › La Mousse rituelle
          </span>
          <h1 className="blog-breadcrumb-title">Journal beauté</h1>
        </div>
      </div>

      <section className="blog-hero">
        <div className="blog-hero-inner">
          <div className="blog-hero-text">
            <p className="blog-label">Soins visage</p>
            <h2 className="blog-hero-heading josefin">
              La Mousse rituelle : pureté, douceur &amp; éclat signé Badee Beauty
            </h2>
            <p className="blog-lead">
              Nous repensons le nettoyage. Exit les textures agressives. Place à Badee Mousse Nettoyante : une ligne
              triple essence qui nettoie, démaquille et hydrate en un seul geste.
            </p>
            <a href="#article-mousse" className="blog-cta blog-cta--inline josefin">
              Lire l’article
            </a>
          </div>
          <div className="blog-hero-visual">
            <div className="blog-img-wrap">
              <img src={IMG.hero} alt="Mousse nettoyante luxe visage" className="blog-img" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      <div className="blog-benefits blog-benefits--mousse">
        <div className="blog-benefits-inner">
          <div>
            <p className="blog-benefit-title">3</p>
            <p className="blog-benefit-sub">Essences uniques</p>
          </div>
          <div>
            <p className="blog-benefit-title">0%</p>
            <p className="blog-benefit-sub">Sulfates agressifs</p>
          </div>
          <div>
            <p className="blog-benefit-title">1</p>
            <p className="blog-benefit-sub">Geste triple action</p>
          </div>
          <div>
            <p className="blog-benefit-title">100%</p>
            <p className="blog-benefit-sub">Testé dermatologiquement</p>
          </div>
        </div>
      </div>

      <div className="blog-content-wrap" id="article-mousse">
        <div className="blog-content-grid">
          <article className="blog-article">
            <div className="blog-intro">
              <p className="blog-body">
                Chez Badee Beauty, nous croyons que le premier geste de votre routine beauté devrait ressembler à une
                caresse. Pas une agression. Pas une sensation de tiraillement. Mais une mousse onctueuse, presque
                aérienne, qui efface la journée tout en respectant l&apos;équilibre fragile de votre peau.
              </p>
              <p className="blog-body">
                Aujourd&apos;hui, nous repensons le nettoyage. Exit les textures agressives. Place à{" "}
                <strong>Badee Mousse Nettoyante</strong> : une ligne triple essence qui nettoie, démaquille et hydrate –
                le tout en un seul geste, sublimé par une brosse en silicone intégrée.
              </p>
              <p className="blog-body">Bienvenue dans le luxe sensoriel.</p>
            </div>

            <div className="blog-img-wrap blog-img-full blog-mousse-wide">
              <img src={IMG.routine} alt="Routine soin visage" className="blog-img" loading="lazy" />
            </div>

            <section className="blog-section" id="sec-difference">
              <h2 className="blog-h2 josefin">Pourquoi la Mousse Badee est différente</h2>
              <p className="blog-body">Parce qu&apos;une peau éclatante commence par un nettoyage intelligent.</p>
              <p className="blog-body">
                Chaque flacon contient une <strong>mousse fraîche et dense</strong> qui se transforme en nuée de velours
                au contact de l&apos;eau. Mais la véritable innovation, c&apos;est la{" "}
                <strong>brosse silicone douce</strong> intégrée à la pompe.
              </p>
              <p className="blog-body">
                Ses micro-dots massent délicatement, exfolient sans irriter, et éliminent jusqu&apos;au dernier résidu de
                maquillage, de sébum ou de pollution.
              </p>
              <p className="blog-body">
                Résultat ? Une peau profondément propre, mais jamais déshydratée. Lisse, rebondie, prête à recevoir vos
                sérums et crèmes.
              </p>
              <blockquote className="blog-blockquote josefin">
                Fini les démaquillants agressifs. La mousse Badee est un soin à elle seule.
              </blockquote>
            </section>

            <section className="blog-section" id="sec-types">
              <h2 className="blog-h2 josefin">Une mousse pour chaque type de peau</h2>
              <div className="blog-variant-grid">
                <div className="blog-variant-card">
                  <div className="blog-variant-emoji" aria-hidden>
                    {"\u{1FA77}"}
                  </div>
                  <h3 className="blog-variant-name josefin">Rose</h3>
                  <p className="blog-variant-desc">
                    Peaux sensibles — Extrait de rose &amp; aloès. Apaise rougeurs et tiraillements.
                  </p>
                </div>
                <div className="blog-variant-card">
                  <div className="blog-variant-emoji" aria-hidden>
                    {"\u{1F49B}"}
                  </div>
                  <h3 className="blog-variant-name josefin">Citron</h3>
                  <p className="blog-variant-desc">
                    Peaux grasses — Agrumes naturels. Régule le sébum, affine les pores.
                  </p>
                </div>
                <div className="blog-variant-card">
                  <div className="blog-variant-emoji" aria-hidden>
                    {"\u{1F49C}"}
                  </div>
                  <h3 className="blog-variant-name josefin">Myrtille</h3>
                  <p className="blog-variant-desc">
                    Peaux mixtes / normales — Antioxydants. Réveille le teint, unifie les zones.
                  </p>
                </div>
              </div>

              <p className="blog-body">
                <strong>{"\u{1FA77}"} Rose – Peaux sensibles</strong>
                <br />
                Le calme en mousse. À l&apos;extrait de rose et d&apos;aloès, la version <strong>Rose</strong> apaise les
                rougeurs, les tiraillements et les réactivités cutanées. La brosse silicone agit en douceur absolue, sans
                friction. Après rinçage : une sensation de fraîcheur, comme un voile d&apos;eau florale. Idéale au
                quotidien, même pour les yeux sensibles.
              </p>
              <p className="blog-body">
                <strong>{"\u{1F49B}"} Citron – Peaux grasses</strong>
                <br />
                L&apos;alliance purifiante. <strong>Citron</strong> assainit sans dessécher. Les agrumes naturels
                régulent l&apos;excès de sébum, affinent les pores visibles, et matifient sans effet poudre. La brosse
                déloge les impuretés au fond des pores. Résultat : une peau nette, équilibrée, et un glow naturel sans
                brillance indésirable.
              </p>
              <p className="blog-body">
                <strong>{"\u{1F49C}"} Myrtille – Peaux mixtes / normales</strong>
                <br />
                L&apos;harmonie parfaite. Riche en antioxydants, <strong>Myrtille</strong> réveille le teint, unifie les
                zones mixtes, et préserve l&apos;hydratation des zones sèches. La mousse violette (oui, elle est
                subtilement teintée) est un vrai plaisir visuel. La peau respire, les pores s&apos;affinent, et
                l&apos;éclat revient en transparence.
              </p>
            </section>

            <div className="blog-img-wrap blog-img-full blog-mousse-wide">
              <img src={IMG.mousse} alt="Soin nettoyant visage mousse" className="blog-img" loading="lazy" />
            </div>

            <section className="blog-section" id="sec-rituel">
              <h2 className="blog-h2 josefin">Le rituel de luxe à la maison</h2>
              <ol className="blog-ol-steps">
                <li>
                  <strong>Pressez</strong> une noisette de mousse directement dans la brosse silicone.
                </li>
                <li>
                  <strong>Massez</strong> votre visage humide par mouvements circulaires – doucement sur le contour des
                  yeux, plus intensément sur la zone T.
                </li>
                <li>
                  <strong>Rincez</strong> à l&apos;eau tiède.
                </li>
              </ol>
              <p className="blog-body">
                La mousse onctueuse se transforme en lait démaquillant au contact de la peau. Le geste devient méditation.
                Le bain de vapeur silencieux de votre salle de bain s&apos;élève en spa privé.
              </p>
              <blockquote className="blog-blockquote josefin">
                Trois minutes. Zéro irritation. Un résultat « peau de pétale ».
              </blockquote>
            </section>

            <section className="blog-section" id="sec-resultats">
              <h2 className="blog-h2 josefin">Des résultats visibles dès la première utilisation</h2>
              <p className="blog-body">
                <strong>Dès le premier soir :</strong>
              </p>
              <ul className="blog-check-list">
                <li>Maquillage waterproof complètement dissous</li>
                <li>Peau plus douce, texture affinée</li>
                <li>Sensation d&apos;hydratation intense (sans film gras)</li>
              </ul>
              <p className="blog-body">
                <strong>Au bout d&apos;une semaine :</strong>
              </p>
              <ul className="blog-check-list">
                <li>Pores resserrés, grain de peau lissé</li>
                <li>Teint lumineux, même sans fond de teint</li>
                <li>Confort cutané durable</li>
              </ul>
              <p className="blog-body">
                Testée sous contrôle dermatologique, la mousse Badee respecte le pH de la peau. Non comédogène. Sans
                sulfates agressifs. Sans parabènes.
              </p>
            </section>

            <section className="blog-section" id="sec-obsession">
              <h2 className="blog-h2 josefin">Votre nouvelle obsession beauté</h2>
              <p className="blog-body">
                Chaque flacon – rose tendre, jaune solaire ou violet myrtille – est conçu pour trôner sur votre plan de
                salle de bain comme un accessoire de mode. Parce que le soin doit être beau, sensuel, et efficace.
              </p>
              <p className="blog-body">
                <strong>Badee Mousse Nettoyante</strong>, c&apos;est l&apos;invitation à aimer votre peau, chaque matin
                et chaque soir.
              </p>
              <div className="blog-mousse-cta-block">
                <h3 className="blog-mousse-cta-title josefin">Choisissez votre mousse</h3>
                <p className="blog-body blog-mousse-cta-desc">
                  Offrez-vous le luxe d&apos;un nettoyage qui ressemble à un soin. Votre éclat vous remerciera.
                </p>
                <div className="blog-mousse-cta-btns">
                  <Link to={moussePaths.rose} className="blog-mousse-btn blog-mousse-btn--rose josefin">
                    Rose – Peaux sensibles
                  </Link>
                  <Link to={moussePaths.citron} className="blog-mousse-btn blog-mousse-btn--citron josefin">
                    Citron – Peaux grasses
                  </Link>
                  <Link to={moussePaths.myrtille} className="blog-mousse-btn blog-mousse-btn--myrtille josefin">
                    Myrtille – Peaux mixtes
                  </Link>
                </div>
              </div>
              <Link to="/products" className="blog-cta josefin">
                Explorer la boutique
              </Link>
            </section>
          </article>

          <aside className="blog-sidebar" aria-label="Sommaire">
            <div className="blog-sidebar-sticky">
              <h3 className="blog-sidebar-title josefin">Sommaire</h3>
              <a className="blog-sidebar-link" href="#sec-difference">
                Pourquoi elle est différente
              </a>
              <a className="blog-sidebar-link" href="#sec-types">
                Une mousse par type de peau
              </a>
              <a className="blog-sidebar-link" href="#sec-rituel">
                Le rituel de luxe
              </a>
              <a className="blog-sidebar-link" href="#sec-resultats">
                Résultats visibles
              </a>
              <a className="blog-sidebar-link" href="#sec-obsession">
                Votre obsession beauté
              </a>
              <Link to="/blog" className="blog-sidebar-link blog-sidebar-link--accent">
                ← Tous les articles
              </Link>
              <Link to="/contact" className="blog-sidebar-link blog-sidebar-link--accent">
                Nous contacter →
              </Link>
            </div>
          </aside>
        </div>
      </div>

      <section className="blog-newsletter" aria-labelledby="blog-newsletter-mousse-heading">
        <div className="blog-newsletter-inner">
          <div className="blog-newsletter-copy">
            <h2 id="blog-newsletter-mousse-heading" className="blog-newsletter-title josefin">
              Restez inspirée
            </h2>
            <p className="blog-newsletter-desc">
              Inscrivez-vous pour recevoir nos actus, conseils beauté et nouveautés Badee Beauty. Une fois par e-mail,
              pas de spam.
            </p>
          </div>
          <form className="blog-newsletter-form" onSubmit={submitNewsletter} noValidate>
            <label htmlFor="blog-newsletter-mousse-email" className="sr-only">
              Votre e-mail
            </label>
            <input
              id="blog-newsletter-mousse-email"
              type="email"
              name="newsletter_email"
              autoComplete="email"
              placeholder="votre@email.com"
              value={newsEmail}
              onChange={(e) => setNewsEmail(e.target.value)}
              className="blog-newsletter-input"
              disabled={newsSending}
            />
            <button type="submit" className="blog-newsletter-btn josefin" disabled={newsSending}>
              {newsSending ? "Envoi…" : "Je m’inscris"}
            </button>
          </form>
          {newsStatus ? (
            <p
              className={`blog-newsletter-feedback blog-newsletter-feedback--${newsStatus.type}`}
              role="status"
            >
              {newsStatus.text}
            </p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
