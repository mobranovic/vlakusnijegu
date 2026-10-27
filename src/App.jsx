import { useCallback, useState } from 'react';
import trips from './data/trips.json';
import { Footer } from './components/Footer.jsx';
import { Hero } from './components/Hero.jsx';
import { InquiryForm } from './components/InquiryForm.jsx';
import { Navbar } from './components/Navbar.jsx';
import { TeachersSection } from './components/TeachersSection.jsx';
import { TripCatalogue } from './components/TripCatalogue.jsx';
import { TripDetail } from './components/TripDetail.jsx';
import { TrustSection } from './components/TrustSection.jsx';
import { Dialog } from './components/ui/Dialog.jsx';

const NO_FILTERS = { type: '', destination: '', age: '' };

const scrollTo = (hash) => document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

export default function App() {
  const [filters, setFilters] = useState(NO_FILTERS);
  const [trip, setTrip] = useState(null);
  const [offerOpen, setOfferOpen] = useState(false);

  const navigate = (item) => {
    if (item.filter) setFilters({ ...NO_FILTERS, ...item.filter });
    history.replaceState(null, '', item.href);
    scrollTo(item.href);
  };

  const search = (q) => {
    setFilters(q);
    scrollTo('#izleti');
  };

  const closeTrip = useCallback(() => setTrip(null), []);
  const closeOffer = useCallback(() => setOfferOpen(false), []);

  return (
    <>
      <a href="#sadrzaj" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2">
        Preskoči na sadržaj
      </a>
      <div className="no-print">
        <Navbar onNavigate={navigate} onRequestOffer={() => setOfferOpen(true)} />
        <main id="sadrzaj">
          <Hero onSearch={search} />
          <TripCatalogue trips={trips} filters={filters} setFilters={setFilters} onOpen={setTrip} />
          <TeachersSection />
          <TrustSection />
        </main>
        <Footer onNavigate={navigate} />
      </div>

      <TripDetail trip={trip} onClose={closeTrip} />
      <Dialog
        open={offerOpen}
        onClose={closeOffer}
        title="Zatraži ponudu za školu"
        subtitle="Odgovaramo s prijedlogom programa i okvirnom cijenom."
      >
        <InquiryForm trips={trips} />
      </Dialog>
    </>
  );
}
