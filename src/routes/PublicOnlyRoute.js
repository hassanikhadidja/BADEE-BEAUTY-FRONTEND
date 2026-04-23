import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PublicOnlyRoute({ children }) {
  const { user } = useSelector((s) => s.auth);
  if (user) {
    return <Navigate to="/" replace />;
  }
  return children;
}
