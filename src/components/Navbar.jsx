import { Menu, Send, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Logo } from './Logo.jsx';
import { Button } from './ui/Button.jsx';

export const NAV = [
  { label: 'Početna', href: '#pocetna' },
  { label: 'Jednodnevni izleti', href: '#izleti', filter: { type: 'jednodnevni' } },
  { label: 'Višednevna putovanja', href: '#izleti', filter: { type: 'visednevni' } },
  { label: 'Za nastavnike', href: '#nastavnici' },
  { label: 'O nama', href: '#o-nama' },
  { label: 'Kontakt', href: '#kontakt' },
];

export function Navbar({ onNavigate, onRequestOffer }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (item) => (e) => {
    e.preventDefault();
    setOpen(false);
    onNavigate(item);
  };

  return (
    <header className={`sticky top-0 z-40 bg-white/90 backdrop-blur transition-shadow no-print ${scrolled ? 'shadow-card' : ''}`}>
      <nav className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8" aria-label="Glavna navigacija">
        <a href="#pocetna" onClick={go(NAV[0])} aria-label="Vlak u snijegu – početna">
          <Logo />
        </a>

        <ul className="hidden items-center gap-1 xl:flex">
          {NAV.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                onClick={go(item)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-800"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Button onClick={onRequestOffer} className="hidden sm:inline-flex">
            <Send className="h-4 w-4" /> Zatraži ponudu za školu
          </Button>
          <button
            type="button"
            className="rounded-lg p-2 text-brand-800 hover:bg-brand-50 xl:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobilni-izbornik"
            aria-label={open ? 'Zatvori izbornik' : 'Otvori izbornik'}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {open && (
        <div id="mobilni-izbornik" className="border-t border-slate-100 bg-white px-4 pb-5 pt-2 xl:hidden">
          <ul className="space-y-1">
            {NAV.map((item) => (
              <li key={item.label}>
                <a href={item.href} onClick={go(item)} className="block rounded-lg px-3 py-3 font-medium text-slate-700 hover:bg-brand-50">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <Button
            onClick={() => {
              setOpen(false);
              onRequestOffer();
            }}
            className="mt-3 w-full"
          >
            <Send className="h-4 w-4" /> Zatraži ponudu za školu
          </Button>
        </div>
      )}
    </header>
  );
}
