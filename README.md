# Gund Thermal Commons · v6

Static multi-page prototype for the VIS 2478 final review. The project simulates how thermal discomfort moves from private sensation to public signal, then to institutional interpretation and action.

## Pages

```text
thermalcomfort/
├── index.html                 landing page
├── user.html                  USER mode
├── operator.html              OPERATOR mode
├── decision.html              DECISION-MAKER mode
├── live.html                  live room-scale results dashboard
├── about.html                 system framing and methodology
├── shared.css                 shared visual system, fonts, tokens
├── shared.js                  shared nav, sample data, scenario math
├── prism.js                   landing prism animation
├── gund_model_methodology.md  longer methodology notes
├── Dockerfile
└── README.md
```

## How To Run

Open `index.html` in a modern browser.

- No build step is required.
- Most of the site is static HTML/CSS/JS.
- `live.html` and part of `decision.html` depend on Supabase being reachable.

## Current Architecture

- `index.html` is the landing page that routes visitors into the three main views.
- `user.html` focuses on sensation, visibility, and low-friction voting.
- `operator.html` frames aggregated signals as facilities-facing operational evidence.
- `decision.html` contains the governance/game layer and now writes session data to Supabase.
- `live.html` reads from Supabase and shows room-scale before/after choice shifts plus persona distribution.
- `shared.css` defines the current type system and tokens:
  - `Roboto Mono` for display and headings
  - `Inter` for body text
- `shared.js` contains the pill nav, sample values, and shared scenario logic used across the prototype.

## Live Data Flow

`decision.html` now records live review sessions to the `live_sessions` table.

On the decision page:

- selecting a persona and making the first Round 1 choice inserts:
  - `persona_value`
  - `persona_method`
  - `persona_name`
  - `baseline_choice`
  - `is_review_session`
- making the final re-choice in Section 04 updates the same row with `final_choice`
- the session id is stored in `sessionStorage` as `thermalSessionId`

`live.html` then:

- selects rows from `live_sessions`
- filters to `is_review_session = true`
- renders before/after choice distributions
- renders the 2×3 persona heatmap
- subscribes to `postgres_changes` for realtime refresh

## Supabase Requirements

The current live integration expects:

- a Supabase project with `live_sessions`
- front-end access via the anon/publishable key
- `select`, `insert`, and `update` policies for the `anon` role
- Realtime enabled for `live_sessions` if you want auto-refresh instead of manual reload

At the moment, the likely failure point is policy configuration, not front-end wiring. If baseline choices appear but final choices do not, `update` is usually blocked by RLS.

## What Is Live Vs Mock

Live now:

- `decision.html` baseline choice logging
- `decision.html` final re-choice logging
- `live.html` aggregation of current room sessions
- realtime subscription logic in `live.html`

Still mock / simulated:

- USER mode vote totals and tray history
- OPERATOR heatmap and ticket queue
- most operational action logs
- many scenario outcome values and future-state narrative branches

## Research / Fixed Inputs Still Used

- perceived comfort gap: about `-4.1°F`
- complaint loop timing references from earlier project work
- tuition anchor logic in `shared.js`
- stakeholder framing and coalition logic in decision mode

## Visual System

- brand colors:
  - orange `#DC8116`
  - blue `#2E47CC`
- mode accents:
  - USER warm/cold
  - OPERATOR teal `#0F8C7B`
  - DECISION purple `#3C3489`
- `live.html` now uses the same shared font system as the rest of the site instead of loading a separate display stack

## Notes

- This repo is intentionally lightweight and presentation-first.
- It is best understood as a review prototype, not a production application.
- If the live dashboard appears disconnected, check Supabase table policies before changing the front-end code.
