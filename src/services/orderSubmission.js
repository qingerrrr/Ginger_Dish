export async function submitOrderWithNotification({ placeOrder, notifyOrder, onNotificationError }, order) {
  const result = await placeOrder(order);

  try {
    await notifyOrder(result);
  } catch (error) {
    onNotificationError?.(error);
  }

  return result;
}
