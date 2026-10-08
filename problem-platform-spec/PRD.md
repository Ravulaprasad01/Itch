# Problem → Build Platform — Product Requirements Document (PRD)

**Working name:** Problem2Build (provisional)  
**Document status:** Revised v1.3  
**Scope baseline:** Phase 0 + Phases 1–3 only for the first build  
**Primary audience:** Founder, Product, Design, Engineering, QA  

> **Core thesis:** Real-world problems are more valuable when the people experiencing them validate the problem before developers invest time building solutions.

## 0. Adopted Scope Decisions

This v1.3 revision adopts the current solo-builder direction:

1. Build only Phase 0 plus Phases 1–3 first.
2. Conduct 3–7 days of interviews before coding.
3. Seed 20–30 real problems during Phase 0 and load them by Week 3–4.
4. Use `problem_signals` with `me_too`, `want_this`, and `dev_interest`; there is no canonical `upvote` signal.
5. Use the simplified V1 Priority Score: demand, frequency, and recency.
6. Defer proposals, project workspaces, milestones, real funding, reputation, and advanced AI.
7. Keep the product truthful: all displayed counts and outcomes come from real records.
8. Keep infrastructure lean: no staging environment, full admin UI, full audit console, or heavy CI database suite in the first build.
9. Do not accept real money until ownership, expiry, refunds, disputes, payment mechanics, and compliance decisions are closed.


---

## 1. Executive Summary

Problem2Build is a web platform where people post everyday problems, other people validate those problems, and developers discover which problems are worth turning into real software projects.

The first build is deliberately **not** a full marketplace. It proves the earliest part of the loop:

**Problem → Me Too → I Want This → Comments → Search/Discovery → Priority Score → Developer Interest**

Optional funding is a later feature. It is **not required to post, validate, or support a problem**. When introduced, it is an urgency/priority signal: contributors can voluntarily indicate that they want a validated problem solved faster. Any early pledge must be explicitly labelled **non-binding** until ownership, expiry, refunds, payment handling, and compliance are finalized.

The developer value proposition is not “another freelance job board.” Developers gain access to **real-time project opportunities backed by real user evidence** and, later, optional funded challenges.

The most important early question is:

> **Do real people repeatedly post and validate problems, and do developers repeatedly return to discover those opportunities?**

Only after that gate passes should the product add proposals, projects, milestones, and real-money funding.

---

## 2. Problem Statement

### 2.1 Problem for everyday users

People encounter recurring frustrations in education, work, local services, home management, small business, travel, and other workflows. These problems are fragmented across social posts, chats, forums, reviews, and offline conversations.

Most people do not have a structured place to say:

> “This is the problem I face, other people should be able to validate it, and a developer should be able to discover it.”

### 2.2 Problem for developers

Students, freshers, freelance developers, indie hackers, and early-career engineers often need project ideas that are more meaningful than tutorials or clones.

The common workflow is:

**Developer chooses idea → guesses demand → builds → searches for users.**

Problem2Build reverses the early part of that process:

**Users reveal problem → community validates demand → developer discovers opportunity.**

### 2.3 Product opportunity

The platform turns unstructured pain into structured evidence:

- who is affected;
- how often it happens;
- whether others say “Me Too”;
- whether people would use a solution;
- and, later, whether people want to fund a faster resolution.

---

## 3. Vision and Positioning

### Vision

**Make it easier for real problems to become real products.**

### Positioning

> **A real-world project marketplace where validated problems become software.**

### Anti-positioning

Problem2Build is **not** intended to become a generic freelancing marketplace where users post pre-defined jobs and developers bid on hourly work.

The starting point is always the **problem**, not the implementation contract.

---

## 4. Product Principles

