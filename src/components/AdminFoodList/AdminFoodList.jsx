import Icon from "../Icon";
import { adminPanelClass } from "../../styles/adminClasses";

function CategoryBadge({ item, categories }) {
  const category = item.category || categories.find(({ id }) => id === item.categoryId);
  return (
    <span className="admin-category-badge">
      {category && <Icon name={category.icon} pathData={category.pathData} size={16} />}
      {category?.name || "Unknown"}
    </span>
  );
}

function ActionButtons({ item, onEdit, onDelete }) {
  return (
    <div className="admin-row-actions">
      <button className="admin-icon-button admin-icon-button--edit" type="button" onClick={() => onEdit(item)} aria-label={`Edit ${item.name}`}><Icon name="edit" size={19} /></button>
      <button className="admin-icon-button admin-icon-button--delete" type="button" onClick={() => onDelete(item)} aria-label={`Delete ${item.name}`}><Icon name="trash" size={19} /></button>
    </div>
  );
}

export default function AdminFoodList({ items, categories, page, pageSize, totalItems, onPageChange, onEdit, onDelete }) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const firstItem = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const lastItem = Math.min(page * pageSize, totalItems);

  return (
    <section className={`${adminPanelClass} overflow-hidden`} aria-label="Existing food items">
      <div className="admin-food-table" role="table" aria-label="Food menu">
        <div className="admin-food-table__head" role="row">
          <span role="columnheader">Photo</span><span role="columnheader">Name</span><span role="columnheader">Category</span><span role="columnheader">Halal</span><span role="columnheader">Actions</span>
        </div>
        <div className="admin-food-table__body">
          {items.map((item) => (
            <article className="admin-food-row" role="row" key={item.id}>
              <div className="admin-food-row__photo" role="cell"><img className="admin-food-image" src={item.imageUrl} alt={item.name} /></div>
              <div className="admin-food-row__name" role="cell"><strong>{item.name}</strong><p>{item.description}</p></div>
              <div className="admin-food-tags">
                <div className="admin-food-row__category" role="cell"><CategoryBadge item={item} categories={categories} /></div>
                {item.halal && <div className="admin-food-row__halal" role="cell"><span className="admin-halal-badge">Halal</span></div>}
              </div>
              <div className="admin-food-row__actions" role="cell"><ActionButtons item={item} onEdit={onEdit} onDelete={onDelete} /></div>
            </article>
          ))}
        </div>
      </div>

      <div className="admin-pagination">
        <p>Showing {firstItem} to {lastItem} of {totalItems} items</p>
        <div className="admin-pagination__controls">
          <button type="button" onClick={() => onPageChange(page - 1)} disabled={page === 1} aria-label="Previous page">‹</button>
          <span>{page}</span>
          <button type="button" onClick={() => onPageChange(page + 1)} disabled={page === totalPages} aria-label="Next page">›</button>
        </div>
      </div>
    </section>
  );
}
