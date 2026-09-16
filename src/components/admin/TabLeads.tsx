'use client';

import React, { useState } from 'react';
import { Download, MessageSquare, Phone, Calendar, Users, Info, Search, Filter } from 'lucide-react';

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
  utmCampaign?: string | null;
  status: string;
  createdAt: string;
}

interface TabLeadsProps {
  leads: LeadRecord[];
  onRefresh: () => void;
}

export const TabLeads: React.FC<TabLeadsProps> = ({ leads }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTripType, setSelectedTripType] = useState('ALL');

  // Filter leads
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm) ||
      (lead.email && lead.email.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = selectedTripType === 'ALL' || lead.tripType === selectedTripType;

    return matchesSearch && matchesType;
  });

  // Export to CSV
  const handleExportCSV = () => {
    if (leads.length === 0) return;

    const headers = ['ID', 'Date', 'Name', 'Phone', 'Email', 'Trip Type', 'Guests', 'Travel Date', 'Source', 'Campaign', 'Message'];
    const rows = filteredLeads.map((l) => [
      l.id,
      new Date(l.createdAt).toLocaleString(),
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.phone}"`,
      l.email || '',
      `"${l.tripType}"`,
      `"${l.guests}"`,
      `"${l.travelDate}"`,
      l.utmSource || l.source,
      l.utmCampaign || '',
      `"${(l.message || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `the_indian_wings_leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Open WhatsApp chat directly with pre-filled greeting
  const handleWhatsApp = (phone: string, name: string, tripType: string) => {
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    const text = encodeURIComponent(
      `Hello ${name}! Greetings from The Indian Wings Company Srinagar. Regarding your enquiry for ${tripType}, we are excited to share a customized Kashmir itinerary with you.`
    );
    window.open(`https://wa.me/${cleanPhone.replace('+', '')}?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* 1. Human Friendly Header */}
      <div className="border-b border-white/10 pb-3">
        <h3 className="font-serif text-lg font-bold text-white">
          Traveler Inquiries & Booking Requests
        </h3>
        <p className="mt-1 text-xs text-white/60">
          Direct trip inquiries submitted through your website. Tap WhatsApp to connect immediately with the client, or export records to Excel.
        </p>
      </div>

      {/* 2. Controls & Search Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Search by customer name, phone, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-xs text-white placeholder-white/30 focus:border-[#d98f5b] focus:outline-none"
            />
          </div>

          {/* Trip Type Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-3.5 w-3.5 text-white/40" />
            <select
              value={selectedTripType}
              onChange={(e) => setSelectedTripType(e.target.value)}
              className="rounded-xl border border-white/10 bg-[#0B1F2A] px-3 py-2.5 text-xs text-white focus:border-[#d98f5b] focus:outline-none"
            >
              <option value="ALL">All Trip Types</option>
              <option value="Kashmir Classic">Kashmir Classic</option>
              <option value="Honeymoon Special">Honeymoon Special</option>
              <option value="Luxury Kashmir">Luxury Kashmir</option>
              <option value="Adventure & Trekking">Adventure & Trekking</option>
              <option value="Custom Itinerary">Custom Itinerary</option>
            </select>
          </div>
        </div>

        {/* Export Button */}
        <button
          onClick={handleExportCSV}
          disabled={leads.length === 0}
          className="flex items-center justify-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-xs font-semibold text-white transition-all hover:bg-white/15 active:scale-95 disabled:opacity-40"
        >
          <Download className="h-4 w-4 text-[#d98f5b]" />
          <span>Export to CSV ({filteredLeads.length})</span>
        </button>
      </div>

      {/* 3. Leads Table */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0B1F2A]/60 shadow-xl backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-white/80">
            <thead className="border-b border-white/10 bg-white/[0.03] text-[11px] font-semibold uppercase tracking-wider text-white/50">
              <tr>
                <th className="px-5 py-3.5">Customer</th>
                <th className="px-5 py-3.5">Contact / WhatsApp</th>
                <th className="px-5 py-3.5">Travel Plan</th>
                <th className="px-5 py-3.5">Marketing Source</th>
                <th className="px-5 py-3.5">Received</th>
                <th className="px-5 py-3.5 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-white/40">
                    No leads found matching your search criteria.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="transition-colors hover:bg-white/[0.02]">
                    {/* Customer */}
                    <td className="px-5 py-4 font-medium text-white">
                      <div>{lead.name}</div>
                      {lead.email && <div className="text-[11px] text-white/40">{lead.email}</div>}
                    </td>

                    {/* Contact */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 font-mono text-white/90">
                        <Phone className="h-3 w-3 text-[#d98f5b]" />
                        <span>{lead.phone}</span>
                      </div>
                    </td>

                    {/* Travel Plan */}
                    <td className="px-5 py-4">
                      <div className="inline-block rounded-full bg-[#d98f5b]/15 px-2.5 py-0.5 text-[11px] font-semibold text-[#d98f5b]">
                        {lead.tripType}
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-[11px] text-white/50">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {lead.travelDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {lead.guests}
                        </span>
                      </div>
                    </td>

                    {/* Source */}
                    <td className="px-5 py-4">
                      <span className="inline-block rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-white/70">
                        {lead.utmSource ? `Ad: ${lead.utmSource}` : lead.source}
                      </span>
                      {lead.utmCampaign && (
                        <div className="mt-0.5 text-[10px] text-white/40">{lead.utmCampaign}</div>
                      )}
                    </td>

                    {/* Received */}
                    <td className="px-5 py-4 text-[11px] text-white/40">
                      {new Date(lead.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>

                    {/* Action */}
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => handleWhatsApp(lead.phone, lead.name, lead.tripType)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#25D366]/20 px-3 py-1.5 text-[11px] font-semibold text-[#25D366] transition-all hover:bg-[#25D366] hover:text-white"
                        title="Chat on WhatsApp"
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span>WhatsApp</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
