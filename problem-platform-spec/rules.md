# Problem → Build Platform — Product & Community Rules

**Status:** Revised v1.3  
**Scope:** Phase 0 through first validated MVP; later marketplace/funding rules are clearly separated

---

## 1. Golden Rules

1. **Problem first, solution second.** A problem post should describe a real pain, not advertise a product.
2. **One person, one signal.** Authenticated actions are unique per user/problem/signal type.
3. **No fake metrics.** Counts, funding, reputation, testimonials, and outcomes shown in the product must come from real records.
4. **Funding is optional.** A problem does not need money to be valid.
5. **Funding is an urgency signal.** It must not become a pay-to-rank mechanism.
6. **No generic freelance jobs.** Traditional “build my website” requests belong elsewhere.
7. **Safety and privacy outrank growth.** Do not collect or expose unnecessary personal information.
8. **Build only after evidence.** Advanced marketplace features are gated by observed user behavior.

---

## 2. Problem Posting Rules

### Allowed

- recurring personal or community problems;
- workflow frustrations;
- unmet needs;
- local service problems;
- problems in education, work, home, money, travel, and similar categories;
- problem descriptions that do not require a preselected technology.

### Not allowed

- harassment or attacks;
- personal information about another person;
- illegal requests;
- malware or harmful software requests;
- spam or repeated promotional posts;
- fabricated stories intended to manipulate rankings;
- conventional freelance job listings;
- misleading claims of users, revenue, or demand.

### Quality rule

A useful problem should explain at least:

- what happens;
- who is affected;
- how often it happens;
- what people currently do instead.

---

## 3. Validation Signal Rules

### 3.1 Me Too

**Meaning:** “I personally experience this problem.”

Rules:

- one per authenticated user per problem;
- toggleable;
- cannot be purchased;
- counts represent unique users.

### 3.2 I Want This

**Meaning:** “I would use a good solution to this problem.”

Rules:

- one per authenticated user per problem;
- toggleable;
- does not imply willingness to pay;
- should be visually distinct from Me Too.

### 3.3 Developer Interest

**Meaning:** “I am a developer and would consider building a solution to this problem.”

Rules:

- available only to users with developer capability;
- one active signal per developer/problem;
- not equivalent to a proposal or commitment;
- does not grant ownership or a claim.

### 3.4 Comments

Comments should add evidence, constraints, examples, frequency, or useful context.

Low-value comments and comment spam may be rate-limited or removed.

---

## 4. V1 Priority Score Rules

The first build does not have enough data for a complete marketplace formula.

### V1 formula

```text
Priority Score =
  50% Demand
+ 25% Frequency
+ 25% Recency
```

### Demand rule

Demand is based on Me Too and I Want This:

```text
Demand = normalized(
  60% Me Too
+ 40% I Want This
)
```

### Frequency rule

`daily > weekly > monthly > rarely`

### Recency rule

Recent engagement should matter so an emerging problem can trend.

### Funding rule for later

Funding is optional and cannot be required for a problem to rank, enter discovery, or be considered by developers. Before real-money funding is implemented, any pledge prototype must be clearly labelled **non-binding**.


Once funding exists, it may add a bounded urgency component.

**Funding must never single-handedly push a problem to #1.**

---

## 5. Funding Rules — Deferred Until Phase 6

### 5.1 Funding is optional

Users must always be able to:

- view the problem;
- click Me Too;
- click I Want This;

without contributing money.

### 5.2 Meaning of funding

Funding means:

> “I want this problem solved faster and am willing to contribute toward the defined challenge.”

It does not mean:

> “This problem is more legitimate because I paid.”

### 5.3 V1 funding state

The first four-week MVP does **not** accept real money.

A later experiment may test a clearly labeled **non-binding pledge** before payment integration.

### 5.4 Before accepting real money

The following must be decided and published:

- who owns the resulting product;
- what the money can be used for;
- when contributions become binding;
- what happens when a challenge expires;
- what happens when no developer is selected;
- refund conditions;
- cancellation rules;
- milestone acceptance;
- dispute handling;
- platform fees;
- taxes/compliance;
- geographic/payment restrictions.

### 5.5 Privacy

Public views may show aggregate amounts and contributor counts, but never private payment credentials or unnecessary financial details.

---

## 6. Developer Rules

### Eligibility

A developer can mark developer capability as:

- `developer`; or
- `both`.

Developer interest is not a contract.

### Honesty

Developers must not:

