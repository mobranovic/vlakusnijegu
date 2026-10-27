# Vlak u snijegu

Web aplikacija turističke agencije za školske izlete, ekskurzije i škole u prirodi.
Vlasnik i organizator putovanja: **TERRA POMALO d.o.o.**

## Pokretanje

```bash
npm install
npm run dev      # razvoj
npm run build    # statična izgradnja u dist/
npm run preview  # pregled izgradnje
```

## Struktura

- `src/data/trips.json` – primjeri programa (6), plan puta, uključeno / nije uključeno
- `src/data/company.js` – podaci vlasnika, kontakt, licencija; `[…]` = čeka potvrdu prije objave
- `src/components/` – Navbar, Hero (brza pretraga), TripCatalogue, TripCard, TripDetail (plan, uključeno, upit, ispis u PDF),
  InquiryForm, TeachersSection (koraci po Pravilniku + obrazac za javni poziv), TrustSection, Footer
- `src/components/ui/` – Button, Badge, Field/Checkbox (stanja greške i ispravnosti), Dialog, Section
- `src/lib/` – provjera obrazaca (e-pošta, telefon, OIB, poveznica, datum, datoteka), `useForm`, oblikovanje trajanja

Obrasci se zasad provjeravaju i „šalju“ samo na klijentu (`fakeSend` u `src/lib/useForm.js`); slanje na poslužitelj slijedi.

## Prije objave upisati

ID kod agencije (HR-AB), rješenje o upisu, jamstvo i policu osiguranja, radno vrijeme, adrese društvenih mreža,
Opće uvjete i Zaštitu podataka, fotografije programa te potvrditi programe i rokove iz Pravilnika.
