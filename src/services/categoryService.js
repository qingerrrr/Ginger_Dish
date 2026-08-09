import { supabase } from "../lib/supabase";

const safePathData = /^[MmZzLlHhVvCcSsQqTtAa0-9eE.,+\-\s]+$/;

function getPathData(svg) {
  if (typeof svg !== "string") return [];
  return [...svg.matchAll(/<path\s+[^>]*d="([^"]+)"[^>]*\/?\s*>/gi)]
    .map((match) => match[1])
    .filter((path) => safePathData.test(path));
}

const mapCategoryRow = (row) => ({
  id: Number(row.cat_id),
  name: row.name,
  label: row.name,
  svg: row.svg,
  pathData: getPathData(row.svg),
});

export const categoryService = {
  async getCategories() {
    const { data, error } = await supabase
      .from("categories")
      .select("cat_id, name, svg")
      .order("cat_id", { ascending: true });

    if (error) {
      if (import.meta.env.DEV) console.error("Unable to load categories:", error);
      throw new Error("Unable to load categories.");
    }

    return (data || []).map(mapCategoryRow);
  },
};
