import { BookOpen, CheckCircle2, Clock, MapPin, Printer, Users, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { CONTACT, LICENSE, OWNER, shortAge } from '../data/company.js';
import { formatDuration } from '../lib/format.js';
import { InquiryForm } from './InquiryForm.jsx';
import { TripImage } from './TripImage.jsx';
import { Badge } from './ui/Badge.jsx';
import { Button } from './ui/Button.jsx';
import { Dialog } from './ui/Dialog.jsx';

const TABS = [
  { id: 'program', label: 'Plan puta' },
  { id: 'ukljuceno', label: 'Što je uključeno' },
  { id: 'upit', label: 'Pošalji upit' },
];

function Itinerary({ trip }) {
  return (
    <ol className="space-y-6">
      {trip.itinerary.map((day) => (
        <li key={day.label}>
          <h4 className="inline-block rounded-lg bg-brand-700 px-3 py-1 text-sm font-semibold text-white">{day.label}</h4>
          <ul className="mt-3 border-l-2 border-brand-100 pl-5">
            {day.items.map((it) => (
              <li key={it.time + it.text} className="relative pb-3 last:pb-0">
                <span className="absolute -left-[27px] top-1.5 h-3 w-3 rounded-full border-2 border-white bg-amber-500" aria-hidden />
                <span className="mr-2 font-mono text-sm font-semibold text-brand-700">{it.time}</span>
                <span className="text-sm text-slate-700">{it.text}</span>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}

function Included({ trip }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <div>
        <h4 className="font-semibold text-brand-900">Cijena uključuje</h4>
        <ul className="mt-3 space-y-2.5">
          {trip.included.map((i) => (
            <li key={i} className="flex gap-2.5 text-sm text-slate-700">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" /> {i}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="font-semibold text-brand-900">Cijena ne uključuje</h4>
        <ul className="mt-3 space-y-2.5">
          {trip.notIncluded.map((i) => (
            <li key={i} className="flex gap-2.5 text-sm text-slate-700">
              <XCircle className="h-5 w-5 shrink-0 text-slate-400" /> {i}
            </li>
          ))}
        </ul>
        <p className="mt-5 rounded-xl bg-ice-100 p-3 text-xs text-slate-600">
          Konačna cijena ovisi o broju učenika, terminu i odabranom smještaju te se iskazuje u ponudi na javni poziv škole.
        </p>
      </div>
    </div>
  );
}

// Inačica programa za ispis / spremanje u PDF (za Vijeće roditelja i Povjerenstvo)
function PrintProgram({ trip }) {
  return createPortal(
    <div id="print-root" className="print-only">
      <header style={{ borderBottom: '2px solid #103A6E', paddingBottom: 8, marginBottom: 16 }}>
        <strong style={{ fontSize: 18 }}>Veliki odmor – školski izleti i ekskurzije</strong>
        <div style={{ fontSize: 11 }}>
          {OWNER.name}, {OWNER.address.join(', ')} · OIB {OWNER.oib} · ID kod {LICENSE.idCode} · {CONTACT.email} · {CONTACT.phones[0]}
        </div>
      </header>
      <h1 style={{ fontSize: 24, margin: '0 0 4px' }}>{trip.title}</h1>
      <p style={{ margin: 0 }}>
        {trip.region} · {formatDuration(trip)} · {trip.ages.map(shortAge).join(', ')}
      </p>
      <p>{trip.summary}</p>
      <p><strong>Korelacija s predmetima:</strong> {trip.subjects.join(', ')}</p>
      <h2 style={{ fontSize: 16 }}>Plan puta</h2>
      {trip.itinerary.map((d) => (
        <div key={d.label} style={{ breakInside: 'avoid', marginBottom: 10 }}>
          <strong>{d.label}</strong>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <tbody>
              {d.items.map((it) => (
                <tr key={it.time + it.text}>
                  <td style={{ width: 60, verticalAlign: 'top', padding: '2px 0' }}>{it.time}</td>
                  <td style={{ padding: '2px 0' }}>{it.text}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
      <h2 style={{ fontSize: 16 }}>Cijena uključuje</h2>
      <ul>{trip.included.map((i) => <li key={i}>{i}</li>)}</ul>
      <h2 style={{ fontSize: 16 }}>Cijena ne uključuje</h2>
      <ul>{trip.notIncluded.map((i) => <li key={i}>{i}</li>)}</ul>
      <p style={{ fontSize: 11, marginTop: 16 }}>
        Satnica je okvirna i usklađuje se sa školom. Organizator putovanja: {OWNER.name}. Koordinator tijekom putovanja: {CONTACT.coordinator} (0–24 h).
      </p>
    </div>,
    document.body,
  );
}

export function TripDetail({ trip, onClose }) {
  const [tab, setTab] = useState('program');
  useEffect(() => setTab('program'), [trip?.id]);
  if (!trip) return null;

  return (
    <>
      <Dialog open={!!trip} onClose={onClose} title={trip.title} subtitle={trip.region} size="xl">
        <div className="grid gap-6 md:grid-cols-[260px_1fr]">
          <aside className="space-y-4">
            <TripImage image={trip.image} className="aspect-[4/3] rounded-2xl" />
            <div className="flex flex-wrap gap-2">
              <Badge tone="ice"><Clock className="h-3.5 w-3.5" /> {formatDuration(trip)}</Badge>
              {trip.ages.map((a) => (
                <Badge key={a} tone="amber"><Users className="h-3.5 w-3.5" /> {shortAge(a)}</Badge>
              ))}
            </div>
            <p className="text-sm text-slate-600">{trip.summary}</p>
            <div className="rounded-xl bg-ice-100 p-3">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-brand-700">
                <BookOpen className="h-4 w-4" /> Korelacija s predmetima
              </p>
              <p className="mt-1 text-sm text-slate-700">{trip.subjects.join(', ')}</p>
            </div>
            <Button variant="outline" className="w-full" onClick={() => window.print()}>
              <Printer className="h-4 w-4" /> Ispiši / spremi PDF
            </Button>
            <p className="flex items-start gap-1.5 text-xs text-slate-500">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" /> Program za Vijeće roditelja i Povjerenstvo za provedbu javnog poziva.
            </p>
          </aside>

          <div className="min-w-0">
            <div role="tablist" aria-label="Detalji programa" className="flex gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  role="tab"
                  type="button"
                  aria-selected={tab === t.id}
                  aria-controls={`panel-${t.id}`}
                  onClick={() => setTab(t.id)}
                  className={`flex-1 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    tab === t.id ? 'bg-white text-brand-800 shadow' : 'text-slate-600 hover:text-brand-800'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div id={`panel-${tab}`} role="tabpanel" className="mt-5">
              {tab === 'program' && <Itinerary trip={trip} />}
              {tab === 'ukljuceno' && <Included trip={trip} />}
              {tab === 'upit' && <InquiryForm trip={trip} />}
            </div>
            {tab !== 'upit' && (
              <div className="mt-6 flex flex-col gap-3 rounded-2xl bg-brand-800 p-4 text-white sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm">Zanima vas ovaj program za vaš razred?</p>
                <Button onClick={() => setTab('upit')}>Pošalji upit za ovaj izlet</Button>
              </div>
            )}
          </div>
        </div>
      </Dialog>
      <PrintProgram trip={trip} />
    </>
  );
}
