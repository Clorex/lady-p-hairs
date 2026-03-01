import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: Request) {
  const booking = await req.json().catch(() => null);
  if (!booking) return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });

  const adminEmail = process.env.ADMIN_EMAIL;
  const resendKey = process.env.RESEND_API_KEY;

  if (!adminEmail || !resendKey) {
    return NextResponse.json({ ok: true, emailed: false, note: "ADMIN_EMAIL or RESEND_API_KEY not set" });
  }

  const resend = new Resend(resendKey);

  const text =
`New booking request

Name: ${booking.name}
Phone: ${booking.phone}
Service: ${booking.hairType}
Preferred: ${booking.preferredDate}
Notes: ${booking.notes || "none"}
Booking ID: ${booking.id}
`;

  await resend.emails.send({
    from: "Lady P Hairs <onboarding@resend.dev>",
    to: adminEmail,
    subject: `New Booking - ${booking.name}`,
    text,
  });

  return NextResponse.json({ ok: true, emailed: true });
}
