import { ArrowRight, BookOpen, ShieldCheck, Smile } from 'lucide-react';
import { useT } from '../i18n/index.jsx';
import { useOffer } from '../offer.jsx';
import { useRoute } from '../route.jsx';
import { Button } from './ui/Button.jsx';
import { Photo } from './ui/Photo.jsx';

const ICONS = [BookOpen, ShieldCheck, Smile];

// Naslovni dio: kratka poruka i dva gumba lijevo, fotografija kao razglednica desno (na mobitelu ispod teksta)
export function Hero() {
  const t = useT();
  const h = t.hero;
  const { sectionHref } = useRoute();
  const openOffer = useOffer();
  return (
    <section className="relative overflow-hidden bg-brand-800 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(127,169,217,.35),transparent_60%)]" aria-hidden />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-12 sm:px-6 sm:pt-16 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-16 lg:px-8 lg:pb-24 lg:pt-20">
        <div className="min-w-0">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium ring-1 ring-white/20">
            <ShieldCheck className="h-4 w-4 shrink-0 text-amber-400" /> {h.badge}
          </p>
          <h1 className="mt-5 text-balance font-display text-4xl font-bold leading-[1.08] sm:text-5xl lg:text-6xl">{h.title}</h1>
          <p className="mt-5 max-w-xl text-lg text-brand-100">{h.text}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button as="a" href={sectionHref(t.ids.trips)} size="lg">
              {h.primary} <ArrowRight className="h-5 w-5" />
            </Button>
            <Button variant="light" size="lg" onClick={openOffer}>
              {h.secondary}
            </Button>
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-brand-100">
            {h.points.map((p, i) => {
              const Icon = ICONS[i];
              return <li key={p} className="flex items-center gap-2"><Icon className="h-4 w-4 text-amber-400" /> {p}</li>;
            })}
          </ul>
        </div>
        <figure className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="rotate-[1.5deg] rounded-[1.25rem] bg-white p-3 pb-12 shadow-2xl">
            <div className="aspect-[4/5] overflow-hidden rounded-xl sm:aspect-[5/4] lg:aspect-[4/5]">
              <Photo name="plitvice" alt={h.photoAlt} eager />
            </div>
            <figcaption className="absolute bottom-4 left-0 right-0 text-center font-display text-base font-semibold text-brand-800">{h.photoCaption}</figcaption>
          </div>
        </figure>
      </div>
    </section>
  );
}
