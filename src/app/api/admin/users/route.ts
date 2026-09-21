import { NextResponse } from 'next/server';
import { prisma } from '@/lib/database/prisma';
import { isAuthenticatedAdmin } from '@/lib/security/admin-auth';

export const dynamic = 'force-dynamic';

export interface UserInquirySummary {
  id: string;
  createdAt: string;
  tripType: string;
  travelDate: string;
  guests: string;
  message?: string | null;
  source: string;
  status: string;
}

export interface AdminUserRecord {
  id: string;
  email: string;
  name: string;
  phone: string;
  firstSeen: string;
  lastActive: string;
  totalInquiries: number;
  totalSessions: number;
  status: string;
  sources: string[];
  city?: string | null;
  device?: string | null;
  browser?: string | null;
  utmSource?: string | null;
  inquiries: UserInquirySummary[];
}

export async function GET() {
  try {
    // 1. Authenticate Admin Session
    const isAuthed = await isAuthenticatedAdmin();
    if (!isAuthed) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }

    // 2. Fetch all Enquiries and UserSessions concurrently
    const [enquiries, sessions] = await Promise.all([
      prisma.enquiry.findMany({
        orderBy: { createdAt: 'desc' },
      }),
      prisma.userSession.findMany({
        where: {
          email: {
            not: null,
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    // 4. Map and Aggregate unique users by Email (or Phone fallback)
    const userMap = new Map<string, AdminUserRecord>();

    // Process enquiries first
    for (const enq of enquiries) {
      const cleanEmail = (enq.email || '').trim().toLowerCase();
      const hasEmail = cleanEmail.includes('@');
      // Unique user key: email if available, otherwise phone
      const userKey = hasEmail ? cleanEmail : `phone:${enq.phone.trim()}`;

      const inquirySummary: UserInquirySummary = {
        id: enq.id,
        createdAt: enq.createdAt.toISOString(),
        tripType: enq.tripType || 'Kashmir Tour',
        travelDate: enq.travelDate || 'Flexible',
        guests: enq.guests || '2-4 Guests',
        message: enq.message || null,
        source: enq.source || 'website_inline',
        status: enq.status || 'NEW',
      };

      if (!userMap.has(userKey)) {
        userMap.set(userKey, {
          id: enq.id,
          email: hasEmail ? cleanEmail : '',
          name: enq.name ? enq.name.trim() : 'Guest Traveler',
          phone: enq.phone ? enq.phone.trim() : '',
          firstSeen: enq.createdAt.toISOString(),
          lastActive: enq.createdAt.toISOString(),
          totalInquiries: 1,
          totalSessions: 0,
          status: enq.status,
          sources: [enq.source || 'website_inline'],
          city: null,
          device: null,
          browser: null,
          utmSource: enq.utmSource || null,
          inquiries: [inquirySummary],
        });
      } else {
        const existing = userMap.get(userKey)!;
        existing.totalInquiries += 1;
        existing.inquiries.push(inquirySummary);

        // Update email if it was previously missing and is now present
        if (!existing.email && hasEmail) {
          existing.email = cleanEmail;
        }

        // Update name/phone if missing
        if ((!existing.name || existing.name === 'Guest Traveler') && enq.name) {
          existing.name = enq.name.trim();
        }
        if (!existing.phone && enq.phone) {
          existing.phone = enq.phone.trim();
        }

        // Add source if not already tracked
        if (enq.source && !existing.sources.includes(enq.source)) {
          existing.sources.push(enq.source);
        }

        // Track firstSeen (earliest) and lastActive (latest)
        if (new Date(enq.createdAt) < new Date(existing.firstSeen)) {
          existing.firstSeen = enq.createdAt.toISOString();
        }
        if (new Date(enq.createdAt) > new Date(existing.lastActive)) {
          existing.lastActive = enq.createdAt.toISOString();
          existing.status = enq.status;
        }
      }
    }

    // Process sessions to enrich with device/location or add session-only users
    for (const sess of sessions) {
      const email = (sess.email || '').trim().toLowerCase();
      if (!email || !email.includes('@')) continue;

      if (!userMap.has(email)) {
        userMap.set(email, {
          id: sess.id,
          email,
          name: sess.name ? sess.name.trim() : 'Website Visitor',
          phone: sess.phone ? sess.phone.trim() : '',
          firstSeen: sess.createdAt.toISOString(),
          lastActive: sess.createdAt.toISOString(),
          totalInquiries: 0,
          totalSessions: 1,
          status: sess.converted ? 'WON' : 'NEW',
          sources: [sess.utmSource || 'direct_session'],
          city: sess.city || null,
          device: sess.device || null,
          browser: sess.browser || null,
          utmSource: sess.utmSource || null,
          inquiries: [],
        });
      } else {
        const existing = userMap.get(email)!;
        existing.totalSessions += 1;

        if ((!existing.name || existing.name === 'Guest Traveler' || existing.name === 'Website Visitor') && sess.name) {
          existing.name = sess.name.trim();
        }
        if (!existing.phone && sess.phone) {
          existing.phone = sess.phone.trim();
        }
        if (!existing.city && sess.city) {
          existing.city = sess.city;
        }
        if (!existing.device && sess.device) {
          existing.device = sess.device;
        }
        if (!existing.browser && sess.browser) {
          existing.browser = sess.browser;
        }
        if (sess.utmSource && !existing.sources.includes(sess.utmSource)) {
          existing.sources.push(sess.utmSource);
        }

        if (new Date(sess.createdAt) < new Date(existing.firstSeen)) {
          existing.firstSeen = sess.createdAt.toISOString();
        }
        if (new Date(sess.createdAt) > new Date(existing.lastActive)) {
          existing.lastActive = sess.createdAt.toISOString();
        }
      }
    }

    const allUsers = Array.from(userMap.values()).sort(
      (a, b) => new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime()
    );

    // 5. Compute Key Stats for Top Cards
    const totalUsers = allUsers.length;
    const usersWithPhone = allUsers.filter((u) => u.phone && u.phone.length > 3).length;
    const convertedUsers = allUsers.filter(
      (u) => u.status === 'WON' || u.status === 'QUOTED' || u.totalInquiries > 1
    ).length;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const newThisWeek = allUsers.filter(
      (u) => new Date(u.firstSeen) >= sevenDaysAgo
    ).length;

    return NextResponse.json(
      {
        success: true,
        users: allUsers,
        stats: {
          totalUsers,
          usersWithPhone,
          convertedUsers,
          newThisWeek,
        },
      },
      {
        headers: {
          'Cache-Control': 'no-store, private',
        },
      }
    );
  } catch (err) {
    console.error('[API /api/admin/users] Error fetching users list:', err);
    return NextResponse.json({ error: 'Failed to fetch users database' }, { status: 500 });
  }
}
