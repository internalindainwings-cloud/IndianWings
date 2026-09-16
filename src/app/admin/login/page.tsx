'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Eye, EyeOff, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Please enter your admin access key');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: password.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      router.push('/admin');
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#081E23] px-4 py-12">
      <div className="w-full max-w-md">
        {/* Brand Card */}
        <div className="rounded-3xl border border-white/10 bg-[#0B252B] p-8 shadow-2xl backdrop-blur-xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-[#F59E0B]">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <h1 className="font-manrope text-2xl font-bold tracking-tight text-white">
              Executive Admin Portal
            </h1>
            <p className="mt-1 text-xs uppercase tracking-widest text-[#F59E0B]">
              The Indian Wings Company
            </p>
            <p className="mt-2 text-xs text-white/60">
              Authorized personnel only. Protected by real-time rate limiting and IP monitoring.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/80">
                Admin Access Key
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-white/40">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter secret key..."
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-10 text-sm text-white placeholder-white/40 transition-all focus:border-[#F59E0B] focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-[#F59E0B]"
                  autoComplete="current-password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-white/40 hover:text-white"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#d98f5b] to-[#c47a46] py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#d98f5b]/20 transition-all hover:brightness-110 active:scale-[0.99] disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Unlock Admin Portal</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Subdomain Notice */}
          <div className="mt-8 border-t border-white/5 pt-4 text-center">
            <span className="text-[11px] text-white/40">
              Encrypted Session Scoped to Subdomain · SSL TLS 1.3
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
