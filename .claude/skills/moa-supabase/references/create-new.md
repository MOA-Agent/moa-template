# 신규 Supabase 프로젝트 생성 및 연결

## 질문 흐름

아래 질문을 하나씩 순서대로 한다.

**Q1.** Supabase 프로젝트를 어떻게 구성할 건가요?
> 선택지:
> - **새 프로젝트 생성** — 이 서비스 전용 프로젝트
> - **기존 프로젝트에 추가** — 다른 서비스와 같은 프로젝트 공유 → `link-existing.md` 흐름으로 전환

**Q2.** 개발/운영 DB를 분리할 건가요?
> 선택지:
> - **분리** — 개발용, 운영용 프로젝트 별도 생성
> - **통합** — 하나의 프로젝트 사용

## 프로젝트 생성

### 1. Supabase CLI 확인

```bash
supabase --version
```

미설치 시 설치 후 진행한다.
```bash
brew install supabase/tap/supabase
```

### 2. Supabase 인증 확인

```bash
supabase projects list 2>&1
```

인증이 안 된 경우 아래 안내 후 대기한다.
```
Supabase 로그인이 필요해요. 아래 명령을 실행해주세요:

  ! supabase login

완료되면 "계속해줘"라고 말씀해주세요.
```

### 3. 조직 ID 확인

```bash
supabase orgs list
```

조직이 여러 개면 사용할 조직을 사용자에게 선택받는다.

### 4. DB 비밀번호 입력

아래 안내를 출력하고 사용자에게 입력받는다.

```
DB 비밀번호를 입력해주세요.
(영문 + 숫자 + 특수문자 조합, 16자 이상 권장)
```

입력받은 비밀번호는 `.env.local`에 저장한다.
```
SUPABASE_DB_PASSWORD={입력받은 비밀번호}
```

### 5. 프로젝트 생성

**통합(운영만)인 경우:**
```bash
supabase projects create {프로젝트-이름} \
  --org-id {org-id} \
  --db-password {입력받은-비밀번호} \
  --region ap-northeast-2
```

**분리(개발+운영)인 경우:** 개발, 운영 순서로 두 번 실행한다.
```bash
# 개발
supabase projects create {프로젝트-이름}-dev \
  --org-id {org-id} \
  --db-password {입력받은-비밀번호} \
  --region ap-northeast-2

# 운영
supabase projects create {프로젝트-이름} \
  --org-id {org-id} \
  --db-password {입력받은-비밀번호} \
  --region ap-northeast-2
```

생성 완료 후 반환된 `project-ref`를 저장해둔다.

### 6. 프로젝트 연결

```bash
supabase link --project-ref {project-ref}
```

### 7. .env 파일 업데이트 안내

```
✅ Supabase 프로젝트 생성 및 연결 완료!

.env 파일에 아래 값을 채워주세요.
값은 Supabase 대시보드 → Settings → API에서 확인할 수 있어요.

NEXT_PUBLIC_SUPABASE_URL=https://{project-ref}.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```
