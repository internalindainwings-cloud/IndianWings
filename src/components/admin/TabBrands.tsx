'use client';
import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Check, X, GripVertical, Image as ImageIcon } from 'lucide-react';

interface PartnerBrand {
  id: string;
  name: string;
  logoUrl: string | null;
  altText: string;
  typeLabel: string;
  isActive: boolean;
  sortOrder: number;
}

export default function TabBrands() {
  const [brands, setBrands] = useState<PartnerBrand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentBrand, setCurrentBrand] = useState<Partial<PartnerBrand> | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const res = await fetch('/api/admin/brands');
      const data = await res.json();
      if (data.success) {
        setBrands(data.brands);
      } else {
        setError(data.error || 'Failed to load brands');
      }
    } catch (err) {
      setError('Error fetching brands');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentBrand?.name) return;

    try {
      const isNew = !currentBrand.id;
      const url = '/api/admin/brands';
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentBrand)
      });

      const data = await res.json();
      if (data.success) {
        setIsEditing(false);
        setCurrentBrand(null);
        fetchBrands();
      } else {
        alert(data.error || 'Failed to save');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving brand');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this brand?')) return;
    
    try {
      const res = await fetch(`/api/admin/brands?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchBrands();
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting brand');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();
      if (json.success && json.url) {
        setCurrentBrand((prev) => ({ ...prev, logoUrl: json.url }));
      } else {
        alert(json.error || 'Upload failed');
      }
    } catch (err) {
      console.error(err);
      alert('Network error while uploading');
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) return <div className="text-white p-8">Loading brands...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Brands & Partners</h2>
          <p className="text-slate-400">Manage hospitality and travel partners displayed in the marquee.</p>
        </div>
        <button
          onClick={() => {
            setCurrentBrand({ name: '', logoUrl: '', typeLabel: 'HOSPITALITY PARTNER', isActive: true, sortOrder: 0 });
            setIsEditing(true);
          }}
          className="bg-saffron text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-500 transition-colors flex items-center gap-2"
        >
          <Plus size={18} /> Add Brand
        </button>
      </div>

      {error && <div className="bg-red-500/20 text-red-400 p-4 rounded-lg">{error}</div>}

      {isEditing && currentBrand && (
        <form onSubmit={handleSave} className="bg-slate-800 p-6 rounded-xl border border-slate-700 space-y-4">
          <h3 className="text-lg font-bold text-white mb-4">
            {currentBrand.id ? 'Edit Brand' : 'New Brand'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-slate-400">Brand Name</label>
              <input
                type="text"
                value={currentBrand.name || ''}
                onChange={e => setCurrentBrand({ ...currentBrand, name: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-slate-400">Type Label (e.g. HOSPITALITY PARTNER)</label>
              <input
                type="text"
                value={currentBrand.typeLabel || ''}
                onChange={e => setCurrentBrand({ ...currentBrand, typeLabel: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-400">Alt Text</label>
              <input
                type="text"
                value={currentBrand.altText || ''}
                onChange={e => setCurrentBrand({ ...currentBrand, altText: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-400">Sort Order</label>
              <input
                type="number"
                value={currentBrand.sortOrder || 0}
                onChange={e => setCurrentBrand({ ...currentBrand, sortOrder: parseInt(e.target.value) || 0 })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
              />
            </div>

            <div className="col-span-1 md:col-span-2 space-y-2">
              <label className="text-sm text-slate-400">Logo URL or Upload</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={currentBrand.logoUrl || ''}
                  onChange={e => setCurrentBrand({ ...currentBrand, logoUrl: e.target.value })}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                  placeholder="Leave empty to show text badge"
                />
                <label className={`bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg flex items-center gap-2 text-white cursor-pointer ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                  <ImageIcon size={18} />
                  <span>{isUploading ? 'Uploading...' : 'Upload'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
              {currentBrand.logoUrl && (
                <div className="mt-2 p-2 bg-slate-900 rounded-lg inline-block">
                  <img src={currentBrand.logoUrl} alt="Logo Preview" className="h-12 object-contain" />
                </div>
              )}
            </div>

            <div className="col-span-1 md:col-span-2 flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                id="isActive"
                checked={currentBrand.isActive ?? true}
                onChange={e => setCurrentBrand({ ...currentBrand, isActive: e.target.checked })}
                className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-saffron focus:ring-saffron"
              />
              <label htmlFor="isActive" className="text-sm text-white">Active (Visible on site)</label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => { setIsEditing(false); setCurrentBrand(null); }}
              className="px-4 py-2 text-slate-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-saffron text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-500"
            >
              Save Brand
            </button>
          </div>
        </form>
      )}

      {!isEditing && (
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/50 text-slate-400">
              <tr>
                <th className="p-4 font-medium">Brand / Logo</th>
                <th className="p-4 font-medium">Type</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {brands.map(brand => (
                <tr key={brand.id} className="hover:bg-slate-700/20 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      {brand.logoUrl ? (
                        <div className="w-16 h-10 bg-white rounded flex items-center justify-center p-1">
                          <img src={brand.logoUrl} alt={brand.name} className="max-w-full max-h-full object-contain" />
                        </div>
                      ) : (
                        <div className="w-16 h-10 bg-slate-700 rounded flex items-center justify-center text-xs font-bold">
                          TEXT
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-white">{brand.name}</div>
                        <div className="text-xs text-slate-500">Order: {brand.sortOrder}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-xs tracking-wider bg-slate-900 px-2 py-1 rounded text-slate-400">
                      {brand.typeLabel}
                    </span>
                  </td>
                  <td className="p-4">
                    {brand.isActive ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-500/10 text-slate-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                        Hidden
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => { setCurrentBrand(brand); setIsEditing(true); }}
                        className="text-slate-400 hover:text-white transition-colors"
                        title="Edit Brand"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(brand.id)}
                        className="text-slate-400 hover:text-red-400 transition-colors"
                        title="Delete Brand"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {brands.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">
                    No brands found. Add one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
