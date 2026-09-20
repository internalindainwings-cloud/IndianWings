'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Compass,
  ShoppingBag,
  Info,
  ExternalLink,
  Plus,
  Trash2,
  Edit2,
  Save,
  CheckCircle2,
  Layers,
  FileText,
  MapPin,
  Clock,
  Tag,
  ArrowRight,
} from 'lucide-react';

export type BucketSubPage = 'travel-information' | 'shopping' | 'things-to-do';

interface TabBucketListProps {
  initialSubPage?: BucketSubPage;
}

interface PageSectionBlock {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  badge?: string;
  location?: string;
  duration?: string;
}

export const TabBucketList: React.FC<TabBucketListProps> = ({
  initialSubPage = 'things-to-do',
}) => {
  const [activeTab, setActiveTab] = useState<BucketSubPage>(initialSubPage);

  // Per-page heading and configuration
  const pageConfigs: Record<
    BucketSubPage,
    {
      title: string;
      heading: string;
      subtitle: string;
      route: string;
      icon: React.ReactNode;
      itemLabel: string;
    }
  > = {
    'things-to-do': {
      title: 'Things to Do',
      heading: 'Unmissable Kashmir Bucket List — Things to Do',
      subtitle: 'Curated experiences, scenic lake cruises, high-altitude excursions, and iconic heritage activities.',
      route: '/bucket-list/things-to-do',
      icon: <Sparkles className="h-5 w-5 text-[#F59E0B]" />,
      itemLabel: 'Experience',
    },
    'shopping': {
      title: 'Shopping List',
      heading: 'Kashmiri Shopping Guide & Artisan Crafts',
      subtitle: 'Authentic Pashmina, saffron farms, walnut woodwork, paper mâché, and traditional heritage bazaars.',
      route: '/bucket-list/shopping',
      icon: <ShoppingBag className="h-5 w-5 text-[#F59E0B]" />,
      itemLabel: 'Craft / Market',
    },
    'travel-information': {
      title: 'Travel Information',
      heading: 'Kashmir Travel Information & Guidelines',
      subtitle: 'Essential advice on postpaid SIM regulations, airport security timelines, winter packing, and taxi rules.',
      route: '/bucket-list/travel-information',
      icon: <Info className="h-5 w-5 text-[#F59E0B]" />,
      itemLabel: 'Guideline / Tip',
    },
  };

  // State for items created by admin
  const [customItems, setCustomItems] = useState<Record<BucketSubPage, PageSectionBlock[]>>({
    'things-to-do': [],
    'shopping': [],
    'travel-information': [],
  });

  // Modal / Creator form state
  const [isCreating, setIsCreating] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<PageSectionBlock>({
    id: '',
    title: '',
    subtitle: '',
    description: '',
    badge: '',
    location: '',
    duration: '',
  });

  const [savedNotice, setSavedNotice] = useState(false);

  const currentConfig = pageConfigs[activeTab];
  const items = customItems[activeTab] || [];

  const handleOpenCreate = () => {
    setFormData({
      id: Date.now().toString(),
      title: '',
      subtitle: '',
      description: '',
      badge: 'Featured',
      location: '',
      duration: '',
    });
    setEditingIndex(null);
    setIsCreating(true);
  };

  const handleOpenEdit = (index: number) => {
    setFormData(items[index]);
    setEditingIndex(index);
    setIsCreating(true);
  };

  const handleDeleteItem = (index: number) => {
    setCustomItems((prev) => ({
      ...prev,
      [activeTab]: prev[activeTab].filter((_, i) => i !== index),
    }));
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setCustomItems((prev) => {
      const updatedList = [...prev[activeTab]];
      if (editingIndex !== null) {
        updatedList[editingIndex] = formData;
      } else {
        updatedList.push(formData);
      }
      return { ...prev, [activeTab]: updatedList };
    });

    setIsCreating(false);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* ── Sub-Navigation Pill Tabs ──────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          {(['things-to-do', 'shopping', 'travel-information'] as BucketSubPage[]).map((tab) => {
            const isActive = activeTab === tab;
            const config = pageConfigs[tab];
            return (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setIsCreating(false);
                }}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#F59E0B] text-[#081E23] shadow-md shadow-[#F59E0B]/20 font-bold'
                    : 'border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                {config.icon}
                <span>{config.title}</span>
                {customItems[tab].length > 0 && (
                  <span
                    className={`ml-1 rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                      isActive ? 'bg-[#081E23]/20 text-[#081E23]' : 'bg-white/10 text-white/70'
                    }`}
                  >
                    {customItems[tab].length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Live Route Link */}
        <Link
          href={currentConfig.route}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-medium text-white/80 transition-all hover:bg-white/10 hover:text-white"
        >
          <span>View Live Page</span>
          <ExternalLink className="h-3.5 w-3.5 text-[#F59E0B]" />
        </Link>
      </div>

      {/* ── Page Header Banner ───────────────────────────────────── */}
      <div className="rounded-2xl border border-white/10 bg-[#0B252C] p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B]" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#F59E0B]">
                PAGE MANAGEMENT
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {currentConfig.heading}
            </h2>
            <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
              {currentConfig.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-2 rounded-xl bg-[#F59E0B] px-4 py-2.5 text-xs font-bold text-[#081E23] transition-all hover:opacity-90 active:scale-95 shadow-md shadow-[#F59E0B]/20"
            >
              <Plus className="h-4 w-4" />
              <span>Create {currentConfig.itemLabel}</span>
            </button>
          </div>
        </div>

        {/* Status Pill Bar */}
        <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-white/10 pt-4 text-xs">
          <div className="flex items-center gap-1.5 text-white/70">
            <span className="font-medium text-white/40">Route:</span>
            <code className="rounded bg-black/30 px-2 py-0.5 text-[11px] text-[#F59E0B]">
              {currentConfig.route}
            </code>
          </div>
          <span className="text-white/20">•</span>
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span>Layout &amp; Route Preserved (Clean Slate)</span>
          </div>
          {savedNotice && (
            <div className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Changes Saved</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Create / Edit Form Modal ─────────────────────────────── */}
      {isCreating && (
        <div className="rounded-2xl border border-[#F59E0B]/30 bg-[#071E24] p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#F59E0B]" />
              <h3 className="text-sm font-bold text-white">
                {editingIndex !== null ? 'Edit' : 'Create New'} {currentConfig.itemLabel}
              </h3>
            </div>
            <button
              onClick={() => setIsCreating(false)}
              className="text-xs text-white/50 hover:text-white"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSaveItem} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-medium text-white/70">
                {currentConfig.itemLabel} Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder={`e.g. Dawn Shikara Ride / Certified Pashmina`}
                className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-white placeholder-white/30 focus:border-[#F59E0B] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-white/70">Badge / Tag</label>
              <input
                type="text"
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                placeholder="e.g. Must Visit / 100% Genuine"
                className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-white placeholder-white/30 focus:border-[#F59E0B] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-white/70">Location / Region</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Dal Lake, Srinagar / Polo View"
                className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-white placeholder-white/30 focus:border-[#F59E0B] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-medium text-white/70">Description / Details</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter detailed content, tips, or highlights..."
                className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-white placeholder-white/30 focus:border-[#F59E0B] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2 flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="rounded-xl border border-white/15 px-4 py-2 text-xs text-white/70 hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#F59E0B] px-5 py-2 text-xs font-bold text-[#081E23] hover:opacity-90 active:scale-95"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Save {currentConfig.itemLabel}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Items List or Clean Empty Slate ───────────────────────── */}
      {items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item, index) => (
            <div
              key={item.id || index}
              className="rounded-xl border border-white/10 bg-[#0B252C]/70 p-5 flex flex-col justify-between space-y-4 hover:border-white/20 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-bold text-white leading-snug">{item.title}</h4>
                  {item.badge && (
                    <span className="shrink-0 rounded-md bg-[#F59E0B]/20 px-2 py-0.5 text-[10px] font-bold text-[#F59E0B]">
                      {item.badge}
                    </span>
                  )}
                </div>

                {item.location && (
                  <div className="flex items-center gap-1 text-[11px] text-white/50">
                    <MapPin className="h-3 w-3 text-[#F59E0B]" />
                    <span>{item.location}</span>
                  </div>
                )}

                <p className="text-xs text-white/60 line-clamp-3 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-white/10 pt-3">
                <button
                  onClick={() => handleOpenEdit(index)}
                  className="rounded-lg p-1.5 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
                  title="Edit item"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteItem(index)}
                  className="rounded-lg p-1.5 text-red-400/70 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                  title="Delete item"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] py-14 px-6 text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-[#F59E0B]">
            <Layers className="h-6 w-6" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-bold text-white">
              {currentConfig.heading}
            </h3>
            <p className="text-xs text-white/50 leading-relaxed">
              No mock data present. The route and layout are live — administrators can create custom {currentConfig.itemLabel.toLowerCase()} entries anytime using the button below.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-2 rounded-xl border border-[#F59E0B]/50 bg-[#F59E0B]/10 px-4 py-2 text-xs font-semibold text-[#F59E0B] hover:bg-[#F59E0B]/20 transition-all cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>+ Create First {currentConfig.itemLabel}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TabBucketList;
