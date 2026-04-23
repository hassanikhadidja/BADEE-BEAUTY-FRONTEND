import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getHeroSlides } from "../services/heroApi";
import { resolveMediaUrl } from "../utils/mediaUrl";

const INTERVAL_MS = 5500;

/** Fallback when API is empty or unreachable — same shape as API items */
const FALLBACK = {
  mobile: [
    { imageUrl: "https://res.cloudinary.com/dbtkfjrvd/image/upload/v1776904605/photo_2026-04-23_01-35-15_szpcpu.jpg", productId: null },
    { imageUrl: "https://res.cloudinary.com/dbtkfjrvd/image/upload/v1776904605/photo_2026-04-23_01-35-12_tg5fco.jpg", productId: null },
  ],
  tablet: [
    { imageUrl: "https://res.cloudinary.com/dbtkfjrvd/image/upload/v1776904605/photo_2026-04-23_01-35-08_pxqhqa.jpg", productId: null },
  ],
  desktop: [
    { imageUrl: "https://res.cloudinary.com/dbtkfjrvd/image/upload/v1776904604/photo_2026-04-23_01-35-23_zahv4v.jpg", productId: null },
    { imageUrl: "https://res.cloudinary.com/dbtkfjrvd/image/upload/v1776904604/photo_2026-04-23_01-35-31_ntcz0l.jpg", productId: null },
  ],
};

function useHeroLayoutKey() {
  const [key, setKey] = useState("desktop");

  useEffect(() => {
    const read = () => {
      const w = window.innerWidth;
      if (w < 640) setKey("mobile");
      else if (w < 1024) setKey("tablet");
      else setKey("desktop");
    };
    read();
    window.addEventListener("resize", read);
    return () => window.removeEventListener("resize", read);
  }, []);

  return key;
}

export default function Hero() {
  const layoutKey = useHeroLayoutKey();
  const [apiData, setApiData] = useState(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const d = await getHeroSlides();
        if (!cancel && d && typeof d === "object") {
          setApiData({
            mobile: Array.isArray(d.mobile) ? d.mobile : [],
            tablet: Array.isArray(d.tablet) ? d.tablet : [],
            desktop: Array.isArray(d.desktop) ? d.desktop : [],
          });
        }
      } catch {
        if (!cancel) setApiData(null);
      }
    })();
    return () => {
      cancel = true;
    };
  }, []);

  const slides = useMemo(() => {
    const fromApi = apiData?.[layoutKey];
    if (fromApi && fromApi.length > 0) return fromApi;
    return FALLBACK[layoutKey] || [];
  }, [apiData, layoutKey]);

  useEffect(() => {
    setIndex(0);
  }, [layoutKey, slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return undefined;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [slides.length]);

  const go = (dir) => {
    setIndex((i) => {
      const n = slides.length;
      if (n === 0) return 0;
      return (i + dir + n) % n;
    });
  };

  return (
    <section className="hero-carousel" aria-roledescription="carousel" aria-label="Badee — bannières">
      <div className="hero-carousel-viewport">
        {slides.map((slide, i) => {
          const src = resolveMediaUrl(slide.imageUrl);
          const pid = slide.productId && String(slide.productId).trim();
          const img = (
            <img
              src={src || slide.imageUrl}
              alt=""
              className="hero-carousel-slide-img"
              loading={i === 0 ? "eager" : "lazy"}
              decoding="async"
            />
          );
          return (
            <div
              key={slide._id ? String(slide._id) : `${slide.imageUrl}-${i}`}
              className={`hero-carousel-slide${i === index ? " is-active" : ""}`}
            >
              {pid ? (
                <Link to={`/product/${pid}`} className="hero-carousel-slide-link">
                  {img}
                </Link>
              ) : (
                <div className="hero-carousel-slide-fill">{img}</div>
              )}
            </div>
          );
        })}
        <div className="hero-carousel-controls" aria-hidden="true">
          <button type="button" className="hero-carousel-arrow hero-carousel-arrow--prev" onClick={() => go(-1)} aria-label="Image précédente" />
          <button type="button" className="hero-carousel-arrow hero-carousel-arrow--next" onClick={() => go(1)} aria-label="Image suivante" />
        </div>
      </div>
      <div className="hero-carousel-dots" role="tablist" aria-label="Choisir une bannière">
        {slides.map((s, i) => (
          <button
            key={s._id ? String(s._id) : `dot-${s.imageUrl}-${i}`}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Bannière ${i + 1} sur ${slides.length}`}
            className={`hero-carousel-dot${i === index ? " is-active" : ""}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </section>
  );
}
