"""Dokumenti za grupu učenika: ponuda na jednoj stranici i pismo za svakog učenika s kodom za prijavu,
QR kodom do stranice za prijavu i barkodom za plaćanje (HUB3, za mobilno bankarstvo).

    node scripts/export-trips.mjs > /tmp/trips.json
    python3 scripts/grupa.py dokumenti/primjer-grupe.json /tmp/trips.json

Ulaz (JSON): broj ponude, škola, program (id iz src/data/trips.js), datum, cijena, rokovi i popis učenika.
Polje s vrijednošću null ispisuje se kao [rezervirano mjesto]; barkod se crta tek kad su upisani iznosi.
Izlaz: dokumenti/<broj>/ponuda.docx, pisma.docx, kodovi.csv (kod i poziv na broj po učeniku) te PDF-ovi
(ako je instaliran LibreOffice). Kodovi se pamte u kodovi.csv, pa se ponovnim pokretanjem ne mijenjaju.
Potrebno: pip install -r scripts/requirements.txt
"""
import csv
import io
import json
import secrets
import shutil
import subprocess
import sys
from datetime import date
from pathlib import Path

import pdf417gen
import qrcode
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_BREAK
from docx.shared import Cm, Pt

sys.path.insert(0, str(Path(__file__).parent))
from paket import AGES, BLUE, GREY, base_doc, bullets, duration, h2  # noqa: E402

SITE_URL = 'https://www.velikiodmor.hr'  # isto kao SITE_URL u src/data/company.js [potvrditi domenu]
CODE_ALPHABET = 'ABCDEFGHJKMNPRSTUVWXYZ'  # bez I, L, O, Q (lako se zamijene s brojkama)
PH = '[…]'


def val(v, fmt=str):
    return PH if v is None or v == '' else fmt(v)


def eur(v):
    return val(v, lambda x: f"{x:,.2f} €".replace(',', 'X').replace('.', ',').replace('X', '.'))


def day(v):
    return val(v, lambda x: date.fromisoformat(x).strftime('%d. %m. %Y.'))


def prijava_url(code):
    return f'{SITE_URL}/prijava/?kod={code}'


def png(img):
    buf = io.BytesIO()
    img.save(buf, format='PNG')
    buf.seek(0)
    return buf


def qr_png(text):
    return png(qrcode.make(text, box_size=8, border=2))


def hub3(owner, amount, payer, reference, description):
    """Sadržaj 2D barkoda za uplatu (HUB3, HUB-ova preporuka za barkod na uplatnicama)."""
    cents = f'{round(amount * 100):015d}'
    fields = ['HRVHUB30', 'EUR', cents, payer[:30], '', '', owner['name'][:25], owner['street'][:25], owner['city'][:27],
              owner['iban'].replace(' ', ''), 'HR00', reference[:22], 'OTHR', description[:35]]
    return '\n'.join(fields) + '\n'


def hub3_png(text):
    codes = pdf417gen.encode(text, columns=9, security_level=4, encoding='iso-8859-2')
    return png(pdf417gen.render_image(codes, scale=2, ratio=3, padding=6))


def load_codes(path, students, number):
    """Kodovi i pozivi na broj po učeniku; postojeći se zadržavaju, novi učenici dobivaju nove."""
    known = {}
    if path.exists():
        with path.open(encoding='utf-8') as f:
            known = {r['ucenik']: r for r in csv.DictReader(f)}
    used = {r['kod'] for r in known.values()}
    rows = []
    for i, s in enumerate(students, 1):
        if s in known:
            rows.append(known[s])
            continue
        code = ''.join(secrets.choice(CODE_ALPHABET) for _ in range(8))
        while code in used:
            code = ''.join(secrets.choice(CODE_ALPHABET) for _ in range(8))
        used.add(code)
        rows.append({'ucenik': s, 'kod': code, 'poziv_na_broj': f"{number.replace('/', '-')}-{i:03d}"})
    with path.open('w', newline='', encoding='utf-8') as f:
        w = csv.DictWriter(f, fieldnames=['ucenik', 'kod', 'poziv_na_broj'])
        w.writeheader()
        w.writerows(rows)
    return rows


