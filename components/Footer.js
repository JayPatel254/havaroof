import Image from 'next/image';
import { site } from '@/data/site';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__grid">
        <Image className="footer__logo" src="/images/logo.webp" alt="HavaRoof LLC logo" width={120} height={120} />
        <div>
          <p className="footer__lead">Transforming roofs into shields against the elements.</p>
          <p className="footer__meta">
            Arizona ROC #{site.license} &middot; Insured &amp; bonded
            <br />
            {site.street}, {site.city}, {site.region} {site.zip}
          </p>
        </div>
        <ul className="footer__links">
          <li>
            <a href={site.phoneHref}>{site.phone}</a>
          </li>
          <li>
            <a href={site.instagram} target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
          </li>
          <li>
            <a href={site.facebook} target="_blank" rel="noopener noreferrer">
              Facebook
            </a>
          </li>
        </ul>
      </div>
      <p className="footer__copy">&copy; {new Date().getFullYear()} {site.name}. All rights reserved.</p>
    </footer>
  );
}
