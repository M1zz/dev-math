/**
 * linalg.js
 * 선형대수 섹션: 벡터, 변환 행렬, 행렬 곱셈, 행렬식
 */

/* ════════════════════════════════════════
   1. 벡터 시각화
════════════════════════════════════════ */
function updateVectors() {
  const aAngle = parseFloat(document.getElementById('vecAAngle').value);
  const bAngle = parseFloat(document.getElementById('vecBAngle').value);

  const aEl = document.getElementById('vecAVal');
  const bEl = document.getElementById('vecBVal');
  if (aEl) aEl.textContent = aAngle + '°';
  if (bEl) bEl.textContent = bAngle + '°';

  const canvas = document.getElementById('vectorCanvas');
  if (!canvas) return;

  const w   = canvas.offsetWidth || 400;
  const h   = 220;
  const dpr = window.devicePixelRatio || 1;
  canvas.width  = w * dpr;
  canvas.height = h * dpr;

  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, w, h);

  const cx  = w / 2;
  const cy  = h / 2;
  const len = 80;

  /* Grid */
  ctx.strokeStyle = 'rgba(42,64,96,0.3)';
  ctx.lineWidth   = 0.5;
  for (let x = 0; x < w; x += 30) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
  for (let y = 0; y < h; y += 30) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }

  /* Axes */
  ctx.strokeStyle = 'rgba(42,64,96,0.8)';
  ctx.lineWidth   = 1;
  ctx.beginPath(); ctx.moveTo(cx, 10); ctx.lineTo(cx, h - 10); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(10, cy); ctx.lineTo(w - 10, cy); ctx.stroke();

  const drawArrow = (angleDeg, color, label) => {
    const rad = (angleDeg - 90) * Math.PI / 180;
    const ex  = cx + Math.sin(rad) * len;
    const ey  = cy - Math.cos(rad) * len;

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(ex, ey);
    ctx.strokeStyle = color;
    ctx.lineWidth   = 2.5;
    ctx.stroke();

    /* Arrowhead */
    const headLen   = 10;
    const headAngle = Math.PI / 6;
    const ang = Math.atan2(ey - cy, ex - cx);
    ctx.beginPath();
    ctx.moveTo(ex, ey);
    ctx.lineTo(ex - headLen * Math.cos(ang - headAngle), ey - headLen * Math.sin(ang - headAngle));
    ctx.lineTo(ex - headLen * Math.cos(ang + headAngle), ey - headLen * Math.sin(ang + headAngle));
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();

    ctx.font      = 'bold 14px Playfair Display, serif';
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.fillText(label, ex + 14 * Math.cos(ang), ey + 14 * Math.sin(ang));
  };

  drawArrow(aAngle, '#f5a623', 'a');
  drawArrow(bAngle, '#4ecdc4', 'b');

  /* Dot product */
  const aRad = aAngle * Math.PI / 180;
  const bRad = bAngle * Math.PI / 180;
  const dot  = Math.cos(aRad) * Math.cos(bRad) + Math.sin(aRad) * Math.sin(bRad);

  const diff     = Math.abs(aAngle - bAngle) % 360;
  const minAngle = Math.min(diff, 360 - diff);

  const simText = dot > 0.7 ? '매우 유사' : dot > 0.3 ? '유사' : dot > -0.3 ? '직교(무관)' : '반대 방향';

  const dpEl  = document.getElementById('dotProduct');
  const vaEl  = document.getElementById('vecAngle');
  const vsEl  = document.getElementById('vecSim');
  if (dpEl) dpEl.textContent = dot.toFixed(3);
  if (vaEl) vaEl.textContent = minAngle.toFixed(0) + '°';
  if (vsEl) vsEl.textContent = simText;
}

