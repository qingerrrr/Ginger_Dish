import { useCallback, useEffect, useState } from "react";
import Home from "./pages/Home";
import ReviewOrder from "./pages/ReviewOrder";
import AdminMenu from "./pages/AdminMenu";
import AdminLogin from "./auth/AdminLogin";
import AdminProtectedRoute from "./auth/AdminProtectedRoute";
import useAdminAuth from "./auth/useAdminAuth";

export default function App() {
  const [cart, setCart] = useState({});
  const [cartItems, setCartItems] = useState({});
  const [path, setPath] = useState(window.location.pathname);
  const { checkingAuth, isAuthenticated, signIn, signOut } = useAdminAuth();

  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = useCallback((nextPath, { replace = false } = {}) => {
    if (window.location.pathname !== nextPath) {
      window.history[replace ? "replaceState" : "pushState"]({}, "", nextPath);
    }
    setPath(nextPath);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const addToCart = (item) => {
    setCart((current) => ({ ...current, [item.id]: (current[item.id] || 0) + 1 }));
    setCartItems((current) => ({ ...current, [item.id]: item }));
  };

  const changeQuantity = (itemId, amount) => {
    setCart((current) => {
      const nextQuantity = (current[itemId] || 0) + amount;
      if (nextQuantity > 0) return { ...current, [itemId]: nextQuantity };
      const nextCart = { ...current };
      delete nextCart[itemId];
      return nextCart;
    });
  };

  const completeOrder = () => {
    setCart({});
    setCartItems({});
    navigate("/");
  };

  if (path === "/review-order") {
    return <ReviewOrder cart={cart} menuItems={Object.values(cartItems)} onChangeQuantity={changeQuantity} onBack={() => navigate("/")} onOrderComplete={completeOrder} />;
  }

  if (path === "/admin/login") {
    return <AdminLogin checkingAuth={checkingAuth} isAuthenticated={isAuthenticated} navigate={navigate} onSignIn={signIn} />;
  }

  if (path === "/admin/menu") {
    const handleLogout = async () => {
      await signOut();
      navigate("/admin/login", { replace: true });
    };

    return (
      <AdminProtectedRoute checkingAuth={checkingAuth} isAuthenticated={isAuthenticated} navigate={navigate}>
        <AdminMenu onLogout={handleLogout} />
      </AdminProtectedRoute>
    );
  }

  return <Home cart={cart} onAddToCart={addToCart} onChangeQuantity={changeQuantity} onOpenCart={() => navigate("/review-order")} />;
}
