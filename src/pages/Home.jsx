import { useMemo, useState } from "react";
import Header from "../components/Header/Header";
import CartButton from "../components/CartButton/CartButton";
import SearchBar from "../components/SearchBar/SearchBar";
import CategoryTabs from "../components/CategoryTabs/CategoryTabs";
import MenuCard from "../components/MenuCard/MenuCard";
import { categories, menuItems } from "../data/menu";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState({});

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    return menuItems.filter((item) => {
      const categoryMatches = activeCategory === "all" || (activeCategory === "halal" ? item.halal === true : item.category === activeCategory);
      const queryMatches = !query || `${item.name} ${item.description}`.toLowerCase().includes(query);
      return categoryMatches && queryMatches;
    });
  }, [activeCategory, search]);

  const cartCount = Object.values(cart).reduce((total, count) => total + count, 0);
  const addToCart = (item) => setCart((current) => ({ ...current, [item.id]: (current[item.id] || 0) + 1 }));

  return (
    <div className="app-shell">
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
      <div className="app-container app-container--menu">
        <main>
          <section className="menu-section" aria-labelledby="menu-heading">
            <h2 id="menu-heading" className="sr-only">Our menu</h2>
            <div className="category-section">
              <CategoryTabs categories={categories} activeCategory={activeCategory} onSelect={setActiveCategory} />
            </div>
            <div className="menu-grid">
              {filteredItems.map((item) => <MenuCard key={item.id} item={item} onAdd={addToCart} />)}
            </div>
            {filteredItems.length === 0 && <div className="empty-state"><span>🍽️</span><h3>No dishes found</h3><p>Try another search or category.</p></div>}
          </section>
        </main>
      </div>
      <CartButton cartCount={cartCount} />
    </div>
  );
}
