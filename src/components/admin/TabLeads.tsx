'use client';

import React, { useState } from 'react';
import {
  Download,
  MessageSquare,
  Phone,
  Calendar,
  Users,
  Search,
  Filter,
  RefreshCw,
  Eye,
  X,
  Copy,
  Check,
  ExternalLink,
  Target,
  Megaphone,
  TrendingUp,
  Activity,
  Layers,
  Globe,
  Compass,
  FileText,
  ShieldCheck,
} from 'lucide-react';
import { classifyAttribution, ReadableAttribution } from '@/lib/utilities/attribution';

export interface LeadRecord {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  travelDate: string;
  guests: string;
  tripType: string;
  message?: string | null;
  source: string;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmTerm?: string | null;
  utmContent?: string | null;
  gclid?: string | null;
  fbclid?: string | null;
  referrer?: string | null;
  landingPage?: string | null;
  visitorId?: string | null;
  status: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: string;
}

export interface TrackingOverviewData {
  landingPageVisits: number;
  leadSubmissions: number;
  adsLeads: number;
  whatsAppClicks: number;
  callClicks: number;
  uniqueVisitorsCount: number;
  leadsBySource: Record<string, number>;
  leadsByCampaign: Array<{ name: string; count: number }>;
}

interface TabLeadsProps {
  leads: LeadRecord[];
  trackingOverview?: TrackingOverviewData;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export const TabLeads: React.FC<TabLeadsProps> = ({
  leads,
  trackingOverview,
  onRefresh,
  isRefreshing = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTripType, setSelectedTripType] = useState('ALL');
  const [selectedChannel, setSelectedChannel] = useState('ALL');
  const [selectedLead, setSelectedLead] = useState<LeadRecord | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Copy click ID helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter leads with classified attribution
  const filteredLeads = leads.filter((lead) => {
    const attr = classifyAttribution(lead);
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm) ||
      (lead.email && lead.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (attr.campaign !== 'Not available' && attr.campaign.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (attr.searchTerm !== 'Not available' && attr.searchTerm.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (lead.gclid && lead.gclid.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = selectedTripType === 'ALL' || lead.tripType === selectedTripType;
    const matchesChannel = selectedChannel === 'ALL' || attr.channel === selectedChannel;

    return matchesSearch && matchesType && matchesChannel;
  });

  // Export to CSV with full readable attribution & click IDs
  const handleExportCSV = () => {
    if (leads.length === 0) return;

    const headers = [
      'ID',
      'Created At',
      'Name',
      'Phone',
      'Email',
      'Trip Type',
      'Guests',
      'Travel Date',
      'Lead Channel',
      'Medium',
      'Campaign',
      'Search Term',
      'Ad Content',
      'Landing Page',
      'Referrer',
      'Lead Action',
      'Status',
      'GCLID',
      'FBCLID',
      'Visitor ID',
      'Message',
    ];

    const rows = filteredLeads.map((l) => {
      const a = classifyAttribution(l);
      return [
        l.id,
        new Date(l.createdAt).toLocaleString(),
        `"${l.name.replace(/"/g, '""')}"`,
        `"${l.phone}"`,
        l.email || '',
        `"${l.tripType}"`,
        `"${l.guests}"`,
        `"${l.travelDate}"`,
        `"${a.channel}"`,
        `"${a.medium}"`,
        `"${a.campaign}"`,
        `"${a.searchTerm}"`,
        `"${a.content}"`,
        `"${a.landingPage}"`,
        `"${a.referrerDomain}"`,
        `"${a.action}"`,
        `"${l.status}"`,
        l.gclid ? `"${l.gclid}"` : 'Not available',
        l.fbclid ? `"${l.fbclid}"` : 'Not available',
        l.visitorId || 'Not available',
        `"${(l.message || '').replace(/"/g, '""')}"`,
      ];
    });

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `the_indian_wings_leads_attribution_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Open WhatsApp chat directly with client
  const handleWhatsApp = (phone: string, name: string, tripType: string) => {
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    const text = encodeURIComponent(
      `Hello ${name}! Greetings from The Indian Wings Company Srinagar. Regarding your enquiry for ${tripType}, we are excited to share a customized Kashmir itinerary with you.`
    );
    window.open(`https://wa.me/${cleanPhone.replace('+', '')}?text=${text}`, '_blank');
  };

  // Channel badge styling helper
  const renderChannelBadge = (channel: ReadableAttribution['channel']) => {
    switch (channel) {
      case 'Google Ads':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-amber-400/20 px-2 py-0.5 text-[11px] font-bold text-amber-300 border border-amber-400/30">
            <Target className="h-3 w-3 text-amber-400" />
            <span>Google Ads</span>
          </span>
        );
      case 'Organic Search':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/20 px-2 py-0.5 text-[11px] font-semibold text-emerald-300 border border-emerald-500/30">
            <Globe className="h-3 w-3 text-emerald-400" />
            <span>Organic Search</span>
          </span>
        );
      case 'Social':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-purple-500/20 px-2 py-0.5 text-[11px] font-semibold text-purple-300 border border-purple-500/30">
            <Megaphone className="h-3 w-3 text-purple-400" />
            <span>Social</span>
          </span>
        );
      case 'Referral':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-cyan-500/20 px-2 py-0.5 text-[11px] font-semibold text-cyan-300 border border-cyan-500/30">
            <ExternalLink className="h-3 w-3 text-cyan-400" />
            <span>Referral</span>
          </span>
        );
      case 'Direct':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-slate-500/20 px-2 py-0.5 text-[11px] font-medium text-slate-300 border border-slate-500/30">
            <Compass className="h-3 w-3 text-slate-400" />
            <span>Direct</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-white/10 px-2 py-0.5 text-[11px] font-medium text-white/70 border border-white/10">
            <span>Unknown</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Human Friendly Header */}
      <div className="border-b border-white/10 pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="font-serif text-lg font-bold text-white">
              Customer Inquiries & Website Lead Attribution
            </h3>
            <p className="mt-1 text-xs text-white/60">
              Verified trip inquiries with transparent first-party attribution. Review lead origins, campaign parameters, and technical click IDs.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>Authorized Admin Area</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. Website Tracking Overview (First-Party Verification) */}
      {trackingOverview && (
        <div className="rounded-2xl border border-white/10 bg-[#0B1F2A]/60 p-5 shadow-xl backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-[#F59E0B]" />
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                Website Tracking Overview & Recorded Interactions
              </span>
            </div>
            <span className="text-[11px] text-white/50">
              Distinguishing Visits vs. Recorded CTA Events vs. Unique Visitors
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {/* 1. Landing Page Visits */}
            <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3 text-left">
              <div className="text-[11px] text-white/50 font-medium truncate">Landing Visits (/ads)</div>
              <div className="mt-1 text-lg font-bold text-white tabular-nums">
                {trackingOverview.landingPageVisits}
              </div>
              <div className="text-[10px] text-amber-300/80 mt-0.5">Recorded page loads</div>
            </div>

            {/* 2. Form Submissions */}
            <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3 text-left">
              <div className="text-[11px] text-white/50 font-medium truncate">Verified Leads</div>
              <div className="mt-1 text-lg font-bold text-emerald-400 tabular-nums">
                {trackingOverview.leadSubmissions}
              </div>
              <div className="text-[10px] text-emerald-300/80 mt-0.5">
                {trackingOverview.adsLeads} from /ads
              </div>
            </div>

            {/* 3. WhatsApp Clicks */}
            <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3 text-left">
              <div className="text-[11px] text-white/50 font-medium truncate">WhatsApp Clicks</div>
              <div className="mt-1 text-lg font-bold text-[#25D366] tabular-nums">
                {trackingOverview.whatsAppClicks}
              </div>
              <div className="text-[10px] text-white/40 mt-0.5">Direct chat intent</div>
            </div>

            {/* 4. Call Clicks */}
            <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3 text-left">
              <div className="text-[11px] text-white/50 font-medium truncate">Call CTA Clicks</div>
              <div className="mt-1 text-lg font-bold text-blue-400 tabular-nums">
                {trackingOverview.callClicks}
              </div>
              <div className="text-[10px] text-white/40 mt-0.5">Telephone concierge</div>
            </div>

            {/* 5. Unique Visitors */}
            <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3 text-left">
              <div className="text-[11px] text-white/50 font-medium truncate">Unique Visitors</div>
              <div className="mt-1 text-lg font-bold text-purple-300 tabular-nums">
                {trackingOverview.uniqueVisitorsCount}
              </div>
              <div className="text-[10px] text-purple-300/70 mt-0.5">Persistent Visitor IDs</div>
            </div>

            {/* 6. Top Source */}
            <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3 text-left">
              <div className="text-[11px] text-white/50 font-medium truncate">Google Ads Leads</div>
              <div className="mt-1 text-lg font-bold text-amber-400 tabular-nums">
                {trackingOverview.leadsBySource['Google Ads'] || 0}
              </div>
              <div className="text-[10px] text-amber-300/70 mt-0.5">Verified GCLID/PPC</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-white/40 border-t border-white/5">
            <span className="leading-tight">
              ⚠️ <em>Notice:</em> A lead is classified as <strong>Google Ads</strong> solely when backed by a verified <code>gclid</code> or Google PPC campaign parameters — never merely because they landed on <code>/ads</code>.
            </span>
            <span className="text-white/50 font-mono">
              Lead conversion rate: {trackingOverview.landingPageVisits > 0 ? ((trackingOverview.adsLeads / trackingOverview.landingPageVisits) * 100).toFixed(1) : '0.0'}%
            </span>
          </div>
        </div>
      )}

