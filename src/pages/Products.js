import { useState, useMemo } from "react";
import { useOutletContext, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Sidebar from "../components/Sidebar";
import ProductCard from "../components/ProductCard";
import { useLang } from "../context/LangContext";
import { adaptProduct } from "../utils/shopAdapters";
import {
  filterProductsByParams,
  pageTitleFromParams,
  parseProductListParams,
} from "../utils/productFilters";
import IconImg from "../components/IconImg";

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sort, setSort] = useState("pert");
  const [q, setQ] = useState("");
  const { t } = useLang();
  const { openCart } = useOutletContext();
  const raw = useSelector((s) => s.products.products);
  const PRODS = useMemo(() => (raw || []).map(adaptProduct).filter(Boolean), [raw]);

  const filterParams = useMemo(() => parseProductListParams(searchParams), [searchParams]);
  const pageLabel = pageTitleFromParams(filterParams);

  const list = useMemo(() => {
    const filtered = filterProductsByParams(PRODS, filterParams);
    return filtered
      .filter((p) => p.name.toLowerCase().includes(q.toLowerCase()))
      .sort((a, b) => (sort === "pa" ? a.price - b.price : sort === "pd" ? b.price - a.price : sort === "r" ? b.r - a.r : 0));
  }, [PRODS, filterParams, q, sort]);

  return (
    <div style={{ background: "#fff" }}>
      <div style={{ background: "#EEF3EC", borderBottom: "1px solid #D4E8CF", padding: "14px 20px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <span style={{ fontSize: 12, color: "#666" }}>Badee Beauty › {pageLabel}</span>
          <h1 style={{ fontFamily: "'Josefin Sans',sans-serif", fontWeight: 700, fontSize: 20, letterSpacing: ".05em", textTransform: "uppercase", marginTop: 5 }}>
            {pageLabel === "Tous" ? "Tous nos Produits" : pageLabel}
          </h1>
          <p style={{ fontSize: 12, color: "#777", marginTop: 3 }}>
            {list.length} produit{list.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "24px 20px", display: "flex", gap: 30, alignItems: "flex-start" }}>
        <Sidebar searchParams={searchParams} setSearchParams={setSearchParams} />
        <div className="p-area" style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <span style={{ fontSize: 12, fontWeight: 700, fontFamily: "'Josefin Sans',sans-serif", letterSpacing: ".05em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{t.sortBy}</span>
              <select className="sort-sel" value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="pert">Pertinence</option>
                <option value="pa">Prix croissant</option>
                <option value="pd">Prix décroissant</option>
                <option value="r">Meilleures notes</option>
              </select>
            </div>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Rechercher..."
              style={{ padding: "8px 12px", border: "1px solid #E0E0E0", borderRadius: 3, fontSize: 12, fontFamily: "'Lato',sans-serif", outline: "none", maxWidth: 200 }}
            />
            <span style={{ fontSize: 12, color: "#AAA", marginLeft: "auto" }}>
              {list.length} résultat{list.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="product-grid">
            {list.map((p) => (
              <ProductCard key={p.id} product={p} openCart={openCart} />
            ))}
          </div>
          {!list.length && (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#BBB" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
                <IconImg name="search" height={40} alt="" />
              </div>
              <p style={{ fontFamily: "'Josefin Sans',sans-serif", fontWeight: 700, fontSize: 14, textTransform: "uppercase", letterSpacing: ".06em" }}>Aucun produit trouvé</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
