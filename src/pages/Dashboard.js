import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllProducts, deleteProduct } from "../redux/productSlice";
import { fetchAllOrders, updateOrderStatus, deleteOrder } from "../redux/orderSlice";
import { adaptProduct, adaptOrder } from "../utils/shopAdapters";
import { LogoMark } from "../components/Logo";
import IconImg from "../components/IconImg";
import { createProduct as apiCreate, updateProduct as apiUpdate } from "../services/productApi";
import {
  getAllBlogsAdmin,
  createBlog as apiCreateBlog,
  updateBlog as apiUpdateBlog,
  deleteBlog as apiDeleteBlog,
} from "../services/blogApi";
import { getAllUsers } from "../services/userApi";
import {
  getHeroSlides,
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
} from "../services/heroApi";
import { resolveMediaUrl } from "../utils/mediaUrl";
import "./DashboardProductModal.css";

function Sbadge({ s }) {
  const m = {
    pending: "En attente",
    confirmed: "Confirmé",
    shipped: "Expédié",
    delivered: "Livré",
    cancelled: "Annulé",
  };
  return <span className={`s-${s}`}>{m[s] || s}</span>;
}

function slugifyBlogTitle(title) {
  return String(title || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function freshBlogForm() {
  return {
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    categoryLabel: "Blog",
    isPublished: false,
    coverFile: null,
    existingCover: "",
  };
}

const HERO_LAYOUT_LABELS = {
  mobile: "Petit écran (< 640 px)",
  tablet: "Tablette (640 px – 1023 px)",
  desktop: "Grand écran (≥ 1024 px)",
};

function freshProductForm() {
  return {
    name: "",
    brand: "BADEE BEAUTY",
    price: "",
    discountPrice: "",
    description: "",
    category: "Skincare",
    subCategory: "",
    skinType: [],
    benefits: "",
    tags: "",
    shades: [],
    isAvailable: true,
    isNew: false,
    isTrending: false,
    isPack: false,
    packProducts: [],
    rating: "4.5",
    existingImgs: [],
    newFiles: [],
    removedImgs: new Set(),
  };
}

export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [act, setAct] = useState("overview");
  const [modal, setModal] = useState(null); // "add" or product object
  const [sb, setSb] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [delOrderId, setDelOrderId] = useState(null);
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState('success');
  const [saving, setSaving] = useState(false);

  const rawProds = useSelector((s) => s.products.products);
  const rawOrds = useSelector((s) => s.orders.orders);
  const ordersLoading = useSelector((s) => s.orders.loading);
  const ordersError = useSelector((s) => s.orders.error);
  const prodLoading = useSelector((s) => s.products.loading);
  const { user } = useSelector((s) => s.auth || {});

  const prods = useMemo(() => (rawProds || []).map(adaptProduct).filter(Boolean), [rawProds]);
  const ords = useMemo(() => (rawOrds || []).map(adaptOrder).filter(Boolean), [rawOrds]);

  const [form, setForm] = useState(() => freshProductForm());
  const [editId, setEditId] = useState(null);
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);

  const [blogs, setBlogs] = useState([]);
  const [blogsLoading, setBlogsLoading] = useState(false);
  const [blogModal, setBlogModal] = useState(false);
  const [blogEditId, setBlogEditId] = useState(null);
  const [blogSaving, setBlogSaving] = useState(false);
  const [blogForm, setBlogForm] = useState(() => freshBlogForm());

  const [heroSlides, setHeroSlides] = useState({ mobile: [], tablet: [], desktop: [] });
  const [heroLoading, setHeroLoading] = useState(false);
  const [heroSaving, setHeroSaving] = useState(false);
  const [heroForm, setHeroForm] = useState({
    layout: "mobile",
    productId: "",
    imageUrl: "",
    order: "",
    file: null,
  });
  const [heroEdit, setHeroEdit] = useState(null);

  useEffect(() => {
    dispatch(fetchAllProducts());
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const loadUsers = useCallback(async () => {
    setUsersLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setUsersLoading(false);
    }
  }, []);

  useEffect(() => {
    if (act === "users" || act === "overview") loadUsers();
  }, [act, loadUsers]);

  const flash = (m, type = 'success') => {
    setMsg(m);
    setMsgType(type);
    setTimeout(() => setMsg(''), 4000);
  };

  const loadHeroSlides = useCallback(async () => {
    setHeroLoading(true);
    try {
      const d = await getHeroSlides();
      setHeroSlides({
        mobile: Array.isArray(d?.mobile) ? d.mobile : [],
        tablet: Array.isArray(d?.tablet) ? d.tablet : [],
        desktop: Array.isArray(d?.desktop) ? d.desktop : [],
      });
    } catch (e) {
      console.error(e);
      setMsg("Impossible de charger les bannières d’accueil");
      setMsgType("error");
      setTimeout(() => setMsg(""), 4000);
    } finally {
      setHeroLoading(false);
    }
  }, []);

  const loadBlogs = useCallback(async () => {
    setBlogsLoading(true);
    try {
      const data = await getAllBlogsAdmin();
      setBlogs(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setBlogs([]);
      setMsg("Impossible de charger les articles de blog");
      setMsgType("error");
      setTimeout(() => setMsg(""), 4000);
    } finally {
      setBlogsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (act === "blogs") loadBlogs();
  }, [act, loadBlogs]);

  useEffect(() => {
    if (act === "hero") loadHeroSlides();
  }, [act, loadHeroSlides]);

  // Image Handlers
  const handleAddFiles = (e) => {
    const picked = Array.from(e.target.files);
    setForm(f => ({ ...f, newFiles: [...f.newFiles, ...picked] }));
    e.target.value = '';
  };

  const removeNewFile = (idx) => {
    setForm(f => ({ ...f, newFiles: f.newFiles.filter((_, i) => i !== idx) }));
  };

  const toggleRemoveExisting = (url) => {
    setForm(f => {
      const next = new Set(f.removedImgs);
      next.has(url) ? next.delete(url) : next.add(url);
      return { ...f, removedImgs: next };
    });
  };

  const restoreAll = () => setForm(f => ({ ...f, removedImgs: new Set() }));

  // Submit Product
  const handleProductSubmit = async () => {
    setSaving(true);
    const keptUrls = form.existingImgs.filter(u => !form.removedImgs.has(u));

    if (!editId && form.newFiles.length === 0) {
      flash('❌ Veuillez sélectionner au moins une image', 'error');
      setSaving(false);
      return;
    }

    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('brand', form.brand);
    fd.append('price', String(Number(form.price) || 0));
    if (form.discountPrice) fd.append('discountPrice', String(Number(form.discountPrice)));
    fd.append('description', form.description);
    fd.append('category', form.category);
    if (form.subCategory) fd.append('subCategory', form.subCategory);
    fd.append('isAvailable', String(form.isAvailable));
    fd.append('isNew', String(form.isNew));
    fd.append('isTrending', String(form.isTrending));
    fd.append('isPack', String(form.isPack));
    if (form.rating) fd.append('rating', String(Number(form.rating)));

    // Arrays
    form.skinType.forEach(st => fd.append('skinType', st));
    if (form.benefits) form.benefits.split(',').map(b => b.trim()).filter(Boolean).forEach(b => fd.append('benefits', b));
    if (form.tags) form.tags.split(',').map(t => t.trim()).filter(Boolean).forEach(t => fd.append('tags', t));

    const shadeList =
      form.category === "Makeup" || form.category === "Hair Color"
        ? form.shades
            .map((s) => ({
              name: String(s.name || "").trim(),
              hex: String(s.hex || "#CCCCCC").trim(),
              stock: s.stock !== "" && s.stock != null && !Number.isNaN(Number(s.stock)) ? Number(s.stock) : undefined,
              price:
                s.price !== "" && s.price != null && !Number.isNaN(Number(s.price)) && Number(s.price) > 0
                  ? Number(s.price)
                  : undefined,
            }))
            .filter((s) => s.name)
        : [];
    fd.append("shades", JSON.stringify(shadeList));

    const packList = form.isPack
      ? form.packProducts
          .map((row) => ({
            name: String(row.name || "").trim(),
            volume: String(row.volume || "").trim(),
            type: String(row.type || "").trim(),
          }))
          .filter((row) => row.name || row.volume || row.type)
      : [];
    fd.append("packProducts", JSON.stringify(packList));

    // Images
    keptUrls.forEach(url => fd.append('keepImgs', url));
    form.newFiles.forEach(file => fd.append('files', file, file.name));

    try {
      if (editId) {
        await apiUpdate(editId, fd);
        flash('✅ Produit mis à jour avec succès !');
      } else {
        await apiCreate(fd);
        flash('🎉 Nouveau produit ajouté !');
      }
      dispatch(fetchAllProducts());
      setModal(null);
      setForm(freshProductForm());
      setEditId(null);
    } catch (err) {
      flash('❌ ' + (err.response?.data?.msg || err.message || 'Erreur lors de la sauvegarde'), 'error');
    } finally {
      setSaving(false);
    }
  };

  const openAddModal = () => {
    setForm(freshProductForm());
    setEditId(null);
    setModal("add");
  };

  const handleEdit = (pAdapted) => {
    const rid = pAdapted._id || pAdapted.id;
    const raw = (rawProds || []).find((r) => String(r._id || r.id) === String(rid));
    const base = raw || pAdapted;
    const imgs = Array.isArray(base.img) ? base.img : base.img ? [base.img] : [];
    setForm({
      name: base.name || "",
      brand: base.brand || "BADEE BEAUTY",
      price: base.price ?? "",
      discountPrice: base.discountPrice ?? "",
      description: base.description || "",
      category: base.category || "Skincare",
      subCategory: base.subCategory || "",
      skinType: Array.isArray(base.skinType) ? [...base.skinType] : [],
      benefits: Array.isArray(base.benefits) ? base.benefits.join(", ") : "",
      tags: Array.isArray(base.tags) ? base.tags.join(", ") : "",
      shades: (() => {
        if (Array.isArray(base.shades) && base.shades.length) {
          return base.shades.map((s) => ({
            name: s.name || "",
            hex: s.hex || "#CCCCCC",
            stock: s.stock != null && s.stock !== "" ? String(s.stock) : "",
            price: s.price != null && s.price !== "" ? String(s.price) : "",
          }));
        }
        if (Array.isArray(base.options) && base.options.length) {
          return base.options.map((o) => ({ name: String(o), hex: "#E0E0E0", stock: "", price: "" }));
        }
        return [];
      })(),
      isAvailable: base.isAvailable !== false,
      isNew: Boolean(base.isNew),
      isTrending: Boolean(base.isTrending),
      isPack: Boolean(base.isPack),
      packProducts: (() => {
        const raw = base.packProducts;
        if (!Array.isArray(raw) || !raw.length) return [];
        return raw.map((row) => ({
          name: String(row?.name || "").trim(),
          volume: String(row?.volume || "").trim(),
          type: String(row?.type || "").trim(),
        }));
      })(),
      rating: base.rating?.toString() || "4.5",
      existingImgs: imgs.filter((u) => u && u !== "product image"),
      newFiles: [],
      removedImgs: new Set(),
    });
    setEditId(rid);
    setModal("edit");
  };

  const firstImgSrc = (p) => {
    const raw = Array.isArray(p.img) ? p.img[0] : p.img;
    return resolveMediaUrl(raw);
  };

  const openBlogAdd = () => {
    setBlogForm(freshBlogForm());
    setBlogEditId(null);
    setBlogModal(true);
  };

  const handleBlogEdit = (b) => {
    setBlogForm({
      title: b.title || "",
      slug: b.slug || "",
      excerpt: b.excerpt || "",
      content: b.content || "",
      categoryLabel: b.categoryLabel || "Blog",
      isPublished: Boolean(b.isPublished),
      coverFile: null,
      existingCover: b.coverImage || "",
    });
    setBlogEditId(b._id || b.id);
    setBlogModal(true);
  };

  const handleBlogSubmit = async () => {
    const title = blogForm.title.trim();
    if (!title) {
      flash("Le titre de l’article est requis", "error");
      return;
    }
    setBlogSaving(true);
    const fd = new FormData();
    fd.append("title", title);
    fd.append("slug", blogForm.slug.trim());
    fd.append("excerpt", blogForm.excerpt);
    fd.append("content", blogForm.content);
    fd.append("categoryLabel", blogForm.categoryLabel.trim() || "Blog");
    fd.append("isPublished", String(blogForm.isPublished));
    if (blogForm.coverFile) {
      fd.append("cover", blogForm.coverFile, blogForm.coverFile.name);
    } else if (blogEditId) {
      fd.append("keepCover", blogForm.existingCover || "");
    }
    try {
      if (blogEditId) {
        await apiUpdateBlog(blogEditId, fd);
        flash("Article mis à jour");
      } else {
        await apiCreateBlog(fd);
        flash("Article créé");
      }
      setBlogModal(false);
      setBlogEditId(null);
      setBlogForm(freshBlogForm());
      loadBlogs();
    } catch (err) {
      flash("Erreur : " + (err.response?.data?.msg || err.message || "sauvegarde impossible"), "error");
    } finally {
      setBlogSaving(false);
    }
  };

  const handleOrderStatus = async (orderId, status) => {
    try {
      await dispatch(updateOrderStatus({ id: orderId, status })).unwrap();
      flash("Statut mis à jour");
    } catch (e) {
      flash(typeof e === "string" ? e : "Impossible de mettre à jour le statut", "error");
    }
  };

  const handleDeleteOrder = async (id) => {
    try {
      await dispatch(deleteOrder(id)).unwrap();
      setDelOrderId(null);
      flash("Commande supprimée");
    } catch (e) {
      setDelOrderId(null);
      flash(typeof e === "string" ? e : "Suppression impossible", "error");
    }
  };

  const submitHeroAdd = async (e) => {
    e.preventDefault();
    if (!heroForm.file && !heroForm.imageUrl.trim()) {
      flash("Ajoutez une image (fichier ou URL)", "error");
      return;
    }
    setHeroSaving(true);
    try {
      const fd = new FormData();
      fd.append("layout", heroForm.layout);
      if (heroForm.productId) fd.append("productId", heroForm.productId);
      if (heroForm.order !== "" && heroForm.order != null) fd.append("order", String(heroForm.order));
      if (heroForm.file) fd.append("file", heroForm.file);
      else fd.append("imageUrl", heroForm.imageUrl.trim());
      await createHeroSlide(fd);
      flash("Bannière ajoutée");
      setHeroForm({
        layout: heroForm.layout,
        productId: "",
        imageUrl: "",
        order: "",
        file: null,
      });
      loadHeroSlides();
    } catch (err) {
      flash(err.response?.data?.msg || err.message || "Échec de l’ajout", "error");
    } finally {
      setHeroSaving(false);
    }
  };

  const submitHeroEdit = async (e) => {
    e.preventDefault();
    if (!heroEdit) return;
    setHeroSaving(true);
    try {
      const fd = new FormData();
      fd.append("layout", heroEdit.layout);
      fd.append("productId", heroEdit.productId ? String(heroEdit.productId) : "");
      fd.append("order", String(heroEdit.order ?? 0));
      if (heroEdit.file) fd.append("file", heroEdit.file);
      else if (String(heroEdit.imageUrl || "").trim() !== String(heroEdit._initialUrl || "").trim()) {
        fd.append("imageUrl", String(heroEdit.imageUrl).trim());
      }
      await updateHeroSlide(heroEdit._id, fd);
      flash("Bannière mise à jour");
      setHeroEdit(null);
      loadHeroSlides();
    } catch (err) {
      flash(err.response?.data?.msg || err.message || "Échec de la mise à jour", "error");
    } finally {
      setHeroSaving(false);
    }
  };

  const removeHeroSlide = async (id) => {
    if (!window.confirm("Supprimer cette bannière ?")) return;
    try {
      await deleteHeroSlide(id);
      flash("Bannière supprimée");
      loadHeroSlides();
    } catch (err) {
      flash(err.response?.data?.msg || err.message || "Suppression impossible", "error");
    }
  };

  const keptImgCount = form.existingImgs.filter((u) => !form.removedImgs.has(u)).length;
  const totalImgCount = keptImgCount + form.newFiles.length;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F4F4F4", fontFamily: "'Lato',sans-serif" }}>
      {/* Sidebar - Your original beautiful sidebar remains unchanged */}
      <aside style={{ width: sb ? 215 : 58, flexShrink: 0, background: "#1A1A1A", display: "flex", flexDirection: "column", transition: "width .3s", position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>
        <div style={{ padding: "18px 15px", borderBottom: "1px solid #2A2A2A", display: "flex", alignItems: "center", gap: 9 }}>
          <LogoMark variant="black" height={28} alt="" />
          {sb && <span style={{ fontFamily: "'Josefin Sans',sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: ".1em", textTransform: "uppercase", color: "#fff" }}>Badee Beauty Admin</span>}
        </div>

        <nav style={{ flex: 1, paddingTop: 6 }}>
          {[
            { id: "overview", l: "Vue d'ensemble", icon: "map" },
            { id: "products", l: "Produits", icon: "basket" },
            { id: "blogs", l: "Blog", icon: "money" },
            { id: "hero", l: "Bannières accueil", icon: "map" },
            { id: "orders", l: "Commandes", icon: "delivery" },
            { id: "users", l: "Utilisateurs", icon: "call" },
          ].map((item) => (
            <button key={item.id} type="button" onClick={() => setAct(item.id)} className={`db-item${act === item.id ? " on" : ""}`}>
              <IconImg name={item.icon} height={18} alt="" style={{ filter: "brightness(0) invert(1)" }} />
              {sb && <span>{item.l}</span>}
            </button>
          ))}
        </nav>

        <div style={{ borderTop: "1px solid #2A2A2A" }}>
          <button type="button" onClick={() => navigate("/")} className="db-item">
            <IconImg name="basket" height={18} alt="" style={{ filter: "brightness(0) invert(1)" }} />
            {sb && <span>Boutique</span>}
          </button>
          <button type="button" onClick={() => setSb(!sb)} style={{ width: "100%", background: "none", border: "none", color: "#555", padding: "10px 20px", cursor: "pointer", fontSize: 18 }}>
            {sb ? "◂" : "▸"}
          </button>
        </div>
      </aside>

      <main style={{ flex: 1, padding: "26px 30px", overflow: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 10 }}>
          <div>
            <h1 style={{ fontFamily: "'Josefin Sans',sans-serif", fontWeight: 700, fontSize: 20, letterSpacing: ".06em", textTransform: "uppercase" }}>
              {act === "overview"
                ? "Tableau de Bord"
                : act === "products"
                  ? "Gestion des Produits"
                  : act === "blogs"
                    ? "Articles de blog"
                    : act === "hero"
                      ? "Bannières page d’accueil"
                      : act === "orders"
                        ? "Commandes"
                        : "Clients"}
            </h1>
          </div>
          {act === "products" && (
            <button type="button" className="btn-pink" onClick={openAddModal} style={{ padding: "9px 18px", fontSize: 12 }}>
              + Nouveau Produit
            </button>
          )}
          {act === "blogs" && (
            <button type="button" className="btn-pink" onClick={openBlogAdd} style={{ padding: "9px 18px", fontSize: 12 }}>
              + Nouvel article
            </button>
          )}
          {act === "hero" && (
            <button type="button" className="btn-pk-out" onClick={loadHeroSlides} style={{ padding: "9px 18px", fontSize: 12 }}>
              Actualiser
            </button>
          )}
        </div>

        {msg && (
          <div style={{
            padding: "12px 16px",
            marginBottom: 20,
            borderRadius: 4,
            background: msgType === 'error' ? '#FDEDEC' : '#E8F5E9',
            color: msgType === 'error' ? '#C0392B' : '#1E8449',
            border: `1px solid ${msgType === 'error' ? '#F1948A' : '#7DCEA0'}`
          }}>
            {msg}
          </div>
        )}

        {act === "overview" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            {[
              { l: "Produits", v: prods.length, icon: "basket" },
              { l: "Commandes", v: ords.length, icon: "delivery" },
              {
                l: "CA livré (DA)",
                v: ords
                  .filter((o) => o.status === "delivered")
                  .reduce((s, o) => s + (Number(o.total) || 0), 0)
                  .toLocaleString(),
                icon: "money",
              },
              { l: "Utilisateurs", v: usersLoading ? "…" : users.length, icon: "call" },
            ].map((x) => (
              <div key={x.l} style={{ background: "#fff", border: "1px solid #E0E0E0", borderRadius: 6, padding: 20 }}>
                <IconImg name={x.icon} height={24} alt="" />
                <div style={{ fontSize: 22, fontWeight: 700, marginTop: 10 }}>{x.v}</div>
                <div style={{ fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: ".06em" }}>{x.l}</div>
              </div>
            ))}
            <div style={{ gridColumn: "1 / -1", background: "#fff", border: "1px solid #E0E0E0", borderRadius: 6, padding: 16 }}>
              <div style={{ fontWeight: 700, marginBottom: 10 }}>Connecté</div>
              <p style={{ margin: 0, fontSize: 14, color: "#555" }}>
                {user?.name || user?.email} — rôle : <strong>{user?.role || "—"}</strong>
              </p>
            </div>
          </div>
        )}

        {act === "blogs" && (
          <div style={{ background: "#fff", border: "1px solid #E0E0E0", borderRadius: 3, overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid #E0E0E0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 700 }}>Articles ({blogs.length})</span>
              <button type="button" className="btn-pk-out" style={{ padding: "6px 12px", fontSize: 11 }} onClick={loadBlogs}>
                Actualiser
              </button>
            </div>
            {blogsLoading ? (
              <p style={{ padding: 24, textAlign: "center", color: "#888" }}>Chargement…</p>
            ) : blogs.length === 0 ? (
              <p style={{ padding: 24, textAlign: "center", color: "#AAA" }}>
                Aucun article. Cliquez sur « Nouvel article » pour en créer un. Les articles cochés « Publié » apparaissent sur /blog.
              </p>
            ) : (
              <table className="db-tbl">
                <thead>
                  <tr>
                    <th>Couverture</th>
                    <th>Titre</th>
                    <th>Slug (URL)</th>
                    <th>Publié</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {blogs.map((b) => {
                    const bid = b._id || b.id;
                    const cover = b.coverImage ? resolveMediaUrl(b.coverImage) : "";
                    return (
                      <tr key={bid}>
                        <td>
                          {cover ? (
                            <img src={cover} alt="" style={{ width: 56, height: 40, objectFit: "contain", borderRadius: 4 }} />
                          ) : (
                            <span style={{ color: "#ccc", fontSize: 12 }}>—</span>
                          )}
                        </td>
                        <td>
                          <strong>{b.title}</strong>
                          <div style={{ fontSize: 11, color: "#888" }}>{b.categoryLabel || "Blog"}</div>
                        </td>
                        <td>
                          <code style={{ fontSize: 11 }}>/blog/article/{b.slug}</code>
                        </td>
                        <td>
                          <span
                            style={{
                              padding: "4px 10px",
                              borderRadius: 20,
                              fontSize: 11,
                              background: b.isPublished ? "#EAFAF1" : "#F4F4F4",
                              color: b.isPublished ? "#1E8449" : "#777",
                            }}
                          >
                            {b.isPublished ? "Oui" : "Brouillon"}
                          </span>
                        </td>
                        <td>
                          <button type="button" onClick={() => handleBlogEdit(b)} style={{ marginRight: 6, padding: "6px 12px", fontSize: 12 }}>
                            Modifier
                          </button>
                          <a
                            href={`/blog/article/${encodeURIComponent(b.slug)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ marginRight: 6, padding: "6px 12px", fontSize: 12, display: "inline-block" }}
                          >
                            Voir
                          </a>
                          <button
                            type="button"
                            onClick={() => setShowDeleteModal({ type: "blog", id: bid })}
                            style={{ padding: "6px 12px", fontSize: 12, background: "#FDEDEC", color: "#C0392B" }}
                          >
                            Supprimer
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}

        {act === "products" && (
          <div style={{ background: "#fff", border: "1px solid #E0E0E0", borderRadius: 3, overflow: "hidden" }}>
            {prodLoading ? (
              <p style={{ padding: 24, textAlign: "center", color: "#888" }}>Chargement des produits…</p>
            ) : (
              <table className="db-tbl">
                <thead>
                  <tr>
                    <th>Produit</th>
                    <th>Catégorie</th>
                    <th>Prix vente</th>
                    <th>Prix catalogue</th>
                    <th>Disponible</th>
                    <th>Images</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {prods.map((p) => (
                    <tr key={p._id || p.id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div className="shop-thumb shop-thumb--row">
                            <img
                              src={firstImgSrc(p)}
                              alt={p.name}
                              onError={(e) => {
                                e.target.src = "https://placehold.co/48x48/e8f4fd/1a7fe8?text=BB";
                              }}
                            />
                          </div>
                          <div>
                            <strong>{p.name}</strong>
                            <div style={{ fontSize: 12, color: "#777" }}>{p.brand}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        {p.category || p.cat}{" "}
                        {p.subCategory && <small style={{ color: "#999" }}>→ {p.subCategory}</small>}
                      </td>
                      <td style={{ fontWeight: 700, color: "#D6247F" }}>{p.price?.toLocaleString()} DA</td>
                      <td style={{ color: "#888", fontSize: 13 }}>
                        {p.old ? (
                          <span style={{ textDecoration: "line-through" }}>{p.old.toLocaleString()} DA</span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td>
                        <span
                          style={{
                            padding: "4px 10px",
                            borderRadius: 20,
                            fontSize: 11,
                            background: p.isAvailable ? "#EAFAF1" : "#FDEDEC",
                            color: p.isAvailable ? "#1E8449" : "#C0392B",
                          }}
                        >
                          {p.isAvailable ? "En stock" : "Indisponible"}
                        </span>
                      </td>
                      <td>{Array.isArray(p.img) ? p.img.length : p.img ? 1 : 0}</td>
                      <td>
                        <button type="button" onClick={() => handleEdit(p)} style={{ marginRight: 6, padding: "6px 12px", fontSize: 12 }}>
                          Modifier
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowDeleteModal({ type: "product", id: p._id || p.id })}
                          style={{ padding: "6px 12px", fontSize: 12, background: "#FDEDEC", color: "#C0392B" }}
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {act === "orders" && (
          <div style={{ background: "#fff", border: "1px solid #E0E0E0", borderRadius: 3, overflow: "auto" }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid #E0E0E0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 700 }}>Commandes ({ords.length})</span>
              <button type="button" className="btn-pk-out" style={{ padding: "6px 12px", fontSize: 11 }} onClick={() => dispatch(fetchAllOrders())}>
                Actualiser
              </button>
            </div>
            {ordersError && (
              <p style={{ padding: 16, color: "#C0392B" }}>{ordersError}</p>
            )}
            {ordersLoading ? (
              <p style={{ padding: 24, textAlign: "center", color: "#888" }}>Chargement…</p>
            ) : ords.length === 0 ? (
              <p style={{ padding: 24, textAlign: "center", color: "#AAA" }}>Aucune commande.</p>
            ) : (
              <table className="db-tbl">
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Articles</th>
                    <th>Total</th>
                    <th>Date</th>
                    <th>Statut</th>
                    <th>Modifier</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {ords.map((o) => (
                    <tr key={o._id || o.id}>
                      <td>
                        <strong>{o.customerName || o.cust}</strong>
                        <div style={{ fontSize: 11, color: "#777" }}>{o.phone}</div>
                        {o.customerEmail ? (
                          <div style={{ fontSize: 11, color: "#777" }}>{o.customerEmail}</div>
                        ) : null}
                        <div style={{ fontSize: 11, color: "#999" }}>
                          {o.commune ? `${o.commune}, ${o.wilaya}` : o.wilaya}
                        </div>
                      </td>
                      <td>
                        {(o.lineItems || []).slice(0, 3).map((item, i) => (
                          <div key={i} style={{ fontSize: 12, marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
                            {item.img ? (
                              <div className="shop-thumb shop-thumb--xs">
                                <img
                                  src={resolveMediaUrl(item.img)}
                                  alt=""
                                  onError={(e) => {
                                    e.target.style.display = "none";
                                  }}
                                />
                              </div>
                            ) : null}
                            <span>
                              {item.quantity || item.qty || 1}× {item.name || "—"}
                              {item.selectedOption ? (
                                <span style={{ color: "#D6247F" }}> ({item.selectedOption})</span>
                              ) : null}
                            </span>
                          </div>
                        ))}
                        {(o.lineItems || []).length > 3 ? (
                          <small style={{ color: "#999" }}>+{(o.lineItems || []).length - 3} …</small>
                        ) : null}
                      </td>
                      <td style={{ fontWeight: 700 }}>
                        {o.total?.toLocaleString()} DA
                        <div style={{ fontSize: 10, color: "#999", fontWeight: 400 }}>
                          livr. {o.deliveryFee === 0 ? "gratuite" : `${o.deliveryFee} DA`}
                        </div>
                      </td>
                      <td style={{ fontSize: 12, color: "#666" }}>{o.date}</td>
                      <td>
                        <Sbadge s={o.status} />
                      </td>
                      <td>
                        <select
                          value={["pending", "confirmed", "delivered", "cancelled"].includes(o.status) ? o.status : "pending"}
                          onChange={(e) => handleOrderStatus(o._id || o.id, e.target.value)}
                          style={{ padding: "4px 8px", fontSize: 11, borderRadius: 3, border: "1px solid #ddd" }}
                        >
                          <option value="pending">En attente</option>
                          <option value="confirmed">Confirmé</option>
                          <option value="delivered">Livré</option>
                          <option value="cancelled">Annulé</option>
                        </select>
                      </td>
                      <td>
                        <button type="button" onClick={() => setDelOrderId(o._id || o.id)} style={{ padding: "4px 8px", fontSize: 11, background: "#FDEDEC", color: "#C0392B", border: "none", borderRadius: 3, cursor: "pointer" }}>
                          Suppr.
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {act === "hero" && (
          <div>
            <div style={{ background: "#fff", border: "1px solid #E0E0E0", borderRadius: 6, padding: "20px 22px", marginBottom: 20 }}>
              <h2 style={{ fontFamily: "'Josefin Sans',sans-serif", fontSize: 15, marginBottom: 8 }}>Nouvelle bannière</h2>
              <p style={{ fontSize: 13, color: "#666", marginBottom: 16, lineHeight: 1.5 }}>
                Choisissez le format d’écran, optionnellement un produit (clic sur l’image → fiche produit), puis envoyez une image (fichier ou URL Cloudinary / autre).
              </p>
              <form onSubmit={submitHeroAdd} style={{ display: "grid", gap: 14, maxWidth: 560 }}>
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, marginBottom: 4 }}>Format d’affichage</label>
                  <select
                    value={heroForm.layout}
                    onChange={(e) => setHeroForm((f) => ({ ...f, layout: e.target.value }))}
                    style={{ width: "100%", padding: 10, border: "1px solid #E0E0E0", borderRadius: 3 }}
                  >
                    <option value="mobile">{HERO_LAYOUT_LABELS.mobile}</option>
                    <option value="tablet">{HERO_LAYOUT_LABELS.tablet}</option>
                    <option value="desktop">{HERO_LAYOUT_LABELS.desktop}</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, marginBottom: 4 }}>Produit au clic (optionnel)</label>
                  <select
                    value={heroForm.productId}
                    onChange={(e) => setHeroForm((f) => ({ ...f, productId: e.target.value }))}
                    style={{ width: "100%", padding: 10, border: "1px solid #E0E0E0", borderRadius: 3 }}
                  >
                    <option value="">— Aucun lien —</option>
                    {prods.map((p) => (
                      <option key={p.id} value={String(p.id)}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, marginBottom: 4 }}>Ordre (optionnel, sinon ajout en fin)</label>
                  <input
                    type="number"
                    min={0}
                    value={heroForm.order}
                    onChange={(e) => setHeroForm((f) => ({ ...f, order: e.target.value }))}
                    placeholder="0"
                    style={{ width: "100%", padding: 10, border: "1px solid #E0E0E0", borderRadius: 3 }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, marginBottom: 4 }}>Fichier image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setHeroForm((f) => ({ ...f, file: e.target.files?.[0] || null }))}
                    style={{ fontSize: 13 }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, marginBottom: 4 }}>Ou URL de l’image</label>
                  <input
                    type="url"
                    value={heroForm.imageUrl}
                    onChange={(e) => setHeroForm((f) => ({ ...f, imageUrl: e.target.value }))}
                    placeholder="https://…"
                    style={{ width: "100%", padding: 10, border: "1px solid #E0E0E0", borderRadius: 3 }}
                  />
                </div>
                <button type="submit" className="btn-pink" disabled={heroSaving} style={{ padding: "11px 20px", justifyContent: "center", width: "fit-content" }}>
                  {heroSaving ? "Envoi…" : "Ajouter la bannière"}
                </button>
              </form>
            </div>

            {heroLoading ? (
              <p style={{ padding: 24, textAlign: "center", color: "#888" }}>Chargement des bannières…</p>
            ) : (
              ["mobile", "tablet", "desktop"].map((layout) => (
                <div key={layout} style={{ background: "#fff", border: "1px solid #E0E0E0", borderRadius: 6, marginBottom: 16, overflow: "hidden" }}>
                  <div style={{ padding: "12px 16px", borderBottom: "1px solid #E0E0E0", background: "#FAFAFA" }}>
                    <strong style={{ fontFamily: "'Josefin Sans',sans-serif", fontSize: 13 }}>{HERO_LAYOUT_LABELS[layout]}</strong>
                    <span style={{ fontSize: 12, color: "#888", marginLeft: 8 }}>({heroSlides[layout].length})</span>
                  </div>
                  <div style={{ padding: 16 }}>
                    {heroSlides[layout].length === 0 ? (
                      <p style={{ margin: 0, fontSize: 13, color: "#888", lineHeight: 1.5 }}>
                        Aucune bannière enregistrée pour ce format. La boutique utilise des images par défaut jusqu’à ce que vous en ajoutiez.
                      </p>
                    ) : (
                      heroSlides[layout].map((slide) => {
                        const linked = slide.productId
                          ? prods.find((p) => String(p.id) === String(slide.productId))
                          : null;
                        return (
                          <div
                            key={slide._id}
                            style={{
                              display: "flex",
                              gap: 16,
                              alignItems: "center",
                              flexWrap: "wrap",
                              padding: "12px 0",
                              borderBottom: "1px solid #F0F0F0",
                            }}
                          >
                            <img
                              src={resolveMediaUrl(slide.imageUrl)}
                              alt=""
                              style={{ width: 140, height: 84, objectFit: "cover", borderRadius: 4, border: "1px solid #EEE" }}
                            />
                            <div style={{ flex: "1 1 200px", minWidth: 0 }}>
                              <div style={{ fontSize: 12, color: "#666" }}>Ordre : {slide.order ?? 0}</div>
                              <div style={{ fontSize: 13, marginTop: 4 }}>
                                <span style={{ color: "#888" }}>Clic → </span>
                                {linked ? <strong>{linked.name}</strong> : slide.productId ? <code style={{ fontSize: 11 }}>{slide.productId}</code> : "aucun produit"}
                              </div>
                            </div>
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                              <button
                                type="button"
                                className="btn-pk-out"
                                style={{ padding: "6px 12px", fontSize: 11 }}
                                onClick={() =>
                                  setHeroEdit({
                                    _id: slide._id,
                                    layout: slide.layout || layout,
                                    productId: slide.productId ? String(slide.productId) : "",
                                    order: slide.order ?? 0,
                                    imageUrl: slide.imageUrl,
                                    _initialUrl: slide.imageUrl,
                                    file: null,
                                  })
                                }
                              >
                                Modifier
                              </button>
                              <button
                                type="button"
                                style={{ padding: "6px 12px", fontSize: 11, background: "#FDEDEC", color: "#C0392B", border: "none", borderRadius: 3, cursor: "pointer" }}
                                onClick={() => removeHeroSlide(slide._id)}
                              >
                                Suppr.
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {heroEdit && (
          <div
            className="dpm-overlay"
            role="presentation"
            onClick={() => {
              if (!heroSaving) setHeroEdit(null);
            }}
          >
            <div className="dpm-panel" role="dialog" aria-labelledby="hero-edit-title" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480 }}>
              <header className="dpm-header">
                <div className="dpm-header-text">
                  <h2 id="hero-edit-title">Modifier la bannière</h2>
                  <p style={{ margin: 0, fontSize: 13, color: "#666" }}>Format, produit lié, ordre ; remplacez l’image par un nouveau fichier ou une nouvelle URL si besoin.</p>
                </div>
                <button type="button" className="dpm-close" aria-label="Fermer" disabled={heroSaving} onClick={() => setHeroEdit(null)}>
                  ×
                </button>
              </header>
              <form onSubmit={submitHeroEdit} className="dpm-scroll">
                <section className="dpm-section">
                  <img src={resolveMediaUrl(heroEdit.imageUrl)} alt="" style={{ width: "100%", maxHeight: 160, objectFit: "cover", borderRadius: 4, marginBottom: 14 }} />
                  <div className="dpm-field dpm-field-full">
                    <label className="dpm-label">Format</label>
                    <select
                      className="dpm-input"
                      value={heroEdit.layout}
                      onChange={(e) => setHeroEdit((h) => ({ ...h, layout: e.target.value }))}
                    >
                      <option value="mobile">{HERO_LAYOUT_LABELS.mobile}</option>
                      <option value="tablet">{HERO_LAYOUT_LABELS.tablet}</option>
                      <option value="desktop">{HERO_LAYOUT_LABELS.desktop}</option>
                    </select>
                  </div>
                  <div className="dpm-field dpm-field-full">
                    <label className="dpm-label">Produit au clic</label>
                    <select
                      className="dpm-input"
                      value={heroEdit.productId}
                      onChange={(e) => setHeroEdit((h) => ({ ...h, productId: e.target.value }))}
                    >
                      <option value="">— Aucun lien —</option>
                      {prods.map((p) => (
                        <option key={p.id} value={String(p.id)}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="dpm-field dpm-field-full">
                    <label className="dpm-label">Ordre</label>
                    <input
                      className="dpm-input"
                      type="number"
                      min={0}
                      value={heroEdit.order}
                      onChange={(e) => setHeroEdit((h) => ({ ...h, order: e.target.value }))}
                    />
                  </div>
                  <div className="dpm-field dpm-field-full">
                    <label className="dpm-label">Nouvelle image (fichier)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setHeroEdit((h) => ({ ...h, file: e.target.files?.[0] || null }))}
                    />
                  </div>
                  <div className="dpm-field dpm-field-full">
                    <label className="dpm-label">Ou URL de remplacement</label>
                    <input
                      className="dpm-input"
                      type="url"
                      value={heroEdit.imageUrl}
                      onChange={(e) => setHeroEdit((h) => ({ ...h, imageUrl: e.target.value }))}
                    />
                  </div>
                </section>
                <footer className="dpm-footer">
                  <button type="button" className="btn-pk-out" disabled={heroSaving} onClick={() => setHeroEdit(null)}>
                    Annuler
                  </button>
                  <button type="submit" className="btn-pink" disabled={heroSaving}>
                    {heroSaving ? "Enregistrement…" : "Enregistrer"}
                  </button>
                </footer>
              </form>
            </div>
          </div>
        )}

        {act === "users" && (
          <div style={{ background: "#fff", border: "1px solid #E0E0E0", borderRadius: 3, overflow: "auto" }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid #E0E0E0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 700 }}>Utilisateurs ({users.length})</span>
              <button type="button" className="btn-pk-out" style={{ padding: "6px 12px", fontSize: 11 }} onClick={loadUsers}>
                Actualiser
              </button>
            </div>
            {usersLoading ? (
              <p style={{ padding: 24, textAlign: "center", color: "#888" }}>Chargement…</p>
            ) : users.length === 0 ? (
              <p style={{ padding: 24, textAlign: "center", color: "#AAA" }}>Aucun utilisateur ou accès refusé.</p>
            ) : (
              <table className="db-tbl">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Rôle</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td style={{ fontWeight: 600 }}>{u.name || "—"}</td>
                      <td style={{ color: "#666" }}>{u.email}</td>
                      <td>
                        <span style={{ fontSize: 11, textTransform: "uppercase" }}>{u.role}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {blogModal && (
          <div
            className="dpm-overlay"
            role="presentation"
            onClick={() => {
              if (!blogSaving) {
                setBlogModal(false);
                setBlogForm(freshBlogForm());
                setBlogEditId(null);
              }
            }}
          >
            <div className="dpm-panel" role="dialog" aria-labelledby="dblog-title" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 640 }}>
              <header className="dpm-header">
                <div className="dpm-header-text">
                  <h2 id="dblog-title">{blogEditId ? "Modifier l’article" : "Nouvel article de blog"}</h2>
                  <p>
                    Contenu affiché sur la page publique <strong>/blog</strong> lorsque « Publié » est coché. Le corps peut
                    contenir du HTML simple (titres, paragraphes, listes, liens).
                  </p>
                </div>
                <button
                  type="button"
                  className="dpm-close"
                  aria-label="Fermer"
                  disabled={blogSaving}
                  onClick={() => {
                    setBlogModal(false);
                    setBlogForm(freshBlogForm());
                    setBlogEditId(null);
                  }}
                >
                  ×
                </button>
              </header>
              <div className="dpm-scroll">
                <section className="dpm-section">
                  <h3 className="dpm-section-title">Contenu</h3>
                  <div className="dpm-field dpm-field-full">
                    <label className="dpm-label">Titre *</label>
                    <input
                      className="dpm-input"
                      value={blogForm.title}
                      onChange={(e) => setBlogForm((f) => ({ ...f, title: e.target.value }))}
                      placeholder="Titre de l’article"
                    />
                  </div>
                  <div className="dpm-field dpm-field-full" style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "flex-end" }}>
                    <div style={{ flex: "1 1 200px" }}>
                      <label className="dpm-label">Slug (URL)</label>
                      <input
                        className="dpm-input"
                        value={blogForm.slug}
                        onChange={(e) => setBlogForm((f) => ({ ...f, slug: e.target.value }))}
                        placeholder="auto si vide — ex. mon-conseil-beaute"
                      />
                    </div>
                    <button
                      type="button"
                      className="btn-pk-out"
                      style={{ padding: "8px 14px", fontSize: 12, marginBottom: 2 }}
                      onClick={() => setBlogForm((f) => ({ ...f, slug: slugifyBlogTitle(f.title) }))}
                    >
                      Générer depuis le titre
                    </button>
                  </div>
                  <div className="dpm-field dpm-field-full">
                    <label className="dpm-label">Chapô / extrait</label>
                    <textarea
                      className="dpm-textarea"
                      rows={3}
                      value={blogForm.excerpt}
                      onChange={(e) => setBlogForm((f) => ({ ...f, excerpt: e.target.value }))}
                      placeholder="Résumé affiché sur la liste des articles"
                    />
                  </div>
                  <div className="dpm-field dpm-field-full">
                    <label className="dpm-label">Corps de l’article (HTML)</label>
                    <textarea
                      className="dpm-textarea"
                      rows={12}
                      value={blogForm.content}
                      onChange={(e) => setBlogForm((f) => ({ ...f, content: e.target.value }))}
                      placeholder="<p>Paragraphe…</p>"
                    />
                  </div>
                  <div className="dpm-field">
                    <label className="dpm-label">Rubrique (badge)</label>
                    <input
                      className="dpm-input"
                      value={blogForm.categoryLabel}
                      onChange={(e) => setBlogForm((f) => ({ ...f, categoryLabel: e.target.value }))}
                      placeholder="Blog, Soins visage…"
                    />
                  </div>
                  <label className="dpm-check-row" style={{ marginTop: 12 }}>
                    <input
                      type="checkbox"
                      checked={blogForm.isPublished}
                      onChange={(e) => setBlogForm((f) => ({ ...f, isPublished: e.target.checked }))}
                    />
                    Publié — visible sur le site
                  </label>
                </section>
                <section className="dpm-section">
                  <h3 className="dpm-section-title">Image de couverture</h3>
                  {blogForm.existingCover && !blogForm.coverFile ? (
                    <div style={{ marginBottom: 12 }}>
                      <img
                        src={resolveMediaUrl(blogForm.existingCover)}
                        alt=""
                        style={{ maxWidth: 200, maxHeight: 120, objectFit: "contain", borderRadius: 6, border: "1px solid #eee" }}
                      />
                    </div>
                  ) : null}
                  {blogForm.coverFile ? (
                    <p style={{ fontSize: 12, color: "#555" }}>Nouveau fichier : {blogForm.coverFile.name}</p>
                  ) : null}
                  <label className="dpm-add-files">
                    {blogForm.coverFile || blogForm.existingCover ? "Remplacer l’image" : "+ Ajouter une image"}
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        setBlogForm((bf) => ({ ...bf, coverFile: f || null }));
                        e.target.value = "";
                      }}
                    />
                  </label>
                </section>
              </div>
              <footer className="dpm-footer">
                <button
                  type="button"
                  className="dpm-btn-cancel"
                  disabled={blogSaving}
                  onClick={() => {
                    setBlogModal(false);
                    setBlogForm(freshBlogForm());
                    setBlogEditId(null);
                  }}
                >
                  Annuler
                </button>
                <button type="button" className="dpm-btn-save" disabled={blogSaving} onClick={handleBlogSubmit}>
                  {blogSaving ? "Enregistrement…" : blogEditId ? "Enregistrer" : "Créer l’article"}
                </button>
              </footer>
            </div>
          </div>
        )}

        {modal && (
          <div
            className="dpm-overlay"
            role="presentation"
            onClick={() => {
              if (!saving) {
                setModal(null);
                setForm(freshProductForm());
                setEditId(null);
              }
            }}
          >
            <div className="dpm-panel" role="dialog" aria-labelledby="dpm-title" onClick={(e) => e.stopPropagation()}>
              <header className="dpm-header">
                <div className="dpm-header-text">
                  <h2 id="dpm-title">{editId ? "Modifier le produit" : "Nouveau produit"}</h2>
                  <p>
                    Renseignez les informations visibles sur la boutique. Les champs marqués d’une astérisque (*) sont
                    requis pour l’enregistrement côté API.
                  </p>
                </div>
                <button
                  type="button"
                  className="dpm-close"
                  aria-label="Fermer"
                  disabled={saving}
                  onClick={() => {
                    setModal(null);
                    setForm(freshProductForm());
                    setEditId(null);
                  }}
                >
                  ×
                </button>
              </header>

              <div className="dpm-scroll">
                <section className="dpm-section">
                  <h3 className="dpm-section-title">Identité & description</h3>
                  <div className="dpm-grid-2">
                    <div className="dpm-field dpm-field-full">
                      <label className="dpm-label">Nom du produit *</label>
                      <input
                        className="dpm-input"
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                        placeholder="Ex. Sérum éclat vitamine C"
                        required
                      />
                    </div>
                    <div className="dpm-field">
                      <label className="dpm-label">Marque</label>
                      <input
                        className="dpm-input"
                        value={form.brand}
                        onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))}
                        placeholder="BADEE BEAUTY"
                      />
                    </div>
                    <div className="dpm-field dpm-field-full">
                      <label className="dpm-label">Description *</label>
                      <textarea
                        className="dpm-textarea"
                        rows={5}
                        value={form.description}
                        onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                        placeholder="Ingrédients, mode d’emploi, conseils d’utilisation…"
                        required
                      />
                      <span className="dpm-hint">Ce texte apparaît sur la fiche produit côté client.</span>
                    </div>
                  </div>
                </section>

                <section className="dpm-section">
                  <h3 className="dpm-section-title">Tarifs & avis</h3>
                  <div className="dpm-grid-3">
                    <div className="dpm-field">
                      <label className="dpm-label">Prix catalogue (DA) *</label>
                      <input
                        className="dpm-input"
                        type="number"
                        min={0}
                        value={form.price}
                        onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="dpm-field">
                      <label className="dpm-label">
                        Prix promo <span className="dpm-label-opt">(DA)</span>
                      </label>
                      <input
                        className="dpm-input"
                        type="number"
                        min={0}
                        value={form.discountPrice}
                        onChange={(e) => setForm((f) => ({ ...f, discountPrice: e.target.value }))}
                        placeholder="Vide = pas de promo"
                      />
                      <span className="dpm-hint">Si renseigné et inférieur au prix catalogue, il s’affiche comme prix soldé.</span>
                    </div>
                    <div className="dpm-field">
                      <label className="dpm-label">Note (0 – 5)</label>
                      <input
                        className="dpm-input"
                        type="number"
                        step={0.1}
                        min={0}
                        max={5}
                        value={form.rating}
                        onChange={(e) => setForm((f) => ({ ...f, rating: e.target.value }))}
                      />
                    </div>
                  </div>
                </section>

                <section className="dpm-section">
                  <h3 className="dpm-section-title">Rayon</h3>
                  <div className="dpm-grid-2">
                    <div className="dpm-field">
                      <label className="dpm-label">Catégorie *</label>
                      <select className="dpm-select" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
                        {["Skincare", "Makeup", "Hair Care", "Hair Color", "Fragrance", "Haircare", "Bodycare", "Other"].map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="dpm-field">
                      <label className="dpm-label">Sous-catégorie</label>
                      <select className="dpm-select" value={form.subCategory} onChange={(e) => setForm((f) => ({ ...f, subCategory: e.target.value }))}>
                        <option value="">Choisir…</option>
                        {["Lips", "Face", "Eyes", "Foundation", "Skincare", "Serum", "Cleanser", "Moisturizer", "Mask", "Perfume", "Hair", "Body", "Soins", "Other"].map((sc) => (
                          <option key={sc} value={sc}>
                            {sc}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </section>

                {(form.category === "Makeup" || form.category === "Hair Color") && (
                  <section className="dpm-section">
                    <h3 className="dpm-section-title">Teintes & couleurs</h3>
                    <p className="dpm-hint" style={{ marginTop: 0, marginBottom: 12 }}>
                      Nom + code hex (#RRGGBB) affiché sur la fiche et les cartes. Stock / prix par teinte sont optionnels.
                    </p>
                    {(form.shades.length === 0 ? [{ name: "", hex: "#CC8899", stock: "", price: "" }] : form.shades).map((row, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 100px 80px 80px auto",
                          gap: 8,
                          alignItems: "center",
                          marginBottom: 10,
                        }}
                      >
                        <input
                          className="dpm-input"
                          placeholder="Nom (ex. 117, Rouge…)"
                          value={row.name}
                          onChange={(e) => {
                            const v = e.target.value;
                            setForm((f) => {
                              const list = [...(f.shades.length ? f.shades : [{ name: "", hex: "#CC8899", stock: "", price: "" }])];
                              list[idx] = { ...list[idx], name: v };
                              return { ...f, shades: list };
                            });
                          }}
                        />
                        <input
                          className="dpm-input"
                          placeholder="#HEX"
                          value={row.hex}
                          onChange={(e) => {
                            const v = e.target.value;
                            setForm((f) => {
                              const list = [...(f.shades.length ? f.shades : [{ name: "", hex: "#CC8899", stock: "", price: "" }])];
                              list[idx] = { ...list[idx], hex: v };
                              return { ...f, shades: list };
                            });
                          }}
                        />
                        <input
                          className="dpm-input"
                          placeholder="Stock"
                          inputMode="numeric"
                          value={row.stock}
                          onChange={(e) => {
                            const v = e.target.value;
                            setForm((f) => {
                              const list = [...(f.shades.length ? f.shades : [{ name: "", hex: "#CC8899", stock: "", price: "" }])];
                              list[idx] = { ...list[idx], stock: v };
                              return { ...f, shades: list };
                            });
                          }}
                        />
                        <input
                          className="dpm-input"
                          placeholder="Prix"
                          inputMode="decimal"
                          value={row.price}
                          onChange={(e) => {
                            const v = e.target.value;
                            setForm((f) => {
                              const list = [...(f.shades.length ? f.shades : [{ name: "", hex: "#CC8899", stock: "", price: "" }])];
                              list[idx] = { ...list[idx], price: v };
                              return { ...f, shades: list };
                            });
                          }}
                        />
                        <button
                          type="button"
                          className="btn-pk-out"
                          style={{ padding: "8px 10px", fontSize: 11 }}
                          onClick={() =>
                            setForm((f) => ({
                              ...f,
                              shades: (f.shades.length ? f.shades : [{ name: "", hex: "#CC8899", stock: "", price: "" }]).filter((_, i) => i !== idx),
                            }))
                          }
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="btn-pk-out"
                      style={{ marginTop: 4, padding: "8px 14px", fontSize: 12 }}
                      onClick={() =>
                        setForm((f) => ({
                          ...f,
                          shades: [...(f.shades.length ? f.shades : []), { name: "", hex: "#CCCCCC", stock: "", price: "" }],
                        }))
                      }
                    >
                      + Ajouter une teinte
                    </button>
                  </section>
                )}

                <section className="dpm-section">
                  <h3 className="dpm-section-title">Types de peau</h3>
                  <p className="dpm-hint" style={{ marginTop: 0, marginBottom: 12 }}>
                    Aide les clientes à filtrer : cochez tout ce qui convient.
                  </p>
                  <div className="dpm-skin-wrap">
                    {["Oily", "Dry", "Combination", "Sensitive", "Normal", "All"].map((type) => {
                      const on = form.skinType.includes(type);
                      return (
                        <label key={type} className={`dpm-skin-chip${on ? " dpm-skin-chip--on" : ""}`}>
                          <input
                            type="checkbox"
                            checked={on}
                            onChange={() => {
                              setForm((f) => ({
                                ...f,
                                skinType: f.skinType.includes(type) ? f.skinType.filter((t) => t !== type) : [...f.skinType, type],
                              }));
                            }}
                          />
                          {type}
                        </label>
                      );
                    })}
                  </div>
                </section>

                <section className="dpm-section">
                  <h3 className="dpm-section-title">Bienfaits & mots-clés</h3>
                  <div className="dpm-grid-2">
                    <div className="dpm-field">
                      <label className="dpm-label">Bienfaits</label>
                      <input
                        className="dpm-input"
                        value={form.benefits}
                        onChange={(e) => setForm((f) => ({ ...f, benefits: e.target.value }))}
                        placeholder="Hydratation, Anti-âge, Éclat…"
                      />
                      <span className="dpm-hint">Séparés par des virgules.</span>
                    </div>
                    <div className="dpm-field">
                      <label className="dpm-label">Tags</label>
                      <input
                        className="dpm-input"
                        value={form.tags}
                        onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
                        placeholder="naturel, bio, vitamine-c…"
                      />
                      <span className="dpm-hint">Séparés par des virgules.</span>
                    </div>
                  </div>
                </section>

                <section className="dpm-section">
                  <h3 className="dpm-section-title">Pack (plusieurs articles)</h3>
                  <p className="dpm-hint" style={{ marginTop: 0, marginBottom: 12 }}>
                    Cochez si ce produit est un coffret ou un lot : listez chaque article avec nom, volume et type (ex. sérum, crème).
                  </p>
                  <label className="dpm-check-row">
                    <input
                      type="checkbox"
                      checked={form.isPack}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          isPack: e.target.checked,
                          packProducts:
                            e.target.checked && (!f.packProducts || f.packProducts.length === 0)
                              ? [{ name: "", volume: "", type: "" }]
                              : f.packProducts,
                        }))
                      }
                    />
                    Ce produit est un pack (plusieurs produits inclus)
                  </label>
                  {form.isPack && (
                    <>
                      {(form.packProducts.length === 0
                        ? [{ name: "", volume: "", type: "" }]
                        : form.packProducts
                      ).map((row, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr 1fr auto",
                            gap: 8,
                            alignItems: "center",
                            marginBottom: 10,
                            marginTop: idx === 0 ? 12 : 0,
                          }}
                        >
                          <input
                            className="dpm-input"
                            placeholder="Nom de l’article"
                            value={row.name}
                            onChange={(e) => {
                              const v = e.target.value;
                              setForm((f) => {
                                const list = [...(f.packProducts.length ? f.packProducts : [{ name: "", volume: "", type: "" }])];
                                list[idx] = { ...list[idx], name: v };
                                return { ...f, packProducts: list };
                              });
                            }}
                          />
                          <input
                            className="dpm-input"
                            placeholder="Volume (ex. 30 ml)"
                            value={row.volume}
                            onChange={(e) => {
                              const v = e.target.value;
                              setForm((f) => {
                                const list = [...(f.packProducts.length ? f.packProducts : [{ name: "", volume: "", type: "" }])];
                                list[idx] = { ...list[idx], volume: v };
                                return { ...f, packProducts: list };
                              });
                            }}
                          />
                          <input
                            className="dpm-input"
                            placeholder="Type (ex. sérum, crème)"
                            value={row.type}
                            onChange={(e) => {
                              const v = e.target.value;
                              setForm((f) => {
                                const list = [...(f.packProducts.length ? f.packProducts : [{ name: "", volume: "", type: "" }])];
                                list[idx] = { ...list[idx], type: v };
                                return { ...f, packProducts: list };
                              });
                            }}
                          />
                          <button
                            type="button"
                            className="btn-pk-out"
                            style={{ padding: "8px 10px", fontSize: 11 }}
                            onClick={() =>
                              setForm((f) => ({
                                ...f,
                                packProducts: (f.packProducts.length ? f.packProducts : [{ name: "", volume: "", type: "" }]).filter(
                                  (_, i) => i !== idx,
                                ),
                              }))
                            }
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="btn-pk-out"
                        style={{ marginTop: 4, padding: "8px 14px", fontSize: 12 }}
                        onClick={() =>
                          setForm((f) => ({
                            ...f,
                            packProducts: [...(f.packProducts.length ? f.packProducts : []), { name: "", volume: "", type: "" }],
                          }))
                        }
                      >
                        + Ajouter un article au pack
                      </button>
                    </>
                  )}
                </section>

                <section className="dpm-section">
                  <h3 className="dpm-section-title">Disponibilité &amp; mise en avant</h3>
                  <label className="dpm-check-row">
                    <input type="checkbox" checked={form.isAvailable} onChange={(e) => setForm((f) => ({ ...f, isAvailable: e.target.checked }))} />
                    Produit disponible à la vente sur la boutique
                  </label>
                  <label className="dpm-check-row" style={{ marginTop: 10 }}>
                    <input type="checkbox" checked={form.isNew} onChange={(e) => setForm((f) => ({ ...f, isNew: e.target.checked }))} />
                    Nouveau — badge sur la fiche et la carte
                  </label>
                  <label className="dpm-check-row" style={{ marginTop: 8 }}>
                    <input type="checkbox" checked={form.isTrending} onChange={(e) => setForm((f) => ({ ...f, isTrending: e.target.checked }))} />
                    Tendance — badge sur la fiche et la carte
                  </label>
                  <p className="dpm-hint" style={{ marginTop: 10 }}>
                    La section <strong>New &amp; Trending</strong> de l’accueil affiche tout produit coché <strong>Nouveau</strong> et/ou <strong>Tendance</strong> (les deux, ou une seule des options).
                  </p>
                </section>

                <section className="dpm-section">
                  <h3 className="dpm-section-title">Photos {!editId && "*"}</h3>
                  <div className="dpm-images-head">
                    <span className="dpm-images-summary">
                      Conservées : {keptImgCount} · Nouvelles : {form.newFiles.length}
                      {form.removedImgs.size > 0 ? ` · à supprimer : ${form.removedImgs.size}` : ""}
                    </span>
                  </div>
                  {editId && form.existingImgs.length > 0 && (
                    <div className="dpm-thumb-grid">
                      {form.existingImgs.map((url) => {
                        const removed = form.removedImgs.has(url);
                        return (
                          <div key={url} className={`dpm-thumb${removed ? " dpm-thumb--removed" : ""}`}>
                            <img src={resolveMediaUrl(url)} alt="" />
                            <button
                              type="button"
                              className={`dpm-thumb-btn ${removed ? "dpm-thumb-btn--restore" : "dpm-thumb-btn--remove"}`}
                              onClick={() => toggleRemoveExisting(url)}
                              title={removed ? "Restaurer" : "Retirer"}
                            >
                              {removed ? "↩" : "×"}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {form.newFiles.length > 0 && (
                    <div className="dpm-thumb-grid">
                      {form.newFiles.map((file, idx) => (
                        <div key={idx} className="dpm-thumb" style={{ borderColor: "#D6247F" }}>
                          <img src={URL.createObjectURL(file)} alt="" />
                          <button type="button" className="dpm-thumb-btn dpm-thumb-btn--remove" onClick={() => removeNewFile(idx)} title="Retirer">
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <label className="dpm-add-files">
                    + Ajouter des images
                    <input type="file" accept="image/*" multiple style={{ display: "none" }} onChange={handleAddFiles} />
                  </label>
                  {form.removedImgs.size > 0 && (
                    <button type="button" className="dpm-restore-link" onClick={restoreAll}>
                      Tout restaurer
                    </button>
                  )}
                  {totalImgCount === 0 && !editId && <p className="dpm-alert">Au moins une image est requise pour créer un produit.</p>}
                </section>
              </div>

              <footer className="dpm-footer">
                <button
                  type="button"
                  className="dpm-btn-cancel"
                  disabled={saving}
                  onClick={() => {
                    setModal(null);
                    setForm(freshProductForm());
                    setEditId(null);
                  }}
                >
                  Annuler
                </button>
                <button type="button" className="dpm-btn-save" disabled={saving} onClick={handleProductSubmit}>
                  {saving ? "Enregistrement…" : editId ? "Enregistrer" : "Créer le produit"}
                </button>
              </footer>
            </div>
          </div>
        )}

        {/* Delete Confirmation */}
        {showDeleteModal && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ background: "#fff", padding: 24, borderRadius: 8, width: "100%", maxWidth: 360 }}>
              <h3>Confirmer la suppression ?</h3>
              <p style={{ margin: "15px 0 25px", color: "#555" }}>Cette action est irréversible.</p>
              <div style={{ display: "flex", gap: 12 }}>
                <button onClick={() => setShowDeleteModal(null)} style={{ flex: 1, padding: 12, border: "1px solid #ccc", borderRadius: 4 }}>Annuler</button>
                <button
                  type="button"
                  onClick={async () => {
                    if (showDeleteModal.type === "product") {
                      try {
                        await dispatch(deleteProduct(showDeleteModal.id)).unwrap();
                        setShowDeleteModal(null);
                        flash("Produit supprimé");
                      } catch {
                        flash("Suppression impossible", "error");
                        setShowDeleteModal(null);
                      }
                    } else if (showDeleteModal.type === "blog") {
                      try {
                        await apiDeleteBlog(showDeleteModal.id);
                        setShowDeleteModal(null);
                        flash("Article supprimé");
                        loadBlogs();
                      } catch {
                        flash("Suppression impossible", "error");
                        setShowDeleteModal(null);
                      }
                    }
                  }}
                  style={{ flex: 1, padding: 12, background: "#c0392b", color: "white", border: "none", borderRadius: 4 }}
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}

        {delOrderId && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ background: "#fff", padding: 24, borderRadius: 8, width: "100%", maxWidth: 360 }}>
              <h3>Supprimer cette commande ?</h3>
              <p style={{ margin: "15px 0 25px", color: "#555" }}>Retrait de la liste admin si le backend autorise la suppression.</p>
              <div style={{ display: "flex", gap: 12 }}>
                <button type="button" onClick={() => setDelOrderId(null)} style={{ flex: 1, padding: 12, border: "1px solid #ccc", borderRadius: 4 }}>
                  Annuler
                </button>
                <button type="button" onClick={() => handleDeleteOrder(delOrderId)} style={{ flex: 1, padding: 12, background: "#c0392b", color: "white", border: "none", borderRadius: 4 }}>
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
