# Vercel 인프라 연동

배포 채널로 Vercel을 선택한 경우, 파일 생성 완료 후 아래 순서대로 Claude가 직접 실행한다.

## 순서

### 1. gh CLI 확인 및 인증

`gh` 설치 여부와 인증 상태를 먼저 확인한다.

```bash
gh auth status
```

- 미설치 시: `arch -arm64 brew install gh` 실행 후 아래 인증 안내로 이동
- 인증 안 된 경우: 아래 안내 출력 후 사용자 응답 대기

```
GitHub 인증이 필요해요. 아래 명령을 실행해서 로그인해주세요:

  ! gh auth login

완료되면 "계속해줘"라고 말씀해주세요.
```

인증 확인 후 다음 단계로 이동한다.

### 2. GitHub 레포 설정

`AskUserQuestion` 툴로 아래 질문을 한다.

```
header: "GitHub 레포"
options:
  - label: "새로 생성", description: "새 GitHub 레포를 만들고 연결"
  - label: "기존 연결", description: "이미 있는 레포에 연결"
```

**새로 생성 선택 시**

레포 공개 범위를 추가로 묻는다.
```
header: "레포 공개 범위"
options:
  - label: "Private"
  - label: "Public"
```

아래 명령을 실행한다. 레포 이름은 L1 프로젝트 이름을 kebab-case로 변환한다.
GitHub 조직은 `MOA-Agent`로 고정한다.
```bash
git init
git add .
git commit -m "chore: initial setup"
gh repo create MOA-Agent/{레포-이름} --{private|public} --source=. --remote=origin --push
gh repo edit MOA-Agent/{레포-이름} --add-topic moa-product
```

**기존 연결 선택 시**

레포 URL을 입력받은 후 아래 명령을 실행한다.
```bash
git init
git add .
git commit -m "chore: initial setup"
git remote add origin {레포-URL}
git push -u origin main
gh repo edit --add-topic moa-product
```

### 3. Vercel 프로젝트 연결

먼저 올바른 계정으로 로그인되어 있는지 확인한다.
```bash
vercel whoami
```

출력이 `admin-19706138s-projects`가 아닌 경우, 잘못된 계정이다. 아래 안내를 출력하고 사용자 응답을 기다린다.

```
Vercel 계정이 잘못 연결되어 있어요. admin@mile.im 계정으로 다시 로그인해주세요:

  ! vercel logout
  ! vercel login

완료되면 "계속해줘"라고 말씀해주세요.
```

사용자가 완료를 알리면 `vercel whoami`부터 다시 확인 후 진행한다.

올바른 계정 확인 후 아래 명령을 실행한다.
```bash
vercel link --scope admin-19706138s-projects --yes
```

> 팀 계정으로 전환 시: 아래 "팀 계정 전환 시 변경사항" 섹션 참고

### 4. 완료 후 안내 출력

```
✅ Vercel 연동 완료!

환경변수는 아직 설정되지 않았어요.
Vercel 대시보드 → 프로젝트 → Settings → Environment Variables 에서 설정해주세요.
필요한 환경변수 목록은 `.env.example`을 참고하세요.
```

---

## 팀 계정 전환 시 변경사항

아래 명령의 `{팀-슬러그}` 부분을 MOA Vercel 팀 슬러그로 교체한다.
(Vercel 대시보드 URL: `vercel.com/{팀-슬러그}`)

```bash
# 현재 (개인)
vercel link --scope admin-19706138s-projects

# 변경 후 (팀)
vercel link --scope {팀-슬러그}
```

---

## 실패 처리

### `gh` CLI 미설치

`brew install gh`를 실행한다. 완료 후 아래를 실행한다.

```bash
gh auth login
```

`gh auth login`은 대화형 명령이므로 사용자에게 직접 실행하도록 안내한다.

```
GitHub 인증이 필요해요. 아래 명령을 실행해서 로그인해주세요:

  gh auth login

완료되면 "계속해줘"라고 말씀해주세요.
```

사용자가 완료를 알리면 GitHub 레포 생성 단계부터 재개한다.

### `vercel` CLI 미설치

`npm i -g vercel`을 실행한다. 완료 후 사용자에게 안내한다.

```
Vercel 인증이 필요해요. 아래 명령을 실행해서 로그인해주세요:

  vercel login

완료되면 "계속해줘"라고 말씀해주세요.
```

사용자가 완료를 알리면 Vercel 프로젝트 연결 단계부터 재개한다.

### GitHub 인증 안 된 경우

사용자에게 안내한다.

```
GitHub 인증이 필요해요. 아래 명령을 실행해서 로그인해주세요:

  gh auth login

완료되면 "계속해줘"라고 말씀해주세요.
```

### Vercel 인증 안 된 경우

사용자에게 안내한다.

```
Vercel 인증이 필요해요. 아래 명령을 실행해서 로그인해주세요:

  vercel login

완료되면 "계속해줘"라고 말씀해주세요.
```

### 연동 실패

오류 메시지를 출력하고 수동 연동 방법을 안내한다.
