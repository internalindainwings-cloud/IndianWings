'use client';

import React, { useState, useCallback } from 'react';
import { Menu, RefreshCw } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { AdminSidebar, AdminSection } from './AdminSidebar';

interface AdminShellProps {
  children: React.ReactNode;
  activeSection: AdminSection;
  onSectionChange: (section: AdminSection) => void;
  onLogout: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  leadCount?: number;
  sessionCount?: number;
}

/* ── Section display labels ───────────────────────────────────── */
const sectionLabels: Record<AdminSection, string> = {
  dashboard: 'Dashboard',
  leads: 'Customer Inquiries',
  herohomepage: 'Hero Homepage Manager',
  packages: 'Packages & Itineraries Manager',
  destinations: 'Destinations & Valleys',
  activities: 'Adventures & Sightseeing',
  transport: 'Cab Fleet & Transfer Rates',
  reviews: 'Customer Reviews & Stories',
  seo: 'SEO & Search Console Hub',
  settings: 'Site & Contact Settings',
  activity: 'Visitor Journeys',
  heatmaps: 'Screen Recordings',
  marketing: 'Ad Campaigns',
};

/* ── Panel transition variants ────────────────────────────────── */
const panelVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export const AdminShell: React.FC<AdminShellProps> = ({
  children,
  activeSection,
  onSectionChange,
  onLogout,
  onRefresh,
  isRefreshing,
  leadCount = 0,
  sessionCount = 0,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMobileClose = useCallback(() => setMobileMenuOpen(false), []);

  return (
    <div className="min-h-screen bg-[#081E23] text-white">
      {/* ── Sidebar ─────────────────────────────────────────── */}
      <AdminSidebar
        activeSection={activeSection}
        onSectionChange={onSectionChange}
        onLogout={onLogout}
        leadCount={leadCount}
        sessionCount={sessionCount}
        isMobileOpen={mobileMenuOpen}
        onMobileClose={handleMobileClose}
      />

      {/* ── Main Content Area (offset by sidebar on desktop) ── */}
      <div className="lg:pl-[240px]">
        {/* ── Top Bar (mobile hamburger + section title) ───── */}
        <header className="sticky top-0 z-30 border-b border-white/10 bg-[#081E23]/95 backdrop-blur-xl">
          <div className="flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 text-white/70 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>

              {/* Page title */}
              <div>
                <h1 className="text-lg font-bold text-white">
                  {sectionLabels[activeSection]}
                </h1>
              </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-3">
              {/* Live indicator */}
              <div className="hidden items-center gap-2 text-[11px] text-white/60 sm:flex">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span>Live</span>
              </div>

              {/* Refresh button */}
              <button
                onClick={onRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white/80 shadow-sm transition-all hover:bg-white/10 hover:text-white active:scale-95 disabled:opacity-50"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin text-[#F59E0B]' : ''}`}
                />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>
        </header>

        {/* ── Page Content with fade-in transition ────────────── */}
        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              variants={panelVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};
