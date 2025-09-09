"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
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
      if (data?.user?.role === "admin") router.push("/admin");
      else router.push("/");
    } catch (e: any) {
      setError(e?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-center text-2xl font-bold text-gray-900 mb-6">Login</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Phone or Email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-red-500 focus:border-red-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-red-500 focus:border-red-500"
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
          New here? <Link href="/signUp" className="text-red-600 underline">Create an account</Link>
        </p>
        <p className="text-xs text-gray-400 mt-2">Admin login: username "admin" and password "admin"</p>
      </div>
    </div>
  );
}
