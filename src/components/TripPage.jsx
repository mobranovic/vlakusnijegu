import { BookOpen, Check, CheckCircle2, ChevronLeft, Clock, Link2, MapPin, MessageCircle, Printer, Users, Wallet, XCircle } from 'lucide-react';
import { useState } from 'react';
import { ADDRESS, EMAILS, OWNER, PHONES, SITE_URL } from '../data/company.js';
import { TRIPS } from '../data/trips.js';
import { useT } from '../i18n/index.jsx';
import { formatDuration } from '../lib/format.js';
import { ph, visible } from '../lib/placeholders.js';
import { HASH_MODE, useRoute } from '../route.jsx';
import { InquiryForm } from './InquiryForm.jsx';
import { ageShort, TripCard } from './TripCard.jsx';
import { TripImage } from './TripImage.jsx';
import { Badge } from './ui/Badge.jsx';
import { Button } from './ui/Button.jsx';

function Share({ title }) {
  const t = useT();
  const { href, slug } = useRoute();
  const [copied, setCopied] = useState(false);
  const url = HASH_MODE ? (typeof window !== 'undefined' ? window.location.href : '') : `${SITE_URL}${href('trip', { slug })}`;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      /* preglednik ne dopušta kopiranje */
    }
  };
  return (
    <div className="flex flex-wrap gap-2 no-print">
      <Button variant="outline" size="sm" onClick={() => window.print()}>
        <Printer className="h-4 w-4" /> {t.trip.print}
      </Button>
      <Button variant="outline" size="sm" as="a" href={`https://wa.me/?text=${encodeURIComponent(`${title} – ${url}`)}`} target="_blank" rel="noreferrer">
        <MessageCircle className="h-4 w-4" /> {t.trip.whatsapp}
      </Button>
      <Button variant="outline" size="sm" onClick={copy} aria-live="polite">
        {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Link2 className="h-4 w-4" />} {copied ? t.trip.copied : t.trip.copy}
      </Button>
    </div>
  );
}

export function TripPage({ trip }) {
  const t = useT();
  const { sectionHref } = useRoute();
  const text = t.trips[trip.id];
  const others = TRIPS.filter((x) => x.id !== trip.id).slice(0, 3);
  const priceRows = [t.trip.priceText, t.trip.payment, t.trip.gratis].filter(visible).map(ph);

  return (
    <article>
      {/* Zaglavlje za ispis (PDF za Vijeće roditelja i povjerenstvo) */}
      <div className="print-only mb-4 border-b-2 border-brand-700 pb-2 text-xs">
        <strong className="text-base">{t.meta.title} – {t.ui.tagline}</strong>
        <div>{OWNER.fullName}, {ADDRESS} · OIB {OWNER.oib} · ID {OWNER.idCode} · {EMAILS[0]} · {PHONES[0].display}</div>
      </div>

      <div className="bg-ice-100">
        <div className="mx-auto max-w-7xl px-4 pb-10 pt-6 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="no-print text-sm">
            <a href={sectionHref(t.ids.trips)} className="inline-flex items-center gap-1 font-medium text-brand-700 hover:text-brand-600">
              <ChevronLeft className="h-4 w-4" /> {t.trip.back}
            </a>
          </nav>
          <div className="mt-5 grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-center">
            <div className="min-w-0">
              <h1 className="text-balance font-display text-3xl font-bold text-brand-900 sm:text-5xl">{text.title}</h1>
              <p className="mt-3 flex items-start gap-1.5 text-slate-600"><MapPin className="mt-1 h-4 w-4 shrink-0" /> {text.region}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Badge tone="ice"><Clock className="h-3.5 w-3.5" /> {formatDuration(trip, t.duration)}</Badge>
                {trip.ages.map((a) => <Badge key={a} tone="amber"><Users className="h-3.5 w-3.5" /> {ageShort(t, a)}</Badge>)}
              </div>
              <p className="mt-5 text-lg text-slate-700">{text.summary}</p>
              <div className="mt-6"><Share title={text.title} /></div>
            </div>
            <TripImage trip={trip} alt={text.title} label={t.catalogue.photo} eager className="aspect-[4/3] rounded-3xl no-print" />
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.5fr_1fr] lg:px-8">
        <section aria-labelledby="plan" className="min-w-0">
          <h2 id="plan" className="font-display text-2xl font-bold text-brand-900">{t.trip.itinerary}</h2>
          <p className="mt-2 text-sm text-slate-500">{t.trip.itineraryNote}</p>
          <ol className="mt-6 space-y-7">
            {text.itinerary.map((day) => (
              <li key={day.label} className="break-inside-avoid">
                <h3 className="inline-block rounded-lg bg-brand-700 px-3 py-1 text-sm font-semibold text-white">{day.label}</h3>
                <ul className="mt-3 border-l-2 border-brand-100 pl-5">
                  {day.items.map(([time, item]) => (
                    <li key={time + item} className="relative pb-3 last:pb-0">
                      <span className="absolute -left-[27px] top-1.5 h-3 w-3 rounded-full border-2 border-white bg-amber-500" aria-hidden />
                      <span className="mr-2 font-mono text-sm font-semibold tabular-nums text-brand-700">{time}</span>
                      <span className="text-sm text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <div>
              <h2 className="font-semibold text-brand-900">{t.trip.included}</h2>
              <ul className="mt-3 space-y-2.5">
                {text.included.map((i) => <li key={i} className="flex gap-2.5 text-sm text-slate-700"><CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" /> {i}</li>)}
              </ul>
            </div>
            <div>
              <h2 className="font-semibold text-brand-900">{t.trip.notIncluded}</h2>
              <ul className="mt-3 space-y-2.5">
                {text.notIncluded.map((i) => <li key={i} className="flex gap-2.5 text-sm text-slate-700"><XCircle className="h-5 w-5 shrink-0 text-slate-400" /> {i}</li>)}
              </ul>
            </div>
          </div>
        </section>

        <aside className="min-w-0 space-y-5">
          <div className="rounded-3xl bg-ice-100 p-5">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-brand-700"><BookOpen className="h-4 w-4" /> {t.trip.subjects}</p>
            <p className="mt-1.5 text-sm text-slate-700">{text.subjects.join(', ')}</p>
          </div>
          <div className="rounded-3xl bg-white p-5 shadow-card ring-1 ring-brand-900/5">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-brand-700"><Wallet className="h-4 w-4" /> {t.trip.price}</p>
            <ul className="mt-2 space-y-2 text-sm text-slate-700">{priceRows.map((p) => <li key={p}>{p}</li>)}</ul>
          </div>
          <p className="text-xs text-slate-500 no-print">{t.trip.printNote}</p>
        </aside>
      </div>

      <section id="upit" className="scroll-mt-20 bg-ice-100 py-12 no-print" aria-labelledby="upit-naslov">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 id="upit-naslov" className="font-display text-2xl font-bold text-brand-900">{t.trip.inquiryTitle}</h2>
          <p className="mt-2 text-slate-600">{t.trip.inquiryText}</p>
          <div className="mt-6 rounded-3xl bg-white p-5 shadow-card sm:p-7">
            <InquiryForm tripId={trip.id} />
          </div>
        </div>
      </section>

      <section className="py-14 no-print" aria-labelledby="drugi">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 id="drugi" className="font-display text-2xl font-bold text-brand-900">{t.trip.more}</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((x) => <TripCard key={x.id} trip={x} />)}
          </div>
        </div>
      </section>
    </article>
  );
}
