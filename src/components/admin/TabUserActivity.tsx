'use client';

import React, { useState } from 'react';
import { Info, Clock, Smartphone, Monitor, Globe, ChevronDown, ChevronUp, UserX, CheckCircle, Navigation, Eye, MousePointer } from 'lucide-react';

export interface SessionEventRecord {
  id: string;
  eventType: string;
  route: string;
  label?: string | null;
  durationSpent?: number | null;
  metadata?: Record<string, unknown> | null;
  timestamp: string;
}

export interface UserSessionRecord {
  id: string;
  visitorId: string;
  name?: string | null;
  phone?: string | null;
  email?: string | null;
  device?: string | null;
  browser?: string | null;
  city?: string | null;
  utmSource?: string | null;
  utmCampaign?: string | null;
  startedAt: string;
  endedAt?: string | null;
  durationSeconds: number;
  converted: boolean;
  events: SessionEventRecord[];
}

interface TabUserActivityProps {
  sessions: UserSessionRecord[];
}

export const TabUserActivity: React.FC<TabUserActivityProps> = ({ sessions }) => {
  const [filter, setFilter] = useState<'ALL' | 'ABANDONED' | 'CONVERTED'>('ALL');
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);

  const filteredSessions = sessions.filter((s) => {
    if (filter === 'ABANDONED') return !s.converted;
    if (filter === 'CONVERTED') return s.converted;
    return true;
  });

  const toggleExpand = (id: string) => {
    setExpandedSessionId(expandedSessionId === id ? null : id);
  };

  const formatDuration = (sec: number) => {
    if (sec < 60) return `${sec}s`;
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'PAGE_VIEW':
        return <Navigation className="h-3.5 w-3.5 text-blue-400" />;
      case 'SCROLL_DEPTH':
        return <Eye className="h-3.5 w-3.5 text-amber-400" />;
      case 'MODAL_OPEN':
        return <MousePointer className="h-3.5 w-3.5 text-[#d98f5b]" />;
      case 'EXIT':
        return <UserX className="h-3.5 w-3.5 text-red-400" />;
      default:
        return <Clock className="h-3.5 w-3.5 text-white/50" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Human Friendly Header */}
      <div className="border-b border-white/10 pb-3">
        <h3 className="font-serif text-lg font-bold text-white">
          Visitor Activity & Drop-off Tracker
        </h3>
        <p className="mt-1 text-xs text-white/60">
          Understand how travelers explore your Kashmir tour packages. Discover what they viewed and where they decided to exit without booking.
        </p>
      </div>

      {/* 2. Filters & Metrics */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 rounded-xl bg-white/5 p-1 border border-white/10">
          <button
            onClick={() => setFilter('ALL')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
              filter === 'ALL' ? 'bg-[#d98f5b] text-white shadow-md' : 'text-white/60 hover:text-white'
            }`}
          >
            All Visitors ({sessions.length})
          </button>
          <button
            onClick={() => setFilter('ABANDONED')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
              filter === 'ABANDONED' ? 'bg-amber-600 text-white shadow-md' : 'text-white/60 hover:text-white'
            }`}
          >
            Left Without Booking ({sessions.filter((s) => !s.converted).length})
          </button>
          <button
            onClick={() => setFilter('CONVERTED')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
              filter === 'CONVERTED' ? 'bg-emerald-600 text-white shadow-md' : 'text-white/60 hover:text-white'
            }`}
          >
            Sent Inquiry ({sessions.filter((s) => s.converted).length})
          </button>
        </div>

        <span className="text-xs text-white/40">
          Showing {filteredSessions.length} traveler visits
        </span>
      </div>

      {/* 3. Session Cards List */}
      <div className="space-y-3">
        {filteredSessions.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-[#0B1F2A]/60 p-12 text-center text-xs text-white/40">
            No visitor journeys recorded yet. As travelers browse your website, their paths will appear here.
          </div>
        ) : (
          filteredSessions.map((session) => {
            const isExpanded = expandedSessionId === session.id;
            const exitEvent = [...session.events].reverse().find((e) => e.eventType === 'EXIT');
            const lastRoute = session.events[session.events.length - 1]?.route || '/';

            return (
              <div
                key={session.id}
                className="overflow-hidden rounded-2xl border border-white/10 bg-[#0B1F2A]/70 shadow-lg transition-all hover:border-white/20"
              >
                {/* Summary Header Card */}
                <div
                  onClick={() => toggleExpand(session.id)}
                  className="flex cursor-pointer flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        session.converted
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {session.converted ? <CheckCircle className="h-5 w-5" /> : <UserX className="h-5 w-5" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-white">
                          {session.name ? session.name : `Visitor #${session.visitorId.slice(-6)}`}
                        </span>
                        {session.converted ? (
                          <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                            INQUIRY SUBMITTED
                          </span>
                        ) : (
                          <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-white/70">
                            Left at {lastRoute}
                          </span>
                        )}
                      </div>

                      {/* Meta Pills */}
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-white/50">
                        <span className="flex items-center gap-1">
                          {session.device === 'Mobile' ? <Smartphone className="h-3 w-3" /> : <Monitor className="h-3 w-3" />}
                          {session.device || 'Desktop'} · {session.browser || 'Browser'}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          {session.utmSource ? `Ad: ${session.utmSource}` : 'Direct / Organic'}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-[#d98f5b]" />
                          Time: {formatDuration(session.durationSeconds)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-white/40">
                    <span>{new Date(session.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <button className="flex items-center gap-1 rounded-lg bg-white/5 px-2.5 py-1 text-white/70 hover:bg-white/10">
                      <span>{isExpanded ? 'Close Path' : 'View Browsing Path'}</span>
                      {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Journey Timeline Tree */}
                {isExpanded && (
                  <div className="border-t border-white/10 bg-black/20 p-5">
                    <h4 className="mb-4 text-[11px] font-semibold uppercase tracking-wider text-white/60">
                      Step-by-Step Browsing Path ({session.events.length} Actions)
                    </h4>

                    {session.events.length === 0 ? (
                      <p className="text-xs text-white/40">No granular steps recorded for this session.</p>
                    ) : (
                      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
                        {session.events.map((ev, idx) => (
                          <div key={ev.id || idx} className="relative flex items-start gap-3">
                            {/* Step Node Dot */}
                            <div className="absolute -left-6 mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#0B1F2A] border border-white/20">
                              {getEventIcon(ev.eventType)}
                            </div>

                            {/* Event Details */}
                            <div className="flex-1 rounded-xl border border-white/5 bg-white/[0.02] p-3">
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-xs text-white">
                                  {ev.label || `${ev.eventType} on ${ev.route}`}
                                </span>
                                <span className="font-mono text-[10px] text-white/40">
                                  {new Date(ev.timestamp).toLocaleTimeString()}
                                </span>
                              </div>

                              <div className="mt-1 flex items-center gap-2 text-[11px] text-white/50">
                                <span className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] font-mono text-white/70">
                                  {ev.route}
                                </span>
                                {ev.durationSpent ? (
                                  <span className="text-amber-400 font-medium">
                                    Spent {ev.durationSpent}s on this step
                                  </span>
                                ) : null}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
