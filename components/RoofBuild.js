'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { steps } from '@/data/site';

export default function RoofBuild() {
  const root = useRef(null);
  const canvasRef = useRef(null);
  const [failed, setFailed] = useState(false);

  useGSAP(
    () => {
      let scene = null;
      let dead = false;
      const mm = gsap.matchMedia();
      const items = gsap.utils.toArray('.build__step');
      const bar = root.current.querySelector('.build__bar i');

      const setActive = (n) => {
        items.forEach((el, i) => el.classList.toggle('is-active', i === n));
      };

      const onPointer = (e) => {
        if (!scene) return;
        const r = root.current.getBoundingClientRect();
        scene.setPointer(((e.clientX - r.left) / r.width - 0.5) * 2, ((e.clientY - r.top) / r.height - 0.5) * 2);
      };

      import('@/lib/roofScene').then(({ createRoofScene }) => {
        if (dead) return;
        scene = createRoofScene(canvasRef.current);
        if (!scene) {
          setFailed(true);
          return;
        }
        root.current.addEventListener('pointermove', onPointer);

        mm.add('(prefers-reduced-motion: no-preference)', () => {
          setActive(0);
          ScrollTrigger.create({
            trigger: root.current,
            start: 'top top',
            end: '+=320%',
            pin: true,
            scrub: true,
            onUpdate: (self) => {
              const P = self.progress * 4;
              scene.setProgress(P);
              setActive(Math.min(3, Math.floor(P + 0.12)));
              if (bar) bar.style.transform = `scaleX(${self.progress})`;
            },
          });
          ScrollTrigger.refresh();
        });

        mm.add('(prefers-reduced-motion: reduce)', () => {
          scene.setProgress(4, true);
          items.forEach((el) => el.classList.add('is-active'));
          root.current.classList.add('is-static');
        });
      });

      return () => {
        dead = true;
        root.current && root.current.removeEventListener('pointermove', onPointer);
        mm.revert();
        scene && scene.dispose();
      };
    },
    { scope: root }
  );

  return (
    <section className="build" id="process" ref={root}>
      <div className="build__inner">
        <div className="build__copy">
          <h2 className="h2 h2--light">From worn deck to finished roof</h2>
          <p className="build__intro">Scroll to watch a roof go on, in the same order we do it on site.</p>
          <ol className="build__steps">
            {steps.map((s, i) => (
              <li className="build__step" key={s.title}>
                <span className="build__n" aria-hidden="true">
                  {i + 1}
                </span>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="build__bar" aria-hidden="true">
            <i />
          </div>
        </div>

        <div className="build__stage">
          {failed ? (
            <Image src="/images/shingle-new.webp" alt="New gray shingle roof" fill sizes="50vw" className="build__fallback" />
          ) : (
            <canvas ref={canvasRef} className="build__canvas" aria-label="3D model of a roof being rebuilt in four stages" role="img" />
          )}
        </div>
      </div>
    </section>
  );
}
