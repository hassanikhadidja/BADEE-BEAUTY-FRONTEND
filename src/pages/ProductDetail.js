import { useEffect, useMemo, useState, useRef } from "react";
import {
  getShadeVariants,
  findShadeByName,
  resolveLinePriceForShade,
  resolveLineOldForShade,
  normalizeHex,
} from "../utils/shadeUtils";
import { useParams, useNavigate, useOutletContext, Link, useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { adaptProduct } from "../utils/shopAdapters";
import { resolveMediaUrl } from "../utils/mediaUrl";
import { addToCart } from "../redux/cartSlice";
import { fetchProductById, clearCurrentProduct } from "../redux/productSlice";
import { useLang } from "../context/LangContext";
import { productRequiresOptionSelection } from "../utils/productVariants";
import ProductCard from "../components/ProductCard";
import { SelectableProductShadeSwatches } from "../components/ShadeSwatch";
import ProductImageGallery from "../components/ProductImageGallery";

function Stars({ r }) {
  const f = Math.floor(r);
  return (
    <span className="stars">
      {"★".repeat(f)}
      {"☆".repeat(5 - f)}
    </span>
  );
}

function Chip({ children }) {
  return <span className="pd-chip">{children}</span>;
}

function normalizeTeinte(str) {
  return String(str || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export default function ProductDetail() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useLang();
  const { openCart } = useOutletContext() || {};

  const list = useSelector((s) => s.products.products);
  const currentProduct = useSelector((s) => s.products.currentProduct);
  const loading = useSelector((s) => s.products.loading);

  useEffect(() => {
    dispatch(fetchProductById(id));
    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [id, dispatch]);

  const source = useMemo(() => {
    const inList = (list || []).find((x) => String(x._id || x.id) === String(id));
    const cur =
      currentProduct && String(currentProduct._id || currentProduct.id) === String(id) ? currentProduct : null;
    return cur || inList || null;
  }, [list, currentProduct, id]);

  const product = useMemo(() => (source ? adaptProduct(source) : null), [source]);

  const galleryUrls = useMemo(() => {
    if (!product?.img?.length) return [];
    return product.img.map((u) => resolveMediaUrl(u)).filter(Boolean);
  }, [product]);

  const youMightLike = useMemo(() => {
    if (!product) return [];
    const sid = String(id);
    const all = (list || []).map(adaptProduct).filter(Boolean);
    const rest = all.filter((p) => String(p.id) !== sid);
    const cat = product.cat;
    const sameCat = rest.filter((p) => p.cat === cat);
    const other = rest.filter((p) => p.cat !== cat);
    return [...sameCat, ...other].slice(0, 8);
  }, [list, id, product]);

  const [activeImg, setActiveImg] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const galleryRef = useRef(null);
  useEffect(() => {
    setActiveImg(0);
    setSelectedOption("");
  }, [id]);
  useEffect(() => {
    galleryRef.current?.goTo(0, "auto");
  }, [id, galleryUrls.length]);

  const variants = useMemo(() => (product ? getShadeVariants(product) : []), [product]);

  useEffect(() => {
    const teinte = searchParams.get("teinte");
    if (!teinte || !variants.length) return;
    const want = normalizeTeinte(teinte);
    const match = variants.find((v) => normalizeTeinte(v.name) === want);
    if (match?.name) setSelectedOption(match.name);
  }, [searchParams, variants, id]);
  const selectedShade = useMemo(
    () => (product ? findShadeByName(product, selectedOption) : null),
    [product, selectedOption],
  );
  const needsOption = Boolean(product && productRequiresOptionSelection(product));
  const displayPrice = useMemo(() => {
    if (!product) return 0;
    if (needsOption && selectedShade) return resolveLinePriceForShade(product, selectedShade);
    return product.price;
  }, [product, needsOption, selectedShade]);
  const displayOld = useMemo(() => {
    if (!product) return null;
    if (needsOption && selectedShade) return resolveLineOldForShade(product, selectedShade);
    return product.old;
  }, [product, needsOption, selectedShade]);
  const disc = displayOld ? Math.round((1 - displayPrice / displayOld) * 100) : 0;
  const shadeOut =
    Boolean(selectedShade) &&
    selectedShade.stock != null &&
    !Number.isNaN(Number(selectedShade.stock)) &&
    Number(selectedShade.stock) <= 0;
  const canAdd =
    Boolean(product) &&
    product.isAvailable &&
    (!needsOption || (selectedOption && selectedShade && !shadeOut));

  if (!product && loading) {
    return (
      <div className="pd-page pd-page--bare">
        <div className="pd-shell pd-shell--loading" role="status" aria-live="polite">
          <div className="pd-shell__spinner" aria-hidden />
          <p className="pd-shell__msg">Chargement du produit…</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pd-page pd-page--bare">
        <div className="pd-shell pd-shell--empty">
          <p className="pd-shell__title">Produit introuvable.</p>
          <button type="button" className="btn-pink pd-shell__cta" onClick={() => navigate("/products")}>
            Retour à la boutique
          </button>
        </div>
      </div>
    );
  }

  const nm = product.name;
  const desc = (product.description || "").trim();
  const brand = (product.brand || "").trim();
  const subCat = (product.subCategory || "").trim();

  return (
    <div className="pd-page pd-page--style-exp">
      <div className="pd-inner">
        <button type="button" onClick={() => navigate(-1)} className="pd-back">
          ← Retour
        </button>

        {!product.isAvailable && (
          <div className="pd-banner pd-banner--warn" role="alert">
            Ce produit est momentanément indisponible.
          </div>
        )}

        <div className="pd-grid">
          <div className="pd-gallery-col">
            <div className="pd-gallery-surface">
              <ProductImageGallery
                ref={galleryRef}
                urls={galleryUrls}
                alt={nm}
                activeIndex={activeImg}
                onIndexChange={setActiveImg}
                placeholderBg="hsl(220, 14%, 96%)"
              />
              {galleryUrls.length > 1 && (
                <div className="pd-thumbs pd-thumbs--scroll">
                  {galleryUrls.map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setActiveImg(i);
                        galleryRef.current?.goTo(i);
                      }}
                      className={`pd-thumb${activeImg === i ? " is-active" : ""}`}
                    >
                      <img src={url} alt="" draggable={false} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="pd-info">
            <div className="pd-info__top">
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
                {(product.isNew || product.badge === "Nouveau") && <span className="badge-pk">{t.new_}</span>}
                {product.isTrending && <span className="badge-bk">{t.trending}</span>}
                {product.isPack ? <span className="pd-badge badge-bk">{t.packBadge}</span> : null}
                {product.badge && product.badge !== "Nouveau" ? (
                  <span className="pd-badge badge-bk">{product.badge}</span>
                ) : null}
              </div>
              {brand ? <p className="pd-brand">{brand}</p> : null}
              <h1 className="pd-title">{nm}</h1>
              <div className="pd-rating">
                <Stars r={product.r} />
                <span className="pd-rating__count">({product.rev} avis)</span>
              </div>
            </div>

            <div className="pd-price-block" aria-live="polite">
              {displayOld ? (
                <>
                  <span className="pd-price-current">{displayPrice.toLocaleString()} {t.da}</span>
                  <span className="pd-price-old">{displayOld.toLocaleString()}</span>
                  {disc > 0 ? <span className="badge-pk pd-price-badge">-{disc}%</span> : null}
                </>
              ) : (
                <span className="pd-price-current pd-price-current--solo">{displayPrice.toLocaleString()} {t.da}</span>
              )}
            </div>

            <div className="pd-chips">
              <Chip>{product.cat || "Catégorie"}</Chip>
              {subCat ? <Chip>{subCat}</Chip> : null}
            </div>

            {product.skinType?.length > 0 && (
              <section className="pd-block">
                <h2 className="pd-block__label">Types de peau</h2>
                <div className="pd-chips pd-chips--tight">
                  {product.skinType.map((st) => (
                    <Chip key={st}>{st}</Chip>
                  ))}
                </div>
              </section>
            )}

            {desc ? (
              <section className="pd-block">
                <h2 className="pd-block__label">Description</h2>
                <p className="pd-desc">{desc}</p>
              </section>
            ) : null}

            {product.packProducts?.length > 0 && (
              <section className="pd-block">
                <h2 className="pd-block__label">{t.packContents}</h2>
                <div className="pd-pack-table-wrap">
                  <table className="pd-pack-table">
                    <thead>
                      <tr>
                        <th scope="col">{t.packColName}</th>
                        <th scope="col">{t.packColVolume}</th>
                        <th scope="col">{t.packColType}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.packProducts.map((row, i) => (
                        <tr key={i}>
                          <td>{row.name || "—"}</td>
                          <td>{row.volume || "—"}</td>
                          <td>{row.type || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {product.benefits?.length > 0 && (
              <section className="pd-block">
                <h2 className="pd-block__label">Bienfaits</h2>
                <ul className="pd-benefits">
                  {product.benefits.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </section>
            )}

            {product.tags?.length > 0 && (
              <section className="pd-block">
                <h2 className="pd-block__label">Mots-clés</h2>
                <div className="pd-tags">
                  {product.tags.map((tag) => (
                    <span key={tag} className="pd-tag">
                      #{tag}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {needsOption && (
              <section className="pd-block pd-block--shade">
                <h2 className="pd-block__label">
                  {t.productOptionLabel} <span className="pd-req">*</span>
                </h2>
                <SelectableProductShadeSwatches
                  name={`product-option-${product.id}`}
                  variants={variants}
                  value={selectedOption}
                  onSelect={setSelectedOption}
                  groupAriaLabel={t.productOptionLabel}
                />
                {selectedShade ? (
                  <div className="pd-shade-summary">
                    <span className="pd-shade-summary__name">{selectedShade.name}</span>
                    {selectedShade.price != null && selectedShade.price > 0 ? (
                      <span className="pd-shade-summary__price">
                        {selectedShade.price.toLocaleString()} {t.da}
                      </span>
                    ) : null}
                    {shadeOut ? <span className="pd-shade-summary__out">— Rupture</span> : null}
                  </div>
                ) : null}
                {!selectedOption ? <p className="pd-hint">{t.optionRequiredHint}</p> : null}
              </section>
            )}

            <div className="pd-buy-row">
              <button
                type="button"
                className="btn-pink pd-add-cart"
                disabled={!canAdd}
                onClick={() => {
                  if (!canAdd) return;
                  const sh = findShadeByName(product, selectedOption);
                  const linePrice = resolveLinePriceForShade(product, sh);
                  const lineOld = resolveLineOldForShade(product, sh);
                  dispatch(
                    addToCart({
                      ...product,
                      price: linePrice,
                      old: lineOld,
                      selectedOption: needsOption ? selectedOption : "",
                      selectedHex: sh?.hex ? normalizeHex(sh.hex) : "",
                    }),
                  );
                  openCart?.();
                }}
              >
                {product.isAvailable ? t.addCart : "Indisponible"}
              </button>
            </div>
          </div>
        </div>

        <section className="pd-related" aria-labelledby="pd-related-heading">
          <div className="pd-related-head">
            <h2 id="pd-related-heading" className="pd-related-title">
              {t.youMightLike}
            </h2>
            <p className="pd-related-sub">{youMightLike.length > 0 ? t.youMightLikeSub : t.noSuggestionsYet}</p>
          </div>
          {youMightLike.length > 0 ? (
            <div className="product-grid pd-related-grid">
              {youMightLike.map((p) => (
                <ProductCard key={p.id} product={p} openCart={openCart} />
              ))}
            </div>
          ) : (
            <div className="pd-related-empty">
              <Link to="/products" className="btn-pink pd-related-cta">
                {t.browseShop}
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
