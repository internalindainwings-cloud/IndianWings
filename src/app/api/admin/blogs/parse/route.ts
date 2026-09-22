import { NextResponse } from 'next/server';

function extractTitle(text: string) {
  const match = text.match(/^#\s+(.+)$/m) || text.match(/^([A-Z].+)$/m);
  return match ? match[1].trim() : 'Draft Blog ' + new Date().toLocaleDateString();
}

function extractMetaDescription(text: string) {
  // Remove markdown headers
  let cleanText = text.replace(/^#+.*$/gm, '');
  // Remove markdown image syntax
  cleanText = cleanText.replace(/!\[.*?\]\(.*?\)/g, '');
  // Clean whitespace
  cleanText = cleanText.replace(/\s+/g, ' ').trim();
  
  if (cleanText.length > 155) {
    return cleanText.substring(0, 155).trim() + '...';
  }
  return cleanText;
}

function suggestInternalLinks(text: string) {
  const links = [];
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('gulmarg')) {
    links.push({ anchor: 'Gulmarg', url: '/destinations/gulmarg', reason: 'Article mentions Gulmarg' });
  }
  if (lowerText.includes('pahalgam')) {
    links.push({ anchor: 'Pahalgam', url: '/destinations/pahalgam', reason: 'Article mentions Pahalgam' });
  }
  if (lowerText.includes('srinagar')) {
    links.push({ anchor: 'Srinagar', url: '/destinations/srinagar', reason: 'Article mentions Srinagar' });
  }
  if (lowerText.includes('honeymoon')) {
    links.push({ anchor: 'Honeymoon Packages', url: '/packages/honeymoon', reason: 'Article discusses honeymoon' });
  }
  
  return links;
}

export async function POST(request: Request) {
  try {
    const { content } = await request.json();
    if (!content) {
      return NextResponse.json({ error: 'No content provided' }, { status: 400 });
    }

    const title = extractTitle(content);
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const metaDescription = extractMetaDescription(content);
    const internalLinks = suggestInternalLinks(content);
    
    // Algorithmic CTA Suggestion
    let cta = 'Plan Your Trip / Get Free Quote';
    if (content.toLowerCase().includes('guide') || content.toLowerCase().includes('how to')) {
      cta = 'Explore Kashmir Packages';
    }

    return NextResponse.json({
      title,
      slug,
      metaDescription,
      internalLinks,
      ctaSuggestion: cta,
      metaTitle: `${title} | The Indian Wings`
    });
  } catch (error) {
    console.error('Parse API Error:', error);
    return NextResponse.json({ error: 'Failed to parse content' }, { status: 500 });
  }
}
