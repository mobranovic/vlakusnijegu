import { ClipboardList, FileSignature, FileText, Gavel, Loader2, Megaphone, Send, Users, Vote } from 'lucide-react';
import { useState } from 'react';
import { rules as r } from '../lib/validation.js';
import { fakeSend, refNumber, useForm } from '../lib/useForm.js';
import { Button } from './ui/Button.jsx';
import { Checkbox, Field, FormSuccess } from './ui/Field.jsx';
import { SectionHeader } from './ui/Section.jsx';

// Postupak prema Pravilniku o izvođenju izleta, ekskurzija i drugih odgojno-obrazovnih aktivnosti izvan škole.
// Rokove i obrasce provjeriti u važećem tekstu Pravilnika prije objave.
const STEPS = [
  { icon: ClipboardList, title: 'Planiranje u kurikulumu', text: 'Izlet ili ekskurzija uvrštava se u školski kurikulum i godišnji plan i program rada škole, s ciljevima i nositeljima aktivnosti.' },
  { icon: Users, title: 'Povjerenstvo', text: 'Za višednevnu ekskurziju imenuje se povjerenstvo za provedbu javnog poziva i izbor ponude (razrednici, roditelji, ravnatelj).' },
  { icon: Megaphone, title: 'Javni poziv', text: 'Škola objavljuje javni poziv na propisanom obrascu na svojoj mrežnoj stranici. Pošaljite nam poveznicu – ponudu dostavljamo u zadanom roku.' },
  { icon: Gavel, title: 'Odabir ponuda', text: 'Povjerenstvo otvara ponude i odabire najpovoljnije za predstavljanje na roditeljskom sastanku.' },
  { icon: Vote, title: 'Roditeljski sastanak', text: 'Agencije predstavljaju programe roditeljima, koji glasovanjem odabiru ponudu. Rado dolazimo i predstavljamo program uživo.' },
  { icon: FileSignature, title: 'Ugovor i provedba', text: 'Sklapa se ugovor s agencijom, roditelji potpisuju suglasnosti, a nakon putovanja voditelj podnosi izvješće.' },
];

const INITIAL = { school: '', oib: '', city: '', contact: '', email: '', phone: '', callNumber: '', link: '', deadline: '', file: null, note: '', consent: false };

