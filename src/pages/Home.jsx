import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Header from "../components/Header/Header";
import CartButton from "../components/CartButton/CartButton";
import SearchBar from "../components/SearchBar/SearchBar";
import CategoryTabs from "../components/CategoryTabs/CategoryTabs";
import MenuCard from "../components/MenuCard/MenuCard";
import useMenuItems from "../hooks/useMenuItems";
import { menuService } from "../services/menuService";

const newCategory = { id: "new", label: "New", icon: "sparkle" };
const halalCategory = { id: "halal", label: "Halal", icon: "halal" };

export default function Home({ cart, onAddToCart, onChangeQuantity, onOpenCart }) {
  const [activeCategory, setActiveCategory] = useState("new");
  const [search, setSearch] = useState("");
  const [stickyHeight, setStickyHeight] = useState(0);
  const { items, categories, loading, error, refresh } = useMenuItems();
  const stickyNavRef = useRef(null);
  const categorySectionRefs = useRef(new Map());
  const programmaticScrollRef = useRef(false);
  const scrollGuardTimerRef = useRef(null);

  const categoryTabs = useMemo(
    () => [newCategory, ...categories, halalCategory],
    [categories],
  );

  const categoryGroups = useMemo(() => {
    const query = search.trim().toLowerCase();
    const searchedItems = items.filter((item) => !query || `${item.name} ${item.description}`.toLowerCase().includes(query));
    return categoryTabs.map((category) => ({
      ...category,
      items: searchedItems.filter((item) => category.id === "new"
        ? menuService.isNewItem(item)
        : (category.id === "halal" ? item.halal : item.categoryId === category.id)),
    }));
  }, [categoryTabs, items, search]);

  const visibleCategoryGroups = useMemo(
    () => categoryGroups.filter((group) => group.items.length > 0),
    [categoryGroups],
  );
  const hasVisibleItems = visibleCategoryGroups.length > 0;

  useEffect(() => {
    if (!visibleCategoryGroups.length) return;
    const activeIsVisible = visibleCategoryGroups.some(({ id }) => id === activeCategory);
    if (!activeIsVisible) setActiveCategory(visibleCategoryGroups[0].id);
  }, [activeCategory, visibleCategoryGroups]);

  useEffect(() => {
    if (!stickyNavRef.current) return undefined;
    const updateHeight = () => setStickyHeight(stickyNavRef.current?.offsetHeight || 0);
    updateHeight();
    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(stickyNavRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (loading || error || !visibleCategoryGroups.length) return undefined;
    const observer = new IntersectionObserver((entries) => {
      if (programmaticScrollRef.current) return;
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => Math.abs(a.boundingClientRect.top - stickyHeight) - Math.abs(b.boundingClientRect.top - stickyHeight));
      if (!visible.length) return;
      const categoryId = visible[0].target.dataset.categoryId;
      const category = visibleCategoryGroups.find(({ id }) => String(id) === categoryId);
      if (category) setActiveCategory(category.id);
    }, {
      rootMargin: `-${stickyHeight}px 0px -55% 0px`,
      threshold: 0,
    });

    categorySectionRefs.current.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [error, loading, stickyHeight, visibleCategoryGroups]);

  useEffect(() => () => clearTimeout(scrollGuardTimerRef.current), []);

  const setCategorySectionRef = useCallback((categoryId, node) => {
    if (node) categorySectionRefs.current.set(categoryId, node);
    else categorySectionRefs.current.delete(categoryId);
  }, []);

  const handleCategorySelect = useCallback((categoryId) => {
    const section = categorySectionRefs.current.get(categoryId);
    if (!section) return;
    setActiveCategory(categoryId);
    programmaticScrollRef.current = true;
    section.scrollIntoView({ behavior: "smooth", block: "start" });
    clearTimeout(scrollGuardTimerRef.current);
    scrollGuardTimerRef.current = setTimeout(() => {
      programmaticScrollRef.current = false;
    }, 900);
  }, []);

  const cartCount = Object.values(cart).reduce((total, count) => total + count, 0);

  return (
    <div className="app-shell">
      <div className="home-sticky-nav" ref={stickyNavRef}>
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
            <CategoryTabs categories={visibleCategoryGroups} activeCategory={activeCategory} onSelect={handleCategorySelect} />
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
            {!loading && !error && items.length === 0 && <div className="empty-state"><h3>No dishes available</h3><p>Please check back soon</p></div>}
            {!loading && !error && items.length > 0 && hasVisibleItems && visibleCategoryGroups.map((group) => (
              <section
                className="menu-category-group"
                data-category-id={group.id}
                key={group.id}
                ref={(node) => setCategorySectionRef(group.id, node)}
                style={{ scrollMarginTop: stickyHeight }}
                aria-labelledby={`menu-category-${group.id}`}
              >
                <h2 id={`menu-category-${group.id}`} className="menu-category-title">{group.label || group.name}</h2>
                <div className="menu-grid">
                  {group.items.map((item) => <MenuCard key={item.id} item={item} quantity={cart[item.id] || 0} onAdd={onAddToCart} onChangeQuantity={onChangeQuantity} />)}
                </div>
              </section>
            ))}
            {!loading && !error && items.length > 0 && !hasVisibleItems && <div className="empty-state"><h3>No dishes found</h3><p>Try another search.</p></div>}
          </section>
        </main>
      </div>
      <CartButton cartCount={cartCount} onClick={onOpenCart} />
    </div>
  );
}