- fabricate portfolios;
- claim capabilities they do not have;
- copy another proposal as their own;
- manipulate problem signals.

### No spam

Do not submit repeated developer-interest actions or promotional comments for the same problem.

### Real project principle

Later build opportunities should remain connected to the original problem and user evidence.

---

## 7. Developer Competition Rules — Later Phase

Once proposals exist:

- one proposal per developer per problem unless revision is allowed;
- proposals must state scope and timeline;
- selection cannot be based solely on popularity;
- any scoring weights shown to users must sum to 100% and be consistent across PRD, rules, and design.

### Proposed later selection weights

```text
35% Community Preference
25% Technical Feasibility
15% Timeline
15% Developer Credibility
10% Proposal Completeness
= 100%
```

These weights apply only when the proposal system is actually built.

---

## 8. Project Build Rules — Later Phase

The public lifecycle is controlled by `problems.status`.

Projects should track only operational state, such as:

- active;
- paused;
- cancelled;
- closed.

Do not duplicate public states such as `beta`, `live`, or `solved` in `projects.status`.

---

## 9. Milestone Rules — Later Phase

When milestone funding is introduced:

- every milestone has explicit scope;
- acceptance criteria are visible;
- funds release only on the defined approval event;
- rejected milestones can be revised or disputed according to published rules;
- abandonment/cancellation follows the agreed refund policy.

---

## 10. Ownership Rules — Must Be Decided Before Real Funding

The platform must not imply default ownership before the legal/product policy exists.

Possible models include:

- developer-owned product;
- problem-owner commissioned work;
- shared commercial project;
- sponsor-owned project.

The chosen model must be shown before a funded commitment is made.

---

## 11. Solved Definition

A problem should not be marked `SOLVED` simply because a developer says “finished.”

Minimum later verification should include:

1. live solution exists;
2. original problem is addressed;
3. real users have tested it;
4. outcome is recorded truthfully.

---

## 12. Duplicate Rules

When a new problem appears substantially similar to an existing one:

- show a duplicate suggestion;
- encourage Me Too instead of duplicate posting;
- do not silently merge without preserving the user's intent.

A future AI clustering system may improve this after real data exists.

---

## 13. Moderation Rules

### Reports

Report reasons:

- spam;
- abuse;
- privacy;
- duplicate;
- misleading;
- other.

Reports should be reviewable by authorized staff.

### Auto-hide

Auto-hide should be conservative and reversible. A report is an input to review, not proof of wrongdoing.

---

## 14. Anti-Gaming Rules

Do not allow a user to materially manipulate rankings by:

- creating repeated accounts;
- rapidly toggling signals to generate artificial activity;
- coordinating fraudulent comments;
- fabricating urgency/funding;
- using bots.

The initial controls are:

- verified email;
- authentication;
- rate limits;
- unique constraints;
- basic anomaly review.

Advanced abuse detection is later.

---

## 15. Truthful Product UI

The interface must never display invented examples as production facts.

For product mockups and implementations:

- use live database values;
- use skeleton/loading states while data is unavailable;
- use neutral zero states such as “0 Me Too” when zero is real;
- do not display fake testimonials;
- hide reputation metrics until reputation exists.

---

## 16. Reputation Rules — Later Phase

Reputation is not part of the first build.

When introduced, it must be based on meaningful outcomes such as:

- verified solutions shipped;
- successful project completion;
- accurate delivery history;
- community usefulness.

Do not fabricate ratings or reputation scores for users who do not have that history.

---

## 17. Privacy Rules

- Do not expose contributor identities unless the user explicitly chooses a public attribution model.
- Do not expose private payment information.
- Do not collect location beyond what is necessary for the problem.
- Do not expose email addresses in public problem pages.
- Minimize analytics data.

---

## 18. Role Rules

Canonical profile roles:

- `problem_poster`;
- `developer`;
- `both`;
- `admin`.

A user with `both` can post problems and act as a developer.

`admin` is privileged and cannot be selected from ordinary onboarding.

---

## 19. Feature Gate Rules

### Before Phase 3 gate

Only validation/discovery features should consume most engineering effort.

### Before Phase 4

Evidence must show:

- people post;
- people validate;
- developers return.

### Before Phase 6

Ownership, expiry, refunds, payment mechanics, milestone acceptance, and compliance must be finalized.

---

## 20. Founder Rule

When in doubt, choose the smallest rule that protects users and keeps the experiment honest.

The product is trying to prove a behavioral loop before proving a business model.
