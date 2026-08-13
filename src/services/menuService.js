import { supabase } from "../lib/supabase";
import { deleteFoodImage, getFoodImageUrl, uploadFoodImage } from "./foodImageService";
import { isNewMenuItem } from "./menuRecency";

const menuColumns = "food_id, name, description, category_id, pic, halal, date_created";

export class MenuServiceError extends Error {
  constructor(message, code = "MENU_OPERATION_FAILED") {
    super(message);
    this.name = "MenuServiceError";
    this.code = code;
  }
}

export function mapMenuRow(row) {
  return {
    id: Number(row.food_id),
    name: row.name,
    description: row.description || "",
    categoryId: Number(row.category_id),
    imagePath: row.pic || "",
    imageUrl: getFoodImageUrl(row.pic),
    halal: Boolean(row.halal),
    dateCreated: row.date_created || null,
  };
}

function toMenuPayload(data, pic) {
  return {
    name: data.name.trim(),
    description: data.description.trim(),
    category_id: Number(data.categoryId),
    pic,
    halal: Boolean(data.halal),
  };
}

function fail(operation, error) {
  if (import.meta.env.DEV) console.error(`Supabase menu ${operation} failed:`, error);
  if (operation === "delete" && error?.code === "23503") {
    throw new MenuServiceError("This food cannot be deleted because it is referenced by an existing order.", "FOOD_REFERENCED");
  }
  if (operation === "create" && error?.code === "23502" && /food_id/i.test(`${error.message} ${error.details}`)) {
    throw new MenuServiceError("Unable to add food.", "FOOD_ID_NOT_GENERATED");
  }
  const messages = { read: "Unable to load food.", create: "Unable to add food.", update: "Unable to update food.", delete: "Unable to delete food." };
  throw new MenuServiceError(messages[operation]);
}

async function removeUploadedImageQuietly(objectPath) {
  try {
    await deleteFoodImage(objectPath);
  } catch (cleanupError) {
    if (import.meta.env.DEV) console.error("Could not roll back uploaded food image:", cleanupError);
  }
}

export const menuService = {
  isNewItem: isNewMenuItem,

  async getMenuItems() {
    const { data, error } = await supabase
      .from("menu")
      .select(menuColumns)
      .order("food_id", { ascending: true });
    if (error) fail("read", error);
    return (data || []).map(mapMenuRow);
  },

  async createMenuItem(data) {
    const uploadedPath = await uploadFoodImage(data.imageFile);
    const createPayload = {
      ...toMenuPayload(data, uploadedPath),
      date_created: new Date().toISOString(),
    };
    const { data: created, error } = await supabase
      .from("menu")
      .insert(createPayload)
      .select(menuColumns)
      .single();

    if (error) {
      await removeUploadedImageQuietly(uploadedPath);
      fail("create", error);
    }
    return mapMenuRow(created);
  },

  async updateMenuItem(foodId, data) {
    const uploadedPath = data.imageFile ? await uploadFoodImage(data.imageFile) : null;
    const nextPic = uploadedPath || data.existingImagePath;
    const { data: updated, error } = await supabase
      .from("menu")
      .update(toMenuPayload(data, nextPic))
      .eq("food_id", foodId)
      .select(menuColumns)
      .single();

    if (error) {
      if (uploadedPath) await removeUploadedImageQuietly(uploadedPath);
      fail("update", error);
    }

    if (uploadedPath && data.existingImagePath !== uploadedPath) {
      await removeUploadedImageQuietly(data.existingImagePath);
    }
    return mapMenuRow(updated);
  },

  async deleteMenuItem(foodId) {
    const { error } = await supabase.from("menu").delete().eq("food_id", foodId);
    if (error) fail("delete", error);
  },
};
