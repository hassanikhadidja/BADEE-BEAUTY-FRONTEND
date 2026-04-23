import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getPublishedBlogBySlug } from "../services/blogApi";
import { resolveMediaUrl } from "../utils/mediaUrl";

export default function BlogArticle() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const data = await getPublishedBlogBySlug(slug);
        if (!cancelled) setPost(data);
      } catch (e) {
        if (!cancelled) setErr(e.response?.data?.msg || e.message || "Article introuvable");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="blog-page">
        <div className="blog-breadcrumb-inner" style={{ padding: "2rem 1.5rem" }}>
          <p className="blog-body" style={{ margin: 0 }}>
            Chargement…
          </p>
        </div>
      </div>
    );
  }

  if (err || !post) {
    return (
      <div className="blog-page">
        <div className="blog-breadcrumb">
          <div className="blog-breadcrumb-inner">
            <Link to="/blog" className="blog-sidebar-link" style={{ display: "inline-block", marginBottom: 12 }}>
              ← Blog beauté
            </Link>
            <h1 className="blog-breadcrumb-title">Article introuvable</h1>
            <p className="blog-index-lead">{err || "Ce contenu n’est pas disponible."}</p>
          </div>
        </div>
      </div>
    );
  }

  const cover = post.coverImage ? resolveMediaUrl(post.coverImage) : "";
  const isRichEmbed = (post.content || "").includes("blog-blond-one-html");

  return (
    <div className={`blog-page blog-dynamic-page${isRichEmbed ? " blog-dynamic-page--embed" : ""}`}>
      <div className="blog-breadcrumb">
        <div className="blog-breadcrumb-inner">
          <span className="blog-breadcrumb-path">
            Badee Beauty › <Link to="/blog">Blog beauté</Link> › {post.title}
          </span>
          <h1 className="blog-breadcrumb-title">Journal beauté</h1>
        </div>
      </div>

      <div className="blog-content-wrap">
        <article className="blog-article blog-dynamic-article">
          {!isRichEmbed ? (
            <>
              <p className="blog-label">{post.categoryLabel || "Blog"}</p>
              <h2 className="blog-hero-heading josefin" style={{ marginBottom: "1rem" }}>
                {post.title}
              </h2>
              {post.excerpt ? (
                <p className="blog-lead" style={{ marginBottom: "1.5rem" }}>
                  {post.excerpt}
                </p>
              ) : null}
              {cover ? (
                <div className="blog-img-wrap blog-img-full" style={{ marginBottom: "2rem" }}>
                  <img src={cover} alt="" className="blog-img" loading="lazy" />
                </div>
              ) : null}
            </>
          ) : null}
          <div
            className={`blog-dynamic-body${isRichEmbed ? " blog-dynamic-body--embed-root" : ""}`}
            dangerouslySetInnerHTML={{ __html: post.content || "" }}
          />
          <p style={{ marginTop: "2.5rem", padding: isRichEmbed ? "0 1.25rem" : undefined }}>
            <Link to="/blog" className="blog-cta josefin">
              ← Tous les articles
            </Link>
          </p>
        </article>
      </div>
    </div>
  );
}
