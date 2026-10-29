"""Praćenje javnih poziva škola za izlete, ekskurzije i škole u prirodi.

Škole na skole.hr imaju WordPress stranice; njihov javni API (/wp-json/wp/v2/) vraća nedavno objavljene
datoteke i objave. Skripta za svaku školu iz popisa traži dokumente o javnim pozivima, odlukama o odabiru i
poništenjima, pamti što je već vidjela i piše izvješće samo s novim dokumentima.

    python3 scripts/pracenje/pozivi.py                 # zadano: pracenje/skole.txt, zadnjih 45 dana
    python3 scripts/pracenje/pozivi.py --dana 90

Ulaz:  pracenje/skole.txt   – jedna adresa škole po retku (npr. https://os-xyz.skole.hr), # = komentar
Izlaz: pracenje/izvjesce.md – novi dokumenti od prošlog pokretanja, po vrsti
       pracenje/pozivi.csv  – svi pronađeni dokumenti (za pregled cijena i konkurencije)
       pracenje/stanje.json – već viđeni dokumenti
Samo standardna biblioteka Pythona; pokreće se svaki dan na GitHubu (.github/workflows/pracenje-poziva.yml).
"""
import argparse
import csv
import json
import re
import sys
import time
import unicodedata
from datetime import datetime, timedelta, timezone
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import quote, urlparse
from urllib.request import Request, urlopen

UA = 'VelikiOdmor-pracenje-poziva/1.0 (+https://www.velikiodmor.hr; info@terrapomalo.hr)'
SEARCH_TERMS = ['javni poziv', 'odabir', 'ponistenje', 'ekskurzija', 'skola u prirodi', 'izlet', 'maturalno']

# Riječi po kojima je dokument o školskom putovanju (bez dijakritičkih znakova, malim slovima)
TRIP_WORDS = ['izlet', 'ekskurz', 'skola u prirodi', 'skola-u-prirodi', 'izvanucion', 'maturaln', 'terensk', 'visednevn', 'putovanj', 'javni poziv', 'javni-poziv', 'javnog poziva', 'javnog-poziva', 'jp ', 'jp-']
NOT_TRIP = ['natjecaj', 'zaposl', 'radno mjesto', 'radnog mjesta', 'nabav', 'udzbenik', 'prehran', 'kuhar']
KINDS = [
    ('ponistenje', ['ponist']),
    ('odabir', ['odabir', 'odabran', 'odluka o izboru', 'ishod']),
    ('predstavljanje', ['predstavljanj', 'roditeljski sastanak', 'zapisnik']),
    ('poziv', ['javni poziv', 'javni-poziv', 'javnog poziva', 'jp ', 'jp-', 'poziv']),
]
KIND_TITLE = {
    'poziv': 'Novi javni pozivi – pripremiti ponudu',
    'predstavljanje': 'Pozivi na predstavljanje i zapisnici',
    'odabir': 'Odluke o odabiru – cijene i konkurencija',
    'ponistenje': 'Poništenja – prilika za ponovni poziv',
    'ostalo': 'Ostalo o putovanjima',
}
TRIP_TYPES = [('skola u prirodi', ['skola u prirodi', 'skola-u-prirodi', 'sup']), ('maturalno', ['maturaln']),
              ('ekskurzija', ['ekskurz', 'visednevn']), ('izlet', ['izlet', 'terensk', 'jednodnevn'])]


def norm(text):
    text = unicodedata.normalize('NFKD', text or '').encode('ascii', 'ignore').decode().lower()
    return re.sub(r'[_]+', ' ', text)


def strip_html(s):
    return re.sub(r'<[^>]+>', '', s or '').replace('&#8211;', '–').replace('&nbsp;', ' ').strip()


def classify(title, url):
    text = norm(f'{title} {Path(urlparse(url).path).name} ')
    if any(w in text for w in NOT_TRIP) or not any(w in text for w in TRIP_WORDS):
        return None
    kind = next((k for k, words in KINDS if any(w in text for w in words)), 'ostalo')
    trip = next((k for k, words in TRIP_TYPES if any(w in text for w in words)), '')
    return kind, trip


def http_json(url, timeout=20):
    req = Request(url, headers={'User-Agent': UA, 'Accept': 'application/json'})
    with urlopen(req, timeout=timeout) as r:
        return json.loads(r.read().decode('utf-8'))


