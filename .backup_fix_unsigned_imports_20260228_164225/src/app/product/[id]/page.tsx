"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { ProductPage } from "@/features/pages/ProductPage";

export default function ProductRoutePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { products, setSelectedProduct } = useApp();

  const id = params?.id as string;

  useEffect(() => {
    const p = products.find(x => x.id === id);
    if (!p) {
      router.push("/shop");
      return;
    }
    setSelectedProduct(p);
  }, [id, products, router, setSelectedProduct]);

  return <ProductPage />;
}
