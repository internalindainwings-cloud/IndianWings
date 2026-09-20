'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Eye,
  EyeOff,
  Star,
  Clock,
  MapPin,
  Sparkles,
  Video,
  Image as ImageIcon,
  CheckCircle2,
  FolderPlus,
  Globe,
  Loader2,
  X,
  PlusCircle,
  Save,
  Car,
  Hotel,
  FileCheck2,
  HelpCircle,
  RotateCcw,
  Compass,
  FileText,
  Check,
} from 'lucide-react';
import type {
  EnrichedPackage,
  ItineraryDay,
  PackageCategoryItem,
  PackageStayItem,
  PackageTransportItem,
  PackageFaqItem,
  PackageCancellationTier,
} from '@/data/package-defaults';
import {
  defaultPackageStays,
  defaultPackageTransports,
  defaultPackageFaqsList,
  defaultCancellationPolicy,
} from '@/data/package-defaults';

export type ModalTab =
  | 'basic'
  | 'media'
  | 'overview'
  | 'itinerary'
  | 'stay'
  | 'transport'
  | 'inclusions'
  | 'faqs'
  | 'cancellation'
  | 'seo';

export const TabPackages: React.FC = () => {
  const [packages, setPackages] = useState<EnrichedPackage[]>([]);
  const [categories, setCategories] = useState<PackageCategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Edit / Create Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [activeTab, setActiveTab] = useState<ModalTab>('basic');
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // New Category Modal state
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [isCatSaving, setIsCatSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<EnrichedPackage>>({
    title: '',
    slug: '',
    categorySlug: 'featured',
    duration: '6 Days / 5 Nights',
    tag: 'Best Seller',
    tagColor: 'none',
    cardAnimation: 'none' as any,
    imageUrl: '/images/gallery/shikara-dal-lake.jpg',
    videoUrl: '',
    galleryUrls: ['/images/gallery/shikara-dal-lake.jpg'],
    rating: 4.9,
    reviewCount: 120,
    destinations: ['Srinagar', 'Gulmarg', 'Pahalgam'],
    inclusions: [
      '4-Star Stays with Central Heating',
      'Dedicated Sanitized Private Vehicle',
      'Daily Breakfast & Dinner',
      '1-Hour Shikara Ride on Dal Lake',
    ],
    exclusions: [
      'Gulmarg Gondola Phase 2 Tickets',
      'Personal Shopping & Pony Rides',
      'Airfare to Srinagar',
    ],
    highlights: ['Altitude Acclimatization', 'Zero Backtracking', 'Scenic Crescendo', 'Safe Return'],
    overviewParagraph: '',
    stays: [...defaultPackageStays],
    transports: [...defaultPackageTransports],
    faqs: [...defaultPackageFaqsList],
    cancellationPolicy: [...defaultCancellationPolicy],
    startingPrice: 18500,
    originalPrice: 22000,
    isActive: true,
    isFeatured: false,
    itinerary: [],
    metaTitle: '',
    metaDescription: '',
    keywords: [],
    canonicalUrl: '',
    noIndex: false,
  });

  // Fetch Packages and Categories
  const loadData = async () => {
    setLoading(true);
    try {
      const [pkgRes, catRes] = await Promise.all([
        fetch('/api/admin/packages'),
        fetch('/api/admin/categories'),
      ]);

      const pkgJson = await pkgRes.json();
      const catJson = await catRes.json();

      if (pkgJson.success) setPackages(pkgJson.packages);
      if (catJson.success) setCategories(catJson.categories);
    } catch (err) {
      console.error('Failed to load packages data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered packages
  const filteredPackages = useMemo(() => {
    return packages.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.destinations.some((d) => d.toLowerCase().includes(searchTerm.toLowerCase())) ||
        p.slug.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCat =
        selectedCategory === 'ALL' ||
        p.categorySlug.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCat;
    });
  }, [packages, searchTerm, selectedCategory]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setModalMode('create');
    setEditingId(null);
    setFormData({
      title: '',
      slug: '',
      categorySlug: categories[0]?.slug || 'featured',
      duration: '6 Days / 5 Nights',
      tag: 'Best Seller',
      tagColor: 'none',
      cardAnimation: 'none' as any,
      imageUrl: '/images/gallery/shikara-dal-lake.jpg',
      videoUrl: '',
      galleryUrls: ['/images/gallery/shikara-dal-lake.jpg'],
      rating: 4.9,
      reviewCount: 50,
      destinations: ['Srinagar', 'Gulmarg', 'Pahalgam'],
      inclusions: [
        'Centrally Heated Hotel / Houseboat',
        'Private Sanitized Vehicle with Chauffeur',
        'Daily Breakfast & Dinner',
        '1-Hour Shikara Cruise',
      ],
      exclusions: ['Gondola Phase 2 Cable Car', 'Personal Expenses', 'Airfare'],
      highlights: ['Altitude Acclimatization', 'Zero Backtracking', 'Scenic Crescendo', 'Safe Return'],
      overviewParagraph: '',
      stays: [...defaultPackageStays],
      transports: [...defaultPackageTransports],
      faqs: [...defaultPackageFaqsList],
      cancellationPolicy: [...defaultCancellationPolicy],
      startingPrice: 18000,
      originalPrice: 22000,
      isActive: true,
      isFeatured: false,
      itinerary: [
        {
          day: 1,
          title: 'Arrival in Srinagar & Dal Lake Shikara',
          description: 'Meet and greet at Srinagar Airport. Transfer to cedar-wood luxury houseboat. Evening sunset Shikara ride on Dal Lake.',
          activities: ['Airport pickup', 'Houseboat check-in', 'Shikara cruise'],
          meals: 'Dinner Included',
          stay: 'Luxury Houseboat, Dal Lake',
        },
        {
          day: 2,
          title: 'Scenic Day Excursion to Gulmarg',
          description: 'Drive through pine valleys to Gulmarg. Experience the highest cable car and breathtaking snowy peaks.',
          activities: ['Gondola ride', 'Snow photography', 'High altitude cafe'],
          meals: 'Breakfast & Dinner Included',
          stay: 'Centrally Heated Mountain Resort, Gulmarg',
        },
      ],
      metaTitle: '',
      metaDescription: '',
      keywords: ['Kashmir package', 'Gulmarg tour', 'Dal Lake houseboat'],
      canonicalUrl: '',
      noIndex: false,
    });
    setActiveTab('basic');
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (pkg: EnrichedPackage) => {
    setModalMode('edit');
    setEditingId(pkg.id);
    const anim = pkg.cardAnimation || (pkg.tagColor === 'snow' || pkg.tagColor === 'heart' ? pkg.tagColor : 'none');
    setFormData({
      ...pkg,
      tagColor: anim,
      cardAnimation: anim as any,
      videoUrl: pkg.videoUrl || '',
      overviewParagraph: pkg.overviewParagraph || pkg.metaDescription || '',
      stays: pkg.stays && pkg.stays.length > 0 ? pkg.stays : [...defaultPackageStays],
      transports: pkg.transports && pkg.transports.length > 0 ? pkg.transports : [...defaultPackageTransports],
      faqs: pkg.faqs && pkg.faqs.length > 0 ? pkg.faqs : [...defaultPackageFaqsList],
      cancellationPolicy: pkg.cancellationPolicy && pkg.cancellationPolicy.length > 0 ? pkg.cancellationPolicy : [...defaultCancellationPolicy],
      highlights: pkg.highlights && pkg.highlights.length > 0 ? pkg.highlights : ['Altitude Acclimatization', 'Zero Backtracking', 'Scenic Crescendo', 'Safe Return'],
    });
    setActiveTab('basic');
    setIsModalOpen(true);
  };

  // Save Package (Create or Update)
  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const url =
        modalMode === 'create'
          ? '/api/admin/packages'
          : `/api/admin/packages/${editingId}`;
      const method = modalMode === 'create' ? 'POST' : 'PUT';

      const payload = {
        ...formData,
        itinerary: {
          days: formData.itinerary || [],
          overviewParagraph: formData.overviewParagraph || null,
          stays: formData.stays || [],
          transports: formData.transports || [],
          faqs: formData.faqs || [],
          cancellationPolicy: formData.cancellationPolicy || [],
        },
        overviewParagraph: formData.overviewParagraph || null,
        stays: formData.stays || [],
        transports: formData.transports || [],
        faqs: formData.faqs || [],
        cancellationPolicy: formData.cancellationPolicy || [],
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        await loadData();
        setIsModalOpen(false);
      } else {
        alert(json.error || 'Failed to save package');
      }
    } catch (err) {
      console.error('Error saving package:', err);
      alert('Network error while saving package');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Package
  const handleDeletePackage = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/packages/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        await loadData();
      } else {
        alert(json.error || 'Failed to delete package');
      }
    } catch (err) {
      console.error('Error deleting package:', err);
    }
  };

  // Create Category Handler
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    setIsCatSaving(true);

    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCatName.trim(),
          description: newCatDesc.trim(),
        }),
      });

      const json = await res.json();
      if (json.success) {
        setNewCatName('');
        setNewCatDesc('');
        setIsCatModalOpen(false);
        await loadData();
      } else {
        alert(json.error || 'Failed to create category');
      }
    } catch (err) {
      console.error('Error creating category:', err);
    } finally {
      setIsCatSaving(false);
    }
  };

  // ── Overview Highlights Helpers ──
  const handleAddHighlight = () => {
    const list = formData.highlights || [];
    setFormData({ ...formData, highlights: [...list, 'New Route Highlight'] });
  };

  const handleRemoveHighlight = (idx: number) => {
    const list = (formData.highlights || []).filter((_, i) => i !== idx);
    setFormData({ ...formData, highlights: list });
  };

  const handleUpdateHighlight = (idx: number, val: string) => {
    const list = [...(formData.highlights || [])];
    list[idx] = val;
    setFormData({ ...formData, highlights: list });
  };

  // ── Itinerary Helpers ──
  const handleAddDay = () => {
    const currentItinerary = formData.itinerary || [];
    const nextDayNum = currentItinerary.length + 1;
    setFormData({
      ...formData,
      itinerary: [
        ...currentItinerary,
        {
          day: nextDayNum,
          title: `Day ${nextDayNum} Itinerary Exploration`,
          description: 'Detailed sightseeing, mountain drives, and leisure activities.',
          activities: ['Scenic valley transfer', 'Local exploration'],
          meals: 'Breakfast & Dinner Included',
          stay: 'Centrally Heated Hotel / Resort',
          imageUrl: '',
        },
      ],
    });
  };

  const handleRemoveDay = (index: number) => {
    const updated = (formData.itinerary || []).filter((_, i) => i !== index);
    const renumbered = updated.map((d, i) => ({ ...d, day: i + 1 }));
    setFormData({ ...formData, itinerary: renumbered });
  };

  const handleUpdateDay = (index: number, field: keyof ItineraryDay, value: any) => {
    const current = [...(formData.itinerary || [])];
    current[index] = { ...current[index], [field]: value };
    setFormData({ ...formData, itinerary: current });
  };

  const handleAddDayActivity = (dayIdx: number) => {
    const current = [...(formData.itinerary || [])];
    const acts = current[dayIdx].activities || [];
    current[dayIdx] = { ...current[dayIdx], activities: [...acts, 'New Activity'] };
    setFormData({ ...formData, itinerary: current });
  };

  const handleRemoveDayActivity = (dayIdx: number, actIdx: number) => {
    const current = [...(formData.itinerary || [])];
    const acts = (current[dayIdx].activities || []).filter((_, i) => i !== actIdx);
    current[dayIdx] = { ...current[dayIdx], activities: acts };
    setFormData({ ...formData, itinerary: current });
  };

  const handleUpdateDayActivity = (dayIdx: number, actIdx: number, val: string) => {
    const current = [...(formData.itinerary || [])];
    const acts = [...(current[dayIdx].activities || [])];
    acts[actIdx] = val;
    current[dayIdx] = { ...current[dayIdx], activities: acts };
    setFormData({ ...formData, itinerary: current });
  };

  // ── Stay Helpers ──
  const handleAddStay = () => {
    const list = formData.stays || [];
    setFormData({
      ...formData,
      stays: [
        ...list,
        {
          id: `stay-${Date.now()}`,
          name: 'New Alpine Resort / Houseboat',
          type: 'Premium Mountain Stay',
          location: 'Kashmir Valley',
          image: '/images/gallery/pahalgam-valley.jpg',
          features: [
            'Winter Heating: Central heating & warm blankets.',
            'Included Dining: Buffet Breakfast & Wazwan Dinner.',
            'Scenic Views: Mountain and pine forest balconies.',
          ],
        },
      ],
    });
  };

  const handleRemoveStay = (index: number) => {
    const list = (formData.stays || []).filter((_, i) => i !== index);
    setFormData({ ...formData, stays: list });
  };

  const handleUpdateStay = (index: number, field: keyof PackageStayItem, value: any) => {
    const list = [...(formData.stays || [])];
    list[index] = { ...list[index], [field]: value };
    setFormData({ ...formData, stays: list });
  };

  const handleAddStayFeature = (stayIdx: number) => {
    const list = [...(formData.stays || [])];
    const feats = list[stayIdx].features || [];
    list[stayIdx] = { ...list[stayIdx], features: [...feats, 'New Feature / Guarantee point'] };
    setFormData({ ...formData, stays: list });
  };

  const handleRemoveStayFeature = (stayIdx: number, fIdx: number) => {
    const list = [...(formData.stays || [])];
    const feats = (list[stayIdx].features || []).filter((_, i) => i !== fIdx);
    list[stayIdx] = { ...list[stayIdx], features: feats };
    setFormData({ ...formData, stays: list });
  };

  const handleUpdateStayFeature = (stayIdx: number, fIdx: number, val: string) => {
    const list = [...(formData.stays || [])];
    const feats = [...(list[stayIdx].features || [])];
    feats[fIdx] = val;
    list[stayIdx] = { ...list[stayIdx], features: feats };
    setFormData({ ...formData, stays: list });
  };

  // ── Transport Fleet Helpers ──
  const handleAddTransport = () => {
    const list = formData.transports || [];
    setFormData({
      ...formData,
      transports: [
        ...list,
        {
          id: `fleet-${Date.now()}`,
          name: 'Toyota Innova Crysta / Luxury Cab',
          type: 'Premium Mountain Vehicle',
          seats: '6-7 Seater',
          luggage: '4 Large Bags',
          tag: 'Dedicated Private Cab',
          image: '/images/fleet/innova-crysta.jpg',
          features: [
            'Separate rear heater & AC vents',
            'High ground clearance for snow & hills',
            'All tolls, fuel, parking and permits included',
          ],
        },
      ],
    });
  };

  const handleRemoveTransport = (index: number) => {
    const list = (formData.transports || []).filter((_, i) => i !== index);
    setFormData({ ...formData, transports: list });
  };

  const handleUpdateTransport = (index: number, field: keyof PackageTransportItem, value: any) => {
    const list = [...(formData.transports || [])];
    list[index] = { ...list[index], [field]: value };
    setFormData({ ...formData, transports: list });
  };

  const handleAddTransportFeature = (transIdx: number) => {
    const list = [...(formData.transports || [])];
    const feats = list[transIdx].features || [];
    list[transIdx] = { ...list[transIdx], features: [...feats, 'New vehicle feature point'] };
    setFormData({ ...formData, transports: list });
  };

  const handleRemoveTransportFeature = (transIdx: number, fIdx: number) => {
    const list = [...(formData.transports || [])];
    const feats = (list[transIdx].features || []).filter((_, i) => i !== fIdx);
    list[transIdx] = { ...list[transIdx], features: feats };
    setFormData({ ...formData, transports: list });
  };

  const handleUpdateTransportFeature = (transIdx: number, fIdx: number, val: string) => {
    const list = [...(formData.transports || [])];
    const feats = [...(list[transIdx].features || [])];
    feats[fIdx] = val;
    list[transIdx] = { ...list[transIdx], features: feats };
    setFormData({ ...formData, transports: list });
  };

  // ── Inclusions & Exclusions Helpers ──
  const handleAddInclusion = () => {
    const list = formData.inclusions || [];
    setFormData({ ...formData, inclusions: [...list, 'New Inclusion item'] });
  };

  const handleRemoveInclusion = (idx: number) => {
    const list = (formData.inclusions || []).filter((_, i) => i !== idx);
    setFormData({ ...formData, inclusions: list });
  };

  const handleUpdateInclusion = (idx: number, val: string) => {
    const list = [...(formData.inclusions || [])];
    list[idx] = val;
    setFormData({ ...formData, inclusions: list });
  };

  const handleAddExclusion = () => {
    const list = formData.exclusions || [];
    setFormData({ ...formData, exclusions: [...list, 'New Exclusion item'] });
  };

  const handleRemoveExclusion = (idx: number) => {
    const list = (formData.exclusions || []).filter((_, i) => i !== idx);
    setFormData({ ...formData, exclusions: list });
  };

  const handleUpdateExclusion = (idx: number, val: string) => {
    const list = [...(formData.exclusions || [])];
    list[idx] = val;
    setFormData({ ...formData, exclusions: list });
  };

  // ── FAQ Helpers ──
  const handleAddFaq = () => {
    const list = formData.faqs || [];
    setFormData({
      ...formData,
      faqs: [
        ...list,
        {
          question: 'What should we pack for this tour?',
          answer: 'Thermal innerwear, fleece jackets, waterproof snow boots, and essential medications.',
        },
      ],
    });
  };

  const handleRemoveFaq = (idx: number) => {
    const list = (formData.faqs || []).filter((_, i) => i !== idx);
    setFormData({ ...formData, faqs: list });
  };

  const handleUpdateFaq = (idx: number, field: 'question' | 'answer', val: string) => {
    const list = [...(formData.faqs || [])];
    list[idx] = { ...list[idx], [field]: val };
    setFormData({ ...formData, faqs: list });
  };

  // ── Cancellation Tier Helpers ──
  const handleAddCancellationTier = () => {
    const list = formData.cancellationPolicy || [];
    setFormData({
      ...formData,
      cancellationPolicy: [
        ...list,
        {
          window: '20 – 30 Days Prior',
          refund: '80% Refund',
          note: '20% administrative retention applies or transfer 100% credit to future date.',
        },
      ],
    });
  };

  const handleRemoveCancellationTier = (idx: number) => {
    const list = (formData.cancellationPolicy || []).filter((_, i) => i !== idx);
    setFormData({ ...formData, cancellationPolicy: list });
  };

  const handleUpdateCancellationTier = (idx: number, field: keyof PackageCancellationTier, val: string) => {
    const list = [...(formData.cancellationPolicy || [])];
    list[idx] = { ...list[idx], [field]: val };
    setFormData({ ...formData, cancellationPolicy: list });
  };

  return (
    <div className="space-y-6">
      {/* ── Human-Readable Header ── */}
      <div className="border-b border-white/10 pb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#d98f5b] mb-1">
            <Sparkles className="h-4 w-4" />
            <span className="text-[11px] font-bold uppercase tracking-wider">Catalog & SEO Control</span>
          </div>
          <h2 className="font-playfair text-xl sm:text-2xl font-bold text-white">
            Kashmir Packages & Itinerary Engine
          </h2>
          <p className="mt-1 text-xs text-white/60">
            Create, update, and manage your travel itineraries, video/image media showcases, pricing, and Google rich search snippets.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsCatModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-semibold text-white transition-all hover:bg-white/10 active:scale-95"
          >
            <FolderPlus className="h-4 w-4 text-[#d98f5b]" />
            <span>New Category</span>
          </button>

          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#d98f5b] to-[#EA580C] px-4 py-2 text-xs font-bold text-white shadow-lg shadow-[#d98f5b]/20 transition-all hover:brightness-110 active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>Create Package</span>
          </button>
        </div>
      </div>

      {/* ── Category Filters & Search Controls ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
              selectedCategory === 'ALL'
                ? 'bg-[#d98f5b] text-white shadow-md'
                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
            }`}
          >
            All Packages ({packages.length})
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-all capitalize ${
                selectedCategory === cat.slug
                  ? 'bg-[#d98f5b] text-white shadow-md'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              {cat.name} {cat.packageCount !== undefined ? `(${cat.packageCount})` : ''}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[220px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Search title, destinations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 py-1.5 pl-9 pr-3 text-xs text-white placeholder-white/30 focus:border-[#d98f5b] focus:outline-none"
          />
        </div>
      </div>

      {/* ── Packages Data Grid ── */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0B1F2A]/60 shadow-xl backdrop-blur-md">
        {loading ? (
          <div className="flex items-center justify-center p-12 text-white/50 gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-[#d98f5b]" />
            <span className="text-xs">Connecting to PostgreSQL Package Vault...</span>
          </div>
        ) : filteredPackages.length === 0 ? (
          <div className="p-12 text-center text-xs text-white/40">
            No packages found matching your criteria. Click &quot;Create Package&quot; to add your first itinerary!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-white/80">
              <thead className="border-b border-white/10 bg-white/[0.02] text-[10px] font-semibold uppercase tracking-wider text-white/40">
                <tr>
                  <th className="px-5 py-3.5">Package</th>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5">Duration</th>
                  <th className="px-5 py-3.5">Starting Price</th>
                  <th className="px-5 py-3.5">Media</th>
                  <th className="px-5 py-3.5">Animation</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredPackages.map((pkg) => (
                  <tr key={pkg.id} className="transition-colors hover:bg-white/[0.02]">
                    {/* Title + Thumbnail */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-16 shrink-0 rounded-lg overflow-hidden border border-white/10 bg-black/40">
                          <Image
                            src={pkg.imageUrl || '/images/gallery/shikara-dal-lake.jpg'}
                            alt={pkg.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <Link
                            href={`/packages/${pkg.slug}`}
                            target="_blank"
                            className="font-semibold text-white hover:text-[#d98f5b] flex items-center gap-1 group"
                          >
                            <span>{pkg.title}</span>
                            <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Link>
                          <div className="flex items-center gap-1.5 text-[11px] text-white/40 mt-0.5">
                            <MapPin className="h-3 w-3 text-[#d98f5b]" />
                            <span>{pkg.destinations.slice(0, 3).join(' • ')}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-4">
                      <span className="inline-block rounded-md bg-white/5 px-2.5 py-1 text-[11px] font-medium capitalize text-white/70">
                        {pkg.categorySlug}
                      </span>
                    </td>

                    {/* Duration */}
                    <td className="px-5 py-4 text-white/70 font-mono">
                      {pkg.duration}
                    </td>

                    {/* Starting Price */}
                    <td className="px-5 py-4 font-mono font-bold text-white">
                      ₹{pkg.startingPrice.toLocaleString('en-IN')}
                    </td>

                    {/* Media Flags */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-[11px]">
                        <span className="flex items-center gap-1 text-emerald-400" title="Photo active">
                          <ImageIcon className="h-3.5 w-3.5" />
                        </span>
                        {pkg.videoUrl ? (
                          <span className="flex items-center gap-1 rounded-full bg-[#d98f5b]/20 px-2 py-0.5 text-[10px] font-bold text-[#d98f5b]">
                            <Video className="h-3 w-3" />
                            Video
                          </span>
                        ) : (
                          <span className="text-white/25 text-[10px]">No video</span>
                        )}
                      </div>
                    </td>

                    {/* Animation Indicator */}
                    <td className="px-5 py-4">
                      {pkg.cardAnimation === 'snow' || pkg.tagColor === 'snow' ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-sky-500/20 px-2 py-0.5 text-[10px] font-bold text-sky-300 border border-sky-500/30">
                          ❄️ Snow Drop
                        </span>
                      ) : pkg.cardAnimation === 'heart' || pkg.tagColor === 'heart' ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-300 border border-rose-500/30">
                          ❤️ Heart Drop
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/30">
                          ✨ Gold Glow
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      {pkg.isActive ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                          <Eye className="h-3 w-3" />
                          Live
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-medium text-amber-400">
                          <EyeOff className="h-3 w-3" />
                          Draft
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(pkg)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                          title="Edit Package"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeletePackage(pkg.id, pkg.title)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                          title="Delete Package"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Package Edit / Create Drawer Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-4xl rounded-3xl border border-white/15 bg-[#0B1F2A] shadow-2xl overflow-hidden my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-white/[0.02]">
              <div>
                <h3 className="font-playfair text-lg font-bold text-white">
                  {modalMode === 'create' ? 'Create New Kashmir Tour Package' : `Edit: ${formData.title}`}
                </h3>
                <p className="text-xs text-white/40">Configure itinerary, media showcases, and Google SERP metadata</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Sub-Tabs */}
            <div className="flex border-b border-white/10 px-4 sm:px-6 bg-black/20 text-xs font-semibold overflow-x-auto no-scrollbar gap-1">
              <button
                type="button"
                onClick={() => setActiveTab('basic')}
                className={`py-3 px-3.5 border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeTab === 'basic' ? 'border-[#d98f5b] text-[#d98f5b]' : 'border-transparent text-white/50 hover:text-white'
                }`}
              >
                <FileText className="h-3.5 w-3.5" />
                <span>1. Core & Pricing</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('media')}
                className={`py-3 px-3.5 border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeTab === 'media' ? 'border-[#d98f5b] text-[#d98f5b]' : 'border-transparent text-white/50 hover:text-white'
                }`}
              >
                <Video className="h-3.5 w-3.5" />
                <span>2. Media & Video</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className={`py-3 px-3.5 border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeTab === 'overview' ? 'border-[#d98f5b] text-[#d98f5b]' : 'border-transparent text-white/50 hover:text-white'
                }`}
              >
                <Compass className="h-3.5 w-3.5" />
                <span>3. Overview</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('itinerary')}
                className={`py-3 px-3.5 border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeTab === 'itinerary' ? 'border-[#d98f5b] text-[#d98f5b]' : 'border-transparent text-white/50 hover:text-white'
                }`}
              >
                <Clock className="h-3.5 w-3.5" />
                <span>4. Itinerary</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('stay')}
                className={`py-3 px-3.5 border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeTab === 'stay' ? 'border-[#d98f5b] text-[#d98f5b]' : 'border-transparent text-white/50 hover:text-white'
                }`}
              >
                <Hotel className="h-3.5 w-3.5" />
                <span>5. Stay</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('transport')}
                className={`py-3 px-3.5 border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeTab === 'transport' ? 'border-[#d98f5b] text-[#d98f5b]' : 'border-transparent text-white/50 hover:text-white'
                }`}
              >
                <Car className="h-3.5 w-3.5" />
                <span>6. Transport</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('inclusions')}
                className={`py-3 px-3.5 border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeTab === 'inclusions' ? 'border-[#d98f5b] text-[#d98f5b]' : 'border-transparent text-white/50 hover:text-white'
                }`}
              >
                <FileCheck2 className="h-3.5 w-3.5" />
                <span>7. Inclusions</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('faqs')}
                className={`py-3 px-3.5 border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeTab === 'faqs' ? 'border-[#d98f5b] text-[#d98f5b]' : 'border-transparent text-white/50 hover:text-white'
                }`}
              >
                <HelpCircle className="h-3.5 w-3.5" />
                <span>8. FAQs</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('cancellation')}
                className={`py-3 px-3.5 border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeTab === 'cancellation' ? 'border-[#d98f5b] text-[#d98f5b]' : 'border-transparent text-white/50 hover:text-white'
                }`}
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>9. Cancellation</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('seo')}
                className={`py-3 px-3.5 border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeTab === 'seo' ? 'border-[#d98f5b] text-[#d98f5b]' : 'border-transparent text-white/50 hover:text-white'
                }`}
              >
                <Globe className="h-3.5 w-3.5" />
                <span>10. Google SEO</span>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSavePackage} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* ── TAB 1: BASIC DETAILS ── */}
              {activeTab === 'basic' && (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/60 mb-1 font-medium">Package Title *</label>
                      <input
                        type="text"
                        required
                        value={formData.title || ''}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-white focus:border-[#d98f5b] focus:outline-none"
                        placeholder="e.g. Kashmir Classic Odyssey"
                      />
                    </div>

                    <div>
                      <label className="block text-white/60 mb-1 font-medium">Category *</label>
                      <select
                        value={formData.categorySlug || 'featured'}
                        onChange={(e) => setFormData({ ...formData, categorySlug: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-[#07131B] p-2.5 text-white focus:border-[#d98f5b] focus:outline-none capitalize"
                      >
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.slug}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-white/60 mb-1 font-medium">Duration *</label>
                      <input
                        type="text"
                        required
                        value={formData.duration || ''}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-white focus:border-[#d98f5b] focus:outline-none"
                        placeholder="e.g. 6 Days / 5 Nights"
                      />
                    </div>

                    <div>
                      <label className="block text-white/60 mb-1 font-medium">Starting Price (₹) *</label>
                      <input
                        type="number"
                        required
                        value={formData.startingPrice || ''}
                        onChange={(e) => setFormData({ ...formData, startingPrice: parseInt(e.target.value, 10) || 0 })}
                        className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-white focus:border-[#d98f5b] focus:outline-none"
                        placeholder="18500"
                      />
                    </div>

                    <div>
                      <label className="block text-white/60 mb-1 font-medium">Original / Strike Price (₹)</label>
                      <input
                        type="number"
                        value={formData.originalPrice || ''}
                        onChange={(e) => setFormData({ ...formData, originalPrice: parseInt(e.target.value, 10) || null })}
                        className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-white focus:border-[#d98f5b] focus:outline-none"
                        placeholder="22000"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/60 mb-1 font-medium">Tag / Ribbon Badge</label>
                      <input
                        type="text"
                        value={formData.tag || ''}
                        onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-white focus:border-[#d98f5b] focus:outline-none"
                        placeholder="e.g. Best Seller, Honeymoon Special"
                      />
                    </div>

                    <div className="flex items-center gap-6 pt-6">
                      <label className="flex items-center gap-2 cursor-pointer text-white">
                        <input
                          type="checkbox"
                          checked={formData.isActive ?? true}
                          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                          className="h-4 w-4 rounded accent-[#d98f5b]"
                        />
                        <span>Active (Publicly Visible)</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer text-white">
                        <input
                          type="checkbox"
                          checked={formData.isFeatured ?? false}
                          onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                          className="h-4 w-4 rounded accent-[#d98f5b]"
                        />
                        <span>Homepage Featured</span>
                      </label>
                    </div>
                  </div>

                  {/* ── Choose Animation & Transformation: Will you drop heart or snow? ── */}
                  <div className="rounded-2xl border border-white/15 bg-white/[0.03] p-4 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <div>
                        <label className="block text-white font-bold text-xs flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-[#d98f5b]" />
                          <span>Choose Card Animation: Will you drop heart or snow?</span>
                        </label>
                        <p className="text-[11px] text-white/50">
                          Select the interactive border laser glow and falling particle transformation for this package card.
                        </p>
                      </div>
                      <span className="self-start sm:self-auto px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#d98f5b]/20 text-[#d98f5b] border border-[#d98f5b]/30">
                        Live Preview Effect
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                      {/* Option 1: Classic Gold */}
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, tagColor: 'none', cardAnimation: 'none' as any })}
                        className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                          formData.tagColor === 'none' || (!formData.tagColor && !formData.cardAnimation)
                            ? 'border-amber-400 bg-amber-500/20 ring-2 ring-amber-400/50 shadow-md'
                            : 'border-white/10 bg-white/5 hover:border-white/20'
                        }`}
                      >
                        <span className="text-xl">✨</span>
                        <div>
                          <strong className="text-white text-xs block font-bold">Classic Gold</strong>
                          <span className="text-[10px] text-amber-300/80">Amber Laser Border</span>
                        </div>
                      </button>

                      {/* Option 2: Snow Drop */}
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, tagColor: 'snow', cardAnimation: 'snow' as any })}
                        className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                          formData.tagColor === 'snow' || formData.cardAnimation === 'snow'
                            ? 'border-sky-400 bg-sky-500/20 ring-2 ring-sky-400/50 shadow-md'
                            : 'border-white/10 bg-white/5 hover:border-white/20'
                        }`}
                      >
                        <span className="text-xl">❄️</span>
                        <div>
                          <strong className="text-white text-xs block font-bold">Drop Snow</strong>
                          <span className="text-[10px] text-sky-300">Ice Blue Glow + Snowflakes</span>
                        </div>
                      </button>

                      {/* Option 3: Heart Drop */}
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, tagColor: 'heart', cardAnimation: 'heart' as any })}
                        className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                          formData.tagColor === 'heart' || formData.cardAnimation === 'heart'
                            ? 'border-rose-400 bg-rose-500/20 ring-2 ring-rose-400/50 shadow-md'
                            : 'border-white/10 bg-white/5 hover:border-white/20'
                        }`}
                      >
                        <span className="text-xl">❤️</span>
                        <div>
                          <strong className="text-white text-xs block font-bold">Drop Heart</strong>
                          <span className="text-[10px] text-rose-300">Pink Rose Glow + Hearts Rain</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ── TAB 2: MEDIA & VIDEO ── */}
              {activeTab === 'media' && (
                <div className="space-y-4 text-xs">
                  <div className="rounded-xl bg-white/[0.03] p-4 border border-white/10 space-y-3">
                    <div className="flex items-center gap-2 text-[#d98f5b] font-semibold">
                      <ImageIcon className="h-4 w-4" />
                      <span>Primary Display Image</span>
                    </div>
                    <div>
                      <label className="block text-white/60 mb-1">Image URL (Cloudinary or local path) *</label>
                      <input
                        type="text"
                        required
                        value={formData.imageUrl || ''}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-white focus:border-[#d98f5b] focus:outline-none"
                        placeholder="/images/gallery/shikara-dal-lake.jpg"
                      />
                    </div>
                    {formData.imageUrl && (
                      <div className="relative h-36 w-56 rounded-xl overflow-hidden border border-white/10">
                        <Image src={formData.imageUrl} alt="Preview" fill className="object-cover" />
                      </div>
                    )}
                  </div>

                  {/* Video URL Input */}
                  <div className="rounded-xl bg-white/[0.03] p-4 border border-white/10 space-y-3">
                    <div className="flex items-center gap-2 text-blue-400 font-semibold">
                      <Video className="h-4 w-4" />
                      <span>Video Showcase (Cloudinary / YouTube / MP4)</span>
                    </div>
                    <p className="text-[11px] text-white/40">
                      Attach a video walkthrough. A &quot;Watch Video Tour&quot; button will automatically render over the package hero.
                    </p>
                    <div>
                      <label className="block text-white/60 mb-1">Video Embed or MP4 Link</label>
                      <input
                        type="text"
                        value={formData.videoUrl || ''}
                        onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-white focus:border-blue-400 focus:outline-none"
                        placeholder="e.g. https://www.youtube.com/watch?v=... or https://res.cloudinary.com/.../video.mp4"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ── TAB 3: OVERVIEW & ROUTE ── */}
              {activeTab === 'overview' && (
                <div className="space-y-6 text-xs">
                  {/* Overview Story */}
                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 space-y-2">
                    <label className="block text-white font-bold flex items-center gap-2">
                      <Compass className="h-4 w-4 text-[#d98f5b]" />
                      <span>Overview Narrative Description</span>
                    </label>
                    <p className="text-[11px] text-white/50">
                      The core promotional and experiential summary rendered at the top of the package detail page.
                    </p>
                    <textarea
                      rows={4}
                      value={formData.overviewParagraph || ''}
                      onChange={(e) => setFormData({ ...formData, overviewParagraph: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white focus:border-[#d98f5b] focus:outline-none leading-relaxed"
                      placeholder="Experience the spellbinding splendor of Kashmir on this handcrafted holiday..."
                    />
                  </div>

                  {/* Why This Route / Route Highlights */}
                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <div>
                        <span className="font-bold text-white flex items-center gap-1.5">
                          <Sparkles className="h-4 w-4 text-[#d98f5b]" />
                          <span>&quot;Why this Route.&quot; Highlights</span>
                        </span>
                        <p className="text-[11px] text-white/50">
                          Route rationale cards (e.g. Altitude Acclimatization, Zero Backtracking, Scenic Crescendo).
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddHighlight}
                        className="flex items-center gap-1 text-[#d98f5b] hover:underline font-semibold"
                      >
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span>Add Highlight</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {(formData.highlights || []).map((hl, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={hl}
                            onChange={(e) => handleUpdateHighlight(idx, e.target.value)}
                            className="flex-1 rounded-xl border border-white/10 bg-white/5 p-2.5 text-white focus:border-[#d98f5b] focus:outline-none"
                            placeholder="e.g. Altitude Acclimatization: Starts at Srinagar..."
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveHighlight(idx)}
                            className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors shrink-0"
                            title="Delete Highlight"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── TAB 4: ITINERARY TIMELINE ── */}
              {activeTab === 'itinerary' && (
                <div className="space-y-6 text-xs">
                  {/* Destinations Route */}
                  <div>
                    <label className="block text-white/60 mb-1 font-medium">
                      Destinations Route (Comma Separated)
                    </label>
                    <input
                      type="text"
                      value={(formData.destinations || []).join(', ')}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          destinations: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                        })
                      }
                      className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-white focus:border-[#d98f5b] focus:outline-none"
                      placeholder="Srinagar, Gulmarg, Pahalgam"
                    />
                  </div>

                  {/* Day-by-Day Itinerary Editor */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <div>
                        <span className="font-semibold text-white">Day-by-Day Timeline Items</span>
                        <p className="text-[11px] text-white/50">Configure day heading, activities, overnight stay & meals</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddDay}
                        className="flex items-center gap-1.5 rounded-xl bg-[#d98f5b]/20 px-3 py-1.5 text-xs font-bold text-[#d98f5b] hover:bg-[#d98f5b]/30"
                      >
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span>+ Add Day</span>
                      </button>
                    </div>

                    {(formData.itinerary || []).map((day, idx) => (
                      <div key={idx} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 space-y-3">
                        <div className="flex items-center justify-between border-b border-white/5 pb-2">
                          <span className="font-bold text-[#d98f5b] text-sm">Day {day.day}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveDay(idx)}
                            className="flex items-center gap-1 rounded-lg bg-red-500/10 px-2.5 py-1 text-xs text-red-400 hover:bg-red-500/20"
                            title="Delete Day"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Delete Day</span>
                          </button>
                        </div>

                        <div>
                          <label className="block text-white/50 mb-1">Day Heading</label>
                          <input
                            type="text"
                            value={day.title}
                            onChange={(e) => handleUpdateDay(idx, 'title', e.target.value)}
                            className="w-full rounded-lg border border-white/10 bg-white/5 p-2 text-white focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-white/50 mb-1">Detailed Activities Description</label>
                          <textarea
                            rows={2}
                            value={day.description}
                            onChange={(e) => handleUpdateDay(idx, 'description', e.target.value)}
                            className="w-full rounded-lg border border-white/10 bg-white/5 p-2 text-white focus:outline-none"
                          />
                        </div>

                        {/* Day Image (Optional - Appears on right side & mobile preview) */}
                        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-white/70 font-medium flex items-center gap-1.5 text-xs">
                              <ImageIcon className="h-3.5 w-3.5 text-[#d98f5b]" />
                              <span>Day Image (Optional — Shown on Right Side Panel & Mobile)</span>
                            </label>
                            {(day.imageUrl || day.image) && (
                              <button
                                type="button"
                                onClick={() => {
                                  handleUpdateDay(idx, 'imageUrl', '');
                                  handleUpdateDay(idx, 'image', '');
                                }}
                                className="text-[11px] text-red-400 hover:text-red-300 font-medium cursor-pointer"
                              >
                                Remove Image
                              </button>
                            )}
                          </div>

                          <div className="flex items-center gap-3">
                            {(day.imageUrl || day.image) ? (
                              <div className="relative h-14 w-20 shrink-0 rounded-lg overflow-hidden border border-white/20 bg-black/40">
                                <Image
                                  src={day.imageUrl || day.image || ''}
                                  alt={`Day ${day.day} Image`}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="h-14 w-20 shrink-0 rounded-lg border border-dashed border-white/15 bg-white/[0.02] flex items-center justify-center text-[10px] text-white/30 text-center px-1">
                                No image
                              </div>
                            )}

                            <div className="flex-1">
                              <input
                                type="text"
                                value={day.imageUrl || day.image || ''}
                                onChange={(e) => {
                                  handleUpdateDay(idx, 'imageUrl', e.target.value);
                                  handleUpdateDay(idx, 'image', e.target.value);
                                }}
                                className="w-full rounded-lg border border-white/10 bg-white/5 p-2 text-xs text-white placeholder-white/30 focus:border-[#d98f5b] focus:outline-none"
                                placeholder="Paste image URL (e.g. /images/gallery/gulmarg-snow.jpg or Cloudinary URL)"
                              />
                              <p className="text-[10px] text-white/40 mt-1">
                                Leave blank if no photo is needed for Day {day.day}.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-white/50 mb-1">Overnight Stay</label>
                            <input
                              type="text"
                              value={day.stay || ''}
                              onChange={(e) => handleUpdateDay(idx, 'stay', e.target.value)}
                              className="w-full rounded-lg border border-white/10 bg-white/5 p-2 text-white focus:outline-none"
                              placeholder="Mountain Resort, Gulmarg"
                            />
                          </div>
                          <div>
                            <label className="block text-white/50 mb-1">Meals</label>
                            <input
                              type="text"
                              value={day.meals || ''}
                              onChange={(e) => handleUpdateDay(idx, 'meals', e.target.value)}
                              className="w-full rounded-lg border border-white/10 bg-white/5 p-2 text-white focus:outline-none"
                              placeholder="Breakfast & Dinner Included"
                            />
                          </div>
                        </div>

                        {/* Activities list */}
                        <div className="space-y-2 pt-2 border-t border-white/5">
                          <div className="flex items-center justify-between">
                            <span className="text-white/60 font-medium">Key Highlights & Activities</span>
                            <button
                              type="button"
                              onClick={() => handleAddDayActivity(idx)}
                              className="text-[11px] text-[#d98f5b] hover:underline"
                            >
                              + Add Activity
                            </button>
                          </div>
                          <div className="space-y-1.5">
                            {(day.activities || []).map((act, aIdx) => (
                              <div key={aIdx} className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={act}
                                  onChange={(e) => handleUpdateDayActivity(idx, aIdx, e.target.value)}
                                  className="flex-1 rounded-lg border border-white/10 bg-white/5 p-1.5 text-xs text-white focus:outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveDayActivity(idx, aIdx)}
                                  className="text-red-400 hover:text-red-300 p-1"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={handleAddDay}
                      className="w-full py-3 rounded-2xl border-2 border-dashed border-white/15 text-white/60 hover:text-white hover:border-[#d98f5b] flex items-center justify-center gap-2 transition-all"
                    >
                      <PlusCircle className="h-4 w-4 text-[#d98f5b]" />
                      <span>+ Add Another Day to Timeline</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ── TAB 5: STAY & ACCOMMODATIONS ── */}
              {activeTab === 'stay' && (
                <div className="space-y-6 text-xs">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <div>
                      <span className="font-semibold text-white flex items-center gap-1.5">
                        <Hotel className="h-4 w-4 text-[#d98f5b]" />
                        <span>Handpicked Stays & Houseboat Standards</span>
                      </span>
                      <p className="text-[11px] text-white/50">Mapped cards rendered in the &quot;Stay&quot; section on package page</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddStay}
                      className="flex items-center gap-1.5 rounded-xl bg-[#d98f5b]/20 px-3 py-1.5 text-xs font-bold text-[#d98f5b] hover:bg-[#d98f5b]/30"
                    >
                      <PlusCircle className="h-3.5 w-3.5" />
                      <span>+ Add Stay</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {(formData.stays || []).map((stay, idx) => (
                      <div key={idx} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 space-y-3">
                        <div className="flex items-center justify-between border-b border-white/5 pb-2">
                          <span className="font-bold text-[#d98f5b]">Property #{idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveStay(idx)}
                            className="flex items-center gap-1 rounded-lg bg-red-500/10 px-2.5 py-1 text-xs text-red-400 hover:bg-red-500/20"
                            title="Delete Stay"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Delete Stay</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-white/50 mb-1">Property Name *</label>
                            <input
                              type="text"
                              value={stay.name}
                              onChange={(e) => handleUpdateStay(idx, 'name', e.target.value)}
                              className="w-full rounded-lg border border-white/10 bg-white/5 p-2 text-white focus:outline-none"
                              placeholder="e.g. Luxury Cedar-Wood Houseboat"
                            />
                          </div>
                          <div>
                            <label className="block text-white/50 mb-1">Badge / Type Tag *</label>
                            <input
                              type="text"
                              value={stay.type}
                              onChange={(e) => handleUpdateStay(idx, 'type', e.target.value)}
                              className="w-full rounded-lg border border-white/10 bg-white/5 p-2 text-white focus:outline-none"
                              placeholder="e.g. Signature Kashmir Experience"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-white/50 mb-1">Location Subtitle</label>
                            <input
                              type="text"
                              value={stay.location}
                              onChange={(e) => handleUpdateStay(idx, 'location', e.target.value)}
                              className="w-full rounded-lg border border-white/10 bg-white/5 p-2 text-white focus:outline-none"
                              placeholder="e.g. Dal Lake / Nigeen Lake, Srinagar"
                            />
                          </div>
                          <div>
                            <label className="block text-white/50 mb-1">Image URL</label>
                            <input
                              type="text"
                              value={stay.image || ''}
                              onChange={(e) => handleUpdateStay(idx, 'image', e.target.value)}
                              className="w-full rounded-lg border border-white/10 bg-white/5 p-2 text-white focus:outline-none"
                              placeholder="/images/gallery/shikara-dal-lake.jpg"
                            />
                          </div>
                        </div>

                        {/* Features */}
                        <div className="space-y-2 pt-2 border-t border-white/5">
                          <div className="flex items-center justify-between">
                            <span className="text-white/60 font-medium">Key Amenities & Standards</span>
                            <button
                              type="button"
                              onClick={() => handleAddStayFeature(idx)}
                              className="text-[11px] text-[#d98f5b] hover:underline"
                            >
                              + Add Feature
                            </button>
                          </div>
                          <div className="space-y-1.5">
                            {(stay.features || []).map((feat, fIdx) => (
                              <div key={fIdx} className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={feat}
                                  onChange={(e) => handleUpdateStayFeature(idx, fIdx, e.target.value)}
                                  className="flex-1 rounded-lg border border-white/10 bg-white/5 p-1.5 text-xs text-white focus:outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveStayFeature(idx, fIdx)}
                                  className="text-red-400 hover:text-red-300 p-1"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── TAB 6: TRANSPORT FLEET ── */}
              {activeTab === 'transport' && (
                <div className="space-y-6 text-xs">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <div>
                      <span className="font-semibold text-white flex items-center gap-1.5">
                        <Car className="h-4 w-4 text-[#d98f5b]" />
                        <span>Dedicated Private Transport Fleet</span>
                      </span>
                      <p className="text-[11px] text-white/50">Vehicles displayed in the Transport fleet selector on package detail</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddTransport}
                      className="flex items-center gap-1.5 rounded-xl bg-[#d98f5b]/20 px-3 py-1.5 text-xs font-bold text-[#d98f5b] hover:bg-[#d98f5b]/30"
                    >
                      <PlusCircle className="h-3.5 w-3.5" />
                      <span>+ Add Vehicle</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {(formData.transports || []).map((car, idx) => (
                      <div key={idx} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 space-y-3">
                        <div className="flex items-center justify-between border-b border-white/5 pb-2">
                          <span className="font-bold text-[#d98f5b]">Vehicle #{idx + 1}: {car.name}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTransport(idx)}
                            className="flex items-center gap-1 rounded-lg bg-red-500/10 px-2.5 py-1 text-xs text-red-400 hover:bg-red-500/20"
                            title="Delete Vehicle"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Delete Vehicle</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-white/50 mb-1">Vehicle Name *</label>
                            <input
                              type="text"
                              value={car.name}
                              onChange={(e) => handleUpdateTransport(idx, 'name', e.target.value)}
                              className="w-full rounded-lg border border-white/10 bg-white/5 p-2 text-white focus:outline-none"
                              placeholder="e.g. Toyota Innova Crysta"
                            />
                          </div>
                          <div>
                            <label className="block text-white/50 mb-1">Category / Type *</label>
                            <input
                              type="text"
                              value={car.type}
                              onChange={(e) => handleUpdateTransport(idx, 'type', e.target.value)}
                              className="w-full rounded-lg border border-white/10 bg-white/5 p-2 text-white focus:outline-none"
                              placeholder="e.g. Premium Mountain SUV"
                            />
                          </div>
                          <div>
                            <label className="block text-white/50 mb-1">Ribbon Tag</label>
                            <input
                              type="text"
                              value={car.tag || ''}
                              onChange={(e) => handleUpdateTransport(idx, 'tag', e.target.value)}
                              className="w-full rounded-lg border border-white/10 bg-white/5 p-2 text-white focus:outline-none"
                              placeholder="e.g. Most Popular"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-white/50 mb-1">Seats</label>
                            <input
                              type="text"
                              value={car.seats}
                              onChange={(e) => handleUpdateTransport(idx, 'seats', e.target.value)}
                              className="w-full rounded-lg border border-white/10 bg-white/5 p-2 text-white focus:outline-none"
                              placeholder="6-7 Seater"
                            />
                          </div>
                          <div>
                            <label className="block text-white/50 mb-1">Luggage Capacity</label>
                            <input
                              type="text"
                              value={car.luggage || ''}
                              onChange={(e) => handleUpdateTransport(idx, 'luggage', e.target.value)}
                              className="w-full rounded-lg border border-white/10 bg-white/5 p-2 text-white focus:outline-none"
                              placeholder="4 Large Bags"
                            />
                          </div>
                          <div>
                            <label className="block text-white/50 mb-1">Image URL</label>
                            <input
                              type="text"
                              value={car.image || ''}
                              onChange={(e) => handleUpdateTransport(idx, 'image', e.target.value)}
                              className="w-full rounded-lg border border-white/10 bg-white/5 p-2 text-white focus:outline-none"
                              placeholder="/images/fleet/innova-crysta.jpg"
                            />
                          </div>
                        </div>

                        {/* Features */}
                        <div className="space-y-2 pt-2 border-t border-white/5">
                          <div className="flex items-center justify-between">
                            <span className="text-white/60 font-medium">Key Vehicle Features</span>
                            <button
                              type="button"
                              onClick={() => handleAddTransportFeature(idx)}
                              className="text-[11px] text-[#d98f5b] hover:underline"
                            >
                              + Add Feature
                            </button>
                          </div>
                          <div className="space-y-1.5">
                            {(car.features || []).map((feat, fIdx) => (
                              <div key={fIdx} className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={feat}
                                  onChange={(e) => handleUpdateTransportFeature(idx, fIdx, e.target.value)}
                                  className="flex-1 rounded-lg border border-white/10 bg-white/5 p-1.5 text-xs text-white focus:outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveTransportFeature(idx, fIdx)}
                                  className="text-red-400 hover:text-red-300 p-1"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── TAB 7: INCLUSIONS & EXCLUSIONS ── */}
              {activeTab === 'inclusions' && (
                <div className="space-y-6 text-xs">
                  {/* Inclusions Box */}
                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.02] p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
                      <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Package Inclusions ({formData.inclusions?.length || 0})</span>
                      </span>
                      <button
                        type="button"
                        onClick={handleAddInclusion}
                        className="flex items-center gap-1 text-emerald-400 hover:underline font-semibold"
                      >
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span>Add Inclusion</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {(formData.inclusions || []).map((inc, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="text-emerald-400 font-bold">✓</span>
                          <input
                            type="text"
                            value={inc}
                            onChange={(e) => handleUpdateInclusion(idx, e.target.value)}
                            className="flex-1 rounded-xl border border-white/10 bg-white/5 p-2.5 text-white focus:border-emerald-400 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveInclusion(idx)}
                            className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 shrink-0"
                            title="Delete Inclusion"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Exclusions Box */}
                  <div className="rounded-2xl border border-rose-500/20 bg-rose-500/[0.02] p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-rose-500/20 pb-2">
                      <span className="font-bold text-rose-400 flex items-center gap-1.5">
                        <X className="h-4 w-4" />
                        <span>Package Exclusions ({formData.exclusions?.length || 0})</span>
                      </span>
                      <button
                        type="button"
                        onClick={handleAddExclusion}
                        className="flex items-center gap-1 text-rose-400 hover:underline font-semibold"
                      >
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span>Add Exclusion</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {(formData.exclusions || []).map((exc, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="text-rose-400 font-bold">✕</span>
                          <input
                            type="text"
                            value={exc}
                            onChange={(e) => handleUpdateExclusion(idx, e.target.value)}
                            className="flex-1 rounded-xl border border-white/10 bg-white/5 p-2.5 text-white focus:border-rose-400 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveExclusion(idx)}
                            className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 shrink-0"
                            title="Delete Exclusion"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── TAB 8: FAQS ── */}
              {activeTab === 'faqs' && (
                <div className="space-y-6 text-xs">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <div>
                      <span className="font-semibold text-white flex items-center gap-1.5">
                        <HelpCircle className="h-4 w-4 text-[#d98f5b]" />
                        <span>Frequently Asked Questions ({formData.faqs?.length || 0})</span>
                      </span>
                      <p className="text-[11px] text-white/50">Questions and answers rendered in the FAQ accordion on detail page</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddFaq}
                      className="flex items-center gap-1.5 rounded-xl bg-[#d98f5b]/20 px-3 py-1.5 text-xs font-bold text-[#d98f5b] hover:bg-[#d98f5b]/30"
                    >
                      <PlusCircle className="h-3.5 w-3.5" />
                      <span>+ Add FAQ</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {(formData.faqs || []).map((faq, idx) => (
                      <div key={idx} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 space-y-3">
                        <div className="flex items-center justify-between border-b border-white/5 pb-2">
                          <span className="font-bold text-[#d98f5b]">FAQ #{idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveFaq(idx)}
                            className="flex items-center gap-1 rounded-lg bg-red-500/10 px-2.5 py-1 text-xs text-red-400 hover:bg-red-500/20"
                            title="Delete FAQ"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Delete FAQ</span>
                          </button>
                        </div>

                        <div>
                          <label className="block text-white/50 mb-1">Question *</label>
                          <input
                            type="text"
                            value={faq.question}
                            onChange={(e) => handleUpdateFaq(idx, 'question', e.target.value)}
                            className="w-full rounded-lg border border-white/10 bg-white/5 p-2 text-white focus:outline-none"
                            placeholder="e.g. Are Gondola tickets included?"
                          />
                        </div>

                        <div>
                          <label className="block text-white/50 mb-1">Answer *</label>
                          <textarea
                            rows={3}
                            value={faq.answer}
                            onChange={(e) => handleUpdateFaq(idx, 'answer', e.target.value)}
                            className="w-full rounded-lg border border-white/10 bg-white/5 p-2 text-white focus:outline-none leading-relaxed"
                            placeholder="Detailed explanation..."
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── TAB 9: CANCELLATION POLICY ── */}
              {activeTab === 'cancellation' && (
                <div className="space-y-6 text-xs">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <div>
                      <span className="font-semibold text-white flex items-center gap-1.5">
                        <RotateCcw className="h-4 w-4 text-[#d98f5b]" />
                        <span>Cancellation & Rescheduling Policy Tiers</span>
                      </span>
                      <p className="text-[11px] text-white/50">Custom policy cards rendered on the package detail page</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddCancellationTier}
                      className="flex items-center gap-1.5 rounded-xl bg-[#d98f5b]/20 px-3 py-1.5 text-xs font-bold text-[#d98f5b] hover:bg-[#d98f5b]/30"
                    >
                      <PlusCircle className="h-3.5 w-3.5" />
                      <span>+ Add Tier</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {(formData.cancellationPolicy || []).map((tier, idx) => (
                      <div key={idx} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 space-y-3 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2">
                            <span className="font-bold text-[#d98f5b]">Policy Tier #{idx + 1}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveCancellationTier(idx)}
                              className="text-red-400 hover:text-red-300 p-1"
                              title="Delete Tier"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          <div className="space-y-2">
                            <div>
                              <label className="block text-white/50 mb-1">Time Window *</label>
                              <input
                                type="text"
                                value={tier.window}
                                onChange={(e) => handleUpdateCancellationTier(idx, 'window', e.target.value)}
                                className="w-full rounded-lg border border-white/10 bg-white/5 p-2 text-white focus:outline-none"
                                placeholder="e.g. 30+ Days Prior"
                              />
                            </div>

                            <div>
                              <label className="block text-white/50 mb-1">Refund % or Status *</label>
                              <input
                                type="text"
                                value={tier.refund}
                                onChange={(e) => handleUpdateCancellationTier(idx, 'refund', e.target.value)}
                                className="w-full rounded-lg border border-white/10 bg-white/5 p-2 text-white focus:outline-none"
                                placeholder="e.g. 90% Refund"
                              />
                            </div>

                            <div>
                              <label className="block text-white/50 mb-1">Policy Note / Rationale *</label>
                              <textarea
                                rows={2}
                                value={tier.note}
                                onChange={(e) => handleUpdateCancellationTier(idx, 'note', e.target.value)}
                                className="w-full rounded-lg border border-white/10 bg-white/5 p-2 text-white focus:outline-none"
                                placeholder="e.g. Only a minimal administrative fee applies..."
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── TAB 10: GOOGLE SEO & SERP PREVIEW ── */}
              {activeTab === 'seo' && (
                <div className="space-y-5 text-xs">
                  {/* Google SERP Simulator Box */}
                  <div className="rounded-2xl border border-white/15 bg-white p-5 text-black shadow-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="h-4 w-4 text-blue-600" />
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Live Google Search Result Preview
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="text-[11px] text-[#202124]">
                        https://theindianwings.com/packages/{formData.slug || 'package-slug'}
                      </div>
                      <h4 className="text-base font-medium text-[#1a0dab] hover:underline cursor-pointer line-clamp-1">
                        {formData.metaTitle || `${formData.title || 'Package Title'} (${formData.duration}) | The Indian Wings Company`}
                      </h4>
                      <p className="text-xs text-[#4d5156] line-clamp-2">
                        {formData.metaDescription ||
                          `Book ${formData.title || 'package'} starting at ₹${formData.startingPrice?.toLocaleString('en-IN')}/person. Verified stays, private sanitized cab, and 24/7 ground assistance in Kashmir.`}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/60 mb-1 font-medium">Custom URL Slug</label>
                    <input
                      type="text"
                      value={formData.slug || ''}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-white font-mono focus:border-[#d98f5b] focus:outline-none"
                      placeholder="e.g. kashmir-classic-odyssey-6d-5n"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-white/60 font-medium">SEO Meta Title</label>
                      <span
                        className={`text-[10px] font-mono ${
                          (formData.metaTitle?.length || 0) > 60
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }`}
                      >
                        {formData.metaTitle?.length || 0} / 60 characters
                      </span>
                    </div>
                    <input
                      type="text"
                      value={formData.metaTitle || ''}
                      onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-white focus:border-[#d98f5b] focus:outline-none"
                      placeholder="Leave blank to use dynamic title template"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-white/60 font-medium">SEO Meta Description</label>
                      <span
                        className={`text-[10px] font-mono ${
                          (formData.metaDescription?.length || 0) > 160
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }`}
                      >
                        {formData.metaDescription?.length || 0} / 160 characters
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      value={formData.metaDescription || ''}
                      onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-white focus:border-[#d98f5b] focus:outline-none"
                      placeholder="Optimal length between 140 and 160 characters for maximum Google click-through."
                    />
                  </div>

                  <div className="pt-2">
                    <label className="flex items-center gap-2 cursor-pointer text-white">
                      <input
                        type="checkbox"
                        checked={formData.noIndex ?? false}
                        onChange={(e) => setFormData({ ...formData, noIndex: e.target.checked })}
                        className="h-4 w-4 rounded accent-red-500"
                      />
                      <span>NoIndex: Hide this package from Google Search engines (e.g. testing)</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Modal Footer Actions */}
              <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-white/10 px-5 py-2.5 text-xs text-white/60 hover:bg-white/5 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#d98f5b] to-[#EA580C] px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-[#d98f5b]/25 hover:brightness-110 disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  <span>{modalMode === 'create' ? 'Publish Package' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Create Category Modal ── */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-3xl border border-white/15 bg-[#0B1F2A] shadow-2xl p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-playfair text-base font-bold text-white">Create New Package Category</h3>
              <button onClick={() => setIsCatModalOpen(false)} className="text-white/40 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="block text-white/60 mb-1 font-medium">Category Name *</label>
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-white focus:border-[#d98f5b] focus:outline-none"
                  placeholder="e.g. Luxury Honeymoon, Winter Specials"
                />
              </div>

              <div>
                <label className="block text-white/60 mb-1 font-medium">Short Description</label>
                <textarea
                  rows={2}
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-white focus:border-[#d98f5b] focus:outline-none"
                  placeholder="Describe the themes or target travelers for this category."
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCatModalOpen(false)}
                  className="rounded-xl border border-white/10 px-4 py-2 text-white/60 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCatSaving}
                  className="flex items-center gap-1.5 rounded-xl bg-[#d98f5b] px-5 py-2 font-bold text-white shadow-md hover:brightness-110 disabled:opacity-50"
                >
                  {isCatSaving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>Create Category</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
