import nodemailer from 'nodemailer';
import { siteConfig } from '@/config/site-config';
import type { ItineraryDay } from '@/data/package-defaults';

export interface SendItineraryEmailParams {
  toEmail: string;
  recipientName?: string;
  packageTitle: string;
  duration: string;
  startingPrice: number;
  destinations?: string[];
  itinerary: ItineraryDay[];
  inclusions?: string[];
}

export async function sendItineraryEmail({
  toEmail,
  recipientName,
  packageTitle,
  duration,
  startingPrice,
  destinations = [],
  itinerary,
  inclusions = [],
}: SendItineraryEmailParams): Promise<{ success: boolean; simulated?: boolean; messageId?: string; error?: string }> {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const fromEmail = process.env.SMTP_FROM || `${siteConfig.name} <${siteConfig.contact.email}>`;

  const displayName = recipientName?.trim() || 'Traveler';
  const formattedPrice = `₹${startingPrice.toLocaleString('en-IN')}`;
  const routeString = destinations.length > 0 ? destinations.join(' ➔ ') : 'Srinagar & Beyond';

  const cleanPhone = siteConfig.contact.phone.replace(/[^0-9]/g, '');
  const whatsappBookingUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    `Hi The Indian Wings Company! I just downloaded the itinerary for "${packageTitle}" (${duration}) and would like to customize my trip dates and get a finalized quote.`
  )}`;

  const itineraryHtml = itinerary
    .map(
      (day) => `
      <div style="margin-bottom: 20px; padding: 16px; background-color: #f8fafc; border-radius: 12px; border-left: 4px solid #d98f5b;">
        <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #d98f5b; margin-bottom: 4px;">
          Day ${day.day}
        </div>
        <h3 style="margin: 0 0 8px 0; font-size: 16px; color: #0B1F2A; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
          ${day.title}
        </h3>
        <p style="margin: 0 0 10px 0; font-size: 13px; line-height: 1.6; color: #475569;">
          ${day.description}
        </p>
        ${
          day.activities && day.activities.length > 0
            ? `<div style="margin-top: 8px; font-size: 12px; color: #0B1F2A;">
                <strong>Highlights:</strong> ${day.activities.join(' • ')}
               </div>`
            : ''
        }
        <div style="margin-top: 10px; padding-top: 8px; border-top: 1px dashed #cbd5e1; font-size: 11px; color: #64748b;">
          ${day.meals ? `<span style="margin-right: 14px;">🍽️ <strong>Meals:</strong> ${day.meals}</span>` : ''}
          ${day.stay ? `<span>🏨 <strong>Stay:</strong> ${day.stay}</span>` : ''}
        </div>
      </div>
    `
    )
    .join('');

  const inclusionsHtml =
    inclusions.length > 0
      ? `
      <div style="margin-top: 24px; padding: 18px; background-color: #ecfdf5; border-radius: 12px; border: 1px solid #a7f3d0;">
        <h4 style="margin: 0 0 10px 0; font-size: 14px; color: #065f46; text-transform: uppercase; letter-spacing: 0.5px;">
          Package Key Inclusions
        </h4>
        <ul style="margin: 0; padding-left: 18px; font-size: 12px; color: #047857; line-height: 1.8;">
          ${inclusions.map((item) => `<li>${item}</li>`).join('')}
        </ul>
      </div>
    `
      : '';

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${packageTitle} - Itinerary</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 24px 12px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 620px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
          <tr>
            <td style="background: linear-gradient(135deg, #0B1F2A 0%, #17384B 100%); padding: 32px 28px; text-align: center; border-bottom: 4px solid #d98f5b;">
              <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #d98f5b; font-weight: 700; margin-bottom: 6px;">
                ${siteConfig.name}
              </div>
              <h1 style="margin: 0; font-size: 24px; color: #ffffff; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-weight: 700;">
                ${packageTitle}
              </h1>
              <p style="margin: 8px 0 0 0; font-size: 14px; color: #94a3b8;">
                ${duration} • ${routeString}
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding: 24px 28px; background-color: #f8fafc; border-bottom: 1px solid #e2e8f0;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <div style="font-size: 12px; color: #64748b;">Prepared For</div>
                    <div style="font-size: 16px; font-weight: 700; color: #0B1F2A; margin-top: 2px;">
                      ${displayName}
                    </div>
                  </td>
                  <td align="right">
                    <div style="font-size: 11px; color: #64748b; text-transform: uppercase;">Starting From</div>
                    <div style="font-size: 20px; font-weight: 800; color: #047857; margin-top: 2px;">
                      ${formattedPrice}<span style="font-size: 11px; font-weight: 400; color: #64748b;"> / person</span>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding: 28px;">
              <h2 style="margin: 0 0 16px 0; font-size: 17px; color: #0B1F2A; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; border-left: 4px solid #d98f5b; padding-left: 10px;">
                Complete Day-by-Day Journey
              </h2>
              ${itineraryHtml}
              ${inclusionsHtml}
            </td>
          </tr>

          <tr>
            <td style="padding: 24px 28px; background-color: #f8fafc; text-align: center; border-top: 1px solid #e2e8f0;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; color: #0B1F2A;">
                Ready to Personalize Your Dates?
              </h3>
              <p style="margin: 0 0 16px 0; font-size: 13px; color: #64748b; line-height: 1.5;">
                Connect directly with our local Kashmir trip architect for instant quotes and custom hotel upgrades.
              </p>
              <a href="${whatsappBookingUrl}" target="_blank" style="display: inline-block; padding: 12px 26px; background-color: #25D366; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 700; border-radius: 10px;">
                Chat on WhatsApp Directly
              </a>
              <div style="margin-top: 14px; font-size: 12px; color: #64748b;">
                Or call us anytime: <a href="tel:${siteConfig.contact.phone}" style="color: #0284c7; text-decoration: none; font-weight: 600;">${siteConfig.contact.displayPhone}</a>
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding: 18px 28px; background-color: #0B1F2A; text-align: center; font-size: 11px; color: #94a3b8;">
              <p style="margin: 0 0 4px 0; color: #cbd5e1; font-weight: 600;">
                ${siteConfig.name} • ${siteConfig.contact.address}
              </p>
              <p style="margin: 0; color: #64748b;">
                Handcrafted Kashmir Tour Packages • Verified Stays • Dedicated Private Cabs
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const from = process.env.RESEND_FROM || 'The Indian Wings Company <hello@tourpackageskashmir.com>';
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from,
          to: toEmail,
          subject: `Your Kashmir Itinerary: ${packageTitle} (${duration}) - The Indian Wings Company`,
          html: htmlBody,
        }),
      });

      const resData = (await res.json().catch(() => ({}))) as { id?: string; message?: string };
      if (res.ok) {
        return {
          success: true,
          simulated: false,
          messageId: resData.id,
        };
      }
      console.error('[Resend API Error]', resData);
      return {
        success: false,
        error: resData.message || 'Resend API failed',
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Resend network error',
      };
    }
  }

  if (!host || !user || !pass) {
    return {
      success: true,
      simulated: true,
      messageId: `simulated-${Date.now()}`,
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
    });

    const info = await transporter.sendMail({
      from: fromEmail,
      to: toEmail,
      subject: `Your Kashmir Itinerary: ${packageTitle} (${duration}) - The Indian Wings Company`,
      html: htmlBody,
    });

    return {
      success: true,
      simulated: false,
      messageId: info.messageId,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Failed to dispatch email',
    };
  }
}

export interface AdminEnquiryNotificationParams {
  id?: string;
  name: string;
  phone: string;
  email?: string | null;
  travelDate?: string | null;
  guests?: string | null;
  tripType?: string | null;
  message?: string | null;
  source?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmTerm?: string | null;
  utmContent?: string | null;
  gclid?: string | null;
  fbclid?: string | null;
  referrer?: string | null;
  ipAddress?: string | null;
  createdAt?: Date | string;
}

export async function sendAdminEnquiryNotificationEmail(
  lead: AdminEnquiryNotificationParams
): Promise<{ success: boolean; simulated?: boolean; messageId?: string; error?: string }> {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const fromEmail = process.env.SMTP_FROM || (user ? `${siteConfig.name} Leads <${user}>` : undefined);
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL;

  if (!adminEmail) {
    return {
      success: false,
      error: 'ADMIN_NOTIFICATION_EMAIL environment variable not configured',
    };
  }

  const rawPhone = lead.phone || '';
  const cleanPhone = rawPhone.replace(/[^0-9]/g, '');
  const internationalPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone.replace(/^0+/, '')}`;
  const whatsappUrl = `https://wa.me/${internationalPhone}?text=${encodeURIComponent(
    `Hello ${lead.name}, thank you for contacting The Indian Wings Company regarding your Kashmir trip!`
  )}`;
  const callUrl = `tel:${rawPhone}`;
  const formattedTime = lead.createdAt
    ? new Date(lead.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    : new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Lead - ${lead.name}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 24px 12px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
          <tr>
            <td style="background: linear-gradient(135deg, #0B1F2A 0%, #17384B 100%); padding: 24px 30px; border-bottom: 3px solid #d98f5b;">
              <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #d98f5b; font-weight: 700; margin-bottom: 4px;">
                ${siteConfig.name} • Admin Alert
              </div>
              <h1 style="margin: 0; font-size: 22px; color: #ffffff; font-weight: 700;">
                🚨 New Kashmir Trip Enquiry
              </h1>
              <p style="margin: 6px 0 0 0; font-size: 13px; color: #94a3b8;">
                Received on ${formattedTime} (IST)
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding: 20px 30px; background-color: #f8fafc; border-bottom: 1px solid #e2e8f0;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="padding-bottom: 6px;">
                    <a href="${whatsappUrl}" target="_blank" style="display: inline-block; padding: 10px 18px; margin: 4px 6px; background-color: #25D366; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 700; border-radius: 8px;">
                      💬 WhatsApp Customer
                    </a>
                    <a href="${callUrl}" style="display: inline-block; padding: 10px 18px; margin: 4px 6px; background-color: #0B1F2A; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 700; border-radius: 8px;">
                      📞 Call ${lead.phone}
                    </a>
                    ${
                      lead.email
                        ? `<a href="mailto:${lead.email}" style="display: inline-block; padding: 10px 18px; margin: 4px 6px; background-color: #e2e8f0; color: #0f172a; text-decoration: none; font-size: 13px; font-weight: 600; border-radius: 8px;">
                            ✉️ Email
                          </a>`
                        : ''
                    }
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding: 24px 30px;">
              <h2 style="margin: 0 0 16px 0; font-size: 16px; color: #0f172a; border-left: 4px solid #d98f5b; padding-left: 10px;">
                Customer & Itinerary Details
              </h2>
              <table width="100%" border="0" cellspacing="0" cellpadding="8" style="font-size: 14px; color: #334155;">
                <tr style="background-color: #f8fafc;">
                  <td width="35%" style="font-weight: 600; color: #64748b; border-bottom: 1px solid #e2e8f0;">Customer Name</td>
                  <td style="font-weight: 700; color: #0f172a; border-bottom: 1px solid #e2e8f0;">${lead.name}</td>
                </tr>
                <tr>
                  <td style="font-weight: 600; color: #64748b; border-bottom: 1px solid #e2e8f0;">Phone Number</td>
                  <td style="font-weight: 700; color: #0f172a; border-bottom: 1px solid #e2e8f0;">
                    <a href="${callUrl}" style="color: #0284c7; text-decoration: none;">${lead.phone}</a>
                  </td>
                </tr>
                <tr style="background-color: #f8fafc;">
                  <td style="font-weight: 600; color: #64748b; border-bottom: 1px solid #e2e8f0;">Email Address</td>
                  <td style="border-bottom: 1px solid #e2e8f0;">${lead.email || '<span style="color:#94a3b8;">Not provided</span>'}</td>
                </tr>
                <tr>
                  <td style="font-weight: 600; color: #64748b; border-bottom: 1px solid #e2e8f0;">Travel Dates</td>
                  <td style="border-bottom: 1px solid #e2e8f0;">${lead.travelDate || '<span style="color:#94a3b8;">Flexible / Not specified</span>'}</td>
                </tr>
                <tr style="background-color: #f8fafc;">
                  <td style="font-weight: 600; color: #64748b; border-bottom: 1px solid #e2e8f0;">Number of Guests</td>
                  <td style="border-bottom: 1px solid #e2e8f0;">${lead.guests || '2-4 Guests'}</td>
                </tr>
                <tr>
                  <td style="font-weight: 600; color: #64748b; border-bottom: 1px solid #e2e8f0;">Trip / Package Preference</td>
                  <td style="font-weight: 600; color: #d98f5b; border-bottom: 1px solid #e2e8f0;">${lead.tripType || 'Kashmir Tour'}</td>
                </tr>
                ${
                  lead.message
                    ? `<tr style="background-color: #fef3c7;">
                        <td style="font-weight: 600; color: #92400e; border-bottom: 1px solid #e2e8f0;">Special Notes</td>
                        <td style="color: #78350f; font-weight: 500; border-bottom: 1px solid #e2e8f0;">${lead.message}</td>
                       </tr>`
                    : ''
                }
              </table>

              <div style="margin-top: 24px; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden;">
                <div style="padding: 8px 14px; background-color: #0B1F2A; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #d98f5b;">
                  📊 Lead Attribution & Tracking
                </div>
                <table width="100%" border="0" cellspacing="0" cellpadding="7" style="font-size: 12px; color: #334155; background-color: #f8fafc;">
                  <tr>
                    <td width="40%" style="font-weight: 600; color: #64748b; border-bottom: 1px solid #e2e8f0;">Form Source</td>
                    <td style="border-bottom: 1px solid #e2e8f0; color: #0f172a;">${lead.source || 'website_inline'}</td>
                  </tr>
                  <tr style="background-color: #fff;">
                    <td style="font-weight: 600; color: #64748b; border-bottom: 1px solid #e2e8f0;">UTM Source</td>
                    <td style="border-bottom: 1px solid #e2e8f0; font-weight: 700; color: ${lead.utmSource ? '#0284c7' : '#94a3b8'};">${lead.utmSource || '—'}</td>
                  </tr>
                  <tr>
                    <td style="font-weight: 600; color: #64748b; border-bottom: 1px solid #e2e8f0;">UTM Medium</td>
                    <td style="border-bottom: 1px solid #e2e8f0; color: #0f172a;">${(lead as any).utmMedium || '—'}</td>
                  </tr>
                  <tr style="background-color: #fff;">
                    <td style="font-weight: 600; color: #64748b; border-bottom: 1px solid #e2e8f0;">UTM Campaign</td>
                    <td style="border-bottom: 1px solid #e2e8f0; font-weight: 700; color: ${lead.utmCampaign ? '#047857' : '#94a3b8'};">${lead.utmCampaign || '—'}</td>
                  </tr>
                  ${(lead as any).utmContent ? `<tr>
                    <td style="font-weight: 600; color: #64748b; border-bottom: 1px solid #e2e8f0;">UTM Content</td>
                    <td style="border-bottom: 1px solid #e2e8f0; color: #0f172a;">${(lead as any).utmContent}</td>
                  </tr>` : ''}
                  ${(lead as any).gclid ? `<tr style="background-color: #eff6ff;">
                    <td style="font-weight: 600; color: #1d4ed8; border-bottom: 1px solid #e2e8f0;">Google Click ID</td>
                    <td style="border-bottom: 1px solid #e2e8f0; font-size: 10px; color: #1d4ed8; word-break: break-all;">${(lead as any).gclid}</td>
                  </tr>` : ''}
                  ${(lead as any).fbclid ? `<tr style="background-color: #eff6ff;">
                    <td style="font-weight: 600; color: #1d4ed8; border-bottom: 1px solid #e2e8f0;">Facebook Click ID</td>
                    <td style="border-bottom: 1px solid #e2e8f0; font-size: 10px; color: #1d4ed8; word-break: break-all;">${(lead as any).fbclid}</td>
                  </tr>` : ''}
                  ${lead.referrer ? `<tr>
                    <td style="font-weight: 600; color: #64748b; border-bottom: 1px solid #e2e8f0;">Referrer URL</td>
                    <td style="border-bottom: 1px solid #e2e8f0; font-size: 11px; color: #475569; word-break: break-all;">${lead.referrer}</td>
                  </tr>` : ''}
                  ${lead.ipAddress ? `<tr style="background-color: #fff;">
                    <td style="font-weight: 600; color: #64748b; border-bottom: 1px solid #e2e8f0;">IP Address</td>
                    <td style="border-bottom: 1px solid #e2e8f0; color: #64748b;">${lead.ipAddress}</td>
                  </tr>` : ''}
                  ${lead.id ? `<tr>
                    <td style="font-weight: 600; color: #64748b;">Enquiry DB ID</td>
                    <td style="font-size: 10px; color: #94a3b8; word-break: break-all;">${lead.id}</td>
                  </tr>` : ''}
                </table>
              </div>
            </td>
          </tr>

          <tr>
            <td style="background-color: #f8fafc; padding: 18px 30px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8;">
              This automated notification was generated by ${siteConfig.name} website lead engine.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const from = process.env.RESEND_FROM || 'The Indian Wings Company <hello@tourpackageskashmir.com>';
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from,
          to: adminEmail,
          subject: `🚨 New Kashmir Lead: ${lead.name} (${lead.phone}) - ${lead.tripType || 'Enquiry'}`,
          html: htmlBody,
        }),
      });

      const resData = (await res.json().catch(() => ({}))) as { id?: string; message?: string };
      if (res.ok) {
        return {
          success: true,
          simulated: false,
          messageId: resData.id,
        };
      }
      console.error('[Resend API Error]', resData);
      return {
        success: false,
        error: resData.message || 'Resend API failed',
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Resend network error',
      };
    }
  }

  if (!host || !user || !pass) {
    return {
      success: true,
      simulated: true,
      messageId: `simulated-admin-${Date.now()}`,
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
    });

    const info = await transporter.sendMail({
      from: fromEmail || user,
      to: adminEmail,
      subject: `🚨 New Kashmir Lead: ${lead.name} (${lead.phone}) - ${lead.tripType || 'Enquiry'}`,
      html: htmlBody,
    });

    return {
      success: true,
      simulated: false,
      messageId: info.messageId,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Failed to dispatch admin notification email',
    };
  }
}
