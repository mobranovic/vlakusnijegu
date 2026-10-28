import { Clock, Facebook, Instagram, Mail, MapPin, Phone, Youtube } from 'lucide-react';
import { CONTACT, LICENSE, OWNER, SOCIAL } from '../data/company.js';
import { Logo } from './Logo.jsx';
import { NAV } from './Navbar.jsx';

const SOCIAL_ICONS = { facebook: Facebook, instagram: Instagram, youtube: Youtube };
const tel = (p) => `tel:${p.replace(/[^+\d]/g, '')}`;

export function Footer({ onNavigate }) {
  const socials = Object.entries(SOCIAL).filter(([, url]) => url);

  return (
    <footer id="kontakt" className="scroll-mt-20 bg-brand-900 text-brand-100 no-print">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <Logo dark />
          <p className="mt-4 text-sm">
            Školski izleti, ekskurzije i škole u prirodi po Hrvatskoj i Europi.
          </p>
          <p className="mt-4 text-sm">
            <span className="block font-semibold text-white">{OWNER.fullName}</span>
            {OWNER.address.join(', ')}
            <span className="block">OIB {OWNER.oib} · MBS {OWNER.mbs}, {OWNER.court}</span>
            <span className="block">ID kod agencije: {LICENSE.idCode}</span>
            <span className="block">Uprava: {OWNER.board}</span>
            <span className="block">Temeljni kapital {OWNER.capital}</span>
            <span className="block">IBAN {OWNER.iban}, {OWNER.bank} (SWIFT {OWNER.swift})</span>
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-white">Kontakt</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex gap-2.5"><MapPin className="h-4 w-4 shrink-0 text-amber-400" /> {OWNER.address.join(', ')}</li>
            {CONTACT.phones.map((p) => (
              <li key={p} className="flex gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-amber-400" />
                <a href={tel(p)} className="hover:text-white">{p}</a>
              </li>
            ))}
            <li className="flex gap-2.5">
              <Mail className="h-4 w-4 shrink-0 text-amber-400" />
              <a href={`mailto:${CONTACT.email}`} className="break-all hover:text-white">{CONTACT.email}</a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-white">Radno vrijeme</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {CONTACT.hours.map(([d, h]) => (
              <li key={d} className="flex gap-2.5">
                <Clock className="h-4 w-4 shrink-0 text-amber-400" />
                <span><span className="text-white">{d}:</span> {h}</span>
              </li>
            ))}
          </ul>
          <h3 className="mt-6 font-semibold text-white">Pratite nas</h3>
          {socials.length ? (
            <div className="mt-3 flex gap-2">
              {socials.map(([key, url]) => {
                const Icon = SOCIAL_ICONS[key];
                return (
                  <a key={key} href={url} target="_blank" rel="noreferrer" aria-label={key} className="rounded-full bg-white/10 p-2.5 hover:bg-white/20">
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          ) : (
            <p className="mt-3 text-sm text-brand-300">[Adrese profila na društvenim mrežama]</p>
          )}
        </div>

        <div>
          <h3 className="font-semibold text-white">Brze poveznice</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {NAV.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(item);
                  }}
                  className="hover:text-white"
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li><a href="#" className="hover:text-white">[Opći uvjeti putovanja]</a></li>
            <li><a href="#" className="hover:text-white">[Zaštita osobnih podataka]</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-brand-300 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Veliki odmor · {OWNER.name}. Sva prava pridržana.</p>
          <p>Organizator putovanja: {OWNER.name}</p>
        </div>
      </div>
    </footer>
  );
}
