"""Provjera praćenja javnih poziva bez mreže: python3 -m unittest scripts/pracenje/test_pozivi.py"""
import json
import sys
import tempfile
import unittest
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
import pozivi  # noqa: E402

MEDIA = [
    {'id': 1, 'date': '2026-10-20T10:00:00', 'title': {'rendered': 'Javni poziv 3/2026 – škola u prirodi'}, 'source_url': 'https://os-a.skole.hr/wp-content/uploads/sites/1/2026/10/Javni-poziv-3-2026.pdf'},
    {'id': 2, 'date': '2026-10-18T10:00:00', 'title': {'rendered': 'Odluka o odabiru ponude ekskurzija'}, 'source_url': 'https://os-a.skole.hr/wp-content/uploads/sites/1/2026/10/Odluka-o-odabiru.pdf'},
    {'id': 3, 'date': '2026-10-17T10:00:00', 'title': {'rendered': 'Poništenje javnog poziva 2/2026'}, 'source_url': 'https://os-a.skole.hr/wp-content/uploads/sites/1/2026/10/Ponistenje-JP-2.pdf'},
    {'id': 4, 'date': '2026-10-16T10:00:00', 'title': {'rendered': 'Natječaj za radno mjesto učitelja'}, 'source_url': 'https://os-a.skole.hr/wp-content/uploads/sites/1/2026/10/Natjecaj.pdf'},
    {'id': 5, 'date': '2026-10-15T10:00:00', 'title': {'rendered': 'Jelovnik za listopad'}, 'source_url': 'https://os-a.skole.hr/wp-content/uploads/sites/1/2026/10/Jelovnik.pdf'},
]


def fake_fetch(url):
    if 'nedostupna' in url:
        raise pozivi.URLError('timeout')
    return MEDIA if '/media?' in url else []


class Test(unittest.TestCase):
    def test_classify(self):
        self.assertEqual(pozivi.classify('Javni poziv 3/2026 – škola u prirodi', 'x.pdf'), ('poziv', 'skola u prirodi'))
        self.assertEqual(pozivi.classify('', 'https://s/Odluka-o-odabiru-1-25-Prag-ekskurzija.pdf')[0], 'odabir')
        self.assertEqual(pozivi.classify('Poništenje javnog poziva', 'x.pdf')[0], 'ponistenje')
        self.assertIsNone(pozivi.classify('Natječaj za radno mjesto', 'x.pdf'))
        self.assertIsNone(pozivi.classify('Jelovnik', 'x.pdf'))

    def test_run_reports_only_new(self):
        with tempfile.TemporaryDirectory() as d:
            d = Path(d)
            args = (['https://os-a.skole.hr', 'https://nedostupna.skole.hr'], d / 's.json', d / 'r.md', d / 'p.csv', 45)
            now = datetime(2026, 10, 29, tzinfo=timezone.utc)
            new, failed = pozivi.run(*args, fetch=fake_fetch, pause=0, now=now)
            self.assertEqual(len(new), 3)
            self.assertEqual([h for h, _ in failed], ['nedostupna.skole.hr'])
            rep = (d / 'r.md').read_text(encoding='utf-8')
            self.assertIn('Novi javni pozivi', rep)
            self.assertIn('Odluke o odabiru', rep)
            self.assertNotIn('Natječaj', rep)
            new2, _ = pozivi.run(*args, fetch=fake_fetch, pause=0, now=now)
            self.assertEqual(new2, [])
            self.assertIn('Nema novih', (d / 'r.md').read_text(encoding='utf-8'))
            self.assertEqual(len(json.loads((d / 's.json').read_text())['seen']), 3)


if __name__ == '__main__':
    unittest.main()
