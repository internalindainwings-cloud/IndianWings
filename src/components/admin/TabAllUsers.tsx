'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Mail,
  Phone,
  Search,
  Download,
  Calendar,
  Users,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  Clock,
  Sparkles,
  MapPin,
  MessageSquare,
  X,
  ChevronRight,
  Send,
} from 'lucide-react';
import type { AdminUserRecord } from '@/app/api/admin/users/route';

export const TabAllUsers: React.FC = () => {
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    usersWithPhone: 0,
    convertedUsers: 0,
    newThisWeek: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sourceFilter, setSourceFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState<'latest' | 'oldest' | 'inquiries' | 'name'>('latest');
  const [selectedUser, setSelectedUser] = useState<AdminUserRecord | null>(null);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const fetchUsers = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) setIsRefreshing(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.success) {
        setUsers(data.users || []);
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Extract unique sources for filter dropdown
  const allSources = useMemo(() => {
    const s = new Set<string>();
    users.forEach((u) => u.sources?.forEach((src) => s.add(src)));
    return Array.from(s);
  }, [users]);

  // Filter and sort users
  const filteredUsers = useMemo(() => {
    return users
      .filter((user) => {
        const matchesSearch =
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.phone.includes(searchTerm) ||
          (user.city && user.city.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesStatus = statusFilter === 'ALL' || user.status === statusFilter;
        const matchesSource = sourceFilter === 'ALL' || user.sources.includes(sourceFilter);

        return matchesSearch && matchesStatus && matchesSource;
      })
      .sort((a, b) => {
        if (sortBy === 'latest') {
          return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime();
        }
        if (sortBy === 'oldest') {
          return new Date(a.firstSeen).getTime() - new Date(b.firstSeen).getTime();
        }
        if (sortBy === 'inquiries') {
          return b.totalInquiries - a.totalInquiries;
        }
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        return 0;
      });
  }, [users, searchTerm, statusFilter, sourceFilter, sortBy]);

  // Copy email helper
  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  // Export CSV
  const handleExportCSV = () => {
    if (filteredUsers.length === 0) return;

    const headers = ['Email', 'Name', 'Phone', 'City', 'Status', 'Total Inquiries', 'Sources', 'First Registered', 'Last Active'];
    const rows = filteredUsers.map((u) => [
      `"${u.email}"`,
      `"${u.name.replace(/"/g, '""')}"`,
      `"${u.phone}"`,
      `"${u.city || ''}"`,
      `"${u.status}"`,
      u.totalInquiries,
      `"${u.sources.join('; ')}"`,
      `"${new Date(u.firstSeen).toLocaleString()}"`,
      `"${new Date(u.lastActive).toLocaleString()}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `the_indian_wings_all_users_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Open WhatsApp
  const handleWhatsApp = (phone: string, name: string) => {
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    const text = encodeURIComponent(
      `Hello ${name}! Greetings from The Indian Wings Company Srinagar. How can we assist you with your Kashmir holiday plans today?`
    );
    window.open(`https://wa.me/${cleanPhone.replace('+', '')}?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-wide">
              All Registered Users & Emails
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#C5A45E]/15 border border-[#C5A45E]/40 text-[#C5A45E]">
              {users.length} Users
            </span>
          </div>
          <p className="mt-1 text-xs text-white/60">
            Database of every customer, traveler, and visitor whose email has been saved in the system.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fetchUsers(true)}
            disabled={isRefreshing}
            className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs text-white/80 transition-all inline-flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#C5A45E]' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            disabled={filteredUsers.length === 0}
            className="px-4 py-2 rounded-xl bg-[#C5A45E] hover:bg-[#b5944e] text-midnight font-bold text-xs shadow-md hover:shadow-[#C5A45E]/20 transition-all inline-flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 2. Key Telemetry Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10">
          <div className="flex items-center justify-between text-white/60 mb-2">
            <span className="text-xs font-medium">Total Saved Emails</span>
            <Mail className="w-4 h-4 text-[#C5A45E]" />
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">{stats.totalUsers}</div>
          <span className="text-[10px] text-white/40">Unique customer identities</span>
        </div>

        <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10">
          <div className="flex items-center justify-between text-white/60 mb-2">
            <span className="text-xs font-medium">With Phone Numbers</span>
            <Phone className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 tracking-tight">{stats.usersWithPhone}</div>
          <span className="text-[10px] text-white/40">Ready for direct WhatsApp call</span>
        </div>

        <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10">
          <div className="flex items-center justify-between text-white/60 mb-2">
            <span className="text-xs font-medium">Converted / Quoted</span>
            <CheckCircle2 className="w-4 h-4 text-[#C5A45E]" />
          </div>
          <div className="text-2xl font-bold text-[#C5A45E] tracking-tight">{stats.convertedUsers}</div>
          <span className="text-[10px] text-white/40">Engaged with itineraries</span>
        </div>

        <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10">
          <div className="flex items-center justify-between text-white/60 mb-2">
            <span className="text-xs font-medium">New This Week</span>
            <Sparkles className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold text-sky-400 tracking-tight">{stats.newThisWeek}</div>
          <span className="text-[10px] text-white/40">Captured in last 7 days</span>
        </div>
      </div>

      {/* 3. Filter and Search Controls */}
      <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search email, name, phone, city..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-black/40 border border-white/15 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#C5A45E]"
          />
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-black/40 border border-white/15 text-xs text-white/80 focus:outline-none focus:border-[#C5A45E]"
          >
            <option value="ALL">All Statuses</option>
            <option value="NEW">New</option>
            <option value="CONTACTED">Contacted</option>
            <option value="QUOTED">Quoted</option>
            <option value="WON">Won / Booked</option>
            <option value="LOST">Lost</option>
          </select>

          {/* Source Filter */}
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-black/40 border border-white/15 text-xs text-white/80 focus:outline-none focus:border-[#C5A45E]"
          >
            <option value="ALL">All Sources</option>
            {allSources.map((src) => (
              <option key={src} value={src}>
                {src}
              </option>
            ))}
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 rounded-lg bg-black/40 border border-white/15 text-xs text-white/80 focus:outline-none focus:border-[#C5A45E]"
          >
            <option value="latest">Latest Active</option>
            <option value="oldest">Earliest First</option>
            <option value="inquiries">Most Inquiries</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* 4. Users Table */}
      {isLoading ? (
        <div className="py-20 text-center text-white/50 text-xs">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#C5A45E]" />
          Loading users database...
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="py-16 text-center rounded-xl bg-white/[0.02] border border-white/10">
          <Users className="w-10 h-10 text-white/30 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-white">No Users Found</h3>
          <p className="text-xs text-white/50 mt-1 max-w-sm mx-auto">
            {searchTerm || statusFilter !== 'ALL' || sourceFilter !== 'ALL'
              ? 'No users match your current filter settings. Try adjusting search terms.'
              : 'As soon as visitors submit an inquiry or download itineraries, their emails will show up here.'}
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-white/10 overflow-hidden bg-[#0a2329]/50">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-white/80">
              <thead className="bg-black/30 border-b border-white/10 text-[11px] uppercase tracking-wider text-white/50">
                <tr>
                  <th className="px-4 py-3">User & Email</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Inquiries</th>
                  <th className="px-4 py-3">Sources</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Last Active</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-manrope">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.email}
                    className="hover:bg-white/[0.03] transition-colors cursor-pointer"
                    onClick={() => setSelectedUser(user)}
                  >
                    {/* User & Email */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#C5A45E]/15 border border-[#C5A45E]/30 flex items-center justify-center shrink-0 text-[#C5A45E] font-bold text-xs">
                          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-white truncate flex items-center gap-1.5">
                            <span>{user.name}</span>
                            {user.city && (
                              <span className="text-[10px] text-white/50 inline-flex items-center gap-0.5 font-normal">
                                <MapPin className="w-2.5 h-2.5" />
                                {user.city}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-[#C5A45E] font-mono flex items-center gap-1.5 mt-0.5">
                            <span className="truncate">{user.email}</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyEmail(user.email);
                              }}
                              className="text-white/40 hover:text-white p-0.5"
                              title="Copy Email"
                            >
                              {copiedEmail === user.email ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="px-4 py-3.5">
                      {user.phone ? (
                        <span className="font-mono text-white/90 text-xs">{user.phone}</span>
                      ) : (
                        <span className="text-white/30 italic text-[11px]">None provided</span>
                      )}
                    </td>

                    {/* Inquiries */}
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-white/10 text-white border border-white/10">
                        {user.totalInquiries} {user.totalInquiries === 1 ? 'Inquiry' : 'Inquiries'}
                      </span>
                    </td>

                    {/* Sources */}
                    <td className="px-4 py-3.5">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {user.sources.slice(0, 2).map((s) => (
                          <span
                            key={s}
                            className="px-2 py-0.5 rounded-md text-[10px] bg-black/40 text-white/70 border border-white/10 truncate max-w-[120px]"
                          >
                            {s}
                          </span>
                        ))}
                        {user.sources.length > 2 && (
                          <span className="px-1.5 py-0.5 rounded-md text-[10px] text-white/50 bg-black/30">
                            +{user.sources.length - 2}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          user.status === 'WON'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : user.status === 'QUOTED'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : user.status === 'CONTACTED'
                            ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                            : user.status === 'LOST'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-white/10 text-white/70 border border-white/10'
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>

                    {/* Last Active */}
                    <td className="px-4 py-3.5 text-white/60 text-[11px] whitespace-nowrap">
                      {new Date(user.lastActive).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                        {/* Direct Email Link */}
                        <a
                          href={`mailto:${user.email}`}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-colors"
                          title="Send Email"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </a>

                        {/* WhatsApp Button */}
                        {user.phone && (
                          <button
                            type="button"
                            onClick={() => handleWhatsApp(user.phone, user.name)}
                            className="p-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 transition-colors"
                            title="Open WhatsApp"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Details Drawer Trigger */}
                        <button
                          type="button"
                          onClick={() => setSelectedUser(user)}
                          className="p-1.5 rounded-lg bg-[#C5A45E]/15 hover:bg-[#C5A45E]/30 text-[#C5A45E] transition-colors"
                          title="View Details"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. User Details Modal / Drawer */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in font-manrope">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#081E23] border border-[#C5A45E]/30 p-6 shadow-2xl space-y-6">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#C5A45E]/15 border border-[#C5A45E]/30 flex items-center justify-center text-[#C5A45E] font-bold text-lg">
                  {selectedUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedUser.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-[#C5A45E] font-mono mt-0.5">
                    <span>{selectedUser.email}</span>
                    <button
                      type="button"
                      onClick={() => handleCopyEmail(selectedUser.email)}
                      className="text-white/40 hover:text-white"
                    >
                      {copiedEmail === selectedUser.email ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Contact Bar */}
            <div className="flex flex-wrap gap-2">
              <a
                href={`mailto:${selectedUser.email}`}
                className="px-3.5 py-2 rounded-xl bg-[#C5A45E] hover:bg-[#b5944e] text-midnight font-bold text-xs shadow-md transition-all inline-flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Email</span>
              </a>

              {selectedUser.phone && (
                <button
                  type="button"
                  onClick={() => handleWhatsApp(selectedUser.phone, selectedUser.name)}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all inline-flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>WhatsApp Chat</span>
                </button>
              )}
            </div>

            {/* User Meta Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                <span className="text-white/40 block text-[11px]">Phone Number</span>
                <span className="font-mono text-white mt-1 block">
                  {selectedUser.phone || 'Not provided'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                <span className="text-white/40 block text-[11px]">City / Location</span>
                <span className="text-white mt-1 block">
                  {selectedUser.city || 'Undetected'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                <span className="text-white/40 block text-[11px]">Lead Status</span>
                <span className="font-bold text-[#C5A45E] mt-1 block uppercase">
                  {selectedUser.status}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                <span className="text-white/40 block text-[11px]">First Registered</span>
                <span className="text-white/80 mt-1 block">
                  {new Date(selectedUser.firstSeen).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                <span className="text-white/40 block text-[11px]">Last Active</span>
                <span className="text-white/80 mt-1 block">
                  {new Date(selectedUser.lastActive).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                <span className="text-white/40 block text-[11px]">Device / Browser</span>
                <span className="text-white/80 mt-1 block truncate">
                  {selectedUser.device || selectedUser.browser || 'Web Browser'}
                </span>
              </div>
            </div>

            {/* Inquiries Timeline */}
            <div>
              <h4 className="text-xs uppercase tracking-wider text-white/50 mb-3 font-semibold">
                Inquiries & Itinerary History ({selectedUser.inquiries.length})
              </h4>

              {selectedUser.inquiries.length === 0 ? (
                <p className="text-xs text-white/40 italic p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  Captured via visitor session / newsletter / brochure download.
                </p>
              ) : (
                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {selectedUser.inquiries.map((inq) => (
                    <div
                      key={inq.id}
                      className="p-3.5 rounded-xl bg-black/40 border border-white/10 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-white/60 text-[11px]">
                        <span className="font-semibold text-white">{inq.tripType}</span>
                        <span>
                          {new Date(inq.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2 text-[11px] text-white/70">
                        <span>📅 Travel Date: {inq.travelDate}</span>
                        <span>👥 Guests: {inq.guests}</span>
                        <span className="text-[#C5A45E]">📍 Source: {inq.source}</span>
                      </div>

                      {inq.message && (
                        <p className="text-white/80 bg-white/5 p-2 rounded-lg text-[11px] mt-1 border border-white/5">
                          "{inq.message}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
