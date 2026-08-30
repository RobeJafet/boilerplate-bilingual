# ENLACE Boilerplate bilingüe (Next.js + Sanity)

Template monorepo-style for client sites: Next.js App Router, embedded Sanity Studio, live preview, a section-based page builder, and **document-level i18n** (`en` / `es`).

## Stack

- Next.js 16 (App Router)
- Sanity Studio v5 (`/studio`)
- `next-sanity` (Live Content API + Visual Editing)
- Tailwind CSS 4
- pnpm

## Start a new project from this template

### 1. Create the repo (GitHub Template)

This repo is meant to be a **GitHub Template**. Once published:

1. Open the repo on GitHub → **Use this template** → **Create a new repository**
2. Clone your new repo
3. Install and set up:

```bash
pnpm install
pnpm bootstrap
pnpm dev
```

`pnpm bootstrap` will:

- Create a **new Sanity project + dataset**
- Create a **viewer API token** (read-only; enough for Live + draft preview)
- Add **CORS** for your site URL (default `http://localhost:3000`)
- Write `.env.local`
- Seed **localized singleton** documents (`home-es` / `home-en`, `settings-es` / `settings-en`) plus `translation.metadata`

Non-interactive example:

```bash
pnpm bootstrap --name "Cliente X" --org <sanity-org-id> --dataset production
```

Flags: `--name`, `--org`, `--dataset`, `--site-url`, `--force`, `--skip-singletons`.

### 2. This repo is already a GitHub Template

Private template: [RobeJafet/boilerplate-bilingual](https://github.com/RobeJafet/boilerplate-bilingual)

On GitHub: **Use this template** → **Create a new repository**.

## Local development (existing env)

```bash
pnpm install
cp .env.example .env.local   # or use values from pnpm bootstrap
pnpm dev
```

- Site: [http://localhost:3000](http://localhost:3000) → redirects to `/es` or `/en`
- Studio: [http://localhost:3000/studio](http://localhost:3000/studio)

## Environment variables

See [`.env.example`](./.env.example).

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Yes | Sanity project id |
| `NEXT_PUBLIC_SANITY_DATASET` | Yes | Dataset name (usually `production`) |
| `SANITY_API_TOKEN` | Yes | Live preview / draft mode / writes |
| `NEXT_PUBLIC_SITE_URL` | Yes | Canonical site URL (used for Studio stega URL too) |
| `NEXT_PUBLIC_IS_LIVE` | No | `development` → robots noindex; `production` → normal SEO |
| `SANITY_REVALIDATE_SECRET` | For webhooks | Auth for `/api/revalidate/path` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | No | Defaults in `sanity/env.ts` |

## Useful scripts

```bash
pnpm bootstrap                 # new Sanity project + .env.local + singletons
pnpm create:singletons     # seed home / settings per language
pnpm new:section hero      # scaffold a section module
pnpm dev
pnpm build
pnpm lint
```

## Project layout

```
app/
  (frontend)/[lang]   # Public site (/es, /en, /es/slug)
  (cms)/              # Studio + draft/revalidate API routes
config/i18n           # Locales, dictionaries, I18nProvider
config/dictionaries   # UI copy (en.json / es.json)
config/singletons     # Singleton document config (localized)
sanity/               # Schema, client, presentation, structure
sections/             # Page builder sections (registry-driven)
components/           # Shared UI (incl. LangChangeHandler)
proxy.ts              # Locale detection + redirect
scripts/              # setup + new-section scaffolder
```

## i18n

- Locales live in `config/i18n/i18nConfig.ts` (`defaultLocale` is `es`)
- URLs always include the locale: `/es`, `/en/about`
- `proxy.ts` redirects `/` (and any path without a locale) using the `NEXT_LOCALE` cookie or `Accept-Language`
- Sanity uses `@sanity/document-internationalization` (one document per language) plus `sanity-plugin-internationalized-array` for field-level strings when you need them
- Singletons get a document per language (`home-es`, `home-en`) linked by `translation.metadata`
- `LangChangeHandler` switches language and keeps the translated slug when a translation exists
- UI strings that are not CMS content go in `config/dictionaries/{en,es}.json` and are read with `useI18n()`

## Sections

Scaffold a section:

```bash
pnpm new:section hero --usableIn=home,page --title="Hero"
```

This creates `sections/hero/` and registers it in `sections/registry.ts`.

You still need to wire the section into Sanity document schemas (`home` / `page` sections fields) and frontend queries when you close the page-builder loop.

## Singletons

Defined in `config/singletons/singletons.ts`. Seed with:

```bash
pnpm create:singletons
```

Creates `home-es` / `home-en` and `settings-es` / `settings-en` plus a `translation.metadata` document so Studio can link translations. Header links and footer email live as fields on Settings.

## Notes

- Do not commit `.env.local`
- Prefer `pnpm bootstrap` over copying another project's Sanity ids
- Studio title and `package.json` name are updated by `pnpm bootstrap`
