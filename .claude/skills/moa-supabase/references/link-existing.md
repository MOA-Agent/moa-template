# 기존 Supabase 프로젝트 연결

## 순서

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

"Product" 조직이 확인되면 다음 단계로 진행한다.

### 4. project-ref 입력 받기

> Supabase Project ID를 입력해주세요.
>
> **Project ID란?** Supabase가 각 프로젝트에 부여하는 고유 ID입니다. (예: `abcdefghijklmnop`)
> 아래 경로에서 확인할 수 있어요:
> Supabase 대시보드 → 해당 프로젝트 선택 → Settings → General → **Project ID**

### 5. Supabase 연결

```bash
supabase link --project-ref {입력받은-project-ref}
```

### 6. .env 파일 업데이트 안내

연결 완료 후 아래 안내 메시지를 출력한다.

```
✅ Supabase 연결 완료!

.env 파일에 아래 값을 채워주세요.
값은 Supabase 대시보드 → Settings → API에서 확인할 수 있어요.

NEXT_PUBLIC_SUPABASE_URL=https://{project-ref}.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```