/* ════════════════════════════════════════
   2. 변환 행렬
════════════════════════════════════════ */
function updateTransform() {
  const theta = parseFloat(document.getElementById('rotAngle').value);
  const scale = parseFloat(document.getElementById('scaleVal2').value) / 100;
  const tx    = parseFloat(document.getElementById('translateX').value);

  const rotEl   = document.getElementById('rotVal');
  const scaleEl = document.getElementById('scaleDisp');
  const txEl    = document.getElementById('txDisp');
  if (rotEl)   rotEl.textContent   = theta + '°';
  if (scaleEl) scaleEl.textContent = scale.toFixed(1) + '×';
  if (txEl)    txEl.textContent    = tx;

  const rad  = theta * Math.PI / 180;
  const cosT = Math.cos(rad);
  const sinT = Math.sin(rad);

  /* 2D affine transform matrix (screen coords) */
  const m = [
    [scale * cosT, -scale * sinT, tx],
    [scale * sinT,  scale * cosT,  0],
    [0,             0,             1],
  ];

  const canvas = document.getElementById('transformCanvas');
  if (!canvas) return;

  const w   = canvas.offsetWidth || 400;
  const h   = 220;
  const dpr = window.devicePixelRatio || 1;
  canvas.width  = w * dpr;
  canvas.height = h * dpr;

  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, w, h);

  const cx = w / 2;
  const cy = h / 2;

  /* Grid */
  ctx.strokeStyle = 'rgba(42,64,96,0.25)';
  ctx.lineWidth   = 0.5;
  for (let x = 0; x < w; x += 30) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
  for (let y = 0; y < h; y += 30) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }

  const pts = [[-40,-40],[40,-40],[40,40],[-40,40]];

  /* Ghost (original) */
  ctx.beginPath();
  pts.forEach(([x, y], i) => i === 0 ? ctx.moveTo(cx + x, cy + y) : ctx.lineTo(cx + x, cy + y));
  ctx.closePath();
  ctx.strokeStyle = 'rgba(42,64,96,0.6)';
  ctx.lineWidth   = 1;
  ctx.setLineDash([4, 4]);
  ctx.stroke();
  ctx.setLineDash([]);

  /* Transformed */
  const tPts = pts.map(([x, y]) => [
    m[0][0] * x + m[0][1] * y + m[0][2],
    m[1][0] * x + m[1][1] * y + m[1][2],
  ]);

  ctx.beginPath();
  tPts.forEach(([x, y], i) => i === 0 ? ctx.moveTo(cx + x, cy + y) : ctx.lineTo(cx + x, cy + y));
  ctx.closePath();
  ctx.fillStyle   = 'rgba(94,156,246,0.15)';
  ctx.fill();
  ctx.strokeStyle = '#5b9cf6';
  ctx.lineWidth   = 2;
  ctx.stroke();

  /* Matrix display */
  const md = document.getElementById('matrixDisplay');
  if (!md) return;

  const fmt = v => v.toFixed(2).padStart(6);
  md.innerHTML = `
    <div class="matrix-wrap">
      <div style="font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--text3)">변환 행렬 T =</div>
      <div class="matrix">
        <div class="matrix-row">
          <span class="matrix-cell">${fmt(m[0][0])}</span>
          <span class="matrix-cell">${fmt(m[0][1])}</span>
          <span class="matrix-cell highlight">${fmt(m[0][2])}</span>
        </div>
        <div class="matrix-row">
          <span class="matrix-cell">${fmt(m[1][0])}</span>
          <span class="matrix-cell">${fmt(m[1][1])}</span>
          <span class="matrix-cell highlight">${fmt(m[1][2])}</span>
        </div>
        <div class="matrix-row">
          <span class="matrix-cell">${fmt(m[2][0])}</span>
          <span class="matrix-cell">${fmt(m[2][1])}</span>
          <span class="matrix-cell">${fmt(m[2][2])}</span>
        </div>
      </div>
    </div>`;
}

/* ════════════════════════════════════════
   3. 행렬 곱셈 단계별
════════════════════════════════════════ */
const MAT_W = [[1, 2], [3, 4], [5, 6]];
const MAT_X = [[1], [2]];
let matStep = -1;

function getMatMulSteps() {
  return MAT_W.map((row, i) => {
    const sum    = row.reduce((acc, v, j) => acc + v * MAT_X[j][0], 0);
    const detail = `W[${i}] · x = ${row[0]}×${MAT_X[0][0]} + ${row[1]}×${MAT_X[1][0]} = ${row[0]*MAT_X[0][0]} + ${row[1]*MAT_X[1][0]} = ${sum}`;
    return { row: i, result: sum, detail };
  });
}

function renderMatMul(highlight) {
  const steps  = getMatMulSteps();
  const result = steps.map(s => s.result);

  let html = '<div class="matrix-wrap" style="font-size:13px">';
  html += '<div style="font-family:\'JetBrains Mono\',monospace;font-size:10px;color:var(--text3)">W (3×2)</div>';
  html += '<div class="matrix">';
  MAT_W.forEach((row, i) => {
    html += '<div class="matrix-row">';
    row.forEach(v => html += `<span class="matrix-cell${i === highlight ? ' highlight' : ''}">${v}</span>`);
    html += '</div>';
  });
  html += '</div>';

  html += '<div class="matrix-op">×</div>';
  html += '<div style="font-family:\'JetBrains Mono\',monospace;font-size:10px;color:var(--text3)">x (2×1)</div>';
  html += '<div class="matrix">';
  MAT_X.forEach(row => {
    html += '<div class="matrix-row">';
    row.forEach(v => html += `<span class="matrix-cell${highlight >= 0 ? ' highlight' : ''}">${v}</span>`);
    html += '</div>';
  });
  html += '</div>';

  html += '<div class="matrix-op">=</div>';
  html += '<div style="font-family:\'JetBrains Mono\',monospace;font-size:10px;color:var(--text3)">y (3×1)</div>';
  html += '<div class="matrix">';
  result.forEach((v, i) => {
    html += `<div class="matrix-row"><span class="matrix-cell${i === highlight ? ' highlight' : ''}">${i <= highlight ? v : '?'}</span></div>`;
  });
  html += '</div></div>';

  const el = document.getElementById('matMulDisplay');
  if (el) el.innerHTML = html;
}

