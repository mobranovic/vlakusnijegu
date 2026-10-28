import { Loader2, Send } from 'lucide-react';
import { TRIPS } from '../data/trips.js';
import { useT } from '../i18n/index.jsx';
import { ph } from '../lib/placeholders.js';
import { toLines, useForm } from '../lib/useForm.js';
import { makeRules } from '../lib/validation.js';
import { submitForm } from '../mailto.js';
import { useRoute } from '../route.jsx';
import { Button } from './ui/Button.jsx';
import { Checkbox, Field, FormSuccess } from './ui/Field.jsx';
import { Honeypot } from './ui/Honeypot.jsx';

const INITIAL = { name: '', school: '', email: '', phone: '', grade: '', students: '', escorts: '', date: '', trip: '', note: '', consent: false };

/** Poruka nakon slanja: poslužitelj je primio upit ili je otvoren program za e-poštu. */
export function SentMessage({ status, title, text, onReset }) {
  const t = useT();
  const f = t.forms;
  return status === 'mailto' ? (
    <FormSuccess title={f.mailtoTitle} onReset={onReset} resetLabel={f.again}><p>{f.mailtoText}</p></FormSuccess>
  ) : (
    <FormSuccess title={title} onReset={onReset} resetLabel={f.again}><p>{ph(text)}</p></FormSuccess>
  );
}

export function ConsentLabel({ text }) {
  const t = useT();
  const { href } = useRoute();
  return (
    <>
      {text}{' '}
      <a href={href('privacy')} target="_blank" rel="noreferrer" className="font-medium text-brand-700 underline underline-offset-2">
        {t.forms.privacyLink}
      </a>
    </>
  );
}

// Upit za ponudu – za određeni program (tripId) ili općenito za školu
export function InquiryForm({ tripId }) {
  const t = useT();
  const f = t.forms;
  const r = makeRules(t.v);
  const schema = {
    name: [r.required()],
    school: [r.required()],
    email: [r.required(), r.email()],
    phone: [r.required(), r.phone()],
    grade: [r.choice()],
    students: [r.required(), r.intRange(5, 400)],
    escorts: [r.intRange(0, 40)],
    date: [r.futureDate()],
    consent: [r.checked()],
  };
  const { field, submit, status, reset } = useForm(INITIAL, schema);
  const tripTitle = (id) => (id === 'po-mjeri' ? f.custom : t.trips[id]?.title || '');

  if (status === 'sent' || status === 'mailto') return <SentMessage status={status} title={f.sentTitle} text={f.sentText} onReset={reset} />;

  return (
    <form
      noValidate
      onSubmit={submit((v, honeypot) =>
        submitForm({
          subject: tripId ? f.subjectTrip(t.trips[tripId].title) : f.subjectOffer,
          kind: tripId ? 'izlet' : 'ponuda',
          lang: t.meta.lang,
          reply: v.email,
          honeypot,
          lines: toLines([
            [f.trip, tripTitle(tripId || v.trip)],
            [f.teacher, v.name],
            [f.school, v.school],
            [f.email, v.email],
            [f.phone, v.phone],
            [f.grade, t.options.age.find((o) => o.value === v.grade)?.label],
            [f.students, v.students],
            [f.escorts, v.escorts],
            [f.date, v.date],
            [f.note, v.note],
          ]),
        }),
      )}
      className="relative grid gap-4 sm:grid-cols-2"
    >
      <Honeypot />
      <Field label={f.teacher} required autoComplete="name" {...field('name')} />
      <Field label={f.school} required placeholder={f.schoolPlaceholder} {...field('school')} />
      <Field label={f.email} type="email" required autoComplete="email" {...field('email')} />
      <Field label={f.phone} type="tel" required autoComplete="tel" placeholder={f.phonePlaceholder} {...field('phone')} />
      <Field label={f.grade} as="select" required options={t.options.age} choose={f.choose} {...field('grade')} />
      <Field label={f.date} type="date" hint={f.dateHint} {...field('date')} />
      <Field label={f.students} type="number" min="5" inputMode="numeric" required {...field('students')} />
      <Field label={f.escorts} type="number" min="0" inputMode="numeric" hint={f.escortsHint} {...field('escorts')} />
      {!tripId && (
        <Field
          label={f.trip}
          as="select"
          choose={f.choose}
          options={[...TRIPS.map((x) => ({ value: x.id, label: t.trips[x.id].title })), { value: 'po-mjeri', label: f.custom }]}
          className="sm:col-span-2"
          {...field('trip')}
        />
      )}
      <Field label={f.note} as="textarea" placeholder={f.notePlaceholder} className="sm:col-span-2" {...field('note')} />
      <div className="sm:col-span-2">
        <Checkbox label={<ConsentLabel text={f.consent} />} {...field('consent')} />
      </div>
      <div className="sm:col-span-2">
        <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={status === 'sending'}>
          {status === 'sending' ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          {status === 'sending' ? f.sending : tripId ? f.submitTrip : f.submit}
        </Button>
      </div>
    </form>
  );
}
