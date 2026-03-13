/**
 * probability.js
 * 확률과 통계 섹션: 베이즈 정리, A/B 테스트, 기댓값, 정규분포
 */

/* ════════════════════════════════════════
   1. 베이즈 정리 — 스팸 필터
════════════════════════════════════════ */
function updateBayes() {
  const prior   = parseFloat(document.getElementById('priorSpam').value)  / 100;
  const likeliS = parseFloat(document.getElementById('likeliSpam').value) / 100;
  const likeliH = parseFloat(document.getElementById('likeliHam').value)  / 100;

  _setEl('priorVal',      (prior   * 100).toFixed(0) + '%');
  _setEl('likeliSpamVal', (likeliS * 100).toFixed(0) + '%');
  _setEl('likeliHamVal',  (likeliH * 100).toFixed(0) + '%');

  /* P(word) = P(word|spam)*P(spam) + P(word|ham)*P(ham) */
  const pWord     = likeliS * prior + likeliH * (1 - prior);
  const posterior = likeliS * prior / pWord;

  _setEl('posteriorSpam', (posterior * 100).toFixed(1) + '%');
  _setEl('posteriorHam',  ((1 - posterior) * 100).toFixed(1) + '%');

  const bar = document.getElementById('bayesBar');
  if (bar) bar.style.width = (posterior * 100) + '%';

  const verdict = posterior > 0.8 ? '⚠ 스팸 처리 권장' :
                  posterior > 0.5 ? '△ 스팸 의심' :
                                    '✓ 정상 메일로 분류';
  _setEl('bayesVerdict', verdict);
}

/* ════════════════════════════════════════
   2. A/B 테스트 — Z-검정
════════════════════════════════════════ */
function calcAB() {
  const aN    = parseFloat(document.getElementById('aN')?.value)    || 1;
  const aConv = parseFloat(document.getElementById('aConv')?.value) || 0;
  const bN    = parseFloat(document.getElementById('bN')?.value)    || 1;
  const bConv = parseFloat(document.getElementById('bConv')?.value) || 0;

  const p1 = aConv / aN;
  const p2 = bConv / bN;

  _setEl('rateA', (p1 * 100).toFixed(2) + '%');
  _setEl('rateB', (p2 * 100).toFixed(2) + '%');

  const pPool = (aConv + bConv) / (aN + bN);
  const se    = Math.sqrt(pPool * (1 - pPool) * (1 / aN + 1 / bN));
  const z     = se === 0 ? 0 : (p2 - p1) / se;
  const sig   = Math.abs(z) > 1.96;

  _setEl('zScore', Math.abs(z).toFixed(3));
  _setEl('sigLabel', 'Z-score (임계값: ±1.96)');

  const box = document.getElementById('sigBox');
  if (box) box.className = 'significance-box ' + (sig ? 'significant' : 'not-significant');

  const badge = document.getElementById('sigBadge');
  if (badge) {
    badge.innerHTML = sig
      ? '<span class="result-badge badge-green">✓ 통계적으로 유의미 (p &lt; 0.05)</span>'
      : '<span class="result-badge badge-red">✗ 유의미하지 않음 (p ≥ 0.05)</span>';
  }

  const lift = p1 > 0 ? ((p2 - p1) / p1 * 100).toFixed(1) : 0;
  _setEl('abExplain', `전환율 차이: ${p2 - p1 >= 0 ? '+' : ''}${((p2 - p1) * 100).toFixed(2)}pp  |  상대적 향상: ${lift}%  |  신뢰수준: ${sig ? '95% 이상' : '95% 미달'}`);
}

/* ════════════════════════════════════════
   3. 기댓값 — 수익 모델
════════════════════════════════════════ */
const EV_TIERS = [
  { name: '무료',     price:     0, prob: 70, color: '#6080a0' },
  { name: '라이트',   price:  3900, prob: 20, color: '#5b9cf6' },
  { name: '스탠다드', price:  9900, prob:  8, color: '#f5a623' },
  { name: '프로',     price: 19900, prob:  2, color: '#4ecdc4' },
];

function buildEVControls() {
  const container = document.getElementById('evControls');
  if (!container) return;

  container.innerHTML = '';
  EV_TIERS.forEach((tier, i) => {
    const row = document.createElement('div');
    row.className = 'control-row';
    row.innerHTML = `
      <label style="color:${tier.color}">${tier.name} (₩${tier.price.toLocaleString()})</label>
      <input type="range" min="0" max="100" value="${tier.prob}" id="evSlider${i}"
             oninput="normalizeEV(${i})">
      <span class="val-display" id="evPct${i}" style="color:${tier.color}">${tier.prob}%</span>
    `;
    container.appendChild(row);
  });
  _updateEV();
}

function normalizeEV(changed) {
  const vals  = EV_TIERS.map((_, i) => parseInt(document.getElementById(`evSlider${i}`)?.value || 0));
  const total = vals.reduce((a, b) => a + b, 0) || 1;
  EV_TIERS.forEach((t, i) => {
    t.prob = vals[i];
    _setEl(`evPct${i}`, (vals[i] / total * 100).toFixed(0) + '%');
  });
  _updateEV();
}

function _updateEV() {
  const total = EV_TIERS.reduce((a, t) => a + t.prob, 0) || 1;
  const ev    = EV_TIERS.reduce((a, t) => a + t.price * (t.prob / total), 0);

  _setEl('evResult', '₩' + Math.round(ev).toLocaleString());

  const breakdown = EV_TIERS
    .filter(t => t.price > 0)
    .map(t => `${t.name}: ${(t.prob / total * 100).toFixed(0)}%`)
    .join(' · ');
  _setEl('evBreakdown', breakdown);

  _drawEVChart(total);
}

