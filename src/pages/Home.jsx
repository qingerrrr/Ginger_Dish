import { useMemo, useState } from "react";
import Header from "../components/Header/Header";
import CartButton from "../components/CartButton/CartButton";
import SearchBar from "../components/SearchBar/SearchBar";
import CategoryTabs from "../components/CategoryTabs/CategoryTabs";
import MenuCard from "../components/MenuCard/MenuCard";
import useMenuItems from "../hooks/useMenuItems";

const allCategory = { id: "all", label: "All", icon: "cloche" };
const halalCategory = { id: "halal", label: "Halal", icon: "halal" };

export default function Home({ cart, onAddToCart, onChangeQuantity, onOpenCart }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const { items, categories, loading, error, refresh } = useMenuItems();

  const categoryTabs = useMemo(
    () => [allCategory, ...categories, halalCategory],
    [categories],
  );

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    return items.filter((item) => {
      const categoryMatches = activeCategory === "all"
        || (activeCategory === "halal" ? item.halal : item.categoryId === activeCategory);
      const queryMatches = !query || `${item.name} ${item.description}`.toLowerCase().includes(query);
      return categoryMatches && queryMatches;
    });
  }, [activeCategory, items, search]);

  const cartCount = Object.values(cart).reduce((total, count) => total + count, 0);

  return (
    <div className="app-shell">
      <div className="home-sticky-nav">
        <div className="top-section">
          <div className="app-container app-container--top">
            <Header />
            <SearchBar value={search} onChange={setSearch} />
          </div>
          <svg className="top-section__wave" viewBox="0 0 100 24" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="wave-highlight" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#ffd77a" />
                <stop offset="35%" stopColor="#ffe7a8" />
                <stop offset="70%" stopColor="#ffd678" />
                <stop offset="100%" stopColor="#ffe5a0" />
              </linearGradient>
            </defs>
            <path className="top-section__wave-band" d="M0 7 C16 6 22 1 35 4 C49 8 55 14 68 8 C81 2 89 3 100 10 L100 24 L0 24 Z" />
            <path className="top-section__wave-fill" transform="translate(0 4)" d="M0 7 C16 6 22 1 35 4 C49 8 55 14 68 8 C81 2 89 3 100 10 L100 24 L0 24 Z" />
          </svg>
        </div>
        <div className="app-container app-container--categories">
          <div className="category-section">
            <CategoryTabs categories={categoryTabs} activeCategory={activeCategory} onSelect={setActiveCategory} />
          </div>
        </div>
      </div>
      <div className="app-container app-container--menu">
        <main>
          <section className="menu-section" aria-labelledby="menu-heading">
            <h2 id="menu-heading" className="sr-only">Our menu</h2>
            {loading && <div className="empty-state" role="status"><h3>Loading menu...</h3></div>}
            {!loading && error && (
              <div className="empty-state" role="alert">
                <h3>Unable to load menu</h3>
                <p>Please try again.</p>
                <button className="home-menu-retry" type="button" onClick={refresh}>Retry</button>
              </div>
            )}
            {!loading && !error && items.length === 0 && <div className="empty-state"><h3>No dishes available</h3><p>Please check back soon.</p></div>}
            {!loading && !error && filteredItems.length > 0 && (
              <div className="menu-grid">
                {filteredItems.map((item) => <MenuCard key={item.id} item={item} quantity={cart[item.id] || 0} onAdd={onAddToCart} onChangeQuantity={onChangeQuantity} />)}
              </div>
            )}
            {!loading && !error && items.length > 0 && filteredItems.length === 0 && <div className="empty-state"><h3>No dishes found</h3><p>Try another search or category.</p></div>}
          </section>
        </main>
      </div>
      <CartButton cartCount={cartCount} onClick={onOpenCart} />
    </div>
  );
}
