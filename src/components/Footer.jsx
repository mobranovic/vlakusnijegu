import { CATEGORIES } from '../data/categories.js';
import { ADDRESS, EMAILS, MAP_URL, PHONES, SOCIAL, TERRA_POMALO_URL } from '../data/company.js';
import { useT } from '../i18n/index.jsx';
import { useRoute } from '../route.jsx';
import { Logo } from './Logo.jsx';
import { Newsletter } from './Newsletter.jsx';
import { TerraLogo } from './TerraLogo.jsx';

/** Stupac poveznica s naslovom. */
function Column({ title, links, className = '' }) {
  return (
    <nav aria-label={title} className={className}>
      <p className="font-semibold text-white">{title}</p>
      <ul className="mt-4 space-y-2 text-[0.9375rem]">
        {links.map((l) => (
          <li key={l.href + l.label}>
            <a href={l.href} className="link-line">{l.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden="true">
    <path d="M4.2 19.8l1.1-3.9A8.2 8.2 0 1 1 8.4 19z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M9.3 8.4c.2-.4.6-.4.8-.1l.8 1.6c.1.3 0 .5-.2.7l-.5.5c.6 1.2 1.6 2.2 2.8 2.8l.5-.5c.2-.2.4-.3.7-.2l1.6.8c.3.2.3.6-.1.8-.6.6-1.4.9-2.2.6-2.2-.8-4-2.6-4.8-4.8-.3-.8 0-1.6.6-2.2z" fill="currentColor" />
  </svg>
);

// Podnožje kao na terrapomalo.hr: četiri stupca (marka s novostima, Putovanja, Upoznajte nas, Kontakt) i donja traka
// s pravnim minimumom na svakoj stranici (tvrtka s oznakom „turistička agencija“, sjedište, OIB, ID kod) i pravnim
// poveznicama; ostali podaci o društvu su u Pravnim informacijama.
export function Footer() {
  const t = useT();
  const f = t.footer;
  const { href, sectionHref } = useRoute();
  const lang = t.meta.lang;
  const legal = href('legal');
  const legalAnchor = (id) => `${legal}#${id}`;
  const programs = [
    { label: f.allPrograms, href: sectionHref(t.ids.trips) },
    ...CATEGORIES.map((c) => ({ label: t.categories[c.id].title, href: href('category', { slug: c.slug[lang] }) })),
    { label: f.registration, href: href('registration') },
  ];
  const about = [
    { label: t.pages.teachers.title, href: href('teachers') },
    { label: t.pages.parents.title, href: href('parents') },
    { label: t.pages.safety.title, href: href('safety') },
    { label: t.pages.partners.title, href: href('partners') },
    { label: t.pages.about.title, href: href('about') },
  ];
  const socials = SOCIAL.filter((s) => s.url);

  return (
    <footer id="kontakt" className="scroll-mt-20 bg-brand-800 text-brand-100 no-print">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-12">
          <div className="col-span-2 lg:col-span-4">
            <Logo dark />
            <p className="mt-6 max-w-[26rem] text-[0.9375rem]">{f.text}</p>
            <Newsletter />
          </div>
          <Column title={f.programsTitle} links={programs} className="lg:col-span-2 lg:col-start-6" />
          <Column title={f.aboutTitle} links={about} className="lg:col-span-2" />
          <div className="col-span-2 lg:col-span-3 lg:col-start-10">
            <p className="font-semibold text-white">{f.contact}</p>
            <address className="mt-4 text-[0.9375rem] not-italic">
              <a href={MAP_URL} target="_blank" rel="noopener noreferrer" className="link-line" aria-label={`${ADDRESS} – ${f.map} (${f.newTab})`}>
                {ADDRESS}
              </a>
              {EMAILS.map((e, i) => (
                <a key={e} href={`mailto:${e}`} className={`link-line block w-fit break-all ${i ? 'mt-1' : 'mt-2'}`}>{e}</a>
              ))}
            </address>
            <ul className="mt-2 space-y-1 text-[0.9375rem]">
              {PHONES.map((p) => (
                <li key={p.tel} className="flex flex-wrap items-center gap-x-3">
                  <a href={`tel:${p.tel}`} className="link-line">{p.display}</a>
                  <a href={p.whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-white" aria-label={`WhatsApp ${p.display} (${f.newTab})`}>
                    <WhatsAppIcon /> WhatsApp
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[0.9375rem]">
              <span className="text-white">{f.hoursRows.at(-1)[0]}:</span> {f.hoursRows.at(-1)[1]}
            </p>
            {socials.length > 0 && (
              <p className="mt-4 flex gap-4 text-[0.9375rem]">
                {socials.map((s) => <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" className="link-line">{s.label}</a>)}
              </p>
            )}
          </div>
        </div>
        {/* Matična marka: Veliki odmor je brend turističke agencije Terra Pomalo (logo iz Knjige standarda, ≥ 230 px) */}
        <a href={TERRA_POMALO_URL} target="_blank" rel="noopener noreferrer" className="mt-12 flex flex-col gap-3 text-[0.9375rem] hover:text-white sm:flex-row sm:items-center sm:gap-6" aria-label={`${t.meta.title} – ${t.ui.brandOf} Terra Pomalo (${f.newTab})`}>
          <span>{t.meta.title} – {t.ui.brandOf}</span>
          <TerraLogo className="h-auto w-[230px] text-[#F7F2E8]" />
        </a>
        <div className="mt-8 flex flex-col gap-3 border-t border-brand-500 pt-6 text-[0.8125rem]">
          {/* Dijelovi pravnog retka se ne lome iznutra (npr. ID kod) */}
          <p>
            ©&nbsp;{new Date().getFullYear()}{' '}
            {f.legalLine.split(' · ').map((x, i) => (
              <span key={x}>
                {i > 0 && ' · '}
                <span className="whitespace-nowrap">{x}</span>
              </span>
            ))}
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {f.legalLinks.map((l) => <a key={l.page} href={href(l.page)} className="link-line">{l.label}</a>)}
            <a href={legalAnchor(t.ids.complaints)} className="link-line">{f.complaints}</a>
            <a href={legalAnchor(lang === 'en' ? 'photos' : 'fotografije')} className="link-line">{f.credits}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
