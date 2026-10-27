// Jednostavna provjera obrazaca na klijentu. Svako pravilo vraća poruku greške ili null.

export const rules = {
  required: (msg = 'Ovo polje je obavezno.') => (v) =>
    (typeof v === 'string' ? v.trim() : v) ? null : msg,
  email: () => (v) =>
    !v || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? null : 'Upišite ispravnu adresu e-pošte.',
  phone: () => (v) =>
    !v || /^\+?[0-9 ()/-]{8,20}$/.test(v.trim()) ? null : 'Upišite ispravan broj telefona (npr. +385 91 123 4567).',
  url: () => (v) => {
    if (!v) return null;
    try {
      const u = new URL(v.trim());
      return /^https?:$/.test(u.protocol) ? null : 'Poveznica mora počinjati s http:// ili https://';
    } catch {
      return 'Upišite ispravnu poveznicu (npr. https://www.skola.hr/javni-poziv).';
    }
  },
  intRange: (min, max) => (v) => {
    if (v === '' || v == null) return null;
    const n = Number(v);
    return Number.isInteger(n) && n >= min && n <= max ? null : `Upišite cijeli broj od ${min} do ${max}.`;
  },
  futureDate: () => (v) => {
    if (!v) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(v) >= today ? null : 'Datum ne može biti u prošlosti.';
  },
  oib: () => (v) => (!v || isValidOib(v.trim()) ? null : 'OIB mora imati 11 znamenki i ispravnu kontrolnu znamenku.'),
  checked: (msg = 'Potrebna je vaša privola.') => (v) => (v ? null : msg),
  file: ({ types, maxMb }) => (f) => {
    if (!f) return null;
    if (types && !types.includes(f.type)) return 'Dopušteni su PDF ili DOC/DOCX dokumenti.';
    if (maxMb && f.size > maxMb * 1024 * 1024) return `Datoteka smije imati najviše ${maxMb} MB.`;
    return null;
  },
};

// ISO 7064, MOD 11,10 – kontrolna znamenka OIB-a
export function isValidOib(oib) {
  if (!/^\d{11}$/.test(oib)) return false;
  let a = 10;
  for (let i = 0; i < 10; i++) {
    a = (a + Number(oib[i])) % 10;
    if (a === 0) a = 10;
    a = (a * 2) % 11;
  }
  const check = (11 - a) % 10;
  return check === Number(oib[10]);
}

export function validate(values, schema) {
  const errors = {};
  for (const [field, fieldRules] of Object.entries(schema)) {
    for (const rule of fieldRules) {
      const msg = rule(values[field], values);
      if (msg) {
        errors[field] = msg;
        break;
      }
    }
  }
  return errors;
}
