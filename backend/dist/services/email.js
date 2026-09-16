"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendItineraryEmail = sendItineraryEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = require("../config/env");
async function sendItineraryEmail({ toEmail, recipientName, packageTitle, duration, startingPrice, destinations = [], itinerary, inclusions = [], }) {
    const host = env_1.env.SMTP_HOST;
    const port = env_1.env.SMTP_PORT ? parseInt(env_1.env.SMTP_PORT, 10) : 587;
    const user = env_1.env.SMTP_USER;
    const pass = env_1.env.SMTP_PASS;
    const fromEmail = env_1.env.SMTP_FROM || `The Indian Wings Company <info@theindianwingscompany.com>`;
    const displayName = recipientName?.trim() || 'Traveler';
    const formattedPrice = `₹${startingPrice.toLocaleString('en-IN')}`;
    const routeString = destinations.length > 0 ? destinations.join(' ➔ ') : 'Srinagar & Beyond';
    const siteUrl = env_1.env.NEXT_PUBLIC_SITE_URL || 'https://theindianwings.com';
    const itineraryHtml = itinerary
        .map((day) => `
      <div style="margin-bottom:20px;padding:16px;background-color:#f8fafc;border-radius:12px;border-left:4px solid #d98f5b;">
        <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#d98f5b;margin-bottom:4px;">Day ${day.day}</div>
        <h3 style="margin:0 0 8px 0;font-size:16px;color:#0B1F2A;">${day.title}</h3>
        <p style="margin:0 0 10px 0;font-size:13px;line-height:1.6;color:#475569;">${day.description}</p>
        ${day.activities && day.activities.length > 0 ? `<div style="font-size:12px;color:#0B1F2A;"><strong>Highlights:</strong> ${day.activities.join(' • ')}</div>` : ''}
        <div style="margin-top:10px;padding-top:8px;border-top:1px dashed #cbd5e1;font-size:11px;color:#64748b;">
          ${day.meals ? `<span style="margin-right:14px;">🍽️ <strong>Meals:</strong> ${day.meals}</span>` : ''}
          ${day.stay ? `<span>🏨 <strong>Stay:</strong> ${day.stay}</span>` : ''}
        </div>
      </div>
    `)
        .join('');
    const inclusionsHtml = inclusions.length > 0
        ? `<div style="margin-top:24px;padding:18px;background-color:#ecfdf5;border-radius:12px;border:1px solid #a7f3d0;">
          <h4 style="margin:0 0 10px 0;font-size:14px;color:#065f46;text-transform:uppercase;">Package Key Inclusions</h4>
          <ul style="margin:0;padding-left:18px;font-size:12px;color:#047857;line-height:1.8;">${inclusions.map((i) => `<li>${i}</li>`).join('')}</ul>
        </div>`
        : '';
    const htmlBody = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>${packageTitle} - Itinerary</title></head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f1f5f9;padding:24px 12px;"><tr><td align="center">
<table width="600" border="0" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.06);">
<tr><td style="background:linear-gradient(135deg,#0B1F2A 0%,#1e3a4b 100%);padding:32px 28px;color:#ffffff;">
  <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#d98f5b;margin-bottom:6px;">THE INDIAN WINGS COMPANY • SRINAGAR</div>
  <h1 style="margin:0 0 10px 0;font-size:24px;font-weight:800;color:#ffffff;">${packageTitle}</h1>
  <div style="font-size:13px;color:#cbd5e1;"><span style="background-color:rgba(217,143,91,0.25);color:#fed7aa;padding:3px 8px;border-radius:6px;font-weight:600;margin-right:8px;">${duration}</span><span>Starting ${formattedPrice} / person</span></div>
</td></tr>
<tr><td style="padding:28px 28px 16px 28px;color:#334155;font-size:14px;line-height:1.6;">
  <p>Dear <strong>${displayName}</strong>,</p>
  <p>Thank you for your interest in exploring Kashmir with <strong>The Indian Wings Company</strong>! Here is your day-by-day itinerary for <strong>${packageTitle}</strong>.</p>
  <div style="padding:12px 16px;background-color:#fffbeb;border-radius:8px;border:1px solid #fde68a;font-size:12px;color:#92400e;margin-bottom:20px;">📍 <strong>Primary Route:</strong> ${routeString}</div>
  <h2 style="font-size:18px;color:#0B1F2A;margin:24px 0 14px 0;border-bottom:2px solid #f1f5f9;padding-bottom:8px;">Day-by-Day Detailed Plan</h2>
  ${itineraryHtml}${inclusionsHtml}
  <div style="margin-top:30px;text-align:center;background:#fafaf9;border-radius:12px;padding:24px 18px;border:1px solid #e7e5e4;">
    <h3 style="margin:0 0 8px 0;font-size:16px;color:#0B1F2A;">Want to customize these dates or upgrade your stay?</h3>
    <p style="margin:0 0 16px 0;font-size:12px;color:#64748b;">Our local Srinagar travel team is ready to personalize this itinerary for your exact dates and group size.</p>
    <a href="https://wa.me/919906000000" target="_blank" style="display:inline-block;background-color:#25D366;color:#ffffff;font-weight:700;font-size:14px;text-decoration:none;padding:12px 26px;border-radius:50px;">💬 Chat With Us on WhatsApp</a>
  </div>
</td></tr>
<tr><td style="padding:20px 28px;background-color:#0B1F2A;text-align:center;color:#94a3b8;font-size:11px;">
  <p style="margin:0 0 4px 0;color:#cbd5e1;font-weight:600;">The Indian Wings Company — Srinagar, Kashmir</p>
  <p style="margin:0;">Handcrafted Kashmir Tour Packages • Verified Stays • Dedicated Private Cabs</p>
</td></tr>
</table></td></tr></table></body></html>`;
    if (!host || !user || !pass) {
        console.info(`[EmailService] SMTP not configured. Simulated itinerary email for "${packageTitle}" to ${toEmail}.`);
        return { success: true, simulated: true, messageId: `simulated-${Date.now()}` };
    }
    try {
        const transporter = nodemailer_1.default.createTransport({ host, port, secure: port === 465, auth: { user, pass } });
        const info = await transporter.sendMail({
            from: fromEmail,
            to: toEmail,
            subject: `Your Kashmir Itinerary: ${packageTitle} (${duration}) - The Indian Wings Company`,
            html: htmlBody,
        });
        console.info(`[EmailService] Itinerary dispatched to ${toEmail} (ID: ${info.messageId})`);
        return { success: true, simulated: false, messageId: info.messageId };
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`[EmailService] Failed to send to ${toEmail}:`, msg);
        return { success: false, error: msg };
    }
}
