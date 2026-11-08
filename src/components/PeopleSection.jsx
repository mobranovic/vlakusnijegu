import { Quote } from 'lucide-react';
import { useT } from '../i18n/index.jsx';
import { SHOW_PLACEHOLDERS } from '../route.jsx';
import { SectionHeader } from './ui/Section.jsx';

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
