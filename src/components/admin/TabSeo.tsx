'use client';

import React, { useState, useEffect } from 'react';
import {
  Globe,
  FileCode,
  CheckCircle2,
  ExternalLink,
  Save,
  Loader2,
  Sparkles,
  Share2,
  Search,
  Copy,
  Check,
  Code2,
  Smartphone,
  Monitor,
  Layers,
  FileText,
  Zap,
} from 'lucide-react';

interface SeoData {
  settings: {
    siteTitle: string;
    siteDesc: string;
    robotsTxtCustom?: string | null;
  };
  sitemap: {
    totalIndexedPackages: number;
    totalExcludedPackages: number;
    sitemapUrl: string;
    robotsUrl: string;
    lastUpdated: string;
  };
}

type TemplateType = 'package' | 'destination' | 'blog' | 'activity' | 'general';

interface SeoTemplatePreset {
  id: string;
  type: TemplateType;
  label: string;
  title: string;
  keyword: string;
  location: string;
  duration?: string;
  price?: string;
  targetAudience: string;
  features: string[];
}

const SEO_PRESETS: SeoTemplatePreset[] = [
  {
    id: 'preset-kashmir-classic',
    type: 'package',
    label: 'Kashmir Classic Odyssey (6D/5N)',
    title: 'Kashmir Classic Odyssey Tour Package',
    keyword: 'Kashmir 6 days tour package',
    location: 'Srinagar, Gulmarg, Pahalgam',
    duration: '6 Days / 5 Nights',
    price: '₹18,500',
    targetAudience: 'Families & Couples',
    features: ['Luxury Houseboat Stay', 'Private Sedan/Innova', 'Shikara Sunset Cruise', 'Daily Breakfast & Dinner'],
  },
  {
    id: 'preset-gulmarg-ski',
    type: 'package',
    label: 'Gulmarg Powder Snow & Ski (5D/4N)',
    title: 'Gulmarg Winter Snow & Skiing Tour Package',
    keyword: 'Gulmarg skiing tour package',
    location: 'Gulmarg & Srinagar',
    duration: '5 Days / 4 Nights',
    price: '₹24,500',
    targetAudience: 'Snow Lovers & Skiers',
    features: ['Gondola Phase 1 & 2 Access', 'Centrally Heated Resort', 'Ski Equipment Rental', 'Trained Snow Driver'],
  },
  {
    id: 'preset-destination-gulmarg',
    type: 'destination',
    label: 'Gulmarg Destination Travel Guide',
    title: 'Gulmarg Kashmir Travel Guide & Attractions',
    keyword: 'Gulmarg travel guide 2026',
    location: 'Gulmarg, Baramulla',
    targetAudience: 'All Travelers',
    features: ['Apharwat Peak 13,780 ft', 'Highest 18-Hole Golf Course', 'Kongdoori Valley Snowmobiling'],
  },
  {
    id: 'preset-blog-gondola',
    type: 'blog',
    label: 'Blog: Gulmarg Gondola Booking Guide',
    title: 'Gulmarg Gondola Phase 1 & 2 Ticket Booking: Complete Guide & Rules',
    keyword: 'Gulmarg Gondola online booking',
    location: 'Gulmarg, J&K',
    targetAudience: 'Travelers booking online cable car',
    features: ['Official OTP Booking', 'Phase 1 vs Phase 2', 'Weather Cancellation Refund Policy'],
  },
];

