# Problem → Build Platform — Architecture Specification

**Status:** Revised v1.3  
**Architecture baseline:** Solo-builder MVP first; expand only after Phase 3 gate  
**Primary stack:** Next.js + TypeScript + Tailwind + Supabase/PostgreSQL/Auth/RLS + Vercel + PostHog

---

## 1. Architecture Goals

1. Keep the first build small enough for one developer.
2. Make the data model ready for later marketplace features without implementing them early.
3. Enforce authorization at the database boundary with Row-Level Security.
4. Make ranking explainable and based only on available real data.
5. Preserve a clean path from problem validation to later developer/project/funding workflows.
6. Avoid premature microservices, queues, staging infrastructure, and heavy admin tooling.

---

## 2. MVP Architecture

```text
Browser
  │
  ▼
Next.js App Router
  │
  ├── Server Components / route handlers
  ├── Client interactions
  ├── Validation / business rules
  └── PostHog analytics
  │
  ▼
Supabase
  ├── Auth
  ├── PostgreSQL
  └── Row-Level Security
  │
  ▼
Vercel
```

V1 is a **modular monolith**. Do not split ranking, moderation, proposals, or payments into separate services yet.

---

## 3. Runtime Responsibilities

### 3.1 Next.js application

Responsible for:

- page rendering;
- authenticated routes;
- form submission;
- input validation;
- server-side mutations;
- search and filtering;
- score calculation triggers;
- developer discovery;
- analytics event emission.

### 3.2 Supabase Auth

Responsible for:

- email/password authentication;
- Google sign-in;
- email verification;
- session management.

### 3.3 PostgreSQL

Source of truth for:

- profiles;
- categories;
- problems;
- problem signals;
- comments;
- reports;
- later proposals/projects/milestones/funds.

### 3.4 PostHog

Basic event analytics only in V1.

### 3.5 Vercel

Production hosting and deployment from GitHub.

---

## 4. Recommended Data Model

The architecture is intentionally phased. **Only tables needed by the active phase should be created.**

### Tables created by Phase 3

- `profiles`
- `categories`
- `problems`
- `problem_signals`
- `comments`
- `problem_reports`

### Tables created later, only when their phase begins

- `proposals`
- `projects`
- `milestones`
- `funds`
- `funding_contributions`
- `audit_events`

---

### 4.1 `profiles`

```text
id              uuid PK -> auth.users.id
username        text unique not null
role            enum(problem_poster, developer, both, admin)
bio             text nullable
avatar_url      text nullable
github_url      text nullable
website_url     text nullable
verified_at     timestamptz nullable
created_at      timestamptz default now()
updated_at      timestamptz default now()
```

Rules:

- `admin` cannot be self-assigned from the client.
- Users may have `both` capabilities without creating duplicate accounts.

---

### 4.2 `categories`

```text
id              bigint PK
name            text unique not null
slug            text unique not null
description     text nullable
is_active       boolean default true
created_at      timestamptz default now()
```

Starting categories:

- Health
- Money
- Work
- Home
- Education
- Travel
- Family
- Other

---

### 4.3 `problems`

```text
id                   uuid PK default gen_random_uuid()
slug                 text unique not null
user_id              uuid FK profiles.id

title                text not null

description          text not null
category_id           bigint FK categories.id
frequency             enum(daily, weekly, monthly, rarely)

audience              text nullable
location_scope        text nullable
current_workaround    text nullable
urgency_level         enum(low, medium, high, critical) nullable

status                enum(
                       open,
                       validating,
                       challenge_open,
                       proposal_review,
                       selected,
                       being_built,
                       beta,
                       live,
                       solved,
                       expired,
                       archived,
                       cancelled
                       )

me_too_count          integer default 0
want_this_count       integer default 0
dev_interest_count    integer default 0

demand_score          numeric(5,2) default 0
dev_interest_score    numeric(5,2) default 0
frequency_score       numeric(5,2) default 0
recency_score         numeric(5,2) default 0
urgency_score         numeric(5,2) default 0
quality_score         numeric(5,2) default 0
priority_score        numeric(5,2) default 0

created_at            timestamptz default now()
updated_at            timestamptz default now()
```

### Score columns

V1 actually calculates only:

- `demand_score`;
- `frequency_score`;
- `recency_score`;
- `priority_score`.

`urgency_score`, `quality_score`, and `dev_interest_score` are later-phase fields. They may exist in the schema for forward compatibility, but must not influence V1 ranking until the corresponding phase is active.

**Do not use the typo `urgency_score`.** There is no such field.

### Counters

Counters may be denormalized for performance, but the underlying signal rows remain authoritative. Counter updates must be transaction-safe.

---

### 4.4 `problem_signals`

```text
id             uuid PK default gen_random_uuid()
problem_id     uuid FK problems.id on delete cascade
user_id        uuid FK profiles.id on delete cascade
type           enum(me_too, want_this, dev_interest)
created_at     timestamptz default now()

unique(problem_id, user_id, type)
```

This replaces the earlier `votes` model.

There is intentionally **no** `upvote` signal in the canonical schema.

---

### 4.5 `comments`

