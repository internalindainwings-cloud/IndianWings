'use client';

import React from 'react';
import { Info, TrendingUp, Target, Megaphone, CheckCircle2 } from 'lucide-react';

export interface CampaignRecord {
  source: string;
  clicks: number;
  conversions: number;
  rate: number;
}

interface TabMarketingProps {
  campaigns: CampaignRecord[];
}

export const TabMarketing: React.FC<TabMarketingProps> = ({ campaigns }) => {
  return (
    <div className="space-y-6">
      {/* 1. Human Friendly Header */}
      <div className="border-b border-white/10 pb-3">
        <h3 className="font-serif text-lg font-bold text-white">
          Advertising Campaigns & Traffic Sources
        </h3>
        <p className="mt-1 text-xs text-white/60">
          Track which Google Ads, Instagram Reels, and search keywords generate high-intent Kashmir inquiries.
        </p>
      </div>

      {/* 2. Marketing Overview Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-[#0B1F2A]/60 p-5 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#d98f5b]/10 p-2.5 text-[#d98f5b]">
              <Megaphone className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-white/50">Active Ad Channels</div>
              <div className="text-xl font-bold text-white">{campaigns.length} Sources</div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0B1F2A]/60 p-5 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-500/10 p-2.5 text-blue-400">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-white/50">Total Tracked Ingress</div>
              <div className="text-xl font-bold text-white">
                {campaigns.reduce((acc, c) => acc + c.clicks, 0)} Visits
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0B1F2A]/60 p-5 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-400">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-white/50">Total Inquiries Generated</div>
              <div className="text-xl font-bold text-white">
                {campaigns.reduce((acc, c) => acc + c.conversions, 0)} Leads
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Campaign Performance Table */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0B1F2A]/60 shadow-xl backdrop-blur-md">
        <div className="border-b border-white/10 px-5 py-4">
          <h4 className="font-serif text-sm font-bold text-white">Campaign Conversion Matrix</h4>
          <p className="mt-0.5 text-xs text-white/50">
            Real-time ROI analysis: Which traffic sources result in actual submitted trip inquiries.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-white/80">
            <thead className="border-b border-white/10 bg-white/[0.03] text-[11px] font-semibold uppercase tracking-wider text-white/50">
              <tr>
                <th className="px-5 py-3.5">Traffic Source / Ad Tag</th>
                <th className="px-5 py-3.5">Recorded Visits</th>
                <th className="px-5 py-3.5">Converted Inquiries</th>
                <th className="px-5 py-3.5">Conversion Rate</th>
                <th className="px-5 py-3.5 text-right">Performance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {campaigns.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-white/40">
                    No marketing campaigns logged yet. Run an ad or visit with ?utm_source=google_ads to test!
                  </td>
                </tr>
              ) : (
                campaigns.map((camp, idx) => (
                  <tr key={idx} className="transition-colors hover:bg-white/[0.02]">
                    <td className="px-5 py-4 font-mono font-medium text-white">
                      <span className="rounded-md bg-white/5 px-2 py-1 text-white/90">
                        {camp.source}
                      </span>
                    </td>

                    <td className="px-5 py-4">{camp.clicks} visitors</td>

                    <td className="px-5 py-4 font-semibold text-emerald-400">
                      {camp.conversions} leads
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-white/10">
                          <div
                            className="h-full bg-gradient-to-r from-[#d98f5b] to-emerald-400"
                            style={{ width: `${Math.min(camp.rate, 100)}%` }}
                          />
                        </div>
                        <span className="font-semibold text-white">{camp.rate}%</span>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-right">
                      {camp.rate > 0 ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                          <CheckCircle2 className="h-3 w-3" />
                          High Intent
                        </span>
                      ) : (
                        <span className="inline-block rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-medium text-white/50">
                          Browsing Only
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
