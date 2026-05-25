# MOA Template 소개

**MOA Template**은 MOA 팀의 Claude 기반 개발 자동화 플랫폼입니다. 신규 프로젝트 생성부터 배포, 문서 관리, 팀 공유까지 전체 개발 생명주기를 자동화하는 14개의 Claude 스킬을 제공합니다.

**현재 버전**: v1.0.28

---

## 왜 만들었나

- 프로젝트마다 반복되는 초기 세팅, 문서 작성, 배포 프로세스 자동화
- 코드 컨벤션, 디자인 시스템, 보안 기준을 Claude가 자동으로 준수
- 템플릿 업데이트가 모든 프로젝트에 자동으로 전파

---

## 어떻게 동작하나

### 세션 시작 시 자동 실행

새 대화가 시작되면 Claude가 자동으로:
1. 로컬 템플릿 버전 확인 (`.claude/VERSION`)
2. GitHub `MOA-Agent/moa-template`에서 최신 버전 조회
3. 버전 차이가 있으면 업데이트 안내 (`/moa-update`로 즉시 적용)

### 프로젝트 미초기화 감지

`package.json`이 없는 상태에서 개발 요청이 들어오면 `moa-init`을 먼저 자동 실행합니다.

---

## 14개 스킬 요약

### 초기화

| 스킬 | 역할 |
|---|---|
| `moa-init` | 대화형 질문(L1→L2→L3)으로 프로젝트 구조, 파일, 문서 일괄 생성 |
| `moa-supabase` | Supabase 프로젝트 생성·연결, RLS 자동 설정 |

### 개발

| 스킬 | 역할 |
|---|---|
| `develop` | 기능 개발 진입점. plan → build 순서 강제 |
| `plan-feature` | 요구사항 정리 → 영향 범위 파악 → 구현 방식 제안 → 사용자 확인 |
| `build-feature` | 컨벤션·디자인 시스템 준수하며 코드 작성 |
| `org-impact` | GitHub 조직 레포 전체에서 기존 자산 발견 및 크로스-레포 영향 분석 |

### 배포

| 스킬 | 역할 |
|---|---|
| `moa-security` | 7가지 보안 항목 자동 점검 (배포 전 필수) |
| `deploy-dev` | 개발 환경 배포 (보안 점검 → push → 문서 업데이트) |
| `deploy-prod` | 운영 환경 배포 (dev보다 엄격, Vercel env 동기화 포함) |

### 배포 후

| 스킬 | 역할 |
|---|---|
| `complete-task` | git diff 기반 문서 자동 업데이트 + README 갱신 |
| `share-update` | 유형별 Slack Block Kit 메시지 + PDF 문서 생성 및 공유 |

### 디자인 & 문서

| 스킬 | 역할 |
|---|---|
| `moa-design` | MOA 색상 토큰, Pretendard 타입 스케일, 컴포넌트 레퍼런스 |
| `moa-readme` | 모아나 위키봇이 읽을 수 있는 구조로 README 생성 |
| `moa-update` | 최신 템플릿 버전으로 스킬·CLAUDE.md 즉시 업데이트 |

---

## 주요 스킬 동작 방식

### moa-init

대화형 3단계 질문으로 프로젝트 전체를 구성합니다.

- **L1 (자유 입력)**: 프로젝트 설명, 이름, 목적, 주요 기능
- **L2 (선택지)**: 배포 채널(Vercel/EC2), 배포 환경(운영/개발+운영), DB, 인증, 외부 API
- **L3 (선택지)**: MOA 디자인 시스템 적용 여부

선택 조합에 따라 자동 생성:
- Next.js 기본 구조 (`app/`, `lib/`, `middleware.ts` 등)
- Vercel 또는 EC2 GitHub Actions 배포 설정
- Supabase / RDS / 인증 / 외부 API 관련 파일
- `.env.example`, `README.md`, `docs/` 문서 5종

### deploy-prod

운영 배포 시 아래 순서로 진행합니다.

1. main 브랜치 여부, 미커밋 변경사항, 환경변수 누락, 메타 정보 확인
2. 보안 점검 (실패 항목 있으면 즉시 중단)
3. Vercel 환경변수 동기화 여부 확인 (`.env.production` → Vercel)
4. `git push origin main`
5. 문서 자동 업데이트
6. 팀 공유 여부 확인 → share-update 연결

### share-update

배포 후 팀 공유 자료를 자동 생성합니다.

1. 변경 유형 분류: 🆕 신규 기능 / 🔄 기능 변경 / 🛠 오류 수정
2. 순차 질문 4개 (한 번에 하나씩)
3. HTML 문서 생성 (`docs/share/`)
4. PDF 변환 (puppeteer-core + 시스템 Chrome)
5. Slack Block Kit 메시지 발송 + PDF를 해당 메시지 스레드로 업로드

### org-impact

기능 추가·API 변경 시 plan-feature에서 자동 호출됩니다.

- **신규 추가**: `gh search code`로 조직 내 유사 자산 먼저 검색
- **API/DB 변경**: 영향받는 레포를 HIGH / MEDIUM / LOW / NONE으로 분류
- MOA 조직 대상 레포: `moa-next`, `moa-backoffice`, `moa-nest`, `moa-db`, `moa-lms`, `moana` 등

---

## 외부 시스템 연동

| 시스템 | 용도 |
|---|---|
| **MOA Slack API** (`moa-api-ten.vercel.app`) | 배포 알림 발송, PDF 업로드. 봇 토큰 중앙 관리 |
| **GitHub (gh CLI)** | 조직 레포 코드 검색, 최신 템플릿 버전 조회 |
| **Vercel CLI** | 환경변수 동기화, 배포 |
| **Supabase CLI** | 프로젝트 생성·연결 |

---

## 전체 흐름

```
moa-init
  → develop → plan-feature → (org-impact) → build-feature
    → deploy-dev or deploy-prod
      → moa-security
      → git push
      → complete-task → moa-readme
      → share-update (운영 배포 시 선택)
```
