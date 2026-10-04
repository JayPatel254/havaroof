import { site } from '@/data/site';

const items = [
  { big: `ROC #${site.license}`, small: 'Arizona Registrar of Contractors license' },
  { big: 'Insured and bonded', small: 'Covered on every job we take' },
  { big: 'Free inspections', small: 'We look first and tell you straight' },
  { big: site.city, small: 'Where we live, work and roof' },
];

export default function Trust() {
  return (
    <section className="trust" aria-label="Credentials">
      <ul className="trust__list">
        {items.map((it) => (
          <li key={it.big}>
            <strong>{it.big}</strong>
            <span>{it.small}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
