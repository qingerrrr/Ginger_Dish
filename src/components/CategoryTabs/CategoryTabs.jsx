import Icon from "../Icon";

export default function CategoryTabs({ categories, activeCategory, onSelect, listRef }) {
  return (
    <nav className="w-full md:mx-auto md:max-w-[720px]" aria-label="Menu categories">      
      <div className="category-list flex w-full items-center gap-2 overflow-x-auto overflow-y-hidden" ref={listRef}>
        {categories.map((category) => (
          <button className={`category-tab inline-flex h-[38px] min-w-0 shrink-0 cursor-pointer items-center justify-center gap-1 whitespace-nowrap rounded-[10px] border border-[#f0e5d4] px-[11px] font-ginger-body text-[.68rem] leading-none font-extrabold shadow-[0_2px_6px_rgba(60,35,20,.05)] transition-[color,background,border-color,box-shadow,transform] ${activeCategory === category.id ? "border-ginger-red-dark bg-ginger-red-dark !text-white [&_svg]:!text-white" : "bg-[#fffdf7] text-ginger-text"}`} type="button" key={category.id} data-category-id={category.id} onClick={() => onSelect(category.id)} aria-pressed={activeCategory === category.id}>
            <Icon name={category.icon} pathData={category.pathData} size={17} />
            <span className="block leading-none">{category.label || category.name}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
