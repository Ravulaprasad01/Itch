# Problem → Build Platform — Development Phases

**Status:** Revised v1.3  
**First-build target:** approximately 4 weeks after a 3–7 day validation sprint  
**Solo-builder principle:** stop at every gate before adding another layer of complexity

**Infrastructure rule:** the first build uses one deploy path; do not add a full staging environment, full admin UI, full audit console, or heavy CI database test suite. Keep only essential RLS tests, rate limits, email verification, and the basic PostHog funnel.

---

## Phase 0 — Product Validation Before Code

**Duration:** 3–7 days

### Objective

Prove that the problem is worth building before spending weeks engineering the solution.

### Work

Talk to:

- 10–20 people who face recurring problems;
- 10–15 developers who might build solutions.

Collect:

- 20–30 concrete problems;
- examples of frequency and impact;
- the language users naturally use;
- which problems developers say they would actually build.

### Questions for problem-side users

- What problem annoys you repeatedly?
- How often does it happen?
- What do you do today?
- Have you searched for a tool already?
- Would you use a solution if it existed?
- Would you ever want it solved faster?

### Questions for developers

- Which of these problems would you build?
- What makes a problem attractive?
- What information is missing from the problem description?
- What would make you return to the platform?
- Which signals matter most to you?

### Exit criteria

Proceed to Phase 1 when:

- there are at least 20 usable problem statements;
- at least 10 developers have been exposed to the concept;
- multiple developers can identify at least one problem they would realistically consider building;
- the team has a clear understanding of the words users and developers actually use.

---

## Phase 1 — Foundation

**Target:** Week 1

### Build

- GitHub repository;
- Next.js + TypeScript;
- Tailwind;
- Supabase project;
- Vercel deployment;
- environment variables;
- database migrations;
- Supabase Auth;
- `profiles`;
- `categories`;
- initial RLS.

### Do not build

- staging infrastructure;
- payment provider;
- proposal system;
- project workspace;
- admin dashboard.

### Engineering acceptance

- app deploys;
- auth works;
- email verification path works;
- RLS protects ownership boundaries;
- no secrets are committed.

### Deliverable

A deployed authenticated shell with a functioning database.

---

## Phase 2 — Problem Creation & Community Validation

**Target:** Weeks 2–3

### Features

- problem creation;
- edit/delete own problem;
- feed;
- detail page;
- categories;
- frequency;
- Me Too;
- I Want This;
- comments;
- search;
- filters;
- responsive/mobile UI;
- `problem_reports`.

### Database

Create only:

- `problems`;
- `problem_signals`;
- `comments`;
- `problem_reports`.

### Quality controls

- character limits;
- duplicate warning;
- verified email before posting;
- rate limits;
- reporting;
- server-side validation.

### Seed data requirement

**Do not wait until after the MVP to seed.**

Load the 20–30 Phase 0 problems early enough that by Week 3 the feed can be tested with realistic content. Add more manually as the build stabilizes.

### Analytics

- `problem_started`;
- `problem_posted`;
- `problem_viewed`;
- `me_too_added`;
- `want_this_added`;
- `comment_posted`;
- `search_used`.

### Exit criteria

A real user can post a problem, and another real user can validate it.

---

## Phase 3 — Problem Intelligence & Developer Discovery

**Target:** Week 4

### Features

- Priority Score;
- trending view;
- highest-priority view;
- developer-oriented discovery;
- developer role onboarding;
- developer interest signal;
- better opportunity filtering.

### V1 Priority Score

```text
50% Demand
25% Frequency
25% Recency
```

Demand uses:

- Me Too;
- I Want This.

Do not include funding, proposal quality, developer reputation, or project outcomes yet.

### Seed data

By the end of this phase, the product should have enough manually sourced content to make ranking and discovery meaningful. A practical target is the original 20–30 seeded problems plus newly posted real problems.

### Exit criteria

A developer can open the platform and quickly identify the most compelling problems without manually reading every post.

---

## Phase 3 Gate — STOP AND MEASURE

This is a hard product gate, not a soft suggestion.

### Ask

**Problem-side:**

- Are people posting without being pushed every time?
- Are other people clicking Me Too / I Want This?
- Do users return to problems?

**Developer-side:**

- Do developers return?
- Do they browse multiple problems?
- Do they click developer interest?
- Can they name problems they would actually build?

### Outcomes

#### Strong signal

Proceed to Phases 4–5.

#### Mixed signal

Keep the same codebase, narrow the audience, improve content quality, or change ranking/discovery before building new marketplace machinery.

