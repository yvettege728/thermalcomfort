# Gund Thermal Commons · Model Methodology

**VIS 2478 · Project 3 · Wightman / Ge / Lock / [Yvette]**

A complete reference of every formula, parameter, and judgment rule used in the model — written so any number on the dashboard can be traced to its source in under a minute.

---

## 0 · How to read this document

The model has **two kinds of computation** and they are often confused in defense:

| Kind | What it does | Example |
|---|---|---|
| **Quantitative formulas** | Mechanical: take fixed inputs and produce numbers via algebra | **Example:** M04 (response days) baseline = 18 days. Phase 2 effect = −9 to −13 days. If slider = 100%, result = 18 − 11.5 (midpoint) = 6.5 days. The math is reproducible and verifiable. |
| **Judgment rules** | Design choices: encode a weighting or threshold that requires **defending as a position**, not deriving as fact | **Example:** We chose tuition value (not steam savings) as the ROI numerator. This is not inevitable — a different team would argue for steam savings. We defend it because it reframes comfort from "operations expense" to "tuition fulfillment issue." |

**In defense, the distinction is critical.** Formulas get verified ("show me the math"); judgment rules get contested ("why that choice and not another?"). A robust answer requires you to clearly signal which is which.

This document is organized as:
- §1 The five metrics (what we measure)
- §2 The four formulas (how numbers are produced)
- §3 The judgment rules (where we made calls)
- §4 Behind the numbers: data sources and epistemic limits (where inputs come from; what is and isn't claimed)

---

## 1 · The five metrics

These are the model's **dependent variables** — the things we claim our intervention moves. They form a causal chain: **M02 → M03 → M04 → M01**, with **M05** as the slow-moving institutional outcome.

| ID | Name | Unit | Baseline | What it measures | Why it's a feedback-loop metric, not a comfort metric |
|---|---|---|---|---|---|
| **M01** | Perception gap | °F | −4.12 | Mean signed gap between perceived and ambient temperature (P2 survey, n=49) | Closes only as a **downstream** effect of M02–M04. Comfort proxy, not comfort itself. |
| **M02** | Isolation | % | 70 | % of users who believe "I am the only one feeling cold/warm" | Direct measure of the **invisible commons** — drops when plurality becomes visible. |
| **M03** | Friction | seconds | 300 | Median time to register a thermal complaint | Direct measure of **voicing cost** — drops when the QR vote replaces a 5-minute work-order form. |
| **M04** | Response | days | 18 | Median time from complaint to visible facilities action | Direct measure of **loop closure** — drops when prioritized tickets replace ad-hoc handling. |
| **M05** | Trust index | 0–100 idx | 100 | Composite of survey items on perceived institutional responsiveness | Slow-moving; M05 confirms whether M01–M04 changes have produced an institutional shift. |

**The causal claim** — and this is the model's central theoretical commitment:

> M02 (isolation) and M03 (friction) drop first, because the QR vote and the public dashboard remove the conditions that produce them.
> M04 (response time) drops second, because facilities now have prioritized aggregated signal instead of individual complaints.
> M01 (perception gap) drops last, because perception is recalibrated once people see the building responding.
> M05 (trust) drifts with M01–M04 over months, not days.

If a reviewer asks "why don't you measure comfort directly?" — the answer is: **comfort is the symptom; the model treats the upstream information failure**. Measuring comfort directly would replicate the diagnostic frame we are trying to displace (it is the engineering-failure framing).

---

## 2 · The four formulas

### 2.1 · Tuition-hour anchor

**Used in:** R5 (Consequence) across all three modes — USER ($/week), OPERATOR ($/month), DECISION ($/year).

**Formula:**
```
$/hour = $90,000 ÷ 10 months ÷ 22 days ÷ 8 hours ≈ $51.14
recovered_value = hours_recovered × $51.14
```

**Parameters:**

| Constant | Value | Source |
|---|---|---|
| GSD annual tuition | $90,000 | GSD published 2025–26 rate (approximate) |
| Months in academic year | 10 | Standard academic calendar |
| Working days per month | 22 | Standard convention |
| Studio hours per day | 8 | Standard convention |

**What this formula claims:** Each hour a student spends thermally uncomfortable is one hour of paid-for-but-unusable studio time. The choice of tuition (rather than e.g. minimum wage, or steam cost) is **a design ethic, not an empirical measurement** — see §3.1.

**Cross-mode example:**
- USER mode: 47 h/week × $51.14 ≈ $2,400/week per voter cohort
- OPERATOR mode: 8,400 h/month × $51.14 ≈ $429k/month at full deployment
- DECISION mode: 100,000 h/year × $51.14 ≈ $5.1M/year

---

### 2.2 · Metric projection (What If sliders)

**Used in:** DECISION mode, R2 (the three sliders that project metric outcomes).

**Formula:**
```
Δ_low(m)  = Σᵢ ( e[m].pᵢ.low  × sliderᵢ ÷ 100 )    for i ∈ {1,2,3}
Δ_high(m) = Σᵢ ( e[m].pᵢ.high × sliderᵢ ÷ 100 )
predicted_range(m) = [ baseline(m) + Δ_low , baseline(m) + Δ_high ]
```

**Parameters — the effect matrix `e[m]`:**

| Metric | P1 (Sensing) | P2 (Voicing) | P3 (Governing) |
|---|---|---|---|
| M01 (°F) | +1.5 to +2.5 | +1.0 to +2.0 | +0.5 to +1.0 |
| M02 (%) | −15 to −25 | −30 to −45 | −5 to −10 |
| M03 (sec) | 0 to 0 | −200 to −290 | −10 to −30 |
| M04 (days) | −1 to −2 | −9 to −13 | −3 to −5 |
| M05 (idx) | +0.5 to +1.5 | −1 to −2 | −3 to −8 |

**Sign convention:**
- M01: **positive** Δ = gap closes toward zero (current baseline is −4.12 °F)
- M02, M03, M04: **negative** Δ = improvement
- M05: **negative** Δ from a baseline of 100 = trust **decreases**; reading the values, P2 and P3 push M05 further negative, which is presented in the dashboard as recalibration of inflated baseline trust during participation. **This is a judgment call worth flagging in defense — see §5.**

**What the sliders represent:** Each slider is a 0–100% deployment intensity for one phase. At slider = 100, that phase's full effect range applies. Sliders are linear in deployment, not in time.

**Where the deltas come from:** Combination of (a) literature-informed effect sizes, (b) GSD survey n=49, (c) stakeholder reaction interviews. The deltas are **ranges, not point estimates**, to make uncertainty explicit. See §4.

---

### 2.3 · Coalition score

**Used in:** DECISION mode R3, the 8-stakeholder × 3-scenario heatmap.

**Formula:**
```
payoff[s, scenario]   = Σ_d ( impact[scenario, d] × care[s, d] )
coalition[scenario]   = Σ_s ( payoff[s, scenario] )
```

Where:
- `s` ∈ 8 stakeholders
- `d` ∈ 6 dimensions: Fixed Cost, Variable Cost, Comfort, Productivity, Coordination, Efficiency
- `impact[scenario, d]` ∈ {−2, −1, 0, +1, +2} — how much the scenario changes that dimension
- `care[s, d]` ∈ {0, 0.5, 1} — how much that stakeholder cares about that dimension

**Actual coalition scores in the model (from `shared.js`):**

| Stakeholder | S01 (Status quo) | **S02 (Sensing + Voicing)** | S03 (Full + Governing) |
|---|---|---|---|
| GSD Students | −3 | +3 | +3 |
| GSD Staff | −3 | +3 | +2 |
| Faculty / Studio Coord. | −3 | +3 | +2 |
| Facilities & Campus Ops | +3 | 0 | −2 |
| Office of Sustainability | +2 | +1 | 0 |
| Securitas | −2 | +2 | +1 |
| GSD Dean / Leadership | 0 | +2 | 0 |
| Broader Society | +2 | +1 | +1 |
| **Coalition total** | **−4** | **+12** | **+7** |

**The recommendation logic:** S02 is recommended **not because it has the highest ceiling** (S03 has more comfort hours) but because it has **no veto-strength opposition** — no cell darker than 0. S03 has Facilities at −2, which under realistic political conditions is a coalition-killer.

**This is a judgment-rule output, not an empirical prediction** — see §3.2.

---

### 2.4 · ROI ratio (S02 vs S03 comparison)

**Used in:** DECISION mode R5 (Annual Outlook). **This is where the two scenarios are directly compared.**

**Formula:**
```
ROI = tuition_value_recovered ÷ implementation_cost
    = (annual_hours_recovered × $51.14) ÷ implementation_cost
```

**S02 (Sensing + Voicing, RECOMMENDED):**
```
ROI(S02) = (100,000 h × $51.14) ÷ $80,000
         ≈ $5.114M ÷ $80,000
         ≈ 64 : 1
```

**S03 (Sensing + Voicing + Governing, FULL DEPLOYMENT):**
```
ROI(S03) = (130,000 h × $51.14) ÷ $140,000
         ≈ $6.648M ÷ $140,000
         ≈ 47 : 1
```

**The comparison (this is the strategic insight):**

| Scenario | Annual hours | Implementation cost | Annual value | ROI | Coalition total | Why recommended? |
|---|---|---|---|---|---|---|
| **S02** | 100,000 | $80,000 | $5.1M | **64:1** | **+12** | Higher ROI per dollar; stronger political coalition (no veto-opposition) |
| **S03** | 130,000 | $140,000 | $6.6M | 47:1 | +7 | Higher absolute comfort value; but weaker coalition (Facilities = −2) |

**The crucial move:** S03 produces MORE comfort hours (30k additional), but at a HIGHER cost ($60k more), reducing ROI from 64:1 to 47:1. More importantly, **S03's coalition score drops from +12 to +7** — Facilities moves from neutral (0) to opposition (−2), because P3 governance (the Thermal Council) redistributes decision-making power away from their domain.

**What this formula claims:** If you deploy S02 fully, you recover ~100,000 comfort hours annually against an $80k implementation cost. If you deploy S03, you recover ~130,000 hours against $140k cost. Both are positive ROI; S02 is more efficient per dollar and politically more durable.

**What this formula does NOT claim:**
- That the additional 30,000 hours from S03 are worth the political cost of losing Facilities coalition support.
- That $140k is the "true cost" of P3 — it's an **estimate** (see §4 for data source caveat).
- That ROI is the only decision metric — coalition durability and institutional legitimacy matter equally.

**The strategic framing:** "S02 is the proposal that maximizes both financial efficiency AND political coalition. S03 achieves higher comfort impact but at the cost of institutional friction and reduced ROI per dollar."

---

## 3 · The judgment rules (where we made calls)

These are not formulas — they are **designed parameters** that encode our position. In defense, do not pretend they are derived; defend them as choices.

### 3.1 · The tuition-hour anchor as a numerator

**The choice:** Translate hours of discomfort into tuition dollars rather than energy savings.

**Why this is defensible:**
- Steam savings (~$3k/yr) is real but trivial. Using it as the numerator means the project costs more than it saves and would not get approved.
- Tuition value recovered names what is **actually being lost** in the current state — paid-for studio time that is unusable due to thermal discomfort.
- It reframes thermal comfort from an operations expense into a **tuition fulfillment** issue, which is the language Dean-level decision makers use.

**Why it is attackable:**
- Tuition is paid regardless. Critics will say "no money is actually recovered — students still pay $90k whether or not they're cold."
- **Counter:** the framing is institutional value, not cash flow. A school that delivers paid-for studio time at 88% utilization vs. 100% has a real fulfillment gap, even if no dollars move.

### 3.2 · The −2 to +2 impact scale and 0 / 0.5 / 1 care weights

**The choice:** Discretize stakeholder politics into a 5-step impact scale × 3-step care weights.

**Why this is defensible:**
- The scale is meant to encode **directional and magnitude judgments**, not measure them. It makes the political reasoning **legible and contestable** rather than hidden.
- Three-step care weights (low / mid / high) prevent false precision — we do not claim to know that Faculty cares about Comfort 0.73 vs 0.79.

**Why it is attackable:**
- The values were assigned by the team based on stakeholder interviews and inference, not by surveying stakeholders directly. Different teams would assign different values.
- **Counter:** the model's value is in making the assignments **visible and editable** — the heatmap is a discussion tool, not an oracle. A reviewer who disagrees with a cell can change it and rerun the coalition total.

### 3.3 · The cumulative phase structure (P1 ⊂ P2 ⊂ P3)

**The choice:** Phases are cumulative, not alternative — P2 includes everything in P1, P3 includes everything in P1 and P2.

**Why this is defensible:**
- Each phase **builds the conditions** for the next. P3 (Thermal Council) cannot function without the data infrastructure from P1 and the participation norms from P2.
- A non-cumulative framing would make P3 "Governing" land in an environment with no sensing or voicing — which is the failure mode of conventional governance interventions.

**Why it is attackable:**
- A reviewer might ask: "Could P3 work *without* P2? Direct governance without crowd voting?" — i.e. is P2 essential or just a sequencing convenience?
- **Honest answer:** P2 is essential because the council needs **legitimacy of representation** that only comes from visible participation data. Without P2, the council is just another committee.

### 3.4 · "Comfort hours" as the unit, not "thermal complaints resolved"

**The choice:** Aggregate the model's output as comfort hours, not as ticket count.

**Why this is defensible:**
- Comfort hours is a **continuous, integrable** measure. It captures both how many people are affected and how long the discomfort lasts.
- Ticket count rewards **complaint generation**, which is exactly the dynamic we want to displace.

**Why it is attackable:**
- Comfort hours is itself a constructed unit; we don't actually measure each occupant's comfort each hour.
- **Counter:** It is a **modeled** quantity, computed from voting data × time × occupancy. We claim the model, not the measurement.

---

## 4 · Behind the numbers: Data sources and epistemic limits

This section does two things: (1) reveals where every input comes from, and (2) is honest about what the model does and does not claim. These go together — a number's credibility depends on its source.

### 4.1 · The data sources (where numbers come from)

| Input | Source | Status | Confidence |
|---|---|---|---|
| Baseline M01 (−4.12 °F gap) | P2 survey, n=49, dumbbell chart | **Empirical, ours** | High — direct measurement |
| Baseline M02 (70% isolation) | P2 survey item: "do you think others feel this too?" | **Empirical, ours** | Medium — self-report, subject to social desirability bias |
| Baseline M03 (300 sec friction) | Estimated from GSD work-order form completion time (observed, not timed) | **Estimated, defensible** | Low–Medium — rough estimate, needs validation |
| Baseline M04 (18 days response) | Facilities stakeholder interview (Ben Szalewicz) | **Stakeholder-reported** | Medium — anecdotal, not systematically measured |
| Baseline M05 (100 idx) | Convention — set as baseline to make % drift readable | **Designed normalization** | N/A — arbitrary but transparent |
| GSD steam cost ($454k/yr) | Harvard Capital Planning Office | **Empirical, third-party** | High — institutional data |
| GSD gross sq ft (200,000) | Harvard Capital Planning Office | **Empirical, third-party** | High — architectural data |
| GSD tuition ($90k/yr) | GSD published 2025–26 rate | **Empirical, public** | High — official source |
| Effect matrix `e[m]` ranges (±2 to ±45 deltas per phase) | Literature blend + GSD P2 survey + stakeholder reaction interviews | **Modeled, literature-anchored** | Low–Medium — ranges, not point estimates; see §3 for judgment rules |
| S02 / S03 coalition scores (8 × 3 matrix) | Team judgment from Ben, Mike, Trevor interviews | **Designed, contestable** | Low — not surveyed; our inference from limited interviews |
| Implementation costs ($80k S02, $140k S03) | Bottom-up cost estimate (QR equipment, dashboard hosting, council time) | **Estimated, our own** | Low–Medium — not bid out; subject to change |
| Occupant count (500 people) | Rough estimate from Securitas data + class schedules | **Estimated, unvalidated** | Low — needs institutional confirmation |
| Closure efficiency (56%) | Literature-anchored (see 56_percent_anchor.md) | **Modeled, literature-grounded** | Medium — not measured from Gund; from behavioral intervention literature |

**Summary:**
- **High confidence (green zone):** Baselines from P2 survey; third-party data (Harvard CPO, GSD budget)
- **Medium confidence (yellow zone):** Stakeholder interviews; effect ranges from literature; closure efficiency
- **Low confidence (red zone):** Coalition scores; implementation costs; occupant count

### 4.2 · What the model claims

The model makes four main **positive claims**:

1. **The intervention will move five metrics in a specified direction, in a specified order:**
   - M02 (isolation) and M03 (friction) drop first (Phase 1–2), because the QR vote and public dashboard remove the conditions producing them.
   - M04 (response time) drops second (Phase 2–3), because facilities now have prioritized signal.
   - M01 (perception gap) drops last, because perception recalibrates once the building responds.
   - M05 (trust) drifts slowly with M01–M04 over months, not days.

2. **The political coalition for S02 is broader than for S01 or S03**, defined as the absence of veto-strength opposition (no cell darker than 0 in the coalition heatmap).

3. **The recovered tuition value at S02 deployment is on the order of ~$5M/year at 64:1 ROI**, versus S03's $6.6M at 47:1 ROI.

4. **Phases are cumulative and necessary** — P3 (Thermal Council) cannot function without the data and participation infrastructure from P1 and P2.

### 4.3 · What the model does NOT claim

1. **Exact effect sizes.** All metric deltas are ranges, not point estimates. A slider = 100% in Phase 2 produces M03 improvement in the −200 to −290 second band, not a single value.

2. **That comfort is directly measured.** M01–M05 are **feedback-loop metrics**. They measure information environment health (visibility, friction, response time, trust). Comfort is the downstream symptom, not the model's direct output. We deliberately avoided direct comfort measurement because measuring comfort directly would replicate the engineering-failure diagnostic frame we are trying to displace.

3. **That stakeholder care weights are surveyed.** The coalition score matrix encodes team inference from three brief interviews (Ben Szalewicz, Mike Smith, Trevor O'Brien). A different team would assign different values. The matrix's value is **legibility and contestability**, not accuracy.

4. **That the model is predictive in a frequentist sense.** It is a **structured projection** under stated assumptions. It is not a forecast with 95% confidence intervals. It answers "if we deploy S02 with 100% fidelity, what is a plausible outcome?" not "what will happen in 2027?"

5. **That steam savings is the primary benefit.** The argument is comfort, with energy as a side benefit. Using steam savings as the numerator produces ~0.04:1 ROI, which would not justify the project.

### 4.4 · Known weaknesses (own them in defense)

**Weakness 1: M05 trust drifts negative in P2 and P3**

The effect matrix shows M05 deltas of −1 to −2 (Phase 2) and −3 to −8 (Phase 3). This means "expressed institutional trust decreases."

**Why this is counterintuitive:**
A reviewer's first reaction: "You're lowering people's trust in the institution? That's bad!"

**Why this is actually defensible:**
The model assumes that **participation raises expectations**. Once students and staff have a voice in the Thermal Council, they become more critical of the institution's overall responsiveness — not just thermal comfort, but resource allocation, transparency, speed of decision-making. Expressed trust drops because **critical engagement rises**. This is consistent with theories of institutional legitimacy: legitimacy requires both performance *and* critical accountability. The dashboard and council create conditions for the latter, which appears (in surveys) as **lower expressed trust but higher participatory legitimacy**.

**How to defend this in Q&A:**
"M05 captures expressed trust via survey items. When we give people voice in governance, their expectations rise faster than institutions can meet them. So expressed trust can dip while participatory legitimacy increases. This is a sign the system is working — it has enabled people to be more critically engaged with the institution."

**Weakness 2: Coalition scores are inferred, not surveyed**

The 8 × 3 score matrix comes from three interviews, not a formal stakeholder survey. Different teams would produce different matrices.

**How to defend this:**
"The coalition matrix is not meant to be accurate; it's meant to be **legible and contestable**. Its value is showing that S02 has no veto-strength opposition. If you disagree with a cell — say, you think Facilities is −2 instead of 0 — you can change it and recompute the coalition total. The matrix is a discussion tool, not an oracle. It shows the *logic* of political viability, not a fact."

**Weakness 3: Implementation costs are estimated, not bid**

$80k for S02 and $140k for S03 are bottom-up estimates, not contractor quotes. Real procurement could move these numbers.

**How to defend this:**
"The costs are defensible as order-of-magnitude estimates: QR hardware (~$15k), dashboard hosting (~$5k/yr × 3 yr), council facilitation (~$20k/yr). S03 adds BAS integration (~$30k) and cross-school coordination (~$30k/yr). The important point: even at 2× cost ($160k for S02), the 64:1 ROI drops to 32:1, still very strong. The model is robust to cost uncertainty."

**Weakness 4: Occupant count (500) is rough and unvalidated**

The monthly hours calculation (500 × 7 h/wk × 4.3 wk/mo × 56%) depends on a ballpark occupant estimate. Gund could have 350 or 700 regular occupants depending on how you count.

**How to defend this:**
"The 500 is an order-of-magnitude working number from Securitas observations and class schedules. It needs institutional confirmation. Importantly, ROI scales linearly with occupant count — if actual occupancy is 700, the hours and ROI both scale up proportionally. This is not a fragile assumption."

**Weakness 5: The 56% closure efficiency is modeled, not measured from Gund**

We don't have real data on how many Gund occupants would participate in the QR vote or how many votes would trigger actual facilities response.

**How to defend this:**
See the companion document `56_percent_anchor.md`, which anchors 56% in four streams of behavioral intervention literature. The number is conservative; actual closure could be 65–70% with strong institutional commitment. Even at 40%, ROI stays >30:1.

### 4.5 · Epistemic posture (what to say when cornered)

If a reviewer asks: "How confident are you in these numbers?" — here is a tier-based answer:

> "High confidence (80–90%): The baselines from our P2 survey and institutional data sources. We directly measured the perception gap at −4.1°F and found 70% isolation.
>
> Medium confidence (50–70%): The effect ranges from Phase 1–3. These are literature-anchored but not Gund-tested. They represent plausible deltas based on feedback intervention science and change management, not predictions.
>
> Low confidence (30–50%): The specific coalition scores and implementation costs. These are team inference and estimates. Their value is in showing the **structure of the argument** — why S02 wins over S01 and S03 — not in their precision.
>
> What I'm very confident about: If you implement S02 with reasonable fidelity, comfort hours will increase, isolation will decrease, and response time will drop. The specific magnitudes could be off by 20–30%, but the direction and the order are defensible. That's what matters for decision-making."

---

## 5 · The defense one-liner

> "The model has four formulas and three judgment rules. The formulas — tuition anchor, metric projection, coalition score, ROI — are mechanical and reproducible. The judgment rules — what we put in the numerator, how we discretize stakeholder politics, why phases are cumulative, and why we measure feedback-loop metrics instead of comfort — are choices we are accountable for. 
>
> Every number on the dashboard traces back to one of those four formulas applied to one of those three judgment rules. High-confidence inputs come from our P2 survey and institutional data. Medium-confidence inputs come from literature-anchored effect ranges and stakeholder interviews. Low-confidence inputs (coalition scores, costs) are estimates whose value is in showing the **structure of the argument**, not in their precision.
>
> The key claim: if you deploy S02 (Sensing + Voicing) with reasonable fidelity, the comfort hours recovered will be on the order of $5M at 64:1 ROI, and the political coalition will have no veto-strength opposition. S03 creates more comfort hours but at higher cost, lower ROI, and fatal coalition loss (Facilities opposition). This is why S02 is recommended.
>
> There is no hidden math."

---

*Last updated: defense-prep cycle. Use alongside `about.html` §06 and `shared.js`.*
