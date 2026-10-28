import { BookOpen, Search, ShieldCheck, Smile } from 'lucide-react';
import { useState } from 'react';
import { OPTIONS, OWNER } from '../data/company.js';
import { Button } from './ui/Button.jsx';

function QuickSelect({ label, value, onChange, options, allLabel }) {
  return (
    <label className="block min-w-0 flex-1">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-xl border border-slate-200 bg-ice-50 px-3 text-sm font-medium text-brand-900 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
      >
        <option value="">{allLabel}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  );
}

// Brza pretraga: postavlja filtre kataloga i vodi do rezultata
export function QuickSearch({ onSearch }) {
  const [q, setQ] = useState({ type: '', destination: '', age: '' });
  const set = (k) => (v) => setQ((s) => ({ ...s, [k]: v }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSearch(q);
      }}
      className="rounded-2xl bg-white p-4 shadow-2xl ring-1 ring-brand-900/5 sm:p-5"
      role="search"
      aria-label="Brza pretraga izleta"
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
        <QuickSelect label="Vrsta" value={q.type} onChange={set('type')} options={OPTIONS.type} allLabel="Sve vrste" />
        <QuickSelect label="Odredište" value={q.destination} onChange={set('destination')} options={OPTIONS.destination} allLabel="Sva odredišta" />
        <QuickSelect label="Uzrast" value={q.age} onChange={set('age')} options={OPTIONS.age} allLabel="Svi uzrasti" />
        <Button type="submit" size="lg" className="lg:w-auto">
          <Search className="h-5 w-5" /> Pretraži
        </Button>
      </div>
    </form>
  );
}

export function Hero({ onSearch }) {
  return (
    <section id="pocetna" className="relative overflow-hidden bg-brand-800 text-white scroll-mt-20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(127,169,217,.45),transparent_60%)]" aria-hidden />
      <svg className="absolute inset-x-0 bottom-0 w-full text-ice-100" viewBox="0 0 1440 160" preserveAspectRatio="none" aria-hidden>
        <path d="M0 160 L0 110 L180 40 L320 100 L520 20 L700 95 L880 35 L1060 105 L1240 45 L1440 100 L1440 160 Z" fill="currentColor" opacity=".35" />
        <path d="M0 160 L0 130 L240 80 L460 135 L720 70 L980 130 L1200 85 L1440 125 L1440 160 Z" fill="currentColor" />
      </svg>

      <div className="relative mx-auto max-w-7xl px-4 pb-28 pt-14 sm:px-6 sm:pt-20 lg:px-8 lg:pb-36">
        <div className="max-w-3xl">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium ring-1 ring-white/20">
            <ShieldCheck className="h-4 w-4 text-amber-400" /> Licencirana agencija · {OWNER.name}
          </p>
          <h1 className="mt-5 font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Sigurna i nezaboravna školska putovanja i izleti
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-brand-100">
            Programi koji spajaju nastavne sadržaje, zabavu i druženje – pripremljeni u skladu s Pravilnikom o izvođenju
            izleta, ekskurzija i drugih odgojno-obrazovnih aktivnosti izvan škole Ministarstva znanosti, obrazovanja i mladih.
          </p>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-brand-100">
            <li className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-amber-400" /> Povezano s kurikulumom</li>
            <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-amber-400" /> Osiguranje i koordinator 0–24 h</li>
            <li className="flex items-center gap-2"><Smile className="h-4 w-4 text-amber-400" /> Gratis za pratitelje</li>
          </ul>
        </div>
        <div className="mt-10 max-w-5xl text-slate-900">
          <QuickSearch onSearch={onSearch} />
        </div>
      </div>
    </section>
  );
}
