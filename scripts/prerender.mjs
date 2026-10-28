// Unaprijed iscrtava svaku stranicu u vlastiti index.html (pokreće ga `npm run build`).
// Rezultat u dist/ je statičan: poslužuje ga nginx bez Node poslužitelja.
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const ssr = join(root, 'dist-ssr');
const { render, pages, SITE_URL } = await import(pathToFileURL(join(ssr, 'entry-server.js')).href);

const template = readFileSync(join(dist, 'index.html'), 'utf8');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const list = pages();
const abs = (path) => `${SITE_URL}${path}`;

for (const page of list) {
  const { route, path, title, description, image, noindex, key, ld } = page;
  const alternates = list.filter((p) => p.key === key && !p.noindex);
  const head = [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta property="og:type" content="${route.page === 'trip' ? 'article' : 'website'}" />`,
    `<meta property="og:locale" content="${route.lang === 'en' ? 'en_GB' : 'hr_HR'}" />`,
    `<meta property="og:locale:alternate" content="${route.lang === 'en' ? 'hr_HR' : 'en_GB'}" />`,
    '<meta property="og:site_name" content="Veliki odmor" />',
    '<meta name="twitter:card" content="summary_large_image" />',
  ];
  if (noindex) head.push('<meta name="robots" content="noindex" />');
  else {
    head.push(`<link rel="canonical" href="${abs(path)}" />`, `<meta property="og:url" content="${abs(path)}" />`);
    head.push(`<meta property="og:image" content="${abs('/' + image)}" />`, '<meta property="og:image:width" content="1200" />', '<meta property="og:image:height" content="630" />', `<meta property="og:image:alt" content="${esc(title)}" />`);
    for (const a of alternates) head.push(`<link rel="alternate" hreflang="${a.route.lang}" href="${abs(a.path)}" />`);
    // Zadana inačica je hrvatska (glavno tržište: škole u Hrvatskoj)
    const xDefault = alternates.find((a) => a.route.lang === 'hr');
    if (xDefault) head.push(`<link rel="alternate" hreflang="x-default" href="${abs(xDefault.path)}" />`);
  }
  for (const d of ld || []) head.push(`<script type="application/ld+json">${JSON.stringify(d).replace(/</g, '\\u003c')}</script>`);

  const html = template
    .replace(/<html lang="[^"]*">/, `<html lang="${route.lang}">`)
    .replace(/<title>[\s\S]*?<\/title>/, '')
    .replace(/<meta\s+name="description"[\s\S]*?\/>/, '')
    .replace('</head>', `    ${head.join('\n    ')}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${render(route)}</div>`);

  const file = path.endsWith('.html') ? join(dist, path) : join(dist, path, 'index.html');
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
  console.log('  ', path);
}

const urls = list
  .filter((p) => !p.noindex)
  .map((p) => {
    const alts = list.filter((a) => a.key === p.key && !a.noindex).map((a) => `    <xhtml:link rel="alternate" hreflang="${a.route.lang}" href="${abs(a.path)}" />`);
    return `  <url>\n    <loc>${abs(p.path)}</loc>\n${alts.join('\n')}\n  </url>`;
  })
  .join('\n');
writeFileSync(join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`);
writeFileSync(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}/sitemap.xml\n`);
rmSync(ssr, { recursive: true, force: true });
console.log(`Unaprijed iscrtano ${list.length} stranica.`);
