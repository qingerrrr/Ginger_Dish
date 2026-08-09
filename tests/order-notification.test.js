import assert from "node:assert/strict";
import test from "node:test";
import { submitOrderWithNotification } from "../src/services/orderSubmission.js";
import { buildOrderMessage, sendTelegramMessage } from "../supabase/functions/_shared/telegramMessage.js";

test("successful order triggers one Telegram notification", async () => {
  let notifications = 0;
  const result = await submitOrderWithNotification({
    placeOrder: async () => ({ orderId: 42 }),
    notifyOrder: async ({ orderId }) => { assert.equal(orderId, 42); notifications += 1; },
  }, {});
  assert.deepEqual(result, { orderId: 42 });
  assert.equal(notifications, 1);
});

test("failed order does not trigger a Telegram notification", async () => {
  let notifications = 0;
  await assert.rejects(() => submitOrderWithNotification({
    placeOrder: async () => { throw new Error("database failed"); },
    notifyOrder: async () => { notifications += 1; },
  }, {}));
  assert.equal(notifications, 0);
});

test("message contains the store, visitor, quantities, and item names", () => {
  const message = buildOrderMessage({
    visitorName: "Ginger Tea",
    items: [{ name: "Mapo Tofu", quantity: 1 }, { name: "Matcha Latte", quantity: 2 }],
  });
  assert.equal(message, "GingerDish\n\nGinger Tea wants to eat\n\n1x Mapo Tofu\n2x Matcha Latte");
});

test("Telegram failure does not make order placement fail", async () => {
  let reportedError;
  const result = await submitOrderWithNotification({
    placeOrder: async () => ({ orderId: 7 }),
    notifyOrder: async () => { throw new Error("Telegram unavailable"); },
    onNotificationError: (error) => { reportedError = error; },
  }, {});
  assert.deepEqual(result, { orderId: 7 });
  assert.match(reportedError.message, /Telegram unavailable/);
});

test("Telegram helper sends one Bot API request", async () => {
  let calls = 0;
  await sendTelegramMessage({
    token: "test-token",
    chatId: "123",
    text: "test message",
    fetchImpl: async (url, options) => {
      calls += 1;
      assert.equal(url, "https://api.telegram.org/bottest-token/sendMessage");
      assert.deepEqual(JSON.parse(options.body), { chat_id: "123", text: "test message" });
      return { ok: true };
    },
  });
  assert.equal(calls, 1);
});
