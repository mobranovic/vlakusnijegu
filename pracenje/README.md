# Praćenje javnih poziva

Radnim danom ujutro GitHub pokreće `scripts/pracenje/pozivi.py`, koji na stranicama škola iz `skole.txt` traži nove
dokumente o školskim putovanjima (javni pozivi, pozivi na predstavljanje, odluke o odabiru, poništenja).

- `izvjesce.md` – samo novo od prošle provjere, po vrsti; otvorite ga na GitHubu nakon svake provjere
- `pozivi.csv` – svi pronađeni dokumenti iz zadnjih 45 dana (odluke o odabiru sadrže cijene konkurencije)
- `skole.txt` – popis škola; dodajte škole iz regija koje želite pokrivati

Ručno: `python3 scripts/pracenje/pozivi.py --dana 90`. Provjera bez mreže: `python3 -m unittest scripts/pracenje/test_pozivi.py`.

Skripta čita samo javne podatke sa stranica škola, s pauzom između upita i s oznakom tko pita (User-Agent).
Na stranicama koje nemaju javni WordPress API ili ga blokiraju neće naći ništa; takve se navode pod „Nedostupne stranice“.
