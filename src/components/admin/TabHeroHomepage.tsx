'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Video,
  Layers,
  MousePointerClick,
  ShieldCheck,
  Plus,
  Trash2,
  Save,
  Loader2,
  CheckCircle2,
  Eye,
  ExternalLink,
  Film,
  Image as ImageIcon,
  RotateCcw,
  Users,
  Award,
  Star,
  Smartphone,
  MapPin,
  SlidersHorizontal,
} from 'lucide-react';
import type { HeroHomepageConfig, HeroSlide, HeroTrustPill } from '@/data/hero-defaults';
import { defaultHeroConfig } from '@/data/hero-defaults';

export const TabHeroHomepage: React.FC = () => {
  const [config, setConfig] = useState<HeroHomepageConfig>(defaultHeroConfig);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'content' | 'media' | 'slides' | 'trust'>('content');

  // Load hero config from API
  const loadConfig = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/hero');
      const data = await res.json();
      if (data.success && data.hero) {
        setConfig(data.hero);
      }
    } catch (err) {
      console.error('Failed to load hero configuration:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  // Save handler
  const handleSave = async (e?: React.FormEvent | React.MouseEvent, overrideConfig?: HeroHomepageConfig) => {
    if (e && 'preventDefault' in e) e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    setErrorMessage(null);

    const payload = overrideConfig || config;

    try {
      const res = await fetch('/api/admin/hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3500);
      } else {
        setErrorMessage(data.error || 'Failed to save hero configuration');
      }
    } catch (err) {
      setErrorMessage('Network error while saving');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleSetLayoutMode = async (mode: 'original' | 'dynamic') => {
    const updated: HeroHomepageConfig = { ...config, desktopLayoutMode: mode };
    setConfig(updated);
    await handleSave(undefined, updated);
  };

  // Slide helpers
  const handleAddSlide = () => {
    const newSlide: HeroSlide = {
      id: `slide-${Date.now()}`,
      title: `Kashmir Slide ${config.slides.length + 1}`,
      location: 'Shree Mata Vaishno Devi, Katra',
      videoSrc: config.videoUrl || defaultHeroConfig.videoUrl,
      poster: config.posterUrl || defaultHeroConfig.posterUrl,
      mobilePoster: config.mobilePosterUrl || '',
      mobileVideoSrc: config.mobileVideoUrl || '',
    };
    setConfig((prev) => ({
      ...prev,
      slides: [...prev.slides, newSlide],
    }));
  };

  const handleRemoveSlide = (idx: number) => {
    if (config.slides.length <= 1) {
      alert('You must have at least one hero slide.');
      return;
    }
    setConfig((prev) => ({
      ...prev,
      slides: prev.slides.filter((_, i) => i !== idx),
    }));
  };

  const handleUpdateSlide = (idx: number, field: keyof HeroSlide, val: string) => {
    setConfig((prev) => {
      const updated = [...prev.slides];
      updated[idx] = { ...updated[idx], [field]: val };
      return { ...prev, slides: updated };
    });
  };

  // Trust pill helpers
  const handleAddPill = () => {
    const newPill: HeroTrustPill = {
      id: `pill-${Date.now()}`,
      icon: 'users',
      value: '100%',
      label: 'Verified Stays',
    };
    setConfig((prev) => ({
      ...prev,
      trustPills: [...prev.trustPills, newPill],
    }));
  };

  const handleRemovePill = (idx: number) => {
    setConfig((prev) => ({
      ...prev,
      trustPills: prev.trustPills.filter((_, i) => i !== idx),
    }));
  };

  const handleUpdatePill = (idx: number, field: keyof HeroTrustPill, val: string) => {
    setConfig((prev) => {
      const updated = [...prev.trustPills];
      updated[idx] = { ...updated[idx], [field]: val };
      return { ...prev, trustPills: updated };
    });
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-white/60">
          <Loader2 className="h-7 w-7 animate-spin text-saffron" />
          <p className="text-xs uppercase tracking-wider">Loading Homepage Hero Settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-saffron/15 text-saffron border border-saffron/30">
              <Sparkles className="h-5 w-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Hero Homepage Manager
            </h1>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-white/60">
            Control the main video background, high-impact headline, call-to-action buttons, multi-slide carousel & trust bar.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 text-xs font-semibold transition-colors"
          >
            <Eye className="h-3.5 w-3.5 text-saffron" />
            <span>View Live Site</span>
            <ExternalLink className="h-3 w-3 opacity-60" />
          </a>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-saffron hover:bg-saffron/90 text-midnight text-xs font-bold shadow-lg shadow-saffron/20 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Success / Error Alerts */}
      {saveSuccess && (
        <div className="flex items-center gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-emerald-400 text-xs animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>Homepage Hero successfully updated! Changes are live on the website.</span>
        </div>
      )}

      {errorMessage && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3.5 text-red-400 text-xs">
          {errorMessage}
        </div>
      )}

      {/* LIVE MINIATURE PREVIEW */}
      <div className="rounded-xl border border-white/15 bg-[#0D242B] p-4 shadow-xl overflow-hidden">
        <div className="flex items-center justify-between mb-3 text-xs text-white/70 font-semibold border-b border-white/10 pb-2">
          <span className="flex items-center gap-1.5 text-saffron">
            <Eye className="h-3.5 w-3.5" />
            Live Preview (Exact Homepage Representation)
          </span>
          <span className="text-[11px] text-white/40">Auto-updates as you type</span>
        </div>

        {/* Mock Hero Frame */}
        <div className="relative rounded-lg overflow-hidden border border-white/15 aspect-video max-h-[320px] w-full flex flex-col justify-between bg-black">
          {/* Background Video or Poster */}
          <div className="absolute inset-0 z-0">
            {config.videoUrl ? (
              <video
                src={config.videoUrl}
                poster={config.posterUrl}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover opacity-75"
              />
            ) : (
              <div
                className="w-full h-full bg-cover bg-center opacity-75"
                style={{ backgroundImage: `url(${config.posterUrl})` }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          </div>

          {/* Hero Content Overlay */}
          <div className="relative z-10 p-4 sm:p-6 max-w-lg flex flex-col justify-center flex-grow">
            <h2 className="font-display text-lg sm:text-2xl font-bold text-[#C5A45E] leading-tight drop-shadow-md mb-2">
              {config.headline || 'RIWAAYAT-E-KASHMIR'}
            </h2>
            {config.subheadline && (
              <p 
                className="text-[#C5A45E] text-[11px] line-clamp-2 mb-3"
                style={{ fontFamily: "'Canva Sans', var(--font-manrope), 'Manrope', sans-serif" }}
              >
                {config.subheadline}
              </p>
            )}

            {/* Mock Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="px-3 py-1.5 rounded-full bg-[#C5A45E] text-midnight font-bold text-[10px] shadow"
              >
                {config.primaryCtaText || 'Get Free Quote'} &rarr;
              </button>
              <button
                type="button"
                className="px-3 py-1.5 rounded-full bg-white/10 text-white font-medium text-[10px] border border-white/20 backdrop-blur-md"
              >
                {config.secondaryCtaText || 'Explore Packages'} &rarr;
              </button>
            </div>
          </div>

          {/* Bottom Trust Action Bar Mock */}
          <div className="relative z-10 border-t border-white/15 bg-black/40 backdrop-blur-md py-1.5 px-3 flex items-center justify-center gap-2 overflow-x-auto">
            {config.trustPills.map((pill, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/10 border border-white/15 text-left shrink-0 text-[9px] text-white"
              >
                <span className="font-bold text-saffron">{pill.value}</span>
                <span className="text-white/70">{pill.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DESKTOP HERO SIZING MODE (DYNAMIC VS ORIGINAL) */}
      <div className="rounded-2xl border border-white/10 bg-[#0B1E24] p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-saffron flex items-center gap-1.5">
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Desktop Hero Sizing Mode
              </span>
              <span className="text-[10.5px] px-2 py-0.5 rounded-full bg-white/10 text-white/80 font-medium">
                Desktop Only
              </span>
            </div>
            <p className="text-xs text-white/70 max-w-xl leading-relaxed">
              Choose whether the desktop hero automatically expands to fit whatever size image is uploaded (Dynamic), or stays constrained to the original classic viewport height (Original).
            </p>
          </div>

          <div className="flex items-center gap-2 p-1 rounded-xl bg-black/40 border border-white/10 shrink-0">
            {/* Original Button */}
            <button
              type="button"
              onClick={() => handleSetLayoutMode('original')}
              disabled={saving}
              className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                config.desktopLayoutMode === 'original'
                  ? 'bg-saffron text-midnight shadow-md font-extrabold scale-102 ring-1 ring-saffron/50'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>📐 Original Fixed Height</span>
              {config.desktopLayoutMode === 'original' && <CheckCircle2 className="h-3.5 w-3.5" />}
            </button>

            {/* Dynamic Button */}
            <button
              type="button"
              onClick={() => handleSetLayoutMode('dynamic')}
              disabled={saving}
              className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                config.desktopLayoutMode !== 'original'
                  ? 'bg-saffron text-midnight shadow-md font-extrabold scale-102 ring-1 ring-saffron/50'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>✨ Dynamic Image Fit</span>
              {config.desktopLayoutMode !== 'original' && <CheckCircle2 className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>

        {/* Status helper text */}
        <div className="mt-3 pt-3 border-t border-white/8 flex items-center justify-between text-[11.5px] text-white/50">
          <span>
            Current mode: <strong className="text-white font-semibold">{config.desktopLayoutMode === 'original' ? 'Original Height (Max 575px)' : 'Dynamic Fit (Auto-adapts to image aspect ratio)'}</strong>
          </span>
          <span className="text-emerald-400/90 font-medium">Clicking either button auto-saves &amp; updates instantly</span>
        </div>
      </div>

      {/* SUB-TABS NAVIGATION */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveSubTab('content')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'content'
              ? 'bg-saffron text-midnight font-bold shadow-md'
              : 'text-white/70 hover:bg-white/5 hover:text-white'
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span>Headings & Call to Action</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('media')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'media'
              ? 'bg-saffron text-midnight font-bold shadow-md'
              : 'text-white/70 hover:bg-white/5 hover:text-white'
          }`}
        >
          <Video className="h-4 w-4" />
          <span>Video & Media Background</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('slides')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'slides'
              ? 'bg-saffron text-midnight font-bold shadow-md'
              : 'text-white/70 hover:bg-white/5 hover:text-white'
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>Carousel Slides ({config.slides.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('trust')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'trust'
              ? 'bg-saffron text-midnight font-bold shadow-md'
              : 'text-white/70 hover:bg-white/5 hover:text-white'
          }`}
        >
          <ShieldCheck className="h-4 w-4" />
          <span>Trust Action Bar ({config.trustPills.length})</span>
        </button>
      </div>

      {/* FORM SECTIONS */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* TAB 1: HEADINGS & CTAS */}
        {activeSubTab === 'content' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in">
            {/* Headline Card */}
            <div className="rounded-xl border border-white/10 bg-[#0B1E24] p-5 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-saffron" />
                Hero Headline & Narrative
              </h3>

              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">
                  Main Headline (Imperial Rich Gold text on Homepage)
                </label>
                <input
                  type="text"
                  value={config.headline}
                  onChange={(e) => setConfig({ ...config, headline: e.target.value })}
                  placeholder="e.g. Discover the Magic of Kashmir"
                  className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 focus:border-saffron focus:outline-none"
                />
                <p className="mt-1 text-[11px] text-white/40">
                  Renders in elegant Cormorant/Playfair typeface on the left side of the hero.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">
                  Sub-narrative (Optional)
                </label>
                <textarea
                  rows={3}
                  value={config.subheadline || ''}
                  onChange={(e) => setConfig({ ...config, subheadline: e.target.value })}
                  placeholder="e.g. Curated luxury houseboats, alpine ski resorts, and private chauffeured tours across paradise."
                  className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 focus:border-saffron focus:outline-none resize-none"
                />
              </div>
            </div>

            {/* CTAs Card */}
            <div className="rounded-xl border border-white/10 bg-[#0B1E24] p-5 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <MousePointerClick className="h-4 w-4 text-saffron" />
                Call to Action (CTA) Buttons
              </h3>

              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">
                  Primary Button Text (Gold Pill)
                </label>
                <input
                  type="text"
                  value={config.primaryCtaText}
                  onChange={(e) => setConfig({ ...config, primaryCtaText: e.target.value })}
                  placeholder="e.g. Get Free Quote"
                  className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 focus:border-saffron focus:outline-none"
                />
                <p className="mt-1 text-[11px] text-white/40">
                  Triggers the instant Kashmir Quote / Enquiry Modal with high conversion rate.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">
                  Secondary Button Text (Glassmorphic Pill)
                </label>
                <input
                  type="text"
                  value={config.secondaryCtaText}
                  onChange={(e) => setConfig({ ...config, secondaryCtaText: e.target.value })}
                  placeholder="e.g. Explore Packages"
                  className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 focus:border-saffron focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">
                  Secondary Button Link
                </label>
                <input
                  type="text"
                  value={config.secondaryCtaLink}
                  onChange={(e) => setConfig({ ...config, secondaryCtaLink: e.target.value })}
                  placeholder="e.g. /packages"
                  className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 focus:border-saffron focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MEDIA & VIDEO BACKGROUND */}
        {activeSubTab === 'media' && (
          <div className="rounded-xl border border-white/10 bg-[#0B1E24] p-5 space-y-5 animate-in fade-in">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Video className="h-4 w-4 text-saffron" />
              Main Desktop Video Background & Poster
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1 flex items-center gap-1.5">
                  <Film className="h-3.5 w-3.5 text-saffron" />
                  Primary Video URL (MP4 / WebM / Cloudinary)
                </label>
                <input
                  type="url"
                  value={config.videoUrl}
                  onChange={(e) => setConfig({ ...config, videoUrl: e.target.value })}
                  placeholder="https://res.cloudinary.com/.../video.mp4"
                  className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs font-mono text-white placeholder-white/30 focus:border-saffron focus:outline-none"
                />
                <p className="mt-1 text-[11px] text-white/40">
                  Recommended: Cloudinary optimized 1080p MP4 or WebM video with audio disabled.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70 mb-1 flex items-center gap-1.5">
                  <ImageIcon className="h-3.5 w-3.5 text-saffron" />
                  Fallback Poster Image URL
                </label>
                <input
                  type="text"
                  value={config.posterUrl}
                  onChange={(e) => setConfig({ ...config, posterUrl: e.target.value })}
                  placeholder="https://res.cloudinary.com/.../poster.jpg"
                  className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs font-mono text-white placeholder-white/30 focus:border-saffron focus:outline-none"
                />
                <p className="mt-1 text-[11px] text-white/40">
                  Shown instantly before video streams and on low-power / battery-saver modes.
                </p>
              </div>
            </div>

            {/* Mobile-Specific Media Inputs */}
            <div className="pt-4 border-t border-white/10">
              <h4 className="text-xs font-bold text-saffron flex items-center gap-1.5 mb-3">
                <Smartphone className="h-3.5 w-3.5" />
                Mobile Device Media (Strict Vertical / Portrait 9:16 or 3:4 Optimization)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1 flex items-center gap-1.5">
                    <ImageIcon className="h-3.5 w-3.5 text-saffron" />
                    Mobile Poster / Image URL (Recommended for Phones)
                  </label>
                  <input
                    type="text"
                    value={config.mobilePosterUrl || ''}
                    onChange={(e) => setConfig({ ...config, mobilePosterUrl: e.target.value })}
                    placeholder="https://res.cloudinary.com/.../mobile_poster.jpg"
                    className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs font-mono text-white placeholder-white/30 focus:border-saffron focus:outline-none"
                  />
                  <p className="mt-1 text-[11px] text-white/40">
                    Will be served strictly to mobile viewports (&lt; 768px). Falls back to desktop poster if blank.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1 flex items-center gap-1.5">
                    <Film className="h-3.5 w-3.5 text-saffron" />
                    Mobile Video URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={config.mobileVideoUrl || ''}
                    onChange={(e) => setConfig({ ...config, mobileVideoUrl: e.target.value })}
                    placeholder="https://res.cloudinary.com/.../mobile_video.mp4"
                    className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs font-mono text-white placeholder-white/30 focus:border-saffron focus:outline-none"
                  />
                  <p className="mt-1 text-[11px] text-white/40">
                    Optional vertical 9:16 clip. If empty, mobile plays the primary video or displays the poster.
                  </p>
                </div>
              </div>
            </div>

            {/* Presets */}
            <div className="pt-3 border-t border-white/10">
              <label className="block text-xs font-semibold text-white/80 mb-2">
                Quick Kashmir Presets:
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setConfig({
                      ...config,
                      videoUrl:
                        'https://res.cloudinary.com/dcmoseix9/video/upload/f_auto,q_auto,ac_none/v1789371598/final_hero_desktop_ebblmr.mp4',
                      posterUrl:
                        'https://res.cloudinary.com/dcmoseix9/video/upload/so_0,f_auto,q_auto/v1789371598/final_hero_desktop_ebblmr.jpg',
                    })
                  }
                  className="px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 border border-white/15 text-xs text-white/90 hover:text-white transition-colors"
                >
                  🏔️ Dal Lake & Gondola Aerial (Default)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CAROUSEL SLIDES */}
        {activeSubTab === 'slides' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Layers className="h-4 w-4 text-saffron" />
                  Hero Carousel Slides ({config.slides.length})
                </h3>
                <p className="text-xs text-white/60">
                  Manage the background slides cycled by the hero slide indicator.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddSlide}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-saffron/20 hover:bg-saffron/30 text-saffron border border-saffron/30 text-xs font-bold transition-all active:scale-95 cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>+ Add Slide</span>
              </button>
            </div>

            <div className="space-y-3">
              {config.slides.map((slide, idx) => (
                <div
                  key={slide.id || idx}
                  className="rounded-xl border border-white/10 bg-[#0B1E24] p-4 space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-xs font-bold text-saffron flex items-center gap-1.5">
                      <Film className="h-3.5 w-3.5" />
                      Slide #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSlide(idx)}
                      disabled={config.slides.length <= 1}
                      className="text-white/40 hover:text-red-400 transition-colors p-1 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Delete Slide"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-white/70 mb-1">
                        Slide Title
                      </label>
                      <input
                        type="text"
                        value={slide.title}
                        onChange={(e) => handleUpdateSlide(idx, 'title', e.target.value)}
                        placeholder="e.g. Dal Lake Houseboats"
                        className="w-full rounded-md border border-white/15 bg-white/5 px-2.5 py-1.5 text-xs text-white placeholder-white/30 focus:border-saffron focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-white/70 mb-1">
                        Desktop Video URL
                      </label>
                      <input
                        type="url"
                        value={slide.videoSrc}
                        onChange={(e) => handleUpdateSlide(idx, 'videoSrc', e.target.value)}
                        placeholder="https://..."
                        className="w-full rounded-md border border-white/15 bg-white/5 px-2.5 py-1.5 text-xs font-mono text-white placeholder-white/30 focus:border-saffron focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-white/70 mb-1">
                        Desktop Poster Image URL
                      </label>
                      <input
                        type="text"
                        value={slide.poster}
                        onChange={(e) => handleUpdateSlide(idx, 'poster', e.target.value)}
                        placeholder="https://..."
                        className="w-full rounded-md border border-white/15 bg-white/5 px-2.5 py-1.5 text-xs font-mono text-white placeholder-white/30 focus:border-saffron focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-saffron/90 mb-1 flex items-center gap-1">
                        <Smartphone className="h-3 w-3" />
                        Mobile Poster / Image (Optional)
                      </label>
                      <input
                        type="text"
                        value={slide.mobilePoster || ''}
                        onChange={(e) => handleUpdateSlide(idx, 'mobilePoster', e.target.value)}
                        placeholder="https://... (Portrait / 9:16)"
                        className="w-full rounded-md border border-white/15 bg-white/5 px-2.5 py-1.5 text-xs font-mono text-white placeholder-white/30 focus:border-saffron focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-saffron/90 mb-1 flex items-center gap-1">
                        <Smartphone className="h-3 w-3" />
                        Mobile Video URL (Optional)
                      </label>
                      <input
                        type="url"
                        value={slide.mobileVideoSrc || ''}
                        onChange={(e) => handleUpdateSlide(idx, 'mobileVideoSrc', e.target.value)}
                        placeholder="https://... (Portrait 9:16)"
                        className="w-full rounded-md border border-white/15 bg-white/5 px-2.5 py-1.5 text-xs font-mono text-white placeholder-white/30 focus:border-saffron focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#C5A45E] mb-1 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        Location Tag (Right Bottom on Hero with 📍 Icon)
                      </label>
                      <input
                        type="text"
                        value={slide.location || ''}
                        onChange={(e) => handleUpdateSlide(idx, 'location', e.target.value)}
                        placeholder="e.g. Shree Mata Vaishno Devi, Katra"
                        className="w-full rounded-md border border-[#C5A45E]/40 bg-white/5 px-2.5 py-1.5 text-xs text-white placeholder-white/30 focus:border-saffron focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CHOOSE YOUR CAROUSEL TRANSITION */}
            <div className="rounded-xl border border-white/10 bg-[#0B1E24] p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-saffron" />
                    Choose Your Carousel Transition Effect
                  </h4>
                  <p className="text-xs text-white/60">
                    Select how background slides dissolve or animate when automatically switching.
                  </p>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-saffron/15 text-saffron border border-saffron/30">
                  {config.transitionType === 'ken-burns' ? 'Ken Burns Zoom' : config.transitionType === 'slide' ? 'Horizontal Slide' : config.transitionType === 'blur-fade' ? 'Atmospheric Blur' : 'Cinematic Crossfade'} Active
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* 1. Cinematic Crossfade */}
                <button
                  type="button"
                  onClick={() => setConfig({ ...config, transitionType: 'fade' })}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                    (config.transitionType || 'fade') === 'fade'
                      ? 'border-saffron bg-saffron/10 ring-1 ring-saffron/50'
                      : 'border-white/10 bg-white/5 hover:border-white/25 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base">✨</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-saffron bg-saffron/20 px-2 py-0.5 rounded">
                      Recommended
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white mb-0.5">Cinematic Crossfade</p>
                    <p className="text-[11px] text-white/60 leading-relaxed">
                      Silky-smooth 1.2s dissolve between scenes. Royal, flicker-free, and elegant.
                    </p>
                  </div>
                </button>

                {/* 2. Ken Burns */}
                <button
                  type="button"
                  onClick={() => setConfig({ ...config, transitionType: 'ken-burns' })}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                    config.transitionType === 'ken-burns'
                      ? 'border-saffron bg-saffron/10 ring-1 ring-saffron/50'
                      : 'border-white/10 bg-white/5 hover:border-white/25 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base">🎥</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-400/20 px-2 py-0.5 rounded">
                      Cinematic
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white mb-0.5">Ken Burns Motion</p>
                    <p className="text-[11px] text-white/60 leading-relaxed">
                      Slow gentle zoom (100% to 105%) with crossfade. Adds life to panoramic shots.
                    </p>
                  </div>
                </button>

                {/* 3. Horizontal Slide */}
                <button
                  type="button"
                  onClick={() => setConfig({ ...config, transitionType: 'slide' })}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                    config.transitionType === 'slide'
                      ? 'border-saffron bg-saffron/10 ring-1 ring-saffron/50'
                      : 'border-white/10 bg-white/5 hover:border-white/25 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base">↔️</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 bg-sky-400/20 px-2 py-0.5 rounded">
                      Dynamic
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white mb-0.5">Horizontal Slide</p>
                    <p className="text-[11px] text-white/60 leading-relaxed">
                      Classic horizontal sliding track from right to left across the screen.
                    </p>
                  </div>
                </button>

                {/* 4. Dreamy Blur Dissolve */}
                <button
                  type="button"
                  onClick={() => setConfig({ ...config, transitionType: 'blur-fade' })}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                    config.transitionType === 'blur-fade'
                      ? 'border-saffron bg-saffron/10 ring-1 ring-saffron/50'
                      : 'border-white/10 bg-white/5 hover:border-white/25 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base">🌫️</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/20 px-2 py-0.5 rounded">
                      Atmospheric
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white mb-0.5">Atmospheric Blur</p>
                    <p className="text-[11px] text-white/60 leading-relaxed">
                      Dreamlike soft blur dissolve, ideal for serene mountain valleys and morning mist.
                    </p>
                  </div>
                </button>
              </div>

              {/* Slide Duration Timing */}
              <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-xs font-medium text-white/80">
                  Slide Rotation Interval (How long each slide stays visible):
                </span>
                <div className="flex items-center gap-2">
                  {[3500, 5500, 7500, 10000].map((ms) => (
                    <button
                      key={ms}
                      type="button"
                      onClick={() => setConfig({ ...config, transitionDuration: ms })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        (config.transitionDuration || 5500) === ms
                          ? 'bg-saffron text-midnight font-bold shadow'
                          : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {ms / 1000}s
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: TRUST ACTION BAR */}
        {activeSubTab === 'trust' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-saffron" />
                  Hero Bottom Trust Action Bar ({config.trustPills.length})
                </h3>
                <p className="text-xs text-white/60">
                  Docked glassmorphic trust badges at the exact bottom edge of the Hero banner.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddPill}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-saffron/20 hover:bg-saffron/30 text-saffron border border-saffron/30 text-xs font-bold transition-all active:scale-95 cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>+ Add Trust Pill</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {config.trustPills.map((pill, idx) => (
                <div
                  key={pill.id || idx}
                  className="rounded-xl border border-white/10 bg-[#0B1E24] p-4 space-y-3 relative"
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-xs font-bold text-saffron">Pill #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleRemovePill(idx)}
                      className="text-white/40 hover:text-red-400 transition-colors p-1"
                      title="Delete Pill"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-white/70 mb-1">
                      Highlight Value (e.g. 600+, ★ 4.9, 15+ Years)
                    </label>
                    <input
                      type="text"
                      value={pill.value}
                      onChange={(e) => handleUpdatePill(idx, 'value', e.target.value)}
                      placeholder="e.g. 600+"
                      className="w-full rounded-md border border-white/15 bg-white/5 px-2.5 py-1.5 text-xs text-white placeholder-white/30 focus:border-saffron focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-white/70 mb-1">
                      Label / Subtext (e.g. Happy Families, Google Reviews)
                    </label>
                    <input
                      type="text"
                      value={pill.label}
                      onChange={(e) => handleUpdatePill(idx, 'label', e.target.value)}
                      placeholder="e.g. Happy Families"
                      className="w-full rounded-md border border-white/15 bg-white/5 px-2.5 py-1.5 text-xs text-white placeholder-white/30 focus:border-saffron focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BOTTOM STICKY SAVE BAR */}
        <div className="sticky bottom-4 z-20 flex items-center justify-between rounded-xl border border-white/15 bg-[#091F26]/90 p-4 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={loadConfig}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 text-xs font-semibold transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Discard Changes</span>
            </button>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-saffron hover:bg-saffron/90 text-midnight text-xs font-extrabold shadow-lg shadow-saffron/20 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            <span>{saving ? 'Saving Live Hero...' : 'Publish Hero Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