function _drawEVChart(total) {
  const canvas = document.getElementById('evChart');
  if (!canvas) return;

  const w   = canvas.offsetWidth || 400;
  const h   = 140;
  const dpr = window.devicePixelRatio || 1;
  canvas.width  = w * dpr;
  canvas.height = h * dpr;

  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, w, h);

  const pad = { l: 10, r: 10, t: 20, b: 30 };
  const bw  = (w - pad.l - pad.r) / EV_TIERS.length - 6;
  const maxH = 80;

  EV_TIERS.forEach((t, i) => {
    const pct = t.prob / total;
    const bh  = pct * maxH;
    const x   = pad.l + i * ((w - pad.l - pad.r) / EV_TIERS.length) + 3;
    const y   = pad.t + maxH - bh;

    ctx.fillStyle   = t.color + '33';
    ctx.strokeStyle = t.color;
    ctx.lineWidth   = 1.5;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x, y, bw, bh, 3);
    else ctx.rect(x, y, bw, bh);
    ctx.fill();
    ctx.stroke();

    ctx.font      = '10px JetBrains Mono, monospace';
    ctx.fillStyle = t.color;
    ctx.textAlign = 'center';
    ctx.fillText((pct * 100).toFixed(0) + '%', x + bw / 2, y - 5);

    ctx.fillStyle = 'rgba(155,176,204,0.7)';
    ctx.fillText(t.name, x + bw / 2, h - 5);
  });
}

/* ════════════════════════════════════════
   4. 정규분포
════════════════════════════════════════ */
function updateNormal() {
  const mu    = parseFloat(document.getElementById('muRange')?.value)    || 200;
  const sigma = parseFloat(document.getElementById('sigmaRange')?.value) || 40;

  _setEl('muVal',    mu    + 'ms');
  _setEl('sigmaVal', sigma + 'ms');

  const canvas = document.getElementById('normalCanvas');
  if (!canvas) return;

  const w   = canvas.offsetWidth || 400;
  const h   = 180;
  const dpr = window.devicePixelRatio || 1;
  canvas.width  = w * dpr;
  canvas.height = h * dpr;

  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, w, h);

  const xMin   = mu - 4 * sigma;
  const xMax   = mu + 4 * sigma;
  const pdf    = x => Math.exp(-0.5 * ((x - mu) / sigma) ** 2) / (sigma * Math.sqrt(2 * Math.PI));
  const maxPdf = pdf(mu);
  const toX    = x => (x - xMin) / (xMax - xMin) * (w - 20) + 10;
  const toY    = y => 160 - y / maxPdf * 130;
  const step   = (xMax - xMin) / 200;

  /* Shaded sigma areas */
  [
    { from: mu - 3 * sigma, to: mu + 3 * sigma, color: 'rgba(78,205,196,0.10)' },
    { from: mu - 2 * sigma, to: mu + 2 * sigma, color: 'rgba(78,205,196,0.14)' },
    { from: mu -     sigma, to: mu +     sigma, color: 'rgba(78,205,196,0.20)' },
  ].forEach(({ from, to, color }) => {
    ctx.beginPath();
    ctx.moveTo(toX(from), 160);
    for (let x = from; x <= to; x += step) ctx.lineTo(toX(x), toY(pdf(x)));
    ctx.lineTo(toX(to), 160);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  });

  /* Curve */
  ctx.beginPath();
  for (let x = xMin; x <= xMax; x += step) {
    const y = toY(pdf(x));
    x === xMin ? ctx.moveTo(toX(x), y) : ctx.lineTo(toX(x), y);
  }
  ctx.strokeStyle = '#4ecdc4';
  ctx.lineWidth   = 2;
  ctx.stroke();

  /* Sigma tick lines */
  [-3, -2, -1, 0, 1, 2, 3].forEach(n => {
    const px = toX(mu + n * sigma);
    ctx.beginPath();
    ctx.moveTo(px, toY(pdf(mu + n * sigma)));
    ctx.lineTo(px, 160);
    ctx.strokeStyle = n === 0 ? 'rgba(245,166,35,0.7)' : 'rgba(42,64,96,0.5)';
    ctx.lineWidth   = n === 0 ? 1.5 : 1;
    ctx.setLineDash(n === 0 ? [] : [3, 3]);
    ctx.stroke();
    ctx.setLineDash([]);

    if ([-1, 0, 1].includes(n)) {
      ctx.font      = '10px JetBrains Mono, monospace';
      ctx.fillStyle = 'rgba(155,176,204,0.7)';
      ctx.textAlign = 'center';
      ctx.fillText(n === 0 ? 'μ' : `μ${n > 0 ? '+' : ''}${n}σ`, px, h - 5);
    }
  });

  /* Stat cards */
  const p95 = (mu + 1.645 * sigma).toFixed(0);
  const p99 = (mu + 2.326 * sigma).toFixed(0);
  const ns  = document.getElementById('normalStats');
  if (ns) {
    ns.innerHTML = [
      { label: '68%',   val: `μ±σ = ${(mu-sigma).toFixed(0)}~${(mu+sigma).toFixed(0)}ms`, color: 'var(--teal)' },
      { label: '95th',  val: `p95 ≈ ${p95}ms`,  color: 'var(--amber)' },
      { label: '99th',  val: `p99 ≈ ${p99}ms`,  color: 'var(--rose)'  },
    ].map(s => `
      <div class="normal-stat-card">
        <div class="normal-stat-label">${s.label}</div>
        <div class="normal-stat-value" style="color:${s.color}">${s.val}</div>
      </div>
    `).join('');
  }
}

/* ─────────────────────────────────────────
   Utility
───────────────────────────────────────── */
function _setEl(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}
