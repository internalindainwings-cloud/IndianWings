import { NextResponse } from 'next/server';
import { prisma } from '@/lib/database/prisma';
import { isAuthenticatedAdmin } from '@/lib/security/admin-auth';

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
    ] = await Promise.all([
      // Fetch Verified Leads (Last 100)
      prisma.enquiry.findMany({
        orderBy: { createdAt: 'desc' },
        take: 100,
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
    ]);

    const avgDuration = Math.round(avgDurationResult._avg.durationSeconds || 0);

    // 3. Aggregate Marketing Campaigns
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
