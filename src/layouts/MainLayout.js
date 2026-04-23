import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { fetchAllProducts } from "../redux/productSlice";
import { useLang } from "../context/LangContext";
import Banner from "../components/Banner";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CartDrawer from "../components/CartDrawer";
import WishlistDrawer from "../components/WishlistDrawer";
import IconImg from "../components/IconImg";

export default function MainLayout() {
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const dispatch = useDispatch();
  const { t } = useLang();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  return (
    <div style={{ fontFamily: "'Lato',sans-serif", minHeight: "100vh", background: "#fff" }}>
      <Banner />
      <Navbar setCartOpen={setCartOpen} setWishlistOpen={setWishlistOpen} />
      <Outlet
        context={{
          openCart: () => setCartOpen(true),
          openWishlist: () => setWishlistOpen(true),
        }}
      />
      <Footer />
      <CartDrawer open={cartOpen} setOpen={setCartOpen} />
      <WishlistDrawer open={wishlistOpen} setOpen={setWishlistOpen} openCart={() => setCartOpen(true)} />
      {isHome && (
        <button
          type="button"
          className="fab-wishlist"
          onClick={() => setWishlistOpen(true)}
          title={t.wishlistBtn}
          aria-label={t.wishlistBtn}
        >
          <IconImg name="heart" height={22} alt="" />
        </button>
      )}
      <button type="button" className="fab-admin" onClick={() => navigate("/dashboard")} aria-label={t.dashboard}>
        <IconImg name="basket" height={14} alt="" style={{ filter: "brightness(0) invert(1)" }} />
        <span className="fab-admin-label">{t.dashboard}</span>
      </button>
    </div>
  );
}
