---
name: moa-adopt
description: 기존 프로젝트에 moa-template 설정을 선택적으로 적용하는 스킬. 현황을 스캔해 빠진 항목을 파악하고, 사용자가 선택한 것만 추가한다. 이미 있는 항목도 선택하면 덮어쓰기 가능.
---

당신은 MOA 프로젝트 설정 적용 담당자입니다.
기존 프로젝트에 moa-template 설정을 선택적으로 추가합니다.

## 진행 순서

### 1. 현황 스캔

아래 항목을 순서대로 확인합니다.

| 항목 | 확인 방법 |
|---|---|
| Claude 스킬 | `.claude/skills/`, `CLAUDE.md` 존재 여부 |
| 템플릿 버전 | `.claude/VERSION` 존재 여부 |
| 문서 | `docs/project-overview.md`, `docs/change-log.md`, `docs/infra.md`, `docs/deploy.md` 존재 여부 |
| 배포 설정 | `.github/workflows/`에 deploy 관련 yml 존재 여부 |
| MOA 디자인 시스템 | `.claude/skills/moa-design/` 존재 여부 |
| Git 훅 | `.husky/` 또는 `.githooks/` 존재 여부 |

### 2. 스캔 결과 리포트

아래 형식으로 현황을 출력합니다.

```
📋 현재 프로젝트 MOA 세팅 현황

✅ Claude 스킬 (.claude/skills/, CLAUDE.md)
❌ 템플릿 버전 (.claude/VERSION)
✅ 문서 (docs/)
  ✅ project-overview.md
  ❌ change-log.md
  ❌ infra.md
  ✅ deploy.md
❌ 배포 설정 (.github/workflows/)
❌ MOA 디자인 시스템
✅ Git 훅
```

### 3. 적용 항목 선택

`AskUserQuestion` 툴로 적용할 항목을 선택받습니다.

- ❌ 항목: 선택 시 새로 추가
- ✅ 항목: 선택 시 덮어쓰기 여부 확인 후 진행

```
header: "적용할 항목"
multiSelect: true
options:
  - label: "Claude 스킬" (✅ 있음 또는 ❌ 없음 표시)
  - label: "템플릿 버전"
  - label: "문서"
  - label: "배포 설정"
  - label: "MOA 디자인 시스템"
  - label: "Git 훅"
```

### 4. 덮어쓰기 확인

선택한 항목 중 이미 존재하는 항목이 있으면 각각 확인합니다.

```
"{항목명}"이 이미 있습니다. 덮어쓸까요?
```

"아니오"를 선택한 항목은 건너뜁니다.

### 5. 적용

확정된 항목을 순서대로 적용합니다.

#### Claude 스킬 적용
moa-template 최신 스킬 파일을 가져와 적용합니다.

```bash
# 최신 스킬 목록 조회 후 다운로드
gh api repos/MOA-Agent/moa-template/contents/.claude/skills --jq '.[].name'
```

각 스킬 파일을 `.claude/skills/`에 복사하고, `CLAUDE.md`도 최신 버전으로 적용합니다.

#### 템플릿 버전 적용
```bash
gh api repos/MOA-Agent/moa-template/contents/.claude/VERSION --jq '.content' | base64 -d > .claude/VERSION
```

#### 문서 적용
없는 문서 파일만 생성합니다 (덮어쓰기 확인을 거친 경우 제외).
`moa-init`의 문서 생성 규칙을 따릅니다.

- `docs/project-overview.md` — 프로젝트 이름·설명·목적·주요 기능 (없으면 사용자에게 질문)
- `docs/change-log.md` — 빈 템플릿으로 생성
- `docs/infra.md` — 기술 스택·환경변수 등 (없으면 사용자에게 질문)
- `docs/deploy.md` — 배포 환경 정보 (없으면 사용자에게 질문)

#### 배포 설정 적용
배포 채널을 묻고 해당 워크플로우를 생성합니다.

```
header: "배포 채널"
options:
  - label: "Vercel"
  - label: "EC2"
```

선택에 따라 `moa-init`의 references/vercel-setup.md 또는 references/ec2-setup.md를 참고해 적용합니다.

#### MOA 디자인 시스템 적용
moa-template에서 최신 디자인 시스템 파일을 가져옵니다.

```bash
gh api repos/MOA-Agent/moa-template/contents/.claude/skills/moa-design --jq '.[].name'
```

#### Git 훅 적용
`.githooks/` 디렉토리를 생성하고 기본 pre-commit 훅을 추가합니다.

### 6. 완료 안내

적용한 항목 목록을 출력합니다.

```
✅ 적용 완료

- Claude 스킬: 추가됨
- 템플릿 버전: 추가됨
- 문서: change-log.md, infra.md 추가됨
- 배포 설정: 덮어씀
- MOA 디자인 시스템: 추가됨

⚠️ 건너뛴 항목: Git 훅 (덮어쓰기 거부)
```
