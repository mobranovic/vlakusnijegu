// Podaci o agenciji i vlasniku koji ne ovise o jeziku (preuzeto sa stranice Terra Pomalo).
// Sve u [uglatim zagradama] čeka potvrdu: vidi se u razvoju i pregledu, a na objavljenoj stranici se izostavlja.
export const BRAND = 'Veliki odmor';

// Adresa stranice (bez kose crte na kraju) za canonical, hreflang, Open Graph i sitemap. [Potvrditi domenu]
export const SITE_URL = 'https://www.velikiodmor.hr';
// Poslužitelj za obrasce (npr. mailer s terrapomalo.hr); prazno = obrazac otvara pripremljenu poruku u programu za e-poštu.
export const FORM_ENDPOINT = '';
export const TERRA_POMALO_URL = 'https://www.terrapomalo.hr';

export const OWNER = {
  name: 'TERRA POMALO d.o.o.',
  fullName: 'TERRA POMALO d.o.o. za usluge, turistička agencija',
  oib: '52072209280',
  mbs: '110168155',
  court: 'Trgovački sud u Šibeniku',
  street: 'Nova ulica 17, Žaborić',
  city: '22000 Šibenik',
  board: 'Snježana Cenić Stojaković, Marko Obranović',
  capital: '3.000,00 EUR',
  bank: 'Zagrebačka banka d.d. (UniCredit Group)',
  iban: 'HR83 2360 0001 1033 1654 9',
  swift: 'ZABAHR2X',
  idCode: 'HR-AB-15-110168155',
};
export const ADDRESS = `${OWNER.street}, ${OWNER.city}`;
export const MAP_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Nova ulica 17, Žaborić, 22000 Šibenik')}`;

// Službena e-pošta prva
export const EMAILS = ['info@terrapomalo.hr', 'terrapomalo@gmail.com'];

// Mobiteli (oba primaju i WhatsApp); prvi je i broj koordinatora tijekom putovanja
export const PHONES = ['+385 95 881 7779', '+385 91 524 5676'].map((display) => {
  const digits = display.replace(/\D/g, '');
  return { display, tel: `+${digits}`, whatsapp: `https://wa.me/${digits}` };
});

// Profili na društvenim mrežama; prazno = ne prikazuje se. [Upisati adrese profila]
export const SOCIAL = [
  { id: 'facebook', label: 'Facebook', url: '' },
  { id: 'instagram', label: 'Instagram', url: '' },
];

// Fotografije s Unsplasha (Unsplash License), iste kao na stranici Terra Pomalo
export const PHOTO_CREDITS = [
  { image: 'bajer', place: { hr: 'Jezero Bajer, Fužine', en: 'Lake Bajer, Fužine' }, author: 'Ozren Čučulić', id: 'Vfycf7K86hM' },
  { image: 'plitvice', place: { hr: 'Plitvička jezera', en: 'Plitvice Lakes' }, author: 'Mike Swigunski', id: 'NfkWUOkB78c' },
  { image: 'motovun', place: { hr: 'Motovun', en: 'Motovun' }, author: 'Elimende Inagella', id: 'UHE9YMcGBX8' },
  { image: 'trakoscan', place: { hr: 'Dvorac Trakošćan', en: 'Trakošćan Castle' }, author: 'Valentina Vuk', id: 'xUKRrMZe7kM' },
  { image: 'gorska-rijeka', place: { hr: 'Gorski kotar', en: 'Gorski kotar' }, author: 'Adam Bašić', id: 'hX-nuUw5NPE' },
  { image: 'gorska-dolina', place: { hr: 'Gorski kotar', en: 'Gorski kotar' }, author: 'Marija Perić', id: 'BTIWzA2n9ow' },
];
