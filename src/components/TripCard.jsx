import { ArrowRight, Clock, MapPin, Users } from 'lucide-react';
import { useT } from '../i18n/index.jsx';
import { formatDuration } from '../lib/format.js';
import { useRoute } from '../route.jsx';
import { TripImage } from './TripImage.jsx';
import { Badge } from './ui/Badge.jsx';

export const ageShort = (t, value) => t.options.age.find((o) => o.value === value)?.short ?? value;
export const optionLabel = (t, group, value) => t.options[group].find((o) => o.value === value)?.label ?? value;

export function TripCard({ trip }) {
  const t = useT();
  const { href } = useRoute();
  const text = t.trips[trip.id];
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-brand-900/5 transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative">
        <TripImage trip={trip} alt={text.title} label={t.catalogue.photo} className="aspect-[16/10]" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <Badge tone="white">{optionLabel(t, 'type', trip.type)}</Badge>
          <Badge tone="white">{optionLabel(t, 'destination', trip.destination)}</Badge>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl font-bold text-brand-900">
          <a href={href('trip', { slug: text.slug })} className="after:absolute after:inset-0 focus:outline-none focus-visible:underline">
            {text.title}
          </a>
        </h3>
        <p className="mt-1 flex items-start gap-1.5 text-sm text-slate-500">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0" /> {text.region}
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          <Badge tone="ice"><Clock className="h-3.5 w-3.5" /> {formatDuration(trip, t.duration)}</Badge>
          {trip.ages.map((a) => (
            <Badge key={a} tone="amber"><Users className="h-3.5 w-3.5" /> {ageShort(t, a)}</Badge>
          ))}
        </div>
        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label={t.catalogue.highlights}>
          {text.highlights.map((h) => (
            <li key={h} className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600">{h}</li>
          ))}
        </ul>
        <div className="mt-auto pt-5">
          <span className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-700 text-sm font-semibold text-white transition-colors group-hover:bg-brand-600" aria-hidden>
            {t.catalogue.view} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </article>
  );
}
