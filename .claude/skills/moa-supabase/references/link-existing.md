# 기존 Supabase 프로젝트 연결

## 순서

### 1. project-ref 입력 받기

> Supabase Project ID를 입력해주세요.
>
> **Project ID란?** Supabase가 각 프로젝트에 부여하는 고유 ID입니다. (예: `abcdefghijklmnop`)
> 아래 경로에서 확인할 수 있어요:
> Supabase 대시보드 → 해당 프로젝트 선택 → Settings → General → **Project ID**

### 2. Supabase 연결

```bash
supabase link --project-ref {입력받은-project-ref}
```

### 3. .env 파일 업데이트 안내

연결 완료 후 아래 안내 메시지를 출력한다.

```
✅ Supabase 연결 완료!

.env 파일에 아래 값을 채워주세요.
값은 Supabase 대시보드 → Settings → API에서 확인할 수 있어요.

NEXT_PUBLIC_SUPABASE_URL=https://{project-ref}.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```
