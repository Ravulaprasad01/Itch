# Truthful UI Rules for Problem2Build

From design spec §15, §18–§20 and rules.md §15. This is the skill's non-negotiable layer — the thing that most separates this product from a vibe-coded demo.

## Golden rule

**Every displayed count and outcome comes from real records.** No invented examples as production facts.

## Specific rules

1. Use live database values. Prototype notation like `{{me_too_count}}` binds to the query result or a skeleton — never to sample data.
2. Loading states: skeleton cards and disabled controls. No spinners that hide layout shift; no flash of unstyled content.
3. Zero is real: show `0 Me Too` / `0 I Want This`. Never hide zero behind sample values.
4. Errors are honest and local:
   - Load failure: "We couldn't load this problem. Try again."
   - Mutation failure: "That action didn't complete. Your previous state is unchanged."
   - Never imply success before the server confirms it.
5. Do not display: fake ratings, fake "top developer" labels, fake funding totals, fake adoption numbers, fake testimonials, reputation scores (deferred to later phases).
6. Do not show Projects, Funding, or Reputation nav items until those features exist.

## Copy vocabulary (design spec §22)

**Prefer:** "People facing this problem", "Me Too", "I Want This", "Developers interested", "Priority Score", "Fund Faster — optional", "Being Built", "Live Solution".

**Avoid:** "Likes" as a validation metric, "Pay to unlock a solution", "Guaranteed solution", "Winner by votes alone", any reputation rating before real reputation exists.

## Signal semantics (design.md §6–§7, rules.md §3)

- **Me Too** = "I personally experience this problem." Toggle → ✓ Me Too. Microcopy: "You're counted as someone who faces this problem."
- **I Want This** = "I would use a useful solution." Toggle → ✓ I Want This. Microcopy: "You're saying you would use a useful solution to this problem."
- **Developer Interest** = "I would consider building this." Button: "I'm Interested in Building This." Microcopy: "This is interest, not a contract or a claim."
- Me Too and I Want This must be visually distinct from each other — they are different promises.

## Empty states (design spec §18)

- No problems: "No problems yet. Be the first to describe something you wish could be solved." CTA: Post a Problem.
- No search results: "No matching problems yet. Try another keyword or browse all problems."
- No developer activity: "No developers have expressed interest yet. Clear problem evidence can help the right builder notice it."
- Never fill empty states with decorative sample cards that could be mistaken for real content.
