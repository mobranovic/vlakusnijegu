import { ArrowRight, CreditCard, Handshake, PhoneCall, Salad } from 'lucide-react';
import { useT } from '../i18n/index.jsx';
import { useRoute } from '../route.jsx';
import { SectionHeader } from './ui/Section.jsx';

const PARENT_ICONS = [PhoneCall, Salad, CreditCard];

export function ParentsTeaser() {
  const t = useT();
  const { href } = useRoute();
  const s = t.parentsTeaser;
  return (
    <section id={t.ids.parents} className="scroll-mt-20 bg-ice-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader eyebrow={s.eyebrow} title={s.title}>{s.text}</SectionHeader>
          <a href={href('parents')} className="inline-flex shrink-0 items-center gap-2 font-semibold text-brand-700 hover:text-brand-600">
            {s.link} <ArrowRight className="h-4 w-4" />
          </a>
        </div>
        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {s.points.map((p, i) => {
            const Icon = PARENT_ICONS[i];
            return (
              <li key={p.title} className="flex gap-4 rounded-3xl bg-white p-6 shadow-card">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-400/20 text-amber-600">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-semibold text-brand-900">{p.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{p.text}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export function PartnersTeaser() {
  const t = useT();
  const { href } = useRoute();
  const s = t.partnersTeaser;
  return (
    <section id={t.ids.partners} className="scroll-mt-20 bg-white py-16 sm:py-20">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div className="flex gap-5">
          <span className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 sm:flex">
            <Handshake className="h-7 w-7" />
          </span>
          <SectionHeader eyebrow={s.eyebrow} title={s.title}>{s.text}</SectionHeader>
        </div>
        <a href={href('partners')} className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-brand-700 px-6 font-semibold text-white hover:bg-brand-600">
          {s.link} <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
}