1. **Problem before solution.** Encourage users to describe the pain and current workaround before specifying technology.
2. **Evidence before hype.** Rankings should be driven by measurable signals, not claims or vanity numbers.
3. **Funding is optional.** A problem remains valid with zero funding.
4. **Funding means urgency.** When introduced, funding is primarily a signal that supporters want faster resolution; its influence on ranking is bounded.
5. **Real users should meet the build.** Later solutions should return to the people who validated the original problem.
6. **Developers need genuine opportunity.** The platform should provide access to real requirements, real users, and later paid or otherwise valuable build opportunities.
7. **Trust before scale.** Authentication, RLS, rate limits, email verification, reporting, and truthful metrics are foundational.
8. **Ship the smallest useful loop.** The first build proves validation and discovery; marketplace economics come later.

---

## 5. Target Users

### 5.1 Problem poster

A person with a recurring problem who wants validation or a practical solution.

### 5.2 Problem supporter

A user who validates an existing problem using **Me Too**, **I Want This**, comments, and—later—optional funding.

### 5.3 Developer / builder

A developer who wants real-world projects, real requirements, real users, and later potential paid opportunities.

### 5.4 Admin / moderator

An internal role responsible for trust and safety. Admin tooling is intentionally deferred; V1 uses minimal operational controls only.

---

## 6. Scope Strategy

### 6.1 Phase 0 — before code

Spend **3–7 days** speaking with:

- 10–20 people who experience problems;
- 10–15 developers;
- enough participants to collect 20–30 concrete problems.

Ask developers which of the collected problems they would actually consider building. Use these interviews to refine the form, categories, signals, and language before implementation.

### 6.2 First build — Phases 1–3, approximately 4 weeks

The first production-quality build includes only:

- login and profile onboarding;
- problem posting;
- Me Too;
- I Want This;
- comments;
- search and filters;
- Problem Priority Score;
- trending/opportunity views;
- basic developer browsing and developer-interest signal;
- spam/reporting controls;
- basic PostHog funnel;
- manual seed data loaded by Week 3–4.

### 6.3 Deliberately deferred

Do **not** build these in the first four-week version:

- developer proposals;
- project workspaces;
- milestones;
- real funding/payment flows;
- reputation scores;
- public leaderboards;
- advanced AI;
- large admin dashboards;
- heavy enterprise workflows;
- native mobile apps.

### 6.4 Gate after Phase 3

Pause feature development and evaluate:

**Problem-side signal:** Are people posting and validating problems?  
**Developer-side signal:** Are developers returning to browse and showing genuine interest?

If either side is weak, improve the loop or narrow the starting market before adding marketplace machinery.

---

## 7. Core User Journeys — V1

### Journey A — Post a problem

1. User signs in.
2. User chooses **Post a Problem**.
3. User enters title, description, category, frequency, audience, location scope, and current workaround where known.
4. Client and server validate input.
5. Problem is published as `OPEN`.
6. Feed and search make it discoverable.

### Journey B — Validate a problem

1. User opens a problem.
2. User clicks **Me Too** if they personally experience it.
3. User clicks **I Want This** if they would use a solution.
4. User may add contextual comments.
5. Counts update from real database state.
6. The problem's demand and priority indicators recalculate.

### Journey C — Developer discovery

1. Developer opens **Discover / Opportunities**.
2. Developer sorts by priority/trending or filters by category.
3. Developer reads the evidence: Me Too, Want This, frequency, recency, comments, and problem context.
4. Developer can click **I’m Interested in Building This**.
5. Developer interest is stored as a signal and shown as aggregate evidence.

### Journey D — Optional funding — later phase

1. User sees a validated problem.
2. User may choose **Fund Faster**.
3. UI explains that funding is optional.
4. In the first funding experiment, contributions must be clearly labeled non-binding until real payment, ownership, refund, and expiry rules are approved.
5. Funding contributes to urgency information, but cannot by itself force a problem to the top of the ranking.

---

## 8. V1 Functional Requirements

### 8.1 Authentication

- Email/password authentication.
- Google sign-in.
- Verified email required before publishing problems.
- Profile role supports `problem_poster`, `developer`, `both`, and `admin`.
- Role changes must be server-authorized.

### 8.2 Problem creation

