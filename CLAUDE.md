# MOA 프로젝트 템플릿 - Claude 행동 규칙

## 세션 시작 규칙

새 대화가 시작될 때 아래를 순서대로 실행한다.

1. `.claude/VERSION` 파일을 읽어 로컬 버전을 확인한다.
2. 아래 명령으로 moa-template 최신 버전을 가져온다.
   ```bash
   gh api repos/MOA-Agent/moa-template/contents/.claude/VERSION --jq '.content' | base64 -d
   ```
3. 버전이 다르면 아래 메시지를 출력한다.
   > "moa-template v{최신버전}으로 업데이트가 있어요. 업데이트할까요? (`/moa-update`로 진행)"
4. 버전이 같으면 아무것도 출력하지 않는다.

---

## 사전 조건 규칙

개발 관련 작업(기능 개발, 기획, 배포 등)을 시작하기 전에 반드시 프로젝트 초기화 상태를 확인한다.

**확인 방법:** 프로젝트 루트에 `package.json`이 존재하는지 확인한다.

- `package.json`이 없으면 → 사용자의 원래 요청을 기억해두고, 먼저 `moa-init` 스킬을 실행한다. Init 완료 후 원래 요청을 이어서 처리한다.
- `package.json`이 있으면 → 요청에 맞는 스킬을 그대로 실행한다.

## 스킬 목록

아래 스킬이 `.claude/skills/` 에 있다. 요청 맥락에 맞는 스킬 파일을 읽고 지침에 따라 동작한다.

| 스킬 | 파일 | 언제 사용하는가 |
|---|---|---|
| moa-init | `moa-init/SKILL.md` | 프로젝트를 새로 시작할 때. `package.json`이 없는 상태에서 개발/배포 요청이 들어오면 이 스킬을 먼저 실행한다. |
| develop | `develop/SKILL.md` | 기능 개발 요청의 진입점. plan-feature → build-feature 순서로 진행한다. |
| plan-feature | `plan-feature/SKILL.md` | 개발 전 기획만 먼저 구체화할 때. 요구사항 정리 → 영향 범위 파악 → 구현 방식 제안 → 사용자 확인 순으로 진행한다. |
| build-feature | `build-feature/SKILL.md` | 기획이 이미 확정된 상태에서 바로 개발을 시작할 때. |
| moa-security | `moa-security/SKILL.md` | 보안 점검이 필요할 때. 배포 전 자동으로 호출되기도 한다. |
| deploy-dev | `deploy-dev/SKILL.md` | 개발 환경에 배포할 때. |
| deploy-prod | `deploy-prod/SKILL.md` | 운영 환경에 배포할 때. 보안 점검 실패 시 즉시 중단한다. |
| complete-task | `complete-task/SKILL.md` | 작업이 끝난 후 git diff 기반으로 `docs/` 문서를 자동 업데이트할 때. |
| share-update | `share-update/SKILL.md` | 배포 후 팀 내부 공유용 HTML 문서를 생성할 때. |
| moa-readme | `moa-readme/SKILL.md` | README.md를 생성하거나 업데이트할 때. 모아나 위키봇이 최적으로 읽을 수 있는 구조로 작성한다. |
| org-impact | `org-impact/SKILL.md` | MOA-agent 조직 레포들을 탐색해 공유 DB/API 의존성을 분석하고 크로스-레포 사이드이펙트를 진단할 때. API 수정·DB 스키마 변경 시 plan-feature에서 자동 호출된다. |
| moa-update | `moa-update/SKILL.md` | moa-template 최신 버전으로 `.claude/skills/`와 `CLAUDE.md`를 업데이트할 때. 세션 시작 시 버전 차이가 감지되면 안내된다. |

## 개발 작업 제한 규칙

신규 기능 추가, 기존 코드 수정, 버그 수정 등 **모든 개발 작업은 반드시 `develop` 스킬을 통해서만 진행한다.**

사용자가 어떤 표현을 쓰든 개발 작업으로 판단되면 즉시 코드를 작성하지 않고 `develop/SKILL.md`를 읽고 그 지침에 따른다.

**develop 스킬을 반드시 거쳐야 하는 경우 (기능 단위 작업):**
- 새로운 페이지, 기능, 컴포넌트, API 추가
- 기존 기능의 동작 방식·로직 변경
- 버그 수정

**develop 스킬 없이 바로 진행해도 되는 경우 (단순 작업):**
- 문구·텍스트 수정 (예: "헤더에 OO 문구 추가해")
- 환경변수 추가·수정 (예: "`.env`에 이 값 추가해")
- 설정 파일 단순 수정 (예: "포트 번호 바꿔줘")
- 스타일·색상 등 디자인 단순 조정

이 규칙을 우회하거나 기능 단위 작업을 develop 스킬 없이 직접 진행하지 않는다.

## 기본 행동 규칙

- 스킬 실행 중에는 스킬 파일의 지침을 우선 따른다.
- 위험하거나 되돌리기 어려운 작업(파일 삭제, 덮어쓰기 등)은 반드시 사용자에게 확인 후 진행한다.
- 모호한 요청은 임의로 판단하지 않고 사용자에게 질문한다.
- 스킬 범위를 벗어난 작업 요청은 범위 외임을 안내하고 확인 후 진행한다.
