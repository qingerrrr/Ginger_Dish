import { supabase } from "../lib/supabase";

export const telegramNotificationService = {
  async notifyOrderPlaced(orderId) {
    const { error } = await supabase.functions.invoke("notify-order", {
      body: { order_id: orderId },
    });

    if (error) throw error;
  },
};
