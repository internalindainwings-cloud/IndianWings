'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import {
  Star,
  Video,
  MessageSquare,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  X,
  Save,
  CheckCircle2,
} from 'lucide-react';
import type { EnrichedReview } from '@/lib/reviews-service';

export const TabReviews: React.FC = () => {
  const [reviews, setReviews] = useState<EnrichedReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<EnrichedReview>>({
    name: '',
    city: 'Delhi',
    review: '',
    rating: 5,
    avatarUrl: '',
    type: 'written',
    videoUrl: '',
    videoDuration: '02:00',
    videoQuote: '',
    imageUrl: '',
    featured: true,
    isActive: true,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/reviews');
      const json = await res.json();
      if (json.success && json.reviews) {
        setReviews(json.reviews);
      }
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredReviews = useMemo(() => {
    if (selectedType === 'ALL') return reviews;
    return reviews.filter((r) => r.type === selectedType);
  }, [reviews, selectedType]);

  const handleOpenCreate = () => {
    setModalMode('create');
    setEditingId(null);
    setFormData({
      name: '',
      city: 'Delhi',
      review: '',
      rating: 5,
      avatarUrl: '',
      type: 'written',
      videoUrl: '',
      videoDuration: '01:45',
      videoQuote: '',
      imageUrl: '',
      featured: true,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (rev: EnrichedReview) => {
    setModalMode('edit');
    setEditingId(rev.id);
    setFormData({ ...rev });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.review) return;
    setIsSaving(true);

    try {
      const url =
        modalMode === 'create'
          ? '/api/admin/reviews'
          : `/api/admin/reviews/${editingId}`;
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
        alert(json.error || 'Failed to save review');
      }
    } catch (err) {
      console.error(err);
      alert('Network error saving review');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete review from "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="border-b border-white/10 pb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#d98f5b] mb-1">
            <Star className="h-4 w-4 fill-current" />
            <span className="text-[11px] font-bold uppercase tracking-wider">Social Proof & Trust</span>
          </div>
          <h2 className="font-playfair text-xl sm:text-2xl font-bold text-white">
            Customer Reviews & Video Stories
          </h2>
          <p className="mt-1 text-xs text-white/60">
            Publish client testimonials, authentic feedback quotes, and video walkthroughs across Kashmir.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#d98f5b] to-[#EA580C] px-4 py-2 text-xs font-bold text-white shadow-lg shadow-[#d98f5b]/20 transition-all hover:brightness-110 active:scale-95 self-start md:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Add Review</span>
        </button>
      </div>

      {/* ── Filter Tabs ── */}
      <div className="flex items-center gap-2">
        {[
          { id: 'ALL', label: `All Reviews (${reviews.length})` },
          { id: 'written', label: `Written Reviews (${reviews.filter((r) => r.type === 'written').length})` },
          { id: 'video', label: `Video Reviews (${reviews.filter((r) => r.type === 'video').length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedType(tab.id)}
            className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
              selectedType === tab.id
                ? 'bg-[#d98f5b] text-white shadow-md'
                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Reviews Data Table ── */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0B1F2A]/60 shadow-xl backdrop-blur-md">
        {loading ? (
          <div className="flex items-center justify-center p-12 text-white/50 gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-[#d98f5b]" />
            <span className="text-xs">Loading reviews database...</span>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="p-12 text-center text-xs text-white/40">
            No reviews found. Click &quot;Add Review&quot; to create one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-white/80">
              <thead className="border-b border-white/10 bg-white/[0.02] text-[10px] font-semibold uppercase tracking-wider text-white/40">
                <tr>
                  <th className="px-5 py-3.5">Customer</th>
                  <th className="px-5 py-3.5">Type</th>
                  <th className="px-5 py-3.5">Rating</th>
                  <th className="px-5 py-3.5">Review Snippet / Quote</th>
                  <th className="px-5 py-3.5">Featured</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredReviews.map((r) => (
                  <tr key={r.id} className="transition-colors hover:bg-white/[0.02]">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#d98f5b] to-amber-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                          {r.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-white">{r.name}</div>
                          <div className="text-[11px] text-white/40">{r.city}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      {r.type === 'video' ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/20 px-2 py-0.5 text-[10px] font-semibold text-blue-400">
                          <Video className="h-3 w-3" />
                          Video
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-white/70">
                          <MessageSquare className="h-3 w-3" />
                          Written
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {Array.from({ length: r.rating || 5 }).map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-current" />
                        ))}
                      </div>
                    </td>

                    <td className="px-5 py-4 max-w-xs">
                      <p className="line-clamp-2 text-[11px] text-white/70 italic">
                        &quot;{r.review}&quot;
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      {r.featured ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Featured
                        </span>
                      ) : (
                        <span className="text-white/30 text-[11px]">Normal</span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      {r.isActive ? (
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
                          onClick={() => handleOpenEdit(r)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(r.id, r.name)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
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
                  {modalMode === 'create' ? 'Add Customer Testimonial' : `Edit: ${formData.name}`}
                </h3>
                <p className="text-xs text-white/40">Configure customer feedback, rating stars, and video link</p>
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
                  <label className="block text-white/60 mb-1 font-medium">Customer Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Karan Malhotra"
                    className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-white focus:border-[#d98f5b] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white/60 mb-1 font-medium">City / State</label>
                  <input
                    type="text"
                    value={formData.city || ''}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Mumbai, Maharashtra"
                    className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-white focus:border-[#d98f5b] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/60 mb-1 font-medium">Review Type</label>
                  <select
                    value={formData.type || 'written'}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'written' | 'video' | 'gallery' })}
                    className="w-full rounded-xl border border-white/10 bg-[#07131B] p-2.5 text-white focus:border-[#d98f5b] focus:outline-none"
                  >
                    <option value="written">Written Text Testimonial</option>
                    <option value="video">Video Walkthrough & Quote</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/60 mb-1 font-medium">Star Rating</label>
                  <select
                    value={formData.rating || 5}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                    className="w-full rounded-xl border border-white/10 bg-[#07131B] p-2.5 text-white focus:border-[#d98f5b] focus:outline-none"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ 5 Stars</option>
                    <option value={4}>⭐⭐⭐⭐ 4 Stars</option>
                    <option value={3}>⭐⭐⭐ 3 Stars</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-white/60 mb-1 font-medium">Testimonial Feedback / Review Text *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.review || ''}
                  onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                  placeholder="Well-organized trip, verified cabs and local private stays were top notch."
                  className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-white focus:border-[#d98f5b] focus:outline-none"
                />
              </div>

              {formData.type === 'video' && (
                <div className="space-y-4 rounded-xl border border-white/10 bg-white/[0.02] p-4">
                  <div className="flex items-center gap-2 text-blue-400 font-semibold">
                    <Video className="h-4 w-4" />
                    <span>Video Testimonial Attributes</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/60 mb-1 font-medium">Video URL (YouTube or MP4)</label>
                      <input
                        type="text"
                        value={formData.videoUrl || ''}
                        onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                        placeholder="/videos/review_demo.mp4"
                        className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-white focus:border-blue-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-white/60 mb-1 font-medium">Video Duration</label>
                      <input
                        type="text"
                        value={formData.videoDuration || ''}
                        onChange={(e) => setFormData({ ...formData, videoDuration: e.target.value })}
                        placeholder="02:14"
                        className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-white focus:border-blue-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/60 mb-1 font-medium">Video Headline Quote</label>
                    <input
                      type="text"
                      value={formData.videoQuote || ''}
                      onChange={(e) => setFormData({ ...formData, videoQuote: e.target.value })}
                      placeholder="An unforgettable Kashmir experience!"
                      className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-white focus:border-blue-400 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-white">
                  <input
                    type="checkbox"
                    checked={formData.featured ?? false}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="h-4 w-4 rounded accent-[#d98f5b]"
                  />
                  <span>Featured on Homepage</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-white">
                  <input
                    type="checkbox"
                    checked={formData.isActive ?? true}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="h-4 w-4 rounded accent-[#d98f5b]"
                  />
                  <span>Active (Live on Website)</span>
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
                  <span>Save Review</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
