import { supabase } from "../lib/supabase";

const bucketName = "food_imgs";
const allowedTypes = {
  "image/jpeg": ["jpg", "jpeg"],
  "image/png": ["png"],
  "image/webp": ["webp"],
};
export const maxFoodImageSize = 5 * 1024 * 1024;
export const acceptedFoodImageTypes = Object.keys(allowedTypes);

export class FoodImageError extends Error {
  constructor(message, code) {
    super(message);
    this.name = "FoodImageError";
    this.code = code;
  }
}

export function validateFoodImage(file) {
  if (!(file instanceof File) || file.size === 0) {
    throw new FoodImageError("Please choose a food image.", "EMPTY_IMAGE");
  }
  const extension = file.name.split(".").pop()?.toLowerCase();
  if (!extension || !allowedTypes[file.type]?.includes(extension)) {
    throw new FoodImageError("Choose a JPG, PNG, or WEBP image.", "INVALID_IMAGE_TYPE");
  }
  if (file.size > maxFoodImageSize) {
    throw new FoodImageError("Image must be 5MB or smaller.", "IMAGE_TOO_LARGE");
  }
  return extension;
}

export async function uploadFoodImage(file) {
  const extension = validateFoodImage(file);
  const objectPath = `food/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from(bucketName).upload(objectPath, file, {
    contentType: file.type,
    cacheControl: "3600",
    upsert: false,
  });

  if (error) {
    if (import.meta.env.DEV) console.error("Food image upload failed:", error);
    throw new FoodImageError("Unable to upload image.", "IMAGE_UPLOAD_FAILED");
  }
  return objectPath;
}

export async function deleteFoodImage(objectPath) {
  if (!isFoodStoragePath(objectPath)) return;
  const { error } = await supabase.storage.from(bucketName).remove([objectPath]);
  if (error) {
    if (import.meta.env.DEV) console.error("Food image cleanup failed:", error);
    throw new FoodImageError("Unable to remove uploaded image.", "IMAGE_DELETE_FAILED");
  }
}

export function isFoodStoragePath(pic) {
  return typeof pic === "string" && /^food\/[A-Za-z0-9-]+\.(?:jpe?g|png|webp)$/i.test(pic);
}

export function getFoodImageUrl(pic) {
  if (!pic) return "";
  if (/^https?:\/\//i.test(pic) || pic.startsWith("/")) return pic;
  const { data } = supabase.storage.from(bucketName).getPublicUrl(pic);
  return data.publicUrl;
}
