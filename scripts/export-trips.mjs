// Ispis programa (podaci + hrvatski tekst) kao JSON za skripte izvan Vitea (npr. scripts/paket.py).
import { TRIPS } from '../src/data/trips.js';
import hr from '../src/i18n/trips.hr.js';
import { OWNER, EMAILS, PHONES } from '../src/data/company.js';

const out = {
  owner: OWNER,
  emails: EMAILS,
  phones: PHONES.map((p) => p.display),
  trips: TRIPS.map((t) => ({ ...t, ...hr[t.id] })),
};
process.stdout.write(JSON.stringify(out, null, 2));
