"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function CheckoutSuccessInner() {
  const sp = useSearchParams();
  const orderId = sp.get("orderId") || "";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState<number | string>("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<string>("");
  const [err, setErr] = useState<string>("");

  async function submitReview(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSubmitting(true);
      setErr("");
      setMsg("");
      const rInt = Number(rating);
      if (!Number.isInteger(rInt) || rInt < 1 || rInt > 5) throw new Error("Rating must be 1-5");
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: orderId || undefined, name: name.trim() || undefined, email: email.trim() || undefined, rating: rInt, comment: comment.trim() || undefined }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j?.error || "Failed to submit review");
      setMsg("Thank you for your review!");
      setName("");
      setEmail("");
      setRating("");
      setComment("");
    } catch (e: any) {
      setErr(e?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-semibold mb-2 text-center">Payment Successful</h1>
      <p className="text-gray-600 mb-6 text-center">
        Thank you! If you paid via Razorpay, we will email your order confirmation shortly.
      </p>

      <div className="border rounded-lg p-4">
        <h2 className="text-lg font-medium mb-2">Leave a review</h2>
        <p className="text-sm text-gray-600 mb-4">We value your feedback. Rating 1-5, comment optional.</p>
        <form onSubmit={submitReview} className="space-y-3">
          {orderId ? (
            <div className="text-xs text-gray-500">Order ID: {orderId}</div>
          ) : null}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Rating (1-5)</label>
            <input
              className="w-full border rounded-md px-3 py-2"
              type="number"
              min={1}
              max={5}
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Name (optional)</label>
              <input className="w-full border rounded-md px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Email (optional)</label>
              <input className="w-full border rounded-md px-3 py-2" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Comment (optional)</label>
            <textarea className="w-full border rounded-md px-3 py-2" rows={4} value={comment} onChange={(e) => setComment(e.target.value)} />
          </div>
          {err && <p className="text-red-600 text-sm">{err}</p>}
          {msg && <p className="text-green-600 text-sm">{msg}</p>}
          <div className="flex items-center gap-3">
            <button type="submit" disabled={submitting} className="bg-blue-600 text-white rounded-md px-5 py-2 disabled:opacity-50">
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
            <a href="/" className="text-blue-600 underline">Continue shopping</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CheckoutSuccess() {
  return (
    <Suspense fallback={<div className="max-w-2xl mx-auto p-8">Loading...</div>}>
      <CheckoutSuccessInner />
    </Suspense>
  );
}
