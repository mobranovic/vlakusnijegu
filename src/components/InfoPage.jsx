import { ChevronDown, ExternalLink } from 'lucide-react';
import { PHOTO_CREDITS } from '../data/company.js';
import { useT } from '../i18n/index.jsx';
import { ph, visible } from '../lib/placeholders.js';
import { useRoute } from '../route.jsx';
import { PartnerForm } from './PartnerForm.jsx';
import { Photo } from './ui/Photo.jsx';

function Links({ links }) {
  const { href } = useRoute();
  return (
    <p className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
      {links.map((l) => {
        const url = l.href || href(l.page, l.lang ? { lang: l.lang } : {});
        return (
          <a key={l.label} href={url} hrefLang={l.lang} {...(l.href && { target: '_blank', rel: 'noreferrer' })} className="inline-flex items-center gap-1.5 font-semibold text-brand-700 underline underline-offset-4 hover:text-brand-600">
            {l.label} {l.href && <ExternalLink className="h-3.5 w-3.5" />}
          </a>
        );
      })}
    </p>
  );
}

function Credits() {
  const t = useT();
  return (
    <ul className="mt-4 grid gap-3 sm:grid-cols-2">
      {PHOTO_CREDITS.map((c) => (
        <li key={c.image} className="flex items-center gap-3 text-sm">
          <span className="h-12 w-12 shrink-0 overflow-hidden rounded-lg"><Photo name={c.image} alt="" /></span>
          <span>
            {c.place[t.meta.lang]} ·{' '}
            <a href={`https://unsplash.com/photos/${c.id}`} target="_blank" rel="noreferrer" className="text-brand-700 underline underline-offset-2">{c.author}</a>
          </span>
        </li>
      ))}
    </ul>
  );
}

function SectionBody({ s }) {
  const rows = (s.rows || []).filter(([, v]) => visible(v));
  return (
    <>
      {(s.text || []).filter(visible).map((p) => <p key={p} className="mt-3 text-slate-700">{ph(p)}</p>)}
      {rows.length > 0 && (
        <dl className="mt-4 divide-y divide-slate-100 rounded-2xl bg-white ring-1 ring-slate-200">
          {rows.map(([k, v]) => (
            <div key={k} className="grid gap-1 px-4 py-3 text-sm sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:gap-4">
              <dt className="font-medium text-brand-900">{k}</dt>
              <dd className="min-w-0 break-words text-slate-700">{ph(v)}</dd>
            </div>
          ))}
        </dl>
      )}
      {s.links && <Links links={s.links} />}
      {s.credits && <Credits />}
    </>
  );
}

/** Tekstualna stranica: Za roditelje (česta pitanja), Suradnja, O nama, Opći uvjeti, Zaštita podataka, Pravne informacije. */
export function InfoPage({ page }) {
  const t = useT();
  return (
    <div className="bg-ice-50">
      <div className="bg-brand-800 text-white">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
          <h1 className="text-balance font-display text-3xl font-bold sm:text-5xl">{page.title}</h1>
          {page.intro && <p className="mt-4 max-w-2xl text-lg text-brand-100">{ph(page.intro)}</p>}
        </div>
      </div>
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        {page.faq ? (
          <div className="space-y-3">
            {page.sections.map((s) => (
              <details key={s.id} id={s.id} className="group scroll-mt-24 rounded-2xl bg-white p-5 shadow-card open:ring-1 open:ring-brand-200">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-semibold text-brand-900">
                  <h2 className="text-base sm:text-lg">{s.title}</h2>
                  <ChevronDown className="mt-1 h-5 w-5 shrink-0 text-brand-500 transition-transform group-open:rotate-180" />
                </summary>
                <SectionBody s={s} />
              </details>
            ))}
            {page.links && <Links links={page.links} />}
          </div>
        ) : (
          <div className="space-y-10">
            {page.sections.map((s) => (
              <section key={s.id} id={s.id} className="scroll-mt-24">
                <h2 className="font-display text-2xl font-bold text-brand-900">{s.title}</h2>
                <SectionBody s={s} />
              </section>
            ))}
          </div>
        )}
        {page.form && (
          <section id="obrazac" className="mt-12 scroll-mt-24 rounded-3xl bg-white p-5 shadow-card sm:p-8">
            <h2 className="font-display text-2xl font-bold text-brand-900">{t.forms.partnerTitle}</h2>
            <div className="mt-5"><PartnerForm /></div>
          </section>
        )}
      </div>
    </div>
  );
}

export function NotFound() {
  const t = useT();
  const { href, sectionHref } = useRoute();
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
      <p className="font-display text-6xl font-bold text-brand-200">404</p>
      <h1 className="mt-4 font-display text-3xl font-bold text-brand-900">{t.notFound.title}</h1>
      <p className="mt-3 text-slate-600">{t.notFound.text}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <a href={sectionHref(t.ids.trips)} className="inline-flex h-11 items-center rounded-xl bg-amber-500 px-5 text-sm font-semibold text-brand-900 hover:bg-amber-400">{t.catalogue.title}</a>
        <a href={href('home')} className="inline-flex h-11 items-center rounded-xl border border-brand-200 bg-white px-5 text-sm font-semibold text-brand-700 hover:bg-brand-50">{t.notFound.home}</a>
      </div>
    </div>
  );
}
