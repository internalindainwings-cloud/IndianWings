import { NextResponse } from 'next/server';

// This Webhook will receive POST requests from Resend when an inbound email arrives
export async function POST(request: Request) {
  try {
    const payload = await request.json();
    
    // Log the inbound email payload for now
    console.log('📬 Inbound Email Received via Resend Webhook:');
    console.log('From:', payload.from);
    console.log('To:', payload.to);
    console.log('Subject:', payload.subject);
    console.log('Text Body:', payload.text);
    
    // TODO: Depending on your exact requirement, you can save this to the DB,
    // trigger a Botpress AI agent, or forward it to an internal dashboard.
    
    return NextResponse.json({ success: true, message: 'Webhook received' });
  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to process webhook' }, { status: 500 });
  }
}