def compact(doc):
    """Jedna stranica: manji razmaci, pismo 10 pt i uže margine."""
    doc.styles['Normal'].font.size = Pt(10)
    doc.styles['Normal'].paragraph_format.space_after = Pt(3)
    for name in ('Heading 2', 'List Bullet'):
        doc.styles[name].paragraph_format.space_after = Pt(1)
    doc.styles['Heading 2'].paragraph_format.space_before = Pt(7)
    doc.styles['Heading 2'].font.size = Pt(12)
    for sec in doc.sections:
        sec.top_margin = sec.bottom_margin = Cm(1.4)
        sec.left_margin = sec.right_margin = Cm(1.8)
    return doc


def organizer_footer(doc, data, g):
    o = data['owner']
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(10)
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p.add_run(
        f"Organizator putovanja: {o['fullName']} (Veliki odmor), {o['street']}, {o['city']} · "
        f"{data['emails'][0]} · {' · '.join(data['phones'])} · radno vrijeme: {g.get('radno_vrijeme') or PH}\n"
        f"OIB {o['oib']} · MBS {o['mbs']}, {o['court']} · temeljni kapital {o['capital']} · ID kod {o['idCode']} · "
        f"IBAN {o['iban']}, {o['bank']}"
    )
    r.font.size = Pt(8)
    r.font.color.rgb = GREY


def brand_line(doc, right=None):
    t = doc.add_table(rows=1, cols=2)
    left, rc = t.rows[0].cells
    r = left.paragraphs[0].add_run('Veliki odmor')
    r.bold = True
    r.font.size = Pt(20)
    r.font.color.rgb = BLUE
    r2 = left.add_paragraph().add_run('školski izleti i ekskurzije')
    r2.font.size = Pt(9)
    r2.font.color.rgb = GREY
    if right:
        rp = rc.paragraphs[0]
        rp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        rr = rp.add_run(right)
        rr.bold = True
    return t


