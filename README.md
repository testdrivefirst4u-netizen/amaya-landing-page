# Amaya — Senior Living by Vera Vita

Marketing site for Amaya, Medchal (Hyderabad). Built to the **Amaya Brand
Guidelines v3**: Deep Navy / Warm Limestone / Antique Brass palette,
Cormorant Garamond display + Jost body, 1.2px-stroke icon language, square
buttons, calm editorial motion. Fully responsive (breakpoints: 1080 / 820 /
560px).

## Quick start

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm start       # serve the production build
```

Deploys on Vercel with zero config (framework auto-detected).

## Stack

| Layer      | Choice                                             |
| ---------- | -------------------------------------------------- |
| Framework  | Next.js (App Router), TypeScript, static prerender |
| Animation  | GSAP + ScrollTrigger, Lenis smooth scroll          |
| Fonts      | @fontsource (self-hosted Cormorant Garamond, Jost) |
| Styling    | Plain CSS: design tokens + section styles          |

No Tailwind, no CSS-in-JS: everything visual lives in two readable CSS files.

## Project structure

```
app/
  layout.tsx        Fonts, metadata, global CSS imports
  page.tsx          Section order for the single page
  globals.css       DESIGN SYSTEM: color/type/spacing tokens, buttons,
                    reveal-animation initial states
  sections.css      Per-section styles, in page order, + responsive rules
components/
  Animations.tsx    ALL motion lives here (Lenis + GSAP orchestrator)
  Nav.tsx           Fixed nav: transparent over hero, solid on scroll; mobile overlay
  Hero.tsx          Video hero + headline reveal + meta strip
  WhyAmaya.tsx      Section 01: intro, image, four pillars
  ProjectStats.tsx  Section 02: navy band, animated counters
  LifeAtAmaya.tsx   Section 03: day columns + Club Amaya strip
  Residences.tsx    Section 04: interactive unit selector (client state)
  Location.tsx      Section 05: distance bars
  Founders.tsx      Section 06: image, note in two landscape columns
  Faq.tsx           Section 07: accordion (client state)
  VisitCta.tsx      Closing full-bleed CTA
  Footer.tsx        Charcoal footer + RERA small print
  Icons.tsx         Brand icon set (1.2px stroke, from guidelines)
lib/
  assets.ts         Image/video URLs + phone number — single source of truth
```

## How the animation system works

Section components are plain (mostly server) JSX. They opt into motion with
data attributes; `Animations.tsx` finds them once on mount:

- `data-reveal`            fade + rise on scroll (optional `data-delay="0.2"`)
- `data-reveal-line`       masked line-by-line headline reveal (`.line-mask` / `.line-inner`)
- `data-reveal-scale`      image settle-in
- `data-draw`              hairline draws in from the left
- `data-count="65"`        number counts up (`data-decimals` optional)
- `data-parallax`          slow parallax inside a `.frame` wrapper
- `data-hero*`             hero-only on-load timeline

`prefers-reduced-motion` disables everything (CSS fallbacks make all content
visible with no JS motion).

## Things the team will likely touch first

1. **Imagery** — currently hotlinked from the existing Vercel deployments.
   Swap the URLs in `lib/assets.ts` for `/public` assets or a CDN before
   production. The founders photo should be replaced with the studio
   portrait of the three founders.
2. **Copy & data** — unit prices/sizes in `Residences.tsx`, distances in
   `Location.tsx`, stats in `ProjectStats.tsx`, FAQs in `Faq.tsx`.
3. **Brand tokens** — all colors/type/spacing are CSS variables at the top
   of `app/globals.css`.
4. **RERA line** — placeholder in `Footer.tsx`; update when registration
   completes.

## Conventions

- Copy style: short, calm declaratives. No em dashes anywhere (use "·" or "to").
- Colors only via CSS variables; never hard-code hex in components.
- Icons only from `Icons.tsx` (one family, 1.2px stroke, round caps).
- Buttons are square (`border-radius: 0`) per the brand component spec.
