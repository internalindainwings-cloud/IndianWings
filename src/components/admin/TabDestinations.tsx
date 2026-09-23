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
  MapPin,
  Sparkles,
  Loader2,
  X,
  Save,
  Mountain,
} from 'lucide-react';
import type { EnrichedDestination } from '@/lib/destinations-service';

export const TabDestinations: React.FC = () => {
  const [destinations, setDestinations] = useState<EnrichedDestination[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<EnrichedDestination>>({
    name: '',
    slug: '',
    region: 'Jammu & Kashmir',
    tagline: '',
    category: 'Iconic',
    imageUrl: '/images/gallery/shikara-dal-lake.jpg',
    elevation: '1,585 m (5,200 ft)',
    bestSeason: 'All Year Round',
    distanceFromSrinagar: '0 km',
    highlights: ['Scenic Lake Shikaras', 'Mountain Vistas'],
    description: '',
    packageCount: 5,
    isActive: true,
    sortOrder: 0,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/destinations');
      const json = await res.json();
      if (json.success && json.destinations) {
        setDestinations(json.destinations);
      }
    } catch (err) {
      console.error('Failed to load destinations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredDestinations = useMemo(() => {
    return destinations.filter((d) => {
      const matchesSearch =
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.tagline.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.slug.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCat =
        selectedCategory === 'ALL' ||
        d.category.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCat;
    });
  }, [destinations, searchTerm, selectedCategory]);

  const handleOpenCreate = () => {
    setModalMode('create');
    setEditingId(null);
    setFormData({
      name: '',
      slug: '',
      region: 'Jammu & Kashmir',
      tagline: '',
      category: 'Iconic',
      imageUrl: '/images/gallery/shikara-dal-lake.jpg',
      elevation: '1,585 m (5,200 ft)',
      bestSeason: 'All Year Round',
      distanceFromSrinagar: '0 km',
      highlights: ['Scenic Vistas', 'Local Culture'],
      description: '',
      packageCount: 5,
      isActive: true,
      sortOrder: destinations.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (dest: EnrichedDestination) => {
    setModalMode('edit');
    setEditingId(dest.id);
    setFormData({ ...dest });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.slug) return;
    setIsSaving(true);

    try {
      const url =
        modalMode === 'create'
          ? '/api/admin/destinations'
          : `/api/admin/destinations/${editingId}`;
      const method = modalMode === 'create' ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (json.success) {
        await loadData();
        setIsModalOpen(false);
      } else {
        alert(json.error || 'Failed to save destination');
      }
    } catch (err) {
      console.error('Error saving destination:', err);
      alert('Network error while saving destination');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/destinations/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        await loadData();
      } else {
        alert(json.error || 'Failed to delete destination');
      }
    } catch (err) {
      console.error('Error deleting destination:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="border-b border-white/10 pb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#d98f5b] mb-1">
            <Mountain className="h-4 w-4" />
            <span className="text-[11px] font-bold uppercase tracking-wider">Destinations Master</span>
          </div>
          <h2 className="font-playfair text-xl sm:text-2xl font-bold text-white">
            Kashmir Destinations & Valley Guides
          </h2>
          <p className="mt-1 text-xs text-white/60">
            Create, customize, and manage destination guides, elevations, best travel seasons, and gallery covers.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#d98f5b] to-[#EA580C] px-4 py-2 text-xs font-bold text-white shadow-lg shadow-[#d98f5b]/20 transition-all hover:brightness-110 active:scale-95 self-start md:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>New Destination</span>
        </button>
      </div>

      {/* ── Filter & Search Controls ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {['ALL', 'Iconic', 'Alpine', 'Off-Beat'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-[#d98f5b] text-white shadow-md'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              {cat === 'ALL' ? `All Destinations (${destinations.length})` : cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[220px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Search destination, tagline..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 py-1.5 pl-9 pr-3 text-xs text-white placeholder-white/30 focus:border-[#d98f5b] focus:outline-none"
          />
        </div>
      </div>

      {/* ── Destinations Table ── */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0B1F2A]/60 shadow-xl backdrop-blur-md">
        {loading ? (
          <div className="flex items-center justify-center p-12 text-white/50 gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-[#d98f5b]" />
            <span className="text-xs">Loading destinations database...</span>
          </div>
        ) : filteredDestinations.length === 0 ? (
          <div className="p-12 text-center text-xs text-white/40">
            No destinations found. Click &quot;New Destination&quot; to add one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-white/80">
              <thead className="border-b border-white/10 bg-white/[0.02] text-[10px] font-semibold uppercase tracking-wider text-white/40">
                <tr>
                  <th className="px-5 py-3.5">Destination</th>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5">Elevation</th>
                  <th className="px-5 py-3.5">Best Season</th>
                  <th className="px-5 py-3.5">Distance</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredDestinations.map((d) => (
                  <tr key={d.id} className="transition-colors hover:bg-white/[0.02]">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-16 shrink-0 rounded-lg overflow-hidden border border-white/10 bg-black/40">
                          <Image
                            src={d.imageUrl || '/images/gallery/shikara-dal-lake.jpg'}
                            alt={d.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <Link
                            href={`/destinations/${d.slug}`}
                            target="_blank"
                            className="font-semibold text-white hover:text-[#d98f5b] flex items-center gap-1 group"
                          >
                            <span>{d.name}</span>
                            <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Link>
                          <span className="text-[11px] text-white/40 line-clamp-1">
                            {d.tagline}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-block rounded-md bg-white/5 px-2.5 py-1 text-[11px] font-medium capitalize text-white/70">
                        {d.category}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-white/70 font-mono text-[11px]">
                      {d.elevation}
                    </td>

                    <td className="px-5 py-4 text-white/70 text-[11px]">
                      {d.bestSeason}
                    </td>

                    <td className="px-5 py-4 text-white/60 text-[11px]">
                      {d.distanceFromSrinagar}
                    </td>

                    <td className="px-5 py-4">
                      {d.isActive ? (
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

                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(d)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                          title="Edit Destination"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(d.id, d.name)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                          title="Delete Destination"
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

      {/* ── Modal Form ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-8 overflow-hidden">
          <div className="relative w-full max-w-2xl rounded-3xl border border-white/15 bg-[#0B1F2A] shadow-2xl max-h-full flex flex-col overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-white/[0.02] shrink-0">
              <div>
                <h3 className="font-playfair text-lg font-bold text-white">
                  {modalMode === 'create' ? 'Create New Destination' : `Edit: ${formData.name}`}
                </h3>
                <p className="text-xs text-white/40">Configure destination details, altitude, and highlights</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/60 mb-1 font-medium">Destination Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => {
                      const name = e.target.value;
                      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                      setFormData({ ...formData, name, slug: formData.slug ? formData.slug : slug });
                    }}
                    placeholder="e.g. Sonmarg"
                    className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-white focus:border-[#d98f5b] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white/60 mb-1 font-medium">URL Slug *</label>
                  <input
                    type="text"
                    required
                    value={formData.slug || ''}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                    placeholder="e.g. sonmarg"
                    className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-white focus:border-[#d98f5b] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/60 mb-1 font-medium">Tagline</label>
                <input
                  type="text"
                  value={formData.tagline || ''}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="e.g. Meadow of Gold & Gateway to Ladakh"
                  className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-white focus:border-[#d98f5b] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-white/60 mb-1 font-medium">Category</label>
                  <select
                    value={formData.category || 'Iconic'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as 'Iconic' | 'Alpine' | 'Off-Beat' })}
                    className="w-full rounded-xl border border-white/10 bg-[#07131B] p-2.5 text-white focus:border-[#d98f5b] focus:outline-none"
                  >
                    <option value="Iconic">Iconic</option>
                    <option value="Alpine">Alpine</option>
                    <option value="Off-Beat">Off-Beat</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/60 mb-1 font-medium">Elevation</label>
                  <input
                    type="text"
                    value={formData.elevation || ''}
                    onChange={(e) => setFormData({ ...formData, elevation: e.target.value })}
                    placeholder="2,740 m (8,990 ft)"
                    className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-white focus:border-[#d98f5b] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white/60 mb-1 font-medium">Distance from Srinagar</label>
                  <input
                    type="text"
                    value={formData.distanceFromSrinagar || ''}
                    onChange={(e) => setFormData({ ...formData, distanceFromSrinagar: e.target.value })}
                    placeholder="80 km (2.5 hrs)"
                    className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-white focus:border-[#d98f5b] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/60 mb-1 font-medium">Best Travel Season</label>
                <input
                  type="text"
                  value={formData.bestSeason || ''}
                  onChange={(e) => setFormData({ ...formData, bestSeason: e.target.value })}
                  placeholder="e.g. May – October (Trekking) / Dec – Feb (Snow)"
                  className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-white focus:border-[#d98f5b] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-white/60 mb-1 font-medium">Cover Image URL</label>
                <input
                  type="text"
                  value={formData.imageUrl || ''}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="/images/gallery/sonmarg-glacier.jpg"
                  className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-white focus:border-[#d98f5b] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-white/60 mb-1 font-medium">Highlights (Comma separated)</label>
                <input
                  type="text"
                  value={(formData.highlights || []).join(', ')}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      highlights: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  placeholder="Thajiwas Glacier, Trout Fishing, Zero Point"
                  className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-white focus:border-[#d98f5b] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-white/60 mb-1 font-medium">Description</label>
                <textarea
                  rows={3}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed description of the destination..."
                  className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-white focus:border-[#d98f5b] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-white">
                  <input
                    type="checkbox"
                    checked={formData.isActive ?? true}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="h-4 w-4 rounded accent-[#d98f5b]"
                  />
                  <span>Active (Visible on Website)</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-white/60 hover:text-white hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#d98f5b] to-[#EA580C] px-5 py-2 font-bold text-white shadow-lg shadow-[#d98f5b]/20 hover:brightness-110 active:scale-95 disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  <span>Save Destination</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