      {/* 3. Controls, Search Bar, & Filter Chips */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Search by customer, phone, campaign, keyword, or click ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-xs text-white placeholder-white/30 focus:border-[#d98f5b] focus:outline-none"
            />
          </div>

          {/* Channel Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-3.5 w-3.5 text-white/40" />
            <select
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
              className="rounded-xl border border-white/10 bg-[#0B1F2A] px-3 py-2.5 text-xs text-white focus:border-[#d98f5b] focus:outline-none"
              aria-label="Filter by Lead Channel"
            >
              <option value="ALL">All Sources & Channels</option>
              <option value="Google Ads">Google Ads (Verified)</option>
              <option value="Organic Search">Organic Search</option>
              <option value="Social">Social / Meta</option>
              <option value="Referral">Referral</option>
              <option value="Direct">Direct Traffic</option>
              <option value="Unknown">Unknown</option>
            </select>
          </div>

          {/* Trip Type Filter */}
          <select
            value={selectedTripType}
            onChange={(e) => setSelectedTripType(e.target.value)}
            className="rounded-xl border border-white/10 bg-[#0B1F2A] px-3 py-2.5 text-xs text-white focus:border-[#d98f5b] focus:outline-none"
            aria-label="Filter by Trip Type"
          >
            <option value="ALL">All Trip Types</option>
            <option value="Kashmir Classic">Kashmir Classic</option>
            <option value="Kashmir Classic Holiday">Kashmir Classic Holiday</option>
            <option value="Honeymoon Special">Honeymoon Special</option>
            <option value="Honeymoon & Romantic">Honeymoon & Romantic</option>
            <option value="Luxury Kashmir">Luxury Kashmir</option>
            <option value="Adventure & Trekking">Adventure & Trekking</option>
            <option value="Custom Itinerary">Custom Itinerary</option>
          </select>
        </div>

        {/* Action Buttons: Refresh & Export */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center justify-center gap-2 rounded-xl bg-white/10 px-3.5 py-2.5 text-xs font-semibold text-white transition-all hover:bg-white/15 active:scale-95 disabled:opacity-50 cursor-pointer"
            title="Refresh Inquiries"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-amber-400 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>

          <button
            onClick={handleExportCSV}
            disabled={leads.length === 0}
            className="flex items-center justify-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-xs font-semibold text-white transition-all hover:bg-white/15 active:scale-95 disabled:opacity-40 cursor-pointer"
          >
            <Download className="h-4 w-4 text-[#d98f5b]" />
            <span>Export CSV ({filteredLeads.length})</span>
          </button>
        </div>
      </div>

      {/* 4. Leads Attribution Table */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0B1F2A]/60 shadow-xl backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-white/80">
            <thead className="border-b border-white/10 bg-white/[0.03] text-[11px] font-semibold uppercase tracking-wider text-white/50">
              <tr>
                <th className="px-5 py-3.5">Customer</th>
                <th className="px-5 py-3.5">Contact</th>
                <th className="px-5 py-3.5">Lead Source &amp; Medium</th>
                <th className="px-5 py-3.5">Campaign / Search Term</th>
                <th className="px-5 py-3.5">Landing &amp; Action</th>
                <th className="px-5 py-3.5">Received</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-white/40">
                    No leads found matching your search or channel filters.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => {
                  const attr = classifyAttribution(lead);
                  return (
                    <tr
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className="transition-colors hover:bg-white/[0.03] cursor-pointer group"
                    >
                      {/* Customer */}
                      <td className="px-5 py-4 font-medium text-white">
                        <div className="group-hover:text-amber-300 transition-colors font-semibold">
                          {lead.name}
                        </div>
                        {lead.email ? (
                          <div className="text-[11px] text-white/40">{lead.email}</div>
                        ) : (
                          <div className="text-[10px] text-white/20 italic">No email provided</div>
                        )}
                      </td>

                      {/* Contact */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 font-mono text-white/90">
                          <Phone className="h-3 w-3 text-[#d98f5b]" />
                          <span>{lead.phone}</span>
                        </div>
                        <div className="mt-1 text-[10px] text-white/40 truncate max-w-[140px]">
                          {lead.tripType} • {lead.guests}
                        </div>
                      </td>

                      {/* Lead Source & Medium */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          {renderChannelBadge(attr.channel)}
                        </div>
                        <div className="mt-1 text-[11px] text-white/50">
                          {attr.medium}
                        </div>
                      </td>

                      {/* Campaign / Search Term */}
                      <td className="px-5 py-4">
                        <div className="font-medium text-white/90 truncate max-w-[180px]">
                          {attr.campaign !== 'Not available' ? (
                            <span className="text-white font-semibold">{attr.campaign}</span>
                          ) : (
                            <span className="text-white/30 italic">Not available</span>
                          )}
                        </div>
                        {attr.searchTerm !== 'Not available' && (
                          <div className="mt-0.5 text-[10px] text-amber-300/80 font-mono truncate max-w-[180px]">
                            Keyword: &quot;{attr.searchTerm}&quot;
                          </div>
                        )}
                        {attr.hasClickId && (
                          <div className="mt-0.5 text-[10px] text-emerald-400 font-mono">
                            ✓ Verified Click ID
                          </div>
                        )}
                      </td>

                      {/* Landing & Action */}
                      <td className="px-5 py-4">
                        <div className="text-[11px] font-mono text-white/80">
                          {attr.landingPage}
                        </div>
                        <div className="mt-1">
                          <span className="inline-block rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-medium text-white/60">
                            {attr.action}
                          </span>
                        </div>
                      </td>

                      {/* Received */}
                      <td className="px-5 py-4 text-[11px] text-white/40 tabular-nums">
                        <div>
                          {new Date(lead.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </div>
                        <div className="text-[10px] text-white/30">
                          {new Date(lead.createdAt).toLocaleTimeString('en-IN', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedLead(lead)}
                            className="inline-flex items-center gap-1 rounded-lg bg-white/5 hover:bg-white/10 px-2.5 py-1.5 text-[11px] font-medium text-white/80 transition-all cursor-pointer"
                            title="Inspect Lead Details"
                          >
                            <Eye className="h-3 w-3 text-amber-400" />
                            <span>Details</span>
                          </button>

                          <button
                            onClick={() => handleWhatsApp(lead.phone, lead.name, lead.tripType)}
                            className="inline-flex items-center gap-1 rounded-lg bg-[#25D366]/20 px-2.5 py-1.5 text-[11px] font-semibold text-[#25D366] transition-all hover:bg-[#25D366] hover:text-white cursor-pointer"
                            title="Chat on WhatsApp"
                          >
                            <MessageSquare className="h-3 w-3" />
                            <span>Chat</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Authorized Lead Detail Drawer / Modal */}
      {selectedLead && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedLead(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="lead-detail-title"
        >
          <div
            className="relative w-full max-w-2xl bg-[#081E23] border border-white/20 rounded-2xl shadow-2xl p-5 sm:p-7 text-white max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 id="lead-detail-title" className="text-lg font-bold text-white font-serif">
                    {selectedLead.name}
                  </h3>
                  <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                    {selectedLead.status}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-white/50">
                  Lead ID: <span className="font-mono text-white/70">{selectedLead.id}</span>
                </p>
              </div>

              <button
                onClick={() => setSelectedLead(null)}
                className="rounded-lg p-1.5 text-white/50 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                aria-label="Close detail modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content Body */}
            {(() => {
              const attr = classifyAttribution(selectedLead);
              return (
                <div className="space-y-6 pt-4 text-xs">
                  {/* Section 1: Customer Contact & Travel Request */}
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5" />
                      <span>Traveler &amp; Itinerary Profile</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white/[0.03] border border-white/5 rounded-xl p-3.5">
                      <div>
                        <span className="text-white/40 block">Phone / WhatsApp</span>
                        <div className="mt-0.5 font-mono text-white font-semibold flex items-center gap-2">
                          <span>{selectedLead.phone}</span>
                          <button
                            onClick={() => handleCopy(selectedLead.phone, 'phone')}
                            className="text-white/40 hover:text-white"
                            title="Copy Phone"
                          >
                            {copiedId === 'phone' ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <span className="text-white/40 block">Email Address</span>
                        <span className="mt-0.5 text-white font-medium">
                          {selectedLead.email || 'Not available'}
                        </span>
                      </div>

                      <div>
                        <span className="text-white/40 block">Trip Preference</span>
                        <span className="mt-0.5 text-[#d98f5b] font-bold">
                          {selectedLead.tripType}
                        </span>
                      </div>

                      <div>
                        <span className="text-white/40 block">Travel Date &amp; Guests</span>
                        <span className="mt-0.5 text-white font-medium">
                          {selectedLead.travelDate} • {selectedLead.guests}
                        </span>
                      </div>

                      {selectedLead.message && (
                        <div className="sm:col-span-2 pt-2 border-t border-white/5">
                          <span className="text-white/40 block">Traveler Message / Notes</span>
                          <p className="mt-1 text-white/80 bg-black/20 p-2.5 rounded-lg border border-white/5 font-mono text-[11px] leading-relaxed">
                            {selectedLead.message}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Section 2: Clear, Human-Readable Marketing Attribution */}
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-2 flex items-center gap-1.5">
                      <Target className="h-3.5 w-3.5" />
                      <span>Marketing Attribution (First-Party)</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white/[0.03] border border-white/5 rounded-xl p-3.5">
                      <div>
                        <span className="text-white/40 block">Lead Source</span>
                        <div className="mt-1 flex items-center gap-2">
                          {renderChannelBadge(attr.channel)}
                        </div>
                      </div>

                      <div>
                        <span className="text-white/40 block">Traffic Medium</span>
                        <span className="mt-0.5 text-white font-semibold">{attr.medium}</span>
                      </div>

                      <div>
                        <span className="text-white/40 block">Campaign Name</span>
                        <span className="mt-0.5 text-white font-mono">{attr.campaign}</span>
                      </div>

                      <div>
                        <span className="text-white/40 block">Search Term (utm_term)</span>
                        <span className="mt-0.5 text-amber-300 font-mono font-medium">
                          {attr.searchTerm}
                        </span>
                      </div>

                      <div>
                        <span className="text-white/40 block">Ad Content (utm_content)</span>
                        <span className="mt-0.5 text-white/80 font-mono">{attr.content}</span>
                      </div>

                      <div>
                        <span className="text-white/40 block">Recorded Landing Page</span>
                        <span className="mt-0.5 text-cyan-300 font-mono">{attr.landingPage}</span>
                      </div>

                      <div>
                        <span className="text-white/40 block">Referring Website</span>
                        <span className="mt-0.5 text-white/80 truncate block">{attr.referrerDomain}</span>
                      </div>

                      <div>
                        <span className="text-white/40 block">Lead Generation Action</span>
                        <span className="mt-0.5 text-white font-semibold">{attr.action}</span>
                      </div>

                      <div className="sm:col-span-2">
                        <span className="text-white/40 block">Lead Created At</span>
                        <span className="mt-0.5 text-white/70 tabular-nums">
                          {new Date(selectedLead.createdAt).toLocaleString('en-IN', {
                            dateStyle: 'full',
                            timeStyle: 'medium',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Technical Identifiers (Authorized Lead-Detail View Only) */}
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-purple-400 mb-2 flex items-center gap-1.5">
                      <Layers className="h-3.5 w-3.5" />
                      <span>Technical Tracking Identifiers</span>
                    </h4>
                    <div className="space-y-2.5 bg-black/30 border border-white/5 rounded-xl p-3.5">
                      {/* GCLID */}
                      <div>
                        <div className="flex items-center justify-between text-white/50 text-[10px]">
                          <span>Google Click Identifier (gclid)</span>
                          {selectedLead.gclid && (
                            <button
                              onClick={() => handleCopy(selectedLead.gclid!, 'gclid')}
                              className="text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                            >
                              {copiedId === 'gclid' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                              <span>{copiedId === 'gclid' ? 'Copied' : 'Copy'}</span>
                            </button>
                          )}
                        </div>
                        <div className="mt-1 font-mono text-[11px] text-white/90 bg-white/5 p-2 rounded-lg break-all">
                          {selectedLead.gclid || <span className="text-white/30 italic">Not available</span>}
                        </div>
                      </div>

                      {/* FBCLID */}
                      <div>
                        <div className="flex items-center justify-between text-white/50 text-[10px]">
                          <span>Meta / Facebook Click Identifier (fbclid)</span>
                          {selectedLead.fbclid && (
                            <button
                              onClick={() => handleCopy(selectedLead.fbclid!, 'fbclid')}
                              className="text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer"
                            >
                              {copiedId === 'fbclid' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                              <span>{copiedId === 'fbclid' ? 'Copied' : 'Copy'}</span>
                            </button>
                          )}
                        </div>
                        <div className="mt-1 font-mono text-[11px] text-white/90 bg-white/5 p-2 rounded-lg break-all">
                          {selectedLead.fbclid || <span className="text-white/30 italic">Not available</span>}
                        </div>
                      </div>

                      {/* Visitor ID & IP */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        <div>
                          <span className="text-white/40 block text-[10px]">Visitor Session UUID</span>
                          <span className="font-mono text-[11px] text-white/70">
                            {selectedLead.visitorId || 'Not available'}
                          </span>
                        </div>
                        <div>
                          <span className="text-white/40 block text-[10px]">Client IP Address</span>
                          <span className="font-mono text-[11px] text-white/70">
                            {selectedLead.ipAddress || 'Not available'}
                          </span>
                        </div>
                      </div>

                      {/* User Agent */}
                      {selectedLead.userAgent && (
                        <div className="pt-1">
                          <span className="text-white/40 block text-[10px]">Client User Agent</span>
                          <span className="font-mono text-[10px] text-white/50 break-all leading-tight block mt-0.5">
                            {selectedLead.userAgent}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Modal Footer Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    <button
                      onClick={() => handleWhatsApp(selectedLead.phone, selectedLead.name, selectedLead.tripType)}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-4 py-2 text-xs font-bold text-white transition-all hover:bg-[#20bd5a] active:scale-98 cursor-pointer shadow-md"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>Direct WhatsApp Message</span>
                    </button>

                    <button
                      onClick={() => setSelectedLead(null)}
                      className="rounded-xl bg-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/15 transition-colors cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};
