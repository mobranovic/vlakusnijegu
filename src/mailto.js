import { EMAILS, FORM_ENDPOINT } from './data/company.js';

/*
 * Slanje obrazaca (kao na stranici Terra Pomalo). Uz FORM_ENDPOINT upit se šalje poslužitelju, koji ga prosljeđuje
 * e-poštom; bez njega, ili ako slanje ne uspije, otvara se program za e-poštu posjetitelja s pripremljenom porukom
 * na adrese društva, pa se upit ne gubi. Vraća 'sent' ili 'mailto'.
 */
export async function submitForm({ subject, kind, lang, lines, reply, honeypot }) {
  if (honeypot) return 'sent';
  if (FORM_ENDPOINT) {
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, kind, lang, lines, reply }),
      });
      if (res.ok) return 'sent';
    } catch {
      /* pričuva je program za e-poštu */
    }
  }
  window.location.href = `mailto:${EMAILS.join(',')}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\r\n'))}`;
  return 'mailto';
}
