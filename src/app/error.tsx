'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { RefreshCw, Home, AlertTriangle } from 'lucide-react';
import { siteConfig } from '@/config/site-config';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log safe error signal to browser console for telemetry without rendering secrets
    console.error('Handled application exception digest:', error.digest || 'no-digest');
  }, [error]);

  return (
    <main className="w-full min-h-[75vh] flex items-center justify-center bg-[#FDFBF7] px-4 py-16 sm:py-24">
      <div className="max-w-lg w-full text-center flex flex-col items-center">
        {/* Warning Icon Badge */}
        <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center mb-6 shadow-sm">
          <AlertTriangle className="w-8 h-8 text-[#F59E0B]" />
        </div>

        {/* Heading */}
        <h1 className="text-2xl sm:text-3xl font-black text-[#0F4C54] tracking-tight mb-3">
          Something unexpected happened
        </h1>

        {/* Safe generic description - no stack traces or server internals */}
        <p className="text-sm sm:text-base text-gray-600 mb-8 max-w-md leading-relaxed">
          We experienced an issue while loading this page. Our technical team has been notified. You can retry loading or return to safety.
        </p>

        {/* Recovery CTA buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 w-full sm:w-auto mb-8">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#0F4C54] text-white font-semibold text-sm hover:bg-[#0B393F] transition-colors shadow-sm cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white border border-gray-300 text-gray-800 font-semibold text-sm hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
        </div>

        {/* Support Help */}
        <div className="text-xs text-gray-500 border-t border-gray-200/80 pt-6 w-full">
          If this issue continues, please reach out to us at{' '}
          <a
            href={`mailto:${siteConfig.contact.email}`}
            className="text-[#0F4C54] font-semibold underline underline-offset-2"
          >
            {siteConfig.contact.email}
          </a>{' '}
          or call{' '}
          <a
            href={`tel:${siteConfig.contact.phone}`}
            className="text-[#0F4C54] font-semibold underline underline-offset-2"
          >
            {siteConfig.contact.displayPhone}
          </a>
          .
        </div>
      </div>
    </main>
  );
}
