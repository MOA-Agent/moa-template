---
name: moa-design
description: Use this skill to generate well-branded interfaces and assets for MOA, either for production or throwaway prototypes/mocks. Contains the MOA color tokens, Pretendard type scale, spacing/radius/shadow systems, the symbol & app logo, and recreations of chip/tag/tooltip/loading components.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.

Files of interest:

- `README.md` — brand context, content fundamentals, visual foundations, iconography policy.
- `colors_and_type.css` — all tokens (color, type, radius, spacing, shadow) as CSS variables + utility classes (`t-display1`, `t-body1`, …).
- `assets/` — MOA logos and brand assets.
- `component-references/` — single-purpose HTML cards demonstrating each foundation and component, useful as references when building anything new.

Quick reference for visual decisions:

- Primary blue is `#3885FF`. Always use the tokens (`var(--alias-color-primary-normal)` etc).
- Body text default is **Medium weight**, not Regular. Pretendard is the only typeface.
- 4px base spacing scale. Radii on a 4-step ladder. Three shadow levels only.
- No emoji. No gradients. No backdrop-filter blur. Borders are flat 1px. Hover = darken one step (no opacity).
- Tone of voice: formal-polite Korean (`-합니다`/`-입니다`), or calm declarative English when localized. Never marketing-hype copy.

If creating visual artifacts (slides, mocks, throwaway prototypes), copy assets out of `assets/` and reference `colors_and_type.css` directly with `<link rel="stylesheet" href="…/colors_and_type.css">`. Build with semantic CSS variables (`var(--alias-color-label-normal)`) not raw hex values.

If working on production code, copy assets in and lift the token names (`alias.color.primary.normal`, `alias.style.shadow.strong`, etc) — they match the Figma source naming.

If the user invokes this skill without any other guidance, ask them what they want to build — ask 3–5 brief questions about audience and surface, then act as an expert MOA designer who outputs HTML artifacts or production code as needed.
