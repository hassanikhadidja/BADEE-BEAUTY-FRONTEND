import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function AdminRoute({ children }) {
  const { user } = useSelector((s) => s.auth);
  const loc = useLocation();
  if (!user) {
    return <Navigate to="/login" state={{ from: loc }} replace />;
  }
  const isAdmin = user.role === "admin" || user.isAdmin === true;
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  return children;
}