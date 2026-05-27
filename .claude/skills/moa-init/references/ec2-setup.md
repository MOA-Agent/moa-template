# EC2 인프라 연동

배포 채널로 EC2를 선택한 경우, 파일 생성 완료 후 아래 순서대로 Claude가 직접 실행한다.

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

### 3. GitHub Actions 워크플로우 생성

배포 환경에 따라 아래 파일을 생성한다.

#### 운영만인 경우: `.github/workflows/deploy-prod.yml`

```yaml
name: Deploy to EC2 (Production)

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to EC2
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ${{ secrets.EC2_USER }}
          key: ${{ secrets.EC2_SSH_KEY }}
          script: |
            cd ~/app
            git pull origin main
            npm ci
            npm run build
            pm2 restart app || pm2 start npm --name app -- start
```

#### 개발+운영인 경우: 두 파일 모두 생성

`.github/workflows/deploy-dev.yml`
```yaml
name: Deploy to EC2 (Dev)

on:
  push:
    branches: [develop]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to EC2 (Dev)
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.EC2_DEV_HOST }}
          username: ${{ secrets.EC2_DEV_USER }}
          key: ${{ secrets.EC2_DEV_SSH_KEY }}
          script: |
            cd ~/app
            git pull origin develop
            npm ci
            npm run build
            pm2 restart app-dev || pm2 start npm --name app-dev -- start
```

`.github/workflows/deploy-prod.yml`
```yaml
name: Deploy to EC2 (Production)

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to EC2 (Production)
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ${{ secrets.EC2_USER }}
          key: ${{ secrets.EC2_SSH_KEY }}
          script: |
            cd ~/app
            git pull origin main
            npm ci
            npm run build
            pm2 restart app || pm2 start npm --name app -- start
```

### 4. GitHub Secrets 설정 안내

워크플로우 파일 생성 후 아래 안내를 출력하고 사용자가 완료할 때까지 대기한다.

---

**운영만인 경우:**
```
GitHub Secrets 설정이 필요해요.
GitHub 레포 → Settings → Secrets and variables → Actions → New repository secret

추가할 항목:
  - EC2_HOST: EC2 퍼블릭 IP 또는 도메인
  - EC2_USER: SSH 접속 유저명 (예: ubuntu, ec2-user)
  - EC2_SSH_KEY: SSH 프라이빗 키 전체 내용 (-----BEGIN RSA PRIVATE KEY----- 포함)

완료되면 "계속해줘"라고 말씀해주세요.
```

**개발+운영인 경우:**
```
GitHub Secrets 설정이 필요해요.
GitHub 레포 → Settings → Secrets and variables → Actions → New repository secret

운영 환경:
  - EC2_HOST
  - EC2_USER
  - EC2_SSH_KEY

개발 환경:
  - EC2_DEV_HOST
  - EC2_DEV_USER
  - EC2_DEV_SSH_KEY

완료되면 "계속해줘"라고 말씀해주세요.
```

---

### 5. 완료 안내

```
✅ EC2 배포 파이프라인 설정 완료!

이제 브랜치에 push하면 GitHub Actions가 자동으로 EC2에 배포합니다.
- main 브랜치 push → 운영 배포
- develop 브랜치 push → 개발 배포 (개발+운영 환경인 경우)

단, EC2 서버에 Node.js, npm, PM2가 설치되어 있어야 합니다.
미설치 시 서버에서 아래를 실행하세요:
  curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
  sudo apt-get install -y nodejs
  sudo npm install -g pm2
```

---

## 실패 처리

### `gh` CLI 미설치

```bash
arch -arm64 brew install gh
```

완료 후 인증 안내로 이동한다.

### GitHub 인증 안 된 경우

```
GitHub 인증이 필요해요. 아래 명령을 실행해서 로그인해주세요:

  ! gh auth login

완료되면 "계속해줘"라고 말씀해주세요.
```
