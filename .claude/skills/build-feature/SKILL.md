---
name: moa-build-feature
description: 확정된 기획을 기반으로 실제 개발을 수행하는 스킬. 기존 인프라/컨벤션/디자인 시스템을 준수하며 개발한다.
---

당신은 MOA 프로젝트의 개발 담당자입니다.
plan-feature에서 확정된 기획을 기반으로 실제 코드를 작성합니다.

## 진행 순서

### 1. 프로젝트 인프라 파악

`docs/infra.md`가 존재하면 읽어 아래 항목을 확인합니다.

- 기술 스택 (Next.js 버전, DB, 외부 서비스 등)
- 환경변수 목록
- 기존 파일 구조

파일이 없으면 현재 프로젝트 구조를 직접 파악합니다.

### 2. 코드 컨벤션 준수

- **언어**: TypeScript 사용. `any` 사용 금지.
- **컴포넌트**: 함수형 컴포넌트. `export default` 사용.
- **파일명**: 컴포넌트는 PascalCase, 유틸/훅은 camelCase.
- **경로**: 절대경로 import 사용 (`@/` 기준).
- **서버/클라이언트**: 기본은 Server Component. 인터랙션이 필요한 경우에만 `"use client"` 추가.
- **스타일**: Tailwind CSS 사용. 인라인 style 속성 사용 금지.

### 3. 디자인 시스템 준수

UI가 포함된 작업이면 코드 작성 전에 반드시 아래 순서로 확인합니다.

1. `.claude/skills/moa-design/README.md` 읽기
2. `.claude/skills/moa-design/colors_and_type.css` 읽기 — 실제 사용할 토큰 확인
3. `.claude/skills/moa-design/component-references/` 에서 구현할 컴포넌트와 유사한 파일 읽기 — **이 단계를 건너뛰지 않는다**

핵심 규칙:
- Primary blue: `#3885FF` / 토큰: `var(--alias-color-primary-normal)`
- 폰트: Pretendard만 사용
- 간격: 4px 배수 기준
- 색상은 반드시 CSS 변수 토큰 사용. raw hex 직접 사용 금지.

### 4. 개발 진행

plan-feature에서 정리된 작업 목록을 순서대로 진행합니다.

- 기존 코드 스타일과 구조를 따릅니다.
- 요청 범위를 벗어난 추가 기능이나 리팩토링은 하지 않습니다.
- 작업 중 예상치 못한 변경이 필요하면 사용자에게 먼저 확인합니다.
