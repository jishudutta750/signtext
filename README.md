# SignText — landing page

Static, dependency-free landing page for SignText. Plain HTML, CSS and a small vanilla JS file, so there is no build step.

## Structure

```
index.html              The page
404.html                Branded not-found page
assets/css/styles.css   Brand tokens + responsive layout (breakpoints at 1080px and 720px)
assets/js/main.js       Mobile menu, demo mode tabs, early-access form, scroll reveal
assets/img/             Responsive WebP images (two sizes each, served via srcset)
favicon.svg, apple-touch-icon.png, og-image.jpg
robots.txt, sitemap.xml
vercel.json             Caching + security headers, clean URLs
```

## Deploy to Vercel

**Option A — GitHub (recommended):** push this folder to a GitHub repo, then in Vercel choose *Add New → Project*, import the repo, set **Framework Preset: Other**, leave the build command empty and the output directory as the root. Deploy.

**Option B — CLI:** from this folder run

```
npx vercel        # preview deploy
npx vercel --prod # production
```

## Before going live

1. **Domain:** the canonical URL, Open Graph image URL, sitemap and robots file assume `https://signtext.ai`. Search for `signtext.ai` and replace it if your domain is different.
2. **Early-access form:** it currently shows a success message without storing anything. To collect sign-ups, set `data-endpoint` on `<form id="join-form">` in `index.html` to any endpoint that accepts a JSON `POST` of `{ "email": "...", "role": "..." }` (for example a Formspree form URL, or a Vercel serverless function).
3. **Links:** replace the `#` social links in the footer, the Privacy/Terms links, and `hello@signtext.ai` with real addresses.
4. **Images:** photos come from the brand doc. Replace files in `assets/img/` with final shoots at the same names and sizes when you have them.

## Editing

- Brand colours live as CSS variables at the top of `styles.css` (`--forest`, `--cream`, `--moss`, `--lime`, …).
- `assets/css` and `assets/js` are served with revalidation, so changes show up on the next deploy. Images are cached for a year: if you replace an image, give it a new file name.
