'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Activity,
  Flame,
  PieChart,
  LogOut,
  X,
  Luggage,
  SearchCheck,
  Mountain,
  Compass,
  Car,
  Star,
  Settings,
  Sparkles,
} from 'lucide-react';

export type AdminSection =
  | 'dashboard'
  | 'leads'
  | 'herohomepage'
  | 'packages'
  | 'destinations'
  | 'activities'
  | 'transport'
  | 'reviews'
  | 'seo'
  | 'settings'
  | 'activity'
  | 'heatmaps'
  | 'marketing';

/* ── Flat nav items matching the spec exactly ─────────────────── */
interface NavItem {
  id: AdminSection;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

/* ── Props ────────────────────────────────────────────────────── */
interface AdminSidebarProps {
  activeSection: AdminSection;
  onSectionChange: (section: AdminSection) => void;
  onLogout: () => void;
  leadCount?: number;
  sessionCount?: number;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeSection,
  onSectionChange,
  onLogout,
  leadCount = 0,
  sessionCount = 0,
  isMobileOpen = false,
  onMobileClose,
}) => {
  /* ── Flat nav list (no collapsible groups) ──────────────────── */
  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="h-[18px] w-[18px]" />,
    },
    {
      id: 'leads',
      label: 'Customer Inquiries',
      icon: <Users className="h-[18px] w-[18px]" />,
      badge: leadCount,
    },
    {
      id: 'packages',
      label: 'Packages Manager',
      icon: <Luggage className="h-[18px] w-[18px]" />,
    },
    {
      id: 'herohomepage',
      label: 'Hero Homepage',
      icon: <Sparkles className="h-[18px] w-[18px] text-saffron" />,
    },
    {
      id: 'destinations',
      label: 'Destinations',
      icon: <Mountain className="h-[18px] w-[18px]" />,
    },
    {
      id: 'activities',
      label: 'Activities & Sports',
      icon: <Compass className="h-[18px] w-[18px]" />,
    },
    {
      id: 'transport',
      label: 'Cab Fleet & Rates',
      icon: <Car className="h-[18px] w-[18px]" />,
    },
    {
      id: 'reviews',
      label: 'Customer Reviews',
      icon: <Star className="h-[18px] w-[18px]" />,
    },
    {
      id: 'seo',
      label: 'SEO & Search Console',
      icon: <SearchCheck className="h-[18px] w-[18px]" />,
    },
    {
      id: 'settings',
      label: 'Site & Contact Settings',
      icon: <Settings className="h-[18px] w-[18px]" />,
    },
    {
      id: 'activity',
      label: 'Visitor Journeys',
      icon: <Activity className="h-[18px] w-[18px]" />,
      badge: sessionCount,
    },
    {
      id: 'heatmaps',
      label: 'Screen Recordings',
      icon: <Flame className="h-[18px] w-[18px]" />,
    },
    {
      id: 'marketing',
      label: 'Ad Campaigns',
      icon: <PieChart className="h-[18px] w-[18px]" />,
    },
  ];

  const handleNavClick = (section: AdminSection) => {
    onSectionChange(section);
    onMobileClose?.();
  };

  /* ── Sidebar content ────────────────────────────────────── */
  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* ── Brand Identity ──────────────────────────────────── */}
      <div className="px-5 pt-6 pb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Saffron wing mark */}
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#d98f5b] to-[#EA580C] shadow-lg shadow-[#d98f5b]/20">
              <span className="text-sm font-bold text-white">W</span>
            </div>
            <div>
              <h1 className="text-[15px] font-bold leading-tight text-white">
                Indian Wings
              </h1>
              <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#F59E0B]">
                Admin Panel
              </span>
            </div>
          </div>
          {/* Mobile close button */}
          {onMobileClose && (
            <button
              onClick={onMobileClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white/70 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* ── Divider ─────────────────────────────────────────── */}
      <div className="mx-5 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      {/* ── Navigation ──────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto px-3 pt-4 pb-4">
        <div className="mb-2 px-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/50">
            Navigation
          </span>
        </div>
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => handleNavClick(item.id)}
                  className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-[#F59E0B]/20 text-white font-semibold shadow-sm'
                      : 'text-white/80 hover:translate-x-[3px] hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {/* Active indicator bar — smooth slide via layoutId */}
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active-indicator"
                      className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-[#F59E0B]"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}

                  {/* Hover indicator (non-active items) */}
                  {!isActive && (
                    <div className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-transparent opacity-0 transition-all duration-200 group-hover:bg-white/20 group-hover:opacity-100" />
                  )}

                  {/* Icon */}
                  <span
                    className={`flex-shrink-0 transition-colors duration-200 ${
                      isActive ? 'text-[#F59E0B]' : 'text-white/70 group-hover:text-white'
                    }`}
                  >
                    {item.icon}
                  </span>

                  {/* Label */}
                  <span className="flex-1 truncate">{item.label}</span>

                  {/* Badge */}
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold tabular-nums ${
                        isActive
                          ? 'bg-[#d98f5b]/20 text-[#d98f5b]'
                          : 'bg-white/8 text-white/40'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ── Bottom Section ──────────────────────────────────── */}
      <div className="mt-auto border-t border-white/[0.06] px-3 pt-3 pb-5">
        {/* Live status */}
        <div className="mb-3 flex items-center gap-2 px-3">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="text-[11px] font-medium text-white/40">System Live</span>
        </div>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-white/40 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut className="h-[18px] w-[18px] transition-colors group-hover:text-red-400" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Desktop sidebar (always visible ≥1024px) ────────── */}
      <aside className="hidden lg:flex lg:w-[240px] lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:border-r lg:border-white/10 lg:bg-[#071E24]">
        {sidebarContent}
      </aside>

      {/* ── Mobile overlay drawer ───────────────────────────── */}
      {isMobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={onMobileClose}
          />
          {/* Drawer */}
          <aside className="fixed inset-y-0 left-0 z-50 w-[280px] border-r border-white/10 bg-[#071E24] shadow-2xl shadow-black/50 lg:hidden">
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
};
