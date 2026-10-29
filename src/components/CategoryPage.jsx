import { CheckCircle2 } from 'lucide-react';
import { TRIPS } from '../data/trips.js';
import { useT } from '../i18n/index.jsx';
import { useOffer } from '../offer.jsx';
import { useRoute } from '../route.jsx';
import { TripCard } from './TripCard.jsx';
import { Button } from './ui/Button.jsx';

/** Stranica vrste putovanja (škola u prirodi, jednodnevni izleti, ekskurzije): uvod, prednosti i programi. */
export function CategoryPage({ category }) {
  const t = useT();
  const { sectionHref } = useRoute();
  const openOffer = useOffer();
  const text = t.categories[category.id];
  const trips = category.trips.map((id) => TRIPS.find((x) => x.id === id));
  return (
    <>
      <div className="bg-brand-800 text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <h1 className="text-balance font-display text-3xl font-bold sm:text-5xl">{text.title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-brand-100">{text.intro}</p>
          <ul className="mt-6 grid max-w-3xl gap-2 sm:grid-cols-2">
            {text.points.map((p) => (
              <li key={p} className="flex gap-2 text-sm text-brand-100"><CheckCircle2 className="h-5 w-5 shrink-0 text-amber-400" /> {p}</li>
            ))}
          </ul>
        </div>
      </div>
      <section className="bg-ice-100 py-12 sm:py-16" aria-labelledby="programi">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 id="programi" className="font-display text-2xl font-bold text-brand-900">{t.categoryUi.programs}</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {trips.map((x) => <TripCard key={x.id} trip={x} />)}
          </div>
          <div className="mt-10 flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-card sm:flex-row sm:items-center sm:justify-between">
            <p className="text-slate-700">{t.categoryUi.custom}</p>
            <div className="flex shrink-0 flex-wrap gap-3">
              <Button onClick={openOffer}>{t.ui.requestOffer}</Button>
              <Button variant="outline" as="a" href={sectionHref(t.ids.trips)}>{t.categoryUi.all}</Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
