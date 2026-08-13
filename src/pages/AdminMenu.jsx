import { useEffect, useRef, useState } from "react";
import logo from "../../Images/logo.png";
import AdminFoodForm from "../components/AdminFoodForm/AdminFoodForm";
import AdminFoodList from "../components/AdminFoodList/AdminFoodList";
import DeleteFoodModal from "../components/DeleteFoodModal/DeleteFoodModal";
import useMenuItems from "../hooks/useMenuItems";
import { adminButtonStyles } from "../styles/adminClasses";

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
    <div className="min-h-screen bg-[#fffaf2] text-ginger-text">
      <main className="mx-auto w-[calc(100%-28px)] max-w-[1120px] pt-6 pb-12 md:pt-[34px]">
        <header className="mb-5 flex items-center gap-[13px] md:mb-6 md:gap-[18px]">
          <button className="admin-header__mascot" type="button" onClick={onLogout} aria-label="Logout">
            <img src={logo} alt="GingerDish chef mascot" />
          </button>
          <div className="min-w-0">
            <h1 className="m-0 text-ginger-red-dark font-ginger-heading text-[clamp(1.65rem,8vw,2.7rem)] leading-[.95] font-bold tracking-[-.045em] uppercase">Manage Food</h1>
            <p className="mt-[3px] mb-0 text-ginger-muted text-[clamp(.76rem,3.4vw,1rem)]">Add, edit or delete food items from the menu</p>
          </div>
        </header>

        <div ref={formRef} className="scroll-mt-[14px]">
          <AdminFoodForm categories={categories} editingItem={editingItem} onSubmit={handleSave} onCancelEdit={() => setEditingItem(null)} />
        </div>

        {feedback && <p className="mt-[-6px] mb-3.5 rounded-[11px] border border-[#a8d6a8] bg-[#eef9ec] px-[13px] py-2.5 text-[.74rem] font-semibold text-[#277b32]" role="status">{feedback}</p>}
        {operationError && <p className="mt-[-6px] mb-3.5 rounded-[11px] border border-[#efb8b1] bg-[#fff0ed] px-[13px] py-2.5 text-[.74rem] font-semibold text-ginger-red-dark" role="alert">{operationError}</p>}

        {loading && <div className="rounded-[22px] border border-ginger-border bg-white px-5 py-[45px] text-center shadow-ginger-card">Loading food...</div>}
        {!loading && error && <div className="rounded-[22px] border border-ginger-border bg-white px-5 py-[45px] text-center shadow-ginger-card"><p className="mb-3.5">{error}</p><button className={adminButtonStyles.primary} type="button" onClick={refresh}>Retry</button></div>}
        {!loading && !error && items.length === 0 && <div className="rounded-[22px] border border-ginger-border bg-white px-5 py-[45px] text-center shadow-ginger-card">No food items added yet.</div>}
        {!loading && !error && items.length > 0 && (
          <AdminFoodList items={visibleItems} categories={categories} page={page} pageSize={pageSize} totalItems={items.length} onPageChange={setPage} onEdit={handleEdit} onDelete={setDeleteTarget} />
        )}
      </main>
      <DeleteFoodModal item={deleteTarget} deleting={deleting} onCancel={() => setDeleteTarget(null)} onConfirm={handleDelete} />
    </div>
  );
}
