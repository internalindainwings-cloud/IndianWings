'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

import { AdminShell } from '@/components/admin/AdminShell';
import { AdminSection } from '@/components/admin/AdminSidebar';
import { DashboardOverview } from '@/components/admin/DashboardOverview';
import { TabLeads, LeadRecord } from '@/components/admin/TabLeads';
import { TabUserActivity, UserSessionRecord } from '@/components/admin/TabUserActivity';
import { TabHeatmaps } from '@/components/admin/TabHeatmaps';
import { TabMarketing, CampaignRecord } from '@/components/admin/TabMarketing';
import { TabPackages } from '@/components/admin/TabPackages';
import { TabDestinations } from '@/components/admin/TabDestinations';
import { TabActivities } from '@/components/admin/TabActivities';
import { TabTransport } from '@/components/admin/TabTransport';
import { TabReviews } from '@/components/admin/TabReviews';
import { TabSeo } from '@/components/admin/TabSeo';
import { TabSettings } from '@/components/admin/TabSettings';
import { TabHeroHomepage } from '@/components/admin/TabHeroHomepage';
import { TabAllUsers } from '@/components/admin/TabAllUsers';
import { TabBucketList } from '@/components/admin/TabBucketList';
import { TabGallery } from '@/components/admin/TabGallery';
import { TabPageHeroes } from '@/components/admin/TabPageHeroes';
import TabBrands from '@/components/admin/TabBrands';

interface AdminData {
  stats: {
    totalLeads: number;
    leadsToday: number;
    totalSessions: number;
    convertedSessions: number;
    conversionRate: string;
    avgDurationSeconds: number;
  };
  leads: LeadRecord[];
  sessions: UserSessionRecord[];
  campaigns: CampaignRecord[];
}

/* ── Valid tab values for URL param mapping ────────────────────── */
const validTabs: AdminSection[] = [
  'dashboard',
  'leads',
  'users',
  'herohomepage',
  'pageheroes',
  'packages',
  'destinations',
  'activities',
  'transport',
  'bucket-list',
  'bucket-travel-info',
  'bucket-shopping',
  'bucket-things-to-do',
  'reviews',
  'gallery',
  'seo',
  'settings',
  'activity',
  'heatmaps',
  'marketing',
  'brands',
];

function parseTab(param: string | null): AdminSection {
  if (param && validTabs.includes(param as AdminSection)) {
    return param as AdminSection;
  }
  return 'dashboard';
}

function AdminDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  /* ── Active section state synced with ?tab= query param ─────── */
  const [activeSection, setActiveSection] = useState<AdminSection>(() =>
    parseTab(searchParams.get('tab'))
  );
  const [data, setData] = useState<AdminData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) setIsRefreshing(true);
    try {
      const res = await fetch('/api/admin/data');
      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }
      const json = await res.json();
      if (json.success) {
        setData(json);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [router]);

  /* ── Update URL when section changes ────────────────────────── */
  const handleSectionChange = useCallback(
    (section: AdminSection) => {
      setActiveSection(section);
      const params = new URLSearchParams(searchParams.toString());
      if (section === 'dashboard') {
        params.delete('tab');
      } else {
        params.set('tab', section);
      }
      const qs = params.toString();
      router.replace(`/admin${qs ? `?${qs}` : ''}`, { scroll: false });

      // If opening leads or dashboard, fetch fresh data immediately
      if (section === 'leads' || section === 'dashboard') {
        fetchData(false);
      }
    },
    [router, searchParams, fetchData]
  );

  useEffect(() => {
    fetchData();
    // Auto refresh every 30s for live telemetry updates
    const interval = setInterval(() => {
      fetchData();
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch {
      router.push('/admin/login');
    }
  };

  /* ── Loading state ──────────────────────────────────────────── */
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#081E23]">
        <div className="flex flex-col items-center gap-3 text-white/70">
          <Loader2 className="h-8 w-8 animate-spin text-[#F59E0B]" />
          <p className="text-xs uppercase tracking-widest text-white/50">
            Connecting to PostgreSQL Data Vault...
          </p>
        </div>
      </div>
    );
  }

  const stats = data?.stats || {
    totalLeads: 0,
    leadsToday: 0,
    totalSessions: 0,
    convertedSessions: 0,
    conversionRate: '0.0',
    avgDurationSeconds: 0,
  };

  /* ── Render active panel ────────────────────────────────────── */
  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <DashboardOverview
            stats={stats}
            recentLeadCount={data?.leads?.length || 0}
            onNavigate={handleSectionChange}
          />
        );
      case 'leads':
        return (
          <TabLeads
            leads={data?.leads || []}
            onRefresh={() => fetchData(true)}
            isRefreshing={isRefreshing}
          />
        );
      case 'users':
        return <TabAllUsers />;
      case 'herohomepage':
        return <TabHeroHomepage />;
      case 'pageheroes':
        return <TabPageHeroes />;
      case 'packages':
        return <TabPackages />;
      case 'destinations':
        return <TabDestinations />;
      case 'activities':
        return <TabActivities />;
      case 'transport':
        return <TabTransport />;
      case 'bucket-list':
        return <TabBucketList initialSubPage="things-to-do" />;
      case 'bucket-things-to-do':
        return <TabBucketList initialSubPage="things-to-do" />;
      case 'bucket-shopping':
        return <TabBucketList initialSubPage="shopping" />;
      case 'bucket-travel-info':
        return <TabBucketList initialSubPage="travel-information" />;
      case 'reviews':
        return <TabReviews />;
      case 'gallery':
        return <TabGallery />;
      case 'seo':
        return <TabSeo />;
      case 'settings':
        return <TabSettings />;
      case 'activity':
        return (
          <TabUserActivity sessions={data?.sessions || []} />
        );
      case 'heatmaps':
        return <TabHeatmaps />;
      case 'marketing':
        return (
          <TabMarketing campaigns={data?.campaigns || []} />
        );
      case 'brands':
        return <TabBrands />;
      default:
        return null;
    }
  };

  return (
    <AdminShell
      activeSection={activeSection}
      onSectionChange={handleSectionChange}
      onLogout={handleLogout}
      onRefresh={() => fetchData(true)}
      isRefreshing={isRefreshing}
      leadCount={data?.leads?.length || 0}
      sessionCount={data?.sessions?.length || 0}
    >
      {renderContent()}
    </AdminShell>
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#07131B]">
          <div className="flex flex-col items-center gap-3 text-white/70">
            <Loader2 className="h-8 w-8 animate-spin text-[#d98f5b]" />
            <p className="text-xs uppercase tracking-widest text-white/50">
              Loading Admin Portal...
            </p>
          </div>
        </div>
      }
    >
      <AdminDashboardContent />
    </Suspense>
  );
}

