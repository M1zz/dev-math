/**
 * main.js
 * 섹션 네비게이션, 스크롤 리빌, 공통 초기화
 */

/* ─────────────────────────────────────────
   Section switching
───────────────────────────────────────── */
function switchSection(id, btn) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  btn.classList.add('active');

  // Re-trigger reveal animation
  triggerReveal();

  // Re-init section canvases after layout settles
  setTimeout(initAllSections, 100);
}

/* ─────────────────────────────────────────
   Scroll reveal
───────────────────────────────────────── */
function triggerReveal() {
  document.querySelectorAll('.reveal').forEach((el, i) => {
    el.classList.remove('visible');
    setTimeout(() => el.classList.add('visible'), i * 80);
  });
}

/* ─────────────────────────────────────────
   Init all interactive components
───────────────────────────────────────── */
function initAllSections() {
  // Discrete
  if (typeof renderTruthTable   === 'function') renderTruthTable();
  if (typeof drawVenn           === 'function') drawVenn();
  if (typeof updateInduction    === 'function') updateInduction(document.getElementById('nRange')?.value ?? 4);
  if (typeof drawGraph          === 'function') drawGraph();

  // Linear Algebra
  if (typeof updateVectors      === 'function') updateVectors();
  if (typeof updateTransform    === 'function') updateTransform();
  if (typeof renderMatMul       === 'function') { renderMatMul(-1); document.getElementById('matMulExplain').textContent = '▸ "다음 단계" 버튼을 눌러 행렬 곱셈을 단계별로 확인하세요.'; }
  if (typeof calcDet            === 'function') calcDet();

  // Probability
  if (typeof updateBayes        === 'function') updateBayes();
  if (typeof calcAB             === 'function') calcAB();
  if (typeof buildEVControls    === 'function') buildEVControls();
  if (typeof updateNormal       === 'function') updateNormal();
}

/* ─────────────────────────────────────────
   Resize handler (debounced)
───────────────────────────────────────── */
let _resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(_resizeTimer);
  _resizeTimer = setTimeout(initAllSections, 200);
});

/* ─────────────────────────────────────────
   Boot
───────────────────────────────────────── */
window.addEventListener('load', () => {
  initAllSections();
  triggerReveal();
});
