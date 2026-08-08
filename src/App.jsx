import { useEffect, useState } from "react";
import Home from "./pages/Home";
import ReviewOrder from "./pages/ReviewOrder";

export default function App() {
  const [cart, setCart] = useState({});
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = (nextPath) => {
    if (window.location.pathname !== nextPath) window.history.pushState({}, "", nextPath);
    setPath(nextPath);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const addToCart = (item) => {
    setCart((current) => ({ ...current, [item.id]: (current[item.id] || 0) + 1 }));
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
    navigate("/");
  };

  if (path === "/review-order") {
    return <ReviewOrder cart={cart} onChangeQuantity={changeQuantity} onBack={() => navigate("/")} onOrderComplete={completeOrder} />;
  }

  return <Home cart={cart} onAddToCart={addToCart} onOpenCart={() => navigate("/review-order")} />;
}
