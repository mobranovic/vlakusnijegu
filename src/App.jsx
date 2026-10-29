import { useEffect, useState } from 'react';
import { CategoryPage } from './components/CategoryPage.jsx';
import { Footer } from './components/Footer.jsx';
import { Hero } from './components/Hero.jsx';
import { ParentsTeaser, PartnersTeaser } from './components/HomeTeasers.jsx';
import { InfoPage, NotFound } from './components/InfoPage.jsx';
import { Navbar } from './components/Navbar.jsx';
import { TeachersSection } from './components/TeachersSection.jsx';
import { NO_FILTERS, TripCatalogue } from './components/TripCatalogue.jsx';
import { TripPage } from './components/TripPage.jsx';
import { TrustSection } from './components/TrustSection.jsx';
import { CATEGORIES } from './data/categories.js';
import { TRIPS } from './data/trips.js';
import { useT } from './i18n/index.jsx';
import { useOffer } from './offer.jsx';
import { scrollToId, useRoute } from './route.jsx';

function Home() {
  const t = useT();
  const openOffer = useOffer();
  const [filters, setFilters] = useState(NO_FILTERS);

  // Filtar iz izbornika: na početnoj događaj vo:filter, s druge stranice adresa #izleti-jednodnevni
  useEffect(() => {
    const apply = (type) => {
      setFilters({ ...NO_FILTERS, type });
      requestAnimationFrame(() => scrollToId(t.ids.trips));
    };
    const fromHash = () => {
      const m = window.location.hash.match(new RegExp(`#${t.ids.trips}-(jednodnevni|visednevni)$`));
      if (m) apply(m[1]);
      else {
        const id = window.location.hash.split('#').pop();
        if (id && document.getElementById(id)) requestAnimationFrame(() => scrollToId(id));
      }
    };
    const onFilter = (e) => setFilters({ ...NO_FILTERS, type: e.detail });
    fromHash();
    window.addEventListener('hashchange', fromHash);
    window.addEventListener('vo:filter', onFilter);
    return () => {
      window.removeEventListener('hashchange', fromHash);
      window.removeEventListener('vo:filter', onFilter);
    };
  }, [t.ids.trips]);

  return (
    <>
      <Hero
        onSearch={(q) => {
          setFilters(q);
          scrollToId(t.ids.trips, true);
        }}
      />
      <TripCatalogue filters={filters} setFilters={setFilters} onCustom={openOffer} />
      <TeachersSection />
      <ParentsTeaser />
      <TrustSection />
      <PartnersTeaser />
    </>
  );
}

function Page() {
  const t = useT();
  const route = useRoute();
  if (route.page === 'home') return <Home />;
  if (route.page === 'trip') {
    const id = Object.keys(t.trips).find((k) => t.trips[k].slug === route.slug);
    const trip = id && TRIPS.find((x) => x.id === id);
    return trip ? <TripPage key={trip.id} trip={trip} /> : <NotFound />;
  }
  if (route.page === 'category') {
    const cat = CATEGORIES.find((c) => c.slug[route.lang] === route.slug);
    return cat ? <CategoryPage key={cat.id} category={cat} /> : <NotFound />;
  }
  if (route.page === 'legal') return <InfoPage page={t.legal} />;
  if (t.pages[route.page]) return <InfoPage key={route.page} page={t.pages[route.page]} />;
  return <NotFound />;
}

export default function App() {
  const t = useT();
  const route = useRoute();

  // U pregledu (hash) naslov i jezik dokumenta prate stranicu; na poslužitelju ih postavlja prerender
  useEffect(() => {
    document.documentElement.lang = route.lang;
  }, [route.lang]);

  return (
    <>
      <a href="#sadrzaj" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2">
        {t.ui.skip}
      </a>
      <Navbar />
      <main id="sadrzaj">
        <Page />
      </main>
      <Footer />
    </>
  );
}
