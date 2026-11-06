// Podaci o agenciji i vlasniku koji ne ovise o jeziku (preuzeto sa stranice Terra Pomalo).
// Sve u [uglatim zagradama] čeka potvrdu: vidi se u razvoju i pregledu, a na objavljenoj stranici se izostavlja.
export const BRAND = 'Veliki odmor';

// Adresa stranice (bez kose crte na kraju) za canonical, hreflang, Open Graph i sitemap. [Potvrditi domenu]
export const SITE_URL = 'https://www.velikiodmor.hr';
// Poslužitelj za obrasce: isti mailer kao na terrapomalo.hr (nginx prosljeđuje /api/upit, docs/objava.md).
// Ako ne odgovori, obrazac otvara pripremljenu poruku u programu za e-poštu, pa se upit ne gubi.
export const FORM_ENDPOINT = '/api/upit';
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
// Jamstvo za slučaj nesolventnosti (vrijedi 5. 11. 2026. – 5. 11. 2027.) i osiguranje od odgovornosti, kao na terrapomalo.hr
export const TRUST = { insurer: 'Croatia osiguranje d.d.', guarantee: '381290000202', liability: '554291008071' };
export const VAT_ID = 'HR52072209280'; // u sustavu PDV-a, posebni postupak oporezivanja putničkih agencija

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

// Autori fotografija i licence (Unsplash kao na terrapomalo.hr; Wikimedia Commons uz navođenje autora i licence).
// Fotografije s Commonsa smanjene su i izrezane za kartice; izmijenjene inačice dijele se pod istom licencom.
const unsplash = (id) => ({ url: `https://unsplash.com/photos/${id}`, license: 'Unsplash License', licenseUrl: 'https://unsplash.com/license' });
export const PHOTO_CREDITS = [
  { image: 'bajer', place: { hr: 'Jezero Bajer, Fužine', en: 'Lake Bajer, Fužine' }, author: 'Ozren Čučulić', ...unsplash('Vfycf7K86hM') },
  { image: 'plitvice', place: { hr: 'Plitvička jezera', en: 'Plitvice Lakes' }, author: 'Mike Swigunski', ...unsplash('NfkWUOkB78c') },
  { image: 'motovun', place: { hr: 'Motovun', en: 'Motovun' }, author: 'Elimende Inagella', ...unsplash('UHE9YMcGBX8') },
  { image: 'trakoscan', place: { hr: 'Dvorac Trakošćan', en: 'Trakošćan Castle' }, author: 'Valentina Vuk', ...unsplash('xUKRrMZe7kM') },
  { image: 'gorska-rijeka', place: { hr: 'Gorski kotar', en: 'Gorski kotar' }, author: 'Adam Bašić', ...unsplash('hX-nuUw5NPE') },
  { image: 'gorska-dolina', place: { hr: 'Gorski kotar', en: 'Gorski kotar' }, author: 'Marija Perić', ...unsplash('BTIWzA2n9ow') },
  { image: 'zagreb', place: { hr: 'Crkva sv. Marka, Zagreb', en: 'St Mark’s Church, Zagreb' }, author: 'Alexander Klink', url: 'https://commons.wikimedia.org/wiki/File:St_Marks_Church_Zagreb.jpg', license: 'CC BY 3.0', licenseUrl: 'https://creativecommons.org/licenses/by/3.0/' },
  { image: 'bec', place: { hr: 'Dvorac Schönbrunn, Beč', en: 'Schönbrunn Palace, Vienna' }, author: 'Thomas Wolf, www.foto-tw.de', url: 'https://commons.wikimedia.org/wiki/File:Schloss_Sch%C3%B6nbrunn_Wien_2014_(Zuschnitt_1).jpg', license: 'CC BY-SA 3.0 DE', licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/de/' },
];