def fetch_school(base, since, fetch=http_json, pause=0.4):
    """Svi dokumenti i objave škole od datuma `since` koji odgovaraju pojmovima pretrage."""
    base = base.rstrip('/')
    found = {}
    for term in SEARCH_TERMS:
        for kind in ('media', 'posts'):
            fields = 'id,date,title,source_url,link' if kind == 'media' else 'id,date,title,link'
            url = f'{base}/wp-json/wp/v2/{kind}?search={quote(term)}&after={since}&per_page=100&_fields={fields}'
            for item in fetch(url) or []:
                link = item.get('source_url') or item.get('link')
                if link and link not in found:
                    found[link] = {'date': (item.get('date') or '')[:10], 'title': strip_html((item.get('title') or {}).get('rendered', '')), 'url': link}
            if pause:
                time.sleep(pause)
    return list(found.values())


def run(schools, state_path, report_path, csv_path, days, fetch=http_json, pause=0.4, now=None):
    now = now or datetime.now(timezone.utc)
    since = (now - timedelta(days=days)).strftime('%Y-%m-%dT00:00:00')
    state = json.loads(state_path.read_text(encoding='utf-8')) if state_path.exists() else {'seen': []}
    seen = set(state['seen'])
    rows, new, failed = [], [], []
    for base in schools:
        host = urlparse(base).netloc or base
        try:
            docs = fetch_school(base, since, fetch, pause)
        except (HTTPError, URLError, TimeoutError, ValueError, OSError) as e:
            failed.append((host, str(e)[:80]))
            continue
        for d in docs:
            c = classify(d['title'], d['url'])
            if not c:
                continue
            row = {**d, 'school': host, 'kind': c[0], 'trip': c[1]}
            rows.append(row)
            if d['url'] not in seen:
                new.append(row)
                seen.add(d['url'])

    rows.sort(key=lambda r: r['date'], reverse=True)
    with csv_path.open('w', newline='', encoding='utf-8') as f:
        w = csv.DictWriter(f, fieldnames=['date', 'school', 'kind', 'trip', 'title', 'url'])
        w.writeheader()
        w.writerows(rows)
    state_path.write_text(json.dumps({'seen': sorted(seen), 'updated': now.isoformat(timespec='seconds')}, ensure_ascii=False, indent=1), encoding='utf-8')
    report_path.write_text(report(new, failed, len(schools), days, now), encoding='utf-8')
    return new, failed


def report(new, failed, n_schools, days, now):
    out = [f'# Javni pozivi škola – novo od prošle provjere', '',
           f'Provjereno {now:%d. %m. %Y. u %H:%M} UTC · škola: {n_schools} · razdoblje: zadnjih {days} dana · novih dokumenata: {len(new)}', '']
    if not new:
        out += ['Nema novih dokumenata.', '']
    for kind in ['poziv', 'predstavljanje', 'odabir', 'ponistenje', 'ostalo']:
        items = sorted((r for r in new if r['kind'] == kind), key=lambda r: r['date'], reverse=True)
        if not items:
            continue
        out += [f'## {KIND_TITLE[kind]} ({len(items)})', '', '| Datum | Škola | Vrsta | Dokument |', '| --- | --- | --- | --- |']
        out += [f"| {r['date']} | {r['school']} | {r['trip'] or '–'} | [{(r['title'] or Path(urlparse(r['url']).path).name).replace('|', '/')}]({r['url']}) |" for r in items]
        out.append('')
    if failed:
        out += [f'## Nedostupne stranice ({len(failed)})', ''] + [f'- {h}: {e}' for h, e in failed] + ['']
    return '\n'.join(out)


def read_schools(path):
    return [l.strip() for l in path.read_text(encoding='utf-8').splitlines() if l.strip() and not l.lstrip().startswith('#')]


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    ap.add_argument('--skole', default='pracenje/skole.txt')
    ap.add_argument('--mapa', default='pracenje')
    ap.add_argument('--dana', type=int, default=45)
    a = ap.parse_args(argv)
    folder = Path(a.mapa)
    folder.mkdir(parents=True, exist_ok=True)
    schools = read_schools(Path(a.skole))
    new, failed = run(schools, folder / 'stanje.json', folder / 'izvjesce.md', folder / 'pozivi.csv', a.dana)
    print(f'Škola: {len(schools)}, novih dokumenata: {len(new)}, nedostupnih: {len(failed)}')


if __name__ == '__main__':
    sys.exit(main())
