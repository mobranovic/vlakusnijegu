import { ArrowRight, Clock, MapPin, Users, Wallet } from 'lucide-react';
import { useT } from '../i18n/index.jsx';
import { formatDuration } from '../lib/format.js';
import { useRoute } from '../route.jsx';
import { TripImage } from './TripImage.jsx';
import { Badge } from './ui/Badge.jsx';

export const ageShort = (t, value) => t.options.age.find((o) => o.value === value)?.short ?? value;
export const optionLabel = (t, group, value) => t.options[group].find((o) => o.value === value)?.label ?? value;
export const priceLabel = (t, trip) => (trip.priceFrom ? t.catalogue.priceFrom(trip.priceFrom) : t.catalogue.priceOnRequest);

// Kartica programa: fotografija, naziv, mjesto, trajanje i uzrast, cijena; pojedinosti su na stranici programa
export function TripCard({ trip }) {
  const t = useT();
  const { href } = useRoute();
  const text = t.trips[trip.id];
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-brand-900/5 transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative">
        <TripImage trip={trip} alt={text.title} label={t.catalogue.photo} className="aspect-[4/3]" />
        {trip.destination === 'inozemstvo' && (
          <div className="absolute left-3 top-3">
            <Badge tone="white">{optionLabel(t, 'destination', trip.destination)}</Badge>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl font-bold text-brand-900">
          <a href={href('trip', { slug: text.slug })} className="after:absolute after:inset-0 focus:outline-none focus-visible:underline">
            {text.title}
          </a>
        </h3>
        <p className="mt-1 flex items-start gap-1.5 text-sm text-slate-600">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0" /> {text.region.split(' · ')[0]}
        </p>
        <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-700">
          <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4 text-brand-500" /> {formatDuration(trip, t.duration)}</span>
          <span className="inline-flex items-center gap-1.5"><Users className="h-4 w-4 text-brand-500" /> {trip.ages.map((a) => ageShort(t, a)).join(', ')}</span>
        </p>
        <div className="mt-auto pt-5">
        <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-900">
            <Wallet className="h-4 w-4 text-amber-600" /> {priceLabel(t, trip)}
          </span>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700" aria-hidden>
            {t.catalogue.view} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
        </div>
      </div>
    </article>
  );
}
