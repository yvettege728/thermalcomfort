/* =========================================================================
   GUND THERMAL COMMONS · v6
   shared.js — sample data, R5 anchoring math, mode logic
   ========================================================================= */

// ---- tuition anchoring constants ----------------------------------------
const TUITION_PER_YEAR  = 90000;   // GSD approximate (2025–26 published rate)
const TUITION_PER_HOUR  = TUITION_PER_YEAR / 10 / 22 / 8;  // ~$51.14

// $/hour is what makes the design ethic legible:
// $90k / 10 mo / 22 d / 8 h = $51.14 per "tuition hour"
// One hour of thermal discomfort = $51.14 of paid-but-unusable time.

// ---- GSD operating cost reference (Harvard Capital Planning data) -------
// GSD annual steam cost is what is currently being spent regardless of
// any intervention — a fixed institutional cost, not zero.
const GSD_ANNUAL_STEAM_COST = 453612;   // USD/yr · source: Harvard Capital Planning Office
const GSD_GSF               = 200000;   // gross sq ft · source: Harvard Capital Planning Office

// ---- sample data (mock for prototype) -----------------------------------
const SAMPLE = {
  user: {
    // 7 h/week ≈ one studio-day per voter recovered if their tray's
    // discomfort signal resolves promptly. Modeled from P2 survey median
    // (≈4–10 h/wk reported as "wasted to layering up / leaving the building").
    weekly_hours_recovered: 7,
    weekly_steam_saved:     3.20,   // USD · co-benefit only (intentionally small)
  },
  operator: {
    // ~500 occupants × 7 h/wk × 4.3 wk/mo ≈ 15k h potential
    // 8,400 h = ~56% of theoretical max once feedback loop is closed
    monthly_hours_recovered: 8400,
    monthly_steam_saved:     420,
    avg_response_days:       6,
    pct_closed:              78,
    open_tickets: [
      { zone: 'L03 W', desc: 'Cold cluster sustained 4h, n=12 votes',  meta: '2h ago' },
      { zone: 'L04 E', desc: 'Warm spike, single zone',                 meta: '40min ago' },
      { zone: 'L02 S', desc: 'Mixed signal, low confidence',            meta: 'this morning' },
    ],
    // 5 trays x 6 zones (rough), values from -2 (very cold) to +2 (very warm)
    heatmap: [
      // zones:   N    NE   E    SE   S    W
      /*L05*/  [  0,   0,   0,   0,   0,   0  ],
      /*L04*/  [  0,   1,   2,   1,   0,  -1  ],
      /*L03*/  [ -1,  -1,   0,   0,  -1,  -2  ],
      /*L02*/  [  0,   0,  -1,   0,   1,   0  ],
      /*L01*/  [  0,   0,   0,   0,   0,   0  ],
    ],
    // Mock log of recent operator actions — surfaced to USER mode to close
    // the loop visibly ("you voted, here is what was done"). Newest first.
    recent_actions: [
      { actor: 'Bill', verb: 'rerouted steam at L03 W riser', minutes_ago: 45 },
      { actor: 'Mike', verb: 'opened a BAS check on L04 E spike',  minutes_ago: 110 },
    ],
  },
  decision: {
    // S02 (recommended): sensing + voicing only
    annual_hours_projected:    100000,
    implementation_cost:       80000,
    // S03 (full deployment): sensing + voicing + governing
    s03_annual_hours_projected: 130000,
    s03_implementation_cost:    140000,
    // dimension current-state values for the 6-dim gauge
    // NOTE: "Fixed Cost" is GSD's existing annual steam spend (Harvard Capital
    // Planning data) — not zero. Steam is paid whether or not we intervene;
    // the question is what comfort we get for it.
    dimensions: {
      'Fixed Cost':     { val: '$454k', trend: 'flat', trendLabel: 'annual steam · Harvard CPO' },
      'Variable Cost':  { val: '$220k', trend: 'flat', trendLabel: 'annual maintenance' },
      'Comfort':        { val: '−4.1°F', trend: 'down', trendLabel: 'felt gap (P2 survey)' },
      'Productivity':   { val: '−12%',   trend: 'down', trendLabel: 'lost hrs/wk per voter' },
      'Coordination':   { val: '3 silo', trend: 'flat', trendLabel: 'BAS · GSD ops · users' },
      'Efficiency':     { val: '100',    trend: 'flat', trendLabel: 'steam idx baseline' },
    },
    // 8 stakeholders × 3 scenarios coalition matrix
    stakeholders: [
      { name: 'GSD Students',          scores: [-3, +3, +3] },
      { name: 'GSD Staff',             scores: [-3, +3, +2] },
      { name: 'Faculty / Studio Coord.', scores: [-3, +3, +2] },
      { name: 'Facilities & Campus Ops', scores: [+3,  0, -2] },
      { name: 'Office of Sustainability', scores: [+2, +1, 0] },
      { name: 'Securitas',             scores: [-2, +2, +1] },
      { name: 'GSD Dean / Leadership', scores: [ 0, +2, 0] },
      { name: 'Broader Society',       scores: [+2, +1, +1] },
    ],
  },
};

