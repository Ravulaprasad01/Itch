# Problem → Build Platform — UX / UI Design Specification

**Status:** Revised v1.3  
**Design target:** First four-week MVP (Phases 1–3)  
**Design principle:** Evidence of demand should be visible, truthful, and easy to understand.

---

## 1. Design Philosophy

The product should feel like a combination of:

- a focused problem community;
- a product-discovery feed;
- a real-project discovery tool for developers.

It must **not** feel like:

- a generic social network;
- a traditional freelancer bidding marketplace;
- a pay-to-rank board.

### Core visual principle

**Show evidence of demand before showing complexity.**

A developer should understand the opportunity quickly from real data.

---

## 2. Primary Navigation — V1

Desktop:

```text
[Logo]  Problems  Discover  About        [Post a Problem] [Profile]
```

Mobile:

```text
[Logo]                         [Menu]

Bottom navigation:
Home | Discover | Post | Profile
```

Do not show Projects, Funding, or Reputation navigation items until those features exist.

---

## 3. Homepage

### Hero

Headline:

> **Real problems. Real builders. Real solutions.**

Supporting text:

> Share a problem you face, validate it with people like you, and help developers discover what is worth building.

Primary CTA:

**Post a Problem**

Secondary CTA:

**Find Problems to Build**

### Trending section

Use **real database values** in production.

Prototype notation:

```text
🔥 HIGH PRIORITY

{{problem.title}}

👥 {{me_too_count}} Me Too
❤️ {{want_this_count}} Want This
👨‍💻 {{dev_interest_count}} Developers interested

Priority {{priority_score}}/100

[View Problem]
```

Never ship hard-coded example counts.

---

## 4. Problem Card

Card should communicate:

1. problem statement;
2. demand;
3. frequency/recency context where useful;
4. developer interest;
5. status.

Example structure using live values:

```text
{{category}}
{{problem.title}}
{{problem.short_description}}

👥 {{me_too_count}} Me Too   ❤️ {{want_this_count}} Want This
👨‍💻 {{dev_interest_count}} Builders Interested

Priority {{priority_score}}/100

[View Problem]
```

Do not show fake funding, fake reputation, fake testimonials, or fake user totals.

---

## 5. Problem Detail Page — V1

### Above the fold

```text
← Back

{{category}}

{{problem.title}}

{{problem.description}}

👥 {{me_too_count}} people facing this
❤️ {{want_this_count}} would use a solution
👨‍💻 {{dev_interest_count}} developers interested

Priority Score
{{priority_score}} / 100

[👍 Me Too] [❤️ I Want This]
```

### Sections

**The Problem**  
Full description and audience.

**Current workaround**  
What users do today.

**Frequency**  
Daily / weekly / monthly / rarely.

**Community context**  
Comments and examples.

**Developer signal**  
Aggregate developer-interest count.

**Status**  
Current `problems.status` label.

Funding is not shown in V1 unless an experimental non-binding feature is deliberately enabled and clearly labeled.

---

## 6. Me Too Interaction

Before:

`👍 Me Too`

After:

`✓ Me Too`

Microcopy:

> You’re counted as someone who faces this problem.

Do not use “Like” as the primary validation label.

---

## 7. I Want This Interaction

Before:

`❤️ I Want This`

After:

`✓ I Want This`

Microcopy:

> You’re saying you would use a useful solution to this problem.

This is intentionally different from Me Too:

**Me Too = I experience the problem.**  
**I Want This = I would use the solution.**

---

## 8. Developer Discovery Page — V1

The page should feel like a project opportunity board.

```text
DISCOVER REAL PROBLEMS

Sort: [Highest Priority] [Trending] [Newest]

Filters: Category | Frequency | Location

------------------------------------------------

{{problem.title}}
👥 {{me_too_count}} Me Too
❤️ {{want_this_count}} Want This
👨‍💻 {{dev_interest_count}} Interested
Priority {{priority_score}}/100

[View]
------------------------------------------------
```

Developer interest is the CTA, not proposal submission.

Button:

`[I’m Interested in Building This]`

Microcopy:

> This is interest, not a contract or a claim.

---

## 9. Optional Funding UX — Later Phase

Funding is deliberately omitted from the first-build primary navigation.

When enabled later, the panel must make its optional status prominent:

```text
⚡ Want it solved faster?

Funding is optional.
It signals urgency for this problem.

{{aggregate_amount}}
{{contributor_count}} contributors

[Fund Faster]

You can still support this problem without funding it.
```

Do not use invented example rupee amounts in the production UI.

Before real payment launch, show:

- binding/non-binding status;
- refund/expiry terms;
- what happens to the fund;
- who owns the result.

---

## 10. Proposal UI — Later Phase

When Phase 4 launches:

### Proposal form

1. Approach.
2. Scope.
3. Timeline.
4. Technical plan.
5. Relevant work.
6. Requested amount, if applicable.
7. Submission review.

### Selection display

Use consistent weights:

```text
35% Community Preference
25% Technical Feasibility
15% Timeline
15% Developer Credibility
10% Proposal Completeness
```