#### Weak signal

Stop/pivot. Do not add payments or elaborate project workflows to compensate for missing demand.

---

## Phase 4 — Developer Marketplace

**Only after Phase 3 gate passes.**

### Features

- developer profile improvements;
- proposal submission;
- proposal comparison;
- selection workflow;
- problem → selected build transition.

### Proposal information

- approach;
- scope;
- timeline;
- tech stack;
- relevant work;
- requested amount when applicable later.

### Selection rule

Later proposal selection uses a consistent model. Proposed weights:

```text
35% Community Preference
25% Technical Feasibility
15% Timeline
15% Developer Credibility
10% Proposal Completeness
```

These sum to 100% and must remain consistent in PRD, rules, and design when implemented.

---

## Phase 5 — Build Tracking & Live Solutions

**Only after Phase 4 proves there are credible builders.**

### Features

- projects;
- milestones;
- progress updates;
- beta testing;
- live solution URL;
- solution page;
- solved verification.

### Architecture rule

`problems.status` remains the public lifecycle source of truth. `projects.status` remains operational (`active`, `paused`, `cancelled`, `closed`).

### Exit criteria

At least one problem reaches a working beta or live solution used by real people.

---

## Phase 6 — Optional Funding / Priority Fund

**Do not begin until ownership, expiry, refunds, payment mechanics, and compliance are settled.**

### Objective

Test whether people are willing to help a validated problem get solved faster.

### Important principle

Funding is **optional**.

A zero-funded problem can still be the highest-value problem.

### Recommended sequence

1. Prototype non-binding pledge UI if needed.
2. Test comprehension.
3. Define challenge terms.
4. Integrate a payment provider only after governance is complete.
5. Add milestone-based release if real money funds builds.

### Exit criteria

Users understand:

- funding is optional;
- what funding does;
- when it becomes binding, if ever;
- what happens to funds on expiry or cancellation.

---

## Phase 7 — Real-Money Challenge Funds

Conditional on a validated Phase 6 signal.

### Build

- payment provider;
- webhook verification;
- fund states;
- contribution records;
- milestone releases;
- refunds;
- disputes;
- reconciliation.

### Non-negotiable

Never treat client-side payment confirmation as proof of payment.

---

## Phase 8 — Trust & Reputation

Later:

- verified developer profiles;
- shipped project history;
- useful outcome badges;
- completion history.

Do not expose reputation metrics before real history exists.

---

## Phase 9 — AI Problem Intelligence

Later, after enough real data exists.

Potential uses:

- duplicate clustering;
- problem summaries;
- semantic search;
- demand clusters;
- developer matching.

AI is a multiplier on evidence, not a replacement for it.

---

## Phase 10 — Sponsored Challenges / B2B

Later options:

- sponsored problem challenges;
- institution/community challenges;
- company-funded problem discovery.

Only introduce after consumer/community behavior is proven.

---

## Phase 11 — Problem Intelligence as a Product

Long-term possibility:

- trend reports;
- category demand intelligence;
- founder opportunity research;
- regional problem insights.

Only pursue if the underlying data is sufficiently reliable and privacy-safe.

---

## First 4-Week Execution Plan

### Days 1–7

Phase 0 interviews and seed collection.

### Week 1 after validation

Auth, profiles, categories, foundation, deployment.

### Week 2

Problem posting, feed, detail page, comments.

### Week 3

Me Too, I Want This, search, filters, reports, seed data loaded.

### Week 4

Priority Score, trending, developer discovery, developer interest, analytics, mobile polish.

### End of Week 4

**STOP. MEASURE. TALK TO USERS.**

Do not automatically continue into proposals or funding.

---

## Phase Gates

### Gate A — Problem signal

People post real problems and others validate them.

### Gate B — Developer signal

Developers return and identify opportunities.

### Gate C — Build signal

Developers submit credible proposals and actually start builds.

### Gate D — Outcome signal

A solution reaches real users.

### Gate E — Funding signal

People understand and use optional funding to accelerate valuable builds.

---

## Kill / Pivot Conditions

Pivot or stop when, after a genuine validation period:

- problems are posted only through manual prompting;
- Me Too / Want This signals remain near zero;
- developers visit once and never return;
- developers cannot identify attractive opportunities;
- built solutions are not used;
- funding activity is strong but there is no useful build outcome.

Potential narrow markets:

- college/student problems;
- local SMB problems;
- housing/hostel problems;
- community or neighborhood problems;
- a single professional niche.
