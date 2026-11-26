# Byamshala

Static website built with **Next.js (App Router) + TypeScript + Tailwind CSS v4**.

## Scripts

```bash
npm run dev     # start dev server at http://localhost:3000
npm run build   # static export to /out (deploy that folder anywhere)
npm run lint
```

## Folder structure

```
public/
  images/            # static images (exported from Figma)
  icons/             # SVG icons
src/
  app/               # routes: each folder with page.tsx = a page
    layout.tsx       # root layout (Header + main + Footer)
    page.tsx         # home page
    globals.css      # Tailwind import + design tokens (@theme)
  components/
    ui/              # reusable primitives: Button, Card, Heading, Text, Input...
    layout/          # Header, Footer
    sections/        # page sections built from Figma frames (Hero, Features...)
  constants/         # site config, nav links, static content
  hooks/             # custom React hooks
  lib/utils.ts       # cn() class-merge helper
  types/             # shared TypeScript types
```

## Conventions

- Design tokens (colors, fonts, radius) live in `src/app/globals.css` under `@theme`
  and become Tailwind classes (`bg-primary`, `rounded-card`, ...). Update them from Figma.
- Import UI primitives from `@/components/ui`.
- Static export: no API routes, server actions, or request-time data.

## SEO & launch checklist

Built in: page metadata + Open Graph/Twitter card (`src/app/layout.tsx`), `ExerciseGym`
structured data, `sitemap.xml`, `robots.txt`, `manifest.webmanifest`, brand favicon /
app icons, share image (`public/images/og-cover.jpg`) and a branded 404 page
(`src/app/not-found.tsx` → `out/404.html`).

**Old URLs.** The previous site (thebyayamshala.com.np) had `/about`, `/classes`,
`/membership` and `/contact`. They now exist as tiny forwarding pages to the matching
home-page section, so links and Google rankings carry over on any static host. If the
host supports server redirects, add permanent (301) redirects as well — they pass
ranking more reliably:

| From | To |
|---|---|
| `/about` | `/#about` |
| `/classes` | `/#programs` |
| `/membership` | `/#pricing` |
| `/contact` | `/#contact` |

- **Vercel** (`vercel.json`): `{ "redirects": [{ "source": "/about", "destination": "/#about", "permanent": true }, ...] }`
- **Netlify / Cloudflare Pages** (`public/_redirects`): `/about  /#about  301`
- **Nginx**: `location = /about { return 301 /#about; }` and `error_page 404 /404.html;`
- **Apache** (`.htaccess`): `Redirect 301 /about /#about` and `ErrorDocument 404 /404.html`

**After launch:** submit `https://www.thebyayamshala.com.np/sitemap.xml` in Google Search
Console, and check the Google Business Profile links to the same domain.