Required fields:

- title: 10–120 characters;
- description: 20–600 characters;
- category;
- frequency: `daily`, `weekly`, `monthly`, `rarely`.

Additional fields:

- `audience`;
- `location_scope`;
- `current_workaround`;
- `urgency_level` (self-reported only in V1).

UX requirements:

- encourage a problem, not a proposed solution;
- include an example in the form;
- show character counters;
- common problem should be postable in about 30 seconds.

### 8.3 Feed and search

Feed requirements:

- newest;
- trending;
- highest priority.

Filters:

- category;
- frequency;
- location scope;
- problem status.

Search:

- PostgreSQL full-text search for V1;
- semantic/AI search deferred.

### 8.4 Problem signals

Use one generalized table named `problem_signals` with types:

- `me_too`;
- `want_this`;
- `dev_interest`.

Rules:

- one authenticated user can hold at most one of each signal per problem;
- toggling the same signal removes it;
- counts are based on unique users, not client-side increments;
- V1 does not use fake/demo counters in production UI.

### 8.5 Comments

- authenticated users can comment;
- comments are 1–500 characters;
- rate limit comments;
- users can report comments;
- own comments can be deleted where policy allows;
- admin moderation remains operationally minimal in V1.

### 8.6 Reporting / spam controls

For V1 create only the `problem_reports` table.

Controls:

- verified email before posting;
- maximum 5 new problems/day/user;
- maximum 30 comments/day/user;
- duplicate-title warning;
- report button;
- auto-hide only after a conservative report threshold plus operational review.

### 8.7 Developer discovery

V1 supports:

- developer onboarding;
- opportunity/discover feed;
- developer-interest action;
- developer-oriented filters.

V1 does **not** support proposal selection or contracts.

---

## 9. Problem Priority Score — V1

The first build must use a score that can be computed from data that actually exists.

### Formula

```text
Priority Score (0–100) =
  50% Demand
+ 25% Frequency
+ 25% Recency
```

### Demand

Demand is derived from validated community actions:

```text
Demand = normalized combination of:
  unique Me Too users
  + unique I Want This users
```

Recommended initial weighting inside Demand:

- Me Too: 60%;
- I Want This: 40%.

The exact normalization can be revised after observing real distributions.

### Frequency

Suggested ordering:

`daily > weekly > monthly > rarely`

Do not let frequency alone dominate demand.

### Recency

Newer activity receives more weight so a rapidly emerging problem can trend without permanently competing against old posts.

Use a transparent decay function rather than hard-coded “winner forever” counts.

### Score columns

The schema may store the following normalized components:

- `demand_score`;
- `frequency_score`;
- `recency_score`;
- `urgency_score`;
- `dev_interest_score`;
- `quality_score`;
- `priority_score`.

Only the first three components feed the V1 Priority Score. `urgency_score`, developer interest, quality, and funding-related signals are deliberately deferred until real data exists.

### Later score expansion

After enough real data exists, introduce bounded contributions from:

- optional funding/urgency;
- developer interest;
- problem quality;
- solution outcomes.

**Funding must never single-handedly move a problem to the top.**

---

## 10. Status Lifecycle

The canonical **problem lifecycle** is:

```text
OPEN
  ↓
VALIDATING
  ↓
CHALLENGE_OPEN
  ↓
PROPOSAL_REVIEW
  ↓
SELECTED
  ↓
BEING_BUILT
  ↓
BETA
  ↓
LIVE
  ↓
SOLVED
```

Terminal/exception states:

- `EXPIRED` — opportunity expired before selection or no valid next step occurred;
- `ARCHIVED` — intentionally removed from active discovery;
- `CANCELLED` — explicitly stopped by an authorized actor.

V1 primarily uses `OPEN`, `VALIDATING`, `ARCHIVED`, and `CANCELLED`. The later states are defined now so the product does not need competing state vocabularies later.

**Source of truth:** `problems.status` is the source of truth for the user-facing lifecycle.

---

## 11. Success Metrics and Decision Gates

