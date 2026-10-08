# Review Format for Problem2Build UI

Run this audit after building or changing any screen. Scan in order: visual → motion → typography → copy/truth. Report each violation as Before / After / Why.

## Format

```text
[AREA] Component — issue
Before: what the current UI does
After: what to change it to
Why: one sentence tying the fix to the project's design principles
```

## Checklist

**Visual / craft**
- [ ] Spacing on the 4/8 scale; no magic numbers
- [ ] Concentric border radius on nested elements
- [ ] Shadows subtle and consistent (one card token, one popover token)
- [ ] Icons optically aligned with adjacent text
- [ ] Hit areas ≥ 44px on signal buttons and nav
- [ ] No "pill everything"; pills only for status labels and signal buttons
- [ ] Status labels pair text with color (never color-only)

**Motion**
- [ ] One declared easing curve (`cubic-bezier(0.16, 1, 0.3, 1)`); no default `ease-in` entrances
- [ ] One orchestrated page-load reveal (staggered), not scattered animations
- [ ] Exits faster and subtler than entrances (~150ms)
- [ ] `transition: all` absent; properties named explicitly
- [ ] Signal buttons: instant press feedback + optimistic UI with honest rollback
- [ ] Count changes tick smoothly, don't swap jarringly
- [ ] Interruptible transitions; rapid toggles can't strand the UI mid-animation
- [ ] `prefers-reduced-motion` honored (`motion-reduce:` fallbacks)

**Typography**
- [ ] One sans family; H1/H2/H3/body/metadata hierarchy respected
- [ ] Counts in `tabular-nums`
- [ ] Body 16px, metadata 13–14px

**Copy / truth**
- [ ] All counts from real records; zero shown as zero
- [ ] Loading = skeleton; error = honest retry copy; failure never implies success
- [ ] Vocabulary matches the spec (Me Too / I Want This / Developers interested / Priority Score)
- [ ] No fake metrics, testimonials, funding, or reputation
- [ ] No nav items for unbuilt features (Projects, Funding, Reputation)
- [ ] Empty states use the spec's exact microcopy, no decorative sample cards

**Mobile**
- [ ] Action order: title → Me Too → I Want This → Priority Score → comment → status
- [ ] No horizontal tables; cards stack cleanly
