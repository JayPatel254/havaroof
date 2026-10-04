import { site } from '@/data/site';

export default function MobileBar() {
  return (
    <div className="mbar">
      <a className="btn btn--gold" href={site.phoneHref}>
        Call now
      </a>
      <a className="btn btn--ghost" href="#contact">
        Free inspection
      </a>
    </div>
  );
}