### North-star outcome

**Number of validated problems that eventually become real, used solutions.**

This is a later-stage metric, not a V1 release requirement.

### V1 product signals

Track:

- unique problems posted;
- unique users who posted;
- Me Too actions;
- I Want This actions;
- comments;
- developer-interest actions;
- opportunity views;
- 14-day returning users;
- 30-day returning developers.

### Phase 3 gate

Proceed to Phase 4 only when there is evidence that:

- people will post genuine problems without being manually prompted every time;
- other people validate those problems;
- developers return and browse more than once;
- at least some developers can identify problems they would realistically consider building.

There is no single magic threshold. Use cohort behavior and interviews together.

---

## 12. Analytics Requirements

Use a basic PostHog funnel in V1.

Core events:

- `visited_home`;
- `signup_completed`;
- `profile_completed`;
- `problem_started`;
- `problem_posted`;
- `problem_viewed`;
- `me_too_added`;
- `want_this_added`;
- `comment_posted`;
- `developer_interest_added`;
- `search_used`;
- `filter_used`;
- `returned_14d`;
- `returned_30d`.

Do not instrument or expose invented business outcomes.

---

## 13. Security and Trust Requirements — V1

- Row-Level Security on all exposed tables.
- Server-side authorization for role-sensitive mutations.
- Verified email before publishing.
- Input validation on client and server.
- Rate limits for posting, comments, and signals.
- No private financial information in public queries.
- No false claims about user counts, funding, reputation, or outcomes.
- `admin` capability is server-controlled; a full admin UI is deferred.
- Basic RLS tests must exist before launch.

---

## 14. Risks

### Cold start

Start with one narrow community. Seed 20–30 high-quality problems during Phase 0 and make them available by Week 3–4.

### Low-quality problems

Use form guidance, quality validation, duplicate detection, and moderation.

### Fake demand

Unique authenticated actions and rate limits reduce trivial gaming. More advanced anomaly detection comes later.

### Developer disinterest

Interview developers before code, seed relevant problems, expose useful evidence, and measure return behavior before building a full marketplace.

### Product drifting into freelancing

Require all opportunities to originate from a validated problem. Traditional “hire me to build your website” jobs are out of scope.

### Funding complexity

Do not accept real money until ownership, expiry, refunds, payment provider behavior, disputes, taxes/compliance, and milestone release rules are explicitly decided.

---

## 15. Deferred Product Decisions Before Phase 6

These are deliberately unresolved until the funding phase:

1. Who owns the resulting product by default?
2. Is funding a non-binding pledge first or a committed contribution?
3. What happens to unspent money at expiry?
4. What happens if no developer is selected?
5. What happens if a selected developer abandons the project?
6. Who can approve milestones?
7. Who receives refunds and under what conditions?
8. Can multiple developers submit competing solutions?
9. What geographic/payment restrictions apply?
10. What are the tax and compliance responsibilities?

These decisions must be finalized **before real money is accepted**.

---

## 16. MVP Definition of Done

The first four-week build is complete when a real user can:

1. Sign up and verify email.
2. Complete a role profile.
3. Post a problem.
4. See it in the feed.
5. Search for it.
6. Have another user click Me Too.
7. Have another user click I Want This.
8. Comment on it.
9. See real counts and a real Priority Score.
10. See it in a trending/opportunity view.
11. A developer can express interest.
12. Analytics capture the funnel.
13. Reports/rate limits/RLS protect the basic system.

**Not required for this MVP:** proposals, projects, milestones, or real funding.

---

## 17. Release Gate Summary

```text
Phase 0
Interviews + 20–30 seeded problems
        ↓
Phase 1
Foundation + auth
        ↓
Phase 2
Problems + community validation
        ↓
Phase 3
Priority Score + developer discovery
        ↓
GATE
Do users post/validate?
Do developers return?
        ↓ yes
Phase 4+
Marketplace/build workflows
        ↓ later
Phase 6+
Funding / real money
```
