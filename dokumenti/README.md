# Dokumenti za grupu (ponuda i pisma s kodom za prijavu)

Kao kod drugih agencija za školska putovanja: škola dobiva ponudu na jednoj stranici, a svaki učenik pismo s
osobnim kodom, QR kodom do stranice za prijavu (`/prijava/?kod=…`) i barkodom za plaćanje mobilnim bankarstvom (HUB3).

1. Kopirajte `primjer-grupe.json` (npr. u `2026-014.json`) i upišite školu, program (id iz `src/data/trips.js`),
   datum, cijenu, akontaciju, rokove, doplatu za osiguranje od otkaza, jamstvo i police te popis učenika.
   Polje `null` ispisuje se kao [rezervirano mjesto]; barkod se crta tek kad su upisane cijena i akontacija.
2. `pip install -r scripts/requirements.txt` (jednom), zatim:
   `node scripts/export-trips.mjs > /tmp/trips.json && python3 scripts/grupa.py dokumenti/2026-014.json /tmp/trips.json`
3. U `dokumenti/2026-014/` su `ponuda.docx/pdf`, `pisma.docx/pdf` (jedna stranica po učeniku) i `kodovi.csv`
   (učenik, kod, poziv na broj). Prijave i uplate s weba povezujete preko koda i poziva na broj.

Kodovi se pamte u `kodovi.csv`: ponovnim pokretanjem (npr. nakon dodavanja učenika) postojeći se ne mijenjaju.
Mape stvarnih grupa sadrže imena djece i ne spremaju se u repozitorij (`.gitignore`); `2026-001/` je primjer.
