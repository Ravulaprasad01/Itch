---
name: "problem2build_polish"
description: "Build or review Problem2Build frontend UI to the project's design standards: evidence-first screens, crafted motion, and truthful counts. Use when implementing or refining any Problem2Build (Next.js + Tailwind) UI."
---

# Problem2Build UI Polish

## Purpose

Make Problem2Build feel like a designed product, not a vibe-coded app: aesthetic direction set before code, motion that obeys craft rules, and UI that never displays invented data.

## Workflow

1. **Read the brief.** Load the relevant screens from the project spec (`~/workspace/problem-platform-spec/problem-platform-spec/design.md`, `rules.md`, `PRD.md`). The design spec is the source of truth for copy, structure, and interaction semantics.
2. **Set the aesthetic direction first.** Before writing any component, lock: typography scale, color semantics (neutral/positive/warning/danger/accent), spacing (4/8 scale), radius, elevation, and one orchestrated motion language (see `references/motion.md`). One load animation with staggered reveals plus restrained micro-interactions — not animation everywhere.
3. **Build to the craft rules.** Apply `references/craft.md` (optical alignment, concentric radius, shadows, hit areas, feedback states) and `references/motion.md` (easing defaults, enter/exit choreography, interruptible transitions).
4. **Enforce truthful UI.** Apply `references/truthful-ui.md`: every count and outcome comes from real records; loading = skeleton, zero = real zero, failure = honest retry copy.
5. **Self-review.** Run the audit in `references/review.md` (visual → motion → typography → copy/truth). Fix every violation before calling the screen done.

## Output Contract

Every finished screen or component must pass:
- [ ] Aesthetic direction was declared before code (typography, color, motion).
- [ ] Motion audit passes: easing, enter/exit, interruptibility, reduced-motion.
- [ ] Craft audit passes: alignment, radius, elevation, hit areas, feedback.
- [ ] Truthfulness audit passes: no invented counts, fake testimonials, fake funding/reputation, or "Likes" labels.
- [ ] Copy uses the project's preferred vocabulary (Me Too / I Want This / Developers interested / Priority Score).
- [ ] Mobile-first: key actions reachable, no horizontal tables.

## Operating Rules

1. Evidence of demand is visible before complexity. A developer must grasp the opportunity from real data within seconds.
2. Never hard-code example counts or invented metrics in production UI. Prototype notation (`{{me_too_count}}`) maps to live values or skeletons — never sample data.
3. Motion is restrained by default: one orchestrated page-load animation, subtle micro-interactions, instant high-frequency feedback.
4. Do not use color as the only indicator of state; pair it with text or iconography.
5. Follow the spec's mobile priorities: title, Me Too, I Want This, Priority Score, comment action, status — in that order of prominence.
6. When a spec rule and a generic best practice conflict, the project spec (`design.md`, `rules.md`) wins.
