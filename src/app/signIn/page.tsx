"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

function LoginContent() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "";
  const { refresh } = useAuth();
  const { refresh: refreshCart } = useCart();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!identifier || !password) {
      setError("Please enter phone/email and password");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Invalid credentials");
      }
      const data = await res.json();
      await refresh();
      await refreshCart();
      if (next) router.push(next);
      else if (data?.user?.role === "admin") router.push("/admin");
      else router.push("/");
    } catch (e: any) {
      setError(e?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="max-w-md w-full mx-auto p-6 rounded-xl shadow-xl bg-red-500/15 backdrop-blur-xl backdrop-saturate-150 border border-red-500/20 ring-1 ring-inset ring-red-500/30 transition-transform duration-200 hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-0.5">
        <h2 className="text-center text-2xl font-bold text-gray-900 mb-6">Login</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Phone or Email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="w-full p-3 border rounded-lg bg-white focus:ring-red-500 focus:border-red-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-lg bg-white focus:ring-red-500 focus:border-red-500"
          />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full p-3 mt-2 text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="text-sm text-gray-600 mt-4">
          New here? <Link href={`/signUp${next ? `?next=${encodeURIComponent(next)}` : ""}`} className="text-red-600 underline">Create an account</Link>
        </p>
        {/* Admin login hint removed */}
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}
