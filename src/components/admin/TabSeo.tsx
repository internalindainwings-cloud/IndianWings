'use client';

import React from 'react';
import { Globe, FileText } from 'lucide-react';

export const TabSeo: React.FC = () => {
  return (
    <div className="space-y-8 pb-20">
      {/* ── 1. Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#d98f5b]/15 text-[#d98f5b] border border-[#d98f5b]/30">
              <Globe className="h-5 w-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              SEO & Search Console Hub
            </h1>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-white/60">
            Manage your SEO blogs and Google search configurations.
          </p>
        </div>
      </div>

      {/* ── 2. Placeholder Content ── */}
      <div className="rounded-2xl border border-white/10 bg-[#0B1E2A]/60 p-8 backdrop-blur-md shadow-xl text-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#d98f5b]/10 text-[#d98f5b]">
            <FileText className="h-8 w-8" />
          </div>
          <h2 className="text-lg font-bold text-white">
            Upload your SEO Blog in Word File
          </h2>
          <p className="text-sm text-white/60 max-w-md mx-auto">
            Below that, all SEO things according to Google will be shown here.
          </p>
        </div>
      </div>
    </div>
  );
};
