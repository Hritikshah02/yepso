"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function MyProductsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [error, setError] = useState<string>("");
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/signIn");
      }
    }
  }, [loading, user, router]);

  useEffect(() => {
    async function load() {
      try {
        setLoadingOrders(true);
        const res = await fetch("/api/orders", { cache: "no-store" });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.error || "Failed to load orders");
        setOrders(Array.isArray(data.orders) ? data.orders : []);
      } catch (e: any) {
        setError(e?.message || "Failed to load orders");
      } finally {
        setLoadingOrders(false);
      }
    }
    if (user) load();
  }, [user]);

  if (loading || !user) {
    return <div className="max-w-4xl mx-auto p-6">Loading...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">My Products</h1>
      {error && <p className="text-red-600 mb-3">{error}</p>}
      {loadingOrders ? (
        <div>Loading your orders...</div>
      ) : orders.length === 0 ? (
        <div className="text-gray-600">No orders yet.</div>
      ) : (
        <ul className="space-y-4">
          {orders.map((o) => (
            <li key={o.id} className="border rounded-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Order #{o.id}</div>
                  <div className="text-sm text-gray-600">{new Date(o.createdAt).toLocaleString()}</div>
                </div>
                <div className="text-sm">
                  <span className="px-2 py-1 rounded bg-gray-100 mr-2">{o.status}</span>
                  <span className="font-semibold">₹ {o.total}</span>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                {o.items?.map((it: any) => (
                  <div key={it.id} className="flex items-center gap-3">
                    {it.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={it.imageUrl} alt={it.name} className="w-14 h-14 object-contain bg-white rounded border" />
                    ) : (
                      <div className="w-14 h-14 bg-gray-100 rounded border" />
                    )}
                    <div>
                      <div className="font-medium">{it.name}</div>
                      <div className="text-sm text-gray-600">Qty: {it.quantity} • ₹ {it.price}</div>
                    </div>
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
