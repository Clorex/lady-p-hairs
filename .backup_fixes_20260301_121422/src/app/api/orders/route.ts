import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: Request) {
  const order = await req.json().catch(() => null);
  if (!order) return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });

  const adminEmail = process.env.ADMIN_EMAIL;
  const resendKey = process.env.RESEND_API_KEY;

  // If email is not configured, don't fail the order.
  if (!adminEmail || !resendKey) {
    return NextResponse.json({ ok: true, emailed: false, note: "ADMIN_EMAIL or RESEND_API_KEY not set" });
  }

  const resend = new Resend(resendKey);

  const text =
`New order received

Name: ${order.customerName}
Phone: ${order.phone}
Pickup date: ${order.pickupDate}
Total: ₦${Number(order.total || 0).toLocaleString()}
Status: ${order.status}
Order ID: ${order.id}

Payment proof: ${order.paymentProof || "none"}
`;

  await resend.emails.send({
    from: "Lady P Hairs <onboarding@resend.dev>",
    to: adminEmail,
    subject: `New Order - ${order.customerName} (₦${Number(order.total || 0).toLocaleString()})`,
    text,
  });

  return NextResponse.json({ ok: true, emailed: true });
}
