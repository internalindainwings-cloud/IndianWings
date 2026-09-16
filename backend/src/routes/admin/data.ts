import { Router, Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { requireAdmin } from '../../middleware/auth';

const router = Router();

router.use(requireAdmin);

router.get('/', async (_req: Request, res: Response) => {
  try {
    // 1. Fetch Verified Leads (Last 100)
    const leads = await prisma.enquiry.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    // 2. Fetch User Sessions with their Event Timelines (Last 50)
    const sessions = await prisma.userSession.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        events: {
          orderBy: { timestamp: 'asc' },
          take: 30,
        },
      },
    });

    // 3. Compute High-Level Metrics
    const totalLeads = await prisma.enquiry.count();
    const totalSessions = await prisma.userSession.count();
    const convertedSessions = await prisma.userSession.count({ where: { converted: true } });

    // Leads today
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const leadsToday = await prisma.enquiry.count({
      where: { createdAt: { gte: startOfToday } },
    });

    // Average duration across active sessions
    const avgDurationResult = await prisma.userSession.aggregate({
      _avg: { durationSeconds: true },
      where: { durationSeconds: { gt: 0 } },
    });
    const avgDuration = Math.round(avgDurationResult._avg.durationSeconds || 0);

    // 4. Aggregate Marketing Campaigns
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

    res.json({
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
    });
  } catch (err) {
    console.error('[API /api/admin/data] Error fetching admin data:', err);
    res.status(500).json({ error: 'Failed to fetch admin data' });
  }
});

export default router;
