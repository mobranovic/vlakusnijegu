import { Quote } from 'lucide-react';
import { useT } from '../i18n/index.jsx';
import { visible } from '../lib/placeholders.js';
import { SHOW_PLACEHOLDERS } from '../route.jsx';
import { SectionHeader } from './ui/Section.jsx';
import { Photo } from './ui/Photo.jsx';

/** Ljudi iza agencije: fotografije i uloge osnivača (iz Terra Pomalo); koordinator kad bude poznat. */
export function PeopleSection() {
  const t = useT();
  const p = t.people;
  return (
    <section className="bg-white py-16 sm:py-20" aria-labelledby="ljudi">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div id="ljudi"><SectionHeader eyebrow={p.eyebrow} title={p.title}>{p.text}</SectionHeader></div>
        <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:max-w-4xl">
          {p.items.map((m) => (
            <li key={m.name} className="flex gap-5">
              <span className="h-36 w-28 shrink-0 overflow-hidden rounded-2xl bg-brand-50 shadow-card sm:h-44 sm:w-36">
                <Photo name={m.photo} alt={m.name} />
              </span>
              <div className="min-w-0">
                <h3 className="font-display text-xl font-bold text-brand-900">{m.name}</h3>
                <p className="mt-0.5 text-sm font-semibold text-amber-600">{m.role}</p>
                <p className="mt-2 text-slate-700">{m.text}</p>
              </div>
            </li>
          ))}
        </ul>
        {visible(p.coordinator) && <p className="mt-8 text-sm text-slate-600">{p.coordinator}</p>}
      </div>
    </section>
  );
}

/** Iskustva škola i roditelja: samo stvarne izjave s privolom; dok ih nema, odjeljak se vidi samo u pregledu. */
export function Testimonials() {
  const t = useT();
  const s = t.testimonials;
  const items = s.items.length ? s.items : SHOW_PLACEHOLDERS ? s.placeholders.map((text) => ({ text })) : [];
  if (!items.length) return null;
  return (
    <section className="bg-paper py-16 sm:py-20" aria-labelledby="iskustva">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div id="iskustva"><SectionHeader eyebrow={s.eyebrow} title={s.title} /></div>
        <ul className="mt-8 grid gap-5 md:grid-cols-3">
          {items.map((i) => (
            <li key={i.text} className="rounded-3xl bg-white p-6 shadow-card">
              <Quote className="h-6 w-6 text-amber-500" />
              <p className="mt-3 text-slate-700">{i.text}</p>
              {i.author && <p className="mt-4 text-sm font-semibold text-brand-900">{i.author}</p>}
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-slate-600">{s.note}</p>
      </div>
    </section>
  );
}
