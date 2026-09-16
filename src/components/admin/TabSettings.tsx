'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings,
  Phone,
  Mail,
  MapPin,
  Megaphone,
  Save,
  Loader2,
  CheckCircle2,
  ExternalLink,
  MessageCircle,
  Eye,
} from 'lucide-react';
import { SiteSettingsData } from '@/lib/settings-service';

export const TabSettings: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form State
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [address, setAddress] = useState('');
  const [announcementEnabled, setAnnouncementEnabled] = useState(false);
  const [announcementText, setAnnouncementText] = useState('');
  const [announcementLink, setAnnouncementLink] = useState('/packages');

  const loadSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/settings');
      const json = await res.json();
      if (json.success && json.settings) {
        setSettings(json.settings);
        setPhone(json.settings.phone || '+91 99060 00000');
        setEmail(json.settings.email || 'info@theindianwingscompany.com');
        setWhatsapp(json.settings.whatsapp || '+919906000000');
        setAddress(json.settings.address || 'Boulevard Road, Dal Lake, Srinagar, Jammu & Kashmir 190001');
        setAnnouncementEnabled(Boolean(json.settings.announcementEnabled));
        setAnnouncementText(json.settings.announcementText || '');
        setAnnouncementLink(json.settings.announcementLink || '/packages');
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phone.trim(),
          email: email.trim(),
          whatsapp: whatsapp.trim(),
          address: address.trim(),
          announcementEnabled,
          announcementText: announcementText.trim(),
          announcementLink: announcementLink.trim(),
        }),
      });

      const json = await res.json();
      if (json.success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      } else {
        alert(json.error || 'Failed to save settings');
      }
    } catch (err) {
      console.error('Error saving settings:', err);
      alert('Network error while saving settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-white/50 gap-2">
        <Loader2 className="h-5 w-5 animate-spin text-[#d98f5b]" />
        <span className="text-xs">Loading site settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <div className="border-b border-white/10 pb-4">
        <div className="flex items-center gap-2 text-[#d98f5b] mb-1">
          <Settings className="h-4 w-4" />
          <span className="text-[11px] font-bold uppercase tracking-wider">Business & Contact Master</span>
        </div>
        <h2 className="font-playfair text-xl sm:text-2xl font-bold text-white">
          Site Settings & Announcement Control
        </h2>
        <p className="mt-1 text-xs text-white/60">
          Centrally manage your contact numbers, WhatsApp concierge, office address, and promotional top header announcement bar.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* ── 1. Announcement Banner Section ── */}
        <div className="rounded-2xl border border-white/10 bg-[#0B1F2A]/60 p-6 backdrop-blur-md shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
                <Megaphone className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-playfair text-base font-bold text-white">
                  Top Header Announcement Bar
                </h3>
                <p className="text-xs text-white/50 mt-0.5">
                  Displays an attention-grabbing banner at the very top of the website.
                </p>
              </div>
            </div>

            {/* Enable / Disable Toggle */}
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <span className="text-xs font-semibold text-white/70">
                {announcementEnabled ? 'Banner Active' : 'Banner Inactive'}
              </span>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={announcementEnabled}
                  onChange={(e) => setAnnouncementEnabled(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`block h-6 w-11 rounded-full transition-colors ${
                    announcementEnabled ? 'bg-emerald-500' : 'bg-white/20'
                  }`}
                />
                <div
                  className={`dot absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform ${
                    announcementEnabled ? 'transform translate-x-5' : ''
                  }`}
                />
              </div>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="md:col-span-2">
              <label className="block text-white/60 mb-1 font-medium">Banner Promotional Text</label>
              <input
                type="text"
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                placeholder="e.g. ❄️ Winter Wonderland Early Bird: Flat ₹2,500 OFF on all 6D/5N Kashmir tours!"
                className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-white focus:border-[#d98f5b] focus:outline-none placeholder-white/30"
              />
            </div>

            <div>
              <label className="block text-white/60 mb-1 font-medium">Click Destination Link</label>
              <input
                type="text"
                value={announcementLink}
                onChange={(e) => setAnnouncementLink(e.target.value)}
                placeholder="/packages"
                className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-white focus:border-[#d98f5b] focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Live Banner Preview */}
          {announcementEnabled && announcementText && (
            <div className="rounded-xl border border-saffron/30 bg-gradient-to-r from-saffron/20 via-orange-500/20 to-amber-500/20 p-3 flex items-center justify-between text-xs text-white">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#d98f5b] uppercase text-[10px] tracking-wider px-2 py-0.5 rounded bg-black/40">
                  Preview
                </span>
                <span>{announcementText}</span>
              </div>
              <span className="text-[11px] font-bold text-[#d98f5b] underline flex items-center gap-1">
                Explore Now →
              </span>
            </div>
          )}
        </div>

        {/* ── 2. Contact Information Section ── */}
        <div className="rounded-2xl border border-white/10 bg-[#0B1F2A]/60 p-6 backdrop-blur-md shadow-xl space-y-4">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-playfair text-base font-bold text-white">
                Company Contact Information
              </h3>
              <p className="text-xs text-white/50 mt-0.5">
                Automatically updates the Header, Footer, and Floating WhatsApp buttons across all pages.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="flex items-center gap-1.5 text-white/60 mb-1 font-medium">
                <Phone className="h-3.5 w-3.5 text-[#d98f5b]" />
                <span>Primary Calling Phone Number</span>
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 99060 00000"
                className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-white focus:border-[#d98f5b] focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-white/60 mb-1 font-medium">
                <MessageCircle className="h-3.5 w-3.5 text-emerald-400" />
                <span>WhatsApp Business Number (With Country Code)</span>
              </label>
              <input
                type="text"
                required
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+919906000000"
                className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-white focus:border-emerald-400 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-white/60 mb-1 font-medium">
                <Mail className="h-3.5 w-3.5 text-sky-400" />
                <span>Official Support Email</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="info@theindianwingscompany.com"
                className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-white focus:border-sky-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-white/60 mb-1 font-medium">
                <MapPin className="h-3.5 w-3.5 text-red-400" />
                <span>Office Physical Address</span>
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Boulevard Road, Dal Lake, Srinagar, Jammu & Kashmir 190001"
                className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-white focus:border-red-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* ── Save Button & Status ── */}
        <div className="flex items-center justify-between pt-2">
          {savedSuccess ? (
            <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" />
              Settings updated successfully! Changes are live immediately.
            </span>
          ) : (
            <span className="text-white/40 text-[11px]">
              All changes sync instantly to website Header, Footer, and Floating WhatsApp.
            </span>
          )}

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#d98f5b] to-[#EA580C] px-6 py-2.5 font-bold text-white shadow-lg shadow-[#d98f5b]/20 hover:brightness-110 active:scale-95 disabled:opacity-50 text-xs"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
