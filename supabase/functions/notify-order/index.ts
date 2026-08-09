import { createClient } from "npm:@supabase/supabase-js@^2";
import { corsHeaders } from "npm:@supabase/supabase-js@^2/cors";
import { buildOrderMessage, sendTelegramMessage } from "../_shared/telegramMessage.js";

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") return json({ error: "Method not allowed." }, 405);

  try {
    const { order_id: rawOrderId } = await request.json();
    const orderId = Number(rawOrderId);
    if (!Number.isInteger(orderId) || orderId <= 0) return json({ error: "Invalid order." }, 400);

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const telegramToken = Deno.env.get("TELEGRAM_BOT_TOKEN");
    const telegramChatId = Deno.env.get("TELEGRAM_CHAT_ID");
    if (!supabaseUrl || !serviceRoleKey || !telegramToken || !telegramChatId) {
      console.error("Order notification environment is incomplete.");
      return json({ error: "Notification service is unavailable." }, 500);
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: order, error: orderError } = await adminClient
      .from("orders")
      .select("order_id, visitor_name")
      .eq("order_id", orderId)
      .single();
    if (orderError || !order) throw orderError || new Error("Order not found.");

    const { data: rows, error: itemsError } = await adminClient
      .from("order_items")
      .select("food_id, quantity")
      .eq("order_id", orderId);
    if (itemsError || !rows?.length) throw itemsError || new Error("Order has no items.");

    const foodIds = [...new Set(rows.map(({ food_id }) => food_id))];
    const { data: foods, error: foodsError } = await adminClient
      .from("menu")
      .select("food_id, name")
      .in("food_id", foodIds);
    if (foodsError) throw foodsError;

    const namesById = new Map((foods || []).map(({ food_id, name }) => [Number(food_id), name]));
    const items = rows.map(({ food_id, quantity }) => ({
      name: namesById.get(Number(food_id)) || `Food #${food_id}`,
      quantity,
    }));
    const text = buildOrderMessage({ visitorName: order.visitor_name, items });
    await sendTelegramMessage({ token: telegramToken, chatId: telegramChatId, text });

    return json({ delivered: true });
  } catch (error) {
    console.error("Unable to send order notification:", error instanceof Error ? error.message : error);
    return json({ error: "Unable to send notification." }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
