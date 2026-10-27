import { BadgeCheck, Building2, HeartHandshake, PhoneCall, ShieldCheck, Umbrella } from 'lucide-react';
import { CONTACT, LICENSE, OWNER } from '../data/company.js';
import { SectionHeader } from './ui/Section.jsx';

const BADGES = [
  { icon: BadgeCheck, title: 'Licencirana agencija', text: `Upisani smo u Središnji informacijski sustav turističkih agencija. ID kod: ${LICENSE.idCode}.` },
  { icon: Umbrella, title: 'Osiguranje putnika', text: 'Putno zdravstveno osiguranje i osiguranje od nesretnog slučaja uključeni su u svaki program.' },
  { icon: ShieldCheck, title: 'Jamčevina', text: 'Uplate su zaštićene jamstvom za slučaj nesolventnosti, u skladu sa Zakonom o pružanju usluga u turizmu.' },
  { icon: PhoneCall, title: 'Koordinator 0–24 h', text: `Tijekom putovanja nastavnici imaju izravan broj dežurnog koordinatora: ${CONTACT.coordinator}.` },
];

export function TrustSection() {
  return (
    <section id="o-nama" className="scroll-mt-20 bg-brand-800 py-16 text-white sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-end">
          <SectionHeader eyebrow="O nama" title="Sigurnost na prvom mjestu" dark>
            Vlak u snijegu je agencija specijalizirana za školska putovanja. Planiramo ih kao roditelji i nastavnici:
            provjereni prijevoznici, smještaj prilagođen djeci i stalna dostupnost tijekom puta.
          </SectionHeader>
          <div className="flex items-start gap-4 rounded-2xl bg-white/10 p-5 ring-1 ring-white/15">
            <Building2 className="h-8 w-8 shrink-0 text-amber-400" />
            <div>
              <p className="text-sm text-brand-100">Vlasnik i organizator putovanja</p>
              <p className="mt-0.5 font-display text-xl font-bold">{OWNER.name}</p>
              <p className="mt-1 text-sm text-brand-100">
                {OWNER.address.join(', ')} · OIB {OWNER.oib} · MBS {OWNER.mbs}
              </p>
            </div>
          </div>
        </div>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {BADGES.map((b) => (
            <li key={b.title} className="rounded-3xl bg-white p-6 text-slate-700">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400/20 text-amber-600">
                <b.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-semibold text-brand-900">{b.title}</h3>
              <p className="mt-2 text-sm">{b.text}</p>
            </li>
          ))}
        </ul>

        <p className="mt-8 flex items-start gap-2 text-sm text-brand-200">
          <HeartHandshake className="mt-0.5 h-4 w-4 shrink-0" />
          {LICENSE.decision} · {LICENSE.guarantee} · {LICENSE.liability}
        </p>
      </div>
    </section>
  );
}