```text
id             uuid PK default gen_random_uuid()
problem_id     uuid FK problems.id on delete cascade
user_id        uuid FK profiles.id on delete cascade
body           text not null
status         enum(published, hidden, deleted) default published
created_at     timestamptz default now()
updated_at     timestamptz default now()
```

---

### 4.6 `problem_reports`

Created in the first build.

```text
id             uuid PK default gen_random_uuid()
problem_id     uuid FK problems.id on delete cascade
reporter_id    uuid FK profiles.id on delete cascade
reason         enum(spam, abuse, privacy, duplicate, misleading, other)
notes          text nullable
status         enum(open, reviewed, dismissed, actioned)
created_at     timestamptz default now()
reviewed_at    timestamptz nullable
```

For comments, a later moderation extension can add `comment_id` or a generic report target.

---

## 5. Deferred Tables

### 5.1 `proposals`

Create only in Phase 4.

```text
id                   uuid PK
problem_id           uuid FK problems.id
developer_id         uuid FK profiles.id
summary              text
features             jsonb
timeline_days        integer
tech_stack           text[]
requested_amount     numeric nullable
status               enum(submitted, shortlisted, selected,
                           rejected, withdrawn)
community_score      numeric nullable
technical_score      numeric nullable
timeline_score       numeric nullable
credibility_score    numeric nullable
completeness_score   numeric nullable
overall_score        numeric nullable
created_at           timestamptz
updated_at           timestamptz
```

### 5.2 `projects`

Create only in Phase 5.

`problems.status` is the source of truth for the public lifecycle, so project status must **not duplicate** `beta`, `live`, or `solved`.

```text
id                 uuid PK
problem_id         uuid FK problems.id
developer_id       uuid FK profiles.id
status             enum(active, paused, cancelled, closed)
repo_url            text nullable
live_url            text nullable
preview_url         text nullable
started_at          timestamptz nullable
closed_at           timestamptz nullable
created_at          timestamptz
updated_at          timestamptz
```

### 5.3 `milestones`

Create only when milestone-based project work begins.

```text
id                 uuid PK
project_id         uuid FK projects.id
title              text
description        text
sequence           integer
amount             numeric nullable
status             enum(pending, active, submitted,
                        approved, rejected, cancelled)
due_at             timestamptz nullable
submitted_at       timestamptz nullable
approved_at        timestamptz nullable
```

### 5.4 `funds`

Create only in Phase 6 after product/legal decisions are closed.

```text
id                  uuid PK
problem_id          uuid FK problems.id
currency            text
goal_amount          numeric nullable
status              enum(intent, active, funded, awarded,
                         partially_awarded, expired, refunded,
                         cancelled)
funding_deadline    timestamptz nullable
created_at          timestamptz
updated_at          timestamptz
```

### 5.5 `funding_contributions`

Create only in Phase 6/7.

```text
id                   uuid PK
fund_id              uuid FK funds.id
user_id              uuid FK profiles.id
amount               numeric
currency             text
provider             text nullable
provider_payment_id  text nullable
status               enum(intent, pending, succeeded,
                           failed, refunded, disputed)
created_at           timestamptz
updated_at           timestamptz
```

Public queries expose only aggregate contribution information.

### 5.6 `audit_events`

Defer until operational complexity justifies it. V1 can rely on standard timestamps and provider logs; do not build a full audit console initially.

---

## 6. State Machine

```text
OPEN
  │
  ▼
VALIDATING
  │
  ├── insufficient demand ──► ARCHIVED
  │
  ▼
CHALLENGE_OPEN
  │
  ▼
PROPOSAL_REVIEW
  │
  ├── no suitable proposal ──► EXPIRED
  │
  ▼
SELECTED
  │
  ▼
BEING_BUILT
  │
  ▼
BETA
  │
  ▼
LIVE
  │
  ▼
SOLVED

Any authorized workflow may move to CANCELLED where the rules permit.
```

`EXPIRED` is included in both the status enum and diagram, so the state machine and schema remain consistent.

`ARCHIVED` is used for inactive content that is intentionally no longer promoted.

---

## 7. V1 API / Server Interface

Use server-side mutations for authorization-sensitive actions.

### Problems

```text
GET  /api/problems
GET  /api/problems/:slug
POST /api/problems
PATCH /api/problems/:id
DELETE /api/problems/:id
```

### Signals

```text
POST   /api/problems/:id/signals
DELETE /api/problems/:id/signals/:type
```

### Comments

```text
GET  /api/problems/:id/comments
POST /api/problems/:id/comments
DELETE /api/comments/:id
```

### Reports

```text
POST /api/problems/:id/reports
```

### Developer discovery

V1 can use the normal problem feed with role-aware UI rather than a separate marketplace service.

Later:

```text
POST /api/problems/:id/interest
POST /api/problems/:id/proposals
```

These later endpoints must not ship in V1.

---

## 8. Authorization Model

### Public

- Read published problems.
- Read published comments.
- Read aggregate signal counts.
- Read public developer profile fields only when explicitly public.

### Authenticated users

- Create signals.
- Remove own signals.
- Comment.
- Report content.
- Create problems if verified.

### Problem owner