Do not show conflicting numbers anywhere else in the product.

Do not show reputation values until reputation data exists.

---

The problem lifecycle is sourced only from `problems.status`. Project records must not introduce a second public lifecycle vocabulary.

## 11. Project Workspace — Later Phase

The public problem lifecycle remains canonical.

Project workspace can show operational progress:

```text
PROJECT
{{problem.title}}

STATUS: ACTIVE

Progress
[dynamic progress bar]

Milestones
[dynamic milestone list]

Latest update
{{latest_real_update}}

[Preview]
```

Do not use project statuses that duplicate `beta`, `live`, or `solved`.

---

## 12. Solution Page — Later Phase

Only show verified/live information:

```text
✅ SOLUTION LIVE

{{solution.name}}

Built to solve:
{{problem.title}}

[Open Live App]

Built by {{developer_username}}

{{verified_real_user_count}} users tested

[Mark as useful] [Report a problem]
```

Do not fabricate adoption numbers.

---

## 13. Status Labels

Canonical public labels:

- `OPEN` — problem is published;
- `VALIDATING` — community evidence is forming;
- `CHALLENGE OPEN` — later, builders can participate;
- `PROPOSAL REVIEW` — later, proposals are being evaluated;
- `SELECTED` — later, a builder has been selected;
- `BEING BUILT` — later, active build;
- `BETA` — later, testable solution;
- `LIVE` — live solution exists;
- `SOLVED` — verified outcome;
- `EXPIRED` — inactive due to time/failed progression; it is part of the canonical problem status enum.
- `ARCHIVED` — intentionally inactive;
- `CANCELLED` — explicitly stopped.

V1 primarily exposes `OPEN`, `VALIDATING`, `ARCHIVED`, and `CANCELLED`.

---

## 14. Design System

### Typography

Use a clean sans-serif system stack or one consistent web font.

Hierarchy:

- H1: product statement;
- H2: section;
- H3: card/detail title;
- body: readable 16px default;
- metadata: 13–14px.

### Spacing

Use a consistent 4/8-based spacing scale.

### Radius

Moderate radius on cards and controls; avoid excessive “pill everything” treatment.

### Elevation

Use subtle separation, not heavy shadows.

---

## 15. Color Semantics

Use semantic meaning consistently:

- neutral = content;
- positive = verified/complete/live;
- warning = attention/urgency;
- danger = reports/errors;
- accent = primary actions.

Do not use color as the only indicator.

---

## 16. Responsive Design

Mobile-first.

### Mobile priorities

- problem title;
- Me Too;
- I Want This;
- Priority Score;
- comment action;
- status.

Avoid horizontal tables on mobile.

---

## 17. Accessibility

- keyboard navigable;
- visible focus states;
- semantic headings;
- accessible labels for icon buttons;
- minimum usable contrast;
- do not communicate state by color only;
- error messages near inputs;
- screen-reader-friendly counts and button states.

---

## 18. Empty States

### No problems

> No problems yet. Be the first to describe something you wish could be solved.

CTA:

`[Post a Problem]`

### No search results

> No matching problems yet. Try another keyword or browse all problems.

### No developer activity

> No developers have expressed interest yet. Clear problem evidence can help the right builder notice it.

### Zero validation

Show the real zero:

`0 Me Too`  
`0 I Want This`

Do not hide zero behind sample values.

---

## 19. Loading and Error States

### Loading

Use skeleton cards and disabled states.

### Error

Use concise, actionable messages:

> We couldn't load this problem. Try again.

### Mutation failure

> That action didn't complete. Your previous state is unchanged.

Never imply success before the server confirms it.

---

## 20. Trust UI

V1 trust indicators:

- verified email;
- verified problem state where applicable;
- developer capability badge;
- truthful counts.

Do not show:

- fake ratings;
- fake “top developer” labels;
- fake funding totals;
- fake adoption numbers.

Reputation arrives later.

---

## 21. Information Architecture — V1

```text
Home
├── Trending / High Priority
├── New Problems
└── Recent Activity

Problems
├── Categories
├── Search
├── Filters
└── Problem Detail

Discover
├── Highest Priority
├── Trending
├── Newest
└── Problem Detail

Profile
├── My Problems
├── My Signals
└── Settings
```

Later add:

```text
Projects
Funding
Reputation
```

only when those features exist.

---

## 22. Product Copy Principles

### Prefer

“People facing this problem”  
“Me Too”  
“I Want This”  
“Developers interested”  
“Priority Score”  
“Fund Faster — optional”  
“Being Built”  
“Live Solution”

### Avoid

“Likes” as the main validation metric.  
“Pay to unlock a solution.”  
“Guaranteed solution.”  
“Winner by votes alone.”  
Any reputation rating before real reputation exists.

---

## 23. Key UX Principle

The interface should preserve one continuous story:

```text
“I have this problem.”
        ↓
“Other people have it too.”
        ↓
“People would use a solution.”
        ↓
“Developers are noticing it.”
        ↓
“Someone may build it.”
        ↓
“Eventually, the real problem can become a real product.”
```

The first four-week product proves the first four steps. The later phases prove the rest.
