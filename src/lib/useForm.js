import { useState } from 'react';
import { validate } from './validation.js';

// Stanje obrasca s provjerom: greške se prikazuju nakon napuštanja polja ili pokušaja slanja.
// status: idle | sending | sent (poslužitelj je primio upit) | mailto (otvoren program za e-poštu)
export function useForm(initial, schema) {
  const [values, setValues] = useState(initial);
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState('idle');
  const errors = validate(values, schema);

  const field = (name) => ({
    name,
    value: values[name],
    error: touched[name] ? errors[name] : null,
    valid: !!touched[name] && !errors[name] && values[name] !== '' && values[name] != null && values[name] !== false,
    onChange: (e) => {
      const t = e.target;
      setValues((v) => ({ ...v, [name]: t.type === 'checkbox' ? t.checked : t.value }));
    },
    onBlur: () => setTouched((s) => ({ ...s, [name]: true })),
  });

  const submit = (onValid) => async (e) => {
    e.preventDefault();
    setTouched(Object.fromEntries(Object.keys(schema).map((k) => [k, true])));
    const keys = Object.keys(errors);
    if (keys.length) {
      e.currentTarget.querySelector(`[name="${keys[0]}"]`)?.focus();
      return;
    }
    setStatus('sending');
    const honeypot = e.currentTarget.elements.website?.value;
    setStatus((await onValid(values, honeypot)) || 'sent');
  };

  const reset = () => {
    setValues(initial);
    setTouched({});
    setStatus('idle');
  };

  return { values, field, submit, status, reset };
}

/** Redovi poruke „Oznaka: vrijednost“ (prazna polja se izostavljaju). */
export const toLines = (pairs) => pairs.filter(([, v]) => v !== '' && v != null).map(([k, v]) => `${k}: ${v}`);
