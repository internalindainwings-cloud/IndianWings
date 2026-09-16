'use client';

import React from 'react';
import { Info, ExternalLink, Activity, Eye, MousePointer, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const TabHeatmaps: React.FC = () => {
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;
  const isConfigured = Boolean(clarityId && clarityId.trim() !== '');

  return (
    <div className="space-y-6">
      {/* 1. Human Friendly Header */}
      <div className="border-b border-white/10 pb-3">
        <h3 className="font-serif text-lg font-bold text-white">
          Visual Screen Recordings & Heatmaps
        </h3>
        <p className="mt-1 text-xs text-white/60">
          Watch real video replays of travelers browsing your Kashmir packages on mobile and computer to see what captures their attention.
        </p>
      </div>

      {/* 2. Clarity Status Card */}
      <div className="rounded-2xl border border-white/10 bg-[#0B1F2A]/60 p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg font-bold text-white">Microsoft Clarity Status</span>
              {isConfigured ? (
                <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400">
                  <CheckCircle2 className="h-3 w-3" />
                  Active Project Connected
                </span>
              ) : (
                <span className="flex items-center gap-1 rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-amber-400">
                  <ShieldAlert className="h-3 w-3" />
                  ID Pending in .env
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-white/60">
              {isConfigured
                ? `Project Key: ${clarityId} is embedded in website layout and actively streaming screen recordings.`
                : 'Clarity code is deployed in website layout. To activate recordings, paste your free Project ID into NEXT_PUBLIC_CLARITY_ID in .env.'}
            </p>
          </div>

          <a
            href="https://clarity.microsoft.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#d98f5b] to-[#EA580C] px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-[#d98f5b]/20 transition-all hover:brightness-110 active:scale-95"
          >
            <span>Open Clarity Console</span>
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>

      {/* 3. Behavioral Features Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Scroll Depth */}
        <div className="rounded-2xl border border-white/10 bg-[#0B1F2A]/40 p-5">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
            <Eye className="h-5 w-5" />
          </div>
          <h4 className="font-semibold text-sm text-white">Scroll Depth Heatmaps</h4>
          <p className="mt-1.5 text-xs leading-relaxed text-white/60">
            Visualizes where users stop scrolling. Understand whether visitors ever reach your luxury honeymoon packages,
            hotel reviews, or why they leave above the fold.
          </p>
        </div>

        {/* Rage Clicks */}
        <div className="rounded-2xl border border-white/10 bg-[#0B1F2A]/40 p-5">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
            <MousePointer className="h-5 w-5" />
          </div>
          <h4 className="font-semibold text-sm text-white">Rage & Dead Clicks</h4>
          <p className="mt-1.5 text-xs leading-relaxed text-white/60">
            Automatically flags frustration points where users rapidly click unclickable elements or experience lag,
            helping you eliminate booking friction immediately.
          </p>
        </div>

        {/* Session Video Replays */}
        <div className="rounded-2xl border border-white/10 bg-[#0B1F2A]/40 p-5">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
            <Activity className="h-5 w-5" />
          </div>
          <h4 className="font-semibold text-sm text-white">Session Video Replays</h4>
          <p className="mt-1.5 text-xs leading-relaxed text-white/60">
            Watch real video playback of user sessions. See cursor movement, mobile swipes, and exact drop-off moments
            with zero performance impact on the site.
          </p>
        </div>
      </div>
    </div>
  );
};
