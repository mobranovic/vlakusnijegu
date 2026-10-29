# Veliki odmor

Web stranica agencije za školske izlete, ekskurzije i škole u prirodi (hrvatski i engleski).
Brend turističke agencije **TERRA POMALO d.o.o.** (ID kod HR-AB-15-110168155).

## Naredbe

```bash
npm install
npm run dev            # razvoj (rezervirana mjesta „[…]“ su vidljiva)
npm run build          # klijent + SSR + scripts/prerender.mjs → dist/ (svaka adresa vlastiti index.html)
npm run build:preview  # samostalni pregled (hash adrese, ?lang=en) u dist-preview/
```

Objava: `docs/objava.md`.

## Gdje je što

- Tekst: `src/i18n/hr.js` i `src/i18n/en.js` (isti ključevi); programi `src/i18n/trips.hr.js` i `trips.en.js`.
- Podaci programa (trajanje, uzrast, fotografija): `src/data/trips.js`. Podaci društva, kontakt, domena: `src/data/company.js`.
- Adrese (`src/route.jsx`): `/`, `/izleti/<slug>/`, vrste putovanja `/skola-u-prirodi/`, `/jednodnevni-izleti/`, `/ekskurzije/`
  (`src/data/categories.js`), `/za-nastavnike/`, `/sigurnosni-standard/`, `/za-roditelje/`, `/suradnja/`, `/o-nama/`, `/opci-uvjeti/`,
  `/zastita-podataka/`, `/pravne-informacije/`; EN `/en/…` (`trips`, `outdoor-school`, `school-day-trips`, `study-tours`, `for-schools`, `safety-standard`, `for-parents`, `partners`, `about`, `terms`, `privacy`, `legal`).
- Tekstualne stranice: `src/components/InfoPage.jsx` (`sections` s `text`, `rows`, `links`; `faq: true` = česta pitanja).
- Obrasci: `src/mailto.js` (poslužitelj ili pričuva u programu za e-poštu), provjera u `src/lib/validation.js`.
- SEO: `src/entry-server.jsx` (naslovi, opisi, JSON-LD: TravelAgency, TouristTrip, FAQPage, BreadcrumbList) i
  `scripts/prerender.mjs` (canonical, hreflang, Open Graph, sitemap s jezičnim inačicama, robots.txt).
- Fotografije: `public/images/<ime>.jpg` + `.webp`; slike za dijeljenje `og-*.jpg` (1200×630); autori u `PHOTO_CREDITS`.
- Pisma su na vlastitom poslužitelju (`src/fonts.css`), bez Google Fonts i bez kolačića.

## Rezervirana mjesta

Sve u [uglatim zagradama] čeka potvrdu: vidi se u razvoju i pregledu, a na objavljenoj stranici se izostavlja.
Otvoreno: domena, rješenje o upisu (datum), PDV status, jamstvo i polica osiguranja, radno vrijeme, okvirne cijene,
broj rata, gratis, pravilo o alkoholu (Sigurnosni standard), članstvo u udruženju, alternativno rješavanje sporova, društvene mreže, fotografije za Zagreb i Beč.
