// Provjera obrazaca na klijentu. Pravila primaju poruke iz rječnika (t.v) i vraćaju poruku greške ili null.

export const makeRules = (m) => ({
  required: () => (v) => ((typeof v === 'string' ? v.trim() : v) ? null : m.required),
  email: () => (v) => (!v || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? null : m.email),
  phone: () => (v) => (!v || /^\+?[0-9 ()/-]{8,20}$/.test(v.trim()) ? null : m.phone),
  url: () => (v) => {
    if (!v) return null;
    try {
      return /^https?:$/.test(new URL(v.trim()).protocol) ? null : m.url;
    } catch {
      return m.url;
    }
  },
  intRange: (min, max) => (v) => {
    if (v === '' || v == null) return null;
    const n = Number(v);
    return Number.isInteger(n) && n >= min && n <= max ? null : m.range(min, max);
  },
  futureDate: () => (v) => {
    if (!v) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(v) >= today ? null : m.future;
  },
  oib: () => (v) => (!v || isValidOib(v.trim()) ? null : m.oib),
  checked: () => (v) => (v ? null : m.consent),
  choice: () => (v) => (v ? null : m.choose),
});

// ISO 7064, MOD 11,10 – kontrolna znamenka OIB-a
export function isValidOib(oib) {
  if (!/^\d{11}$/.test(oib)) return false;
  let a = 10;
  for (let i = 0; i < 10; i++) {
    a = (a + Number(oib[i])) % 10;
    if (a === 0) a = 10;
    a = (a * 2) % 11;
  }
  return (11 - a) % 10 === Number(oib[10]);
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
