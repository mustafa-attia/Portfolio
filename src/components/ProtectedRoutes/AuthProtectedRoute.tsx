
import { Navigate, Outlet } from "react-router";

export default function ProtectedRoute() {
  const isAuthenticated =
    sessionStorage.getItem("isLoggedIn") === "true";

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
