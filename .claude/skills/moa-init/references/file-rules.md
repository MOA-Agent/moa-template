# 파일 생성 규칙

## 항상 생성하는 파일 (선택과 무관)

- `package.json`
- `tsconfig.json`
- `next.config.ts`
- `tailwind.config.ts`
- `postcss.config.mjs`
- `.gitignore`
- `app/layout.tsx`
- `app/page.tsx`
- `app/globals.css`

---

## 조건별 생성 파일

### 배포 채널: Vercel
- `vercel.json`
  - 배포 환경이 개발+운영인 경우: `git.deploymentEnabled`에 main, develop 브랜치 모두 설정

### 배포 채널: EC2
- `Dockerfile`
- `nginx.conf`
- `deploy.sh`

### 배포 환경: 운영만
- `.env.example`

### 배포 환경: 개발+운영
- `.env.development.example`
- `.env.production.example`

### DB: Supabase
→ `templates/supabase.md` 참고
- `lib/supabase.ts`
- `supabase/config.toml`
- `supabase/migrations/.gitkeep`
- `.env.example`에 Supabase 환경변수 항목 추가 (값은 TODO로 표시)
- 실제 Supabase 프로젝트 연결은 init에서 하지 않는다. 완료 후 안내 메시지 출력:
  "Supabase 프로젝트 연결은 `/moa-supabase` 스킬로 따로 진행해주세요."

### DB: RDS
→ `templates/rds.md` 참고
- `lib/db.ts`
- `prisma/schema.prisma`
- `package.json`에 prisma 의존성 추가
- `.env.example`에 DATABASE_URL 항목 추가

### 관리자 인증: 예
→ `templates/auth.md` 참고
- `app/admin/layout.tsx`
- `app/admin/page.tsx`
- `middleware.ts`

### 사용자 인증: 예
→ `templates/auth.md` 참고
- `app/(auth)/login/page.tsx`
- `app/(auth)/signup/page.tsx`
- `lib/auth.ts`
- `middleware.ts`
- 관리자 인증도 선택된 경우 middleware.ts는 하나로 통합

### 외부 API 연동: 예
→ `templates/api.md` 참고
- `lib/api/client.ts`
- `lib/api/types.ts`
- `.env.example`에 EXTERNAL_API_KEY 항목 추가

### MOA 디자인 시스템: 예
→ `templates/design.md` 참고
- shadcn/ui, lucide-react 설치
- `tailwind.config.ts` — MOA 브랜드 컬러 토큰 포함 (기본 파일 대체)
- `app/globals.css` — CSS 변수 세팅 포함 (기본 파일 대체)

### MOA 디자인 시스템: 아니오 / 미정
- 아무것도 하지 않는다.

---

## 문서 파일 생성 규칙

코드/설정 파일 생성 후 아래 문서를 생성한다. L1~L2 응답으로 내용을 채운다.
→ `templates/docs.md` 참고

- `README.md`
- `docs/project-overview.md`
- `docs/infra.md`
- `docs/deploy.md`
- `docs/change-log.md`

---

## .env 작성 규칙

고정 항목은 반드시 포함하고, 나머지는 프로젝트 정보(설명, 목적, 기능 목록)를 바탕으로 필요한 환경변수를 판단해서 추가한다.

**고정 항목**

| 선택 항목 | 환경변수 |
|---|---|
| Supabase | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` |
| RDS | `DATABASE_URL` |

**판단해서 추가**

프로젝트 기능에 따라 필요하다고 판단되면 직접 추가한다. 고정 항목 외에도 무엇이든 포함 가능.

예시:
- 앱 URL이 필요한 경우 (OG 태그, 절대 URL, 서버→서버 fetch 등): `NEXT_PUBLIC_APP_URL`
- 외부 서비스 연동: `NOTION_API_KEY`, `SLACK_BOT_TOKEN`, `KAKAO_API_KEY` 등 서비스명 기준으로
- 인증 시크릿: `NEXTAUTH_SECRET`, `JWT_SECRET` 등
- 기타 프로젝트에 필요한 값들
