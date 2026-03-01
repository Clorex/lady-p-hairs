"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { BottomNav } from "@/components/BottomNav";

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Show bottom nav on main app pages
  const showBottomNav =
    pathname === "/" ||
    pathname.startsWith("/shop") ||
    pathname.startsWith("/gallery") ||
    pathname.startsWith("/essence") ||
    pathname.startsWith("/book");

  return (
    <div className="min-h-screen bg-gradient-soft">
      <div className="max-w-[430px] mx-auto bg-white min-h-screen relative shadow-2xl">
        <main className="flex-1">{children}</main>

        {showBottomNav ? (
          <div className="fixed left-0 right-0 bottom-0 z-30">
            <div className="max-w-[430px] mx-auto">
              <BottomNav />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
