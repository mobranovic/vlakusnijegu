import { renderToString } from 'react-dom/server';
import Root from './Root.jsx';
import { DICTIONARIES } from './i18n/index.jsx';
import { pathFor } from './route.jsx';
import { TRIPS } from './data/trips.js';
import { BRAND, EMAILS, OWNER, PHONES, SITE_URL, SOCIAL, TERRA_POMALO_URL } from './data/company.js';
import { formatDuration } from './lib/format.js';
export { SITE_URL } from './data/company.js';

const abs = (path) => `${SITE_URL}${path}`;
const ORG_ID = abs('/#organizacija');
const clean = (x) => x.replace(/\s*\[[^\]]*\]/g, '').trim();

/** Agencija (schema.org TravelAgency) — na svakoj stranici. */
function organization(t) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    '@id': ORG_ID,
    name: BRAND,
    legalName: OWNER.name,
    description: t.meta.homeDescription,
    url: abs(pathFor({ lang: t.meta.lang })),
    logo: abs('/favicon.svg'),
    image: abs('/images/og-plitvice.jpg'),
    email: EMAILS[0],
    telephone: PHONES.map((p) => p.tel),
    taxID: OWNER.oib,
    identifier: OWNER.idCode,
    address: { '@type': 'PostalAddress', streetAddress: OWNER.street, postalCode: '22000', addressLocality: 'Šibenik', addressCountry: 'HR' },
    parentOrganization: { '@type': 'Organization', name: OWNER.name, url: TERRA_POMALO_URL },
    areaServed: ['HR', 'AT', 'HU', 'SI', 'BA', 'DE'],
    knowsLanguage: ['hr', 'en'],
    audience: { '@type': 'EducationalAudience', educationalRole: 'student' },
    sameAs: SOCIAL.filter((s) => s.url).map((s) => s.url),
  };
}

function home(t, path) {
  return [
    { '@context': 'https://schema.org', '@type': 'WebSite', name: BRAND, url: abs(path), inLanguage: t.meta.lang, publisher: { '@id': ORG_ID } },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: t.catalogue.title,
      itemListElement: TRIPS.map((trip, i) => ({ '@type': 'ListItem', position: i + 1, name: t.trips[trip.id].title, url: abs(pathFor({ lang: t.meta.lang, page: 'trip', slug: t.trips[trip.id].slug })) })),
    },
  ];
}

/** Program (TouristTrip) s planom po danima i put do stranice (BreadcrumbList). Cijene se dodaju kad budu potvrđene. */
function trip(t, x, path) {
  const text = t.trips[x.id];
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'TouristTrip',
      name: text.title,
      description: text.seo.description,
      url: abs(path),
      ...(x.og && { image: abs(`/images/${x.og}.jpg`) }),
      inLanguage: t.meta.lang,
      touristType: t.options.age.filter((a) => x.ages.includes(a.value)).map((a) => a.label),
      timeRequired: `P${x.days}D`,
      provider: { '@id': ORG_ID },
      itinerary: {
        '@type': 'ItemList',
        name: formatDuration(x, t.duration),
        itemListElement: text.itinerary.map((d, i) => ({ '@type': 'ListItem', position: i + 1, name: `${d.label}: ${d.items.map(([, s]) => s).join('; ')}` })),
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: BRAND, item: abs(pathFor({ lang: t.meta.lang })) },
        { '@type': 'ListItem', position: 2, name: t.trip.breadcrumb, item: abs(pathFor({ lang: t.meta.lang }) + '#' + t.ids.trips) },
        { '@type': 'ListItem', position: 3, name: text.title, item: abs(path) },
      ],
    },
  ];
}

function faq(t) {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: t.pages.parents.sections.map((s) => ({ '@type': 'Question', name: s.title, acceptedAnswer: { '@type': 'Answer', text: s.text.map(clean).filter(Boolean).join(' ') } })),
    },
  ];
}

/** Sve stranice koje se unaprijed iscrtavaju, s naslovom, opisom, slikom za dijeljenje i strukturiranim podacima. */
export function pages() {
  const list = [];
  for (const lang of Object.keys(DICTIONARIES)) {
    const t = DICTIONARIES[lang];
    const suffix = ` – ${BRAND}`;
    list.push({ route: { lang, page: 'home' }, title: t.meta.homeTitle, description: t.meta.homeDescription, ld: (path) => home(t, path) });
    for (const p of ['parents', 'partners', 'about', 'terms', 'privacy'])
      list.push({ route: { lang, page: p }, title: t.pages[p].title + suffix, description: t.pages[p].description, ...(p === 'parents' && { ld: () => faq(t) }) });
    list.push({ route: { lang, page: 'legal' }, title: t.legal.title + suffix, description: t.legal.description });
    list.push({ route: { lang, page: 'notfound' }, title: t.notFound.title + suffix, description: t.notFound.description, noindex: true });
    for (const x of TRIPS) {
      const text = t.trips[x.id];
      list.push({
        route: { lang, page: 'trip', slug: text.slug },
        key: `trip/${x.id}`,
        title: text.seo.title,
        description: text.seo.description,
        ...(x.og && { image: `images/${x.og}.jpg` }),
        ld: (path) => trip(t, x, path),
      });
    }
  }
  return list.map((p) => {
    const path = pathFor(p.route);
    const org = organization(DICTIONARIES[p.route.lang]);
    return { image: 'images/og-plitvice.jpg', key: p.route.page, ...p, path, ld: p.noindex ? [] : [org, ...(p.ld ? p.ld(path) : [])] };
  });
}

export function render(route) {
  return renderToString(<Root route={route} />);
}
