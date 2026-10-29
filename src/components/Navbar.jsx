import { Globe, Menu, Send, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CATEGORIES } from '../data/categories.js';
import { DICTIONARIES, useT } from '../i18n/index.jsx';
import { useOffer } from '../offer.jsx';
import { scrollToId, useRoute } from '../route.jsx';
import { Logo } from './Logo.jsx';
import { Button } from './ui/Button.jsx';

/** Adresa iste stranice na drugom jeziku (program se povezuje po id-u, jer jezici imaju različite oznake u adresi). */
export function useAltHref() {
  const route = useRoute();
  const t = useT();
  const other = route.lang === 'en' ? 'hr' : 'en';
  if (route.page === 'trip') {
    const id = Object.keys(t.trips).find((k) => t.trips[k].slug === route.slug);
    return id ? route.href('trip', { lang: other, slug: DICTIONARIES[other].trips[id].slug }) : route.href('home', { lang: other });
  }
  if (route.page === 'category') {
    const cat = CATEGORIES.find((c) => c.slug[route.lang] === route.slug);
    return cat ? route.href('category', { lang: other, slug: cat.slug[other] }) : route.href('home', { lang: other });
  }
  return route.href(route.page === 'notfound' ? 'home' : route.page, { lang: other });
}

/** Poveznica stavke izbornika i postupak na klik (filtar kataloga na početnoj). */
export function useNavLink() {
  const route = useRoute();
  const t = useT();
  return (item) => {
    if (item.page) return { href: route.href(item.page) };
    if (item.contact) return { href: '#kontakt', onClick: (e) => { e.preventDefault(); scrollToId('kontakt', true); } };
    const id = t.ids[item.section] + (item.filter ? `-${item.filter}` : '');
    const href = route.sectionHref(id);
    if (route.page !== 'home') return { href };
    return {
      href,
      onClick: (e) => {
        e.preventDefault();
        if (item.filter) window.dispatchEvent(new CustomEvent('vo:filter', { detail: item.filter }));
        scrollToId(t.ids[item.section], true);
      },
    };
  };
}

export function Navbar() {
  const t = useT();
  const route = useRoute();
  const openOffer = useOffer();
  const navLink = useNavLink();
  const altHref = useAltHref();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const link = (item) => {
    const { href, onClick } = navLink(item);
    return {
      href,
      onClick: (e) => {
        setOpen(false);
        onClick?.(e);
      },
    };
  };

  return (
    <header className={`sticky top-0 z-40 bg-white/95 backdrop-blur transition-shadow no-print ${scrolled ? 'shadow-card' : ''}`}>
      <nav className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8" aria-label={t.ui.nav}>
        <a href={route.href('home')} aria-label={`${t.meta.title} – ${t.ui.home}`} className="shrink-0">
          <Logo />
        </a>

        <ul className="hidden items-center xl:flex">
          {t.nav.map((item) => (
            <li key={item.label}>
              <a {...link(item)} className="whitespace-nowrap rounded-lg px-2.5 py-2 text-sm font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-800">
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1.5">
          <a
            href={altHref}
            hrefLang={route.lang === 'en' ? 'hr' : 'en'}
            aria-label={t.ui.langLabel}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-50"
          >
            <Globe className="h-4 w-4" /> <span>{route.lang === 'en' ? 'HR' : 'EN'}</span>
          </a>
          <Button onClick={openOffer} className="hidden whitespace-nowrap sm:inline-flex">
            <Send className="h-4 w-4" /> <span className="xl:hidden 2xl:inline">{t.ui.requestOffer}</span>
            <span className="hidden xl:inline 2xl:hidden">{t.ui.requestOfferShort}</span>
          </Button>
          <button
            type="button"
            className="rounded-lg p-2 text-brand-800 hover:bg-brand-50 xl:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobilni-izbornik"
            aria-label={open ? t.ui.menuClose : t.ui.menuOpen}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {open && (
        <div id="mobilni-izbornik" className="max-h-[calc(100vh-72px)] overflow-y-auto border-t border-slate-100 bg-white px-4 pb-5 pt-2 xl:hidden">
          <ul className="space-y-1">
            {t.nav.map((item) => (
              <li key={item.label}>
                <a {...link(item)} className="block rounded-lg px-3 py-3 font-medium text-slate-700 hover:bg-brand-50">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <Button
            onClick={() => {
              setOpen(false);
              openOffer();
            }}
            className="mt-3 w-full"
          >
            <Send className="h-4 w-4" /> {t.ui.requestOffer}
          </Button>
        </div>
      )}
    </header>
  );
}
