import { Clock, Facebook, Instagram, Mail, MapPin, Phone } from 'lucide-react';
import { ADDRESS, EMAILS, MAP_URL, OWNER, PHONES, SOCIAL, TERRA_POMALO_URL } from '../data/company.js';
import { useT } from '../i18n/index.jsx';
import { ph, visible } from '../lib/placeholders.js';
import { useRoute } from '../route.jsx';
import { Logo } from './Logo.jsx';
import { useNavLink } from './Navbar.jsx';

const SOCIAL_ICONS = { facebook: Facebook, instagram: Instagram };

export function Footer() {
  const t = useT();
  const f = t.footer;
  const { href } = useRoute();
  const navLink = useNavLink();
  const socials = SOCIAL.filter((s) => s.url);
  const legal = href('legal');

  return (
    <footer id="kontakt" className="scroll-mt-20 bg-brand-900 text-brand-100 no-print">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="min-w-0">
          <Logo dark />
          <p className="mt-4 text-sm">{f.text}</p>
          <p className="mt-4 text-sm">
            <span className="block text-brand-300">{f.company}</span>
            <a href={TERRA_POMALO_URL} target="_blank" rel="noreferrer" className="block font-semibold text-white hover:underline">{OWNER.fullName}</a>
            OIB {OWNER.oib} · MBS {OWNER.mbs}, {OWNER.court}
            <span className="block">{f.idCode}: {OWNER.idCode}</span>
            <span className="block">{f.board}: {OWNER.board}</span>
            <span className="block">{f.capital}: {OWNER.capital}, {f.capitalPaid}</span>
            <span className="block">IBAN {OWNER.iban}, {OWNER.bank}</span>
          </p>
        </div>

        <div className="min-w-0">
          <h2 className="font-semibold text-white">{f.contact}</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex gap-2.5"><MapPin className="h-4 w-4 shrink-0 text-amber-400" /><a href={MAP_URL} target="_blank" rel="noreferrer" className="hover:text-white">{ADDRESS}</a></li>
            {PHONES.map((p) => (
              <li key={p.tel} className="flex gap-2.5"><Phone className="h-4 w-4 shrink-0 text-amber-400" /><a href={`tel:${p.tel}`} className="hover:text-white">{p.display}</a> · <a href={p.whatsapp} target="_blank" rel="noreferrer" className="hover:text-white">WhatsApp</a></li>
            ))}
            {EMAILS.map((e) => (
              <li key={e} className="flex gap-2.5"><Mail className="h-4 w-4 shrink-0 text-amber-400" /><a href={`mailto:${e}`} className="break-all hover:text-white">{e}</a></li>
            ))}
          </ul>
        </div>

        <div className="min-w-0">
          <h2 className="font-semibold text-white">{f.hours}</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {f.hoursRows.filter(([, v]) => visible(v)).map(([d, h]) => (
              <li key={d} className="flex gap-2.5"><Clock className="h-4 w-4 shrink-0 text-amber-400" /><span><span className="text-white">{d}:</span> {ph(h)}</span></li>
            ))}
          </ul>
          {socials.length > 0 && (
            <>
              <h2 className="mt-6 font-semibold text-white">{f.social}</h2>
              <div className="mt-3 flex gap-2">
                {socials.map((s) => {
                  const Icon = SOCIAL_ICONS[s.id];
                  return <a key={s.id} href={s.url} target="_blank" rel="noreferrer" aria-label={s.label} className="rounded-full bg-white/10 p-2.5 hover:bg-white/20"><Icon className="h-4 w-4" /></a>;
                })}
              </div>
            </>
          )}
        </div>

        <div className="min-w-0">
          <h2 className="font-semibold text-white">{f.links}</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {t.nav.filter((n) => !n.contact).map((item) => (
              <li key={item.label}><a {...navLink(item)} className="hover:text-white">{item.label}</a></li>
            ))}
            {f.legalLinks.map((l) => <li key={l.page}><a href={href(l.page)} className="hover:text-white">{l.label}</a></li>)}
            <li><a href={`${legal}${legal.endsWith('/') || legal.includes('#/') ? '' : '/'}#${t.ids.complaints}`.replace('//#', '/#')} className="hover:text-white">{f.complaints}</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-brand-300 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} {t.meta.title} · {OWNER.name}. {f.rights}</p>
          <p>{t.meta.title} – {t.ui.brandOf} {OWNER.name}</p>
        </div>
      </div>
    </footer>
  );
}
