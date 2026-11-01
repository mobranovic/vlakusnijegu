import { Loader2, Send } from 'lucide-react';
import { useEffect } from 'react';
import { useT } from '../i18n/index.jsx';
import { toLines, useForm } from '../lib/useForm.js';
import { makeRules } from '../lib/validation.js';
import { submitForm } from '../mailto.js';
import { SentMessage } from './InquiryForm.jsx';
import { Button } from './ui/Button.jsx';
import { Checkbox, Field } from './ui/Field.jsx';
import { Honeypot } from './ui/Honeypot.jsx';

const INITIAL = {
  code: '', pupil: '', birth: '', klass: '', parent: '', email: '', phone: '',
  allergies: '', diet: '', meds: '', note: '', cancel: false, terms: false, privacy: false, health: false,
};

/** Prijava učenika s kodom iz pisma (scripts/grupa.py); kod dolazi i iz adrese (?kod=…, QR kod u pismu). */
export function RegistrationForm() {
  const t = useT();
  const f = t.forms;
  const r = makeRules(t.v);
  const hasHealth = (v) => [v.allergies, v.diet, v.meds].some((x) => x.trim());
  const { field, submit, status, reset, set } = useForm(INITIAL, {
    code: [r.required(), (v) => (/^[A-Z]{8}$/.test(v.trim().toUpperCase()) ? null : f.regCodeError)],
    pupil: [r.required()],
    birth: [r.required()],
    klass: [r.required()],
    parent: [r.required()],
    email: [r.required(), r.email()],
    phone: [r.required(), r.phone()],
    terms: [r.checked()],
    privacy: [r.checked()],
    health: [(v, all) => (hasHealth(all) && !v ? t.v.consent : null)],
  });

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('kod');
    if (code) set('code', code.toUpperCase());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (status === 'sent' || status === 'mailto') return <SentMessage status={status} title={f.regSentTitle} text={f.regSentText} onReset={reset} />;

  const yes = t.meta.lang === 'en' ? 'yes' : 'da';
  return (
    <form
      noValidate
      onSubmit={submit((v, honeypot) =>
        submitForm({
          subject: f.regSubject(v.code.toUpperCase(), v.pupil),
          kind: 'prijava',
          lang: t.meta.lang,
          reply: v.email,
          honeypot,
          lines: toLines([
            [f.regCode, v.code.toUpperCase()],
            [f.regPupil, v.pupil],
            [f.regBirth, v.birth],
            [f.regClass, v.klass],
            [f.regParent, v.parent],
            [f.email, v.email],
            [f.phone, v.phone],
            [f.regAllergies, v.allergies],
            [f.regDiet, v.diet],
            [f.regMeds, v.meds],
            [f.note, v.note],
            [f.regCancel, v.cancel ? yes : ''],
            [t.meta.lang === 'en' ? 'Terms accepted' : 'Prihvaćeni uvjeti i ugovorna obveza', yes],
            [t.meta.lang === 'en' ? 'Health data consent' : 'Privola za podatke o zdravlju', v.health ? yes : ''],
          ]),
        }),
      )}
      className="relative grid gap-4 sm:grid-cols-2"
    >
      <Honeypot />
      <Field label={f.regCode} required hint={f.regCodeHint} autoCapitalize="characters" maxLength={8} className="sm:col-span-2" {...field('code')} />
      <Field label={f.regPupil} required {...field('pupil')} />
      <Field label={f.regBirth} type="date" required {...field('birth')} />
      <Field label={f.regClass} required placeholder="7.b" {...field('klass')} />
      <Field label={f.regParent} required autoComplete="name" {...field('parent')} />
      <Field label={f.email} type="email" required autoComplete="email" {...field('email')} />
      <Field label={f.phone} type="tel" required autoComplete="tel" placeholder={f.phonePlaceholder} {...field('phone')} />
      <Field label={f.regAllergies} hint={f.regHealthHint} className="sm:col-span-2" {...field('allergies')} />
      <Field label={f.regDiet} hint={f.regHealthHint} {...field('diet')} />
      <Field label={f.regMeds} hint={f.regHealthHint} {...field('meds')} />
      <Field label={f.note} as="textarea" className="sm:col-span-2" {...field('note')} />
      <div className="space-y-3 sm:col-span-2">
        <Checkbox label={f.regCancel} {...field('cancel')} />
        <Checkbox label={f.regTerms} {...field('terms')} />
        <Checkbox label={f.regPrivacy} {...field('privacy')} />
        <Checkbox label={f.regHealth} {...field('health')} />
      </div>
      <div className="sm:col-span-2">
        <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={status === 'sending'}>
          {status === 'sending' ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          {status === 'sending' ? f.sending : f.regSubmit}
        </Button>
      </div>
    </form>
  );
}
