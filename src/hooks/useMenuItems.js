import { useCallback, useEffect, useState } from "react";
import { categoryService } from "../services/categoryService";
import { menuService } from "../services/menuService";

const withCategory = (item, categories) => ({
  ...item,
  category: categories.find(({ id }) => id === item.categoryId) || null,
});

export default function useMenuItems() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const nextCategories = await categoryService.getCategories();
      setCategories(nextCategories);
      const nextItems = await menuService.getMenuItems();
      setItems(nextItems.map((item) => withCategory(item, nextCategories)));
    } catch (loadError) {
      setError(loadError.message === "Unable to load categories." ? loadError.message : "Unable to load food.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const createItem = async (data) => {
    const created = withCategory(await menuService.createMenuItem(data), categories);
    setItems((current) => [...current, created]);
    return created;
  };

  const updateItem = async (id, data) => {
    const updated = withCategory(await menuService.updateMenuItem(id, data), categories);
    setItems((current) => current.map((item) => item.id === id ? updated : item));
    return updated;
  };

  const deleteItem = async (id) => {
    await menuService.deleteMenuItem(id);
    setItems((current) => current.filter((item) => item.id !== id));
  };

  return { items, categories, loading, error, refresh, createItem, updateItem, deleteItem };
}
