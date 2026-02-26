# CLAUDE.md — AI Assistant Guide for brainsparker.github.io

## Project Overview

This is a **personal portfolio website** for Brian Sparker, a product leader and entrepreneur. It is a fully static, single-page site deployed via GitHub Pages at **sparker.co**. The site showcases professional experience, portfolio work, and contact/social links.

**Key facts:**
- No build tools, no package manager, no dependencies
- Vanilla HTML/CSS/JS only
- Deployed automatically by GitHub Pages on every push to `main`/`master`
- Custom domain configured via `CNAME` file (`sparker.co`)

---

## Repository Structure

```
brainsparker.github.io/
├── index.html        # Entire site markup (237 lines)
├── script.js         # All interactivity (396 lines)
├── styles.css        # All styling and animations (946 lines)
├── images/           # Work portfolio screenshots (PNG)
│   ├── crateandbarrel-screenshot.png
│   ├── g2-screenshot.png
│   └── youcom-screenshot.png
├── CNAME             # GitHub Pages custom domain → sparker.co
├── robots.txt        # Search engine crawl permissions
├── sitemap.xml       # XML sitemap for SEO
├── README.md         # Minimal project description
└── .vscode/
    └── launch.json   # Chrome debug config (localhost:8080)
```

There is no `src/`, `dist/`, `build/`, `node_modules/`, or any other generated directory. All source files live at the root level.

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Markup | HTML5 (semantic elements) |
| Styling | CSS3 (custom properties, grid, flexbox, keyframes) |
| Scripting | Vanilla ES6+ JavaScript (no frameworks) |
| Analytics | Google Analytics 4 (`G-8MTXRGPF2B`) + Google Ads conversion pixel |
| SEO | JSON-LD structured data (schema.org `Person` type), Open Graph, Twitter Cards |
| Hosting | GitHub Pages |
| Domain | Custom domain via CNAME (`sparker.co`) |

---

## Development Workflow

### Local Development

There is no build step. Serve files directly with any static file server:

```bash
# Using Python (no install required)
python3 -m http.server 8080

# Using Node.js npx
npx serve .

# VS Code Live Server extension also works
```

The `.vscode/launch.json` is configured to launch Chrome against `http://localhost:8080`.

### Making Changes

Edit the three core files directly:
- `index.html` — structure and content
- `styles.css` — all visual styling
- `script.js` — all interactive behavior

### Deployment

Push to `main` (or `master`) and GitHub Pages automatically publishes. No CI/CD pipeline or build step is required.

---

## HTML Conventions

### Page Sections

The single-page layout follows this section order:

1. **`#hero-splash`** — Full-screen landing with animated title and scroll indicator
2. **`#bio`** — Professional bio with tooltip-enhanced descriptors
3. **`#work`** — Portfolio cards with modal lightbox system
4. **`#connect`** — Social/contact links

### Key Patterns

**Data attributes drive interactivity** — avoid hardcoding behavior in JS:
```html
<div class="work-card" data-work-id="chat">
<span class="tooltip-word" data-tooltip="Definition text here">word</span>
```

**Modals use ARIA roles:**
```html
<div id="work-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
```

**External links always have `target="_blank" rel="noopener noreferrer"`** for security.

---

## CSS Conventions

### Structure

The stylesheet is organized in this order:
1. CSS custom properties (`:root` variables)
2. CSS reset / base styles
3. Section-specific styles (hero → bio → work → connect)
4. Modal and overlay styles
5. Animations (`@keyframes`)
6. Responsive breakpoints (`@media`)
7. Accessibility (`prefers-reduced-motion`)

### Key Patterns

- **CSS variables** for all repeated colors and spacing values — add new values to `:root`
- **Mobile-first** with breakpoints at `480px`, `768px`, and `1024px`
- **`backdrop-filter: blur()`** for glassmorphism effects on cards
- **Gradient text** uses `-webkit-background-clip: text` pattern
- **Always include** `prefers-reduced-motion` overrides when adding new animations

### Naming

Classes use lowercase hyphenated names (`work-card`, `modal-overlay`, `hero-title`). No BEM, no utility classes.

---

## JavaScript Conventions

### Architecture

All code runs inside a single `window.addEventListener('load', () => { ... })` handler. There is no module system, no global state object, and no external libraries.

### Key Patterns

**Feature detection before gtag calls:**
```javascript
if (typeof gtag !== 'undefined') {
  gtag('event', 'event_name', { event_label: value });
}
```

**Mobile detection:**
```javascript
const isMobile = () => window.innerWidth <= 768 || 'ontouchstart' in window;
```

**Scroll performance — always use `requestAnimationFrame`:**
```javascript
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => { /* work here */ ticking = false; });
    ticking = true;
  }
});
```

**Intersection Observer for scroll-triggered animations** — do not use scroll listeners for fade-in effects.

**Focus management for modals:**
- Save the triggering element before opening: `triggerElement = document.activeElement`
- Return focus on close: `triggerElement.focus()`
- Trap Tab/Shift-Tab within open modals

### Work Content Data

All work portfolio copy lives in the `workContent` object in `script.js`. To add or edit a work item:
1. Add/update the entry in `workContent` with `title` and `content` (HTML string) keys
2. Add the corresponding card markup in `index.html` with a matching `data-work-id`
3. Add a screenshot to `images/` if needed

---

## Accessibility Requirements

This site targets WCAG 2.1 AA compliance. When making changes:

- **All interactive elements** must be keyboard-navigable (Tab + Enter/Space)
- **Modals** must trap focus while open and restore focus on close
- **Images** must have descriptive `alt` attributes
- **SVG icons** must have `aria-label` or `aria-hidden="true"` (if decorative)
- **Color contrast** must meet AA minimums
- **New animations** must respect `prefers-reduced-motion: reduce`

---

## SEO & Analytics

### Tracking Events

Analytics are tracked via `gtag()` calls in `script.js`. Currently tracked events:

| Event | Trigger |
|-------|---------|
| `work_modal_open` | User opens a work card |
| `tooltip_view` | User views a tooltip |
| Link clicks | External navigation links |

When adding new interactive features, add a corresponding `gtag('event', ...)` call.

### Structured Data

JSON-LD schema is embedded in `index.html` as a `<script type="application/ld+json">` block. Update it when changing professional information (title, employer, skills).

---

## Content Guidelines

### Work Portfolio Items

Current items (in order): AI Search (You.com), Ecommerce Search (Crate & Barrel), Search Marketplace (G2), Open Source Mail Merge (LabelMerge), LLM Evaluation (PromptLens), AI Preferences Standard (you.md).

To add a new work item:
1. Add entry to `workContent` in `script.js`
2. Add `<div class="work-card" data-work-id="...">` in `index.html` inside `#work`
3. Add screenshot to `images/` (PNG format, ~400–700 KB)
4. Update `sitemap.xml` lastmod date if content changed significantly

### Bio & Tooltip Words

Tooltip definitions for highlighted words in the bio section are stored as `data-tooltip` attributes directly in `index.html`. Edit them inline.

---

## What Not to Do

- **Do not add a build system** (webpack, Vite, etc.) without explicit instruction — the entire value of this project is zero dependencies
- **Do not add npm/package.json** unless specifically requested
- **Do not introduce CSS frameworks** (Bootstrap, Tailwind) — all styling is custom
- **Do not add JavaScript frameworks** (React, Vue, etc.) — vanilla JS is intentional
- **Do not commit `.DS_Store`** or other OS metadata files
- **Do not modify `CNAME`** unless intentionally changing the domain
- **Do not hardcode content** in JS that should be in `data-*` attributes or the `workContent` object
