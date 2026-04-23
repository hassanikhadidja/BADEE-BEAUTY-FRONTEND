import { forwardRef, useImperativeHandle, useRef, useEffect, useCallback } from "react";

/**
 * Horizontal scroll / carousel for product images: touch swipe, mouse drag, scroll-snap.
 */
const ProductImageGallery = forwardRef(function ProductImageGallery(
  { urls, alt, activeIndex, onIndexChange, placeholderBg = "#F7F7F7" },
  ref,
) {
  const trackRef = useRef(null);
  const dragRef = useRef({ dragging: false, startX: 0, startScroll: 0 });

  const goTo = useCallback(
    (i, behavior = "smooth") => {
      const el = trackRef.current;
      if (!el || !urls.length) return;
      const w = el.offsetWidth || 1;
      const max = urls.length - 1;
      const idx = Math.min(max, Math.max(0, i));
      el.scrollTo({ left: idx * w, behavior });
    },
    [urls.length],
  );

  useImperativeHandle(
    ref,
    () => ({
      goTo,
    }),
    [goTo],
  );

  const onScroll = () => {
    const el = trackRef.current;
    if (!el || urls.length <= 1) return;
    const w = el.offsetWidth || 1;
    const idx = Math.round(el.scrollLeft / w);
    const clamped = Math.min(urls.length - 1, Math.max(0, idx));
    if (clamped !== activeIndex) onIndexChange(clamped);
  };

  useEffect(() => {
    const onMove = (e) => {
      if (!dragRef.current.dragging || !trackRef.current) return;
      trackRef.current.scrollLeft = dragRef.current.startScroll - (e.clientX - dragRef.current.startX);
    };
    const onUp = () => {
      dragRef.current.dragging = false;
      const t = trackRef.current;
      if (t) t.classList.remove("pd-gallery-track--dragging");
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  const onMouseDown = (e) => {
    if (e.button !== 0 || urls.length <= 1) return;
    dragRef.current = {
      dragging: true,
      startX: e.clientX,
      startScroll: trackRef.current?.scrollLeft ?? 0,
    };
    trackRef.current?.classList.add("pd-gallery-track--dragging");
  };

  const showNav = urls.length > 1;
  const prev = () => goTo(activeIndex - 1);
  const next = () => goTo(activeIndex + 1);

  const onGalleryKeyDown = (e) => {
    if (!showNav) return;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    }
  };

  if (!urls.length) {
    return (
      <div className="pd-gallery pd-gallery--empty" style={{ background: placeholderBg }}>
        <div className="pd-gallery-fallback">Aucune image</div>
      </div>
    );
  }

  return (
    <div
      className="pd-gallery"
      tabIndex={showNav ? 0 : -1}
      onKeyDown={onGalleryKeyDown}
    >
      {showNav && (
        <>
          <button
            type="button"
            className="pd-gallery-nav pd-gallery-nav--prev"
            onClick={() => prev()}
            disabled={activeIndex <= 0}
            aria-label="Image précédente"
          />
          <button
            type="button"
            className="pd-gallery-nav pd-gallery-nav--next"
            onClick={() => next()}
            disabled={activeIndex >= urls.length - 1}
            aria-label="Image suivante"
          />
        </>
      )}
      <div
        ref={trackRef}
        className="pd-gallery-track"
        onScroll={onScroll}
        onMouseDown={onMouseDown}
        role="region"
        aria-roledescription="carousel"
        aria-label={`Galerie produit, ${urls.length} image${urls.length > 1 ? "s" : ""}`}
      >
        {urls.map((url, i) => (
          <div key={i} className="pd-gallery-slide">
            <img
              src={url}
              alt={i === 0 ? alt : `${alt} — ${i + 1}`}
              draggable={false}
              className="pd-gallery-img"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
});

export default ProductImageGallery;
