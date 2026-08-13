const newItemWindowMs = 30 * 24 * 60 * 60 * 1000;

export function isNewMenuItem(item, now = Date.now()) {
  if (!item.dateCreated) return false;
  const createdAt = new Date(item.dateCreated).getTime();
  if (!Number.isFinite(createdAt)) return false;
  return createdAt >= now - newItemWindowMs;
}