def ponuda(data, g, trip, out):
    doc = compact(base_doc())
    brand_line(doc, f"{g['skola'] or PH}\n{trip['title']} · {day(g.get('datum'))}")
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(8)
    r = p.add_run(f"Odredište: {trip['region']}")
    r.bold = True
    r.font.size = Pt(13)
    r.font.color.rgb = BLUE
    doc.add_paragraph(f"{'Jednodnevni izlet' if trip['type'] == 'jednodnevni' else 'Višednevno putovanje'} ({duration(trip)}) za učenike: "
                      f"{g.get('razred') or PH}. {trip['summary']}")
    for d in trip['itinerary']:
        q = doc.add_paragraph()
        q.paragraph_format.space_after = Pt(2)
        rr = q.add_run(d['label'] + ': ')
        rr.bold = True
        q.add_run('; '.join(f'{t} {x}' for t, x in d['items']) + '.')
    doc.add_paragraph('Satnica je okvirna i usklađuje se sa školom.').runs[0].font.color.rgb = GREY

    h = doc.add_paragraph()
    h.paragraph_format.space_before = Pt(8)
    hr_ = h.add_run(f"Cijena paket aranžmana po učeniku: {eur(g.get('cijena'))}")
    hr_.bold = True
    hr_.font.size = Pt(14)
    hr_.font.color.rgb = BLUE
    doc.add_paragraph(f"Cijena uključuje PDV (posebni postupak za putničke agencije) i fiksna je za najmanje {val(g.get('min_ucenika'))} učenika koji plate puni iznos (plaćena mjesta).")

    h2(doc, 'Cijena uključuje')
    bullets(doc, trip['included'] + [
        f"Jamstvo za slučaj nesolventnosti: {data['trust']['insurer']}, polica br. {data['trust']['guarantee']}",
        f"Osiguranje od odgovornosti: {data['trust']['insurer']}, polica br. {data['trust']['liability']}",
        'Troškove pedagoške pratnje prema ugovoru sa školom te troškove organizacije i izdavanja ponude',
    ])

    h2(doc, 'Uvjeti plaćanja')
    doc.add_paragraph(f"Prijava učenika je valjana kad roditelj ili skrbnik pošalje prijavu na {SITE_URL}/prijava/ s osobnim kodom iz pisma "
                      f"najkasnije do {day(g.get('rok_prijave'))} i uplati akontaciju od {eur(g.get('akontacija'))} najkasnije do {day(g.get('rok_akontacije'))}")
    q = doc.add_paragraph()
    q.add_run(f"Preostali iznos uplaćuje se najkasnije do {day(g.get('rok_ostatka'))}").bold = True

    h2(doc, 'Načini plaćanja')
    bullets(doc, [
        f"Uplatom na račun {data['owner']['name']}, IBAN {data['owner']['iban']}, model HR00, poziv na broj iz osobnog pisma (barkod u pismu za mobilno bankarstvo)",
        f"Jednokratno ili u ratama, uplatama na isti račun s istim pozivom na broj: {g.get('rate') or '[broj rata i rokovi]'}",
    ])

    h2(doc, 'Dodatni program')
    doc.add_paragraph(f"Osiguranje od otkaza putovanja (npr. zbog bolesti) uz doplatu od {eur(g.get('osiguranje_otkaza'))} po učeniku. "
                      f"Odabire se u prijavi, najkasnije do {day(g.get('rok_prijave'))} Uvjeti osiguranja: {g.get('uvjeti_osiguranja') or '[osiguravatelj i uvjeti]'}.")

    h2(doc, 'Ostali uvjeti')
    extra = ['Učenici na putovanje nose zdravstvenu iskaznicu' + (', osobnu iskaznicu ili putovnicu te europsku karticu zdravstvenog osiguranja.' if trip['destination'] == 'inozemstvo' else '.'),
             'Plaćenim mjestom smatra se učenik koji je uplatio punu cijenu aranžmana.',
             f"Uz ponudu vrijede Opći uvjeti poslovanja ({SITE_URL}/opci-uvjeti/) i obrazac standardnih informacija za ugovore o paket aranžmanu.",
             f"Broj ponude: {g['broj']} · datum izrade ponude: {day(g.get('datum_ponude'))}"]
    bullets(doc, extra)
    organizer_footer(doc, data, g)
    doc.save(out / 'ponuda.docx')


