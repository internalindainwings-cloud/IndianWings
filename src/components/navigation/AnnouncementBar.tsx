'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, X, ChevronRight } from 'lucide-react';
import { useSiteSettings } from '@/context/SiteSettingsContext';

export const AnnouncementBar: React.FC = () => {
  const settings = useSiteSettings();
  const [dismissed, setDismissed] = useState(false);

  if (!settings.announcementEnabled || !settings.announcementText || dismissed) {
    return null;
  }

  return (
    <div className="w-full bg-gradient-to-r from-[#B45309] via-[#d98f5b] to-[#EA580C] text-white text-[11px] sm:text-xs font-manrope font-semibold py-1.5 px-4 shadow-sm relative z-50 transition-all duration-300">
      <div className="max-w-[1920px] mx-auto flex items-center justify-between gap-2">
        <div className="flex-1 flex items-center justify-center gap-2 truncate">
          <Sparkles className="h-3.5 w-3.5 shrink-0 text-amber-200 animate-pulse" />
          <span className="truncate">{settings.announcementText}</span>
          <Link
            href={settings.announcementLink || '/packages'}
            className="hidden sm:inline-flex items-center gap-0.5 text-amber-100 hover:text-white underline font-bold shrink-0 ml-1"
          >
            <span>Learn More</span>
            <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="p-1 hover:bg-black/15 rounded text-white/80 hover:text-white transition-colors cursor-pointer shrink-0"
          aria-label="Dismiss banner"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
