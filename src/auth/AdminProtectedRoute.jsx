import { useEffect } from "react";

export default function AdminProtectedRoute({ checkingAuth, isAuthenticated, navigate, children }) {
  useEffect(() => {
    if (!checkingAuth && !isAuthenticated) navigate("/admin/login", { replace: true });
  }, [checkingAuth, isAuthenticated, navigate]);

  if (checkingAuth || !isAuthenticated) {
    return <main className="grid min-h-screen place-items-center bg-[#fff7df] p-6 text-center font-ginger-body text-[.85rem] leading-[1.4] font-semibold text-ginger-muted" aria-live="polite">Checking admin session...</main>;
  }

  return children;
}
