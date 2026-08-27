# PostHog Self-driving Setup Report

**Project:** FashionHero — `biazikprzemek-arch/fashion-hero-shop`
**Date:** 2026-08-27
**PostHog project:** 580437 (EU cloud: `https://eu.i.posthog.com`)

Findings will start appearing in your [Self-driving inbox](https://us.posthog.com/project/580437/inbox) within ~30 minutes.

---

## Summary

Session Replay, Error Tracking, and Support (Conversations) were turned on; all native signal sources were wired to the inbox; GitHub was connected for code access and automated fix PRs; and the scout troop was tuned to 5 active scouts matched to this product's surfaces. Two Replay Vision scanners were armed to watch checkout/product-page breakage and rage-click frustration, and will start emitting findings the moment session recordings arrive.

## AI data processing

Approved (enforced by the PostHog wizard before this run started).

## GitHub

Connected during this run — integration id `255230`, account `pbiazik1`. Grant it access to `biazikprzemek-arch/fashion-hero-shop` if you haven't already, so Self-driving can research findings in that repo.

## Products enabled

| Product | Result | Notes |
|---|---|---|
| Session Replay | already enabled | Server-side flip was already on |
| Error Tracking | already enabled | Server-side flip was already on |
| Support (Conversations) | **enabled** | Turned on during this run |

`posthog-client.ts` init was inspected — no `disable_session_recording` or `capture_exceptions: false` overrides. The server flip is effective; recordings will begin as soon as users visit the live site.

Support: tickets only arrive once an inbound channel (email / inbox / Slack) is connected in PostHog → see Follow-ups.

## Signal sources

| source\_product | source\_type | Action | ID |
|---|---|---|---|
| `signals_scout` | `cross_source_issue` | on by default (no row needed) | — |
| `health_checks` | `health_issue` | **enabled** | `01a043ab-4edd-...` |
| `error_tracking` | `issue_created` | **enabled** | `01a043ab-555c-...` |
| `error_tracking` | `issue_reopened` | **enabled** | `01a043ab-5844-...` |
| `error_tracking` | `issue_spiking` | **enabled** | `01a043ab-5bf2-...` |
| `session_replay` | `session_analysis_cluster` | **enabled** (sample\_rate 0.1) | `01a043ab-61bf-...` |
| `conversations` | `ticket` | **enabled** (dormant until channel connected) | `01a043ab-652e-...` |
| `replay_vision` | — | self-authorizing via scanner `emits_signals` flag — no row created | — |
| `llm_analytics` | — | skipped — not a v1 responder | — |
| `logs` | — | skipped — not a v1 responder | — |

## Connected tools

User cancelled the connected-tools question — no external issue trackers, support desks, or security scanners were connected.

| Tool | Status |
|---|---|
| GitHub Issues | not used (skipped) |
| Linear | not used (skipped) |
| Jira | not used (skipped) |
| Sentry | not used (skipped) |
| Zendesk | not used (skipped) |

## Scout troop

Budget: **100 runs/day** (early access default; 0 used today). Max 3 per tick. Banner: "Scouts are in early access. Each project gets up to 100 scout runs a day. Contact team-self-driving@posthog.com if you need more."

### Enabled (5)

| Scout | Why enabled |
|---|---|
| `general` | Always on — cross-product correlations, surfaces no specialist covers |
| `product-analytics` | Custom funnel events (`fake_door_click`, `fake_door_view`, `panel_banner_click`) + core ecommerce product analytics surface |
| `web-analytics` | Ecommerce site with PLP/PDP/checkout traffic — channel health and landing-page regressions are actionable |
| `feature-flags` | Active fake-door experiment (at-1a-1) uses flag patterns; Stream B experiments planned |
| `web-vitals` | Next.js app; posthog-js v1.421.2 auto-captures `$web_vitals`; LCP/INP/CLS directly affect conversion on PDP/PLP |

### Disabled (22)

| Scout | Reason |
|---|---|
| `error-tracking` | Covered by the native error\_tracking source (intentional — not a re-enable follow-up) |
| `session-replay` | Covered by the native session\_replay source (intentional — not a re-enable follow-up) |
| `surveys` | No surveys in use |
| `revenue-analytics` | No payment SDK detected |
| `ai-observability` | No LLM/AI analytics |
| `logs` | Logs product not in use |
| `csp-violations` | No CSP reporting configured |
| `experiments` | No formal A/B experiments yet (fake-door uses flag patterns, not PostHog experiments) |
| `customer-analytics` | B2C ecommerce — no group/account analytics |
| `data-pipelines` | No CDP destinations or hog flows |
| `replay-vision` | Reads trends across accumulated observations — no observations yet; enable later once scanners accumulate data |
| `anomaly-detection` | No saved insights/dashboards yet to baseline against |
| `observability-gaps` | Low-volume project just starting — enable once event volume grows |
| `health-checks` | Health issues surface via the native health\_checks source; scout adds no additional coverage yet |
| `inbox-validation` | No shipped fixes to validate yet — not appropriate for a fresh setup |
| `conversations` | No support ticket volume yet |
| `apm` | No OpenTelemetry/distributed tracing |
| `data-warehouse` | No data warehouse sources connected |
| `skills-store` | Hygiene scout — not a priority now |
| `mcp-tool-calls` | No MCP tool-call telemetry |
| `tasks` | No agent tasks to monitor |
| `insight-alerts` | No insight alerts configured yet |

Re-enable any surface-specific scouts from the inbox when that surface becomes active.

## Custom scouts

Gap analysis performed against the five enabled built-in scouts.

**Candidate proposed:**

| Candidate | Surface | Filter that passed | Outcome |
|---|---|---|---|
| Seller fake-door funnel | `fake_door_view` → `fake_door_click` conversion (8% success threshold) | Watchable, uncovered by built-in troop (product-analytics only watches saved funnels; none exist yet), clear discriminator | Declined / cancelled by user |

**Surfaces considered and ruled out:**

- **Ecommerce cart/checkout funnel** — ruled out: no confirmed custom cart/add-to-cart/purchase events in the codebase (only autocaptured pageviews). Not watchable yet.
- **Wishlist engagement** — ruled out: no confirmed custom events beyond local-state UI logic.

**Note:** If the fake-door test ramps up with real traffic, a custom scout watching `fake_door_view` → `fake_door_click` conversion against the 8% threshold would be the highest-value addition to the troop. To activate it, rerun the self-driving setup or create a new `signals-scout-seller-fakedoor-funnel` skill directly.

If a custom scout turns noisy, set `emit: false` on its config in PostHog to switch it to dry-run without disabling it entirely.

## Replay Vision scanners

A scanner is an LLM that watches individual session recordings on a schedule and pushes what it finds to the inbox. Findings arrive at half weight — a single finding needs corroboration before it is promoted into a report.

**Note:** The sizing skill (`creating-replay-vision-scanners`) was unavailable on this deploy, so projected credit spend was not formally verified. Both briefs are deliberately small and scoped, so spend is expected to be minimal. Each observation costs 5 credits.

No session recordings exist yet. Both scanners are armed and will start working the day recordings begin — no second setup needed.

| Scanner | Type | Query scope | sampling\_rate | emits\_signals | ID |
|---|---|---|---|---|---|
| FashionHero checkout and product breakage | monitor | Sessions visiting `/checkout` or `/products/` URLs | 0.5 | ✓ | `01a043b4-36ff-...` |
| FashionHero shopper frustration | monitor | Sessions containing a `$rageclick` event | 1.0 | ✓ | `01a043b4-469e-...` |

**Breakage monitor** watches the completion flow (product pages + checkout) for visible product failures: cart drawer not opening after add-to-cart, checkout form fields not accepting input, product images failing to load, size/color selectors doing nothing, or unresolvable loading states. Scoped to `/checkout|/products/` URL pattern.

**Frustration monitor** watches all rage-click sessions project-wide for genuine shopper struggle: hammering a size option that won't select, retrying the add-to-cart button when the cart is slow to open, repeating filter combinations that produce no results, or clicking checkout repeatedly on a form with a hidden validation error.

The two monitors are disjoint: breakage owns *where* (URL scope); frustration owns *what they did* (`$rageclick` gate).

## Follow-ups

- [ ] **Connect a Conversations inbound channel** — Go to PostHog → Support → connect email, inbox, or Slack so tickets start flowing to the Conversations source (currently dormant).
- [ ] **Verify GitHub repo access** — In the GitHub App settings, confirm `biazikprzemek-arch/fashion-hero-shop` is among the repos granted to the PostHog app (installed as `pbiazik1`).
- [ ] **Create a fake-door funnel in PostHog** — Build a saved funnel `fake_door_view → fake_door_click` in PostHog Insights so the `product-analytics` scout has a saved flow to watch. This makes the at-1a-1 conversion rate visible to the scout automatically.
- [ ] **Credit spend verification** — The `creating-replay-vision-scanners` sizing skill was unavailable on this deploy. Verify Replay Vision credit budget manually in PostHog → Replay Vision settings.
- [ ] **Enable `signals-scout-seller-fakedoor-funnel`** (optional) — If seller traffic grows, add a custom scout for the fake-door funnel to track `fake_door_view → fake_door_click` conversion vs the 8% threshold.
- [ ] **Enable `signals-scout-anomaly-detection`** once you have saved insights and dashboards — it baselines against existing insights, so it's most useful after a few weeks of data.

## What happens next

The scout coordinator picks up fresh configs within ~30 minutes. Each enabled scout runs once a day (1440-minute interval), drawing from the 100-run daily budget. Findings cluster into reports in the inbox at [https://us.posthog.com/project/580437/inbox](https://us.posthog.com/project/580437/inbox) — immediately-actionable ones can start coding tasks automatically.

Replay Vision scanners sweep every 5 minutes once recordings exist. Each finding arrives at half weight; a report is promoted when it reaches a full one (corroboration from two independent observations).
