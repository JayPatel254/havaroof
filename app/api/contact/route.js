import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const hits = new Map();
function limited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 10 * 60 * 1000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

const clean = (v, max) => String(v ?? '').replace(/[\r\n]+/g, ' ').trim().slice(0, max);

export async function POST(req) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (limited(ip)) {
    return NextResponse.json({ error: 'Too many messages. Please call us instead.' }, { status: 429 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  // Honeypot: bots fill this in, people never see it
  if (body.company) return NextResponse.json({ ok: true });

  const name = clean(body.name, 100);
  const phone = clean(body.phone, 40);
  const email = clean(body.email, 120);
  const service = clean(body.service, 80);
  const message = String(body.message ?? '').trim().slice(0, 2000);

  if (name.length < 2) return NextResponse.json({ error: 'Please enter your name.' }, { status: 400 });
  if (phone.replace(/\D/g, '').length < 7) return NextResponse.json({ error: 'Please enter a phone number we can call.' }, { status: 400 });
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: 'That email address does not look right.' }, { status: 400 });

  const subject = `New website enquiry from ${name}${service ? ` (${service})` : ''}`;
  const text = [
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Email: ${email || 'not given'}`,
    `Service: ${service || 'not sure yet'}`,
    '',
    message || '(no message)',
  ].join('\n');

  const { RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL, FORMSPREE_ENDPOINT } = process.env;

  try {
    if (RESEND_API_KEY && CONTACT_TO_EMAIL) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: CONTACT_FROM_EMAIL || 'HavaRoof Website <onboarding@resend.dev>',
          to: CONTACT_TO_EMAIL.split(',').map((s) => s.trim()),
          reply_to: email || undefined,
          subject,
          text,
        }),
      });
      if (!res.ok) throw new Error('resend failed');
      return NextResponse.json({ ok: true });
    }

    if (FORMSPREE_ENDPOINT) {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name, phone, email, service, message }),
      });
      if (!res.ok) throw new Error('formspree failed');
      return NextResponse.json({ ok: true });
    }
  } catch {
    return NextResponse.json({ error: 'We could not send your message. Please call (928) 230-7459.' }, { status: 502 });
  }

  if (process.env.NODE_ENV !== 'production') {
    console.log('[contact form, no email provider configured]\n' + subject + '\n' + text);
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ error: 'The form is not connected to email yet. Please call (928) 230-7459.' }, { status: 503 });
}
