
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";
import RouteLoadingFallback from "../RouteLoadingFallback";
import { checkAuthSession } from "../../services/auth";

export default function ProtectedRoute() {
  const [status, setStatus] = useState<
    "checking" | "authenticated" | "unauthenticated" | "error"
  >("checking");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    checkAuthSession()
      .then((authenticated) => {
        if (active) {
          setStatus(authenticated ? "authenticated" : "unauthenticated");
        }
      })
      .catch((authError: unknown) => {
        if (active) {
          setError(
            authError instanceof Error
              ? authError.message
              : "Unable to verify your session.",
          );
          setStatus("error");
        }
      });

    return () => {
      active = false;
    };
  }, []);

  if (status === "checking") return <RouteLoadingFallback />;
  if (status === "unauthenticated") {
    return <Navigate to="/login" replace />;
  }
  if (status === "error") {
    return (
      <main className="route-loading" role="alert">
        {error}
      </main>
    );
  }

  return <Outlet />;
}