const SCHEMA = {
  school: [r.required()],
  oib: [r.required(), r.oib()],
  city: [r.required()],
  contact: [r.required()],
  email: [r.required(), r.email()],
  phone: [r.phone()],
  callNumber: [],
  link: [r.required('Upišite poveznicu na javni poziv.'), r.url()],
  deadline: [r.required('Upišite rok za dostavu ponuda.'), r.futureDate()],
  file: [r.file({ maxMb: 10, types: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'] })],
  consent: [r.checked()],
};

function PublicCallForm() {
  const { field, submit, status, reset } = useForm(INITIAL, SCHEMA);
  const [ref, setRef] = useState('');
  const fileField = field('file');

  if (status === 'sent') {
    return (
      <FormSuccess title="Javni poziv je zaprimljen" onReset={reset} resetLabel="Pošalji novi javni poziv">
        <p>
          Broj prijave: <strong>{ref}</strong>. Potvrdu primitka šaljemo na vašu e-poštu, a ponudu dostavljamo u roku
          navedenom u javnom pozivu.
        </p>
      </FormSuccess>
    );
  }

  return (
    <form
      noValidate
      onSubmit={submit(async () => {
        await fakeSend();
        setRef(refNumber('JP'));
      })}
      className="grid gap-4 sm:grid-cols-2"
    >
      <Field label="Naziv škole" required className="sm:col-span-2" {...field('school')} />
      <Field label="OIB škole" required inputMode="numeric" maxLength={11} hint="11 znamenki" {...field('oib')} />
      <Field label="Mjesto" required {...field('city')} />
      <Field label="Kontakt osoba" required hint="Predsjednik povjerenstva ili razrednik" {...field('contact')} />
      <Field label="E-pošta" type="email" required {...field('email')} />
      <Field label="Telefon" type="tel" {...field('phone')} />
      <Field label="Broj javnog poziva" placeholder="npr. 3/2026" {...field('callNumber')} />
      <Field label="Poveznica na javni poziv" type="url" required placeholder="https://www.skola.hr/javni-poziv" className="sm:col-span-2" {...field('link')} />
      <Field label="Rok za dostavu ponuda" type="date" required {...field('deadline')} />
      <div>
        <span className="mb-1.5 block text-sm font-medium text-brand-900">Obrazac javnog poziva (izborno)</span>
        <label
          className={`flex h-11 cursor-pointer items-center gap-2 rounded-xl border border-dashed px-3.5 text-sm ${
            fileField.error ? 'border-red-400 text-red-600' : fileField.valid ? 'border-emerald-400 text-emerald-700' : 'border-slate-300 text-slate-600 hover:border-brand-300'
          }`}
        >
          <FileText className="h-4 w-4 shrink-0" />
          <span className="truncate">{fileField.value ? fileField.value.name : 'Odaberite PDF ili DOC (do 10 MB)'}</span>
          <input type="file" accept=".pdf,.doc,.docx" className="sr-only" name="file" onChange={(e) => { fileField.onChange(e); fileField.onBlur(); }} />
        </label>
        {fileField.error && <p className="mt-1.5 text-xs font-medium text-red-600">{fileField.error}</p>}
      </div>
      <Field label="Napomena" as="textarea" className="sm:col-span-2" placeholder="Razred, broj učenika, željeno odredište…" {...field('note')} />
      <div className="sm:col-span-2">
        <Checkbox label="Potvrđujem da je javni poziv objavljen na mrežnoj stranici škole i pristajem na obradu podataka radi izrade ponude." {...field('consent')} />
      </div>
      <div className="sm:col-span-2">
        <Button type="submit" variant="brand" size="lg" className="w-full sm:w-auto" disabled={status === 'sending'}>
          {status === 'sending' ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />} Pošalji javni poziv
        </Button>
      </div>
    </form>
  );
}

export function TeachersSection() {
  return (
    <section id="nastavnici" className="scroll-mt-20 bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="Za nastavnike" title="Kako naručiti izlet ili ekskurziju">
          Pratimo vas kroz cijeli postupak propisan Pravilnikom o izvođenju izleta, ekskurzija i drugih odgojno-obrazovnih
          aktivnosti izvan škole – od planiranja do izvješća.
        </SectionHeader>

        <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((s, i) => (
            <li key={s.title} className="relative rounded-3xl bg-ice-50 p-6 ring-1 ring-brand-100">
              <span className="absolute right-5 top-5 font-display text-4xl font-bold text-brand-100" aria-hidden>{i + 1}</span>
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-700 text-white">
                <s.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-semibold text-brand-900">
                <span className="sr-only">Korak {i + 1}: </span>{s.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600">{s.text}</p>
            </li>
          ))}
        </ol>

        <div className="mt-14 grid gap-8 rounded-3xl bg-ice-100 p-5 sm:p-8 lg:grid-cols-[1fr_1.6fr] lg:p-10">
          <div>
            <h3 className="font-display text-2xl font-bold text-brand-900">Pošaljite javni poziv</h3>
            <p className="mt-3 text-slate-600">
              Upišite poveznicu na objavljeni javni poziv ili priložite obrazac. Potvrdu primitka dobivate odmah, a
              ponudu u zadanom roku.
            </p>
            <ul className="mt-5 space-y-2 text-sm text-slate-700">
              <li>• Ponuda u skladu s obrascem javnog poziva</li>
              <li>• Dokazi o registraciji i jamčevini uz ponudu</li>
              <li>• Predstavljanje na roditeljskom sastanku</li>
            </ul>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-card sm:p-6">
            <PublicCallForm />
          </div>
        </div>
      </div>
    </section>
  );
}
