import { Loader2, Send } from 'lucide-react';
import { OPTIONS } from '../data/company.js';
import { rules as r } from '../lib/validation.js';
import { fakeSend, refNumber, useForm } from '../lib/useForm.js';
import { useState } from 'react';
import { Button } from './ui/Button.jsx';
import { Checkbox, Field, FormSuccess } from './ui/Field.jsx';

const INITIAL = {
  name: '', school: '', email: '', phone: '', grade: '', students: '', escorts: '', date: '', trip: '', note: '', consent: false,
};

// Upit za ponudu – za određeni program (trip) ili općenito za školu
export function InquiryForm({ trip, trips }) {
  const schema = {
    name: [r.required()],
    school: [r.required()],
    email: [r.required(), r.email()],
    phone: [r.required(), r.phone()],
    grade: [r.required('Odaberite uzrast.')],
    students: [r.required(), r.intRange(5, 400)],
    escorts: [r.intRange(0, 40)],
    date: [r.futureDate()],
    ...(trip ? {} : { trip: [] }),
    consent: [r.checked()],
  };
  const { field, submit, status, reset } = useForm({ ...INITIAL, trip: trip?.id ?? '' }, schema);
  const [ref, setRef] = useState('');

  if (status === 'sent') {
    return (
      <FormSuccess title="Upit je zaprimljen" onReset={reset}>
        <p>
          Hvala! Broj vašeg upita je <strong>{ref}</strong>. Ponudu i prijedlog programa šaljemo na vašu e-poštu u roku
          od [2] radna dana.
        </p>
      </FormSuccess>
    );
  }

  return (
    <form
      noValidate
      onSubmit={submit(async () => {
        await fakeSend();
        setRef(refNumber('VUS'));
      })}
      className="grid gap-4 sm:grid-cols-2"
    >
      <Field label="Ime i prezime nastavnika" required autoComplete="name" {...field('name')} />
      <Field label="Naziv škole i mjesto" required placeholder="npr. OŠ Ivana Gorana Kovačića, Delnice" {...field('school')} />
      <Field label="E-pošta" type="email" required autoComplete="email" {...field('email')} />
      <Field label="Telefon" type="tel" required autoComplete="tel" placeholder="+385 …" {...field('phone')} />
      <Field label="Uzrast" as="select" required options={OPTIONS.age} {...field('grade')} />
      <Field label="Okvirni termin" type="date" hint="Ako termin još nije poznat, ostavite prazno." {...field('date')} />
      <Field label="Broj učenika" type="number" min="5" inputMode="numeric" required {...field('students')} />
      <Field label="Broj pratitelja" type="number" min="0" inputMode="numeric" hint="Učitelji i stručni suradnici" {...field('escorts')} />
      {!trip && (
        <Field
          label="Program koji vas zanima"
          as="select"
          options={[...trips.map((t) => ({ value: t.id, label: t.title })), { value: 'po-mjeri', label: 'Program po mjeri' }]}
          className="sm:col-span-2"
          {...field('trip')}
        />
      )}
      <Field label="Napomena" as="textarea" placeholder="Posebni zahtjevi, prehrana, učenici s teškoćama…" className="sm:col-span-2" {...field('note')} />
      <div className="sm:col-span-2">
        <Checkbox
          label="Pristajem da agencija Vlak u snijegu (TERRA POMALO d.o.o.) obradi navedene podatke radi pripreme ponude."
          {...field('consent')}
        />
      </div>
      <div className="sm:col-span-2">
        <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={status === 'sending'}>
          {status === 'sending' ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          {trip ? 'Pošalji upit za ovaj izlet' : 'Zatraži ponudu'}
        </Button>
      </div>
    </form>
  );
}
