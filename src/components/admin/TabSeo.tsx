'use client';

import React, { useState } from 'react';
import { Globe, FileText, CheckCircle, AlertTriangle, UploadCloud, Save } from 'lucide-react';

interface ParsedData {
  title: string;
  slug: string;
  metaDescription: string;
  metaTitle: string;
  ctaSuggestion: string;
  internalLinks: Array<{ anchor: string; url: string; reason: string }>;
}

export const TabSeo: React.FC = () => {
  const [content, setContent] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);

  const handleParse = async () => {
    if (!content.trim()) {
      alert('Please paste some blog content first');
      return;
    }

    setIsParsing(true);
    try {
      const res = await fetch('/api/admin/blogs/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setParsedData(data);
        alert('SEO metadata extracted successfully!');
      } else {
        alert(data.error || 'Failed to parse content');
      }
    } catch (error) {
      alert('Network error during parsing');
    } finally {
      setIsParsing(false);
    }
  };

  const handlePublish = async () => {
    if (!parsedData || !content.trim()) return;
    
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: parsedData.title,
          slug: parsedData.slug,
          content: content,
          metaDescription: parsedData.metaDescription,
        }),
      });
      const data = await res.json();
      
      if (res.ok) {
        alert('Blog published successfully!');
        setParsedData(null);
        setContent('');
      } else {
        alert(data.error || 'Failed to publish blog');
      }
    } catch (error) {
      alert('Network error during publishing');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 pb-20 max-w-5xl mx-auto">
      {/* ── 1. Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#d98f5b]/15 text-[#d98f5b] border border-[#d98f5b]/30">
              <Globe className="h-5 w-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Blog Upload & SEO Hub
            </h1>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-white/60">
            Paste your raw blog content. The system will automatically extract SEO tags and link suggestions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ── 2. Content Input Area ── */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-sky-400" /> Raw Content
            </h2>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste your blog content here (Markdown or Plain text)..."
            className="w-full h-[500px] p-4 bg-[#0B1E2A]/60 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#d98f5b] resize-none"
          />
          <button
            onClick={handleParse}
            disabled={isParsing || !content.trim()}
            className="flex items-center justify-center gap-2 w-full py-3 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white rounded-xl font-medium transition-colors"
          >
            <UploadCloud className="w-5 h-5" />
            {isParsing ? 'Extracting SEO Data...' : 'Extract & Analyze SEO'}
          </button>
        </div>

        {/* ── 3. SEO Review Panel ── */}
        <div className="flex flex-col space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-400" /> SEO Checklist & Suggestions
          </h2>
          
          <div className="flex-1 bg-[#0B1E2A]/60 border border-white/10 rounded-xl p-6 overflow-y-auto max-h-[500px]">
            {!parsedData ? (
              <div className="h-full flex flex-col items-center justify-center text-white/40 space-y-3">
                <Globe className="w-12 h-12 opacity-50" />
                <p>Paste content and click Extract to see SEO suggestions.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1 block">Extracted Title (H1)</label>
                  <input
                    type="text"
                    value={parsedData.title}
                    onChange={(e) => setParsedData({ ...parsedData, title: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1 block">SEO Slug</label>
                  <input
                    type="text"
                    value={parsedData.slug}
                    onChange={(e) => setParsedData({ ...parsedData, slug: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white/70 text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1 block">Meta Description ({parsedData.metaDescription.length}/155)</label>
                  <textarea
                    value={parsedData.metaDescription}
                    onChange={(e) => setParsedData({ ...parsedData, metaDescription: e.target.value })}
                    className="w-full h-24 bg-black/40 border border-white/10 rounded-lg p-2 text-white text-sm resize-none"
                  />
                </div>

                {parsedData.internalLinks.length > 0 && (
                  <div className="bg-sky-500/10 border border-sky-500/20 rounded-lg p-4">
                    <h3 className="text-sm font-bold text-sky-400 mb-2 flex items-center gap-2">
                      <Globe className="w-4 h-4" /> Internal Linking Opportunities
                    </h3>
                    <ul className="space-y-2 text-sm text-white/80">
                      {parsedData.internalLinks.map((link, idx) => (
                        <li key={idx} className="flex flex-col gap-1 pb-2 border-b border-white/5 last:border-0 last:pb-0">
                          <span className="font-medium text-emerald-300">Anchor: "{link.anchor}"</span>
                          <span className="text-xs text-white/50">→ {link.url} ({link.reason})</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-bold text-amber-400">Recommended CTA</h3>
                    <p className="text-xs text-white/70 mt-1">Based on content: <strong>{parsedData.ctaSuggestion}</strong></p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handlePublish}
            disabled={!parsedData || isSaving}
            className="flex items-center justify-center gap-2 w-full py-3 bg-[#d98f5b] hover:bg-[#c47d4a] disabled:opacity-50 text-white rounded-xl font-medium transition-colors"
          >
            <Save className="w-5 h-5" />
            {isSaving ? 'Publishing...' : 'Approve & Publish Blog'}
          </button>
        </div>
      </div>
    </div>
  );
};

