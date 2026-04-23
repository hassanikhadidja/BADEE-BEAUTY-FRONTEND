import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Mission from "./pages/Mission";
import BlogIndex from "./pages/BlogIndex";
import BlogBeaute from "./pages/BlogBeaute";
import BlogMousse from "./pages/BlogMousse";
import BlogArticle from "./pages/BlogArticle";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import PublicOnlyRoute from "./routes/PublicOnlyRoute";
import AdminRoute from "./routes/AdminRoute";
import ScrollToTop from "./components/ScrollToTop";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
      <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
      <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />
      <Route path="/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/mission" element={<Mission />} />
        <Route path="/blog" element={<BlogIndex />} />
        <Route path="/blog/article/:slug" element={<BlogArticle />} />
        <Route path="/blog/mousse-rituelle" element={<BlogMousse />} />
        <Route path="/blog-beaute" element={<BlogBeaute />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
    </>
  );
}
