/**
 * discrete.js
 * 이산수학 섹션: 드모르간 진리표, Venn 다이어그램, 수학적 귀납법, BFS/DFS
 */

/* ════════════════════════════════════════
   1. 드모르간 법칙 — 진리표
════════════════════════════════════════ */
let varA = false;
let varB = false;

function toggleVar(v) {
  if (v === 'A') {
    varA = !varA;
    document.getElementById('toggleA').classList.toggle('on', varA);
    document.getElementById('valA').textContent = varA ? 'T' : 'F';
  } else {
    varB = !varB;
    document.getElementById('toggleB').classList.toggle('on', varB);
    document.getElementById('valB').textContent = varB ? 'T' : 'F';
  }
  renderTruthTable();
}

function renderTruthTable() {
  const rows = [
    [false, false],
    [false, true],
    [true,  false],
    [true,  true],
  ];

  const body = document.getElementById('truthBody');
  if (!body) return;
  body.innerHTML = '';

  rows.forEach(([a, b]) => {
    const and    = a && b;
    const nand   = !and;
    const naOrNb = !a || !b;
    const active = (a === varA && b === varB);

    const tr = document.createElement('tr');
    if (active) tr.classList.add('highlight');

    const T = v => `<td class="${v ? 'true' : 'false'}">${v ? 'T' : 'F'}</td>`;
    tr.innerHTML = T(a) + T(b) + T(and) + T(nand) + T(naOrNb) + `<td class="true">✓</td>`;
    body.appendChild(tr);
  });
}

/* ════════════════════════════════════════
   2. 집합론 — Venn 다이어그램
════════════════════════════════════════ */
let vennOp = 'union';

const VENN_LABELS = {
  union:        '합집합 A∪B = {1, 2, 3, 4, 5, 6, 7}',
  intersection: '교집합 A∩B = {3, 4, 5}',
  difference:   '차집합 A−B = {1, 2}',
  symmetric:    '대칭차 A△B = {1, 2, 6, 7}',
};

function setVennOp(op, btn) {
  vennOp = op;
  document.querySelectorAll('.venn-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  drawVenn();
}

function drawVenn() {
  const canvas = document.getElementById('vennCanvas');
  if (!canvas) return;

  const w  = canvas.offsetWidth || 400;
  const h  = 200;
  const dpr = window.devicePixelRatio || 1;
  canvas.width  = w * dpr;
  canvas.height = h * dpr;

  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, w, h);

  const cx     = w / 2;
  const cy     = h / 2;
  const r      = 65;
  const offset = 42;

  /* Color mapping per operation */
  const am   = 'rgba(245,166,35,0.5)';
  const te   = 'rgba(78,205,196,0.5)';
  const both = 'rgba(180,138,255,0.6)';
  const none = 'rgba(30,48,80,0.3)';

  const colors = {
    union:        { left: am,   right: te,   center: both },
    intersection: { left: none, right: none, center: both },
    difference:   { left: am,   right: none, center: none },
    symmetric:    { left: am,   right: te,   center: none },
  }[vennOp];

  /* Fill left circle */
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx - offset, cy, r, 0, Math.PI * 2);
  ctx.clip();
  ctx.fillStyle = colors.left;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();

  /* Fill right circle */
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx + offset, cy, r, 0, Math.PI * 2);
  ctx.clip();
  ctx.fillStyle = colors.right;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();

  /* Fill intersection */
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx - offset, cy, r, 0, Math.PI * 2);
  ctx.clip();
  ctx.beginPath();
  ctx.arc(cx + offset, cy, r, 0, Math.PI * 2);
  ctx.clip();
  ctx.fillStyle = colors.center;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();

  /* Stroke circles */
  [[cx - offset, 'rgba(245,166,35,0.6)'], [cx + offset, 'rgba(78,205,196,0.6)']].forEach(([x, stroke]) => {
    ctx.beginPath();
    ctx.arc(x, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  });

  /* Labels */
  ctx.font = 'bold 16px Playfair Display, serif';
  ctx.fillStyle = 'rgba(232,240,252,0.9)';
  ctx.textAlign = 'center';
  ctx.fillText('A', cx - offset - 28, cy + 5);
  ctx.fillText('B', cx + offset + 28, cy + 5);

  /* Result text */
  const result = document.getElementById('vennResult');
  if (result) result.textContent = VENN_LABELS[vennOp];
}

/* ════════════════════════════════════════
   3. 수학적 귀납법
════════════════════════════════════════ */
function updateInduction(n) {
  n = parseInt(n, 10);
  const nValEl = document.getElementById('nVal');
  if (nValEl) nValEl.textContent = n;

  const formula = n * (n + 1) / 2;
  const direct  = Array.from({ length: n }, (_, i) => i + 1).reduce((a, b) => a + b, 0);
  const sum     = Array.from({ length: n }, (_, i) => i + 1).join('+');

  const container = document.getElementById('inductionSteps');
  if (!container) return;

  container.innerHTML = `
    <div class="induction-step active">
      <div class="step-label">Step 1 — 기저 조건 (Base Case)</div>
      <div class="step-content">n=1: 좌변 = 1, 우변 = 1×2/2 = 1 ✓</div>
    </div>
    <div class="induction-step active">
      <div class="step-label">Step 2 — 귀납 가정 (Inductive Hypothesis)</div>
      <div class="step-content">n=k일 때 성립한다고 가정: 1+2+...+k = k(k+1)/2</div>
    </div>
    <div class="induction-step active">
      <div class="step-label">Step 3 — 귀납 단계 (Inductive Step) — n=${n}</div>
      <div class="step-content">1+2+...+${n} = ${n}×${n + 1}/2 = ${formula}</div>
    </div>
    <div class="induction-step active">
      <div class="step-label">직접 계산 확인</div>
      <div class="step-content">${sum} = ${direct} ${direct === formula ? '✓ 일치' : '✗'}</div>
    </div>
  `;
}

