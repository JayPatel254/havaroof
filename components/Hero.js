'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { site } from '@/data/site';

const line1 = ['Roofing', 'built'];
const line2 = ['for', 'Havasu', 'heat.'];

export default function Hero() {
  const root = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
        tl.fromTo('.hero__video-wrap', { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5 }, 0)
          .fromTo('.hero__gable', { opacity: 0 }, { opacity: 1, duration: 0.8 }, 0.5)
          .fromTo('.hero__word', { yPercent: 115, opacity: 1 }, { yPercent: 0, duration: 1.2, stagger: 0.07 }, 0.15)
          .fromTo('[data-hero-fade]', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.1 }, 0.7);

        gsap.to('.hero__video', {
          yPercent: 7,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
        });
      });
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set('.hero__word, [data-hero-fade], .hero__gable', { opacity: 1 });
      });
    },
    { scope: root }
  );

  return (
    <section className="hero" id="top" ref={root}>
      <div className="hero__copy">
        <h1 className="hero__title" aria-label="Roofing built for Havasu heat.">
          <span className="hero__line" aria-hidden="true">
            {line1.map((w, i) => (
              <span className="hero__mask" key={i}>
                <span className="hero__word">{w}</span>
              </span>
            ))}
          </span>
          <span className="hero__line" aria-hidden="true">
            {line2.map((w, i) => (
              <span className="hero__mask" key={i}>
                <span className="hero__word">{w}</span>
              </span>
            ))}
          </span>
        </h1>
        <p className="hero__lede" data-hero-fade>
          Free inspections, repairs, full replacements, storm restoration and flat deck work from a licensed, bonded and insured crew in {site.city}.
        </p>
        <div className="hero__actions" data-hero-fade>
          <a className="btn btn--gold" href="#contact">
            Get a free inspection
          </a>
          <a className="btn btn--ghost" href={site.phoneHref}>
            Call {site.phone}
          </a>
        </div>
      </div>

      <div className="hero__media">
        <div className="gable">
          <div className="gable__clip">
            <div className="hero__video-wrap">
              <video
                className="hero__video"
                src="/video/havaroof-drone.mp4"
                poster="/video/poster.jpg"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                aria-label="Drone footage of a HavaRoof reroof in progress"
              />
            </div>
          </div>
          <svg className="gable__line hero__gable" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <polyline points="0,13 50,0 100,13" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>
      </div>
    </section>
  );
}
