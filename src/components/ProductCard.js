import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { toggleWishlist } from "../redux/wishlistSlice";
import { useLang } from "../context/LangContext";
import { productRequiresOptionSelection } from "../utils/productVariants";
import { getShadeVariants } from "../utils/shadeUtils";
import { ProductShadeSwatches } from "./ShadeSwatch";
import { resolveMediaUrl } from "../utils/mediaUrl";
import IconImg from "./IconImg";

function Stars({ r }) {
  const f = Math.floor(r);
  return (
    <span className="stars">
      {"★".repeat(f)}
      {"☆".repeat(5 - f)}
    </span>
  );
}

/** Resolve img whether it's an array (backend) or a string (adapted). */
function resolveImg(img) {
  if (Array.isArray(img)) return img[0] || "";
  return img || "";
}

export default function ProductCard({ product, openCart }) {
  const [imgErr, setImgErr] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const addedTimerRef = useRef(null);
  const { t } = useLang();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const productTitle = product?.name != null ? String(product.name) : "";
  const needsOption = productRequiresOptionSelection(product);
  const swatches = getShadeVariants(product);
  const pid = String(product.id ?? product._id ?? "");
  const inWishlist = useSelector((s) => s.wishlist.ids.includes(pid));
  const disc = product.old ? Math.round((1 - product.price / product.old) * 100) : 0;
  const imgSrc = resolveMediaUrl(resolveImg(product.img));

  useEffect(() => {
    return () => {
      if (addedTimerRef.current) clearTimeout(addedTimerRef.current);
    };
  }, []);

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (needsOption) {
      navigate(`/product/${product.id}`);
      return;
    }
    dispatch(addToCart(product));
    openCart?.();
    setJustAdded(true);
    if (addedTimerRef.current) clearTimeout(addedTimerRef.current);
    addedTimerRef.current = setTimeout(() => setJustAdded(false), 2000);
  };

  return (
    <Link to={`/product/${product.id}`} className="p-card pc-link pc-card">
      <div className="pc-card__badges">
        {(product.isNew || product.badge === "Nouveau") && <span className="badge-pk">{t.new_}</span>}
        {product.isTrending && <span className="badge-bk pc-card__badge-trend">{t.trending}</span>}
        {product.badge && product.badge !== "Nouveau" && <span className="badge-bk">{product.badge}</span>}
        {product.old && <span className="badge-pk badge-pk--sale">-{disc}%</span>}
      </div>

      <button
        type="button"
        className={`heart-btn${inWishlist ? " on" : ""}`}
        aria-pressed={inWishlist}
        aria-label={inWishlist ? "Retirer des favoris" : "Ajouter aux favoris"}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (pid) dispatch(toggleWishlist(pid));
        }}
      >
        <IconImg name="heart" height={16} alt="" style={{ opacity: inWishlist ? 1 : 0.35 }} />
      </button>

      <div className="pc-card__media">
        {imgSrc && !imgErr ? (
          <img
            src={imgSrc}
            alt=""
            className="pc-card__img"
            loading="lazy"
            decoding="async"
            sizes="(max-width: 480px) 50vw, (max-width: 960px) 33vw, 280px"
            onError={() => setImgErr(true)}
          />
        ) : (
          <span className="pc-card__placeholder">IMAGE PRODUIT</span>
        )}
      </div>

      <div className="pc-body pc-card__body">
        {product.offer && <div className="offer-tag pc-card__offer">{t.offer}</div>}
        <div className="pc-card__text">
          {product.brand ? <div className="pc-card__brand">{product.brand}</div> : null}
          <h3 className="pc-card__title">{productTitle}</h3>
          {product.description ? (
            <p className="pc-card__desc">{product.description.replace(/\s+/g, " ").trim()}</p>
          ) : null}
        </div>
        {swatches.length > 0 ? <ProductShadeSwatches variants={swatches} /> : null}
        <div className="pc-card__meta">
          <Stars r={product.r} />
          <span className="pc-card__rev">({product.rev})</span>
        </div>
        <div className="pc-card__price-row">
          {product.old ? (
            <>
              <span className="pc-card__price">{product.price.toLocaleString()} {t.da}</span>
              <span className="pc-card__price-old">{product.old.toLocaleString()}</span>
            </>
          ) : (
            <span className="pc-card__price pc-card__price--solo">{product.price.toLocaleString()} {t.da}</span>
          )}
        </div>
        <button
          type="button"
          className={`pc-card__cta${justAdded ? " pc-card__cta--added" : ""}`}
          onClick={handleAdd}
        >
          {justAdded ? (
            <>
              <IconImg name="basket" height={18} alt="" style={{ opacity: 0.95 }} />
              <span>{t.addedToCart}</span>
            </>
          ) : needsOption ? (
            t.pickProductOption
          ) : (
            t.addCart
          )}
        </button>
      </div>
    </Link>
  );
}
