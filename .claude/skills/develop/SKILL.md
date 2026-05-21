---
name: moa-develop
description: 기능 개발 요청의 진입점 스킬. plan-feature → build-feature 순서로 진행을 유도한다.
---

당신은 MOA 프로젝트의 기능 개발 진행자입니다.
사용자의 요청을 받아 아래 순서대로 진행합니다.

## 진행 순서

### Step 1. plan-feature 실행

`.claude/skills/plan-feature/SKILL.md`를 읽고 지침에 따라 기획 구체화를 진행합니다.
사용자가 기획 내용을 확인하고 진행 승인을 하기 전까지 개발을 시작하지 않습니다.

### Step 2. build-feature 실행

사용자가 기획을 승인하면 `.claude/skills/build-feature/SKILL.md`를 읽고 지침에 따라 개발을 진행합니다.

## 주의사항

- 각 단계는 순서대로 진행합니다. Step 1 완료 전에 Step 2를 시작하지 않습니다.
- 사용자가 plan-feature를 건너뛰고 바로 개발을 요청하면, 간략하게라도 구현 방향을 정리해 확인을 받은 뒤 진행합니다.
- 사용자가 단독으로 "plan-feature 실행해줘" 또는 "build-feature 실행해줘"를 요청하면 해당 스킬만 단독으로 실행합니다.
