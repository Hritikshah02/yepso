"use client";

import { useEffect, useState } from "react";
import PromoBanner from "../components/prenavbar";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

type Product = {
  id: number;
  slug: string;
  name: string;
  price: number;
  imageUrl?: string | null;
};

export default function AdminDashboard() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | string>("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  // Ensure only Cloudinary URLs are accepted when pasting an image URL
  function isCloudinaryUrl(url: string): boolean {
    try {
      const u = new URL(url);
      return u.hostname === "res.cloudinary.com";
    } catch {
      return false;
    }
  }

  async function loadProducts() {
    try {
      const res = await fetch("/api/products", { cache: "no-store" });
      if (res.ok) {
        const list = await res.json();
        setProducts(list);
      }
    } catch {}
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      const pInt = Number(price);
      if (!name.trim()) throw new Error("Name is required");
      if (!Number.isInteger(pInt) || pInt < 0) throw new Error("Price must be a non-negative integer (INR)");
      const trimmedUrl = imageUrl.trim();
      if (trimmedUrl && !isCloudinaryUrl(trimmedUrl)) {
        throw new Error("Image URL must be a Cloudinary URL (res.cloudinary.com). Use the uploader or paste a Cloudinary URL.");
      }

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), price: pInt, imageUrl: trimmedUrl || undefined }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || "Failed to add product");
      }
      setName("");
      setPrice("");
      setImageUrl("");
      setSuccess("Product added successfully");
      loadProducts();
    } catch (err: any) {
      setError(err?.message || "Failed to add product");
    } finally {
      setSubmitting(false);
    }
  }

  async function onFileSelected(file: File) {
    if (!cloudName || !uploadPreset) {
      setError("Cloudinary env vars missing. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET.");
      return;
    }
    try {
      setUploading(true);
      setError("");
      const form = new FormData();
      form.append("file", file);
      form.append("upload_preset", uploadPreset);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (!res.ok || !data?.secure_url) {
        throw new Error(data?.error?.message || "Cloudinary upload failed");
      }
      setImageUrl(data.secure_url as string);
      setSuccess("Image uploaded to Cloudinary");
    } catch (e: any) {
      setError(e?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function deleteProduct(slug: string) {
    try {
      if (!slug) return;
      const yes = window.confirm("Are you sure you want to delete this product? This cannot be undone.");
      if (!yes) return;
      setError("");
      setSuccess("");
      const res = await fetch(`/api/products/${encodeURIComponent(slug)}`, { method: "DELETE" });
      if (!res.ok) {
        const j = await res.json().catch(() => ({} as any));
        throw new Error(j?.error || "Failed to delete product");
      }
      setSuccess("Product deleted");
      await loadProducts();
    } catch (e: any) {
      setError(e?.message || "Delete failed");
    }
  }

  return (
    <>
      <PromoBanner />
      <Navbar />
      <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-semibold mb-4">Admin Dashboard</h1>

      <form onSubmit={onSubmit} className="space-y-4 border rounded-lg p-4 shadow-sm bg-white">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Product Name</label>
          <input
            className="w-full border rounded-md px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Smart Inverter"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Price (INR)</label>
          <input
            className="w-full border rounded-md px-3 py-2"
            type="number"
            inputMode="numeric"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="e.g. 25000"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm text-gray-600">Product Image</label>
          <div className="flex flex-col md:flex-row gap-3 md:items-center">
            <input
              type="text"
              className="flex-1 border rounded-md px-3 py-2"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Cloudinary URL (or upload below)"
            />
            <label className="inline-flex items-center gap-2">
              <span className="text-sm text-gray-600">Upload</span>
              <input
                type="file"
                accept="image/*"
                disabled={uploading}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) onFileSelected(f);
                }}
              />
            </label>
          </div>
          {imageUrl && (
            <div className="text-xs text-gray-500 break-all">{imageUrl}</div>
          )}
          {imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt="preview" className="mt-2 h-24 w-24 object-cover rounded" />
          )}
          {!cloudName || !uploadPreset ? (
            <p className="text-xs text-amber-600">Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET to enable uploads.</p>
          ) : null}
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="bg-red-600 hover:bg-red-700 transition text-white rounded-md px-5 py-2 disabled:opacity-50"
        >
          {submitting ? "Adding..." : "Add Product"}
        </button>
      </form>

      <h2 className="text-lg font-medium mt-8 mb-3">Existing Products</h2>
      <div className="grid grid-cols-1 gap-3">
        {products.map((p) => (
          <div key={p.id} className="border rounded-md p-3 flex items-center justify-between bg-white shadow-sm">
            <div>
              <div className="font-medium">{p.name}</div>
              <div className="text-sm text-gray-600">₹{p.price} · {p.slug}</div>
              {p.imageUrl ? (
                <div className="text-xs text-gray-500 break-all">{p.imageUrl}</div>
              ) : null}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => deleteProduct(p.slug)}
                className="text-red-600 hover:text-red-700 border border-red-200 hover:border-red-300 rounded px-3 py-1 text-sm"
                title="Delete product"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <div className="text-sm text-gray-500">No products found yet.</div>
        )}
      </div>
      </div>
      <Footer />
    </>
  );
}
