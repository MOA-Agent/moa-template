# MOA Design System

> A web/tablet-focused design system for **MOA**. Korean-first interface system, clean and quietly playful, with a confident blue primary, generous whitespace, and an extensive Pretendard type scale.

This folder contains an HTML/CSS recreation of MOA's tokens, components and brand assets, derived from the Figma file **"MOA Design System_Web"**. It is meant to be used as a context pack so a design agent can produce on-brand artifacts (prototypes, slides, marketing mocks) for MOA.

---

## Content fundamentals

- **Tone** — Informative, calm, declarative. Sentences end in `-합니다` / `-입니다` (formal-polite).
- **Casing** — Section headings use English **Title Case**. Body labels in component frames are lowercase English.
- **No emoji.** Status/affordance is carried by color + iconography, never decoration.
- **Numerals are Latin.** Pixel values appear as `4px`, `16px`, `0.01em` — never localized.
- **No exclamation points, no hype copy.** This is a quiet, technical voice — measured and slightly understated.

---

## Visual foundations

### Color

- **Primary blue is THE accent.** `#3885FF` (`alias-color-primary-normal`) carries brand recognition. Strong/heavy steps `#0062FF` and `#004FCC` are reserved for press/hover.
- **Neutrals do the heavy lifting.** Default text is `--mile-ink-900` (#181A1B), secondary text is `--mile-gray-600` (#474C52), label states are derived as `rgba(71,76,82, α)`.
- **Status palette** — Positive `#00A661`, Cautionary `#FFC933`, Negative `#FF3E3E`. Use only for state feedback.
- **Accent rainbow** — pink / yellow / orange / lime / cyan / skyblue / purple, each with normal and light tint. Use sparingly.
- **Backgrounds are flat.** `#FFFFFF` normal, `#FAFAFA` alternative. No gradients.

### Typography

- **Pretendard** is the single typeface — variable weight, modern Korean-Latin hybrid. Italics are not used.
- Scale runs from **80px Display1** down to **11px Caption2**.
- **Weight rules** — 700 (Bold) for Display/Title/Heading, 600 (SemiBold) for Headline, 500 (Medium) for Body/Label/Caption, 400 (Regular) for long-form body only.
- **Letter-spacing tightens as type gets bigger.** Display: −0.03em → Body/Label: +0.01~0.02em.

### Spacing & layout

- **4px base unit.** Full ladder: 4/8/12/16/20/24/32/40/48/64/80/120.
- 0.5px and 6px exist but are explicitly discouraged.

### Radius

- 4px → 48px ladder, all multiples of 4.
- Common usage: **8** (inputs, small chips), **12** (cards, buttons), **16** (modals), **40px** (capsule chips), **9999px** (avatars).

### Shadow / elevation

Three levels only:
- **Normal** — `0 0 1px rgba(0,0,0,.08), 0 1px 2px rgba(0,0,0,.12)`
- **Strong** — `0 2px 12px rgba(0,0,0,.08)`
- **Heavy** — `0 2px 20px rgba(0,0,0,.08), 0 8px 28px rgba(0,0,0,.10)`

### Interaction

- **Hover** — darken fill by one step. No opacity hovers.
- **Press** — darken one further step.
- **Disabled** — use `alias.label.disabled` and `alias.interaction.disabled`. Do not gray-out with opacity.
- **Transitions** — 120–200ms ease-out for color/opacity, 200–250ms ease for transforms. No spring physics.

### Rules

- No backdrop-filter blur. No gradients (outside App Icon). No colored shadows. Borders are flat 1px.
- No hand-drawn illustration, no patterns, no textures, no noise.

---

## Iconography

- 1.5–2px stroke, rounded caps & joins, square 24px/20px/16px artboards.
- Color is inherited from `currentColor`.
- **Lucide** (`lucide-react`) is used as the icon set — matches the stroke style. Replace with in-house sprite when available.

---

## Files in this package

- `colors_and_type.css` — All tokens (color, type, radius, spacing, shadow) as CSS custom properties + utility classes.
- `index.css` — Package entry point.
- `fonts/PretendardVariable.woff2` — Self-hosted variable font.
- `assets/` — Logos and brand assets.
- `component-references/` — HTML reference implementations of each foundation and component.
- `SKILL.md` — Claude agent skill manifest.

---

## Usage

```bash
npm install @moa-admin/design-system
```

```css
/* In your globals.css */
@import '@moa-admin/design-system/index.css';
```

## Update

```bash
npm update @moa-admin/design-system
```
