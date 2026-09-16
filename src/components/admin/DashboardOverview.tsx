'use client';

import React, { useEffect, useState } from 'react';
import {
  Users,
  Calendar,
  TrendingUp,
  Clock,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import type { AdminSection } from './AdminSidebar';

interface DashboardStats {
  totalLeads: number;
  leadsToday: number;
  totalSessions: number;
  convertedSessions: number;
  conversionRate: string;
  avgDurationSeconds: number;
}

interface DashboardOverviewProps {
  stats: DashboardStats;
  recentLeadCount: number;
  onNavigate?: (section: AdminSection) => void;
}

/* ── Animated counter hook ────────────────────────────────────── */
function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (target === 0) {
      setValue(0);
      return;
    }
    const startTime = performance.now();
    let raf: number;
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) {
        raf = requestAnimationFrame(step);
      }
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  stats,
  recentLeadCount,
  onNavigate,
}) => {
  const animatedTotal = useCountUp(stats.totalLeads);
  const animatedToday = useCountUp(stats.leadsToday);
  const animatedSessions = useCountUp(stats.totalSessions);
  const animatedAvgDuration = useCountUp(stats.avgDurationSeconds);

  const formatDuration = (sec: number) => {
    if (sec < 60) return `${sec}s`;
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  };

  const now = new Date();
  const greeting =
    now.getHours() < 12
      ? 'Good Morning'
      : now.getHours() < 17
        ? 'Good Afternoon'
        : 'Good Evening';

  const statCards = [
    {
      label: 'Total Inquiries',
      value: animatedTotal,
      displayValue: animatedTotal.toString(),
      sub: 'All-time received',
      icon: <Users className="h-5 w-5" />,
      iconBg: 'bg-[#d98f5b]/10',
      iconColor: 'text-[#d98f5b]',
    },
    {
      label: "Today's Inquiries",
      value: animatedToday,
      displayValue: animatedToday.toString(),
      sub: 'Received today',
      icon: <Calendar className="h-5 w-5" />,
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-400',
    },
    {
      label: 'Inquiry Rate',
      value: parseFloat(stats.conversionRate),
      displayValue: `${stats.conversionRate}%`,
      sub: `${stats.convertedSessions} from ${animatedSessions} visitors`,
      icon: <TrendingUp className="h-5 w-5" />,
      iconBg: 'bg-emerald-500/10',
      iconColor: 'text-emerald-400',
      valueColor: 'text-emerald-400',
    },
    {
      label: 'Avg. Time on Site',
      value: animatedAvgDuration,
      displayValue: formatDuration(animatedAvgDuration),
      sub: 'Per traveler visit',
      icon: <Clock className="h-5 w-5" />,
      iconBg: 'bg-amber-500/10',
      iconColor: 'text-amber-400',
    },
  ];

  /* ── Quick action items that wire to sidebar sections ─────── */
  const quickActions: { label: string; section: AdminSection; count: number | null; color: string }[] = [
    { label: 'View all customer inquiries', section: 'leads', count: recentLeadCount, color: 'text-[#d98f5b]' },
    { label: 'Check visitor journeys', section: 'activity', count: stats.totalSessions, color: 'text-blue-400' },
    { label: 'Review screen recordings', section: 'heatmaps', count: null, color: 'text-amber-400' },
    { label: 'Analyze ad campaigns', section: 'marketing', count: null, color: 'text-emerald-400' },
  ];

  return (
    <div className="space-y-8">
      {/* ── Welcome Header ──────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 text-[#d98f5b]/60 mb-1">
          <Sparkles className="h-4 w-4" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.15em]">
            Overview
          </span>
        </div>
        <h2 className="font-playfair text-2xl font-bold text-[#F4EFE6] sm:text-3xl">
          {greeting}, Manager
        </h2>
        <p className="mt-1 text-sm text-white/40">
          Here&apos;s how your Kashmir travel portal is performing today.
        </p>
      </div>

      {/* ── Stat Cards Grid ─────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="group rounded-2xl border border-white/[0.08] bg-[#0B1F2A]/60 p-5 shadow-lg backdrop-blur-md transition-all duration-300 hover:border-white/[0.12] hover:shadow-xl"
          >
            <div className="flex items-start justify-between">
              <span className="text-xs font-medium text-white/50">{card.label}</span>
              <div className={`rounded-xl ${card.iconBg} p-2 ${card.iconColor}`}>
                {card.icon}
              </div>
            </div>
            <div
              className={`mt-3 text-3xl font-bold tabular-nums ${
                card.valueColor || 'text-white'
              }`}
            >
              {card.displayValue}
            </div>
            <div className="mt-1 text-[11px] text-white/35">{card.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Quick Actions ───────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Recent Activity Summary */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#0B1F2A]/60 p-6 backdrop-blur-md">
          <h3 className="font-playfair text-base font-bold text-[#F4EFE6]">
            Recent Activity
          </h3>
          <p className="mt-1 text-xs text-white/40">
            Quick snapshot of your latest data.
          </p>
          <div className="mt-5 space-y-3">
            <div className="flex items-center justify-between rounded-xl bg-white/[0.03] px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#d98f5b]/10 text-[#d98f5b]">
                  <Users className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white/80">New Inquiries</div>
                  <div className="text-[11px] text-white/35">Last 24 hours</div>
                </div>
              </div>
              <span className="text-lg font-bold tabular-nums text-[#d98f5b]">
                {stats.leadsToday}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-white/[0.03] px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white/80">Conversion Rate</div>
                  <div className="text-[11px] text-white/35">Visitors → Inquiries</div>
                </div>
              </div>
              <span className="text-lg font-bold tabular-nums text-emerald-400">
                {stats.conversionRate}%
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-white/[0.03] px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white/80">Total Visitors</div>
                  <div className="text-[11px] text-white/35">All tracked sessions</div>
                </div>
              </div>
              <span className="text-lg font-bold tabular-nums text-blue-400">
                {stats.totalSessions}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Navigation — now clickable */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#0B1F2A]/60 p-6 backdrop-blur-md">
          <h3 className="font-playfair text-base font-bold text-[#F4EFE6]">
            Quick Actions
          </h3>
          <p className="mt-1 text-xs text-white/40">
            Jump to frequently used sections.
          </p>
          <div className="mt-5 space-y-2">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={() => onNavigate?.(action.section)}
                className="flex w-full cursor-pointer items-center justify-between rounded-xl bg-white/[0.03] px-4 py-3 transition-all duration-200 hover:bg-white/[0.06] hover:translate-x-[2px] active:scale-[0.99]"
              >
                <div className="flex items-center gap-3">
                  <ArrowUpRight className={`h-4 w-4 ${action.color}`} />
                  <span className="text-sm text-white/60">{action.label}</span>
                </div>
                {action.count !== null && (
                  <span className="text-xs font-bold tabular-nums text-white/30">
                    {action.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
