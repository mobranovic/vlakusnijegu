import { RotateCcw, SearchX, SlidersHorizontal } from 'lucide-react';
import { OPTIONS } from '../data/company.js';
import { TripCard } from './TripCard.jsx';
import { Button } from './ui/Button.jsx';
import { SectionHeader } from './ui/Section.jsx';

const GROUPS = [
  { key: 'type', label: 'Trajanje', options: [{ value: 'jednodnevni', label: 'Jednodnevni' }, { value: 'visednevni', label: 'Višednevni' }] },
  { key: 'destination', label: 'Odredište', options: OPTIONS.destination },
  { key: 'age', label: 'Uzrast', options: OPTIONS.age.map((a) => ({ value: a.value, label: a.short })) },
];

export const filterTrips = (trips, f) =>
  trips.filter(
    (t) =>
      (!f.type || t.type === f.type) &&
      (!f.destination || t.destination === f.destination) &&
      (!f.age || t.ages.includes(f.age)),
  );

function Chip({ active, children, ...props }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={`rounded-full px-3.5 py-1.5 text-sm font-medium ring-1 ring-inset transition ${
        active ? 'bg-brand-700 text-white ring-brand-700' : 'bg-white text-slate-700 ring-slate-200 hover:ring-brand-300'
      }`}
      {...props}
    >
      {children}
    </button>
  );
}

export function TripCatalogue({ trips, filters, setFilters, onOpen }) {
  const results = filterTrips(trips, filters);
  const active = Object.values(filters).some(Boolean);
  const toggle = (key, value) => setFilters((f) => ({ ...f, [key]: f[key] === value ? '' : value }));

  return (
    <section id="izleti" className="scroll-mt-20 bg-ice-100 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="Katalog programa" title="Izleti, ekskurzije i škole u prirodi">
          Svaki program prilagođavamo razredu, broju učenika i terminu. Odaberite filtre ili otvorite program za
          detaljan plan puta.
        </SectionHeader>

        <div className="mt-8 rounded-2xl bg-white p-4 shadow-card sm:p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-brand-900">
            <SlidersHorizontal className="h-4 w-4" /> Filtri
          </div>
          <div className="mt-3 grid gap-4 md:grid-cols-3">
            {GROUPS.map((g) => (
              <fieldset key={g.key}>
                <legend className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{g.label}</legend>
                <div className="flex flex-wrap gap-2">
                  <Chip active={!filters[g.key]} onClick={() => setFilters((f) => ({ ...f, [g.key]: '' }))}>Sve</Chip>
                  {g.options.map((o) => (
                    <Chip key={o.value} active={filters[g.key] === o.value} onClick={() => toggle(g.key, o.value)}>
                      {o.label}
                    </Chip>
                  ))}
                </div>
              </fieldset>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-4" aria-live="polite">
          <p className="text-sm text-slate-600">
            Prikazano programa: <strong className="text-brand-900">{results.length}</strong> od {trips.length}
          </p>
          {active && (
            <Button variant="ghost" size="sm" onClick={() => setFilters({ type: '', destination: '', age: '' })}>
              <RotateCcw className="h-4 w-4" /> Poništi filtre
            </Button>
          )}
        </div>

        {results.length ? (
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((t) => (
              <TripCard key={t.id} trip={t} onOpen={onOpen} />
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-3xl border-2 border-dashed border-brand-200 bg-white p-10 text-center">
            <SearchX className="mx-auto h-10 w-10 text-brand-300" />
            <p className="mt-3 font-semibold text-brand-900">Nema programa za odabrane filtre.</p>
            <p className="mt-1 text-sm text-slate-600">Pripremit ćemo program po mjeri vašeg razreda – pošaljite nam upit.</p>
          </div>
        )}
      </div>
    </section>
  );
}
