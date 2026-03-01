import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export const dynamic = "force-dynamic";

function isAdmin(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  return cookie.includes("ladyP_admin=1");
}

export async function GET() {
  try {
    const data = await kv.get<any[]>("ladyP:gallery");
    return NextResponse.json({ images: data ?? [] }, { status: 200 });
  } catch {
    return NextResponse.json({ images: [], note: "KV not configured" }, { status: 200 });
  }
}

export async function PUT(req: Request) {
  if (!isAdmin(req)) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const images = body?.images;
  if (!Array.isArray(images)) {
    return NextResponse.json({ ok: false, error: "images[] required" }, { status: 400 });
  }

  try {
    await kv.set("ladyP:gallery", images);
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: "KV not configured or write failed", detail: String(e?.message || e) }, { status: 500 });
  }
}
