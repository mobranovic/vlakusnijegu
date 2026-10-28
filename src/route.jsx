import { createContext, useContext, useEffect, useState } from 'react';

/*
 * Adrese stranica
 *   /  ·  /en/                                   početna
 *   /izleti/<slug>/  ·  /en/trips/<slug>/        program
 *   /za-roditelje/ · /suradnja/ · /o-nama/ · /opci-uvjeti/ · /zastita-podataka/ · /pravne-informacije/
 *   /en/for-parents/ · /en/partners/ · /en/about/ · /en/terms/ · /en/privacy/ · /en/legal/
 *   /404.html · /en/404.html
 * Svaka adresa se pri izgradnji iscrtava u vlastiti index.html (scripts/prerender.mjs).
 * Samostalni pregled (VITE_ROUTER=hash): stranica je u hashu (#/izleti/<slug>), jezik u ?lang=en, mjesto na stranici
 * iza drugog „#“ (#/#izleti).
 */
export const HASH_MODE = import.meta.env.VITE_ROUTER === 'hash';
// Rezervirana mjesta „[…]“ vide se samo u razvoju i pregledu
export const SHOW_PLACEHOLDERS = HASH_MODE || import.meta.env.DEV;

const TRIP_DIR = { hr: 'izleti', en: 'trips' };
export const PAGE_DIR = {
  parents: { hr: 'za-roditelje', en: 'for-parents' },
  partners: { hr: 'suradnja', en: 'partners' },
  about: { hr: 'o-nama', en: 'about' },
  terms: { hr: 'opci-uvjeti', en: 'terms' },
  privacy: { hr: 'zastita-podataka', en: 'privacy' },
  legal: { hr: 'pravne-informacije', en: 'legal' },
};
const pageOf = (dir) => Object.keys(PAGE_DIR).find((k) => Object.values(PAGE_DIR[k]).includes(dir));

export function parseLocation({ pathname = '/', search = '', hash = '' }) {
  if (HASH_MODE) {
    const lang = new URLSearchParams(search).get('lang') === 'en' ? 'en' : 'hr';
    const [path, anchor] = hash.replace(/^#\/?/, '').split('#');
    const m = path.match(/^(?:izleti|trips)\/([^/]+)\/?$/);
    if (m) return { lang, page: 'trip', slug: decodeURIComponent(m[1]) };
    const page = pageOf(path.replace(/\/$/, ''));
    return { lang, page: page || 'home', ...(anchor && { anchor }) };
  }
  const parts = pathname.split('/').filter(Boolean);
  const lang = parts[0] === 'en' ? 'en' : 'hr';
  if (lang === 'en') parts.shift();
  if (parts[0] === TRIP_DIR[lang] && parts[1]) return { lang, page: 'trip', slug: parts[1] };
  if (parts.length === 1 && PAGE_DIR[pageOf(parts[0])]?.[lang] === parts[0]) return { lang, page: pageOf(parts[0]) };
  if (parts.length === 0 || (parts.length === 1 && parts[0] === 'index.html')) return { lang, page: 'home' };
  return { lang, page: 'notfound' };
}

export function pathFor({ lang, page = 'home', slug }) {
  if (page === 'notfound') return lang === 'en' ? '/en/404.html' : '/404.html';
  const sub = page === 'trip' ? `${TRIP_DIR[lang]}/${slug}` : PAGE_DIR[page]?.[lang] || '';
  if (HASH_MODE) return `${lang === 'en' ? '?lang=en' : '?'}#/${sub}`;
  const root = lang === 'en' ? '/en/' : '/';
  return sub ? `${root}${sub}/` : root;
}

export function scrollToId(id, smooth) {
  const el = document.getElementById(id);
  el?.scrollIntoView({ behavior: smooth ? 'smooth' : 'instant', block: 'start' });
}

const RouteContext = createContext(null);

export function RouteProvider({ initial, children }) {
  const [route, setRoute] = useState(initial);

  useEffect(() => {
    if (!HASH_MODE) return;
    const onChange = () => {
      const next = parseLocation(window.location);
      setRoute((r) => (r.page === next.page && r.slug === next.slug && r.lang === next.lang ? { ...r, anchor: next.anchor } : next));
      if (next.anchor) requestAnimationFrame(() => scrollToId(next.anchor, true));
      else window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  const href = (page, opts = {}) => pathFor({ lang: opts.lang ?? route.lang, page, slug: opts.slug });
  /** Mjesto na početnoj stranici (s druge stranice vodi na početnu). */
  const sectionHref = (id) => {
    if (HASH_MODE) return `${href('home')}#${id}`;
    return route.page === 'home' ? `#${id}` : `${href('home')}#${id}`;
  };
  return <RouteContext.Provider value={{ ...route, setRoute, href, sectionHref }}>{children}</RouteContext.Provider>;
}

export const useRoute = () => useContext(RouteContext);
