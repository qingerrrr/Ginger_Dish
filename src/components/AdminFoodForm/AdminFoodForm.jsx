import { useEffect, useRef, useState } from "react";
import Icon from "../Icon";
import { acceptedFoodImageTypes, maxFoodImageSize, validateFoodImage } from "../../services/foodImageService";
import { adminButtonStyles, adminPanelClass } from "../../styles/adminClasses";

const emptyForm = { name: "", description: "", categoryId: "", halal: false };

function FieldMessage({ message }) {
  return <small className="admin-field-error admin-field-error--slot" role={message ? "alert" : undefined} aria-hidden={!message}>{message || "\u00a0"}</small>;
}

export default function AdminFoodForm({ categories, editingItem, onSubmit, onCancelEdit }) {
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const inputRef = useRef(null);
  const ownedPreviewRef = useRef("");

  const revokeOwnedPreview = () => {
    if (ownedPreviewRef.current) URL.revokeObjectURL(ownedPreviewRef.current);
    ownedPreviewRef.current = "";
  };

  useEffect(() => {
    revokeOwnedPreview();
    setForm(editingItem ? {
      name: editingItem.name,
      description: editingItem.description,
      categoryId: String(editingItem.categoryId),
      halal: editingItem.halal,
    } : emptyForm);
    setImageFile(null);
    setPreviewUrl(editingItem?.imageUrl || "");
    setErrors({});
    if (inputRef.current) inputRef.current.value = "";
  }, [editingItem]);

  useEffect(() => () => revokeOwnedPreview(), []);

  const resetForm = () => {
    revokeOwnedPreview();
    setForm(emptyForm);
    setImageFile(null);
    setPreviewUrl("");
    setErrors({});
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleCancel = () => {
    resetForm();
    onCancelEdit();
  };

  const selectFile = (file) => {
    if (!file) return;
    try {
      validateFoodImage(file);
      revokeOwnedPreview();
      const nextPreview = URL.createObjectURL(file);
      ownedPreviewRef.current = nextPreview;
      setImageFile(file);
      setPreviewUrl(nextPreview);
      setErrors((current) => ({ ...current, image: "", form: "" }));
    } catch (imageError) {
      setErrors((current) => ({ ...current, image: imageError.message }));
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const removeSelectedFile = () => {
    revokeOwnedPreview();
    setImageFile(null);
    setPreviewUrl(editingItem?.imageUrl || "");
    setErrors((current) => ({ ...current, image: "" }));
    if (inputRef.current) inputRef.current.value = "";
  };

  const validate = () => {
    const nextErrors = {};
    if (!editingItem && !imageFile) nextErrors.image = "Please choose a food image.";
    if (!form.name.trim()) nextErrors.name = "Food name is required.";
    if (!form.description.trim()) nextErrors.description = "Description is required.";
    if (!form.categoryId || !Number.isInteger(Number(form.categoryId))) nextErrors.category = "Choose a category.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (saving || !validate()) return;
    setSaving(true);
    try {
      await onSubmit({
        ...form,
        categoryId: Number(form.categoryId),
        imageFile,
        existingImagePath: editingItem?.imagePath || "",
      });
      resetForm();
    } catch (error) {
      setErrors((current) => ({ ...current, form: error.message || (editingItem ? "Unable to update food." : "Unable to add food.") }));
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className={`${adminPanelClass} mb-[18px] px-4 py-5 md:px-[30px] md:py-7`} aria-labelledby="admin-form-title">
      <h2 className="mt-0 mb-[18px] font-ginger-heading text-[1.3rem] leading-none font-bold uppercase" id="admin-form-title">{editingItem ? "Edit Food" : "Add New Food"}</h2>
      <form className="admin-food-form" onSubmit={handleSubmit} noValidate>
        <div className="admin-photo-field">
          <span className="admin-field-label">1. Photo</span>
          <FieldMessage message={errors.image} />
          <label
            className={`admin-upload${previewUrl ? " admin-upload--preview" : ""}`}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => { event.preventDefault(); selectFile(event.dataTransfer.files[0]); }}
          >
            <input
              ref={inputRef}
              type="file"
              accept={acceptedFoodImageTypes.join(",")}
              onChange={(event) => selectFile(event.target.files[0])}
              disabled={saving}
            />
            {previewUrl ? (
              <img src={previewUrl} alt="Selected food preview" />
            ) : (
              <span className="admin-upload__prompt">
                <Icon name="upload" size={35} />
                <strong>Click to upload</strong>
                <span>or drag and drop</span>
                <small>JPG, PNG, WEBP up to 5MB</small>
              </span>
            )}
          </label>
          <div className="admin-upload__selection">
            <span>{imageFile ? imageFile.name : editingItem ? "Current image" : "No image selected"}</span>
            {imageFile && <button type="button" onClick={removeSelectedFile} disabled={saving}>Remove</button>}
          </div>
        </div>

        <div className="admin-form-fields">
          <label className="admin-form-field">
            <span>2. Name</span>
            <FieldMessage message={errors.name} />
            <input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} placeholder="e.g. Tomato Scrambled Eggs" aria-invalid={Boolean(errors.name)} />
          </label>

          <label className="admin-form-field">
            <span>3. Description</span>
            <FieldMessage message={errors.description} />
            <textarea value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} placeholder="e.g. Soft scrambled eggs with juicy tomatoes." rows="3" aria-invalid={Boolean(errors.description)} />
          </label>

          <div className="admin-form-row">
            <fieldset className="admin-halal-field">
              <legend>4. Halal</legend>
              <label><input type="checkbox" checked={form.halal} onChange={(event) => setForm((current) => ({ ...current, halal: event.target.checked }))} /> This food is Halal</label>
            </fieldset>
            <label className="admin-form-field">
              <span>5. Category</span>
              <FieldMessage message={errors.category} />
              <select value={form.categoryId} onChange={(event) => setForm((current) => ({ ...current, categoryId: event.target.value }))} aria-invalid={Boolean(errors.category)}>
                <option value="">Select category</option>
                {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
              </select>
            </label>
          </div>

          <FieldMessage message={errors.form} />
          <div className="admin-form-actions">
            <button className={adminButtonStyles.secondary} type="button" onClick={handleCancel} disabled={saving}>Cancel</button>
            <button className={adminButtonStyles.primary} type="submit" disabled={saving}>{saving ? (editingItem ? "Saving..." : "Adding...") : editingItem ? "Save Changes" : "Add Food"}</button>
          </div>
        </div>
      </form>
    </section>
  );
}
