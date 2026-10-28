import { Loader2, Send } from 'lucide-react';
import { useT } from '../i18n/index.jsx';
import { toLines, useForm } from '../lib/useForm.js';
import { makeRules } from '../lib/validation.js';
import { submitForm } from '../mailto.js';
import { ConsentLabel, SentMessage } from './InquiryForm.jsx';
import { Button } from './ui/Button.jsx';
import { Checkbox, Field } from './ui/Field.jsx';
import { Honeypot } from './ui/Honeypot.jsx';

const INITIAL = { type: '', company: '', name: '', email: '', phone: '', message: '', consent: false };

export function PartnerForm() {
  const t = useT();
  const f = t.forms;
  const r = makeRules(t.v);
  const { field, submit, status, reset } = useForm(INITIAL, {
    type: [r.choice()],
    company: [r.required()],
    name: [r.required()],
    email: [r.required(), r.email()],
    phone: [r.phone()],
    message: [r.required()],
    consent: [r.checked()],
  });

  if (status === 'sent' || status === 'mailto') return <SentMessage status={status} title={f.sentTitle} text={f.sentText} onReset={reset} />;

  return (
    <form
      noValidate
      onSubmit={submit((v, honeypot) =>
        submitForm({
          subject: f.partnerSubject(v.company),
          kind: 'suradnja',
          lang: t.meta.lang,
          reply: v.email,
          honeypot,
          lines: toLines([
            [f.partnerType, f.partnerTypes.find((o) => o.value === v.type)?.label],
            [f.company, v.company],
            [f.name, v.name],
            [f.email, v.email],
            [f.phone, v.phone],
            [f.partnerMessage, v.message],
          ]),
        }),
      )}
      className="relative grid gap-4 sm:grid-cols-2"
    >
      <Honeypot />
      <Field label={f.partnerType} as="select" required options={f.partnerTypes} choose={f.choose} className="sm:col-span-2" {...field('type')} />
      <Field label={f.company} required {...field('company')} />
      <Field label={f.name} required autoComplete="name" {...field('name')} />
      <Field label={f.email} type="email" required autoComplete="email" {...field('email')} />
      <Field label={f.phone} type="tel" autoComplete="tel" {...field('phone')} />
      <Field label={f.partnerMessage} as="textarea" required className="sm:col-span-2" {...field('message')} />
      <div className="sm:col-span-2">
        <Checkbox label={<ConsentLabel text={f.partnerConsent} />} {...field('consent')} />
      </div>
      <div className="sm:col-span-2">
        <Button type="submit" variant="brand" size="lg" className="w-full sm:w-auto" disabled={status === 'sending'}>
          {status === 'sending' ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          {status === 'sending' ? f.sending : f.partnerSubmit}
        </Button>
      </div>
    </form>
  );
}
