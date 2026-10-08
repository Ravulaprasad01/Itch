# Problem2Build — Project Memory

> This file is the persistent reference for any AI working on this codebase.
> Read this before writing any code, schema, copy, or API route.
> Last synced from spec v1.3.

---

## 1. What This Product Is

A platform where people post **real-world problems**, others validate them, and developers discover which problems are worth building into software.

The loop is: **Problem → Me Too → I Want This → Comments → Priority Score → Developer Interest**

It is **not** a freelance marketplace. Every opportunity must originate from a validated problem.

---

## 2. Current Scope (Active Build)

**Phase 0 + Phases 1–3 only.** Four weeks of engineering after a 3–7 day interview sprint.

### ✅ In scope now
- Auth (email/password + Google), email verification
- Profile with role (`problem_poster`, `developer`, `both`, `admin`)
- Problem creation, edit, delete
- Feed (newest / trending / highest priority)
- Search (PostgreSQL full-text only)
- Filters (category, frequency, location scope, status)
- Signals: `me_too`, `want_this`, `dev_interest`
- Comments (1–500 chars, rate-limited)
- `problem_reports` table + report button
- Priority Score (demand 50% + frequency 25% + recency 25%)
- Developer discovery / opportunity view
- PostHog analytics funnel
- Seed data (20–30 problems) loaded by Week 3–4
- Basic RLS tests, rate limits, email verification

### ❌ Explicitly deferred — do not build
- Proposals
- Projects / workspaces
- Milestones
- Real funding / payment flows
- Reputation scores / leaderboards
- Advanced AI / semantic search
- Full admin dashboard / audit console
- Staging environment
- Native mobile apps

---

## 3. Stack

| Layer | Choice |
|---|---|
| Framework | Next.js (App Router) + TypeScript |
| Styling | Tailwind CSS |
| Database | Supabase / PostgreSQL |
| Auth | Supabase Auth |
| Authorization | Row-Level Security (RLS) at DB boundary |
| Hosting | Vercel |
| Analytics | PostHog |

Architecture style: **modular monolith**. No microservices, queues, or separate services in V1.

---

## 4. Canonical Data Model (Phase 1–3 tables only)

### `profiles`
- `id` → `auth.users.id`
- `username` unique
- `role` enum: `problem_poster | developer | both | admin`
- `admin` cannot be self-assigned from client

### `categories`
Seeded values: Health, Money, Work, Home, Education, Travel, Family, Other

### `problems`
Key fields: `title` (10–120 chars), `description` (20–600 chars), `category_id`, `frequency`
Optional: `audience`, `location_scope`, `current_workaround`, `urgency_level`

Status enum (full, for forward compat):
```
open → validating → challenge_open → proposal_review → selected → being_built → beta → live → solved
terminal: expired | archived | cancelled
```
**V1 primarily uses:** `open`, `validating`, `archived`, `cancelled`

Score columns on `problems`:
- `demand_score`, `frequency_score`, `recency_score` — **V1 active**
- `priority_score` — **V1 active** (the composite)
- `dev_interest_score`, `urgency_score`, `quality_score` — **exist for schema compat, do NOT feed V1 ranking**

Denormalized counters: `me_too_count`, `want_this_count`, `dev_interest_count`
Counter updates must be **transaction-safe**; signal rows are authoritative.

### `problem_signals`
```sql
unique(problem_id, user_id, type)
type: me_too | want_this | dev_interest
```
- One signal per user per problem per type; toggleable
- **No `upvote` signal exists.** Never introduce one.

### `comments`
`status` enum: `published | hidden | deleted`

### `problem_reports`
`reason` enum: `spam | abuse | privacy | duplicate | misleading | other`
`status` enum: `open | reviewed | dismissed | actioned`

### Deferred tables (create only when phase begins)
`proposals` (Phase 4), `projects` (Phase 5), `milestones` (Phase 5), `funds` / `funding_contributions` (Phase 6), `audit_events` (later)

---

## 5. Priority Score — V1 Formula

```
Priority Score (0–100) =
  50% Demand
+ 25% Frequency
+ 25% Recency

Demand = normalized(0.60 × MeToo + 0.40 × WantThis)
Frequency: daily > weekly > monthly > rarely
```

- Calculated **synchronously** after signal transaction commit in V1
- No queue needed yet
- Funding, dev interest, quality, and reputation are **NOT** inputs to V1 score
- **Funding must never single-handedly move a problem to #1** (any phase)

---

## 6. Signal Semantics (must be consistent everywhere)

| Signal | Meaning |
|---|---|
| **Me Too** | "I personally experience this problem." |
| **I Want This** | "I would use a good solution to this problem." |
| **Developer Interest** | "I am a developer and would consider building a solution." |

