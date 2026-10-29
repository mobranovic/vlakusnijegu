import { RotateCcw, SearchX, SlidersHorizontal } from 'lucide-react';
import { CATEGORIES } from '../data/categories.js';
import { TRIPS } from '../data/trips.js';
import { useRoute } from '../route.jsx';
import { useT } from '../i18n/index.jsx';
import { TripCard } from './TripCard.jsx';
import { Button } from './ui/Button.jsx';
import { SectionHeader } from './ui/Section.jsx';

export const NO_FILTERS = { type: '', destination: '', age: '' };

export const filterTrips = (f) =>
  TRIPS.filter((t) => (!f.type || t.type === f.type) && (!f.destination || t.destination === f.destination) && (!f.age || t.ages.includes(f.age)));

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

export function TripCatalogue({ filters, setFilters, onCustom }) {
  const t = useT();
  const { href } = useRoute();
  const c = t.catalogue;
  const results = filterTrips(filters);
  const active = Object.values(filters).some(Boolean);
  const groups = [
    { key: 'type', options: t.options.type.map((o) => ({ value: o.value, label: o.short })) },
    { key: 'destination', options: t.options.destination },
    { key: 'age', options: t.options.age.map((o) => ({ value: o.value, label: o.short })) },
  ];
  const toggle = (key, value) => setFilters((f) => ({ ...f, [key]: f[key] === value ? '' : value }));

  return (
    <section id={t.ids.trips} className="scroll-mt-20 bg-ice-100 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow={c.eyebrow} title={c.title}>{c.text}</SectionHeader>
        <p className="mt-5 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <a key={cat.id} href={href('category', { slug: cat.slug[t.meta.lang] })} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-brand-700 shadow-card hover:bg-brand-50">
              {t.categories[cat.id].title}
            </a>
          ))}
        </p>

        <div className="mt-8 rounded-2xl bg-white p-4 shadow-card sm:p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-brand-900">
            <SlidersHorizontal className="h-4 w-4" /> {c.filters}
          </div>
          <div className="mt-3 grid gap-4 md:grid-cols-3">
            {groups.map((g) => (
              <fieldset key={g.key}>
                <legend className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{c.groups[g.key]}</legend>
                <div className="flex flex-wrap gap-2">
                  <Chip active={!filters[g.key]} onClick={() => setFilters((f) => ({ ...f, [g.key]: '' }))}>{c.all}</Chip>
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

        <div className="mt-6 flex min-h-9 items-center justify-between gap-4" aria-live="polite">
          <p className="text-sm text-slate-600">{c.showing(results.length, TRIPS.length)}</p>
          {active && (
            <Button variant="ghost" size="sm" onClick={() => setFilters(NO_FILTERS)}>
              <RotateCcw className="h-4 w-4" /> {c.reset}
            </Button>
          )}
        </div>

        {results.length ? (
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-3xl border-2 border-dashed border-brand-200 bg-white p-10 text-center">
            <SearchX className="mx-auto h-10 w-10 text-brand-300" />
            <p className="mt-3 font-semibold text-brand-900">{c.empty}</p>
            <p className="mt-1 text-sm text-slate-600">{c.emptyText}</p>
            <Button className="mt-4" onClick={onCustom}>{t.ui.requestOffer}</Button>
          </div>
        )}
      </div>
    </section>
  );
}
