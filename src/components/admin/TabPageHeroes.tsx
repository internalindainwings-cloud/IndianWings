'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  Sparkles,
  Upload,
  Save,
  Loader2,
  CheckCircle2,
  ExternalLink,
  MapPin,
  Luggage,
  Car,
  Mountain,
  Copy,
  Smartphone,
  Monitor,
  RotateCcw,
} from 'lucide-react';
import type { PageHeroConfig } from '@/lib/page-heroes-constants';
import { DEFAULT_PAGE_HEROES } from '@/lib/page-heroes-constants';

export const TabPageHeroes: React.FC = () => {
  const [heroes, setHeroes] = useState<Record<string, PageHeroConfig>>(DEFAULT_PAGE_HEROES);
  const [activePageId, setActivePageId] = useState<string>('destinations');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploadingField, setUploadingField] = useState<'desktop' | 'mobile' | null>(null);

  const desktopInputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  const pages = [
    { id: 'destinations', name: 'Destinations', icon: MapPin, route: '/destinations' },
    { id: 'packages', name: 'Tour Packages', icon: Luggage, route: '/packages' },
    { id: 'transport', name: 'Transport & Fleet', icon: Car, route: '/transport' },
    { id: 'activities', name: 'Adventure & Sports', icon: Mountain, route: '/activities' },
    { id: 'bucket-list', name: 'Kashmir Bucket List', icon: Sparkles, route: '/bucket-list/travel-information' },
  ];

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/page-heroes');
      const json = await res.json();
      if (json.success && json.heroes) {
        setHeroes(json.heroes);
      }
    } catch (err) {
      console.error('Failed to load page heroes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const currentHero = heroes[activePageId] || DEFAULT_PAGE_HEROES[activePageId];

  const handleFieldChange = (field: keyof PageHeroConfig, value: string) => {
    setHeroes((prev) => ({
      ...prev,
      [activePageId]: {
        ...prev[activePageId],
        [field]: value,
      },
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'desktop' | 'mobile') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(field);
    try {
      const body = new FormData();
      body.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body,
      });

      const json = await res.json();
      if (json.success && json.url) {
        if (field === 'desktop') {
          handleFieldChange('desktopImageUrl', json.url);
          // Auto-sync mobile if mobile was empty or same as desktop
          if (!currentHero.mobileImageUrl || currentHero.mobileImageUrl === currentHero.desktopImageUrl) {
            handleFieldChange('mobileImageUrl', json.url);
          }
        } else {
          handleFieldChange('mobileImageUrl', json.url);
        }
      } else {
        alert(json.error || 'Upload failed');
      }
    } catch (err) {
      console.error(err);
      alert('Network error during file upload');
    } finally {
      setUploadingField(null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch(`/api/admin/page-heroes/${activePageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          desktopImageUrl: currentHero.desktopImageUrl,
          mobileImageUrl: currentHero.mobileImageUrl,
          heading: currentHero.heading,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      } else {
        alert(json.error || 'Failed to update hero background');
      }
    } catch (err) {
      console.error(err);
      alert('Network error while saving changes');
    } finally {
      setSaving(false);
    }
  };

  const handleCopyDesktopToMobile = () => {
    handleFieldChange('mobileImageUrl', currentHero.desktopImageUrl);
  };

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="border-b border-white/10 pb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-saffron mb-1">
            <Monitor className="h-4 w-4" />
            <span className="text-[11px] font-bold uppercase tracking-wider">Navigation Page Heroes</span>
          </div>
          <h2 className="font-playfair text-xl sm:text-2xl font-bold text-white">
            Page Hero Images &amp; Mobile Backgrounds
          </h2>
          <p className="mt-1 text-xs text-white/60">
            Upload and configure distinct desktop and mobile background hero images for all primary navigation sections.
          </p>
        </div>

        <a
          href={currentHero.route}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors self-start md:self-auto border border-white/15 cursor-pointer"
        >
          <span>View Live {currentHero.name} Page</span>
          <ExternalLink size={13} className="text-saffron" />
        </a>
      </div>

      {/* ── Page Selection Pills ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {pages.map((p) => {
          const Icon = p.icon;
          const isActive = activePageId === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setActivePageId(p.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-manrope text-xs font-bold whitespace-nowrap transition-all cursor-pointer shadow-sm ${
                isActive
                  ? 'bg-saffron text-midnight shadow-md scale-102 font-extrabold ring-2 ring-saffron/40'
                  : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10'
              }`}
            >
              <Icon size={14} className={isActive ? 'text-midnight' : 'text-saffron'} />
              <span>{p.name}</span>
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-16 text-white/50 gap-2 rounded-2xl border border-white/10 bg-[#0B1F2A]/60">
          <Loader2 className="h-5 w-5 animate-spin text-saffron" />
          <span className="text-xs">Loading hero settings...</span>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          
          {/* Main 2-Column Responsive Layout: Left Config Form, Right Live Previews */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* ── Left Configuration Column (7 cols) ── */}
            <div className="lg:col-span-7 space-y-5 rounded-2xl border border-white/10 bg-[#0B1F2A]/60 p-5 sm:p-6 backdrop-blur-md">
              
              <div className="border-b border-white/10 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-playfair text-lg font-bold text-white">
                    {currentHero.name} Hero Settings
                  </h3>
                  <p className="text-xs text-white/50">
                    Route: <code className="text-saffron">{currentHero.route}</code>
                  </p>
                </div>

                {saveSuccess && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold animate-fadeIn">
                    <CheckCircle2 size={14} />
                    <span>Saved! Live now.</span>
                  </div>
                )}
              </div>

              {/* 1. Desktop Image Input & Upload */}
              <div className="space-y-3 p-4 rounded-xl border border-white/10 bg-white/[0.02]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Monitor size={16} className="text-saffron" />
                    <label className="font-bold text-xs text-white">Desktop Background Image (16:9 / Landscape) *</label>
                  </div>
                  <span className="text-[10.5px] text-white/40">Shown on Laptops &amp; Tablets</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <input
                    ref={desktopInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'desktop')}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => desktopInputRef.current?.click()}
                    disabled={uploadingField === 'desktop'}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-all border border-white/15 cursor-pointer disabled:opacity-50 text-xs"
                  >
                    {uploadingField === 'desktop' ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-saffron" />
                        <span>Uploading Desktop...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 text-saffron" />
                        <span>Upload Desktop Image</span>
                      </>
                    )}
                  </button>

                  <span className="text-white/40 text-xs hidden sm:inline">or paste direct URL:</span>
                </div>

                <input
                  type="text"
                  required
                  value={currentHero.desktopImageUrl || ''}
                  onChange={(e) => handleFieldChange('desktopImageUrl', e.target.value)}
                  placeholder="https://.../dest_hero.jpg or /images/gallery/..."
                  className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-xs text-white focus:border-saffron focus:outline-none"
                />
              </div>

              {/* 2. Mobile Image Input & Upload */}
              <div className="space-y-3 p-4 rounded-xl border border-white/10 bg-white/[0.02]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone size={16} className="text-saffron" />
                    <label className="font-bold text-xs text-white">Mobile Background Image (Phones &amp; Narrow Screens) *</label>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyDesktopToMobile}
                    className="inline-flex items-center gap-1 text-[11px] text-saffron hover:underline cursor-pointer"
                  >
                    <Copy size={11} />
                    <span>Copy Desktop Image</span>
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <input
                    ref={mobileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'mobile')}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => mobileInputRef.current?.click()}
                    disabled={uploadingField === 'mobile'}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-all border border-white/15 cursor-pointer disabled:opacity-50 text-xs"
                  >
                    {uploadingField === 'mobile' ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-saffron" />
                        <span>Uploading Mobile...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 text-saffron" />
                        <span>Upload Mobile Image</span>
                      </>
                    )}
                  </button>

                  <span className="text-white/40 text-xs hidden sm:inline">or mobile URL:</span>
                </div>

                <input
                  type="text"
                  required
                  value={currentHero.mobileImageUrl || ''}
                  onChange={(e) => handleFieldChange('mobileImageUrl', e.target.value)}
                  placeholder="https://.../mobile_hero.jpg or same as desktop"
                  className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-xs text-white focus:border-saffron focus:outline-none"
                />

                <p className="text-[11px] text-white/50">
                  Tip: Uploading a portrait / 9:16 or centered photo prevents awkward cropping on smartphone screens.
                </p>
              </div>

              {/* 3. Heading Text (Optional) */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-white/80">Page Hero Headline</label>
                <input
                  type="text"
                  value={currentHero.heading || ''}
                  onChange={(e) => handleFieldChange('heading', e.target.value)}
                  placeholder="e.g. Explore Iconic Kashmir"
                  className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-xs text-white focus:border-saffron focus:outline-none"
                />
              </div>

              {/* Save Button */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <p className="text-[11px] text-white/40">
                  Updates take effect across consumer devices immediately.
                </p>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-saffron to-amber-600 text-midnight font-bold text-xs shadow-lg shadow-saffron/20 hover:brightness-110 active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  <span>Save {currentHero.name} Hero</span>
                </button>
              </div>

            </div>

            {/* ── Right Live Previews Column (5 cols) ── */}
            <div className="lg:col-span-5 space-y-5 rounded-2xl border border-white/10 bg-[#0B1F2A]/60 p-5 sm:p-6 backdrop-blur-md flex flex-col justify-between">
              
              <div>
                <h4 className="font-playfair text-base font-bold text-white mb-1">
                  Live Viewport Previews
                </h4>
                <p className="text-xs text-white/50 mb-4">
                  Visual representation of how your hero renders on Desktop vs. Mobile devices.
                </p>

                {/* Desktop Preview Frame */}
                <div className="space-y-1.5 mb-6">
                  <div className="flex items-center justify-between text-[11px] text-white/70 font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Monitor size={13} className="text-saffron" />
                      <span>Desktop View (16:9)</span>
                    </span>
                    <span className="text-white/40">100vw</span>
                  </div>

                  <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-white/20 bg-slate-900 shadow-md">
                    {currentHero.desktopImageUrl ? (
                      <Image
                        src={currentHero.desktopImageUrl}
                        alt="Desktop Preview"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-white/40">
                        No desktop image
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/15 to-transparent pointer-events-none" />
                    <div className="absolute bottom-3 left-3 pointer-events-none text-white">
                      <span className="text-[9.5px] font-bold text-saffron uppercase tracking-wider block">
                        {currentHero.name}
                      </span>
                      <p className="font-display text-sm font-bold truncate max-w-[200px] drop-shadow">
                        {currentHero.heading || currentHero.name}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mobile Preview Frame */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-white/70 font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Smartphone size={13} className="text-saffron" />
                      <span>Mobile Phone View</span>
                    </span>
                    <span className="text-white/40">iPhone / Android</span>
                  </div>

                  <div className="flex justify-center">
                    <div className="relative w-44 h-72 rounded-2xl overflow-hidden border-2 border-white/25 bg-slate-900 shadow-lg">
                      {currentHero.mobileImageUrl || currentHero.desktopImageUrl ? (
                        <Image
                          src={currentHero.mobileImageUrl || currentHero.desktopImageUrl}
                          alt="Mobile Preview"
                          fill
                          className="object-cover object-center"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-white/40">
                          No mobile image
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/30 pointer-events-none" />

                      {/* Mock Mobile UI */}
                      <div className="absolute top-2 inset-x-0 flex justify-center pointer-events-none">
                        <div className="w-12 h-1 bg-white/40 rounded-full" />
                      </div>

                      <div className="absolute bottom-4 left-3 right-3 pointer-events-none text-white">
                        <span className="text-[8.5px] font-bold text-saffron uppercase tracking-wider block">
                          {currentHero.name}
                        </span>
                        <p className="font-display text-xs font-bold leading-tight drop-shadow">
                          {currentHero.heading || currentHero.name}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preset Cloudinary Kashmir Heroes */}
              <div className="pt-4 border-t border-white/10">
                <span className="text-[11px] font-bold text-white/60 block mb-2">
                  Quick Kashmir Asset Presets
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      handleFieldChange(
                        'desktopImageUrl',
                        'https://res.cloudinary.com/wmwdypan/image/upload/f_auto,q_auto/v1789975327/dest_hero.jpg'
                      );
                      handleFieldChange(
                        'mobileImageUrl',
                        'https://res.cloudinary.com/wmwdypan/image/upload/f_auto,q_auto/v1789975327/dest_hero.jpg'
                      );
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[10.5px] font-semibold transition-colors cursor-pointer"
                  >
                    Use Dest Hero (Cloudinary)
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      handleFieldChange('desktopImageUrl', '/images/gallery/shikara-dal-lake.jpg');
                      handleFieldChange('mobileImageUrl', '/images/gallery/shikara-dal-lake.jpg');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[10.5px] font-semibold transition-colors cursor-pointer"
                  >
                    Use Dal Lake Shikara
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      handleFieldChange('desktopImageUrl', '/images/gallery/gulmarg-snow.jpg');
                      handleFieldChange('mobileImageUrl', '/images/gallery/gulmarg-snow.jpg');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[10.5px] font-semibold transition-colors cursor-pointer"
                  >
                    Use Gulmarg Snow
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      handleFieldChange('desktopImageUrl', '/images/gallery/pahalgam-valley.jpg');
                      handleFieldChange('mobileImageUrl', '/images/gallery/pahalgam-valley.jpg');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[10.5px] font-semibold transition-colors cursor-pointer"
                  >
                    Use Pahalgam Valley
                  </button>
                </div>
              </div>

            </div>

          </div>

        </form>
      )}
    </div>
  );
};
