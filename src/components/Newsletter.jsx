import { useState } from 'react';
import { useT } from '../i18n/index.jsx';
import { submitForm } from '../mailto.js';
import { useRoute } from '../route.jsx';

/** Prijava na novosti za nastavnike (podnožje): e-pošta i privola; slanje kao i ostali obrasci (src/mailto.js). */
export function Newsletter() {
  const t = useT();
  const { href } = useRoute();
  const n = t.footer.newsletter;
  const [status, setStatus] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = form.elements['novosti-email'].value.trim();
    setStatus(await submitForm({ subject: n.subject, kind: 'novosti', lang: t.meta.lang, reply: email, honeypot: form.elements.website.value, lines: [`${n.email}: ${email}`] }));
  };

  if (status) return <p role="status" className="mt-8 max-w-[26rem] text-[0.9375rem]">{status === 'sent' ? n.sent : n.mailto}</p>;

  return (
    <form onSubmit={onSubmit} className="relative mt-8 max-w-[26rem]">
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <p className="font-semibold text-white">{n.title}</p>
      <p className="mt-2 text-[0.9375rem]">{n.text}</p>
      <div className="mt-4 flex flex-col gap-2 min-[420px]:flex-row">
        <label className="min-w-0 flex-1" htmlFor="novosti-email">
          <span className="sr-only">{n.email}</span>
          <input
            id="novosti-email"
            name="novosti-email"
            type="email"
            required
            autoComplete="email"
            placeholder={n.email}
            className="h-11 w-full rounded-full border border-brand-200/60 bg-transparent px-5 text-[0.9375rem] text-white placeholder:text-brand-200 focus:border-white focus:outline-none"
          />
        </label>
        <button type="submit" className="h-11 shrink-0 rounded-full bg-amber-500 px-5 text-sm font-semibold text-brand-900 transition-colors hover:bg-amber-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
          {n.submit}
        </button>
      </div>
      <label className="mt-3 flex items-start gap-2 text-[0.8125rem]" htmlFor="novosti-privola">
        <input id="novosti-privola" type="checkbox" required className="mt-0.5 h-4 w-4 shrink-0 accent-amber-500" />
        <span>
          {n.consent}{' '}
          <a href={href('privacy')} className="underline underline-offset-2 hover:text-white">{t.forms.privacyLink}</a>
        </span>
      </label>
    </form>
  );
}
