import { ArrowRight, BadgeCheck, Building2, PhoneCall, ShieldCheck, Umbrella } from 'lucide-react';
import { ADDRESS, OWNER } from '../data/company.js';
import { useT } from '../i18n/index.jsx';
import { useRoute } from '../route.jsx';
import { SectionHeader } from './ui/Section.jsx';

const ICONS = [BadgeCheck, Umbrella, ShieldCheck, PhoneCall];

export function TrustSection() {
  const t = useT();
  const { href } = useRoute();
  const s = t.trust;
  return (
    <section id={t.ids.trust} className="scroll-mt-20 bg-brand-800 py-16 text-white sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-end">
          <SectionHeader eyebrow={s.eyebrow} title={s.title} dark>{s.text}</SectionHeader>
          <div className="flex items-start gap-4 rounded-2xl bg-white/10 p-5 ring-1 ring-white/15">
            <Building2 className="h-8 w-8 shrink-0 text-amber-400" />
            <div className="min-w-0">
              <p className="text-sm text-brand-100">{s.ownerLabel}</p>
              <p className="mt-0.5 font-display text-xl font-bold">{OWNER.name}</p>
              <p className="mt-1 text-sm text-brand-100">{ADDRESS} · OIB {OWNER.oib} · ID {OWNER.idCode}</p>
              <a href={href('about')} className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-amber-400 hover:text-amber-500">
                {s.more} <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {s.badges.map((b, i) => {
            const Icon = ICONS[i];
            return (
              <li key={b.title} className="rounded-3xl bg-white p-6 text-slate-700">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400/20 text-amber-600">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 font-semibold text-brand-900">{b.title}</h3>
                <p className="mt-2 text-sm">{b.text}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
