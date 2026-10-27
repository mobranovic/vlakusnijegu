import { useState } from 'react';
import { validate } from './validation.js';

// Stanje obrasca s provjerom: greške se prikazuju nakon napuštanja polja ili pokušaja slanja.
export function useForm(initial, schema) {
  const [values, setValues] = useState(initial);
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent
  const errors = validate(values, schema);

  const set = (name, value) => setValues((v) => ({ ...v, [name]: value }));

  const field = (name) => ({
    name,
    value: values[name],
    error: touched[name] ? errors[name] : null,
    valid: touched[name] && !errors[name] && values[name] !== '' && values[name] != null && values[name] !== false,
    onChange: (e) => {
      const t = e.target;
      set(name, t.type === 'checkbox' ? t.checked : t.type === 'file' ? t.files?.[0] ?? null : t.value);
    },
    onBlur: () => setTouched((s) => ({ ...s, [name]: true })),
  });

  const submit = (onValid) => async (e) => {
    e.preventDefault();
    setTouched(Object.fromEntries(Object.keys(schema).map((k) => [k, true])));
    if (Object.keys(errors).length) {
      const first = e.currentTarget.querySelector(`[name="${Object.keys(errors)[0]}"]`);
      first?.focus();
      return;
    }
    setStatus('sending');
    await onValid(values);
    setStatus('sent');
  };

  const reset = () => {
    setValues(initial);
    setTouched({});
    setStatus('idle');
  };

  return { values, errors, field, submit, status, reset, set };
}

// Privremeno: slanje se simulira na klijentu dok se ne poveže poslužitelj.
export const fakeSend = () => new Promise((r) => setTimeout(r, 900));

export const refNumber = (prefix) =>
  `${prefix}-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`;
