import { BookOpen, Search, ShieldCheck, Smile } from 'lucide-react';
import { useState } from 'react';
import { useT } from '../i18n/index.jsx';
import { Button } from './ui/Button.jsx';

function QuickSelect({ id, label, value, onChange, options, allLabel }) {
  return (
    <div className="min-w-0 flex-1">
      <label htmlFor={id} className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-xl border border-slate-200 bg-ice-50 px-3 text-sm font-medium text-brand-900 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
      >
        <option value="">{allLabel}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

// Brza pretraga: postavlja filtre kataloga i vodi do rezultata
export function QuickSearch({ onSearch }) {
  const t = useT();
  const s = t.hero.search;
  const [q, setQ] = useState({ type: '', destination: '', age: '' });
  const set = (k) => (v) => setQ((x) => ({ ...x, [k]: v }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSearch(q);
      }}
      className="rounded-2xl bg-white p-4 shadow-2xl ring-1 ring-brand-900/5 sm:p-5"
      role="search"
      aria-label={s.label}
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
        <QuickSelect id="qs-type" label={s.type} value={q.type} onChange={set('type')} options={t.options.type} allLabel={s.allType} />
        <QuickSelect id="qs-destination" label={s.destination} value={q.destination} onChange={set('destination')} options={t.options.destination} allLabel={s.allDestination} />
        <QuickSelect id="qs-age" label={s.age} value={q.age} onChange={set('age')} options={t.options.age} allLabel={s.allAge} />
        <Button type="submit" size="lg">
          <Search className="h-5 w-5" /> {s.submit}
        </Button>
      </div>
    </form>
  );
}

export function Hero({ onSearch }) {
  const t = useT();
  const icons = [BookOpen, ShieldCheck, Smile];
  return (
    <section className="relative overflow-hidden bg-brand-800 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(127,169,217,.45),transparent_60%)]" aria-hidden />
      <svg className="absolute inset-x-0 bottom-0 w-full text-ice-100" viewBox="0 0 1440 160" preserveAspectRatio="none" aria-hidden>
        <path d="M0 160 L0 110 L180 40 L320 100 L520 20 L700 95 L880 35 L1060 105 L1240 45 L1440 100 L1440 160 Z" fill="currentColor" opacity=".35" />
        <path d="M0 160 L0 130 L240 80 L460 135 L720 70 L980 130 L1200 85 L1440 125 L1440 160 Z" fill="currentColor" />
      </svg>

      <div className="relative mx-auto max-w-7xl px-4 pb-28 pt-14 sm:px-6 sm:pt-20 lg:px-8 lg:pb-36">
        <div className="max-w-3xl">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium ring-1 ring-white/20">
            <ShieldCheck className="h-4 w-4 shrink-0 text-amber-400" /> {t.hero.badge}
          </p>
          <h1 className="mt-5 text-balance font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">{t.hero.title}</h1>
          <p className="mt-5 max-w-2xl text-lg text-brand-100">{t.hero.text}</p>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-brand-100">
            {t.hero.points.map((p, i) => {
              const Icon = icons[i];
              return (
                <li key={p} className="flex items-center gap-2"><Icon className="h-4 w-4 text-amber-400" /> {p}</li>
              );
            })}
          </ul>
        </div>
        <div className="mt-10 max-w-5xl text-slate-900">
          <QuickSearch onSearch={onSearch} />
        </div>
      </div>
    </section>
  );
}
