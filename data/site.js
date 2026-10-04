export const site = {
  name: 'HavaRoof LLC',
  owner: 'Tyler Ingram',
  phone: '(928) 230-7459',
  phoneHref: 'tel:+19282307459',
  street: '3680 Clearwater Dr',
  city: 'Lake Havasu City',
  region: 'AZ',
  zip: '86406',
  license: '335833',
  instagram: 'https://www.instagram.com/havaroof/',
  facebook: 'https://www.facebook.com/p/HavaRoof-LLC-61556961062109/',
  mapQuery: '3680 Clearwater Dr, Lake Havasu City, AZ 86406',
};

export const mapEmbed = `https://www.google.com/maps?q=${encodeURIComponent(site.mapQuery)}&output=embed`;
export const mapDirections = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(site.mapQuery)}`;

export const services = [
  {
    title: 'Free roof inspections',
    text: 'We get up on the roof and check the deck, flashing, vents and surface, then tell you what we found. No charge and no pressure.',
    img: '/images/shingle-repair.webp',
    alt: 'Gray shingle roof with an air conditioner unit and a pool in the yard below',
  },
  {
    title: 'Roof repairs',
    text: 'Leaks, lifted shingles, cracked tile and tired flashing, fixed at the source so the repair lasts.',
    img: '/images/nailing.webp',
    alt: 'Roofer nailing down shingles along the edge of a roof against a blue sky',
  },
  {
    title: 'Full roof replacements',
    text: 'Reroofing and recovering from the deck up: tear-off, fresh underlayment, then shingle or tile installed and cleaned up.',
    img: '/images/tile-b.webp',
    alt: 'Newly installed gray and tan concrete tile roof',
  },
  {
    title: 'Storm damage restoration',
    text: 'Wind and monsoon damage assessed and put right, so your roof is watertight again before the next storm.',
    img: '/images/tearoff.webp',
    alt: 'Roofer in a pink shirt lifting a sheet of old shingles during a tear-off',
  },
  {
    title: 'Flat deck work',
    text: 'Flat and low-slope roofs coated or recovered with a reflective white finish that handles Havasu sun.',
    img: '/images/flat-white.webp',
    alt: 'Freshly coated white flat roof beside an air conditioning unit',
  },
];

export const steps = [
  { title: 'Tear-off', text: 'The old roofing comes off down to the deck, so we can see exactly what is underneath.' },
  { title: 'Underlayment', text: 'Damaged decking is repaired and fresh underlayment goes down in overlapping courses.' },
  { title: 'New roofing', text: 'Shingle or tile is installed course by course, with flashing and vents set properly.' },
  { title: 'Finish and clean-up', text: 'Ridge caps go on, flat decks get their white coating, and the site is cleaned up.' },
];

export const work = [
  { src: '/images/tile-a.webp', w: 1350, h: 1800, title: 'Concrete tile reroof', alt: 'Concrete tile roof under a cloudy sky with mountains behind' },
  { src: '/images/coating-crew.webp', w: 1440, h: 810, title: 'Rolling on a flat deck coating', alt: 'Roofer rolling a coating onto a flat roof deck' },
  { src: '/images/shingle-new.webp', w: 1536, h: 1536, title: 'New shingle roof, ridge to eave', alt: 'New gray shingle roof with a ridge cap and a pool nearby' },
  { src: '/images/underlayment.webp', w: 1536, h: 1536, title: 'Underlayment ready for roofing', alt: 'Tan underlayment rolled across a roof deck beside a pool' },
  { src: '/images/flat-white.webp', w: 1800, h: 1350, title: 'Finished white flat deck', alt: 'Bright white coated flat roof with vents and an air conditioner' },
  { src: '/images/tile-b.webp', w: 1350, h: 1800, title: 'Tile roof, new and tidy', alt: 'Tile roof next to a white coated flat section' },
  { src: '/images/shingle-repair.webp', w: 1440, h: 1800, title: 'Shingle section, fresh against old', alt: 'Roof ridge where new lighter shingles meet older weathered ones' },
];
