// Podaci o agenciji i vlasniku. Sve u [uglatim zagradama] čeka potvrdu i mora se upisati prije objave.
export const BRAND = {
  name: 'Veliki odmor',
  tagline: 'Školski izleti i ekskurzije',
};

export const OWNER = {
  name: 'TERRA POMALO d.o.o.',
  fullName: 'TERRA POMALO d.o.o. za usluge, turistička agencija',
  oib: '52072209280',
  mbs: '110168155',
  court: 'Trgovački sud u Šibeniku',
  address: ['Nova ulica 17, Žaborić', '22000 Šibenik'],
  board: 'Snježana Cenić Stojaković, direktorica · Marko Obranović, direktor',
  capital: '3.000,00 EUR, uplaćen u cijelosti',
  bank: 'Zagrebačka banka d.d.',
  iban: 'HR83 2360 0001 1033 1654 9',
  swift: 'ZABAHR2X',
  vat: '[PDV ID HR52072209280 – ako je društvo u sustavu PDV-a]',
};

export const CONTACT = {
  email: 'terrapomalo@gmail.com',
  phones: ['+385 95 881 7779', '+385 91 524 5676'],
  coordinator: '+385 95 881 7779', // dežurni koordinator tijekom putovanja [potvrditi broj]
  hours: [
    ['Ponedjeljak – petak', '[08:00 – 16:00]'],
    ['Subota', '[09:00 – 12:00]'],
    ['Tijekom putovanja', '0 – 24 h'],
  ],
};

export const LICENSE = {
  idCode: 'HR-AB-15-110168155',
  decision: '[Upis u Upisnik turističkih agencija – nadležni ured, klasa i datum rješenja]',
  supervision: 'Državni inspektorat Republike Hrvatske',
  guarantee: '[Jamstvo za slučaj nesolventnosti – osiguravatelj ili banka, broj police ili jamstva]',
  liability: '[Polica osiguranja od odgovornosti – osiguravatelj, broj police]',
};

// Adrese profila – prazno znači da se ikona ne prikazuje.
export const SOCIAL = {
  facebook: '',
  instagram: '',
  youtube: '',
};

export const OPTIONS = {
  type: [
    { value: 'jednodnevni', label: 'Jednodnevni izlet' },
    { value: 'visednevni', label: 'Višednevno putovanje' },
  ],
  destination: [
    { value: 'hrvatska', label: 'Hrvatska' },
    { value: 'inozemstvo', label: 'Inozemstvo' },
  ],
  age: [
    { value: 'razredna', label: 'Razredna nastava (1. – 4.)', short: '1. – 4. razred' },
    { value: 'predmetna', label: 'Predmetna nastava (5. – 8.)', short: '5. – 8. razred' },
    { value: 'srednja', label: 'Srednja škola', short: 'Srednja škola' },
  ],
};

export const labelOf = (group, value) => OPTIONS[group].find((o) => o.value === value)?.label ?? value;
export const shortAge = (value) => OPTIONS.age.find((o) => o.value === value)?.short ?? value;
