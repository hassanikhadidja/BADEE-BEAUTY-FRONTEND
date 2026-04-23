import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getPublishedBlogs } from "../services/blogApi";
import { resolveMediaUrl } from "../utils/mediaUrl";

const STATIC_POSTS = [
  {
    key: "static-mousse",
    slug: "/blog/mousse-rituelle",
    title: "La Mousse rituelle",
    subtitle: "Pureté, douceur & éclat — Badee Mousse Nettoyante",
    excerpt:
      "Trois essences pour chaque type de peau : une mousse qui nettoie, démaquille et hydrate en un seul geste, avec brosse silicone intégrée.",
    image: "https://res.cloudinary.com/dbtkfjrvd/image/upload/v1776353390/mousse7_luhqs9.jpg",
    tag: "Soins visage",
  },
  {
    key: "static-kera",
    slug: "/blog-beaute",
    title: "Kera Color",
    subtitle: "L’éclat manifeste pour votre chevelure",
    excerpt:
      "Colorations semi-permanentes sans ammoniaque : 14 nuances, texture soin et résultat glossy digne d’un salon.",
    image: `${process.env.PUBLIC_URL || ""}/blog/kera1.jpg`,
    tag: "Cheveux",
  },
];

export default function BlogIndex() {
  const [apiPosts, setApiPosts] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getPublishedBlogs();
        if (!cancelled && Array.isArray(data)) setApiPosts(data);
      } catch {
        if (!cancelled) setApiPosts([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const posts = useMemo(() => {
    const fromApi = apiPosts.map((b) => {
      const img = b.coverImage ? resolveMediaUrl(b.coverImage) : "";
      return {
        key: `api-${b._id || b.slug}`,
        slug: `/blog/article/${encodeURIComponent(b.slug)}`,
        title: b.title,
        subtitle: b.categoryLabel || "Blog",
        excerpt: b.excerpt || "",
        image: img || "https://placehold.co/800x500/f8f4f6/5c3d4a?text=Badee+Beauty",
        tag: b.categoryLabel || "Blog",
      };
    });
    return [...fromApi, ...STATIC_POSTS];
  }, [apiPosts]);

  return (
    <div className="blog-page">
      <div className="blog-breadcrumb">
        <div className="blog-breadcrumb-inner">
          <span className="blog-breadcrumb-path">Badee Beauty › Blog beauté</span>
          <h1 className="blog-breadcrumb-title">Journal beauté</h1>
          <p className="blog-index-lead">
            Conseils, routines et coulisses de la maison Badee Beauty.
          </p>
        </div>
      </div>

      <div className="blog-index-wrap">
        <div className="blog-index-grid">
          {posts.map((post) => (
            <Link key={post.key} to={post.slug} className="blog-index-card">
              <div className="blog-index-card-visual">
                <img src={post.image} alt="" loading="lazy" />
                <span className="blog-index-card-tag">{post.tag}</span>
              </div>
              <div className="blog-index-card-body">
                <h2 className="blog-index-card-title josefin">{post.title}</h2>
                <p className="blog-index-card-sub">{post.subtitle}</p>
                <p className="blog-index-card-excerpt">{post.excerpt}</p>
                <span className="blog-index-card-cta josefin">Lire l’article →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
