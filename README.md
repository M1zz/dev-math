# 개발자를 위한 수학 — S9-1

> 알고리즘 복잡도 증명 / 그래픽스 / ML 원리를 직접 만지며 배우는 인터랙티브 학습 페이지

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-배포중-brightgreen)](https://your-username.github.io/dev-math)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 📖 개요

코드 뒤에 숨어있는 수학을 슬라이더, 토글, 애니메이션으로 직접 체험합니다.  
이론이 아닌 **감각**으로 익히는 것이 목표입니다.

---

## 🗂 커리큘럼

### 01 이산수학 — 알고리즘의 수학적 기반

| 주제 | 핵심 개념 | 인터랙티브 데모 |
|------|-----------|----------------|
| 드모르간 법칙 | `¬(A∧B) ≡ ¬A∨¬B` | 토글 스위치로 진리표 실시간 확인 |
| 집합론 | 합집합·교집합·차집합·대칭차 | Venn 다이어그램 연산 전환 |
| 수학적 귀납법 | Base case → Inductive step | n 슬라이더로 증명 단계 탐색 |
| 그래프 이론 | BFS (큐) vs DFS (스택) | 트리 순회 애니메이션 |

### 02 선형대수 — 그래픽스와 ML의 언어

| 주제 | 핵심 개념 | 인터랙티브 데모 |
|------|-----------|----------------|
| 벡터 연산 | 내적, 유사도, 단위 벡터 | 각도 슬라이더 → 내적 실시간 계산 |
| 변환 행렬 | 회전·스케일·이동 합성 | 슬라이더 → 행렬 + 도형 동시 업데이트 |
| CoreML 행렬 곱 | `y = f(Wx + b)` | 단계별 곱셈 시각화 |
| 행렬식 | det(A) = ad−bc | 숫자 입력 → 평행사변형 면적 확인 |

### 03 확률과 통계 — 데이터 기반 의사결정

| 주제 | 핵심 개념 | 인터랙티브 데모 |
|------|-----------|----------------|
| 베이즈 정리 | `P(A\|B) = P(B\|A)·P(A)/P(B)` | 스팸 필터 사후확률 계산기 |
| A/B 테스트 | Z-검정, p-value | 전환율 입력 → 유의성 판정 |
| 기댓값 | `𝔼[X] = Σ xᵢ·P(xᵢ)` | 구독 티어 비율 → 월 ARPU |
| 정규분포 | μ, σ, p95, p99 | 응답시간 분포 시뮬레이터 |

---

## 🗂 파일 구조

```
dev-math/
├── index.html          # 메인 페이지 (마크업)
├── css/
│   └── style.css       # 전체 스타일 (CSS 변수 기반)
├── js/
│   ├── main.js         # 네비게이션, 리빌 애니메이션, 공통 초기화
│   ├── discrete.js     # 이산수학 인터랙티브
│   ├── linalg.js       # 선형대수 인터랙티브
│   └── probability.js  # 확률과 통계 인터랙티브
└── README.md
```

---

## 🚀 GitHub Pages 배포

### 1. 레포지토리 생성 후 Push

```bash
git init
git add .
git commit -m "feat: 개발자를 위한 수학 인터랙티브 페이지"
git remote add origin https://github.com/<your-username>/dev-math.git
git branch -M main
git push -u origin main
```

### 2. GitHub Pages 활성화

1. 레포지토리 → **Settings** → **Pages**
2. **Source**: Deploy from a branch
3. **Branch**: `main` / `/ (root)`
4. **Save** 클릭

약 1분 후 `https://<your-username>.github.io/dev-math` 에서 접속 가능합니다.

---

## 🛠 로컬 실행

별도 빌드 없이 정적 HTML 파일입니다.  
VS Code + **Live Server** 확장으로 바로 실행하거나:

```bash
# Python 3
python -m http.server 8080
# 브라우저에서 http://localhost:8080 접속
```

---

## 🎨 기술 스택

| 항목 | 내용 |
|------|------|
| 마크업 | HTML5 (시맨틱) |
| 스타일 | CSS3 (CSS 변수, Grid, 애니메이션) |
| 스크립트 | Vanilla JS (ES6+) — 외부 의존성 없음 |
| 폰트 | Google Fonts (Playfair Display, JetBrains Mono, Noto Serif KR) |
| 시각화 | Canvas 2D API |

---

## 📐 Swift 코드 예시 연결

각 주제마다 Swift/iOS 실무 코드 스니펫을 포함합니다.

- 드모르간 → 조건문 단순화
- 집합론 → `Set` API (`union`, `intersection`, `subtracting`)
- 변환 행렬 → ARKit `simd_float4x4`
- 행렬 곱 → Accelerate `cblas_sgemm` / CoreML
- A/B 검정 → Z-score 직접 계산
- 정규분포 → p95 / p99 응답시간

---

## 📄 라이선스

MIT © 개발자리 (Devjaeri)