export const TabSeo: React.FC = () => {
  const [data, setData] = useState<SeoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Global Settings Form state
  const [siteTitle, setSiteTitle] = useState('');
  const [siteDesc, setSiteDesc] = useState('');

  // SEO Template Generator State
  const [templateType, setTemplateType] = useState<TemplateType>('package');
  const [genTitle, setGenTitle] = useState('Kashmir Classic Odyssey Tour Package');
  const [genKeyword, setGenKeyword] = useState('Kashmir 6 days tour package');
  const [genLocation, setGenLocation] = useState('Srinagar, Gulmarg & Pahalgam');
  const [genDuration, setGenDuration] = useState('6 Days / 5 Nights');
  const [genPrice, setGenPrice] = useState('₹18,500');
  const [genAudience, setGenAudience] = useState('Families & Couples');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  // Copy indicator state
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const loadSeoData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/seo');
      const json = await res.json();
      if (json.success) {
        setData(json);
        setSiteTitle(json.settings.siteTitle || '');
        setSiteDesc(json.settings.siteDesc || '');
      }
    } catch (err) {
      console.error('Error fetching SEO data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSeoData();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch('/api/admin/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteTitle: siteTitle.trim(),
          siteDesc: siteDesc.trim(),
        }),
      });
      const json = await res.json();
      if (json.success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Error updating SEO settings:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleApplyPreset = (preset: SeoTemplatePreset) => {
    setTemplateType(preset.type);
    setGenTitle(preset.title);
    setGenKeyword(preset.keyword);
    setGenLocation(preset.location);
    if (preset.duration) setGenDuration(preset.duration);
    if (preset.price) setGenPrice(preset.price);
    setGenAudience(preset.targetAudience);
  };

  // Google SEO Computed Strings
  const computedSlug = genTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  const computedUrl =
    templateType === 'package'
      ? `https://theindianwings.com/packages/${computedSlug}`
      : templateType === 'destination'
      ? `https://theindianwings.com/destinations/${computedSlug}`
      : templateType === 'blog'
      ? `https://theindianwings.com/blog/${computedSlug}`
      : `https://theindianwings.com/${computedSlug}`;

  // Google Meta Title (Target: 50-60 characters)
  const computedMetaTitle =
    templateType === 'package'
      ? `${genTitle} (${genDuration}) | The Indian Wings Company`
      : templateType === 'destination'
      ? `${genTitle} 2026: Attractions & Itineraries | The Indian Wings`
      : templateType === 'blog'
      ? `${genTitle} | Kashmir Travel Blog`
      : `${genTitle} | The Indian Wings Company`;

  // Google Meta Description (Target: 150-160 characters)
  const computedMetaDesc =
    templateType === 'package'
      ? `Book ${genTitle} for ${genDuration} starting at ${genPrice}/person. Includes verified heated stays in ${genLocation}, private cab & 24/7 ground assistance.`
      : templateType === 'destination'
      ? `Explore ${genTitle} in Kashmir. Complete travel guide covering weather, gondola snow spots in ${genLocation}, hotel recommendations & customized trips.`
      : templateType === 'blog'
      ? `Expert guide to ${genTitle}. Verified local tips for ${genLocation}, booking procedures, packing advice, and high-altitude safety by local specialists.`
      : `Handcrafted Kashmir travel experiences in ${genLocation}. Verified stays, private chauffeur transport, and 24/7 local assistance.`;

  // Google Schema.org JSON-LD
  const computedJsonLd =
    templateType === 'package'
      ? {
          '@context': 'https://schema.org',
          '@type': 'TouristTrip',
          name: genTitle,
          description: computedMetaDesc,
          touristType: genAudience,
          offers: {
            '@type': 'Offer',
            price: genPrice.replace(/[^0-9]/g, '') || '18500',
            priceCurrency: 'INR',
            availability: 'https://schema.org/InStock',
            url: computedUrl,
          },
          provider: {
            '@type': 'TravelAgency',
            name: 'The Indian Wings Company',
            url: 'https://theindianwings.com',
          },
        }
      : templateType === 'blog'
      ? {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: genTitle,
          description: computedMetaDesc,
          mainEntityOfPage: computedUrl,
          author: {
            '@type': 'Person',
            name: 'Mrs. Komal & Local Team',
          },
          publisher: {
            '@type': 'Organization',
            name: 'The Indian Wings Company',
            url: 'https://theindianwings.com',
          },
        }
      : {
          '@context': 'https://schema.org',
          '@type': 'TouristDestination',
          name: genTitle,
          description: computedMetaDesc,
          touristType: genAudience,
        };

  const computedHtmlMeta = `<!-- Google Search & OpenGraph Tags -->
<title>${computedMetaTitle}</title>
<meta name="description" content="${computedMetaDesc}" />
<link rel="canonical" href="${computedUrl}" />
<meta name="robots" content="index, follow, max-image-preview:large" />

<!-- OpenGraph / Social Sharing -->
<meta property="og:type" content="${templateType === 'blog' ? 'article' : 'website'}" />
<meta property="og:title" content="${computedMetaTitle}" />
<meta property="og:description" content="${computedMetaDesc}" />
<meta property="og:url" content="${computedUrl}" />
<meta property="og:site_name" content="The Indian Wings Company" />
<meta property="og:image" content="https://theindianwings.com/images/gallery/shikara-dal-lake.jpg" />

<!-- JSON-LD Structured Data Schema -->
<script type="application/ld+json">
${JSON.stringify(computedJsonLd, null, 2)}
</script>`;

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2500);
    } catch (err) {
      console.error('Clipboard copy failed:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-white/60">
          <Loader2 className="h-7 w-7 animate-spin text-[#d98f5b]" />
          <p className="text-xs uppercase tracking-wider">Loading Google Search Central Hub...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* ── 1. Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#d98f5b]/15 text-[#d98f5b] border border-[#d98f5b]/30">
              <Globe className="h-5 w-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Google SEO Hub & Live Search Generator
            </h1>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-white/60">
            Control Google Search Console compliance, dynamic sitemap indexing, and generate 1-click Google-ready snippets & JSON-LD schema.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/sitemap.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/80 transition-all hover:bg-white/10 hover:text-white"
          >
            <FileCode className="h-3.5 w-3.5 text-saffron" />
            <span>Live /sitemap.xml</span>
            <ExternalLink className="h-3 w-3 opacity-60" />
          </a>
        </div>
      </div>

      {/* ── 2. Dynamic Sitemap & Indexing Telemetry ── */}
      <div className="rounded-2xl border border-white/10 bg-[#0B1E2A]/60 p-6 backdrop-blur-md shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <Zap className="h-4 w-4 text-saffron" />
            <h3 className="font-playfair text-base font-bold">Dynamic XML Sitemap & Crawl Health</h3>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            100% Dynamic PostgreSQL Linked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="rounded-xl bg-white/[0.02] border border-white/5 p-4">
            <span className="text-[11px] text-white/40 block">Total Active Indexed Packages</span>
            <span className="text-2xl font-bold font-mono text-emerald-400 mt-1 block">
              {data?.sitemap.totalIndexedPackages || 0}
            </span>
            <span className="text-[10px] text-white/30">Crawlable with Priority 0.9 in /sitemap.xml</span>
          </div>

          <div className="rounded-xl bg-white/[0.02] border border-white/5 p-4">
            <span className="text-[11px] text-white/40 block">Excluded / Draft Packages</span>
            <span className="text-2xl font-bold font-mono text-amber-400 mt-1 block">
              {data?.sitemap.totalExcludedPackages || 0}
            </span>
            <span className="text-[10px] text-white/30">Blocked via NoIndex rule</span>
          </div>

          <div className="rounded-xl bg-white/[0.02] border border-white/5 p-4">
            <span className="text-[11px] text-white/40 block">Google Search Console Ping</span>
            <span className="text-xs font-bold text-white mt-1 block">Ready for Submission</span>
            <a
              href="https://search.google.com/search-console"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-[#d98f5b] hover:underline inline-flex items-center gap-1 mt-1"
            >
              <span>Open Search Console</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>

      {/* ── 3. GOOGLE SEARCH SNIPPET & SEO TEMPLATE GENERATOR ── */}
      <div className="rounded-2xl border border-saffron/30 bg-[#0A2228] p-6 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-saffron/20 text-saffron">
                <Sparkles className="h-4 w-4" />
              </span>
              <h2 className="font-playfair text-lg font-bold text-white">
                Google SEO Snippet & Schema Template Tool
              </h2>
            </div>
            <p className="text-xs text-white/60 mt-1">
              Generate Google Search Central compliant Titles, High-CTR Descriptions, and JSON-LD Rich Snippets. Copy with 1 click to manually publish or verify.
            </p>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-white/40 mr-1">Presets:</span>
            {SEO_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleApplyPreset(p)}
                className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/15 border border-white/10 text-[11px] text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Live Google Search Result Simulator */}
        <div className="rounded-xl border border-white/10 bg-[#061519] p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-saffron flex items-center gap-1.5">
              <Search className="h-3.5 w-3.5" />
              Live Google SERP Preview (Google Search Result Simulation)
            </span>
            <div className="flex items-center gap-1 bg-white/5 rounded-lg p-0.5 border border-white/10 text-[10px]">
              <button
                type="button"
                onClick={() => setPreviewDevice('desktop')}
                className={`px-2 py-1 rounded flex items-center gap-1 cursor-pointer ${
                  previewDevice === 'desktop' ? 'bg-saffron text-midnight font-bold' : 'text-white/60'
                }`}
              >
                <Monitor size={11} />
                <span>Desktop</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice('mobile')}
                className={`px-2 py-1 rounded flex items-center gap-1 cursor-pointer ${
                  previewDevice === 'mobile' ? 'bg-saffron text-midnight font-bold' : 'text-white/60'
                }`}
              >
                <Smartphone size={11} />
                <span>Mobile</span>
              </button>
            </div>
          </div>

          {/* Google Search Card Render */}
          <div
            className={`rounded-xl border border-white/10 bg-white p-4 font-sans text-left transition-all ${
              previewDevice === 'mobile' ? 'max-w-sm mx-auto' : 'w-full'
            }`}
          >
            {/* Google Breadcrumb URL */}
            <div className="flex items-center gap-1.5 text-[11px] text-[#202124] mb-1">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-100 text-[9px] font-bold text-midnight">
                W
              </span>
              <span className="font-medium text-[#202124]">theindianwings.com</span>
              <span className="text-slate-400">›</span>
              <span className="text-slate-500 truncate">{templateType === 'package' ? 'packages' : templateType}</span>
            </div>

            {/* Google Clickable Blue Title */}
            <h3 className="text-[#1a0dab] text-base sm:text-lg font-medium hover:underline cursor-pointer leading-snug line-clamp-1">
              {computedMetaTitle}
            </h3>

            {/* Google Rich Review Snippet */}
            <div className="flex items-center gap-1.5 text-[11px] text-[#70757a] mt-1">
              <span className="text-amber-500 font-bold">★ 4.9</span>
              <span>(120)</span>
              <span>•</span>
              <span className="text-emerald-700 font-semibold">{genPrice}</span>
              <span>•</span>
              <span>Verified Stays</span>
            </div>

            {/* Google Meta Description */}
            <p className="text-[12.5px] text-[#4d5156] mt-1.5 leading-relaxed line-clamp-2">
              {computedMetaDesc}
            </p>
          </div>
        </div>

        {/* Inputs & Character Meters */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Column 1: Core Inputs */}
          <div className="rounded-xl border border-white/10 bg-[#0B1E24] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">1. Content & Type</h3>
              <div className="flex items-center gap-1">
                {(['package', 'destination', 'blog', 'activity'] as TemplateType[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTemplateType(t)}
                    className={`px-2 py-1 rounded text-[10px] font-bold capitalize transition-colors cursor-pointer ${
                      templateType === t ? 'bg-saffron text-midnight' : 'bg-white/5 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-white/70 mb-1">
                Content / Package Title
              </label>
              <input
                type="text"
                value={genTitle}
                onChange={(e) => setGenTitle(e.target.value)}
                className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs text-white focus:border-saffron focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">
                  Focus Keyword (LSI)
                </label>
                <input
                  type="text"
                  value={genKeyword}
                  onChange={(e) => setGenKeyword(e.target.value)}
                  className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs text-white focus:border-saffron focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">
                  Target Locations
                </label>
                <input
                  type="text"
                  value={genLocation}
                  onChange={(e) => setGenLocation(e.target.value)}
                  className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs text-white focus:border-saffron focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">Duration</label>
                <input
                  type="text"
                  value={genDuration}
                  onChange={(e) => setGenDuration(e.target.value)}
                  className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs text-white focus:border-saffron focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">Price (₹)</label>
                <input
                  type="text"
                  value={genPrice}
                  onChange={(e) => setGenPrice(e.target.value)}
                  className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs text-white focus:border-saffron focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">Audience</label>
                <input
                  type="text"
                  value={genAudience}
                  onChange={(e) => setGenAudience(e.target.value)}
                  className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs text-white focus:border-saffron focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Column 2: Generated SEO Tags with Meters */}
          <div className="rounded-xl border border-white/10 bg-[#0B1E24] p-5 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              2. Google SEO Ready Copy
            </h3>

            {/* Meta Title with Character Meter */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-white/70">Google Meta Title</span>
                <span
                  className={`text-[10.5px] font-mono font-bold ${
                    computedMetaTitle.length <= 60 ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {computedMetaTitle.length} / 60 chars (Google Recommended)
                </span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  value={computedMetaTitle}
                  className="w-full rounded-lg border border-white/15 bg-black/40 pr-20 px-3 py-2 text-xs text-white font-mono"
                />
                <button
                  type="button"
                  onClick={() => copyToClipboard(computedMetaTitle, 'title')}
                  className="absolute right-1.5 top-1.5 px-2.5 py-1 rounded bg-saffron text-midnight font-bold text-[10px] flex items-center gap-1 cursor-pointer hover:bg-saffron/90"
                >
                  {copiedKey === 'title' ? <Check size={11} /> : <Copy size={11} />}
                  <span>{copiedKey === 'title' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Meta Description with Character Meter */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-white/70">High-CTR Meta Description</span>
                <span
                  className={`text-[10.5px] font-mono font-bold ${
                    computedMetaDesc.length <= 160 ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {computedMetaDesc.length} / 160 chars (Google Recommended)
                </span>
              </div>
              <div className="relative">
                <textarea
                  rows={3}
                  readOnly
                  value={computedMetaDesc}
                  className="w-full rounded-lg border border-white/15 bg-black/40 pr-20 px-3 py-2 text-xs text-white font-mono resize-none leading-relaxed"
                />
                <button
                  type="button"
                  onClick={() => copyToClipboard(computedMetaDesc, 'desc')}
                  className="absolute right-2 top-2 px-2.5 py-1 rounded bg-saffron text-midnight font-bold text-[10px] flex items-center gap-1 cursor-pointer hover:bg-saffron/90"
                >
                  {copiedKey === 'desc' ? <Check size={11} /> : <Copy size={11} />}
                  <span>{copiedKey === 'desc' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Action Bar with Schema Copy & HTML Block Copy */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => copyToClipboard(JSON.stringify(computedJsonLd, null, 2), 'schema')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer"
              >
                {copiedKey === 'schema' ? <Check size={13} className="text-emerald-400" /> : <Code2 size={13} className="text-saffron" />}
                <span>{copiedKey === 'schema' ? 'Schema Copied!' : 'Copy JSON-LD Schema'}</span>
              </button>

              <button
                type="button"
                onClick={() => copyToClipboard(computedHtmlMeta, 'full')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-saffron hover:bg-saffron/90 text-midnight text-xs font-extrabold shadow transition-all cursor-pointer"
              >
                {copiedKey === 'full' ? <Check size={13} /> : <Copy size={13} />}
                <span>{copiedKey === 'full' ? 'Full HTML Copied!' : 'Copy Full HTML Meta Block'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── 4. Global Site SEO Defaults (Canonical & Robots) ── */}
      <div className="rounded-2xl border border-white/10 bg-[#0B1E2A]/60 p-6 backdrop-blur-md shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-white">
          <Globe className="h-4 w-4 text-[#d98f5b]" />
          <h3 className="font-playfair text-base font-bold">Global Fallback Meta Defaults</h3>
        </div>
        <p className="text-xs text-white/50">
          Default meta values applied when a specific page or itinerary lacks customized metadata.
        </p>

        <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
          <div>
            <label className="block text-white/60 mb-1 font-medium">Default Site Title</label>
            <input
              type="text"
              required
              value={siteTitle}
              onChange={(e) => setSiteTitle(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-white focus:border-[#d98f5b] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-white/60 mb-1 font-medium">Default Meta Description</label>
            <textarea
              rows={3}
              required
              value={siteDesc}
              onChange={(e) => setSiteDesc(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-white focus:border-[#d98f5b] focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            {savedSuccess ? (
              <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4" />
                Settings saved successfully!
              </span>
            ) : (
              <span className="text-white/40 text-[11px]">Changes take effect immediately across all routes.</span>
            )}

            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#d98f5b] to-[#EA580C] px-6 py-2.5 font-bold text-white shadow-lg shadow-[#d98f5b]/20 hover:brightness-110 active:scale-95 disabled:opacity-50"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              <span>Save SEO Defaults</span>
            </button>
          </div>
        </form>
      </div>

      {/* ── 5. Social Card Share Preview Simulator ── */}
      <div className="rounded-2xl border border-white/10 bg-[#0B1E2A]/60 p-6 backdrop-blur-md shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-white">
          <Share2 className="h-4 w-4 text-[#d98f5b]" />
          <h3 className="font-playfair text-base font-bold">Social Share Card Simulator (WhatsApp / OpenGraph)</h3>
        </div>
        <p className="text-xs text-white/50">
          This preview demonstrates how links appear when shared on WhatsApp, iMessage, and social media.
        </p>

        <div className="max-w-md rounded-2xl border border-white/15 bg-white overflow-hidden shadow-xl text-black">
          <div className="relative aspect-[16/9] w-full bg-slate-200">
            <img
              src="/images/gallery/shikara-dal-lake.jpg"
              alt="Social Preview"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">theindianwings.com</span>
            <h4 className="font-bold text-sm text-[#0B1F2A] leading-snug line-clamp-1">{siteTitle}</h4>
            <p className="text-xs text-slate-600 line-clamp-2">{siteDesc}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
