# Craft Rules for Problem2Build UI

Adapted from jakubkrehel/skills `better-ui` and the project's design spec §14–§17.

## Layout & spacing

- 4/8-based spacing scale everywhere. No magic numbers.
- Mobile-first. Key action order on small screens: title → Me Too → I Want This → Priority Score → comment → status.

## Typography (design spec §14)

- One clean sans-serif (system stack or a single web font), never mixed.
- H1: product statement. H2: section. H3: card/detail title. Body: 16px. Metadata (counts, timestamps): 13–14px.
- Counts use tabular numerals (`tabular-nums`) so animated count ticks don't reflow layout.

## Radius & elevation

- Moderate radius on cards and controls. Avoid the "pill everything" look — pills are reserved for status labels and signal buttons only.
- **Concentric radius:** nested elements' radii must relate (inner radius ≈ outer radius − padding). A card at `rounded-xl` shouldn't contain a box at `rounded-xl`.
- Subtle separation, not heavy shadows. One shadow token for cards, one for popovers. Shadows deepen only on hover/lift — sparingly.

## Optical alignment

- Optically (not mathematically) align: icons with text baselines, emoji/label pairs, badge text. Emoji-prefixed labels sit 1px high by default — compensate.
- Hit areas ≥ 44px for all signal buttons and nav controls, even if the visual is smaller (use padding, not transform scale).

## Press / hover feel

- Buttons: hover lifts subtly (brightness or 1–2px shadow), active compresses (scale 0.97). Cursor states must match clickability — no pointer cursor on disabled controls.
- Signal buttons (Me Too / I Want This) are the most-touched elements on the platform: give them the best feedback states, not the least.
- Disabled states use reduced opacity + `cursor-not-allowed`, never just grey text on a still-clickable-looking button.

## Status labels (design spec §13)

- Canonical labels: OPEN, VALIDATING, ARCHIVED, CANCELLED (V1). Later states (CHALLENGE OPEN → SOLVED) must not appear until those phases exist.
- Status is never color-only: label text always present; pair semantic color with the word.

## Screen-reader & keyboard

- Keyboard navigable, visible focus states, semantic headings, accessible labels on all icon buttons.
- Counts read as "12 people facing this problem", not "👥12". Error messages sit next to the field that caused them.
