const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const planningDir = path.join(rootDir, '.planning');
const mdPath = path.join(planningDir, 'Project_Documentation.md');
const htmlPath = path.join(planningDir, 'Project_Documentation.html');
const pdfPathPrimary = path.join(planningDir, 'Project_Documentation.pdf');
const pdfPathSecondary = path.join(planningDir, 'Project documentation.pdf');

// Read markdown
const mdContent = fs.readFileSync(mdPath, 'utf8');

// Basic Markdown to HTML converter with luxury styling
function markdownToHtml(md) {
  let html = md
    // Escape HTML special characters
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Restore markdown elements
    .replace(/&lt;br\/?&gt;/g, '<br/>');

  // Headings
  html = html.replace(/^# (.*$)/gim, '<h1 class="doc-title">$1</h1>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="section-title">$1</h2>');
  html = html.replace(/^### (.*$)/gim, '<h3 class="subsection-title">$1</h3>');
  html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');

  // Bold, italic, code
  html = html.replace(/\*\*\*(.*?)\*\*\*/gim, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');
  html = html.replace(/`([^`]+)`/gim, '<code class="inline-code">$1</code>');

  // Horizontal rules
  html = html.replace(/^---$/gim, '<hr class="divider"/>');

  // Blockquotes / alerts
  html = html.replace(/^\> (.*$)/gim, '<blockquote class="callout">$1</blockquote>');

  // Tables
  const lines = html.split('\n');
  let inTable = false;
  let tableBuffer = [];
  const processedLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('|') && line.endsWith('|')) {
      if (!inTable) {
        inTable = true;
        tableBuffer = [];
      }
      tableBuffer.push(line);
    } else {
      if (inTable) {
        // Convert tableBuffer to HTML table
        processedLines.push(convertTable(tableBuffer));
        inTable = false;
        tableBuffer = [];
      }
      processedLines.push(line);
    }
  }
  if (inTable) {
    processedLines.push(convertTable(tableBuffer));
  }

  html = processedLines.join('\n');

  // Lists
  html = html.replace(/^\- (.*$)/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/gim, '<ul>$1</ul>');
  // Clean adjacent ul tags
  html = html.replace(/<\/ul>\n<ul>/gim, '\n');

  // Code blocks
  html = html.replace(/```([a-z]*)\n([\s\S]*?)```/gim, '<pre class="code-block"><code>$2</code></pre>');

  // Paragraphs
  const paragraphs = html.split('\n\n');
  html = paragraphs.map(p => {
    const trimmed = p.trim();
    if (!trimmed) return '';
    if (trimmed.startsWith('<h') || trimmed.startsWith('<ul') || trimmed.startsWith('<pre') || trimmed.startsWith('<table') || trimmed.startsWith('<hr') || trimmed.startsWith('<block')) {
      return trimmed;
    }
    return `<p>${trimmed}</p>`;
  }).join('\n\n');

  return html;
}

function convertTable(tableLines) {
  if (tableLines.length < 2) return tableLines.join('\n');
  const headers = tableLines[0].split('|').slice(1, -1).map(h => h.trim());
  const rows = tableLines.slice(2).map(row => row.split('|').slice(1, -1).map(c => c.trim()));

  let tableHtml = '<table class="data-table">\n<thead>\n<tr>';
  headers.forEach(h => { tableHtml += `<th>${h}</th>`; });
  tableHtml += '</tr>\n</thead>\n<tbody>\n';

  rows.forEach(r => {
    tableHtml += '<tr>';
    r.forEach(cell => { tableHtml += `<td>${cell}</td>`; });
    tableHtml += '</tr>\n';
  });

  tableHtml += '</tbody>\n</table>';
  return tableHtml;
}

const bodyHtml = markdownToHtml(mdContent);

const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>The Indian Wings Company — Project Documentation</title>
  <style>
    @page {
      size: A4;
      margin: 18mm 16mm 20mm 16mm;
      @bottom-right {
        content: "Page " counter(page);
        font-size: 8pt;
        color: #64748b;
      }
    }
    *, *::before, *::after {
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #1e293b;
      background-color: #ffffff;
      line-height: 1.6;
      font-size: 10.5pt;
      margin: 0;
      padding: 0;
    }
    .header-banner {
      background: linear-gradient(135deg, #0B1F2A 0%, #17384E 100%);
      color: #ffffff;
      padding: 32px 28px;
      border-radius: 8px;
      margin-bottom: 28px;
      border-bottom: 4px solid #F97316;
    }
    .header-badge {
      display: inline-block;
      background-color: #F97316;
      color: #ffffff;
      font-size: 8.5pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      padding: 4px 10px;
      border-radius: 4px;
      margin-bottom: 12px;
    }
    .header-title {
      font-size: 24pt;
      font-weight: 800;
      margin: 0 0 6px 0;
      color: #ffffff;
      letter-spacing: -0.5px;
    }
    .header-subtitle {
      font-size: 12pt;
      color: #cbd5e1;
      margin: 0;
      font-weight: 400;
    }
    .header-meta {
      margin-top: 16px;
      font-size: 8.5pt;
      color: #94a3b8;
      display: flex;
      gap: 20px;
    }
    h1.doc-title {
      display: none; /* Replaced by header banner */
    }
    h2.section-title {
      font-size: 15pt;
      font-weight: 700;
      color: #0B1F2A;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 6px;
      margin-top: 28px;
      margin-bottom: 12px;
      page-break-after: avoid;
    }
    h3.subsection-title {
      font-size: 12pt;
      font-weight: 600;
      color: #0369a1;
      margin-top: 18px;
      margin-bottom: 8px;
      page-break-after: avoid;
    }
    h4 {
      font-size: 11pt;
      font-weight: 600;
      color: #334155;
      margin-top: 14px;
      margin-bottom: 6px;
      page-break-after: avoid;
    }
    p {
      margin: 0 0 10px 0;
      text-align: justify;
    }
    ul, ol {
      margin: 0 0 12px 0;
      padding-left: 20px;
    }
    li {
      margin-bottom: 4px;
    }
    .inline-code {
      background-color: #f1f5f9;
      color: #0f172a;
      font-family: Consolas, Monaco, "Courier New", monospace;
      font-size: 9pt;
      padding: 2px 5px;
      border-radius: 4px;
      border: 1px solid #e2e8f0;
    }
    .code-block {
      background-color: #0f172a;
      color: #f8fafc;
      font-family: Consolas, Monaco, "Courier New", monospace;
      font-size: 8.5pt;
      line-height: 1.45;
      padding: 14px 16px;
      border-radius: 6px;
      overflow-x: auto;
      margin: 12px 0;
      page-break-inside: avoid;
      border-left: 4px solid #F97316;
    }
    .data-table {
      width: 100%;
      border-collapse: collapse;
      margin: 14px 0;
      font-size: 9pt;
      page-break-inside: avoid;
    }
    .data-table th {
      background-color: #0B1F2A;
      color: #ffffff;
      font-weight: 600;
      text-align: left;
      padding: 8px 10px;
      border: 1px solid #1e293b;
    }
    .data-table td {
      padding: 7px 10px;
      border: 1px solid #e2e8f0;
      vertical-align: top;
    }
    .data-table tr:nth-child(even) {
      background-color: #f8fafc;
    }
    .callout {
      background-color: #f0fdf4;
      border-left: 4px solid #16a34a;
      padding: 10px 14px;
      margin: 12px 0;
      border-radius: 0 6px 6px 0;
      font-size: 9.5pt;
      page-break-inside: avoid;
    }
    .divider {
      border: none;
      border-top: 1px solid #e2e8f0;
      margin: 24px 0;
    }
    .footer-note {
      margin-top: 40px;
      padding-top: 16px;
      border-top: 1px solid #e2e8f0;
      font-size: 8pt;
      color: #64748b;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="header-banner">
    <div class="header-badge">Official Technical Manual</div>
    <h1 class="header-title">The Indian Wings Company</h1>
    <p class="header-subtitle">Comprehensive Architectural, Engineering & Production Deployment Documentation</p>
    <div class="header-meta">
      <span><strong>Architecture:</strong> Next.js 16 + Express + Neon + Upstash</span>
      <span><strong>Status:</strong> Production Ready</span>
      <span><strong>Date:</strong> September 2026</span>
    </div>
  </div>

  ${bodyHtml}

  <div class="footer-note">
    The Indian Wings Company — Proprietary & Confidential Technical Specification.<br/>
    Generated automatically for production readiness verification.
  </div>
</body>
</html>`;

fs.writeFileSync(htmlPath, fullHtml, 'utf8');
console.log('[PDF] Generated HTML preview at:', htmlPath);

// Find browser binary
const possiblePaths = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
];

const browserExe = possiblePaths.find(p => fs.existsSync(p));

if (!browserExe) {
  console.error('[PDF] Could not find Edge or Chrome executable to render PDF.');
  process.exit(1);
}

console.log('[PDF] Using browser engine:', browserExe);

try {
  // Render primary PDF
  const cmd = `"${browserExe}" --headless --no-sandbox --disable-gpu --print-to-pdf="${pdfPathPrimary}" "${htmlPath}"`;
  execSync(cmd, { stdio: 'inherit' });
  console.log('[PDF] Successfully generated:', pdfPathPrimary);

  // Copy to secondary name "Project documentation.pdf"
  fs.copyFileSync(pdfPathPrimary, pdfPathSecondary);
  console.log('[PDF] Copied to:', pdfPathSecondary);
} catch (err) {
  console.error('[PDF] Error rendering PDF:', err);
  process.exit(1);
}
