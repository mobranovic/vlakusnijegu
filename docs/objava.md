# Objava stranice Veliki odmor

1. `npm ci && npm run build` → statična stranica u `dist/` (svaka adresa ima vlastiti `index.html`, uz `sitemap.xml`,
   `robots.txt`, `404.html` i `en/404.html`).
2. Domenu upisati u `SITE_URL` (`src/data/company.js`) prije izgradnje — iz nje se grade canonical, hreflang,
   Open Graph i sitemap. Trenutačno: `https://www.velikiodmor.hr` [potvrditi].
3. Sadržaj `dist/` prenijeti na poslužitelj (npr. isti Contabo VPS kao terrapomalo.hr) i u nginx dodati:

```nginx
server {
    server_name www.velikiodmor.hr;
    root /var/www/velikiodmor/dist;
    location / { try_files $uri $uri/ =404; }
    location /en/ { try_files $uri $uri/ =404; error_page 404 /en/404.html; }
    error_page 404 /404.html;
    location /assets/ { expires 1y; add_header Cache-Control "public, immutable"; }
    location /images/ { expires 30d; }
}
```

4. Obrasci: dok je `FORM_ENDPOINT` prazan, obrazac otvara pripremljenu poruku u programu za e-poštu (adrese iz
   `EMAILS`). Za izravno slanje može se koristiti isti mailer kao na terrapomalo.hr (`server/mailer.py` u tom
   repozitoriju) i upisati njegovu adresu u `FORM_ENDPOINT`.
5. Nakon objave: Google Search Console (dodati domenu, poslati `sitemap.xml`), provjera dijeljenja na
   https://developers.facebook.com/tools/debug/ i https://search.google.com/test/rich-results.
