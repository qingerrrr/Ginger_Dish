export default function DeleteFoodModal({ item, deleting, onCancel, onConfirm }) {
  if (!item) return null;
  return (
    <div className="admin-modal-overlay">
      <div className="admin-delete-modal" role="dialog" aria-modal="true" aria-labelledby="delete-food-title">
        <h2 id="delete-food-title">Delete “{item.name}”?</h2>
        <p>This action cannot be undone.</p>
        <div className="admin-modal-actions">
          <button className="admin-button admin-button--secondary" type="button" onClick={onCancel}>Cancel</button>
          <button className="admin-button admin-button--danger" type="button" onClick={onConfirm} disabled={deleting}>{deleting ? "Deleting..." : "Delete"}</button>
        </div>
      </div>
    </div>
  );
}
