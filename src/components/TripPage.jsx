import { BookOpen, Check, CheckCircle2, ChevronLeft, Clock, Link2, MapPin, MessageCircle, Printer, Send, Users, Wallet, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ADDRESS, EMAILS, OWNER, PHONES, PHOTO_CREDITS, SITE_URL } from '../data/company.js';
import { Photo } from './ui/Photo.jsx';
import { TRIPS } from '../data/trips.js';
import { useT } from '../i18n/index.jsx';
import { formatDuration } from '../lib/format.js';
import { ph, visible } from '../lib/placeholders.js';
import { HASH_MODE, useRoute } from '../route.jsx';
import { InquiryForm } from './InquiryForm.jsx';
import { ageShort, priceLabel, TripCard } from './TripCard.jsx';
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
    <div className="flex flex-wrap items-center gap-2 no-print">
      <span className="mr-1 text-sm font-medium text-slate-600">{t.trip.share}:</span>
      <Button variant="outline" size="sm" onClick={() => window.print()} title={t.trip.print} aria-label={t.trip.print}>
        <Printer className="h-4 w-4" /> {t.trip.shareShort.print}
      </Button>
      <Button variant="outline" size="sm" as="a" href={`https://wa.me/?text=${encodeURIComponent(`${title} – ${url}`)}`} target="_blank" rel="noreferrer" title={t.trip.whatsapp} aria-label={t.trip.whatsapp}>
        <MessageCircle className="h-4 w-4" /> {t.trip.shareShort.whatsapp}
      </Button>
      <Button variant="outline" size="sm" onClick={copy} aria-live="polite" title={t.trip.copy}>
        {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Link2 className="h-4 w-4" />} {copied ? t.trip.copied : t.trip.shareShort.copy}
      </Button>
    </div>
  );
}

/** Traka za upit na mobitelu skriva se dok su obrazac za upit ili podnožje na zaslonu (ne prekriva ih). */
function useStickyVisible() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const targets = [document.getElementById('upit'), document.getElementById('kontakt')].filter(Boolean);
    const seen = new Set();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? seen.add(e.target) : seen.delete(e.target)));
      setShow(seen.size === 0);
    });
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return show;
}

export function TripPage({ trip }) {
  const t = useT();
  const { sectionHref } = useRoute();
  const text = t.trips[trip.id];
  const others = TRIPS.filter((x) => x.id !== trip.id).slice(0, 3);
  const showSticky = useStickyVisible();
  const priceRows = [t.trip.priceText, t.trip.payment, t.trip.gratis].filter(visible).map(ph);

  return (
    <article>
      <div className={`fixed inset-x-0 bottom-0 z-30 transition-transform duration-300 ${showSticky ? 'translate-y-0' : 'translate-y-full'}`} aria-hidden={!showSticky}>
      <div className="border-t border-slate-200 bg-white/95 px-4 py-3 shadow-[0_-8px_24px_-12px_rgba(8,31,61,.25)] backdrop-blur no-print lg:hidden" style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))' }}>
        <div className="mx-auto flex max-w-xl items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-brand-900">{text.title}</p>
            <p className="text-xs text-slate-600">{formatDuration(trip, t.duration)} · {priceLabel(t, trip)}</p>
          </div>
          <a href="#upit" tabIndex={showSticky ? 0 : -1} className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-amber-500 px-4 text-sm font-semibold text-brand-900 hover:bg-amber-400">
            <Send className="h-4 w-4" /> {t.trip.stickyCta}
          </a>
        </div>
      </div>
      </div>
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
              <TripImage trip={trip} alt={text.title} label={t.catalogue.photo} eager className="mt-6 aspect-[4/3] rounded-3xl lg:hidden" />
              <p className="mt-5 text-lg text-slate-700">{text.summary}</p>
              <p className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 font-semibold text-brand-900 shadow-card">
                <Wallet className="h-5 w-5 text-amber-600" /> {priceLabel(t, trip)}
              </p>
              <div className="mt-6"><Share title={text.title} /></div>
            </div>
            <figure className="hidden rotate-[1deg] rounded-[1.25rem] bg-white p-3 pb-3 shadow-xl no-print lg:block">
              <TripImage trip={trip} alt={text.title} label={t.catalogue.photo} eager className="aspect-[4/3] rounded-xl" />
              <figcaption className="mt-2.5 text-center font-display text-base font-semibold text-brand-800">{text.region.split(' · ')[0]}</figcaption>
            </figure>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.5fr_1fr] lg:px-8">
        <section aria-labelledby="plan" className="min-w-0">
          <h2 id="plan" className="font-display text-2xl font-bold text-brand-900">{t.trip.itinerary}</h2>
          <p className="mt-2 text-sm text-slate-600">{t.trip.itineraryNote}</p>
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
          {trip.gallery && (
            <ul className="grid grid-cols-2 gap-3 no-print" aria-label={t.trip.gallery}>
              {trip.gallery.map((g) => (
                <li key={g} className="aspect-[4/3] overflow-hidden rounded-2xl shadow-card">
                  <Photo name={g} alt={PHOTO_CREDITS.find((c) => c.image === g)?.place[t.meta.lang] || text.title} />
                </li>
              ))}
            </ul>
          )}
          <p className="text-xs text-slate-600 no-print">{t.trip.printNote}</p>
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