/* ════════════════════════════════════════
   4. 그래프 이론 — BFS / DFS
════════════════════════════════════════ */
const GRAPH_NODES = [
  { id: 0, x: 0.50, y: 0.12, label: '0' },
  { id: 1, x: 0.25, y: 0.42, label: '1' },
  { id: 2, x: 0.75, y: 0.42, label: '2' },
  { id: 3, x: 0.12, y: 0.78, label: '3' },
  { id: 4, x: 0.38, y: 0.78, label: '4' },
  { id: 5, x: 0.62, y: 0.78, label: '5' },
  { id: 6, x: 0.88, y: 0.78, label: '6' },
];

const GRAPH_EDGES = [[0,1],[0,2],[1,3],[1,4],[2,5],[2,6]];

let nodeStates        = Array(7).fill('unvisited');
let traversalInterval = null;

function drawGraph() {
  const canvas = document.getElementById('graphCanvas');
  if (!canvas) return;

  const w   = canvas.offsetWidth || 400;
  const h   = 220;
  const dpr = window.devicePixelRatio || 1;
  canvas.width  = w * dpr;
  canvas.height = h * dpr;

  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, w, h);

  /* Edges */
  GRAPH_EDGES.forEach(([a, b]) => {
    const na = GRAPH_NODES[a], nb = GRAPH_NODES[b];
    ctx.beginPath();
    ctx.moveTo(na.x * w, na.y * h);
    ctx.lineTo(nb.x * w, nb.y * h);
    ctx.strokeStyle = 'rgba(42,64,96,0.8)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  });

  /* Nodes */
  const STATE_COLORS = {
    unvisited: '#1f3050',
    visited:   '#4ecdc4',
    queued:    '#ff6b8a',
    start:     '#f5a623',
  };

  GRAPH_NODES.forEach(n => {
    const x = n.x * w, y = n.y * h;
    ctx.beginPath();
    ctx.arc(x, y, 18, 0, Math.PI * 2);
    ctx.fillStyle = STATE_COLORS[nodeStates[n.id]] || STATE_COLORS.unvisited;
    ctx.fill();
    ctx.strokeStyle = 'rgba(42,64,96,0.6)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.font = 'bold 13px JetBrains Mono, monospace';
    ctx.fillStyle = '#e8f0fc';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(n.label, x, y);
  });
}

function buildAdj() {
  const adj = Array(7).fill(null).map(() => []);
  GRAPH_EDGES.forEach(([a, b]) => { adj[a].push(b); adj[b].push(a); });
  return adj;
}

function runTraversal(type) {
  clearInterval(traversalInterval);
  nodeStates = Array(7).fill('unvisited');
  nodeStates[0] = 'start';
  drawGraph();

  const adj = buildAdj();
  const order = [];

  if (type === 'bfs') {
    const queue   = [0];
    const visited = new Set([0]);
    while (queue.length) {
      const n = queue.shift();
      order.push({ visit: n, front: [...queue] });
      adj[n].forEach(nb => { if (!visited.has(nb)) { visited.add(nb); queue.push(nb); } });
    }
  } else {
    const stack   = [0];
    const visited = new Set([0]);
    while (stack.length) {
      const n = stack.pop();
      order.push({ visit: n, front: [...stack] });
      adj[n].slice().reverse().forEach(nb => { if (!visited.has(nb)) { visited.add(nb); stack.push(nb); } });
    }
  }

  let step = 0;
  const visited2    = new Set();
  const visitedList = [];
  const orderEl     = document.getElementById('traversalOrder');

  traversalInterval = setInterval(() => {
    if (step >= order.length) { clearInterval(traversalInterval); return; }

    const { visit, front } = order[step];
    visited2.add(visit);
    visitedList.push(visit);

    nodeStates = Array(7).fill('unvisited');
    visited2.forEach(id => { nodeStates[id] = 'visited'; });
    front.forEach(id => { if (!visited2.has(id)) nodeStates[id] = 'queued'; });
    if (visitedList.length === 1) nodeStates[visit] = 'start';

    drawGraph();
    if (orderEl) orderEl.innerHTML = `방문 순서: ${visitedList.join(' → ')}`;
    step++;
  }, 600);
}

function resetGraph() {
  clearInterval(traversalInterval);
  nodeStates = Array(7).fill('unvisited');
  const orderEl = document.getElementById('traversalOrder');
  if (orderEl) orderEl.innerHTML = '';
  drawGraph();
}