function stepMatMul() {
  const steps = getMatMulSteps();
  matStep = Math.min(matStep + 1, steps.length - 1);
  renderMatMul(matStep);
  const el = document.getElementById('matMulExplain');
  if (el) el.textContent = `단계 ${matStep + 1}: ${steps[matStep].detail}`;
}

function resetMatMul() {
  matStep = -1;
  renderMatMul(-1);
  const el = document.getElementById('matMulExplain');
  if (el) el.textContent = '▸ "다음 단계" 버튼을 눌러 행렬 곱셈을 단계별로 확인하세요.';
}

/* ════════════════════════════════════════
   4. 행렬식
════════════════════════════════════════ */
function calcDet() {
  const a  = parseFloat(document.getElementById('ma')?.value) || 0;
  const b  = parseFloat(document.getElementById('mb')?.value) || 0;
  const c  = parseFloat(document.getElementById('mc')?.value) || 0;
  const d  = parseFloat(document.getElementById('md')?.value) || 0;
  const det = a * d - b * c;

  const el = document.getElementById('detResult');
  if (el) {
    el.innerHTML = `det([[${a},${b}],[${c},${d}]]) = ${a}×${d} − ${b}×${c} = <span style="color:var(--amber);font-weight:600">${det}</span> → 역행렬 ${Math.abs(det) < 0.0001 ? '❌ 없음' : '✓ 존재'}`;
  }

  _drawDetCanvas(a, b, c, d, det);
}

function _drawDetCanvas(a, b, c, d, det) {
  const canvas = document.getElementById('detCanvas');
  if (!canvas) return;

  const w   = canvas.offsetWidth || 400;
  const h   = 180;
  const dpr = window.devicePixelRatio || 1;
  canvas.width  = w * dpr;
  canvas.height = h * dpr;

  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, w, h);

  const cx    = w / 2;
  const cy    = h / 2;
  const scale = 35;

  /* Grid */
  ctx.strokeStyle = 'rgba(42,64,96,0.3)';
  ctx.lineWidth   = 0.5;
  for (let x = cx % scale; x < w; x += scale) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
  for (let y = cy % scale; y < h; y += scale) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }

  /* Axes */
  ctx.strokeStyle = 'rgba(42,64,96,0.8)';
  ctx.lineWidth   = 1;
  ctx.beginPath(); ctx.moveTo(cx, 10); ctx.lineTo(cx, h - 10); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(10, cy); ctx.lineTo(w - 10, cy); ctx.stroke();

  /* Parallelogram */
  const v1 = [ a * scale, -b * scale];
  const v2 = [ c * scale, -d * scale];
  const pts = [[0,0], [v1[0],v1[1]], [v1[0]+v2[0],v1[1]+v2[1]], [v2[0],v2[1]]];

  ctx.beginPath();
  pts.forEach(([x, y], i) => i === 0 ? ctx.moveTo(cx + x, cy + y) : ctx.lineTo(cx + x, cy + y));
  ctx.closePath();
  ctx.fillStyle   = det >= 0 ? 'rgba(78,205,196,0.2)' : 'rgba(255,107,138,0.2)';
  ctx.fill();
  ctx.strokeStyle = det >= 0 ? 'var(--teal)' : 'var(--rose)';
  ctx.lineWidth   = 2;
  ctx.stroke();

  /* Column vectors */
  [[v1, '#f5a623', 'a'], [v2, '#b48aff', 'b']].forEach(([v, col, lbl]) => {
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + v[0], cy + v[1]);
    ctx.strokeStyle = col;
    ctx.lineWidth   = 2.5;
    ctx.stroke();
    ctx.font      = 'bold 14px Playfair Display, serif';
    ctx.fillStyle = col;
    ctx.textAlign = 'center';
    ctx.fillText(lbl, cx + v[0] + 8, cy + v[1] - 8);
  });

  ctx.font      = '11px JetBrains Mono, monospace';
  ctx.fillStyle = 'rgba(232,240,252,0.6)';
  ctx.textAlign = 'left';
  ctx.fillText(`Area = |det| = ${Math.abs(det).toFixed(1)}`, 10, h - 10);
}
