'use client';

import { useEffect, useState } from 'react';
import Mark from './Mark';
import { site } from '@/data/site';

const links = [
  { href: '#services', label: 'Services' },
  { href: '#process', label: 'How we work' },
  { href: '#work', label: 'Our work' },
  { href: '#contact', label: 'Contact' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header className={`nav ${scrolled ? 'nav--solid' : ''} ${open ? 'nav--open' : ''}`}>
      <a className="nav__brand" href="#top" aria-label="HavaRoof LLC, back to top" onClick={() => setOpen(false)}>
        <Mark className="nav__mark" />
        <span className="nav__word">HavaRoof</span>
      </a>
      <nav className="nav__links" aria-label="Primary">
        {links.map((l) => (
          <a key={l.href} href={l.href}>
            {l.label}
          </a>
        ))}
      </nav>
      <a className="btn btn--gold btn--sm nav__call" href={site.phoneHref}>
        {site.phone}
      </a>
      <button
        type="button"
        className="nav__toggle"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
        <i />
        <i />
      </button>
      <div id="mobile-menu" className="nav__menu" hidden={!open}>
        {links.map((l) => (
          <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
            {l.label}
          </a>
        ))}
        <a className="btn btn--gold" href={site.phoneHref}>
          Call {site.phone}
        </a>
      </div>
    </header>
  );
}
