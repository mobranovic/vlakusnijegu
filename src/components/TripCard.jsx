import { ArrowRight, Clock, MapPin, Users } from 'lucide-react';
import { labelOf, shortAge } from '../data/company.js';
import { formatDuration } from '../lib/format.js';
import { TripImage } from './TripImage.jsx';
import { Badge } from './ui/Badge.jsx';
import { Button } from './ui/Button.jsx';

export function TripCard({ trip, onOpen }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-brand-900/5 transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative">
        <TripImage image={trip.image} className="aspect-[16/10]" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <Badge tone="white">{labelOf('type', trip.type)}</Badge>
          <Badge tone="white">{labelOf('destination', trip.destination)}</Badge>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl font-bold text-brand-900">{trip.title}</h3>
        <p className="mt-1 flex items-start gap-1.5 text-sm text-slate-500">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0" /> {trip.region}
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          <Badge tone="ice"><Clock className="h-3.5 w-3.5" /> {formatDuration(trip)}</Badge>
          {trip.ages.map((a) => (
            <Badge key={a} tone="amber"><Users className="h-3.5 w-3.5" /> {shortAge(a)}</Badge>
          ))}
        </div>
        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Istaknuto">
          {trip.highlights.map((h) => (
            <li key={h} className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600">{h}</li>
          ))}
        </ul>
        <div className="mt-auto pt-5">
          <Button variant="brand" className="w-full" onClick={() => onOpen(trip)}>
            Pogledaj program <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </div>
      </div>
    </article>
  );
}