// ---- R5 calculation helpers ---------------------------------------------
function dollarsFromHours(h) {
  return h * TUITION_PER_HOUR;
}
function pctOfTuition(d) {
  return (d / TUITION_PER_YEAR) * 100;
}
function fmtDollars(d) {
  if (d >= 1_000_000) return '$' + (d / 1_000_000).toFixed(1) + 'M';
  if (d >= 1_000)     return '$' + (d / 1_000).toFixed(0) + 'k';
  return '$' + d.toFixed(0);
}
function fmtDollarsExact(d) {
  return '$' + d.toLocaleString('en-US', { maximumFractionDigits: 0 });
}
function fmtPct(p) {
  if (p < 0.01) return '< 0.01%';
  if (p < 1)    return p.toFixed(2) + '%';
  return p.toFixed(1) + '%';
}

// ---- WhatIf scenario model (4 cumulative phases for decision mode) -------
const baselines = { M1: -4.12, M2: 70, M3: 300, M4: 18, M5: 100 };
//   M1 °F   M2 isolation %   M3 friction sec   M4 days   M5 idx

const effects = {
  // p1 = metric collection
  // p2 = deploy feedback
  // p3 = evaluate feedback
  // p4 = implement change
  M1: { p1: [0.3, 0.8],   p2: [0.8, 1.6],   p3: [0.6, 1.2],   p4: [1.2, 2.0] },
  M2: { p1: [-12, -20],   p2: [-18, -30],   p3: [-6, -12],    p4: [-2, -5]  },
  M3: { p1: [0, -15],     p2: [-120, -210], p3: [-30, -70],   p4: [0, -20]  },
  M4: { p1: [-0.5, -1.5], p2: [-3, -6],     p3: [-2, -4],     p4: [-4, -8]  },
  M5: { p1: [0, 0],       p2: [0, 0],       p3: [0, 0],       p4: [-2, -6]  },
};

const metricLimits = {
  M1: { min: -6, max: 2 },
  M2: { min: 0,  max: 100 },
  M3: { min: 0,  max: 300 },
  M4: { min: 0,  max: 20 },
  M5: { min: 80, max: 105 },
};

function clampMetric(metric, value) {
  const limits = metricLimits[metric];
  if (!limits) return value;
  return Math.max(limits.min, Math.min(limits.max, value));
}

function whatifCompute(p1, p2, p3, p4) {
  // Later phases only matter to the degree earlier phases are in place.
  const effective = [
    p1 / 100,
    Math.min(p1, p2) / 100,
    Math.min(p1, p2, p3) / 100,
    Math.min(p1, p2, p3, p4) / 100,
  ];
  const out = {};
  for (const m of ['M1', 'M2', 'M3', 'M4', 'M5']) {
    const e = effects[m];
    const lowD =
      e.p1[0] * effective[0] +
      e.p2[0] * effective[1] +
      e.p3[0] * effective[2] +
      e.p4[0] * effective[3];
    const highD =
      e.p1[1] * effective[0] +
      e.p2[1] * effective[1] +
      e.p3[1] * effective[2] +
      e.p4[1] * effective[3];
    const lo = clampMetric(m, baselines[m] + Math.min(lowD, highD));
    const hi = clampMetric(m, baselines[m] + Math.max(lowD, highD));
    out[m] = [lo, hi, (lo+hi)/2];
  }
  return out;
}

function metricFmt(m, v) {
  if (m === 'M1') return v.toFixed(1) + '°F';
  if (m === 'M2') return Math.round(v) + '%';
  if (m === 'M3') {
    if (v < 60) return Math.round(v) + 's';
    return (v / 60).toFixed(1) + 'm';
  }
  if (m === 'M4') return v.toFixed(1) + 'd';
  if (m === 'M5') return Math.round(v);
  return v.toFixed(1);
}

function pctOnAxis(v, min, max) {
  return Math.max(0, Math.min(100, ((v - min) / (max - min)) * 100));
}

// ---- score color class for coalition heatmap ---------------------------
function scoreClass(s) {
  if (s >=  3) return 'score-pp2';
  if (s >=  2) return 'score-p2';
  if (s >=  1) return 'score-p1';
  if (s ===  0) return 'score-0';
  if (s >= -1) return 'score-n1';
  return 'score-n2';
}

// ---- shared utility: render the topbar mode switch ----------------------
function renderModeSwitch(activeMode) {
  // activeMode in {'user','operator','decision', null}
  const modes = [
    { key: 'user',     label: 'User',     href: 'user.html' },
    { key: 'operator', label: 'Operator', href: 'operator.html' },
    { key: 'decision', label: 'Decision', href: 'decision.html' },
  ];
  return `
    <div class="mode-switch">
      ${modes.map(m => `
        <a href="${m.href}" class="${m.key === activeMode ? 'active ' + m.key : ''}">${m.label}</a>
      `).join('')}
    </div>
  `;
}
