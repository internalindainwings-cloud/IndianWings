import type { ItineraryDay } from '@/data/package-defaults';
import { siteConfig } from '@/config/site-config';

export interface GeneratePdfOptions {
  packageTitle: string;
  duration: string;
  startingPrice: number;
  destinations?: string[];
  highlights?: string[];
  inclusions?: string[];
  itinerary: ItineraryDay[];
  travelerName?: string;
}

/**
 * Client-side PDF Generator for Tour Packages
 * Creates an elegant, branded A4 travel itinerary document.
 * jsPDF is dynamically imported on first use to keep it out of the initial bundle.
 */
export async function generateItineraryPdf({
  packageTitle,
  duration,
  startingPrice,
  destinations = [],
  highlights = [],
  inclusions = [],
  itinerary,
  travelerName,
}: GeneratePdfOptions): Promise<void> {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;

  let y = margin;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 20) {
      addFooter();
      doc.addPage();
      y = margin;
      addPageHeaderMini();
    }
  };

  const addFooter = () => {
    const pageCount = doc.getNumberOfPages();
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(140, 150, 160);

    // Separator line
    doc.setDrawColor(220, 225, 230);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

    doc.text(
      `The Indian Wings Company • Srinagar Helpline: ${siteConfig.contact.displayPhone} • info@theindianwingscompany.com`,
      margin,
      pageHeight - 7
    );
    doc.text(`Page ${pageCount}`, pageWidth - margin - 12, pageHeight - 7);
  };

  const addPageHeaderMini = () => {
    // Mini header on subsequent pages
    doc.setFillColor(11, 31, 42); // #0B1F2A
    doc.rect(margin, y, contentWidth, 8, 'F');
    doc.setFillColor(217, 143, 91); // #d98f5b
    doc.rect(margin, y + 7.5, contentWidth, 0.5, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(255, 255, 255);
    doc.text('THE INDIAN WINGS COMPANY', margin + 3, y + 5.5);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(217, 143, 91);
    doc.text(packageTitle, pageWidth - margin - 3, y + 5.5, { align: 'right' });

    y += 14;
  };

  // ── 1. MAIN COVER HEADER BANNER ─────────────────────────────
  doc.setFillColor(11, 31, 42); // #0B1F2A Midnight
  doc.rect(0, 0, pageWidth, 38, 'F');

  // Gold Accent line
  doc.setFillColor(217, 143, 91); // #d98f5b
  doc.rect(0, 37, pageWidth, 1.5, 'F');

  // Brand Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text('THE INDIAN WINGS COMPANY', margin, 14);

  // Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(217, 143, 91);
  doc.text('HANDCRAFTED KASHMIR HOLIDAYS • LOCAL SRINAGAR SPECIALISTS', margin, 20);

  // Contact in header
  doc.setFontSize(8);
  doc.setTextColor(200, 210, 220);
  doc.text(`Helpline: ${siteConfig.contact.displayPhone}`, pageWidth - margin, 14, { align: 'right' });
  doc.text('tourpackageskashmir.com', pageWidth - margin, 20, { align: 'right' });

  y = 46;

  // ── 2. PACKAGE TITLE & OVERVIEW CARD ───────────────────────
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, y, contentWidth, 32, 3, 3, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, y, contentWidth, 32, 3, 3, 'S');

  // Traveler Personalized Note (if provided)
  if (travelerName) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(217, 143, 91);
    doc.text(`CUSTOMIZED ITINERARY PREPARED FOR: ${travelerName.toUpperCase()}`, margin + 4, y + 6);
  }

  // Package Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(11, 31, 42);
  doc.text(packageTitle, margin + 4, travelerName ? y + 13 : y + 9);

  // Badges Line: Duration & Price
  const badgeY = travelerName ? y + 22 : y + 19;
  
  // Duration pill
  doc.setFillColor(238, 242, 255);
  doc.roundedRect(margin + 4, badgeY - 4, 30, 6.5, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(67, 56, 202);
  doc.text(`⏱ ${duration}`, margin + 7, badgeY);

  // Price pill
  const priceText = `₹${startingPrice.toLocaleString('en-IN')} / person`;
  doc.setFillColor(254, 243, 199);
  doc.roundedRect(margin + 38, badgeY - 4, 38, 6.5, 1.5, 1.5, 'F');
  doc.setTextColor(146, 64, 14);
  doc.text(`Starting ${priceText}`, margin + 41, badgeY);

  // Route text
  if (destinations.length > 0) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    const routeText = `Route: ${destinations.join(' ➔ ')}`;
    doc.text(routeText, margin + 4, badgeY + 6.5);
  }

  y += 38;

  // ── 3. KEY INCLUSIONS & COMFORTS ───────────────────────────
  if (inclusions.length > 0 || highlights.length > 0) {
    checkPageBreak(26);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(11, 31, 42);
    doc.text('Key Package Inclusions & Amenities:', margin, y);
    y += 5;

    const keyItems = [
      ...inclusions.slice(0, 4),
      'Dedicated Private Cab for entire tour',
      'Daily Breakfast & Dinner included',
      '24/7 On-Ground Srinagar Assistance',
    ].slice(0, 6);

    const colWidth = contentWidth / 2;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);

    keyItems.forEach((item, index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      const itemX = margin + col * colWidth;
      const itemY = y + row * 4.5;
      doc.text(`• ${item}`, itemX, itemY);
    });

    y += Math.ceil(keyItems.length / 2) * 4.5 + 4;
  }

  // ── 4. DAY-BY-DAY TIMELINE ─────────────────────────────────
  checkPageBreak(15);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(11, 31, 42);
  doc.text('Day-by-Day Detailed Itinerary', margin, y);
  
  doc.setDrawColor(217, 143, 91);
  doc.setLineWidth(0.8);
  doc.line(margin, y + 2, margin + 25, y + 2);
  y += 7;

  itinerary.forEach((day) => {
    // Estimate needed height for this day card
    const descLines = doc.splitTextToSize(day.description, contentWidth - 24);
    const cardHeight = 16 + descLines.length * 3.8 + (day.activities && day.activities.length > 0 ? 5 : 0) + (day.meals || day.stay ? 5 : 0);

    checkPageBreak(cardHeight + 4);

    // Day Container Box
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(margin, y, contentWidth, cardHeight, 2, 2, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, y, contentWidth, cardHeight, 2, 2, 'S');

    // Day Circle / Badge
    doc.setFillColor(217, 143, 91);
    doc.roundedRect(margin + 3, y + 3, 13, 6, 1.5, 1.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(255, 255, 255);
    doc.text(`Day ${day.day}`, margin + 9.5, y + 7.2, { align: 'center' });

    // Day Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(11, 31, 42);
    doc.text(day.title, margin + 19, y + 7.5);

    // Day Description
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    let textY = y + 13;
    doc.text(descLines, margin + 5, textY);
    textY += descLines.length * 3.8;

    // Day Highlights / Activities
    if (day.activities && day.activities.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(217, 143, 91);
      doc.text('Key Sights:', margin + 5, textY);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      doc.text(day.activities.join(' • '), margin + 20, textY);
      textY += 4.5;
    }

    // Day Meals & Stay Bar
    if (day.meals || day.stay) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      const stayParts: string[] = [];
      if (day.meals) stayParts.push(`Meals: ${day.meals}`);
      if (day.stay) stayParts.push(`Stay: ${day.stay}`);
      doc.text(stayParts.join('  |  '), margin + 5, textY);
    }

    y += cardHeight + 4;
  });

  // ── 5. IMPORTANT TRAVEL TIPS / KASHMIR LOCAL PROTOCOLS ─────
  checkPageBreak(30);
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin, y, contentWidth, 24, 2, 2, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, y, contentWidth, 24, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(11, 31, 42);
  doc.text('Essential Kashmir Travel Information:', margin + 4, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  doc.text('1. SIM Cards: Only Postpaid SIM cards (Jio / Airtel / BSNL) operate in Kashmir.', margin + 4, y + 10);
  doc.text('2. Woolens: Keep light woolens in summer & heavy jackets / thermals during autumn & winter.', margin + 4, y + 14);
  doc.text('3. Local Drivers: All our chauffeurs are local residents of Srinagar with valley terrain experience.', margin + 4, y + 18);

  y += 28;

  // Final footer on last page
  addFooter();

  // Save the PDF
  const safeFilename = `${packageTitle.replace(/[^a-zA-Z0-9]/g, '_')}_Itinerary_The_Indian_Wings.pdf`;
  doc.save(safeFilename);
}
