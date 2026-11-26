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
