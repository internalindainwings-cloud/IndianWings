'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Car,
  Route,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  X,
  Save,
  Fuel,
  Users,
  Briefcase,
  Snowflake,
} from 'lucide-react';
import type { EnrichedVehicle, EnrichedRoute } from '@/lib/transport-service';

export const TabTransport: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'vehicles' | 'routes' | 'hero'>('vehicles');
  const [vehicles, setVehicles] = useState<EnrichedVehicle[]>([]);
  const [routes, setRoutes] = useState<EnrichedRoute[]>([]);
  const [loading, setLoading] = useState(true);

  // Vehicle Modal
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [vehicleModalMode, setVehicleModalMode] = useState<'create' | 'edit'>('create');
  const [editingVehicleId, setEditingVehicleId] = useState<string | null>(null);
  const [vehicleForm, setVehicleForm] = useState<Partial<EnrichedVehicle>>({
    name: '',
    slug: '',
    category: 'Luxury MPV',
    seats: '6+1 Seats',
    bags: '4 Bags',
    ac: 'Dual-Zone AC',
    fuel: 'Diesel',
    imageUrl: '/images/fleet/innova-crysta.jpg',
    pricePerDay: 4500,
    tags: ['Captain Seats', 'Snow Chains Ready'],
    badge: 'Popular',
    isActive: true,
  });

  // Route Modal
  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);
  const [routeModalMode, setRouteModalMode] = useState<'create' | 'edit'>('create');
  const [editingRouteId, setEditingRouteId] = useState<string | null>(null);
  const [routeForm, setRouteForm] = useState<Partial<EnrichedRoute>>({
    origin: 'Srinagar',
    destination: '',
    routeTitle: '',
    via: 'Direct Highway',
    distance: '50 km',
    duration: '1.5 hrs',
    startingPrice: 2500,
    highlights: ['Scenic drive', 'Photo stops'],
    cabs: 'Sedan, Innova Crysta, Tempo',
    isPopular: false,
    isActive: true,
  });

  const [isSaving, setIsSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [vRes, rRes] = await Promise.all([
        fetch('/api/admin/transport/vehicles'),
        fetch('/api/admin/transport/routes'),
      ]);
      const vJson = await vRes.json();
      const rJson = await rRes.json();
      if (vJson.success) setVehicles(vJson.vehicles);
      if (rJson.success) setRoutes(rJson.routes);
    } catch (err) {
      console.error('Failed to load transport data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Vehicle handlers
  const handleOpenCreateVehicle = () => {
    setVehicleModalMode('create');
    setEditingVehicleId(null);
    setVehicleForm({
      name: '',
      slug: '',
      category: 'Luxury MPV',
      seats: '6+1 Seats',
      bags: '4 Bags',
      ac: 'Dual-Zone AC',
      fuel: 'Diesel',
      imageUrl: '/images/fleet/innova-crysta.jpg',
      pricePerDay: 4500,
      tags: ['Verified Driver', 'Sanitized Cab'],
      badge: 'Popular',
      isActive: true,
    });
    setIsVehicleModalOpen(true);
  };

  const handleOpenEditVehicle = (v: EnrichedVehicle) => {
    setVehicleModalMode('edit');
    setEditingVehicleId(v.id);
    setVehicleForm({ ...v });
    setIsVehicleModalOpen(true);
  };

  const handleSaveVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleForm.name) return;
    setIsSaving(true);
    try {
      const url =
        vehicleModalMode === 'create'
          ? '/api/admin/transport/vehicles'
          : `/api/admin/transport/vehicles/${editingVehicleId}`;
      const method = vehicleModalMode === 'create' ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vehicleForm),
      });

      const json = await res.json();
      if (json.success) {
        await loadData();
        setIsVehicleModalOpen(false);
      } else {
        alert(json.error || 'Failed to save vehicle');
      }
    } catch (err) {
      console.error(err);
      alert('Network error saving vehicle');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteVehicle = async (id: string, name: string) => {
    if (!confirm(`Delete vehicle "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/transport/vehicles/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  // Route handlers
  const handleOpenCreateRoute = () => {
    setRouteModalMode('create');
    setEditingRouteId(null);
    setRouteForm({
      origin: 'Srinagar',
      destination: '',
      routeTitle: '',
      via: 'Direct Highway',
      distance: '50 km',
      duration: '1.5 hrs',
      startingPrice: 2500,
      highlights: ['Toll & Parking Included', 'Doorstep Pickup'],
      cabs: 'Sedan, Innova Crysta',
      isPopular: false,
      isActive: true,
    });
    setIsRouteModalOpen(true);
  };

  const handleOpenEditRoute = (r: EnrichedRoute) => {
    setRouteModalMode('edit');
    setEditingRouteId(r.id);
    setRouteForm({ ...r });
    setIsRouteModalOpen(true);
  };

  const handleSaveRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!routeForm.destination || !routeForm.routeTitle) return;
    setIsSaving(true);
    try {
      const url =
        routeModalMode === 'create'
          ? '/api/admin/transport/routes'
          : `/api/admin/transport/routes/${editingRouteId}`;
      const method = routeModalMode === 'create' ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(routeForm),
      });

      const json = await res.json();
      if (json.success) {
        await loadData();
        setIsRouteModalOpen(false);
      } else {
        alert(json.error || 'Failed to save route');
      }
    } catch (err) {
      console.error(err);
      alert('Network error saving route');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteRoute = async (id: string, title: string) => {
    if (!confirm(`Delete transfer route "${title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/transport/routes/${id}`, { method: 'DELETE' });
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
            <Car className="h-4 w-4" />
            <span className="text-[11px] font-bold uppercase tracking-wider">Fleet & Transfers Control</span>
          </div>
          <h2 className="font-playfair text-xl sm:text-2xl font-bold text-white">
            Kashmir Transport & Cab Fleet
          </h2>
          <p className="mt-1 text-xs text-white/60">
            Manage your verified private vehicle fleet, daily taxi rates, and popular inter-city transfer routes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'vehicles' ? (
            <button
              onClick={handleOpenCreateVehicle}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#d98f5b] to-[#EA580C] px-4 py-2 text-xs font-bold text-white shadow-lg shadow-[#d98f5b]/20 transition-all hover:brightness-110 active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>Add Vehicle</span>
            </button>
          ) : activeTab === 'routes' ? (
            <button
              onClick={handleOpenCreateRoute}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#d98f5b] to-[#EA580C] px-4 py-2 text-xs font-bold text-white shadow-lg shadow-[#d98f5b]/20 transition-all hover:brightness-110 active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>Add Transfer Route</span>
            </button>
          ) : null}
        </div>
      </div>

      {/* ── Sub-Nav Toggle ── */}
      <div className="flex border-b border-white/10 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('vehicles')}
          className={`flex items-center gap-2 py-3 px-4 border-b-2 transition-all ${
            activeTab === 'vehicles'
              ? 'border-[#d98f5b] text-[#d98f5b]'
              : 'border-transparent text-white/50 hover:text-white'
          }`}
        >
          <Car className="h-4 w-4" />
          <span>Vehicle Fleet ({vehicles.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('routes')}
          className={`flex items-center gap-2 py-3 px-4 border-b-2 transition-all ${
            activeTab === 'routes'
              ? 'border-[#d98f5b] text-[#d98f5b]'
              : 'border-transparent text-white/50 hover:text-white'
          }`}
        >
          <Route className="h-4 w-4" />
          <span>Transfer Routes ({routes.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('hero')}
          className={`flex items-center gap-2 py-3 px-4 border-b-2 transition-all ${
            activeTab === 'hero'
              ? 'border-[#d98f5b] text-[#d98f5b]'
              : 'border-transparent text-white/50 hover:text-white'
          }`}
        >
          <Snowflake className="h-4 w-4" />
          <span>Hero Banner</span>
        </button>
      </div>

      {/* ── Tab Content: Hero Banner ── */}
      {activeTab === 'hero' && (
        <TransportHeroManager />
      )}

      {/* ── Tab Content: Vehicles ── */}
      {activeTab === 'vehicles' && (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0B1F2A]/60 shadow-xl backdrop-blur-md">
          {loading ? (
            <div className="flex items-center justify-center p-12 text-white/50 gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-[#d98f5b]" />
              <span className="text-xs">Loading fleet database...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-white/80">
                <thead className="border-b border-white/10 bg-white/[0.02] text-[10px] font-semibold uppercase tracking-wider text-white/40">
                  <tr>
                    <th className="px-5 py-3.5">Vehicle</th>
                    <th className="px-5 py-3.5">Category</th>
                    <th className="px-5 py-3.5">Capacity</th>
                    <th className="px-5 py-3.5">Climate / Fuel</th>
                    <th className="px-5 py-3.5">Rate / Day</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {vehicles.map((v) => (
                    <tr key={v.id} className="transition-colors hover:bg-white/[0.02]">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-16 shrink-0 rounded-lg overflow-hidden border border-white/10 bg-black/40">
                            <Image
                              src={v.imageUrl || '/images/fleet/innova-crysta.jpg'}
                              alt={v.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-semibold text-white flex items-center gap-1.5">
                              <span>{v.name}</span>
                              {v.badge && (
                                <span className="rounded-full bg-[#d98f5b]/20 px-2 py-0.5 text-[9px] font-bold text-[#d98f5b]">
                                  {v.badge}
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-white/40 mt-0.5">
                              {v.tags.slice(0, 2).join(' • ')}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-block rounded-md bg-white/5 px-2.5 py-1 text-[11px] font-medium text-white/70">
                          {v.category}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-white/70">
                        <div className="flex items-center gap-2 text-[11px]">
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3 text-[#d98f5b]" />
                            {v.seats}
                          </span>
                          <span className="flex items-center gap-1">
                            <Briefcase className="h-3 w-3 text-white/40" />
                            {v.bags}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-white/70">
                        <div className="text-[11px]">
                          <div>{v.ac}</div>
                          <div className="text-white/40">{v.fuel}</div>
                        </div>
                      </td>

                      <td className="px-5 py-4 font-mono font-bold text-white">
                        ₹{v.pricePerDay.toLocaleString('en-IN')}<span className="text-white/40 font-normal text-[10px]">/day</span>
                      </td>

                      <td className="px-5 py-4">
                        {v.isActive ? (
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
                            onClick={() => handleOpenEditVehicle(v)}
                            className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteVehicle(v.id, v.name)}
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
      )}

      {/* ── Tab Content: Routes ── */}
      {activeTab === 'routes' && (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0B1F2A]/60 shadow-xl backdrop-blur-md">
          {loading ? (
            <div className="flex items-center justify-center p-12 text-white/50 gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-[#d98f5b]" />
              <span className="text-xs">Loading routes database...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-white/80">
                <thead className="border-b border-white/10 bg-white/[0.02] text-[10px] font-semibold uppercase tracking-wider text-white/40">
                  <tr>
                    <th className="px-5 py-3.5">Route</th>
                    <th className="px-5 py-3.5">Origin / Dest</th>
                    <th className="px-5 py-3.5">Distance / Duration</th>
                    <th className="px-5 py-3.5">Starting Fare</th>
                    <th className="px-5 py-3.5">Available Cabs</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {routes.map((r) => (
                    <tr key={r.id} className="transition-colors hover:bg-white/[0.02]">
                      <td className="px-5 py-4">
                        <div className="font-semibold text-white flex items-center gap-1.5">
                          <span>{r.routeTitle}</span>
                          {r.isPopular && (
                            <span className="rounded-full bg-orange-500/20 px-2 py-0.5 text-[9px] font-bold text-orange-400">
                              Popular
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-white/40 mt-0.5">
                          Via {r.via}
                        </div>
                      </td>

                      <td className="px-5 py-4 text-white/70">
                        {r.origin} ➔ {r.destination}
                      </td>

                      <td className="px-5 py-4 text-white/70 font-mono text-[11px]">
                        {r.distance} ({r.duration})
                      </td>

                      <td className="px-5 py-4 font-mono font-bold text-white">
                        ₹{r.startingPrice.toLocaleString('en-IN')}
                      </td>

                      <td className="px-5 py-4 text-white/60 text-[11px]">
                        {r.cabs}
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
                            onClick={() => handleOpenEditRoute(r)}
                            className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteRoute(r.id, r.routeTitle)}
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
      )}

      {/* ── Vehicle Modal ── */}
      {isVehicleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-8 overflow-hidden">
          <div className="relative w-full max-w-2xl rounded-3xl border border-white/15 bg-[#0B1F2A] shadow-2xl max-h-full flex flex-col overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-white/[0.02] shrink-0">
              <div>
                <h3 className="font-playfair text-lg font-bold text-white">
                  {vehicleModalMode === 'create' ? 'Add Vehicle to Fleet' : `Edit: ${vehicleForm.name}`}
                </h3>
                <p className="text-xs text-white/40">Configure vehicle seating, pricing, and category</p>
              </div>
              <button
                onClick={() => setIsVehicleModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveVehicle} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/60 mb-1 font-medium">Vehicle Name *</label>
                  <input
                    type="text"
                    required
                    value={vehicleForm.name || ''}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, name: e.target.value })}
                    placeholder="e.g. Toyota Innova Crysta"
                    className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-white focus:border-[#d98f5b] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white/60 mb-1 font-medium">Category</label>
                  <select
                    value={vehicleForm.category || 'Luxury MPV'}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, category: e.target.value as EnrichedVehicle['category'] })}
                    className="w-full rounded-xl border border-white/10 bg-[#07131B] p-2.5 text-white focus:border-[#d98f5b] focus:outline-none"
                  >
                    <option value="Luxury MPV">Luxury MPV</option>
                    <option value="Sedan / Hatch">Sedan / Hatch</option>
                    <option value="VIP SUV">VIP SUV</option>
                    <option value="Group Traveller">Group Traveller</option>
                    <option value="Adventure 4x4">Adventure 4x4</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-white/60 mb-1 font-medium">Seating</label>
                  <input
                    type="text"
                    value={vehicleForm.seats || ''}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, seats: e.target.value })}
                    placeholder="6+1 Seats"
                    className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-white focus:border-[#d98f5b] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white/60 mb-1 font-medium">Luggage Capacity</label>
                  <input
                    type="text"
                    value={vehicleForm.bags || ''}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, bags: e.target.value })}
                    placeholder="4 Bags"
                    className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-white focus:border-[#d98f5b] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white/60 mb-1 font-medium">Price Per Day (₹)</label>
                  <input
                    type="number"
                    value={vehicleForm.pricePerDay || 3500}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, pricePerDay: Number(e.target.value) })}
                    placeholder="4500"
                    className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-white focus:border-[#d98f5b] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/60 mb-1 font-medium">AC / Heater Info</label>
                  <input
                    type="text"
                    value={vehicleForm.ac || ''}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, ac: e.target.value })}
                    placeholder="Dual-Zone AC & Heating"
                    className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-white focus:border-[#d98f5b] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white/60 mb-1 font-medium">Fuel Type</label>
                  <input
                    type="text"
                    value={vehicleForm.fuel || ''}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, fuel: e.target.value })}
                    placeholder="Diesel"
                    className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-white focus:border-[#d98f5b] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/60 mb-1 font-medium">Image URL</label>
                <input
                  type="text"
                  value={vehicleForm.imageUrl || ''}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, imageUrl: e.target.value })}
                  placeholder="/images/fleet/innova-crysta.jpg"
                  className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-white focus:border-[#d98f5b] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-white/60 mb-1 font-medium">Features & Tags (Comma separated)</label>
                <input
                  type="text"
                  value={(vehicleForm.tags || []).join(', ')}
                  onChange={(e) =>
                    setVehicleForm({
                      ...vehicleForm,
                      tags: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  placeholder="Captain Recliner Seats, Snow Chains Ready, Mountain Driver"
                  className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-white focus:border-[#d98f5b] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-white">
                  <input
                    type="checkbox"
                    checked={vehicleForm.isActive ?? true}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, isActive: e.target.checked })}
                    className="h-4 w-4 rounded accent-[#d98f5b]"
                  />
                  <span>Active (Visible on Website)</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsVehicleModalOpen(false)}
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
                  <span>Save Vehicle</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Route Modal ── */}
      {isRouteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-8 overflow-hidden">
          <div className="relative w-full max-w-2xl rounded-3xl border border-white/15 bg-[#0B1F2A] shadow-2xl max-h-full flex flex-col overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-white/[0.02] shrink-0">
              <div>
                <h3 className="font-playfair text-lg font-bold text-white">
                  {routeModalMode === 'create' ? 'Add Transfer Route' : `Edit: ${routeForm.routeTitle}`}
                </h3>
                <p className="text-xs text-white/40">Configure distance, duration, and starting cab fare</p>
              </div>
              <button
                onClick={() => setIsRouteModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveRoute} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/60 mb-1 font-medium">Route Title *</label>
                  <input
                    type="text"
                    required
                    value={routeForm.routeTitle || ''}
                    onChange={(e) => setRouteForm({ ...routeForm, routeTitle: e.target.value })}
                    placeholder="e.g. Srinagar Airport to Dal Lake"
                    className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-white focus:border-[#d98f5b] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white/60 mb-1 font-medium">Origin City</label>
                  <select
                    value={routeForm.origin || 'Srinagar'}
                    onChange={(e) => setRouteForm({ ...routeForm, origin: e.target.value as EnrichedRoute['origin'] })}
                    className="w-full rounded-xl border border-white/10 bg-[#07131B] p-2.5 text-white focus:border-[#d98f5b] focus:outline-none"
                  >
                    <option value="Srinagar">Srinagar</option>
                    <option value="Jammu">Jammu</option>
                    <option value="Katra">Katra</option>
                    <option value="Udhampur">Udhampur</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-white/60 mb-1 font-medium">Destination *</label>
                  <input
                    type="text"
                    required
                    value={routeForm.destination || ''}
                    onChange={(e) => setRouteForm({ ...routeForm, destination: e.target.value })}
                    placeholder="Gulmarg"
                    className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-white focus:border-[#d98f5b] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white/60 mb-1 font-medium">Distance</label>
                  <input
                    type="text"
                    value={routeForm.distance || ''}
                    onChange={(e) => setRouteForm({ ...routeForm, distance: e.target.value })}
                    placeholder="51 km"
                    className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-white focus:border-[#d98f5b] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white/60 mb-1 font-medium">Duration</label>
                  <input
                    type="text"
                    value={routeForm.duration || ''}
                    onChange={(e) => setRouteForm({ ...routeForm, duration: e.target.value })}
                    placeholder="1.5 hrs"
                    className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-white focus:border-[#d98f5b] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/60 mb-1 font-medium">Starting Fare (₹)</label>
                  <input
                    type="number"
                    value={routeForm.startingPrice || 2500}
                    onChange={(e) => setRouteForm({ ...routeForm, startingPrice: Number(e.target.value) })}
                    placeholder="2500"
                    className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-white focus:border-[#d98f5b] focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-white/60 mb-1 font-medium">Via Highway / Landmarks</label>
                  <input
                    type="text"
                    value={routeForm.via || ''}
                    onChange={(e) => setRouteForm({ ...routeForm, via: e.target.value })}
                    placeholder="NH1 / Tangmarg Pine Road"
                    className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-white focus:border-[#d98f5b] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/60 mb-1 font-medium">Available Cabs</label>
                <input
                  type="text"
                  value={routeForm.cabs || ''}
                  onChange={(e) => setRouteForm({ ...routeForm, cabs: e.target.value })}
                  placeholder="Sedan, Innova Crysta, Urbania"
                  className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-white focus:border-[#d98f5b] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-white">
                  <input
                    type="checkbox"
                    checked={routeForm.isPopular ?? false}
                    onChange={(e) => setRouteForm({ ...routeForm, isPopular: e.target.checked })}
                    className="h-4 w-4 rounded accent-[#d98f5b]"
                  />
                  <span>Mark as Popular Route</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-white">
                  <input
                    type="checkbox"
                    checked={routeForm.isActive ?? true}
                    onChange={(e) => setRouteForm({ ...routeForm, isActive: e.target.checked })}
                    className="h-4 w-4 rounded accent-[#d98f5b]"
                  />
                  <span>Active (Visible on Website)</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsRouteModalOpen(false)}
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
                  <span>Save Route</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const TransportHeroManager: React.FC = () => {
  const [hero, setHero] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/page-heroes/transport')
      .then(res => res.json())
      .then(data => {
        if (data.success) setHero(data.hero);
        setLoading(false);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/page-heroes/transport', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hero),
      });
      const data = await res.json();
      if (data.success) {
        alert('Hero banner updated successfully');
      } else {
        alert(data.error || 'Failed to update hero');
      }
    } catch (err) {
      alert('Network error');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-white/50">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0B1F2A]/60 shadow-xl backdrop-blur-md p-6">
      <h3 className="text-lg font-bold text-white mb-4">Transport Page Hero Banner</h3>
      <form onSubmit={handleSave} className="space-y-4 max-w-2xl">
        <div>
          <label className="mb-1 block text-xs font-semibold text-white/50">Hero Heading</label>
          <input
            type="text"
            required
            value={hero?.heading || ''}
            onChange={e => setHero({ ...hero, heading: e.target.value })}
            className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-xs text-white focus:border-[#d98f5b] focus:outline-none"
            placeholder="e.g. Private Kashmir Cabs & Fleet"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-white/50">Desktop Background URL (16:9)</label>
          <input
            type="text"
            required
            value={hero?.desktopImageUrl || ''}
            onChange={e => setHero({ ...hero, desktopImageUrl: e.target.value })}
            className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-xs text-white focus:border-[#d98f5b] focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-white/50">Mobile Background URL (9:16)</label>
          <input
            type="text"
            required
            value={hero?.mobileImageUrl || ''}
            onChange={e => setHero({ ...hero, mobileImageUrl: e.target.value })}
            className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-xs text-white focus:border-[#d98f5b] focus:outline-none"
          />
        </div>
        
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#d98f5b] to-[#EA580C] px-6 py-2.5 text-xs font-bold text-white transition-all hover:brightness-110 disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          <span>Save Banner</span>
        </button>
      </form>
    </div>
  );
};

