export const STORE_NAME = "GingerDish";

export function buildOrderMessage({ visitorName, items, storeName = STORE_NAME }) {
  const itemLines = items.map(({ quantity, name }) => `${quantity}x ${name}`);
  return `${storeName}\n\n${visitorName} wants to eat\n\n${itemLines.join("\n")}`;
}

export async function sendTelegramMessage({ token, chatId, text, fetchImpl = fetch }) {
  const response = await fetchImpl(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  });

  if (!response.ok) {
    throw new Error(`Telegram API returned ${response.status}`);
  }
}
