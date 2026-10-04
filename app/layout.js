import './globals.css';
import { site } from '@/data/site';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: 'HavaRoof LLC | Roofing in Lake Havasu City, AZ',
  description:
    'Free roof inspections, repairs, full replacements, storm damage restoration and flat deck work in Lake Havasu City, AZ. Licensed, bonded and insured. Call (928) 230-7459.',
  openGraph: {
    title: 'HavaRoof LLC | Roofing in Lake Havasu City, AZ',
    description: 'Licensed, bonded and insured roofers. Free inspections, repairs, replacements and flat deck work.',
    images: [{ url: '/og.jpg', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
};

export const viewport = { themeColor: '#0A1228' };

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'RoofingContractor',
  name: site.name,
  url: siteUrl,
  telephone: '+1-928-230-7459',
  founder: { '@type': 'Person', name: site.owner },
  image: `${siteUrl}/og.jpg`,
  address: {
    '@type': 'PostalAddress',
    streetAddress: site.street,
    addressLocality: site.city,
    addressRegion: site.region,
    postalCode: site.zip,
    addressCountry: 'US',
  },
  areaServed: 'Lake Havasu City, AZ',
  sameAs: [site.instagram, site.facebook],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&family=Hanken+Grotesk:wght@400;500;600;700&display=swap"
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
