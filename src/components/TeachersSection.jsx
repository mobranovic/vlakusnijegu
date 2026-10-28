import { ClipboardList, FileSignature, Gavel, Loader2, Megaphone, Send, Users, Vote } from 'lucide-react';
import { useT } from '../i18n/index.jsx';
import { toLines, useForm } from '../lib/useForm.js';
import { makeRules } from '../lib/validation.js';
import { submitForm } from '../mailto.js';
import { ConsentLabel, InquiryForm, SentMessage } from './InquiryForm.jsx';
import { Button } from './ui/Button.jsx';
import { Checkbox, Field } from './ui/Field.jsx';
import { Honeypot } from './ui/Honeypot.jsx';
import { SectionHeader } from './ui/Section.jsx';

const ICONS = [ClipboardList, Users, Megaphone, Gavel, Vote, FileSignature];
const INITIAL = { school: '', oib: '', city: '', contact: '', email: '', phone: '', callNumber: '', link: '', deadline: '', note: '', consent: false };

// Javni poziv škole (Pravilnik o izvođenju izleta, ekskurzija i drugih odgojno-obrazovnih aktivnosti izvan škole)
function PublicCallForm() {
  const t = useT();
  const f = t.forms;
  const r = makeRules(t.v);
  const { field, submit, status, reset } = useForm(INITIAL, {
    school: [r.required()],
    oib: [r.required(), r.oib()],
    city: [r.required()],
    contact: [r.required()],
    email: [r.required(), r.email()],
    phone: [r.phone()],
    link: [r.required(), r.url()],
    deadline: [r.required(), r.futureDate()],
    consent: [r.checked()],
  });

  if (status === 'sent' || status === 'mailto') return <SentMessage status={status} title={f.callSentTitle} text={f.callSentText} onReset={reset} />;

  return (
    <form
      noValidate
      onSubmit={submit((v, honeypot) =>
        submitForm({
          subject: f.callSubject(v.school),
          kind: 'javni_poziv',
          lang: t.meta.lang,
          reply: v.email,
          honeypot,
          lines: toLines([
            [f.callSchool, v.school],
            [f.callOib, v.oib],
            [f.callCity, v.city],
            [f.callContact, v.contact],
            [f.email, v.email],
            [f.phone, v.phone],
            [f.callNumber, v.callNumber],
            [f.callLink, v.link],
            [f.callDeadline, v.deadline],
            [f.note, v.note],
          ]),
        }),
      )}
      className="relative grid gap-4 sm:grid-cols-2"
    >
      <Honeypot />
      <Field label={f.callSchool} required className="sm:col-span-2" {...field('school')} />
      <Field label={f.callOib} required inputMode="numeric" maxLength={11} hint={f.callOibHint} {...field('oib')} />
      <Field label={f.callCity} required {...field('city')} />
      <Field label={f.callContact} required hint={f.callContactHint} {...field('contact')} />
      <Field label={f.email} type="email" required autoComplete="email" {...field('email')} />
      <Field label={f.phone} type="tel" autoComplete="tel" {...field('phone')} />
      <Field label={f.callNumber} placeholder={f.callNumberPlaceholder} {...field('callNumber')} />
      <Field label={f.callLink} type="url" required placeholder="https://www.skola.hr/javni-poziv" className="sm:col-span-2" {...field('link')} />
      <Field label={f.callDeadline} type="date" required {...field('deadline')} />
      <Field label={f.note} as="textarea" className="sm:col-span-2" placeholder={f.callNotePlaceholder} {...field('note')} />
      <div className="sm:col-span-2">
        <Checkbox label={<ConsentLabel text={f.callConsent} />} {...field('consent')} />
      </div>
      <div className="sm:col-span-2">
        <Button type="submit" variant="brand" size="lg" className="w-full sm:w-auto" disabled={status === 'sending'}>
          {status === 'sending' ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          {status === 'sending' ? f.sending : f.callSubmit}
        </Button>
      </div>
    </form>
  );
}

export function TeachersSection() {
  const t = useT();
  const s = t.teachers;
  return (
    <section id={t.ids.teachers} className="scroll-mt-20 bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow={s.eyebrow} title={s.title}>{s.text}</SectionHeader>

        <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {s.steps.map((step, i) => {
            const Icon = ICONS[i];
            return (
              <li key={step.title} className="relative rounded-3xl bg-ice-50 p-6 ring-1 ring-brand-100">
                <span className="absolute right-5 top-5 font-display text-4xl font-bold text-brand-100" aria-hidden>{i + 1}</span>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-700 text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-semibold text-brand-900">{step.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{step.text}</p>
              </li>
            );
          })}
        </ol>
        <p className="mt-5 max-w-3xl text-sm text-slate-500">{s.note}</p>

        <div className="mt-12 grid gap-8 rounded-3xl bg-ice-100 p-5 sm:p-8 lg:grid-cols-[1fr_1.6fr] lg:p-10">
          <div>
            <h3 className="font-display text-2xl font-bold text-brand-900">{s.formTitle}</h3>
            <p className="mt-3 text-slate-600">{s.formText}</p>
            <ul className="mt-5 list-disc space-y-2 pl-5 text-sm text-slate-700">
              {s.bullets.map((b) => <li key={b}>{b}</li>)}
            </ul>
          </div>
          <div className="min-w-0 rounded-2xl bg-white p-5 shadow-card sm:p-6">{s.publicCall ? <PublicCallForm /> : <InquiryForm />}</div>
        </div>
      </div>
    </section>
  );
}
