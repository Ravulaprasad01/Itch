---
name: Itch Studio System
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1b1b1b'
  surface-container: '#1f1f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353535'
  on-surface: '#e2e2e2'
  on-surface-variant: '#e0c0b1'
  inverse-surface: '#e2e2e2'
  inverse-on-surface: '#303030'
  outline: '#a78b7d'
  outline-variant: '#584237'
  surface-tint: '#ffb690'
  primary: '#ffb690'
  on-primary: '#552100'
  primary-container: '#f97316'
  on-primary-container: '#582200'
  inverse-primary: '#9d4300'
  secondary: '#4edea3'
  on-secondary: '#003824'
  secondary-container: '#00a572'
  on-secondary-container: '#00311f'
  tertiary: '#b7c8e1'
  on-tertiary: '#213145'
  tertiary-container: '#8c9cb4'
  on-tertiary-container: '#243348'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdbca'
  primary-fixed-dim: '#ffb690'
  on-primary-fixed: '#341100'
  on-primary-fixed-variant: '#783200'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#d3e4fe'
  tertiary-fixed-dim: '#b7c8e1'
  on-tertiary-fixed: '#0b1c30'
  on-tertiary-fixed-variant: '#38485d'
  background: '#131313'
  on-background: '#e2e2e2'
  surface-variant: '#353535'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 3.5rem
    fontWeight: '700'
    lineHeight: 4.25rem
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 2.25rem
    fontWeight: '700'
    lineHeight: 2.75rem
    letterSpacing: -0.02em
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 2.25rem
    fontWeight: '600'
    lineHeight: 2.75rem
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.75rem
    fontWeight: '600'
    lineHeight: 2.25rem
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.5rem
    fontWeight: '600'
    lineHeight: 2rem
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.25rem
    fontWeight: '600'
    lineHeight: 1.75rem
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.125rem
    fontWeight: '400'
    lineHeight: 1.75rem
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.9375rem
    fontWeight: '400'
    lineHeight: 1.5rem
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.8125rem
    fontWeight: '400'
    lineHeight: 1.25rem
  metric-xl:
    fontFamily: JetBrains Mono
    fontSize: 2rem
    fontWeight: '600'
    lineHeight: 2.5rem
    letterSpacing: -0.02em
  metric-md:
    fontFamily: JetBrains Mono
    fontSize: 1.125rem
    fontWeight: '500'
    lineHeight: 1.5rem
  label-code:
    fontFamily: JetBrains Mono
    fontSize: 0.75rem
    fontWeight: '500'
    lineHeight: 1rem
    letterSpacing: 0.02em
  label-ui:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.75rem
    fontWeight: '600'
    lineHeight: 1rem
    letterSpacing: 0.025em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system drives a peer-to-peer problem validation and developer discovery ecosystem. The core philosophy bridges raw developer pragmatism with the polished warmth of a collaborative community platform. 

The aesthetic operates on **Refined Technical Precision**:
- **Character:** Sharp, utilitarian, trustworthy, and energizing without slipping into chaotic startup tropes.
- **Tone:** Methodical, signal-dense, clear, and direct.
- **Visual Stance:** Subtle structural lines, layered pitch-black surfaces, crisp typography pairing, and deliberate bursts of electric warm accents representing active friction—the "itch" that prompts an engineering solution.
- **Target Audience:** Engineers, technical founders, and product tinkerers seeking high-conviction problems to build.

Interface surfaces remain quiet, allowing status markers, priority scores, and code-aligned telemetry to provide focal hierarchy.

## Colors

The system uses an intentional dark-first baseline built around deep pitch-black neutrals, accented by an energetic spark and utilitarian status states:

- **Primary (`#F97316`):** The Spark / "Itch". Applied exclusively to key calls to action, high-urgency badges, and active problem anchors.
- **Secondary (`#10B981`):** Validation & Resolution. Applied to confirmed traction, successful validation stages, healthy activity states, and positive score indicators.
- **Tertiary (`#64748B`):** Developer Context. Applied to technology tags, technical metadata, secondary borders, and muted supporting elements.
- **Neutral Palette (`#000000` Canvas to `#334155` Borders):** A multi-tier dark foundation engineered for absolute dark mode contrast, preventing eye fatigue while preserving absolute WCAG AA compliance (4.5:1 min for text, 3:1 for graphical UI objects).

### Neutral Token Mapping
- **Canvas Base:** `#000000`
- **Surface Layer 1 (Cards, Menus):** `#090D16`
- **Surface Layer 2 (Raised Modals, Active Rows):** `#1E293B`
- **Border Default:** `#1E293B`
- **Border Subtle:** `#334155`
- **Text Primary:** `#F8FAFC`
- **Text Muted:** `#94A3B8`
- **Text Subtle:** `#64748B`

## Typography

Typography pairs geometric clarity with strict monospaced utility:

