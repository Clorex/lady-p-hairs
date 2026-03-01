import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { products as defaultProducts } from "@/data/products";

export const dynamic = "force-dynamic";

function isAdmin(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  return cookie.includes("ladyP_admin=1");
}

export async function GET() {
  if (!redis) {
    const res = NextResponse.json({ products: defaultProducts, note: "Redis not configured" });
    res.headers.set("Cache-Control", "no-store");
    return res;
  }

  const data = await redis.get<any[]>("ladyP:products");
  const res = NextResponse.json({ products: data ?? defaultProducts });
  res.headers.set("Cache-Control", "no-store");
  return res;
}

export async function PUT(req: Request) {
  if (!isAdmin(req)) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const products = body?.products;
  if (!Array.isArray(products)) {
    return NextResponse.json({ ok: false, error: "products[] required" }, { status: 400 });
  }

  if (!redis) return NextResponse.json({ ok: false, error: "Redis not configured" }, { status: 500 });

  await redis.set("ladyP:products", products);
  const res = NextResponse.json({ ok: true });
  res.headers.set("Cache-Control", "no-store");
  return res;
}