def pisma(data, g, trip, rows, out):
    doc = compact(base_doc())
    o = data['owner']
    for n, row in enumerate(rows):
        if n:
            doc.add_paragraph().add_run().add_break(WD_BREAK.PAGE)
        t = doc.add_table(rows=1, cols=2)
        left, right = t.rows[0].cells
        left.width, right.width = Cm(11), Cm(5.5)
        r = left.paragraphs[0].add_run('Veliki odmor')
        r.bold = True
        r.font.size = Pt(20)
        r.font.color.rgb = BLUE
        lp = left.add_paragraph()
        lr = lp.add_run('\n'.join(['školski izleti i ekskurzije', o['fullName'], f"{o['street']}, {o['city']}", f"ID kod {o['idCode']}"]))
        lr.font.size = Pt(9)
        lr.font.color.rgb = GREY
        rp = right.paragraphs[0]
        rp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        rp.add_run().add_picture(qr_png(prijava_url(row['kod'])), width=Cm(3.6))
        cap = right.add_paragraph()
        cap.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        cr = cap.add_run('Očitajte QR kod mobitelom')
        cr.font.size = Pt(8)
        nm = right.add_paragraph()
        nm.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        nr = nm.add_run(row['ucenik'].upper())
        nr.bold = True
        nr.font.size = Pt(12)

        hp = doc.add_paragraph()
        hp.paragraph_format.space_before = Pt(14)
        hr_ = hp.add_run('Kod za prijavu na putovanje')
        hr_.bold = True
        hr_.font.size = Pt(13)
        hr_.font.color.rgb = BLUE
        doc.add_paragraph(f"{g['skola'] or PH} · {trip['title']} · {day(g.get('datum'))}")
        doc.add_paragraph(
            'Dostavljamo vam jedinstveni kod za prijavu učenika na putovanje. Kod vrijedi samo za ovo putovanje i ovog učenika. '
            'Na stranici za prijavu upisujete podatke o učeniku koji su nam potrebni za organizaciju putovanja (uključujući alergije, '
            'prehranu i lijekove) i potvrđujete da ste upoznati s ponudom, Općim uvjetima poslovanja, obrascem standardnih informacija '
            'za paket aranžmane i uvjetima putnog osiguranja. Ondje možete odabrati i osiguranje od otkaza putovanja.')
        doc.add_paragraph(f"Slanjem prijave i uplatom akontacije prijava postaje valjana. Rok za prijavu: {day(g.get('rok_prijave'))}")
        doc.add_paragraph(f'Očitajte QR kod ili otvorite stranicu {SITE_URL}/prijava/')
        kp = doc.add_paragraph()
        kp.add_run('te upišite kod: ')
        kr = kp.add_run(row['kod'])
        kr.bold = True
        kr.font.size = Pt(16)

        h2(doc, 'Uplata')
        doc.add_paragraph(f"Primatelj: {o['name']}, {o['street']}, {o['city']} · IBAN {o['iban']} · model HR00 · poziv na broj: {row['poziv_na_broj']}")
        doc.add_paragraph(f"Akontacija {eur(g.get('akontacija'))} do {day(g.get('rok_akontacije'))} · ostatak do {day(g.get('rok_ostatka'))} · "
                          f"ukupno {eur(g.get('cijena'))}" + (f" (uz osiguranje od otkaza {eur((g.get('cijena') or 0) + (g.get('osiguranje_otkaza') or 0))})" if g.get('cijena') and g.get('osiguranje_otkaza') else ''))
        if g.get('akontacija') and g.get('cijena'):
            bt = doc.add_table(rows=2, cols=2)
            desc = f"{trip['title'][:20]} {row['ucenik']}"
            for col, (label, amount) in enumerate([('Akontacija', g['akontacija']), ('Ostatak', g['cijena'] - g['akontacija'])]):
                c = bt.rows[0].cells[col].paragraphs[0]
                c.add_run(f'{label}: {eur(amount)}').bold = True
                bt.rows[1].cells[col].paragraphs[0].add_run().add_picture(
                    hub3_png(hub3(o, amount, row['ucenik'], row['poziv_na_broj'], desc)), width=Cm(7))
            note = doc.add_paragraph('Barkod očitajte u aplikaciji mobilnog bankarstva (opcija „Skeniraj i plati“).')
            note.runs[0].font.size = Pt(8)
        else:
            doc.add_paragraph('[Barkod za plaćanje ispisuje se kad se u podatke grupe upišu cijena i akontacija.]')

        sp = doc.add_paragraph()
        sp.paragraph_format.space_before = Pt(14)
        sp.add_run('Sačuvajte ovo pismo do putovanja. Za pitanja smo vam na raspolaganju na ' +
                   f"{data['emails'][0]} i {data['phones'][0]} (i WhatsApp).\n\nS poštovanjem,\nVeliki odmor")
    doc.save(out / 'pisma.docx')


def to_pdf(out):
    soffice = shutil.which('soffice') or shutil.which('libreoffice')
    if not soffice:
        return False
    subprocess.run([soffice, '--headless', '--convert-to', 'pdf', '--outdir', str(out), str(out / 'ponuda.docx'), str(out / 'pisma.docx')],
                   check=False, capture_output=True)
    return True


def main(group_path, trips_path):
    g = json.loads(Path(group_path).read_text(encoding='utf-8'))
    data = json.loads(Path(trips_path).read_text(encoding='utf-8'))
    trip = next(t for t in data['trips'] if t['id'] == g['program'])
    out = Path('dokumenti') / g['broj'].replace('/', '-')
    out.mkdir(parents=True, exist_ok=True)
    rows = load_codes(out / 'kodovi.csv', g['ucenici'], g['broj'])
    ponuda(data, g, trip, out)
    pisma(data, g, trip, rows, out)
    pdf = to_pdf(out)
    print(f"{out}/: ponuda, {len(rows)} pisama, kodovi.csv" + (', PDF' if pdf else ''))


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
