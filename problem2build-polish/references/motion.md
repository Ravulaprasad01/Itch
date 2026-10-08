# Motion Craft for Problem2Build

Principles adapted from emilkowalski/skills and mblode/agent-skills `ui-animation`, tuned to this project (Next.js + Tailwind).

## Easing

- Default all motion to a single ease-out curve: `cubic-bezier(0.16, 1, 0.3, 1)` (or Tailwind arbitrary: `ease-[cubic-bezier(0.16,1,0.3,1)]`).
- Never use `ease-in` for entrances, never use plain `ease-in-out` as a default — entrances should decelerate into place, never accelerate then lurch.
- Springs (if using framer-motion / motion library) beat tweens for interruptible state: stiffness ~300–400, damping ~30 for UI elements. Use springs when the animation may be interrupted (toggles, drags, signal buttons); use tweens for choreographed sequences.

## Durations

- Micro-interactions (button press, toggle, hover): 100–200ms.
- Card enter / list item stagger: 200–350ms, stagger children by 30–60ms.
- Page-load reveal sequence: 400–600ms total, staggered.
- Exits are faster and subtler than entrances: ~150ms fade/scale-down. Never dramatic exit animations on frequent actions.

## Enter / Exit choreography

- Animate from the trigger: new content should originate from where the user acted (e.g. expanding from the Me Too button area, dropdown from its control).
- One orchestrated load animation per page: skeleton → staggered reveal of hero, cards, sidebar. No per-element random delays.
- Cross-fade content swaps (feed tab switches, sort changes) with a 120–160ms fade instead of instant pop or full re-mount animation.

## Interaction rules (apply to Me Too / I Want This / dev-interest buttons)

- Instant visual feedback on press (scale 0.96–0.98, 100ms). Never make the user wait for the server to see a response.
- Use optimistic UI with rollback: show the toggled state immediately; on mutation failure, revert and show the spec's failure copy ("That action didn't complete. Your previous state is unchanged."). Never imply success before server confirmation.
- Counts tick: animate count changes (small upward tick / scale pop, 150ms), don't swap text jarringly.
- Transitions must be interruptible: toggling Me Too twice fast must not leave the button stuck mid-animation.

## Forbidden

- `transition: all` — always name the properties (`transition-[transform,opacity]` etc.).
- Instant pop-in with no motion on any interactive element.
- Hover-only affordances on mobile; press feedback is mandatory.
- Parallax, oversized hero video, or decorative motion that delays content.

## Accessibility

- Honor `prefers-reduced-motion`: replace transitions with instant state changes or simple cross-fades (Tailwind: `motion-safe:` / `motion-reduce:` variants).
- Never communicate state by motion alone — the label change (👍 Me Too → ✓ Me Too) carries the meaning.
