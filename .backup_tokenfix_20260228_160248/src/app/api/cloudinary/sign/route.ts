import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

type Scope = "products" | "gallery" | "proof";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const scope = String(body?.scope || "") as Scope;

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json({ ok: false, error: "Cloudinary env missing" }, { status: 500 });
  }

  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("ladyP_admin")?.value === "1";

  // Decide folder + auth rules
  let folder: string | null = null;

  if (scope === "products") {
    if (!isAdmin) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    folder = "lady-p-hairs/products";
  } else if (scope === "gallery") {
    if (!isAdmin) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    folder = "lady-p-hairs/gallery";
  } else if (scope === "proof") {
    // Public (customers) upload — locked to this folder only
    folder = "lady-p-hairs/payment-proofs";
  } else {
    return NextResponse.json({ ok: false, error: "Invalid scope" }, { status: 400 });
  }

  const timestamp = Math.round(Date.now() / 1000);

  const paramsToSign = { folder, timestamp };
  const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret);

  return NextResponse.json({
    ok: true,
    cloudName,
    apiKey,
    timestamp,
    folder,
    signature,
  });
}
