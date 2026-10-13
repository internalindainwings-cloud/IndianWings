import { NextResponse } from 'next/server';
import { prisma } from '@/lib/database/prisma';
import { isAuthenticatedAdmin } from '@/lib/security/admin-auth';
import { classifyAttribution } from '@/lib/utilities/attribution';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Authenticate Admin Session
    const isAuthed = await isAuthenticatedAdmin();
    if (!isAuthed) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }

    // 2. Compute High-Level Metrics & Fetch Data Concurrently
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [
      leads,
      sessions,
      totalLeads,
      totalSessions,
      convertedSessions,
      leadsToday,
      avgDurationResult,
      landingVisits,
      whatsAppClicks,
      callClicks,
      distinctVisitors,
    ] = await Promise.all([
      // Fetch Verified Leads (Last 200)
      prisma.enquiry.findMany({
        orderBy: { createdAt: 'desc' },
        take: 200,
      }),
      // Fetch User Sessions with their Event Timelines (Last 50)
      prisma.userSession.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50,
        include: {
          events: {
            orderBy: { timestamp: 'asc' },
            take: 30, // Limit events per session to prevent oversized payloads
          },
        },
      }),
      prisma.enquiry.count(),
      prisma.userSession.count(),
      prisma.userSession.count({ where: { converted: true } }),
      prisma.enquiry.count({ where: { createdAt: { gte: startOfToday } } }),
      prisma.userSession.aggregate({
        _avg: { durationSeconds: true },
        where: { durationSeconds: { gt: 0 } },
      }),
      prisma.sessionEvent.count({
        where: {
          route: { startsWith: '/ads' },
          eventType: 'PAGE_VIEW',
        },
      }),
      prisma.sessionEvent.count({
        where: { eventType: 'WHATSAPP_CLICK' },
      }),
      prisma.sessionEvent.count({
        where: { eventType: 'CALL_CLICK' },
      }),
      prisma.userSession.groupBy({
        by: ['visitorId'],
      }),
    ]);

    const avgDuration = Math.round(avgDurationResult._avg.durationSeconds || 0);

    // 3. Aggregate Marketing Campaigns from Sessions
    const campaignMap: Record<string, { clicks: number; converted: number }> = {};
    for (const s of sessions) {
      const sourceKey = s.utmSource || s.referrer || 'Direct / Organic';
      if (!campaignMap[sourceKey]) {
        campaignMap[sourceKey] = { clicks: 0, converted: 0 };
      }
      campaignMap[sourceKey].clicks += 1;
      if (s.converted) {
        campaignMap[sourceKey].converted += 1;
      }
    }

    const campaigns = Object.entries(campaignMap).map(([source, data]) => ({
      source,
      clicks: data.clicks,
      conversions: data.converted,
      rate: data.clicks > 0 ? Math.round((data.converted / data.clicks) * 100) : 0,
    }));

    // 4. Compute Lead Tracking Breakdown by Source & Campaign
    const sourceBreakdown: Record<string, number> = {
      'Google Ads': 0,
      'Organic Search': 0,
      'Social': 0,
      'Referral': 0,
      'Direct': 0,
      'Unknown': 0,
    };
    const campaignBreakdown: Record<string, number> = {};
    let adsLeadsCount = 0;

    for (const l of leads) {
      const classified = classifyAttribution(l);
      sourceBreakdown[classified.channel] = (sourceBreakdown[classified.channel] || 0) + 1;

      if (classified.campaign !== 'Not available') {
        campaignBreakdown[classified.campaign] = (campaignBreakdown[classified.campaign] || 0) + 1;
      }

      if ((l.source && l.source.startsWith('ads_')) || (l.landingPage && l.landingPage.startsWith('/ads'))) {
        adsLeadsCount += 1;
      }
    }

    const trackingOverview = {
      landingPageVisits: landingVisits,
      leadSubmissions: totalLeads,
      adsLeads: adsLeadsCount,
      whatsAppClicks,
      callClicks,
      uniqueVisitorsCount: distinctVisitors.length,
      leadsBySource: sourceBreakdown,
      leadsByCampaign: Object.entries(campaignBreakdown).map(([name, count]) => ({ name, count })),
    };

    return NextResponse.json(
      {
        success: true,
        stats: {
          totalLeads,
          leadsToday,
          totalSessions,
          convertedSessions,
          conversionRate: totalSessions > 0 ? ((convertedSessions / totalSessions) * 100).toFixed(1) : '0.0',
          avgDurationSeconds: avgDuration,
        },
        trackingOverview,
        leads,
        sessions,
        campaigns,
      },
      {
        headers: {
          'Cache-Control': 'no-store, private',
        },
      }
    );
  } catch (err) {
    console.error('[API /api/admin/data] Error fetching admin data:', err);
    return NextResponse.json({ error: 'Failed to fetch admin data' }, { status: 500 });
  }
}
