import React, { useState, useEffect } from 'react';
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
  Mail,
  ChevronDown,
} from 'lucide-react';

export type AdminSection =
  | 'dashboard'
  | 'leads'
  | 'users'
  | 'herohomepage'
  | 'packages'
  | 'destinations'
  | 'activities'
  | 'transport'
  | 'bucket-list'
  | 'bucket-travel-info'
  | 'bucket-shopping'
  | 'bucket-things-to-do'
  | 'reviews'
  | 'seo'
  | 'settings'
  | 'activity'
  | 'heatmaps'
  | 'marketing';

interface SubNavItem {
  id: AdminSection;
  label: string;
}

interface NavItem {
  id: AdminSection;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  children?: SubNavItem[];
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
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    destinations: false,
    packages: false,
    transport: false,
    activities: false,
    'bucket-list': true,
  });

  const toggleGroup = (id: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  /* ── Flat nav list with dropdown children matching site navigation ────── */
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
      id: 'users',
      label: 'All Users',
      icon: <Mail className="h-[18px] w-[18px] text-[#C5A45E]" />,
    },
    {
      id: 'packages',
      label: 'Packages',
      icon: <Luggage className="h-[18px] w-[18px]" />,
      children: [
        { id: 'packages', label: 'All Packages Manager' },
      ],
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
      children: [
        { id: 'destinations', label: 'All Destinations Manager' },
      ],
    },
    {
      id: 'activities',
      label: 'Adventure Activities',
      icon: <Compass className="h-[18px] w-[18px]" />,
      children: [
        { id: 'activities', label: 'Activities & Sports Manager' },
      ],
    },
    {
      id: 'transport',
      label: 'Transport & Fleet',
      icon: <Car className="h-[18px] w-[18px]" />,
      children: [
        { id: 'transport', label: 'Cab Fleet & Rates Manager' },
      ],
    },
    {
      id: 'bucket-list',
      label: 'Kashmir Bucket List',
      icon: <Sparkles className="h-[18px] w-[18px] text-[#F59E0B]" />,
      children: [
        { id: 'bucket-things-to-do', label: 'Things to Do' },
        { id: 'bucket-shopping', label: 'Shopping List' },
        { id: 'bucket-travel-info', label: 'Travel Information' },
      ],
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

  // Auto-expand group when active section belongs to it
  useEffect(() => {
    for (const item of navItems) {
      if (item.children?.some((sub) => sub.id === activeSection) || item.id === activeSection) {
        setExpandedGroups((prev) => ({ ...prev, [item.id]: true }));
      }
    }
  }, [activeSection]);

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
            const hasChildren = item.children && item.children.length > 0;
            const isGroupActive =
              activeSection === item.id ||
              (hasChildren && item.children!.some((sub) => sub.id === activeSection));
            const isExpanded = Boolean(expandedGroups[item.id]);

            return (
              <li key={item.id}>
                <button
                  onClick={() => {
                    if (hasChildren) {
                      toggleGroup(item.id);
                      handleNavClick(item.id);
                    } else {
                      handleNavClick(item.id);
                    }
                  }}
                  className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-medium transition-all duration-200 ${
                    isGroupActive
                      ? 'bg-[#F59E0B]/20 text-white font-semibold shadow-sm'
                      : 'text-white/80 hover:translate-x-[3px] hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {/* Active indicator bar */}
                  {isGroupActive && (
                    <motion.div
                      layoutId="sidebar-active-indicator"
                      className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-[#F59E0B]"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}

                  {/* Hover indicator */}
                  {!isGroupActive && (
                    <div className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-transparent opacity-0 transition-all duration-200 group-hover:bg-white/20 group-hover:opacity-100" />
                  )}

                  {/* Icon */}
                  <span
                    className={`flex-shrink-0 transition-colors duration-200 ${
                      isGroupActive ? 'text-[#F59E0B]' : 'text-white/70 group-hover:text-white'
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
                        isGroupActive
                          ? 'bg-[#d98f5b]/20 text-[#d98f5b]'
                          : 'bg-white/8 text-white/40'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}

                  {/* Dropdown chevron */}
                  {hasChildren && (
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform duration-200 shrink-0 ${
                        isExpanded ? 'rotate-180 text-white' : 'text-white/40 group-hover:text-white/70'
                      }`}
                    />
                  )}
                </button>

                {/* Sub-items list */}
                {hasChildren && isExpanded && (
                  <ul className="mt-1 ml-5 space-y-0.5 border-l border-white/10 pl-2.5">
                    {item.children!.map((sub) => {
                      const isSubActive = activeSection === sub.id;
                      return (
                        <li key={sub.id}>
                          <button
                            onClick={() => handleNavClick(sub.id)}
                            className={`group flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs transition-all ${
                              isSubActive
                                ? 'bg-[#F59E0B]/20 text-[#F59E0B] font-semibold shadow-xs'
                                : 'text-white/60 hover:bg-white/5 hover:text-white'
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full transition-colors ${
                                isSubActive ? 'bg-[#F59E0B]' : 'bg-white/30 group-hover:bg-white/60'
                              }`}
                            />
                            <span className="truncate">{sub.label}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
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
