import { useEffect } from "react";

export default function AdminProtectedRoute({ checkingAuth, isAuthenticated, navigate, children }) {
  useEffect(() => {
    if (!checkingAuth && !isAuthenticated) navigate("/admin/login", { replace: true });
  }, [checkingAuth, isAuthenticated, navigate]);

  if (checkingAuth || !isAuthenticated) {
    return <main className="admin-auth-loading" aria-live="polite">Checking admin session...</main>;
  }

  return children;
}
