# CLAUDE.md — AI Assistant Guide for brainsparker.github.io

## Project Overview

Personal portfolio site for Brian Sparker, a product leader working in AI and
search. Fully static, single page, deployed via GitHub Pages at **sparker.co**.

**Key facts:**
- No build tools, no package manager, no dependencies
- **The entire site is one file: `index.html`** — markup, CSS, and JS all inline
- Deployed automatically by GitHub Pages on every push to `main`
- Custom domain configured via `CNAME` (`sparker.co`)

---

## Repository Structure

```
brainsparker.github.io/
├── index.html        # The whole site: markup + inline <style> + inline <script>
├── images/           # Screenshots (.png) and portrait, each with a .webp twin
├── assets/og.png     # Open Graph share image
├── favorite-blue/    # Standalone archived page (own styles, not part of the main page)
├── CNAME             # GitHub Pages custom domain → sparker.co
├── llms.txt          # Machine-readable summary for LLM crawlers
├── robots.txt        # Crawl permissions
├── sitemap.xml       # XML sitemap
└── .vscode/          # Chrome debug config (localhost:8080)
```

There is no `src/`, `dist/`, `build/`, or `node_modules/`. There is no
`styles.css` or `script.js` — those were removed when the site was consolidated
into `index.html`. Do not reintroduce them; the page is small enough that a
single file is simpler and saves two round trips.

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Markup | HTML5 (semantic elements) |
| Styling | CSS3 in a single inline `<style>` block (custom properties, grid, flexbox) |
| Scripting | ~20 lines of vanilla ES6 in an inline `<script>` at end of `<body>` |
| Analytics | Google Analytics 4 (`G-8MTXRGPF2B`) + Google Ads conversion pixel |
| SEO | JSON-LD (`WebSite`, `ProfilePage`, `Person`), Open Graph, Twitter Cards |
| Hosting | GitHub Pages |

---

## Development Workflow

No build step. Serve the directory with any static file server:

```bash
python3 -m http.server 8080     # then open http://localhost:8080
```

`.vscode/launch.json` launches Chrome against `http://localhost:8080`.

Push to `main` and GitHub Pages publishes. No CI, no build.

---

## Design Principles

The site was deliberately refactored down to its simplest form. Preserve that
when making changes — the bar for adding anything is high.

- **One typeface.** Helvetica (`"Helvetica Neue", Helvetica, Arial, sans-serif`)
  for everything, set once in `--font`. No serif, no monospace, no webfonts, no
  network font requests. Hierarchy comes from size, weight, and letter-spacing.
- **One accent color.** Orange `--signal` (`#ee4c2f`), used sparingly: the
  wordmark dot, the period in the hero, result numbers, hover states, focus
  rings. Everything else is ink on paper.
- **Black on white.** `--paper` is `#ffffff` and `--ink` is `#000000`. The page
  is white end to end — no tinted bands, no alternating section backgrounds.
- **Six color variables total.** `--paper`, `--ink`, `--muted`, `--signal`,
  `--signal-deep`, `--line`. Do not add a seventh without a real reason.
  `--signal-deep` exists only because `--signal` at 11px does not meet AA
  contrast; use it whenever small text sits on the accent color.
- **Flat surfaces.** No shadows, gradients, blur, glassmorphism, or inverted
  color bands. Hairline rules (`--line`) do the separating.
- **Character comes from the writing**, not from effects. The copy is plain,
  warm, and a little wry ("Got a messy problem? Let's talk."). Keep that voice.
- **One motion effect.** A fade-and-rise on scroll via `.reveal`. That is the
  whole animation budget.

---

## Code Conventions

### CSS

The inline stylesheet runs in this order: `:root` variables → base/reset →
shared type scale → header → sections → per-section styles (work, projects,
about) → footer → reveal → media queries → `prefers-reduced-motion`.

- Element selectors are preferred over classes where the element is unambiguous
  (`section`, `h2`, `.projects b`). Classes are lowercase and hyphenated. No
  BEM, no utility classes.
- Breakpoints are `900px` and `640px` only. Page width is one variable,
  `--page`, redefined per breakpoint.
- Any new animation needs a `prefers-reduced-motion: reduce` override.

### JavaScript

The script is intentionally tiny and does exactly three things: sets the
copyright year, runs the `.reveal` IntersectionObserver, and fires `gtag`
click events. It runs at the end of `<body>` — there is no `load` handler,
no module system, and no libraries.

- **Always feature-detect gtag**, since ad blockers remove it:
  ```javascript
  if (typeof gtag === 'undefined') return;
  ```
- Use IntersectionObserver for scroll-triggered effects, never a scroll
  listener. If a scroll listener ever becomes necessary, throttle it with
  `requestAnimationFrame`.

---

## Content Guidelines

### Selected work (`#work`)

Three case studies: You.com, Crate & Barrel, G2. Each is an `<article class="case">`
with a `.label` eyebrow, an `<h3>`, one paragraph of context, and a `.result`
whose `<strong>` holds the headline number.

To add one: copy an existing `.case` block, add the screenshot to `images/` as
both `.png` and `.webp`, and set explicit `width`/`height` on the `<img>` to
prevent layout shift. Keep the section at three — it is "selected" work.

### Side projects (`#projects`)

A `<ul class="projects">` of rows; each row is `<b>` name, `<span>` description,
`<i>` arrow. Add a `<li>` to the list — nothing else is required.

External links always carry `target="_blank" rel="noopener noreferrer"`.

### Keeping metadata in sync

When professional info or content changes, update in the same commit:
- the JSON-LD `Person` block and `dateModified` in `index.html`
- `llms.txt`
- `sitemap.xml` `lastmod`

---

## Accessibility

Targets WCAG 2.1 AA.

- All interactive elements are real links — keyboard navigation works for free.
  Keep it that way rather than adding click handlers to `<div>`s.
- Decorative glyphs (`●`, `↗`, the hero period) need `aria-hidden="true"`.
- Images need descriptive `alt` text.
- Focus rings are visible via `a:focus-visible`. Do not remove the outline.
- Color contrast must meet AA minimums. `--signal` (`#ee4c2f`) is only 3.68:1
  against white, so it may be used for **large text only** (≥24px, or ≥18.7px
  bold) — result numbers, the footer `<em>`, project names on hover. For small
  text, hover with an underline rather than a color change.

---

## What Not to Do

- **Do not split `index.html`** back into separate CSS/JS files
- **Do not add a build system** (webpack, Vite, etc.) — zero dependencies is the point
- **Do not add npm/package.json** unless specifically requested
- **Do not add CSS frameworks** (Bootstrap, Tailwind) or JS frameworks (React, Vue)
- **Do not add webfonts** — Helvetica is a deliberate choice, and it is already installed
- **Do not add shadows, gradients, or blur effects** — see Design Principles
- **Do not commit `.DS_Store`** or other OS metadata (see `.gitignore`)
- **Do not modify `CNAME`** unless intentionally changing the domain