- Me Too ≠ Like. Never relabel it "Like" anywhere.
- Developer Interest is not a proposal or ownership claim.
- All three are unique per user per problem; toggleable; never purchasable.

---

## 7. Authorization Model

| Actor | Can do |
|---|---|
| Public | Read published problems, comments, aggregate signal counts |
| Authenticated | Signal, comment, report, create problems (if verified) |
| Problem owner | Edit/delete own problem |
| Developer | Add `dev_interest` signal; cannot propose/claim in V1 |
| Admin | Server-side privileged ops only; no client-side admin role assignment |

RLS is the database boundary. API/UI checks are additional layers, not the sole mechanism.

---

## 8. API Routes (V1)

```
GET    /api/problems
GET    /api/problems/:slug
POST   /api/problems
PATCH  /api/problems/:id
DELETE /api/problems/:id

POST   /api/problems/:id/signals
DELETE /api/problems/:id/signals/:type

GET    /api/problems/:id/comments
POST   /api/problems/:id/comments
DELETE /api/comments/:id

POST   /api/problems/:id/reports
```

Later (do NOT ship in V1):
```
POST /api/problems/:id/interest
POST /api/problems/:id/proposals
```

---

## 9. Rate Limits

- Max **5 new problems/day/user**
- Max **30 comments/day/user**
- Signal toggles and reports: apply reasonable limits
- Duplicate-title warning on problem creation

---

## 10. Analytics Events (PostHog)

`visited_home`, `signup_completed`, `profile_completed`, `problem_started`, `problem_posted`, `problem_viewed`, `me_too_added`, `want_this_added`, `comment_posted`, `developer_interest_added`, `search_used`, `filter_used`, `returned_14d`, `returned_30d`

Avoid: secrets, payment credentials, unnecessary PII, private report details.

---

## 11. UI / Copy Rules

### Preferred vocabulary
- "Me Too" (not "Like" or "Upvote")
- "I Want This"
- "Developers interested"
- "Priority Score"
- "Fund Faster — optional" (later)
- "Being Built", "Live Solution" (later)

### Hard rules
- All displayed counts come from real database records — **never hard-coded**
- Loading state = skeleton cards
- Zero = show real zero ("0 Me Too"), never hide it
- Failure = honest retry copy ("That action didn't complete. Your previous state is unchanged.")
- Never imply success before the server confirms it
- No fake testimonials, fake funding totals, fake adoption numbers, fake reputation scores
- Prototype notation (`{{me_too_count}}`) maps to live values — never ship as sample data

### Primary navigation (V1)
Desktop: `Logo | Problems | Discover | About | [Post a Problem] | [Profile]`
Do not show Projects, Funding, or Reputation nav until those features exist.

### Mobile priorities (in order of prominence)
Title → Me Too → I Want This → Priority Score → Comment action → Status

---

## 12. Source-of-Truth Rules

- `problems.status` is the **canonical public lifecycle** — never duplicate it in `projects.status`
- `problem_signals` rows are authoritative; denormalized counters are for performance only
- Funding must be clearly labeled **non-binding** in any pre-Phase-6 experiment
- Do not accept real money until ownership, expiry, refunds, disputes, and compliance are finalized (15 open items listed in PRD §15)

---

## 13. Phase 3 Gate (hard stop)

After Week 4, **stop and measure** before building anything in Phase 4+:

- Are people posting without being manually prompted?
- Are others clicking Me Too / I Want This?
- Are developers returning and browsing?
- Can developers identify problems they would realistically build?

Weak signal → pivot or narrow; do **not** add payments or proposals to compensate.

---

## 14. Anti-Patterns (never do these)

- ❌ Use `upvote` as a signal name anywhere
- ❌ Accept real money before Phase 6 governance is complete
- ❌ Let funding alone determine ranking position
- ❌ Show `dev_interest_score`, `urgency_score`, or `quality_score` in V1 ranking
- ❌ Self-assign `admin` role from client
- ❌ Duplicate `beta`, `live`, `solved` in `projects.status`
- ❌ Hard-code example counts or invented metrics in production UI
- ❌ Expose private financial information in public queries
- ❌ Introduce a staging environment, full admin UI, or heavy CI database suite in the first build
- ❌ Ship the later API endpoints (`/interest`, `/proposals`) in V1

---

## 15. Key Spec Files

| File | Purpose |
|---|---|
| `PRD.md` | Full requirements, user journeys, success metrics |
| `architecture.md` | Data model, APIs, RLS, ranking pipeline, ADRs |
| `design.md` | UX/UI spec, navigation, component structure, design system |
| `phases.md` | Phase roadmap, exit criteria, kill conditions |
| `rules.md` | Community rules, signal semantics, anti-gaming, privacy |
