import { adminButtonStyles } from "../../styles/adminClasses";

export default function DeleteFoodModal({ item, deleting, onCancel, onConfirm }) {
  if (!item) return null;
  return (
    <div className="fixed inset-0 z-[2000] grid place-items-center bg-[rgba(45,31,24,.42)] p-5">
      <div className="admin-delete-modal w-full max-w-[360px] rounded-[20px] border border-ginger-border bg-white p-5 shadow-[0_14px_40px_rgba(0,0,0,.2)]" role="dialog" aria-modal="true" aria-labelledby="delete-food-title">
        <h2 id="delete-food-title">Delete “{item.name}”?</h2>
        <p className="mt-2 mb-5 text-[.82rem] text-ginger-muted">This action cannot be undone.</p>
        <div className="admin-modal-actions">
          <button className={adminButtonStyles.secondary} type="button" onClick={onCancel}>Cancel</button>
          <button className={adminButtonStyles.danger} type="button" onClick={onConfirm} disabled={deleting}>{deleting ? "Deleting..." : "Delete"}</button>
        </div>
      </div>
    </div>
  );
}
