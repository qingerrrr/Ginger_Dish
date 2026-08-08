import Icon from "../Icon";

export default function CategoryTabs({ categories, activeCategory, onSelect }) {
  return (
    <nav className="category-tabs" aria-label="Menu categories">      
      <div className="category-list">
        {categories.map((category) => (
          <button className={`category-tab${activeCategory === category.id ? " category-tab--active" : ""}`} type="button" key={category.id} onClick={() => onSelect(category.id)} aria-pressed={activeCategory === category.id}>
            <Icon name={category.icon} size={17} />
            <span>{category.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
