import { useEffect, useRef, useState } from "react";
import logo from "../../Images/logo.png";
import AdminFoodForm from "../components/AdminFoodForm/AdminFoodForm";
import AdminFoodList from "../components/AdminFoodList/AdminFoodList";
import DeleteFoodModal from "../components/DeleteFoodModal/DeleteFoodModal";
import useMenuItems from "../hooks/useMenuItems";

const pageSize = 4;

export default function AdminMenu({ onLogout }) {
  const { items, categories, loading, error, refresh, createItem, updateItem, deleteItem } = useMenuItems();
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [operationError, setOperationError] = useState("");
  const [page, setPage] = useState(1);
  const formRef = useRef(null);
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  useEffect(() => { if (page > totalPages) setPage(totalPages); }, [page, totalPages]);

  const visibleItems = items.slice((page - 1) * pageSize, page * pageSize);

  const handleSave = async (data) => {
    setFeedback("");
    setOperationError("");
    if (editingItem) {
      await updateItem(editingItem.id, data);
      setEditingItem(null);
      setFeedback("Food updated successfully.");
    } else {
      await createItem(data);
      setPage(Math.ceil((items.length + 1) / pageSize));
      setFeedback("Food added successfully.");
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleDelete = async () => {
    setDeleting(true);
    setFeedback("");
    setOperationError("");
    try {
      await deleteItem(deleteTarget.id);
      if (editingItem?.id === deleteTarget.id) setEditingItem(null);
      setDeleteTarget(null);
      setFeedback("Food deleted successfully.");
    } catch (deleteError) {
      setOperationError(deleteError.message || "Unable to delete food.");
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="admin-page">
      <main className="admin-container">
        <header className="admin-header">
          <button className="admin-header__mascot" type="button" onClick={onLogout} aria-label="Logout">
            <img src={logo} alt="GingerDish chef mascot" />
          </button>
          <div className="admin-header__content">
            <h1>Manage Food</h1>
            <p>Add, edit or delete food items from the menu</p>
          </div>
        </header>

        <div ref={formRef} className="admin-form-anchor">
          <AdminFoodForm categories={categories} editingItem={editingItem} onSubmit={handleSave} onCancelEdit={() => setEditingItem(null)} />
        </div>

        {feedback && <p className="admin-feedback admin-feedback--success" role="status">{feedback}</p>}
        {operationError && <p className="admin-feedback admin-feedback--error" role="alert">{operationError}</p>}

        {loading && <div className="admin-state">Loading food...</div>}
        {!loading && error && <div className="admin-state"><p>{error}</p><button className="admin-button admin-button--primary" type="button" onClick={refresh}>Retry</button></div>}
        {!loading && !error && items.length === 0 && <div className="admin-state">No food items added yet.</div>}
        {!loading && !error && items.length > 0 && (
          <AdminFoodList items={visibleItems} categories={categories} page={page} pageSize={pageSize} totalItems={items.length} onPageChange={setPage} onEdit={handleEdit} onDelete={setDeleteTarget} />
        )}
      </main>
      <DeleteFoodModal item={deleteTarget} deleting={deleting} onCancel={() => setDeleteTarget(null)} onConfirm={handleDelete} />
    </div>
  );
}
