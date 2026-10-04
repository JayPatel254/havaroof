'use client';

import { useState } from 'react';
import Image from 'next/image';
import { services } from '@/data/site';

export default function Services() {
  const [active, setActive] = useState(0);

  const pick = (title) => {
    window.dispatchEvent(new CustomEvent('havaroof:service', { detail: title }));
  };

  return (
    <section className="svc" id="services">
      <div className="svc__head">
        <h2 className="h2">What we do on your roof</h2>
        <p className="svc__intro">
          From the first inspection to the last ridge cap, one crew handles the whole job. Pick a service to see how we approach it.
        </p>
      </div>

      <div className="svc__grid">
        <div className="svc__panel gable gable--light">
          <div className="gable__clip">
            {services.map((s, i) => (
              <Image
                key={s.title}
                src={s.img}
                alt={s.alt}
                fill
                sizes="(max-width: 900px) 92vw, 40vw"
                className={`svc__img ${i === active ? 'is-active' : ''}`}
                priority={i === 0}
              />
            ))}
          </div>
          <svg className="gable__line" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <polyline points="0,13 50,0 100,13" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>

        <ul className="svc__list">
          {services.map((s, i) => (
            <li key={s.title} className={`svc__item ${i === active ? 'is-active' : ''}`}>
              <button
                type="button"
                className="svc__row"
                aria-expanded={i === active}
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
              >
                <h3>{s.title}</h3>
                <span className="svc__plus" aria-hidden="true" />
              </button>
              <div className="svc__more">
                <div>
                  <p>{s.text}</p>
                  <a className="link" href="#contact" onClick={() => pick(s.title)}>
                    Ask about this service
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
