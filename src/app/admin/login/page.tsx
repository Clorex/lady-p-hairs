"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        setErr("Wrong password");
        return;
      }

      router.push("/admin");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pb-24">
      <div className="w-full max-w-sm bg-white rounded-3xl p-8 shadow-soft-lg border border-peony-100">
        <div className="w-16 h-16 bg-gradient-peony rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="w-8 h-8 text-white" />
        </div>

        <h1 className="text-xl font-serif font-bold text-center text-gray-800 mb-2">Admin Login</h1>
        <p className="text-sm text-gray-500 text-center mb-6">Enter password to continue</p>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Password"
          className="w-full px-4 py-4 bg-peony-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-peony-300"
        />

        {err ? <p className="text-red-500 text-sm text-center mt-3">{err}</p> : null}

        <button
          onClick={submit}
          disabled={loading || !password}
          className={`w-full mt-4 py-4 rounded-2xl font-semibold ${
            loading || !password ? "bg-gray-200 text-gray-400" : "bg-gradient-peony text-white"
          }`}
        >
          {loading ? "Signing in..." : "Login"}
        </button>
      </div>
    </div>
  );
}
