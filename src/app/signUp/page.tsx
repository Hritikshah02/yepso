'use client';
import React, { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function SignUpContent() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '';

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
      setError('Please fill all fields');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      setLoading(true);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, phone, password, confirmPassword }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || 'Signup failed');
      }
      router.push(`/signIn${next ? `?next=${encodeURIComponent(next)}` : ''}`);
    } catch (e: any) {
      setError(e?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="max-w-md w-full mx-auto p-6 rounded-xl shadow-xl bg-red-500/15 backdrop-blur-xl backdrop-saturate-150 border border-red-500/20 ring-1 ring-inset ring-red-500/30 transition-transform duration-200 hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-0.5">
        <h2 className="text-center text-2xl font-bold text-gray-900 mb-6">Create your account</h2>
        <form className="space-y-3" onSubmit={submit}>
          <div className="flex gap-3">
            <input className="border p-3 rounded w-1/2 bg-white" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            <input className="border p-3 rounded w-1/2 bg-white" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>
          <input className="border p-3 rounded w-full bg-white" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="border p-3 rounded w-full bg-white" placeholder="Phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <input className="border p-3 rounded w-full bg-white" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <input className="border p-3 rounded w-full bg-white" placeholder="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button type="submit" className="w-full p-3 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-60" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>
        <p className="text-sm text-gray-600 mt-4">
          Already have an account? <Link href={`/signIn${next ? `?next=${encodeURIComponent(next)}` : ''}`} className="text-red-600 underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={null}>
      <SignUpContent />
    </Suspense>
  );
}
