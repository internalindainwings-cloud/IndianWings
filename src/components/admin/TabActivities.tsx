'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  MapPin,
  Sparkles,
  Loader2,
  X,
  Save,
  Compass,
} from 'lucide-react';
import type { EnrichedActivity } from '@/lib/activities-service';
import type { AdventureActivityItem } from '@/data/activities-data';

export const TabActivities: React.FC = () => {
  const [activities, setActivities] = useState<EnrichedActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<EnrichedActivity>>({
    name: '',
    slug: '',
    location: 'Gulmarg',
    category: 'Snow & Winter',
    duration: '2-4 hrs',
    difficulty: 'Moderate',
    season: 'All Year',
    imageUrl: '/images/gallery/gulmarg-snow.jpg',
    tags: ['Certified Guide', 'Safety Gear Included'],
    badge: 'Popular',
    priceFrom: 1500,
    isActive: true,
    sortOrder: 0,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/activities');
      const json = await res.json();
      if (json.success && json.activities) {
        setActivities(json.activities);
      }
    } catch (err) {
      console.error('Failed to load activities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const categories = ['ALL', 'Snow & Winter', 'Water Sports', 'Aerial & Flying', 'Trails & Off-Road'];

  const filteredActivities = useMemo(() => {
    return activities.filter((a) => {
      const matchesSearch =
        a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCat =
        selectedCategory === 'ALL' ||
        a.category.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCat;
    });
  }, [activities, searchTerm, selectedCategory]);

  const handleOpenCreate = () => {
    setModalMode('create');
    setEditingId(null);
    setFormData({
      name: '',
      slug: '',
      location: 'Gulmarg',
      category: 'Snow & Winter',
      duration: '2-4 hrs',
      difficulty: 'Moderate',
      season: 'All Year',
      imageUrl: '/images/gallery/gulmarg-snow.jpg',
      tags: ['Certified Guide', 'Safety Equipment'],
      badge: 'Popular',
      priceFrom: 1500,
      isActive: true,
      sortOrder: activities.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (act: EnrichedActivity) => {
    setModalMode('edit');
    setEditingId(act.id);
    setFormData({ ...act });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    setIsSaving(true);

    try {
      const url =
        modalMode === 'create'
          ? '/api/admin/activities'
          : `/api/admin/activities/${editingId}`;
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
        alert(json.error || 'Failed to save activity');
      }
    } catch (err) {
      console.error('Error saving activity:', err);
      alert('Network error while saving activity');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/activities/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        await loadData();
      } else {
        alert(json.error || 'Failed to delete activity');
      }
    } catch (err) {
      console.error('Error deleting activity:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="border-b border-white/10 pb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#d98f5b] mb-1">
            <Compass className="h-4 w-4" />
            <span className="text-[11px] font-bold uppercase tracking-wider">Experiences Master</span>
          </div>
          <h2 className="font-playfair text-xl sm:text-2xl font-bold text-white">
            Adventure Activities & Sightseeing
          </h2>
          <p className="mt-1 text-xs text-white/60">
            Manage adventure sports, pricing per person, seasonal difficulty, and certified inclusions.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#d98f5b] to-[#EA580C] px-4 py-2 text-xs font-bold text-white shadow-lg shadow-[#d98f5b]/20 transition-all hover:brightness-110 active:scale-95 self-start md:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>New Activity</span>
        </button>
      </div>

      {/* ── Filters & Search ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-[#d98f5b] text-white shadow-md'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              {cat === 'ALL' ? `All Activities (${activities.length})` : cat}
            </button>
          ))}
        </div>

        <div className="relative min-w-[220px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Search activity, location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 py-1.5 pl-9 pr-3 text-xs text-white placeholder-white/30 focus:border-[#d98f5b] focus:outline-none"
          />
        </div>
      </div>

      {/* ── Data Table ── */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0B1F2A]/60 shadow-xl backdrop-blur-md">
        {loading ? (
          <div className="flex items-center justify-center p-12 text-white/50 gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-[#d98f5b]" />
            <span className="text-xs">Loading activities database...</span>
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="p-12 text-center text-xs text-white/40">
            No activities found. Click &quot;New Activity&quot; to add one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-white/80">
              <thead className="border-b border-white/10 bg-white/[0.02] text-[10px] font-semibold uppercase tracking-wider text-white/40">
                <tr>
                  <th className="px-5 py-3.5">Activity</th>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5">Location</th>
                  <th className="px-5 py-3.5">Duration</th>
                  <th className="px-5 py-3.5">Starting Price</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredActivities.map((a) => (
                  <tr key={a.id} className="transition-colors hover:bg-white/[0.02]">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-16 shrink-0 rounded-lg overflow-hidden border border-white/10 bg-black/40">
                          <Image
                            src={a.imageUrl || '/images/gallery/gulmarg-snow.jpg'}
                            alt={a.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-semibold text-white flex items-center gap-1.5">
                            <span>{a.name}</span>
                            {a.badge && (
                              <span className="rounded-full bg-[#d98f5b]/20 px-2 py-0.5 text-[9px] font-bold text-[#d98f5b]">
                                {a.badge}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-white/40 mt-0.5">
                            {a.tags.slice(0, 2).join(' • ')}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-block rounded-md bg-white/5 px-2.5 py-1 text-[11px] font-medium text-white/70">
                        {a.category}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-white/70">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-[#d98f5b]" />
                        <span>{a.location}</span>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-white/70 font-mono text-[11px]">
                      {a.duration}
                    </td>

                    <td className="px-5 py-4 font-mono font-bold text-white">
                      ₹{a.priceFrom.toLocaleString('en-IN')}
                    </td>

                    <td className="px-5 py-4">
                      {a.isActive ? (
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
                          onClick={() => handleOpenEdit(a)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                          title="Edit Activity"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(a.id, a.name)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                          title="Delete Activity"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl border border-white/15 bg-[#0B1F2A] shadow-2xl overflow-hidden my-8">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-white/[0.02]">
              <div>
                <h3 className="font-playfair text-lg font-bold text-white">
                  {modalMode === 'create' ? 'Add Adventure Activity' : `Edit: ${formData.name}`}
                </h3>
                <p className="text-xs text-white/40">Configure activity details, pricing, and certified gear</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/60 mb-1 font-medium">Activity Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Alpine Skiing & Snowboarding"
                    className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-white focus:border-[#d98f5b] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white/60 mb-1 font-medium">Category</label>
                  <select
                    value={formData.category || 'Snow & Winter'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as AdventureActivityItem['category'] })}
                    className="w-full rounded-xl border border-white/10 bg-[#07131B] p-2.5 text-white focus:border-[#d98f5b] focus:outline-none"
                  >
                    <option value="Snow & Winter">Snow & Winter</option>
                    <option value="Water Sports">Water Sports</option>
                    <option value="Aerial & Flying">Aerial & Flying</option>
                    <option value="Trails & Off-Road">Trails & Off-Road</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-white/60 mb-1 font-medium">Location</label>
                  <input
                    type="text"
                    value={formData.location || ''}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Gulmarg (Mt. Apharwat)"
                    className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-white focus:border-[#d98f5b] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white/60 mb-1 font-medium">Duration</label>
                  <input
                    type="text"
                    value={formData.duration || ''}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="2–4 hrs"
                    className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-white focus:border-[#d98f5b] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white/60 mb-1 font-medium">Starting Price (₹)</label>
                  <input
                    type="number"
                    value={formData.priceFrom || 1500}
                    onChange={(e) => setFormData({ ...formData, priceFrom: Number(e.target.value) })}
                    placeholder="1500"
                    className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-white focus:border-[#d98f5b] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-white/60 mb-1 font-medium">Difficulty Level</label>
                  <input
                    type="text"
                    value={formData.difficulty || ''}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    placeholder="Beginner to Pro"
                    className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-white focus:border-[#d98f5b] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white/60 mb-1 font-medium">Best Season</label>
                  <input
                    type="text"
                    value={formData.season || ''}
                    onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                    placeholder="Dec – April"
                    className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-white focus:border-[#d98f5b] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white/60 mb-1 font-medium">Ribbon Badge</label>
                  <input
                    type="text"
                    value={formData.badge || ''}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="World Class, Top Thrill"
                    className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-white focus:border-[#d98f5b] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/60 mb-1 font-medium">Image URL</label>
                <input
                  type="text"
                  value={formData.imageUrl || ''}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="/images/gallery/gulmarg-snow.jpg"
                  className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-white focus:border-[#d98f5b] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-white/60 mb-1 font-medium">Key Highlights & Safety Tags (Comma separated)</label>
                <input
                  type="text"
                  value={(formData.tags || []).join(', ')}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tags: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  placeholder="Certified Instructor, All Gear Included, Helmet & Vests"
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
                  <span>Save Activity</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
