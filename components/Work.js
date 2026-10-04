'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { work } from '@/data/site';

export default function Work() {
  const track = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(true);

  useEffect(() => {
    const element = track.current;
    if (!element) return;

    const updateControls = () => {
      const startOffset = parseFloat(getComputedStyle(element).paddingLeft) || 0;
      setCanGoBack(element.scrollLeft > startOffset + 1);
      setCanGoForward(element.scrollLeft < element.scrollWidth - element.clientWidth - 1);
    };

    updateControls();
    element.addEventListener('scroll', updateControls, { passive: true });
    window.addEventListener('resize', updateControls);
    return () => {
      element.removeEventListener('scroll', updateControls);
      window.removeEventListener('resize', updateControls);
    };
  }, []);

  const moveGallery = (direction) => {
    const element = track.current;
    if (!element) return;

    const cards = [...element.querySelectorAll('.work__item')];
    const trackLeft = element.getBoundingClientRect().left;
    const currentPosition = element.scrollLeft;
    const startOffset = parseFloat(getComputedStyle(element).paddingLeft) || 0;
    const positions = cards.map((card) => card.getBoundingClientRect().left - trackLeft + currentPosition);
    const target =
      direction > 0
        ? positions.find((position) => position > currentPosition + 1)
        : positions.filter((position) => position < currentPosition - 1).pop() ??
          (currentPosition > startOffset + 1 ? startOffset : undefined);

    if (target !== undefined) {
      element.scrollTo({ left: target, behavior: 'smooth' });
      setCanGoBack(target > startOffset + 1);
      setCanGoForward(target < element.scrollWidth - element.clientWidth - 1);
    }
  };

  return (
    <section className="work" id="work">
      <div className="work__controls" aria-label="Gallery controls">
        <span>Browse projects</span>
        <button type="button" onClick={() => moveGallery(-1)} disabled={!canGoBack} aria-label="Previous project" aria-controls="work-gallery">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M19 12H5m0 0 7-7m-7 7 7 7" />
          </svg>
        </button>
        <button type="button" onClick={() => moveGallery(1)} disabled={!canGoForward} aria-label="Next project" aria-controls="work-gallery">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12h14m0 0-7-7m7 7-7 7" />
          </svg>
        </button>
      </div>
      <div className="work__track" ref={track} id="work-gallery" tabIndex={0} aria-label="Recent roofing projects">
        <div className="work__intro">
          <h2 className="h2 h2--light">Recent work around Lake Havasu</h2>
          <p>Tile, shingle and flat deck jobs, straight from the crew&rsquo;s own photos. Scroll horizontally to browse.</p>
        </div>
        {work.map((w) => (
          <figure className="work__item" key={w.src} style={{ aspectRatio: `${w.w} / ${w.h}` }}>
            <Image src={w.src} alt={w.alt} fill sizes="(max-width: 900px) 80vw, 45vh" />
            <figcaption>{w.title}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
