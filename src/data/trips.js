// Podaci programa koji ne ovise o jeziku. Tekst (naziv, oznaka u adresi, plan puta, SEO) je u src/i18n/<jezik>.js → trips[id].
// photo: images/<photo>.jpg (+ .webp); og: slika za dijeljenje 1200×630; bez fotografije prikazuje se ilustracija (image).
export const TRIPS = [
  { id: 'skola-u-prirodi-gorski-kotar', type: 'visednevni', destination: 'hrvatska', days: 5, nights: 4, ages: ['razredna'], photo: 'bajer', og: 'og-bajer', image: { icon: 'trees', from: '#164A8A', to: '#4A80C2' } },
  { id: 'zagrebacke-price', type: 'jednodnevni', destination: 'hrvatska', days: 1, nights: 0, ages: ['razredna', 'predmetna'], image: { icon: 'landmark', from: '#103A6E', to: '#255FA6' } },
  { id: 'istra-brijuni', type: 'visednevni', destination: 'hrvatska', days: 3, nights: 2, ages: ['predmetna', 'srednja'], photo: 'motovun', og: 'og-motovun', image: { icon: 'ship', from: '#0C2D56', to: '#4A80C2' } },
  { id: 'lika-plitvice', type: 'visednevni', destination: 'hrvatska', days: 2, nights: 1, ages: ['razredna', 'predmetna'], photo: 'plitvice', og: 'og-plitvice', image: { icon: 'waves', from: '#164A8A', to: '#7FA9D9' } },
  { id: 'bec-budimpesta', type: 'visednevni', destination: 'inozemstvo', days: 4, nights: 3, ages: ['srednja'], image: { icon: 'castle', from: '#081F3D', to: '#255FA6' } },
  { id: 'varazdin-trakoscan', type: 'jednodnevni', destination: 'hrvatska', days: 1, nights: 0, ages: ['razredna', 'predmetna', 'srednja'], photo: 'trakoscan', og: 'og-trakoscan', image: { icon: 'castle', from: '#0C2D56', to: '#7FA9D9' } },
];

export const tripById = (id) => TRIPS.find((t) => t.id === id);
