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
Supabase 로그인이 필요해요. admin@mile.im 계정으로 로그인해주세요:

  ! supabase login

완료되면 "계속해줘"라고 말씀해주세요.
```

사용자가 완료를 알리면 인증 확인부터 다시 진행한다.

### 3. 계정 및 조직 확인

```bash
supabase orgs list
```

출력 결과에 **"Product"** 조직이 없으면 잘못된 계정이다. 아래 안내를 출력하고 사용자 응답을 기다린다.

```
Supabase 계정이 잘못 연결되어 있어요. admin@mile.im 계정으로 다시 로그인해주세요:

  ! supabase logout
  ! supabase login

완료되면 "계속해줘"라고 말씀해주세요.
```

사용자가 완료를 알리면 `supabase orgs list`부터 다시 확인 후 진행한다.

"Product" 조직이 확인되면 해당 조직의 `org-id`를 자동으로 사용한다. 사용자에게 조직 선택을 묻지 않는다.

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
