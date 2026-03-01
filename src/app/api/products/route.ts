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
    const res = NextResponse.json({ products: defaultProducts, source: "default_no_redis" }, { status: 200 });
    res.headers.set("Cache-Control", "no-store");
    return res;
  }

  const data = await redis.get<any[]>("ladyP:products");
  const res = NextResponse.json(
    { products: data ?? defaultProducts, source: data ? "redis" : "default_empty_redis" },
    { status: 200 }
  );
  res.headers.set("Cache-Control", "no-store");
  return res;
}

export async function PUT(req: Request) {
  if (!isAdmin(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized (admin cookie missing)" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const products = body?.products;
  if (!Array.isArray(products)) {
    return NextResponse.json({ ok: false, error: "products[] required" }, { status: 400 });
  }

  if (!redis) {
    return NextResponse.json({ ok: false, error: "Redis not configured on server env" }, { status: 500 });
  }

  try {
    await redis.set("ladyP:products", products);
    const res = NextResponse.json({ ok: true }, { status: 200 });
    res.headers.set("Cache-Control", "no-store");
    return res;
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: "Redis write failed", detail: String(e?.message || e) },
      { status: 500 }
    );
  }
}
