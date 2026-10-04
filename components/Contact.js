'use client';

import { useEffect, useState } from 'react';
import { site, services, mapEmbed, mapDirections } from '@/data/site';

const initial = { name: '', phone: '', email: '', service: '', message: '', company: '' };

export default function Contact() {
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    const onService = (e) => setForm((f) => ({ ...f, service: e.detail }));
    window.addEventListener('havaroof:service', onService);
    return () => window.removeEventListener('havaroof:service', onService);
  }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again or call us.');
      setStatus('sent');
      setForm(initial);
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  }

  return (
    <section className="contact" id="contact">
      <div className="contact__grid">
        <div className="contact__info">
          <h2 className="h2">Book a free roof inspection</h2>
          <p className="contact__lede">
            Tell us what is going on up there. {site.owner} and the crew will get back to you to set a time.
          </p>

          <dl className="contact__facts">
            <div>
              <dt>Call</dt>
              <dd>
                <a href={site.phoneHref}>{site.phone}</a>
              </dd>
            </div>
            <div>
              <dt>Visit</dt>
              <dd>
                {site.street}
                <br />
                {site.city}, {site.region} {site.zip}
              </dd>
            </div>
            <div>
              <dt>License</dt>
              <dd>Arizona ROC #{site.license}, insured and bonded</dd>
            </div>
          </dl>

          <div className="contact__map">
            <iframe
              title={`Map showing HavaRoof at ${site.street}, ${site.city}`}
              src={mapEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <a className="btn btn--gold btn--sm contact__dir" href={mapDirections} target="_blank" rel="noopener noreferrer">
              Get directions
            </a>
          </div>
        </div>

        <form className="form" onSubmit={onSubmit} noValidate={false}>
          <div className="form__row">
            <label>
              <span>Name</span>
              <input type="text" name="name" autoComplete="name" required value={form.name} onChange={set('name')} />
            </label>
            <label>
              <span>Phone</span>
              <input type="tel" name="phone" autoComplete="tel" required value={form.phone} onChange={set('phone')} />
            </label>
          </div>
          <label>
            <span>Email (optional)</span>
            <input type="email" name="email" autoComplete="email" value={form.email} onChange={set('email')} />
          </label>
          <label>
            <span>What do you need?</span>
            <select name="service" value={form.service} onChange={set('service')}>
              <option value="">Not sure yet</option>
              {services.map((s) => (
                <option key={s.title} value={s.title}>
                  {s.title}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Tell us about your roof</span>
            <textarea name="message" rows={5} maxLength={2000} value={form.message} onChange={set('message')} />
          </label>
          <label className="form__trap" aria-hidden="true">
            <span>Company</span>
            <input type="text" name="company" tabIndex={-1} autoComplete="off" value={form.company} onChange={set('company')} />
          </label>

          <button className="btn btn--gold form__submit" type="submit" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending...' : 'Send message'}
          </button>

          <p className="form__status" role="status" aria-live="polite">
            {status === 'sent' && 'Message sent. We will get back to you soon.'}
            {status === 'error' && error}
          </p>
        </form>
      </div>
    </section>
  );
}