- Edit/delete own problem while policy permits.
- Cannot alter other users’ signals.

### Developer

- Can add `dev_interest` signal.
- Cannot claim, propose, or modify projects until later phases.

### Admin

- Server-side privileged moderation only in V1.
- Do not expose admin role assignment to clients.

---

## 9. RLS Policy Outline

### `profiles`

- Users can read public profile fields.
- Users can update only their own editable fields.
- Role changes are restricted.

### `problems`

- Public read for active/published states.
- Authenticated users can insert when verified.
- Owners can update/delete own problems.
- Admin operations are server-side.

### `problem_signals`

- Authenticated insert/delete only for current user.
- Unique constraint prevents duplicates.
- No user should update another user's signal.

### `comments`

- Public read for published comments.
- Authenticated insert.
- Author can delete own comment where policy permits.

### `problem_reports`

- Authenticated users can create reports.
- Users can read only their own reports if needed.
- Moderation reads use privileged server-side access.

---

## 10. Search Architecture

### MVP

Use PostgreSQL full-text search over:

- title;
- description;
- audience;
- current_workaround;
- category name.

Create appropriate GIN indexes when query volume justifies them.

### Later

Only add semantic embeddings when user behavior shows that keyword search is insufficient.

---

## 11. Ranking Architecture — V1

### Data inputs

- unique `me_too` count;
- unique `want_this` count;
- frequency;
- created/updated timestamps.

### Score

```text
Priority Score =
  50% Demand
+ 25% Frequency
+ 25% Recency
```

Demand:

```text
Demand = normalized(
  0.60 * MeToo
+ 0.40 * WantThis
)
```

The scoring pipeline is synchronous/simple enough for V1:

```text
Signal transaction
      ↓
Database commit
      ↓
Recalculate affected problem
      ↓
Persist score + counters
```

No queue is needed initially.

### Later

When volume increases or the score becomes expensive:

```text
Event
  ↓
Async worker
  ↓
Score recalculation
  ↓
Persisted score
  ↓
Feed query
```

Later score additions may include developer interest, quality, and bounded urgency/funding.

---

## 12. Analytics Architecture

PostHog receives product events from the web application.

Recommended event properties:

- `problem_id`;
- `category`;
- `role`;
- `source`;
- `frequency` where relevant.

Avoid sending:

- secrets;
- payment credentials;
- unnecessary personal data;
- private report details.

Primary funnel:

```text
Visit
 ↓
Sign up
 ↓
Profile complete
 ↓
Problem posted
 ↓
Problem validated
 ↓
Problem revisited
 ↓
Developer interest
```

---

## 13. Security

### Identity

Supabase Auth is the identity provider.

### Authorization

RLS is the database boundary. API/UI checks are additional layers, not the sole security mechanism.

### Validation

Use schema validation for:

- problem fields;
- comments;
- signal types;
- report reasons.

### Rate limiting

Apply reasonable limits to:

- problem creation;
- comments;
- signal toggles;
- reports;
- search abuse where needed.

### Secrets

Never commit `.env.local` or provider secrets.

### Funding security later

Payment credentials and card data should stay with the payment provider. Do not invent an in-house wallet/escrow system.

---

## 14. Observability — V1

Keep this lightweight:

- application error logging;
- Supabase errors;
- auth failures;
- basic Vercel deployment status;
- PostHog event health.

Do **not** build a large operational dashboard yet.

---

## 15. Deployment Architecture — V1

```text
GitHub
   ↓
Vercel Production
   ↓
Supabase Production
```

For the solo-builder MVP:

- one production environment is sufficient;
- avoid a full staging environment initially;
- use local development and preview deployments where useful;
- do not put real payment flows into production until Phase 6+ and governance are complete.

---

## 16. Testing Strategy — V1

Essentials only:

- component tests for critical interactions;
- server validation tests;
- RLS policy tests;
- signal uniqueness tests;
- score calculation tests;
- basic mobile smoke tests.

Do not build a large integration-testing framework before the core loop has users.

---

## 17. Later Architecture — Phase 4+

Add only after the Phase 3 gate passes:

1. Proposals.
2. Projects.
3. Milestones.
4. Solution pages.
5. Optional funding.
6. Payment-provider webhooks.
7. Dispute/refund handling.
8. Reputation.
9. AI clustering.

Each should arrive with its own acceptance criteria and database migration.

---

## 18. Architecture Decision Records

### ADR-001 — PostgreSQL as source of truth

Structured problems, signals, comments, and later workflows fit relational constraints and transactional updates.

### ADR-002 — RLS at the database boundary

Authorization should remain enforced even when a new UI path is introduced.

### ADR-003 — Problem lifecycle is canonical

`problems.status` is the source of truth for the user-facing lifecycle. Project state stays operational and must not duplicate public lifecycle states.

### ADR-004 — Generalized problem signals

`problem_signals` replaces `votes` so the system can represent Me Too, Want This, and developer interest consistently.

### ADR-005 — Explainable V1 ranking

Use only demand, frequency, and recency before funding, proposal, and build data exists.

### ADR-006 — Modular monolith first

Keep the product easy for a solo builder to operate.
