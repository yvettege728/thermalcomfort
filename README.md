# Gund Thermal Commons · v6

Three-mode interactive prototype for VIS 2478 final review.

## Files

```
v6/
├── index.html        ← landing (3 mode entries)
├── user.html         ← USER mode (occupant)
├── operator.html     ← OPERATOR mode (facilities)
├── decision.html     ← DECISION mode (Dean / Sustainability)
├── about.html        ← about page (replaces 'manifesto')
├── shared.css        ← visual system, fonts, color tokens
├── shared.js         ← R5 anchoring math, sample data, what-if model
└── README.md         ← this file
```

## How to view

Open `index.html` in any modern browser. No build step. No backend.

## Visual system

- Fonts: Orbitron (display) + Rajdhani (h2/h3) + Inter (body) — loaded from Google Fonts
- Brand colors: orange `#DC8116` and blue `#2E47CC`
- Mode accents: USER warm/cold gradient, OPERATOR teal `#0F8C7B`, DECISION purple `#3C3489`
- All R5 Consequence cards use brand orange to signal cross-mode pressure

## Three mechanisms in the design

1. **Visible plurality** — USER mode brick stack + alone-line + history bar
2. **Friction reduction** — 5-tier vote one tap; OPERATOR one-click admin actions
3. **Social norms** — public response time visible across modes
4. **Loss aversion + Anchoring** — R5 in every mode, scaled (weekly → monthly → annual)

## What's still mock

- All vote data (12 seed votes in USER, fake heatmap in OPERATOR)
- Tickets queue
- Building heatmap arrangement
- Trend numbers in DECISION dimensions

## What's real (from earlier project work)

- −4.1°F perception gap (P2 survey)
- 18-day complaint loop time (P2 survey)
- Stakeholder names and roles (project research)
- Coalition scores (today's heatmap design)
- Whatif scenario logic (inherited from v5, baselines updated)
- Tuition anchor: $90k / 10mo / 22d / 8h ≈ $51/hr
