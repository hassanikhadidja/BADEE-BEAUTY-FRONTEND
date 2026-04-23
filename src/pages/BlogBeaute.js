import { useState } from "react";
import { Link } from "react-router-dom";
import { BUSINESS } from "../data/business";
import { isContactEmailConfigured, sendNewsletterSignupEmail } from "../services/emailjsService";

const BLOG_IMG = (n) => `${process.env.PUBLIC_URL || ""}/blog/kera${n}.jpg`;

function BlogImage({ n, alt, className = "" }) {
  return (
    <div className={`blog-img-wrap ${className}`.trim()}>
      <img
        src={BLOG_IMG(n)}
        alt={alt}
        loading="lazy"
        className="blog-img"
        onError={(e) => {
          e.currentTarget.classList.add("blog-img--missing");
        }}
      />
      <div className="blog-img-fallback" aria-hidden>
        <span>Kera Color · visuel {n}</span>
        <small>Ajoutez kera{n}.jpg dans public/blog/</small>
      </div>
    </div>
  );
}

export default function BlogBeaute() {
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
          `Bonjour,\n\nJe souhaite recevoir la newsletter.\nMon e-mail : ${email}\n\n(Article Kera Color — blog)`,
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
            Badee Beauty › <Link to="/blog">Blog beauté</Link> › Kera Color
          </span>
          <h1 className="blog-breadcrumb-title">Journal beauté</h1>
        </div>
      </div>

      <section className="blog-hero">
        <div className="blog-hero-inner">
          <div className="blog-hero-text">
            <p className="blog-label">Introduction</p>
            <h2 className="blog-hero-heading josefin">L&apos;éclat manifeste : sublimez votre chevelure avec Kera Color</h2>
            <p className="blog-lead">
              Chez Badee Beauty, nous croyons que la couleur est un langage. C&apos;est pourquoi nous avons imaginé Kera Color : une
              collection de colorations semi-permanentes où la fantaisie des teintes les plus prisées rencontre le soin profond que
              mérite la fibre capillaire.
            </p>
          </div>
          <div className="blog-hero-visual">
            <BlogImage n={1} alt="Kera Color — colorations vibrantes par Badee Beauty" />
          </div>
        </div>
      </section>

      <div className="blog-content-wrap">
        <div className="blog-content-grid">
          <article className="blog-article">
            <div className="blog-intro">
              <p className="blog-body">
                Il y a des matins où l&apos;on se regarde dans le miroir et où l&apos;on cherche cette étincelle. Ce petit quelque
                chose qui fait battre le cœur un peu plus vite, qui transforme une simple mise en beauté en une affirmation de soi.
                Parfois, cette étincelle est un rouge à lèvres audacieux. Souvent, elle se cache dans une mèche de cheveux.
              </p>
              <p className="blog-body">
                Oubliez tout ce que vous savez sur la coloration classique. Ici, nous réinventons l&apos;art de la couleur pour une
                chevelure qui respire la santé, la brillance et la modernité.
              </p>
            </div>

            <section className="blog-section" id="pourquoi">
              <h2 className="blog-h2 josefin">Pourquoi Kera Color est différente : l&apos;intelligence du cheveu</h2>
              <p className="blog-body">
                Dans l&apos;univers de la coloration temporaire, il est souvent difficile de trouver l&apos;équilibre parfait entre un
                résultat vibrant et une texture soyeuse. Kera Color brise ce code avec une formule innovante, aussi douce pour la
                fibre qu&apos;un soin en institut.
              </p>
              <p className="blog-body">La différence tient en deux promesses fondamentales :</p>
              <div className="blog-promise-block">
                <div>
                  <p className="blog-body">
                    <strong>Zéro ammoniaque, zéro oxydant</strong> — La couleur se dépose en surface, enveloppant le cheveu d&apos;un
                    voile pigmentaire sans jamais agresser la kératine naturelle. C&apos;est une coloration douceur, une caresse
                    pigmentée.
                  </p>
                </div>
                <div>
                  <p className="blog-body">
                    <strong>Infusion active</strong> — La formule est pensée pour lisser les écailles du cheveu. Résultat ? Une
                    chevelure qui semble gorgée de lumière, avec un effet glossy immédiat qui capte le moindre rayon de soleil.
                  </p>
                </div>
              </div>
              <p className="blog-body">
                C&apos;est la promesse d&apos;une coloration qui fait du bien, pour des longueurs aussi douces au toucher qu&apos;elles
                sont intenses en couleur.
              </p>
              <BlogImage n={2} alt="Produits Kera Color par Badee Beauty" className="blog-img-full" />
            </section>

            <section className="blog-section" id="color-meets-care">
              <h2 className="blog-h2 josefin">Color meets care : l&apos;éclat sans compromis</h2>
              <div className="blog-two-col">
                <div className="blog-col">
                  <p className="blog-body">
                    Nous avons toutes connu ce moment de doute avant de colorer nos cheveux : « Est-ce que mes pointes vont souffrir
                    ? Vais-je perdre ma brillance naturelle ? »
                  </p>
                  <p className="blog-body">
                    Avec Kera Color, la réponse est un <em>non</em> catégorique. La texture unique de la crème permet une application
                    ultra-sensorielle. Elle glisse sur les racines et les longueurs sans accrocher, déposant un pigment pur qui
                    n&apos;altère en rien la structure interne du cheveu.
                  </p>
                </div>
                <div className="blog-col">
                  <BlogImage n={3} alt="Tons rouges éclatants Kera Color" />
                </div>
              </div>
              <p className="blog-body blog-italic">
                Loin de l&apos;effet paille parfois redouté, Kera Color laisse derrière elle un sillage de soie. C&apos;est cette
                sensation addictive de passer la main dans ses cheveux et de sentir une douceur infinie, comme si vous sortiez d&apos;un
                masque nutritif, alors que vous venez simplement d&apos;arborer un Rouge Vermeil flamboyant.
              </p>
            </section>

            <section className="blog-section" id="nuances">
              <h2 className="blog-h2 josefin">Trouvez votre nuance, exprimez votre être</h2>
              <p className="blog-body blog-mb-lg">
                La palette Kera Color est une ode à la liberté d&apos;expression. Disponible en <strong>14 nuances</strong> soigneusement
                éditées, elle parle aussi bien à l&apos;âme minimaliste qu&apos;à l&apos;esprit rock.
              </p>

              <div className="blog-two-col blog-mb-lg">
                <div className="blog-col">
                  <BlogImage n={4} alt="Rouges profonds Kera Color" />
                </div>
                <div className="blog-col blog-col-center">
                  <h3 className="blog-h3 josefin">Pour l&apos;audace sensuelle</h3>
                  <p className="blog-body">
                    Plongez dans la famille des rouges profonds. Le <strong>Rouge de Mars</strong> est un brun acajou d&apos;une
                    élégance rare, presque mystérieux. Envie de passion pure ? Le <strong>Rouge Vermeil</strong> est un éclat ardent,
                    vibrant, impossible à ignorer.
                  </p>
                </div>
              </div>

              <div className="blog-two-col blog-two-col-reverse blog-mb-lg">
                <div className="blog-col">
                  <BlogImage n={5} alt="Rose poudré Kera Color" />
                </div>
                <div className="blog-col blog-col-center">
                  <h3 className="blog-h3 josefin">Pour la douceur poétique</h3>
                  <p className="blog-body">
                    La <strong>Blonde Rose</strong> est la nuance romantique par excellence. Un rose poudré, délicat et aérien, comme une
                    caresse de blush sur les pointes. Associé à un <strong>Blanc Sublime</strong> sur les racines, le résultat est
                    d&apos;une modernité absolue.
                  </p>
                </div>
              </div>

              <div className="blog-two-col blog-mb-lg">
                <div className="blog-col">
                  <BlogImage n={6} alt="Couleurs avant-garde Kera Color" />
                </div>
                <div className="blog-col blog-col-center">
                  <h3 className="blog-h3 josefin">Pour l&apos;iconique et l&apos;avant-garde</h3>
                  <p className="blog-body">
                    Le <strong>Gris Silver</strong> est le must-have des beauty addicts. Froid, minéral et sophistiqué, il apporte cette
                    touche « High-Fashion » qui sublime tous les teints. Le <strong>Violet Royal</strong> et le <strong>Violet Indego</strong>{" "}
                    promettent une dimension cosmique à votre chevelure.
                  </p>
                </div>
              </div>

              <div className="blog-two-col blog-two-col-reverse">
                <div className="blog-col">
                  <BlogImage n={7} alt="Couleurs vibrantes Kera Color" />
                </div>
                <div className="blog-col blog-col-center">
                  <h3 className="blog-h3 josefin">Pour la fraîcheur vibrante</h3>
                  <p className="blog-body">
                    Osez le <strong>Vert Impérial</strong> pour un détail mode inattendu ou le <strong>Bleu Azur</strong> pour une mèche
                    qui rappelle les lagons les plus purs.
                  </p>
                </div>
              </div>
            </section>

            <section className="blog-section" id="rituel">
              <h2 className="blog-h2 josefin">L&apos;expérience luxe à domicile : un rituel facile et chic</h2>
              <p className="blog-body blog-mb-lg">
                L&apos;une des plus grandes forces de Kera Color réside dans sa simplicité déconcertante. Pas besoin de rendez-vous en
                salon pour un résultat impeccable. C&apos;est le secret des initiées, ce geste beauté que l&apos;on s&apos;offre un
                dimanche après-midi pour illuminer la semaine à venir.
              </p>
              <BlogImage n={8} alt="Rituel de coloration Badee Beauty" className="blog-img-full" />
              <h3 className="blog-h3 josefin" style={{ marginTop: "2rem" }}>
                Le rituel Badee Beauty :
              </h3>
              <div className="blog-step">
                <span className="blog-step-num">01</span>
                <p className="blog-body">
                  <strong>La toile parfaite</strong> — Sur cheveux préalablement décolorés à blanc, la couleur se révèle dans toute sa
                  pureté chromatique.
                </p>
              </div>
              <div className="blog-step">
                <span className="blog-step-num">02</span>
                <p className="blog-body">
                  <strong>Le geste d&apos;artiste</strong> — À l&apos;aide d&apos;un pinceau, appliquez délicatement sur cheveux secs. La
                  texture onctueuse permet une précision absolue, que ce soit pour un dip-dye subtil ou un full head assumé.
                </p>
              </div>
              <div className="blog-step">
                <span className="blog-step-num">03</span>
                <p className="blog-body">
                  <strong>La révélation</strong> — Laissez poser le temps d&apos;un café ou d&apos;un masque visage. Pas de temps de
                  pause contraignant, juste le plaisir de se préparer.
                </p>
              </div>
              <p className="blog-body blog-italic" style={{ marginTop: "1.5rem" }}>
                C&apos;est une expérience sensorielle où vous reprenez le contrôle de votre style, sans stress et avec un résultat digne
                des plus grands salons.
              </p>
            </section>

            <section className="blog-section" id="invitation">
              <h2 className="blog-h2 josefin">L&apos;invitation à rayonner</h2>
              <p className="blog-body">
                Kera Color by Badee Beauty n&apos;est pas simplement une coloration. C&apos;est une affirmation. C&apos;est le refus de la
                monotonie, le choix assumé d&apos;une chevelure qui capte la lumière et qui raconte une histoire : la vôtre.
              </p>
              <p className="blog-body">
                Que vous soyez attirée par la pureté solaire du <strong>Blanc Lumière</strong> ou par la profondeur envoûtante du{" "}
                <strong>Violet Prune</strong>, laissez vos cheveux devenir le reflet de votre personnalité la plus éclatante.
              </p>
              <p className="blog-body">
                Découvrez les 14 nuances de la collection sur notre boutique et rejoignez la communauté de celles qui font de leurs
                cheveux une oeuvre d&apos;art.
              </p>
              <p className="blog-body blog-italic blog-mb-lg">
                Parce que la beauté ne devrait jamais s&apos;effacer — elle devrait évoluer.
              </p>
              <Link to="/products" className="blog-cta josefin">
                Explorer la boutique
              </Link>
            </section>
          </article>

          <aside className="blog-sidebar" aria-label="Sommaire">
            <div className="blog-sidebar-sticky">
              <h3 className="blog-sidebar-title josefin">Sommaire</h3>
              <a className="blog-sidebar-link" href="#pourquoi">
                1. Pourquoi Kera Color est différente
              </a>
              <a className="blog-sidebar-link" href="#color-meets-care">
                2. Color meets care : l&apos;éclat sans compromis
              </a>
              <a className="blog-sidebar-link" href="#nuances">
                3. Trouvez votre nuance
              </a>
              <a className="blog-sidebar-link" href="#rituel">
                4. L&apos;expérience luxe à domicile
              </a>
              <a className="blog-sidebar-link" href="#invitation">
                5. L&apos;invitation à rayonner
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

      <div className="blog-benefits">
        <div className="blog-benefits-inner">
          <div>
            <p className="blog-benefit-title">Sans ammoniaque</p>
            <p className="blog-benefit-sub">Formule douce et respectueuse</p>
          </div>
          <div>
            <p className="blog-benefit-title">14 nuances</p>
            <p className="blog-benefit-sub">Pour toutes les envies</p>
          </div>
          <div>
            <p className="blog-benefit-title">Soin intégré</p>
            <p className="blog-benefit-sub">Couleur + nutrition</p>
          </div>
          <div>
            <p className="blog-benefit-title">Application facile</p>
            <p className="blog-benefit-sub">Résultat salon à domicile</p>
          </div>
        </div>
      </div>

      <section className="blog-newsletter" aria-labelledby="blog-newsletter-heading">
        <div className="blog-newsletter-inner">
          <div className="blog-newsletter-copy">
            <h2 id="blog-newsletter-heading" className="blog-newsletter-title josefin">
              Restez inspirée
            </h2>
            <p className="blog-newsletter-desc">
              Inscrivez-vous pour recevoir nos actus, conseils beauté et nouveautés Badee Beauty. Une fois par e-mail, pas de spam.
            </p>
          </div>
          <form className="blog-newsletter-form" onSubmit={submitNewsletter} noValidate>
            <label htmlFor="blog-newsletter-email" className="sr-only">
              Votre e-mail
            </label>
            <input
              id="blog-newsletter-email"
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
