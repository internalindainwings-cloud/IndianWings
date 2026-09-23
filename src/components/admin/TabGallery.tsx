'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import {
  Image as ImageIcon,
  Video,
  Plus,
  Trash2,
  Edit2,
  Upload,
  Eye,
  EyeOff,
  Loader2,
  X,
  Save,
  CheckCircle2,
  Play,
  MapPin,
  ExternalLink,
  Film,
  RefreshCw,
  FolderPlus,
  Tag,
  SlidersHorizontal,
  Cloud,
  Layers,
} from 'lucide-react';
import type { GalleryItem, GalleryCategory } from '@/lib/gallery-categories-constants';
import { DEFAULT_GALLERY_CATEGORIES } from '@/lib/gallery-categories-constants';
import { optimizeCloudinaryUrl } from '@/lib/utilities/cloudinary';

export const TabGallery: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [categories, setCategories] = useState<GalleryCategory[]>(DEFAULT_GALLERY_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'ALL' | 'image' | 'video'>('ALL');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'HIDDEN'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Sync state
  const [isSyncingCloudinary, setIsSyncingCloudinary] = useState(false);
  const [syncBanner, setSyncBanner] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Category Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('🏔️');
  const [isAddingCat, setIsAddingCat] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [isUploadingPoster, setIsUploadingPoster] = useState(false);

  // Preview Modal
  const [previewItem, setPreviewItem] = useState<GalleryItem | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<GalleryItem>>({
    title: '',
    type: 'image',
    url: '',
    posterUrl: '',
    category: 'dal-lake',
    categoryLabel: 'Dal Lake & Houseboats',
    location: 'Dal Lake, Srinagar',
    duration: '',
    caption: '',
    isFeatured: true,
    isActive: true,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const posterInputRef = useRef<HTMLInputElement>(null);

  const loadCategories = async () => {
    try {
      const res = await fetch('/api/admin/gallery/categories');
      const json = await res.json();
      if (json.success && Array.isArray(json.categories)) {
        setCategories(json.categories);
      }
    } catch (err) {
      console.warn('Failed to load categories:', err);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/gallery');
      const json = await res.json();
      if (json.success && json.items) {
        setItems(json.items);
      }
    } catch (err) {
      console.error('Failed to load gallery items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
    loadData();
  }, []);

  const handleSyncCloudinary = async () => {
    setIsSyncingCloudinary(true);
    setSyncBanner(null);
    try {
      const res = await fetch('/api/admin/gallery/sync-cloudinary', { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        setSyncBanner({
          text: `Cloudinary Sync Complete! Found and synced ${json.totalCount} total assets (${json.addedCount} newly added).`,
          type: 'success',
        });
        await loadData();
      } else {
        setSyncBanner({ text: json.error || 'Sync failed', type: 'error' });
      }
    } catch (err) {
      setSyncBanner({ text: 'Network error during Cloudinary synchronization', type: 'error' });
    } finally {
      setIsSyncingCloudinary(false);
      setTimeout(() => setSyncBanner(null), 8000);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    setIsAddingCat(true);
    try {
      const res = await fetch('/api/admin/gallery/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCatName.trim(), icon: newCatIcon.trim() || '🏷️' }),
      });
      const json = await res.json();
      if (json.success && json.category) {
        setCategories((prev) => [...prev, json.category]);
        setNewCatName('');
        setNewCatIcon('🏔️');
      } else {
        alert(json.error || 'Failed to create category');
      }
    } catch (err) {
      alert('Error creating category');
    } finally {
      setIsAddingCat(false);
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (id === 'all') {
      alert('Cannot delete the default "All Media" category.');
      return;
    }
    if (!confirm(`Are you sure you want to delete the "${name}" category? Items in this category will not be deleted.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/gallery/categories/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
      } else {
        alert(json.error || 'Failed to delete category');
      }
    } catch (err) {
      alert('Error deleting category');
    }
  };

  const handleToggleActive = async (item: GalleryItem) => {
    const nextStatus = !item.isActive;
    // Optimistic UI update
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, isActive: nextStatus } : i)));

    try {
      const res = await fetch(`/api/admin/gallery/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: nextStatus }),
      });
      const json = await res.json();
      if (!json.success) {
        // Revert on error
        setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, isActive: item.isActive } : i)));
        alert(json.error || 'Failed to update visibility');
      }
    } catch (err) {
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, isActive: item.isActive } : i)));
      alert('Network error updating item');
    }
  };

  const handleQuickChangeCategory = async (itemId: string, newCategoryId: string) => {
    const matched = categories.find((c) => c.id === newCategoryId);
    const categoryLabel = matched?.name || newCategoryId;

    setItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, category: newCategoryId, categoryLabel } : i))
    );

    try {
      await fetch(`/api/admin/gallery/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: newCategoryId, categoryLabel }),
      });
    } catch (err) {
      console.error('Error changing category:', err);
    }
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesType = filterType === 'ALL' || item.type === filterType;
      const matchesCat = activeCategoryFilter === 'ALL' || item.category === activeCategoryFilter;
      const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'ACTIVE' && item.isActive) ||
        (statusFilter === 'HIDDEN' && !item.isActive);
      const matchesSearch =
        !searchQuery ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesType && matchesCat && matchesStatus && matchesSearch;
    });
  }, [items, filterType, activeCategoryFilter, statusFilter, searchQuery]);

  const handleOpenCreate = () => {
    setModalMode('create');
    setEditingId(null);
    setFormData({
      title: '',
      type: 'image',
      url: '',
      posterUrl: '',
      category: categories[1]?.id || 'dal-lake',
      categoryLabel: categories[1]?.name || 'Dal Lake & Houseboats',
      location: 'Kashmir Valley',
      duration: '',
      caption: '',
      isFeatured: true,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: GalleryItem) => {
    setModalMode('edit');
    setEditingId(item.id);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'url' | 'posterUrl') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (field === 'url') setIsUploadingFile(true);
    if (field === 'posterUrl') setIsUploadingPoster(true);

    try {
      const body = new FormData();
      body.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body,
      });
      const json = await res.json();
      if (json.success && json.url) {
        setFormData((prev) => ({ ...prev, [field]: json.url }));
        if (field === 'url' && (!formData.posterUrl || formData.posterUrl === formData.url)) {
          if (file.type.startsWith('image/')) {
            setFormData((prev) => ({ ...prev, posterUrl: json.url }));
          }
        }
      } else {
        alert(json.error || 'Upload failed');
      }
    } catch (err) {
      alert('Network error while uploading');
    } finally {
      if (field === 'url') setIsUploadingFile(false);
      if (field === 'posterUrl') setIsUploadingPoster(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.url) {
      alert('Please provide a title and media file/URL.');
      return;
    }

    setIsSaving(true);
    try {
      const selectedCat = categories.find((c) => c.id === formData.category);
      const payload = {
        ...formData,
        categoryLabel: selectedCat?.name || formData.category,
      };

      if (modalMode === 'create') {
        const res = await fetch('/api/admin/gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (json.success && json.item) {
          setItems((prev) => [json.item, ...prev]);
          setIsModalOpen(false);
        } else {
          alert(json.error || 'Failed to create item');
        }
      } else if (modalMode === 'edit' && editingId) {
        const res = await fetch(`/api/admin/gallery/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (json.success && json.item) {
          setItems((prev) => prev.map((i) => (i.id === editingId ? json.item : i)));
          setIsModalOpen(false);
        } else {
          alert(json.error || 'Failed to update item');
        }
      }
    } catch (err) {
      alert('Error saving gallery item');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/gallery/${id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        setItems((prev) => prev.filter((i) => i.id !== id));
      } else {
        alert(json.error || 'Failed to delete item');
      }
    } catch (err) {
      alert('Network error deleting item');
    }
  };

  const isRemoteUnconfigured = (url: string) => {
    if (!url || url.startsWith('/')) return false;
    return !url.includes('cloudinary.com') && !url.includes('unsplash.com');
  };

  return (
    <div className="space-y-6">
      {/* ── Top Header & Action Controls ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h2 className="font-playfair text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
            <span>Kashmir Media Gallery</span>
            <span className="rounded-full bg-saffron/20 border border-saffron/30 px-2.5 py-0.5 text-xs text-saffron font-mono font-bold">
              {items.length} Assets
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-white/60 mt-1">
            Choose which Cloudinary images/videos appear live, categorize them, and create custom categories.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Cloudinary Sync Button */}
          <button
            type="button"
            onClick={handleSyncCloudinary}
            disabled={isSyncingCloudinary}
            className="rounded-xl border border-sky-400/40 bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 px-3.5 py-2 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
            title="Fetch all photos and videos directly from your Cloudinary account"
          >
            {isSyncingCloudinary ? (
              <Loader2 className="h-4 w-4 animate-spin text-sky-400" />
            ) : (
              <Cloud className="h-4 w-4 text-sky-400" />
            )}
            <span>{isSyncingCloudinary ? 'Syncing...' : 'Sync Cloudinary Images'}</span>
          </button>

          {/* Manage Categories Button */}
          <button
            type="button"
            onClick={() => setIsCategoryModalOpen(true)}
            className="rounded-xl border border-amber-400/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 px-3.5 py-2 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Layers className="h-4 w-4 text-amber-400" />
            <span>Manage Categories ({categories.length})</span>
          </button>

          {/* Add New Media Button */}
          <button
            type="button"
            onClick={handleOpenCreate}
            className="rounded-xl bg-saffron hover:bg-saffron/90 text-midnight px-4 py-2 text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Plus size={15} />
            <span>Upload New Media</span>
          </button>
        </div>
      </div>

      {/* Sync Banner Notification */}
      {syncBanner && (
        <div
          className={`p-3.5 rounded-xl border text-xs font-medium flex items-center justify-between gap-3 ${
            syncBanner.type === 'success'
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
              : 'bg-red-500/15 border-red-500/30 text-red-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{syncBanner.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setSyncBanner(null)}
            className="text-white/40 hover:text-white"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* ── Summary Statistics ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="rounded-xl border border-white/10 bg-[#0B1F2A]/60 p-3.5 backdrop-blur-md">
          <span className="text-[11px] text-white/50 block">Total Assets</span>
          <span className="text-xl font-bold text-white font-mono mt-0.5 block">{items.length}</span>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#0B1F2A]/60 p-3.5 backdrop-blur-md">
          <span className="text-[11px] text-white/50 block">Live in Gallery</span>
          <span className="text-xl font-bold text-emerald-400 font-mono mt-0.5 block">
            {items.filter((i) => i.isActive).length}
          </span>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#0B1F2A]/60 p-3.5 backdrop-blur-md">
          <span className="text-[11px] text-white/50 block">Hidden from Public</span>
          <span className="text-xl font-bold text-amber-400 font-mono mt-0.5 block">
            {items.filter((i) => !i.isActive).length}
          </span>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#0B1F2A]/60 p-3.5 backdrop-blur-md">
          <span className="text-[11px] text-white/50 block">Dynamic Categories</span>
          <span className="text-xl font-bold text-saffron font-mono mt-0.5 block">
            {categories.length}
          </span>
        </div>
      </div>

      {/* ── Filter Bar ── */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-white/[0.02] p-3 rounded-2xl border border-white/10">
        <div className="flex flex-wrap items-center gap-2">
          {/* Type Filter */}
          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
            {[
              { id: 'ALL', label: 'All' },
              { id: 'image', label: 'Photos' },
              { id: 'video', label: 'Videos' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id as any)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  filterType === tab.id
                    ? 'bg-saffron text-midnight font-bold'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
            {[
              { id: 'ALL', label: 'All Status' },
              { id: 'ACTIVE', label: 'Live' },
              { id: 'HIDDEN', label: 'Hidden' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id as any)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  statusFilter === tab.id
                    ? 'bg-saffron text-midnight font-bold'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Category Dropdown */}
          <select
            value={activeCategoryFilter}
            onChange={(e) => setActiveCategoryFilter(e.target.value)}
            className="rounded-xl border border-white/10 bg-[#0B1F2A] px-3 py-1.5 text-xs text-white focus:border-saffron focus:outline-none"
          >
            <option value="ALL">All Categories ({items.length})</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon || '•'} {cat.name} ({items.filter((i) => i.category === cat.id).length})
              </option>
            ))}
          </select>
        </div>

        {/* Search Input */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by title, location..."
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white placeholder:text-white/40 focus:border-saffron focus:outline-none w-full lg:w-64"
        />
      </div>

      {/* ── Media Items Grid View ── */}
      <div className="rounded-2xl border border-white/10 bg-[#0B1F2A]/60 shadow-xl backdrop-blur-md overflow-hidden p-4 sm:p-5">
        {loading ? (
          <div className="flex items-center justify-center p-16 text-white/50 gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-saffron" />
            <span className="text-xs">Loading media gallery items...</span>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-16 text-center text-xs text-white/40">
            No gallery items found matching your filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredItems.map((item) => {
              const optimizedImg = optimizeCloudinaryUrl(item.posterUrl || item.url);

              return (
                <div
                  key={item.id}
                  className={`group relative rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col justify-between ${
                    item.isActive
                      ? 'border-white/10 bg-white/[0.03] hover:border-white/20'
                      : 'border-white/5 bg-black/40 opacity-75 hover:opacity-100'
                  }`}
                >
                  {/* Media Thumbnail Container */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/60">
                    <Image
                      src={optimizedImg}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 300px"
                      unoptimized={isRemoteUnconfigured(optimizedImg)}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 pointer-events-none" />

                    {/* Top Badges */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-xs ${
                          item.type === 'video'
                            ? 'bg-blue-600/90 text-white border border-blue-400/30'
                            : 'bg-emerald-600/90 text-white border border-emerald-400/30'
                        }`}
                      >
                        {item.type === 'video' ? <Video size={10} /> : <ImageIcon size={10} />}
                        <span>{item.type}</span>
                      </span>

                      {/* Live Toggle Pill */}
                      <button
                        type="button"
                        onClick={() => handleToggleActive(item)}
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold flex items-center gap-1 shadow-md transition-all cursor-pointer backdrop-blur-md ${
                          item.isActive
                            ? 'bg-emerald-500 text-midnight hover:bg-emerald-400'
                            : 'bg-amber-500/90 text-midnight hover:bg-amber-400'
                        }`}
                        title={item.isActive ? 'Visible on Website. Click to hide.' : 'Hidden from Website. Click to make live.'}
                      >
                        {item.isActive ? <Eye size={10} /> : <EyeOff size={10} />}
                        <span>{item.isActive ? 'Live' : 'Hidden'}</span>
                      </button>
                    </div>

                    {/* Play Button for Video or Preview */}
                    <button
                      type="button"
                      onClick={() => setPreviewItem(item)}
                      className="absolute inset-0 flex items-center justify-center group-hover:bg-black/30 transition-colors cursor-pointer"
                    >
                      {item.type === 'video' ? (
                        <div className="w-11 h-11 rounded-full bg-saffron text-midnight flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                          <Play size={18} fill="currentColor" className="ml-0.5" />
                        </div>
                      ) : (
                        <div className="opacity-0 group-hover:opacity-100 w-9 h-9 rounded-full bg-white/30 backdrop-blur-md text-white flex items-center justify-center transition-opacity">
                          <Eye size={16} />
                        </div>
                      )}
                    </button>

                    {/* Bottom Location Pill on Image */}
                    <div className="absolute bottom-2 left-2 pointer-events-none">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-midnight/80 backdrop-blur-md text-white text-[10px] font-medium border border-white/10">
                        <MapPin size={9} className="text-saffron" />
                        <span className="truncate max-w-[170px]">{item.location}</span>
                      </span>
                    </div>
                  </div>

                  {/* Card Info & Quick Categorization */}
                  <div className="p-3.5 flex flex-col justify-between flex-grow space-y-3">
                    <div>
                      <h3 className="font-manrope font-bold text-white text-xs sm:text-[13px] leading-snug line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="text-[11px] text-white/50 line-clamp-2 mt-1">
                        {item.caption || 'No description provided.'}
                      </p>
                    </div>

                    {/* Quick Category Selector */}
                    <div className="pt-2 border-t border-white/10 space-y-2">
                      <div className="flex items-center justify-between gap-1.5">
                        <span className="text-[10px] uppercase font-semibold text-white/40">Category:</span>
                        <select
                          value={item.category}
                          onChange={(e) => handleQuickChangeCategory(item.id, e.target.value)}
                          className="rounded-lg border border-white/10 bg-black/40 px-2 py-1 text-[11px] text-saffron focus:border-saffron focus:outline-none max-w-[140px] truncate"
                        >
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id} className="bg-midnight text-white">
                              {cat.icon || ''} {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center justify-between pt-1 border-t border-white/5">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(item)}
                          className={`text-[10.5px] font-semibold transition-colors cursor-pointer ${
                            item.isActive ? 'text-emerald-400 hover:text-emerald-300' : 'text-amber-400 hover:text-amber-300'
                          }`}
                        >
                          {item.isActive ? '✓ Showing in Gallery' : '✗ Hidden in Vault'}
                        </button>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-colors cursor-pointer"
                            title="Edit details"
                          >
                            <Edit2 size={13} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(item.id, item.title)}
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/25 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                            title="Delete item"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Category Management Modal ── */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-8 overflow-hidden">
          <div className="relative w-full max-w-xl max-h-full flex flex-col rounded-3xl border border-white/15 bg-[#0B1F2A] shadow-2xl overflow-hidden">
            <div className="p-6 flex items-center justify-between border-b border-white/10 shrink-0">
              <div>
                <h3 className="font-playfair text-lg font-bold text-white flex items-center gap-2">
                  <Layers className="text-saffron h-5 w-5" />
                  <span>Manage Gallery Categories</span>
                </h3>
                <p className="text-xs text-white/50 mt-0.5">
                  Create new dynamic categories or remove ones you no longer need.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 hover:bg-white/10 hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto flex-1">
            {/* Add Category Form */}
            <form onSubmit={handleCreateCategory} className="space-y-3 bg-white/[0.03] p-4 rounded-2xl border border-white/10">
              <span className="text-xs font-bold text-white block">Add New Category</span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newCatIcon}
                  onChange={(e) => setNewCatIcon(e.target.value)}
                  placeholder="Emoji"
                  className="w-16 rounded-xl border border-white/10 bg-white/5 px-2.5 py-2 text-sm text-center text-white focus:border-saffron focus:outline-none"
                  maxLength={4}
                />
                <input
                  type="text"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="Category Name (e.g. Winter Snow, Houseboats)"
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder:text-white/40 focus:border-saffron focus:outline-none"
                  required
                />
                <button
                  type="submit"
                  disabled={isAddingCat || !newCatName.trim()}
                  className="px-4 py-2 rounded-xl bg-saffron text-midnight font-bold text-xs hover:bg-saffron/90 disabled:opacity-50 cursor-pointer shrink-0"
                >
                  {isAddingCat ? 'Adding...' : 'Add'}
                </button>
              </div>
            </form>

            {/* Existing Categories List */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-white/60 block">Existing Categories</span>
              <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                {categories.map((cat) => {
                  const count = items.filter((i) => i.category === cat.id).length;
                  return (
                    <div
                      key={cat.id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{cat.icon || '🏷️'}</span>
                        <span className="font-semibold">{cat.name}</span>
                        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/60">
                          {count} items
                        </span>
                      </div>

                      {cat.id !== 'all' && (
                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(cat.id, cat.name)}
                          className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer"
                          title="Delete category"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            </div>

            <div className="p-6 border-t border-white/10 shrink-0 flex justify-end">
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add / Edit Modal Form ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-8 overflow-hidden">
          <div className="relative w-full max-w-2xl max-h-full flex flex-col rounded-3xl border border-white/15 bg-[#0B1F2A] shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-white/[0.02] shrink-0">
              <div>
                <h3 className="font-playfair text-lg font-bold text-white">
                  {modalMode === 'create' ? 'Upload & Add New Media' : `Edit: ${formData.title}`}
                </h3>
                <p className="text-xs text-white/50">
                  Upload an image or video from your device, or provide a URL
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 hover:bg-white/10 hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Title */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-white/70">Media Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Sunrise Shikara Cruise on Dal Lake"
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder:text-white/30 focus:border-saffron focus:outline-none"
                  />
                </div>

                {/* Type */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white/70">Media Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full rounded-xl border border-white/10 bg-[#0B1F2A] px-3 py-2 text-xs text-white focus:border-saffron focus:outline-none"
                  >
                    <option value="image">Photo (Still Image)</option>
                    <option value="video">Video (Reel / MP4)</option>
                  </select>
                </div>

                {/* Dynamic Category */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white/70">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => {
                      const selected = categories.find((c) => c.id === e.target.value);
                      setFormData({
                        ...formData,
                        category: e.target.value,
                        categoryLabel: selected?.name || e.target.value,
                      });
                    }}
                    className="w-full rounded-xl border border-white/10 bg-[#0B1F2A] px-3 py-2 text-xs text-white focus:border-saffron focus:outline-none"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon || '•'} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white/70">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Gulmarg Phase 2 (13,780 ft)"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder:text-white/30 focus:border-saffron focus:outline-none"
                  />
                </div>

                {/* Duration */}
                {formData.type === 'video' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-white/70">Video Duration</label>
                    <input
                      type="text"
                      value={formData.duration || ''}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="e.g. 0:25"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder:text-white/30 focus:border-saffron focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Media URL / Upload */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-white/70">
                    {formData.type === 'video' ? 'Video File / URL *' : 'Photo File / URL *'}
                  </label>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingFile}
                    className="text-xs font-bold text-saffron hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    {isUploadingFile ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Upload size={12} />
                    )}
                    <span>{isUploadingFile ? 'Uploading...' : 'Upload File from Device'}</span>
                  </button>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => handleFileUpload(e, 'url')}
                  accept={formData.type === 'video' ? 'video/*' : 'image/*'}
                  className="hidden"
                />

                <input
                  type="text"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://res.cloudinary.com/... or /uploads/gallery/..."
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder:text-white/30 focus:border-saffron focus:outline-none"
                />
              </div>

              {/* Caption */}
              <div className="space-y-1.5 pt-2 border-t border-white/10">
                <label className="text-xs font-semibold text-white/70">Description / Caption</label>
                <textarea
                  rows={2}
                  value={formData.caption || ''}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  placeholder="Short, authentic summary of this mountain highlight..."
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder:text-white/30 focus:border-saffron focus:outline-none resize-none"
                />
              </div>

              {/* Checkboxes */}
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="h-4 w-4 rounded accent-saffron"
                  />
                  <span className="text-xs text-white">Active in Gallery (Visible to Visitors)</span>
                </label>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white/70 hover:bg-white/10 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-xl bg-saffron hover:bg-saffron/90 text-midnight px-5 py-2 text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  <span>{isSaving ? 'Saving...' : 'Save Media Item'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Quick Live Preview Modal ── */}
      {previewItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-8 overflow-hidden"
          onClick={() => setPreviewItem(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-full flex flex-col rounded-2xl overflow-hidden bg-[#0A1620] border border-white/15 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-midnight/80 shrink-0">
              <span className="text-white text-xs font-bold truncate">{previewItem.title}</span>
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                className="text-white/40 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[300px]">
              {previewItem.type === 'video' ? (
                <video
                  src={optimizeCloudinaryUrl(previewItem.url)}
                  poster={optimizeCloudinaryUrl(previewItem.posterUrl)}
                  controls
                  autoPlay
                  className="w-full max-h-[70vh] object-contain"
                />
              ) : (
                <div className="relative w-full h-[500px]">
                  <Image
                    src={optimizeCloudinaryUrl(previewItem.url)}
                    alt={previewItem.title}
                    fill
                    className="object-contain"
                    unoptimized={isRemoteUnconfigured(previewItem.url)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TabGallery;
