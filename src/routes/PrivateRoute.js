import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PrivateRoute({ children }) {
  const { user } = useSelector((s) => s.auth);
  const loc = useLocation();
  if (!user) {
    return <Navigate to="/login" state={{ from: loc }} replace />;
  }
  return children;
}
