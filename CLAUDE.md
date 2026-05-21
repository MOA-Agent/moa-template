# MOA 프로젝트 템플릿 - Claude 행동 규칙

## 스킬 실행 규칙

Claude는 아래 트리거 조건에 해당하는 요청이 들어오면, 반드시 해당 스킬 파일을 읽고 그 지침에 따라 동작한다.
스킬 파일을 읽기 전에 임의로 작업을 시작하지 않는다.

| 트리거 조건 | 실행 스킬 |
|---|---|
| "init 실행", "프로젝트 초기 세팅", "프로젝트 세팅 시작해줘", "moa-init" 등 초기 세팅 요청 | `.claude/skills/moa-init/SKILL.md` |
| "보안 점검", "보안 체크", "security check", "moa-security" 등 보안 점검 요청 | `.claude/skills/moa-security/SKILL.md` |
| "개발해줘", "만들어줘", "추가해줘", "기능 개발" 등 기능 개발 요청 | `.claude/skills/develop/SKILL.md` |
| "기획해줘", "plan-feature" 등 기획 단독 요청 | `.claude/skills/plan-feature/SKILL.md` |
| "build-feature", "개발 시작해줘" 등 개발 단독 요청 | `.claude/skills/build-feature/SKILL.md` |
| "작업 완료", "complete-task", "문서 업데이트해줘" 등 작업 완료 요청 | `.claude/skills/complete-task/SKILL.md` |
| "개발 배포해줘", "deploy-dev" 등 개발 환경 배포 요청 | `.claude/skills/deploy-dev/SKILL.md` |
| "운영 배포해줘", "배포해줘", "deploy-prod" 등 운영 환경 배포 요청 | `.claude/skills/deploy-prod/SKILL.md` |
| "공유 문서 만들어줘", "share-update" 등 업데이트 공유 요청 | `.claude/skills/share-update/SKILL.md` |

## 사전 조건 규칙

아래 스킬을 실행하기 전에 반드시 프로젝트 초기화 상태를 확인한다.

**확인 대상 스킬:** develop, plan-feature, build-feature, deploy-dev, deploy-prod

**확인 방법:** 프로젝트 루트에 `package.json`이 존재하는지 확인한다.

- `package.json`이 없으면 → 사용자의 원래 요청을 기억해두고, 먼저 `moa-init` 스킬을 실행한다. Init 완료 후 원래 요청을 이어서 처리한다.
- `package.json`이 있으면 → 트리거된 스킬을 그대로 실행한다.

## 기본 행동 규칙

- 스킬 실행 중에는 스킬 파일의 지침을 우선 따른다.
- 위험하거나 되돌리기 어려운 작업(파일 삭제, 덮어쓰기 등)은 반드시 사용자에게 확인 후 진행한다.
- 모호한 요청은 임의로 판단하지 않고 사용자에게 질문한다.
- 스킬 범위를 벗어난 작업 요청은 범위 외임을 안내하고 확인 후 진행한다.