- **Primary Sans (`Plus Jakarta Sans`):** Selected for structural readability and contemporary warmth. Headlines leverage tight tracking to convey decisiveness, while body copy retains comfortable heights to handle lengthy problem specs and user validation write-ups.
- **Technical Monospace (`JetBrains Mono`):** Reserved for quantitative and programmatic feedback. This includes the 0–100 Priority Score, commit-like activity feeds, developer tag metadata, timestamp values, and inline problem identifiers (e.g., `#ITC-402`).

Always render metrics, counters, and status pill values in tabular numerical alignments via monospace styling.

## Layout & Spacing

The layout model uses an adaptable 12-column grid balanced by an 8pt architectural rhythm:

- **Desktop (>= 1024px):** 12-column fluid grid within a 1280px maximum container. Gutters are fixed at `1.5rem`, outer margin at `2rem`.
- **Tablet (768px – 1023px):** 8-column layout with 24px gutters and 24px margins. Sidebar panels collapse into an off-canvas drawer or top filter bar.
- **Mobile (< 768px):** 4-column layout with 16px gutters and 16px safe canvas margin. Multi-column cards stack vertically; data bars simplify into single-metric chips.

Internal density is driven strictly by whitespace tokens. Problem lists favor compact predictability (`space-sm` to `space-md`), while problem detail reads rely on generous breathing room (`space-lg` to `space-xl`) to encourage deeper technical evaluation.

## Elevation & Depth

Visual depth is achieved through **Tonal Tiers and Low-Contrast Technical Borders**, bypassing heavy skeuomorphic shadows to keep the workspace clean and performance-oriented:

- **Ground (Level 0):** Canvas base `#000000`. Flat and dark.
- **Surface (Level 1):** `#090D16` paired with a 1px structural outline: `border-slate-800` (`#1E293B`).
- **Overlay & Hover (Level 2):** `#1E293B` paired with an elevated hairline outline: `border-slate-700` (`#334155`).
- **Ambient Focus Glow:** Reserved for active input states or selected problem cards. Utilizes a low-alpha ambient halo: `0 0 0 1px #F97316, 0 8px 24px -4px rgba(249, 115, 22, 0.12)`.
- **Modals & Drawers:** High surface depth with an extra-diffused backdrop blur (`backdrop-blur-md`) combined with `rgba(0, 0, 0, 0.8)`.

## Shapes

The geometric system utilizes a balanced medium curvature (`roundedness: 2`), reflecting clean software craftsmanship:

- **Cards, Panels, & Form Blocks:** Standard radius of `0.5rem` (`8px`) maintains a structured, dashboard-like profile.
- **Dropdowns & Popovers:** `0.5rem` (`8px`) for compact consistency.
- **Status Badges & Pill Chips:** Full pill radius (`9999px`) to immediately distinguish ephemeral status, categorical tags, and priority labels from structural rectangular cards.
- **Buttons:** `0.5rem` (`8px`) to match structural inputs.

## Components

### Buttons
- **Primary ("Scratch Itch" / Action):** Solid `#F97316` background with bold `#FFFFFF` text. Subtle hover brightness (`#FB923C`) and active press scaling (`transform: scale(0.98)`).
- **Secondary (Validate / Join):** Surface background `#090D16` with a crisp 1px border `#334155`. Text is `#F8FAFC`. On hover: surface transitions to `#1E293B`.
- **Ghost:** No background or border. Text `#94A3B8`, transitioning to `#F8FAFC` on hover.

### Badges & Status Pills
All badges use the pill shape (`rounded-full`), monospace label font (`label-code`), and subtle alpha backgrounds paired with high-contrast text:
- **Urgency - High:** `#F97316` border/text at 100% opacity with `rgba(249, 115, 22, 0.1)` fill.
- **Urgency - Med:** `#F59E0B` border/text with `rgba(245, 158, 11, 0.1)` fill.
- **Urgency - Low:** `#64748B` border/text with `rgba(100, 116, 139, 0.1)` fill.
- **Status - Validating:** Emerald green (`#10B981`) text and border with pulsating dot indicator.
- **Status - Developers Interested:** Slate cyan (`#38BDF8`) accent.

### Priority Score Meter (Specialty Component)
A high-density widget displaying community demand:
- **Presentation:** A circular or inline monospace metric (`metric-md`) scoring from `0` to `100`.
- **Tokens:** Low scores (<40) use `#64748B`, moderate scores (40–74) use `#F59E0B`, high-impact scores (75–100) use `#F97316` accompanied by an electric subtle glow.

### Cards (Problem Spec Cards)
- **Base:** Background `#090D16`, 1px border `#1E293B`, internal padding `space-lg`.
- **Interactive State:** Hover elevates border color to `#334155` and adds a subtle amber accent line along the top border (`2px solid #F97316`).

### Input Fields
- **Container:** Background `#000000`, border 1px `#1E293B`, rounded `0.5rem`.
- **Text:** `#F8FAFC` placeholder `#64748B`.
- **Focus:** Border transitions to `#F97316` with zero default outline, replaced by a 1px ring matching the amber token.

### Developer Tech Tags
- **Style:** Compact pill chips featuring `#1E293B` background, borderless, text `#94A3B8`, prepended with a monospaced hash or tech indicator (e.g., `ts`, `py`, `rust`).