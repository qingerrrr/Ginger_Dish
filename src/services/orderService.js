import { supabase } from "../lib/supabase";

export class OrderServiceError extends Error {
  constructor(message, code = "ORDER_CREATE_FAILED") {
    super(message);
    this.name = "OrderServiceError";
    this.code = code;
  }
}

function normalizeOrder(visitorName, items) {
  const name = visitorName.trim();
  if (!name) throw new OrderServiceError("Please enter your name.", "INVALID_VISITOR_NAME");
  if (!Array.isArray(items) || items.length === 0) throw new OrderServiceError("Your cart is empty.", "EMPTY_ORDER");

  const quantitiesByFoodId = new Map();
  items.forEach(({ foodId, quantity }) => {
    const normalizedFoodId = Number(foodId);
    const normalizedQuantity = Number(quantity);
    if (!Number.isInteger(normalizedFoodId) || normalizedFoodId <= 0) {
      throw new OrderServiceError("One of the selected foods is invalid.", "INVALID_FOOD_ID");
    }
    if (!Number.isInteger(normalizedQuantity) || normalizedQuantity <= 0) {
      throw new OrderServiceError("One of the selected quantities is invalid.", "INVALID_QUANTITY");
    }
    quantitiesByFoodId.set(normalizedFoodId, (quantitiesByFoodId.get(normalizedFoodId) || 0) + normalizedQuantity);
  });

  return {
    visitorName: name,
    items: [...quantitiesByFoodId].map(([foodId, quantity]) => ({
      food_id: foodId,
      quantity,
    })),
  };
}

function logFailure(step, error) {
  if (import.meta.env.DEV) console.error(`Supabase ${step} failed:`, error);
}

export const orderService = {
  async createOrder({ visitorName, items }) {
    const normalized = normalizeOrder(visitorName, items);
    const { data, error } = await supabase.rpc("place_order", {
      p_visitor_name: normalized.visitorName,
      p_items: normalized.items,
    });

    if (error) {
      logFailure("place_order RPC", error);
      throw new OrderServiceError("Unable to create your order. Please try again.", "ORDER_CREATE_FAILED");
    }

    const orderId = Number(data?.order_id ?? data);
    if (!Number.isInteger(orderId) || orderId <= 0) {
      logFailure("place_order result validation", { data });
      throw new OrderServiceError("Unable to create your order. Please try again.", "INVALID_ORDER_ID");
    }

    return { orderId };
  },
};
